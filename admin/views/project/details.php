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
    <a href="<?php echo cpm_projects_url(); ?>" class="add-new-h2"><?php _e( 'All Projects', 'cpm' ) ?></a>
</h2>

<h2 class="nav-tab-wrapper">
    <?php echo $project->nav_menu( $project_id, $cpm_active_menu ); ?>
</h2>
<h3 class="cpm-nav-title">Project Details</h3>

<table>
    <tbody>
        <tr>
            <th><label><?php _e( 'Title', 'cpm' ) ?></label></th>
            <td><?php echo get_the_title( $project_id ); ?></td>
        </tr>
        <tr>
            <th><label><?php _e( 'Client', 'cpm' ) ?></label></th>
            <td>
                <?php
                $client = get_user_by( 'id', $project_detail->post_author );
                echo $client->display_name;
                ?>
            </td>
        </tr>
        <tr>
            <th><label><?php _e( 'Budget', 'cpm' ) ?></label></th>
            <td><?php echo $project_detail->budget; ?></td>
        </tr>
        <tr>
            <th><label><?php _e( 'Start Date', 'cpm' ) ?></label></th>
            <td>
                <?php
                $date = mysql2date( get_option( 'date_format' ), $project_detail->started );
                $abbr = date_i18n( 'Y/m/d g:i:s A', strtotime( $project_detail->started ) );
                printf( '<abbr title="%s">%s</abbr>', $abbr, $date );
                ?>
            </td>
        </tr>
        <tr>
            <th><label><?php _e( 'End Goal', 'cpm' ) ?></label></th>
            <td>
                <?php
                $date = mysql2date( get_option( 'date_format' ), $project_detail->ends );
                $abbr = date_i18n( 'Y/m/d g:i:s A', strtotime( $project_detail->ends ) );
                printf( '<abbr title="%s">%s</abbr>', $abbr, $date );
                ?>
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

<h3><?php _e( 'Description', 'cpm' ) ?></h3>
<div class="description">
    <?php echo stripslashes( $project_detail->post_content ); ?>
</div>

<h3>Milestones</h3>
<p>Upcoming and late milistones</p>

<h3>Recent Activities</h3>
<p>Events for my projects</p>