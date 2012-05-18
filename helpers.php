<?php

function cpm_projects_url() {
    return sprintf( '%s?page=cpm_projects', admin_url( 'admin.php' ) );
}

function cpm_project_details_url( $project_id ) {
    return sprintf( '%s?page=cpm_projects&action=details&pid=%d', admin_url( 'admin.php' ), $project_id );
}

function cpm_url_new_tasklist( $project_id ) {
    return sprintf( '%s?page=cpm_projects&action=task_list_create&pid=%d', admin_url( 'admin.php' ), $project_id );
}

function cpm_url_single_tasklist( $project_id, $list_id ) {
    return sprintf( '%s?page=cpm_projects&action=tasklist_single&pid=%d&tl_id=%d', admin_url( 'admin.php' ), $project_id, $list_id );
}

function cpm_url_edit_tasklist( $project_id, $list_id ) {
    return sprintf( '%s?page=cpm_projects&action=tasklist_edit&pid=%d&tl_id=%d', admin_url( 'admin.php' ), $project_id, $list_id );
}

function cpm_url_add_task( $project_id, $list_id ) {
    return sprintf( '%s?page=cpm_projects&action=task_add&pid=%d&tl_id=%d', admin_url( 'admin.php' ), $project_id, $list_id );
}

function cpm_single_task_url( $project_id, $list_id, $task_id ) {
    return sprintf( '%s?page=cpm_projects&action=task_view&pid=%d&tl_id=%d&task_id=%d', admin_url( 'admin.php' ), $project_id, $list_id, $task_id );
}

function cpm_edit_task_url( $project_id, $list_id, $task_id ) {
    return sprintf( '%s?page=cpm_projects&action=task_edit&pid=%d&tl_id=%d&task_id=%d', admin_url( 'admin.php' ), $project_id, $list_id, $task_id );
}

function cpm_url_single_message( $message_id ) {
    return sprintf( '%s?page=cpm_messages&action=single&mid=%d', admin_url( 'admin.php' ), $message_id );
}

function cpm_msg_edit_url( $message_id ) {
    return sprintf( '%s?page=cpm_messages&action=edit&mid=%d', admin_url( 'admin.php' ), $message_id );
}

function cpm_url_new_milestone( $project_id ) {
    return sprintf( '%s?page=cpm_projects&action=milestone_new&pid=%d', admin_url( 'admin.php' ), $project_id );
}

function cpm_url_single_milestone( $project_id, $milestone_id ) {
    return sprintf( '%s?page=cpm_projects&action=milestone_detail&pid=%d&ml_id=%d', admin_url( 'admin.php' ), $project_id, $milestone_id );
}

function cpm_url_edit_milestone( $project_id, $milestone_id ) {
    return sprintf( '%s?page=cpm_projects&action=milestone_edit&pid=%d&ml_id=%d', admin_url( 'admin.php' ), $project_id, $milestone_id );
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
        'role' => '', 'multiple' => false
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

function cpm_comment_form( $privacy = true ) {
    ?>
    <form action="" method="post" class="cpm-comment-form" enctype="multipart/form-data">

        <?php wp_nonce_field( 'cpm_new_message' ); ?>

        <fieldset>
            <legend><?php _e( 'Post Comment', 'cpm' ); ?></legend>

            <p>
                <textarea name="cpm_message" id="" cols="55" rows="8" placeholder="<?php esc_attr_e( 'Enter your message', 'cpm' ); ?>"></textarea>
            </p>

            <?php if ( $privacy ) { ?>
                <p>
                    <label for="privacy"><?php _e( 'Privacy', 'cpm' ); ?>: </label>
                    <input type="radio" name="privacy" value="1" id="" /> Yes
                    <input type="radio" name="privacy" value="0" id="" checked="checked" /> No
                </p>
            <?php } ?>

            <fieldset>
                <legend>Attach Files</legend>
                <p>
                    <input type="file" name="cpm_attachment" />
                </p>
            </fieldset>

            <p>
                <input type="submit" class="button-primary" name="cpm_new_comment" value="<?php esc_attr_e( 'Add Comment', 'cpm' ); ?>" id="" />
            </p>

        </fieldset>
    </form>
    <?php
}

function cpm_show_comment( $comment ) {
    $user = get_user_by( 'id', $comment->user_id );
    ?>
    <div class="cpm-comment">
        <div class="cpm-comment-meta">
            <span class="author">author: <?php echo $user->display_name; ?></span> |
            <span class="date">posted: <?php echo cpm_show_date( $comment->created, true ); ?></span>
        </div>
        <div class="cpm-comment-content">
            <?php echo $comment->text; ?>

            <?php if ( $comment->url ) { ?>
                <div class="cpm-attachment">
                    Attachment: <a href="<?php echo $comment->url; ?>" target="_blank"><?php echo $comment->name; ?></a>
                </div>
            <?php } ?>
        </div>
    </div>
    <?php
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
            <a href="<?php echo cpm_url_single_milestone( $project_id, $milestone->id ); ?>"><?php echo stripslashes( $milestone->name ); ?></a>
            <?php if ( !$milestone_completed ) { ?>
                (<?php echo human_time_diff( time(), $due ) . ' ' . $string; ?>)
            <?php } ?>
        </h3>
        <p>Due Date: <?php echo cpm_show_date( $milestone->due_date ); ?></p>
        <p><?php echo stripslashes( $milestone->description ); ?></p>

        <?php
        $tasks = $milestone_obj->get_tasklists( $milestone->id );
        $messages = $milestone_obj->get_messages( $milestone->id );
        if ( $tasks ) {
            //var_dump( $tasks );
            ?>
            <h3>Task List</h3>
            <ul>
                <?php foreach ($tasks as $task) { ?>
                    <li>
                        <a href="<?php echo cpm_url_single_tasklist( $project_id, $task->id ); ?>"><?php echo stripslashes( $task->name ); ?></a>
                        <div class="cpm-right">
                            <?php
                            $complete = $task_obj->get_completeness( $task->id );
                            cpm_task_completeness( $complete->total, $complete->done );
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
                        <a href="<?php echo cpm_url_single_message( $message->id ); ?>"><?php echo stripslashes( $message->title ); ?></a>
                        (<?php echo cpm_show_date( $message->created, true ); ?> | <?php echo get_the_author_meta( 'display_name', $message->author ); ?>)
                    </li>
                <?php } ?>
            </ul>

        <?php } ?>

        <?php if ( $milestone_completed ) { ?>
            Completed on: <?php echo cpm_show_date( $milestone->completed_on, true ); ?>
        <?php } ?>

        <ul class="cpm-links">
            <li><a href="<?php echo cpm_url_edit_milestone( $project_id, $milestone->id ); ?>">Edit</a></li>
            <li><a class="cpm-milestone-delete" data-id="<?php echo esc_attr( $milestone->id ); ?>" href="#">Delete</a></li>
            <?php if ( $milestone->completed == '0' ) { ?>
                <li><a class="cpm-milestone-complete" data-id="<?php echo esc_attr( $milestone->id ); ?>" href="#">Mark as complete</a></li>
            <?php } else { ?>
                <li><a class="cpm-milestone-open" data-id="<?php echo esc_attr( $milestone->id ); ?>" href="#">Reopen</a></li>
            <?php } ?>
        </ul>
    </div>
    <?php
}