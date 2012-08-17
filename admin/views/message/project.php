<?php
$cpm_active_menu = __( 'Messages', 'cpm' );

require_once CPM_PLUGIN_PATH . '/admin/tables/messages.php';
require_once CPM_PLUGIN_PATH . '/admin/views/project/header.php';
$milestone_obj = CPM_Milestone::getInstance();
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
                <th scope="row"><label for="message_privacy">Privacy</label></th>
                <td><input type="radio" name="message_privacy" value="1" /> Yes
                    <input type="radio" checked="checked" name="message_privacy" value="0" /> No
                    <span class="description">Private messages are visible only to members. Client will not be able to see them.</span>
                </td>
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
                    <?php cpm_upload_field(); ?>
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

<?php
$message_list = new CPM_Message_List_Table( $project_id );
$message_list->prepare_items();

$message_list->views();

//$project_list_table->search_box( '', 'post' );

$message_list->display();
?>