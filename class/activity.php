<?php

/**
 * A logging class for tracking activity
 *
 * @author Tareq Hasan
 */
class CPM_Activity {

    private static $_instance;

    function __construct() {
        //project
        add_action( 'cpm_project_new', array( $this, 'project_new' ) );
        add_action( 'cpm_project_update', array( $this, 'project_update' ) );

        //message
        add_action( 'cpm_message_new', array( $this, 'message_new' ), 10, 2 );
        add_action( 'cpm_message_update', array( $this, 'message_update' ), 10, 2 );
        add_action( 'cpm_message_delete', array( $this, 'message_delete' ) );

        //to-do list
        add_action( 'cpm_tasklist_new', array( $this, 'tasklist_new' ), 10, 2 );
        add_action( 'cpm_tasklist_update', array( $this, 'tasklist_update' ), 10, 2 );
        add_action( 'cpm_tasklist_delete', array( $this, 'tasklist_delete' ) );

        //to-do
        add_action( 'cpm_task_new', array( $this, 'task_new' ), 10, 2 );
        add_action( 'cpm_task_update', array( $this, 'task_update' ), 10, 2 );
        add_action( 'cpm_task_complete', array( $this, 'task_done' ) );
        add_action( 'cpm_task_open', array( $this, 'task_undo' ) );
        add_action( 'cpm_task_delete', array( $this, 'task_delete' ) );

        //comment
        add_action( 'cpm_comment_new', array( $this, 'comment_new' ), 10, 2 );
        add_action( 'cpm_comment_update', array( $this, 'comment_update' ), 10, 2 );
        add_action( 'cpm_comment_delete', array( $this, 'comment_delete' ) );

        //milestone
        add_action( 'cpm_milestone_new', array( $this, 'milestone_new' ), 10, 2 );
        add_action( 'cpm_milestone_update', array( $this, 'milestone_update' ), 10, 2 );
        add_action( 'cpm_milestone_delete', array( $this, 'milestone_delete' ) );
        add_action( 'cpm_milestone_complete', array( $this, 'milestone_done' ) );
        add_action( 'cpm_milestone_open', array( $this, 'milestone_open' ) );
    }

    public static function getInstance() {
        if ( ! self::$_instance ) {
            self::$_instance = new self();
        }

        return self::$_instance;
    }

    function user_url() {
        return sprintf( '[cpm_user_url id="%d"]', get_current_user_id() );
    }

    function message_url( $message_id, $project_id, $title ) {
        return sprintf( '[cpm_msg_url id="%d" project="%d" title="%s"]', $message_id, $project_id, $title );
    }

    function list_url( $list_id, $project_id, $title ) {
        return sprintf( '[cpm_tasklist_url id="%d" project="%d" title="%s"]', $list_id, $project_id, $title );
    }

    function task_url( $task_id, $list_id, $project_id, $title ) {
        return sprintf( '[cpm_task_url id="%d" project="%d" list="%d" title="%s"]', $task_id, $project_id, $list_id, $title );
    }

    function project_new( $project_id ) {
        $message = sprintf( __( 'Project created by %s', 'cpm' ), $this->user_url() );

        $this->log( $project_id, $message );
    }

    function project_update( $project_id ) {
        $message = sprintf( __( 'Project details updated by %s', 'cpm' ), $this->user_url() );

        $this->log( $project_id, $message );
    }

    function message_new( $message_id, $project_id ) {
        if ( $this->check_message_privacy( $message_id ) ) {
            return;
        }
        $msg     = get_post( $message_id );
        $message = sprintf(
                __( 'Message "%s" created by %s', 'cpm' ), $this->message_url( $message_id, $project_id, $msg->post_title ), $this->user_url()
        );

        $this->log( $project_id, $message );
    }

    function message_update( $message_id, $project_id ) {
        if ( $this->check_message_privacy( $message_id ) ) {
            return;
        }
        $msg     = get_post( $message_id );
        $message = sprintf(
                __( 'Message "%s" updated by %s', 'cpm' ), $this->message_url( $message_id, $project_id, $msg->post_title ), $this->user_url()
        );

        $this->log( $project_id, $message );
    }

    function message_delete( $message_id ) {
        if ( $this->check_message_privacy( $message_id ) ) {
            return;
        }

        $msg = get_post( $message_id );

        if ( empty( $msg ) ) {
            $message_id = intval( $message_id );
            $message    = sprintf( __( 'Message with ID %d was not found in the database', 'cpm' ), $message_id );

            $this->log( $message_id, $message );
            return;
        }

        $message = sprintf( __( 'Message "%s" deleted by %s', 'cpm' ), $msg->post_title, $this->user_url() );

        $this->log( $msg->post_parent, $message );
    }

    function check_message_privacy( $list_id ) {
        $message_privacy = get_post_meta( $list_id, '_message_privacy', true );
        if ( $message_privacy == 'yes' ) {
            return true;
        }

        return false;
    }

    function tasklist_new( $list_id, $project_id ) {
        if ( $this->check_tasklist_privacy( $list_id ) ) {
            return;
        }

        $list    = get_post( $list_id );
        $message = sprintf(
                __( 'Task list "%s" created by %s', 'cpm' ), $this->list_url( $list_id, $project_id, $list->post_title ), $this->user_url()
        );

        $this->log( $project_id, $message );
    }

    function tasklist_update( $list_id, $project_id ) {
        if ( $this->check_tasklist_privacy( $list_id ) ) {
            return;
        }

        $list    = get_post( $list_id );
        $message = sprintf(
                __( 'Task list "%s" updated by %s', 'cpm' ), $this->list_url( $list_id, $project_id, $list->post_title ), $this->user_url()
        );

        $this->log( $project_id, $message );
    }

    function tasklist_delete( $list_id ) {
        if ( $this->check_tasklist_privacy( $list_id ) ) {
            return;
        }

        $list    = get_post( $list_id );
        $message = sprintf(
                __( 'Task list "%s" deleted by %s', 'cpm' ), $list->post_title, $this->user_url()
        );

        $this->log( $list->post_parent, $message );
    }

    function check_tasklist_privacy( $list_id ) {
        $task_list_privacy = get_post_meta( $list_id, '_tasklist_privacy', true );
        if ( $task_list_privacy == 'yes' ) {
            return true;
        }

        return false;
    }

    function task_new( $list_id, $task_id ) {
        if ( $this->check_task_privacy( $task_id ) ) {
            return;
        }

        $list = get_post( $list_id );
        $task = get_post( $task_id );

        $message = sprintf(
                __( 'Task "%s" added to task list "%s" by %s', 'cpm' ), $this->task_url( $task_id, $list_id, $list->post_parent, $task->post_title ), $this->list_url( $list_id, $list->post_parent, $list->post_title ), $this->user_url()
        );

        $this->log( $list->post_parent, $message );
    }

    function task_update( $list_id, $task_id ) {

        if ( $this->check_task_privacy( $task_id ) ) {
            return;
        }

        $list = get_post( $list_id );
        $task = get_post( $task_id );

        $message = sprintf(
                __( 'Task "%s" updated by %s', 'cpm' ), $this->task_url( $task_id, $list_id, $list->post_parent, $task->post_title ), $this->user_url()
        );

        $this->log( $list->post_parent, $message );
    }

    function task_done( $task_id ) {

        if ( $this->check_task_privacy( $task_id ) ) {
            return;
        }

        $task = get_post( $task_id );
        $list = get_post( $task->post_parent );

        $message = sprintf(
                __( 'Task "%s" completed by %s', 'cpm' ), $this->task_url( $task_id, $list->ID, $list->post_parent, $task->post_title ), $this->user_url()
        );

        $task_message = __( 'Task marked as done', 'cpm' );

        $this->log( $list->post_parent, $message );
        $this->log( $task_id, $task_message );
    }

    function task_undo( $task_id ) {
        if ( $this->check_task_privacy( $task_id ) ) {
            return;
        }

        $task = get_post( $task_id );
        $list = get_post( $task->post_parent );

        $message = sprintf(
                __( 'Task "%s" marked as undone by %s', 'cpm' ), $this->task_url( $task_id, $list->ID, $list->post_parent, $task->post_title ), $this->user_url()
        );

        $task_message = __( 'Task reopened', 'cpm' );

        $this->log( $list->post_parent, $message );
        $this->log( $task_id, $task_message );
    }

    function task_delete( $task_id ) {
        if ( $this->check_task_privacy( $task_id ) ) {
            return;
        }

        $task = get_post( $task_id );
        $list = get_post( $task->post_parent );

        $message = sprintf(
                __( 'Task "%s" deleted from task list "%s" by %s', 'cpm' ), $task->post_title, $this->list_url( $list->ID, $list->post_parent, $list->post_title ), $this->user_url()
        );

        $this->log( $list->post_parent, $message );
    }

    function check_task_privacy( $task_id ) {
        $task_privacy = get_post_meta( $task_id, '_task_privacy', true );
        if ( $task_privacy == 'yes' ) {
            return true;
        }

        return false;
    }

    function comment_new( $comment_id, $project_id ) {
        $message = sprintf( __( '%s commented on a %s', 'cpm' ), $this->user_url(), "[cpm_comment_url id='$comment_id' project='$project_id']" );

        $this->log( $project_id, $message );
    }

    function comment_update( $comment_id, $project_id ) {
        $message = sprintf( __( '%s updated a comment on a %s', 'cpm' ), $this->user_url(), "[cpm_comment_url id='$comment_id' project='$project_id']" );

        $this->log( $project_id, $message );
    }

    function comment_delete( $comment_id ) {
        $comment = get_comment( $comment_id );

        $message = sprintf( __( '%s deleted a comment', 'cpm' ), $this->user_url() );

        $this->log( $_POST['project_id'], $message );
    }

    function milestone_new( $milestone_id, $project_id ) {
        if ( $this->check_milestone_privacy( $milestone_id ) ) {
            return;
        }

        $milestone = get_post( $milestone_id );
        $message   = sprintf( __( 'Milestone "%s" added by %s', 'cpm' ), $milestone->post_title, $this->user_url() );

        $this->log( $project_id, $message );
    }

    function milestone_update( $milestone_id, $project_id ) {
        if ( $this->check_milestone_privacy( $milestone_id ) ) {
            return;
        }

        $milestone = get_post( $milestone_id );
        $message   = sprintf( __( 'Milestone "%s" updated by %s', 'cpm' ), $milestone->post_title, $this->user_url() );

        $this->log( $project_id, $message );
    }

    function milestone_delete( $milestone_id ) {
        if ( $this->check_milestone_privacy( $milestone_id ) ) {
            return;
        }

        $milestone = get_post( $milestone_id );
        $message   = sprintf( __( 'Milestone "%s" deleted by %s', 'cpm' ), $milestone->post_title, $this->user_url() );

        $this->log( $_POST['project_id'], $message );
    }

    function milestone_done( $milestone_id ) {
        if ( $this->check_milestone_privacy( $milestone_id ) ) {
            return;
        }

        $milestone = get_post( $milestone_id );
        $message   = sprintf( __( 'Milestone "%s" marked as complete by %s', 'cpm' ), $milestone->post_title, $this->user_url() );

        $this->log( $_POST['project_id'], $message );
    }

    function milestone_open( $milestone_id ) {
        if ( $this->check_milestone_privacy( $milestone_id ) ) {
            return;
        }

        $milestone = get_post( $milestone_id );
        $message   = sprintf( __( 'Milestone "%s" marked as incomplete by %s', 'cpm' ), $milestone->post_title, $this->user_url() );

        $this->log( $_POST['project_id'], $message );
    }

    function check_milestone_privacy( $milestone_id ) {
        $milestone_privacy = get_post_meta( $milestone_id, '_milestone_privacy', true );
        if ( $milestone_privacy == 'yes' ) {
            return true;
        }

        return false;
    }

    function log( $post_id, $message ) {
        $user = wp_get_current_user();

        $commentdata = array(
            'comment_author_IP'    => preg_replace( '/[^0-9a-fA-F:., ]/', '', $_SERVER['REMOTE_ADDR'] ),
            'comment_agent'        => substr( $_SERVER['HTTP_USER_AGENT'], 0, 254 ),
            'comment_type'         => 'cpm_activity',
            'comment_content'      => $message,
            'comment_post_ID'      => $post_id,
            'user_id'              => $user->ID,
            'comment_author'       => $user->display_name,
            'comment_author_email' => $user->user_email,
        );

        wp_insert_comment( $commentdata );

        //flush the project cache for new information
        CPM_Project::getInstance()->flush_cache( $post_id );
    }

    function get_projects_comment_count( $projects = array() ) {

        $comment_count = array(
            "approved"            => 0,
            "awaiting_moderation" => 0,
            "spam"                => 0,
            "total_comments"      => 0
        );

        foreach ( $projects as $key => $project ) {
            $totals = get_comment_count( $project->ID );

            $comment_count['approved'] += $totals['approved'];
            $comment_count['awaiting_moderation'] += $totals['awaiting_moderation'];
            $comment_count['spam'] += $totals['spam'];
            $comment_count['total_comments'] += $totals['total_comments'];
        }
        return $comment_count;
    }

}
