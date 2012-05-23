<?php
$cpm_active_menu = __( 'Task List', 'cpm' );

require_once CPM_PLUGIN_PATH . '/class/task.php';
require_once CPM_PLUGIN_PATH . '/admin/views/project/header.php';

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

        cpm_show_errors( $errors );
    } else {
        $task_obj = new CPM_Task();
        $list_id = $task_obj->add_list( $project_id );

        if ( $list_id ) {
            foreach ($post['task_text'] as $key => $task) {
                if ( !empty( $task ) ) {
                    $task_obj->add_task( $key, $list_id );
                }
            }
        }

        cpm_show_message( __( 'Task list added', 'cpm' ) );
    }
}
?>

<h3 class="cpm-nav-title">Add Tasklist</h3>

<form class="cpm_new_tasklist" action="" method="post">
    <?php wp_nonce_field( 'new_task_list' ); ?>
    <table class="form-table">
        <tbody>
            <tr class="form-field form-required">
                <th scope="row">
                    <label for="tasklist_name">Name <span class="required">*</span></label>
                </th>
                <td>
                    <input name="tasklist_name" type="text" id="tasklist_name" value="" aria-required="true">
                </td>
            </tr>
            <tr class="form-field form-required">
                <th scope="row"><label for="tasklist_due">Due date <span class="required">*</span></label></th>
                <td><input name="tasklist_due" autocomplete="off" class="datepicker" type="text" id="tasklist_due" value=""></td>
            </tr>
            <tr class="form-field">
                <th scope="row"><label for="tasklist_priority">Priority </label></th>
                <td><input name="tasklist_priority" type="text" id="tasklist_priority" value=""></td>
            </tr>
            <tr class="form-field">
                <th scope="row"><label for="tasklist_detail">Description</label></th>
                <td><textarea name="tasklist_detail" id="tasklist_detail" cols="30" rows="10"></textarea></td>
            </tr>
            <tr class="form-field">
                <th scope="row"><label for="tasklist_milestone">Milestone</label></th>
                <td>
                    <select name="tasklist_milestone" id="tasklist_milestone">
                        <option selected="selected" value="0">-- None --</option>
                    </select>
                </td>
            </tr>
            <tr class="form-field">
                <th scope="row"><label for="tasklist_privacy">Private Task list</label></th>
                <td><input type="radio" name="tasklist_privacy" value="1" /> Yes
                    <input type="radio" checked="checked" name="tasklist_privacy" value="0" /> No
                    <span class="description">Private task lists are visible only to members. Client will not be able to see them.</span>
                </td>
            </tr>
        </tbody>
    </table>

    <table class="form-table cpm-form-tasks">
        <thead>
            <tr>
                <th>Task</th>
                <th>Due Date</th>
                <th>Assign To</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><textarea name="task_text[]" id="" cols="20" rows="3"></textarea></td>
                <td><input type="" class="datepicker" name="task_due[]" /></td>
                <td>
                    <?php wp_dropdown_users( array('name' => 'task_assign[]', 'show_option_none' => __( '-- None --', 'cpm' )) ); ?>
                    <img style="cursor:pointer; margin:0 3px;" alt="Add a row" title="Add a row" class="cpm-add-task-item" src="<?php echo CPM_PLUGIN_URI . '/images/add.png'; ?>" />
                </td>
            </tr>
        </tbody>
    </table>

    <p class="submit">
        <input type="submit" name="create_tasklist" id="create_tasklist" class="button-primary" value="Add Task List">
    </p>
</form>

<script type="text/tmpl" id="cpm-form-tasks-new">
    <tr>
        <td><textarea name="task_text[]" id="" cols="20" rows="3"></textarea></td>
        <td><input type="" class="datepicker" name="task_due[]" /></td>
        <td>
            <?php wp_dropdown_users( array('name' => 'task_assign[]', 'show_option_none' => __( '-- None --', 'cpm' )) ); ?>
            <img style="cursor:pointer; margin:0 3px;" alt="Add a row" title="Add a task" class="cpm-add-task-item" src="<?php echo CPM_PLUGIN_URI . '/images/add.png'; ?>" />
            <img style="cursor:pointer; margin:0 3px;" alt="<?php esc_attr_e( 'Remove this task', 'wedevs' ) ?>" title="<?php esc_attr_e( 'Remove this task', 'wedevs' ) ?>" class="cpm-remove-task-item" src="<?php echo CPM_PLUGIN_URI . '/images/ico-delete.png'; ?>">
        </td>
    </tr>
</script>
