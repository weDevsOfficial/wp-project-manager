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
    $project_home_url = sprintf( '%s?page=cpm_projects', admin_url( 'admin.php' ) );
    return apply_filters( 'cpm_project_list_url', $project_home_url );
}

function cpm_url_my_task() {
    if ( isset( $_GET['user_id'] ) && ! empty( $_GET['user_id'] ) ) {
        $url_arg = '&user_id=' . $_GET['user_id'];
    } else {
        $url_arg = '';
    }
    $url = sprintf( "%s?page=cpm_task%s", admin_url( 'admin.php' ), $url_arg );
    return apply_filters( 'cpm_url_my_task', $url );
}

function cpm_url_user_activity() {
    $url = add_query_arg( array( 'tab' => 'useractivity' ), cpm_url_my_task() );
    return apply_filters( 'cpm_url_user_activity', $url );
}

function cpm_url_current_task() {
    $url = add_query_arg( array( 'tab' => 'current' ), cpm_url_my_task() );
    return apply_filters( 'cpm_url_current_task', $url );
}

function cpm_url_outstanding_task() {
    $url = add_query_arg( array( 'tab' => 'outstanding' ), cpm_url_my_task() );
    return apply_filters( 'cpm_url_outstanding_task', $url );
}

function cpm_url_complete_task() {
    $url = add_query_arg( array( 'tab' => 'complete' ), cpm_url_my_task() );
    return apply_filters( 'cpm_url_complete_task', $url );
}

/**
 * Displays root URL for projects all
 *
 * @since 0.1
 * @return string
 */
function cpm_url_all() {
    $url = add_query_arg( array( 'status' => 'all' ), cpm_url_projects() );
    return apply_filters( 'cpm_url_all', $url );
}

/**
 * Displays root URL for projects archive
 *
 * @since 0.1
 * @return string
 */
function cpm_url_archive() {
    $url = add_query_arg( array( 'status' => 'archive' ), cpm_url_projects() );
    return apply_filters( 'cpm_url_archive', $url );
}

/**
 * Displays root URL for projects active
 *
 * @since 0.1
 * @return string
 */
function cpm_url_active() {
    $url = add_query_arg( array( 'status' => 'active' ), cpm_url_projects() );
    return apply_filters( 'cpm_url_active', $url );
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
 * Displays a single project Overview
 *
 * @since 1.3.8
 * @param int $project_id
 * @return string
 */
function cpm_url_project_overview( $project_id ) {
    $url = sprintf( '%s?page=cpm_projects&tab=project&action=overview&pid=%d', admin_url( 'admin.php' ), $project_id );
    return apply_filters( 'cpm_url_project_overview', $url, $project_id );
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
    $url = sprintf( '%s?page=cpm_projects&tab=task&action=single&pid=%d#/list/%d', admin_url( 'admin.php' ), $project_id, $list_id );

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
    $url = sprintf( '%s?page=cpm_projects&tab=task&action=task_single&pid=%d#/list/%d/task/%d', admin_url( 'admin.php' ), $project_id, $list_id, $task_id );

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
function cpm_url_user( $user_id, $avatar = false, $size = 48, $user = false ) {
    $user = absint( $user_id ) ? get_user_by( 'id', $user_id ) : get_user_by( 'email', $user_id );
    if ( $user ) {
        $user_id = $user->ID;
        $link    = add_query_arg( array( 'user_id' => $user_id ), admin_url( 'admin.php?page=cpm_task' ) );
        $name    = $user->display_name;

        if ( $avatar ) {
            $name = get_avatar( $user->user_email, $size, 'mm', $user->display_name, null );
        }

        $url = sprintf( '<a href="%s" title="%s">%s</a>', $link, $user->display_name, $name );

        return apply_filters( 'cpm_url_user', $url, $user, $link, $avatar, $size );
    }
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
 * Settings index url for a project
 *
 * @param int $project_id
 * @return string
 */
function cpm_url_settings_index( $project_id ) {
    $url = sprintf( '%s?page=cpm_projects&tab=settings&action=index&pid=%d', admin_url( 'admin.php' ), $project_id );

    return apply_filters( 'cpm_url_settings_index', $url, $project_id );
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

    if ( ! $comment ) {
        return false;
    }

    $post = get_post( $comment->comment_post_ID );
    $url  = '';

    if ( ! $post ) {
        return false;
    }

    if ( $post->post_type == 'cpm_message' ) {
        $url = cpm_url_single_message( $project_id, $post->ID );
    } else if ( $post->post_type == 'cpm_task_list' ) {
        $url = cpm_url_single_tasklist( $project_id, $post->ID );
    } else if ( $post->post_type == 'cpm_task' ) {
        $list = get_post( $post->post_parent );
        $url  = cpm_url_single_task( $project_id, $list->ID, $post->ID );
    }

    $url = "$url#cpm-comment-$comment_id";

    return apply_filters( 'cpm_url_comment', $url, $comment_id, $project_id, $post->ID );
}

/**
 * Report page URL
 *
 * @since 1.2
 * @return string
 */
function cpm_report_page_url() {
    $url = sprintf( '%s?page=cpm_reports', admin_url( 'admin.php' ) );

    return apply_filters( 'cpm_report_page_url', $url );
}
/**
 * Advance Search page url
 * @since 1.4.3
 * @return type
 */
function cpm_report_advancesearch_url() {
    $url = sprintf( '%s?page=cpm_reports&action=advancereport', admin_url( 'admin.php' ) );
    return apply_filters( 'cpm_report_advancesearch_url', $url );
}
