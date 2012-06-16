<?php require_once CPM_PLUGIN_PATH . '/admin/tables/projects.php'; ?>

<div id="icon-edit" class="icon32 icon32-posts-post"><br></div>
<h2><?php _e( 'All Projects', 'cpm' ) ?> <a href="<?php echo admin_url( 'admin.php?page=cpm_projects&action=new' ) ?>" class="add-new-h2"><?php _e( 'Add New Project', 'cpm' ) ?></a></h2>

<form id="cpm-list-project" action="" method="get">
    <?php
    $project_list = new CPM_Project_List_Table();
    $project_list->prepare_items();

    //$project_list->views();
    //$project_list_table->search_box( '', 'post' );

    $project_list->display();
    ?>
</form>