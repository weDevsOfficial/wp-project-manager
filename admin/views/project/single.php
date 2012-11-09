<?php
/**
 * Project dashboard page
 *
 * TODO: Needs UI improvement other other short things fixed
 */
require_once CPM_PLUGIN_PATH . '/class/project.php';

$project = CPM_Project::getInstance();
$project_detail = $project->get( $project_id );

if ( !$project_detail ) {
    echo '<h2>' . __( 'Error: Project not found', 'cpm' ) . '</h2>';
    return;
}

$cpm_active_menu = __( 'Details', 'cpm' );
?>
<div id="icon-edit" class="icon32 icon32-posts-post"><br></div>
<h2>
    <?php _e( 'Project', 'cpm' ) ?> : <?php echo get_the_title( $project_id ); ?>
    <a href="<?php echo cpm_url_projects(); ?>" class="add-new-h2"><?php _e( 'All Projects', 'cpm' ) ?></a>
</h2>

<h2 class="nav-tab-wrapper">
    <?php echo $project->nav_menu( $project_id, $cpm_active_menu ); ?>
</h2>
<h3 class="cpm-nav-title">Project Details</h3>

<table class="cpm-table table-bordered">
    <tbody>
        <tr>
            <th><label><?php _e( 'Title', 'cpm' ) ?></label></th>
            <td><?php echo get_the_title( $project_id ); ?></td>
        </tr>
        <tr>
            <th><label><?php _e( 'Client', 'cpm' ) ?></label></th>
            <td>
                <?php echo cpm_url_user( $project_detail->post_author ); ?>
            </td>
        </tr>
        <tr>
            <th><label><?php _e( 'Budget', 'cpm' ) ?></label></th>
            <td><?php echo cpm_get_currency( $project_detail->budget ); ?></td>
        </tr>
        <tr>
            <th><label><?php _e( 'Start Date', 'cpm' ) ?></label></th>
            <td>
                <?php echo cpm_get_date( $project_detail->started ); ?>
            </td>
        </tr>
        <tr>
            <th><label><?php _e( 'End Goal', 'cpm' ) ?></label></th>
            <td>
                <?php echo cpm_get_date( $project_detail->ends ); ?>
            </td>
        </tr>
        <tr>
            <th><label><?php _e( 'Project Status', 'cpm' ) ?></label></th>
            <td><?php echo $project->get_status( $project_id ); ?></td>
        </tr>
        <tr>
            <th><label><?php _e( 'Billing Status', 'cpm' ) ?></label></th>
            <td><?php echo $project->get_bill_status( $project_id ); ?></td>
        </tr>
    </tbody>
</table>

<div class="cpm-single">
    <h3 class="cpm-entry-title"><?php _e( 'Description', 'cpm' ) ?></h3>

    <div class="cpm-entry-detail">
        <?php echo cpm_print_content( $project_detail->post_content ); ?>
    </div>
</div>

<h3><?php _e( 'Milestones', 'cpm' ); ?></h3>
<p>Upcoming and late milistones</p>

<h3><?php _e( 'Recent Activities', 'cpm' ); ?></h3>
<p>Events for my projects</p>