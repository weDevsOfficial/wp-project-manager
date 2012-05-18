<?php

/**
 * Description of task
 *
 * @author tareq
 */
class CPM_Task {

    /**
     * $wpdb comment object
     *
     * @var object
     */
    private $_db;

    /**
     * CPM Comment class
     *
     * @var object
     */
    private $_comment_obj;

    public function __construct() {
        global $wpdb;

        $this->_db = $wpdb;
        $this->_comment_obj = new CPM_Comment();
    }

    function insert_list( $values ) {
        $data = array(
            'author' => get_current_user_id(),
            'created' => current_time( 'mysql' ),
        );

        $data = wp_parse_args( $data, $values );

        $this->_db->insert( CPM_TASK_LIST_TABLE, $data );

        return $this->_db->insert_id;
    }

    function insert_task( $values ) {
        $data = array(
            'author' => get_current_user_id(),
            'created' => current_time( 'mysql' ),
        );

        $data = wp_parse_args( $data, $values );

        $this->_db->insert( CPM_TASKS_TABLE, $data );

        return $this->_db->insert_id;
    }

    function add_list( $project_id ) {
        $postdata = $_POST;

        $data = array(
            'milestone_id' => (int) $postdata['tasklist_milestone'],
            'project_id' => $project_id,
            'name' => $postdata['tasklist_name'],
            'description' => $postdata['tasklist_detail'],
            'due_date' => wedevs_date2mysql( $postdata['tasklist_due'] ),
            'privacy' => $postdata['tasklist_privacy']
        );

        return $this->insert_list( $data );
    }

    function update_list( $list_id ) {
        $postdata = $_POST;

        $data = array(
            'milestone_id' => (int) $postdata['tasklist_milestone'],
            'name' => $postdata['tasklist_name'],
            'description' => $postdata['tasklist_detail'],
            'due_date' => wedevs_date2mysql( $postdata['tasklist_due'] ),
            'privacy' => $postdata['tasklist_privacy'],
            'priority' => $postdata['tasklist_priority']
        );

        $this->_db->update( CPM_TASK_LIST_TABLE, $data, array('id' => $list_id) );
    }

    function add_task( $key, $list_id ) {
        $data = array(
            'list_id' => $list_id,
            'text' => $_POST['task_text'][$key],
            'assigned_to' => $_POST['task_assign'][$key],
            'due_date' => wedevs_date2mysql( $_POST['task_due'][$key] ),
            'order' => $key
        );

        return $this->insert_task( $data );
    }

    function add_single_task( $list_id ) {
        $data = array(
            'list_id' => $list_id,
            'text' => $_POST['task_text'],
            'assigned_to' => $_POST['task_assign'],
            'due_date' => wedevs_date2mysql( $_POST['task_due'] )
        );

        return $this->insert_task( $data );
    }

    function update_single_task( $task_id ) {
        $data = array(
            'list_id' => $_POST['task_list'],
            'text' => $_POST['task_text'],
            'assigned_to' => $_POST['task_assign'],
            'due_date' => wedevs_date2mysql( $_POST['task_due'] )
        );

        $this->_db->update( CPM_TASKS_TABLE, $data, array('id' => $task_id) );
    }

    /**
     * Get all task list by project with status = 1
     *
     * @param int $project_id
     * @return object object array of the result set
     */
    function get_task_lists( $project_id ) {
        $sql = 'SELECT * FROM ' . CPM_TASK_LIST_TABLE . ' WHERE project_id = %d AND status = 1';

        return $this->_db->get_results( $this->_db->prepare( $sql, $project_id ) );
    }

    /**
     * Get a single task list by a task list id
     *
     * @param int $list_id
     * @return object object array of the result set
     */
    function get_task_list( $list_id ) {
        $sql = 'SELECT * FROM ' . CPM_TASK_LIST_TABLE . ' WHERE id = %d AND status = 1';

        return $this->_db->get_row( $this->_db->prepare( $sql, $list_id ) );
    }

    /**
     * Get all tasks based on a task list
     *
     * @param int $list_id
     * @return object object array of the result set
     */
    function get_tasks( $list_id ) {
        $sql = 'SELECT * FROM ' . CPM_TASKS_TABLE . ' WHERE list_id = %d AND status = 1';

        return $this->_db->get_results( $this->_db->prepare( $sql, $list_id ) );
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
        $sql = 'SELECT * FROM ' . CPM_TASKS_TABLE . ' WHERE id = %d AND status = 1';

        return $this->_db->get_row( $this->_db->prepare( $sql, $task_id ) );
    }

    /**
     * Get all comment on a task list
     *
     * @param int $list_id
     * @return object object array of the result set
     */
    function get_comments( $list_id ) {
        return $this->_comment_obj->get_comments( $list_id, 'TASK_LIST' );
    }

    /**
     * Get all comments on a single task
     *
     * @param int $task_id
     * @return object object array of the result set
     */
    function get_task_comments( $task_id ) {
        return $this->_comment_obj->get_comments( $task_id, 'TASK' );
    }

    function new_comment( $values, $list_id ) {

        $data = array(
            'text' => $values['text'],
            'file' => $values['file'],
            'privacy' => 0
        );

        $comment_id = $this->_comment_obj->create( $data, $list_id, 'TASK_LIST' );

        return $comment_id;
    }

    function new_task_comment( $values, $task_id ) {

        $data = array(
            'text' => $values['text'],
            'file' => $values['file'],
            'privacy' => 0
        );

        $comment_id = $this->_comment_obj->create( $data, $task_id, 'TASK' );

        return $comment_id;
    }

    function upload_file() {
        return $this->_comment_obj->upload_file();
    }

    function get_comment_count( $list_id ) {
        return $this->_comment_obj->get_count( $list_id, 'TASK_LIST' );
    }

    /**
     * Mark a task as complete
     *
     * @param int $task_id task id
     */
    function mark_complete( $task_id ) {
        $data = array(
            'complete' => 1,
            'completed_date' => current_time( 'mysql' )
        );

        $this->_db->update( CPM_TASKS_TABLE, $data, array('id' => $task_id) );
    }

    /**
     * Mark a task as uncomplete/open
     *
     * @param int $task_id task id
     */
    function mark_open( $task_id ) {
        $data = array(
            'complete' => 0,
        );

        $this->_db->update( CPM_TASKS_TABLE, $data, array('id' => $task_id) );
    }

    function delete_task( $task_id, $force = false ) {
        if ( $force == false ) {
            $data = array(
                'status' => 0,
            );

            $this->_db->update( CPM_TASKS_TABLE, $data, array('id' => $task_id) );
        } else {
            $sql = 'DELETE FROM ' . CPM_TASKS_TABLE . ' WHERE id = %d';

            return $this->_db->query( $this->_db->prepare( $sql, $task_id ) );
        }
    }

    function get_completeness( $list_id ) {
        $sql = "SELECT count(id) as total, SUM(CASE complete WHEN '1' THEN 1 ELSE 0 END) as done FROM " . CPM_TASKS_TABLE .
            "  WHERE list_id = %d AND status = 1";

        return $this->_db->get_row( $this->_db->prepare( $sql, $list_id ) );
    }

}