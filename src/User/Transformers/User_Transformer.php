<?php

namespace WeDevs\PM\User\Transformers;

use League\Fractal\TransformerAbstract;

use WeDevs\PM\User\Models\User;
use WeDevs\PM\User\Models\User_Role;


use WeDevs\PM\My_Task\Transformers\Project_Transformer;
use WeDevs\PM\Role\Transformers\Role_Transformer;
use WeDevs\PM\Task\Transformers\Task_Transformer;
use Carbon\Carbon;

class User_Transformer extends TransformerAbstract {
    /**
     * List of resources to automatically include
     *
     * @var array
     */
    protected $defaultIncludes = [
        'roles'
    ];

    /**
     * List of resources possible to include
     *
     * @var array
     */

    protected $availableIncludes = [
        'tasks', 'projects', 'activities', 'graph', 'meta'
    ];

    protected $project_id = null;

    public function __construct( $project_id = null )
    {

        if ( !$project_id ) {
            $request_uri = isset( $_SERVER['REQUEST_URI'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REQUEST_URI'] ) ): '';
            $project_uri = preg_match_all('/projects\/[0-9]+/', $request_uri, $matches, PREG_SET_ORDER);

            if ( !empty( $matches ) ) {
                $this->project_id = (int) str_replace('projects/', '', $matches[0][0]);
            } else {
                $this->project_id = null;
            }

        } else {
            $this->project_id = $project_id;

        }
    }

    public function transform( $user ) {
        if (!$user) {
            return [];
        }

        $data = [
            'id'                => (int) $user->ID,
            'username'          => $user->user_login,
            'nicename'          => $user->user_nicename,
            'email'             => $user->user_email,
            'profile_url'       => $user->user_url,
            'display_name'      => $user->display_name,
            'manage_capability' => (int) pm_has_manage_capability($user->ID),
            'create_capability' => (int) pm_has_project_create_capability($user->ID),
            'avatar_url'        => get_avatar_url( $user->user_email ),
            'github' => get_user_meta($user->ID,'github' ,true),
            'bitbucket' => get_user_meta($user->ID,'bitbucket', true)
        ];

        if ( $user->pivot && $user->pivot->assigned_at ) {
            $data['completed_at'] = format_date( $user->pivot->completed_at );
            $data['started_at'] = format_date( $user->pivot->started_at );
            $data['assigned_at'] = format_date( $user->pivot->assigned_at );
            $data['status'] = (int) $user->pivot->status;
        }

        return $data;
    }

        /**
     * Getter for defaultIncludes.
     *
     * @return array
     */
    public function getDefaultIncludes() {
        return apply_filters( "pm_user_transformer_default_includes", $this->defaultIncludes );
    }

    public function includeRoles( $user ) {
        if (!$user) {
            return null;
        }


        //pmpr( $request_uri ); die();
        $project_id = $this->project_id;
        if ( !$project_id ) {
            $roles = $user->roles->unique( 'id' )->all();
        } else {
            $roles = $user->roles->filter( function( $role ) use ( $project_id ) {
                return $role['pivot']['project_id'] == $project_id;
            });
        }

        return $this->collection( $roles, new Role_Transformer );
    }

    public function includeMeta ( User $user ) {
        return $this->item ('', function () use ( $user ) {
            $today = date( 'Y-m-d', strtotime( current_time( 'mysql' ) ) );

            $project_ids = User_Role::where( 'user_id', $user->ID )->get(['project_id'])->toArray();
            $project_ids = wp_list_pluck( $project_ids, 'project_id' );

            if ( pm_has_manage_capability() ){
                $tasks = $user->tasks()->whereHas('boards')
                    ->whereIn( pm_tb_prefix() . 'pm_tasks.project_id', $project_ids)
                    ->parent()
                    ->get();
            } else {
                $tasks = $user->tasks()->whereHas('boards')
                    ->whereIn( pm_tb_prefix() . 'pm_tasks.project_id', $project_ids)
                    ->parent()
                    ->doesntHave( 'metas', 'and', function ($query) {
                        $query->where( 'meta_key', '=', 'privacy' )
                            ->where( 'meta_value', '!=', '0' );

                    });
                $tasks = $tasks->doesntHave( 'task_lists.metas', 'and', function ($query) {
                    $query->where( 'meta_key', '=', 'privacy' )
                            ->where( 'meta_value', '!=', '0' );

                    })->get();
            }

            $total_current_tasks = $tasks->where( 'status', 'incomplete' )->filter( function( $item ) use ( $today ) {
                if ( empty( $item['due_date'] ) ) {
                    return true;
                }
                return date( 'Y-m-d', strtotime( $item['due_date'] ) ) >=  $today;
            });

            $total_outstanding_tasks = $tasks->where( 'status', 'incomplete' )->filter( function( $item ) use ( $today ) {
                if ( ! empty( $item['due_date'] ) ) {
                    return date( 'Y-m-d', strtotime( $item['due_date'] ) ) <  $today;
                }
            });

            $start_at = empty( $_GET['start_at'] ) ? false : pm_clean( $_GET['start_at'] );
            $due_date = empty( $_GET['due_date'] ) ? false : pm_clean( $_GET['due_date'] );
            
            if ( ! empty( $start_at ) && ! empty( $due_date ) ) {
                
                $total_current_tasks = $tasks->where( 'status', 'incomplete' )->filter( function( $item ) use ( $start_at, $due_date, &$total ) {
                        
                    $today         = date( 'Y-m-d', strtotime( current_time('mysql') ) );
                    $item_start_at = empty( $item['start_at'] ) ? date( 'Y-m-d', strtotime( $item['created_at'] ) ) : date( 'Y-m-d', strtotime( $item['start_at'] ) );
                    $item_due_date = empty( $item['due_date'] ) ? '' : date( 'Y-m-d', strtotime( $item['due_date'] ) );
    
                    if ( 
                        $today <= $item_due_date 
                            && 
                        $item_start_at >= $start_at 
                            && 
                        $item_due_date <= $due_date 
                    ) {
                        return true;
                    } else if ( $item_start_at >= $start_at && empty( $item_due_date ) ) {
                        return true;
                    }

                });

                $total_outstanding_tasks = $tasks->where( 'status', 'incomplete' )->filter( function( $item ) use ( $start_at, $due_date, &$total ) {

                    $today         = date( 'Y-m-d', strtotime( current_time('mysql') ) );
                    $item_due_date = empty( $item['due_date'] ) ? '' : date( 'Y-m-d', strtotime( $item['due_date'] ) );
                    $item_start_at = empty( $item['start_at'] ) ? date( 'Y-m-d', strtotime( $item['created_at'] ) ) : date( 'Y-m-d', strtotime( $item['start_at'] ) );
    
                    if ( 
                        !empty( $item_due_date )
                            &&
                        $today > $item_due_date 
                            && 
                        $item_start_at >= $start_at 
                            && 
                        $item_due_date <= $due_date 
                    ) {
                        return true;
                    } 

                });

                $total_complete_tasks = $tasks->where( 'status', 'complete' )->filter( function( $item ) use ( $start_at, $due_date, &$total ) {

                    $item_due_date = empty( $item['due_date'] ) ? '' : date( 'Y-m-d', strtotime( $item['due_date'] ) );
                    $item_start_at = empty( $item['start_at'] ) ? date( 'Y-m-d', strtotime( $item['created_at'] ) ) : date( 'Y-m-d', strtotime( $item['start_at'] ) );
    
                    if ( 
                        $item_start_at >= $start_at 
                            && 
                        $item_due_date <= $due_date 
                    ) {
                        return true;
                    } 

                });

                $total_complete_tasks = $total_complete_tasks->count();
                $total_activity = $user->activities->where('created_at', '>=', $start_at )->where('created_at', '<=', $due_date )->count();
            } else {
                $total_complete_tasks = $tasks->toBase()->where( 'status', 'complete' )->count();
                $total_activity = $user->activities->count();
            }

            return [
                'total_project'           => $user->projects()->count(),
                'total_task'              => $tasks->count(),
                'total_complete_tasks'    => $total_complete_tasks,
                'total_current_tasks'     => $total_current_tasks->count(),
                'total_outstanding_tasks' => $total_outstanding_tasks->count(),
                'total_activity'          => $total_activity
            ];
        } );
    }

    public function includeTasks( User $item ) {
        $project_ids = User_Role::where( 'user_id', $item->ID)->get(['project_id'])->toArray();
        $project_ids = wp_list_pluck( $project_ids, 'project_id' );

        if ( !pm_has_manage_capability() ){

            $tasks = $item->tasks()
                ->whereIn( pm_tb_prefix() . 'pm_tasks.project_id', $project_ids)
                ->parent()
                ->doesntHave( 'metas', 'and', function ($query) {
                    $query->where( 'meta_key', '=', 'privacy' )
                        ->where( 'meta_value', '!=', '0' );

                });

            $tasks = $tasks->doesntHave( 'task_lists.metas', 'and', function ($query) {
                $query->where( 'meta_key', '=', 'privacy' )
                    ->where( 'meta_value', '!=', '0' );

                })
                ->get();
        }else {
            $tasks = $item->tasks()->parent()->whereIn( pm_tb_prefix() . 'pm_tasks.project_id', $project_ids)->get();
        }


        return $this->collection( $tasks, new Task_Transformer );
    }

    public function includeProjects( User $item ) {
        $projects = $item->projects;

        return $this->collection( $projects, new Project_Transformer );
    }

    public function includeActivities( User $item ) {

        $project_ids = User_Role::where( 'user_id', $item->ID )->get(['project_id'])->toArray();
        $project_ids = wp_list_pluck( $project_ids, 'project_id' );

        $page = isset( $_GET['mytask_activities_page'] ) ? $_GET['mytask_activities_page'] : 1;
        $per_page = isset( $_GET['mytask_activities_per_page'] ) ? $_GET['mytask_activities_per_page'] : 15;

        Paginator::currentPageResolver(function () use ($page) {
            return $page;
        });

        $activities = $item->activities()
            ->whereIn( 'project_id', $project_ids )
            ->orderBy( 'created_at', 'DESC' )
            ->paginate( $per_page, ['*'] );

        $activities_collection = $activities->getCollection();
        $resource = $this->collection( $activities_collection, new Activity_Transformer );

        $resource->setPaginator( new IlluminatePaginatorAdapter( $activities ) );

        return $resource;
    }

    public function includeGraph ( User $item ) {
        $start_at = empty( $_GET['start_at'] ) ? false : pm_clean( $_GET['start_at'] );
        $due_date = empty( $_GET['due_date'] ) ? false : pm_clean( $_GET['due_date'] );

        if ( $start_at && $due_date ) {
            $first_day = date( 'Y-m-d', strtotime( $start_at ) );
            $today = date( 'Y-m-d', strtotime( $due_date ) );
        } else {
            $today     = date( 'Y-m-d', strtotime( current_time( 'mysql' ) ) );
            $first_day = date( 'Y-m-d', strtotime('-1 month') );
        }

        $graph_data      = [];

        $completed_tasks = $item->tasks
            ->toBase()
            ->where('status', 'complete');

        $assigned_tasks  = $item->assignees->toBase();
        $activities      = $item->activities->toBase();
        
        for (  $dt = $first_day; $dt<=$today; $dt = date('Y-m-d', strtotime( $dt . '+1 day' ) ) ) {

            $dt_activities = $activities->filter( function($item) use ( $dt ) {

                return date( 'Y-m-d', strtotime( $item['created_at'] ) ) == $dt;
            } );

            $dt_assigned_tasks = $assigned_tasks->filter( function ( $item ) use ( $dt ) {
                return date( 'Y-m-d', strtotime( $item['assigned_at'] ) ) == $dt;
            });

            $dt_completed_tasks = $completed_tasks->filter( function ( $item ) use ( $dt ) {
                return date( 'Y-m-d', strtotime( $item['updated_at'] ) ) == $dt;
            });

            $graph_data[] = [
                'date_time'             => format_date( $dt ),
                'completed_tasks'       => $dt_completed_tasks->count(),
                'assigned_tasks'        => $dt_assigned_tasks->count(),
                'activities'            => $dt_activities->count()
            ];
        }

        return $this->collection( $graph_data, function ( $item ) {
            return [
                'date_time'             => $item['date_time'],
                'completed_tasks'       => $item['completed_tasks'],
                'assigned_tasks'        => $item['assigned_tasks'],
                'activities'            => $item['activities'],
            ];
        } );
    }
}
