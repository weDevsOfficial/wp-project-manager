<?php
require_once CPM_PLUGIN_PATH . '/admin/tables/projects.php';

global $current_screen;
$post_type = 'project';

$current_screen->post_type = $post_type;
$post_type_object = get_post_type_object( $post_type );

$projects_table = new CPM_Project_List_Table();
$projects_table->prepare_items();
?>

<div id="icon-edit" class="icon32 icon32-posts-post"><br></div>
<h2><?php _e( 'All Projects', 'cpm' ) ?> <a href="<?php echo admin_url( 'admin.php?page=cpm_projects&action=new' ) ?>" class="add-new-h2"><?php _e( 'Add New Project', 'cpm' ) ?></a></h2>

<?php $projects_table->views(); ?>
<form id="posts-filter" action="" method="get">
    <?php $projects_table->search_box( $post_type_object->labels->search_items, 'post' ); ?>

    <input type="hidden" name="post_status" class="post_status_page" value="<?php echo!empty( $_REQUEST['post_status'] ) ? esc_attr( $_REQUEST['post_status'] ) : 'all'; ?>" />
    <input type="hidden" name="post_type" class="post_type_page" value="<?php echo $post_type; ?>" />
    <?php if ( !empty( $_REQUEST['show_sticky'] ) ) { ?>
        <input type="hidden" name="show_sticky" value="1" />
    <?php } ?>

    <?php $projects_table->display(); ?>
</form>

<?php
if ( $projects_table->has_items() ) {
    $projects_table->inline_edit();
}
?>

<div id="ajax-response"></div>
<br class="clear" />