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