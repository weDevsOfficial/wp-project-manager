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

		wp_localize_script( 'pm-scripts', 'PM_Vars', array(
			'ajaxurl'                  => admin_url( 'admin-ajax.php' ),
			'nonce'                    => wp_create_nonce( 'cpm_nonce' ),
			'base_url'                 => home_url(),
			'time_zones'               => $json_time_zone_string['zones'],
			'time_links'               => $json_time_zone_string['links'],
			'rest_api_prefix'          => rest_get_url_prefix(),
			'todo_list_form'           => apply_filters( 'todo_list_form', array( 'CPM_Task_Mixin' ) ),
			'todo_list_router_default' => apply_filters( 'todo_list_router_default', array( 'CPM_Task_Mixin' ) ),
			'todo_list_text_editor'    => apply_filters( 'todo_list_text_editor', array() ),
			'assets_url'			   => config('frontend.assets_url')
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