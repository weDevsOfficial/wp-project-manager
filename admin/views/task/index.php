<?php
$cpm_active_menu = __( 'Task List', 'cpm' );

$task_obj = CPM_Task::getInstance();
$lists = $task_obj->get_task_lists( $project_id );

require_once CPM_PLUGIN_PATH . '/class/task.php';
require_once CPM_PLUGIN_PATH . '/admin/views/project/header.php';
?>

<h3 class="cpm-nav-title">
    <?php _e( 'Task Lists', 'cpm' ) ?> <a id="cpm-add-tasklist" href="#" class="add-new-h2"><?php _e( 'Add New Task List', 'cpm' ) ?></a>
</h2>

<div class="cpm-new-todolist-form">
    <?php echo cpm_tasklist_form( $project_id ); ?>
</div>

<ul class="cpm-todolists">
    <?php
    if ( $lists ) {
        foreach ($lists as $list) {
            ?>

            <li id="cpm-list-<?php echo $list->ID; ?>"><?php echo cpm_task_list_html( $list, $project_id ); ?></li>

            <?php
        }
    }
    ?>
</ul>

<?php
if ( !$lists ) {
    printf( '<h3>%s</h3>', __( 'No tasklist found', 'cpm' ) );
}
?>