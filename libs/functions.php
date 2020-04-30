<?php

use WeDevs\PM\Core\Textdomain\Textdomain;
use WeDevs\PM\Core\Notifications\Email;
use League\Fractal;
use League\Fractal\Resource\Item as Item;
use WeDevs\PM\Task\Transformers\Task_Transformer;
use WeDevs\PM\Task\Models\Task;
use WeDevs\PM\Task_List\Models\Task_List;
use WeDevs\PM\Milestone\Models\Milestone;
use WeDevs\PM\Discussion_Board\Models\Discussion_Board;
use Illuminate\Database\Eloquent\Collection;
use WeDevs\PM\Project\Models\Project;

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
        'datetime'      => $date ? $date->format( 'Y-m-d H:i:s' ) : null,
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

function pm_get_setting( $key = null, $project_id = false ) {
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
        $hide = \WeDevs\PM\Settings\Models\Settings::$hideSettings;
        $all_settings = \WeDevs\PM\Settings\Models\Settings::whereNotIn( 'key', $hide )->get();
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

function pm_get_settings( $key = null, $project_id = false ) {
    $settings = null;

    if ( $key && $project_id ) {
        $settings = \WeDevs\PM\Settings\Models\Settings::where( 'key', $key )
            ->where('project_id', $project_id)
            ->get()
            ->toArray();
    } else if ( $key ) {
        $settings = \WeDevs\PM\Settings\Models\Settings::where( 'key', $key )
            ->get()
            ->toArray();

    } else if ( $project_id ) {
        $settings = \WeDevs\PM\Settings\Models\Settings::where( 'project_id', $project_id )
            ->get()
            ->toArray();
    }

    return $settings;
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
        $manager->parseIncludes( sanitize_text_field( wp_unslash( $_GET['with'] ) ) );
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

function pm_default_cap() {
    $pm_caps =  [
        '1'  => 'create_message',
        '2'  => 'view_private_message',
        '3'  => 'create_list',
        '4'  => 'create_task',
        '5'  => 'create_milestone',
        '6'  => 'view_private_milestone',
        '7'  => 'create_task',
        '8'  => 'view_private_task',
        '9'  => 'create_file',
        '10' => 'view_private_file'
    ];

    return $pm_caps;
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

    $cache_key  = 'pm_user_can-' . md5( serialize( [
     'cap'        => $cap,
     'project_id' => $project_id,
     'user_id'    => $user_id
    ] ) );

    $items  = wp_cache_get( $cache_key, 'pm' );

    if ( false === $items ) {
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

        wp_cache_set( $cache_key, $items, 'erp' );
    }

    return false;
}

function pm_has_manage_capability( $user_id = false ) {
    $user_id = $user_id ? intval( $user_id ) : get_current_user_id();
    $user    = get_user_by( 'id', $user_id );
    
    if ( !$user->roles || !is_array($user->roles) ) {
        return false;
    }

    if ( in_array( 'administrator', $user->roles ) ) {
        return true;
    }

    $manage_roles = (array) pm_get_setting( 'managing_capability' );

    $common_role  = array_intersect( $manage_roles, $user->roles );

    if ( empty( $common_role ) ) {
        return false;
    }

    return true;
}

function pm_has_project_create_capability( $user_id = false ) {

    $user_id = $user_id ? $user_id : get_current_user_id();
    $user    = get_user_by( 'id', $user_id );

    $manage_roles = (array) pm_get_setting( 'project_create_capability' );
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

function pm_get_user_url( $user_id = false, $is_admin ) {
    $user_id = $user_id ? $user_id : get_current_user_id();

    $is_admin = $is_admin ? 'admin' : 'frontend';
    $pm_base  = pm_get_project_page($is_admin);
    $user_url = $pm_base . '#/my-tasks/' . $user_id;

    return $user_url;
}

function pm_get_task_url( $project_id, $list_id, $task_id, $is_admin ) {
    $is_admin = $is_admin ? 'admin' : 'frontend';
    $pm_base  = pm_get_project_page($is_admin);
    $task_url = $pm_base . '#/projects/' . $project_id . '/task-lists/' . $list_id . '/tasks/' . $task_id;

    return $task_url;
}

function pm_get_discuss_url( $project_id, $discuss_id, $is_admin ) {
    $is_admin = $is_admin ? 'admin' : 'frontend';
    $pm_base  = pm_get_project_page( $is_admin );
    $task_url = $pm_base . '#/projects/' . $project_id . '/discussions/' . $discuss_id;

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

function pm_get_list_url( $project_id, $list_id, $is_admin ) {

    $is_admin = $is_admin ? 'admin' : 'frontend';
    $pm_base  = pm_get_project_page( $is_admin );
    $list_url = $pm_base . '#/projects/' . $project_id . '/task-lists/' . $list_id;

    return $list_url;
}

function pm_get_front_end_project_page() {
    $pages   = get_option( 'pm_pages', [] );
    $project = empty( $pages['project'] ) ? '' : absint( $pages['project'] );

    if ( $project ) {
        return get_permalink( $project );
    }

    return '';
}

function pm_get_project_page( $type = false ) {

    if ( $type == 'admin' ) {
        return admin_url( 'admin.php?page=pm_projects' );
    }

    if ( $type == 'frontend' ) {
        return pm_get_front_end_project_page();
    }

    if ( pm_is_request( 'admin' ) ) {
        return admin_url( 'admin.php?page=pm_projects' );
    }

    if ( pm_is_request( 'frontend' ) ) {
        return pm_get_front_end_project_page();
    }
}

function pm_total_projects() {
    $project = Project::count();
    return $project;
}

function pm_total_task() {
    $task = Task::count();
    return $task;
}

function pm_total_task_list() {
    $task_list = Task_List::count();
    return $task_list;
}

function pm_total_milestone() {
    $milestone = Milestone::count();
    return $milestone;
}

function pm_total_message() {
    $message = Discussion_Board::count();
    return $message;
}
/**
* Get current IP
*
* @since 1.0.0
*
* @return void
**/
function pm_get_ip() {
    $ipaddress = '';

    if ( isset($_SERVER['HTTP_CLIENT_IP'] ) ) {
        $ipaddress = $_SERVER['HTTP_CLIENT_IP'];
    } else if ( isset( $_SERVER['HTTP_X_FORWARDED_FOR'] ) ) {
        $ipaddress = $_SERVER['HTTP_X_FORWARDED_FOR'];
    } else if ( isset( $_SERVER['HTTP_X_FORWARDED'] ) ) {
        $ipaddress = $_SERVER['HTTP_X_FORWARDED'];
    } else if ( isset( $_SERVER['HTTP_FORWARDED_FOR'] ) ) {
        $ipaddress = $_SERVER['HTTP_FORWARDED_FOR'];
    } else if ( isset( $_SERVER['HTTP_FORWARDED'] ) ) {
        $ipaddress = $_SERVER['HTTP_FORWARDED'];
    } else if ( isset( $_SERVER['REMOTE_ADDR'] ) ) {
        $ipaddress = $_SERVER['REMOTE_ADDR'];
    } else {
        $ipaddress = 'UNKNOWN';
    }

    return $ipaddress;
}

function pm_get_capabilities() {

    return [
        'Message Create',
        'Message Private',
        'Task List Create',
        'Task List Private',
        'Milestone Create',
        'Milestone Private',
        'Task Create',
        'Task Private',
        'File Create',
        'File Private',
    ];
}

function pm_get_capabilities_relation( $role ) {

    $caps = [
        'create_message'         => 1,
        'view_private_message'   => 2,
        'create_list'            => 3,
        'view_private_list'      => 4,
        'create_milestone'       => 5,
        'view_private_milestone' => 6,
        'create_task'            => 7,
        'view_private_task'      => 8,
        'create_file'            => 9,
        'view_private_file'      => 10
    ];

    return $caps[$role];
}


// function pm_get_prepare_format( $ids, $is_string = false  ) {
//     // how many entries will we select?
//     $how_many = count( $ids );

//     // prepare the right amount of placeholders
//     // if you're looing for strings, use '%s' instead
//     if( $is_string ) {
//         $placeholders = array_fill( 0, $how_many, '%s' );
//     } else {
//         $placeholders = array_fill( 0, $how_many, '%d' );
//     }

//     // glue together all the placeholders...
//     // $format = '%d, %d, %d, %d, %d, [...]'
//     $format = implode( ', ', $placeholders );

//     return $format;
// }

function pm_get_prepare_format( $ids, $is_string = false ) {

    
    $ids = pm_get_prepare_data( $ids );

    // how many entries will we select?
    $how_many = count( $ids );

    // prepare the right amount of placeholders
    // if you're looing for strings, use '%s' instead
    if( $is_string ) {
        $placeholders = array_fill( 0, $how_many, '%s' );
    } else {
        $placeholders = array_fill( 0, $how_many, '%d' );
    }

    // glue together all the placeholders...
    // $format = '%d, %d, %d, %d, %d, [...]'
    $format = implode( ', ', $placeholders );

    return $format;
}

function pm_get_prepare_data( $args, $delimiter = ',' ) {

    $new = [];

    if ( is_array( $args ) ) {
        foreach ( $args as $date_key => $value ) {
            if ( empty( $value ) ) {
                continue;
            }

            $new[trim($date_key)] = trim( $value );
        }
    }

    if ( ! is_array( $args ) ) {
        $args = explode( $delimiter, $args );

        foreach ( $args as $date_key => $value ) {
            if ( empty( $value ) ) {
                continue;
            }

            $new[trim($date_key)] = trim( $value );
        }
    }

    return $new;
}

/**
 * Clean variables using pm_clean. Arrays are cleaned recursively.
 * Non-scalar values are ignored.
 *
 * @param string|array $var Data to sanitize.
 * @return string|array
 */
function pm_clean( $var ) {
    if ( is_array( $var ) ) {
        return array_map( 'pm_clean', $var );
    } else {
        return is_scalar( $var ) ? sanitize_text_field( wp_unslash( $var ) ) : $var;
    }
}

/**
 * Get Dashboard slug
 *
 * @since 1.0.0
 * @return string
 */
function pm_frontend_slug() {
    $slug = get_option( 'pm_frontend_slug' );
    if ( ! $slug ) {
        $slug = 'pm';
    }

    return apply_filters( 'pm_frontend_slug', sanitize_title( $slug ) );
}

/**
 * Get dashboard url
 *
 * @return string
 */
function pm_frontend_url() {
    $site_url       = get_site_url();
    $dashboard_slug = ltrim( get_pm_frontend_slug(), '/' );

    return trailingslashit( $site_url ) . $dashboard_slug;
}

/**
 * Get dashboard title
 *
 * @return string
 */
function pm_dashboard_title() {
    $dashboard_title = get_option( 'pm_frontend_dashboard_title' );

    if ( ! $dashboard_title ) {
        $dashboard_title = __( 'Project Manager', 'wedevs-project-manager' );
    }

    return apply_filters( 'pm_dashboard_title', $dashboard_title );
}

/**
 * Get frontend query var
 *
 * @return string
 */
function pm_register_query_var() {
    return apply_filters( 'pm_frontend_query_var', 'pm_dashboard' );
}

/**
 * Get HTML wrap
 *
 * @return string
 */
function pm_root_element() {
    $id = pm_root_element_id();
    return apply_filters( 'pm_root_element', '<div id="'. $id .'"></div>' );
}

/**
 * Get HTML wrap id
 *
 * @return string
 */
function pm_root_element_id() {
    return apply_filters( 'pm_root_element_id', 'wedevs-pm' );
}

/**
 * Get admin slug
 *
 * @return string
 */
function pm_admin_slug() {
    return apply_filters( 'pm_admin_slug', 'pm_projects' );
}

/**
 * Get admin url
 *
 * @return string
 */
function pm_admin_url() {
    $slug = pm_admin_slug();
    return apply_filters( 'pm_admin_url', admin_url( "admin.php?page={$slug}" ) );
}

/**
 * Dashboard Logo
 *
 * @return void
 */
function pm_dashboard_logo() {
    // $logo = get_option( 'pm_frontend_logo' );
    // if ( $logo ) {
    //     return wp_get_attachment_url( $logo );
    // }

    // return ERP_DASHBOARD_ASSETS . '/images/pm-logo.png';
}

function pm_active_for_network() {
    
    $plugins     = get_plugins();
    $plugin_path = false;
    
    foreach ( $plugins as $path => $plugin ) {
        if ( $plugin['TextDomain'] == 'wedevs-project-manager' ) {
            $plugin_path = $path;
        }
    }

    if ( empty( $plugin_path ) ) {
        return false;
    }

    if ( is_plugin_active_for_network( $plugin_path ) ) {
        return true;
    }

    return false;
}

function pm_user_meta_key() {
    global $wpdb;

    return $wpdb->prefix . 'capabilities';
}

function pm_can_create_user_at_project_create_time() {
    return apply_filters( 'pm_can_create_user_at_project_create_time', true );
}

function pm_get_estimation_type() { 
    if ( ! function_exists( 'pm_pro_is_module_active' ) ) {
        return 'task';
    }

    if( ! pm_pro_is_module_active( 'sub_tasks/sub_tasks.php' ) ) {
        return 'task';
    }

    $db_est_type = pm_get_setting( 'estimation_type' );

    if ( empty( $db_est_type ) ) {
        return 'task';
    }

    return $db_est_type;
}

function pm_second_to_time( $seconds ) {
    $total_second = $seconds;
    // extract hours
    $hours = floor( $seconds / (60 * 60) );

    // extract minutes
    $divisor_for_minutes = $seconds % (60 * 60);
    $minutes = floor( $divisor_for_minutes / 60 );

    // extract the remaining seconds
    $divisor_for_seconds = $divisor_for_minutes % 60;
    $seconds = ceil( $divisor_for_seconds );

    // return the final array
    $obj = array(
        'hour' => str_pad( (int) $hours, 2, '0', STR_PAD_LEFT ),
        'minute' => str_pad( (int) $minutes, 2, '0', STR_PAD_LEFT ),
        'second' => str_pad( (int) $seconds, 2, '0', STR_PAD_LEFT ),
        'total_second' => $total_second
    );

    return $obj;
}

/**
 * [pm_get_projects description]
 * @param  array|string $params
 * @return [type]
 */
function pm_get_projects( $params ) {
     return WeDevs\PM\Project\Helper\Project::get_results( $params );
}

/**
 * [pm_get_task_lists description]
 * @param  array|string $params
 * @return [type]
 */
function pm_get_task_lists( $params ) {
     return \WeDevs\PM\Task_List\Helper\Task_List::get_results( $params );
}

/**
 * [pm_get_tasks description]
 * @param  array|string $params
 * @return [type]
 */
function pm_get_tasks( $params ) {
     return \WeDevs\PM\task\Helper\Task::get_results( $params );
}

/**
 * [pm_get_milestones description]
 * @param  array|string $params
 * @return [type]
 */
function pm_get_milestones( $params ) {
     return \WeDevs\PM\Milestone\Helper\Milestone::get_results( $params );
}

/**
 * [pm_get_discussions description]
 * @param  array|string $params
 * @return [type]
 */
function pm_get_discussions( $params ) {
     return \WeDevs\PM\Discussion_Board\Helper\Discussion_Board::get_results( $params );
}

/**
 * [pm_get_comments description]
 * @param  array|string $params
 * @return [type]
 */
function pm_get_comments( $params ) {
     return \WeDevs\PM\Comment\Helper\Comment::get_results( $params );
}

/**
 * [pm_get_files description]
 * @param  array|string $params
 * @return [type]
 */
function pm_get_files( $params ) {
     return \WeDevs\PM\File\Helper\File::get_results( $params );
}

/**
 * [pm_get_users description]
 * @param  array|string $params
 * @return [type]
 */
function pm_get_users( $params ) {
     return \WeDevs\PM\User\helper\User::get_results( $params );
}

/**
 * check the query is single data or not
 * @param  array|string $params
 * @return [type]
 */
function pm_is_single_query( $params ) {
    if ( empty( $params['id'] ) ) {
        return false;
    }

    if ( is_array( $params['id'] ) ) {
        return false;
    }

    $id = pm_get_prepare_data( $params['id'] );

    if ( count( $id ) == 1 ) {
        return true;
    }

    return false;
}



