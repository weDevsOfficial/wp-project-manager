<?php
$task_obj = CPM_Task::getInstance();

if ( cpm_user_can_access( $project_id, 'tdolist_view_private' ) ) {
    $lists = $task_obj->get_task_lists( $project_id, true );
} else {
    $lists = $task_obj->get_task_lists( $project_id );
}

cpm_get_header( __( 'To-do Lists', 'cpm' ), $project_id );


if ( cpm_user_can_access( $project_id, 'create_todolist' ) ) {
    ?>
    <a id="cpm-add-tasklist" href="#" class="cpm-btn cpm-btn-blue cpm-plus-white cpm-margin-bottom add-tasklist"><?php _e( 'Add New To-do List', 'cpm' ) ?></a>
<?php } ?>


<div class="cpm-new-todolist-form">
    <?php  echo cpm_tasklist_form( $project_id ); ?>
</div>

<ul class="cpm-todolists" >
    <?php
    if ( $lists ) {

        foreach ($lists as $list) {
            ?>

    <li id="cpm-list-<?php echo $list->ID; ?>" data-id="<?php echo $list->ID; ?>" >
                <?php echo cpm_task_list_html( $list, $project_id, false ); ?>
            </li>

            <?php
        }
    }
    ?>
</ul>

<?php
if ( !$lists ) {
    cpm_show_message( __( 'No To-do list found!', 'cpm' ) );
}