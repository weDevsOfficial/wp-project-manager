<?php
$project_obj = CPM_Project::getInstance();
$projects = $project_obj->get_projects();
?>

<?php foreach ($projects as $project) {
    setup_postdata( $project );
    ?>
    
    <div class="cpm-projects">
        <article class="cpm-project">
            <a href="<?php echo cpm_url_project_details( $project->ID ); ?>">
                <h5><?php echo get_the_title( $project->ID ); ?></h5>
                <div class="cpm-project-detail"><?php $project->post_content; ?></div>
                <div class="cpm-project-meta">
                    1 discussion
                </div>
                <div class="cpm-project-people">
                    <?php echo get_avatar( $project->post_author, 48 ); ?>
                </div>
            </a>
        </article>
    </div>

<?php } ?>