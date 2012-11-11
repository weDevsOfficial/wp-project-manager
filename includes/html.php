<?php
/**
 * HTML generator for single task
 *
 * @param object $task
 * @param int $project_id
 * @param int $list_id
 * @return string
 */
function cpm_task_html( $task, $project_id, $list_id ) {
    ob_start();
    ?>
    <div class="cpm-todo-wrap">
        <span class="cpm-todo-action">
            <a href="#" data-task_id="<?php echo $task->ID; ?>" data-confirm="<?php esc_attr_e( 'Are you sure to delete this to-do?', 'cpm' ); ?>" class="cpm-todo-delete">
                <?php _e( 'Delete', 'cpm' ); ?>
            </a>
            <?php if ( $task->completed != '1' ) { ?>
                <a href="#" class="cpm-todo-edit">Edit</a>
            <?php } ?>
        </span>

        <input type="checkbox" data-project="<?php echo $project_id; ?>" data-list="<?php echo $list_id; ?>"
               value="<?php echo $task->ID; ?>" name="" <?php checked( $task->completed, '1' ); ?>>

        <span class="cpm-todo-content">
            <a href="<?php echo cpm_url_single_task( $project_id, $list_id, $task->ID ); ?>">
                <span><?php echo $task->post_content; ?></span>
            </a>

            <?php if ( (int) $task->comment_count > 0 ) { ?>
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
                <?php echo cpm_task_new_form( $list_id, $project_id, $task ); ?>
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
function cpm_task_new_form( $list_id, $project_id, $task = null ) {
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
            <a class="todo-cancel" href="#"><?php _e( 'Cancel', 'cpm' ); ?></a>
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
            <a class="list-cancel" href="#"><?php _e( 'Cancel', 'cpm' ); ?></a>
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

            <h3><?php echo get_the_title( $list->ID ); ?></h3>

            <div class="cpm-entry-detail">
                <?php echo cpm_print_content( $list->post_content ); ?>
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