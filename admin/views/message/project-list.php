<?php
$cpm_active_menu = __( 'Messages', 'cpm' );

require_once CPM_PLUGIN_PATH . '/admin/tables/messages.php';
require_once CPM_PLUGIN_PATH . '/admin/views/project/header.php';
?>

<h2>Messages</h2>

<?php
$message_list = new CPM_Message_List_Table( $project_id );
$message_list->prepare_items();

$message_list->views();

//$project_list_table->search_box( '', 'post' );

$message_list->display();
?>