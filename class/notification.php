<?php
class CPM_Notification {
    
    private static $_instance;
    
    function __construct() {

        //notify users
        add_action( 'cpm_project_new', array($this, 'project_new'), 10, 3 );
        add_action( 'cpm_project_update', array($this, 'project_update'), 10, 3 );

        add_action( 'cpm_comment_new', array($this, 'new_comment'), 10, 3 );
        add_action( 'cpm_message_new', array($this, 'new_message'), 10, 2 );

        add_action( 'cpm_task_new', array($this, 'new_task'), 10, 4 );
        add_action( 'cpm_task_update', array($this, 'new_task'), 10, 4 );
        add_action( 'cpm_task_complete', array($this, 'complete_task'), 10, 4 );
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
    function project_new( $project_id, $data, $postdata ) {
       
        if ( ! isset( $postdata['project_notify'] ) && $postdata['project_notify'] != 'yes' ) {
            return;
        }

        $project_users = CPM_Project::getInstance()->get_users( $project_id );
        $users         = array();
   
        if ( is_array( $project_users ) && count($project_users) ) {
            
            foreach ($project_users as $user_id => $role_array ) {
                
                if ( $this->filter_email( $user_id ) ) {
                   $users[$user_id] = sprintf( '%s', $role_array['email'] );
                }
            }
        }

        //if any users left, get their mail addresses and send mail
        if ( ! $users ) {
            return;
        }

        $template_vars = array(
            '%SITE%'          => wp_specialchars_decode( get_option( 'blogname' ), ENT_QUOTES ),
            '%PROJECT_NAME%'  => get_post_field( 'post_title', $project_id ),
        );

        $subject = cpm_get_option( 'email_new_project_sub', 'cpm_mails' );
        
        // message
        foreach ( $template_vars as $key => $value ) {
            $subject = str_replace( $key, $value, $subject );
        }

        ob_start();
        cpm_get_template( 'emails/new-project', '', 
            array( 
                'project_id' => $project_id,
                'data'       => $data,
            )
        );            
        $message = ob_get_clean();
        
        if ( $message ) {
           $this->send( implode( ', ', $users ), $subject, $message );
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
    function project_update( $project_id, $data, $postdata ) {

        if ( ! isset( $postdata['project_notify'] ) && $postdata['project_notify'] != 'yes' ) {
            return;
        }

        $project_users = CPM_Project::getInstance()->get_users( $project_id );
        $users         = array();
   
        if ( is_array( $project_users ) && count($project_users) ) {
            
            foreach ($project_users as $user_id => $role_array ) {
                
                if ( $this->filter_email( $user_id ) ) {
                   $users[$user_id] = sprintf( '%s', $role_array['email'] );
                }
            }
        }

        //if any users left, get their mail addresses and send mail
        if ( ! $users ) {
            return;
        }

        $template_vars = array(
            '%SITE%'          => wp_specialchars_decode( get_option( 'blogname' ), ENT_QUOTES ),
            '%PROJECT_NAME%'  => get_post_field( 'post_title', $project_id ),
        );

        $subject = cpm_get_option( 'email_update_project_sub', 'cpm_mails' );
        
        // message
        foreach ( $template_vars as $key => $value ) {
            $subject = str_replace( $key, $value, $subject );
        }

        ob_start();
        cpm_get_template( 'emails/update-project', '', 
            array( 
                'project_id' => $project_id,
                'data'       => $data,
                'instance'   => self::$_instance
            )
        );
        $message = ob_get_clean();
       
        if ( $message ) {
           $this->send( implode(', ', $users), $subject, $message );
        }

    }

    function complete_task( $task_id, $list_id, $project_id, $data ) {
        
        $project_users = CPM_Project::getInstance()->get_users( $project_id );
        $users         = array();
        
        if( is_array( $project_users ) && count($project_users) ) {
            
            foreach ($project_users as $user_id => $role_array ) {
            
                if( $role_array['role'] == 'manager' ) {
            
                    if( $this->filter_email( $user_id ) ) {
                        // $users[$user_id] = sprintf( '%s (%s)', $role_array['name'], $role_array['email'] );
                        $users[$user_id] = sprintf( '%s', $role_array['email'] );
                    }
                }
            }
        }

        if ( ! $users ) {
            return;
        }

        $template_vars = array(
            '%SITE%'         => wp_specialchars_decode( get_option( 'blogname' ), ENT_QUOTES ),
            '%PROJECT_NAME%' => get_post_field( 'post_title', $project_id ),
            '%TASK_TITLE%'   => get_post_field( 'post_title', $task_id ),
        );

        $subject = cpm_get_option( 'email_task_complete_sub', 'cpm_mails' );
        
        // message
        foreach ( $template_vars as $key => $value ) {
            $subject = str_replace( $key, $value, $subject );
        }
        
        ob_start();
        cpm_get_template( 'emails/complete-task', '', 
            array( 
                'list_id'    => $list_id,
                'project_id' => $project_id,
                'task_id'    => $task_id,
                'data'       => $data,
            )
        );
        $message = ob_get_clean();
        
        if ( $message ) {
            $this->send( implode(', ', $users), $subject, $message);
        }
      
    }

    function new_message( $message_id, $project_id ) {
                
        $users = $this->prepare_contacts();

        if ( !$users ) {
            return;
        }

        $template_vars = array(
            '%SITE%'          => wp_specialchars_decode( get_option( 'blogname' ), ENT_QUOTES ),
            '%PROJECT_NAME%'  => get_post_field( 'post_title', $project_id ),
            '%MESSAGE_TITLE%' => get_post_field( 'post_title', $message_id )
        );

        $subject = cpm_get_option( 'email_discuss_sub', 'cpm_mails' );
        
        // message
        foreach ( $template_vars as $key => $value ) {
            $subject = str_replace( $key, $value, $subject );
        }

        ob_start();
        cpm_get_template( 'emails/new-message', '', 
            array( 
                'message_id' => $message_id,
                'project_id' => $project_id
            )
        );
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
        
        $users = $this->prepare_contacts();

        if ( ! $users ) {
            return;
        }
        $parent_post     =  get_comment( $comment_id );
        
        $template_vars = array(
            '%SITE%'         => wp_specialchars_decode( get_option( 'blogname' ), ENT_QUOTES ),
            '%PROJECT_NAME%' => get_post_field( 'post_title', $project_id ),
            '%COMMENT_TITLE%' => get_post_field( 'post_title', $parent_post->comment_post_ID ),
        );

        $subject = cpm_get_option( 'email_comment_sub', 'cpm_mails' );
        
        // message
        foreach ( $template_vars as $key => $value ) {
            $subject = str_replace( $key, $value, $subject );
        }

        ob_start();
        cpm_get_template( 'emails/new-comment', '', 
            array( 
                'comment_id' => $comment_id,
                'data'       => $data,
                'project_id' => $project_id
            )
        );
        $message = ob_get_clean(); 

        if ( $message ) {
           $this->send( implode( ', ', $users ), $subject, $message, $parent_post->comment_post_ID );
        }
        
    }

    function new_task( $list_id, $task_id, $data, $postdata ) {
        
        //for api
        $new_task_notification = apply_filters( 'cpm_new_task_notification', true );
        
        if ( ! $new_task_notification ) {
            return;
        }

        $project_id              = isset( $postdata['project_id'] ) ? intval( $postdata['project_id'] ) : 0;
        $postdata['task_assign'] = isset( $postdata['task_assign'] ) ? $postdata['task_assign'] : array();
        
        if ( $postdata['task_assign'] == '-1' ) {
            return;
        }

        $tpm_sub = array(
            '%SITE%'         => wp_specialchars_decode( get_option( 'blogname' ), ENT_QUOTES ),
            '%PROJECT_NAME%' => get_post_field( 'post_title', $project_id ),
            '%LIST_TITLE%'   => get_post_field( 'post_title', $list_id ),
        );

        $is_updated = isset( $postdata['task_id'] ) ? $postdata['task_id'] : false;

        if ( $is_updated ) {
            $subject = cpm_get_option( 'email_updated_task_sub', 'cpm_mails' );
        } else {
            $subject = cpm_get_option( 'email_new_task_sub', 'cpm_mails' );
        }

        // message
        foreach ( $tpm_sub as $key => $value ) {
            $subject = str_replace( $key, $value, $subject );
        }
        
        foreach ( $postdata['task_assign'] as $key => $user_id) {
            $user = get_user_by( 'id', intval( $user_id ) );

            if ( ! $this->filter_email( $user_id ) ) {
                continue;
            }

            $to = sprintf( '%s', $user->user_email );

            ob_start();
            cpm_get_template( 'emails/new-task', '', 
                array( 
                    'list_id'    => $list_id, 
                    'task_id'    => $task_id, 
                    'data'       => $data,
                    'project_id' => $project_id,
                    'is_updated' => $is_updated
                )
            ); 
            $message = ob_get_clean();

            if ( $message ) {
               $this->send( $to, $subject, $message );
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
