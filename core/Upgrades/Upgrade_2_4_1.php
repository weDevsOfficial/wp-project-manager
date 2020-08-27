<?php
namespace WeDevs\PM\Core\Upgrades;

/**
 *   Upgrade project manager 2.4.1
 */
class Upgrade_2_4_1 {
    

    /*initialize */
    public function upgrade_init() {
        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        
        $this->task_types();
    }

    private function task_types() {
        global $wpdb;
        $table_name = $wpdb->prefix . 'pm_task_types';

        //`status` inactive: 0, active: 1

        $sql = "CREATE TABLE IF NOT EXISTS  {$table_name} (
          `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
          `title` varchar(255) NOT NULL,
          `description` text,
          `type` varchar(255) NOT NULL,
          `status` tinyint(4) NOT NULL DEFAULT 0,
          `created_by` int(11) UNSIGNED DEFAULT NULL,
          `updated_by` int(11) UNSIGNED DEFAULT NULL,
          PRIMARY KEY (`id`)
        ) DEFAULT CHARSET=utf8";
        
        dbDelta($sql);

        $this->task_type_task();
    }

    private function task_type_task() {
        global $wpdb;
        $table_name = $wpdb->prefix . 'pm_task_type_task';

        $sql = "CREATE TABLE IF NOT EXISTS  {$table_name} (
          `type_id` int(11) UNSIGNED NOT NULL,
          `task_id` int(11) UNSIGNED NOT NULL,
          `project_id` int(11) UNSIGNED NOT NULL,
          `list_id` int(11) UNSIGNED NOT NULL,
          UNIQUE KEY `task_id` (`task_id`),
          KEY `type_id` (`type_id`)
        ) DEFAULT CHARSET=utf8";
        
        dbDelta($sql);
    }

}
