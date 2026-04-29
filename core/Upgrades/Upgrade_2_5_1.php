<?php
namespace WeDevs\PM\Core\Upgrades;

/**
 * Upgrade 2.5.1 — Normalize pm_task_types.type column.
 *
 * Root cause: Old Vue settings form had no Task/Subtask UI toggle. The
 * task-type dropdown fetched ALL types with no type filter, so types appeared
 * in both task and subtask dropdowns. Rows ended up with type='subtask' or
 * type='' from bad data propagation — Vue never had an intentional subtask
 * concept so ALL pre-existing types are task types.
 *
 * Fix:
 *  1. Force ALL existing types to 'task'. Users can re-classify via React UI
 *     if they genuinely need subtask types going forward.
 *  2. Fix column DEFAULT so future inserts without explicit type get 'task'.
 *  3. Remove orphaned pm_task_type_task rows pointing to deleted types.
 *
 * Task assignments (pm_task_type_task) are fully preserved. Only the type
 * classification column changes. No task loses its assigned type.
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

        // Force ALL rows to 'task' — Vue had no subtask concept so no row
        // was intentionally subtask. React UI lets users re-classify after.
        $wpdb->query( "UPDATE {$table} SET `type` = 'task'" );
    }

    private function fix_column_default() {
        global $wpdb;

        $table = $wpdb->prefix . 'pm_task_types';

        $wpdb->query(
            "ALTER TABLE {$table} MODIFY `type` varchar(255) NOT NULL DEFAULT 'task'"
        );
    }

    private function remove_orphan_task_type_relations() {
        global $wpdb;

        $relation_table = "{$wpdb->prefix}pm_task_type_task";
        $types_table    = "{$wpdb->prefix}pm_task_types";

        $wpdb->query(
            "DELETE r FROM {$relation_table} r
             LEFT JOIN {$types_table} t ON r.type_id = t.id
             WHERE t.id IS NULL"
        );
    }
}
