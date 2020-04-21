<?php

use WeDevs\PM\Pusher\core\Pusher\Pusher;
use WeDevs\PM\task\Helper\Task;
use WeDevs\PM\Task_List\Helper\Task_List;
use WeDevs\PM\Project\Helper\Project;
use WeDevs\PM\Discussion_Board\Models\Discussion_Board;

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
    $is_admin      = empty( intval( pm_clean( $_POST['is_admin'] ) ) ) ? false : true;
    $task          = pm_get_task( $task->id );
    $task          = $task['data'];
    $task_user_ids = wp_list_pluck( $task['assignees']['data'], 'id' );

    $id_diff = array_diff( $assignees, $task_user_ids );

    $task_title = $task['title'];
    $url     = pm_get_task_url( $task['project_id'], $task['task_list']['data']['id'], $task['id'], $is_admin );
    
    $message = sprintf( '%s <a class="pm-pro-pusher-anchor" class="pm-pro-pusher-anchor" target="_blank" href="'.$url.'">%s</a>', __( "You've been assigned a new" ), __( 'task', 'wedevs-project-manager' ) );
    $nc_message = sprintf( '%1$s <strong>%2$s</strong> %3$s', __( "You've assigned in", 'wedevs-project-manager' ), $task_title, __( 'task', 'wedevs-project-manager' ) );
    
    $channel = PM_pusher_channel();
    $event   = PM_pusher_get_event( 'task_update' );

    foreach ( $id_diff as $user_id ) {
        if ( get_current_user_id() ==  $user_id ) {
            continue;
        }

        $channels[] = $channel . '-' . $user_id;

        pm_wp_notification_center( 
            get_current_user_id(), 
            $user_id, 
            wp_kses_post( htmlspecialchars_decode( $nc_message ) ),
            $url 
        );
    }

    if ( empty( $channels ) ) {
        return;
    }

    Pusher::trigger( $channels, $event, array(
        'title'   => '',
        'message' => wp_kses_post( htmlspecialchars_decode( $message ) )
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
        $message = sprintf( '<a class="pm-pro-pusher-anchor" target="_blank" style="color: #fff; text-decoration: underline;" href="%s">%s</a> %s', $task_url, __( 'Task', 'wedevs-project-manager' ), __( 'has been completed', 'wedevs-project-manager' ) );
        $nc_message = sprintf( '<strong>%1$s</strong> %2$s', $task_title, __( 'has been completed', 'wedevs-project-manager' ) );
    }

    if ( $status == 'incomplete' ) {
        $message = sprintf( '<a class="pm-pro-pusher-anchor" target="_blank" style="color: #fff; text-decoration: underline;" href="%s">%s</a> %s', $task_url, __( 'Task', 'wedevs-project-manager' ) , __( 'has been re-opened', 'wedevs-project-manager' ) );
        $nc_message = sprintf( '<strong>%1$s</strong> %2$s', $task_title, __( 'has been re-opened', 'wedevs-project-manager' ) );
    }

    $channel = PM_pusher_channel();
    $event   = PM_pusher_get_event( 'task_update' );

    foreach ( $task['assignees']['data'] as $key => $user ) {
        if ( get_current_user_id() ==  $user['id'] ) {
            continue;
        }
        
        $channels[] = $channel . '-' . $user['id'];

        pm_wp_notification_center( 
            get_current_user_id(), 
            $user['id'], 
            wp_kses_post( htmlspecialchars_decode( $nc_message ) ),
            $task_url 
        );
    }

    if ( empty( $channels ) ) {
        return;
    }

    Pusher::trigger( $channels, $event, array(
        'title'   => wp_kses_post( htmlspecialchars_decode( $message ) ),
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
            $update_key = __( 'title', 'wedevs-project-manager' );
        } else if( ! empty( $content['description'] ) ) {
            $update_key = __( 'description', 'wedevs-project-manager' );
        } else if( ! empty( $content['due_date'] ) ) {
            $update_key = __( 'due date', 'wedevs-project-manager' );
        }

        $message  = sprintf( '%s <a class="pm-pro-pusher-anchor" target="_blank" style="color: #fff; text-decoration: underline;" href="'.$url.'">%s</a> %s', __( 'Task' ), $update_key, __('has been updated', 'wedevs-project-manager') );
        $nc_message  = sprintf( '<strong>%1$s</strong> %2$s %3$s', $task['title'], $update_key, __('has been updated', 'wedevs-project-manager') );
    } else {
        $message  = sprintf( '<a class="pm-pro-pusher-anchor" target="_blank" style="color: #fff; text-decoration: underline;" href="'.$url.'">%s</a> %s', __( 'Task' ), __('has been updated', 'wedevs-project-manager') );
        $nc_message  = sprintf( '<strong>%1$s</strong> %2$s', $task['title'], __('has been updated', 'wedevs-project-manager') );
    }

    $channel = PM_pusher_channel();
    $event   = PM_pusher_get_event( 'task_update' );

    foreach ( $task['assignees']['data'] as $key => $user ) {
        if ( get_current_user_id() ==  $user['id'] ) {
            continue;
        }

        $channels[] = $channel . '-' . $user['id'];

        pm_wp_notification_center( 
            get_current_user_id(), 
            $user['id'], 
            wp_kses_post( htmlspecialchars_decode( $nc_message ) ),
            $url 
        );
    }

    if ( empty( $channels ) ) {
        return;
    }

    Pusher::trigger( $channels, $event, array(
        'title'   => wp_kses_post( htmlspecialchars_decode( $message ) ),
        'message' => ''
    ));
}

function PM_pusher_after_new_comment( $comment, $params ) {
    $type = $comment['data']['commentable_type'];
    $creator = $comment['data']['creator']['data']['display_name'];
    $title = '';

    switch ( $type ) {
        case 'task_list':
            $task_list = Task_List::get_results([ 'id' =>  $params['commentable_id']]);
            $title     = $task_list['data']['title'];

            $url       = PM_pusher_task_list_url( $params['project_id'], $params['commentable_id'] );
            $on        = __( 'task list', 'wedevs-project-manager' );
            break;

        case 'task':
            $task  = Task::get_results([ 'id' =>  $params['commentable_id']]);
            $title = $task['data']['title'];

            $url   = PM_pusher_task_url( $params['project_id'], false, $params['commentable_id'] );
            $on    = __( 'task', 'wedevs-project-manager' );
            break;

        case 'file':

            $url = PM_pusher_file_url( $params['project_id'], $params['commentable_id'] );
            $title = $on = __( 'file', 'wedevs-project-manager' );
            break;

        case 'discussion_board':
            $discuss = Discussion_Board::find( $params['commentable_id'] );
            $title     = $discuss->title;

            $url = PM_pusher_message_url( $params['project_id'], $params['commentable_id'] );
            $on = __( 'discussion board', 'wedevs-project-manager' );
            break;
    }

    $channel = PM_pusher_channel();
    $event   = PM_pusher_get_event( 'new_comment' );

    $users = empty( $params['notify_users'] ) ? [] : explode( ',', $params['notify_users'] );

    $message = sprintf(
        '%s %s <a class="pm-pro-pusher-anchor" target="_blank" style="color: #fff; text-decoration: underline;" href="%s">%s</a>',
        ucfirst( $creator ),
        __( 'commented on a', 'wedevs-project-manager' ),
        $url,
        $on
    );

    $nc_message = sprintf(
        '<strong>%1$s</strong> %2$s <strong>%3$s</strong>',
        ucfirst( $creator ),
        __( 'commented on a', 'wedevs-project-manager' ),
        $title
    );

    foreach ( $users as $user_id ) {
        if ( get_current_user_id() ==  $user_id ) {
            continue;
        }

        $channels[] = $channel . '-' . $user_id;

        pm_wp_notification_center( 
            get_current_user_id(), 
            $user_id, 
            wp_kses_post( htmlspecialchars_decode( $nc_message ) ),
            $url 
        );
    }

    if ( empty( $channels ) ) {
        return;
    }

    Pusher::trigger( $channels, $event, array(
        'title' => wp_kses_post( htmlspecialchars_decode( $message ) ),
        'message' => ''
    ));
}

function PM_pusher_after_update_comment( $comment, $params ) {
    $type = $comment['data']['commentable_type'];
    $creator = $comment['data']['creator']['data']['display_name'];

    switch ( $type ) {
        case 'task_list':

            $task_list = Task_List::get_results([ 'id' =>  $params['commentable_id']]);
            $title     = $task_list['data']['title'];
            $url       = PM_pusher_task_list_url( $params['project_id'], $params['commentable_id'] );
            $on        = __( 'task list', 'wedevs-project-manager' );
            break;

        case 'task':

            $task  = Task::get_results([ 'id' =>  $params['commentable_id']]);
            $title = $task['data']['title'];
            $url   = PM_pusher_task_url( $params['project_id'], false, $params['commentable_id'] );
            $on    = __( 'task', 'wedevs-project-manager' );
            break;

        case 'file':
            $url   = PM_pusher_file_url( $params['project_id'], $params['commentable_id'] );
            $title = $on = __( 'file', 'wedevs-project-manager' );
            break;

        case 'discussion_board':

            $discuss = Discussion_Board::find( $params['commentable_id'] );
            $title   = $discuss->title;
            $url     = PM_pusher_message_url( $params['project_id'], $params['commentable_id'] );
            $on      = __( 'discussion board', 'wedevs-project-manager' );
            break;
    }

    $channel = PM_pusher_channel();
    $event   = PM_pusher_get_event( 'new_comment' );

    $users = empty( $params['notify_users'] ) ? [] : explode( ',', $params['notify_users'] );

    $nc_message = sprintf(
        '<strong>%1$s</strong> %2$s <strong>%3$s</strong>',
        ucfirst( $creator ),
        __( 'updated comment on a', 'wedevs-project-manager' ),
        $title
    );

    foreach ( $users as $user_id ) {
        if ( get_current_user_id() ==  $user_id ) {
            continue;
        }

        $channels[] = $channel . '-' . $user_id;

        pm_wp_notification_center( 
            get_current_user_id(), 
            $user_id, 
            wp_kses_post( htmlspecialchars_decode( $nc_message ) ),
            $url 
        );
    }

    if ( empty( $channels ) ) {
        return;
    }

    $message = sprintf(
        '%s %s <a class="pm-pro-pusher-anchor" target="_blank" style="color: #fff; text-decoration: underline;" href="%s">%s</a>',
        ucfirst( $creator ),
        __( 'updated his comment on a', 'wedevs-project-manager' ),
        $url,
        $on
    );

    Pusher::trigger( $channels, $event, array(
        'title' => wp_kses_post( htmlspecialchars_decode( $message ) ),
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
    return;
    // $file = File::find( $file_id );
    // $is_admin = empty( intval( pm_clean( $_POST['is_admin'] ) ) ) ? 'frontend' : 'admin';

    // if ( $file->type == 'doc' ) {
    //     return pm_get_project_page( $is_admin ) . '#/projects/' . $project_id . '/files/' . $file->parent . '/doc/' . $file_id;
    // }

    // if ( $file->type == 'link' ) {
    //     return pm_get_project_page( $is_admin ) . '#/projects/' . $project_id . '/files/' . $file->parent . '/link/' . $file_id;
    // }

    // if ( $file->type == 'pro_file' || $file->type == 'file' ) {
        
    //     return pm_get_project_page( $is_admin ) . '#/projects/' . $project_id . '/files/' . $file->parent . '/files/' . $file_id;
    // }
}

function PM_pusher_after_new_message( $message, $params, $discussion_board ) {
    $channel = PM_pusher_channel();
    $event   = PM_pusher_get_event( 'message_create' );
    $creator = $discussion_board->creator->display_name;
    $title   = $discussion_board->title;
    
    $users = empty( $params['notify_users'] ) ? [] : explode( ',', $params['notify_users'] );
    $url     = PM_pusher_message_url( $params['project_id'], $message['data']['id'] );
    $nc_message = sprintf(
        '<strong>%1$s</strong> %2$s <strong>%3$s</strong>',
        ucfirst( $creator ),
        __( 'started a new discussion on', 'wedevs-project-manager' ),
        $title
    );

    foreach ( $users as $user_id ) {
        if ( get_current_user_id() ==  $user_id ) {
            continue;
        }

        $channels[] = $channel . '-' . $user_id;

        pm_wp_notification_center( 
            get_current_user_id(), 
            $user_id, 
            wp_kses_post( htmlspecialchars_decode( $nc_message ) ),
            $url 
        );
    }

    if ( empty( $channels ) ) {
        return;
    }

    
    $message = sprintf( '%s <a class="pm-pro-pusher-anchor" target="_blank" style="color: #fff; text-decoration: underline;" href="'.$url.'">%s</a>', __( "You've got a new", 'wedevs-project-manager' ), __( 'messsage', 'wedevs-project-manager' ) );

    Pusher::trigger( $channels, $event, array(
        'title' => wp_kses_post( htmlspecialchars_decode( $message ) ),
        'message' => '' 
    ));
}

function PM_pusher_after_update_message( $mesage, $params, $discussion_board ) {
    $channel = PM_pusher_channel();
    $event   = PM_pusher_get_event( 'message_update' );
    
    $updater = $discussion_board->updater->display_name;
    $title   = $discussion_board->title;

    $users = empty( $params['notify_users'] ) ? [] : explode( ',', $params['notify_users'] );
    $url = PM_pusher_message_url( $params['project_id'], $mesage['data']['id'] );

    $nc_message = sprintf(
        '<strong>%1$s</strong> %2$s <strong>%3$s</strong>',
        ucfirst( $updater ),
        __( 'updated discussion on a', 'wedevs-project-manager' ),
        $title
    );

    foreach ( $users as $user_id ) {
        if ( get_current_user_id() ==  $user_id ) {
            continue;
        }

        $channels[] = $channel . '-' . $user_id;

        pm_wp_notification_center( 
            get_current_user_id(), 
            $user_id, 
            wp_kses_post( htmlspecialchars_decode( $nc_message ) ),
            $url 
        );
    }

    if ( empty( $channels ) ) {
        return;
    }

    $message = sprintf( '<a class="pm-pro-pusher-anchor" target="_blank" style="color: #fff; text-decoration: underline;" href="'.$url.'">%s</a> %s', __( 'Message', 'wedevs-project-manager' ), __( 'has been updated', 'wedevs-project-manager' ) );

    Pusher::trigger( $channels, $event, array(
        'title' => wp_kses_post( htmlspecialchars_decode( $message ) ),
        'message' => ''
    ));
}

function PM_pusher_message_url( $project_id, $message_id ) {
    $is_admin = empty( $_POST['is_admin'] ) ? false : true;
    return pm_get_discuss_url( $project_id, $message_id, $is_admin );
}

function pm_wp_notification_center( $sender_id, $receiver_id, $message, $anchor=''  ) {

    if ( ! function_exists( 'wd_notify' ) ) {
        return;
    }

    wd_notify()->to( $receiver_id )
        ->body( $message )
        ->from_user( $sender_id )
        ->link( $anchor )
        ->send();
}






