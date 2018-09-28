<?php 

namespace WeDevs\PM\Core\Notifications;


class Email {
    private static $_instance;

    public static function getInstance() {
        if ( !self::$_instance ) {
            self::$_instance = new self();
        }

        return self::$_instance;
    }

    /**
     * Get content html.
     *
     * @access public
     * @return string
     */
    public function get_content_html( $template, $args ) {
        ob_start();
        $this->email_header();
        $this->load_templae( $template, $args );
        $this->email_footer();
        return ob_get_clean();
    }


    public function load_templae( $file, $args = null ) {
        if ( $args && is_array( $args ) ) {
            extract( $args );
        }

        $link = $this->pm_link();

        if ( file_exists( $file ) ){
            include( $file );
        }
    }

    public function get_template_path( $template_name, $module = null ) {

        $child_theme_dir  = get_stylesheet_directory() . '/pm/emails';
        $parent_theme_dir = get_template_directory() . '/pm/emails';
        $mail_dir         = config('frontend.view_path'). '/emails';

        if ( function_exists('pm_pro_config') ) {
            $pro_dir      = pm_pro_config('define.view_path').'/emails';
            if ( $module != null ) {
                $module_path      = pm_pro_config('define.module_path').'/'. $module . 'views/emails';
            }
        }
        
        if ( file_exists( $child_theme_dir . $template_name ) ) {
            return $child_theme_dir . $template_name;
        } else if ( file_exists( $parent_theme_dir . $template_name ) ) {
            return $parent_theme_dir . $template_name;
        } else if ( file_exists( $mail_dir . $template_name ) ) {
            return $mail_dir . $template_name;
        }else if ( isset($pro_dir) && file_exists( $pro_dir . $template_name ) ){
            return  $pro_dir . $template_name;
        }else if ( isset($module_path) &&  file_exists( $module_path . $template_name ) ){
            return  $module_path . $template_name;
        }
    }

    /**
     * Get email header
     *
     * @param  string $action
     *
     * @since 2.0
     *
     * @return void
     */
    function email_header() {
        $header_file = apply_filters( 'pm_email_header_file', $this->get_template_path( '/html/header.php' ) );
        $this->load_templae( $header_file );
    }

    /**
     * Get email footer
     *
     * @param  string $action
     *
     * @since 2.0
     *
     * @return void
     */
    public function email_footer() {
        $footer_file = apply_filters( 'pm_email_footer_file', $this->get_template_path( '/html/footer.php' ) );
        $this->load_templae( $footer_file );
    }

    public function is_enable_user_notification( $user_id ) {
        if ( !is_numeric( $user_id ) ) {
            return false;
        }

        $user_email_notification = get_user_meta( $user_id, '_cpm_email_notification', true );

        if ( $user_email_notification == 'off' ) {
            return false;
        }

        return true;
    }

    public function is_enable_user_notification_for_notification_type( $user_id, $notification_type) {

        if (!is_numeric( $user_id ) ) {
            return false;
        }

        $user_email_notification = get_user_meta( $user_id, $notification_type, true );

        if ( $user_email_notification == 'off' ) {
            return false;
        }

        return true;
    }

    public function from_email() {
        $email = pm_get_settings( 'from_email' );
        $email = empty( $email ) ? get_bloginfo('admin_email'): $email; 
        return apply_filters('pm_from_email', $email);
    }

    public function is_bcc_enable() {
        $enable_bcc = pm_get_settings( 'enable_bcc' );
        $enable_bcc = isset( $enable_bcc ) ? $enable_bcc == "true" : false;
        return apply_filters( 'pm_enable_bcc', $enable_bcc  ) ;
    }

    public function email_type() {
        $email_type = pm_get_settings('email_type');
        $email_type = isset( $email_type ) ? $email_type : 'text/html';
        return apply_filters( 'pm_email_type', $email_type );
    }

    public function link_to_backend() {
        $link_to_backend = pm_get_settings('link_to_backend');
        $link_to_backend = ( isset( $link_to_backend ) && $link_to_backend == 'false' ) ? false : true;
        return apply_filters('pm_email_link_to_backend', $link_to_backend ) ;
    }

    public function pm_link() {
        if( !$this->link_to_backend() ) {
            $pages   = get_option('pm_pages', []);
            $project = isset( $pages['project'] ) ? intval( $pages['project'] ) : '';

            if ( $project ) {
                return get_permalink( $project );
            }
        }
        return admin_url( 'admin.php?page=pm_projects' );
    }

    function notify_manager() {
        return apply_filters( 'notify_project_managers', false );
    }
    /**
     * Get WordPress blog name.
     *
     * @return string
     */
    public function get_blogname() {
        return wp_specialchars_decode( get_option( 'blogname' ), ENT_QUOTES );
    }
    
    public static function send( $to, $subject, $message, $headers = [], $attachments = null ) {

        $blogname     = self::getInstance()->get_blogname();
        $no_reply     = 'no-reply@' . preg_replace( '#^www\.#', '', strtolower( $_SERVER['SERVER_NAME'] ) );
        $content_type = 'Content-Type: text/html';
        $charset      = 'Charset: UTF-8';
        $from_email   = self::getInstance()->from_email();
        $from         = "From: $blogname <$from_email>";
        $reply_to     = "Reply-To: $no_reply";

        if ( self::getInstance()->is_bcc_enable() ) {
            
            if ( is_array( $to ) ) {
                $bcc     = 'Bcc: ' . implode(',', $to);
            } else {
                $bcc     = 'Bcc: ' . $to;
            }
            
            $headers = array(
                $bcc,
                $reply_to,
                $content_type,
                $charset,
                $from_email
            );

            return wp_mail( $from_email, $subject, $message, $headers, $attachments );
            
        } else {

            $headers = array(
                $reply_to,
                $content_type,
                $charset,
                $from,
            );

           return wp_mail( $to, $subject, $message, $headers, $attachments );
        }
    }
}
