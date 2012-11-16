<?php
/**
 * This page displays all the messages attached with a project
 *
 * TODO: fix views (All, Published, Trash links)
 * TODO: fix search and bulk actions
 * TODO: fix columns
 */
$cpm_active_menu = __( 'Messages', 'cpm' );

$post_type = 'message';
$milestone_obj = CPM_Milestone::getInstance();
$msg_obj = CPM_Message::getInstance();

include CPM_PLUGIN_PATH . '/admin/views/project/header.php';
?>

<h3 class="cpm-nav-title">
    Messages <a class="add-new-h2 cpm-new-message-btn" href="<?php echo cpm_url_new_message( $project_id ) ?>">Add New</a>
</h3>

<div class="cpm-new-message-form">
    <h3><?php _e( 'Create a new message', 'cpm' ); ?></h3>

    <?php echo cpm_message_form( $project_id ); ?>
</div>

<table class="cpm-messages-table">
    <?php
    $messages = $msg_obj->get_all( $project_id );
    foreach ($messages as $message) {
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
                        printf( '<span class="excerpt"> - %s</span>', cpm_excerpt( $message->post_content, 100 ) );
                    }
                    ?>
                </a>
            </td>
            <td class="date"><span><?php echo date_i18n( 'j M, Y', strtotime( $message->post_date ) ); ?></span></td>
            <td class="comment-count"><span><?php echo cpm_get_number( $message->comment_count ); ?></span></td>
            <td class="cpm-actions">
                <a href="#" data-msg_id="<?php echo $message->ID; ?>" data-project_id="<?php echo $project_id; ?>" data-confirm="<?php esc_attr_e( 'Are you sure to delete this message?', 'cpm' ); ?>" class="delete-message">
                    <?php _e( 'Delete', 'cpm' ); ?>
                </a>
            </td>
        </tr>
        <?php
    }
    ?>
</table>