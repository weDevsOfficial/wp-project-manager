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

cpm_get_header( __( 'Discussions', 'cpm' ), $project_id );
$private_class =  ( $message->private == 'yes' ) ? 'cpm-lock' : 'cpm-unlock';
?>



<div class="cpm-single">

    <h3 class="cpm-box-title"><?php echo get_the_title( $message_id ); ?>
        <span class="cpm-right cpm-edit-link">
            <?php if( $message->post_author == get_current_user_id() ) { ?>
                <a href="#" data-msg_id="<?php echo $message->ID; ?>" data-project_id="<?php echo $project_id; ?>" class="cpm-msg-edit dashicons dashicons-edit"></a>
            <?php } ?>
             <span class="<?php echo $private_class; ?>"></span>
        </span>
        <div class="cpm-small-title">
            <?php printf( __( 'by %s on %s at %s', 'cmp' ), cpm_url_user( $message->post_author ), date_i18n( 'F d, Y ', strtotime( $message->post_date ) ) , date_i18n( ' h:i a', strtotime( $message->post_date ) ) ); ?>
        </div>
    </h3>



    <div class="cpm-entry-detail">
        <?php  echo cpm_get_content( $message->post_content ); ?>

        <?php echo cpm_show_attachments( $message, $project_id ); ?>
    </div>

    <span class="cpm-msg-edit-form"></span>

</div>

<div class="cpm-comment-area cpm-box-shadow">
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
</div>