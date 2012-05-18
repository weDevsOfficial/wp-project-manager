<?php
$cpm_active_menu = __( 'Task List', 'cpm' );

require_once CPM_PLUGIN_PATH . '/class/task.php';
require_once CPM_PLUGIN_PATH . '/admin/views/project/header.php';
?>

<h2><?php _e( 'Task Lists', 'cpm' ) ?> <a id="cpm-add-task" href="<?php echo cpm_url_new_tasklist( $project_id ) ?>" class="add-new-h2"><?php _e( 'Add New Task List', 'cpm' ) ?></a></h2>

<?php
$task_obj = new CPM_Task();
$lists = $task_obj->get_task_lists( $project_id );

if ( $lists ) {
    foreach ($lists as $list) {
        ?>
        <div class="cpm-task-list">
            <div class="cpm-list-title">
                <h3 class="list-title cpm-left"><?php echo $list->name; ?></h3>

                <div class="cpm-right">
                    <?php
                    $complete = $task_obj->get_completeness( $list->id );
                    cpm_task_completeness( $complete->total, $complete->done );
                    ?>
                </div>
            </div>

            <div class="cpm-clear"></div>

            <p>Due date: <?php echo cpm_show_date( $list->due_date ); ?></p>
            <p><?php echo stripslashes( $list->description ); ?></p>

            <ul class="links">
                <li><a href="<?php echo cpm_url_edit_tasklist( $project_id, $list->id ); ?>">Edit</a></li>
                <li><a href="#">Delete</a></li>
                <li><a href="<?php echo cpm_url_add_task( $project_id, $list->id ); ?>">Add Task</a></li>
                <li><a href="<?php echo cpm_url_single_tasklist( $project_id, $list->id ); ?>">Comment (<?php echo $task_obj->get_comment_count( $list->id ); ?>)</a></li>
            </ul>

            <p><a class="button cpm-hide-tasks" href="#">Hide Tasks</a></p>

            <div class="cpm-tasks">
                <?php
                $tasks = $task_obj->get_tasks( $list->id );
                //var_dump( $tasks );
                if ( $tasks ) {
                    foreach ($tasks as $task) {
                        //var_dump( $task );
                        $class = $task->complete == '0' ? 'open' : 'close';
                        ?>
                        <div class="cpm-task <?php echo $class; ?>">
                            <div class="task-detail">
                                <?php echo stripslashes( $task->text ); ?>
                            </div>
                            <ul class="links">
                                <li><a href="<?php echo cpm_edit_task_url( $project_id, $list->id, $task->id ); ?>">Edit</a></li>
                                <li><a href="#" class="cpm-mark-task-delete" data-id="<?php echo esc_attr( $task->id ); ?>">Delete</a></li>
                                <li><a href="<?php echo cpm_single_task_url( $project_id, $list->id, $task->id ); ?>">View</a></li>
                                <?php if ( $task->complete == '0' ) { ?>
                                    <li><a href="#" class="cpm-mark-task-complete" data-id="<?php echo esc_attr( $task->id ); ?>">Mark Task as Completed</a></li>
                                <?php } else { ?>
                                    <li><a href="#" class="cpm-mark-task-open" data-id="<?php echo esc_attr( $task->id ); ?>">Mark Task as Open</a></li>
                                    <li><?php echo cpm_show_date( $task->completed_date ); ?></li>
                                <?php } ?>
                            </ul>
                        </div>
                        <?php
                    }
                }
                ?>
            </div>
        </div>
        <?php
    }
}