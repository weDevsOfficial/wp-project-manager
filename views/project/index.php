<?php
$project_obj = CPM_Project::getInstance();
$projects = $project_obj->get_projects();
?>

<div class="icon32" id="icon-themes"><br></div>
<h2><?php _e( 'Project Manager', 'cpm' ); ?></h2>

<div class="cpm-projects">
    <nav class="cpm-new-project">
        <a href="#" id="cpm-create-project"><span><?php _e( 'New Project', 'cpm' ); ?></span></a>
    </nav>

    <?php foreach ($projects as $project) { ?>

        <article class="cpm-project">
            <a href="<?php echo cpm_url_project_details( $project->ID ); ?>">
                <h5><?php echo get_the_title( $project->ID ); ?></h5>

                <div class="cpm-project-detail"><?php echo cpm_excerpt( $project->post_content, 55 ); ?></div>
                <div class="cpm-project-meta">
                    <?php echo cpm_project_summary( $project->info ); ?>
                </div>
                <footer class="cpm-project-people">
                    <?php
                    $users = $project_obj->get_users( $project->ID );
                    foreach ($users as $user) {
                        echo get_avatar( $user['id'], 48 );
                    }
                    ?>
                </footer>
            </a>
        </article>

    <?php } ?>

</div>

<div id="cpm-project-dialog" title="<?php _e( 'Start a new project', 'cpm' ); ?>">
    <?php cpm_project_form(); ?>
</div>

<script type="text/javascript">
    jQuery(function($) {
        $( "#cpm-project-dialog" ).dialog({
            autoOpen: false,
            modal: true,
            dialogClass: 'cpm-ui-dialog',
            width: 485,
            height: 330,
            position:['middle', 100]
        });
    })
</script>