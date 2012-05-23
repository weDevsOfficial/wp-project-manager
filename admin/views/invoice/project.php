<?php
$cpm_active_menu = __( 'Invoices', 'cpm' );

require_once CPM_PLUGIN_PATH . '/admin/views/project/header.php';
require_once CPM_PLUGIN_PATH . '/admin/tables/invoices.php';
?>

<h3 class="cpm-nav-title">
<?php _e( 'Invoices', 'cpm' ) ?> <a id="cpm-add-milestone" href="<?php echo cpm_url_new_invoice( $project_id ) ?>" class="add-new-h2"><?php _e( 'Add Invoice', 'cpm' ) ?></a>
</h3>

<form id="cpm-list-project" action="" method="get">
    <?php
    $invoice_list = new CPM_Invoice_List_Table( $project_id );
    $invoice_list->prepare_items();

    //$project_list->views();
    //$project_list_table->search_box( '', 'post' );

    $invoice_list->display();
    ?>
</form>