<?php
$cpm_active_menu = __( 'Task List', 'cpm' );

require_once CPM_PLUGIN_PATH . '/class/task.php';
require_once CPM_PLUGIN_PATH . '/admin/views/project/header.php';

$error = false;
$task_obj = new CPM_Task();
$list = $task_obj->get_task_list( $tasklist_id );

if ( isset( $_POST['create_task'] ) ) {
    check_admin_referer( 'cpm_update_task' );
    $post = $_POST;

    $text = trim( $post['task_text'] );
    $due = trim( $post['task_due'] );

    $error = new WP_Error();

    if ( empty( $text ) ) {
        $error->add( 'empty_task', __( 'Empty Task detail', 'cpm' ) );
    }

    if ( empty( $due ) ) {
        $error->add( 'empty_due', __( 'Empty Task due date', 'cpm' ) );
    }

    if ( $error->errors ) {
        $errors = $error->get_error_messages();

        echo '<h3>Errros</h3>';
        cpm_show_errors( $errors );
    } else {
        $task_obj->update_task( $list->ID, $task_id );

        echo '<h3>Task Updated</h3>';
    }
}

$task = $task_obj->get_task( $task_id );
$lists = $task_obj->get_task_lists( $project_id );
?>

<h3 class="cpm-nav-title">Edit Task</h3>

<form class="cpm_new_tasklist cpm-form" action="" method="post">
    <?php wp_nonce_field( 'cpm_update_task' ); ?>
    <table class="form-table">
        <tbody>
            <tr class="form-field">
                <th scope="row"><label for="task_list">Task List <span class="required">*</span></label></th>
                <td>
                    <select name="task_list" id="task_list">
                        <?php foreach ($lists as $list) { ?>
                            <option value="<?php echo $list->ID; ?>" <?php selected( $task->post_parent, $list->ID ); ?>><?php echo get_the_title( $list->ID ); ?></option>
                        <?php } ?>
                    </select>
                </td>
            </tr>
            <tr class="form-field">
                <th scope="row"><label for="task_text">Task <span class="required">*</span></label></th>
                <td><textarea name="task_text" id="task_text" cols="30" rows="10"><?php echo esc_textarea( stripslashes( $task->post_content ) ); ?></textarea></td>
            </tr>
            <tr class="form-field">
                <th scope="row"><label for="task_due">Due Date <span class="required">*</span></label></th>
                <td><input type="text" autocomplete="off" class="datepicker" name="task_due" value="<?php echo esc_attr( date_i18n( 'm/d/Y', strtotime( $task->due_date ) ) ); ?>" /></td>
            </tr>
            <tr class="form-field">
                <th scope="row"><label for="task_assign">Assigned To</label></th>
                <td><?php wp_dropdown_users( array('name' => 'task_assign', 'show_option_none' => __( '-- None --', 'cpm' ), 'selected' => $task->assigned_to) ); ?></td>
            </tr>
            <tr class="form-field">
                <th scope="row"><label for="task_notification">&nbsp;</label></th>
                <td><input type="checkbox" name="task_notification" value="1" /> Send Notification</td>
            </tr>
        </tbody>
    </table>

    <p class="submit">
        <input type="submit" name="create_task" id="create_task" class="button-primary" value="Update Task">
    </p>
</form>