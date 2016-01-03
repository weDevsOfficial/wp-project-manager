<?php
cpm_get_header( __( 'Milestones', 'cpm' ), $project_id );
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
}

?>

<div class="" id="cpm-milestone-page">
    <ul class="cpm-milestone-link">
        <li class="active"> <a href="#" class="cpm-late-milestone-link milestone-link" data-class="cpm-late-milestone"> <?php _e( 'Late Milestones', 'cpm' ); ?> </a> </li>
        <li class=""> <a href="#" class="cpm-upcomming-milestone-link milestone-link" data-class="cpm-upcomming-milestone"> <?php _e( 'Upcoming Milestones', 'cpm' ); ?>  </a> </li>
        <li class=""> <a href="#" class="cpm-complete-milestone-link milestone-link" data-class="cpm-complete-milestone"> <?php _e( 'Completed Milestones', 'cpm' ); ?>  </a> </li>
        <?php  if ( cpm_user_can_access( $project_id, 'create_milestone' ) ) {?>
        <li class=""> <a id="cpm-add-milestone" href="#" class="cpm-btn cpm-btn-blue cpm-plus-white "><?php _e( 'Add Milestone', 'cpm' ) ?></a> </li>
        <?php } ?>
        <div class="clearfix"></div>
    </ul>


<div class="cpm-milestone-details">

    <div class="cpm-new-milestone-form ">
        <?php
        if ( cpm_user_can_access( $project_id, 'create_milestone' ) ) {
            echo cpm_milestone_form( $project_id );
        }
        ?>
    </div>


    <div class="cpm-late-milestone cpm-milestone-data" style="display: blcok">
        <?php if ( $late_milestones ) { ?>
            <?php
            foreach ($late_milestones as $milestone) {
                cpm_show_milestone( $milestone, $project_id );
            }
        } else {
            cpm_show_message( __( 'No Late Milestone Found!', 'cpm' ) );
        } ?>
    </div>

    <div class="cpm-upcomming-milestone cpm-milestone-data" style="display: none">
         <?php if ( $upcoming_milestones ) { ?>


        <?php
        foreach ($upcoming_milestones as $milestone) {
            cpm_show_milestone( $milestone, $project_id );
        }
        } else {
             cpm_show_message( __( 'No Upcomming Milestone Found!', 'cpm' ) );
        } ?>
    </div>

    <div class="cpm-complete-milestone cpm-milestone-data" style="display: none">
        <?php if ( $completed_milestones ) { ?>


        <?php
        foreach ($completed_milestones as $milestone) {
            cpm_show_milestone( $milestone, $project_id );
        }
        }else {
            cpm_show_message( __( 'No Complete Milestone Found!', 'cpm' ) );
        } ?>


    </div>


</div>
</div>
