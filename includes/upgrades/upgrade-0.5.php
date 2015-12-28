<?php

/**
 * Upgrade to 0.5
 *
 * @return type
 */
function cpm_upgrade_to_0_5() {
    global $wpdb;

    $table = $wpdb->prefix . 'cpm_user_role';

    $project_query = new WP_Query( array(
        'post_type'   => 'project',
        'numberposts' => -1,
    ) );

    $projects = $project_query->get_posts();

    if ( !$projects ) {
        return;
    }

    foreach ($projects as $project) {
        cpm_update_task_start_meta( $project );
        update_post_meta( $project->ID, '_project_active', 'yes' );

        // add post author to manager
        $data = array(
            'project_id' => $project->ID,
            'user_id'    => $project->post_author,
            'role'       => 'manager',
        );

        $format = array('%d', '%d', '%s');
        $wpdb->insert( $table, $data, $format );


        // If any coworkers found, add them too
        $co_workers = get_post_meta( $project->ID, '_coworker', true );
        $co_workers = is_array( $co_workers ) ? $co_workers : array();

        if ( count( $co_workers ) ) {

            foreach ($co_workers as $user_id) {

                $data = array(
                    'project_id' => $project->ID,
                    'user_id'    => $user_id,
                    'role'       => 'co_worker',
                );
                $format = array('%d', '%d', '%s');

                if ( $user_id != $project->post_author ) {
                    $wpdb->insert( $table, $data, $format );
                }

                delete_post_meta( $project->ID, '_coworker' );
            }
        }


        //update user setting for all projectg
        $settings = CPM_Project::getInstance()->settings_user_permission();
        update_post_meta( $project->ID, '_settings', $settings );
    }

    $tasks = get_posts( array(
        'post_type'   => 'task',
        'numberposts' => -1,
    ) );

    if ( $tasks ) {
        foreach ($tasks as $task) {
            update_post_meta( $task->ID, '_task_privacy', 'no' );
            update_post_meta( $task->ID, '_start', '' );
        }
    }


    $task_lists = get_posts( array(
        'post_type'   => 'task_list',
        'numberposts' => -1,
    ) );

    if ( $task_lists ) {
        foreach ($task_lists as $task_list) {
            update_post_meta( $task_list->ID, '_tasklist_privacy', 'no' );
        }
    }

    $messages = get_posts( array(
        'post_type'   => 'message',
        'numberposts' => -1,
    ) );

    if ( $messages ) {
        foreach ($messages as $message) {
            update_post_meta( $message->ID, '_message_privacy', 'no' );
        }
    }
}

/**
 * Update start meta
 *
 * @param object $project
 */
function cpm_update_task_start_meta( $project ) {
    $instant = CPM_Task::getInstance();
    $task_lists = $instant->get_task_lists( $project->ID );

    foreach ($task_lists as $task_list) {
        $tasks = $instant->get_tasks( $task_list->ID );

        foreach ($tasks as $task) {
            update_post_meta( $task->ID, '_start', '' );
        }
    }
}

cpm_upgrade_to_0_5();