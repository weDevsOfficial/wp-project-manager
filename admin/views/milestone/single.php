<?php
$cpm_active_menu = __( 'Milestones', 'cpm' );

require_once CPM_PLUGIN_PATH . '/admin/views/project/header.php';
?>

<h2><?php _e( 'Milestones', 'cpm' ) ?> <a id="cpm-add-milestone" href="<?php echo cpm_url_new_milestone( $project_id ) ?>" class="add-new-h2"><?php _e( 'Add Milestone', 'cpm' ) ?></a></h2>

<?php
$milestone_obj = CPM_Milestone::getInstance();
$task_obj = CPM_Task::getInstance();

$milestone = $milestone_obj->get( $milestone_id );

if ( $milestone ) {
    ?>
    <div class="cpm-milestones">
        <?php cpm_show_milestone( $milestone, $project_id ); ?>
    </div>
<?php } ?>
