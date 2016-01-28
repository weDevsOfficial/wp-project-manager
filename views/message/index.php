<?php
/**
 * This page displays all the messages attached with a project
 *
 */

$msg_obj = CPM_Message::getInstance();
$pro_obj = CPM_Project::getInstance();

cpm_get_header( __( 'Discussion', 'cpm' ), $project_id );
$can_create = cpm_user_can_access( $project_id, 'create_message' );
?>
  <?php if ( $can_create ) { ?>
        <div>
            <a class="cpm-btn cpm-plus-white cpm-new-message-btn" href="JavaScript:void(0)" id="cpm-add-message" > <?php _e( 'ADD NEW DISCUSSION', 'cpm' ); ?> </a>
        </div>
            <div class="cpm-new-message-form">
                <h3><?php _e( 'Create a new message', 'cpm' ); ?></h3>

                <?php echo cpm_discussion_form( $project_id ); ?>
            </div>

    <?php } ?>

<div class="cpm-row cpm-message-page" >
    <div class="cpm-message-list cpm-col-12 cpm-sm-col-12">

         <?php
    if ( cpm_user_can_access( $project_id, 'msg_view_private' ) ) {
        $messages = $msg_obj->get_all( $project_id, true );
    } else {
        $messages = $msg_obj->get_all( $project_id );
    }
    if($messages) {
        echo "<ul class='dicussion_list' >";
        foreach ($messages as $message) {
            $message_sender =  get_userdata($message->post_author) ;
            $private_class = ( $message->private == 'yes' ) ? 'cpm-lock' : 'cpm-unlock';
        ?>
        <li itemid="<?php echo $message->ID ; ?>" data-pid="<?php echo $project_id ?>" class="cpm-col-12"  >
                <div class="cpm-col-10"  >
                      <?php echo cpm_url_user( $message->post_author, true ); ?>
                    <div>
                       <?php echo cpm_excerpt( $message->post_title, 50 ); ?>
                    </div>
                    <div>
                        <?php printf( __( 'by %s on %s', 'cmp' ), $message_sender->display_name, date_i18n( 'F d, Y h:i a', strtotime( $message->post_date ) ) ); ?>
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

            <div class="cpm-col-1 cpm-last-col cpm-right comment-count">
                 <?php echo cpm_get_number( $message->comment_count ); ?>
            </div>
                <div class="clear"></div>
            </li>
        <?php }
        echo "</ul>";
    }
    ?>
    </div>

    <div class="clear"></div>
</div>

