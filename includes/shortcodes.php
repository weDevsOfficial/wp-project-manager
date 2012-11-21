<?php

function cpm_sc_user_url( $atts ) {
    $atts = extract( shortcode_atts( array('id' => 0), $atts ) );

    return cpm_url_user( $id );
}

add_shortcode( 'cpm_user_url', 'cpm_sc_user_url' );

function cpm_sc_message_url( $atts ) {
    $atts = extract( shortcode_atts( array(
        'id' => 0,
        'project' => 0,
        'title' => ''
    ), $atts ) );

    $url = cpm_url_single_message( $project, $id );
    return sprintf( '<a href="%s">%s</a>', $url, $title );
}

add_shortcode( 'cpm_msg_url', 'cpm_sc_message_url' );

function cpm_sc_tasklist_url( $atts ) {
    $atts = extract( shortcode_atts( array(
        'id' => 0,
        'project' => 0,
        'title' => ''
    ), $atts ) );

    $url = cpm_url_single_tasklist( $project, $id );
    return sprintf( '<a href="%s">%s</a>', $url, $title );
}

add_shortcode( 'cpm_tasklist_url', 'cpm_sc_tasklist_url' );

function cpm_sc_task_url( $atts ) {
    $atts = extract( shortcode_atts( array(
        'id' => 0,
        'list' => 0,
        'project' => 0,
        'title' => ''
    ), $atts ) );

    $url = cpm_url_single_task( $project, $list, $id );
    return sprintf( '<a href="%s">%s</a>', $url, $title );
}

add_shortcode( 'cpm_task_url', 'cpm_sc_task_url' );

function cpm_sc_comment_url( $atts ) {
    $atts = extract( shortcode_atts( array(
        'id' => 0,
        'project' => 0,
    ), $atts ) );

    $url = cpm_url_comment( $id, $project );

    if ( !$url ) {
        return '<span class="cpm-strikethrough">' . __( 'thread', 'cpm' ) . '</span>';
    }

    return sprintf( '<a href="%s">%s</a>', $url, __( 'thread', 'cpm' ) );
}

add_shortcode( 'cpm_comment_url', 'cpm_sc_comment_url' );