<?php
$msg_obj = CPM_Message::getInstance();

$message = $msg_obj->get( $message_id );

if ( !$message ) {
    echo '<h2>' . __( 'Error: Message not found', 'cpm' ) . '</h2>';
    return;
}

if( $message->private == 'yes' && ! cpm_user_can_access( $project_id, 'msg_view_private' ) ) {
    echo '<h2>' . __( 'You do not have permission to access this page.', 'cpm' ) . '</h2>';
    return;
}

cpm_get_header( __( 'Discussions', 'cpm' ), $project_id );
$private_class =  ( $message->private == 'yes' ) ? 'cpm-lock' : 'cpm-unlock';
echo '<div  id="cpm-signle-message"> ';
echo cpm_discussion_single( $message_id, $project_id );
echo '</div>';
?>
<div class="cpm-comment-area cpm-box-shadow">
<?php
$comments = $msg_obj->get_comments( $message_id );

if ( $comments ) {
    $count = 0;
    ?>

    <h3><?php printf( _n( '1 Comment', '%d Comments', count( $comments ), 'cpm' ), number_format_i18n( count( $comments ) ) ); ?></h3>

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
    printf( '<h4>%s</h4>', __( 'No comments found.', 'cpm' ) );
    echo '<ul class="cpm-comment-wrap" style="display: none;"></ul>'; //placeholder for ajax comment append
}
?>

<?php echo cpm_comment_form( $project_id, $message_id ); ?>
</div>