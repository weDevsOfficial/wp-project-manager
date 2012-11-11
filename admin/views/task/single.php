<?php
$cpm_active_menu = __( 'Task List', 'cpm' );

require_once CPM_PLUGIN_PATH . '/admin/views/project/header.php';

$task_obj = new CPM_Task();
$list = $task_obj->get_task_list( $tasklist_id );
?>
<h3 class="cpm-nav-title"><?php _e( 'Task List', 'cpm' ) ?> : <?php echo get_the_title( $list->ID ); ?></h3>

<ul class="cpm-todolists">
    <?php if ( $list ) { ?>
        <li id="cpm-list-<?php echo $list->ID; ?>"><?php echo cpm_task_list_html( $list, $project_id ); ?></li>
    <?php } ?>
</ul>

<h3><?php _e( 'Comments:', 'cpm' ); ?></h3>

<ul class="cpm-comment-wrap">
    <?php
    $comments = $task_obj->get_comments( $tasklist_id );
    if ( $comments ) {
        foreach ($comments as $comment) {
            cpm_show_comment( $comment );
        }
    }
    ?>
</ul>
<?php cpm_comment_form( $project_id, $tasklist_id ); ?>