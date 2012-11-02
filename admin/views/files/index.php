<?php

$cpm_active_menu = __( 'Files', 'cpm' );

require_once CPM_PLUGIN_PATH . '/admin/views/project/header.php';

$args = array(
    'post_parent' => $project_id,
    'post_type' => array('message', 'task_list', 'milestone')
);

$project = get_posts( $args );
var_dump( $project );
?>