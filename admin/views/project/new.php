<?php
$error = false;

$fields = array(
    'project_name', 'project_client', 'project_budget', 'project_started',
    'project_ends', 'project_description', 'project_manager', 'project_coworker',
    'project_status', 'project_notify'
);
extract( $fields );
?>

<div id="icon-edit" class="icon32 icon32-posts-post"><br></div>
<h2>Add New Project</h2>

<div id="ajax-response"></div>
<p>&nbsp;</p>

<form action="" method="post" class="cpm-project-form">
    <?php wp_nonce_field( 'new_project' ); ?>
    <fieldset>
        <div class="cpm-form-item">
            <label for="project_name">Project Name <span class="required">*</span></label>
            <div class="cpm-form-input">
                <input type="text" name="project_name" id="project_name" placeholder="<?php esc_attr_e( 'Enter the project name', 'cpm' ) ?>" value="" />
            </div>
        </div>
        <div class="cpm-form-item">
            <label for="project_client">Client Name</label>
            <div class="cpm-form-input">
                <?php wp_dropdown_users( array('id' => 'project_client', 'name' => 'project_client') ); ?>
            </div>
        </div>
        <div class="cpm-form-item">
            <label for="project_budget">Project Budget</label>
            <div class="cpm-form-input">
                <input type="text" name="project_budget" id="project_budget" placeholder="<?php esc_attr_e( 'Enter the project budget', 'cpm' ) ?>" value="" />
            </div>
        </div>
        <div class="cpm-form-item">
            <label for="project_started">Start Date</label>
            <div class="cpm-form-input">
                <input type="text" name="project_started" id="project_started" <?php esc_attr_e( 'When the project starts?', 'cpm' ) ?> value="" />
            </div>
        </div>
        <div class="cpm-form-item">
            <label for="project_ends">End Goal</label>
            <div class="cpm-form-input">
                <input type="text" name="project_ends" id="project_ends" <?php esc_attr_e( 'When the project will complete?', 'cpm' ) ?> value="" />
            </div>
        </div>
        <div class="cpm-form-item">
            <label for="project_description">Description</label>
            <div class="cpm-form-input">
                <?php wp_editor( '', 'project_description', array('textarea_rows' => 10) ); ?>
            </div>
        </div>
        <div class="cpm-form-item">
            <label for="project_manager">Project Manager</label>
            <div class="cpm-form-input">
                <?php wp_dropdown_users( array('id' => 'project_manager', 'name' => 'project_manager') ); ?>
            </div>
        </div>
        <div class="cpm-form-item">
            <label for="project_coworker">Co-worker</label>
            <div class="cpm-form-input">
                <?php wedevs_dropdown_users( array('id' => 'project_coworker', 'name' => 'project_coworker[]', 'multiple' => true) ); ?>
            </div>
        </div>
        <div class="cpm-form-item">
            <label for="project-status">Project Status</label>
            <div class="cpm-form-input">
                <input type="text" name="project_status" id="project-status" value="0" style="display: none;" />
                <p>Percentage Completed: <span id="project-status-text">0</span></p>
                <div id="project-status-slider" style="width: 50%;"></div>
            </div>
        </div>
        <div class="cpm-form-item">
            <label for="project-notify">&nbsp;</label>
            <div class="cpm-form-input">
                <input type="hidden" name="project_notify" value="no" />
                <input type="checkbox" name="project_notify" id="project-notify" value="yes" />
                <?php _e( 'Notify Co-workers', 'cpm' ) ?>
            </div>
        </div>
    </fieldset>

    <p class="submit">
        <input type="submit" name="add_project" id="add_project" class="button-primary" value="<?php esc_attr_e( 'Add New Project', 'cpm' ) ?>">
    </p>
</form>
