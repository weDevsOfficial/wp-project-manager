<?php
namespace WeDevs\PM\Core\Upgrades;

use WeDevs\PM\Task\Models\Task;
use WP_Background_Process;

/**
 *   Upgrade project manager 2.0
 */
class Upgrade_2_1 extends WP_Background_Process
{
    /**
     * @var string
     */
    protected $action = 'pm_db_migration_2_1';

    /*initialize */
    public function upgrade_init()
    {
        $funcions = [
            'alter_task_table',
            'migrate_complete_tasks',
        ];
        foreach ($funcions as $func) {
            $this->push_to_queue($func);
        }

        $this->save()->dispatch();
    }

    public function task($func)
    {
        if (method_exists($this, $func)) {
            $this->{$func}();
        }
    }

    public function alter_task_table()
    {
        global $wpdb;
        $table = $wpdb->prefix . 'pm_tasks';
        $sql = "ALTER TABLE {$table}
			ADD `completed_by` int(11) unsigned NULL AFTER `parent_id`,
			ADD `completed_at` timestamp NULL AFTER `completed_by`;";

        $wpdb->query($sql);
    }

    public function migrate_complete_tasks()
    {
        $tasks = Task::with('assignees')->where('status', 1)->get();

        $tasks->map(function ($task) {
            $completed_by = $task->assignees->whereNotNull('completed_at');
            $task->completed_by = $completed_by->assigned_to;
            $task->completed_at = $completed_by->completed_at;
            $task->save();

        });
    }
}
