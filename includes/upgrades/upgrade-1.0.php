<?php
/**
 * Upgrade to 1.0
 *
 * @return type
 */

function cpm_upgrade_to_1_0() {
    $tasks = new WP_Query( array(
        'post_type'      => 'task',
        'post_status'    => 'any',
        'posts_per_page' => -1,
    ));

    foreach ( $tasks->posts as $key => $task ) {
        $assign_users = get_post_meta( $task->ID, '_assigned', true );

        if ( is_array( $assign_users ) ) {
            delete_post_meta( $task->ID, '_assigned' );
            foreach ( $assign_users as $key => $assign_user ) {
                add_post_meta( $task->ID, '_assigned', $assign_user );
            }
        }
    }
}

cpm_upgrade_to_1_0();