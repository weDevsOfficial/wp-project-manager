<?php $project_id  = $project ? $project->ID : 0; ?>
<?php $dept_id     = get_post_meta( $project_id, '_erp_hr_dept_id', true ); ?>
<?php $departments = erp_hr_get_departments_dropdown_raw(); ?>

<div class="cpm-form-item project-category">
    <label for="cpm-department-drop-down"><?php _e( 'Assign co-worker from  departments' ); ?></label>
    <select id="cpm-department-drop-down" name="department">
        <?php foreach ( $departments as $key => $departments ) { ?>
            <option value="<?php echo $key; ?>" <?php selected( $dept_id, $key ); ?>><?php echo $departments; ?></option>

        <?php } ?>
    </select>

</div>
