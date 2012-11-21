<?php

class CPM_Notification {

    function __construct() {
        //notify users
        add_action( 'cpm_project_new', array($this, 'project_new'), 10, 2 );

        add_action( 'cpm_comment_new', array($this, 'new_comment'), 10, 3 );
        add_action( 'cpm_message_new', array($this, 'new_message'), 10, 2 );
        
        add_action( 'cpm_task_new', array($this, 'new_task'), 10, 3 );
        add_action( 'cpm_task_update', array($this, 'new_task'), 10, 3 );
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

    /**
     * Notify users about the new project creation
     *
     * @uses `cpm_new_project` hook
     * @param int $project_id
     */
    function project_new( $project_id, $data ) {

        if ( isset( $_POST['project_notify'] ) && $_POST['project_notify'] == 'yes' ) {
            $co_workers = $_POST['project_coworker'];
            $users = array();

            foreach ($co_workers as $user_id) {
                $user = get_user_by( 'id', $user_id );
                $users[$user_id] = sprintf( '%s <%s>', $user->display_name, $user->user_email );
            }

            //if any users left, get their mail addresses and send mail
            if ( $users ) {

                $site_name = wp_specialchars_decode( get_option( 'blogname' ), ENT_QUOTES );
                $subject = sprintf( __( 'New Project invitation on %s', 'cpm' ), $site_name );
                $message = sprintf( __( 'You are assigned in a new project "%s" on %s', 'cpm' ), trim( $data['post_title'] ), $site_name ) . "\r\n";
                $message .= sprintf( __( 'You can see the project by going here: %s', 'cpm' ), cpm_url_project_details( $project_id ) ) . "\r\n";

                $this->send( implode(', ', $users), $subject, $message );
            }
        }
    }

    function new_message( $message_id, $project_id ) {
        $users = $this->prepare_contacts();

        if ( !$users ) {
            return;
        }

        $pro_obj = CPM_Project::getInstance();
        $msg_obj = CPM_Message::getInstance();

        $project = $pro_obj->get( $project_id );
        $msg = $msg_obj->get( $message_id );
        $author = wp_get_current_user();

        $subject = sprintf( __( '[%s] New message on project: %s', 'cpm' ), __( 'Project Manager', 'cpm' ), $project->post_title );
        $message = sprintf( 'New message on %s', $project->post_title ) . "\r\n\n";
        $message .= sprintf( 'Author : %s', $author->display_name ) . "\r\n";
        $message .= sprintf( __( 'Permalink : %s' ), cpm_url_single_message( $project_id, $message_id ) ) . "\r\n";
        $message .= sprintf( "Message : \r\n%s", $msg->post_content ) . "\r\n";

        $users = apply_filters( 'cpm_new_message_to', $users );
        $subject = apply_filters( 'cpm_new_message_subject', $subject );
        $message = apply_filters( 'cpm_new_message_message', $message );

        $this->send( implode( ', ', $users ), $subject, $message );
    }

    /**
     * Send email to all about a new comment
     *
     * @param int $comment_id
     * @param array $comment_info the post data
     */
    function new_comment( $comment_id, $project_id, $data ) {
        $users = $this->prepare_contacts();

        if ( !$users ) {
            return;
        }

        $msg_obj = CPM_Message::getInstance();
        $parent_post = get_post( $data['comment_post_ID'] );
        $post_type = get_post_type_object( $parent_post->post_type );
        $author = wp_get_current_user();

        $subject = sprintf( __( '[%s] New comment on %s: %s', 'cpm' ), __( 'Project Manager', 'cpm' ), $post_type->labels->singular_name, $parent_post->post_title );
        $message = sprintf( 'New comment on %s', $parent_post->post_title ) . "\r\n\n";
        $message .= sprintf( 'Author : %s', $author->display_name ) . "\r\n";
        $message .= sprintf( __( 'Permalink : %s' ), cpm_url_single_message( $project_id, $data['comment_post_ID'] ) ) . "\r\n";
        $message .= sprintf( "Comment : \r\n%s", $data['comment_content'] ) . "\r\n";

        $users = apply_filters( 'cpm_new_comment_to', $users );
        $subject = apply_filters( 'cpm_new_comment_subject', $subject );
        $message = apply_filters( 'cpm_new_comment_message', $message );

        $this->send( implode( ', ', $users ), $subject, $message );
    }

    function new_task( $list_id, $task_id, $data ) {

        //notification is not selected or no one is assigned
        if ( $_POST['task_assign'] == '-1' ) {
            return;
        }

        $user = get_user_by( 'id', intval( $_POST['task_assign'] ) );
        $to = sprintf( '%s <%s>', $user->display_name, $user->user_email );

        $subject = sprintf( __( '[%s] New task assigned to you', 'cpm' ), __( 'Project Manager', 'cpm' ) );
        $message = sprintf( 'A new task has been assigned to you' ) . "\r\n\n";

        $this->send( $to, $subject, $message );
    }

    function send( $to, $subject, $message ) {

        $blogname = wp_specialchars_decode(get_option('blogname'), ENT_QUOTES);
        $wp_email = 'no-reply@' . preg_replace( '#^www\.#', '', strtolower( $_SERVER['SERVER_NAME'] ) );
        $from = "From: \"$blogname\" <$wp_email>";
        $headers = "$from\nContent-Type: text/html; charset=\"" . get_option( 'blog_charset' ) . "\"\n";

        wp_mail( $to, $subject, $message, $headers);
    }

}