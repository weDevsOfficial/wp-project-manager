<?php

class PM_Create_Table {

    public function __construct() {

        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        $this->create_project_table();
        $this->create_tasks_table();
        $this->create_activity_table();
        $this->create_assignees_table();
        $this->create_boardables_table();
        $this->create_boards_table();
        $this->create_categories_table();
        $this->create_category_project_table();
        $this->create_comments_table();
        $this->create_files_table();
        $this->create_meta_table();
        $this->create_roles_table();
        $this->create_role_user_table();
        $this->create_settings_table();
        $this->create_import_table();
        $this->crate_capabilities_table();
        $this->crate_role_projects_table();
        $this->crate_role_project_capabilities_table();
        $this->crate_role_project_users_table();
        $this->update_version();
    }

    private function prefix() {
    	global $wpdb;

    	return $wpdb->prefix;
    }

    private function crate_capabilities_table() {

        global $wpdb;
        $table_name = $this->prefix() . 'pm_capabilities';

        $sql = "CREATE TABLE IF NOT EXISTS {$table_name} (
              `id` int(20) UNSIGNED NOT NULL AUTO_INCREMENT,
              `name` varchar(100) NOT NULL,
              PRIMARY KEY (`id`)
            ) DEFAULT CHARSET=utf8";

        dbDelta($sql);
    }

   	private function crate_role_projects_table() {
        global $wpdb;
        $table_name = $this->prefix() . 'pm_role_project';

        $sql = "CREATE TABLE IF NOT EXISTS {$table_name} (
              `id` int(20) UNSIGNED NOT NULL AUTO_INCREMENT,
              `project_id` int(20) UNSIGNED NOT NULL,
              `role_id` int(20) UNSIGNED NOT NULL,
              PRIMARY KEY (`id`)
            ) DEFAULT CHARSET=utf8";


        dbDelta($sql);
    }

    private function crate_role_project_capabilities_table() {
        global $wpdb;
        $table_name = $this->prefix() . 'pm_role_project_capabilities';

        $sql = "CREATE TABLE IF NOT EXISTS {$table_name} (
              `role_project_id` int(20) UNSIGNED NOT NULL,
              `capability_id` int(20) UNSIGNED NOT NULL,
              KEY `role_project_id` (`role_project_id`)
            ) DEFAULT CHARSET=utf8";


        dbDelta($sql);
    }

    private function crate_role_project_users_table() {
        global $wpdb;
        $table_name = $this->prefix() . 'pm_role_project_users';

        $sql = "CREATE TABLE IF NOT EXISTS {$table_name} (
              `role_project_id` int(20) UNSIGNED NOT NULL,
              `user_id` int(20) UNSIGNED NOT NULL,
              KEY `role_project_id` (`role_project_id`)
            ) DEFAULT CHARSET=utf8";

        dbDelta($sql);
    }

    public function create_project_table()
    {

        global $wpdb;
        $table_name = $this->prefix() . 'pm_projects';

        // `status` COMMENT '0: incomplete; 1: complete; 2: pending; 3: archived'

        $sql = "CREATE TABLE IF NOT EXISTS  {$table_name} (
		  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
		  `title` varchar(255) NOT NULL,
		  `description` text,
		  `status` tinyint(4) NOT NULL DEFAULT 0,
		  `budget` double(8,2) DEFAULT NULL,
		  `pay_rate` double(8,2) DEFAULT NULL,
		  `est_completion_date` timestamp NULL DEFAULT NULL,
		  `color_code` varchar(255) DEFAULT NULL,
		  `order` tinyint(4) DEFAULT NULL,
		  `projectable_type` varchar(255) DEFAULT NULL,
		  `completed_at` timestamp NULL DEFAULT NULL,
		  `created_by` int(11) UNSIGNED DEFAULT NULL,
		  `updated_by` int(11) UNSIGNED DEFAULT NULL,
		  `created_at` timestamp NULL DEFAULT NULL,
		  `updated_at` timestamp NULL DEFAULT NULL,
		  PRIMARY KEY (`id`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

        dbDelta($sql);
    }

    public function create_tasks_table()
    {
        global $wpdb;
        $table_name = $this->prefix() . 'pm_tasks';

        // `priority` tinyint(4) NOT NULL DEFAULT '1' COMMENT '1: High; 2: Medium; 3: Low',
        //  `payable` tinyint(1) NOT NULL DEFAULT 0 COMMENT '0: Not payable; 1: Payable',
        //  `recurrent` tinyint(1) NOT NULL DEFAULT 0 COMMENT '0: Not recurrent task; 1: Recurrent task',
        //  `status` tinyint(4) NOT NULL DEFAULT 0 COMMENT '0: Incomplete; 1: Complete; 2: Pending',

        $sql = "CREATE TABLE IF NOT EXISTS {$table_name} (
			  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
			  `title` varchar(255) NOT NULL,
			  `description` text,
			  `estimation` int(11) DEFAULT '0',
			  `start_at` timestamp NULL DEFAULT NULL,
			  `due_date` timestamp NULL DEFAULT NULL,
			  `complexity` tinyint(4) DEFAULT NULL,
			  `priority` tinyint(4) NOT NULL DEFAULT 1,
			  `payable` tinyint(1) NOT NULL DEFAULT 0,
			  `recurrent` tinyint(1) NOT NULL DEFAULT 0,
			  `status` tinyint(4) NOT NULL DEFAULT 0,
			  `is_private` tinyint(2) UNSIGNED default 0,
			  `project_id` int(11) UNSIGNED NOT NULL,
			  `parent_id` int(11) UNSIGNED NOT NULL DEFAULT 0,
			  `completed_by` int(11) UNSIGNED DEFAULT NULL,
			  `completed_at` timestamp NULL DEFAULT NULL,
			  `created_by` int(11) UNSIGNED DEFAULT NULL,
			  `updated_by` int(11) UNSIGNED DEFAULT NULL,
			  `created_at` timestamp NULL DEFAULT NULL,
			  `updated_at` timestamp NULL DEFAULT NULL,
			  PRIMARY KEY (`id`),
			  KEY `project_id` (`project_id`)
			) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

        dbDelta($sql);
    }

    public function create_activity_table()
    {
        global $wpdb;
        $table_name = $this->prefix() . 'pm_activities';

        $sql = "CREATE TABLE IF NOT EXISTS {$table_name} (
			  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
			  `actor_id` int(11) UNSIGNED NOT NULL,
			  `action` varchar(255) NOT NULL,
			  `action_type` varchar(255) NOT NULL,
			  `resource_id` int(11) UNSIGNED DEFAULT NULL,
			  `resource_type` varchar(255) DEFAULT NULL,
			  `meta` text,
			  `project_id` int(11) UNSIGNED NOT NULL,
			  `created_at` timestamp NULL DEFAULT NULL,
			  `updated_at` timestamp NULL DEFAULT NULL,
			  PRIMARY KEY (`id`),
			  KEY `project_id` (`project_id`),
			  KEY `actor_id` (`actor_id`),
			  KEY `resource_id` (`resource_id`)
			) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

        dbDelta($sql);
    }

    public function create_assignees_table()
    {
        global $wpdb;
        $table_name = $this->prefix() . 'pm_assignees';

        //`status` tinyint(4) NOT NULL DEFAULT 0 COMMENT '0: Not started; 1: Working; 2: Accomplished',

        $sql = "CREATE TABLE IF NOT EXISTS {$table_name} (
			  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
			  `task_id` int(11) UNSIGNED NOT NULL,
			  `assigned_to` int(11) UNSIGNED NOT NULL,
			  `status` tinyint(4) NOT NULL DEFAULT '0',
			  `created_by` int(11) UNSIGNED DEFAULT NULL,
			  `updated_by` int(11) UNSIGNED DEFAULT NULL,
			  `assigned_at` timestamp NULL DEFAULT NULL,
			  `started_at` timestamp NULL DEFAULT NULL,
			  `completed_at` timestamp NULL DEFAULT NULL,
			  `project_id` int(11) UNSIGNED NOT NULL,
			  `created_at` timestamp NULL DEFAULT NULL,
			  `updated_at` timestamp NULL DEFAULT NULL,
			  PRIMARY KEY (`id`),
			  KEY `task_id` (`task_id`),
			  KEY `assigned_to` (`assigned_to`),
			  KEY `project_id` (`project_id`)
			) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

        dbDelta($sql);
    }

    public function create_boardables_table()
    {
        global $wpdb;
        $table_name = $this->prefix() . 'pm_boardables';

        $sql = "CREATE TABLE IF NOT EXISTS {$table_name} (
			  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
			  `board_id` int(11) UNSIGNED NOT NULL,
			  `board_type` varchar(255) NOT NULL,
			  `boardable_id` int(11) UNSIGNED NOT NULL,
			  `boardable_type` varchar(255) NOT NULL,
			  `order` int(11) NOT NULL DEFAULT 0,
			  `created_by` int(11) UNSIGNED DEFAULT NULL,
			  `updated_by` int(11) UNSIGNED DEFAULT NULL,
			  `created_at` timestamp NULL DEFAULT NULL,
			  `updated_at` timestamp NULL DEFAULT NULL,
			  PRIMARY KEY (`id`),
			  KEY `board_id` (`board_id`),
			  KEY `boardable_id` (`boardable_id`)
			) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

        dbDelta($sql);

    }

    public function create_boards_table()
    {
        global $wpdb;
        $table_name = $this->prefix() . 'pm_boards';

        $sql = "CREATE TABLE IF NOT EXISTS {$table_name} (
			  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
			  `title` varchar(255) NOT NULL,
			  `description` text,
			  `order` int(11) UNSIGNED DEFAULT NULL,
			  `type` varchar(255) DEFAULT NULL,
			  `status` tinyint(2) unsigned NOT NULL DEFAULT '1',
			  `is_private` tinyint(2) UNSIGNED default 0,
			  `project_id` int(11) UNSIGNED NOT NULL,
			  `created_by` int(11) UNSIGNED DEFAULT NULL,
			  `updated_by` int(11) UNSIGNED DEFAULT NULL,
			  `created_at` timestamp NULL DEFAULT NULL,
			  `updated_at` timestamp NULL DEFAULT NULL,
			  PRIMARY KEY (`id`),
			  KEY `project_id` (`project_id`)
			) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

        dbDelta($sql);
    }

    public function create_categories_table()
    {
        global $wpdb;
        $table_name = $this->prefix() . 'pm_categories';

        $sql = "CREATE TABLE IF NOT EXISTS {$table_name} (
			  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
			  `title` varchar(255) NOT NULL,
			  `description` text,
			  `categorible_type` varchar(255) DEFAULT NULL,
			  `created_by` int(11) UNSIGNED DEFAULT NULL,
			  `updated_by` int(11) UNSIGNED DEFAULT NULL,
			  `created_at` timestamp NULL DEFAULT NULL,
			  `updated_at` timestamp NULL DEFAULT NULL,
			  PRIMARY KEY (`id`)
			) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

        dbDelta($sql);
    }

    public function create_category_project_table()
    {
        global $wpdb;
        $table_name = $this->prefix() . 'pm_category_project';

        $sql = "CREATE TABLE IF NOT EXISTS {$table_name} (
			  `project_id` int(11) UNSIGNED NOT NULL,
			  `category_id` int(11) UNSIGNED NOT NULL,
			  KEY `project_id` (`project_id`),
			  KEY `category_id` (`category_id`)
			) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

        dbDelta($sql);
    }

    public function create_comments_table()
    {
        global $wpdb;
        $table_name = $this->prefix() . 'pm_comments';

        $sql = "CREATE TABLE IF NOT EXISTS {$table_name} (
			  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
			  `content` text NOT NULL,
			  `mentioned_users` varchar(255) DEFAULT NULL,
			  `commentable_id` int(11) UNSIGNED NOT NULL,
			  `commentable_type` varchar(255) NOT NULL,
			  `project_id` int(11) UNSIGNED NOT NULL,
			  `created_by` int(11) UNSIGNED DEFAULT NULL,
			  `updated_by` int(11) UNSIGNED DEFAULT NULL,
			  `created_at` timestamp NULL DEFAULT NULL,
			  `updated_at` timestamp NULL DEFAULT NULL,
			  PRIMARY KEY (`id`),
			  KEY `project_id` (`project_id`),
			  KEY `commentable_id` (`commentable_id`)
			) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

        dbDelta($sql);
    }

    public function create_files_table()
    {
        global $wpdb;
        $table_name = $this->prefix() . 'pm_files';

        $sql = "CREATE TABLE IF NOT EXISTS {$table_name} (
			  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
			  `fileable_id` int(11) DEFAULT NULL,
			  `fileable_type` varchar(255) DEFAULT NULL,
			  `type` varchar(255) NOT NULL DEFAULT 'file',
			  `attachment_id` bigint(20) DEFAULT NULL,
			  `parent` int(11) NOT NULL DEFAULT 0,
			  `project_id` int(11) UNSIGNED DEFAULT NULL,
			  `created_by` int(11) UNSIGNED DEFAULT NULL,
			  `updated_by` int(11) UNSIGNED DEFAULT NULL,
			  `created_at` timestamp NULL DEFAULT NULL,
			  `updated_at` timestamp NULL DEFAULT NULL,
			  PRIMARY KEY (`id`),
			  KEY `project_id` (`project_id`),
			  KEY `fileable_id` (`fileable_id`)
			) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

        dbDelta($sql);
    }

    public function create_meta_table()
    {
        global $wpdb;
        $table_name = $this->prefix() . 'pm_meta';

        $sql = "CREATE TABLE IF NOT EXISTS {$table_name} (
		  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
		  `entity_id` int(11) UNSIGNED NOT NULL,
		  `entity_type` varchar(255) NOT NULL,
		  `meta_key` varchar(255) NOT NULL,
		  `meta_value` text,
		  `project_id` int(11) UNSIGNED DEFAULT NULL,
		  `created_by` int(11) UNSIGNED DEFAULT NULL,
		  `updated_by` int(11) UNSIGNED DEFAULT NULL,
		  `created_at` timestamp NULL DEFAULT NULL,
		  `updated_at` timestamp NULL DEFAULT NULL,
		  PRIMARY KEY (`id`),
		  KEY `entity_id` (`entity_id`),
		  KEY `project_id` (`project_id`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

        dbDelta($sql);
    }

    public function create_roles_table()
    {
        global $wpdb;
        $table_name = $this->prefix() . 'pm_roles';

        $sql = "CREATE TABLE IF NOT EXISTS {$table_name} (
			  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
			  `title` varchar(255) NOT NULL,
			  `slug` varchar(255) NOT NULL,
			  `description` text,
			  `status` tinyint(2) unsigned NOT NULL DEFAULT '1',
			  `created_by` int(11) UNSIGNED DEFAULT NULL,
			  `updated_by` int(11) UNSIGNED DEFAULT NULL,
			  `created_at` timestamp NULL DEFAULT NULL,
			  `updated_at` timestamp NULL DEFAULT NULL,
			  PRIMARY KEY (`id`)
			) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

        dbDelta($sql);
    }

    public function create_role_user_table()
    {
        global $wpdb;
        $table_name = $this->prefix() . 'pm_role_user';

        $sql = "CREATE TABLE IF NOT EXISTS {$table_name} (
			  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
			  `user_id` int(11) UNSIGNED NOT NULL,
			  `role_id` int(11) UNSIGNED NOT NULL,
			  `project_id` int(11) UNSIGNED DEFAULT NULL,
			  `assigned_by` int(11) UNSIGNED NOT NULL,
			  PRIMARY KEY (`id`),
			  KEY `project_id` (`project_id`),
			  KEY `role_id` (`role_id`),
			  KEY `user_id` (`user_id`),
			  KEY `assigned_by` (`assigned_by`)
			) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

        dbDelta($sql);
    }

    public function create_settings_table()
    {
        global $wpdb;
        $table_name = $this->prefix() . 'pm_settings';

        $sql = "CREATE TABLE IF NOT EXISTS {$table_name} (
			  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
			  `key` varchar(255) NOT NULL,
			  `value` text,
			  `project_id` int(11) UNSIGNED DEFAULT NULL,
			  `created_by` int(11) UNSIGNED DEFAULT NULL,
			  `updated_by` int(11) UNSIGNED DEFAULT NULL,
			  `created_at` timestamp NULL DEFAULT NULL,
			  `updated_at` timestamp NULL DEFAULT NULL,
			  PRIMARY KEY (`id`),
			  KEY `project_id` (`project_id`)
			) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

        dbDelta($sql);
    }


    public function create_import_table()
    {
        global $wpdb;
        $table_name = $this->prefix() . 'pm_imports';

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


    public function update_version()
    {
        delete_option('cpm_version');
        update_option('pm_version', config('app.version'));

        // record the activation date/time if not exists
        $installed = get_option('pm_installed');

        if (!$installed) {
            update_option('pm_installed', time());
        }
    }
}
