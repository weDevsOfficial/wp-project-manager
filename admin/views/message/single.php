<?php
$msg_obj = new CPM_Message();
$pro_obj = new CPM_Project();

$message = $msg_obj->get( $message_id );
if ( !$message ) {
    echo '<h2>' . __( 'Error: Message not found', 'cpm' ) . '</h2>';
    return;
}

$project = $pro_obj->get( $project_id );
$cpm_active_menu = __( 'Messages', 'cpm' );

require_once CPM_PLUGIN_PATH . '/admin/views/project/header.php';
?>

<h3 class="cpm-nav-title">Messages</h3>

<h3><?php echo get_the_title( $message_id ); ?></h3>

Date: <?php echo $message->post_date; ?> | Created By: <?php echo get_author_name( $message->post_author ); ?> | Comment: <?php echo $message->comment_count; ?>
| Privacy: <?php echo cpm_get_privacy( $message->comment_count ); ?> |
<a href="<?php echo cpm_msg_edit_url( $message_id ) ?>"><?php _e( 'Edit', 'cpm' ) ?></a>

<p><strong><?php _e( 'Details', 'cpm' ) ?></strong></p>
<p><?php echo $message->post_content; ?></p>

<?php cpm_show_attachments( $message ); ?>

<div class="cpm-comment-wrap">
    <?php
    $comments = $msg_obj->get_comments( $message_id );
    if ( $comments ) {
        foreach ($comments as $comment) {
            cpm_show_comment( $comment );
        }
    }
    ?>

</div>

<?php cpm_comment_form( $project_id, $message_id ); ?>