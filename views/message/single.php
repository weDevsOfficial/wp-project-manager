<?php
$msg_obj = CPM_Message::getInstance();

$message = $msg_obj->get( $message_id );

if ( !$message ) {
    echo '<h2>' . __( 'Error: Message not found', 'cpm' ) . '</h2>';
    return;
}

if( $message->private == 'yes' && ! cpm_user_can_access( $project_id, 'msg_view_private' ) ) {
    echo '<h2>' . __( 'You do no have permission to access this page', 'cpm' ) . '</h2>';
    return;   
}

cpm_get_header( __( 'Messages', 'cpm' ), $project_id );
$private_class =  ( $message->private == 'yes' ) ? 'cpm-lock' : 'cpm-unlock';
?>

<h3 class="cpm-nav-title">
    <a href="<?php echo cpm_url_message_index( $project_id ); ?>"><?php _e( '&larr; back', 'cpm' ); ?></a>
</h3>

<div class="cpm-single">

    <h3 class="cpm-entry-title"><?php echo get_the_title( $message_id ); ?></h3>

    <div class="cpm-entry-meta">
        <span class="cpm-date"><?php echo cpm_get_date( $message->post_date, true ); ?></span>
        <span class="cpm-separator">|</span>
        <span class="cpm-date"><?php echo cpm_url_user( $message->post_author ); ?></span>
        <span class="cpm-separator">|</span>
        <span class="cpm-comment-num"><?php echo cpm_get_number( $message->comment_count ); ?></span>
        
        <?php if( $message->post_author == get_current_user_id() ) { ?>
            <span class="cpm-separator">|</span>
            <span class="cpm-edit-link">
                <a href="#" data-msg_id="<?php echo $message->ID; ?>" data-project_id="<?php echo $project_id; ?>" class="cpm-msg-edit">
                    <?php _e( 'Edit', 'cpm' ); ?>
                </a>
            </span>
        <?php } ?>
        <span class="<?php echo $private_class; ?>"></span>
    </div>

    <div class="cpm-entry-detail">
        <?php echo cpm_get_content( $message->post_content ); ?>

        <?php echo cpm_show_attachments( $message, $project_id ); ?>
    </div>

    <span class="cpm-msg-edit-form"></span>

</div>

<?php
$comments = $msg_obj->get_comments( $message_id );

if ( $comments ) {
    $count = 0;
    ?>

    <h3><?php printf( _n( 'One Comment', '%s Comments', count( $comments ), 'cpm' ), number_format_i18n( count( $comments ) ) ); ?></h3>

    <ul class="cpm-comment-wrap">

        <?php
        foreach ($comments as $comment) {
            $class = ( $count % 2 == 0 ) ? 'even' : 'odd';

            echo cpm_show_comment( $comment, $project_id, $class );

            $count++;
        }
        ?>

    </ul>
    <?php
} else {
    printf( '<h4>%s</h4>', __( 'No comments found', 'cpm' ) );
    echo '<ul class="cpm-comment-wrap" style="display: none;"></ul>'; //placeholder for ajax comment append
}
?>

<?php echo cpm_comment_form( $project_id, $message_id ); ?>