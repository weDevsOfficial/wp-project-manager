
<?php
    wp_enqueue_script( 'cpm_task_list', plugins_url( '../../assets/js/task_list.js', __FILE__ ), array('jquery'), false, true );
?>

<?php
$task_obj = CPM_Task::getInstance();

if ( cpm_user_can_access( $project_id, 'tdolist_view_private' ) ) {
    $lists = $task_obj->get_task_lists( $project_id, true );
    $privacy =  'yes';
} else {
    $lists = $task_obj->get_task_lists( $project_id );
     $privacy =  'no';
}

cpm_get_header( __( 'To-do Lists', 'cpm' ), $project_id );

cpm_blank_template('todolist', $project_id) ;

echo "<div class='cpm-todo-formcontent'>";
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
    <div class="loadmoreanimation">
        <div class="load-spinner">
            <div class="rect1"></div>
            <div class="rect2"></div>
            <div class="rect3"></div>
            <div class="rect4"></div>
            <div class="rect5"></div>
      </div>
    </div>


    <a style="" class="cpm-btn cpm-btn-blue" href="JavaScript:void(0)" id="load_more_task" data-offset="<?php echo cpm_get_option( 'show_todo' )?>" data-privacy="<?php echo $privacy ; ?>" data-project-id="<?php echo $project_id?>" >Load More .. </a>
