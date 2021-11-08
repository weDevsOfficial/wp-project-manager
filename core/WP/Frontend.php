<?php

namespace WeDevs\PM\Core\WP;

use WeDevs\PM\Core\WP\Menu;
use WeDevs\PM\Core\Upgrades\Upgrade;
use WeDevs\PM\Core\Notifications\Notification;
use WeDevs\PM\Core\WP\Register_Scripts;
use WeDevs\PM\Core\WP\Enqueue_Scripts as Enqueue_Scripts;
use WeDevs\PM\Core\File_System\File_System as File_System;
use WeDevs\PM\Core\Cli\Commands;
use WeDevs\PM\Core\Promotions\Promotions;
use WeDevs\PM\Core\Promotions\Offers;

use WeDevs\PM\Core\Installer\Installer;
use PM_Create_Table;
//use WeDevs\PM\Tools\Helpers\ImportActivecollab;
use WeDevs\PM\Tools\Helpers\ImportTrello;
//use WeDevs\PM\Tools\Helpers\ImportAsana;
use WeDevs\PM\Core\Admin_Notice\Admin_Notice;
use WeDevs\PM\Pusher\Pusher;
use WeDevs\PM\Core\User_Profile\Profile_Update;


class Frontend {

    /**
     * Constructor for the PM class
     *
     * Sets up all the appropriate hooks and actions
     * within our plugin.
     */
    public function __construct() {
        $this->includes();

        // instantiate classes
        $this->instantiate();

        // Initialize the action hooks
        $this->init_actions();

        // Initialize the action hooks
        $this->init_filters();

        //Execute only plugin install time
        register_activation_hook( PM_FILE, array( $this, 'install' ) );
    }

    public function install() {
        if ( is_multisite() && is_network_admin() ) {
            $sites = get_sites();

            foreach ( $sites as $key => $site ) {
                $this->after_insert_site( $site );
            }
        } else {
            $this->run_install();
        }
    }

    public function run_install() {
        ( new Installer )->do_install();
    }

    /**
     * All actions
     *
     * @return void
     */
    public function init_actions() {
        add_action( 'plugins_loaded', array( $this, 'seed' ), 10 );
        add_action( 'admin_menu', array( new Menu, 'admin_menu' ) );
        add_action( 'wp_ajax_pm_ajax_upload', array ( new File_System, 'ajax_upload_file' ) );
        add_action( 'init', array ( 'WeDevs\PM\Core\Notifications\Notification' , 'init_transactional_emails' ) );
        add_action( 'admin_enqueue_scripts', array ( $this, 'register_scripts' ) );
        add_action( 'wp_enqueue_scripts', array ( $this, 'register_scripts' ) );
        add_action( 'plugins_loaded', array( $this, 'load_plugin_textdomain' ) );
        add_action( 'plugins_loaded', array( $this, 'pm_content_filter' ) );
        add_action( 'plugins_loaded', array( $this, 'pm_content_filter_url' ) );
        add_filter( 'plugin_action_links_' . PM_BASENAME , array( $this, 'plugin_action_links' ) );
        add_filter( 'in_plugin_update_message-' . PM_BASENAME , array( $this, 'upgrade_notice' ), 10, 2 );
        add_action( 'admin_footer', array( $this, 'switch_project_html' ) );
        add_action( 'admin_init', array( $this, 'redirect_after_activate' ) );
        add_action( 'admin_bar_menu', array( $this, 'pm_toolbar_search_button' ), 999);
        add_action( 'wp_initialize_site', [ $this, 'after_insert_site' ], 10 );

        add_action( 'admin_init', array( $this, 'test' ) );
    }

    function test() {

        $current_time = new \DateTimeImmutable( 'now', new \DateTimeZone('America/New_York') );

    }

    function after_insert_site( $new_sites ) {
        switch_to_blog( $new_sites->blog_id );

        $this->run_install();

        restore_current_blog();
    }

    function seed() {
        Upgrade::create_tables();
    }

    function pm_content_filter() {
        add_filter( 'pm_get_content', 'wptexturize' );
        add_filter( 'pm_get_content', 'convert_smilies' );
        add_filter( 'pm_get_content', 'convert_chars' );
        add_filter( 'pm_get_content', 'wpautop' );
        add_filter( 'pm_get_content', 'shortcode_unautop' );
        add_filter( 'pm_get_content', 'prepend_attachment' );
        add_filter( 'pm_get_content', 'make_clickable' );
        //add_filter('all_plugins', [ $this, 'hide_plugin_form_admin_network' ] );
    }

    function hide_plugin_form_admin_network( $plugins ) {
        if ( is_network_admin() ) {
            foreach ( $plugins as $key => $plugin ) {
                if ( $plugin['TextDomain'] == 'wedevs-project-manager' ) {
                    unset( $plugins[$key] );
                }

                if ( $plugin['TextDomain'] == 'pm-pro' ) {
                    unset( $plugins[$key] );
                }
            }
        }

        return $plugins;
    }

    function pm_content_filter_url() {
        add_filter( 'pm_get_content_url', 'make_clickable' );
    }

    function load_plugin_textdomain() {
        load_plugin_textdomain( 'wedevs-project-manager', false, config('frontend.basename') . '/languages/' );
    }

    public function includes() {
        // cli command
        if ( defined('WP_CLI') && WP_CLI ) {
            $file = config( 'frontend.patch' ) . '/core/cli/Commands.php';

            //if ( file_exists( $file ) ) {
                new Commands();
            //}
        }
    }

    /**
     * All filters
     *
     * @return void
     */
    public function init_filters() {
        add_filter( 'upload_mimes', [$this, 'cc_mime_types'] );
        add_filter( 'wp_mime_type_icon', [$this, 'change_mime_icon'], 10, 3 );
        add_filter( 'todo_list_text_editor', [$this, 'project_text_editor'] );
        add_filter( 'upload_mimes', [$this, 'custom_upload_mimes']);
        add_filter( 'appsero_custom_deactivation_reasons', [ $this, 'custom_deactivation_reason' ] );
    }

    function custom_deactivation_reason( $reasons ) {
        $reasons[] = array(
            'id'          => 'temporary_deactivation',
            'text'        => __( 'Temporary deactivation', 'wedevs-project-manager' ),
            'placeholder' => __( 'Are you facing any problem?', 'wedevs-project-manager' ),
            'icon'        => '<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 512 512" width="23" height="23" viewBox="0 0 512 512"><path fill="#3B86FF"  stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="30" d="M192.75,385.15C119.47,359.14,67,289.2,67,207c0-104.38,84.62-189,189-189s189,84.62,189,189c0,82.2-52.47,152.14-125.75,178.15"/><polyline fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="30" points="252 216 252 495 315 432 252 495 189 432"/></svg>'
        );

        $reasons[] = array(
            'id'          => 'found_error',
            'text'        => __( 'Found an Error', 'wedevs-project-manager' ),
            'placeholder' => __( 'Please tell us more about the error. We\'ll reach you with the possible solution.', 'wedevs-project-manager' ),
            'icon'        => '<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="23" height="23" viewBox="0 0 32 32" fill="#3B86FF"><path d="M16 0C7.164 0 0 7.164 0 16s7.164 16 16 16 16-7.164 16-16S24.836 0 16 0zm0 30C8.28 30 2 23.72 2 16S8.28 2 16 2s14 6.28 14 14-6.28 14-14 14zm0-24a2 2 0 0 0-2 2v10a2 2 0 0 0 4 0V8a2 2 0 0 0-2-2zm-2 17.968a2 2 1080 1 0 4 0 2 2 1080 1 0-4 0z"/></svg>',
        );

        $reasons[] = array(
            'id'          => 'not_documented',
            'text'        => __( 'No proper documentation', 'wedevs-project-manager' ),
            'placeholder' => __( 'Could you tell us a bit more?', 'wedevs-project-manager' ),
            'icon'        => '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="17" viewBox="0 0 24 17"><g fill="none"><g fill="#3B86FF"><path d="M19.4 0C19.7 0.6 19.8 1.3 19.8 2 19.8 3.2 19.4 4.4 18.5 5.3 17.6 6.2 16.5 6.7 15.2 6.7 15.2 6.7 15.2 6.7 15.2 6.7 14 6.7 12.9 6.2 12 5.3 11.2 4.4 10.7 3.3 10.7 2 10.7 1.3 10.8 0.6 11.1 0L7.6 0 7 0 6.5 0 6.5 5.7C6.3 5.6 5.9 5.3 5.6 5.1 5 4.6 4.3 4.3 3.5 4.3 3.5 4.3 3.5 4.3 3.4 4.3 1.6 4.4 0 5.9 0 7.9 0 8.6 0.2 9.2 0.5 9.7 1.1 10.8 2.2 11.5 3.5 11.5 4.3 11.5 5 11.2 5.6 10.8 6 10.5 6.3 10.3 6.5 10.2L6.5 10.2 6.5 17 6.5 17 7 17 7.6 17 22.5 17C23.3 17 24 16.3 24 15.5L24 0 19.4 0Z"/></g></g></svg>',
        );

        return $reasons;
    }

    function cc_mime_types( $mimes ) {
        $mimes['svg'] = 'image/svg+xml';
        return $mimes;
    }

    function change_mime_icon( $icon, $mime = null, $post_id = null ) {
        $assets_url = config('frontend.assets_url');
        $folder     = $assets_url . 'images/icons/';
        $exist_mime = [
            'application/pdf'                                                         => 'pdf.png',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document' => 'document.png',
            'application/msword'                                                      => 'document.png',
            'application/application/vnd.ms-excel'                                    => 'spreadsheet.png',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'       => 'spreadsheet.png',
            'text/plain'                                                              => 'text.png',
            'application/zip' => 'archive.svg',
            'text/csv' => 'csv.svg',
            'application/vnd.ms-powerpoint' => 'ppt.png',
            'application/vnd.rar' => 'archive.svg'
        ];

        if ( array_key_exists( $mime, $exist_mime ) ) {
            return  $icon = $folder . $exist_mime[$mime];
        }

        $icon = str_replace( get_bloginfo( 'wpurl' ) . '/wp-includes/images/media/', $folder, $icon );

        return $icon;
    }

    function cron_interval( $schedules ) {
        // Adds every 5 minutes to the existing schedules.
        $schedules[ 'pm_schedule' ] = array(
            'interval' => MINUTE_IN_SECONDS * 1,
            'display'  => sprintf( __( 'Every %d Minutes PM schedule', 'wedevs-project-manager' ), 1 ),
        );

        return $schedules;
    }

    function project_text_editor($config) {
    $config['external_plugins']['placeholder'] = config('frontend.assets_url') . 'vendor/tinymce/plugins/placeholder/plugin.min.js';
    $config['plugins'] = 'placeholder textcolor colorpicker wplink wordpress';
    return $config;
}

    /**
     * instantiate classes
     *
     * @return void
     */
    public function instantiate() {
        Notification::init_transactional_emails();
        new Upgrade();
        new Offers();
        new Profile_Update();
        //new Promotions();
        //new ImportTrello();
        //new ImportAsana();
        //new ImportActivecollab();
        new Admin_Notice();
        new Pusher();
    }

    public function register_scripts() {
        Register_Scripts::scripts();
        Register_Scripts::styles();
    }

    /**
     * Plugin action links
     *
     * @param  array  $links
     *
     * @return array
     */
    function plugin_action_links( $links ) {
        global $wedevs_pm_pro;

        if ( !$wedevs_pm_pro  ) {
            $links[] = '<a href="https://wedevs.com/wp-project-manager-pro/pricing/?utm_source=freeplugin&utm_medium=pm-action-link&utm_campaign=pm-pro-prompt" style="color: #389e38;font-weight: bold;" target="_blank">' . __( 'Get Pro', 'wedevs-project-manager' ) . '</a>';
        }

        $links[] = '<a href="' . admin_url( 'admin.php?page=pm_projects#/settings' ) . '">' . __( 'Settings', 'wedevs-project-manager' ) . '</a>';
        $links[] = '<a href="https://wedevs.com/docs/wp-project-manager/?utm_source=wp-admin&utm_medium=pm-action-link&utm_campaign=pm-docs" target="_blank">' . __( 'Documentation', 'wedevs-project-manager' ) . '</a>';

        return $links;
    }

    /**
     * Upgrade notice
     *
     * @param  stdClass $current
     * @param  stdClass $new
     *
     * @return void
     */
    public function upgrade_notice( $current, $new_version ) {

        if ( isset( $new_version->upgrade_notice ) && strlen( trim( $new_version->upgrade_notice ) ) > 0 ) {
            echo esc_html('<div style="background-color: #d54e21; padding: 10px; color: #f9f9f9; margin-top: 10px">'. $new_version->upgrade_notice . '</div>');
        }
    }

    public function switch_project_html() {
        wp_enqueue_script( 'pmglobal' );
        wp_enqueue_style( 'pmglobal' );
        wp_localize_script( 'pmglobal', 'PM_Global_Vars',[
            'rest_url'           => home_url() .'/'.rest_get_url_prefix(),
            'project_page'       => pm_get_project_page(),
            'permission'         => wp_create_nonce('wp_rest'),
            'api_base_url'       => esc_url_raw( get_rest_url() ),
            'api_namespace'      => pm_api_namespace(),
            'permalinkStructure' => get_option( 'permalink_structure' ),
        ]);

        require_once pm_config('frontend.view_path') . '/project-switch/project-switch.php';
    }

    public function new_task_craeting() {
        require_once pm_config('frontend.view_path') . '/project-switch/task-creating.php';
    }

    public function pm_toolbar_new_task_creating ($wp_admin_bar) {
        $wp_admin_bar->add_node(
            [
                'id'        => 'pm_create_task',
                'title'     => '<span class="ab-icon dashicons dashicons-welcome-add-page"></span>',
                'href'      => '#',
                'parent' => 'top-secondary',
                'meta'  => [
                    'title' => __('Create New Task', 'wedevs-project-manager'),
                ]

            ]
         );

         $wp_admin_bar->add_node(
            [
                'id'        => 'pm_new_create_task',
                'title'     => 'Task',
                'href'      => '#',
                'parent' => 'new-content',
                'meta'  => [
                    'title' => __('Create New Task', 'wedevs-project-manager'),
                ]

            ]
         );
    }


    public function pm_toolbar_search_button($wp_admin_bar) {
        $wp_admin_bar->add_node(
            [
                'id'        => 'pm_search',
                'title'     => '<span class="ab-icon icon-pm-switch-project" style="padding: 6px 0;"></span>',
                'href'      => '#',
                'parent' => 'top-secondary',
                'meta'  => [
                    'title' => __('Jump to a project', 'wedevs-project-manager'),
                ]

            ]
        );
    }

    public function custom_upload_mimes ( $existing_mimes ) {
        $existing_mimes['psd'] = 'image/vnd.adobe.photoshop';

        return $existing_mimes;
    }

    public function redirect_after_activate() {

        if ( ! apply_filters( 'pm_welcome_page_redirect', get_transient( '_pm_setup_page_redirect' ) ) ) {
            return;
        }

        // Delete the redirect transient
        delete_transient( '_pm_setup_page_redirect' );

        wp_safe_redirect( add_query_arg( array( 'page' => 'pm_projects#/welcome' ), admin_url( 'index.php' ) ) );
        exit;
    }
}
