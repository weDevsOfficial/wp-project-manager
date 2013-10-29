<?php

/**
 * ------------------------------------------------
 * Project URL Helpers
 * ------------------------------------------------
 */

/**
 * Displays root URL for projects
 *
 * @since 0.1
 * @return string
 */
function cpm_url_projects() {
    return sprintf( '%s?page=cpm_projects', admin_url( 'admin.php' ) );
}

/**
 * Displays a single project URL
 *
 * @since 0.1
 * @param int $project_id
 * @return string
 */
function cpm_url_project_details( $project_id ) {
    $url = sprintf( '%s?page=cpm_projects&tab=project&action=single&pid=%d', admin_url( 'admin.php' ), $project_id );

    return apply_filters( 'cpm_url_project_details', $url, $project_id );
}

/**
 * ------------------------------------------------
 * Task/Tasklist URL Helpers
 * ------------------------------------------------
 */

/**
 * Task list listing url for a project
 *
 * @since 0.1
 * @param int $project_id
 * @return string
 */
function cpm_url_tasklist_index( $project_id ) {
    $url = sprintf( '%s?page=cpm_projects&tab=task&action=index&pid=%d', admin_url( 'admin.php' ), $project_id );

    return apply_filters( 'cpm_url_tasklist_index', $url, $project_id );
}

/**
 * Single task list URL
 *
 * @param int $project_id
 * @param int $list_id
 * @return string
 */
function cpm_url_single_tasklist( $project_id, $list_id ) {
    $url = sprintf( '%s?page=cpm_projects&tab=task&action=single&pid=%d&tl_id=%d', admin_url( 'admin.php' ), $project_id, $list_id );

    return apply_filters( 'cpm_url_single_tasklislt', $url, $project_id, $list_id );
}

/**
 * Single task URL
 *
 * @param int $project_id
 * @param int $list_id
 * @param int $task_id
 * @return string
 */
function cpm_url_single_task( $project_id, $list_id, $task_id ) {
    $url = sprintf( '%s?page=cpm_projects&tab=task&action=task_single&pid=%d&tl_id=%d&task_id=%d', admin_url( 'admin.php' ), $project_id, $list_id, $task_id );

    return apply_filters( 'cpm_url_single_task', $url, $project_id, $list_id, $task_id );
}

/**
 * ------------------------------------------------
 * Message URL Helpers
 * ------------------------------------------------
 */

/**
 * Single message URL
 *
 * @param int $project_id
 * @param int $message_id
 * @return string
 */
function cpm_url_single_message( $project_id, $message_id ) {
    $url = sprintf( '%s?page=cpm_projects&tab=message&action=single&pid=%d&mid=%d', admin_url( 'admin.php' ), $project_id, $message_id );

    return apply_filters( 'cpm_url_single_message', $url, $project_id, $message_id );
}

/**
 * Message index page URL for a project
 *
 * @param int $project_id
 * @return string
 */
function cpm_url_message_index( $project_id ) {
    $url = sprintf( '%s?page=cpm_projects&tab=message&action=index&pid=%d', admin_url( 'admin.php' ), $project_id );

    return apply_filters( 'cpm_url_message_index', $url, $project_id );
}

/**
 * ------------------------------------------------
 * Milestone URL Helpers
 * ------------------------------------------------
 */

/**
 * Milestone index page URL for a project
 *
 * @param int $project_id
 * @return string
 */
function cpm_url_milestone_index( $project_id ) {
    $url = sprintf( '%s?page=cpm_projects&tab=milestone&action=index&pid=%d', admin_url( 'admin.php' ), $project_id );

    return apply_filters( 'cpm_url_milestone_index', $url, $project_id );
}

/**
 * Milestone single page URL
 *
 * @param int $project_id
 * @param int $milestone_id
 * @return string
 */
function cpm_url_single_milestone( $project_id, $milestone_id ) {
    $url = sprintf( '%s?page=cpm_projects&tab=milestone&action=single&pid=%d&ml_id=%d', admin_url( 'admin.php' ), $project_id, $milestone_id );

    return apply_filters( 'cpm_url_single_milestone', $url, $project_id, $milestone_id );
}

/**
 * ------------------------------------------------
 * Misc
 * ------------------------------------------------
 */

/**
 * URL to user profile
 *
 * @param int $user_id
 * @param bool $avatar
 * @param int $size
 * @return string
 */
function cpm_url_user( $user_id, $avatar = false, $size = 48 ) {
    $user = get_user_by( 'id', $user_id );
    $link = esc_url( add_query_arg( 'wp_http_referer', urlencode( stripslashes( $_SERVER['REQUEST_URI'] ) ), "user-edit.php?user_id=$user->ID" ) );
    $name = $user->display_name;

    if ( $avatar ) {
        $name = get_avatar( $user_id, $size, $user->display_name );
    }

    $url = sprintf( '<a href="%s">%s</a>', $link, $name );

    return apply_filters( 'cpm_url_user', $url, $user, $link, $avatar, $size );
}

/**
 * Files index url for a project
 *
 * @param int $project_id
 * @return string
 */
function cpm_url_file_index( $project_id ) {
    $url = sprintf( '%s?page=cpm_projects&tab=files&action=index&pid=%d', admin_url( 'admin.php' ), $project_id );

    return apply_filters( 'cpm_url_file_index', $url, $project_id );
}

/**
 * Single comment URL
 *
 * @param int $comment_id
 * @param int $project_id
 * @return string
 */
function cpm_url_comment( $comment_id, $project_id ) {
    $comment = get_comment( $comment_id );

    if( !$comment ) {
        return false;
    }
    
    $post = get_post( $comment->comment_post_ID );
    $url = '';

    if ( !$post ) {
        return false;
    }

    if ( $post->post_type == 'message' ) {
        $url = cpm_url_single_message( $project_id, $post->ID );
    } else if ( $post->post_type == 'task_list' ) {
        $url = cpm_url_single_tasklist( $project_id, $post->ID );
    } else if ( $post->post_type == 'task' ) {
        $list = get_post( $post->post_parent );
        $url = cpm_url_single_task( $project_id, $list->ID, $post->ID );
    }

    $url = "$url#cpm-comment-$comment_id";

    return apply_filters( 'cpm_url_comment', $url, $comment_id, $project_id, $post->ID );
}