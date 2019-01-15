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
use WeDevs\PM\Task\Transformers\Task_Transformer;
use WeDevs\PM\Common\Models\Boardable;
use WeDevs\PM\Common\Traits\Request_Filter;
use WeDevs\PM\Milestone\Models\Milestone;
use Illuminate\Pagination\Paginator;
use WeDevs\PM\Common\Models\Board;


class Task_List_Controller {

    use Transformer_Manager, Request_Filter;

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
      
        $task_lists = Task_List::select(pm_tb_prefix().'pm_boards.*')
            ->where( pm_tb_prefix() .'pm_boards.project_id', $project_id)
            ->where( pm_tb_prefix() .'pm_boards.status', $status )
            ->where( pm_tb_prefix() .'pm_boards.project_id', $project_id );


        $task_lists = apply_filters( "pm_task_list_index_query", $task_lists, $project_id, $request );
        
        if ( $per_page == '-1' ) {
            $per_page = $task_lists->count();
        }

        $task_lists = $task_lists->orderBy( 'order', 'DESC' )
            ->paginate( $per_page );

        $task_list_collection = $task_lists->getCollection();
        $resource = new Collection( $task_list_collection, new Task_List_Transformer );
        $resource->setPaginator( new IlluminatePaginatorAdapter( $task_lists ) );

        $lists = $this->get_response( $resource );
        
        $list_ids = wp_list_pluck( $lists['data'], 'id' );


        if ( in_array( 'incomplete_tasks', $with ) ) {
            $incomplete_task_ids = $this->get_incomplete_task_ids( $list_ids, $project_id );
            $incomplete_tasks    = $this->get_tasks( $incomplete_task_ids );
            
            $lists = $this->set_incomplete_task_in_lists( $lists, $incomplete_tasks );
        }
        
        if ( in_array( 'complete_tasks', $with ) ) {
            $complete_task_ids = $this->get_complete_task_ids( $list_ids, $project_id );
            $complete_tasks    = $this->get_tasks( $complete_task_ids );
            
            $lists = $this->set_complete_task_in_lists( $lists, $complete_tasks );
        }

        return $lists;
    }

    public function get_incomplete_task_ids( $list_ids, $project_id ) {
        global $wpdb;

        $pagenum    = isset( $_GET['incomplete_task_page'] ) ? intval( $_GET['incomplete_task_page'] ) : 1;
        
        $table_ba   = $wpdb->prefix . 'pm_boardables';
        $table_task = $wpdb->prefix . 'pm_tasks';
        
        $per_page   = pm_get_setting( 'incomplete_tasks_per_page' );
        $per_page   = $per_page ? $per_page : 5;
        $offset     = ( $pagenum - 1 ) * $per_page;
        $limit      = $pagenum == 1 ? '' : "LIMIT $offset,$per_page";
        
        $list_ids   = implode(',', $list_ids );
        $permission = apply_filters( 'pm_incomplete_task_query_permission', '', $project_id );
        
        $sql = "SELECT ibord_id, SUBSTRING_INDEX(GROUP_CONCAT(task.task_id order by task.iorder asc), ',', $per_page) as itasks_id
            FROM 
                (
                    SELECT 
                        itasks.id as task_id,  
                        ibord.board_id as ibord_id,
                        ibord.order as iorder 
                    FROM 
                        $table_task as itasks 
                        inner join $table_ba as ibord on itasks.id = ibord.boardable_id 
                        AND ibord.board_id in ($list_ids)
                        $permission
                    WHERE
                        itasks.status=0
                        AND ibord.board_type='task_list'
                        AND ibord.boardable_type='task'
                        order by iorder asc
                        $limit
                        
                ) as task
      
            group by ibord_id";
        
        $results = $wpdb->get_results( $sql );
        
        $task_ids = wp_list_pluck( $results, 'itasks_id' );
        $task_ids = implode( ',', $task_ids );

        return explode(',', $task_ids);
    }

    public function get_complete_task_ids( $list_ids, $project_id ) {
        global $wpdb;

        $pagenum    = isset( $_GET['complete_task_page'] ) ? intval( $_GET['complete_task_page'] ) : 1;
        $table_ba   = $wpdb->prefix . 'pm_boardables';
        $table_task = $wpdb->prefix . 'pm_tasks';
        
        $per_page   = pm_get_setting( 'complete_tasks_per_page' );
        $per_page   = $per_page ? $per_page : 5;
        $offset     = ( $pagenum - 1 ) * $per_page;
        $limit      = $pagenum == 1 ? '' : "LIMIT $offset,$per_page";
        
        $list_ids   = implode(',', $list_ids );
        $permission = apply_filters( 'pm_complete_task_query_permission', '', $project_id );
        
        $sql = "SELECT ibord_id, SUBSTRING_INDEX(GROUP_CONCAT(task.task_id order by task.iorder asc), ',', $per_page) as itasks_id
            FROM 
                (
                    SELECT 
                        itasks.id as task_id,  
                        ibord.board_id as ibord_id,
                        ibord.order as iorder
                    FROM 
                        $table_task as itasks 
                        inner join $table_ba as ibord on itasks.id = ibord.boardable_id 
                        AND ibord.board_id in ($list_ids)
                        $permission
                    WHERE
                        itasks.status=1
                        AND ibord.board_type='task_list'
                        AND ibord.boardable_type='task'
                        order by iorder asc
                        $limit
                        
                ) as task
      
            group by ibord_id";

        $results = $wpdb->get_results( $sql );
        
        $task_ids = wp_list_pluck( $results, 'itasks_id' );
        $task_ids = implode( ',', $task_ids );

        return explode(',', $task_ids);
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
        $with = $request->get_param( 'with' );
        $with = explode( ',', $with );

        $task_list = Task_List::with( 'tasks' )
            ->where( 'id', $task_list_id )
            ->where( 'project_id', $project_id );
            $task_list = apply_filters("pm_task_list_show_query", $task_list, $project_id, $request );
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
            $incomplete_task_ids = $this->get_incomplete_task_ids( $list_id, $project_id );
            $incomplete_tasks    = $this->get_tasks( $incomplete_task_ids );
  
            $list['data']['incomplete_tasks']['data'] = $incomplete_tasks['data']; 
        }
        
        if ( in_array( 'complete_tasks', $with ) ) {
            $complete_task_ids = $this->get_complete_task_ids( $list_id, $project_id );
            $complete_tasks    = $this->get_tasks( $complete_task_ids );
            
            $list['data']['complete_tasks']['data'] = $complete_tasks['data']; 
        }

        return $list;
    }

    public function get_tasks( $task_ids, $args=[] ) {
        
        $tasks = Task::select( pm_tb_prefix() . 'pm_tasks.*' )
            ->whereIn( pm_tb_prefix() . 'pm_tasks.id', $task_ids )
            ->leftJoin( pm_tb_prefix() . 'pm_boardables', function( $join ) {
                $join->on( pm_tb_prefix() . 'pm_tasks.id', '=', pm_tb_prefix() . 'pm_boardables.boardable_id' );
            } )
            ->orderBy( pm_tb_prefix() . 'pm_boardables.order', 'ASC' )
            ->get();

        $resource = new collection( $tasks, new Task_Transformer );
        $tasks    = $this->get_response( $resource );

        return $tasks;
    }

    public function store( WP_REST_Request $request ) {
        $data = $this->extract_non_empty_values( $request );
        $milestone_id = $request->get_param( 'milestone' );
        $project_id = $request->get_param( 'project_id' );

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

    public function destroy( WP_REST_Request $request ) {
        // Grab user inputs
        $project_id   = $request->get_param( 'project_id' );
        $task_list_id = $request->get_param( 'task_list_id' );

        // Select the task list to be deleted
        $task_list = Task_List::where( 'id', $task_list_id )
            ->where( 'project_id', $project_id )
            ->first();
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
        global $wpdb;
        $project_id  = $request->get_param( 'project_id' );
        $title       = $request->get_param( 'title' );

        $task_lists = Task_List::where( function($q) use( $title ) {
            if ( !empty( $title ) ) {
                $q->where('title', 'like', '%'.$title.'%');
            } 
        })
        ->get();

        $resource = new Collection( $task_lists, new Task_List_Transformer );
        
        return $this->get_response( $resource );
    }

}
