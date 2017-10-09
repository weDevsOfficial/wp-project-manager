<?php

use CPM\Core\Text_Domain\Text_Domain;

function get_text( $key, $values = [] ) {
    return Text_Domain::get_text( $key, $values );
}

function get_wp_timezone() {
    $current_offset = get_option('gmt_offset');
    $wp_timezone = get_option('timezone_string');

    // Remove old Etc mappings. Fallback to gmt_offset.
    if ( false !== strpos( $wp_timezone, 'Etc/GMT' ) ) {
        $wp_timezone = '';
    }

    // Create a UTC+- zone if no timezone string exists
    if ( empty( $wp_timezone ) ) {
        if ( 0 == $current_offset ) {
            $wp_timezone = 'UTC+0';
        } elseif ($current_offset < 0) {
            $wp_timezone = 'UTC' . $current_offset;
        } else {
            $wp_timezone = 'UTC+' . $current_offset;
        }
    }

    return $wp_timezone;
}

function tzcode_to_tzstring( $tzcode ) {
    $timezones = config( 'timezones' );
    $timezone = '';

    if ( array_key_exists( $tzcode , $timezones ) ) {
        $timezone = $timezones[ $tzcode ];
    }

    return $timezone;
}

function tzstring_to_tzcode( $tzstr ) {
    $timezones = config( 'timesones' );
    $default = '';

    foreach ( $timezones as $tzcode => $tzstring ) {
        if ( $tzstring == $tzstr ) {
            return $tzcode;
        }
    }

    return $default;
}

function format_date( $date ) {
    $date_format = get_option( 'date_format' );
    $time_format = get_option( 'time_format' );
    $timezone    = get_wp_timezone();

    return [
        'date'      => $date ? $date->format( $date_format ) : null,
        'time'      => $date ? $date->format( $time_format ) : null,
        'timezone'  => tzcode_to_tzstring( $timezone ),
        'timestamp' => $date ? strtotime( $date ) : null
    ];
}

function make_carbon_date( $date ) {
    $timezone = get_wp_timezone();
    $timezone = tzcode_to_tzstring( $timezone );
    $time = $date ? strtotime( $date ) : null;

    if ( $time ) {
        return new \Carbon\Carbon( $date, $timezone );
    }

    return null;
}

function get_wp_roles() {
    global $wp_roles;

    $settings_fields = array();

    if ( ! $wp_roles ) {
        $wp_roles = new WP_Roles();
    }
    
    return $wp_roles->get_names();
}

function pm_get_settings() {
    $response = wp_remote_get( 'http://localhost/api/wp-json/cpm/v2/settings' );
    
    if ( is_array( $response ) ) {
        $header = $response['headers']; // array of http header lines
        $body  = $response['body']; // use the content

        return $body;
    }
}