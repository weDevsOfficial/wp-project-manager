<?php

class PM_Create_Table {
	function __construct() {
		$this->create_project_table();
	}

	function create_project_table() {
		global $wpdb;
		$table_name = $wpdb->prefix . 'hrm_personal_education';
		$sql = "DROP TABLE IF EXISTS $table_name";
		$wpdb->query($sql);

		$sql = "CREATE TABLE IF NOT EXISTS {$table_name} (
		`id` int(11) NOT NULL AUTO_INCREMENT,
		`employee_id` int(11) NOT NULL,
		`education` varchar(255) NOT NULL,
		`institute` varchar(100) DEFAULT NULL,
		`major` varchar(100) DEFAULT NULL,
		`year` timestamp NULL DEFAULT NULL,
		`score` varchar(25) DEFAULT NULL,
		`start_date` timestamp NULL DEFAULT NULL,
		`end_date` timestamp NULL DEFAULT NULL,
		PRIMARY KEY (`id`)
		) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;";

		require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
		dbDelta( $sql );
	}
}