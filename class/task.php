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
            'show_ui' => true,
            'show_in_menu' => true,
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
            'show_ui' => true,
            'show_in_menu' => true,
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
            update_post_meta( $list_id, '_milestone', (int) $postdata['tasklist_milestone'] );
            update_post_meta( $list_id, '_due', wedevs_date2mysql( $postdata['tasklist_due'] ) );
            update_post_meta( $list_id, '_privacy', $postdata['tasklist_privacy'] );
            update_post_meta( $list_id, '_priority', $postdata['tasklist_priority'] );

            do_action( 'cpm_new_tasklist', $list_id, $data );
        }

        return $list_id;
    }

    function update_list( $list_id ) {
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

        if ( is_null( $key ) ) {
            //posted when task list creation
            $content = $postdata['task_text'];
            $assigned = $postdata['task_assign'];
            $due = wedevs_date2mysql( $postdata['task_due'] );
            $key = 0; //for menu order
        } else {
            //posted for a single task creation
            $content = $postdata['task_text'][$key];
            $assigned = $postdata['task_assign'][$key];
            $due = wedevs_date2mysql( $postdata['task_due'][$key] );
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
            $completed = get_post_meta( $task_id, '_completed', true );
        } else {
            $task_id = wp_insert_post( $data );
            $completed = 0;
        }

        if ( $task_id ) {
            update_post_meta( $task_id, '_assigned', $assigned );
            update_post_meta( $task_id, '_due', $due );
            update_post_meta( $task_id, '_completed', $completed );

            do_action( 'cpm_new_task', $list_id, $task_id, $data );
        }

        return $task_id;
    }

    function update_task( $list_id, $task_id ) {
        return $this->add_task( $list_id, null, $task_id );
    }

    /**
     * Get all task list by project with status = 1
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

        return get_posts( $args );
    }

    /**
     * Get a single task list by a task list id
     *
     * @param int $list_id
     * @return object object array of the result set
     */
    function get_task_list( $list_id ) {
        $task_list = get_post( $list_id );
        $task_list->due_date = get_post_meta( $list_id, '_due', true );

        return $task_list;
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
            $tasks[$key]->complete = get_post_meta( $task->ID, '_completed', true );
            $tasks[$key]->assigned_to = get_post_meta( $task->ID, '_assigned', true );
            $tasks[$key]->due_date = get_post_meta( $task->ID, '_due', true );
        }

        return $tasks;
    }

    /**
     * Get all tasks based on a milestone
     *
     * @param int $list_id
     * @return object object array of the result set
     */
    function get_tasklist_by_milestone( $milestone_id ) {
        $sql = 'SELECT * FROM ' . CPM_TASK_LIST_TABLE . ' WHERE milestone_id = %d AND status = 1';

        return $this->_db->get_results( $this->_db->prepare( $sql, $milestone_id ) );
    }

    /**
     * Get a single task detail
     *
     * @param int $task_id
     * @return object object array of the result set
     */
    function get_task( $task_id ) {
        $task = get_post( $task_id );
        $task->complete = get_post_meta( $task_id, '_completed', true );
        $task->assigned_to = get_post_meta( $task_id, '_assigned', true );
        $task->due_date = get_post_meta( $task_id, '_due', true );

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
    }

    /**
     * Mark a task as uncomplete/open
     *
     * @param int $task_id task id
     */
    function mark_open( $task_id ) {
        update_post_meta( $task_id, '_completed', 0 );
    }

    function delete_task( $task_id, $force = false ) {
        wp_delete_post( $task_id, $force );
    }

    function get_completeness( $list_id ) {
        $tasks = $this->get_tasks( $list_id );

        return array(
            'total' => count( $tasks ),
            'completed' => array_sum( wp_list_pluck( $tasks, 'complete' ) )
        );
    }

}