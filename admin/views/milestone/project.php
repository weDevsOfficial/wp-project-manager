<?php
$cpm_active_menu = __( 'Milestones', 'cpm' );

require_once CPM_PLUGIN_PATH . '/admin/views/project/header.php';
?>

<h2><?php _e( 'Milestones', 'cpm' ) ?> <a id="cpm-add-milestone" href="<?php echo cpm_url_new_milestone( $project_id ) ?>" class="add-new-h2"><?php _e( 'Add Milestone', 'cpm' ) ?></a></h2>

<?php
$milestone_obj = new CPM_Milestone();
$milestones = $milestone_obj->get_by_project( $project_id );
?>

<?php if ( $milestones ) { ?>
    <div class="cpm-milestones">
        <?php
        foreach ($milestones as $milestone) {
            $due = strtotime( $milestone->due_date );
            $is_left = cpm_is_left( time(), $due );
            $class = ($is_left == true) ? 'left' : 'late';
            $string = ($is_left == true) ? __( 'left', 'cpm' ) : __( 'late', 'cpm' );
            ?>
            <div class="cpm-milestone <?php echo $class; ?>">
                <h3><a href="<?php echo cpm_url_single_milestone( $project_id, $milestone->id ); ?>"><?php echo stripslashes( $milestone->name ); ?></a> (<?php echo human_time_diff( time(), $due ) . ' ' . $string; ?>)</h3>
                <p>Due Date: <?php echo cpm_show_date( $milestone->due_date ); ?></p>
                <p><?php echo stripslashes( $milestone->description ); ?></p>

                <?php
                $tasks = $milestone_obj->get_tasklists( $milestone->id );
                $messages = $milestone_obj->get_messages( $milestone->id );
                if ( $tasks ) {
                    //var_dump( $tasks );
                    ?>
                    <h3>Task List</h3>
                    <?php foreach ($tasks as $task) { ?>
                        <li><a href="<?php echo cpm_url_single_tasklist( $project_id, $task->id ); ?>"><?php echo stripslashes( $task->name ); ?></a></li>
                    <?php } ?>

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
            </div>
        <?php } ?>
    </div>
    <?php
}?>