<?php
$task_obj = CPM_Task::getInstance();

if ( cpm_user_can_access( $project_id, 'tdolist_view_private' ) ) {
    $lists = $task_obj->get_task_lists( $project_id, true );
} else {
    $lists = $task_obj->get_task_lists( $project_id );
}

cpm_get_header( __( 'To-do List', 'cpm' ), $project_id );
?>

<h3 class="cpm-nav-title">
    <?php
    _e( 'To-do Lists', 'cpm' );
    
    if ( cpm_user_can_access( $project_id, 'create_todolist' ) ) {
        ?> 
        <a id="cpm-add-tasklist" href="#" class="add-new-h2"><?php _e( 'Add New To-do List', 'cpm' ) ?></a>
    <?php } ?>
</h2>

<div class="cpm-new-todolist-form">
    <?php echo cpm_tasklist_form( $project_id ); ?>
</div>

<ul class="cpm-todolists">
    <?php
    if ( $lists ) {

        foreach ($lists as $list) {
            ?>

            <li id="cpm-list-<?php echo $list->ID; ?>" data-id="<?php echo $list->ID; ?>">
                <?php echo cpm_task_list_html( $list, $project_id ); ?>
            </li>

            <?php
        }
    }
    ?>
</ul>

<?php
if ( !$lists ) {
    cpm_show_message( __( 'Oh dear, no To-do list found!', 'cpm' ) );
}