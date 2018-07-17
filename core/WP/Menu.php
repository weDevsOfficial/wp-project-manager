<?php

namespace WeDevs\PM\Core\WP;

use WeDevs\PM\Core\WP\Output as Output;
use WeDevs\PM\Core\WP\Enqueue_Scripts as Enqueue_Scripts;

class Menu {

	private static $capability = 'read';
	
	public static function admin_menu() {
		global $submenu;
		$ismanager = pm_has_manage_capability();

		$home = add_menu_page( __( 'Project Manager', 'wedevs-project-manager' ), __( 'Project Manager', 'wedevs-project-manager' ), self::$capability, 'pm_projects', array( new Output, 'home_page' ), 'dashicons-networking', 3 );

		$submenu['pm_projects'][] = [ __( 'Projects', 'wedevs-project-manager' ), self::$capability, 'admin.php?page=pm_projects#/' ];
		if ( $ismanager ) {
			$submenu['pm_projects'][] = [ __( 'Categories', 'wedevs-project-manager' ), self::$capability, 'admin.php?page=pm_projects#/categories' ];
		}
		$submenu['pm_projects']['my_task'] = [ __( 'My Tasks', 'wedevs-project-manager' ), self::$capability, 'admin.php?page=pm_projects#/my-tasks' ];
		$submenu['pm_projects']['calendar'] = [ __( 'Calendar', 'wedevs-project-manager' ), self::$capability, 'admin.php?page=pm_projects#/calendar' ];
		//$submenu['pm_projects'][] = [ __( 'Add-ons', 'wedevs-project-manager' ), self::$capability, 'admin.php?page=pm_projects#/add-ons' ];
		if ( $ismanager ) {
			$submenu['pm_projects'][] = [ __( 'Reports', 'wedevs-project-manager' ), self::$capability, 'admin.php?page=pm_projects#/reports' ];
			$submenu['pm_projects'][] = [ __( 'Progress', 'wedevs-project-manager' ), self::$capability, 'admin.php?page=pm_projects#/progress' ];
		}
		
		do_action( 'pm_menu_before_load_scripts', $home );
		
		add_action( 'admin_print_styles-' . $home, array( 'WeDevs\\PM\\Core\\WP\\Menu', 'scripts' ) );
		do_action( 'cpm_admin_menu', self::$capability, $home );

		//if ( $ismanager ) {
			$submenu['pm_projects'][] = [ __( 'Settings', 'wedevs-project-manager' ), 'administrator', 'admin.php?page=pm_projects#/settings' ];
		//}

		do_action( 'pm_menu_after_load_scripts', $home );
	}

	public static function scripts() {
		Enqueue_Scripts::scripts();
		Enqueue_Scripts::styles();
	}
}