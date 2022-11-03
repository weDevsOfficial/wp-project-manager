<?php

namespace WeDevs\PM\Core\Pro;

class Enqueue_Scripts {

    public static function scripts() {
        $scripts_id = [
            'pm-pro-script'
        ];

        wp_enqueue_media();

        foreach ( $scripts_id as $script_id ) {
            do_action( 'before_loaded' . $script_id );

            wp_enqueue_script( $script_id );

            do_action( 'after_loaded' . $script_id );
        }

        wp_localize_script( 'pm-config', 'PM_Pro_Vars', self::localize_data() );
    }

    public static function styles() {
        $styles_id = [
            'pm-pro-styles',
        ];

        foreach ( $styles_id as $style ) {
            do_action( 'before_loaded' . $style );

            wp_enqueue_style( $style );

            do_action( 'after_loaded' . $style );
        }
    }

    public static function localize_data() {
        return [
            'ajaxurl'            => admin_url( 'admin-ajax.php' ),
            'nonce'              => wp_create_nonce( 'pm_pro_nonce' ),
            'base_url'           => home_url(),
            'api_base_url'       => esc_url_raw( get_rest_url() ),
            'api_namespace'      => pm_api_namespace(),
            'permalinkStructure' => get_option( 'permalink_structure' ),
            'dir_url'            => pm_pro_config('define.url'),
            'module_path'        => pm_pro_config('define.module_path'),
            'base_path'          => pm_pro_config('define.path'),
            'manage_capability'  => pm_get_setting( 'managing_capability' ),
            'pm_logo'            => pm_pro_get_logo(),
            'locale'             => pm_pro_get_locale(),
            'wperp'              => class_exists('WeDevs_ERP'),
            'active_modules'     => pm_pro_get_active_modules(),
            'pages'              => get_pages(),
            'page'               => get_option( 'pm_pages' ),
            // 'progress_page_slug' => pm_pro_progress_page_slug(),
            // 'reports_page_slug'  => pm_pro_reports_page_slug(),
            // 'modules_page_slug'  => pm_pro_modules_page_slug()
        ];
    }
}
