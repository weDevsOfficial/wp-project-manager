<?php
$cpm_active_menu = __( 'Invoices', 'cpm' );

require_once CPM_PLUGIN_PATH . '/admin/views/project/header.php';

$invoice_obj = CPM_Invoice::getInstance();
$invoice = $invoice_obj->get( $invoice_id );
$invoice_items = $invoice_obj->get_items( $invoice_id );

//var_dump( $invoice );
$project_obj = CPM_Project::getInstance();
$project = $project_obj->get( $project_id );
//var_dump( $invoice_items);
?>
<h3 class="cpm-nav-title">Invoice Details</h3>

<div id="ajax-response"></div>

<div class="cpm-invoice">
    <form class="cpm-update-invoice cpm-form" method="post">

        <?php wp_nonce_field( 'cpm_update_invoice' ); ?>
        <input type="hidden" name="project_id" value="<?php echo $project_id ?>" />
        <input type="hidden" name="invoice_id" value="<?php echo $invoice_id ?>" />

        <table class="form-table">
            <tbody>
                <tr>
                    <th>Invoice Title: </th>
                    <td>
                        <input name="invoice_title" type="text" id="invoice_title" class="required" value="<?php echo esc_attr( stripslashes( $invoice->title ) ); ?>" aria-required="true" />
                    </td>
                </tr>
                <tr>
                    <th>Project: </th>
                    <td><a href="<?php echo cpm_project_details_url( $project_id ); ?>"><?php echo $project->name; ?></a></td>
                </tr>
                <tr>
                    <th scope="row"><label for="client_id">Client</label></th>
                    <td><?php wedevs_dropdown_users( array('name' => 'client_id', 'disabled' => true, 'selected' => $project_detail->client) ); ?></td>
                </tr>
                <tr>
                    <th>Due Date: </th>
                    <td><input name="due_date" autocomplete="off" class="datepicker required" type="text" id="due_date" value="<?php echo esc_attr( date_i18n( 'm/d/Y', strtotime( $invoice->due_date ) ) ); ?>"></td>
                </tr>
                <tr>
                    <th>Invoice Total: </th>
                    <td><input name="total" disabled="disabled" class="total" type="text" value="<?php echo esc_attr( $invoice->total ); ?>"></td>
                </tr>
                <tr>
                    <th>Amount Paid: </th>
                    <td><input name="total" disabled="disabled" class="total" type="text" value="<?php echo esc_attr( $invoice->paid ); ?>"></td>
                </tr>
                <tr class="form-field">
                    <th scope="row"><label for="gateway">Payment Method</label></th>
                    <td>
                        <select name="gateway" id="gateway_id">
                            <option <?php selected( $invoice->gateway, 'offline' ); ?> value="offline">Offline</option>
                            <optgroup label="Online Payment">
                                <option <?php selected( $invoice->gateway, 'paypal' ); ?> value="paypal">Paypal</option>
                            </optgroup>
                        </select>
                    </td>
                </tr>
                <tr class="form-field">
                    <th scope="row"><label for="pay_status">Payment Status</label></th>
                    <td>
                        <select name="pay_status" id="pay_status">
                            <option <?php selected( $invoice->pay_status, 'UNPAID' ); ?> value="UNPAID">Unpaid</option>
                            <option <?php selected( $invoice->pay_status, 'PAID' ); ?> value="PAID">Paid</option>
                            <option <?php selected( $invoice->pay_status, 'OVERDUE' ); ?> value="OVERDUE">Overdue</option>
                        </select>
                    </td>
                </tr>
                <tr class="form-field">
                    <th scope="row"><label for="taxable">Taxable</label></th>
                    <td><input type="radio" <?php checked($invoice->taxable, '1'); ?> name="taxable" value="1" /> Yes
                        <input type="radio" <?php checked($invoice->taxable, '0'); ?> name="taxable" id="taxable" value="0" /> No
                    </td>
                </tr>
                <tr class="form-field">
                    <th scope="row"><label for="actions">Actions</label></th>
                    <td>
                        <ul>
                            <li><a href="">Send to client</a></li>
                            <li><a href="">Print</a></li>
                            <li><a href="">PDF</a></li>
                        </ul>
                    </td>
                </tr>
            </tbody>
        </table>

        <p class="submit">
            <input type="hidden" name="action" value="cpm_update_invoice" />
            <input type="submit" name="update_invoice" id="update_invoice" class="button-primary" value="Update Invoice">
        </p>


        <h3>Invoice Entry</h3>
        <div class="cpm-form">
            <table class="form-table cpm-invoice-items">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Total</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tfoot>
                    <tr>
                        <th colspan="2">&nbsp;</th>
                        <th>Total</th>
                        <th colspan="2">
                            <span class="grand-total">$<?php echo $invoice->total; ?></span>
                            <input type="hidden" name="grand_total" value="<?php echo $invoice->total; ?>" class="grand-total-hidden" />
                        </th>
                    </tr>
                </tfoot>
                <tbody>
                    <?php
                    if ( $invoice_items ) {
                        //var_dump( $invoice_items );
                        $i = 0;
                        foreach ($invoice_items as $item) {
                            $i++;
                            ?>
                            <tr>
                                <td>
                                    <input type="text" class="required" name="entry_name[<?php echo $i; ?>]" value="<?php echo esc_attr( $item->title ) ?>" size="30" />
                                    <a class="toggle-description" href="#">Toggle Description</a>
                                    <textarea name="entry_details[<?php echo $i; ?>]" class="entry-details" style="display:none;" rows="2"><?php echo esc_textarea( $item->text ); ?></textarea>
                                </td>
                                <td><input type="text" class="qty" value="<?php echo esc_attr( $item->qty ); ?>" name="entry_qty[<?php echo $i; ?>]" size="3" /></td>
                                <td><input type="text" class="required number price" name="entry_amount[<?php echo $i; ?>]" value="<?php echo $item->amount; ?>" size="4" /></td>
                                <td>
                                    <span class="total">$<?php echo ($item->qty * $item->amount); ?></span>
                                    <input type="hidden" name="entry_total[<?php echo $i; ?>]" class="entry-total" value="<?php echo ($item->qty * $item->amount); ?>" />
                                </td>
                                <td>
                                    <img style="cursor:pointer; margin:0;" alt="Add an entry" title="Add an entry" class="cpm-add-invoice-item" src="<?php echo CPM_PLUGIN_URI . '/images/add.png'; ?>" />
                                    <img style="cursor:pointer; margin:0;" alt="<?php esc_attr_e( 'Remove this', 'wedevs' ) ?>" title="<?php esc_attr_e( 'Remove this', 'wedevs' ) ?>" class="cpm-remove-invoice-item" src="<?php echo CPM_PLUGIN_URI . '/images/ico-delete.png'; ?>" />
                                </td>
                            </tr>
                        <?php } ?>
                    <?php } ?>
                </tbody>
            </table>
        </div>
    </form>
</div>


<script type="text/tmpl" id="cpm-form-invoice-tmpl">
    <tr>
        <td>
            <input type="text" class="required" name="entry_name[{0}]" size="30" />
            <a class="toggle-description" href="#">Toggle Description</a>
            <textarea name="entry_details[{0}]" class="entry-details" style="display:none;" rows="2"></textarea>
        </td>
        <td><input type="text" class="qty" name="entry_qty[{0}]" size="3" value="1" /></td>
        <td><input type="text" class="required number price" name="entry_amount[{0}]" size="4" /></td>
        <td>
            <span class="total">$0</span>
            <input type="hidden" name="entry_total[{0}]" class="entry-total" />
        </td>
        <td>
            <img style="cursor:pointer; margin:0;" alt="Add an entry" title="Add an entry" class="cpm-add-invoice-item" src="<?php echo CPM_PLUGIN_URI . '/images/add.png'; ?>" />
            <img style="cursor:pointer; margin:0;" alt="<?php esc_attr_e( 'Remove', 'wedevs' ) ?>" title="<?php esc_attr_e( 'Remove', 'wedevs' ) ?>" class="cpm-remove-invoice-item" src="<?php echo CPM_PLUGIN_URI . '/images/ico-delete.png'; ?>">
        </td>
    </tr>
</script>

<script type="text/javascript">
    var i = <?php echo $i+1; ?>;
</script>