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
            <span class="cpm-project-title"><?php echo get_the_title( $project_id ); ?></span>

            <?php if ( cpm_user_can_access( $project_id ) ) { ?>
                <a href="#" class="cpm-icon-edit cpm-project-edit-link"><span class="dashicons dashicons-edit"></span> <span class="text"><?php _e( 'Edit', 'cpm' ); ?></span></a>
            <?php } ?>

            <div class="cpm-project-summary cpm-right">
                <span><?php _e( 'Project Info', 'cpm' ); ?></span>
                <div class="cpm-project-summary-content">
                    <?php echo cpm_project_summary( $project->info ); ?>
                </div>               

                <?php do_action( 'cpm_project_header', $project ); ?>
            </div>
        </h2>

        <div class="detail">
            <?php echo cpm_get_content( $project->post_content ); ?>
            <?php do_action( 'cpm_project_after_description', $project ); ?>
        </div>
    </div>

    <div class="cpm-edit-project" style="display:none;">
        <?php
         if ( cpm_user_can_access( $project_id ) ) {
            cpm_project_form( $project );
        }
        ?>
    </div>

    <div id="cpm-create-user-wrap" title="<?php _e( 'Create a new user', 'cpm' ); ?>">
        <?php

        if ( cpm_user_can_access( $project_id ) ) {
            cpm_user_create_form();
        }
        ?>
    </div>

   <!-- <div class="cpm-clear"></div> -->
    <?php do_action( 'cpm_inside_project_filter', $project ); ?>
   
</div>

<h2 class="nav-tab-wrapper">
    <?php echo $pro_obj->nav_menu( $project_id, $cpm_active_menu ); ?>
</h2>

<?php if ( cpm_user_can_access( $project_id ) ) {  ?>
    <script type="text/javascript">
        jQuery(function($) {
            $( "#cpm-create-user-wrap" ).dialog({
                autoOpen: false,
                modal: true,
                dialogClass: 'cpm-ui-dialog',
                width: 400,
                height: 353,
                position:['middle', 100]
            });
        })
    </script>
<?php } ?>