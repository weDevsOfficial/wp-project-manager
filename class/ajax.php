<?php

/**
 * Description of ajax
 *
 * @author tareq
 */
class CPM_Ajax {

    private $_task_obj;
    private $_milestone_obj;

    public function __construct() {
        $this->_task_obj = new CPM_Task();
        $this->_milestone_obj = new CPM_Milestone();

        add_action( 'wp_ajax_cpm_task_complete', array($this, 'mark_task_complete') );
        add_action( 'wp_ajax_cpm_task_open', array($this, 'mark_task_open') );
        add_action( 'wp_ajax_cpm_task_delete', array($this, 'delete_task') );
        add_action( 'wp_ajax_cpm_milestone_complete', array($this, 'milestone_complete') );
        add_action( 'wp_ajax_cpm_milestone_open', array($this, 'milestone_open') );
        add_action( 'wp_ajax_cpm_delete_milestone', array($this, 'milestone_delete') );
    }

    function mark_task_complete() {
        check_ajax_referer( 'cpm_nonce' );

        $task_id = (int) $_POST['task_id'];

        $this->_task_obj->mark_complete( $task_id );
        echo 'success';

        exit;
    }

    function mark_task_open() {
        check_ajax_referer( 'cpm_nonce' );

        $task_id = (int) $_POST['task_id'];

        $this->_task_obj->mark_open( $task_id );
        echo 'success';

        exit;
    }

    function delete_task() {
        check_ajax_referer( 'cpm_nonce' );

        $task_id = (int) $_POST['task_id'];

        $this->_task_obj->delete_task( $task_id );
        echo 'success';

        exit;
    }

    function milestone_delete() {
        check_ajax_referer( 'cpm_nonce' );

        $milestone_id = (int) $_POST['milestone_id'];

        $this->_milestone_obj->delete( $milestone_id );
        echo 'success';

        exit;
    }

    function milestone_complete() {
        check_ajax_referer( 'cpm_nonce' );

        $milestone_id = (int) $_POST['milestone_id'];

        $this->_milestone_obj->mark_complete( $milestone_id );
        print_r( $_POST );
        echo 'success';

        exit;
    }

    function milestone_open() {
        check_ajax_referer( 'cpm_nonce' );

        $milestone_id = (int) $_POST['milestone_id'];

        $this->_milestone_obj->mark_open( $milestone_id );
        echo 'success';

        exit;
    }

}

$cpm_ajax = new CPM_Ajax();