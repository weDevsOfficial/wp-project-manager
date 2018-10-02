<?php
namespace WeDevs\PM\Core\Upgrades;

use WeDevs\PM\Task\Models\Task;
use WP_Background_Process;

/**
 *   Upgrade project manager 2.0
 */
class Upgrade_2_1 extends WP_Background_Process {
    /**
     * @var string
     */
    protected $action = 'pm_db_migration_2_1';

    /*initialize */
    public function upgrade_init() {
        $funcions = [
            'alter_task_table',
            'migrate_complete_tasks',
            'alter_broad_table',
        ];
        foreach ($funcions as $func) {
            $this->push_to_queue($func);
        }

        $this->save()->dispatch();
    }

    public function task($func) {
        
        if (method_exists($this, $func)) {
            $this->{$func}();
        }

        return false;
    }

    
    function complete() {
        parent::complete();        
        // upgrade complete function
    }

    public function alter_task_table() {
        global $wpdb;
        $table = $wpdb->prefix . 'pm_tasks';
        $sql = "ALTER TABLE {$table}
			ADD `completed_by` int(11) unsigned NULL AFTER `parent_id`,
			ADD `completed_at` timestamp NULL AFTER `completed_by`;";

        $wpdb->query($sql);
    }

    public function migrate_complete_tasks() {
        $tasks = Task::with('assignees')->where('status', 1)->get();
        $tasks->map(function ($task) {
            $completed_by = $task->assignees->filter( function( $assignee ) {
                return $assignee->completed_at != null;
            })->first();
            
            if ( ! empty($completed_by) ) {
                $task->completed_by = $completed_by->assigned_to;
                $task->completed_at = $completed_by->completed_at;
            } else {
                $task->completed_by = $task->updated_by;
                $task->completed_at = $task->updated_at;
            }
            $task->save();

        });

    }

    public function alter_broad_table() {
        global $wpdb;
        $table = $wpdb->prefix . 'pm_boards';
        $sql = "ALTER TABLE {$table} ADD `status` TINYINT(2) NOT NULL DEFAULT '1'";
        $wpdb->query($sql);
    }
}
