<?php

use WeDevs\PM\Pusher\core\Pusher\Pusher;
use WeDevs\PM\File\Models\File;

function PM_pusher_has_task_update_content( $model ) {

    $content = [];
    $original = $model->getOriginal();

    foreach ( $model->getDirty() as $key => $value ) {
        switch ( $key ) {
            case 'title':
                $content['title'] = $value;
                break;

            case 'description':
                $content['description'] = $value;
                break;

            case 'due_date':
                $formated_due = format_date( $value );
                $original_due = date( 'Y-m-d', strtotime( $original['due_date'] ) );
                $updated_due  = date( 'Y-m-d', strtotime( $formated_due['date'] ) );

                if ( $original_due != $updated_due ) {
                    $content['due_date'] = $formated_due['date'];
                }
                break;
        }
    }

    return $content;
}

function PM_pusher_before_assignees( $task, $assignees ) {
    $is_admin = empty( intval( pm_clean( $_POST['is_admin'] ) ) ) ? false : true;
    $task   = pm_get_task( $task->id );
    $task   = $task['data'];
    $task_user_ids = wp_list_pluck( $task['assignees']['data'], 'id' );

    $id_diff = array_diff( $assignees, $task_user_ids );

    $task_title = $task['title'];
    $url   = pm_get_task_url( $task['project_id'], $task['task_list']['data']['id'], $task['id'], $is_admin );

    $message  = sprintf( '%s <a class="pm-pro-pusher-anchor" class="pm-pro-pusher-anchor" target="_blank" href="'.$url.'">%s</a>', __( "You've been assigned a new" ), __( 'task', 'pm-pro' ) );

    $channel = PM_pusher_channel();
    $event   = PM_pusher_get_event( 'task_update' );

    foreach ( $id_diff as $user_id ) {
        if ( get_current_user_id() ==  $user_id ) {
            continue;
        }
        $channels[] = $channel . '-' . $user_id;
    }

    if ( empty( $channels ) ) {
        return;
    }

    Pusher::trigger( $channels, $event, array(
        'title'   => '',
        'message' => $message
    ));
}

//For task update status
function PM_pusher_update_task_status( $new, $old, $task ) {
    $is_admin = empty( intval( pm_clean( $_POST['is_admin'] ) ) ) ? false : true;
    $task     = pm_get_task( $task->id );
    $task     = $task['data'];
    $status   = $task['status'];

    $task_title     = $task['title'];
    $task_url       = pm_get_task_url( $task['project_id'], $task['task_list']['data']['id'], $task['id'], $is_admin );

    if ( $status == 'complete' ) {
        $message = sprintf( '<a class="pm-pro-pusher-anchor" target="_blank" style="color: #fff; text-decoration: underline;" href="%s">%s</a> %s', $task_url, __( 'Task', 'pm-pro' ), __( 'has been completed', 'pm-pro' ) );
    }

    if ( $status == 'incomplete' ) {
        $message = sprintf( '<a class="pm-pro-pusher-anchor" target="_blank" style="color: #fff; text-decoration: underline;" href="%s">%s</a> %s', $task_url, __( 'Task', 'pm-pro' ) , __( 'has been re-opened', 'pm-pro' ) );
    }

    $channel = PM_pusher_channel();
    $event   = PM_pusher_get_event( 'task_update' );

    foreach ( $task['assignees']['data'] as $key => $user ) {
        if ( get_current_user_id() ==  $user['id'] ) {
            continue;
        }
        $channels[] = $channel . '-' . $user['id'];
    }

    if ( empty( $channels ) ) {
        return;
    }

    Pusher::trigger( $channels, $event, array(
        'title'   => $message,
        'message' => ''
    ));
}

function PM_pusher_update_task( $model ) {
    $class_name = class_basename( $model );

    if ( $class_name != 'Task' ) {
        return;
    }

    $original = $model->getOriginal();
    $task     = pm_get_task( $original['id'] );
    $task     = $task['data'];

    $content = PM_pusher_has_task_update_content( $model );

    foreach ( $content as $cont_type => $cont_value ) {
        if ( empty( $cont_value ) ) {
            unset( $content[$cont_type] );
        }
    }

    if ( empty( $content ) ) {
        return;
    }

    $is_admin = empty( intval( pm_clean( $_POST['is_admin'] ) ) ) ? false : true;
    $url      = pm_get_task_url( $task['project_id'], $task['task_list']['data']['id'], $task['id'], $is_admin );

    if ( count( $content ) == 1 ) {

        if ( ! empty( $content['title'] )  ) {
            $update_key = __( 'title', 'pm-pro' );
        } else if( ! empty( $content['description'] ) ) {
            $update_key = __( 'description', 'pm-pro' );
        } else if( ! empty( $content['due_date'] ) ) {
            $update_key = __( 'due date', 'pm-pro' );
        }

        $message  = sprintf( '%s <a class="pm-pro-pusher-anchor" target="_blank" style="color: #fff; text-decoration: underline;" href="'.$url.'">%s</a> %s', __( 'Task' ), $update_key, __('has been updated', 'pm-pro') );
    } else {
        $message  = sprintf( '<a class="pm-pro-pusher-anchor" target="_blank" style="color: #fff; text-decoration: underline;" href="'.$url.'">%s</a> %s', __( 'Task' ), __('has been updated', 'pm-pro') );
    }

    $channel = PM_pusher_channel();
    $event   = PM_pusher_get_event( 'task_update' );

    foreach ( $task['assignees']['data'] as $key => $user ) {
        if ( get_current_user_id() ==  $user['id'] ) {
            continue;
        }
        $channels[] = $channel . '-' . $user['id'];
    }

    if ( empty( $channels ) ) {
        return;
    }

    Pusher::trigger( $channels, $event, array(
        'title'   => $message,
        'message' => ''
    ));
}

function PM_pusher_after_new_comment( $comment, $params ) {
    $type = $comment['data']['commentable_type'];
    $creator = $comment['data']['creator']['data']['display_name'];

    switch ( $type ) {
        case 'task_list':
            $url = PM_pusher_task_list_url( $params['project_id'], $params['commentable_id'] );
            $on = __( 'task list', 'pm-pro' );
            break;

        case 'task':
            $url = PM_pusher_task_url( $params['project_id'], false, $params['commentable_id'] );
            $on = __( 'task', 'pm-pro' );
            break;

        case 'file':
            $url = PM_pusher_file_url( $params['project_id'], $params['commentable_id'] );
            $on = __( 'file', 'pm-pro' );
            break;

        case 'discussion_board':
            $url = PM_pusher_message_url( $params['project_id'], $params['commentable_id'] );
            $on = __( 'discussion board', 'pm-pro' );
            break;
    }

    $channel = PM_pusher_channel();
    $event   = PM_pusher_get_event( 'new_comment' );

    $users = empty( $params['notify_users'] ) ? [] : explode( ',', $params['notify_users'] );

    foreach ( $users as $user_id ) {
        if ( get_current_user_id() ==  $user_id ) {
            continue;
        }
        $channels[] = $channel . '-' . $user_id;
    }

    if ( empty( $channels ) ) {
        return;
    }

    Pusher::trigger( $channels, $event, array(
        'title' => sprintf(
            '%s %s <a class="pm-pro-pusher-anchor" target="_blank" style="color: #fff; text-decoration: underline;" href="%s">%s</a>',
            ucfirst( $creator ),
            __( 'commented on a', 'pm-pro' ),
            $url,
            $on
        ),
        'message' => ''
    ));
}

function PM_pusher_after_update_comment( $comment, $params ) {
    $type = $comment['data']['commentable_type'];
    $creator = $comment['data']['creator']['data']['display_name'];

    switch ( $type ) {
        case 'task_list':
            $url = PM_pusher_task_list_url( $params['project_id'], $params['commentable_id'] );
            $on = __( 'task list', 'pm-pro' );
            break;

        case 'task':
            $url = PM_pusher_task_url( $params['project_id'], false, $params['commentable_id'] );
            $on = __( 'task', 'pm-pro' );
            break;

        case 'file':
            $url = PM_pusher_file_url( $params['project_id'], $params['commentable_id'] );
            $on = __( 'file', 'pm-pro' );
            break;

        case 'discussion_board':
            $url = PM_pusher_message_url( $params['project_id'], $params['commentable_id'] );
            $on = __( 'discussion board', 'pm-pro' );
            break;
    }

    $channel = PM_pusher_channel();
    $event   = PM_pusher_get_event( 'new_comment' );

    $users = empty( $params['notify_users'] ) ? [] : explode( ',', $params['notify_users'] );

    foreach ( $users as $user_id ) {
        if ( get_current_user_id() ==  $user_id ) {
            continue;
        }
        $channels[] = $channel . '-' . $user_id;
    }

    if ( empty( $channels ) ) {
        return;
    }

    Pusher::trigger( $channels, $event, array(
        'title' => sprintf(
            '%s %s <a class="pm-pro-pusher-anchor" target="_blank" style="color: #fff; text-decoration: underline;" href="%s">%s</a>',
            ucfirst( $creator ),
            __( 'updated his comment on a', 'pm-pro' ),
            $url,
            $on
        ),
        'message' => ''
    ));
}

function PM_pusher_task_list_url( $project_id, $list_id ) {
    $is_admin = empty( intval( pm_clean( $_POST['is_admin'] ) ) ) ? false : true;

    return pm_get_list_url( $project_id, $list_id, $is_admin );
}

function PM_pusher_task_url( $project_id, $list_id, $task_id ) {
    $is_admin = empty( intval( pm_clean( $_POST['is_admin'] ) ) ) ? 'frontend' : 'admin';

    if ( ! $list_id  ) {
        return pm_get_project_page( $is_admin ) . '#/projects/' . $project_id . '/task-lists/tasks/' . $task_id;
    }

    return pm_get_task_url( $project_id, $list_id, $task_id, $is_admin );
}

function PM_pusher_file_url( $project_id, $file_id ) {
    $file = File::find( $file_id );
    $is_admin = empty( intval( pm_clean( $_POST['is_admin'] ) ) ) ? 'frontend' : 'admin';

    if ( $file->type == 'doc' ) {
        return pm_get_project_page( $is_admin ) . '#/projects/' . $project_id . '/files/' . $file->parent . '/doc/' . $file_id;
    }

    if ( $file->type == 'link' ) {
        return pm_get_project_page( $is_admin ) . '#/projects/' . $project_id . '/files/' . $file->parent . '/link/' . $file_id;
    }

    if ( $file->type == 'pro_file' || $file->type == 'file' ) {
        //pmpr(pm_get_project_page( $is_admin ) . '#/projects/' . $project_id . '/files/' . $file->parent . '/files/' . $file_id  )); die();
        return pm_get_project_page( $is_admin ) . '#/projects/' . $project_id . '/files/' . $file->parent . '/files/' . $file_id;
    }
}

function PM_pusher_after_new_message( $message, $params, $discussion_board ) {
    $channel = PM_pusher_channel();
    $event   = PM_pusher_get_event( 'message_create' );

    $users = empty( $params['notify_users'] ) ? [] : explode( ',', $params['notify_users'] );

    foreach ( $users as $user_id ) {
        if ( get_current_user_id() ==  $user_id ) {
            continue;
        }
        $channels[] = $channel . '-' . $user_id;
    }

    if ( empty( $channels ) ) {
        return;
    }

    $url = PM_pusher_message_url( $params['project_id'], $message['data']['id'] );

    Pusher::trigger( $channels, $event, array(
        'title' => sprintf( '%s <a class="pm-pro-pusher-anchor" target="_blank" style="color: #fff; text-decoration: underline;" href="'.$url.'">%s</a>', __( "You've got a new", 'pm-pro' ), __( 'messsage', 'pm-pro' ) ),
        'message' => ''
    ));
}

function PM_pusher_after_update_message( $mesage, $params, $discussion_board ) {
    $channel = PM_pusher_channel();
    $event   = PM_pusher_get_event( 'message_update' );

    $users = empty( $params['notify_users'] ) ? [] : explode( ',', $params['notify_users'] );

    foreach ( $users as $user_id ) {
        if ( get_current_user_id() ==  $user_id ) {
            continue;
        }
        $channels[] = $channel . '-' . $user_id;
    }

    if ( empty( $channels ) ) {
        return;
    }

    $url = PM_pusher_message_url( $params['project_id'], $mesage['data']['id'] );

    Pusher::trigger( $channels, $event, array(
        'title' => sprintf( '<a class="pm-pro-pusher-anchor" target="_blank" style="color: #fff; text-decoration: underline;" href="'.$url.'">%s</a> %s', __( 'Message', 'pm-pro' ), __( 'has been updated', 'pm-pro' ) ),
        'message' => ''
    ));
}

function PM_pusher_message_url( $project_id, $message_id ) {
    $is_admin = empty( intval( pm_clean( $_POST['is_admin'] ) ) ) ? false : true;
    return pm_get_discuss_url( $project_id, $message_id, $is_admin );
}






