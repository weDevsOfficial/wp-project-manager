<?php
$cpm_active_menu = __( 'Task List', 'cpm' );

require_once CPM_PLUGIN_PATH . '/class/task.php';
require_once CPM_PLUGIN_PATH . '/admin/views/project/header.php';

$task_obj = new CPM_Task();
$list = $task_obj->get_task_list( $tasklist_id );
$task = $task_obj->get_task( $task_id );
?>
<h3 class="cpm-nav-title"><?php _e( 'Task List', 'cpm' ) ?> : <?php echo get_the_title( $list->ID ); ?></h3>

<div class="cpm-task-list">
    <?php $class = $task->completed == '0' ? 'open' : 'close'; ?>
    <div class="cpm-task <?php echo $class; ?>">
        <div class="task-detail">
            <?php echo stripslashes( $task->post_content ); ?>
        </div>
        <ul class="links">
            <li><a href="<?php echo cpm_url_edit_task( $project_id, $list->ID, $task->ID ); ?>">Edit</a></li>
            <li><a href="#">Delete</a></li>
            <li><a href="<?php echo cpm_url_single_task( $project_id, $list->ID, $task->ID ); ?>">View</a></li>
            <?php if ( $task->completed == '0' ) { ?>
                <li><a href="#" class="cpm-mark-task-complete" data-id="<?php echo esc_attr( $task->ID ); ?>">Mark Task as Completed</a></li>
            <?php } else { ?>
                <li><a href="#" class="cpm-mark-task-open" data-id="<?php echo esc_attr( $task->ID ); ?>">Mark Task as Open</a></li>
            <?php } ?>
        </ul>
    </div>
</div>

<h3>Comments:</h3>
<div class="cpm-comment-wrap">
    <?php
    $comments = $task_obj->get_task_comments( $task_id );
    if ( $comments ) {
        foreach ($comments as $comment) {
            cpm_show_comment( $comment );
        }
    }
    ?>
</div>
<?php cpm_comment_form( $project_id, $task_id, 'TASK' ); ?>