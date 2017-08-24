<?php

/**
 * The Free Class
 */
class CPM_Free_Loader {

    function __construct() {
        add_filter( 'cpm_project_nav_links', array( $this, 'project_nav_links' ) );
        add_action( 'cpm_settings_fields', array( $this, 'settings_fields' ) );
        add_action( 'admin_menu', array( $this, 'admin_menu' ), 50 );
    }

    function admin_menu() {
        $capability    = 'read';
        $hook_my_task  = add_submenu_page( 'cpm_projects', __( 'My Tasks', 'cpm' ), __( 'My Tasks', 'cpm' ), $capability, 'cpm_task', array( $this, 'admin_page_handler' ) );
        $hook_calender = add_submenu_page( 'cpm_projects', __( 'Calendar', 'cpm' ), __( 'Calendar', 'cpm' ), $capability, 'cpm_calendar', array( $this, 'admin_page_handler' ) );
        $hook_reports  = add_submenu_page( 'cpm_projects', __( 'Reports', 'cpm' ), __( 'Reports', 'cpm' ), $capability, 'cpm_reports', array( $this, 'admin_page_handler' ) );
        $hook_progress = add_submenu_page( 'cpm_projects', __( 'Progress', 'cpm' ), __( 'Progress', 'cpm' ), $capability, 'cpm_progress', array( $this, 'admin_page_handler' ) );
        add_action( 'admin_print_styles-' . $hook_my_task, array( $this, 'free_scripts' ) );
        add_action( 'admin_print_styles-' . $hook_calender, array( $this, 'free_scripts' ) );
        add_action( 'admin_print_styles-' . $hook_reports, array( $this, 'free_scripts' ) );
        add_action( 'admin_print_styles-' . $hook_progress, array( $this, 'free_scripts' ) );
    }

    function free_scripts() {
        wp_enqueue_style( 'cpm_admin', CPM_URL . '/assets/css/admin.css' );
    }

    function admin_page_handler() {
        ?>
        <div class="wrap">
            <div class="postbox cpm-pro-notice">
                <div class="cpm-text">
                    <?php _e( 'This feature is only available in the Pro Version.', 'cpm' ); ?>
                </div>
                <a target="_blank" href="https://wedevs.com/products/plugins/wp-project-manager-pro/?utm_source=freeplugin&utm_medium=prompt&utm_term=cpm_free_plugin&utm_content=textlink&utm_campaign=pro_prompt" class="button button-primary"><?php _e( 'Upgrade to Pro Version', 'cpm' ); ?></a>
            </div>
        </div>
        <?php
    }

    function settings_fields( $settings_fields ) {
        if ( ! isset( $settings_fields['cpm_general'] ) ) {
            return $settings_fields;
        }

        foreach ( $settings_fields['cpm_general'] as $key => $field ) {

            if ( isset( $field['name'] ) && $field['name'] == 'daily_digest' ) {
                unset( $settings_fields['cpm_general'][$key] );
            }
        }

        return $settings_fields;
    }

    function project_nav_links( $link ) {
        $settings = __( 'Settings', 'cpm' );

        if ( isset( $link[$settings] ) ) {
            unset( $link[$settings] );
        }

        return $link;
    }

}

new CPM_Free_Loader();
