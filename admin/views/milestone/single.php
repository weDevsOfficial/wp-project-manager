<?php
$cpm_active_menu = __( 'Milestones', 'cpm' );

require_once CPM_PLUGIN_PATH . '/admin/views/project/header.php';
?>

<h2><?php _e( 'Milestones', 'cpm' ) ?> <a id="cpm-add-milestone" href="<?php echo cpm_url_new_milestone( $project_id ) ?>" class="add-new-h2"><?php _e( 'Add Milestone', 'cpm' ) ?></a></h2>

<?php
$milestone_obj = new CPM_Milestone();
$milestone = $milestone_obj->get( $milestone_id );

if ( $milestone ) {
    $due = strtotime( $milestone->due_date );
    $is_left = cpm_is_left( time(), $due );
    $class = ($is_left == true) ? 'left' : 'late';
    $string = ($is_left == true) ? __( 'left', 'cpm' ) : __( 'late', 'cpm' );
    ?>

    <div class="cpm-milestones">
        <div class="cpm-milestone <?php echo $class; ?>">
            <h3><a href="<?php echo cpm_url_single_milestone( $project_id, $milestone->id ); ?>"><?php echo stripslashes( $milestone->name ); ?></a> (<?php echo human_time_diff( time(), $due ) . ' ' . $string; ?>)</h3>
            <p>Due Date: <?php echo cpm_show_date( $milestone->due_date ); ?></p>
            <p><?php echo stripslashes( $milestone->description ); ?></p>

            <?php
            $tasks = $milestone_obj->get_tasklists( $milestone->id );
            $messages = $milestone_obj->get_messages( $milestone->id );
            $task_obj = new CPM_Task();
            if ( $tasks ) {
                //var_dump( $tasks );
                ?>
                <h3>Task List</h3>
                <ul>
                    <?php foreach ($tasks as $task) { ?>
                        <li>
                            <a href="<?php echo cpm_url_single_tasklist( $project_id, $task->id ); ?>"><?php echo stripslashes( $task->name ); ?></a>
                            <div class="cpm-right">
                                <?php
                                $complete = $task_obj->get_completeness( $task->id );
                                cpm_task_completeness( $complete->total, $complete->done );
                                ?>
                            </div>
                            <div class="cpm-clear"></div>
                        </li>
                    <?php } ?>
                </ul>
            <?php } ?>

            <?php
            if ( $messages ) {
                //var_dump( $messages );
                ?>
                <h3>Messages</h3>
                <?php foreach ($messages as $message) { ?>
                    <li><a href="<?php echo cpm_url_single_message( $message->id ); ?>"><?php echo stripslashes( $message->title ); ?></a></li>
                <?php } ?>

            <?php } ?>

            <ul class="cpm-links">
                <li><a href="<?php echo cpm_url_edit_milestone( $project_id, $milestone_id ); ?>">Edit</a></li>
                <li><a class="cpm-milestone-delete" data-id="<?php echo esc_attr( $milestone_id ); ?>" href="#">Delete</a></li>
                <li><a class="cpm-milestone-complete" data-id="<?php echo esc_attr( $milestone_id ); ?>" href="#">Mark as complete</a></li>
            </ul>
        </div>
    </div>
<?php } ?>
