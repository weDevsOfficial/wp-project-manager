<?php

/**
 *  Manage Transient API
 *  @since 1.3.8
 *  Date : 2015-11-24
 *
 */
class CPM_Managetransient extends CPM_Notification {

    private static $_instance;

    function __construct() {
        //  parent::__construct();
        
        add_action( 'cpm_comment_new', array( $this, 'new_comment' ), 10, 3 );
        add_action( 'cpm_message_new', array( $this, 'new_message' ), 10, 2 );

        add_action( 'cpm_task_new', array( $this, 'new_task' ), 10, 3 );
        add_action( 'cpm_task_update', array( $this, 'new_task' ), 10, 3 );
    }

    public static function getInstance() {
        if ( ! self::$_instance ) {
            self::$_instance = new CPM_Managetransient ();
        }

        return self::$_instance;
    }

    public function check_email_url() {
        return;
    }

    function project_new( $project_id, $data ) {
        return;
    }

    function project_update( $project_id, $data ) {
        return;
    }

    /**
     * Delete chart Transient
     *
     * @since 1.3.8
     *
     * @return void
     */
    function delete_chart_transient_data( $project_id ) {
        $chart_transient = 'cpm_chart_data_' . $project_id;
        delete_transient( $chart_transient );
    }

    /* Delete Chart Transient Data when New Message created.
     *
     * @param int $message_id
     * @param int $project_id
     *
     */

    function new_message( $message_id, $project_id ) {
        $this->delete_chart_transient_data( $project_id );
    }

    /**
     * Delete Chart Transient Data when new comments
     *
     * @param int $comment_id
     * @param int $project_id
     * @param array $data
     */
    function new_comment( $comment_id, $project_id, $data ) {

        $this->delete_chart_transient_data( $project_id );
    }

    /**
     * Delete Chart Transient Data when New task create
     *
     * @param int $list_id
     * @param int $task_id
     * @param array $data
     */
    function new_task( $list_id, $task_id, $data ) {

        $project = get_post( $list_id );
        $this->delete_chart_transient_data( $project->post_parent );
    }

    /**
     * Delete Chart Transient Data when complete a task
     *
     * @param int $list_id
     * @param int $task_id
     * @param array $data
     * @param int $project_id
     */
    function complete_task( $project_id, $task_id ) {

        $this->delete_chart_transient_data( $project_id );
    }

}

//End  CPM_Managetransient Class