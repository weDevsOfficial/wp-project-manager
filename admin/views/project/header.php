<?php
require_once CPM_PLUGIN_PATH . '/class/project.php';

$project = new CPM_Project();
$detail = $project->get( $project_id );
if ( !$detail ) {
    echo '<h2>' . __( 'Error: Project not found', 'cpm' ) . '</h2>';
    return;
}
?>
<div id="icon-edit" class="icon32 icon32-posts-post"><br></div>
<h2>
    <?php _e( 'Project', 'cpm' ) ?> : <?php echo $detail->name; ?>
    <a href="<?php echo cpm_projects_url(); ?>" class="add-new-h2"><?php _e( 'All Projects', 'cpm' ) ?></a>
</h2>
<hr />

<?php echo $project->nav_menu( $project_id, $cpm_active_menu ); ?>
<script type="text/javascript">
    var cpm_nonce = '<?php echo wp_create_nonce('cpm_task'); ?>';
</script>