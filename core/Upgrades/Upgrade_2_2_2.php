<?php
namespace WeDevs\PM\Core\Upgrades;

/**
 *   Upgrade project manager 2.2.2
 */
class Upgrade_2_2_2 {
    

    /*initialize */
    public function upgrade_init() {
        $this->create_import_table();
        $this->set_inbox_list_order();
    }

    public function create_import_table()
    {
        global $wpdb;
        $table_name = $wpdb->prefix . 'pm_imports';

        $sql = "CREATE TABLE IF NOT EXISTS {$table_name} (
			  `id` int(20) UNSIGNED NOT NULL AUTO_INCREMENT,
			  `type` varchar(40) NOT NULL,
			  `remote_id` varchar(150) NOT NULL,
			  `local_id` varchar(150) NOT NULL,
			  `creator_id` int(15) UNSIGNED DEFAULT NULL,
			  `source` varchar(30) NOT NULL,
			  `created_at` timestamp NULL DEFAULT NULL,
			  `updated_at` timestamp NULL DEFAULT NULL,
			  PRIMARY KEY (`id`)
			) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

        dbDelta($sql);
    }

    private function set_inbox_list_order() {
        global $wpdb;
        $table_name = $wpdb->prefix . 'pm_boards';

        $sql = "UPDATE {$wpdb->prefix}pm_boards SET `order`=99999999 WHERE `title`='Inbox' AND `type`='task_list' AND `description`='This is a system default task list. Any task without an assigned tasklist will appear here.'";

        $wpdb->query( $wpdb->prepare( "UPDATE {$wpdb->prefix}pm_boards SET `order`=99999999 WHERE `title`='Inbox' AND `type`='task_list' AND `description`='This is a system default task list. Any task without an assigned tasklist will appear here.'") );
    }

}
