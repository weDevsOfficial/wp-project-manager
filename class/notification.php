<?php

class CPM_Notification {

    function __construct() {
        add_action( 'cpm_new_comment', array($this, 'new_comment'), 10, 2 );
        add_action( 'cpm_new_message', array($this, 'new_message'), 10, 2 );
        add_action( 'cpm_new_task', array($this, 'new_task'), 10, 3 );
    }

    function prepare_contacts() {
        $to = array();
        if ( isset( $_POST['notify_user'] ) ) {
            foreach ($_POST['notify_user'] as $user_id) {
                $user_info = get_user_by( 'id', $user_id );
                $to[] = sprintf( '%s<%s>', $user_info->display_name, $user_info->user_email );
            }
        }

        return $to;
    }

    function new_message( $message_id, $message_info ) {
        $to = $this->prepare_contacts();

        if ( empty( $to ) ) {
            return;
        }

        $pro_obj = CPM_Project::getInstance();
        $msg_obj = CPM_Message::getInstance();

        $project = $pro_obj->get( $message_info['post_parent'] );
        $parent_message = $msg_obj->get( $message_id );
        $author = wp_get_current_user();

        $subject = sprintf( __( '[%s] New message on project: %s', 'cpm' ), __( 'Project Manager', 'cpm' ), $project->name );
        $message = sprintf( 'New message on %s', $project->name ) . "\r\n\n";
        $message .= sprintf( 'Author : %s', $author->display_name ) . "\r\n";
        $message .= sprintf( __( 'Permalink : %s' ), cpm_url_single_message( $message_info['post_parent'], $message_id ) ) . "\r\n";
        $message .= sprintf( "Message : \r\n%s", $parent_message->message ) . "\r\n";

        $to = apply_filters( 'cpm_new_message_to', $to );
        $subject = apply_filters( 'cpm_new_message_subject', $subject );
        $message = apply_filters( 'cpm_new_message_message', $message );

        wp_mail( implode( ', ', $to ), $subject, $message );
    }

    /**
     * Send email to all about a new comment
     *
     * @param int $comment_id
     * @param array $comment_info the post data
     */
    function new_comment( $comment_id, $comment_info ) {
        $to = $this->prepare_contacts();

        if ( empty( $to ) ) {
            return;
        }

        $msg_obj = CPM_Message::getInstance();
        $parent_message = $msg_obj->get( $comment_info['comment_post_ID'] );
        $author = wp_get_current_user();

        $subject = sprintf( __( '[%s] New comment on message: %s', 'cpm' ), __( 'Project Manager', 'cpm' ), $parent_message->post_title );
        $message = sprintf( 'New comment on %s', $parent_message->post_title ) . "\r\n\n";
        $message .= sprintf( 'Author : %s', $author->display_name ) . "\r\n";
        $message .= sprintf( __( 'Permalink : %s' ), cpm_url_single_message( $_POST['project_id'], $comment_info['comment_post_ID'] ) ) . "\r\n";
        $message .= sprintf( "Comment : \r\n%s", $comment_info['comment_content'] ) . "\r\n";

        $to = apply_filters( 'cpm_new_comment_to', $to );
        $subject = apply_filters( 'cpm_new_comment_subject', $subject );
        $message = apply_filters( 'cpm_new_comment_message', $message );

        wp_mail( implode( ', ', $to ), $subject, $message );
    }

    function new_task( $list_id, $task_id, $data ) {

        //notification is not selected or no one is assigned
        if ( !isset( $_POST['task_notification'] ) || $_POST['task_assign'] == '-1' ) {
            return;
        }

        $user = get_user_by( 'id', intval( $_POST['task_assign'] ) );
        $to = sprintf( '%s <%s>', $user->display_name, $user->user_email );

        $subject = sprintf( __( '[%s] New task assigned to you', 'cpm' ), __( 'Project Manager', 'cpm' ) );
        $message = sprintf( 'A new task has been assigned to you' ) . "\r\n\n";

        wp_mail( $to, $subject, $message );
    }

}

$cpm_notification = new CPM_Notification();