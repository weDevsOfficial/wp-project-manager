<?php
/**
 * Project dashboard page
 *
 */

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

<h1>Project activities will be placed here</h1>