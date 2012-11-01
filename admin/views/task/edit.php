<?php
$cpm_active_menu = __( 'Task List', 'cpm' );

require_once CPM_PLUGIN_PATH . '/class/task.php';
require_once CPM_PLUGIN_PATH . '/admin/views/project/header.php';

$task_obj = CPM_Task::getInstance();

$error = false;
if ( isset( $_POST['create_tasklist'] ) ) {
    check_admin_referer( 'new_task_list' );
    $post = $_POST;

    $name = trim( $post['tasklist_name'] );
    $due = trim( $post['tasklist_due'] );
    $description = trim( $post['tasklist_detail'] );

    $error = new WP_Error();

    if ( empty( $name ) ) {
        $error->add( 'empty_name', __( 'Empty Task list name', 'cpm' ) );
    }

    if ( empty( $due ) ) {
        $error->add( 'empty_due', __( 'Empty Task list due date', 'cpm' ) );
    }

    if ( $error->errors ) {
        $errors = $error->get_error_messages();

        echo '<h3>Errros</h3>';
        cpm_show_errors( $errors );
    } else {
        $list_id = $task_obj->update_list( $project_id, $tasklist_id );

        echo '<h3>task list updated</h3>';
    }
}

$list = $task_obj->get_task_list( $tasklist_id );
?>

<h3 class="cpm-nav-title"><?php _e( 'Edit Task List', 'cpm' ) ?></h3>

<form class="cpm_new_tasklist" action="" method="post">
    <?php wp_nonce_field( 'new_task_list' ); ?>
    <table class="form-table">
        <tbody>
            <tr class="form-field form-required">
                <th scope="row">
                    <label for="tasklist_name">Name <span class="required">*</span></label>
                </th>
                <td>
                    <input name="tasklist_name" type="text" id="tasklist_name" value="<?php echo esc_attr( $list->post_title ); ?>" aria-required="true">
                </td>
            </tr>
            <tr class="form-field form-required">
                <th scope="row"><label for="tasklist_due">Due date <span class="required">*</span></label></th>
                <td><input name="tasklist_due" autocomplete="off" class="datepicker" type="text" id="tasklist_due" value="<?php echo esc_attr( date_i18n( 'm/d/Y', strtotime( $list->due_date ) ) ); ?>"></td>
            </tr>
            <tr class="form-field">
                <th scope="row"><label for="tasklist_priority">Priority </label></th>
                <td><input name="tasklist_priority" type="text" id="tasklist_priority" value="<?php echo esc_attr( $list->priority ); ?>"></td>
            </tr>
            <tr class="form-field">
                <th scope="row"><label for="tasklist_detail">Description</label></th>
                <td><textarea name="tasklist_detail" id="tasklist_detail" cols="30" rows="10"><?php echo esc_textarea( $list->post_content ); ?></textarea></td>
            </tr>
            <tr class="form-field">
                <th scope="row"><label for="tasklist_milestone">Milestone</label></th>
                <td>
                    <select name="tasklist_milestone" id="tasklist_milestone">
                        <option selected="selected" <?php selected( $list->milestone, '0' ); ?> value="0">-- None --</option>
                        <?php echo CPM_Milestone::getInstance()->get_dropdown( $project_id, $list->milestone ); ?>
                    </select>
                </td>
            </tr>
            <tr class="form-field">
                <th scope="row"><label for="tasklist_privacy">Private Task list</label></th>
                <td><input type="radio" <?php checked( $list->privacy, '1' ); ?> name="tasklist_privacy" value="1" /> Yes
                    <input type="radio" <?php checked( $list->privacy, '0' ); ?> name="tasklist_privacy" value="0" /> No
                    <span class="description">Private task lists are visible only to members. Client will not be able to see them.</span>
                </td>
            </tr>
        </tbody>
    </table>

    <p class="submit">
        <input type="submit" name="create_tasklist" id="create_tasklist" class="button-primary" value="Update Task List">
    </p>
</form>
