<?php
$task_obj = CPM_Task::getInstance();
$lists = $task_obj->get_task_lists( $project_id );

cpm_get_header( __( 'To-do List', 'cpm' ), $project_id );
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

            <li id="cpm-list-<?php echo $list->ID; ?>" data-id="<?php echo $list->ID; ?>"><?php echo cpm_task_list_html( $list, $project_id ); ?></li>

            <?php
        }
    }
    ?>
</ul>

<?php
if ( !$lists ) {
    cpm_show_message( __( 'Oh dear, no To-do list found!', 'cpm' ) );
}