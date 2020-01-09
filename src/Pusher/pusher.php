<?php

namespace WeDevs\PM\Pusher;

use WeDevs\PM\Pusher\core\Auth\Auth;

class Pusher {

    public function __construct() {
        $this->init();
        $this->actions();
        $this->filters();
    }

    public function filters() {
        add_filter( 'pm_localize', 'PM_pusher_localize' );
    }

    public function init() {
        $this->libs();
    }

    public function libs() {
        $files = glob( __DIR__ . "/libs/*.php" );

        if ( $files === false ) {
            throw new RuntimeException( "Failed to glob for lib files" );
        }

        foreach ($files as $file) {
            require_once $file;
        }

        unset( $file );
        unset( $files );
    }

    public function actions() {
        add_action( 'admin_enqueue_scripts', [$this, 'scripts'] );
        add_action( 'wp_enqueue_scripts', [$this, 'scripts'] );
        add_action( 'PM_load_router_files', [$this, 'router'] );
        add_action( 'pm_update_task_status', 'PM_pusher_update_task_status', 10, 3 );
        add_action( 'pm_updated', 'PM_pusher_update_task' );
        add_action( 'pm_before_assignees', 'PM_pusher_before_assignees', 10, 2 );
        add_action( 'pm_after_new_comment', 'PM_pusher_after_new_comment', 10, 2 );
        add_action( 'pm_after_update_comment', 'PM_pusher_after_update_comment', 10, 2 );
        add_action( 'pm_after_new_message', 'PM_pusher_after_new_message', 10, 3 );
        add_action( 'pm_after_update_message', 'PM_pusher_after_update_message', 10, 3 );
    }

    public function router( $files ) {
        $router_files = glob( __DIR__ . "/routes/*.php" );

        return array_merge( $files, $router_files );
    }

    public function scripts() {
        $path = filemtime( pm_config('define.path') . '/src/Pusher/views/assets/vendor/pusher-v5.0.2.min.js' );
        wp_enqueue_script( 'pm-pusher-library', pm_config('define.url') . 'src/Pusher/views/assets/vendor/pusher-v5.0.2.min.js', array('jquery'), $path, true );
        
        if ( isset( $_GET['page'] ) && $_GET['page'] == 'pm_projects' ) {
            wp_enqueue_script( 'pm-pusher-jquery', pm_config('define.url') . 'src/Pusher/views/assets/vendor/pusher-jquery.js', array('jquery', 'pm-pusher-library', 'pm-toastr'), time(), true );
        } else {
            wp_enqueue_script( 'pm-toastr-pusher', plugins_url( 'views/assets/vendor/toastr/toastr.min.js', __FILE__ ), array('jquery'), $path, true );
            wp_enqueue_script( 'pm-pusher-jquery', pm_config('define.url') . 'src/Pusher/views/assets/vendor/pusher-jquery.js', array('jquery', 'pm-pusher-library', 'pm-toastr-pusher'), time(), true );
            wp_enqueue_style( 'pm-toastr-pusher', plugins_url( 'views/assets/css/toastr/toastr.min.css', __FILE__ ), false, 'v2.1.3', 'all' );
        }

        $localize = [
            'base_url'       => home_url(),
            'pusher_app_key' => Auth::app_key(),
            'pusher_app_id'  => Auth::app_id(),
            'pusher_cluster' => Auth::app_cluster(),
            'user_id'        => get_current_user_id(),
            'is_admin'       => is_admin(),
            'channel'        => pm_pusher_channel(),
            'events'         => pm_pusher_events()
        ];

        wp_localize_script( 'pm-pusher-jquery', 'PM_Pusher_Vars', $localize );

        wp_enqueue_style( 'pm-pro-pusher-notification', plugins_url( 'views/assets/css/pusher.css', __FILE__ ), false, time(), 'all' );
    }
}




