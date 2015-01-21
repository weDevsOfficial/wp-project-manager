<?php
$project_obj = CPM_Project::getInstance();
$projects = $project_obj->get_projects();
$total_projects     = $projects['total_projects'];
unset($projects['total_projects']);
$pagenum            = isset( $_GET['pagenum'] ) ? absint( $_GET['pagenum'] ) : 1;
$limit              = 10;
?>

<div class="icon32" id="icon-themes"><br></div>
<h2><?php _e( 'Project Manager', 'cpm' ); ?></h2>

<div class="cpm-projects">

    <?php //show only for editor or above ?>
    <?php if ( $project_obj->has_admin_rights() ) { ?>
        <nav class="cpm-new-project">
            <a href="#" id="cpm-create-project"><span><?php _e( 'New Project', 'cpm' ); ?></span></a>
        </nav>
    <?php } ?>

    <?php
    foreach ($projects as $project) {
        if ( !$project_obj->has_permission( $project ) ) {
            continue;
        }
        ?>

        <article class="cpm-project">
            <a href="<?php echo cpm_url_project_details( $project->ID ); ?>">
                <h5><?php echo get_the_title( $project->ID ); ?></h5>

                <div class="cpm-project-detail"><?php echo cpm_excerpt( $project->post_content, 55 ); ?></div>
                <div class="cpm-project-meta">
                    <?php echo cpm_project_summary( $project->info ); ?>
                </div>
                <footer class="cpm-project-people">
                    <?php
                    foreach ($project->users as $user) {
                        echo get_avatar( $user['id'], 48, '', $user['name'] );
                    }
                    ?>
                </footer>
            </a>
            <?php
            $progress = $project_obj->get_progress_by_tasks( $project->ID );
            echo cpm_task_completeness( $progress['total'], $progress['completed'] );
            ?>
        </article>

    <?php } ?>

</div>

<?php
cpm_pagination( $total_projects, $limit, $pagenum );

?>

<div id="cpm-project-dialog" title="<?php _e( 'Start a new project', 'cpm' ); ?>">
    <?php if ( $project_obj->has_admin_rights() ) { ?>
        <?php cpm_project_form(); ?>
    <?php } ?>
</div>

<script type="text/javascript">
    jQuery(function($) {
        $( "#cpm-project-dialog" ).dialog({
            autoOpen: false,
            modal: true,
            dialogClass: 'cpm-ui-dialog',
            width: 450,
            height: 400,
            position:['middle', 100]
        });
    })
</script>