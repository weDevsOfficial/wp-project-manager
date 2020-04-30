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
use WeDevs\PM\Task\Transformers\New_Task_Transformer;
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
use WeDevs\PM\Task_List\Transformers\New_Task_List_Transformer;
use WeDevs\PM\Task_List\Transformers\List_Task_Transformer;
use WeDevs\PM\Activity\Models\Activity;
use WeDevs\PM\Activity\Transformers\Activity_Transformer;
use WeDevs\PM\Task_List\Controllers\Task_List_Controller as Task_List_Controller;
use WeDevs\PM\Task\Observers\Task_Observer;


class Task_Controller {

    use Transformer_Manager, Request_Filter, Last_activity;


    private static $_instance;

    public static function getInstance() {
        if ( !self::$_instance ) {
            self::$_instance = new self();
        }

        return self::$_instance;
    }

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
        return $this->get_task( $task_id, $project_id, $request->get_params() );
    }

    public static function get_task( $task_id, $project_id = false, $request=[] ) {

        $task = Task::with( 'task_lists' )
            ->where( 'id', $task_id )
            ->parent();

        if ( $project_id ) {
            $task = $task->where( 'project_id', $project_id );
            
        }
        
        $task = apply_filters( 'pm_task_show_query', $task, $project_id, $request );
        $task = $task->first();

        if ( $task == NULL ) {
            return pm_get_response( null,  [
                'message' => pm_get_text('success_messages.no_element')
            ] );
        }
        
        $resource = new Item( $task, new Task_Transformer );
        $response = self::getInstance()->get_response( $resource );
        $response = apply_filters('pm_get_task', $response , $request);
        
        return $response ;
    }

    public static function create_task( $data ) {
        $self = self::getInstance();
        $project_id = $data[ 'project_id' ];
        $board_id   = $data[ 'board_id' ];
        $assignees  = $data[ 'assignees' ];
        $is_private = $data[ 'privacy' ];
        $data['is_private']    = $is_private == 'true' || $is_private === true ? 1 : 0;

        if ( empty( $board_id ) ) {
            $inbox            = pm_get_meta($project_id, $project_id, 'task_list', 'list-inbox');
            $board_id         = $inbox->meta_value;
            $data['board_id'] = $inbox->meta_value;
        }

        $project       = Project::find( $project_id );
        $board         = Board::find( $board_id );

        if ( $project ) {
            $data = apply_filters( 'pm_before_create_task', $data, $board_id, $data );
            $task = Task::create( $data );
        }

        do_action( 'cpm_task_new', $board_id, $task->id, $data );
        do_action('pm_after_update_task', $task, $data );

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
            $self->attach_assignees( $task, $assignees );
        }
        do_action( 'cpm_after_new_task', $task->id, $board_id, $project_id );
        do_action('pm_after_create_task', $task, $data );

        $resource = new Item( $task, new Task_Transformer );


        $message = [
            'message' => pm_get_text('success_messages.task_created'),
            'activity' => $self->last_activity( 'task', $task->id ),
        ];

        $response = $self->get_response( $resource, $message );

        do_action('pm_create_task_aftre_transformer', $response, $data );

        return $response;
    }

    public function store( WP_REST_Request $request ) {
        $data          = $this->extract_non_empty_values( $request );
        $project_id    = $request->get_param( 'project_id' );
        $board_id      = $request->get_param( 'board_id' );
        $assignees     = $request->get_param( 'assignees' );
        $is_private    = $request->get_param( 'privacy' );
        $data['is_private']    = $is_private == 'true' || $is_private === true ? 1 : 0;

        if ( empty( $board_id ) ) {
            $inbox            = pm_get_meta($project_id, $project_id, 'task_list', 'list-inbox');
            $board_id         = $inbox->meta_value;
            $data['board_id'] = $inbox->meta_value;
        }

        $project       = Project::find( $project_id );
        $board         = Board::find( $board_id );

        if ( $project ) {
            $data = apply_filters( 'pm_before_create_task', $data, $board_id, $request );
            $task = Task::create( $data );
        }

        do_action( 'cpm_task_new', $board_id, $task->id, $request->get_params() );
        // do_action('pm_after_update_task', $task, $request->get_params() );

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
            'activity' => $this->last_activity( 'task', $task->id ),
        ];

        $response = $this->get_response( $resource, $message );

        do_action('pm_create_task_aftre_transformer', $response, $request->get_params() );

        return $response;
    }

    public function attach_assignees( Task $task, $assignees = [] ) {

        do_action('pm_before_assignees', $task, $assignees );

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

            if ( ! $assignee->assigned_at ) {
                $assignee->assigned_at = Carbon::now();
                $assignee->save();
            }
        }

        do_action('pm_after_assignees', $task, $assignees );
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

        return $this->task_update( $request->get_params() );
    }

    public static function task_update( $params ) {
        $task_id    = $params['task_id'];

        $task = Task::with('assignees')->find( $task_id );

        if ( ! isset( $params['assignees'] ) ) {
            $assignees  = wp_list_pluck( $task->assignees->toArray(), 'assigned_to' );
        } else {
            $assignees  = empty( $params['assignees'] ) ? [] : $params['assignees'];
        }

        $list_id              = $task->task_list;
        $project_id           = $task->project_id;
        $params['project_id'] = $task->project_id;
        $params['list_id']    = $task->task_list;
        $is_private           = isset( $params['privacy'] ) ? $params['privacy'] : false;
        $params['is_private'] = $is_private == 'true' || $is_private === true ? 1 : 0;

        $deleted_users = $task->assignees()->whereNotIn( 'assigned_to', $assignees )->get()->toArray(); //->delete();
        $deleted_users = apply_filters( 'pm_task_deleted_users', $deleted_users, $task );
        $deleted_users = wp_list_pluck( $deleted_users, 'id' );

        if ( $deleted_users ) {
            Assignee::destroy( $deleted_users );
        }

        self::getInstance()->attach_assignees( $task, $assignees );

        do_action( 'cpm_task_update', $list_id, $task_id, $params );

        $params = apply_filters( 'pm_before_update_task', $params, $list_id, $task_id, $task );
        $task->update_model( $params );

        do_action( 'cpm_after_update_task', $task->id, $list_id, $project_id );
        do_action('pm_after_update_task', $task, $params );

        $resource = new Item( $task, new Task_Transformer );

        $message = [
            'message' => pm_get_text('success_messages.task_updated'),
            'activity' => self::getInstance()->last_activity( 'task', $task->id ),
        ];

        $response = self::getInstance()->get_response( $resource, $message );

        do_action('pm_update_task_aftre_transformer', $response, $params );

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

        do_action( 'pm_before_change_task_status', $task );

        if ( $task->save() ) {
            $this->update_task_status( $task );
            $this->task_activity_comment($task, $status);
        }

        do_action( 'mark_task_complete', $task->project_id, $task->id );
        do_action( 'pm_changed_task_status', $task, $old_value, $request->get_params() );

        $resource = new Item( $task, new Task_Transformer );

        $message = [
            'message' => pm_get_text('success_messages.task_updated'),
            'activity' => $this->last_activity( 'task', $task->id ),
        ];

        $response = $this->get_response( $resource, $message );

        do_action('pm_changed_task_status_aftre_transformer', $response, $request->get_params() );

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

    public static function delete_task( $data ) {
        $self = self::getInstance();
        $project_id = $data['project_id'];
        $task_id    = $data['task_id'];

        // Select the task
        $task = Task::where( 'id', $task_id )
            ->where( 'project_id', $project_id )
            ->first();

        $resource = new Item( $task, new Task_Transformer );
        $resource = $this->get_response( $resource );
        $list_id  = $resource['data']['task_list_id'];

        do_action( "pm_before_delete_task", $task, $data );
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

        $list = ( new Task_List_Controller )->get_list( [
            'project_id'   => $project_id,
            'task_list_id' => $list_id
        ] );

        do_action( 'cpm_delete_task_after', $task_id, $project_id );
        do_action( 'pm_after_delete_task', $task_id, $project_id );

        $message = [
            'message' => pm_get_text('success_messages.task_deleted'),
            'activity' => $self->last_activity( 'task', $task->id ),
            'task'     => $resource,
            'list'     => $list
        ];

        return $this->get_response( $resource, $message ); 
    }
    public function destroy( WP_REST_Request $request ) {
        // Grab user inputs
        $project_id = $request->get_param( 'project_id' );
        $task_id    = $request->get_param( 'task_id' );

        // Select the task
        $task = Task::where( 'id', $task_id )
            ->where( 'project_id', $project_id )
            ->first();

        $resource = new Item( $task, new Task_Transformer );
        $resource = $this->get_response( $resource );
        $list_id  = $resource['data']['task_list_id'];
        
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

        $list = ( new Task_List_Controller )->get_list( [
            'project_id'   => $project_id,
            'task_list_id' => $list_id
        ] );

        do_action( 'cpm_delete_task_after', $task_id, $project_id );
        do_action( 'pm_after_delete_task', $task_id, $project_id );

        $message = [
            'message'  => pm_get_text('success_messages.task_deleted'),
            'activity' => $this->last_activity( 'task', $task->id ),
            'task'     => $resource,
            'list'     => $list
        ];

        return array_merge( $resource, $message );
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
        $task = Task::find( $task_id );
        $task->update_model( [
            'is_private' => $privacy
        ] );
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

        $list = ( new Task_List_Controller )->get_list( [
            'project_id'   => $project_id,
            'task_list_id' => $list_id
        ] );

        $sender_list = ( new Task_List_Controller )->get_list( [
            'project_id'   => $project_id,
            'task_list_id' => $sender_list_id
        ] );

        wp_send_json_success( [
            'task'           => $task,
            'sender_list_id' => $sender_list_id,
            'list_id'        => $list_id,
            'project_id'     => $project_id,
            'receive_list'           => $list,
            'sender_list'    => $sender_list
        ] );
    }

    function filter_query( $request ) {

        global $wpdb;

        $status       = $request->get_param('status');
        //$board_status = $request->get_param('board_status');
        $due_date     = $request->get_param('dueDate');
        $assignees    = $request->get_param('users');
        $lists        = $request->get_param('lists');
        $project_id   = $request->get_param('project_id');
        $title        = $request->get_param('title');
        $tb_lists     = pm_tb_prefix() . 'pm_boards';


        $task_lists = Task_List::select( $tb_lists.'.*' )->with(
            [
                'tasks' => function($q) use( $status, $due_date, $assignees, $project_id, $title ) {
                    if ( ! empty( $title ) ) {
                        $q->where('title', 'like', "%{$title}%");
                    }

                    $q->where('project_id', $project_id);

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

                    $q = apply_filters( 'pm_task_filter_query', $q, $project_id );
                }
            ]
        )
        ->whereHas('tasks', function($q) use( $status, $due_date, $assignees, $project_id, $title ) {
                if ( ! empty( $title ) ) {
                    $q->where('title', 'like', "%{$title}%");
                }
                $q->where('project_id', $project_id);

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

                $q = apply_filters( 'pm_task_filter_query', $q, $project_id );

            }
        )
        ->where(function($q) use( $lists ) {
            if( !empty( $lists ) && !empty( $lists[0] ) ) {
                if( is_array( $lists ) && $lists[0] != 0 ) {
                    $q->whereIn( pm_tb_prefix() . 'pm_boards.id', $lists );
                } else if ( !is_array( $lists ) &&  $lists != 0 ) {
                    $q->where( pm_tb_prefix() . 'pm_boards.id', $lists );
                }
            }
        })
        ->where( pm_tb_prefix() . 'pm_boards.status', 1 )
        ->where( pm_tb_prefix() . 'pm_boards.project_id', $project_id)
        ->orderBy( pm_tb_prefix() . 'pm_boards.order', 'DESC' );

        return apply_filters( 'pm_check_task_filter_list_permission', $task_lists, $request );
    }

    public function filter( WP_REST_Request $request ) {
        $per_page     = pm_get_setting( 'list_per_page' );
        $per_page     = empty( $per_page ) ? 20 : $per_page;

        $it_per_page   = pm_get_setting( 'incomplete_tasks_per_page' );
        $it_per_page   = empty( $per_page ) ? 20 : intval( $per_page );

        $ct_per_page   = pm_get_setting( 'complete_tasks_per_page' );
        $ct_per_page   = empty( $per_page ) ? 20 : intval( $per_page );

        $page         = $request->get_param('page');
        $project_id   = $request->get_param('project_id');

        Paginator::currentPageResolver(function () use ($page) {
            return $page;
        });

        $task_lists = $this->filter_query( $request );

        $task_lists = $task_lists->paginate( $per_page );
        $collection = $task_lists->getCollection();

        $list_ids   = [];
        $task_ids   = [];

        //get all list ids and tasks ids in individual array
        foreach ( $collection as $key => $task_list ) {
            $list_ids[] = $task_list->id;

            foreach ( $task_list->tasks as $key => $task_item ) {
                $task_ids[] = $task_item->id;
            }
        }

        $filter = [
            'status' => $request->get_param('status'),
            'due_date' =>  $request->get_param('dueDate'),
            'users' => $request->get_param('users'),
            'title' => $request->get_param('title')
        ];

        //get total complete and incomplete tasks count
        $lists_tasks_count = ( new Task_List_Controller )->get_lists_tasks_count( $list_ids, $project_id, $filter );

        foreach ( $collection as $key => $collection_data ) {
            $collection_data->lists_tasks_count = empty( $lists_tasks_count[$collection_data->id] ) ? [] : $lists_tasks_count[$collection_data->id];
        }

        $resource = new Collection( $collection, new New_Task_List_Transformer );
        $resource->setPaginator( new IlluminatePaginatorAdapter( $task_lists ) );

        $lists = $this->get_response( $resource );
        $tasks = $this->get_tasks( $task_ids );

        $merge = [];

        foreach ( $tasks['data'] as $tk => $task ) {
            $list_id = $task['task_list_id'];

            if ( $task['status'] == 'incomplete' ) {
                $merge[$list_id]['incomplete_tasks'][] = $task;
            }

            if ( $task['status'] == 'complete' ) {
                $merge[$list_id]['complete_tasks'][] = $task;
            }
        }

        foreach ( $lists['data'] as $key => $list ) {
            $id = $list['id'];

            if ( ! empty( $merge[$id] ) ) {
                $lists['data'][$key]['incomplete_tasks']['data'] = ! empty( $merge[$id]['incomplete_tasks'] ) ? $merge[$id]['incomplete_tasks'] : [];
                $lists['data'][$key]['complete_tasks']['data'] = ! empty( $merge[$id]['complete_tasks'] ) ? $merge[$id]['complete_tasks'] : [];
            }
        }

        return $lists;
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

    public function transform_tasks( $tasks ) {
        $transform_tasks = new Collection( $tasks, new New_Task_Transformer );
        $all_tasks = $this->get_response( $transform_tasks );
        return apply_filters( 'pm_after_transformer_list_tasks', $all_tasks );
    }

    public function get_tasks_meta( $tasks_ids = [] ) {
        global $wpdb;

        if ( empty( $tasks_ids ) ) {
            $tasks_ids[] = 0;
        }

        $comment      = pm_tb_prefix() . 'pm_comments';
        $assignees    = pm_tb_prefix() . 'pm_assignees';
        $tb_tasks     = pm_tb_prefix() . 'pm_tasks';
        $tb_lists     = pm_tb_prefix() . 'pm_boards';
        $tb_boardable = pm_tb_prefix() . 'pm_boardables';
        $tb_meta      = pm_tb_prefix() . 'pm_meta';
        $task_ids     = implode( ',', $tasks_ids );

        $tasks = "SELECT tk.id,
                GROUP_CONCAT(
                    DISTINCT
                    CONCAT(
                        '{',
                            '\"', 'assigned_to', '\"', ':' , '\"', IFNULL(asgn.assigned_to, '') , '\"' , ',',
                            '\"', 'assigned_at', '\"', ':' , '\"', IFNULL(asgn.assigned_at, '') , '\"' , ',',
                            '\"', 'completed_at', '\"', ':' , '\"', IFNULL(asgn.completed_at, '') , '\"' , ',',
                            '\"', 'started_at', '\"', ':' , '\"', IFNULL(asgn.started_at, '') , '\"' , ',',
                            '\"', 'status', '\"', ':' , '\"', IFNULL(asgn.status, '') , '\"'
                        ,'}'
                    ) SEPARATOR '|'
                ) as assignees,

                count(cm.id) as total_comment

            FROM $tb_tasks as tk
            LEFT JOIN $comment as cm ON tk.id=cm.commentable_id AND cm.commentable_type = 'task'
            LEFT JOIN $assignees as asgn ON tk.id=asgn.task_id
            where
            tk.id In ($task_ids)
            GROUP BY tk.id";


        $results = $wpdb->get_results( $tasks );

        $returns = [];

        foreach ( $results as $key => $result ) {
            $users = [];

            if ( ! empty( $result->assignees ) ) {
                $user_assigns = explode( '|', $result->assignees );

                foreach ( $user_assigns as $assingne => $user_assign ) {
                    $users[] = json_decode( $user_assign );
                }
            }

            $result->assignees = $users;
            $returns[$result->id] = $result;
        }

        return $returns;
    }

    public function get_incomplete_task_ids( $list_ids, $project_id, $not_in_tasks = [] ) {
        global $wpdb;

        if ( empty( $list_ids ) ) {
            $list_ids[] = 0;
        }

        $per_page_count    = isset( $_GET['incomplete_task_page'] ) ? intval( $_GET['incomplete_task_page'] ) : false;

        $table_ba   = $wpdb->prefix . 'pm_boardables';
        $table_task = $wpdb->prefix . 'pm_tasks';

        $per_page   = pm_get_setting( 'incomplete_tasks_per_page' );
        $per_page   = empty( $per_page ) ? 20 : intval( $per_page );

        if ( intval( $per_page_count ) ) {
            $start = $per_page_count-1;
        } else {
            $start = 0;
        }

        $list_ids         = implode(',', $list_ids );
        $permission_join  = apply_filters( 'pm_incomplete_task_query_join', '', $project_id );
        $where = apply_filters( 'pm_incomplete_task_query_where', '', $project_id );

        if ( ! empty( $not_in_tasks ) ) {
            $not_in_tasks = implode( ',', $not_in_tasks );
            $where .= " AND itasks.id NOT IN ({$not_in_tasks})";
        }

        $sql = "SELECT ibord_id, GROUP_CONCAT( DISTINCT task.task_id order by task.iorder DESC) as itasks_id
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
                        $permission_join
                    WHERE
                        itasks.status=0
                        AND ibord.board_type='task_list'
                        AND ibord.boardable_type='task'
                        $where
                        order by iorder asc

                ) as task

            group by ibord_id";

        $results = $wpdb->get_results( $sql );

        if ( $per_page_count != -1 ) {
            $results = $this->set_pagination( $results, $start, $per_page );
        }

        $task_ids = wp_list_pluck( $results, 'itasks_id' );
        $task_ids = implode( ',', $task_ids );

        return explode(',', $task_ids);
    }

    private function set_pagination( $results, $start, $per_page ) {

        foreach ( $results as $key => $result ) {
            $ids = explode( ',', $result->itasks_id );
            $ids = array_chunk( $ids, $per_page );
            $chunk = '';

            if ( isset( $ids[$start] ) ) {
                $chunk = implode( ',', $ids[$start] );
            }

            $result->itasks_id = empty( $chunk ) ? '' : $chunk;
        }

        return $results;
    }

    public function get_complete_task_ids( $list_ids, $project_id, $not_in_tasks = [] ) {
        global $wpdb;

        if ( empty( $list_ids ) ) {
            $list_ids[] = 0;
        }

        $per_page_count    = isset( $_GET['complete_task_page'] ) ? intval( $_GET['complete_task_page'] ) : false;

        $table_ba         = $wpdb->prefix . 'pm_boardables';
        $table_task       = $wpdb->prefix . 'pm_tasks';

        $per_page         = pm_get_setting( 'complete_tasks_per_page' );
        $per_page   = empty( $per_page ) ? 20 : intval( $per_page );

        if ( intval( $per_page_count ) ) {
            $start = $per_page_count-1;
        } else {
            $start = 0;
        }

        $list_ids         = implode(',', $list_ids );
        $permission_join  = apply_filters( 'pm_complete_task_query_join', '', $project_id );
        $where = apply_filters( 'pm_complete_task_query_where', '', $project_id );

        if ( ! empty( $not_in_tasks ) ) {
            $not_in_tasks = implode( ',', $not_in_tasks );
            $where .= " AND itasks.id NOT IN ({$not_in_tasks})";
        }

        $sql = "SELECT ibord_id, GROUP_CONCAT( DISTINCT task.task_id order by task.iorder DESC) as itasks_id
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
                        $permission_join
                    WHERE
                        itasks.status=1
                        AND ibord.board_type='task_list'
                        AND ibord.boardable_type='task'
                        $where
                        order by iorder asc

                ) as task

            group by ibord_id";

        $results = $wpdb->get_results( $sql );

        if ( $per_page_count != -1 ) {
            $results = $this->set_pagination( $results, $start, $per_page );
        }

        $task_ids = wp_list_pluck( $results, 'itasks_id' );
        $task_ids = implode( ',', $task_ids );

        return explode(',', $task_ids);

    }

    public function get_tasks( $task_ids, $args=[] ) {
        global $wpdb;

        foreach ( (array) $task_ids as $key => $task_id ) {
            if ( empty( intval( $task_id ) ) ) {
                unset( $task_ids[$key] );
            }
        }

        $default = [
            'list_task_transormer_filter' => true
        ];

        $args = wp_parse_args( $args, $default );

        if ( empty( $task_ids ) ) {
            $task_ids[] = 0;
        }

        $task      = pm_tb_prefix() . 'pm_tasks';
        $list      = pm_tb_prefix() . 'pm_boardables';
        $comment   = pm_tb_prefix() . 'pm_comments';
        $assignees = pm_tb_prefix() . 'pm_assignees';

        $task_collection = Task::select( $task . '.*')
            ->selectRaw(
                "GROUP_CONCAT(
                    DISTINCT
                    CONCAT(
                        '{',
                            '\"', 'assigned_to', '\"', ':' , '\"', IFNULL($assignees.assigned_to, '') , '\"' , ',',
                            '\"', 'assigned_at', '\"', ':' , '\"', IFNULL($assignees.assigned_at, '') , '\"' , ',',
                            '\"', 'completed_at', '\"', ':' , '\"', IFNULL($assignees.completed_at, '') , '\"' , ',',
                            '\"', 'started_at', '\"', ':' , '\"', IFNULL($assignees.started_at, '') , '\"' , ',',
                            '\"', 'status', '\"', ':' , '\"', IFNULL($assignees.status, '') , '\"'
                        ,'}'
                    ) SEPARATOR '|'
                ) as assignees"
            )
            ->selectRaw( "count($comment.id) as total_comment" )
            ->whereIn( $task . '.id', $task_ids )

            ->leftJoin( $list, function( $join ) use($task, $list) {
                $join->on( $task . '.id', '=', $list . '.boardable_id' );
            })
            ->leftJoin( $comment, function( $join ) use($task, $comment) {
                $join->on( $task . '.id', '=', $comment . '.commentable_id' )
                    ->where($comment . '.commentable_type', 'task');
            })
            ->leftJoin( $assignees, function( $join ) use($task, $assignees) {
                $join->on( $task . '.id', '=', $assignees . '.task_id' );
            })

            ->groupBy( $task . '.id' )
            ->orderBy( $list . '.order', 'DESC' );

        $task_collection = apply_filters( 'list_tasks_filter_query', $task_collection, $args );

        $task_collection = $task_collection->get();

        $task_transformer = new List_Task_Transformer();
        $task_transformer->list_task_transormer_filter = $args['list_task_transormer_filter'];

        $resource = new collection( $task_collection, $task_transformer );
        $tasks    = $this->get_response( $resource );
        $tasks    = apply_filters( 'pm_after_transformer_list_tasks', $tasks, $task_ids );

        return $tasks;
    }

    public function duplicate( WP_REST_Request $request ) {
        $task_id    = $request->get_param( 'task_id' );
        
        $task           = $this->get_task( $task_id );
        $list_id        = $task['data']['task_list_id'];
        $task           = Task::find( $task_id );
        $task->title    = __( 'Copy ', 'wedevs-project-manager' ) . $task->title;
        $project_id     = $task->project_id;
        $duplicate_task = $this->task_duplicate( $task, $list_id, $project_id );
        $new_task       = $this->get_task( $duplicate_task->id );

        do_action( 'pm_after_task_duplicate', $new_task, $task  );

        wp_send_json_success( 
            [
                'task'       => $new_task['data'],
                'list_id'    => $list_id,
                'project_id' => $project_id,

            ] 
        );
    }

    public function task_duplicate ( Task $task, $list_id = false, $project_id = false  ) {
        $task_data      = [];
        $boardable_data = [];
        $assignee_data  = [];
        $meta_data      = [];

        if ( $project_id ) {
            $task_data    ['project_id'] = $project_id;
            $assignee_data['project_id'] = $project_id;
            $meta_data    ['project_id'] = $project_id;
        }

        $newTask = $this->replicate( $task, $task_data );

        $meta = [
            'task_title' => $newTask->title,
        ];

        Task_Observer::log_activity( $newTask, 'create_task', 'create', $meta );

        // Include task and task list
        $boardable_data['boardable_id'] = $newTask->id;
        $assignee_data ['task_id']      = $newTask->id;
        $meta_data     ['entity_id']    = $newTask->id;

        if ( $list_id ) {
            $boardable_data['board_id'] = $list_id;
        }

        foreach ( $task->boardables as $boardable ) {
            $newBoardables = $this->replicate( $boardable, $boardable_data );
        }

        // Duplicate Assignee in this task

        foreach ( $task->assignees as $assignee ) {
            $newAssignee = $this->replicate( $assignee, $assignee_data );
        }

        foreach ( $task->metas as $meta ) {
            $newMeta = $this->replicate( $meta, $meta_data );
        }

        do_action( 'cpm_task_duplicate_after', $newTask->id, $list_id, $project_id );
        do_action( 'pm_task_duplicate_after', $newTask->id, $list_id, $project_id, $task );

        return $newTask;
    }

    private function replicate( $model, $newValues=null, $fireEvents=false) {
        $newModel = $model->replicate()->setRelations([]);

        if ( $newValues !== null && is_array( $newValues ) ) {
            foreach ($newValues as $key => $value) {
                $newModel->{$key} = $value;
            }
        }

        if ( !$fireEvents ) {
            $newModel->unsetEventDispatcher();
        }

        if ( $newModel->save() ) {
            return $newModel;
        }
    }

    public function load_more_tasks( WP_REST_Request $request ) {
        $list_id    = $request->get_param( 'list_id' );
        $task_ids   = $request->get_param( 'task_ids' );
        $project_id = $request->get_param( 'project_id' );
        $status     = $request->get_param( 'status' );

        if ( (int) $status ) {
            $task_ids = $this->get_complete_task_ids( [$list_id], $project_id, $task_ids );   
        } else {
            $task_ids = $this->get_incomplete_task_ids( [$list_id], $project_id, $task_ids );   
        }
        
        $tasks = pm_get_tasks( [ 'id' => $task_ids ] );

        wp_send_json_success(
            [
                'project_id' => $project_id,
                'list_id'    => $list_id,
                'tasks'      => $tasks,
                'status'     => (int) $status
            ]
        );
    }
}

