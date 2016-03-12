<?php

/**
 * Upgrade db to 1.1
 *
 * @since 1.1
 *
 * @return type
 */
function cpm_upgrade_db_to_1_1() {

    cpm_create_cpm_project_items_table();
    cpm_create_cpm_tasks_table();
    $projects = CPM_Project::getInstance()->get_projects();

    unset( $projects['total_projects'] );

    foreach ( $projects as $project ) {
       cpm_insert_task_lists( $project->ID );
       cpm_insert_message( $project->ID );
       cpm_insert_milestone( $project->ID );
    }
}

/**
 * Insert message type item
 *
 * @param init $project_id
 *
 * @since 1.1
 *
 * @return type
 */
function cpm_insert_message( $project_id ) {
    global $wpdb;

    $table_name = $wpdb->prefix . 'cpm_project_items';
    $messages   = CPM_Message::getInstance()->get_all( $project_id, true );

    foreach ( $messages as $message ) {
        CPM_Project::getInstance()->new_project_item( $project_id, $message->ID, $message->private, 'message', false );
    }
}

/**
 * Insert milestone type item
 *
 * @param init $project_id
 *
 * @since 1.1
 *
 * @return type
 */
function cpm_insert_milestone( $project_id ) {
    global $wpdb;

    $table_name = $wpdb->prefix . 'cpm_project_items';
    $milestones = CPM_Milestone::getInstance()->get_by_project( $project_id, true );

    foreach ( $milestones as $milestone ) {
        $complete = $milestone->completed ? $milestone->completed_on : '0000-00-00 00:00:00';
        CPM_Project::getInstance()->new_project_item( $project_id, $milestone->ID, $milestone->private, 'milestone', false, $complete, $milestone->completed );
    }
}

/**
 * Insert task list item type
 *
 * @param init $project_id
 *
 * @since 1.1
 *
 * @return type
 */
function cpm_insert_task_lists( $project_id ) {

    global $wpdb;
    $table_name = $wpdb->prefix . 'cpm_project_items';
    $task_lists = CPM_Task::getInstance()->get_task_lists( $project_id, true );

    foreach ($task_lists as $task_list ) {
        CPM_Project::getInstance()->new_project_item( $project_id, $task_list->ID, $task_list->private, 'task_list', false );
        cpm_insert_tasks( $project_id, $task_list->ID );
    }
}

/**
 * Insert task type item
 *
 * @param init $item_id
 * @param init $task_list_id
 *
 * @since 1.1
 *
 * @return type
 */
function cpm_insert_tasks( $project_id, $task_list_id ) {
    global $wpdb;

    $table_name = $wpdb->prefix . 'cpm_tasks';
    $tasks      = CPM_Task::getInstance()->get_tasks( $task_list_id, true );

    foreach ( $tasks as $task ) {
        $complete = $task->completed ? $task->completed_on : '0000-00-00 00:00:00';

        CPM_Project::getInstance()->new_project_item( $project_id, $task->ID, $task->task_privacy, 'task', false, $complete, $task->completed, $task_list_id );
        $last_insert_id = $wpdb->insert_id;

        if ( count( $task->assigned_to ) ) {
            foreach ( $task->assigned_to  as $assigned ) {

                if ( $last_insert_id ) {

                    $data = array(
                        'item_id' => $last_insert_id,
                        'user_id' => $assigned,
                        'start'   => isset( $task->start_date ) && $task->start_date ? $task->start_date : $task->post_date,
                        'due'     => $task->due_date ? $task->due_date : '0000-00-00 00:00:00',
                    );

                    $wpdb->insert( $table_name, $data, array( '%d', '%d', '%s', '%s' ) );
                }
            }

        } else {

            if ( $last_insert_id ) {

                $data = array(
                    'item_id' => $last_insert_id,
                    'user_id' => -1,
                    'start'   => isset( $task->start_date ) && $task->start_date ? $task->start_date : $task->post_date,
                    'due'     => $task->due_date ? $task->due_date : '0000-00-00 00:00:00',
                );

                $wpdb->insert( $table_name, $data, array( '%d', '%d', '%s','%s' ) );
            }
        }
    }
}

/**
 * Create project items table
 *
 * @since 1.1
 *
 * @return type
 */
function cpm_create_cpm_project_items_table() {
    global $wpdb;

    $table_name = $wpdb->prefix . 'cpm_project_items';
    $sql = "CREATE TABLE IF NOT EXISTS {$table_name} (
        `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
          `project_id` bigint(20) unsigned NOT NULL DEFAULT '0',
          `item_type` varchar(20) DEFAULT NULL,
          `object_id` bigint(20) unsigned NOT NULL DEFAULT '0',
          `private` tinyint(1) unsigned NOT NULL DEFAULT '0',
          `parent` bigint(20) NOT NULL DEFAULT '0',
          `complete_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
          `complete_status` tinyint(1) unsigned NOT NULL DEFAULT '0',
          PRIMARY KEY (`id`), UNIQUE KEY `object_id` (`object_id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;";

    require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
    dbDelta( $sql );
}

/**
 * Create project items table
 *
 * @since 1.1
 *
 * @return type
 */
function cpm_create_cpm_tasks_table() {
     global $wpdb;

    $table_name = $wpdb->prefix . 'cpm_tasks';
    $sql = "CREATE TABLE IF NOT EXISTS {$table_name} (
        `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
          `item_id` bigint(20) NOT NULL DEFAULT '0',
          `user_id` bigint(20) NOT NULL DEFAULT '0',
          `start` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
          `due` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
          PRIMARY KEY (`id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;";

    require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
    dbDelta( $sql );
}

cpm_upgrade_db_to_1_1();