<?php
$cpm_active_menu = __( 'Invoices', 'cpm' );

require_once CPM_PLUGIN_PATH . '/class/task.php';
require_once CPM_PLUGIN_PATH . '/admin/views/project/header.php';

$project_obj = CPM_Project::getInstance();
$project = $project_obj->get( $project_id );
?>

<h3 class="cpm-nav-title">Add new invoice</h3>

<div id="ajax-response"></div>

<form class="cpm-new-invoice cpm-invoice cpm-form" method="post">
    <?php wp_nonce_field( 'cpm_new_invoice' ); ?>
    <input type="hidden" name="project_id" value="<?php echo $project_id ?>" />
    <input type="hidden" name="client_id" value="<?php echo $project_detail->client ?>" />

    <table class="form-table">
        <tbody>
            <tr class="form-field form-required">
                <th scope="row">
                    <label for="invoice_title">Invoice Title <span class="required">*</span></label>
                </th>
                <td>
                    <input name="invoice_title" type="text" id="invoice_title" class="required" value="" aria-required="true">
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
            <tr class="form-field">
                <th scope="row"><label for="taxable">Taxable</label></th>
                <td><input type="radio" name="taxable" value="1" /> Yes
                    <input type="radio" checked="checked" name="taxable" id="taxable" value="0" /> No
                </td>
            </tr>
            <tr class="form-field form-required">
                <th scope="row"><label for="due_date">Due date <span class="required">*</span></label></th>
                <td><input name="due_date" autocomplete="off" class="datepicker required" type="text" id="due_date" value=""></td>
            </tr>
            <tr class="form-field form-required">
                <th scope="row"><label for="discount">Invoice Discount </label></th>
                <td>$<input name="due_date" autocomplete="off" type="text" id="discount" value="0.00"></td>
            </tr>
        </tbody>
    </table>

    <h3>Initial Invoice Entry</h3>
    <div class="cpm-invoice-wrap">
        <table class="form-table cpm-invoice-items">
            <thead>
                <tr>
                    <th>&nbsp;</th>
                    <th>Task</th>
                    <th>Rate</th>
                    <th>Hour</th>
                    <th>Tax</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="actions">
                        <img style="cursor:pointer; margin:0;" alt="Add an entry" title="Add an entry" class="cpm-add-invoice-item" src="<?php echo CPM_PLUGIN_URI . '/images/add.png'; ?>" />
                        <img style="cursor:pointer; margin:0;" alt="<?php esc_attr_e( 'Remove', 'wedevs' ) ?>" title="<?php esc_attr_e( 'Remove this task', 'wedevs' ) ?>" class="cpm-remove-invoice-item" src="<?php echo CPM_PLUGIN_URI . '/images/ico-delete.png'; ?>">
                    </td>
                    <td>
                        <input type="text" class="required" name="entry_name[0]" size="30" />
                        <a class="toggle-description" href="#">Toggle time entry notes</a>
                        <textarea name="entry_details[]" class="entry-details" style="display:none;" rows="2"></textarea>
                    </td>
                    <td><input type="text" class="required number price" name="entry_amount[0]" value="0.00" size="4" /></td>
                    <td><input type="text" class="qty" name="entry_qty[0]" size="3" value="1" /></td>
                    <td><input type="text" class="tax" name="entry_tax[0]" size="3" value="0" />%</td>
                    <td>
                        <span class="total">0.00</span>
                        <input type="hidden" name="entry_total[0]" class="entry-total" />
                        <input type="hidden" name="entry_tax[0]" class="entry-tax" />
                    </td>
                </tr>
            </tbody>
        </table>
        <table class="form-table cpm-invoice-items">
            <thead>
                <tr>
                    <th>&nbsp;</th>
                    <th>Name</th>
                    <th>Unit Price</th>
                    <th>Qty</th>
                    <th>Tax</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="actions">
                        <img style="cursor:pointer; margin:0;" alt="Add an entry" title="Add an entry" class="cpm-add-invoice-item" src="<?php echo CPM_PLUGIN_URI . '/images/add.png'; ?>" />
                        <img style="cursor:pointer; margin:0;" alt="<?php esc_attr_e( 'Remove', 'wedevs' ) ?>" title="<?php esc_attr_e( 'Remove this task', 'wedevs' ) ?>" class="cpm-remove-invoice-item" src="<?php echo CPM_PLUGIN_URI . '/images/ico-delete.png'; ?>">
                    </td>
                    <td>
                        <input type="text" class="required" name="entry_name[0]" size="30" />
                        <a class="toggle-description" href="#">Toggle Description</a>
                        <textarea name="entry_details[]" class="entry-details" style="display:none;" rows="2"></textarea>
                    </td>
                    <td><input type="text" class="required number price" name="entry_amount[0]" value="0.00" size="4" /></td>
                    <td><input type="text" class="qty" name="entry_qty[0]" size="3" value="1" /></td>
                    <td><input type="text" class="tax" name="entry_tax[0]" size="3" value="0" />%</td>
                    <td>
                        <span class="total">0.00</span>
                        <input type="hidden" name="entry_total[0]" class="entry-total" />
                        <input type="hidden" name="entry_tax[0]" class="entry-tax" />
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="cpm-invoice-total-box">
            <table class="cpm-invoice-totals">
                <thead>
                    <tr id="cpm-subtotal-row">
                        <th>Subtotal</th>
                        <td>
                            $<span class="subtotal">0.00</span>
                            <input type="hidden" class="subtotal" name="invoice-subtotal" value="0.00" />
                        </td>
                    </tr>
                    <tr id="cpm-discount-total-row">
                        <th>Discount</th>
                        <td>
                            - $<span class="invoice-discount">0.00</span>
                            <input type="hidden" class="invoice-discount" name="invoice-discount" value="0.00" />
                        </td>
                    </tr>
                    <tr id="cpm-tax-row">
                        <th>Tax</th>
                        <td>
                            $<span class="tax">0.00</span>
                            <input type="hidden" class="tax" name="invoice-tax" value="0.00" />
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
                            $<span class="invoice-total">0.00</span>
                            <input type="hidden" class="invoice-total" name="invoice-total" value="0.00" />
                        </td>
                    </tr>
                    <tr id="cpm-paid-row">
                        <th>Total Paid</th>
                        <td>$<span class="total-paid">0.00</span></td>
                    </tr>
                    <tr id="cpm-invoice-total-row">
                        <th class="fill">Balance</th>
                        <td class="fill">
                            $<span class="invoice-balance">0.00</span>
                            <input type="hidden" class="invoice-balance" name="balance" value="" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="cpm-clear"></div>

        <p class="submit">
            <input type="hidden" name="action" value="cpm_new_invoice" />
            <input type="submit" name="create_invoice" id="create_invoice" class="button-primary" value="Add Invoice">
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
            <input type="text" class="required" name="entry_name[0]" size="30" />
            <a class="toggle-description" href="#">Toggle Description</a>
            <textarea name="entry_details[]" class="entry-details" style="display:none;" rows="2"></textarea>
        </td>
        <td><input type="text" class="required number price" name="entry_amount[0]" value="0.00" size="4" /></td>
        <td><input type="text" class="qty" name="entry_qty[0]" size="3" value="1" /></td>
        <td><input type="text" class="tax" name="entry_tax[0]" size="3" value="0" />%</td>
        <td>
            <span class="total">0.00</span>
            <input type="hidden" name="entry_total[0]" class="entry-total" />
            <input type="hidden" name="entry_tax[0]" class="entry-tax" />
        </td>
    </tr>
</script>


<script type="text/javascript">
    var i = 1;
</script>