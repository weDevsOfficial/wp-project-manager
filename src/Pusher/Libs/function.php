<?php

function wedevs_pm_pusher_channel( $user_id = null ) {

    if ( $user_id === null ) {
        $user_id = get_current_user_id();
    }

    // Pusher requires the `private-` prefix for authenticated channels.
    return 'private-wp-project-manager-' . absint( $user_id );
}

function wedevs_pm_pusher_events() {

    return [
        'task_create'    => 'create-task', //Event
        'task_update'    => 'update-task', //Event
        'new_comment'    => 'new-comment', //Event
        'message_create' => 'create-message', //Event
        'message_update' => 'update-message', //Event
    ];
}

function wedevs_pm_pusher_get_event( $event_key ) {

    $events = wedevs_pm_pusher_events();

    return $events[$event_key];
}

/**
 * Master switch. True if Pusher notifications enabled.
 * Default: true when setting absent (preserves existing behavior).
 */
function wedevs_pm_pusher_is_enabled() {
    $setting = wedevs_pm_get_setting( 'pusher_enable' );

    if ( $setting === null || $setting === '' ) {
        return true;
    }

    return filter_var( $setting, FILTER_VALIDATE_BOOLEAN );
}

/**
 * Per-event switch. Master must be on AND specific event flag enabled.
 * Default: true when setting absent.
 *
 * @param string $key e.g. 'task_assign', 'task_status', 'task_update',
 *                    'comment_new', 'comment_update',
 *                    'message_new', 'message_update'
 */
function wedevs_pm_pusher_is_event_enabled( $key ) {
    if ( ! wedevs_pm_pusher_is_enabled() ) {
        return false;
    }

    $setting = wedevs_pm_get_setting( 'pusher_notify_' . $key );

    if ( $setting === null || $setting === '' ) {
        return true;
    }

    return filter_var( $setting, FILTER_VALIDATE_BOOLEAN );
}


