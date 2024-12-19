<?php

namespace WeDevs\PM\My_Task\Controllers;

use WP_REST_Request;
use League\Fractal;
use League\Fractal\Resource\Item as Item;
use League\Fractal\Resource\Collection as Collection;
use League\Fractal\Pagination\IlluminatePaginatorAdapter;
use WeDevs\PM\Common\Traits\Transformer_Manager;
use WeDevs\PM\Common\Traits\Request_Filter;
use WeDevs\PM\User\Models\User;
use WeDevs\PM\User\Transformers\User_Transformer;
use Illuminate\Support\Facades\Schema;
use Illuminate\Pagination\Paginator;
use WeDevs\PM\Calendar\Transformers\Calendar_Transformer;
use WeDevs\PM\User\Models\User_Role;
use WeDevs\PM\Activity\Transformers\Activity_Transformer;


class MyTask_Controller {
    use Transformer_Manager, Request_Filter;

    public function user_tasks_by_type ( WP_REST_Request $request ) {
        $id       = intval( $request->get_param( 'id' ) );
        $taskType = sanitize_text_field( $request->get_param( 'task_type' ) );
        
        $today = date( 'Y-m-d', strtotime( current_time( 'mysql' ) ) );

        $user     = User::with( [
            'projects' => function ( $query ) use ( $id, $taskType, $today ) {
                $query->with( [
                    'tasks' => function ( $task )  use ( $id, $taskType, $today ) {
                        $task = $task->with( ['assignees', 'metas'] )
                        ->parent()
                        ->whereHas( 'assignees', function ( $assignees )  use ( $id ) {
                            $assignees->where( 'assigned_to', $id );
                        } );

                        $task->whereHas('boards',function( $query ) {
                            $query->where('status', '1');
                        });

                        /* get current task */
                        if ( $taskType == 'current' ) {
                            $task = $task->where( function( $q ) use ( $today ) {
                                $q->where( 'due_date', '>=', $today )
                                    ->orWhereNull( 'due_date' );
                            });
                        }
                         /* get complete task*/
                        if ( $taskType == 'complete' ) {
                            $task = $task->where( 'status', 1);
                        } else {
                            $task = $task->where( 'status', '!=', 1);
                        }

                        /* get outstanding task */
                        if ( $taskType == 'outstanding' ) {
                            $task = $task->where( 'due_date', '<', $today );
                        }

                        if ( ! pm_has_manage_capability() ) {
                            /*exclude private tasks*/
                            $task = $task->doesntHave( 'metas', 'and', function ($query) {
                                    $query->where( 'meta_key', '=', 'privacy' )
                                        ->where( 'meta_value', '!=', '0' );
                                });
                            /*exclude task private list*/
                            $task = $task->doesntHave( 'task_lists.metas', 'and', function ($query) {
                                $query->where( 'meta_key', '=', 'privacy' )
                                        ->where( 'meta_value', '!=', '0' );
                                });
                        }
                    }
                ])
                ->whereHas('tasks', function ( $task )  use ( $id, $taskType, $today ) {
                    $task = $task->parent()
                    ->whereHas( 'assignees', function ( $assignees )  use ( $id ) {
                        $assignees->where( 'assigned_to', $id );
                    } );
                    $task->whereHas('boards',function( $query ) {
                        $query->where('status', '1');
                    });

                    /* get current task */
                    if ( $taskType == 'current' ) {
                        $task = $task->where( function( $q ) use ( $today ) {
                            $q->where( 'due_date', '>=', $today )
                                ->orWhereNull( 'due_date' );
                        });
                    }
                     /* get complete task*/
                    if ( $taskType == 'complete' ) {
                        $task = $task->where( 'status', 1);
                    } else {
                        $task = $task->where( 'status', '!=', 1);
                    }
                    /* get outstanding task */
                    if ( $taskType == 'outstanding' ) {
                        $task = $task->where( 'due_date', '<', $today );
                    }
                    if ( ! pm_has_manage_capability() ) {
                        /*exclude private tasks*/
                        $task = $task->doesntHave( 'metas', 'and', function ($query) {
                                $query->where( 'meta_key', '=', 'privacy' )
                                    ->where( 'meta_value', '!=', '0' );
                            });
                        /*exclude task private list*/
                        $task = $task->doesntHave( 'task_lists.metas', 'and', function ($query) {
                            $query->where( 'meta_key', '=', 'privacy' )
                                    ->where( 'meta_value', '!=', '0' );
                            });
                    }
                } );
            }
        ] )->find( $id );

        $resource = new Item( $user, new User_Transformer );
        $resource = $this->get_response( $resource );

        return $resource;
    }

    public function user_calender_tasks( WP_REST_Request $request ) {
        global $wpdb;

        // Get calender start date & handle sql injection.
        $start = $request->get_param( 'start' );

        try {
            $date  = new \DateTimeImmutable( $start );
            $start = $date->format( 'Y-m-d' );
        } catch ( \Exception $exception ) {
            return new \WP_Error( 400, esc_html__( 'Starting date is not valid. Please re-check your request.', 'wedevs-project-manager' ) );
        }

        $user_id       = get_current_user_id();
        $tb_tasks      = pm_tb_prefix() . 'pm_tasks';
        $tb_boards     = pm_tb_prefix() . 'pm_boards';
        $tb_boardables = pm_tb_prefix() . 'pm_boardables';
        $tb_assignees  = pm_tb_prefix() . 'pm_assignees';
        $tb_meta       = pm_tb_prefix() . 'pm_meta';
        $tb_projects   = pm_tb_prefix() . 'pm_projects';
        $tb_settings   = pm_tb_prefix() . 'pm_settings';

        $tb_users     = $wpdb->base_prefix . 'users';
        $tb_user_meta = $wpdb->base_prefix . 'usermeta';

        $tb_role_user    = pm_tb_prefix() . 'pm_role_user';
        $current_user_id = get_current_user_id();

        $user_id     = empty( $user_id ) ? absint( $current_user_id ) : absint( $user_id );
        $project_ids = $this->get_current_user_project_ids( $user_id );

        $get_boards = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT id FROM $tb_boards WHERE type='%s' and status=1", 'task_list'
            )
        );

        $boards_id  = wp_list_pluck( $get_boards, 'id' );
        $boards_id  = implode( ',', $boards_id );

        if ( empty( $project_ids ) ) {
            $where_projec_ids = "AND pj.id IN (0)";;
        } else {
            $project_ids = implode( ',', $project_ids );
            $where_projec_ids = "AND pj.id IN ( $project_ids )";
        }

        $where_users = " AND asin.assigned_to IN ( $user_id )";

        if ( is_multisite() ) {
            $meta_key = pm_user_meta_key();

            $event_query = "SELECT tsk.*,
                GROUP_CONCAT(
                    DISTINCT
                    CONCAT(
                        '{',
                            '\"', 'meta_key', '\"', ':' , '\"', IFNULL(tskmt.meta_key, '') , '\"', ',',
                            '\"', 'meta_value', '\"', ':' , '\"', IFNULL(tskmt.meta_value, '') , '\"'
                        ,'}'
                    ) SEPARATOR '|'
                ) as task_meta,

                GROUP_CONCAT(
                    DISTINCT
                    CONCAT(
                        '{',
                            '\"', 'meta_key', '\"', ':' , '\"', IFNULL(boablmt.meta_key, '') , '\"', ',',
                            '\"', 'meta_value', '\"', ':' , '\"', IFNULL(boablmt.meta_value, '') , '\"'
                        ,'}'
                    ) SEPARATOR '|'
                ) as list_meta,

                GROUP_CONCAT(
                    DISTINCT
                    CONCAT(
                        '{',
                            '\"', 'assigned_to', '\"', ':' , '\"', IFNULL(asins.assigned_to, '') , '\"'
                        ,'}'
                    ) SEPARATOR '|'
                ) as assignees,

                GROUP_CONCAT(
                    DISTINCT
                    CONCAT(
                        IFNULL(sett.value, '')
                    ) SEPARATOR '|'
                ) as settings,

                GROUP_CONCAT(
                    DISTINCT
                    CONCAT(
                        '{',
                            '\"', 'title', '\"', ':' , '\"', IFNULL(pj.title, '') , '\"'
                        ,'}'
                    ) SEPARATOR '|'
                ) as project,

                GROUP_CONCAT(
                    DISTINCT
                    CONCAT(
                        '{',
                            '\"', 'board_id', '\"', ':' , '\"', IFNULL(boabl.board_id, '') , '\"'
                        ,'}'
                    ) SEPARATOR '|'
                ) as boardable,

                GROUP_CONCAT(
                    DISTINCT
                    CONCAT(
                        '{',
                            '\"', 'id', '\"', ':' , '\"', IFNULL(usr.ID, '') , '\"', ',',
                            '\"', 'display_name', '\"', ':' , '\"', IFNULL(usr.display_name, '') , '\"'
                        ,'}'
                    ) SEPARATOR '|'
                ) as users

                FROM $tb_tasks as tsk

                LEFT JOIN $tb_boardables as boabl
                    ON (tsk.id=boabl.boardable_id AND boabl.board_type='task_list' AND boabl.boardable_type='task')

                LEFT JOIN $tb_boards as board
                    ON (boabl.board_id=board.id AND board.type='task_list')

                LEFT JOIN $tb_projects as pj ON (tsk.project_id=pj.id)

                -- For getting multipule assignee users in individual task
                LEFT JOIN $tb_assignees as asins ON tsk.id=asins.task_id

                -- For filter user
                LEFT JOIN $tb_assignees as asin ON tsk.id=asin.task_id

                -- For getting all users information
                LEFT JOIN $tb_users as usr ON asins.assigned_to=usr.ID
                LEFT JOIN $tb_user_meta as umeta ON umeta.user_id = usr.ID

                LEFT JOIN $tb_meta as tskmt
                    ON (tsk.id=tskmt.entity_id AND tskmt.entity_type='task')

                LEFT JOIN $tb_meta as boablmt
                    ON ( boabl.board_id=boablmt.entity_id AND boablmt.entity_type='task_list')

                LEFT JOIN $tb_settings as sett ON pj.id=sett.project_id AND sett.key='capabilities'

                WHERE 1=1
                    AND umeta.meta_key='$meta_key'
                    AND
                    (
                        (tsk.due_date >= '$start')
                            or
                        (tsk.due_date is null and tsk.start_at >= '$start')
                            or
                        (tsk.start_at is null and tsk.due_date >= '$start' )
                            or
                        ((tsk.start_at is null AND tsk.due_date is null) and tsk.created_at >= '$start')
                    )
                    AND
                    board.id IN ($boards_id)
                    $where_projec_ids

                    $where_users

                GROUP BY(tsk.id)";

        } else {

            $event_query = "SELECT tsk.*,
                GROUP_CONCAT(
                    DISTINCT
                    CONCAT(
                        '{',
                            '\"', 'meta_key', '\"', ':' , '\"', IFNULL(tskmt.meta_key, '') , '\"', ',',
                            '\"', 'meta_value', '\"', ':' , '\"', IFNULL(tskmt.meta_value, '') , '\"'
                        ,'}'
                    ) SEPARATOR '|'
                ) as task_meta,

                GROUP_CONCAT(
                    DISTINCT
                    CONCAT(
                        '{',
                            '\"', 'meta_key', '\"', ':' , '\"', IFNULL(boablmt.meta_key, '') , '\"', ',',
                            '\"', 'meta_value', '\"', ':' , '\"', IFNULL(boablmt.meta_value, '') , '\"'
                        ,'}'
                    ) SEPARATOR '|'
                ) as list_meta,

                GROUP_CONCAT(
                    DISTINCT
                    CONCAT(
                        '{',
                            '\"', 'assigned_to', '\"', ':' , '\"', IFNULL(asins.assigned_to, '') , '\"'
                        ,'}'
                    ) SEPARATOR '|'
                ) as assignees,

                GROUP_CONCAT(
                    DISTINCT
                    CONCAT(
                        IFNULL(sett.value, '')
                    ) SEPARATOR '|'
                ) as settings,

                GROUP_CONCAT(
                    DISTINCT
                    CONCAT(
                        '{',
                            '\"', 'title', '\"', ':' , '\"', IFNULL(pj.title, '') , '\"'
                        ,'}'
                    ) SEPARATOR '|'
                ) as project,

                GROUP_CONCAT(
                    DISTINCT
                    CONCAT(
                        '{',
                            '\"', 'board_id', '\"', ':' , '\"', IFNULL(boabl.board_id, '') , '\"'
                        ,'}'
                    ) SEPARATOR '|'
                ) as boardable,

                GROUP_CONCAT(
                    DISTINCT
                    CONCAT(
                        '{',
                            '\"', 'id', '\"', ':' , '\"', IFNULL(usr.ID, '') , '\"', ',',
                            '\"', 'display_name', '\"', ':' , '\"', IFNULL(usr.display_name, '') , '\"'
                        ,'}'
                    ) SEPARATOR '|'
                ) as users

                FROM $tb_tasks as tsk

                LEFT JOIN $tb_boardables as boabl
                    ON (tsk.id=boabl.boardable_id AND boabl.board_type='task_list' AND boabl.boardable_type='task')

                LEFT JOIN $tb_boards as board
                    ON (boabl.board_id=board.id AND board.type='task_list')

                LEFT JOIN $tb_projects as pj ON (tsk.project_id=pj.id)

                -- For getting multipule assignee users in individual task
                LEFT JOIN $tb_assignees as asins ON tsk.id=asins.task_id

                -- For filter user
                LEFT JOIN $tb_assignees as asin ON tsk.id=asin.task_id

                -- For getting all users information
                LEFT JOIN $tb_users as usr ON asins.assigned_to=usr.ID

                LEFT JOIN $tb_meta as tskmt
                    ON (tsk.id=tskmt.entity_id AND tskmt.entity_type='task')

                LEFT JOIN $tb_meta as boablmt
                    ON ( boabl.board_id=boablmt.entity_id AND boablmt.entity_type='task_list')

                LEFT JOIN $tb_settings as sett ON pj.id=sett.project_id AND sett.key='capabilities'

                WHERE 1=1
                    AND
                    (
                        (tsk.due_date >= '$start')
                            or
                        (tsk.due_date is null and tsk.start_at >= '$start')
                            or
                        (tsk.start_at is null and tsk.due_date >= '$start' )
                            or
                        ((tsk.start_at is null AND tsk.due_date is null) and tsk.created_at >= '$start')
                    )
                    AND
                    board.id IN ($boards_id)
                    $where_projec_ids

                    $where_users

                GROUP BY(tsk.id)";
        }

        $events     = $wpdb->get_results( $event_query );
        $user_roles = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT DISTINCT user_id, project_id, role_id FROM $tb_role_user WHERE user_id='%d'", $current_user_id
            )
        );

        $tasks = $this->Calendar_Transformer( $events, $user_roles );
        wp_send_json_success( $tasks );
    }

    public function Calendar_Transformer( $events, $user_roles ) {
        $current_user_id = get_current_user_id();
        $has_manage_cap  = pm_has_manage_capability();

        $roles = [];
        $tasks = [];

        foreach ( $user_roles as $user_role ) {
            $roles[ $user_role->project_id ][ $user_role->user_id ] = $user_role->role_id;
        }

        foreach ( $events as $event ) {
            $role = 0;

            if ( ! empty( $roles[ $event->project_id ][ $current_user_id ] ) ) {
                $role = $roles[ $event->project_id ][ $current_user_id ];
            }

            $event->list_id       = $this->get_list_id( $event->boardable );
            $event->settings      = $this->get_settings_value( $event->settings );
            $event->assignees     = $this->get_assignees_value( $event->assignees, $event->users );
            $event->task_privacy  = $this->get_privacy_meta_value( $event->task_meta );
            $event->list_privacy  = $this->get_privacy_meta_value( $event->list_meta );
            $event->project_title = $this->get_project_title( $event->project );


            if ( ! $this->has_view_permission(
                    $has_manage_cap,
                    $role,
                    $event->list_privacy,
                    $event->task_privacy,
                    $event->settings
                )
            ) {
                continue;
            }

            $tasks[] = array(
                'id'         => absint( $event->id ),
                'end'        => $this->get_end( $event ),
                'type'       => 'task',
                'title'      => $event->title,
                'start'      => $this->get_start( $event ),
                'status'     => $event->status ? 'complete' : 'incomplete',
                'assignees'  => $event->assignees,
                'project_id' => $event->project_id,
                'created_at' => format_date( $event->created_at ),
                'updated_at' => format_date( $event->updated_at ),
            );
        }

        return $tasks;
    }

    public function get_current_user_project_ids( $user_id, $project_id = false ) {
        global $wpdb;

        $tb_role_user = pm_tb_prefix() . 'pm_role_user';

        $project_ids = [];

        // IF empty project id
        $project_query = $wpdb->prepare( "SELECT DISTINCT project_id FROM $tb_role_user WHERE user_id='%d'", $user_id );

        $project_ids = $wpdb->get_results( $project_query );
        $project_ids = wp_list_pluck( $project_ids, 'project_id' );

        return $project_ids;
    }

    public function get_end( $event ) {

        if ( ! empty( $event->due_date ) ) {
            return format_date( $event->due_date );
        } else if ( ! empty( $event->start_at )) {
            return format_date( $event->start_at);
        } else {
            return format_date( $event->created_at );
        }
    }

    public function get_start( $event ) {

        if ( !empty( $event->start_at ) ) {
            return format_date( $event->start_at);
        } else if ( isset( $event->due_date ) ) {
            return format_date( $event->due_date );
        } else {
            return format_date( $event->created_at );
        }
    }

    public function has_view_permission(
        $has_manage_cap,
        $role,
        $list_privacy,
        $task_privacy,
        $settings
    ) {

        if ( $has_manage_cap ||  $role == 1 ) {
            return true;
        }

        if ( $list_privacy == 1 ) {
            if ( $role == 2 ) {
                if (
                    ! empty( $settings['co_worker'] )
                    &&
                    ! $settings['co_worker']['view_private_list']
                ) {
                    return false;
                }
            }

            if ( $role == 3 ) {
                if (
                    ! empty( $settings['client'] )
                    &&
                    ! $settings['client']['view_private_list']
                ) {
                    return false;
                }
            }
        }

        if ( $task_privacy == 1 ) {
            if ( $role == 2 ) {
                if (
                    ! empty( $settings['co_worker'] )
                    &&
                    ! $settings['co_worker']['view_private_task']
                ) {
                    return false;
                }
            }

            if ( $role == 3 ) {
                if (
                    ! empty( $settings['client'] )
                    &&
                    ! $settings['client']['view_private_task']
                ) {
                    return false;
                }
            }
        }

        return true;
    }

    public function get_list_id( $boardables ) {
        $boardables = explode( '|', $boardables );

        foreach ( $boardables as $key => $boardable ) {
            $boardable = str_replace('`', '"', $boardable);
            $boardable = json_decode( $boardable );

            if ( ! empty( $boardable->board_id ) ) {
                return $boardable->board_id;
            }
        }

        return '';
    }

    public function get_project_title( $projects ) {
        $projects = explode( '|', $projects );

        foreach ( $projects as $key => $project ) {
            $project = str_replace('`', '"', $project);
            $project = json_decode( $project );

            if ( ! empty( $project->title ) ) {
                return $project->title;
            }
        }

        return '';
    }

    public function get_settings_value( $settings ) {
        $settings = explode( '|', $settings );

        foreach ( $settings as $key => $setting ) {
            return !empty( $setting ) ? maybe_unserialize( $setting ) : '';
        }

        return [];
    }

    public function get_assignees_value( $assignees, $users ) {
        $expand_users = [];

        // $assignees = explode( '|', $assignees );

        // foreach ( $assignees as $key => $assignee ) {
        //     $assignee = str_replace('`', '"', $assignee);
        //     $assignee = json_decode( $assignee );

        //     if ( ! empty( $assignee->assigned_to ) ) {
        //         $return[] = $assignee->assigned_to;
        //     }
        // }

        $users = explode( '|', $users );

        foreach ( $users as $key => $user ) {
            $user = str_replace('`', '"', $user);
            $user = json_decode( $user );

            if ( ! empty( $user->id ) ) {
                $expand_users[] = [
                    'id'           => $user->id,
                    'display_name' => $user->display_name,
                    'avatar_url'   => get_avatar_url( $user->id )
                ];
            }
        }

        return [
            'data' => $expand_users
        ];

    }

    public function get_privacy_meta_value( $event_meta ) {
        $metas = explode( '|', $event_meta );

        foreach ( $metas as $key => $meta ) {
            $meta = str_replace('`', '"', $meta);
            $meta = json_decode( $meta );

            if ( ! empty( $meta->meta_key ) && $meta->meta_key == 'privacy' ) {
                return $meta->meta_value;
            }

        }

        return '';
    }

    // public function user_calender_tasks_x( WP_REST_Request $request ) {
    //     $id = intval( $request->get_param( 'id' ) );
    //     $start      = $request->get_param( 'start' );
    //     $end        = $request->get_param( 'end' );

    //     $tasks = User::find( $id )->tasks()
    //             ->whereHas('boards',function( $query ) {
    //                 $query->where( pm_tb_prefix() . 'pm_boards.status', '1');
    //             })
    //             ->with('assignees')
    //             ->parent()
    //             ->where( function( $query ) use ($start, $end) {

    //                 $query->where( function ( $q2 ) use ($start, $end) {
    //                     $q2->where( 'start_at', '>=', $start)
    //                         ->where( 'due_date', '<=', $end );
    //                 })

    //                 ->orWhere( function ( $q3 ) use ($start, $end) {
    //                     $q3->whereNull( 'due_date' )
    //                         ->where( function ( $qsub ) use ($start, $end) {
    //                             $qsub->where( 'start_at', '>=', $start )
    //                                 ->where(  pm_tb_prefix() . 'pm_tasks.created_at', '<=', $end );
    //                         });
    //                 } )

    //                 ->orWhere( function ($q4) use ($start, $end) {
    //                     $q4->whereNull( 'start_at' )
    //                         ->where( function ( $qsub ) use ($start, $end) {
    //                             $qsub->where( 'due_date', '>=', $start )
    //                                 ->where(  pm_tb_prefix() . 'pm_tasks.created_at', '<=', $end );
    //                         });
    //                 } )

    //                 ->orWhere( function( $q5 ) use ($start, $end) {
    //                     $q5->whereNull( 'start_at' )
    //                         ->orWhereNull( 'due_date' )
    //                         ->whereBetween( pm_tb_prefix() . 'pm_tasks.created_at', array($start, $end) );
    //                 } );
    //             } );

    //     if ( !pm_has_manage_capability() ){
    //         $tasks = $tasks->doesntHave( 'metas', 'and', function ($query) {
    //                     $query->where( 'meta_key', '=', 'privacy' )
    //                         ->where( 'meta_value', '!=', '0' );
    //                 });

    //         $tasks = $tasks->doesntHave( 'task_lists.metas', 'and', function ($query) {
    //             $query->where( 'meta_key', '=', 'privacy' )
    //                 ->where( 'meta_value', '!=', '0' );
    //             });
    //     }
    //     $tasks = $tasks->get()->toArray();
    //     $resource = New Collection( $tasks, new Calendar_Transformer );
    //     return $this->get_response( $resource );
    // }

    public function assigned_users () {
        $roles      =  User_Role::select('user_id')->get()->toArray();
        $user_ids   = wp_list_pluck( $roles, 'user_id' ); //pluck('user_id')->unique();
        $users      = User::find($user_ids);

        $resource = new Collection( $users, new User_Transformer );

        return $this->get_response( $resource );
    }

    public function user_activities ( WP_REST_Request $request ) {
        $id       = intval( $request->get_param( 'id' ) );
        $page     = $request->get_param( 'mytask_activities_page' );
        $per_page = $request->get_param( 'mytask_activities_per_page' );
        $page     = isset( $page ) ? $page : 1;
        $per_page = isset( $per_page ) ? $per_page : 15;

        Paginator::currentPageResolver(function () use ($page) {
            return $page;
        });

        $activities = User::find($id)->activities()
            ->orderBy( 'created_at', 'DESC' )
            ->paginate( $per_page );

        $activities_collection = $activities->getCollection();
        $resource = New Collection( $activities_collection, new Activity_Transformer );

        $resource->setPaginator( new IlluminatePaginatorAdapter( $activities ) );

        return $this->get_response( $resource );
    }
}
