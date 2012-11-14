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

<form class="cpm-new-message cpm-form" style="display: none">

    <?php wp_nonce_field( 'cpm_message' ); ?>

    <table class="form-table">
        <tbody>
            
            <tr class="form-field form-required">
                <th scope="row">
                    <label for="message_title">Title <span class="required">*</span></label>
                </th>
                <td>
                    <input name="message_title" type="text" id="message_title" value="" class="required">
                </td>
            </tr>

            <tr class="form-field">
                <th scope="row"><label for="message_detail">Message <span class="required">*</span></label></th>
                <td><textarea name="message_detail" class="required" id="message_detail" cols="30" rows="10"></textarea></td>
            </tr>

            <tr class="form-field">
                <th scope="row"><label for="milestone">Milestone</label></th>
                <td>
                    <select name="milestone" id="milestone">
                        <option value="0"><?php _e( '-- None --', 'cpm' ) ?></option>
                        <?php echo $milestone_obj->get_dropdown( $project_id ); ?>
                    </select>

                </td>
            </tr>

            <tr class="form-field">
                <th scope="row"><label for="cpm-attachment">Attachment</label></th>
                <td>
                    <?php cpm_upload_field(0); ?>
                </td>
            </tr>

            <tr class="form-field">
                <th scope="row"><label for="cpm-notify">Notify</label></th>
                <td>
                    <?php cpm_user_checkboxes( $project_id ); ?>
                </td>
            </tr>

        </tbody>
    </table>

    <p class="submit">
        <input type="hidden" name="action" value="cpm_new_message" />
        <input type="hidden" name="project_id" value="<?php echo $project_id; ?>" />
        <input type="submit" name="create_message" id="create_message" class="button-primary" value="Add Message">
    </p>
</form>

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
            <?php if ( $message->post_content ) {
                printf( '<span class="excerpt"> - %s</span>', cpm_excerpt( $message->post_content, 100) );
            } ?>
            </a>
        </td>
        <td class="date"><span><?php echo date_i18n( 'j M, Y', strtotime( $message->post_date) ); ?></span></td>
        <td class="comment-count"><span><?php echo cpm_get_number( $message->comment_count ); ?></span></td>
    </tr>
    <?php
}
?>
</table>