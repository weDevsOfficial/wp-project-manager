<?php
$project_users = CPM_Project::getInstance()->get_users( $project_id );
$users         = array();
$task_data     = cpm()->task->get_task( $task_id );
$due_date      = cpm_get_date( current_time( 'mysql' ) );
if ( ! empty( $due_date ) ) {
    $next_name = sprintf( '<em style="font-family: lato; color: #B3B3B3; ">%s</em>
                <strong style="font-family: lato; color: #7e7e7e;">
                    <span style="padding-right: 5px;">%s</span>', __('Date ', 'cpm' ), $due_date );
} else {
    $next_name = '';
}

if( is_array( $project_users ) && count($project_users) ) {
    foreach ($project_users as $user_id => $role_array ) {
        if( $role_array['role'] == 'manager' ) {
            if( $this->filter_email( $user_id ) ) {
                // $users[$user_id] = sprintf( '%s (%s)', $role_array['name'], $role_array['email'] );
                $users[$user_id] = sprintf( '%s', $role_array['email'] );
            }
        }
    }
}

if ( ! $users ) {
	return;
}

cpm_get_email_header();

$tpbk = CPM_URL . '/assets/images/tpbk.png';
$completed_user = get_user_by( 'id', $data->completed_by );

// $template_vars = array(
//     '%SITE%'         => wp_specialchars_decode( get_option( 'blogname' ), ENT_QUOTES ),
//     '%PROJECT_NAME%' => get_post_field( 'post_title', $project_id ),
//     '%PROJECT_URL%'  => '<a style="text-decoration: none;" href="'.cpm_url_project_details( $project_id ).'">'.get_post_field( 'post_title', $project_id ).'</a>',
//     '%TASKLIST_URL%' => '<a style="text-decoration: none;" href="'.cpm_url_single_tasklist($project_id, $list_id).'"">'.get_post_field( 'post_title', $list_id ) .'</a>',
//     '%TASK_URL%'     => '<a style="text-decoration: none;" href="'.cpm_url_single_task( $project_id, $list_id, $task_id ).'">'.$data->post_content.'</a>',
//     '%TASK%'         => $data->post_content,
//     '%IP%'           => get_ipaddress()
// );
?>

	<div style="width:600px;  background: #fff;">

		<div style="width: 600px;">
			<div style="background-image: url('<?php echo $tpbk; ?>'); background-repeat: no-repeat; height: 174px; width: 600px;">
				<div style="font-family: 'Lato', sans-serif; font-wight: bold; color: #fff; font-size: 30px; padding-top: 26px; text-align: center;">
					<?php _e( 'New task has been completed', 'cpm'  ); ?>
				</div>
			</div>

		</div>
		<div style="padding: 0 50px; text-align: justify; background-repeat: no-repeat;">
				<div style="margin: 40px 0 10px; margin-bottom: 20px;">
                    <em style="font-family: lato; color: #B3B3B3;padding-right: 5px;"><?php _e( 'Completed By', 'cpm' ); ?></em>
                    <strong style="font-family: lato; color: #7e7e7e; padding-right: 10px;">
                        <?php echo $completed_user->display_name; ?>
                    </strong>
                    <?php echo $next_name; ?>
                </div>

				<div style="font-family: arial; font-size: 14px; line-height: 24px;">
					<span style="float: left; font-size: 21px; width: 20px; color: #bcbcbc;">&#x2611;</span>
                    <span style="float: left; width: 459px;"><?php echo $data->post_content; ?></span>
                    <div style="clear: both;"></div>
				</div>

		</div>
		<center>
			<div style="padding: 18px; margin: 30px 0 45px; border-radius: 30px; background: #00b1e7; width: 171px;">

				<a href="<?php echo cpm_url_single_task( $project_id, $list_id, $task_id ) ; ?>" style="font-family: lato; font-size: 16px; text-decoration: none; color: #fff;">
					<?php _e( 'View Task', 'cpm' ); ?>
				</a>

			</div>
		</center>
	</div>
<?php cpm_get_email_footer(); ?>
