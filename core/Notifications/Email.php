<?php 

namespace WeDevs\PM\Core\Notifications;


abstract class Email{

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

    public function get_template_path( $template_name ) {

        $child_theme_dir  = get_stylesheet_directory() . '/pm/emails';
        $parent_theme_dir = get_template_directory() . '/pm/emails';
        $mail_dir         = config('frontend.view_path'). '/emails';

        if ( file_exists( $child_theme_dir . $template_name ) ) {
            return $child_theme_dir . $template_name;
        } else if ( file_exists( $parent_theme_dir . $template_name ) ) {
            return $parent_theme_dir . $template_name;
        } else {
            return $mail_dir . $template_name;
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
        $user_email_notification = get_user_meta( $user_id, '_cpm_email_notification', true );

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
        return apply_filters( 'pm_enable_bcc', pm_get_settings( 'enable_bcc' ) ) ;
    }

    public function email_type() {
        return apply_filters( 'pm_email_type', pm_get_settings('email_type') );
    }

    public function link_to_backend() {
        return apply_filters('pm_email_link_to_backend', pm_get_settings('link_to_backend') ) ;
    }

    public function pm_link() {
        if( $this->link_to_backend() ) {
            return admin_url( 'admin.php?page=pm_projects' );
        }
    }
    /**
     * Get WordPress blog name.
     *
     * @return string
     */
    public function get_blogname() {
        return wp_specialchars_decode( get_option( 'blogname' ), ENT_QUOTES );
    }
    
    public function send( $to, $subject, $message, $headers = array(), $attachments = null ) {

        $blogname     = $this->get_blogname();
        $no_reply     = 'no-reply@' . preg_replace( '#^www\.#', '', strtolower( $_SERVER['SERVER_NAME'] ) );
        $content_type = 'Content-Type: text/html';
        $charset      = 'Charset: UTF-8';
        $from_email   = $this->from_email();
        $from         = "From: $blogname <$from_email>";
        $reply_to     = "Reply-To: $no_reply";

        if ( $this->is_bcc_enable() ) {
            $bcc     = 'Bcc: ' . $to;
            $headers = array(
                $bcc,
                $reply_to,
                $content_type,
                $charset,
                $from_email
            );

            wp_mail( $from_email, $subject, $message, $headers, $attachments );
            
        } else {

            $headers = array(
                $reply_to,
                $content_type,
                $charset,
                $from,
            );

           wp_mail( $to, $subject, $message, $headers, $attachments );
        }
    }
}