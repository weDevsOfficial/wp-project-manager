<?php
/**
 * This page displays all the messages attached with a project
 *
 */

$msg_obj = CPM_Message::getInstance();
$pro_obj = CPM_Project::getInstance();

cpm_get_header( __( 'Messages', 'cpm' ), $project_id );
$can_create = cpm_user_can_access( $project_id, 'create_message' );
?>

<h3 class="cpm-nav-title">
    <?php
    _e( 'Messages', 'cpm' );
    
    if ( $can_create ) {
        ?>
        <a class="add-new-h2 cpm-new-message-btn" href="#"><?php _e( 'Add New', 'cpm' ); ?></a>
    <?php } ?>
</h3>


<?php if ( $can_create ) { ?>
    <div class="cpm-new-message-form">
        <h3><?php _e( 'Create a new message', 'cpm' ); ?></h3>

        <?php echo cpm_message_form( $project_id ); ?>
    </div>
<?php } ?>

<table class="cpm-messages-table">
    <?php
    if ( cpm_user_can_access( $project_id, 'msg_view_private' ) ) {
        $messages = $msg_obj->get_all( $project_id, true );
    } else {
        $messages = $msg_obj->get_all( $project_id );
    }

    foreach ($messages as $message) {
        $private_class = ( $message->private == 'yes' ) ? 'cpm-lock' : 'cpm-unlock';
        ?>
        <tr>
            <td class="author">
                <span class="cpm-avatar"><?php echo cpm_url_user( $message->post_author, true, 32 ); ?></span>
            </td>
            <td class="message">
                <a href="<?php echo cpm_url_single_message( $project_id, $message->ID ); ?>">
                    <span class="title"><?php echo cpm_excerpt( $message->post_title, 50 ); ?></span>
                    <?php
                    if ( $message->post_content ) {
                        printf( '<span class="excerpt"> - %s</span>', cpm_excerpt( $message->post_content, 70 ) );
                    }
                    ?>
                </a>
            </td>
            <td class="date"><span><?php echo date_i18n( 'j M, Y', strtotime( $message->post_date ) ); ?></span></td>
            <td class="comment-count"><span><?php echo cpm_get_number( $message->comment_count ); ?></span></td>
            <td class="cpm-actions">
                <?php if ( $message->post_author == get_current_user_id() || cpm_user_can_access( $project_id ) ) { ?>
                    <a href="#" class="delete-message cpm-icon-delete" title="<?php esc_attr_e( 'Delete this message', 'cpm' ); ?>" <?php cpm_data_attr( array('msg_id' => $message->ID, 'project_id' => $project_id, 'confirm' => __( 'Are you sure to delete this message?', 'cpm' )) ); ?>>
                        <span><?php _e( 'Delete', 'cpm' ); ?></span>
                    </a>
                    <span class="<?php echo $private_class; ?>"></span>
                <?php } ?>
            </td>
        </tr>
        <?php
    }
    ?>
</table>

<?php
if ( !$messages ) {
    cpm_show_message( __( 'No messages found! How about adding one?', 'cpm' ) );
}
