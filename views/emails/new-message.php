<?php

cpm_get_email_header();

$tpbk = CPM_URL . '/assets/images/tpbk.png';

$pro_obj = CPM_Project::getInstance();
$msg_obj = CPM_Message::getInstance();

$project = $pro_obj->get( $project_id );
$msg     = $msg_obj->get( $message_id );
$author  = wp_get_current_user();
// $template_vars = array(
//     '%SITE%'         => wp_specialchars_decode( get_option( 'blogname' ), ENT_QUOTES ),
//     '%PROJECT_NAME%' => $project->post_title,
//     '%PROJECT_URL%'  => '<a style="text-decoration: none;" href="'.cpm_url_project_details( $project_id ).'">'.get_post_field( 'post_title', $project_id ).'</a>',
//     '%AUTHOR%'       => $author->display_name,
//     '%AUTHOR_EMAIL%' => $author->user_email,
//     '%MESSAGE_URL%'  => '<a style="text-decoration: none;" href="'.cpm_url_single_message( $project_id, $message_id ).'">'.get_post_field( 'post_title', $message_id ). '</a>',
//     '%MESSAGE%'      => $msg->post_content,
//     '%IP%'           => get_ipaddress()
// );
// $subject = apply_filters( 'new_message_sub', __('New Message', 'cpm') );
// $message = cpm_get_content( cpm_get_option( 'new_message_body', 'cpm_general ) );
// // subject
// foreach ($template_vars as $key => $value) {
//     $subject = str_replace( $key, $value, $subject );
// }
// // message
// foreach ($template_vars as $key => $value) {
//     $message = str_replace( $key, $value, $message );
// }
?>

<div style="width:600px;  background: #fff;">

    <div style="width: 600px;">
        <div style="background-image: url('<?php echo $tpbk; ?>'); background-repeat: no-repeat; height: 174px; width: 600px;">
            <div style="font-family: 'Lato', sans-serif; font-wight: bold; color: #fff; font-size: 30px; padding-top: 26px; text-align: center; text-transform: uppercase;">
<?php _e( 'New Message', 'cpm' ); ?>
            </div>
        </div>

    </div>
    <div style="padding: 0 50px; text-align: justify; background-repeat: no-repeat;">
        <div style="margin: 40px 0 10px; margin-bottom: 20px;">
            <em style="font-family: lato; color: #B3B3B3;padding-right: 5px;"><?php _e( 'Message Created By', 'cpm' ); ?></em>
            <strong style="font-family: lato; color: #7e7e7e; padding-right: 10px;">
<?php echo $author->display_name; ?>
            </strong>

        </div>

        <div style="font-family: arial; font-size: 14px; line-height: 24px; color: #7e7e7e;">
            <span style="float: left;  width: 70px;">
                <em style="font-family: lato; color: #B3B3B3; "><?php _e( 'Title', 'cpm' ); ?></em>
            </span>
            <span style="float: left; width: 430px;">
                <strong style="font-family: lato; color: #7e7e7e;">
                    <a style="text-decoration: none; font-family: lato; color: #00b1e7;" href="<?php echo cpm_url_single_message( $project_id, $message_id ); ?>">
<?php echo $msg->post_title; ?>
                    </a>

                </strong>
            </span>
            <div style="clear: both;"></div>
            <span style="float: left;  width: 70px;"><em style="font-family: lato; color: #B3B3B3; "><?php _e( 'Message', 'cpm' ); ?></em></span>
            <span style="float: left; width: 430px;"><?php echo $msg->post_content; ?></span>
            <div style="clear: both;"></div>
        </div>

    </div>
    <center>
        <div style="padding: 18px; margin: 30px 0 45px; border-radius: 30px; background: #00b1e7; width: 171px;">

            <a href="<?php echo cpm_url_single_message( $project_id, $message_id ); ?>" style="font-family: lato; font-size: 16px; text-decoration: none; color: #fff;">
<?php _e( 'View Message', 'cpm' ); ?>
            </a>

        </div>
    </center>
</div>
<?php cpm_get_email_footer(); ?>
