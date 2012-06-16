<?php
$cpm_active_menu = __( 'Invoices', 'cpm' );

require_once CPM_PLUGIN_PATH . '/class/task.php';
require_once CPM_PLUGIN_PATH . '/admin/views/project/header.php';

$project_obj = CPM_Project::getInstance();
$project = $project_obj->get( $project_id );

$invoice_obj = CPM_Invoice::getInstance();
$invoice = $invoice_obj->get( $invoice_id );
$invoice_items = $invoice_obj->get_formatted_items( $invoice_id );
?>

<h3 class="cpm-nav-title">Add new invoice</h3>

<div id="ajax-response"></div>

<form class="cpm-update-invoice cpm-invoice cpm-form" method="post">

    <?php wp_nonce_field( 'cpm_update_invoice' ); ?>

    <input type="hidden" name="project_id" value="<?php echo $project_id; ?>" />
    <input type="hidden" name="client_id" value="<?php echo $project_detail->client; ?>" />
    <input type="hidden" name="invoice_id" value="<?php echo $invoice_id; ?>" />

    <table class="form-table">
        <tbody>
            <tr class="form-field form-required">
                <th scope="row">
                    <label for="invoice_title">Invoice Title <span class="required">*</span></label>
                </th>
                <td>
                    <input name="invoice_title" type="text" id="invoice_title" class="required" value="<?php echo esc_attr( $invoice->title ); ?>" />
                </td>
            </tr>
            <tr class="form-field">
                <th scope="row"><label for="client_id">Client</label></th>
                <td><?php wedevs_dropdown_users( array('name' => 'client_id', 'disabled' => true, 'selected' => $project_detail->client) ); ?></td>
            </tr>
            <tr class="form-field">
                <th scope="row"><label for="gateway">Payment Method</label></th>
                <td>
                    <select name="gateway" id="gateway_id">
                        <option selected="selected" value="offline">Offline</option>
                        <optgroup label="Online Payment">
                            <option value="paypal">Paypal</option>
                        </optgroup>
                    </select>
                </td>
            </tr>
            <tr class="form-field form-required">
                <th scope="row"><label for="due_date">Due date <span class="required">*</span></label></th>
                <td><input name="due_date" autocomplete="off" class="datepicker required" type="text" id="due_date" value="<?php echo esc_attr( date_i18n( 'm/d/Y', strtotime( $invoice->due_date ) ) ); ?>"></td>
            </tr>
            <tr class="form-field form-required">
                <th scope="row"><label for="discount">Invoice Discount </label></th>
                <td>$<input name="due_date" autocomplete="off" type="text" id="discount" value="<?php echo esc_attr( $invoice->discount ); ?>"></td>
            </tr>
        </tbody>
    </table>

    <h3>Initial Invoice Entry</h3>
    <div class="cpm-invoice-wrap">
        <table class="form-table cpm-invoice-items hourly">
            <thead>
                <tr>
                    <th class="fill actions">&nbsp;</th>
                    <th class="fill">Task</th>
                    <th class="fill">Rate</th>
                    <th class="fill">Hour</th>
                    <th class="fill">Tax</th>
                    <th class="fill">Total</th>
                </tr>
            </thead>
            <tbody>
                <?php if ( count( $invoice_items['hour'] ) > 0 ) { ?>
                    <?php foreach ($invoice_items['hour'] as $item) { ?>
                        <tr>
                            <td class="actions">
                                <img style="cursor:pointer; margin:0;" alt="Add an entry" title="Add an entry" class="cpm-add-invoice-item" src="<?php echo CPM_PLUGIN_URI . '/images/add.png'; ?>" />
                                <img style="cursor:pointer; margin:0;" alt="<?php esc_attr_e( 'Remove', 'wedevs' ) ?>" title="<?php esc_attr_e( 'Remove this task', 'wedevs' ) ?>" class="cpm-remove-invoice-item" src="<?php echo CPM_PLUGIN_URI . '/images/ico-delete.png'; ?>">
                            </td>
                            <td>
                                <input type="text" name="entry_name[]" value="<?php echo esc_attr( $item->title ); ?>" size="30" />
                                <a class="toggle-description" href="#">Toggle Description</a>
                                <textarea name="entry_details[]" class="entry-details" style="display:none;" rows="2"><?php echo esc_textarea( $item->text ); ?></textarea>
                            </td>
                            <td><input type="text" class="number price" name="entry_amount[]" value="<?php echo esc_attr( $item->amount ); ?>" size="4" /></td>
                            <td><input type="text" class="qty" name="entry_qty[]" size="3" value="<?php echo esc_attr( $item->qty ); ?>" /></td>
                            <td><input type="text" class="tax" name="entry_tax[]" size="3" value="<?php echo esc_attr( $item->tax ); ?>" />%</td>
                            <td>
                                <span class="total"><?php echo number_format( $item->amount * $item->qty, 2 ); ?></span>
                                <input type="hidden" name="row_total[]" class="entry-total" value="<?php $row_total = $item->amount * $item->qty; echo number_format( $row_total, 2 ); ?>" />
                                <input type="hidden" name="row_tax[]" class="entry-tax" value="<?php echo number_format( ($row_total * $item->tax ) / 100, 2 ); ?>" />
                                <input type="hidden" name="row_type[]" value="item" />
                            </td>
                        </tr>
                    <?php } ?>
                <?php } else { ?>
                    <tr>
                        <td class="actions">
                            <img style="cursor:pointer; margin:0;" alt="Add an entry" title="Add an entry" class="cpm-add-invoice-item" src="<?php echo CPM_PLUGIN_URI . '/images/add.png'; ?>" />
                            <img style="cursor:pointer; margin:0;" alt="<?php esc_attr_e( 'Remove', 'wedevs' ) ?>" title="<?php esc_attr_e( 'Remove this task', 'wedevs' ) ?>" class="cpm-remove-invoice-item" src="<?php echo CPM_PLUGIN_URI . '/images/ico-delete.png'; ?>">
                        </td>
                        <td>
                            <input type="text" name="entry_name[]" size="30" />
                            <a class="toggle-description" href="#">Toggle Description</a>
                            <textarea name="entry_details[]" class="entry-details" style="display:none;" rows="2"></textarea>
                        </td>
                        <td><input type="text" class="number price" name="entry_amount[]" value="0.00" size="4" /></td>
                        <td><input type="text" class="qty" name="entry_qty[]" size="3" value="1" /></td>
                        <td><input type="text" class="tax" name="entry_tax[]" size="3" value="0" />%</td>
                        <td>
                            <span class="total">0.00</span>
                            <input type="hidden" name="row_total[]" class="entry-total" />
                            <input type="hidden" name="row_tax[]" class="entry-tax" />
                            <input type="hidden" name="row_type[]" value="item" />
                        </td>
                    </tr>
                <?php } ?>
            </tbody>
        </table>
        <table class="form-table cpm-invoice-items">
            <thead>
                <tr>
                    <th class="fill actions">&nbsp;</th>
                    <th class="fill">Name</th>
                    <th class="fill">Unit Price</th>
                    <th class="fill">Qty</th>
                    <th class="fill">Tax</th>
                    <th class="fill">Total</th>
                </tr>
            </thead>
            <tbody>
                <?php if ( count( $invoice_items['item'] ) > 0 ) { ?>
                    <?php foreach ($invoice_items['item'] as $item) { ?>
                        <tr>
                            <td class="actions">
                                <img style="cursor:pointer; margin:0;" alt="Add an entry" title="Add an entry" class="cpm-add-invoice-item" src="<?php echo CPM_PLUGIN_URI . '/images/add.png'; ?>" />
                                <img style="cursor:pointer; margin:0;" alt="<?php esc_attr_e( 'Remove', 'wedevs' ) ?>" title="<?php esc_attr_e( 'Remove this task', 'wedevs' ) ?>" class="cpm-remove-invoice-item" src="<?php echo CPM_PLUGIN_URI . '/images/ico-delete.png'; ?>">
                            </td>
                            <td>
                                <input type="text" name="entry_name[]" value="<?php echo esc_attr( $item->title ); ?>" size="30" />
                                <a class="toggle-description" href="#">Toggle Description</a>
                                <textarea name="entry_details[]" class="entry-details" style="display:none;" rows="2"><?php echo esc_textarea( $item->text ); ?></textarea>
                            </td>
                            <td><input type="text" class="number price" name="entry_amount[]" value="<?php echo esc_attr( $item->amount ); ?>" size="4" /></td>
                            <td><input type="text" class="qty" name="entry_qty[]" size="3" value="<?php echo esc_attr( $item->qty ); ?>" /></td>
                            <td><input type="text" class="tax" name="entry_tax[]" size="3" value="<?php echo esc_attr( $item->tax ); ?>" />%</td>
                            <td>
                                <span class="total"><?php echo number_format( $item->amount * $item->qty, 2 ); ?></span>
                                <input type="hidden" name="row_total[]" class="entry-total" value="<?php $row_total = $item->amount * $item->qty; echo number_format( $row_total, 2 ); ?>" />
                                <input type="hidden" name="row_tax[]" class="entry-tax" value="<?php echo number_format( ($row_total * $item->tax ) / 100, 2 ); ?>" />
                                <input type="hidden" name="row_type[]" value="item" />
                            </td>
                        </tr>
                    <?php } ?>
                <?php } else { ?>
                    <tr>
                        <td class="actions">
                            <img style="cursor:pointer; margin:0;" alt="Add an entry" title="Add an entry" class="cpm-add-invoice-item" src="<?php echo CPM_PLUGIN_URI . '/images/add.png'; ?>" />
                            <img style="cursor:pointer; margin:0;" alt="<?php esc_attr_e( 'Remove', 'wedevs' ) ?>" title="<?php esc_attr_e( 'Remove this task', 'wedevs' ) ?>" class="cpm-remove-invoice-item" src="<?php echo CPM_PLUGIN_URI . '/images/ico-delete.png'; ?>">
                        </td>
                        <td>
                            <input type="text" name="entry_name[]" size="30" />
                            <a class="toggle-description" href="#">Toggle Description</a>
                            <textarea name="entry_details[]" class="entry-details" style="display:none;" rows="2"></textarea>
                        </td>
                        <td><input type="text" class="number price" name="entry_amount[]" value="0.00" size="4" /></td>
                        <td><input type="text" class="qty" name="entry_qty[]" size="3" value="1" /></td>
                        <td><input type="text" class="tax" name="entry_tax[]" size="3" value="0" />%</td>
                        <td>
                            <span class="total">0.00</span>
                            <input type="hidden" name="row_total[]" class="entry-total" />
                            <input type="hidden" name="row_tax[]" class="entry-tax" />
                            <input type="hidden" name="row_type[]" value="item" />
                        </td>
                    </tr>
            <?php } ?>
            </tbody>
        </table>
        <div class="cpm-invoice-total-box">
            <table class="cpm-invoice-totals">
                <thead>
                    <tr id="cpm-subtotal-row">
                        <th>Subtotal</th>
                        <td>
                            $<span class="subtotal"><?php echo $invoice->subtotal; ?></span>
                            <input type="hidden" class="subtotal" name="invoice-subtotal" value="<?php echo $invoice->subtotal; ?>" />
                        </td>
                    </tr>
                    <tr id="cpm-tax-row">
                        <th>Tax</th>
                        <td>
                            $<span class="tax"><?php echo $invoice->tax; ?></span>
                            <input type="hidden" class="tax" name="invoice-tax" value="<?php echo $invoice->tax; ?>" />
                        </td>
                    </tr>
                    <tr id="cpm-discount-total-row">
                        <th>Discount</th>
                        <td>
                            - $<span class="invoice-discount"><?php echo $invoice->discount; ?></span>
                            <input type="hidden" class="invoice-discount" name="invoice-discount" value="<?php echo $invoice->discount; ?>" />
                        </td>
                    </tr>
                    <tr class="divider">
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr id="cpm-amount-row">
                        <th class="fill">Invoice Total</th>
                        <td class="fill">
                            $<span class="invoice-total"><?php echo $invoice->total; ?></span>
                            <input type="hidden" class="invoice-total" name="invoice-total" value="<?php echo $invoice->total; ?>" />
                        </td>
                    </tr>
                    <tr id="cpm-paid-row">
                        <th>Total Paid</th>
                        <td>$<span class="total-paid"><?php echo $invoice->paid; ?></span></td>
                    </tr>
                    <tr id="cpm-invoice-total-row">
                        <th class="fill">Balance</th>
                        <td class="fill">
                            $<span class="invoice-balance"><?php echo ( $invoice->total - $invoice->paid ); ?></span>
                            <input type="hidden" class="invoice-balance" name="balance" value="<?php echo ( $invoice->total - $invoice->paid ); ?>" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="cpm-clear"></div>

        <table class="cpm-table">
            <tr>
                <td class="no-border">
                    <h3><?php _e( 'Terms', 'cpm' ); ?>:</h3>
                    <textarea name="invoice-terms" id="invoice-terms" rows="4" cols="50">Here is the default terms</textarea>
                </td>
                <td class="no-border">
                    <h3><?php _e( 'Notes Visible to Client', 'cpm' ); ?>:</h3>
                    <textarea name="invoice-notes" id="invoice-notes" rows="4" cols="50"></textarea>
                </td>
            </tr>
        </table>

        <p class="submit">
            <input type="hidden" name="action" value="cpm_update_invoice" />
            <input type="submit" name="update_invoice" id="update_invoice" class="button-primary" value="Update Invoice">
        </p>
    </div>
</form>

<script type="text/tmpl" id="cpm-form-invoice-tmpl">
    <tr>
        <td class="actions">
            <img style="cursor:pointer; margin:0;" alt="Add an entry" title="Add an entry" class="cpm-add-invoice-item" src="<?php echo CPM_PLUGIN_URI . '/images/add.png'; ?>" />
            <img style="cursor:pointer; margin:0;" alt="<?php esc_attr_e( 'Remove', 'wedevs' ) ?>" title="<?php esc_attr_e( 'Remove this task', 'wedevs' ) ?>" class="cpm-remove-invoice-item" src="<?php echo CPM_PLUGIN_URI . '/images/ico-delete.png'; ?>">
        </td>
        <td>
            <input type="text" class="required" name="entry_name[]" size="30" />
            <a class="toggle-description" href="#">Toggle Description</a>
            <textarea name="entry_details[]" class="entry-details" style="display:none;" rows="2"></textarea>
        </td>
        <td><input type="text" class="required number price" name="entry_amount[]" value="0.00" size="4" /></td>
        <td><input type="text" class="qty" name="entry_qty[]" size="3" value="1" /></td>
        <td><input type="text" class="tax" name="entry_tax[]" size="3" value="0" />%</td>
        <td>
            <span class="total">0.00</span>
            <input type="hidden" name="row_total[]" class="entry-total" />
            <input type="hidden" name="row_tax[]" class="entry-tax" />
            <input type="hidden" name="row_type[]" value="<%= type %>" />
        </td>
    </tr>
</script>