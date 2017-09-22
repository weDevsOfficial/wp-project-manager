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
			'assets_url'			   => config('frontend.assets_url'),
			'wp_time_zone'             => get_wp_timezone(),
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

	/**
	 * WP Timezone Settings
	 *
	 * @since 2.0.0
	 *
	 * @return string
	 */
	function get_wp_timezone() {
	    $momentjs_tz_map = array(
	        'UTC-12'    => 'Etc/GMT+12',
	        'UTC-11.5'  => 'Pacific/Niue',
	        'UTC-11'    => 'Pacific/Pago_Pago',
	        'UTC-10.5'  => 'Pacific/Honolulu',
	        'UTC-10'    => 'Pacific/Honolulu',
	        'UTC-9.5'   => 'Pacific/Marquesas',
	        'UTC-9'     => 'America/Anchorage',
	        'UTC-8.5'   => 'Pacific/Pitcairn',
	        'UTC-8'     => 'America/Los_Angeles',
	        'UTC-7.5'   => 'America/Edmonton',
	        'UTC-7'     => 'America/Denver',
	        'UTC-6.5'   => 'Pacific/Easter',
	        'UTC-6'     => 'America/Chicago',
	        'UTC-5.5'   => 'America/Havana',
	        'UTC-5'     => 'America/New_York',
	        'UTC-4.5'   => 'America/Halifax',
	        'UTC-4'     => 'America/Manaus',
	        'UTC-3.5'   => 'America/St_Johns',
	        'UTC-3'     => 'America/Sao_Paulo',
	        'UTC-2.5'   => 'Atlantic/South_Georgia',
	        'UTC-2'     => 'Atlantic/South_Georgia',
	        'UTC-1.5'   => 'Atlantic/Cape_Verde',
	        'UTC-1'     => 'Atlantic/Azores',
	        'UTC-0.5'   => 'Atlantic/Reykjavik',
	        'UTC+0'     => 'Etc/UTC',
	        'UTC'       => 'Etc/UTC',
	        'UTC+0.5'   => 'Etc/UTC',
	        'UTC+1'     => 'Europe/Madrid',
	        'UTC+1.5'   => 'Europe/Belgrade',
	        'UTC+2'     => 'Africa/Tripoli',
	        'UTC+2.5'   => 'Asia/Amman',
	        'UTC+3'     => 'Europe/Moscow',
	        'UTC+3.5'   => 'Asia/Tehran',
	        'UTC+4'     => 'Europe/Samara',
	        'UTC+4.5'   => 'Asia/Kabul',
	        'UTC+5'     => 'Asia/Karachi',
	        'UTC+5.5'   => 'Asia/Kolkata',
	        'UTC+5.75'  => 'Asia/Kathmandu',
	        'UTC+6'     => 'Asia/Dhaka',
	        'UTC+6.5'   => 'Asia/Rangoon',
	        'UTC+7'     => 'Asia/Bangkok',
	        'UTC+7.5'   => 'Asia/Bangkok',
	        'UTC+8'     => 'Asia/Shanghai',
	        'UTC+8.5'   => 'Asia/Pyongyang',
	        'UTC+8.75'  => 'Australia/Eucla',
	        'UTC+9'     => 'Asia/Tokyo',
	        'UTC+9.5'   => 'Australia/Darwin',
	        'UTC+10'    => 'Australia/Brisbane',
	        'UTC+10.5'  => 'Australia/Adelaide',
	        'UTC+11'    => 'Australia/Melbourne',
	        'UTC+11.5'  => 'Pacific/Norfolk',
	        'UTC+12'    => 'Asia/Anadyr',
	        'UTC+12.75' => 'Asia/Anadyr',
	        'UTC+13'    => 'Pacific/Fiji',
	        'UTC+13.75' => 'Pacific/Chatham',
	        'UTC+14'    => 'Pacific/Tongatapu',
	    );

	    $current_offset = get_option('gmt_offset');
	    $tzstring       = get_option('timezone_string');

	    // Remove old Etc mappings. Fallback to gmt_offset.
	    if ( false !== strpos( $tzstring, 'Etc/GMT' ) ) {
	        $tzstring = '';
	    }

	    if ( empty( $tzstring ) ) { // Create a UTC+- zone if no timezone string exists
	        if ( 0 == $current_offset ) {
	            $tzstring = 'UTC+0';
	        } elseif ($current_offset < 0) {
	            $tzstring = 'UTC' . $current_offset;
	        } else {
	            $tzstring = 'UTC+' . $current_offset;
	        }

	    }

	    if ( array_key_exists( $tzstring , $momentjs_tz_map ) ) {
	        $tzstring = $momentjs_tz_map[ $tzstring ];
	    }

	    return $tzstring;
	}
}