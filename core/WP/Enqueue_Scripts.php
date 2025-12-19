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
			do_action( 'wedevs_before_loaded_' . $script_id );
			wp_enqueue_script( $script_id );
			do_action( 'wedevs_after_loaded_' . $script_id );
		}

		wp_enqueue_media();

		self::localize_scripts();
	}

	public static function styles() {
		$styles_id = [
			'pm-style',
		];

		foreach ( $styles_id as $style ) {
			do_action( 'wedevs_before_loaded_' . $style );
			
			wp_enqueue_style( $style );

			do_action( 'wedevs_after_loaded_' . $style );
		}
	}

	public static function localize_scripts() {
		global $wedevs_pm_pro;
		$upload_limit = intval(wedevs_pm_get_setting('upload_limit'));
		$upload_limit = empty( $upload_limit ) ? wp_max_upload_size() : $upload_limit;
		$upload_size = intval( $upload_limit )  * 1024 * 1024;

		$localize = [
			'ajaxurl'                  => admin_url( 'admin-ajax.php' ),
			'permission'               => wp_create_nonce('wp_rest'),
			'nonce'                    => wp_create_nonce( 'pm_nonce' ),
			'base_url'                 => home_url(),
			'api_base_url'             => esc_url_raw( get_rest_url() ),
			'api_namespace'            => wedevs_pm_api_namespace(),
			'permalinkStructure'       => get_option( 'permalink_structure' ),
			'project_page'             => wedevs_pm_get_project_page(),
			'rest_api_prefix'          => rest_get_url_prefix(),
			'todo_list_form'           => apply_filters( 'wedevs_todo_list_form', array( 'PM_Task_Mixin' ) ),
			'todo_list_router_default' => apply_filters( 'wedevs_todo_list_router_default', array( 'PM_Task_Mixin' ) ),
			'todo_list_text_editor'    => apply_filters( 'wedevs_todo_list_text_editor', array() ),
			'assets_url'               => wedevs_pm_config('frontend.assets_url'),
			'wp_time_zone'             => wedevs_pm_tzcode_to_tzstring( wedevs_pm_get_wp_timezone() ),
			'current_user'             => wp_get_current_user(),
			'manage_capability'        => wedevs_pm_has_manage_capability(),
			'create_capability'        => wedevs_pm_has_project_create_capability(),
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
			'roles'                            => wedevs_pm_get_wp_roles(),
			'settings'                         => wedevs_pm_get_setting(),
			'text'                             => array(), // Deprecated: texts are now translated directly in the code
			'dir_url'                          => wedevs_pm_config('frontend.url'),
			'is_pro'                           => $wedevs_pm_pro,
			'is_admin'                         => is_admin(),
			'language'                         => apply_filters( 'wedevs_pm_get_jed_locale_data', [ 'pm' => wedevs_pm_get_jed_locale_data( 'wedevs-project-manager' ) ] ),
			'date_format'                      => get_option( 'date_format' ),
			'time_format'                      => get_option( 'time_format' ),
			'id'                               => wedevs_pm_root_element_id(),
			'can_add_user_project_create_time' => wedevs_pm_can_create_user_at_project_create_time(),
			'locale'                           => get_locale(),
			'estimationType'                   => wedevs_pm_get_estimation_type(),
			'admin_cap_slug'                   => wedevs_pm_admin_cap_slug(),
			'manager_cap_slug'                 => wedevs_pm_manager_cap_slug(),
			// 'settings_page_slug'               => pm_settings_page_slug(),
			// 'tools_page_slug'                  => pm_tools_page_slug(),
			// 'categories_page_slug'             => pm_categories_page_slug()
        ];

        $localize = self::filter( $localize );
		$localize = apply_filters( 'wedevs_pm_localize', $localize );

		wp_localize_script( 'pm-config', 'PM_Vars', $localize );
	}

	public static function filter( $localize ) {
		unset( $localize['current_user']->user_pass );
		unset( $localize['current_user']->user_activation_key );
		
		return $localize;
	}
}
