<?php

/**
 * HTML generator for single task
 *
 * @param object $task
 * @param int $project_id
 * @param int $list_id
 * @return string
 */
function cpm_task_html( $task, $project_id, $list_id, $single = false ) {
    $wrap_class = ( $task->completed == '1' ) ? 'cpm-task-complete' : 'cpm-task-uncomplete';

    ob_start();
    ?>
    <div class="cpm-todo-wrap <?php echo $wrap_class; ?>">
        <span class="cpm-todo-action">
            <a href="#" class="cpm-todo-delete cpm-icon-delete" <?php cpm_data_attr( array('single' => $single, 'list_id' => $list_id, 'project_id' => $project_id, 'task_id' => $task->ID, 'confirm' => __( 'Are you sure to delete this to-do?', 'cpm' ) ) ); ?>>
                <span><?php _e( 'Delete', 'cpm' ); ?></span>
            </a>

            <?php if ( $task->completed != '1' ) { ?>
                <a href="#" class="cpm-todo-edit cpm-icon-edit"><span><?php _e( 'Edit', 'cpm' ); ?></span></a>
            <?php } ?>
        </span>

        <input type="checkbox" <?php cpm_data_attr( array('single' => $single, 'list' => $list_id, 'project' => $project_id ) ); ?> value="<?php echo $task->ID; ?>" name="" <?php checked( $task->completed, '1' ); ?>>

        <span class="cpm-todo-content">
            <?php if ( $single ) { ?>
                <span class="cpm-todo-text"><?php echo $task->post_content; ?></span>
            <?php } else { ?>
                <a href="<?php echo cpm_url_single_task( $project_id, $list_id, $task->ID ); ?>">
                    <span class="cpm-todo-text"><?php echo $task->post_content; ?></span>
                </a>
            <?php } ?>

            <?php if ( (int) $task->comment_count > 0 && !$single ) { ?>
                <span class="cpm-comment-count">
                    <a href="<?php echo cpm_url_single_task( $project_id, $list_id, $task->ID ); ?>">
                        <?php printf( _n( __( '1 Comment', 'cpm' ), __( '%d Comments', 'cpm' ), $task->comment_count, 'cpm' ), $task->comment_count ); ?>
                    </a>
                </span>
            <?php } ?>

            <?php
            //if the task is completed, show completed by
            if ( $task->completed == '1' && $task->completed_by ) {
                $user = get_user_by( 'id', $task->completed_by );
                $completion_time = cpm_get_date( $task->completed_on, true );
                ?>
                <span class="cpm-completed-by">
                    <?php printf( __( '(Completed by %s on %s)', 'cpm' ), $user->display_name, $completion_time ) ?>
                </span>
            <?php } ?>

            <?php
            if ( $task->completed != '1' ) {
                if ( $task->assigned_to != '-1' ) {
                    $user = get_user_by( 'id', $task->assigned_to );
                    ?>
                    <span class="cpm-assigned-user"><?php echo $user->display_name; ?></span>
                <?php } ?>

                <?php if ( $task->due_date != '' ) { ?>
                    <span class="cpm-due-date">
                        <?php echo cpm_get_date( $task->due_date ); ?>
                    </span>
                    <?php
                }
            }
            ?>
        </span>

        <?php if ( $task->completed == '0' ) { ?>
            <div class="cpm-task-edit-form">
                <?php echo cpm_task_new_form( $list_id, $project_id, $task, $single ); ?>
            </div>
        <?php } ?>

    </div>

    <?php
    return ob_get_clean();
}

/**
 * HTML form generator for new/update task form
 *
 * @param int $list_id
 * @param int $project_id
 * @param null|object $task
 */
function cpm_task_new_form( $list_id, $project_id, $task = null, $single = false ) {
    $action = 'cpm_task_add';
    $task_content = $task_due = '';
    $assigned_to = '-1';
    $submit_button = __( 'Add this to-do', 'cpm' );

    //for update form
    if ( !is_null( $task ) ) {
        $action = 'cpm_task_update';
        $task_content = $task->post_content;
        $assigned_to = $task->assigned_to;
        $submit_button = __( 'Save Changes', 'cpm' );

        if ( $task->due_date != '' ) {
            $task_due = date( 'm/d/Y', strtotime( $task->due_date ) );
        }
    }
    ?>
    <form action="" method="post">
        <input type="hidden" name="list_id" value="<?php echo $list_id; ?>">
        <input type="hidden" name="project_id" value="<?php echo $project_id; ?>">
        <input type="hidden" name="action" value="<?php echo $action; ?>">
        <input type="hidden" name="single" value="<?php echo $single; ?>">
        <?php wp_nonce_field( $action ); ?>

        <?php if ( $task ) { ?>
            <input type="hidden" name="task_id" value="<?php echo $task->ID; ?>">
        <?php } ?>

        <div class="item content">
            <textarea name="task_text" class="todo_content" cols="40" placeholder="<?php esc_attr_e( 'Add a new to-do', 'cpm' ) ?>" rows="1"><?php echo esc_textarea( $task_content ); ?></textarea>
        </div>
        <div class="item date">
            <input type="text" autocomplete="off" class="datepicker" placeholder="<?php esc_attr_e( 'Due date', 'cpm' ); ?>" value="<?php echo esc_attr( $task_due ); ?>" name="task_due" />
        </div>
        <div class="item user">
            <?php wp_dropdown_users( array('name' => 'task_assign', 'show_option_none' => __( '-- assign to --', 'cpm' )) ); ?>
        </div>

        <?php do_action( 'cpm_task_new_form', $list_id, $project_id, $task ); ?>

        <div class="item submit">
            <input type="submit" class="button-primary" name="submit_todo" value="<?php echo esc_attr( $submit_button ); ?>">
            <a class="button todo-cancel" href="#"><?php _e( 'Cancel', 'cpm' ); ?></a>
        </div>
    </form>
    <?php
}

/**
 * HTML generator for new/edit tasklist form
 *
 * @param int $project_id
 * @param null|object $list
 * @return string
 */
function cpm_tasklist_form( $project_id, $list = null ) {
    $list_name = '';
    $list_detail = '';
    $action = 'cpm_add_list';
    $milestone = -1;
    $submit_button = __( 'Add List', 'cpm' );

    //for update form
    if ( $list ) {
        $list_name = $list->post_title;
        $list_detail = $list->post_content;
        $milestone = $list->milestone;
        $action = 'cpm_update_list';
        $submit_button = __( 'Update List', 'cpm' );
    }

    ob_start();
    ?>
    <form action="" method="post">
        <input type="hidden" name="project_id" value="<?php echo $project_id; ?>">
        <input type="hidden" name="action" value="<?php echo $action; ?>">
        <?php wp_nonce_field( $action ); ?>

        <?php if ( $list ) { ?>
            <input type="hidden" name="list_id" value="<?php echo $list->ID; ?>">
        <?php } ?>

        <div class="item title">
            <input type="text" name="tasklist_name" value="<?php echo esc_attr( $list_name ); ?>" placeholder="<?php esc_attr_e( 'Tasklist name', 'cpm' ); ?>">
        </div>

        <div class="item content">
            <textarea name="tasklist_detail" id="" cols="40" rows="2" placeholder="<?php esc_attr_e( 'Tasklist detail', 'cpm' ); ?>"><?php echo esc_textarea( $list_detail ); ?></textarea>
        </div>

        <div class="item milestone">
            <select name="tasklist_milestone" id="tasklist_milestone">
                <option selected="selected" value="-1"><?php _e( '-- milestone --', 'cpm' ); ?></option>
                <?php echo CPM_Milestone::getInstance()->get_dropdown( $project_id, $milestone ); ?>
            </select>
        </div>

        <?php do_action( 'cpm_tasklist_form', $project_id, $list ); ?>

        <div class="item submit">
            <input type="submit" class="button-primary" name="submit_todo" value="<?php echo esc_attr( $submit_button ); ?>">
            <a class="button list-cancel" href="#"><?php _e( 'Cancel', 'cpm' ); ?></a>
        </div>
    </form>
    <?php
    return ob_get_clean();
}

/**
 * HTML generator for a single tasklist
 *
 * @param object $list
 * @param int $project_id
 * @return string
 */
function cpm_task_list_html( $list, $project_id ) {
    $task_obj = CPM_Task::getInstance();

    ob_start();
    ?>
    <article class="cpm-todolist">
        <header class="cpm-list-header">
            <div class="cpm-list-actions">
                <a href="#" data-list_id="<?php echo $list->ID; ?>" data-confirm="<?php esc_attr_e( 'Are you sure to delete this to-do list?', 'cpm' ); ?>" class="cpm-list-delete">
                    <?php _e( 'Delete', 'cpm' ); ?>
                </a>
                <a href="#" class="cpm-list-edit"><?php _e( 'Edit', 'cpm' ); ?></a>
            </div>

            <h3><a href="<?php echo cpm_url_single_tasklist( $project_id, $list->ID ); ?>"><?php echo get_the_title( $list->ID ); ?></a></h3>

            <div class="cpm-entry-detail">
                <?php echo cpm_get_content( $list->post_content ); ?>
            </div>
        </header>
        <div class="cpm-list-edit-form">
            <?php echo cpm_tasklist_form( $project_id, $list ); ?>
        </div>

        <ul class="cpm-todos">
            <?php
            $tasks = $task_obj->get_tasks( $list->ID );
            $tasks = cpm_tasks_filter( $tasks );

            if ( $tasks['pending'] ) {
                foreach ($tasks['pending'] as $task) {
                    ?>
                    <li>
                        <?php echo cpm_task_html( $task, $project_id, $list->ID ); ?>
                    </li>
                    <?php
                }
            }
            ?>
        </ul>

        <ul class="cpm-todos-new">
            <li class="cpm-new-btn">
                <a href="#" class="cpm-btn add-task"><?php _e( 'Add a to-do', 'cpm' ); ?></a>
            </li>
            <li class="cpm-todo-form cpm-hide">
                <?php cpm_task_new_form( $list->ID, $project_id ); ?>
            </li>
        </ul>

        <ul class="cpm-todo-completed">
            <?php
            if ( $tasks['completed'] ) {
                foreach ($tasks['completed'] as $task) {
                    ?>
                    <li>
                        <?php echo cpm_task_html( $task, $project_id, $list->ID ); ?>
                    </li>
                    <?php
                }
            }
            ?>
        </ul>
    </article>
    <?php
    return ob_get_clean();
}

/**
 * Comment form
 *
 * @param int $object_id object id of the comment parent
 * @param string $type MESSAGE, TASK, TASK_LIST
 * @param type $privacy
 */
function cpm_comment_form( $project_id, $object_id = 0, $comment = null ) {
    $action = 'cpm_comment_new';
    $text = '';
    $submit_button = __( 'Add this comment', 'cpm' );
    $comment_id = $comment ? $comment->comment_ID : 0;
    $files = $comment ? $comment->files : array();

    if ( $comment ) {
        $action = 'cpm_comment_update';
        $text = $comment->comment_content;
        $submit_button = __( 'Update comment', 'cpm' );
    }

    ob_start();
    ?>
    <div class="cpm-comment-form-wrap">

        <?php if( !$comment ) { ?>
            <div class="cpm-avatar"><?php echo cpm_url_user( get_current_user_id(), true ); ?></div>
        <?php } ?>

        <form class="cpm-comment-form">

            <?php wp_nonce_field( 'cpm_new_message' ); ?>

            <div class="item message">
                <textarea name="cpm_message" class="required" cols="55" rows="8" placeholder="<?php esc_attr_e( 'Add a comment...', 'cpm' ); ?>"><?php echo esc_textarea( $text ); ?></textarea>
            </div>

            <div class="cpm-attachment-area">
                <?php cpm_upload_field( $comment_id, $files ); ?>
            </div>

            <div class="notify-users">
                <label class="notify"><?php _e( 'Notify users', 'cpm' ); ?></label>
                <?php cpm_user_checkboxes( $project_id ); ?>
            </div>

            <div class="submit">
                <input type="submit" class="button-primary" name="cpm_new_comment" value="<?php echo esc_attr( $submit_button ); ?>" id="" />

                <?php if( $comment ) { ?>
                    <input type="hidden" name="comment_id" value="<?php echo $comment->comment_ID; ?>" />
                    <a href="#" class="cpm-comment-edit-cancel button"><?php _e( 'Cancel', 'wedevs' ); ?></a>
                <?php } else { ?>
                    <input type="hidden" name="parent_id" value="<?php echo $object_id; ?>" />
                <?php } ?>

                <input type="hidden" name="project_id" value="<?php echo $project_id; ?>" />
                <input type="hidden" name="action" value="<?php echo $action; ?>" />
            </div>
        </form>
    </div>
    <?php

    return ob_get_clean();
}

function cpm_show_comment( $comment, $project_id, $class = '' ) {

    $class = empty( $class ) ? '' : ' ' . $class;

    ob_start();
    ?>
    <li class="cpm-comment<?php echo $class; ?>" id="cpm-comment-<?php echo $comment->comment_ID; ?>">
        <div class="cpm-avatar"><?php echo cpm_url_user( $comment->user_id, true ); ?></div>
        <div class="cpm-comment-container">
            <div class="cpm-comment-meta">
                <span class="cpm-author"><?php echo cpm_url_user( $comment->user_id ); ?></span>
                <span class="cpm-separator">|</span>
                <span class="cpm-date"><?php echo cpm_get_date( $comment->comment_date, true ); ?></span>

                <?php if( $comment->user_id == get_current_user_id() ) { ?>
                    <span class="cpm-separator">|</span>
                    <span class="cpm-edit-link">
                        <a href="#" class="cpm-edit-comment-link" <?php cpm_data_attr( array( 'comment_id' => $comment->comment_ID, 'project_id' => $project_id, 'object_id' => $comment->comment_post_ID ) ); ?>>
                            <span><?php _e( 'Edit', 'cpm' ); ?></span>
                        </a>
                    </span>
                    <span class="cpm-separator">|</span>
                    <span class="cpm-delete-link">
                        <a href="#" class="cpm-delete-comment-link" data-id="<?php echo $comment->comment_ID; ?>" data-confirm="<?php esc_attr_e( 'Are you sure to delete this comment?', 'cpm' ); ?>">
                            <span><?php _e( 'Delete', 'cpm' ); ?></span>
                        </a>
                    </span>
                <?php } ?>
            </div>
            <div class="cpm-comment-content">
                <?php echo comment_text( $comment->comment_ID ); ?>

                <?php echo cpm_show_attachments( $comment ); ?>
            </div>

            <div class="cpm-comment-edit-form"></div>
        </div>
    </li>
    <?php

    return ob_get_clean();
}

function cpm_show_attachments( $object ) {
    ob_start();

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

    return ob_get_clean();
}

function cpm_message_form( $project_id, $message = null ) {
    $title = $content = '';
    $submit = __( 'Add Message', 'cpm' );
    $files = array();
    $id = $milestone = 0;
    $action = 'cpm_message_new';

    if ( !is_null( $message ) ) {
        $id = $message->ID;
        $title = $message->post_title;
        $content = $message->post_content;
        $files = $message->files;
        $milestone = $message->milestone;
        $submit = __( 'Update Message', 'cpm' );
        $action = 'cpm_message_update';
    }

    ob_start();
    ?>

    <div class="cpm-message-form-wrap">
        <form class="cpm-message-form">

            <?php wp_nonce_field( 'cpm_message' ); ?>

            <div class="item title">
                <input name="message_title" type="text" id="message_title" value="<?php echo esc_attr( $title ); ?>" class="required" placeholder="<?php esc_attr_e( 'Enter message title', 'cpm' ); ?>">
            </div>

            <div class="item detail">
                <textarea name="message_detail" id="message_detail" cols="30" rows="4" placeholder="<?php esc_attr_e( 'Message deatils here', 'cpm' ); ?>"><?php echo esc_textarea( $content ); ?></textarea>
            </div>

            <div class="item milestone">
                <select name="milestone" id="milestone">
                    <option value="0"><?php _e( '-- milestone --', 'cpm' ) ?></option>
                    <?php echo CPM_Milestone::getInstance()->get_dropdown( $project_id, $milestone ); ?>
                </select>
            </div>

            <div class="cpm-attachment-area">
                <?php cpm_upload_field( $id, $files ); ?>
            </div>

            <div class="notify-users">
                <label class="notify"><?php _e( 'Notify users', 'cpm' ); ?></label>
                <?php cpm_user_checkboxes( $project_id ); ?>
            </div>

            <div class="submit">
                <input type="hidden" name="action" value="<?php echo $action; ?>" />
                <input type="hidden" name="project_id" value="<?php echo $project_id; ?>" />

                <?php if( $id ) { ?>
                    <input type="hidden" name="message_id" value="<?php echo $id; ?>" />
                <?php } ?>

                <input type="submit" name="create_message" id="create_message" class="button-primary" value="<?php echo esc_attr( $submit ); ?>">
                <a class="button message-cancel" href="#"><?php _e( 'Cancel', 'cpm' ); ?></a>
            </div>

        </form>
    </div>
    <?php

    return ob_get_clean();
}

function cpm_milestone_form( $project_id, $milestone = null ) {
    $title = $content = '';
    $submit = __( 'Add Milestone', 'cpm' );
    $id = 0;
    $due = '';
    $action = 'cpm_milestone_new';

    if ( !is_null( $milestone ) ) {
        $id = $milestone->ID;
        $title = $milestone->post_title;
        $content = $milestone->post_content;
        $submit = __( 'Update Milestone', 'cpm' );
        $action = 'cpm_milestone_update';

        if ( $milestone->due_date != '' ) {
            $due = date( 'm/d/Y', strtotime( $milestone->due_date ) );
        }
    }

    ob_start();
    ?>
    <div class="cpm-milestone-form-wrap">
        <form class="cpm-milestone-form">

            <?php wp_nonce_field( 'cpm_milesotne' ); ?>

            <div class="item milestone-title">
                <input name="milestone_name" class="required" type="text" id="milestone_name" value="<?php echo esc_attr( $title ); ?>" placeholder="<?php esc_attr_e( 'Milestone name', 'cpm' ); ?>">
            </div>

            <div class="item due">
                <input name="milestone_due" autocomplete="off" class="datepicker required" type="text" id="milestone_due" value="<?php echo esc_attr( $due ); ?>" placeholder="<?php esc_attr_e( 'Due date', 'cpm' ); ?>">
            </div>

            <div class="item detail">
                <textarea name="milestone_detail" id="milestone_detail" cols="30" rows="10" placeholder="<?php esc_attr_e( 'Details about milestone (optional)', 'cpm' ); ?>"><?php echo esc_textarea( $content ); ?></textarea>
            </div>

            <div class="submit">
                <input type="hidden" name="action" value="<?php echo $action; ?>" />
                <input type="hidden" name="project_id" value="<?php echo $project_id; ?>" />

                <?php if( $id ) { ?>
                    <input type="hidden" name="milestone_id" value="<?php echo $id; ?>" />
                <?php } ?>

                <input type="submit" name="create_milestone" id="create_milestone" class="button-primary" value="<?php echo esc_attr( $submit ); ?>">
                <a class="button milestone-cancel" href="#"><?php _e( 'Cancel', 'cpm' ); ?></a>
            </div>

        </form>
    </div>

    <?php
    return ob_get_clean();
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

        <div class="milestone-detail">
            <h3>
                <?php echo $milestone->post_title; ?>
                <?php if ( !$milestone_completed ) { ?>
                    <span class="time-left">(<?php printf( '%s %s - %s', human_time_diff( time(), $due ), $string, cpm_get_date( $milestone->due_date ) ); ?>)</span>
                <?php } ?>

                <ul class="cpm-links cpm-right">
                    <li>
                        <a class="cpm-icon-edit" <?php cpm_data_attr( array( 'id' => $milestone->ID, 'project_id' => $project_id ) ); ?> href="<?php echo cpm_url_edit_milestone( $project_id, $milestone->ID ); ?>" title="<?php esc_attr_e( 'Edit milestone', 'cpm' ); ?>"><span><?php _e( 'Edit', 'cpm' ); ?></span></a>
                    </li>
                    <li>
                        <a class="cpm-icon-delete cpm-milestone-delete" <?php cpm_data_attr( array( 'id' => $milestone->ID, 'confirm' => __( 'Are you sure?', 'cpm' ) ) ); ?> title="<?php esc_attr_e( 'Delete milestone', 'cpm' ); ?>" href="#"><span><?php _e( 'Delete', 'cpm' ); ?></span></a>
                    </li>
                    
                    <?php if ( $milestone->completed == '0' ) { ?>
                        <li><a class="cpm-icon-tick grey cpm-milestone-complete" data-id="<?php echo esc_attr( $milestone->ID ); ?>" title="<?php esc_attr_e( 'Mark as complete', 'cpm' ); ?>" href="#"><span><?php _e( 'Mark as complete', 'cpm' ); ?></span></a></li>
                    <?php } else { ?>
                        <li><a class="cpm-icon-tick green cpm-milestone-open" data-id="<?php echo esc_attr( $milestone->ID ); ?>" title="<?php esc_attr_e( 'Mark un-complete', 'cpm' ); ?>" href="#"><span><?php _e( 'Reopen', 'cpm' ); ?></span></a></li>
                    <?php } ?>
                </ul>
            </h3>

            <div class="detail">
                <?php echo cpm_get_content( $milestone->post_content ); ?></p>
            </div>
        </div>

        <div class="cpm-milestone-edit-form"></div>

        <?php
        $tasks = $milestone_obj->get_tasklists( $milestone->ID );
        $messages = $milestone_obj->get_messages( $milestone->ID );
        if ( $tasks ) {
            ?>
            <h3><?php _e( 'To-do List', 'cpm' ); ?></h3>

            <ul class="dash">
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
            ?>
            <h3><?php _e( 'Messages', 'cpm' ); ?></h3>

            <ul class="dash">
                <?php foreach ($messages as $message) { ?>
                    <li>
                        <a href="<?php echo cpm_url_single_message( $project_id, $message->ID ); ?>"><?php echo stripslashes( $message->post_title ); ?></a>
                        (<?php echo cpm_get_date( $message->post_date, true ); ?> | <?php echo get_the_author_meta( 'display_name', $message->post_author ); ?>)
                    </li>
                <?php } ?>
            </ul>

        <?php } ?>

        <?php if ( $milestone_completed ) { ?>
            <span class="cpm-milestone-completed">
                <?php _e( 'Completed on:', 'cpm' ); ?> <?php echo cpm_get_date( $milestone->completed_on, true ); ?>
            </span>
        <?php } ?>
    </div>
    <?php
}