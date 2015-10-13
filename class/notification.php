<?php
class CPM_Notification {
    private static $_instance;
    function __construct() {

        //notify users
        add_action( 'cpm_project_new', array($this, 'project_new'), 10, 2 );
        add_action( 'cpm_project_update', array($this, 'project_update'), 10, 2 );

        add_action( 'cpm_comment_new', array($this, 'new_comment'), 10, 3 );
        add_action( 'cpm_message_new', array($this, 'new_message'), 10, 2 );

        add_action( 'cpm_task_new', array($this, 'new_task'), 10, 3 );
        add_action( 'cpm_task_update', array($this, 'new_task'), 10, 3 );
    }

    public static function getInstance() {
        if ( !self::$_instance ) {
            self::$_instance = new CPM_Notification();
        }

        return self::$_instance;
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

    function prepare_contacts() {
        $to = array();
        $bcc_status = cpm_get_option('email_bcc_enable');

        if ( isset( $_POST['notify_user'] ) && is_array( $_POST['notify_user'] ) ) {

            foreach ($_POST['notify_user'] as $user_id) {
                $user_info = get_user_by( 'id', $user_id );
                if( ! $this->filter_email( $user_info->ID ) ) {
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

        return $to;
    }

    /**
     * Notify users about the new project creation
     *
     * @uses `cpm_new_project` hook
     * @param int $project_id
     */
    function project_new( $project_id, $data ) {

        $file_path    = dirname (__FILE__) . '/../views/emails/new-project.php';
        $content_path = apply_filters( 'cpm_new_project_email_content', $file_path );
        $subject      = sprintf( __( '[%s] New Project Invitation: %s', 'cpm' ), $this->get_site_name(), get_post_field( 'post_title', $project_id ) );

        // cutoff at 78th character
        if ( cpm_strlen( $subject ) > 78 ) {
            $subject = substr( $subject, 0, 78 ) . '...';
        }

        if ( file_exists( $content_path ) ) {
            ob_start();
            include $content_path;
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

        $file_path   = dirname (__FILE__) . '/../views/emails/update-project.php';
        $content_path = apply_filters( 'cpm_update_project_email_content', $file_path );
        $subject      = sprintf( __( '[%s] Updated Project Invitation: %s', 'cpm' ), $this->get_site_name(), get_post_field( 'post_title', $project_id ) );

        // cutoff at 78th character
        if ( cpm_strlen( $subject ) > 78 ) {
            $subject = substr( $subject, 0, 78 ) . '...';
        }

        if ( file_exists( $content_path ) ) {
            ob_start();
            include $content_path;
            $message = ob_get_clean();
            if ( $message ) {
               $this->send( implode(', ', $users), $subject, $message );
            }
        }
    }

    function complete_task( $list_id, $task_id, $data, $project_id ) {

        $file_path    = CPM_PATH . '/views/emails/complete-task.php';
        $content_path = apply_filters( 'cpm_complete_task_email_content', $file_path );
        $subject      = sprintf( __( '[%s][%s] Task Completed: %s', 'cpm' ), $this->get_site_name(), get_post_field( 'post_title', $project_id ), get_post_field( 'post_title', $task_id ) );

        // cutoff at 78th character
        if ( cpm_strlen( $subject ) > 78 ) {
            $subject = substr( $subject, 0, 78 ) . '...';
        }

        if ( file_exists( $content_path ) ) {
            ob_start();
            include $content_path;
            $message = ob_get_clean();

            if ( $message ) {
                $this->send( implode(', ', $users), $subject, $message);
            }
        }
    }

    function new_message( $message_id, $project_id ) {
        $file_path    = CPM_PATH . '/views/emails/new-message.php';
        $content_path = apply_filters( 'cpm_new_message_email_content', $file_path );
        $subject      = sprintf( __( '[%s][%s] New Message: %s', 'cpm' ), $this->get_site_name(), get_post_field( 'post_title', $project_id ), get_post_field( 'post_title', $message_id ) );

        // cutoff at 78th character
        if ( cpm_strlen( $subject ) > 78 ) {
            $subject = substr( $subject, 0, 78 ) . '...';
        }

        if ( file_exists( $content_path ) ) {
            ob_start();
            include $content_path;
            $message = ob_get_clean();

            if ( $message ) {
                $this->send( implode( ', ', $users ), $subject, $message );
            }

        }
    }

    /**
     * Send email to all about a new comment
     *
     * @param int $comment_id
     * @param array $comment_info the post data
     */
    function new_comment( $comment_id, $project_id, $data ) {
        $file_path    = CPM_PATH . '/views/emails/new-comment.php';
        $content_path = apply_filters( 'cpm_new_comment_email_content', $file_path );
        $parent_post  =  get_comment( $comment_id );
        $subject      = sprintf( __( '[%s][%s] New Comment on: %s', 'cpm' ), $this->get_site_name(), get_post_field( 'post_title', $project_id ), get_post_field( 'post_title', $parent_post->comment_post_ID ) );

        // cutoff at 78th character
        if ( cpm_strlen( $subject ) > 78 ) {
            $subject = substr( $subject, 0, 78 ) . '...';
        }

        if ( file_exists( $content_path ) ) {
            ob_start();
            include $content_path;
            $message = ob_get_clean();
            if ( $message ) {
               $this->send( implode( ', ', $users ), $subject, $message, $parent_post->comment_post_ID );
            }
        }
    }

    function new_task( $list_id, $task_id, $data ) {
        //for api
        $new_task_notification = apply_filters( 'cpm_new_task_notification', true );
        if ( ! $new_task_notification ) {
            return;
        }

        $file_path    = CPM_PATH . '/views/emails/new-task.php';
        $content_path = apply_filters( 'cpm_new_task_email_content', $file_path );

        $_POST['task_assign'] = isset( $_POST['task_assign'] ) ? $_POST['task_assign'] : array();
        if ( $_POST['task_assign'] == '-1' ) {
            return;
        }

        $project_id = 0;

        if ( isset( $_POST['project_id'] )) {
            $project_id = intval( $_POST['project_id'] );
        }

        $subject = sprintf( __( '[%s][%s] New Task Assigned: %s', 'cpm' ), $this->get_site_name(), get_post_field( 'post_title', $project_id ), get_post_field( 'post_title', $list_id ) );

        // cutoff at 78th character
        if ( cpm_strlen( $subject ) > 78 ) {
            $subject = substr( $subject, 0, 78 ) . '...';
        }

        foreach ( $_POST['task_assign'] as $key => $user_id) {
            $user = get_user_by( 'id', intval( $user_id ) );

            if ( ! $this->filter_email( $user_id ) ) {
                continue;
            }

            $to = sprintf( '%s', $user->user_email );

            if ( file_exists( $content_path ) ) {
                ob_start();
                include_once $content_path;
                $message = ob_get_clean();
                if ( $message ) {
                   $this->send( $to, $subject, $message );
                }

            }

        }
    }

    function send( $to, $subject, $message, $comment_post_id = 0 ) {

        $bcc_status   = cpm_get_option( 'email_bcc_enable' );
        $blogname     = wp_specialchars_decode(get_option('blogname'), ENT_QUOTES);
        $reply        = 'no-reply@' . preg_replace( '#^www\.#', '', strtolower( $_SERVER['SERVER_NAME'] ) );
        $content_type = 'Content-Type: text/html';
        $charset      = 'Charset: UTF-8';
        $from_email   = cpm_get_option( 'email_from' );
        $from         = "From: $blogname <$from_email>";
        $reply        = apply_filters( 'cpm_reply_to', $to, $comment_post_id );
        $reply_to     = "Reply-To: $reply";

        if ( $bcc_status == 'on' ) {
            $bcc = 'Bcc: '. $to;
            $headers = array(
                $bcc,
                $reply_to,
                $content_type,
                $charset,
                $from
            );

            wp_mail( $reply, $subject, $message, $headers);
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
