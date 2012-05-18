<?php
$cpm_active_menu = __( 'Milestones', 'cpm' );

require_once CPM_PLUGIN_PATH . '/admin/views/project/header.php';

$error = false;
if ( isset( $_POST['create_milestone'] ) ) {
    check_admin_referer( 'new_milestone' );
    $post = $_POST;

    $name = trim( $post['milestone_name'] );
    $due = trim( $post['milestone_due'] );
    $description = trim( $post['milestone_detail'] );

    $error = new WP_Error();

    if ( empty( $name ) ) {
        $error->add( 'empty_name', __( 'Empty milestone name', 'cpm' ) );
    }

    if ( empty( $due ) ) {
        $error->add( 'empty_due', __( 'Empty milestone due date', 'cpm' ) );
    }

    if ( $error->errors ) {
        $errors = $error->get_error_messages();

        cpm_show_errors( $errors );
    } else {
        $milestone_obj = CPM_Milestone::getInstance();
        $milestone_id = $milestone_obj->add( $project_id );

        cpm_show_message( __( 'Milestone added', 'cpm' ) );
    }
}
?>

<form class="cpm_new_milestone cpm-form" action="" method="post">
    <?php wp_nonce_field( 'new_milestone' ); ?>
    <table class="form-table">
        <tbody>
            <tr class="form-field form-required">
                <th scope="row">
                    <label for="milestone_name">Name <span class="required">*</span></label>
                </th>
                <td>
                    <input name="milestone_name" type="text" id="milestone_name" value="" aria-required="true">
                </td>
            </tr>
            <tr class="form-field form-required">
                <th scope="row"><label for="milestone_due">Due date <span class="required">*</span></label></th>
                <td><input name="milestone_due" autocomplete="off" class="datepicker" type="text" id="milestone_due" value=""></td>
            </tr>
            <tr class="form-field">
                <th scope="row"><label for="milestone_detail">Description</label></th>
                <td><textarea name="milestone_detail" id="milestone_detail" cols="30" rows="10"></textarea></td>
            </tr>
            <tr class="form-field">
                <th scope="row"><label for="milestone_privacy">Private Milestone</label></th>
                <td><input type="radio" name="milestone_privacy" value="1" /> Yes
                    <input type="radio" checked="checked" name="milestone_privacy" value="0" /> No
                    <span class="description">Private milestones are visible only to members. Client will not be able to see them.</span>
                </td>
            </tr>
            <tr class="form-field">
                <th scope="row"><label for="task_assign">Assigned To</label></th>
                <td><?php wp_dropdown_users( array('name' => 'milestone_assign', 'show_option_none' => __( '-- None --', 'cpm' )) ); ?></td>
            </tr>
        </tbody>
    </table>

    <p class="submit">
        <input type="submit" name="create_milestone" id="create_milestone" class="button-primary" value="Add Milestone">
    </p>
</form>