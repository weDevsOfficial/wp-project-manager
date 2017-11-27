<?php
$pro_obj    = CPM_Project::getInstance();
$project    = $pro_obj->get( $project_id );
$can_manage = cpm_can_create_projects(); //cpm_user_can_delete_edit( $project_id, $project );

if ( !$project ) {
    echo '<h2>' . __( 'Error: Project not found', 'cpm' ) . '</h2>';
    die();
}

if ( ! $pro_obj->has_permission( $project ) ) {
    echo '<h2>' . __( 'Error: Permission denied', 'cpm' ) . '</h2>';
    die();
}
?>
<h2 style="margin:0; padding: 0;"></h2>
<div class="cpm-top-bar cpm-no-padding cpm-project-header cpm-project-head">

    <div class="cpm-row cpm-no-padding cpm-border-bottom">

        <div class="cpm-col-6 cpm-project-detail">
            <h3><span class="cpm-project-title"> <?php echo get_the_title( $project_id ); ?> </span>
                <?php if ( $can_manage ) { ?>
                    <a href="#" class="cpm-icon-edit cpm-project-edit-link small-text"><span class="dashicons dashicons-edit"></span> <span class="text"><?php _e( 'Edit', 'cpm' ); ?></span></a>
                <?php } ?>
            </h3>

            <div class="detail">
                <?php echo cpm_get_content( $project->post_content ); ?>
                <?php do_action( 'cpm_project_after_description', $project ); ?>
            </div>
        </div>

        <div class="cpm-col-6 cpm-last-col cpm-top-right-btn cpm-text-right show_desktop_only">
            <?php do_action( 'cpm_inside_project_filter', $project ); ?>

            <?php if ( $can_manage ) { ?>
                <?php cpm_project_actions( $project_id ); ?>
            <?php } ?>
        </div>

        <div class="clearfix"></div>

        <div class="cpm-edit-project" style="display:none;">
            <?php
            if ( $can_manage ) {
                cpm_project_form( $project );
            }
            ?>
        </div>

        <div id="cpm-create-user-wrap" title="<?php _e( 'Create a new user', 'cpm' ); ?>">
            <?php
            if ( $can_manage ) {
                cpm_user_create_form();
            }
            ?>
        </div>
        <?php  do_action( 'cpm_project_header', $project ); ?>
    </div>

    <div class="cpm-row cpm-project-group">
        <ul class="clearfix">
            <?php  echo $pro_obj->nav_menu( $project_id, $cpm_active_menu ); ?>
        </ul>

    </div>

    <div class="clearfix"></div>
</div>

<style>
    .cpm-project-header {
        position: relative;
    }
</style>


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