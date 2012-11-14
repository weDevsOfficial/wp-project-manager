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

function cpm_dropdown_users( $args = array() ) {
    $args['echo'] = false;

    $placeholder = __( 'Select co-workers', 'cpm' );
    $dropdown = wp_dropdown_users( $args );
    $dropdown = str_replace( '<select ', '<select data-placeholder="' . $placeholder . '" multiple="multiple" ', $dropdown );
    
    echo $dropdown;
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
            printf( '<input type="checkbox" name="notify_user[]" id="cpm_notify_%1$d" value="%1$d" />', $user['id'] );
            printf( '<label for="cpm_notify_%d"> %s</label> ', $user['id'], $user['name'] );
        }
    } else {
        echo 'No users attached';
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
function cpm_show_message( $msg, $type = 'updated' ) {
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
    ?>
    <div class="cpm-progress cpm-progress-info">
        <div style="width:<?php echo $percentage; ?>%" class="bar completed"></div>
        <div class="text"><?php printf( '%s: %d%% (%d of %d)', __( 'Completed', 'cpm' ), $percentage, $completed, $total ); ?></div>
    </div>
    <?php
}

function cpm_is_left( $from, $to ) {
    $diff = $to - $from;

    if ( $diff > 0 ) {
        return true;
    }

    return false;
}

function cpm_show_milestone( $milestone, $project_id ) {
    $milestone_obj = CPM_Milestone::getInstance();
    $task_obj = CPM_Task::getInstance();

    $due = strtotime( $milestone->due_date );
    $is_left = cpm_is_left( time(), $due );
    $milestone_completed = (int) $milestone->completed;

    if ( $milestone_completed ) {
        $class = 'complete';
    } else {
        $class = ($is_left == true) ? 'left' : 'late';
    }
    $string = ($is_left == true) ? __( 'left', 'cpm' ) : __( 'late', 'cpm' );
    ?>
    <div class="cpm-milestone <?php echo $class; ?>">
        <h3>
            <a href="<?php echo cpm_url_single_milestone( $project_id, $milestone->ID ); ?>"><?php echo stripslashes( $milestone->post_title ); ?></a>
            <?php if ( !$milestone_completed ) { ?>
                (<?php echo human_time_diff( time(), $due ) . ' ' . $string; ?>)
            <?php } ?>
        </h3>
        <p>Due Date: <?php echo cpm_get_date( $milestone->due_date ); ?></p>
        <p><?php echo stripslashes( $milestone->post_content ); ?></p>

        <?php
        $tasks = $milestone_obj->get_tasklists( $milestone->ID );
        $messages = $milestone_obj->get_messages( $milestone->ID );
        if ( $tasks ) {
            //var_dump( $tasks );
            ?>
            <h3>Task List</h3>
            <ul>
                <?php foreach ($tasks as $task) { ?>
                    <li>
                        <a href="<?php echo cpm_url_single_tasklist( $project_id, $task->ID ); ?>"><?php echo stripslashes( $task->post_title ); ?></a>
                        <div class="cpm-right">
                            <?php
                            $complete = $task_obj->get_completeness( $task->ID );
                            cpm_task_completeness( $complete['total'], $complete['completed'] );
                            ?>
                        </div>
                        <div class="cpm-clear"></div>
                    </li>
                <?php } ?>
            </ul>

        <?php } ?>

        <?php
        if ( $messages ) {
            //var_dump( $messages );
            ?>
            <h3>Messages</h3>
            <ul>
                <?php foreach ($messages as $message) { ?>
                    <li>
                        <a href="<?php echo cpm_url_single_message( $project_id, $message->ID ); ?>"><?php echo stripslashes( $message->post_title ); ?></a>
                        (<?php echo cpm_get_date( $message->post_date, true ); ?> | <?php echo get_the_author_meta( 'display_name', $message->post_author ); ?>)
                    </li>
                <?php } ?>
            </ul>

        <?php } ?>

        <?php if ( $milestone_completed ) { ?>
            Completed on: <?php echo cpm_get_date( $milestone->completed_on, true ); ?>
        <?php } ?>

        <ul class="cpm-links">
            <li><a href="<?php echo cpm_url_edit_milestone( $project_id, $milestone->ID ); ?>">Edit</a></li>
            <li><a class="cpm-milestone-delete" data-id="<?php echo esc_attr( $milestone->ID ); ?>" href="#">Delete</a></li>
            <?php if ( $milestone->completed == '0' ) { ?>
                <li><a class="cpm-milestone-complete" data-id="<?php echo esc_attr( $milestone->ID ); ?>" href="#">Mark as complete</a></li>
            <?php } else { ?>
                <li><a class="cpm-milestone-open" data-id="<?php echo esc_attr( $milestone->ID ); ?>" href="#">Reopen</a></li>
            <?php } ?>
        </ul>
    </div>
    <?php
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

    require_once CPM_PLUGIN_PATH . '/admin/views/project/header.php';
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