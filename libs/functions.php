<?php

use WeDevs\PM\Core\Textdomain\Textdomain;

function pm_get_text( $key ) {
    return Textdomain::get_text( $key);
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

function pm_get_wp_roles() {
    global $wp_roles;

    if ( !$wp_roles ) {
        $wp_roles = new WP_Roles();
    }

    return $wp_roles->get_names();
}

function pm_get_settings( $key = null, $project_id = false ) {
    $settings = null;
    $all_settings = null;

    if ( $key && $project_id ) {
        $settings = \WeDevs\PM\Settings\Models\Settings::where( 'key', $key )
            ->where('project_id', $project_id)
            ->first();
    
    } else if ($key) {
        $settings = \WeDevs\PM\Settings\Models\Settings::where( 'key', $key )
            ->first();
    } else {
        $all_settings = \WeDevs\PM\Settings\Models\Settings::all();
    }

    if ( $settings ) {
        return $settings->value;
    }

    if ( $all_settings ) {
        return $all_settings->pluck( 'value', 'key' )->all();
    }

    return null;
}

function pm_add_meta( $id, $project_id, $type, $key, $value ) {
    WeDevs\PM\Common\Models\Meta::create([
        'entity_id'   => $id,
        'entity_type' => $type,
        'meta_key'    => $key,
        'meta_value'  => $value,
        'project_id'  => $project_id,
    ]);
}

function pm_update_meta( $id, $project_id, $type, $key, $value ) {
    $meta = WeDevs\PM\Common\Models\Meta::where( 'entity_id', $id )
        ->where( 'project_id', $project_id )
        ->where( 'entity_type', $type )
        ->where( 'meta_key', $key )
        ->first();

    if ( $meta ) {
        $meta->update(['meta_value' => $value]);
    } else {
        pm_add_meta( $id, $project_id, $type, $key, $value );
    }
}

function pm_delete_meta( $id, $project_id, $type, $key = false ) {
    $meta = WeDevs\PM\Common\Models\Meta::where( 'entity_id', $id )
        ->where( 'project_id', $project_id )
        ->where( 'entity_type', $type );

    if ( $key ) {
        $meta = $meta->where( 'meta_key', $key );
        $meta = $meta->first();
    }

    if ( $meta ) {
        $meta->delete();
    }
}

function pm_get_response( $resource, $extra = [] ) {
    $manager = new \League\Fractal\Manager();
    $data_serialize = new \League\Fractal\Serializer\DataArraySerializer();
    $manager->setSerializer( $data_serialize );

    if ( isset( $_GET['with'] ) ) {
        $manager->parseIncludes( $_GET['with'] );
    }

    if ($resource) {
        $response = $manager->createData( $resource )->toArray();

    } else {
        $response = [];
    }

    return array_merge( $extra, $response );
}

function pmpr($data) {
    echo '<pre>'; print_r($data); '</pre>';
}


