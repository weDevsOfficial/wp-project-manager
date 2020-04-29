<?php

namespace WeDevs\PM\Task_List\Controllers;

use WP_REST_Request;
use WeDevs\PM\Task_List\Models\Task_List;
use WeDevs\PM\Task\Models\Task;
use League\Fractal;
use League\Fractal\Manager as Manager;
use League\Fractal\Serializer\DataArraySerializer;
use League\Fractal\Resource\Item as Item;
use League\Fractal\Resource\Collection as Collection;
use League\Fractal\Pagination\IlluminatePaginatorAdapter;
use WeDevs\PM\Common\Traits\Transformer_Manager;
use WeDevs\PM\Task_List\Transformers\Task_List_Transformer;
use WeDevs\PM\Task_List\Transformers\New_Task_List_Transformer;
use WeDevs\PM\Task\Transformers\Task_Transformer;
use WeDevs\PM\Common\Models\Boardable;
use WeDevs\PM\Common\Traits\Request_Filter;
use WeDevs\PM\Milestone\Models\Milestone;
use Illuminate\Pagination\Paginator;
use WeDevs\PM\Common\Models\Board;
use WeDevs\PM\Task_List\Transformers\List_Task_Transformer;
use WeDevs\PM\Task\Controllers\Task_Controller as Task_Controller;
use WeDevs\PM\task\Helper\Task as Helper_Task;
use WeDevs\PM\Task_List\Helper\Task_List as Helper_List;


class Task_List_Controller {

    use Transformer_Manager, Request_Filter;

    private static $_instance;

    public static function getInstance() {
        if ( !self::$_instance ) {
            self::$_instance = new self();
        }

        return self::$_instance;
    }

    public function index( WP_REST_Request $request ) {
        global $wpdb;
        $task_tb                = $wpdb->prefix . 'pm_tasks';
        $list_tb                = $wpdb->prefix . 'pm_boardables';

        $project_id             = $request->get_param( 'project_id' );
        $per_page               = $request->get_param( 'per_page' );
        $status                 = $request->get_param( 'status' );
        $list_id                = $request->get_param( 'list_id' ); //must be a array
        $per_page_from_settings = pm_get_setting( 'list_per_page' );
        $per_page_from_settings = $per_page_from_settings ? $per_page_from_settings : 15;
        $per_page               = $per_page ? $per_page : $per_page_from_settings;
        $with                   = $request->get_param( 'with' );
        $with                   = explode( ',', $with );

        $page = $request->get_param( 'page' );
        $page = $page ? $page : 1;
        $status = isset( $status ) ? intval( $status ) : 1;

        Paginator::currentPageResolver(function () use ($page) {
            return $page;
        });

        $tb_tasks     = pm_tb_prefix() . 'pm_tasks';
        $tb_lists     = pm_tb_prefix() . 'pm_boards';
        $tb_boardable = pm_tb_prefix() . 'pm_boardables';
        $tb_meta      = pm_tb_prefix() . 'pm_meta';

        $task_lists = Task_List::select( $tb_lists . '.*' )
            ->selectRaw(
                "GROUP_CONCAT(
                    DISTINCT
                    CONCAT(
                        '{',
                            '\"', 'meta_key', '\"', ':' , '\"', IFNULL($tb_meta.meta_key, '') , '\"', ',',
                            '\"', 'meta_value', '\"', ':' , '\"', IFNULL($tb_meta.meta_value, '') , '\"'
                        ,'}'
                    ) SEPARATOR '|'
                ) as meta"
            )
            ->leftJoin( $tb_boardable, function( $join ) use($tb_boardable, $tb_lists) {
                $join->on( $tb_lists . '.id', '=', $tb_boardable . '.board_id' );
            })
            ->leftJoin( $tb_meta, function( $join ) use($tb_meta, $tb_lists) {
                $join->on( $tb_lists . '.id', '=', $tb_meta . '.entity_id' )
                    ->where( function($q) use($tb_meta) {
                        $q->where($tb_meta . '.entity_type', 'task_list');
                        $q->orWhereNull($tb_meta . '.entity_type');
                    });
            })

            ->where( pm_tb_prefix() .'pm_boards.project_id', $project_id)
            ->where( pm_tb_prefix() .'pm_boards.status', $status )

            ->groupBy($tb_lists.'.id');

        $task_lists = apply_filters( "pm_task_list_check_privacy", $task_lists, $project_id, $request );

        if ( $per_page == '-1' ) {
            $per_page = $task_lists->count();
        }

        $task_lists = $task_lists->orderBy( $tb_lists. '.order', 'DESC' )
            ->paginate( $per_page );

        $list_ids = [];
        $task_list_collection = $task_lists->getCollection();

        foreach ( $task_list_collection as $key => $collection ) {
            $list_ids[] = $collection->id;
        }

        $milestones        = $this->get_milestone_by_list_ids( $list_ids );
        $lists_tasks_count = $this->get_lists_tasks_count( $list_ids, $project_id );

        foreach ( $task_list_collection as $key => $collection ) {
            $collection->lists_tasks_count = empty( $lists_tasks_count[$collection->id] ) ? [] : $lists_tasks_count[$collection->id];
            $milestone = empty( $milestones[$collection->id] ) ? [] : $milestones[$collection->id];
            $collection->milestone = [
                'data' => $milestone
            ];
        }

        $resource = new Collection( $task_list_collection, new New_Task_List_Transformer );
        $resource->setPaginator( new IlluminatePaginatorAdapter( $task_lists ) );

        $lists = $this->get_response( $resource );

        if ( in_array( 'incomplete_tasks', $with ) ) {
            $incomplete_task_ids = ( new Task_Controller )->get_incomplete_task_ids( $list_ids, $project_id );
            $incomplete_tasks    = ( new Task_Controller )->get_tasks( $incomplete_task_ids, ['project_id' => $project_id] );

            $lists = $this->set_incomplete_task_in_lists( $lists, $incomplete_tasks );
        }

        if ( in_array( 'complete_tasks', $with ) ) {
            $complete_task_ids = ( new Task_Controller )->get_complete_task_ids( $list_ids, $project_id );
            $complete_tasks    = ( new Task_Controller )->get_tasks( $complete_task_ids, ['project_id' => $project_id] );

            $lists = $this->set_complete_task_in_lists( $lists, $complete_tasks );
        }

        return $lists;
    }

    public function set_incomplete_task_in_lists( $lists, $incomplete_tasks ) {
        $filter_tasks = [];

        foreach ( $incomplete_tasks['data'] as $key => $task ) {
            $filter_tasks[$task['task_list_id']][] = $task;
        }

        foreach ( $lists['data'] as $key => $list ) {
           // $lists['data'][$key]['incomplete_tasks']['meta'] = $incomplete_tasks['meta'];
            $lists['data'][$key]['incomplete_tasks']['data'] = [];
            if ( ! empty( $filter_tasks[$list['id']] ) ) {
                $lists['data'][$key]['incomplete_tasks']['data'] = $filter_tasks[$list['id']];
            }
        }

        return $lists;
    }

    public function set_complete_task_in_lists( $lists, $complete_tasks ) {
        $filter_tasks = [];

        foreach ( $complete_tasks['data'] as $key => $task ) {
            $filter_tasks[$task['task_list_id']][] = $task;
        }

        foreach ( $lists['data'] as $key => $list ) {
            //$lists['data'][$key]['complete_tasks']['meta'] = $complete_tasks['meta'];
            $lists['data'][$key]['complete_tasks']['data'] = [];
            if ( ! empty( $filter_tasks[$list['id']] ) ) {
                $lists['data'][$key]['complete_tasks']['data'] = $filter_tasks[$list['id']];
            }
        }

        return $lists;
    }

    public function listInbox ( WP_REST_Request $request ) {
        $project_id = $request->get_param( 'project_id' );
        $tasks = Task::parent()->doesnthave('boardables')->where('project_id', $project_id)->get();

        $resource = new Collection ( $tasks, new Task_Transformer );

        return $this->get_response( $resource );

    }

    public function show( WP_REST_Request $request ) {
        $project_id   = $request->get_param( 'project_id' );
        $task_list_id = $request->get_param( 'task_list_id' );
        $with         = $request->get_param( 'with' );
        
        return $this->get_list( [
            'project_id'   => $request->get_param( 'project_id' ),
            'task_list_id' => $request->get_param( 'task_list_id' ),
            'with'         => $request->get_param( 'with' )
        ] );
    }

    public function get_list( $params ) {
        $project_id   = $params['project_id'];
        $task_list_id = $params['task_list_id'];
        $with         = empty( $params['with'] ) ? [] : $params['with'];
        $with         = pm_get_prepare_data( $with );

        $task_list = Task_List::select(pm_tb_prefix().'pm_boards.*')
            //->with( 'tasks' )
            ->where( pm_tb_prefix().'pm_boards.id', $task_list_id )
            ->where( pm_tb_prefix().'pm_boards.project_id', $project_id );

            $task_list = apply_filters("pm_task_list_show_query", $task_list, $project_id, $params );

            $task_list = $task_list->first();

        if ( $task_list == NULL ) {
            return $this->get_response( null,  [
                'message' => pm_get_text('success_messages.no_element')
            ] );
        }

        $resource = new Item( $task_list, new Task_List_Transformer );

        $list =  $this->get_response( $resource );
        $list_id = [$task_list_id];

        if ( in_array( 'incomplete_tasks', $with ) ) {
            $incomplete_task_ids = ( new Task_Controller )->get_incomplete_task_ids( $list_id, $project_id );
            $incomplete_tasks    = ( new Task_Controller )->get_tasks( $incomplete_task_ids );

            $list['data']['incomplete_tasks']['data'] = $incomplete_tasks['data'];
        }

        if ( in_array( 'complete_tasks', $with ) ) {
            $complete_task_ids = ( new Task_Controller )->get_complete_task_ids( $list_id, $project_id );
            $complete_tasks    = ( new Task_Controller )->get_tasks( $complete_task_ids );

            $list['data']['complete_tasks']['data'] = $complete_tasks['data'];
        }

        return $list;
    }

    //updated query but not filter updated 
    // public function get_list( $params ) {

    //     $project_id   = $params['project_id'];
    //     $task_list_id = $params['task_list_id'];
    //     $with         = empty( $params['with'] ) ? [] : $params['with'];
    //     $with         = pm_get_prepare_data( $with );
        
    //     $list = pm_get_task_lists([
    //         'id'         => $task_list_id,
    //         'project_id' => $project_id,
    //         'with'       => $with
    //     ]);
       
    //     $list_id = [$task_list_id];
        
    //     if ( in_array( 'incomplete_tasks', $with ) ) {
    //         $incomplete_task_ids = ( new Task_Controller )->get_incomplete_task_ids( $list_id, $project_id );
    //         $incomplete_tasks    = pm_get_tasks( [ 'id' => $incomplete_task_ids ] );

    //         $list['data']['incomplete_tasks']['data'] = $incomplete_tasks['data'];
    //         $list['data']['incomplete_tasks']['meta'] = $incomplete_tasks['meta'];
    //     }

    //     if ( in_array( 'complete_tasks', $with ) ) {
    //         $complete_task_ids = ( new Task_Controller )->get_complete_task_ids( $list_id, $project_id );
    //         $complete_tasks    = pm_get_tasks( [ 'id' => $complete_task_ids ] );

    //         $list['data']['complete_tasks']['data'] = $complete_tasks['data'];
    //         $list['data']['complete_tasks']['meta'] = $complete_tasks['meta'];
    //     }

    //     return $list;
    // }

    public static function create_tasklist( $data ) {
        $self = self::getInstance();
        $milestone_id       = $data[ 'milestone' ];
        $project_id         = $data[ 'project_id' ];
        $is_private         = $data[ 'privacy' ];
        $data['is_private'] = $is_private == 'true' || $is_private === true ? 1 : 0;

        $milestone     = Milestone::find( $milestone_id );
        $latest_order  = Task_List::latest_order( $project_id );
        $data['order'] = $latest_order + 1;
        $task_list     = Task_List::create( $data );

        if ( $milestone ) {
            $self->attach_milestone( $task_list, $milestone );
        }

        do_action( 'pm_new_task_list_before_response', $task_list, $data );
        $resource = new Item( $task_list, new Task_List_Transformer );

        $message = [
            'message' => pm_get_text('success_messages.task_list_created')
        ];
        $response = $self->get_response( $resource, $message );
        do_action( 'cpm_tasklist_new', $task_list->id, $project_id, $data );
        do_action( 'pm_after_new_task_list', $response, $data );
        return $response;
    }

    public function store( WP_REST_Request $request ) {
        $data               = $this->extract_non_empty_values( $request );
        $milestone_id       = $request->get_param( 'milestone' );
        $project_id         = $request->get_param( 'project_id' );
        $is_private         = $request->get_param( 'privacy' );
        $data['is_private'] = $is_private == 'true' || $is_private === true ? 1 : 0;

        $milestone     = Milestone::find( $milestone_id );
        $latest_order  = Task_List::latest_order($project_id);
        $data['order'] = $latest_order + 1;
        $task_list     = Task_List::create( $data );

        if ( $milestone ) {
            $this->attach_milestone( $task_list, $milestone );
        }

        do_action( 'pm_new_task_list_before_response', $task_list, $request->get_params() );
        $resource = new Item( $task_list, new Task_List_Transformer );

        $message = [
            'message' => pm_get_text('success_messages.task_list_created')
        ];
        $response = $this->get_response( $resource, $message );
        do_action( 'cpm_tasklist_new', $task_list->id, $project_id, $request->get_params() );
        do_action( 'pm_after_new_task_list', $response, $request->get_params() );
        return $response;
    }

    public function update( WP_REST_Request $request ) {
        $data = $this->extract_non_empty_values( $request );
        $project_id   = $request->get_param( 'project_id' );
        $task_list_id = $request->get_param( 'task_list_id' );
        $milestone_id = $request->get_param( 'milestone' );

        $is_private    = $request->get_param( 'privacy' );
        $data['is_private']    = $is_private == 'true' || $is_private === true ? 1 : 0;

        $milestone = Milestone::find( $milestone_id );
        $task_list = Task_List::where( 'id', $task_list_id )
            ->where( 'project_id', $project_id )
            ->first();

        $task_list->update_model( $data );

        if ( $milestone ) {
            $this->attach_milestone( $task_list, $milestone );
        } else {
            $task_list->milestones()->detach();
        }

        do_action( 'pm_update_task_list_before_response', $task_list, $request->get_params() );
        $resource = new Item( $task_list, new Task_List_Transformer );

        $message = [
            'message' => pm_get_text('success_messages.task_list_updated')
        ];

        $response = $this->get_response( $resource, $message );
        do_action( 'cpm_tasklist_update', $task_list_id, $project_id, $request->get_params() );
        do_action( 'pm_after_update_task_list', $response, $request->get_params() );
        return $response;
    }

    public static function delete_tasklist( $data ) {
        $self = self::getInstance();
        $project_id   = $data[ 'project_id' ];
        $task_list_id = $data[ 'task_list_id' ];
        $task_list = Task_List::where( 'id', $task_list_id )
            ->where( 'project_id', $project_id )
            ->first();

        do_action( 'pm_before_delete_task_list', $task_list_id, $project_id );
        do_action( 'cpm_delete_tasklist_prev', $task_list_id );
        // Delete relations
        $self->detach_all_relations( $task_list );

        // Delete the task list
        $task_list->delete();
        do_action( 'cpm_delete_tasklist_after', $task_list_id );
        $message = [
            'message' => pm_get_text('success_messages.task_list_deleted')
        ];

        return $message;
    }

    public function destroy( WP_REST_Request $request ) {
        // Grab user inputs
        $project_id   = $request->get_param( 'project_id' );
        $task_list_id = $request->get_param( 'task_list_id' );

        // Select the task list to be deleted
        $task_list = Task_List::where( 'id', $task_list_id )
            ->where( 'project_id', $project_id )
            ->first();

        do_action( 'pm_before_delete_task_list', $task_list_id, $project_id );
        do_action( 'cpm_delete_tasklist_prev', $task_list_id );
        // Delete relations
        $this->detach_all_relations( $task_list );

        // Delete the task list
        $task_list->delete();
        do_action( 'cpm_delete_tasklist_after', $task_list_id );
        $message = [
            'message' => pm_get_text('success_messages.task_list_deleted')
        ];

        return $this->get_response(false, $message);
    }

    private function attach_milestone( Task_List $task_list, Milestone $milestone ) {
        $boardable = Boardable::where( 'boardable_id', $task_list->id )
            ->where( 'boardable_type', 'task_list' )
            ->where( 'board_type', 'milestone' )
            ->first();

        if ( !$boardable ) {
            $boardable = Boardable::firstOrCreate([
                'boardable_id'   => $task_list->id,
                'boardable_type' => 'task_list',
                'board_id'       => $milestone->id,
                'board_type'     => 'milestone'
            ]);
        } else {
            $boardable->update([
                'board_id' => $milestone->id
            ]);
        }
    }

    private function detach_all_relations( Task_List $task_list ) {
        $comments = $task_list->comments;
        foreach ( $comments as $comment ) {
            $comment->replies()->delete();
            $comment->files()->delete();
        }
        $task_list->comments()->delete();

        $tasks = $task_list->tasks;
        foreach ( $tasks as $task ) {
            $task->files()->delete();
            $task->comments()->delete();
            $task->assignees()->delete();
            $task->metas()->delete();
            Task::where('parent_id', $task->id)->delete();
            $task->delete();
        }
        $task_list->metas()->delete();
        $task_list->files()->delete();
        $task_list->milestones()->detach();
    }

    public function attach_users( WP_REST_Request $request ) {
        $project_id = $request->get_param( 'project_id' );
        $task_list_id = $request->get_param( 'task_list_id' );

        $task_list = Task_List::where( 'id', $task_list_id )
            ->where( 'project_id', $project_id )
            ->first();

        $user_ids = explode( ',', $request->get_param( 'users' ) );

        if ( !empty( $user_ids ) ) {
            foreach ( $user_ids as $user_id ) {
                $data = [
                    'board_id' => $task_list->id,
                    'board_type' => 'task_list',
                    'boardable_id' => $user_id,
                    'boardable_type' => 'user'
                ];
                Boardable::firstOrCreate( $data );
            }
        }

        $resource = new Item( $task_list, new Task_List_Transformer );

        return $this->get_response( $resource );
    }

    public function detach_users( WP_REST_Request $request ) {
        $project_id = $request->get_param( 'project_id' );
        $task_list_id = $request->get_param( 'task_list_id' );

        $task_list = Task_List::where( 'id', $task_list_id )
            ->where( 'project_id', $project_id )
            ->first();

        $user_ids = explode( ',', $request->get_param( 'users' ) );

        $task_list->users()->whereIn( 'boardable_id', $user_ids )->delete();

        $resource = new Item( $task_list, new Task_List_Transformer );

        return $this->get_response( $resource );
    }

    public function privacy( WP_REST_Request $request ) {
        $project_id = $request->get_param( 'project_id' );
        $task_list_id = $request->get_param( 'task_list_id' );
        $privacy = $request->get_param( 'is_private' );
        pm_update_meta( $task_list_id, $project_id, 'task_list', 'privacy', $privacy );
        return $this->get_response( NULL);
    }

    public function list_sorting( WP_REST_Request $request ) {

        $orders  = $request->get_param( 'orders' );
        $orders  = array_reverse( $orders );

        foreach ( $orders as $index => $order ) {
            //$index   = empty( $order['index'] ) ? 0 : intval( $order['index'] );
            $list_id = empty( $order['id'] ) ? '' : intval( $order['id'] );

            $board = Board::where( 'id', $list_id )
                    ->where( 'type', 'task_list' )
                    ->first();

            if ( $board ) {
                $board->order = $index;
                $board->save();
            }
        }

        wp_send_json_success();
    }

    public function list_search( WP_REST_Request $request ) {

        $project_id  = $request->get_param( 'project_id' );
        $title       = $request->get_param( 'title' );
        $is_archive  = $request->get_param( 'is_archive' );

        $task_lists = Task_List::where( function($q) use( $title, $project_id, $is_archive ) {
            if ( !empty( $title ) ) {
                $q->where('title', 'like', '%'.$title.'%')
                    ->where( 'project_id', $project_id );

                if ( ! empty( $is_archive ) ) {
                    $status = $is_archive == 'yes' ? 0 : 1;
                    $q->where( 'status', $status );
                }
            }
        })
        ->get();

        $resource = new Collection( $task_lists, new Task_List_Transformer );

        return $this->get_response( $resource );
    }

    public function get_lists_tasks_count( $list_ids = [], $project_id, $filter_params = [] ) {
        global $wpdb;

        if ( empty( $list_ids ) ) {
            $list_ids[] = 0;
        }

        $tb_tasks     = pm_tb_prefix() . 'pm_tasks';
        $tb_lists     = pm_tb_prefix() . 'pm_boards';
        $tb_boardable = pm_tb_prefix() . 'pm_boardables';
        $tb_meta      = pm_tb_prefix() . 'pm_meta';
        $tb_assigned  = pm_tb_prefix() . 'pm_assignees';

        $list_ids     = implode( ',', $list_ids );
        $filter       = '';
        $join         = '';

        $status       = isset( $filter_params['status'] ) ? intval( $filter_params['status'] ) : false;
        $due_date     = empty( $filter_params['due_date'] ) ? false : date( 'Y-m-d', strtotime( $filter_params['due_date'] ) );
        $assignees    = empty( $filter_params['users'] ) ? [] : $filter_params['users'];
        $title        = empty( $filter_params['title'] ) ? '' : $filter_params['title'];

        if ( $status !== false ) {
            if ( gettype( $status ) == 'string'  ) {
                $status = $status == 'complete' ? 1 : 0;
            }

            $filter .= ' AND itasks.status = ' . $status;
        }

        if ( ! empty( $due_date ) ) {
            if( $due_date == 'overdue' ) {
                $today = date( 'Y-m-d', strtotime( current_time('mysql') ) );
                $filter .= ' AND itasks.due_date < ' . $today;

            } else if ( $due_date == 'today' ) {
                $today = date('Y-m-d', strtotime( current_time('mysql') ) );
                $filter .= ' AND itasks.due_date = ' . $today;

            } else if ( $due_date == 'week' ) {
                $today = date('Y-m-d', strtotime( current_time('mysql') ) );
                $last = date('Y-m-d', strtotime( current_time('mysql') . '-1 week' ) );

                $filter .= ' AND itasks.due_date >= ' . $last;
                $filter .= ' AND itasks.due_date <= ' . $today;
            }
        }

        if ( ! empty( $title ) ) {
            $filter .= " AND itasks.title like '%$title%'";
        }

        if ( ! empty( $assignees ) ) {
            $join .= " LEFT JOIN $tb_assigned as asign ON asign.task_id=itasks.id";

            if ( is_array( $assignees ) && $assignees[0] != 0 ) {
                $filter .= ' AND asign.assigned_to IN(' . implode(',', $assignees) . ')';

            } else if ( !is_array( $assignees ) && $assignees != 0) {
                $filter .= ' AND asign.assigned_to = ' . $assignees;
            }
        }

        $join .= apply_filters( 'pm_incomplete_task_query_join', '', $project_id );
        $filter .= apply_filters( 'pm_incomplete_task_query_where', '', $project_id );

        $boardable = "SELECT bo.board_id,
                group_concat(
                    DISTINCT
                    if(itasks.status=0, itasks.id, null)
                    separator '|'
                ) incompleted_task_ids,
                group_concat(
                    DISTINCT
                    if(itasks.status=1, itasks.id, null)
                    separator '|'
                ) completed_task_ids

            FROM $tb_tasks as itasks
            LEFT JOIN $tb_boardable as bo ON bo.boardable_id=itasks.id
            $join
            WHERE
            bo.board_id IN ($list_ids)
            AND
            bo.boardable_type = 'task'
            AND
            itasks.project_id=$project_id
            $filter
            GROUP BY bo.board_id";


        $results = $wpdb->get_results( $boardable );
        $returns = [];

        foreach ( $results as $key => $result ) {
            $result->incompleted_task_ids = empty( $result->incompleted_task_ids ) ? [] : explode( '|', $result->incompleted_task_ids );
            $result->completed_task_ids   = empty( $result->completed_task_ids ) ? [] : explode( '|', $result->completed_task_ids );

            $returns[$result->board_id] = $result;
        }

        return $returns;
    }

    public function get_milestone_by_list_ids( $list_ids ) {
        $tb_boardable = pm_tb_prefix() . 'pm_boardables';
        $tb_milestone = pm_tb_prefix() . 'pm_boards';

        $milestones = Milestone::select($tb_milestone. '.*', $tb_boardable . '.boardable_id as list_id')

        ->leftJoin($tb_boardable, function($join) use($tb_boardable, $tb_milestone) {
            $join->on( $tb_milestone . '.id', $tb_boardable . '.board_id' );
        })
        ->where( $tb_boardable . '.board_type', 'milestone' )
        ->whereIn( $tb_boardable . '.boardable_id', $list_ids )
        ->where( $tb_boardable . '.boardable_type', 'task_list' );

        $milestones = $milestones->get()->toArray();
        $milestones = empty( $milestones ) ? [] : $milestones;
        $returns = [];

        foreach ( $milestones as $key => $milestone ) {
            $returns[$milestone['list_id']] = $milestone;
        }

        return $returns;
    }

}
