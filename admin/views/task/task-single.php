<?php
$cpm_active_menu = __( 'Task List', 'cpm' );

require_once CPM_PLUGIN_PATH . '/admin/views/project/header.php';

$task_obj = CPM_Task::getInstance();
$list = $task_obj->get_task_list( $tasklist_id );
$task = $task_obj->get_task( $task_id );
?>
<h3 class="cpm-nav-title"><?php _e( 'Task List', 'cpm' ) ?> : <?php echo get_the_title( $list->ID ); ?></h3>

<div class="cpm-single-task">
    <?php echo cpm_task_html( $task, $list->ID, $project_id, true ); ?>
</div>

<h3>Comments:</h3>
<ul class="cpm-comment-wrap">
    <?php
    $comments = $task_obj->get_task_comments( $task_id );
    if ( $comments ) {
        foreach ($comments as $comment) {
            cpm_show_comment( $comment );
        }
    }
    ?>
</ul>
<?php cpm_comment_form( $project_id, $task_id ); ?>