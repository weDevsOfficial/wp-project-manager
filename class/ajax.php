<?php

/**
 * Description of ajax
 *
 * @author tareq
 */
class CPM_Ajax {

    private $_task_obj;

    public function __construct() {
        $this->_task_obj = new CPM_Task();

        add_action( 'wp_ajax_cpm_task_complete', array($this, 'mark_task_complete') );
        add_action( 'wp_ajax_cpm_task_open', array($this, 'mark_task_open') );
        add_action( 'wp_ajax_cpm_task_delete', array($this, 'delete_task') );
    }

    function mark_task_complete() {
        check_ajax_referer( 'cpm_task' );

        $task_id = (int) $_POST['task_id'];

        $this->_task_obj->mark_complete( $task_id );
        echo 'success';

        exit;
    }

    function mark_task_open() {
        check_ajax_referer( 'cpm_task' );

        $task_id = (int) $_POST['task_id'];

        $this->_task_obj->mark_open( $task_id );
        echo 'success';

        exit;
    }

    function delete_task() {
        check_ajax_referer( 'cpm_task' );

        $task_id = (int) $_POST['task_id'];

        $this->_task_obj->delete_task( $task_id );
        echo 'success';

        exit;
    }

}

$cpm_ajax = new CPM_Ajax();