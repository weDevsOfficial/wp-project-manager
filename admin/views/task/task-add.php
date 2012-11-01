<?php
$cpm_active_menu = __( 'Task List', 'cpm' );

require_once CPM_PLUGIN_PATH . '/class/task.php';
require_once CPM_PLUGIN_PATH . '/admin/views/project/header.php';

$error = false;
$task_obj = new CPM_Task();
$list = $task_obj->get_task_list( $tasklist_id );

if ( isset( $_POST['create_task'] ) ) {
    check_admin_referer( 'cpm_new_task' );
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
        $task_obj->add_task( $tasklist_id );

        echo '<h3>Task added</h3>';
    }
}
?>

<h3 class="cpm-nav-title">Add Task to: <?php echo $list->name; ?></h3>

<form class="cpm_new_tasklist" action="" method="post">
    <?php wp_nonce_field( 'cpm_new_task' ); ?>
    <table class="form-table">
        <tbody>
            <tr class="form-field">
                <th scope="row"><label for="task_text">Task <span class="required">*</span></label></th>
                <td><textarea name="task_text" id="task_text" cols="30" rows="10"></textarea></td>
            </tr>
            <tr class="form-field">
                <th scope="row"><label for="task_due">Due Date <span class="required">*</span></label></th>
                <td><input type="text" autocomplete="off" class="datepicker" name="task_due" /></td>
            </tr>
            <tr class="form-field">
                <th scope="row"><label for="task_assign">Assigned To</label></th>
                <td><?php wp_dropdown_users( array('name' => 'task_assign', 'show_option_none' => __( '-- None --', 'cpm' )) ); ?></td>
            </tr>
            <tr class="form-field">
                <th scope="row"><label for="task_notification">Send Notification</label></th>
                <td>
                    <input type="checkbox" name="task_notification" id="task_notification_choice" value="1" />
                    <label for="task_notification_choice">Yes</label>
                </td>
            </tr>
        </tbody>
    </table>

    <p class="submit">
        <input type="submit" name="create_task" id="create_task" class="button-primary" value="Add Task">
    </p>
</form>