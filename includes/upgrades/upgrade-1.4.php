<?php

$tasks_query = new WP_Query( array(
    'post_type'      => 'task',
    'posts_per_page' => -1,
    'post_status'    => array( 'publish' ),
) );

$all_tasks = $tasks_query->get_posts();
foreach ($all_tasks as $task) {

    // if content > 40, keep both title and content
    // else, remove the content, keep title
    if ( cpm_strlen( $task->post_content ) < 40 ) {
        wp_update_post( array( 'ID' => $task->ID, 'post_content' => '' ) );
    }
}

// Upgrade Database
global $wpdb;
$sql_project_update = " UPDATE $wpdb->posts SET post_type = 'cpm_project' WHERE post_type = 'project'   ";
$wpdb->query($sql_project_update);

$sql_task_update = " UPDATE $wpdb->posts SET post_type = 'cpm_task' WHERE post_type = 'task'   ";
$wpdb->query($sql_task_update);

$sql_task_list_update = " UPDATE $wpdb->posts SET post_type = 'cpm_task_list' WHERE post_type = 'task_list'   ";
$wpdb->query($sql_task_list_update);

$sql_milestone_update = " UPDATE $wpdb->posts SET post_type = 'cpm_milestne' WHERE post_type = 'milestone'   ";
$wpdb->query($sql_milestone_update);

$sql_message_update = " UPDATE $wpdb->posts SET post_type = 'cpm_message' WHERE post_type = 'message'   ";
$wpdb->query($sql_message_update);

$sql_message_update = " UPDATE $wpdb->term_taxonomy SET taxonomy = 'cpm_project_category' WHERE taxonomy = 'project_category'   ";
$wpdb->query($sql_message_update);