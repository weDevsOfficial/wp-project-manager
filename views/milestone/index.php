<?php cpm_get_header( __( 'Milestones', 'cpm' ), $project_id ); ?>

<h3 class="cpm-nav-title">
    <?php
    _e( 'Milestones', 'cpm' );
    
    if ( cpm_user_can_access( $project_id, 'create_milestone' ) ) {
        ?> 
        <a id="cpm-add-milestone" href="#" class="add-new-h2"><?php _e( 'Add Milestone', 'cpm' ) ?></a>
    <?php } ?>
</h3>

<?php
$milestone_obj = CPM_Milestone::getInstance();

if ( cpm_user_can_access( $project_id, 'milestone_view_private' ) ) {
    $milestones = $milestone_obj->get_by_project( $project_id, true );
} else {
    $milestones = $milestone_obj->get_by_project( $project_id );
}

$completed_milestones = array();
$late_milestones = array();
$upcoming_milestones = array();

if ( $milestones ) {
    foreach ($milestones as $milestone) {
        $due = strtotime( $milestone->due_date );
        $is_left = cpm_is_left( time(), $due );
        $milestone_completed = (int) $milestone->completed;

        if ( $milestone_completed ) {
            $completed_milestones[] = $milestone;
        } else if ( $is_left ) {
            $upcoming_milestones[] = $milestone;
        } else {
            $late_milestones[] = $milestone;
        }
    }
} else {
    cpm_show_message( __( 'No Milestone Found!', 'cpm' ) );
}
?>

<div class="cpm-new-milestone-form">
    <h3><?php _e( 'Add new milestone', 'cpm' ); ?></h3>

    <?php
    if ( cpm_user_can_access( $project_id, 'create_milestone' ) ) {
        echo cpm_milestone_form( $project_id );
    }
    ?>
</div>

<div class="cpm-milestones">
    <?php if ( $late_milestones ) { ?>

        <h3 class="title"><?php _e( 'Late Milestones', 'cpm' ); ?></h3>
        <?php
        foreach ($late_milestones as $milestone) {
            cpm_show_milestone( $milestone, $project_id );
        }
        ?>
    <?php } ?>

    <?php if ( $upcoming_milestones ) { ?>

        <h3 class="title"><?php _e( 'Upcoming Milestones', 'cpm' ); ?></h3>
        <?php
        foreach ($upcoming_milestones as $milestone) {
            cpm_show_milestone( $milestone, $project_id );
        }
        ?>
    <?php } ?>

    <?php if ( $completed_milestones ) { ?>

        <h3 class="title"><?php _e( 'Completed Milestones', 'cpm' ); ?></h3>
        <?php
        foreach ($completed_milestones as $milestone) {
            cpm_show_milestone( $milestone, $project_id );
        }
        ?>
    <?php } ?>
</div>