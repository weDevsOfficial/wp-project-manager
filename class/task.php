<?php

/**
 * Task list manager class
 *
 * @author Tareq Hasan
 */
class CPM_Task {

    private static $_instance;

    public function __construct() {
        add_filter( 'init', array ( $this, 'register_post_type' ) );
        add_filter( 'cpm_message', array ( $this, 'show_message' ) );
        add_action( 'cpm_admin_scripts', array ( $this, 'tasks_scripts' ) );
    }

    public static function getInstance() {
        if ( !self::$_instance ) {

            self::$_instance = new CPM_Task();
        }

        return self::$_instance;
    }

    function show_message( $message ) {
        if ( isset( $_GET[ 'pid' ] ) OR isset( $_GET[ 'project_id' ] ) ) {

            if ( isset( $_GET[ 'pid' ] ) )
                $pid = $_GET[ 'pid' ];
            if ( isset( $_GET[ 'project_id' ] ) )
                $pid = $_GET[ 'project_id' ];

            $project_obj = CPM_Project::getInstance()->get_info( $pid );

            wp_localize_script( 'cpm_admin', 'CPM_task', array (
                'current_project'         => $pid,
                'project_obj'             => $project_obj,
                'base_url'                => CPM_URL,
                'static_text'             => array (
                    'confirm_pin'              => __( 'Sure to confirm pin task list', 'cpm' ),
                    'confirm_unpin'            => __( 'Sure to confirm un-pin task list', 'cpm' ),
                    'file_upload'              => __( 'File uploads', 'cpm' ),
                    'attach_file'              => __( 'Attach a File', 'cpm' ),
                    'submit'                   => __( 'Submit', 'cpm' ),
                    'update_btn_text'          => __( 'Update', 'cpm' ),
                    'cancel'                   => __( 'Cancel', 'cpm' ),
                    'tasklist_submit_btn_text' => __( 'Add Task List', 'cpm' ),
                    'tasklist_update_btn_text' => __( 'Update Task List', 'cpm' ),
                    'add_task_btn'             => __( 'Add Task', 'cpm' ),
                    'confirm_update'           => __( 'Are you sure to update task status?', 'cpm' ),
                    //
                    'add_a_new_todo'           => __( "Add a new task", 'cpm' ),
                    'add_todo_details_text'    => __( 'Add extra details about this task (optional)', 'cpm' ),
                    'title'                    => __( 'Title', 'cpm' ),
                    'start_date'               => __( 'Start Date', 'cpm' ),
                    'due_date'                 => __( 'Due Date', 'cpm' ),
                    'to_attach'                => __( 'To attach', 'cpm' ),
                    'select_file'              => __( 'select files', 'cpm' ),
                    'from_computer'            => __( 'from your computer', 'cpm' ),
                    'attachment'               => __( 'Attachments', 'cpm' ),
                    'comments'                 => __( 'Comments', 'cpm' ),
                    'comment'                  => __( 'Comment', 'cpm' ),
                    'privet_task'              => __( 'Private Task', 'cpm' ),
                    'on'                       => __( 'On', 'cpm' ),
                    'completed_by'             => __( 'Completed by', 'cpm' ),
                    'close'                    => __( 'Close', 'cpm' ),
                    'add_comment'              => __( 'Add Comment', 'cpm' ),
                    'delete_confirm'           => __( 'Are you sure to delete this file?', 'cpm' ),
                    'empty_comment'            => __( 'Please write something in comments!', 'cpm' ),
                    'backtotasklist'           => __( 'Back to Task Lists', 'cpm' ),
                    'todolist'                 => __( 'Task Lists', 'cpm' ),
                    'todolist_n_title'         => __( 'You can list all your Tasks in a single discussion using a Task list. Use these lists to divide a project into several sectors, assign co-workers and check progress.', 'cpm' ),
                    'when_use_todo'            => __( 'When to use Task Lists?', 'cpm' ),
                    'to_pertition_a_project'   => __( 'To partition a project internals.', 'cpm' ),
                    'to_mark_milestone'        => __( 'To mark milestone points.', 'cpm' ),
                    'to_assign_people_task'    => __( 'To assign people to tasks.', 'cpm' ),
                    'add_new_todo_btn'         => __( 'Add New Task List', 'cpm' ),
                    //''                         => __( '', 'cpm' ),
                ),
                'cpm_task_column_partial' => apply_filters( 'cpm_task_column_partial', ' ' ),
                'cpm_task_single_after'   => apply_filters( 'cpm_task_single_after', ' ' ),
                'cpm_task_extra_partial'  => apply_filters( 'cpm_task_extra_partial', '' ),
                'user_can_create'         => cpm_user_can_access( $pid, 'create_todolist' ),
            ) );
            return $message;
        }
    }

    function register_post_type() {
        register_post_type( 'cpm_task_list', array (
            'label'               => __( 'Task List', 'cpm' ),
            'description'         => __( 'Task List', 'cpm' ),
            'public'              => false,
            'show_in_admin_bar'   => false,
            'exclude_from_search' => true,
            'publicly_queryable'  => false,
            'show_in_admin_bar'   => false,
            'show_ui'             => false,
            'show_in_menu'        => false,
            'capability_type'     => 'post',
            'hierarchical'        => false,
            'rewrite'             => array ( 'slug' => 'task-list' ),
            'query_var'           => true,
            'supports'            => array ( 'title', 'editor', 'delete' ),
            'show_in_json'        => true,
            'labels'              => array (
                'name'               => __( 'Task List', 'cpm' ),
                'singular_name'      => __( 'Task List', 'cpm' ),
                'menu_name'          => __( 'Task List', 'cpm' ),
                'add_new'            => __( 'Add Task List', 'cpm' ),
                'add_new_item'       => __( 'Add New Task List', 'cpm' ),
                'edit'               => __( 'Edit', 'cpm' ),
                'edit_item'          => __( 'Edit Task List', 'cpm' ),
                'new_item'           => __( 'New Task List', 'cpm' ),
                'view'               => __( 'View Task List', 'cpm' ),
                'view_item'          => __( 'View Task List', 'cpm' ),
                'search_items'       => __( 'Search Task List', 'cpm' ),
                'not_found'          => __( 'No task lists found.', 'cpm' ),
                'not_found_in_trash' => __( 'No task lists found in Trash.', 'cpm' ),
                'parent'             => __( 'Parent Task List', 'cpm' ),
            ),
        ) );

        register_post_type( 'cpm_task', array (
            'label'               => __( 'Task', 'cpm' ),
            'description'         => __( 'Tasks', 'cpm' ),
            'public'              => false,
            'show_in_admin_bar'   => false,
            'exclude_from_search' => true,
            'publicly_queryable'  => false,
            'show_in_admin_bar'   => false,
            'show_ui'             => false,
            'show_in_menu'        => false,
            'capability_type'     => 'post',
            'hierarchical'        => false,
            'rewrite'             => array ( 'slug' => 'task' ),
            'query_var'           => true,
            'supports'            => array ( 'title', 'editor' ),
            'show_in_json'        => true,
            'labels'              => array (
                'name'               => __( 'Tasks', 'cpm' ),
                'singular_name'      => __( 'Task', 'cpm' ),
                'menu_name'          => __( 'Task', 'cpm' ),
                'add_new'            => __( 'Add Task', 'cpm' ),
                'add_new_item'       => __( 'Add New Task', 'cpm' ),
                'edit'               => __( 'Edit', 'cpm' ),
                'edit_item'          => __( 'Edit Task', 'cpm' ),
                'new_item'           => __( 'New Task', 'cpm' ),
                'view'               => __( 'View Task', 'cpm' ),
                'view_item'          => __( 'View Task', 'cpm' ),
                'search_items'       => __( 'Search Task', 'cpm' ),
                'not_found'          => __( 'No tasks found.', 'cpm' ),
                'not_found_in_trash' => __( 'No tasks found in Trash.', 'cpm' ),
                'parent'             => __( 'Parent Task', 'cpm' ),
            ),
        ) );
    }

    function tasks_scripts() {
        if ( isset( $_GET[ 'tab' ] ) AND $_GET[ 'tab' ] == 'task' ) {
            wp_enqueue_media();

            $scripts = array(
                'cpm_admin',
                'cpm-vue',
                'cpm-tiptip',
                'cpm-uploader',
                'cpm-toastr',
                'cpm-tiny-mce',
                'cpm-moment',
                'cpm-moment-timezone',
                'cpm-tiny-mce-component',
                'cpm-vuex',
                'cpm-vue-router',
                'cpm-task-store',
                'cpm-vue-multiselect',
                'cpm-task-mixin',
                'cpm-task-store',
                'cpm-task-components',
                'cpm-task-router', //do not change this key, here was dependency from others addon
                'cpm-task-vue',
            );

            $scripts = apply_filters( 'cpm_task_scripts', $scripts );

            wp_localize_script('cpm-task-components', 'CPM_Todo_List', array(
                'todo_list_form'           => apply_filters( 'todo_list_form', array( 'CPM_Task_Mixin' ) ),
                'todo_list_router_default' => apply_filters( 'todo_list_router_default', array( 'CPM_Task_Mixin' ) ),
                'todo_list_text_editor'    => apply_filters( 'todo_list_text_editor', array() ),
            ));

            do_action( 'cpm_before_task_scripts' );

            foreach( $scripts as $script ) {
                do_action( 'before-'. $script );
                wp_enqueue_script( $script );
                do_action( 'after-'. $script );
            }

            wp_enqueue_style( 'cpm-tiptip' );
            wp_enqueue_style( 'cpm-vue-multiselect' );
            wp_enqueue_style( 'cpm-toastr' );
            wp_enqueue_style( 'cpm-trix' );
            wp_enqueue_style( 'cpm-tiny-mce' );

            do_action( 'cpm_after_task_scripts' );
        }
    }

    /**
     * Add a new task list
     *
     * @param int $project_id project id
     * @param int $list_id list id for update purpose
     * @return int task list id
     */
    function add_list( $project_id, $postdata, $list_id = 0 ) {

        if ( empty( $postdata[ 'tasklist_name' ] ) ) {
            return new WP_Error( 'tasklist_name', __( 'Task list name is required.', 'cpm' ) );
        }

        $is_update        = ( $list_id ) ? true : false;
        $tasklist_privacy = empty( $postdata[ 'tasklist_privacy' ] ) ? 'no' : $postdata[ 'tasklist_privacy' ];

        $data = array (
            'post_parent'  => $project_id,
            'post_title'   => $postdata[ 'tasklist_name' ],
            'post_content' => empty( $postdata[ 'tasklist_detail' ] ) ? '' : $postdata[ 'tasklist_detail' ],
            'post_type'    => 'cpm_task_list',
            'post_status'  => 'publish'
        );

        if ( $list_id ) {
            $data[ 'ID' ] = $list_id;
            $list_id      = wp_update_post( $data );
        }else {
            $list_id = wp_insert_post( $data );
        }

        if ( $list_id ) {
            update_post_meta( $list_id, '_milestone', $postdata[ 'tasklist_milestone' ] );

            update_post_meta( $list_id, '_tasklist_privacy', $tasklist_privacy );

            if ( $is_update ) {
                CPM_Project::getInstance()->new_project_item( $project_id, $list_id, $tasklist_privacy, 'cpm_task_list', true );

                do_action( 'cpm_tasklist_update', $list_id, $project_id, $data );
            }else {
                CPM_Project::getInstance()->new_project_item( $project_id, $list_id, $tasklist_privacy, 'cpm_task_list', false );

                do_action( 'cpm_tasklist_new', $list_id, $project_id, $data );
            }
        }

        return $list_id;
    }

    /**
     * Update a task list
     *
     * @param int $project_id
     * @param int $list_id
     * @return int list id
     */
    function update_list( $project_id, $posted, $list_id ) {
        return $this->add_list( $project_id, $posted, $list_id );
    }

    /**
     * Add a single task
     *
     * @param int $list_id task list id
     * @return int $task_id task id for update purpose
     */
    function add_task( $list_id, $postdata, $task_id = 0 ) {

        if ( empty( $postdata[ 'task_title' ] ) ) {
            return new WP_Error( 'task_title', __( 'Task name is required.', 'cpm' ) );
        }

        $files        = isset( $postdata[ 'cpm_attachment' ] ) ? $postdata[ 'cpm_attachment' ] : array ();
        $task_privacy = isset( $postdata[ 'task_privacy' ] ) ? $postdata[ 'task_privacy' ] : 'no';
        $is_update    = $task_id ? true : false;

        $task_title = trim( $postdata[ 'task_title' ] );
        $content    = empty( $postdata[ 'task_text' ] ) ? '' : trim( $postdata[ 'task_text' ] );
        //print_r($postdata[ 'task_assign' ]) ;  exit() ;
        $assigned   = isset( $postdata[ 'task_assign' ] ) ? $postdata[ 'task_assign' ] : array ( '-1' );
        //   $due          = empty( $postdata['task_due'] ) ? '' : cpm_date2mysql( $postdata['task_due'] );
        $due        = empty( $postdata[ 'task_due' ] ) ? '' : cpm_to_mysql_date( $postdata[ 'task_due' ] );
        $start      = empty( $postdata[ 'task_start' ] ) ? '' : cpm_to_mysql_date( $postdata[ 'task_start' ] );

        $data = array (
            'post_parent'  => $list_id,
            'post_title'   => $task_title,
            'post_content' => $content,
            'post_type'    => 'cpm_task',
            'post_status'  => 'publish'
        );

        $data = apply_filters( 'cpm_task_params', $data );

        if ( $task_id ) {
            $data[ 'ID' ] = $task_id;
            $task_id      = wp_update_post( $data );
        }else {
            $task_id = wp_insert_post( $data );
        }

        if ( $task_id ) {
            $this->assign_user( $task_id, $assigned );
            update_post_meta( $task_id, '_due', $due );

            if ( cpm_get_option( 'task_start_field', 'cpm_general' ) == 'on' ) {
                update_post_meta( $task_id, '_start', $start );
            }else {
                update_post_meta( $task_id, '_start', '' );
            }

            update_post_meta( $task_id, '_task_privacy', $task_privacy );

            //initially mark as uncomplete
            if ( !$is_update ) {
                update_post_meta( $task_id, '_completed', 0 );
            }

            //if there is any file, update the object reference
            if ( count( $files ) > 0 ) {
                $comment_obj = CPM_Comment::getInstance();

                foreach ( $files as $file_id ) {
                    $comment_obj->associate_file( $file_id, $task_id );
                }
            }

            $data['assigned_users'] = empty( $postdata[ 'task_assign' ] ) ? array ( '-1' ) : $postdata[ 'task_assign' ];

            if ( $is_update ) {
                $this->new_task_project_item( $list_id, $task_id, $assigned, $task_privacy, $is_update );
                do_action( 'cpm_task_update', $list_id, $task_id, $data );
            }else {
                $this->new_task_project_item( $list_id, $task_id, $assigned, $task_privacy, $is_update );
                do_action( 'cpm_task_new', $list_id, $task_id, $data );
            }
        }

        return $task_id;
    }

    /**
     * Insert task item type
     *
     * @param init $list_id
     * @param init $task_id
     * @param array $assigned
     * @param string $private
     * @param boolen $update
     *
     * @since 0.1
     * @version Release: 1.1
     *
     * @return type
     */
    function new_task_project_item( $list_id, $task_id, $assign, $private, $update ) {
        global $wpdb;

        $list      = get_post( $list_id );
        $task      = $this->get_task( $task_id );
        $table     = $wpdb->prefix . 'cpm_tasks';
        $item_id   = $this->get_item_id( $task_id );
        $delete    = true;
        $completed = '0000-00-00 00:00:00';

        if ( $update ) {
            $delete        = $this->delete_task_item( $item_id );
            $completed     = $task->completed ? $task->completed_on : '0000-00-00 00:00:00';
            CPM_Project::getInstance()->new_project_item( $list->post_parent, $task_id, $private, 'cpm_task', true, $completed, $task->completed, $list_id );
            $new_insert_id = $this->get_item_id( $task_id );
        }else {
            CPM_Project::getInstance()->new_project_item( $list->post_parent, $task_id, $private, 'cpm_task', false, $completed, 0, $list_id );

            $new_insert_id = isset( $wpdb->insert_id ) ? $wpdb->insert_id : 0;
        }

        if ( $new_insert_id ) {

            if ( count( $assign ) ) {
                foreach ( $assign as $assigned ) {

                    if ( $new_insert_id ) {
                        $data = array (
                            'item_id' => $new_insert_id,
                            'user_id' => $assigned,
                            'start'   => isset( $task->start_date ) && $task->start_date ? $task->start_date : $task->post_date,
                            'due'     => $task->due_date ? $task->due_date : '0000-00-00 00:00:00',
                        );
                        $wpdb->insert( $table, $data, array ( '%d', '%d', '%s', '%s' ) );
                    }
                }
            }else {
                if ( $new_insert_id ) {

                    $data = array (
                        'item_id' => $new_insert_id,
                        'user_id' => -1,
                        'start'   => isset( $task->start_date ) && $task->start_date ? $task->start_date : $task->post_date,
                        'due'     => $task->due_date ? $task->due_date : '0000-00-00 00:00:00',
                    );

                    $wpdb->insert( $table, $data, array ( '%d', '%d', '%s', '%s' ) );
                }
            }
        }
    }

    /**
     * Delete task item
     *
     * @param int $item_id
     *
     * @since 1.1
     *
     * @return void
     */
    function delete_task_item( $item_id ) {
        global $wpdb;

        $table     = $wpdb->prefix . 'cpm_tasks';
        $object_id = apply_filters( 'cpm_delete_project_item_task_data', $item_id );

        do_action( 'cpm_before_delete_new_project_task_item', $item_id );

        $delete = $wpdb->delete( $table, array ( 'item_id' => $item_id ), array ( '%d' ) );

        do_action( 'cpm_before_delete_new_project_task_item', $item_id );


        return $delete;
    }

    /**
     * Delete task item
     *
     * @param init $task_id
     *
     * @since 1.1
     *
     * @return void
     */
    function delete_task_list_item( $list_id ) {
        $delete = CPM_Project::getInstance()->delete_project_item( $list_id );
        if ( $delete ) {
            $tasks = CPM_Task::getInstance()->get_tasks( $list_id, true );

            foreach ( $tasks as $task ) {
                $item_id = $this->get_item_id( $task_id );
                $this->delete_task_item( $item_id );
                CPM_Project::getInstance()->delete_project_item( $task->ID );
            }
        }
    }

    /**
     * Get task list item id
     *
     * @param init $list_id
     *
     * @since 1.1
     *
     * @return int
     */
    function get_item_id( $task_id ) {
        global $wpdb;

        $table = $wpdb->prefix . 'cpm_project_items';
        return $wpdb->get_var( $wpdb->prepare( "SELECT id FROM {$table} WHERE object_id = '%d'", $task_id ) );
    }

    /**
     * Update task user
     *
     * @param int $task_id
     * @param array $assigned
     * @return void
     * @since 0.1
     */
    function assign_user( $task_id, $assigned ) {
        delete_post_meta( $task_id, '_assigned' );
        if ( !is_array( $assigned ) )
            $assigned = explode( ',', $assigned );
        foreach ( $assigned as $key => $user_id ) {
            add_post_meta( $task_id, '_assigned', $user_id );
        }
    }

    /**
     * Update a single task
     *
     * @param int $list_id
     * @param int $task_id
     * @return int task id
     */
    function update_task( $list_id, $postdata, $task_id ) {
        return $this->add_task( $list_id, $postdata, $task_id );
    }

    /**
     * Get all task list by project
     *
     * @param int $project_id
     * @return object object array of the result set
     */
    function get_task_lists( $project_id, $privacy = false, $show_all = false, $pagenum = 1, $defaults = array() ) {
        global $wpdb;

        $args = array (
            'post_type'           => 'cpm_task_list',
            'order'               => 'DESC',
            'orderby'             => 'ID',
            'post_parent'         => $project_id,
        );

        $args = wp_parse_args( $args, $defaults );

        if ( true === $show_all ) {
            $args[ 'posts_per_page' ] = -1;
        } else {
            $limit            = absint( cpm_get_option( 'show_todo', 'cpm_general' ) );
            $offset           = ( $pagenum - 1 ) * $limit;
            $args[ 'offset' ] = $offset;
            $args[ 'posts_per_page' ] = $limit;
        }

        $args = apply_filters( 'cpm_get_tasklist', $args, $privacy, $show_all, $pagenum, $defaults );

        $lists = new WP_Query( $args );

        foreach ( $lists->posts as $list ) {
            $this->set_list_meta( $list );
        }

        return array( 'lists' => $lists->posts, 'count' => $lists->found_posts );
    }

    /**
     * Get Sticky Task List Only
     * @param type $project_id
     * @param type $offset
     * @param type $privacy
     * @return type
     */
    function get_sticky_task_lists( $project_id, $privacy = false ) {
        $sticky = get_option( 'sticky_posts' );
        rsort( $sticky );
        if ( empty( $sticky ) )
            return false;
        $args   = array (
            'post_type'   => 'cpm_task_list',
            'order'       => 'DESC',
            'orderby'     => 'ID',
            'post__in'    => $sticky,
            'post_parent' => $project_id
        );

        if ( $privacy === false ) {
            $args[ 'meta_query' ] = array (
                array (
                    'key'     => '_tasklist_privacy',
                    'value'   => 'yes',
                    'compare' => '!='
                ),
            );
        }

        $args = apply_filters( 'cpm_get_tasklist', $args );

        $lists = get_posts( $args );
        foreach ( $lists as $list ) {
            $this->set_list_meta( $list );
        }

        return $lists;
    }

    /**
     * Get a single task list by a task list id
     *
     * @param int $list_id
     * @return object object array of the result set
     */
    function get_task_list( $list_id ) {
        $task_list = get_post( $list_id );
        $this->set_list_meta( $task_list );

        return $task_list;
    }

    /**
     * Set meta info for a task list
     *
     * @param object $task_list
     */
    function set_list_meta( &$task_list ) {
        $task_list->due_date                = get_post_meta( $task_list->ID, '_due', true );
        $task_list->milestone               = get_post_meta( $task_list->ID, '_milestone', true );
        $task_list->private                 = get_post_meta( $task_list->ID, '_tasklist_privacy', true );
        $task_list->pin_list                = is_sticky( $task_list->ID ) ? true : false;
        $task_list->edit_mode               = false;
        $task_list->show_task_form          = false;
        $task_list->can_del_edit            = cpm_user_can_delete_edit( $task_list->post_parent, $task_list );
        $task_list->count_completed_tasks   = $this->count_completed_tasks( $task_list->ID );
        $task_list->count_incompleted_tasks = $this->count_incompleted_tasks( $task_list->ID );
        $comments                           = wp_count_comments( $task_list->ID );
        $task_list->count_comments          = $comments->approved;
        $task_list->tasks                   = array();
    }

    function get_tasks_by_access_role( $list_id, $project_id = null ) {

        if ( cpm_user_can_access( $project_id ) ) {
            //for manager lavel
            $tasks = $this->get_tasks( $list_id, true );
        } else {

            if ( cpm_user_can_access( $project_id, 'todo_view_private' ) ) {
                //for settings role true
                $tasks = $this->get_tasks( $list_id, true );
            } else {
                //for settings role false
                $tasks = $this->get_tasks( $list_id, false );
            }
        }

        return $tasks;
    }

    /**
     * Get all tasks based on a task list
     *
     * @param int $list_id
     * @return object object array of the result set
     */
    function get_tasks( $list_id, $privacy = null, $pagenum = 1 ) {

        $limit = -1;

        $args = array (
            'post_parent'    => $list_id,
            'post_type'      => 'cpm_task',
            'post_status'    => 'publish',
            'order'          => 'ASC',
            'orderby'        => 'menu_order',
            // 'order'          => 'DESC',
            // 'orderby'        => 'ID',
            // 'offset'         => $offset,
            'posts_per_page' => $limit,
        );

        $args = apply_filters( 'cpm_get_task', $args, $privacy );

        $tasks = new WP_Query( $args );

        foreach ( $tasks->posts as $key => $task ) {
            $this->set_task_meta( $task );
        }
        // var_dump($tasks->posts); die();
        return $tasks->posts;
    }

    function get_incompleted_tasks( $list_id, $privacy = null, $pagenum = 1 ) {
        $per_page = cpm_get_option( 'show_incomplete_tasks', 'cpm_general' );
        $limit    = empty( $per_page ) ? 50 : $per_page;

        $args = array (
            'post_parent'    => $list_id,
            'post_type'      => 'cpm_task',
            'post_status'    => 'publish',
            'order'          => 'ASC',
            'orderby'        => 'menu_order',
            // 'order'          => 'DESC',
            // 'orderby'        => 'ID',
            'offset'         => $pagenum, // * $limit,
            'posts_per_page' => $limit,
            'meta_query'     => array (
                array (
                    'key'     => '_completed',
                    'value'   => '0',
                    'compare' => '='
                )
            )
        );

        $args = apply_filters( 'cpm_get_task', $args, $privacy );

        $tasks = new WP_Query( $args );

        foreach ( $tasks->posts as $key => $task ) {
            $this->set_task_meta( $task );
        }

        return $tasks->posts;
    }

    function get_completed_tasks( $list_id, $privacy = null, $pagenum = 1 ) {
        $per_page = cpm_get_option( 'show_completed_tasks', 'cpm_general' );
        $limit    = empty( $per_page ) ? 50 : $per_page;

        $args = array (
            'post_parent'    => $list_id,
            'post_type'      => 'cpm_task',
            'post_status'    => 'publish',
            'order'          => 'ASC',
            'orderby'        => 'menu_order',
            // 'order'          => 'DESC',
            // 'orderby'        => 'ID',
            'offset'         => $pagenum, // * $limit,
            'posts_per_page' => $limit,
            'meta_query'     => array (
                array (
                    'key'     => '_completed',
                    'value'   => '1',
                    'compare' => '='
                )
            )
        );

        $args = apply_filters( 'cpm_get_task', $args, $privacy );

        $tasks = new WP_Query( $args );

        foreach ( $tasks->posts as $key => $task ) {
            $this->set_task_meta( $task );
        }

        return $tasks->posts;
    }

    /**
     * Get all tasks based on a task list
     *
     * @param int $list_id
     * @return object object array of the result set
     */
    function count_tasks( $list_id ) {

        $args = array (
            'post_parent'    => $list_id,
            'post_type'      => 'cpm_task',
            'post_status'    => 'publish',
            'posts_per_page' => 1,
        );

        $args = apply_filters( 'cpm_get_task', $args, $privacy );

        $tasks = new WP_Query( $args );

        return $tasks->found_posts;
    }

    /**
     * Get all tasks based on a task list
     *
     * @param int $list_id
     * @return object object array of the result set
     */
    function count_completed_tasks( $list_id ) {

        $complete_task_args = array (
            'post_parent'    => $list_id,
            'post_type'      => 'cpm_task',
            'post_status'    => 'publish',
            'orderby'        => 'menu_order',
            'posts_per_page' => 1,
            'meta_query'     => array (
                array (
                    'key'     => '_completed',
                    'value'   => '1',
                    'compare' => '='
                )
            )
        );

        $complete_task = new WP_Query( $complete_task_args );
        return $complete_task->found_posts;
    }

    /**
     * Get all tasks based on a task list
     *
     * @param int $list_id
     * @return object object array of the result set
     */
    function count_incompleted_tasks( $list_id ) {

        $complete_task_args = array (
            'post_parent'    => $list_id,
            'post_type'      => 'cpm_task',
            'post_status'    => 'publish',
            'posts_per_page' => 1,
            'meta_query'     => array (
                array (
                    'key'     => '_completed',
                    'value'   => '0',
                    'compare' => '='
                )
            )
        );

        $complete_task = new WP_Query( $complete_task_args );

        return $complete_task->found_posts;
    }


    /**
     * Set all the meta values to a single task
     *
     * @param object $task
     */
    function set_task_meta( &$task ) {

        $task->completed    = intval( get_post_meta( $task->ID, '_completed', true ) );
        $task->completed_by = get_post_meta( $task->ID, '_completed_by', true );
        $task->completed_on = get_post_meta( $task->ID, '_completed_on', true );
        $task->assigned_to  = get_post_meta( $task->ID, '_assigned' );

        $task->due_date     = get_post_meta( $task->ID, '_due', true );
        $task->start_date   = get_post_meta( $task->ID, '_start', true );
        $task->task_privacy = get_post_meta( $task->ID, '_task_privacy', true );
        $task->comments     = $this->get_task_comments( $task->ID );
        $task->post_content = cpm_get_content( $task->post_content );
        $task->edit_mode    = false;

        $task = apply_filters( 'cpm_set_task_meta', $task );
    }

    /**
     * Get all tasks based on a milestone
     *
     * @param int $list_id
     * @return object object array of the result set
     */
    function get_tasklist_by_milestone( $milestone_id, $privacy = false ) {

        $args = array (
            'post_type'   => 'cpm_task_list',
            'numberposts' => -1,
            'order'       => 'ASC',
            'orderby'     => 'menu_order',
        );

        $args[ 'meta_query' ][] = array (
            'key'   => '_milestone',
            'value' => $milestone_id,
        );

        if ( $privacy === false ) {
            $args[ 'meta_query' ][] = array (
                'key'     => '_tasklist_privacy',
                'value'   => 'yes',
                'compare' => '!='
            );
        }

        $tasklists = get_posts( $args );
        foreach ( $tasklists as $list ) {
            $this->set_list_meta( $list );
        }

        return $tasklists;
    }

    /**
     * Get a single task detail
     *
     * @param int $task_id
     * @return object object array of the result set
     */
    function get_task( $task_id ) {
        $task = get_post( $task_id );
        $this->set_task_meta( $task );

        return $task;
    }

    /**
     * Set Task Extra data
     * @since 1.5.2
     * @param int $project_id
     * @param int $list_id
     * @param object $task
     * @param  $single
     * @return array object
     */
    function set_todo_extra_data( $project_id, $list_id, $task, $single = false ) {
        // print_r($task) ;
        $ajax_obj        = CPM_Ajax::getInstance();
        $date_format     = "Y-m-d";
        $task->comments  = array();

        $task->extra_data   = '';
        $task->task_privacy = filter_var( $task->task_privacy, FILTER_VALIDATE_BOOLEAN );
        $task->start_date   = $task->start_date != "" ? date( $date_format, strtotime( $task->start_date ) ) : '';
        $task->due_date     = ($task->due_date != '') ? date( $date_format, strtotime( $task->due_date ) ) : '';

        $task->completed_on = date( $date_format, strtotime( $task->completed_on ) );
        $task->task_assign  = implode( ',', $task->assigned_to );
        $task->assigned_to  = $ajax_obj->task_users( $task->assigned_to, true );

        $task->completed_by         = $ajax_obj->task_users( $task->completed_by, true );
        $task->hook_cpm_task_column = $ajax_obj->hook_cpm_task_column( $project_id, $list_id, $task, $single );

        $start_date       = isset( $task->start_date ) ? $task->start_date : '';
        $task_status_wrap = '';
        $str_date         = '';
        if ( $start_date != '' || $task->due_date != '' ) {
            $task_status_wrap = ( date( 'Y-m-d', time() ) > date( 'Y-m-d', strtotime( $task->due_date ) ) ) ? 'cpm-due-date' : 'cpm-current-date';

            if ( ( cpm_get_option( 'task_start_field', 'cpm_general' ) == 'on' ) && $start_date != '' ) {
                $str_date = cpm_get_date( $start_date, false, 'M d' );
            }
            if ( $start_date != '' & $task->due_date != '' ) {
                $str_date .= "-";
            }
            if ( $task->due_date != '' ) {
                $str_date .= cpm_get_date( $task->due_date, false, 'M d' );
            }
        }

        $task->date_css_class     = $task_status_wrap;
        $task->date_show          = $str_date;
        $task->date_show_complete = cpm_get_date( $task->completed_on, false, 'M d' );
        $task->show_popup         = false;

        return $task;
    }

    /**
     * Get all comment on a task list
     *
     * @param int $list_id
     * @return object object array of the result set
     */
    function get_comments( $list_id ) {
        return CPM_Comment::getInstance()->get_comments( $list_id );
    }

    /**
     * Get all comments on a single task
     *
     * @param int $task_id
     * @return object object array of the result set
     */
    function get_task_comments( $task_id ) {
        $task_comments = CPM_Comment::getInstance()->get_comments( $task_id );

        foreach ( $task_comments as $key => $comment ) {
            $comment->comment_content = do_shortcode( $comment->comment_content );
        }

        return $task_comments;
    }

    /**
     * Mark a task as complete
     *
     * @param int $task_id task id
     */
    function mark_complete( $task_id, $call_do_action = TRUE ) {
        // PATCH: DON'T MARK OPEN TASK AS COMPLETE
        if ( get_post_meta( $task_id, '_completed', TRUE ) == '1' )
            return;

        update_post_meta( $task_id, '_completed', 1 );
        update_post_meta( $task_id, '_completed_by', get_current_user_id() );
        update_post_meta( $task_id, '_completed_on', current_time( 'mysql' ) );
        CPM_Project::getInstance()->new_project_item_complete_date( $task_id, current_time( 'mysql' ) );
        if ( $call_do_action ) {
            do_action( 'cpm_task_complete', $task_id );
        }
    }

    /**
     * Mark a task as uncomplete/open
     *
     * @param int $task_id task id
     */
    function mark_open( $task_id, $call_do_action = TRUE ) {
        // PATCH: DON'T MARK OPEN TASK AS OPEN
        if ( get_post_meta( $task_id, '_completed', TRUE ) == '0' )
            return;

        update_post_meta( $task_id, '_completed', 0 );
        update_post_meta( $task_id, '_completed_on', current_time( 'mysql' ) );
        CPM_Project::getInstance()->new_project_item_complete_open( $task_id );
        if ( $call_do_action ) {
            do_action( 'cpm_task_open', $task_id );
        }
    }

    /**
     * Delete a single task
     *
     * @param int $task_id
     * @param bool $force
     */
    function delete_task( $task_id, $force = false ) {
        do_action( 'cpm_task_delete', $task_id, $force );
        $item_id = $this->get_item_id( $task_id );
        $this->delete_task_item( $item_id );

        CPM_Project::getInstance()->delete_project_item( $task_id );


        wp_delete_post( $task_id, $force );
    }

    /**
     * Delete a task list
     *
     * @param int $list_id
     * @param bool $force
     */
    function delete_list( $list_id, $force = false ) {
        do_action( 'cpm_tasklist_delete', $list_id, $force );

        //get child tasks and delete them
        $tasks = $this->get_tasks( $list_id );
        if ( $tasks ) {
            foreach ( $tasks as $task ) {
                $this->delete_task( $task->ID, true );
            }
        }

        $this->delete_task_list_item( $list_id );
        wp_delete_post( $list_id, $force );
    }

    /**
     * Get the overall completeness for a task list
     *
     * @param int $list_id
     * @return array
     */
    function get_completeness( $list_id, $project_id = null ) {
        $tasks = $this->get_tasks_by_access_role( $list_id, $project_id );
        return array (
            'total'     => count( $tasks ),
            'completed' => array_sum( wp_list_pluck( $tasks, 'completed' ) )
        );
    }

    /*     * **************************************************************
     *
     * Time Log
     *
     * ************************************************************** */

    function my_task_header_tab( $active_tab = false ) {
        $menus = $this->my_task_nav();

        echo '<h2 class="nav-tab-wrapper">';

        foreach ( $menus as $key => $value ) {
            $active = ( $key == $active_tab ) ? 'nav-tab-active' : '';
            ?>
            <a id="cpm_general-tab" class="nav-tab <?php echo $active; ?>" href="<?php echo esc_attr( $value ); ?>">
                <?php echo $key; ?>
            </a>
            <?php
        }

        echo '</h2>';
    }

    function my_task_nav() {
        $nav = array (
            __( 'Task', 'cpm' ) => cpm_url_my_task(),
        );

        return apply_filters( 'cpm_my_task_tab_nav', $nav );
    }

    function my_task_header_subtab( $active_sub_tab = false, $attr = array () ) {
        $sub_menus = $this->my_task_sub_nav();
        ?>
        <ul class="list-inline order-statuses-filter">
            <?php
            foreach ( $sub_menus as $sub_key => $sub_menu ) {
                $active = ( strtolower( $sub_key ) == strtolower( $active_sub_tab ) ) ? 'active' : '';
                ?>
                <li class="<?php echo $active; ?>">

                    <a href="<?php echo $sub_menu; ?>">
                        <?php
                        echo $sub_key;
                        do_action( 'cmp_my_task_subtab_content', $sub_menu, $sub_key, $active_sub_tab, $attr );
                        ?>
                    </a>

                </li>
                <?php
            }
            ?>
        </ul>
        <?php
    }

    function my_task_sub_nav() {
        $nav = array (
            __( 'Current Task', 'cpm' )     => cpm_url_my_task(),
            __( 'Outstanding Task', 'cpm' ) => cpm_url_outstanding_task(),
            __( 'Completed Task', 'cpm' )   => cpm_url_complete_task(),
        );

        return apply_filters( 'cpm_my_task_sub_tab_nav', $nav );
    }

    function check_task_assign( $task_id, $user_id = false ) {
        $task = $this->get_task( $task_id );

        if ( !$user_id ) {
            $user_id = get_current_user_id();
        }

        if ( is_array( $task->assigned_to ) ) {
            $assign = in_array( $user_id, $task->assigned_to ) ? true : false;
        }else {
            $assign = ( $user_id == $task->assigned_to ) ? true : false;
        }
        return $assign;
    }

    /**
     * All necessary template for todo-lists
     *
     * @since  1.6
     *
     * @return void
     */
    function load_js_template() {
        cpm_get_js_template( CPM_JS_TMPL . '/todo-list-form.php', 'cpm-todo-list-form' );
        cpm_get_js_template( CPM_JS_TMPL . '/milestone-dropdown.php', 'cpm-milestone-dropdown' );
        cpm_get_js_template( CPM_JS_TMPL . '/todo-list.php', 'cpm-todo-list' );

        cpm_get_js_template( CPM_JS_TMPL . '/todo-list-router-default.php', 'cpm-todo-list-router-default' );
        cpm_get_js_template( CPM_JS_TMPL . '/todo-list-single.php', 'cpm-todo-list-single' );
        cpm_get_js_template( CPM_JS_TMPL . '/blanktemplate/todolist.php', 'todo-list-default' );
        cpm_get_js_template( CPM_JS_TMPL . '/todo-list-btn.php', 'new-todo-list-button' );
        cpm_get_js_template( CPM_JS_TMPL . '/tasks.php', 'cpm-tasks' );
        cpm_get_js_template( CPM_JS_TMPL . '/new-task-button.php', 'cpm-new-task-button' );
        cpm_get_js_template( CPM_JS_TMPL . '/new-task-form.php', 'cpm-new-task-form' );
        cpm_get_js_template( CPM_JS_TMPL . '/file-uploader.php', 'cpm-file-uploader' );
        cpm_get_js_template( CPM_JS_TMPL . '/list-comments.php', 'cpm-list-comments' );
        cpm_get_js_template( CPM_JS_TMPL . '/list-comment-form.php', 'cpm-list-comment-form' );
        cpm_get_js_template( CPM_JS_TMPL . '/spinner.php', 'cpm-spinner' );
        cpm_get_js_template( CPM_JS_TMPL . '/task-single.php', 'cpm-task-single' );
        cpm_get_js_template( CPM_JS_TMPL . '/task-comment-form.php', 'cpm-task-comment-form' );
        cpm_get_js_template( CPM_JS_TMPL . '/task-comments.php', 'cpm-task-comments' );
        cpm_get_js_template( CPM_JS_TMPL . '/pagination.php', 'cpm-pagination' );

        cpm_get_js_template( CPM_JS_TMPL . '/task-list.php', 'cpm-task-list' );
        cpm_get_js_template( CPM_JS_TMPL . '/task-form.php', 'cpm-task-form' );
        cpm_get_js_template( CPM_JS_TMPL . '/comments.php', 'cpm-comments' );
        cpm_get_js_template( CPM_JS_TMPL . '/blank-template.php', 'cpm-blank-template' );
        cpm_get_js_template( CPM_JS_TMPL . '/file-uploader.php', 'cpm-file-uploader' );
        cpm_get_js_template( CPM_JS_TMPL . '/task-file-uploader.php', 'cpm-task-file-uploader' );
        cpm_get_js_template( CPM_JS_TMPL . '/image-view.php', 'cpm-image-view' );
        cpm_get_js_template( CPM_JS_TMPL . '/list-corner-menu.php', 'cpm-list-corner-menu' );
        cpm_get_js_template( CPM_JS_TMPL . '/single-new-task-field.php', 'cpm-single-new-task-field' );
        cpm_get_js_template( CPM_JS_TMPL . '/assign-user.php', 'cpm-assign-user-drop-down' );
        cpm_get_js_template( CPM_JS_TMPL . '/task-start-date.php', 'cpm-task-start-date' );
        cpm_get_js_template( CPM_JS_TMPL . '/task-end-date.php', 'cpm-task-end-date' );
        cpm_get_js_template( CPM_JS_TMPL . '/task-description.php', 'cpm-task-description' );
        cpm_get_js_template( CPM_JS_TMPL . '/todo-lists-drop-down.php', 'cpm-todo-lists-drop-down' );
    }
}
