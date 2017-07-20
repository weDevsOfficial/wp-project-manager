<?php
$task_obj = CPM_Task::getInstance();
$list = $task_obj->get_task_list( $tasklist_id );
$task = $task_obj->get_task( $task_id );

if( $task->task_privacy == 'yes' && ! cpm_user_can_access( $project_id, 'todo_view_private' ) ) {
    echo '<h2>' . __( 'You do not have permission to access this page.', 'cpm' ) . '</h2>';
    return;
}

cpm_get_header( __( 'Task List', 'cpm' ), $project_id );
?>
<span class="cpm-breadcrumb">
    <?php _e( 'Task List', 'cpm' ) ?> &rarr;
    <a href="<?php echo cpm_url_single_tasklist( $project_id, $list->ID ); ?>"><?php echo get_the_title( $list->ID ); ?></a>
</span>

<div class="cpm-single-task cpm-todo">
    <?php echo cpm_task_html( $task, $project_id, $list->ID, true ); ?>
</div>

<h3 class="cpm-comment-title"><?php _e( 'Discuss this task', 'cpm' ); ?></h3>
<ul class="cpm-comment-wrap">
    <?php
    $comments = $task_obj->get_task_comments( $task_id );
    if ( $comments ) {

        $count = 0;
        foreach ($comments as $comment) {
            $class = ( $count % 2 == 0 ) ? 'even' : 'odd';
            echo cpm_show_comment( $comment, $project_id, $class );

            $count++;
        }
    }
    ?>
</ul>
<?php echo cpm_comment_form( $project_id, $task_id ); ?>