<?php

use WeDevs\PM\Core\Textdomain\Textdomain;
use WeDevs\PM\Core\Notifications\Email;
use League\Fractal;
use League\Fractal\Resource\Item as Item;
use WeDevs\PM\Task\Transformers\Task_Transformer;
use WeDevs\PM\Task\Models\Task;

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
    $timezone = $tzcode;

    if ( array_key_exists( $tzcode , $timezones ) ) {
        $timezone = $timezones[ $tzcode ];
    }

    return $timezone;
}

function tzstring_to_tzcode( $tzstr ) {
    $timezones = config( 'timezones' );
    $default = '';

    foreach ( $timezones as $tzcode => $tzstring ) {
        if ( $tzstring == $tzstr ) {
            return $tzcode;
        }
    }

    return $default;
}

function format_date( $date ) {

    if ( $date && !is_object($date) ) {
        $date =  \Carbon\Carbon::parse($date);
    }
    
    $date_format = get_option( 'date_format' );
    $time_format = get_option( 'time_format' );
    $timezone    = get_wp_timezone();

    return [
        'date'      => $date ? $date->format( 'Y-m-d' ) : null,
        'time'      => $date ? $date->format( 'H:i:s' ) : null,
        'timezone'  => tzcode_to_tzstring( $timezone ),
        'timestamp' => $date ?  $date->toATOMString() : null
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
    $settings     = null;
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
        $settings =  $all_settings->toArray();
        return wp_list_pluck( $settings, 'value', 'key' );
    }

    return null;
}

function pm_delete_settings( $key, $project_id = false ) {

    if ( $project_id ) {
        $settings = \WeDevs\PM\Settings\Models\Settings::where( 'key', $key )
            ->where('project_id', $project_id)
            ->first();
    } else {
        $settings = \WeDevs\PM\Settings\Models\Settings::where( 'key', $key )
            ->first();
    }
    
    if ( $settings ) {
        $settings->delete();

        wp_send_json_success();
    }

    wp_send_json_error();
}

function pm_set_settings( $key, $value, $project_id = false ){

    if ( $project_id == false ){
        $settings = \WeDevs\PM\Settings\Models\Settings::updateOrCreate(['key' => $key], ['value' => $value ]);
    }else {
        $settings = \WeDevs\PM\Settings\Models\Settings::updateOrCreate(['key' => $key, 'project_id' => $project_id ], ['value' => $value ]);
    }

    return $settings;
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

function pm_get_meta( $entity_id, $project_id, $type, $key ) {
    $meta = WeDevs\PM\Common\Models\Meta::where( 'entity_id', $entity_id )
        ->where( 'project_id', $project_id )
        ->where( 'entity_type',  $type )
        ->where( 'meta_key', $key )
        ->first();

    return $meta;
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

function pmpr() {
    $args = func_get_args();

    foreach ( $args as $arg ) {
        echo '<pre>'; print_r( $arg ); '</pre>';
    }
}

function pm_default_co_caps() {
    return [
        'create_message'         => true,
        'view_private_message'   => true,
        'create_list'            => true,
        'view_private_list'      => true,
        'create_task'            => true,
        'view_private_task'      => true,
        'create_milestone'       => true,
        'view_private_milestone' => true,
        'create_file'            => true,
        'view_private_file'      => true
    ];
}

function pm_default_client_caps() {
    return [
        'create_message'         => true,
        'view_private_message'   => false,
        'create_list'            => true,
        'view_private_list'      => false,
        'create_task'            => true,
        'view_private_task'      => false,
        'create_milestone'       => true,
        'view_private_milestone' => false,
        'create_file'            => true,
        'view_private_file'      => false
    ];
}

function pm_pro_get_project_capabilities( $project_id ) {
    $caps = WeDevs\PM\Settings\Models\Settings::where('key', 'capabilities')
        ->where('project_id', $project_id)
        ->first();
    
    if ( ! $caps ) {
        return [
            'co_worker' => pm_default_co_caps(),
            'client'    => pm_default_client_caps()
        ];
    }

    $formatedCaps = [];
    
    foreach ( $caps->value as $key => $value ) {
        $formatedCaps[$key] = array_map( function($val) {
            return $val === 'true' ? true : false;
        }, $value );
    }
    
    return $formatedCaps;
}

function pm_is_user_in_project( $project_id, $user_id = false ) {
    $user_id = $user_id ? $user_id : get_current_user_id();

    $user_in_project = WeDevs\PM\User\Models\User_Role::where( 'project_id', $project_id ) 
        ->where( 'user_id', $user_id )
        ->first();

    return $user_in_project ? true : false;
}

function pm_is_user_in_task( $project_id, $user_id = false ) {
    $user_id = $user_id ? $user_id : get_current_user_id();

    $user_in_task = WeDevs\PM\Common\Models\Assignee::where( 'project_id', $project_id ) 
        ->where( 'assigned_to', $user_id )
        ->first();

    return $user_in_task ? true : false;
}

function pm_get_role( $project_id, $user_id = false ) {
    $user_id = $user_id ? $user_id : get_current_user_id();

    $role = WeDevs\PM\User\Models\User_Role::with('role')
        ->where( 'project_id', $project_id )
        ->where( 'user_id', $user_id )
        ->first();

    if ( $role ) {
        return $role->role->slug;
    }

    return false;
}

function pm_is_manager( $project_id, $user_id = false ) {
    $user_id = $user_id ? $user_id : get_current_user_id();

    $role = pm_get_role( $project_id, $user_id );

    return $role == 'manager' ? true : false;
}

function pm_get_role_caps( $project_id, $role ) {
    $caps = pm_pro_get_project_capabilities( $project_id );

    if ( !empty( $caps[$role] ) ) {
        return $caps[$role];
    }

    return [];
}

function pm_user_can( $cap, $project_id, $user_id = false ) {
    $user_id = $user_id ? $user_id : get_current_user_id();
    
    // $cache_key  = 'pm_user_can-' . md5( serialize( [
    //  'cap'        => $cap,
    //  'project_id' => $project_id,
    //  'user_id'    => $user_id
    // ] ) );

    // $items  = wp_cache_get( $cache_key, 'pm' );

    // if ( false === $items ) {
        if ( pm_has_manage_capability( $user_id ) ) {
            return true;
        }
        if ( ! pm_is_user_in_project( $project_id, $user_id ) ) {
            return false;
        }

        if ( pm_is_manager( $project_id, $user_id ) ) {
            return true;
        }

        $role = pm_get_role( $project_id, $user_id );
        if ( !$role ) {
            return false;
        }

        if ( $cap === 'view_project' ) {
            return true;
        }
        
        $role_caps = pm_get_role_caps( $project_id, $role );

        if ( isset( $role_caps[$cap] ) ) {
            return $role_caps[$cap];
        }

    //  wp_cache_set( $cache_key, $items, 'erp' );
    // }

    return false;
}

function pm_has_manage_capability( $user_id = false ) {
    
    $user_id = $user_id ? intval( $user_id ) : get_current_user_id();
    $user    = get_user_by( 'id', $user_id );
    
    if ( !$user->roles || !is_array($user->roles) ) {
        return false;
    }
    
    $manage_roles = (array) pm_get_settings( 'managing_capability' );
    
    $common_role  = array_intersect( $manage_roles, $user->roles );

    if ( empty( $common_role ) ) {
        return false;
    }

    return true;
}

function pm_has_project_create_capability( $user_id = false ) {
    
    $user_id = $user_id ? $user_id : get_current_user_id();
    $user    = get_user_by( 'id', $user_id );

    $manage_roles = (array) pm_get_settings( 'project_create_capability' );
    $common_role  = array_intersect( $manage_roles, $user->roles );

    if ( empty( $common_role ) ) {
        return false;
    }

    return true;
}
function pm_has_project_managing_capability( $project_id, $user_id = false ) {
    if ( pm_has_manage_capability( $user_id ) ) {
        return true;
    }
    if ( pm_is_manager( $project_id, $user_id ) ) {
        return true;
    }

    return false;
}
function pm_user_can_complete_task( $task, $user_id = false ) {
    if(!$task) {
        return false;
    }
    $user_id = $user_id ? $user_id: get_current_user_id();

    if ( pm_has_manage_capability( $user_id ) ) {
        return true;
    }

    if ( pm_is_manager( $task->project_id, $user_id ) ) {
        return true;
    }

    if ( $task->created_by == $user_id ) {
        return true;
    }

    $assignees = $task->assignees->toArray(); //pluck( 'assigned_to' )->all();
    $assignees = wp_list_pluck( $assignees, 'assigned_to' );
    $in_array = in_array( $user_id, $assignees );

    if ( !empty( $in_array ) ) {
        return true;
    }

    return false;
}

/**
 * What type of request is this?
 *
 * @param  string $type admin, ajax, cron or frontend.
 * @return bool
 */
function pm_is_request( $type ) {
    switch ( $type ) {
        case 'admin' :
            return is_admin();
        case 'ajax' :
            return defined( 'DOING_AJAX' );
        case 'cron' :
            return defined( 'DOING_CRON' );
        case 'frontend' :
            return ( ! is_admin() || defined( 'DOING_AJAX' ) ) && ! defined( 'DOING_CRON' );
    }
}

/**
 * The main logging function
 *
 * @since 0.1
 * @uses error_log
 * @param string $type type of the error. e.g: debug, error, info
 * @param string $msg
 */
function pm_log( $type = '', $msg = '' ) {
    $ouput_path = config( 'frontend.patch' );

    if ( WP_DEBUG == true ) {
        $msg = sprintf( "[%s][%s] %s\n", date( 'd.m.Y h:i:s' ), $type, print_r($msg, true) );
        error_log( $msg, 3, $ouput_path . '/tmp/pm-debug.log' );
    }
}

function pm_get_translations_for_plugin_domain( $domain, $language_dir = null ) {

    if ( $language_dir == null ) {
        $language_dir  = config('frontend.patch') . '/languages/';
    }
    
    $languages     = get_available_languages( $language_dir );
    $get_site_lang = is_admin() ? get_user_locale() : get_locale();
    $mo_file_name  = $domain .'-'. $get_site_lang;
    $translations  = [];
    
    if ( 
        in_array( $mo_file_name, $languages )
            &&
        file_exists( $language_dir . $mo_file_name . '.mo' )
    ) {
        $mo = new MO();
        if ( $mo->import_from_file( $language_dir . $mo_file_name . '.mo' ) ) {
            $translations = $mo->entries;
        }
    }

    return [
        'header'       => isset( $mo ) ? $mo->headers : '',
        'translations' => $translations
    ];
}

/**
 * Returns Jed-formatted localization data.
 *
 * @param  string $domain Translation domain.
 *
 * @return array
 */
function pm_get_jed_locale_data( $domain, $language_dir = null ) {
    $plugin_translations = pm_get_translations_for_plugin_domain( $domain, $language_dir );
    $translations = get_translations_for_domain( $domain );

    $locale = array(
        'domain'      => $domain,
        'locale_data' => array(
            $domain => array(
                '' => array(
                    'domain' => $domain,
                    'lang'   => is_admin() ? get_user_locale() : get_locale(),
                ),
            ),
        ),
    );

    if ( ! empty( $translations->headers['Plural-Forms'] ) ) {
        $locale['locale_data'][ $domain ]['']['plural_forms'] = $translations->headers['Plural-Forms'];
    } else if ( ! empty( $plugin_translations['header'] ) ) {
        $locale['locale_data'][ $domain ]['']['plural_forms'] = $plugin_translations['header']['Plural-Forms'];
    }

    $entries = array_merge( $plugin_translations['translations'], $translations->entries );

    foreach ( $entries as $msgid => $entry ) {
        $locale['locale_data'][ $domain ][ $msgid ] = $entry->translations;
    }
    return $locale;
}

function pm_tb_prefix() {
    global $wpdb;

    return $wpdb->prefix;
}

/**
 * Displays tasks, messages, milestones contents. Removed `the_content` filter
 * and applied other filters due to conflicts created by other plugins.
 *
 * @param string $content
 * @return string
 */
function pm_get_content( $content ) {
    $content = apply_filters( 'pm_get_content', $content );

    return $content;
}

function pm_filter_content_url( $content ) {
    $content = apply_filters( 'pm_get_content_url', $content );
    
    return $content;
}

function pm_get_user_url( $user_id = false ) {
    $user_id = $user_id ? $user_id : get_current_user_id();

    $pm_base  = Email::getInstance()->pm_link();
    $user_url = $pm_base . '#/my-tasks/' . $user_id;

    return $user_url;
}

function pm_get_task_url( $project_id, $list_id, $task_id ) {

    $pm_base  = Email::getInstance()->pm_link();
    $task_url = $pm_base . '#/projects/' . $project_id . '/task-lists/' . $list_id . '/tasks/' . $task_id;

    return $task_url;
}

function pm_get_task( $task_id ) {
    $task = Task::with('task_lists')
        ->where( 'id', $task_id )
        ->first();
    
    if ( $task == NULL ) {
        return pm_get_response( null,  [
            'message' => pm_get_text('success_messages.no_element')
        ] );
    }

    $resource = new Item( $task, new Task_Transformer );

    return pm_get_response( $resource );
}

function pm_get_file_download_url( $project_id, $user_id, $file_id ) {
    return get_rest_url() . 'pm/v2/projects/' . $project_id . '/files/' . $file_id . '/users/' . $user_id . '/download';
}

function pm_get_list_url( $project_id, $list_id ) {

    $pm_base  = Email::getInstance()->pm_link();
    $list_url = $pm_base . '#/projects/' . $project_id . '/task-lists/' . $list_id;

    return $list_url;
}

