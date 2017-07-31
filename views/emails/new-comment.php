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

// $template_vars = array(
//     '%SITE%'         => wp_specialchars_decode( get_option( 'blogname' ), ENT_QUOTES ),
//     '%PROJECT_NAME%' => get_post_field( 'post_title', $project_id ),
//     '%PROJECT_URL%'  => '<a style="text-decoration: none;" href="'.cpm_url_project_details( $project_id ).'">'.get_post_field( 'post_title', $project_id ).'</a>',
//     '%AUTHOR%'       => $author->display_name,
//     '%AUTHOR_EMAIL%' => $author->user_email,
//     '%COMMENT_URL%'  => '<a style="text-decoration: none;" href="'.$comment_url .'/#cpm-comment-'.$comment_id.'">'.__( 'comment link', 'cpm' ).'</a>',
//     '%COMMENT%'      => $data['comment_content'],
//     '%IP%'           => get_ipaddress()
// );
// $message = cpm_get_content( cpm_get_option( 'new_comment_body', 'cpm_general ) );
// // message
// foreach ($template_vars as $key => $value) {
//     $message = str_replace( $key, $value, $message );
// }
?>

<div style="width:600px;  background: #fff;">

    <div style="width: 600px;">
        <div style="background-image: url('<?php echo $tpbk; ?>'); background-repeat: no-repeat; height: 174px; width: 600px;">
            <div style="font-family: 'Lato', sans-serif; font-wight: bold; color: #fff; font-size: 30px; padding-top: 26px; text-align: center; text-transform: uppercase;">
<?php _e( 'New Comment', 'cpm' ); ?>
            </div>
        </div>

    </div>
    <div style="padding: 0 50px; text-align: justify; background-repeat: no-repeat; ">
        <div style="margin: 40px 0 10px; margin-bottom: 20px;">
            <em style="font-family: lato; color: #B3B3B3;padding-right: 5px;"><?php _e( 'Commented By', 'cpm' ); ?></em>
            <strong style="font-family: lato; color: #7e7e7e; padding-right: 10px;">
<?php echo $author->display_name; ?>
            </strong>
            <em style="font-family: lato; color: #B3B3B3; "><?php _e( 'On', 'cpm' ); ?></em>
            <strong style="font-family: lato; color: #7e7e7e;">
                <span style="padding-right: 5px;"><?php echo $type; ?></span><a style="text-decoration: none; font-family: lato; color: #00b1e7; " href="<?php echo $comment_url; ?>"><?php echo $title; ?></a>
            </strong>
        </div>

        <div style="font-family: arial; font-size: 14px; line-height: 24px; color: #7e7e7e;">
           <!--  <strong><?php _e( 'Author:' ); ?></strong> <?php echo $author->display_name; ?>
            <strong style="margin-left: 10px;"><?php _e( 'Permalink:' ); ?></strong> <a style="text-decoration: none; font-family: lato; color: #00b1e7;" href="<?php echo $comment_url; ?>"><?php _e( 'Comment link', 'cpm' ); ?></a>
            <strong style="margin-left: 10px;"><?php _e( 'Comment:' ); ?></strong> --> <?php echo $data['comment_content']; ?>
        </div>

    </div>
    <center>
        <div style="padding: 18px; margin: 30px 0 45px; border-radius: 30px; background: #00b1e7; width: 171px;">

            <a href="<?php echo $comment_url; ?>" style="font-family: lato; font-size: 16px; text-decoration: none; color: #fff;">
<?php _e( 'View Comment', 'cpm' ); ?>
            </a>

        </div>
    </center>
</div>
<?php cpm_get_email_footer(); ?>
