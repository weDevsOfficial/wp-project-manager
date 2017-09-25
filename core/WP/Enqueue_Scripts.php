<?php

namespace CPM\Core\WP;

class Enqueue_Scripts {

	public static function scripts() {
		ob_start();
		$assets_path = config('frontend.view_path');
		include $assets_path . '/assets/js/moment/latest.json';
        $time_zone_string      = ob_get_clean();

        $json_time_zone_string = json_decode( $time_zone_string, true );

		$scripts_id = [
			'pm-config',
			'pm-scripts'
		];

		foreach ( $scripts_id as $script_id ) {
			do_action( 'before_loaded' . $script_id );
			
			wp_enqueue_script( $script_id );

			do_action( 'after_loaded' . $script_id );
		}

		$upload_size = 10 * 1024 * 1024;//intval( \cpm_get_option( 'upload_limit', 'cpm_general' ) ) * 1024 * 1024;

		wp_localize_script( 'pm-config', 'PM_Vars', array(
			'ajaxurl'                  => admin_url( 'admin-ajax.php' ),
			'nonce'                    => wp_create_nonce( 'cpm_nonce' ),
			'base_url'                 => home_url(),
			'time_zones'               => $json_time_zone_string['zones'],
			'time_links'               => $json_time_zone_string['links'],
			'rest_api_prefix'          => rest_get_url_prefix(),
			'todo_list_form'           => apply_filters( 'todo_list_form', array( 'CPM_Task_Mixin' ) ),
			'todo_list_router_default' => apply_filters( 'todo_list_router_default', array( 'CPM_Task_Mixin' ) ),
			'todo_list_text_editor'    => apply_filters( 'todo_list_text_editor', array() ),
			'assets_url'			   => config('frontend.assets_url'),
			'wp_time_zone'             => tzcode_to_tzstring( get_wp_timezone() ),
			'plupload'      => array(
                'browse_button'       => 'cpm-upload-pickfiles',
                'container'           => 'cpm-upload-container',
                'max_file_size'       => $upload_size . 'b',
                'url'                 => admin_url( 'admin-ajax.php' ) . '?action=cpm_ajax_upload&nonce=' . wp_create_nonce( 'cpm_ajax_upload' ),
                'flash_swf_url'       => includes_url( 'js/plupload/plupload.flash.swf' ),
                'silverlight_xap_url' => includes_url( 'js/plupload/plupload.silverlight.xap' ),
                'filters'             => array( array( 'title' => __( 'Allowed Files' ), 'extensions' => '*' ) ),
                'resize'              => array( 'width' => ( int ) get_option( 'large_size_w' ), 'height' => ( int ) get_option( 'large_size_h' ), 'quality' => 100 )
            )
        ));
	}

	public static function styles() {
		$styles_id = [
			'cpm-style',
		];

		foreach ( $styles_id as $style ) {
			do_action( 'before_loaded' . $style );
			
			wp_enqueue_style( $style );

			do_action( 'after_loaded' . $style );
		}
	}
}