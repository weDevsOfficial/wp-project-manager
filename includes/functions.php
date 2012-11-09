<?php

function cpm_get_privacy( $value ) {
    return ($value == 0) ? __( 'Public', 'cpm' ) : __( 'Private', 'cpm' );
}

function cpm_tasks_filter( $tasks ) {
    $response = array(
        'completed' => array(),
        'pending' => array()
    );

    if( $tasks ) {
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

function cpm_dropdown_users( $args = '' ) {
    $defaults = array(
        'show_option_all' => '', 'show_option_none' => '', 'hide_if_only_one_author' => '',
        'orderby' => 'display_name', 'order' => 'ASC',
        'include' => '', 'exclude' => '', 'multi' => 0,
        'show' => 'display_name', 'echo' => 1,
        'selected' => 0, 'name' => 'user', 'class' => '', 'id' => '',
        'blog_id' => $GLOBALS['blog_id'], 'who' => '', 'include_selected' => false,
        'role' => '', 'multiple' => false, 'disabled' => false
    );

    $defaults['selected'] = is_author() ? get_query_var( 'author' ) : 0;

    $r = wp_parse_args( $args, $defaults );
    extract( $r, EXTR_SKIP );

    $query_args = wp_array_slice_assoc( $r, array('blog_id', 'include', 'exclude', 'orderby', 'order', 'who', 'role') );
    $query_args['fields'] = array('ID', $show);
    $users = get_users( $query_args );

    $output = '';
    if ( !empty( $users ) && ( empty( $hide_if_only_one_author ) || count( $users ) > 1 ) ) {
        $name = esc_attr( $name );
        if ( $multi && !$id )
            $id = '';
        else
            $id = $id ? " id='" . esc_attr( $id ) . "'" : " id='$name'";

        if ( $multiple ) {
            $output = "<select name='{$name}'{$id} class='$class' multiple='multiple'>\n";
        } else if ( $disabled ) {
            $output = "<select name='{$name}'{$id} class='$class' disabled='disabled'>\n";
        } else {
            $output = "<select name='{$name}'{$id} class='$class'>\n";
        }

        if ( $show_option_all )
            $output .= "\t<option value='0'>$show_option_all</option>\n";

        if ( $show_option_none ) {
            $_selected = selected( -1, $selected, false );
            $output .= "\t<option value='-1'$_selected>$show_option_none</option>\n";
        }

        $found_selected = false;
        foreach ((array) $users as $user) {
            $user->ID = (int) $user->ID;
            $_selected = selected( $user->ID, $selected, false );
            if ( $_selected )
                $found_selected = true;
            $display = !empty( $user->$show ) ? $user->$show : '(' . $user->user_login . ')';
            $output .= "\t<option value='$user->ID'$_selected>" . esc_html( $display ) . "</option>\n";
        }

        if ( $include_selected && !$found_selected && ( $selected > 0 ) ) {
            $user = get_userdata( $selected );
            $_selected = selected( $user->ID, $selected, false );
            $display = !empty( $user->$show ) ? $user->$show : '(' . $user->user_login . ')';
            $output .= "\t<option value='$user->ID'$_selected>" . esc_html( $display ) . "</option>\n";
        }

        $output .= "</select>";
    }

    $output = apply_filters( 'wp_dropdown_users', $output );

    if ( $echo )
        echo $output;

    return $output;
}

function cpm_date2mysql( $date, $gmt = 0 ) {
    $time = strtotime( $date );
    return ( $gmt ) ? gmdate( 'Y-m-d H:i:s', $time ) : gmdate( 'Y-m-d H:i:s', ( $time + ( get_option( 'gmt_offset' ) * 3600 ) ) );
}

/**
 * Comment form
 *
 * @param int $object_id object id of the comment parent
 * @param string $type MESSAGE, TASK, TASK_LIST
 * @param type $privacy
 */
function cpm_comment_form( $project_id, $object_id, $privacy = true ) {
    ?>
    <form class="cpm-comment-form">

        <?php wp_nonce_field( 'cpm_new_message' ); ?>

        <fieldset>
            <legend><?php _e( 'Post Comment', 'cpm' ); ?></legend>

            <p>
                <textarea name="cpm_message" class="required" cols="55" rows="8" placeholder="<?php esc_attr_e( 'Enter your message', 'cpm' ); ?>"></textarea>
            </p>

            <?php if ( $privacy ) { ?>
                <p>
                    <label for="privacy"><?php _e( 'Privacy', 'cpm' ); ?>: </label>
                    <label><input type="radio" name="privacy" value="1" /> Yes</label>
                    <label><input type="radio" name="privacy" value="0" checked="checked" /> No</label>
                </p>
            <?php } ?>

            <fieldset>
                <legend>Attach Files</legend>
                <?php cpm_upload_field(); ?>
            </fieldset>

            <fieldset>
                <legend>Email Notification</legend>
                <?php cpm_user_checkboxes( $project_id ); ?>
            </fieldset>

            <p>
                <input type="hidden" name="action" value="cpm_new_comment" />
                <input type="hidden" name="parent_id" value="<?php echo $object_id; ?>" />
                <input type="hidden" name="project_id" value="<?php echo $project_id; ?>" />
                <input type="submit" class="button-primary" name="cpm_new_comment" value="<?php esc_attr_e( 'Add Comment', 'cpm' ); ?>" id="" />
            </p>

        </fieldset>
    </form>
    <?php
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

function cpm_upload_field() {
    ?>
    <div id="cpm-upload-container">
        <div id="cpm-upload-filelist"></div>
        <a id="cpm-upload-pickfiles" class="button" href="#">Select files</a>
    </div>
    <script type="text/javascript" src="<?php echo CPM_PLUGIN_URI . '/js/upload.js'; ?>"></script>
    <?php
}

function cpm_show_comment( $comment, $class = '' ) {
    $class = empty( $class ) ? '' : ' ' . $class;
    ?>
    <li class="cpm-comment<?php echo $class; ?>">
        <div class="cpm-avatar"><?php echo cpm_url_user( $comment->user_id, true ); ?></div>
        <div class="cpm-comment-container">
            <div class="cpm-comment-meta">
                <span class="cpm-author"><?php echo cpm_url_user( $comment->user_id ); ?></span>
                <span class="cpm-separator">|</span>
                <span class="cpm-date"><?php echo cpm_get_date( $comment->comment_date, true ); ?></span>
                <span class="cpm-separator">|</span>
                <span class="cpm-edit-link"><a href="#" class="cpm-edit-comment-link" data-id="<?php echo $comment->comment_ID; ?>"><?php _e( 'Edit', 'cpm' ); ?></a></span>
            </div>
            <div class="cpm-comment-content">
                <?php echo cpm_print_content( $comment->comment_content ); ?>

                <?php cpm_show_attachments( $comment ); ?>
            </div>
        </div>
    </li>
    <?php
}

function cpm_get_currency( $amount = 0 ) {
    $currency = '$';

    return $currency . $amount;
}

function cpm_get_date( $date, $show_time = false ) {
    $date = strtotime( $date );
    $abbr = date_i18n( 'Y/m/d g:i:s A', $date );

    if ( $show_time ) {
        $format = get_option( 'date_format' ) . ' ' . get_option( 'time_format' );
    } else {
        $format = get_option( 'date_format' );
    }

    $date_html = sprintf( '<abbr title="%s">%s</abbr>', $abbr, date_i18n( $format, $date ) );

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

function cpm_show_attachments( $object ) {
    if ( $object->files ) {
        ?>
        <ul class="cpm-attachments">
            <?php
            foreach ($object->files as $file) {
                printf( '<li><a href="%s" target="_blank"><img src="%s" /></a></li>', $file['url'], $file['thumb'] );
            }
            ?>
        </ul>
        <?php
    }
}

function cpm_get_number( $number ) {
    return number_format_i18n( $number );
}

function cpm_print_url( $link, $text ) {
    return sprintf( '<a href="%s">%s</a>', $link, $text );
}

function cpm_print_content( $content ) {
    $content = apply_filters('the_content', $content);
    $content = str_replace(']]>', ']]&gt;', $content);

    return $content;
}

function cpm_get_header( $active_menu, $project_id = 0 ) {
    $cpm_active_menu = $active_menu;

    require_once CPM_PLUGIN_PATH . '/admin/views/project/header.php';
}