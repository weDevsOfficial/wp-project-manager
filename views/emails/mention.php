<?php

cpm_get_email_header();

$tpbk = CPM_URL . '/assets/images/tpbk.png';

$msg_obj     = CPM_Message::getInstance();
$author      = wp_get_current_user();
$comment_url = '';

switch ( $post_type ) {
    case 'cpm_message':
        $type        = __( 'Message', 'cpm' );
        $title       = $post_title;
        $comment_url = cpm_url_single_message( $project_id, $comment_post_id );
        break;

    case 'cpm_task_list':
        $title       = $post_title;
        $type        = __( 'Task List', 'cpm' );
        $comment_url = cpm_url_single_tasklist( $project_id, $post_id );
        break;

    case 'cpm_task':
        $type        = __( 'Task', 'cpm' );
        $title       = $post_title;
        $comment_url = cpm_url_single_task( $project_id, $post_parent, $post_id );
        break;
}
?>

<div style="width:600px;  background: #fff;">
    <div style="width: 600px;">
        <div style="height: 174px; width: 600px;">
            <div style="font-family: 'Lato', sans-serif; font-wight: bold; color: #333; font-size: 16px; padding-top: 20px; text-align: center; padding-right: 40px; padding-left: 40px;">
                <?php
                    _e( 'Hello', 'cpm' );
                    echo ' <strong>' . $user['name'] . '</strong>. ';
                    _e( 'You are mentioned in a comment by', 'cpm' );
                    echo ' <strong>' . $author->display_name . '</strong>. ';
                    _e('Please click the link bellow to view the comment.', 'cpm' ); 
                ?>
            </div>
            <center>
                <div style="padding: 18px; margin: 30px 0 45px; border-radius: 30px; background: #00b1e7; width: 171px;">
                    <a href="<?php echo $comment_url; ?>" style="font-family: lato; font-size: 16px; text-decoration: none; color: #fff;">
                        <?php _e( 'View Comment', 'cpm' ); ?>
                    </a>

                </div>
            </center>
        </div>
    </div>
</div>

<?php cpm_get_email_footer(); ?>