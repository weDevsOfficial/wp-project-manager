<?php

namespace WeDevs\PM\Task\Controllers;

use Reflection;
use WP_REST_Request;
use WeDevs\PM\Task\Models\Task;
use League\Fractal;
use League\Fractal\Resource\Item as Item;
use League\Fractal\Resource\Collection as Collection;
use League\Fractal\Pagination\IlluminatePaginatorAdapter;
use WeDevs\PM\Common\Traits\Transformer_Manager;
use WeDevs\PM\Task\Transformers\Task_Transformer;
use WeDevs\PM\Task_List\Models\Task_List;
use WeDevs\PM\Project\Models\Project;
use WeDevs\PM\Common\Models\Boardable;
use WeDevs\PM\Common\Models\Board;
use WeDevs\PM\Common\Traits\Request_Filter;
use WeDevs\PM\Common\Traits\Last_activity;
use Carbon\Carbon;
use WeDevs\PM\Common\Models\Assignee;
use Illuminate\Pagination\Paginator;
use WeDevs\PM\Comment\Models\Comment;
use WeDevs\PM\Task_List\Transformers\Task_List_Transformer;
use WeDevs\PM\Activity\Models\Activity;
use WeDevs\PM\Activity\Transformers\Activity_Transformer;

class Task_Controller {

    use Transformer_Manager, Request_Filter, Last_activity;

    public function index( WP_REST_Request $request ) {
        $project_id = $request->get_param( 'project_id' );
        $per_page   = $request->get_param( 'per_page' );
        $per_page   = $per_page ? $per_page : 5;
        $page       = $request->get_param( 'page' );
        $search     = $request->get_param( 's' );

        Paginator::currentPageResolver(function () use ($page) {
            return $page;
        }); 

        if ( $search ) {
            $tasks = Task::where( 'project_id', $project_id )
                ->parent()
                ->where('title', 'LIKE', '%'.$search.'%');
            $tasks = apply_filters( 'pm_task_index_query', $tasks, $project_id, $request );
            $tasks = $tasks->orderBy( 'created_at', 'DESC')
                ->get();

            $resource = new Collection( $tasks, new Task_Transformer );
        } else {
            $tasks = Task::where( 'project_id', $project_id )
                ->parent();
            $tasks = apply_filters( 'pm_task_index_query', $tasks, $project_id, $request );
            
            if ( $per_page == '-1' ) {
                $per_page = $tasks->count();
            }
            
            $tasks = $tasks->orderBy( 'created_at', 'DESC')
                ->paginate( $per_page );

            $task_collection = $tasks->getCollection();
            $resource = new Collection( $task_collection, new Task_Transformer );
            $resource->setPaginator( new IlluminatePaginatorAdapter( $tasks ) );
        }

        return $this->get_response( $resource );
    }

    public function show( WP_REST_Request $request ) {
        $project_id = $request->get_param( 'project_id' );
        $task_id    = $request->get_param( 'task_id' );

        $task = Task::with('task_lists')->where( 'id', $task_id )
            ->parent()
            ->where( 'project_id', $project_id );
        $task = apply_filters( 'pm_task_show_query', $task, $project_id, $request );
        $task = $task->first();
        
        if ( $task == NULL ) {
            return $this->get_response( null,  [
                'message' => pm_get_text('success_messages.no_element')
            ] );
        }

        $resource = new Item( $task, new Task_Transformer );

        return $this->get_response( $resource );
    }

    public function store( WP_REST_Request $request ) {
        $data          = $this->extract_non_empty_values( $request );
        $project_id    = $request->get_param( 'project_id' );
        $board_id      = $request->get_param( 'board_id' );
        $assignees     = $request->get_param( 'assignees' );
        $project       = Project::find( $project_id );
        $board         = Board::find( $board_id );
        
        if ( $project ) {
            $task = Task::create( $data );
        }

        do_action( 'cpm_task_new', $board_id, $task->id, $request->get_params() );
        
        if ( $task && $board ) {
            $latest_order = Boardable::latest_order( $board->id, $board->type, 'task' );
            $boardable    = Boardable::create([
                'board_id'       => $board->id,
                'board_type'     => $board->type,
                'boardable_id'   => $task->id,
                'boardable_type' => 'task',
                'order'          => $latest_order + 1,
            ]);
        }

        if ( is_array( $assignees ) && $task ) {
            $this->attach_assignees( $task, $assignees );
        }
        do_action( 'cpm_after_new_task', $task->id, $board_id, $project_id );
        do_action('pm_after_create_task', $task, $request->get_params() );

        $resource = new Item( $task, new Task_Transformer );
        

        $message = [
            'message' => pm_get_text('success_messages.task_created'),
            'activity' => $this->last_activity(),
        ];

        $response = $this->get_response( $resource, $message );
        
        do_action('pm_create_task_aftre_transformer', $response, $request->get_params() );

        return $response;
    }

    private function attach_assignees( Task $task, $assignees = [] ) {
        foreach ( $assignees as $user_id ) {
            if ( ! intval( $user_id ) ) {
                continue ;
            }
            $data = [
                'task_id'     => $task->id,
                'assigned_to' => $user_id,
                'project_id'  => $task->project_id,
            ];

            $assignee = Assignee::firstOrCreate( $data );

            if ( !$assignee->assigned_at ) {
                $assignee->assigned_at = Carbon::now();
                $assignee->save();
            }
        }
    }

    private function update_task_status( Task $task ){
        $user = wp_get_current_user();
        $data = [
            'task_id'     => $task->id,
            'assigned_to' => $user->ID,
            'project_id'  => $task->project_id,
        ];

        $assignee = Assignee::where( $data )->first();

        if ( !$assignee) {
            return false;
        }

        if(  $task->status == 'complete' && !$assignee->completed_at ){
            $assignee->completed_at = Carbon::now();
            $assignee->status = 2;
            $assignee->save();
        }

        if(  $task->status == 'incomplete' && $assignee->completed_at ){
            $assignee->completed_at = null;
            $assignee->status = 0;
            $assignee->save();
        }
    }

    public function update( WP_REST_Request $request ) {
        $data       = $request->get_params();
        $project_id = $request->get_param( 'project_id' );
        $list_id    = $request->get_param( 'list_id' );
        $task_id    = $request->get_param( 'task_id' );
        $assignees  = $request->get_param( 'assignees' );
        $assignees  = $assignees ? $assignees : [];
        
        $task = Task::with('assignees')->find( $task_id );

        if ( !empty( $assignees ) && is_array( $assignees ) && $task ) {
            $task->assignees()->whereNotIn( 'assigned_to', $assignees )->delete();
            $this->attach_assignees( $task, $assignees );
        }
                
        do_action( 'cpm_task_update', $list_id, $task_id, $request->get_params() );
        $task->update_model( $data );
        

        do_action( 'cpm_after_update_task', $task->id, $list_id, $project_id );
        do_action('pm_after_update_task', $task, $request->get_params() );
        
        $resource = new Item( $task, new Task_Transformer );
        
        $message = [
            'message' => pm_get_text('success_messages.task_updated'),
            'activity' => $this->last_activity(),
        ];
        
        $response = $this->get_response( $resource, $message );
        
        do_action('pm_update_task_aftre_transformer', $response, $request->get_params() );

        return $response;

    }

    public function change_status( WP_REST_Request $request ) {
        $task_id      = $request->get_param( 'task_id' );
        $task         = Task::with('assignees')->find( $task_id );
        $status       = $request->get_param( 'status' );
        $old_value    = $task->status;
        $task->status = $status;

        if ($status) {
            $task->completed_by = get_current_user_id();
            $task->completed_at = Carbon::now();
        } else {
            $task->completed_by = null;
            $task->completed_at = null;
        }
        
        if ( $task->save() ) {
            $this->update_task_status( $task );
            $this->task_activity_comment($task, $status);
        }
        
        do_action( 'mark_task_complete', $task->project_id, $task->id );
        do_action( 'pm_changed_task_status', $task, $old_value );
        
        $resource = new Item( $task, new Task_Transformer );

        $message = [
            'message' => pm_get_text('success_messages.task_updated'),
            'activity' => $this->last_activity(),
        ];

        $response = $this->get_response( $resource, $message );

        do_action('pm_update_task_aftre_transformer', $response, $request->get_params() );

        return $response;
    }

    private function task_activity_comment ($task, $status) {
         $activity = ( (bool) $status) ? pm_get_text('success_messages.task_activity_done_comment') : pm_get_text('success_messages.task_activity_undone_comment');
         $user_id = get_current_user_id();
        $comment                   = new Comment;
        $comment->content          = $activity;
        $comment->commentable_id   = $task->id;
        $comment->commentable_type = 'task_activity';
        $comment->project_id       = $task->project_id;
        $comment->created_by       = $user_id;
        $comment->updated_by       = $user_id;
        $comment->unsetEventDispatcher();
        $comment->save();
    }

    public function destroy( WP_REST_Request $request ) {
        // Grab user inputs
        $project_id = $request->get_param( 'project_id' );
        $task_id    = $request->get_param( 'task_id' );

        // Select the task
        $task = Task::where( 'id', $task_id )
            ->where( 'project_id', $project_id )
            ->first();
        
        do_action("pm_before_delete_task", $task, $request->get_params() );
        do_action( 'cpm_delete_task_prev', $task_id, $project_id, $project_id, $task );
        
        // Delete relations assoicated with the task
        $task->boardables()->delete();
        $task->files()->delete();
        $comments = $task->comments;
        
        foreach ($comments as $comment) {
            $comment->replies()->delete();
            $comment->files()->delete();
        }
        
        $task->comments()->delete();
        $task->assignees()->delete();
        $task->metas()->delete();
        Task::where('parent_id', $task->id)->delete();
        // Delete the task
        $task->delete();
        
        do_action( 'cpm_delete_task_after', $task_id, $project_id, $project_id );
        
        $message = [
            'message' => pm_get_text('success_messages.task_deleted'),
            'activity' => $this->last_activity(),
        ];

        return $this->get_response(false, $message);
    }

    public function attach_to_board( WP_REST_Request $request ) {
        $task_id  = $request->get_param( 'task_id' );
        $board_id = $request->get_param( 'board_id' );

        $task  = Task::find( $task_id );
        $board = Board::find( $board_id );

        $latest_order = Boardable::latest_order( $board->id, $board->type, 'task' );
        $boardable    = Boardable::firstOrCreate([
            'board_id'       => $board->id,
            'board_type'     => $board->type,
            'boardable_id'   => $task->id,
            'boardable_type' => 'task',
            'order'          => $latest_order + 1,
        ]);

        $resource = new Item( $task, new Task_Transformer );

        return $this->get_response( $resource );
    }

    public function detach_from_board( WP_REST_Request $request ) {
        $task_id  = $request->get_param( 'task_id' );
        $board_id = $request->get_param( 'board_id' );

        $task  = Task::find( $task_id );
        $board = Board::find( $board_id );

        $boardable = Boardable::where( 'board_id', $board->id )
            ->where( 'board_type', $board->type )
            ->where( 'boardable_id', $task->id )
            ->where( 'boardable_type', 'task' )
            ->first();

        $boardable->delete();
    }

    public function attach_users( WP_REST_Request $request ) {
        $project_id = $request->get_param( 'project_id' );
        $task_id    = $request->get_param( 'task_id' );
        $user_ids   = $request->get_param( 'users' );

        $project    = Project::find( $project_id );
        $task       = Task::where( 'id', $task_id )->where( 'project_id', $project_id )->first();

        if ( $project && $task && is_array( $user_ids ) ) {
            foreach ( $user_ids as $user_id ) {
                $data = [
                    'task_id'     => $task->id,
                    'assigned_to' => $user_id,
                    'assigned_at' => Carbon::now(),
                    'project_id'  => $project->id,
                ];
                Assignee::create( $data );
            }
        }

        $resource = new Item( $task, new Task_Transformer );

        return $this->get_response( $resource );
    }

    public function detach_users( WP_REST_Request $request ) {
        $project_id = $request->get_param( 'project_id' );
        $task_id    = $request->get_param( 'task_id' );
        $user_ids   = $request->get_param( 'users' );

        $project    = Project::find( $project_id );
        $task       = Task::where( 'id', $task_id )
            ->where( 'project_id', $project_id )
            ->first();

        if ( $task && is_array( $user_ids ) ) {
            $task->assignees()->whereIn( 'assigned_to', $user_ids )->delete();
        }

        $resource = new Item( $task, new Task_Transformer );

        return $this->get_response( $resource );
    }

    public function reorder( WP_REST_Request $request ) {
        $board_id = $request->get_param( 'board_id' );
        $board_type = $request->get_param( 'board_type' );
        $task_orders = $request->get_param( 'task_orders' );

        if ( is_array( $task_orders ) ) {
            foreach ( $task_orders as $task_order ) {
                $boardable = Boardable::where( 'board_id', $board_id )
                    ->where( 'board_type', $board_type )
                    ->where( 'boardable_id', $task_order['id'] )
                    ->where( 'boardable_type', 'task' )
                    ->first();

                if ( $boardable ) {
                    $boardable->order = (int) $task_order['order'];
                    $boardable->save();
                }
            }
        }
    }

    public function privacy( WP_REST_Request $request ) {
        $project_id = $request->get_param( 'project_id' );
        $task_id = $request->get_param( 'task_id' );
        $privacy = $request->get_param( 'is_private' );
        pm_update_meta( $task_id, $project_id, 'task', 'privacy', $privacy );
        return $this->get_response( NULL);
    }

    public function task_sorting( WP_REST_Request $request ) {
        
        $project_id = $request->get_param( 'project_id' );
        $list_id    = $request->get_param( 'list_id' );
        $task_id    = $request->get_param( 'task_id' );
        $orders     = $request->get_param( 'orders' );
        $receive    = $request->get_param( 'receive' );
        $task       = [];
        $sender_list_id = false;

        if ( isset( $receive ) && $receive == 1 ) {
            $task = pm_get_task( $task_id );
            $sender_list_id = $task ? $task['data']['task_list']['data']['id'] : false;
            $boardable = Boardable::where( 'board_type', 'task_list' )
                ->where( 'boardable_id', $task_id )
                ->first();
            
            if ( $boardable ) {
                $boardable->board_id = $list_id;
                $boardable->update();
            } 

            $task = pm_get_task( $task_id );
        }
        
        foreach ( $orders as $order ) {
            $index   = empty( $order['index'] ) ? 0 : intval( $order['index'] );
            $task_id = empty( $order['id'] ) ? '' : intval( $order['id'] );

            $boardable = Boardable::where( 'board_id', $list_id )
                    ->where( 'board_type', 'task_list' )
                    ->where( 'boardable_id', $task_id )
                    ->where( 'boardable_type', 'task' )
                    ->first();

            if ( $boardable ) {
                $boardable->order = $index;
                $boardable->save();
            }
        }

        wp_send_json_success( [
            'task'           => $task,
            'sender_list_id' => $sender_list_id,
            'list_id'        => $list_id,
            'project_id'     => $project_id
        ] );
    }

    public function filter( WP_REST_Request $request ) {
        global $wpdb;
        $per_page = 20;
        $page  = 1;
        $status    = $request->get_param('status');
        $due_date  = $request->get_param('dueDate');
        $assignees = $request->get_param('users');
        $lists     = $request->get_param('lists');
        $project_id = $request->get_param('project_id');

        Paginator::currentPageResolver(function () use ($page) {
            return $page;
        }); 

        $task_lists = Task_List::with(
            [
                'tasks' => function($q) use( $status, $due_date, $assignees, $project_id ) {
                    
                    if ( ! empty(  $status ) ) {
                        $status = $status == 'complete' ? 1 : 0;
                        $q->where( 'status', $status );
                    }

                    if ( ! empty(  $due_date ) ) {
                        if( $due_date == 'overdue' ) {
                            $today = date( 'Y-m-d', strtotime( current_time('mysql') ) );
                            $q->where( 'due_date', '<', $today );
                        } else if ( $due_date == 'today' ) {
                            $today = date('Y-m-d', strtotime( current_time('mysql') ) );
                            $q->where( 'due_date', $today );
                        } else if ( $due_date == 'week' ) {
                            $today = date('Y-m-d', strtotime( current_time('mysql') ) );
                            $last = date('Y-m-d', strtotime( current_time('mysql') . '-1 week' ) );

                            $q->where( 'due_date', '>=', $last );
                            $q->where( 'due_date', '<=', $today );
                        }
                    }

                    if ( ! empty(  $assignees ) && ! empty(  $assignees[0] ) ) {
                        $q->whereHas('assignees', function( $assign_query ) use( $assignees ) {
                            if( is_array( $assignees ) && $assignees[0] != 0 ) {
                                $assign_query->whereIn('assigned_to', $assignees);
                            } else if ( !is_array( $assignees ) && $assignees != 0) {
                                $assign_query->where('assigned_to', $assignees);
                            }
                        });
                    }

                    $q = apply_filters( 'pm_task_query', $q, $project_id );
                }
            ]
        )
        ->whereHas('tasks', function($q) use( $status, $due_date, $assignees, $project_id ) {
                
                if ( ! empty(  $status ) ) {
                    $status = $status == 'complete' ? 1 : 0;
                    $q->where( pm_tb_prefix(). 'pm_tasks.status', $status );
                }

                if ( ! empty(  $due_date ) ) {
                    if( $due_date == 'overdue' ) {
                        $today = date( 'Y-m-d', strtotime( current_time('mysql') ) );
                        $q->where( 'due_date', '<', $today );
                    } else if ( $due_date == 'today' ) {
                        $today = date('Y-m-d', strtotime( current_time('mysql') ) );
                        $q->where( 'due_date', $today );
                    } else if ( $due_date == 'week' ) {
                        $today = date('Y-m-d', strtotime( current_time('mysql') ) );
                        $last = date('Y-m-d', strtotime( current_time('mysql') . '-1 week' ) );

                        $q->where( 'due_date', '>=', $last );
                        $q->where( 'due_date', '<=', $today );
                    }
                }

                if ( ! empty(  $assignees ) && ! empty(  $assignees[0] ) ) {
                    $q->whereHas('assignees', function( $assign_query ) use( $assignees ) {
                        if( is_array( $assignees ) && $assignees[0] != 0 ) {
                            $assign_query->whereIn('assigned_to', $assignees);
                        } else if ( !is_array( $assignees ) && $assignees != 0) {
                            $assign_query->where('assigned_to', $assignees);
                        }
                    });
                }

                $q = apply_filters( 'pm_task_query', $q, $project_id );
            }
        )
        ->where(function($q) use( $lists ) {
            if( !empty( $lists ) && !empty( $lists[0] ) ) {
                if( is_array( $lists ) && $lists[0] != 0 ) {
                    $q->whereIn( 'id', $lists );
                } else if ( !is_array( $lists ) &&  $lists != 0 ) {
                    $q->where( 'id', $lists );
                }
            }
        })
        ->orderBy( 'order', 'DESC' )
        ->paginate( $per_page );

        $collection = $task_lists->getCollection();

        foreach ( $collection as $key => $task_list ) {
            $task = new Collection( $task_list->tasks, new Task_Transformer );
            $tasks[$task_list->id] = $this->get_response( $task );
        }
        
        $resource = new Collection( $collection, new Task_List_Transformer );
        $resource->setPaginator( new IlluminatePaginatorAdapter( $task_lists ) );

        $req_lists = $this->get_response( $resource );

        foreach ( $req_lists['data'] as $key => $req_list ) {
            if (! isset( $tasks[$req_list['id']] ) ) {
                continue;
            }

            $list_tasks = $tasks[$req_list['id']];
            $incomplete = [];
            $complete   = [];

            foreach ( $list_tasks['data'] as $task) {
                
                if ( $task['status'] == 'incomplete' ) {
                    $incomplete[] = $task;
                } else {
                    $complete[] = $task;
                }
            }
            
            $req_lists['data'][$key]['incomplete_tasks']['data'] = $incomplete;
            $req_lists['data'][$key]['complete_tasks']['data']   = $complete;
            
        }
        
        return $req_lists;
    }

    public function activities( WP_REST_Request $request ) {

        $current_page = $request->get_param( 'activityPage' );
        $task_id = $request->get_param( 'task_id' );
        $per_page = 10;

        Paginator::currentPageResolver(function () use ($current_page) {
            return $current_page;
        });

        $activities = Activity::where('resource_id', $task_id)
            ->where( 'resource_type', 'task' )
            ->orderBy( 'created_at', 'DESC' )
            ->paginate( $per_page );

        $activity_collection = $activities->getCollection();
        
        $resource = new Collection( $activity_collection, new Activity_Transformer );
        $resource->setPaginator( new IlluminatePaginatorAdapter( $activities ) );
        

        return $this->get_response( $resource );
    }
}


