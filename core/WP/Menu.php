<?php

namespace CPM\Core\WP;

use CPM\Core\WP\Output as Output;

class Menu {

	private static $capability = 'read';
	
	public static function admin_menu() {
		global $submenu;

		add_menu_page( __( 'Project Manager', 'pm' ), __( 'Project Manager', 'pm' ), self::$capability, 'pm_projects', array( new Output, 'home_page' ), 'dashicons-networking', 3 );

		$submenu['pm_projects'][] = [ __( 'Projects', 'pm' ), self::$capability, 'admin.php?page=pm_projects#/' ];
		$submenu['pm_projects'][] = [ __( 'Categories', 'pm' ), self::$capability, 'admin.php?page=pm_projects#/categories' ];
		$submenu['pm_projects'][] = [ __( 'Add-ons', 'pm' ), self::$capability, 'admin.php?page=pm_projects#/add-ons' ];
		$submenu['pm_projects'][] = [ __( 'My Tasks', 'pm' ), self::$capability, 'admin.php?page=pm_projects#/my-tasks' ];
		$submenu['pm_projects'][] = [ __( 'Calendar', 'pm' ), self::$capability, 'admin.php?page=pm_projects#/calendar' ];
		$submenu['pm_projects'][] = [ __( 'Reports', 'pm' ), self::$capability, 'admin.php?page=pm_projects#/reports' ];
		$submenu['pm_projects'][] = [ __( 'Progress', 'pm' ), self::$capability, 'admin.php?page=pm_projects#/progress' ];
		$submenu['pm_projects'][] = [ __( 'Settings', 'pm' ), self::$capability, 'admin.php?page=pm_projects#/settings' ];
	}
}