<?php

namespace WeDevs\PM\Core\WP;
use WP_REST;

class Enqueue_Scripts {

	public static function scripts() {

		$scripts_id = [
			'pm-config',
			'pm-scripts'
		];

		foreach ( $scripts_id as $script_id ) {
			do_action( 'before_loaded' . $script_id );
			wp_enqueue_script( $script_id );
			do_action( 'after_loaded' . $script_id );
		}

		self::localize_scripts();
	}

	public static function styles() {
		$styles_id = [
			'pm-style',
		];

		foreach ( $styles_id as $style ) {
			do_action( 'before_loaded' . $style );
			
			wp_enqueue_style( $style );

			do_action( 'after_loaded' . $style );
		}
	}

	public static function localize_scripts() {
		global $wedevs_pm_pro;
		$upload_size = 10 * 1024 * 1024;

		wp_localize_script( 'pm-config', 'PM_Vars', array(
				'ajaxurl'                  => admin_url( 'admin-ajax.php' ),
				'permission'               => wp_create_nonce('wp_rest'),
				'nonce'                    => wp_create_nonce( 'pm_nonce' ),
				'base_url'                 => home_url(),
				'project_page'             => admin_url( 'admin.php?page=pm_projects' ),
				'rest_api_prefix'          => rest_get_url_prefix(),
				'todo_list_form'           => apply_filters( 'todo_list_form', array( 'PM_Task_Mixin' ) ),
				'todo_list_router_default' => apply_filters( 'todo_list_router_default', array( 'PM_Task_Mixin' ) ),
				'todo_list_text_editor'    => apply_filters( 'todo_list_text_editor', array() ),
				'assets_url'               => config('frontend.assets_url'),
				'wp_time_zone'             => tzcode_to_tzstring( get_wp_timezone() ),
				'current_user'             => wp_get_current_user(),
				'manage_capability'        => pm_has_manage_capability(),
				'create_capability'        => pm_has_project_create_capability(),
				'avatar_url'               => get_avatar_url( get_current_user_id() ),
				'plupload'                 => array(
					'browse_button'            => 'pm-upload-pickfiles',
					'container'                => 'pm-upload-container',
					'max_file_size'            => $upload_size . 'b',
					'url'                      => admin_url( 'admin-ajax.php' ) . '?action=pm_ajax_upload&nonce=' . wp_create_nonce( 'pm_ajax_upload' ),
					'flash_swf_url'            => includes_url( 'js/plupload/plupload.flash.swf' ),
					'silverlight_xap_url'      => includes_url( 'js/plupload/plupload.silverlight.xap' ),
					'filters'                  => array( array( 'title' => __( 'Allowed Files', 'wedevs-project-manager' ), 'extensions' => '*' ) ),
					'resize'                   => array( 
						'width'   => ( int ) get_option( 'large_size_w' ),
						'height'  => ( int ) get_option( 'large_size_h' ),
						'quality' => 100 
					)
				),
				'roles'       => pm_get_wp_roles(),
				'settings'    => pm_get_settings(),
				'text'        => pm_get_text('common'),
				'dir_url'     => config('frontend.url'),
				'is_pro'      => $wedevs_pm_pro,
				'is_admin'    => is_admin(),
				'language'    => apply_filters( 'pm_get_jed_locale_data', [ 'pm' => pm_get_jed_locale_data( 'wedevs-project-manager' ) ] ),
				'date_format' => get_option( 'date_format' ),
				'time_format' =>  get_option( 'time_format' )
        ));
	}
}
