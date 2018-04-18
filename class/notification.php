<?php

class CPM_Notification {

    private static $_instance;

    function __construct() {
        
        //notify users
        add_action( 'cpm_project_new', array( $this, 'project_new' ), 10, 2 );
        add_action( 'cpm_project_update', array( $this, 'project_update' ), 10, 2 );

        add_action( 'cpm_comment_new', array( $this, 'new_comment' ), 10, 3 );
        add_action( 'cpm_comment_update', array( $this, 'update_comment' ), 10, 3 );
        add_action( 'cpm_message_new', array( $this, 'new_message' ), 10, 2 );

        add_action( 'cpm_task_new', array( $this, 'new_task' ), 9, 3 );
        add_action( 'cpm_task_update', array( $this, 'new_task' ), 9, 3 );
        add_action( 'mark_task_complete', array( $this, 'complete_task' ), 9, 3 );
       
        add_action( 'cpm_sub_task_new', array( $this, 'subtask_new_notify' ), 9, 3);
    }

    /**
     * get instance of CPM_Notification
     * 
     * @return Object
     */
    public static function getInstance() {
        if ( ! self::$_instance ) {
            self::$_instance = new CPM_Notification();
        }

        return self::$_instance;
    }

    /**
     * check email link url to front-end
     * @since 1.4.0
     */
    public function check_email_url() {
        if ( (cpm_get_option( 'email_url_link', 'cpm_mails' ) == 'frontend') && class_exists('CPM_Frontend_URLs')  ) {
            new CPM_Frontend_URLs();
        }
    }

    /**
     * Get site name
     *
     * @since 1.3
     *
     * @return string
     */
    public function get_site_name() {
        return wp_specialchars_decode( get_option( 'blogname' ), ENT_QUOTES );
    }

    function prepare_contacts($project_id) {
        $to         = array();
        $bcc_status = cpm_get_option( 'email_bcc_enable' , 'cpm_mails');

        if ( isset( $_POST['notify_user'] ) && is_array( $_POST['notify_user'] ) ) {

            foreach ( $_POST['notify_user'] as $user_id ) {
                $user_info = get_user_by( 'id', $user_id );
                if ( ! $this->filter_email( $user_info->ID ) ) {
                    continue;
                }
                if ( $user_info && $bcc_status == 'on' ) {
                    $to[] = sprintf( '%s', $user_info->user_email );
                    // $to[] = sprintf( '%s (%s)', $user_info->display_name, $user_info->user_email );
                } else if ( $user_info && $bcc_status != 'on' ) {
                    $to[] = sprintf( '%s', $user_info->user_email );
                }
            }
        }
        /*Adding manager in email list*/
        $managers_ids = cpm_get_all_manager_from_project($project_id);


        foreach ( $managers_ids as $user_id ){
            $user_info = get_user_by( 'id', $user_id );

            if ( ! $this->filter_email( $user_info->ID ) ) {
                continue;
            }

            if(in_array($to, $user_info->user_email)){
                continue;
            }

            if ( $user_info && $bcc_status == 'on' ) {
                $to[] = sprintf( '%s', $user_info->user_email ); 
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
            $project_users = CPM_Project::getInstance()->get_users( $project_id );
            $users         = array();

            if ( is_array( $project_users ) && count( $project_users ) ) {

                foreach ( $project_users as $user_id => $role_array ) {

                    if ( $this->filter_email( $user_id ) ) {
                        $users[$user_id] = sprintf( '%s', $role_array['email'] );
                        // $users[$user_id] = sprintf( '%s (%s)', $role_array['name'], $role_array['email'] );
                    }
                }
            }

            //if any users left, get their mail addresses and send mail
            if ( ! $users ) {
                return;
            }

            $this->check_email_url();
            $file_name = 'emails/new-project.php';

            $subject = sprintf( __( '[%s] New Project Invitation: %s', 'cpm' ), $this->get_site_name(), get_post_field( 'post_title', $project_id ) );

            // cutoff at 78th character
            if ( cpm_strlen( $subject ) > 78 ) {
                $subject = substr( $subject, 0, 78 ) . '...';
            }

            ob_start();
            $arg     = array(
                'project_id' => $project_id,
                'data'       => $data,
            );
            cpm_load_template( $file_name, $arg );
            $message = ob_get_clean();

            if ( $message ) {
                $this->send( implode( ', ', $users ), $subject, $message );
            }
        }
    }

    function filter_email( $user_id ) {
        $user_email_notification = get_user_meta( $user_id, '_cpm_email_notification', true );

        if ( $user_email_notification == 'off' ) {
            return false;
        }

        return true;
    }

    /**
     * Notify users about the update project creation
     *
     * @uses `cpm_new_project` hook
     * @param int $project_id
     */
    function project_update( $project_id, $data ) {

        if ( isset( $_POST['project_notify'] ) && $_POST['project_notify'] == 'yes' ) {
            $project_users = CPM_Project::getInstance()->get_users( $project_id );
            $users         = array();

            if ( is_array( $project_users ) && count( $project_users ) ) {

                foreach ( $project_users as $user_id => $role_array ) {

                    if ( $this->filter_email( $user_id ) ) {
                        $users[$user_id] = sprintf( '%s', $role_array['email'] );
                        // $users[$user_id] = sprintf( '%s (%s)', $role_array['name'], $role_array['email'] );
                    }
                }
            }

            //if any users left, get their mail addresses and send mail
            if ( ! $users ) {
                return;
            }


            $this->check_email_url();
            $file_name = 'emails/update-project.php';


            $subject = sprintf( __( '[%s] Project Update Invitation: %s', 'cpm' ), $this->get_site_name(), get_post_field( 'post_title', $project_id ) );

            // cutoff at 78th character
            if ( cpm_strlen( $subject ) > 78 ) {
                $subject = substr( $subject, 0, 78 ) . '...';
            }
                ob_start();
                $arg = array(
                    'project_id' => $project_id,
                    'data'       => $data,
                );
                cpm_load_template( $file_name, $arg );

                $message = ob_get_clean();
                if ( $message ) {
                    $this->send( implode( ', ', $users ), $subject, $message );
                }

        }
    }

    function complete_task( $project_id, $task_id  ) {
        $project_users = CPM_Project::getInstance()->get_users( $project_id );

        $users         = array();

        if ( is_array( $project_users ) && count( $project_users ) ) {
            foreach ( $project_users as $user_id => $role_array ) {
                if ( $role_array['role'] == 'manager' ) {
                    if ( $this->filter_email( $user_id ) ) {
                        // $users[$user_id] = sprintf( '%s (%s)', $role_array['name'], $role_array['email'] );
                        $users[$user_id] = sprintf( '%s', $role_array['email'] );
                    }
                }
            }
        }

        if ( ! $users ) {
            return;
        }

        $this->check_email_url();
        $file_name = 'emails/complete-task.php';
        $subject   = sprintf( __( '[%s][%s] Task Completed: %s', 'cpm' ), $this->get_site_name(), get_post_field( 'post_title', $project_id ), get_post_field( 'post_title', $task_id ) );

        // cutoff at 78th character
        if ( cpm_strlen( $subject ) > 78 ) {
            $subject = substr( $subject, 0, 78 ) . '...';
        }

        ob_start();

        $arg = array(
            'project_id' => $project_id,
            'task_id'    => $task_id,
        );
        cpm_load_template( $file_name, $arg );

        $message = ob_get_clean();
        
        if ( $message ) {
            $this->send( implode( ', ', $users ), $subject, $message );
        }
    }

    function new_message( $message_id, $project_id ) {
        $users = $this->prepare_contacts($project_id);
        if ( ! $users ) {
            return;
        }
        $this->check_email_url();
        $file_name = 'emails/new-message.php';

        $subject = sprintf( __( '[%s][%s] New Message: %s', 'cpm' ), $this->get_site_name(), get_post_field( 'post_title', $project_id ), get_post_field( 'post_title', $message_id ) );

        // cutoff at 78th character
        if ( cpm_strlen( $subject ) > 78 ) {
            $subject = substr( $subject, 0, 78 ) . '...';
        }
        ob_start();
        $arg     = array(
            'project_id' => $project_id,
            'message_id' => $message_id,
        );
        cpm_load_template( $file_name, $arg );
        $message = ob_get_clean();

        if ( $message ) {
            $this->send( implode( ', ', $users ), $subject, $message );
        }
    }

    /**
     * Send email to all about a new comment
     *
     * @param int $comment_id
     * @param array $comment_info the post data
     */
    function new_comment( $comment_id, $project_id, $data ) {

        $users = $this->prepare_contacts($project_id);

        if ( ! $users ) {
            return;
        }

        $this->check_email_url();
        $file_name   = 'emails/new-comment.php';
        $parent_post = get_comment( $comment_id );
        $subject     = sprintf( __( '[%s][%s] New Comment on: %s', 'cpm' ), $this->get_site_name(), get_post_field( 'post_title', $project_id ), get_post_field( 'post_title', $parent_post->comment_post_ID ) );

        // cutoff at 78th character
        if ( cpm_strlen( $subject ) > 78 ) {
            $subject = substr( $subject, 0, 78 ) . '...';
        }
        ob_start();
        $arg     = array(
            'project_id' => $project_id,
            'comment_id' => $comment_id,
            'data'       => $data
        );
        cpm_load_template( $file_name, $arg );
        $message = ob_get_clean();

        if ( $message ) {
            $this->send( implode( ', ', $users ), $subject, $message, $parent_post->comment_post_ID );
        }
    }

    /**
     * Send email to all about a  comment Update
     * @since 1.5.1
     * @param int $comment_id
     * @param array $comment_info the post data
     */
    function update_comment( $comment_id, $project_id, $data ) {

        $users = $this->prepare_contacts($project_id);
        if ( ! $users ) {
            return;
        }

        $this->check_email_url();
        $file_name   = 'emails/update-comment.php';
        $parent_post = get_comment( $comment_id );
        $subject     = sprintf( __( '[%s][%s] Update Comment on: %s', 'cpm' ), $this->get_site_name(), get_post_field( 'post_title', $project_id ), get_post_field( 'post_title', $parent_post->comment_post_ID ) );

        // cutoff at 78th character
        if ( cpm_strlen( $subject ) > 78 ) {
            $subject = substr( $subject, 0, 78 ) . '...';
        }
        ob_start();
        $arg     = array(
            'project_id' => $project_id,
            'comment_id' => $comment_id,
            'data'       => $data
        );
        cpm_load_template( $file_name, $arg );
        $message = ob_get_clean();

        if ( $message ) {
           $this->send( implode( ', ', $users ), $subject, $message, $parent_post->comment_post_ID );
        }
    }

    function new_task( $list_id, $task_id, $data ) {
        $new_task_notification = apply_filters( 'cpm_new_task_notification', true );

        if ( ! $new_task_notification ) {
            return;
        }

        $this->check_email_url();
        $file_name = 'emails/new-task.php';


        $_POST['task_assign'] = isset( $_POST['task_assign'] ) ? $_POST['task_assign'] : array();
        if ( $_POST['task_assign'] == '-1' ) {
            return;
        }

        $project_id = 0;

        if ( isset( $_POST['project_id'] ) ) {
            $project_id = intval( $_POST['project_id'] );
        }

        $subject = sprintf( __( '[%s][%s] New Task Assigned: %s', 'cpm' ), $this->get_site_name(), get_post_field( 'post_title', $project_id ), get_post_field( 'post_title', $list_id ) );

        // cutoff at 78th character
        if ( cpm_strlen( $subject ) > 78 ) {
            $subject = substr( $subject, 0, 78 ) . '...';
        }
        $assign_user =  (!is_array ($_POST['task_assign']) ) ? explode( ',', $_POST['task_assign'] ) : $_POST['task_assign'];

        foreach ( $assign_user as $key => $user_id ) {
            $user = get_user_by( 'id', intval( $user_id ) );

            if ( ! $user || ! $this->filter_email( $user_id ) ) {
                continue;
            }

            $to = sprintf( '%s', $user->user_email );


            ob_start();
            $arg = array(
                'project_id' => $project_id,
                'list_id'    => $list_id,
                'task_id'    => $task_id,
                'data'       => $data,
            );
            cpm_load_template( $file_name, $arg );
            $message = ob_get_clean();

            if ( $message ) {
                $this->send( $to, $subject, $message );
            }
        }
    }

    /**
     * Send email about subtask
     */
    function subtask_new_notify( $list_id, $task_id, $data ) {
        $new_task_notification = apply_filters( 'cpm_new_task_notification', true );

        if ( ! $new_task_notification ) {
            return;
        }

        $this->check_email_url();
        $file_name = 'emails/new-task.php';


        $_POST['task_assign'] = isset( $_POST['task_assign'] ) ? $_POST['task_assign'] : array();
        if ( $_POST['task_assign'] == '-1' ) {
            return;
        }

        $project_id = 0;

        if ( isset( $_POST['project_id'] ) ) {
            $project_id = intval( $_POST['project_id'] );
        }

        $subject = sprintf( __( '[%s][%s] New Sub Task Assigned: %s', 'cpm' ), $this->get_site_name(), get_post_field( 'post_title', $project_id ), get_post_field( 'post_title', $list_id ) );

        // cutoff at 78th character
        if ( cpm_strlen( $subject ) > 78 ) {
            $subject = substr( $subject, 0, 78 ) . '...';
        }
        $assign_user =  (!is_array ($_POST['task_assign']) ) ? explode( ',', $_POST['task_assign'] ) : $_POST['task_assign'] ;
        foreach ( $assign_user as $key => $user_id ) {
            $user = get_user_by( 'id', intval( $user_id ) );

            if ( ! $this->filter_email( $user_id ) ) {
                continue;
            }

            $to = sprintf( '%s', $user->user_email );


            ob_start();
            $arg = array(
                'project_id' => $project_id,
                'list_id'    => $list_id,
                'task_id'    => $task_id,
                'data'       => $data,
            );
            cpm_load_template( $file_name, $arg );
            $message = ob_get_clean();

            if ( $message ) {
                $this->send( $to, $subject, $message );
            }
        }
    }


    function send( $to, $subject, $message, $comment_post_id = 0 ) {
        $bcc_status   = cpm_get_option( 'email_bcc_enable', 'cpm_mails' );
        $blogname     = wp_specialchars_decode( get_option( 'blogname' ), ENT_QUOTES );
        $no_reply        = 'no-reply@' . preg_replace( '#^www\.#', '', strtolower( $_SERVER['SERVER_NAME'] ) );
        $content_type = 'Content-Type: text/html';
        $charset      = 'Charset: UTF-8';
        $from_email   = cpm_get_option( 'email_from', 'cpm_mails', get_option( 'admin_email' ) );
        $from         = "From: $blogname <$from_email>";
        $reply        = apply_filters( 'cpm_reply_to', $to, $comment_post_id );
        $reply_to     = "Reply-To: $no_reply";

        if ( $bcc_status == 'on' ) {
            $bcc     = 'Bcc: ' . $to;
            $headers = array(
                $bcc,
                $reply_to,
                $content_type,
                $charset,
                $from_email
            );

            wp_mail( $from_email, $subject, $message, $headers );
        } else {

            $headers = array(
                $reply_to,
                $content_type,
                $charset,
                $from,
            );

            wp_mail( $to, $subject, $message, $headers );
        }
    }

}
