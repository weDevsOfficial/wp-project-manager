<?php

/**
 * A logging class for tracking activity
 *
 * @author Tareq Hasan
 */
class CPM_Logger {
    const LOG_TYPE = 3;

    protected $task_obj;

    function __construct() {
        $this->task_obj = CPM_Task::getInstance();

        add_action( 'cpm_tasklist_new', array($this, 'tasklist_new') );
        add_action( 'cpm_tasklist_update', array($this, 'tasklist_update') );
        add_action( 'cpm_tasklist_delete', array($this, 'tasklist_delete') );

        add_action( 'cpm_task_new', array($this, 'task_new'), 10, 2 );
        add_action( 'cpm_task_update', array($this, 'task_update'), 10, 2 );
        add_action( 'cpm_task_complete', array($this, 'task_done') );
        add_action( 'cpm_task_open', array($this, 'task_undo') );
        add_action( 'cpm_task_delete', array($this, 'task_delete') );

        add_action( 'cpm_comment_new', array($this, 'comment_new') );
        add_action( 'cpm_comment_update', array($this, 'comment_update') );
        add_action( 'cpm_comment_delete', array($this, 'comment_delete') );
    }

    function tasklist_new( $list_id ) {
        $tasklist = $this->task_obj->get_task_list( $list_id );

        $this->log( "new tasklist added: '{$tasklist->post_title}'", 'tasklist' );
    }

    function tasklist_update( $list_id ) {
        $tasklist = $this->task_obj->get_task_list( $list_id );

        $this->log( "tasklist '{$tasklist->post_title}' updated", 'tasklist' );
    }

    function tasklist_delete( $list_id ) {
        $tasklist = $this->task_obj->get_task_list( $list_id );

        $this->log( "tasklist '{$tasklist->post_title}' deleted", 'tasklist' );
    }

    function task_new( $list_id, $task_id ) {
        $tasklist = $this->task_obj->get_task_list( $list_id );
        $task = $this->task_obj->get_task( $task_id );

        $this->log( "new task '{$task->post_title}' added on list '{$tasklist->post_title}'", 'task' );
    }

    function task_update( $list_id, $task_id ) {
        $tasklist = $this->task_obj->get_task_list( $list_id );
        $task = $this->task_obj->get_task( $task_id );

        $this->log( "task '{$task->post_title}' updated on list '{$tasklist->post_title}'", 'task' );
    }

    function task_done( $task_id ) {
        $task = $this->task_obj->get_task( $task_id );
        $tasklist = $this->task_obj->get_task_list( $task->post_parent );
        $user = get_user_by( 'id', get_current_user_id() );

        $this->log( "task '{$task->post_title}' marked as completed by '{$user->display_name}' on list '{$tasklist->post_title}'", 'task' );
    }

    function task_undo( $task_id ) {
        $task = $this->task_obj->get_task( $task_id );
        $tasklist = $this->task_obj->get_task_list( $task->post_parent );

        $this->log( "task '{$task->post_title}' re-opened on list '{$tasklist->post_title}'", 'task' );
    }

    function task_delete( $task_id ) {
        $task = $this->task_obj->get_task( $task_id );
        $tasklist = $this->task_obj->get_task_list( $task->post_parent );

        $this->log( "task '{$task->post_title}' deleted on list '{$tasklist->post_title}'", 'task' );
    }

    function comment_new( $comment_id ) {
        $comment_obj = CPM_Comment::getInstance()->get( $comment_id );
        $post = get_post( $comment_obj->comment_post_ID );

        $this->log( "new comment added on {$post->post_type} '{$post->post_title}'", 'comment' );
    }

    function comment_update( $comment_id ) {
        $comment_obj = CPM_Comment::getInstance()->get( $comment_id );
        $post = get_post( $comment_obj->comment_post_ID );

        $this->log( "comment#$comment_id updated on {$post->post_type} '{$post->post_title}'", 'comment' );
    }

    function comment_delete( $comment_id ) {
        $comment_obj = CPM_Comment::getInstance()->get( $comment_id );
        $post = get_post( $comment_obj->comment_post_ID );

        $this->log( "comment deleted on {$post->post_type} '{$post->post_title}'", 'comment' );
    }

    function log( $message, $type = '' ) {
        $format = !empty( $type ) ? '[%1$s][%2$s] %3$s' : '[%1$s] %3$s';

        $message = sprintf( $format, date( 'd.m.Y h:i:s' ), $type, $message );
        error_log( $message . "\n", self::LOG_TYPE, WP_CONTENT_DIR . '/pm-activity.log' );
    }

}