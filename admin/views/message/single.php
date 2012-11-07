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

<h3 class="cpm-nav-title"><?php _e( 'Messages', 'cpm' ); ?></h3>

<div class="cpm-msg-single">

    <h3 class="cpm-msg-title"><?php echo get_the_title( $message_id ); ?></h3>

    <div class="cpm-entry-meta">
        <span class="cpm-date"><?php echo cpm_get_date( $message->post_date ); ?></span>
        <span class="cpm-separator">|</span>
        <span class="cpm-date"><?php echo cpm_url_user( $message->post_author ); ?></span>
        <span class="cpm-separator">|</span>
        <span class="cpm-comment-num"><?php echo cpm_get_number( $message->comment_count ); ?></span>
        <span class="cpm-separator">|</span>
        <span class="cpm-edit-link"><?php echo cpm_print_url( cpm_msg_edit_url( $message_id ), __( 'Edit', 'cpm' ) ); ?></span>
    </div>

    <div class="cpm-entry-detail">
        <?php echo cpm_print_content( $message->post_content ); ?>
    </div>

    <?php cpm_show_attachments( $message ); ?>
</div>

<?php
$comments = $msg_obj->get_comments( $message_id );

if ( $comments ) {
    $count = 0;
    ?>

    <h3><?php printf( _n( 'One Comment', '%s Comments', count( $comments ), 'cpm' ), number_format_i18n( count( $comments ) ) ); ?></h3>

    <ul class="cpm-comment-wrap">

    <?php foreach ($comments as $comment) {
        $class = ( $count % 2 == 0 ) ? 'even' : 'odd';
        cpm_show_comment( $comment, $class );

        $count++;
    } ?>

    </ul>
    <?php
} else {
    printf( '<h4>%s</h4>', __( 'No comments found', 'cpm' ) );
}
?>

<?php cpm_comment_form( $project_id, $message_id ); ?>