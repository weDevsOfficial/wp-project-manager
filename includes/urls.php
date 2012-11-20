<?php

/**
 * ------------------------------------------------
 * Project URL Helpers
 * ------------------------------------------------
 */
function cpm_url_projects() {
    return sprintf( '%s?page=cpm_projects', admin_url( 'admin.php' ) );
}

function cpm_url_project_details( $project_id ) {
    $url = sprintf( '%s?page=cpm_projects&tab=project&action=single&pid=%d', admin_url( 'admin.php' ), $project_id );

    return apply_filters( 'cpm_url_project_details', $url );
}

/**
 * ------------------------------------------------
 * Task/Tasklist URL Helpers
 * ------------------------------------------------
 */

function cpm_url_single_tasklist( $project_id, $list_id ) {
    $url = sprintf( '%s?page=cpm_projects&tab=task&action=single&pid=%d&tl_id=%d', admin_url( 'admin.php' ), $project_id, $list_id );

    return apply_filters( 'cpm_url_single_tasklislt', $url );
}

function cpm_url_single_task( $project_id, $list_id, $task_id ) {
    $url = sprintf( '%s?page=cpm_projects&tab=task&action=task_single&pid=%d&tl_id=%d&task_id=%d', admin_url( 'admin.php' ), $project_id, $list_id, $task_id );

    return apply_filters( 'cpm_url_single_task', $url );
}

/**
 * ------------------------------------------------
 * Message URL Helpers
 * ------------------------------------------------
 */
function cpm_url_single_message( $project_id, $message_id ) {
    $url = sprintf( '%s?page=cpm_projects&tab=message&action=single&pid=%d&mid=%d', admin_url( 'admin.php' ), $project_id, $message_id );

    return apply_filters( 'cpm_url_single_message', $url );
}

function cpm_url_message_index( $project_id ) {
    $url = sprintf( '%s?page=cpm_projects&tab=message&action=index&pid=%d', admin_url( 'admin.php' ), $project_id );

    return apply_filters( 'cpm_url_message_index', $url );
}

/**
 * ------------------------------------------------
 * Milestone URL Helpers
 * ------------------------------------------------
 */

function cpm_url_single_milestone( $project_id, $milestone_id ) {
    $url = sprintf( '%s?page=cpm_projects&tab=milestone&action=single&pid=%d&ml_id=%d', admin_url( 'admin.php' ), $project_id, $milestone_id );

    return apply_filters( 'cpm_url_single_milestone', $url );
}

/**
 * ------------------------------------------------
 * Misc
 * ------------------------------------------------
 */
function cpm_url_user( $user_id, $avatar = false, $size = 48 ) {
    $user = get_user_by( 'id', $user_id );
    $link = esc_url( add_query_arg( 'wp_http_referer', urlencode( stripslashes( $_SERVER['REQUEST_URI'] ) ), "user-edit.php?user_id=$user->ID" ) );
    $name = $user->display_name;

    if ( $avatar ) {
        $name = get_avatar( $user_id, $size, $user->display_name );
    }

    return sprintf( '<a href="%s">%s</a>', $link, $name );
}