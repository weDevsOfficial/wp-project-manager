<?php

function cpm_get_privacy( $value ) {
    return ($value == 0) ? __( 'Public', 'cpm' ) : __( 'Private', 'cpm' );
}

function cpm_tasks_filter( $tasks ) {
    $response = array(
        'completed' => array(),
        'pending' => array()
    );

    if ( $tasks ) {
        $response['pending'] = array_filter( $tasks, 'cpm_tasks_filter_pending' );
        $response['completed'] = array_filter( $tasks, 'cpm_tasks_filter_done' );
    }

    return $response;
}

function cpm_tasks_filter_done( $task ) {
    return $task->completed == '1';
}

function cpm_tasks_filter_pending( $task ) {
    return $task->completed != '1';
}

function cpm_dropdown_users( $selected = array() ) {

    $placeholder = __( 'Select co-workers', 'cpm' );
    $sel = ' selected="selected"';

    $users = get_users();
    $options = array();
    if ( $users ) {
        foreach ($users as $user) {
            $options[] = sprintf( '<option value="%s"%s>%s</option>', $user->ID, in_array( $user->ID, $selected ) ? $sel : '', $user->display_name );
        }
    }

    $dropdown = '<select name="project_coworker[]" id="project_coworker" placeholder="' . $placeholder . '" multiple="multiple">';
    $dropdown .= implode("\n", $options );
    $dropdown .= '</select>';

    return $dropdown;
}

function cpm_date2mysql( $date, $gmt = 0 ) {
    $time = strtotime( $date );
    return ( $gmt ) ? gmdate( 'Y-m-d H:i:s', $time ) : gmdate( 'Y-m-d H:i:s', ( $time + ( get_option( 'gmt_offset' ) * 3600 ) ) );
}

/**
 * Displays users as checkboxes from a project
 *
 * @param int $project_id
 */
function cpm_user_checkboxes( $project_id ) {
    $pro_obj = CPM_Project::getInstance();
    $users = $pro_obj->get_users( $project_id );
    $cur_user = get_current_user_id();

    //remove current logged in user from list
    if ( array_key_exists( $cur_user, $users ) ) {
        unset( $users[$cur_user] );
    }

    if ( $users ) {
        //var_dump( $users );
        foreach ($users as $user) {
            $check = sprintf( '<input type="checkbox" name="notify_user[]" id="cpm_notify_%1$s" value="%1$s" />', $user['id'] );
            printf( '<label for="cpm_notify_%d">%s %s</label> ', $user['id'], $check, $user['name'] );
        }
    } else {
        echo __( 'No users found', 'cpm' );
    }

    return $users;
}

/**
 * Comment form upload field helper
 *
 * @param int $id comment ID. used for unique edit comment form pickfile ID
 * @param array $files attached files
 */
function cpm_upload_field( $id, $files = array() ) {
    $id = $id ? '-' . $id : '';
    ?>
    <div id="cpm-upload-container<?php echo $id; ?>">
        <div class="cpm-upload-filelist">
            <?php if ( $files ) { ?>
                <?php foreach ($files as $file) {
                    $delete = sprintf( '<a href="#" data-id="%d" class="cpm-delete-file button">%s</a>', $file['id'], __( 'Delete File' ) );
                    $hidden = sprintf( '<input type="hidden" name="cpm_attachment[]" value="%d" />', $file['id'] );
                    $file_url = sprintf( '<a href="%1$s" target="_blank"><img src="%2$s" alt="%3$s" /></a>', $file['url'], $file['thumb'], esc_attr( $file['name'] ) );

                    $html = '<div class="cpm-uploaded-item">' . $file_url . ' ' . $delete . $hidden . '</div>';
                    echo $html;
                } ?>
            <?php } ?>
        </div>
        <?php printf( __('To attach, <a id="cpm-upload-pickfiles%s" href="#">select files</a> from your computer.', 'cpm' ), $id ); ?>
    </div>
    <?php
}

function cpm_get_currency( $amount = 0 ) {
    $currency = '$';

    return $currency . $amount;
}

function cpm_get_date( $date, $show_time = false ) {
    $date = strtotime( $date );

    if ( $show_time ) {
        $format = get_option( 'date_format' ) . ' ' . get_option( 'time_format' );
    } else {
        $format = get_option( 'date_format' );
    }

    $date_html = sprintf( '<time datetime="%1$s" title="%1$s">%2$s</time>', date( 'c', $date ), date_i18n( $format, $date ) );

    return apply_filters( 'cpm_get_date', $date_html, $date );
}

function cpm_show_errors( $errors ) {
    echo '<ul>';
    foreach ($errors as $msg) {
        printf( '<li>%s</li>', cpm_show_message( $msg, 'error' ) );
    }
    echo '</ul>';
}

/**
 * Show info messages
 *
 * @param string $msg message to show
 * @param string $type message type
 */
function cpm_show_message( $msg, $type = 'cpm-updated' ) {
    ?>
    <div class="<?php echo esc_attr( $type ); ?>">
        <p><strong><?php echo $msg; ?></strong></p>
    </div>
    <?php
}

function cpm_task_completeness( $total, $completed ) {
    //skipping vision by zero problem
    if ( $total < 1 ) {
        return;
    }

    $percentage = (100 * $completed) / $total;

    ob_start();
    ?>
    <div class="cpm-progress cpm-progress-info">
        <div style="width:<?php echo $percentage; ?>%" class="bar completed"></div>
        <div class="text"><?php printf( '%s: %d%% (%d of %d)', __( 'Completed', 'cpm' ), $percentage, $completed, $total ); ?></div>
    </div>
    <?php
    return ob_get_clean();
}

function cpm_is_left( $from, $to ) {
    $diff = $to - $from;

    if ( $diff > 0 ) {
        return true;
    }

    return false;
}

/**
 * The main logging function
 *
 * @uses error_log
 * @param string $type type of the error. e.g: debug, error, info
 * @param string $msg
 */
function cpm_log( $type = '', $msg = '' ) {
    if ( WP_DEBUG == true ) {
        $msg = sprintf( "[%s][%s] %s\n", date( 'd.m.Y h:i:s' ), $type, $msg );
        error_log( $msg, 3, dirname( __FILE__ ) . '/debug.log' );
    }
}

function cpm_get_number( $number ) {
    return number_format_i18n( $number );
}

function cpm_print_url( $link, $text ) {
    return sprintf( '<a href="%s">%s</a>', $link, $text );
}

function cpm_get_content( $content ) {
    $content = apply_filters( 'the_content', $content );
    $content = str_replace( ']]>', ']]&gt;', $content );

    return $content;
}

function cpm_get_header( $active_menu, $project_id = 0 ) {
    $cpm_active_menu = $active_menu;

    require_once CPM_PLUGIN_PATH . '/views/project/header.php';
}

function cpm_comment_text( $comment_ID = 0 ) {
    $comment = get_comment( $comment_ID );
    return apply_filters( 'comment_text', get_comment_text( $comment_ID ), $comment );
}

function cpm_excerpt( $text, $length, $append = '...' ) {
    $text = wp_strip_all_tags( $text, true );
    $count = mb_strlen( $text );
    $text = mb_substr( $text, 0, $length );

    if( $count > $length ) {
        $text = $text . $append;
    }

    return $text;
}

function cpm_data_attr( $values ) {

    $data = array();
    foreach ($values as $key => $val) {
        $data[] = sprintf( 'data-%s="%s"', $key, esc_attr( $val ) );
    }

    echo implode( ' ', $data );
}

function cpm_project_summary( $info ) {
    $info_array = array();

    if( $info->discussion ) {
        $info_array[] = sprintf( _n( '%d message', '%d messages', $info->discussion, 'cpm' ), $info->discussion );
    }

    if( $info->todolist ) {
        $info_array[] = sprintf( _n( '%d to-do list', '%d to-do lists', $info->todolist, 'cpm' ), $info->todolist );
    }

    if( $info->todos ) {
        $info_array[] = sprintf( _n( '%d to-do', '%d to-dos', $info->todos, 'cpm' ), $info->todos );
    }

    if( $info->comments ) {
        $info_array[] = sprintf( _n( '%d comment', '%d comments', $info->comments, 'cpm' ), $info->comments );
    }

    if( $info->files ) {
        $info_array[] = sprintf( _n( '%d file', '%d files', $info->files, 'cpm' ), $info->files );
    }

    if( $info->milestone ) {
        $info_array[] = sprintf( _n( '%d milestone', '%d milestones', $info->milestone, 'cpm' ), $info->milestone );
    }

    return implode(', ', $info_array );
}