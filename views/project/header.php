<?php
$pro_obj = CPM_Project::getInstance();
$project = $pro_obj->get( $project_id );

if ( !$project ) {
    echo '<h2>' . __( 'Error: Project not found', 'cpm' ) . '</h2>';
    die();
}
?>
<div class="cpm-project-head">
    <div class="cpm-project-detail">
        <h2>
            <span><?php echo get_the_title( $project_id ); ?></span>
            <a href="#" class="cpm-icon-edit cpm-project-edit-link"><span><?php _e( 'Edit', 'cpm' ); ?></span></a>

            <div class="cpm-project-summary cpm-right">
                <span><?php _e( 'Project Info', 'cpm' ); ?></span>
                <?php echo cpm_project_summary( $project->info ); ?>
            </div>
        </h2>

        <div class="detail">
            <?php echo cpm_get_content( $project->post_content ); ?>
        </div>
    </div>

    <div class="cpm-edit-project">
        <?php cpm_project_form( $project ); ?>
    </div>

    <div class="cpm-clear"></div>
</div>

<h2 class="nav-tab-wrapper">
    <?php echo $pro_obj->nav_menu( $project_id, $cpm_active_menu ); ?>
</h2>