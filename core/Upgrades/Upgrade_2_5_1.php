<?php
namespace WeDevs\PM\Core\Upgrades;

/**
 * Upgrade 2.5.1 — Normalize pm_task_types.type column.
 * All existing rows that are not explicitly 'subtask' are set to 'task'.
 * This ensures users who created types before the Task/Subtask distinction
 * was introduced have their types correctly categorized as task types.
 */
class Upgrade_2_5_1 {

    public function upgrade_init() {
        $this->normalize_task_types();
    }

    private function normalize_task_types() {
        global $wpdb;

        $table = $wpdb->prefix . 'pm_task_types';

        // Fix existing bad rows
        $wpdb->query(
            "UPDATE {$table} SET `type` = 'task' WHERE `type` IS NULL OR `type` = '' OR `type` NOT IN ('task', 'subtask')"
        );

        // Fix column default so future rows without explicit type get 'task'
        $wpdb->query(
            "ALTER TABLE {$table} MODIFY `type` varchar(255) NOT NULL DEFAULT 'task'"
        );
    }
}
