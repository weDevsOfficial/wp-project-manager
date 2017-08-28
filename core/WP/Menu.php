<?php

namespace CPM\Core\WP;

use CPM\Core\WP\Output as Output;

class Menu {

	private static $capability = 'read';
	
	public static function admin_menu() {
		add_menu_page( __( 'Project Manager', 'pm' ), __( 'Project Manager', 'pm' ), self::$capability, 'pm_projects', array( new Output, 'home_page' ), 'dashicons-networking', 3 );
		
		add_submenu_page( 'pm_projects', __( 'Projects', 'pm' ), __( 'Projects', 'pm' ), self::$capability, 'pm_projects', array( new Output, 'home_page' ) );
		add_submenu_page( 'pm_projects', __( 'Categories', 'pm' ), __( 'Categories', 'pm' ), self::$capability, 'pm_projects#/categories', array( new Output, 'home_page' ) );
		add_submenu_page( 'pm_projects', __( 'Add-ons', 'pm' ), __( 'Add-ons', 'pm' ), self::$capability, 'pm_projects#/add-ons', array( new Output, 'home_page' ) );
		add_submenu_page( 'pm_projects', __( 'My Tasks', 'pm' ), __( 'My Tasks', 'pm' ), self::$capability, 'pm_projects#/my-tasks', array( new Output, 'home_page' ) );
		add_submenu_page( 'pm_projects', __( 'Calendar', 'pm' ), __( 'Calendar', 'pm' ), self::$capability, 'pm_projects#/calendar', array( new Output, 'home_page' ) );
		add_submenu_page( 'pm_projects', __( 'Reports', 'pm' ), __( 'Reports', 'pm' ), self::$capability, 'pm_projects#/reports', array( new Output, 'home_page' ) );
		add_submenu_page( 'pm_projects', __( 'Progress', 'pm' ), __( 'Progress', 'pm' ), self::$capability, 'pm_projects#/progress', array( new Output, 'home_page' ) );
		add_submenu_page( 'pm_projects', __( 'Settings', 'pm' ), __( 'Settings', 'pm' ), self::$capability, 'pm_projects#/settings', array( new Output, 'home_page' ) );
	}
}