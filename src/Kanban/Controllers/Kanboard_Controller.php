<?php
namespace WeDevs\PM\Kanban\Controllers;

use Reflection;
use WP_REST_Request;
use League\Fractal;
use League\Fractal\Resource\Item as Item;
use League\Fractal\Resource\Collection as Collection;
use League\Fractal\Pagination\IlluminatePaginatorAdapter;
use WeDevs\PM\Common\Traits\Transformer_Manager;
use WeDevs\PM\Project\Models\Project;
use WeDevs\PM\Common\Models\Boardable;
use WeDevs\PM\Common\Traits\Request_Filter;
use Carbon\Carbon;
use WeDevs\PM\Task\Models\Task;
use WeDevs\PM\Kanban\Models\Kanboard;
use WeDevs\PM\Kanban\Transformers\Kanboard_Transformer;
use WeDevs\PM\Kanban\Models\Kanboard_Boardable;
use Illuminate\Database\Capsule\Manager as Capsule;
use WeDevs\PM\Task\Transformers\Task_Transformer;
use Illuminate\Pagination\Paginator;
use WeDevs\PM\Task\Controllers\Task_Controller;
use WeDevs\PM\Common\Models\Assignee;
use WeDevs\PM\Task_List\Transformers\List_Task_Transformer;
use WeDevs\PM\Task\Helper\Task as Task_Helper;


class Kanboard_Controller {

    use Transformer_Manager, Request_Filter;

    private static $_instance;

    public static function getInstance() {
        if ( !self::$_instance ) {
            self::$_instance = new self();
        }

        return self::$_instance;
    }

    public function index( WP_REST_Request $request ) {
        $project_id = $request->get_param( 'project_id' );

        if ( !$this->hsaDefautlBoard( $project_id ) ) {
            $default_bords = $this->setDefaultBoard( $project_id );
        }

        $boards = Kanboard::with('meta')
            ->where('project_id', $project_id)
            ->where( 'type', 'kanboard' )
            ->orderBy( 'order', 'ASC' )
            ->get();

        $resource = new Collection( $boards, new Kanboard_Transformer );

        return $this->get_response( $resource );
    }

    public function store_searchable_task(WP_REST_Request $request) {
        $board_id   = $request->get_param( 'board_id' );
        $project_id = $request->get_param( 'project_id' );
        $task_id    = $request->get_param( 'task_id' );

        $this->store_column_task( $board_id, $project_id, $task_id );

        wp_send_json_success();
    }

    public function store_column_task( $board_id, $project_id, $task_id ) {
        //where('board_id', $board_id)
        $has_task = Boardable::where('board_type', 'kanboard')
            ->where('boardable_id', $task_id)
            ->first();

        if ( ! $has_task ) {

            $data = [
                'board_id'       => $board_id,
                'board_type'     => 'kanboard',
                'boardable_id'   => $task_id,
                'boardable_type' => 'task',
                'order'          => 0
            ];

            Boardable::create($data);

        }

        return [];
    }

    public function hsaDefautlBoard( $project_id ) {
        $default_board = Kanboard::where( 'project_id', $project_id )
            ->where( 'type', 'kanboard' )
            ->get()
            ->toArray();

        if ( ! $default_board ) {
            return false;
        }

        return true;
    }

    function setDefaultBoard( $project_id ) {
        $default = array(
            array(
                'title'      => __( 'Open', 'wedevs-project-manager' ),
                'order'      => 0,
                'type'       => 'kanboard',
                'project_id' => $project_id
            ),

            array(
                'title'       => __( 'In Progress', 'wedevs-project-manager' ),
                'order'      => 1,
                'type'       => 'kanboard',
                'project_id' => $project_id
            ),
            array(
                'title'       => __( 'Done', 'wedevs-project-manager' ),
                'order'      => 2,
                'type'       => 'kanboard',
                'project_id' => $project_id
            ),

            array(

                'title'      => __( 'Overdue', 'wedevs-project-manager' ),
                'order'      => 3,
                'type'       => 'kanboard',
                'project_id' => $project_id
            )
        );

        $default = apply_filters( 'wedevs_pm_kanban_default_boards', $default, $project_id );

        $insert = Kanboard::insert( $default );
    }

    public function show( WP_REST_Request $request ) {
        $board_id       = $request->get_param( 'board_id' );
        $project_id     = $request->get_param( 'project_id' );
        $per_page       = $request->get_param( 'per_page' );
        $per_page       = $per_page ? $per_page : 50;
        $page           = $request->get_param( 'page' );
        $page           = $page ? $page : 1;
        $bortable_table = 'pm_boardables';
        $task_table     = 'pm_tasks';

        Paginator::currentPageResolver(function () use ($page) {
            return $page;
        });

        $tasks = Kanboard::with('tasks')
            ->find($board_id)
            ->tasks();
           // ->getQuery();// Task list can not fetch from task transformer, if you include this line

        $tasks = apply_filters( 'wedevs_pm_task_query', $tasks,  $project_id, $request );
        $tasks = $tasks->paginate( $per_page, ['*'] );

        $task_collection = $tasks->getCollection();

        $resource = new Collection( $task_collection, new Task_Transformer );
        $resource->setPaginator( new IlluminatePaginatorAdapter( $tasks ) );

        return $this->get_response( $resource );
    }


    public function store( WP_REST_Request $request ) {
        $project_id  = $request->get_param( 'project_id' );

        $latest_order = Kanboard::latest_order( $project_id, 'kanboard' );

        $data = [
            'title'      => $request->get_param( 'board_title' ),
            'order'      => $latest_order + 1,
            'type'       => 'kanboard',
            'project_id' => $request->get_param( 'project_id' ),
        ];

        $kanboard = Kanboard::create($data);

        $resource = new Item( $kanboard, new Kanboard_Transformer );
        $message  = [
            'message' => 'New board has been created successfully'
        ];

        return $this->get_response( $resource, $message );
    }


    public function update( WP_REST_Request $request ) {
        $title      = $request->get_param( 'title' );
        $board_id   = $request->get_param( 'board_id' );
        $project_id = $request->get_param( 'project_id' );

        $board = Kanboard::find($board_id );

        if ( ! $board ) {
            return false;
        }

        $data = [
            'title' => $title,
        ];

        $board->update_model( $data );

        $resource = new Item( $board, new Kanboard_Transformer );

        $message = [
            'message' => 'Your traking time was stop successfully'
        ];

        return $this->get_response( $resource, $message );
    }

    public function destroy( WP_REST_Request $request ) {
        $board_id = $request->get_param( 'board_id' );
        $project_id = $request->get_param( 'project_id' );

        // Select the time
        $board = Kanboard::where( 'id', $board_id )
            ->first();

        $this->delete_all_relation($board);

        $board->delete();

        //$task = Task::find( $task_id );
        //$resource = new Item( $task, new Task_Transformer );

        $message = [
            'message' => 'Time log deleted successfully'
        ];

        return $this->get_response(null, $message);
    }

    function delete_all_relation(Kanboard $board) {
        $board->boardables()->delete();
    }

    function board_order( WP_REST_Request $request ) {
        $board_orders = $request->get_param('board_orders');
        $project_id = $request->get_param('project_id');

        foreach ( $board_orders as $key => $value) {
            Kanboard::where( 'project_id', $project_id )
                ->where( 'type', 'kanboard' )
                ->where( 'id', $value['section_id'] )
                ->update( ['order' => $value['order']] );
        }

        wp_send_json_success();
    }

    function task_order( WP_REST_Request $request ) {

        $is_move         = $request->get_param('is_move');
        $board_id        = $request->get_param('section_id');
        $sender_board_id = $request->get_param('sender_section_id');
        $task_ids        = $request->get_param('task_ids');
        $project_id      = $request->get_param('project_id');
        $task_id         = $request->get_param('dragabel_task_id');

        if ( $is_move == 'yes' ) {
            $from_sender_board = Boardable::where('board_id', $sender_board_id)
                ->where('board_type', 'kanboard')
                ->where('boardable_type', 'task')
                ->whereIn('boardable_id', $task_ids)
                ->get()
                ->toArray();

            foreach ( $from_sender_board as $key => $board ) {
                Boardable::where('id', $board['id'])
                    ->update(['board_id' => $board_id]);
            }

            $this->check_automation( $request->get_params() );
        } else {

            foreach ( $task_ids as $order_key => $task_id ) {

                $boardable = Boardable::where('board_id', $board_id)
                    ->where('board_type', 'kanboard')
                    ->where('boardable_type', 'task')
                    ->where('boardable_id', $task_id)
                    ->first();

                if ( $boardable ) {
                    $boardable->update(['order' => $order_key]);
                }
            }
        }

        wp_send_json_success([
            'drag_task' => Task_Controller::get_task( $task_id, $project_id )
        ]);
    }
    /**
     * When task drop one column to another column for changing their status
     */
    function check_automation( $params ) {
        $project_id = $params['project_id'];
        $board_id   = $params['section_id'];
        $task_id    = $params['dragabel_task_id'];

        $meta = \WeDevs\PM\Common\Models\Meta::where( 'project_id', $project_id )
            ->where( 'entity_type',  'kanboard' )
            ->where( 'meta_key', 'automation' )
            ->where( 'entity_id', $board_id )
            ->first();

        if ( ! $meta ) {
            return;
        }

        $meta_value = $meta['meta_value'];

        if ( $meta['project_id'] != $project_id ) {
            return;
        }

        if ( isset( $params['is_move'] ) && $params['is_move'] == 'yes' ) {
            if ( ! empty( $meta_value['users'] ) ) {
                $users_id = wp_list_pluck( $meta_value['users'], 'id' );

                $prev_users = Assignee::select('assigned_to')
                    ->where('task_id', $task_id)
                    ->where('project_id', $project_id)
                    ->get()
                    ->toArray();

                $prev_users = wp_list_pluck( $prev_users, 'assigned_to' );

                $users_id = array_unique( array_merge( $users_id, $prev_users ) );

                $task = [
                    'task_id'    => $task_id,
                    'assignees'  => $users_id
                ];

                Task_Controller::task_update( $task );
            }

            if ( $meta_value['taskStatus'] == 'completed' ) {

                $task = [
                    'task_id' => $task_id,
                    'status'  => 1
                ];

                Task_Controller::task_update( $task );
            }

            if ( $meta_value['taskStatus'] == 'incomplete' ) {

                $task = [
                    'task_id' => $task_id,
                    'status'  => 0
                ];

                Task_Controller::task_update( $task );
            }
        }
    }

    function delte_task( WP_REST_Request $request ) {
        $board_id = $request->get_param('board_id');
        $task_id = $request->get_param('task_id');

        $boardable = Boardable::where('board_id', $board_id)
            ->where('board_type', 'kanboard')
            ->where('boardable_type', 'task')
            ->where('boardable_id', $task_id)
            ->first();

        if ( $boardable ) {
            $boardable->delete();
        }

        return $this->get_response( null );
    }

    function list_view_type( WP_REST_Request $request ) {
        $user_id = get_current_user_id();
        $view_type = $request->get_param('view_type');
        $project_id = $request->get_param('project_id');

        wedevs_pm_update_meta( $user_id, $project_id, 'list_view', 'list_view_type', $view_type );

        return $this->get_response(null);
    }

    static function after_new_comment( $response, $params ) {
        return $response;
        if( $params['commentable_type'] == 'task' ) {

            $project_id = empty( $params['project_id'] ) ? 0 : intval( $params['project_id'] );
            $task_id = $params['commentable_id'];

            $metas = \WeDevs\PM\Common\Models\Meta::where( 'project_id', $project_id )
                ->where( 'entity_type',  'kanboard' )
                ->where( 'meta_key', 'automation' )
                ->get()
                ->toArray();

            foreach ( $metas as $key => $meta ) {
                $meta_value = $meta['meta_value'];
                $type = empty( $meta_value['type'] ) ? false : $meta_value['type'];

                if ( $type != 'in_progress' ) {
                    continue;
                }

                $column_id = $meta['entity_id'];
                $meta_project = $meta['project_id'];
                $meta_value['users'] = empty( $meta_value['users'] ) ? [] : $meta_value['users'];

                if ( $meta_project == $project_id ) {
                    $has_task = Boardable::where('board_id', '!=', $column_id)
                        ->where('board_type', 'kanboard')
                        ->where('boardable_id', $task_id)
                        ->first();

                    if( $has_task ) {
                        $has_task->delete();
                    }

                    self::getInstance()->store_column_task( $column_id, $project_id, $task_id );
                    self::getInstance()->automaiton_add_users( $meta_value['users'], $task_id, $project_id );
                }
            }

        }
    }

    function automation( WP_REST_Request $request ) {
        $project_id = $request->get_param('project_id');
        $board_id = $request->get_param('board_id');
        $postdata = $request->get_param('data');
        $postdata = maybe_serialize( $postdata );

        $validation = $this->automation_validation_before_save( $request->get_params() );

        if ( is_wp_error( $validation ) ) {
            return new \WP_REST_Response([
                'success' => false,
                'message' => $validation->get_error_message(),
            ], 400);
        }

        wedevs_pm_update_meta( $board_id, $project_id, 'kanboard', 'automation', $postdata );

        $this->set_automation_default_items( $request->get_params() );

        return $this->get_response(null);
    }

    public function automation_validation_before_save( $postData ) {
        $project_id = $postData['project_id'];
        $column_id = $postData['board_id'];

        $metas = \WeDevs\PM\Common\Models\Meta::where( 'project_id', $project_id )
            ->where( 'entity_type',  'kanboard' )
            ->where( 'meta_key', 'automation' )
            ->get()
            ->toArray();

        $data = $postData['data'];
        //pmpr($data, $metas); die();
        if ( $data['type'] == 'todo' ) {
            if ( $data['todo']['section'] == 'newlyadded' ) {
                foreach ( $metas as $key => $meta ) {

                    if( $column_id == $meta['entity_id'] ) {
                        continue;
                    }

                    if ( $meta['meta_value']['type'] == 'todo' ) {

                        if ( $meta['meta_value']['todo']['section'] == 'lists' ) {
                            if ( !empty( $meta['meta_value']['todo']['lists'] ) ) {
                                return new \WP_Error( 'newlyadded', __( "Plase remove the 'task lists' item from others column", 'wedevs-project-manager' ) );
                            }
                        }

                        if ( $meta['meta_value']['todo']['section'] == 'newlyadded' ) {
                            return new \WP_Error( 'newlyadded', __( "You have selectd 'Newlyadded' option for others column", 'wedevs-project-manager' ) );
                        }
                    }
                }
            }

            if ( $data['todo']['section'] == 'lists' ) {
                foreach ( $metas as $key => $meta ) {

                    if ( $column_id == $meta['entity_id'] ) {
                        continue;
                    }

                    if ( $meta['meta_value']['type'] == 'todo' ) {

                        if ( $meta['meta_value']['todo']['section'] == 'newlyadded' ) {
                            if ( !empty( $data['todo']['lists'] ) ) {
                                return new \WP_Error( 'newlyadded', __( "Please remove the 'Newlyadded' option from others column", 'wedevs-project-manager' ) );
                            }
                        }

                        if ( $meta['meta_value']['todo']['section'] == 'lists' ) {
                            $db_list_ids = wp_list_pluck( $meta['meta_value']['todo']['lists'], 'id' );
                            $req_list_ids = wp_list_pluck( $data['todo']['lists'], 'id' );

                            $diff = array_intersect($db_list_ids, $req_list_ids);

                            if ( ! empty( $diff ) ) {
                                $common_id = reset( $diff );
                                foreach ( $data['todo']['lists'] as $key => $list ) {
                                    if( $list['id'] == $common_id ) {
                                        return new \WP_Error( 'lists', __( "'" .$list['title']. "' has already assign in others column automation", 'wedevs-project-manager' ) );
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        if ( $data['type'] == 'done' ) {

            foreach ( $metas as $key => $meta ) {
                if( $column_id == $meta['entity_id'] ) {
                    continue;
                }

                if ( $meta['meta_value']['type'] == 'done' ) {

                    if ( $meta['meta_value']['done']['completed'] == $data['done']['completed'] && $data['done']['completed'] != 'false' && !empty($data['done']['completed']) ) {
                        return new \WP_Error( 'done', __( "You have already selected 'completed tasks' in others column", 'wedevs-project-manager' ) );
                    }
                }
            }
        }

        if ( $data['type'] == 'in_progress' ) {

            foreach ( $metas as $key => $meta ) {
                if( $column_id == $meta['entity_id'] ) {
                    continue;
                }

                if ( $meta['meta_value']['type'] == 'in_progress') {

                    if( $meta['meta_value']['inProgress']['reOpened'] == $data['inProgress']['reOpened'] && $data['inProgress']['reOpened'] != 'false' && !empty($data['inProgress']['reOpened']) ) {
                        return new \WP_Error( 'done', __( "You have selectd 'in progress' in others column", 'wedevs-project-manager' ) );
                    }
                }
            }
        }

        if ( $data['taskStatus'] == 'completed' ) {

            foreach ( $metas as $key => $meta ) {
                if( $column_id == $meta['entity_id'] ) {
                    continue;
                }

                // if( $project_id != $meta['project_id'] ) {
                //     continue;
                // }

                if ( $meta['meta_value']['taskStatus'] == 'completed' ) {

                    return new \WP_Error( 'done', __( "You have already selected 'completed task status' in others column", 'wedevs-project-manager' ) );
                }
            }
        }

        if ( $data['taskStatus'] == 'incomplete' ) {

            foreach ( $metas as $key => $meta ) {
                if( $column_id == $meta['entity_id'] ) {
                    continue;
                }

                if ( $meta['meta_value']['taskStatus'] == 'incomplete' ) {

                    return new \WP_Error( 'done', __( "You have already selected 'incomplete task status' in others column", 'wedevs-project-manager' ) );
                }
            }
        }
    }

    function set_automation_default_items( $postData ) {
        $project_id = $postData['project_id'];
        $board_id = $postData['board_id'];

        $tasks = Kanboard::with('tasks')
            ->find( $board_id )
            ->tasks()
            ->get()
            ->toArray();

        foreach ( $tasks as $key => $task ) {
            $params['project_id']       = $project_id;
            $params['section_id']       = $board_id;
            $params['dragabel_task_id'] = $task['id'];
            $params['is_move']          = 'yes';

            $this->check_automation( $params );
        }
    }

    public static function after_create_task( $task, $params ) {
        $project_id = empty( $params['project_id'] ) ? 0 : intval( $params['project_id'] );
        $kan_board_id = empty( $params['kan_board_id'] ) ? false : intval( $params['kan_board_id'] );


        //Create new task from kanboard and change their status
        if ( ! empty( $kan_board_id ) ) {
            $params['project_id']       = $project_id;
            $params['section_id']       = $kan_board_id;
            $params['dragabel_task_id'] = $task->id;
            $params['is_move']          = 'yes';
            self::getInstance()->check_automation( $params );
        }


        $metas = \WeDevs\PM\Common\Models\Meta::where( 'project_id', $project_id )
            ->where( 'entity_type',  'kanboard' )
            ->where( 'meta_key', 'automation' )
            ->get()
            ->toArray();

        foreach ( $metas as $key => $meta ) {
            $meta_value = $meta['meta_value'];
            $type = empty( $meta_value['type'] ) ? false : $meta_value['type'];

            $meta_value['users'] = empty( $meta_value['users'] ) ? [] : $meta_value['users'];

            if ( $type == 'todo' && !$kan_board_id ) {
                //create new task from list view and move them to kanboard
                switch ( $meta_value['todo']['section'] ) {
                    case 'lists':
                        self::automation_new_task_in_list( $task, $params, $meta );
                        //self::getInstance()->automaiton_add_users( $meta_value['users'], $task->id, $project_id );
                        break;

                    case 'newlyadded':
                        self::automation_newlyadded( $task, $params, $meta );
                        //self::getInstance()->automaiton_add_users( $meta_value['users'], $task->id, $project_id );
                        break;
                }
            }

            if ( $type == 'none' && ( $meta['entity_id'] == $kan_board_id ) ) {
                self::getInstance()->automaiton_add_users( $meta_value['users'], $task->id, $project_id );
            }

            if ( $type == 'in_progress' && ( $meta['entity_id'] == $kan_board_id ) ) {
                self::getInstance()->automaiton_add_users( $meta_value['users'], $task->id, $project_id );
            }

            if ( $type == 'done' && ( $meta['entity_id'] == $kan_board_id ) ) {
                self::getInstance()->automaiton_add_users( $meta_value['users'], $task->id, $project_id );
            }

        }
    }

    public function automaiton_add_users( $users, $task_id, $project_id ) {
        if ( ! empty( $users ) ) {
            $users_id = wp_list_pluck( $users, 'id' );

            $prev_users = Assignee::select('assigned_to')
                ->where('task_id', $task_id)
                ->where('project_id', $project_id)
                ->get()
                ->toArray();

            $prev_users = wp_list_pluck( $prev_users, 'assigned_to' );

            $users_id = array_unique( array_merge( $users_id, $prev_users ) );

            $task = [
                'task_id'    => $task_id,
                'assignees'  => $users_id
            ];

            Task_Controller::task_update( $task );
        }
    }

    public static function automation_new_task_in_list( $task, $params, $config ) {
        $meta_value = $config['meta_value'];
        $column_id = $config['entity_id'];
        $lists     = $config['meta_value']['todo']['lists'];
        $list_ids  = wp_list_pluck( $lists, 'id' );
        $list_id   = $params['board_id'];
        $task_id   = $task->id;
        $project_id = $task->project_id;
        $config_project = $config['project_id'];
        $meta_value['users'] = empty( $meta_value['users'] ) ? [] : $meta_value['users'];

        if ( in_array( $list_id, $list_ids ) &&  $config_project == $project_id ) {
            self::getInstance()->store_column_task( $column_id, $project_id, $task_id );
            self::getInstance()->automaiton_add_users( $meta_value['users'], $task_id, $project_id );
        }
    }

    public static function automation_newlyadded( $task, $params, $config ) {
        $column_id = $config['entity_id'];
        $meta_value = $config['meta_value'];
        //$lists     = $config['meta_value']['todo']['lists'];
        //$list_ids  = wp_list_pluck( $lists, 'id' );
        //$list_id   = $params['board_id'];
        $task_id   = $task->id;
        $project_id = $task->project_id;
        $config_project = $config['project_id'];
        $meta_value['users'] = empty( $meta_value['users'] ) ? [] : $meta_value['users'];

        if ( $config_project == $project_id ) {
            self::getInstance()->store_column_task( $column_id, $project_id, $task_id );
            self::getInstance()->automaiton_add_users( $meta_value['users'], $task_id, $project_id );
        }
    }

    /**
     * Task status cange to complete or incomplete from list view and move it kanboard according their status
     */
    public static function before_change_task_status( $task, $old_task, $params ) {

        $project_id = empty( $task->project_id ) ? 0 : intval( $task->project_id );
        $task_id    = $task->id;
        $status     = $task->status;

        // When task mark undone or reopen
        if ( (int) $status === Task::INCOMPLETE ) {

            // Finding in_progress type columna and none type column and add this task
            $metas = \WeDevs\PM\Common\Models\Meta::where( 'project_id', $project_id )
                ->where( 'entity_type',  'kanboard' )
                ->where( 'meta_key', 'automation' )
                ->get()
                ->toArray();

            foreach ( $metas as $key => $meta ) {

                $meta_value          = $meta['meta_value'];
                $type                = empty( $meta_value['type'] ) ? false : $meta_value['type'];
                $meta_project        = $meta['project_id'];
                $meta_value['users'] = empty( $meta_value['users'] ) ? [] : $meta_value['users'];



                if ( $type == 'in_progress' ) {
                    if( $meta['meta_value']['inProgress']['reOpened'] != 'yes' ) {
                        continue;
                    }
                    $in_progress_column_id = $meta['entity_id'];


                    $has_task = Boardable::where('board_id', '!=', $in_progress_column_id)
                        ->where('board_type', 'kanboard')
                        ->where('boardable_id', $task_id)
                        ->first();

                    if( $has_task ) {
                        $has_task->delete();
                    }

                    if ( $meta_project == $project_id ) {

                        self::getInstance()->store_column_task( $in_progress_column_id, $project_id, $task_id );
                        self::getInstance()->automaiton_add_users( $meta_value['users'], $task_id, $project_id );
                    }

                }
            }

            return;

        }

        // When task mark undone or reopen
        if ( (int) $status === Task::COMPLETE ) {

            //When task mark done
            $metas = \WeDevs\PM\Common\Models\Meta::where( 'project_id', $project_id )
                ->where( 'entity_type',  'kanboard' )
                ->where( 'meta_key', 'automation' )
                ->get()
                ->toArray();

            foreach ( $metas as $key => $meta ) {
                $column_id = $meta['entity_id'];
                $meta_value = $meta['meta_value'];
                $type = empty( $meta_value['type'] ) ? false : $meta_value['type'];
                $config_project = $meta['project_id'];


                if ( $type != 'done' ) {
                    continue;
                }

                if (
                    ( $meta_value['done']['completed'] == 'yes' )
                        &&
                    $config_project == $project_id
                )
                {

                    $column_id = $meta['entity_id'];
                    $has_task = Boardable::where('board_id', '!=', $column_id)
                        ->where('board_type', 'kanboard')
                        ->where('boardable_id', $task_id)
                        ->first();

                    if( $has_task ) {
                        $has_task->delete();
                    }

                    $meta_value['users'] = empty( $meta_value['users'] ) ? [] : $meta_value['users'];
                    self::getInstance()->store_column_task( $column_id, $project_id, $task_id );
                    self::getInstance()->automaiton_add_users( $meta_value['users'], $task->id, $project_id );
                }
            }
        }
    }

    public function header_background( WP_REST_Request $request ) {
        $project_id        = $request->get_param('project_id');
        $board_id          = $request->get_param('board_id');
        $header_background = $request->get_param('header_background');

        wedevs_pm_update_meta( $board_id, $project_id, 'kanboard', 'header_background', $header_background );

        wp_send_json_success();
    }

    function search_tasks( WP_REST_Request $request ) {
        $tb_lists     = wedevs_pm_tb_prefix() . 'pm_boards';
        $tb_tasks     = wedevs_pm_tb_prefix() . 'pm_tasks';
        $task_ids     = [];

        $list_tasks = ( new Task_Controller )->filter_query( $request );
        $list_tasks = $list_tasks->get()->toArray();

        foreach ( $list_tasks as $lkey => $list ) {
            foreach ( $list['tasks'] as $tkey => $task ) {
                $task_ids[] = $task['id'];
            }
        }

        $boards = Kanboard::select( $tb_lists. '.id' )
            ->where( $tb_lists . '.type', 'kanboard' )
            ->with(
                [
                    'tasks' => function($q) use( $tb_tasks, $task_ids ) {
                        $q->select( $tb_tasks . '.id as task_id' )
                            ->whereIn( $tb_tasks . '.id', $task_ids );
                    }
                ]
            )
            ->get()
            ->toArray();

        $tasks = ( new Task_Controller )->get_tasks( $task_ids, [
            'list_task_transormer_filter' => false
        ] );

        $tasks_by_id = [];

        foreach ( $tasks['data'] as $key => $task ) {
            $tasks_by_id[$task['id']] = $task;
        }

        foreach ( $boards as $bkey => $board ) {
            foreach ( $board['tasks'] as $tkey => $task ) {
                if ( empty( $tasks_by_id[$task['task_id']] ) ) {
                    continue;
                }

                $boards[$bkey]['tasks'][$tkey] = $tasks_by_id[$task['task_id']];
            }
        }

        wp_send_json_success( $boards );
    }

    function import_bulk_task( WP_REST_Request $request ) {
        $project_id = $request->get_param('project_id');
        $board_id   = $request->get_param('board_id');
        $items      = $request->get_param('items');

        $has_task = Boardable::select('boardable_id')
            ->where('board_type', 'kanboard')
            ->whereIn('boardable_id', $items)
            ->get()
            ->toArray();

        $has_items     = wp_list_pluck( $has_task, 'boardable_id' );
        $exclude_items = array_diff( $items,  $has_items );

        $datas = [];

        foreach ( $exclude_items as $task_id ) {
            $datas[] = [
                'board_id'       => $board_id,
                'board_type'     => 'kanboard',
                'boardable_id'   => $task_id,
                'boardable_type' => 'task',
                'order'          => 0,
                'created_by'     => get_current_user_id(),
                'updated_by'     => get_current_user_id(),
                'created_at'     => date( 'Y-m-d h:i:s', strtotime( current_time( 'mysql' ) ) ),
                'updated_at'     => date( 'Y-m-d h:i:s', strtotime( current_time( 'mysql' ) ) )
            ];
        }

        if ( ! empty( $datas ) ) {
            Boardable::insert( $datas );
        }

        return [
            'success' => true,
            'imported' => count( $datas ),
        ];
    }

    public function get_tasks( WP_REST_Request $request ) {
        global $wpdb;
        $project_id = $request->get_param('project_id');
        $lists = $request->get_param('lists');
        $with = $request->get_param('with');
        $title = $request->get_param('title');
        $per_page = $request->get_param('per_page');
        $tk_ids = [];

        $helper_params = [
            'project_id' => $project_id,
            'lists'      => $lists,
            'with'       => $with,
        ];

        if ( ! empty( $title ) ) {
            $helper_params['title'] = $title;
        }

        if ( ! empty( $per_page ) ) {
            $helper_params['per_page'] = intval( $per_page );
        }

        $tasks = Task_Helper::get_results( $helper_params );

        $tk_ids = wp_list_pluck( $tasks['data'], 'id' );

        $boards = Boardable::where( 'board_type', 'kanboard' )
            ->where( 'boardable_type', 'task' )
            ->whereIn( 'boardable_id', $tk_ids )
            ->get()
            ->toArray();


        $query_id = implode( ',', $tk_ids );

        if ( empty( $query_id ) ) {
            wp_send_json_success( [] );
        }

        $query = "SELECT *
            FROM {$wpdb->prefix}pm_boardables as bor
            LEFT JOIN {$wpdb->prefix}pm_tasks as tsk ON bor.boardable_id=tsk.id
            WHERE bor.board_type='kanboard'
            AND bor.boardable_type='task'
            AND tsk.id IN ($query_id)
            AND tsk.project_id={$project_id}";

        $results = $wpdb->get_results( $query );

        $kb_tk_ids = wp_list_pluck( $results, 'id' );

        foreach ( $tasks['data'] as $key => $task ) {
            //pmpr($task);
            if ( in_array( $task['id'], $kb_tk_ids ) ) {
                unset( $tasks['data'][$key] );
            }
        }

        wp_send_json_success( array_values( $tasks['data'] ) );
    }
}


