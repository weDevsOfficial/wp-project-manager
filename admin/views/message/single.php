<?php
$msg_obj = new CPM_Message();
$pro_obj = new CPM_Project();

$message = $msg_obj->get( $message_id );
if ( !$message ) {
    echo '<h2>' . __( 'Error: Message not found', 'cpm' ) . '</h2>';
    return;
}

$project_id = $message->project_id;
$project = $pro_obj->get( $project_id );
$cpm_active_menu = __( 'Messages', 'cpm' );

require_once CPM_PLUGIN_PATH . '/admin/views/project/header.php';

$error = false;
if ( isset( $_POST['cpm_new_comment'] ) ) {
    $posted = $_POST;

    $text = trim( $posted['cpm_message'] );

    if ( empty( $text ) ) {
        $error = new WP_Error( 'empty_message', __( 'Empty message', 'cpm' ) );
    } else {
        $data = array(
            'object_id' => $project_id,
            'text' => $text,
            'privacy' => (int) $posted['privacy'],
            'file' => $msg_obj->upload_file()
        );

        $comment_id = $msg_obj->new_comment( $data, $message_id );

        if ( $comment_id ) {
            cpm_show_message( __( 'Comment Added.', 'cpm' ) );
        }
    }
}
?>

<?php
if ( is_wp_error( $error ) ) {
    $errors = $error->get_error_messages();
    cpm_show_errors( $errors );
}
?>

<h2>Messages</h2>

<h3><?php echo $message->title; ?></h3>

Date: <?php echo $message->created; ?> | Created By: <?php echo get_author_name( $message->author ); ?> | Comment: <?php echo $message->reply_count; ?>
| Privacy: <?php echo cpm_get_privacy( $message->privacy ); ?> |
<a href="<?php echo cpm_msg_edit_url( $message_id ) ?>"><?php _e( 'Edit', 'cpm' ) ?></a>

<p><strong><?php _e( 'Details', 'cpm' ) ?></strong></p>
<p><?php echo $message->message; ?></p>

<?php
$comments = $msg_obj->get_comments( $message_id );
if ( $comments ) {
    foreach ($comments as $comment) {
        cpm_show_comment( $comment );
    }
}

cpm_comment_form();
