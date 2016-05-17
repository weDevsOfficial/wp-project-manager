<?php
cpm_get_header( __( 'Milestones', 'cpm' ), $project_id );
$milestone_obj = CPM_Milestone::getInstance();

if ( cpm_user_can_access( $project_id, 'milestone_view_private' ) ) {
    $milestones = $milestone_obj->get_by_project( $project_id, true );
} else {
    $milestones = $milestone_obj->get_by_project( $project_id );
}

$completed_milestones = array();
$late_milestones      = array();
$upcoming_milestones  = array();

if ( $milestones ) {
    foreach ($milestones as $milestone) {
        $due                 = strtotime( $milestone->due_date );
        $is_left             = cpm_is_left( time(), $due );
        $milestone_completed = (int) $milestone->completed;

        if ( $milestone_completed ) {
            $completed_milestones[] = $milestone;
        } else if ( $is_left ) {
            $upcoming_milestones[] = $milestone;
        } else {
            $late_milestones[] = $milestone;
        }
    }
}

?>

<div class="" id="cpm-milestone-page">

      <div class="cpm-milestone-details">
            <?php
    if ( $milestones ) {
    if ( cpm_user_can_access( $project_id, 'create_milestone' ) ) {?>
        <div class="cpm-milestone-link clearfix">
            <a id="cpm-add-milestone" href="#" class="cpm-btn cpm-btn-blue cpm-plus-white"><?php _e( 'Add Milestone', 'cpm' ) ?></a>
        </div>
    <?php }   ?>
        <div class="cpm-new-milestone-form ">
            <?php
            if ( cpm_user_can_access( $project_id, 'create_milestone' ) ) {
                echo cpm_milestone_form( $project_id );
            }
            ?>
        </div>


    <?php } if ( $late_milestones ) { ?>
            <div class="cpm-late-milestone cpm-milestone-data" >
                <h2 class="group-title"><?php _e( 'Late Milestones', 'cpm' ); ?></h2>

                <?php
                foreach ($late_milestones as $milestone) {
                    cpm_show_milestone( $milestone, $project_id );
                }
                ?>
            </div>
        <?php } ?>

        <?php if ( $upcoming_milestones ) { ?>
            <div class="cpm-upcomming-milestone cpm-milestone-data" >
                <h2 class="group-title"><?php _e( 'Upcoming Milestones', 'cpm' ); ?></h2>

                <?php
                foreach ($upcoming_milestones as $milestone) {
                    cpm_show_milestone( $milestone, $project_id );
                }
                ?>
            </div>
        <?php } ?>

        <?php if ( $completed_milestones ) { ?>
            <div class="cpm-complete-milestone cpm-milestone-data" >
                <h2 class="group-title"><?php _e( 'Completed Milestones', 'cpm' ); ?></h2>

                <?php
                $cm = array() ;
                foreach ($completed_milestones as $milestone) {
                    $cm[$milestone->completed_on] = $milestone ;
                }
                krsort($cm) ;
                foreach ($cm as $milestone){
                     cpm_show_milestone( $milestone, $project_id );
                }
                ?>
            </div>
        <?php } ?>
    </div>
</div>
<?php
    cpm_blank_template('milestone', $project_id) ;

?>