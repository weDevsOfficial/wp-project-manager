<?php

/**
 * This file contains all the shortcodes used by this plugin. Instead of using
 * static urls and other stuffs, shortcode was used for having a flexible way
 * for displaying these parts on frontend and admin panel as well.
 *
 * @since 0.1
 * @package CPM
 */

/**
 * Displays a users profile url
 *
 * @since 0.1
 * @param array $atts
 * @return string
 */
function cpm_sc_user_url( $atts ) {
    $atts = extract( shortcode_atts( array( 'id' => 0 ), $atts ) );

    return cpm_url_user( $id );
}

add_shortcode( 'cpm_user_url', 'cpm_sc_user_url' );

/**
 * Displays a single message url
 *
 * @since 0.1
 * @param array $atts
 * @return string
 */
function cpm_sc_message_url( $atts ) {
    $atts = extract( shortcode_atts( array(
        'id'      => 0,
        'project' => 0,
        'title'   => ''
                    ), $atts ) );

    $url = cpm_url_single_message( $project, $id );
    return sprintf( '<a href="%s">%s</a>', $url, $title );
}

add_shortcode( 'cpm_msg_url', 'cpm_sc_message_url' );

/**
 * Displays a task list url
 *
 * @since 0.1
 * @param array $atts
 * @return string
 */
function cpm_sc_tasklist_url( $atts ) {
    $atts = extract( shortcode_atts( array(
        'id'      => 0,
        'project' => 0,
        'title'   => ''
                    ), $atts ) );

    $url = cpm_url_single_tasklist( $project, $id );
    return sprintf( '<a href="%s">%s</a>', $url, $title );
}

add_shortcode( 'cpm_tasklist_url', 'cpm_sc_tasklist_url' );

/**
 * Displays a single task url
 *
 * @since 0.1
 * @param array $atts
 * @return string
 */
function cpm_sc_task_url( $atts ) {
    $atts = extract( shortcode_atts( array(
        'id'      => 0,
        'list'    => 0,
        'project' => 0,
        'title'   => ''
                    ), $atts ) );

    $url = cpm_url_single_task( $project, $list, $id );
    return sprintf( '<a href="%s">%s</a>', $url, $title );
}

add_shortcode( 'cpm_task_url', 'cpm_sc_task_url' );

/**
 * Displays a single comment url
 *
 * @since 0.1
 * @param array $atts
 * @return string
 */
function cpm_sc_comment_url( $atts ) {
    $atts = extract( shortcode_atts( array(
        'id'      => 0,
        'project' => 0,
                    ), $atts ) );

    $url = cpm_url_comment( $id, $project );

    if ( ! $url ) {
        return '<span class="cpm-strikethrough">' . __( 'discussion', 'cpm' ) . '</span>';
    }

    return sprintf( '<a href="%s">%s</a>', $url, __( 'discussion', 'cpm' ) );
}

add_shortcode( 'cpm_comment_url', 'cpm_sc_comment_url' );
