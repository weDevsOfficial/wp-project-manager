<?php

function pm_pusher_channel() {

    return 'private-wp-project-manager';
}

function pm_pusher_events() {

    return [
        'task_create'    => 'create-task', //Event
        'task_update'    => 'update-task', //Event
        'new_comment'    => 'new-comment', //Event
        'message_create' => 'create-message', //Event
        'message_update' => 'update-message', //Event
    ];
}

function pm_pusher_get_event( $event_key ) {

    $events = pm_pusher_events();

    return $events[$event_key];
}


