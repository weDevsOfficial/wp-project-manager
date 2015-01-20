<?php
$pro_obj = CPM_Project::getInstance();
$project = $pro_obj->get( $project_id );

if ( !$project ) {
    echo '<h2>' . __( 'Error: Project not found', 'cpm' ) . '</h2>';
    die();
}

if ( !$pro_obj->has_permission( $project ) ) {
    echo '<h2>' . __( 'Error: Permission denied', 'cpm' ) . '</h2>';
    die();
}
?>
<div class="cpm-project-head">
    <div class="cpm-project-detail">
        <h2>
            <span><?php echo get_the_title( $project_id ); ?></span>

            <?php if ( $pro_obj->has_admin_rights() ) { ?>
                <a href="#" class="cpm-icon-edit cpm-project-edit-link"><span><?php _e( 'Edit', 'cpm' ); ?></span></a>
            <?php } ?>

            <div class="cpm-project-summary cpm-right">
                <span><?php _e( 'Project Info', 'cpm' ); ?></span>
                <?php echo cpm_project_summary( $project->info ); ?>
                
                <?php do_action( 'cpm_project_header', $project ); ?>
            </div>
        </h2>

        <div class="detail">
            <?php echo cpm_get_content( $project->post_content ); ?>
            
            <?php do_action( 'cpm_project_after_description', $project ); ?>
        </div>
    </div>

    <div class="cpm-edit-project">
        <?php
        if ( $pro_obj->has_admin_rights() ) {
            cpm_project_form( $project );
        }
        ?>
    </div>

    <div class="cpm-clear"></div>
</div>

<h2 class="nav-tab-wrapper">
    <?php echo $pro_obj->nav_menu( $project_id, $cpm_active_menu ); ?>
</h2>