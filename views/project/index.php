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
                    <?php
                    $info_array = array();

                    if( $project->info->discussion ) {
                        $info_array[] = sprintf( _n( '%d message', '%d messages', $project->info->discussion, 'cpm' ), $project->info->discussion );
                    }

                    if( $project->info->todolist ) {
                        $info_array[] = sprintf( _n( '%d todolist', '%d todolists', $project->info->todolist, 'cpm' ), $project->info->todolist );
                    }

                    if( $project->info->todos ) {
                        $info_array[] = sprintf( _n( '%d todo', '%d todos', $project->info->todos, 'cpm' ), $project->info->todos );
                    }

                    if( $project->info->comments ) {
                        $info_array[] = sprintf( _n( '%d comment', '%d comments', $project->info->comments, 'cpm' ), $project->info->comments );
                    }

                    echo implode(', ', $info_array );
                    ?>
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
    <form action="" method="post" class="cpm-project-form">
        <?php wp_nonce_field( 'new_project' ); ?>

        <div class="cpm-form-item">
            <div class="cpm-form-input">
                <input type="text" name="project_name" id="project_name" placeholder="<?php esc_attr_e( 'Name of the project', 'cpm' ) ?>" value="" size="45" />
            </div>
        </div>

        <div class="cpm-form-item">
            <div class="cpm-form-input">
                <textarea name="project_description" id="" cols="50" rows="3" placeholder="<?php _e( 'Some details about the project (optional)', 'wedevs' ); ?>"></textarea>
            </div>
        </div>

        <div class="cpm-form-item">
            <div class="cpm-form-input">
                <?php echo cpm_dropdown_users(); ?>
            </div>
        </div>

        <div class="cpm-form-item">
            <div class="cpm-form-input">
                <input type="hidden" name="project_notify" value="no" />
                <label>
                    <input type="checkbox" name="project_notify" id="project-notify" value="yes" />
                    <?php _e( 'Notify Co-workers', 'cpm' ) ?>
                </label>
                
            </div>
        </div>

        <p class="submit">
            <input type="submit" name="add_project" id="add_project" class="button-primary" value="<?php esc_attr_e( 'Add New Project', 'cpm' ) ?>">
        </p>
    </form>

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

        $( "#cpm-create-project" ).click(function(e) {
            e.preventDefault();

            $( "#cpm-project-dialog" ).dialog( "open" );
        });

        $('form.cpm-project-form').submit(function () {

            var name = $.trim( $('#project_name').val() );

            if (name === '') {
                alert('Enter a project name');

                return false;
            };

            return true;
        })
    })
</script>