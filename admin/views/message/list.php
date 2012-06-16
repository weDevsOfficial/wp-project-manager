<?php require_once CPM_PLUGIN_PATH . '/admin/tables/messages.php'; ?>

<div id="icon-edit" class="icon32 icon32-posts-post"><br></div>
<h3 class="cpm-nav-title">
    <?php _e( 'All Messages', 'cpm' ) ?> <a href="#" class="add-new-h2"><?php _e( 'Add New Message', 'cpm' ) ?></a>
</h3>

<form id="movies-filter" method="get">
    <?php
    $message_list = new CPM_Message_List_Table();
    $message_list->prepare_items();

    $message_list->views();

    //$project_list_table->search_box( '', 'post' );

    $message_list->display();
    ?>
</form>