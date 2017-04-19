<?php

cpm_get_email_header();

$tpbk = CPM_URL . '/assets/images/tpbk.png';

$msg_obj     = CPM_Message::getInstance();
$parent_post = get_post( $data['comment_post_ID'] );
$author      = wp_get_current_user();
$comment_url = '';

switch ( $parent_post->post_type ) {
    case 'cpm_message':
        $type        = __( 'Message', 'cpm' );
        $title       = $parent_post->post_title;
        $comment_url = cpm_url_single_message( $project_id, $data['comment_post_ID'] );
        break;

    case 'cpm_task_list':
        $title       = $parent_post->post_title;
        $type        = __( 'Task List', 'cpm' );
        $comment_url = cpm_url_single_tasklist( $project_id, $parent_post->ID );
        break;

    case 'cpm_task':
        $type        = __( 'Task', 'cpm' );
        $title       = $parent_post->post_title;
        $comment_url = cpm_url_single_task( $project_id, $parent_post->post_parent, $parent_post->ID );
        break;
}
?>

<div style="width:600px;  background: #fff;">
    <div style="width: 600px;">
        <div style="background-image: url('<?php echo $tpbk; ?>'); background-repeat: no-repeat; height: 174px; width: 600px;">
            <div style="font-family: 'Lato', sans-serif; font-wight: bold; color: #333; font-size: 16px; padding-top: 20px; text-align: center; padding-right: 40px; padding-left: 40px;">
                <?php
                    _e( 'Hi! You are mentioned in a comment by', 'cpm' );
                    echo ' <strong><em>' . $author->display_name . '</em></strong>. ';
                    _e('Please visit the link bellow to view the comment.', 'cpm' ); 
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