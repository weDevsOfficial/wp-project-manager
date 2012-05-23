<?php
$cpm_active_menu = __( 'Task List', 'cpm' );

require_once CPM_PLUGIN_PATH . '/class/task.php';
require_once CPM_PLUGIN_PATH . '/admin/views/project/header.php';

$task_obj = new CPM_Task();
$list = $task_obj->get_task_list( $tasklist_id );

$error = false;
if ( isset( $_POST['cpm_new_comment'] ) ) {
    $posted = $_POST;

    check_admin_referer( 'cpm_new_message' );

    $text = trim( $posted['cpm_message'] );

    if ( empty( $text ) ) {
        $error = new WP_Error( 'empty_message', __( 'Empty message', 'cpm' ) );
    } else {
        $data = array(
            'text' => $text,
            'file' => $task_obj->upload_file()
        );

        $comment_id = $task_obj->new_task_comment( $data, $task_id );

        if ( $comment_id ) {
            cpm_show_message( __( 'Comment Added.', 'cpm' ) );
        }
    }
}

$task = $task_obj->get_task( $task_id );
?>
<h3 class="cpm-nav-title"><?php _e( 'Task List', 'cpm' ) ?> : <?php echo $list->name; ?></h3>

<div class="cpm-task-list">
    <?php $class = $task->complete == '0' ? 'open' : 'close'; ?>
    <div class="cpm-task <?php echo $class; ?>">
        <div class="task-detail">
            <?php echo stripslashes( $task->text ); ?>
        </div>
        <ul class="links">
            <li><a href="<?php echo cpm_edit_task_url( $project_id, $list->id, $task->id ); ?>">Edit</a></li>
            <li><a href="#">Delete</a></li>
            <li><a href="<?php echo cpm_single_task_url( $project_id, $list->id, $task->id ); ?>">View</a></li>
            <?php if ( $task->complete == '0' ) { ?>
                <li><a href="#" class="cpm-mark-task-complete" data-id="<?php echo esc_attr( $task->id ); ?>">Mark Task as Completed</a></li>
            <?php } else { ?>
                <li><a href="#" class="cpm-mark-task-open" data-id="<?php echo esc_attr( $task->id ); ?>">Mark Task as Open</a></li>
            <?php } ?>
        </ul>
    </div>
</div>

<?php
if ( is_wp_error( $error ) ) {
    $errors = $error->get_error_messages();
    cpm_show_errors( $errors );
}
?>

<h3>Comments:</h3>
<?php
$comments = $task_obj->get_task_comments( $task_id );
if ( $comments ) {
    foreach ($comments as $comment) {
        cpm_show_comment( $comment );
    }
}

cpm_comment_form( false );