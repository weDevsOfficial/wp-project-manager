<?php
$projects = CPM_ERP_Integration::$project_info;

$title = ['-1' => __( '-Select-', 'cpm' ) ];
foreach ( $projects as $key => $project ) {
    $title[$project->project_id] = $project->project_title;
}
?>
<ul>
    <li class="row">
        <?php
        erp_html_form_input( array(
            'label'   => __( 'Project', 'wp-erp' ),
            'name'    => 'project',
            'id'      => 'erp-project',
            'type'    => 'select',
            'class'   => 'erp-project-select',
            'options' => $title
        ) );
        ?>
    </li>
    <li class="row erp-hide erp-employee-task-list-drop">
        <?php
        erp_html_form_input( array(
            'label'   => __( 'To Do Lists', 'wp-erp' ),
            'name'    => 'task_list',
            'id'      => 'erp-employee-task-list-drop',
            'type'    => 'select',
            'class'   => 'erp-project-select',
            'options' => array( '-1' => '-Select-' )
        ) );
        ?>
    </li>
    <li class="row erp-hide cpm-employee-task-form">
        <?php
        erp_html_form_input( array(
            'label' => __( 'Task Title', 'wp-erp' ),
            'name'  => 'task_title',
            'type'  => 'text',
        ) );
        ?>
    </li>

    <li class="row erp-hide cpm-employee-task-form">
        <?php
        erp_html_form_input( array(
            'label' => __( 'Task Content', 'wp-erp' ),
            'name'  => 'task_text',
            //'id'      => 'erp-employee-task-list-drop',
            'type'  => 'textarea',
        ) );
        ?>
    </li>

    <?php if ( cpm_get_option( 'task_start_field', 'cpm_general' ) == 'on' ) { ?>
        <li class="row erp-hide cpm-employee-task-form">
            <?php
            erp_html_form_input( array(
                'label' => __( 'Start date', 'wp-erp' ),
                'name'  => 'task_start',
                'type'  => 'text',
                'class' => 'date_picker_from',
            ) );
            ?>
        </li>
    <?php } ?>

    <li class="row erp-hide cpm-employee-task-form">
        <?php
        erp_html_form_input( array(
            'label' => __( 'Due date', 'wp-erp' ),
            'name'  => 'task_due',
            'type'  => 'text',
            'class' => 'date_picker_to',
        ) );
        ?>
    </li>
    <li class="row erp-hide cpm-employee-task-form">
        <?php
        erp_html_form_input( array(
            'label' => __( 'Private', 'wp-erp' ),
            'name'  => 'task_privacy',
            'type'  => 'checkbox',
            'class' => '',
        ) );
        ?>
    </li>

    <li class="row erp-hide">
        <?php
        erp_html_form_input( array(
            'name'  => 'action',
            'type'  => 'hidden',
            'value' => 'erp_fetch_employee_task'
        ) );
        ?>
    </li>
    <li class="row erp-hide">
        <?php
        erp_html_form_input( array(
            'name'  => 'task_assign[]',
            'type'  => 'hidden',
            'value' => isset( $_GET['id'] ) ? intval( $_GET['id'] ) : 0
        ) );
        ?>
    </li>

    <?php wp_nonce_field( 'cpm_employee_task_action', 'cpm_employee_task_nonce' ); ?>
</ul>