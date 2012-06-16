<?php
$cpm_active_menu = __( 'Invoices', 'cpm' );

require_once CPM_PLUGIN_PATH . '/admin/views/project/header.php';

$invoice_obj = CPM_Invoice::getInstance();
$invoice = $invoice_obj->get( $invoice_id );
$invoice_items = $invoice_obj->get_formatted_items( $invoice_id );

//var_dump( $invoice );
$project_obj = CPM_Project::getInstance();
$project = $project_obj->get( $project_id );
//var_dump( $invoice_items);

$subtotal = 0;
$tax = 0;
?>
<h3 class="cpm-nav-title">Invoice Details</h3>

<div id="ajax-response"></div>

<div class="cpm-invoice invoice-display">

    <h2 class="invoice-title">Invoice</h2>

    <div class="invoice-top">
        <div class="invoice-address">
            <div class="invoice-from">
                weDevs<br />
                Rajshahi<br />
                Bangladesh
            </div>
            <div class="invoice-to">
                Sample Organization<br>
                John Smith<br>
                2770 Dufferin St.<br>
                Suite 201<br>
                Toronto ON&nbsp;&nbsp;M6B 3R7<br>
                Canada
            </div>
        </div>
        <div class="invoice-logo">
            <div class="invoice-from">&nbsp;</div>
            <div class="invoice-meta">
                <table class="cpm-table">
                    <tbody>
                        <tr>
                            <th>Invoice #:
                            </th>
                            <td><?php echo str_pad( $invoice->id, 6, STR_PAD_LEFT, 0 ); ?></td>
                        </tr>
                        <tr>
                            <th>Date:</th>
                            <td><?php echo cpm_show_date( $invoice->created ); ?></td>
                        </tr>
                        <tr>
                            <th>Amount Due</th>
                            <td><?php echo cpm_get_currency() . number_format( $invoice->total - $invoice->paid, 2 ); ?></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <div class="inv-items-container">

        <?php if ( count( $invoice_items['hour'] ) > 0 ) { ?>
            <table class="cpm-table table-bordered cpm-invoice-items">
                <thead>
                    <tr>
                        <th class="fill">Task</th>
                        <th class="fill">Entry Notes</th>
                        <th class="fill">Rate</th>
                        <th class="fill">Hours</th>
                        <th class="fill">Line Total</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($invoice_items['hour'] as $item) { ?>
                        <tr>
                            <td class="col-task"><?php echo stripslashes( $item->title ); ?></td>
                            <td><?php echo stripslashes( $item->text ); ?></td>
                            <td class="col-unit"><?php echo number_format( $item->amount, 2 ) ?></td>
                            <td class="col-qty"><?php echo $item->qty; ?></td>
                            <td class="col-total"><?php echo number_format( ( $item->qty * $item->amount ), 2 ); ?></td>
                        </tr>
                        <?php
                        $subtotal += $item->qty * $item->amount;
                        $tax += ( $item->qty * $item->amount * $item->tax ) / 100;
                    }
                    ?>
                </tbody>
            </table>
        <?php } ?>

        <?php if ( count( $invoice_items['item'] ) > 0 ) { ?>
            <table class="cpm-table table-bordered cpm-invoice-items">
                <thead>
                    <tr>
                        <th class="fill">Item</th>
                        <th class="fill">Description</th>
                        <th class="fill">Unit Cost</th>
                        <th class="fill">Qty</th>
                        <th class="fill">Price</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($invoice_items['item'] as $item) { ?>
                        <tr>
                            <td class="col-task"><?php echo stripslashes( $item->title ); ?></td>
                            <td><?php echo stripslashes( $item->text ); ?></td>
                            <td class="col-unit"><?php echo number_format( $item->amount, 2 ) ?></td>
                            <td class="col-qty"><?php echo $item->qty; ?></td>
                            <td class="col-total"><?php echo number_format( ( $item->qty * $item->amount ), 2 ); ?></td>
                        </tr>
                        <?php
                        $subtotal += $item->qty * $item->amount;
                        $tax += ( $item->qty * $item->amount * $item->tax ) / 100;
                    }
                    ?>
                </tbody>
            </table>
        <?php } ?>
    </div> <!-- .inv-items-container -->

    <table class="cpm-table table-bordered invoice-totals">
        <tbody>
            <tr>
                <td class="col-space" rowspan="6">
                    <div class="invoice-notes">
                        <?php if ( !empty( $invoice->note ) ) { ?>
                            <strong>Notes:</strong><br />
                            <?php echo stripslashes( $invoice->note ); ?>
                        <?php } ?>
                    </div>
                </td>
                <th>Subtotal:</th>
                <td class="col-total"><?php echo cpm_get_currency() . number_format( $invoice->subtotal, 2 ); ?></td>
            </tr>
            <tr>
                <th class="border-left">Tax: </th>
                <td class="col-total"><?php echo cpm_get_currency() . number_format( $invoice->tax, 2 ); ?></td>
            </tr>
            <tr>
                <th class="border-left">Discount: </th>
                <td class="col-total"><?php echo cpm_get_currency() . number_format( $invoice->discount, 2 ); ?></td>
            </tr>
            <tr>
                <th class="total border-left fill">Total:</th>
                <td class="col-total fill"><?php echo cpm_get_currency() . number_format( $invoice->total, 2 ); ?></td>
            </tr>
            <tr>
                <th class="border-left">Amount Paid:</th>
                <td class="col-total"><?php echo cpm_get_currency() . number_format( $invoice->paid, 2 ); ?></td>
            </tr>
            <tr>
                <th class="balance border-left fill">Balance Due:</th>
                <td class="col-total fill"><?php echo cpm_get_currency() . number_format( $invoice->total - $invoice->paid, 2 ); ?></td>
            </tr>
            <tr>
                <td colspan="3" style="text-align: center;">
                    <?php echo stripslashes( $invoice->terms ); ?>
                </td>
            </tr>
        </tbody>
    </table>
</div>