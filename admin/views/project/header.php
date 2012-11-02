<?php
require_once CPM_PLUGIN_PATH . '/class/project.php';
include_once CPM_PLUGIN_PATH . '/admin/views/tpl.php';

$project = CPM_Project::getInstance();
$project_detail = $project->get( $project_id );
if ( !$project_detail ) {
    echo '<h2>' . __( 'Error: Project not found', 'cpm' ) . '</h2>';
    return;
}
?>
<div id="icon-edit" class="icon32 icon32-posts-post"><br></div>
<h2>
    <?php _e( 'Project', 'cpm' ) ?> : <?php echo get_the_title( $project_id ); ?>
    <a href="<?php echo cpm_url_projects(); ?>" class="add-new-h2"><?php _e( 'All Projects', 'cpm' ) ?></a>
</h2>

<h2 class="nav-tab-wrapper">
    <?php echo $project->nav_menu( $project_id, $cpm_active_menu ); ?>
</h2>