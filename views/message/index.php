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
<div class="cpm-row cpm-message-page">
    <div class="cpm-message-list">
        <?php if ( $can_create ) { ?>
        <div>
            <a class="cpm-btn cpm-plus-white cpm-new-message-btn" href="JavaScript:void(0)" id="cpm-add-message" > <?php _e( 'ADD NEW DISCUSSION', 'cpm' ); ?> </a>
        </div>
    <?php } ?>

         <?php
    if ( cpm_user_can_access( $project_id, 'msg_view_private' ) ) {
        $messages = $msg_obj->get_all( $project_id, true );
    } else {
        $messages = $msg_obj->get_all( $project_id );
    }
    if($messages) {
        echo "<ul class='dicussion_list' >";
        foreach ($messages as $message) {
            $private_class = ( $message->private == 'yes' ) ? 'cpm-lock' : 'cpm-unlock';
        ?>
        <li itemid="<?php echo $message->ID ; ?>" data-pid="<?php echo $project_id ?>" >
                <div class="cpm-col-2">
                    <?php echo cpm_url_user( $message->post_author, true ); ?>
                </div>
                <div class="cpm-col-10">
                    <div>
                        <a href="#message_show"> <?php echo cpm_excerpt( $message->post_title, 50 ); ?>
                        <span class="cpm-message-action">
                            <?php if ( $message->post_author == get_current_user_id() || cpm_user_can_access( $project_id ) ) { ?>
                    <a href="JavaScript:void(0)" class="delete-message cpm-icon-delete" title="<?php esc_attr_e( 'Delete this message', 'cpm' ); ?>" <?php cpm_data_attr( array('msg_id' => $message->ID, 'project_id' => $project_id, 'confirm' => __( 'Are you sure to delete this message?', 'cpm' )) ); ?>>
                        <span><?php _e( 'Delete', 'cpm' ); ?></span>
                    </a>
                    <span class="<?php echo $private_class; ?>"></span>
                <?php } ?>
                        </span>
                             </a>
                    </div>
                    <div>
                        <?php echo cpm_excerpt( $message->post_content, 20 ) ?>
                    </div>
                    <div>
                        <?php echo date_i18n( 'j M, Y', strtotime( $message->post_date ) ); ?>
                        <span class="comment-count"><?php echo cpm_get_number( $message->comment_count ); ?></span>
                    </div>
                </div>
                <div class="clear"></div>
            </li>
        <?php }
        echo "</ul>";
    }
    ?>
    </div>

    <div class="cpm-message-body" >

        <div id="cpm-signle-message" >
            <?php
                if($messages){
                $single_id = $messages[0]->ID ;
                echo cpm_discussion_single($single_id, $project_id);
                } else {
                    echo "<h2 class='cpm-error'>"._e( 'Your Message Box is empty', 'cpm' )."</h2>";
                }
            ?>
        </div>
         <?php if ( $can_create ) { ?>
            <div class="cpm-new-message-form">
                <h3><?php _e( 'Create a new message', 'cpm' ); ?></h3>

                <?php echo cpm_discussion_form( $project_id ); ?>
            </div>
        <?php } ?>


    </div>
    <div class="clear"></div>
</div>

