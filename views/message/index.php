<?php
/**
 * This page displays all the messages attached with a project
 *
 */

$msg_obj = CPM_Message::getInstance();
$pro_obj = CPM_Project::getInstance();

cpm_get_header( __( 'Discussions', 'cpm' ), $project_id );
$can_create = cpm_user_can_access( $project_id, 'create_message' );
 if ( cpm_user_can_access( $project_id, 'msg_view_private' ) ) {
            $messages = $msg_obj->get_all( $project_id, true );
        } else {
            $messages = $msg_obj->get_users_all_message( $project_id );
        }
 if ( $messages ) {
?>
  <?php if ( $can_create ) { ?>
        <div>
            <a class="cpm-btn cpm-plus-white cpm-new-message-btn cpm-btn-uppercase" href="JavaScript:void(0)" id="cpm-add-message" > <?php _e( 'Add New Discussion', 'cpm' ); ?> </a>
        </div>
        <div class="cpm-new-message-form">
            <h3><?php _e( 'Create a new message', 'cpm' ); ?></h3>

            <?php echo cpm_discussion_form( $project_id ); ?>
        </div>

    <?php } ?>

<div class="cpm-row cpm-message-page" >
    <div class="cpm-message-list cpm-col-12 cpm-sm-col-12">
        <div class="cpm-box-title"><?php _e( 'Discussion List', 'cpm' ); ?></div>
        <?php



        echo '<ul class="dicussion-list">';

        foreach ($messages as $message) {
            $message_sender =  get_userdata($message->post_author) ;
            $private_class = ( $message->private == 'yes' ) ? 'cpm-lock' : 'cpm-unlock';
        ?>
        <li class="cpm-col-12"   >

            <div class="cpm-col-9" itemref="<?php echo cpm_url_single_message($project_id, $message->ID) ?>"  >
                <?php echo cpm_url_user( $message->post_author, true ); ?>

                    <div>
                       <?php echo cpm_excerpt( $message->post_title, 50 ); ?>
                    </div>
                    <div class="dicussion-meta">
                        <?php printf( __( 'By %s on %s', 'cpm' ), cpm_url_user( $message->post_author ), date_i18n( 'F d, Y h:i a', strtotime( $message->post_date ) ) ); ?>
                    </div>

            </div>

            <div class="cpm-col-1" >
                <span class="cpm-message-action cpm-right">
                    <?php if ( $message->post_author == get_current_user_id() || cpm_user_can_access( $project_id ) ) { ?>
                        <a href="JavaScript:void(0)" class="delete-message" title="<?php esc_attr_e( 'Delete this message', 'cpm' ); ?>" <?php cpm_data_attr( array('msg_id' => $message->ID, 'project_id' => $project_id, 'confirm' => __( 'Are you sure to delete this message?', 'cpm' )) ); ?>>
                            <span class="dashicons dashicons-trash"></span>
                        </a>

                        <span class="<?php echo $private_class; ?>"></span>
                    <?php } ?>
                </span>
            </div>

            <div class="cpm-col-2 cpm-last-col cpm-right comment-count" itemref="<?php echo cpm_url_single_message($project_id, $message->ID) ?>">
                 <?php printf( _n( '1 Comment', '%d Comments', $message->comment_count, 'cpm' ), cpm_get_number( $message->comment_count ) ); ?>
            </div>

                <div class="clear"></div>

            </li>
        <?php }
        echo "</ul>";

    ?>
    </div>

    <div class="clear"></div>
</div>
<?php }
    cpm_blank_template('discussion', $project_id) ;
   ?>

