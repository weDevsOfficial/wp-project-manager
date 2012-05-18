<?php

class CPM_Milestone {

    /**
     * $wpdb comment object
     *
     * @var object
     */
    private $_db;
    private $_task_obj;
    private $_msg_obj;
    private static $_instance;

    public function __construct() {
        global $wpdb;

        $this->_db = $wpdb;
        $this->_task_obj = new CPM_Task();
        $this->_msg_obj = new CPM_Message();
    }

    public static function getInstance() {
        if ( !self::$_instance ) {
            self::$_instance = new CPM_Milestone();
        }

        return self::$_instance;
    }

    function create( $values, $project_id ) {
        $data = array(
            'project_id' => $project_id,
            'author' => get_current_user_id(),
            'name' => $values['title'],
            'description' => $values['text'],
            'due_date' => wedevs_date2mysql( $values['due'] ),
            'assigned_to' => $values['assigned'],
            'privacy' => $values['privacy'],
            'created' => current_time( 'mysql' ),
        );

        $this->_db->insert( CPM_MILESTONE_TABLE, $data );

        return $this->_db->insert_id;
    }

    function add( $project_id ) {
        $posted = $_POST;

        $data = array(
            'title' => $posted['milestone_name'],
            'text' => $posted['milestone_detail'],
            'due' => $posted['milestone_due'],
            'assigned' => $posted['milestone_assign'],
            'privacy' => $posted['milestone_privacy']
        );

        return $this->create( $data, $project_id );
    }

    function update( $milestone_id ) {
        $posted = $_POST;

        $data = array(
            'name' => $posted['milestone_name'],
            'description' => $posted['milestone_detail'],
            'due_date' => wedevs_date2mysql( $posted['milestone_due'] ),
            'assigned_to' => $posted['milestone_assign'],
            'privacy' => $posted['milestone_privacy']
        );

        $this->_db->update( CPM_MILESTONE_TABLE, $data, array('id' => $milestone_id) );
    }

    function delete( $milestone_id, $force = false ) {
        if ( $force == false ) {
            $data = array(
                'status' => 0,
            );

            $this->_db->update( CPM_MILESTONE_TABLE, $data, array('id' => $milestone_id) );
        } else {
            $sql = 'DELETE FROM ' . CPM_MILESTONE_TABLE . ' WHERE id = %d';

            return $this->_db->query( $this->_db->prepare( $sql, $milestone_id ) );
        }
    }

    function mark_complete( $milestone_id ) {
        $data = array(
            'completed' => 1,
            'completed_on' => current_time( 'mysql' )
        );

        $this->_db->update( CPM_MILESTONE_TABLE, $data, array('id' => $milestone_id) );
    }

    /**
     * Mark a task as uncomplete/open
     *
     * @param int $task_id task id
     */
    function mark_open( $milestone_id ) {
        $data = array(
            'completed' => 0,
        );

        $this->_db->update( CPM_MILESTONE_TABLE, $data, array('id' => $milestone_id) );
    }

    function get( $milestone_id ) {
        $sql = $this->_db->prepare( "SELECT * FROM " . CPM_MILESTONE_TABLE . " WHERE id=%d AND status = 1", $milestone_id );

        return $this->_db->get_row( $sql );
    }

    function get_by_project( $project_id ) {
        $sql = 'SELECT * FROM ' . CPM_MILESTONE_TABLE . ' WHERE project_id = %d AND status = 1 ORDER BY due_date ASC';

        return $this->_db->get_results( $this->_db->prepare( $sql, $project_id ) );
    }

    function get_tasklists( $milestone_id ) {
        return $this->_task_obj->get_tasklist_by_milestone( $milestone_id );
    }

    function get_messages( $milestone_id ) {
        return $this->_msg_obj->get_by_milestone( $milestone_id );
    }

}