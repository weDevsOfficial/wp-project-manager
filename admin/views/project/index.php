<?php
/**
 * This page displays all the projects using WP_Post_List_Table
 *
 * TODO: fix views (All, Published, Trash links)
 * TODO: fix search and bulk actions
 * TODO: fix columns
 */
require_once CPM_PLUGIN_PATH . '/includes/list-table.php';

$post_type = 'project';
$projects_table = new CPM_Child_List_Table( $post_type );
$projects_table->prepare_items();
?>

<div id="icon-edit" class="icon32 icon32-posts-post"><br></div>
<h2>
    <?php _e( 'All Projects', 'cpm' ) ?>
    <a href="<?php echo cpm_url_project_new(); ?>" class="add-new-h2"><?php _e( 'Add New Project', 'cpm' ) ?></a>
</h2>

<?php $projects_table->views(); ?>
<form id="posts-filter" action="" method="get">
    <?php $projects_table->search_box( get_post_type_object( $post_type )->labels->search_items, $post_type ); ?>

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