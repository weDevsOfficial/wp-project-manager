<?php

function cpm_url_projects() {
    return sprintf( '%s?page=cpm_projects', admin_url( 'admin.php' ) );
}

function cpm_url_project_details( $project_id ) {
    $url = sprintf( '%s?page=cpm_projects&tab=project&action=single&pid=%d', admin_url( 'admin.php' ), $project_id );

    return apply_filters( 'cpm_url_project_details', $url );
}

function cpm_url_new_tasklist( $project_id ) {
    $url = sprintf( '%s?page=cpm_projects&tab=task&action=new&pid=%d', admin_url( 'admin.php' ), $project_id );

    return apply_filters( 'cpm_url_new_tasklislt', $url );
}

function cpm_url_single_tasklist( $project_id, $list_id ) {
    $url = sprintf( '%s?page=cpm_projects&tab=task&action=single&pid=%d&tl_id=%d', admin_url( 'admin.php' ), $project_id, $list_id );

    return apply_filters( 'cpm_url_single_tasklislt', $url );
}

function cpm_url_edit_tasklist( $project_id, $list_id ) {
    $url = sprintf( '%s?page=cpm_projects&tab=task&action=edit&pid=%d&tl_id=%d', admin_url( 'admin.php' ), $project_id, $list_id );

    return apply_filters( 'cpm_url_edit_tasklislt', $url );
}

function cpm_url_add_task( $project_id, $list_id ) {
    $url = sprintf( '%s?page=cpm_projects&tab=task&action=task_new&pid=%d&tl_id=%d', admin_url( 'admin.php' ), $project_id, $list_id );

    return apply_filters( 'cpm_url_add_task', $url );
}

function cpm_url_single_task( $project_id, $list_id, $task_id ) {
    $url = sprintf( '%s?page=cpm_projects&tab=task&action=task_single&pid=%d&tl_id=%d&task_id=%d', admin_url( 'admin.php' ), $project_id, $list_id, $task_id );

    return apply_filters( 'cpm_url_single_task', $url );
}

function cpm_url_edit_task( $project_id, $list_id, $task_id ) {
    $url = sprintf( '%s?page=cpm_projects&tab=task&action=task_edit&pid=%d&tl_id=%d&task_id=%d', admin_url( 'admin.php' ), $project_id, $list_id, $task_id );

    return apply_filters( 'cpm_url_edit_task', $url );
}

function cpm_url_single_message( $project_id, $message_id ) {
    $url = sprintf( '%s?page=cpm_projects&tab=message&action=single&pid=%d&mid=%d', admin_url( 'admin.php' ), $project_id, $message_id );

    return apply_filters( 'cpm_url_single_message', $url );
}

function cpm_url_new_message( $project_id ) {
    $url = sprintf( '%s?page=cpm_messages&tab=message&action=new&pid=%d', admin_url( 'admin.php' ), $project_id );

    return apply_filters( 'cpm_url_new_message', $url );
}

function cpm_msg_edit_url( $message_id ) {
    $url = sprintf( '%s?page=cpm_projects&tab=message&action=edit&mid=%d', admin_url( 'admin.php' ), $message_id );

    return apply_filters( 'cpm_msg_edit_url', $url );
}

function cpm_url_new_milestone( $project_id ) {
    $url = sprintf( '%s?page=cpm_projects&tab=milestone&action=new&pid=%d', admin_url( 'admin.php' ), $project_id );

    return apply_filters( 'cpm_url_new_milestone', $url );
}

function cpm_url_single_milestone( $project_id, $milestone_id ) {
    $url = sprintf( '%s?page=cpm_projects&tab=milestone&action=single&pid=%d&ml_id=%d', admin_url( 'admin.php' ), $project_id, $milestone_id );

    return apply_filters( 'cpm_url_single_milestone', $url );
}

function cpm_url_edit_milestone( $project_id, $milestone_id ) {
    $url = sprintf( '%s?page=cpm_projects&tab=milestone&action=edit&pid=%d&ml_id=%d', admin_url( 'admin.php' ), $project_id, $milestone_id );

    return apply_filters( 'cpm_url_edit_milestone', $url );
}

function cpm_get_privacy( $value ) {
    return ($value == 0) ? __( 'Public', 'cpm' ) : __( 'Private', 'cpm' );
}

function wedevs_dropdown_users( $args = '' ) {
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

function wedevs_date2mysql( $date, $gmt = 0 ) {
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
    <script type="text/javascript" src="<?php echo plugins_url( 'js/upload.js', __FILE__ ) ?>"></script>
    <?php
}

function cpm_show_comment( $comment ) {
    ?>
    <div class="cpm-comment">
        <div class="cpm-comment-meta">
            <span class="author">author: <?php echo $comment->comment_author; ?></span> |
            <span class="date">posted: <?php echo cpm_show_date( $comment->comment_date, true ); ?></span> |
            <a href="#" class="cpm-edit-comment-link" data-id="<?php echo $comment->comment_ID; ?>">Edit</a>
        </div>
        <div class="cpm-comment-container">
            <div class="cpm-comment-content">
                <?php echo $comment->comment_content; ?>
            </div>

            <?php if ( isset( $comment->files ) && count( $comment->files ) > 0 ) { ?>
                <div class="cpm-attachments">
                    <?php foreach ($comment->files as $file) { ?>
                        <div class="cpm-attachment">
                            <a href="<?php echo $file['url']; ?>" target="_blank">
                                <img src="<?php echo $file['thumb'] ?>" alt="<?php echo $file['name']; ?>" />
                            </a>
                        </div>
                    <?php } ?>
                </div>
            <?php } ?>
        </div>
    </div>
    <?php
}

function cpm_get_currency() {
    return '$';
}

function cpm_show_date( $date, $show_time = false ) {
    if ( $show_time ) {
        $full = mysql2date( get_option( 'date_format' ) . ' ' . get_option( 'time_format' ), $date );
    } else {
        $full = mysql2date( get_option( 'date_format' ), $date );
    }
    $abbr = date_i18n( 'Y/m/d g:i:s A', strtotime( $date ) );

    return sprintf( '<abbr title="%s">%s</abbr>', $abbr, $full );
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
        <p>Due Date: <?php echo cpm_show_date( $milestone->due_date ); ?></p>
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
                        (<?php echo cpm_show_date( $message->post_date, true ); ?> | <?php echo get_the_author_meta( 'display_name', $message->post_author ); ?>)
                    </li>
                <?php } ?>
            </ul>

        <?php } ?>

        <?php if ( $milestone_completed ) { ?>
            Completed on: <?php echo cpm_show_date( $milestone->completed_on, true ); ?>
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
 * Check if the file is a image
 *
 * @param string $file url of the file to check
 * @param string $mime mime type of the file
 * @return bool
 */
function cpm_is_file_image( $file, $mime ) {
    $ext = preg_match( '/\.([^.]+)$/', $file, $matches ) ? strtolower( $matches[1] ) : false;

    $image_exts = array('jpg', 'jpeg', 'gif', 'png');

    if ( 'image/' == substr( $mime, 0, 6 ) || $ext && 'import' == $mime && in_array( $ext, $image_exts ) ) {
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

/**
 * Log the mail to text file
 *
 * @uses `wp_mail` filter
 * @param array $mail
 */
function wedevs_mail_log( $mail ) {

    $message = "to: {$mail['to']} \nsub: {$mail['subject']}, \nmsg:{$mail['message']}";
    cpm_log( 'mail', $message );

    return $mail;
}

add_filter( 'wp_mail', 'wedevs_mail_log', 10 );