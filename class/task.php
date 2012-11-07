<?php

/**
 * Description of task
 *
 * @author tareq
 */
class CPM_Task {

    private static $_instance;

    public function __construct() {
        add_filter( 'init', array($this, 'register_post_type') );
    }

    public static function getInstance() {
        if ( !self::$_instance ) {
            self::$_instance = new CPM_Task();
        }

        return self::$_instance;
    }

    function register_post_type() {
        register_post_type( 'task_list', array(
            'label' => __( 'Task List', 'cpm' ),
            'description' => __( 'Task List', 'cpm' ),
            'public' => true,
            'show_ui' => false,
            'show_in_menu' => false,
            'capability_type' => 'post',
            'hierarchical' => false,
            'rewrite' => array('slug' => 'task-list'),
            'query_var' => true,
            'supports' => array('title', 'editor'),
            'labels' => array(
                'name' => __( 'Task List', 'cpm' ),
                'singular_name' => __( 'Task List', 'cpm' ),
                'menu_name' => __( 'Task List', 'cpm' ),
                'add_new' => __( 'Add Task List', 'cpm' ),
                'add_new_item' => __( 'Add New Task List', 'cpm' ),
                'edit' => __( 'Edit', 'cpm' ),
                'edit_item' => __( 'Edit Task List', 'cpm' ),
                'new_item' => __( 'New Task List', 'cpm' ),
                'view' => __( 'View Task List', 'cpm' ),
                'view_item' => __( 'View Task List', 'cpm' ),
                'search_items' => __( 'Search Task List', 'cpm' ),
                'not_found' => __( 'No Task List Found', 'cpm' ),
                'not_found_in_trash' => __( 'No Task List Found in Trash', 'cpm' ),
                'parent' => __( 'Parent Task List', 'cpm' ),
            ),
        ) );

        register_post_type( 'task', array(
            'label' => __( 'Task', 'cpm' ),
            'description' => __( 'Tasks', 'cpm' ),
            'public' => true,
            'show_ui' => false,
            'show_in_menu' => false,
            'capability_type' => 'post',
            'hierarchical' => false,
            'rewrite' => array('slug' => 'task'),
            'query_var' => true,
            'supports' => array('title', 'editor'),
            'labels' => array(
                'name' => __( 'Tasks', 'cpm' ),
                'singular_name' => __( 'Task', 'cpm' ),
                'menu_name' => __( 'Task', 'cpm' ),
                'add_new' => __( 'Add Task', 'cpm' ),
                'add_new_item' => __( 'Add New Task', 'cpm' ),
                'edit' => __( 'Edit', 'cpm' ),
                'edit_item' => __( 'Edit Task', 'cpm' ),
                'new_item' => __( 'New Task', 'cpm' ),
                'view' => __( 'View Task', 'cpm' ),
                'view_item' => __( 'View Task', 'cpm' ),
                'search_items' => __( 'Search Task', 'cpm' ),
                'not_found' => __( 'No Task Found', 'cpm' ),
                'not_found_in_trash' => __( 'No Task Found in Trash', 'cpm' ),
                'parent' => __( 'Parent Task', 'cpm' ),
            ),
        ) );
    }

    function add_list( $project_id, $list_id = 0 ) {
        $postdata = $_POST;

        $data = array(
            'post_parent' => $project_id,
            'post_title' => $postdata['tasklist_name'],
            'post_content' => $postdata['tasklist_detail'],
            'post_type' => 'task_list',
            'post_status' => 'publish'
        );

        if ( $list_id ) {
            $data['ID'] = $list_id;
            $list_id = wp_update_post( $data );
        } else {
            $list_id = wp_insert_post( $data );
        }

        if ( $list_id ) {
            update_post_meta( $list_id, '_milestone', $postdata['tasklist_milestone'] );
            update_post_meta( $list_id, '_due', cpm_date2mysql( $postdata['tasklist_due'] ) );
            update_post_meta( $list_id, '_privacy', $postdata['tasklist_privacy'] );
            update_post_meta( $list_id, '_priority', $postdata['tasklist_priority'] );

            do_action( 'cpm_new_tasklist', $list_id, $data );
        }

        return $list_id;
    }

    function update_list( $project_id, $list_id ) {
        return $this->add_list( $project_id, $list_id );
    }

    /**
     * Add a single task
     *
     * @param int $list_id
     * @param int $key the index, to add from an array
     * @return int task id
     */
    function add_task( $list_id, $key = null, $task_id = 0 ) {
        $postdata = $_POST;
        $files = isset( $postdata['cpm_attachment'] ) ? $postdata['cpm_attachment'] : array();

        if ( is_null( $key ) ) {
            //posted when task list creation
            $content = $postdata['task_text'];
            $assigned = $postdata['task_assign'];
            $due = cpm_date2mysql( $postdata['task_due'] );
            $key = 0; //for menu order
        } else {
            //posted for a single task creation
            $content = $postdata['task_text'][$key];
            $assigned = $postdata['task_assign'][$key];
            $due = cpm_date2mysql( $postdata['task_due'][$key] );
        }

        $data = array(
            'post_parent' => $list_id,
            'post_title' => substr( $content, 0, 20 ), //first 20 character
            'post_content' => $content,
            'menu_order' => $key,
            'post_type' => 'task',
            'post_status' => 'publish'
        );

        if ( $task_id ) {
            $data['ID'] = $task_id;
            $task_id = wp_update_post( $data );
        } else {
            $task_id = wp_insert_post( $data );
            $this->mark_open( $task_id ); //mark open on new task
        }

        if ( $task_id ) {
            update_post_meta( $task_id, '_assigned', $assigned );
            update_post_meta( $task_id, '_due', $due );

            //if there is any file, update the object reference
            if ( count( $files ) > 0 ) {
                $comment_obj = CPM_Comment::getInstance();

                foreach ($files as $file_id) {
                    $comment_obj->associate_file( $file_id, $task_id );
                }
            }

            do_action( 'cpm_new_task', $list_id, $task_id, $data );
        }

        return $task_id;
    }

    function update_task( $list_id, $task_id ) {
        return $this->add_task( $list_id, null, $task_id );
    }

    /**
     * Get all task list by project
     *
     * @param int $project_id
     * @return object object array of the result set
     */
    function get_task_lists( $project_id ) {
        $args = array(
            'post_type' => 'task_list',
            'numberposts' => -1,
            'order' => 'ASC'
        );

        $lists = get_posts( $args );
        foreach ($lists as $list) {
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

    function set_list_meta( &$task_list ) {
        $task_list->due_date = get_post_meta( $task_list->ID, '_due', true );
        $task_list->milestone = get_post_meta( $task_list->ID, '_milestone', true );
        $task_list->privacy = get_post_meta( $task_list->ID, '_privacy', true );
        $task_list->priority = get_post_meta( $task_list->ID, '_priority', true );
    }

    /**
     * Get all tasks based on a task list
     *
     * @param int $list_id
     * @return object object array of the result set
     */
    function get_tasks( $list_id ) {
        $tasks = get_children( array('post_parent' => $list_id, 'post_type' => 'task', 'order' => 'ASC') );

        foreach ($tasks as $key => $task) {
            $this->set_task_meta( $task );
        }

        return $tasks;
    }

    /**
     * Set all the meta values to a single task
     *
     * @param object $task
     */
    function set_task_meta( &$task ) {
        $task->completed = get_post_meta( $task->ID, '_completed', true );
        $task->completed_on = get_post_meta( $task->ID, '_completed_on', true );
        $task->assigned_to = get_post_meta( $task->ID, '_assigned', true );
        $task->due_date = get_post_meta( $task->ID, '_due', true );
        $task->files = CPM_Comment::getInstance()->get_attachments( $task->ID );
    }

    /**
     * Get all tasks based on a milestone
     *
     * @param int $list_id
     * @return object object array of the result set
     */
    function get_tasklist_by_milestone( $milestone_id ) {
        $args = array(
            'post_type' => 'task_list',
            'meta_key' => '_milestone',
            'meta_value' => $milestone_id
        );

        $tasklists = get_posts( $args );
        foreach ($tasklists as $list) {
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
        return CPM_Comment::getInstance()->get_comments( $task_id );
    }

    /**
     * Mark a task as complete
     *
     * @param int $task_id task id
     */
    function mark_complete( $task_id ) {
        update_post_meta( $task_id, '_completed', 1 );
        update_post_meta( $task_id, '_completed_on', current_time( 'mysql' ) );
    }

    /**
     * Mark a task as uncomplete/open
     *
     * @param int $task_id task id
     */
    function mark_open( $task_id ) {
        update_post_meta( $task_id, '_completed', 0 );
        update_post_meta( $task_id, '_completed_on', current_time( 'mysql' ) );
    }

    function delete_task( $task_id, $force = false ) {
        wp_delete_post( $task_id, $force );
    }

    function get_completeness( $list_id ) {
        $tasks = $this->get_tasks( $list_id );

        return array(
            'total' => count( $tasks ),
            'completed' => array_sum( wp_list_pluck( $tasks, 'completed' ) )
        );
    }

}
