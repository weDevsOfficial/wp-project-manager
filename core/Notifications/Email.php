<?php 

namespace WeDevs\PM\Core\Notifications;


abstract class Email{

    public function load_templae( $file, $args ) {
        if ( $args && is_array( $args ) ) {
            extract( $args );
        }

        $child_theme_dir  = get_stylesheet_directory() . '/pm/';
        $parent_theme_dir = get_template_directory() . '/pm/';
        $mail_dir         = config('frontend.view_path'). '/emails/html';

        if ( file_exists( $child_theme_dir . $file ) ) {
            include $child_theme_dir . $file;
        } else if ( file_exists( $parent_theme_dir . $file ) ) {
            include $parent_theme_dir . $file;
        } else {
            include $mail_dir . $file;
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
    function pm_get_email_header() {
        $file_name = '/emails/header.php';
        cpm_load_template( $file_name );
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
    function pm_get_email_footer() {
        $file_name = '/emails/footer.php';
        cpm_load_template( $file_name );
    }
    
    public function send() {

    }
}