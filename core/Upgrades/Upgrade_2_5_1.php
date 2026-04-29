<?php
namespace WeDevs\PM\Core\Upgrades;

/**
 * Upgrade 2.5.1 — Normalize pm_task_types.type column.
 *
 * Problem: Old Vue settings form had no Task/Subtask toggle UI. The type
 * column defaulted to empty string in some installs, causing task types to
 * appear in both Task and Subtask dropdowns.
 *
 * Fix:
 *  1. Normalize all bad type values (NULL, '', unknown) → 'task'.
 *     Rows already set to 'subtask' are untouched — valid user intent.
 *  2. Fix column DEFAULT so future inserts without explicit type get 'task'.
 *  3. Remove orphaned pm_task_type_task rows pointing to deleted types
 *     to keep task→type assignments consistent.
 *
 * Task assignments (pm_task_type_task) are preserved — only the type
 * classification changes from bad-value → 'task'. No task loses its type.
 */
class Upgrade_2_5_1 {

    public function upgrade_init() {
        $this->normalize_task_types();
        $this->fix_column_default();
        $this->remove_orphan_task_type_relations();
    }

    private function normalize_task_types() {
        global $wpdb;

        $table = $wpdb->prefix . 'pm_task_types';

        // Only touch rows with bad/unknown type. Explicit 'subtask' rows untouched.
        $wpdb->query(
            "UPDATE {$table} SET `type` = 'task'
             WHERE `type` IS NULL OR `type` = '' OR `type` NOT IN ('task', 'subtask')"
        );
    }

    private function fix_column_default() {
        global $wpdb;

        $table = $wpdb->prefix . 'pm_task_types';

        // Ensure column enforces 'task' default at DB level for future inserts.
        $wpdb->query(
            "ALTER TABLE {$table} MODIFY `type` varchar(255) NOT NULL DEFAULT 'task'"
        );
    }

    private function remove_orphan_task_type_relations() {
        global $wpdb;

        $relation_table = "{$wpdb->prefix}pm_task_type_task";
        $types_table    = "{$wpdb->prefix}pm_task_types";

        // Remove relation rows whose type_id no longer exists in pm_task_types.
        $wpdb->query(
            "DELETE r FROM {$relation_table} r
             LEFT JOIN {$types_table} t ON r.type_id = t.id
             WHERE t.id IS NULL"
        );
    }
}

