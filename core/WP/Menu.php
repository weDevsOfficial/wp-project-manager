<?php

namespace WeDevs\PM\Core\WP;

use WeDevs\PM\Core\WP\Output as Output;
use WeDevs\PM\Core\WP\Enqueue_Scripts as Enqueue_Scripts;

class Menu {

	private static $capability = 'read';
	
	public static function admin_menu() {
		global $submenu;
		$ismanager = pm_has_manage_capability();
		$home = add_menu_page( __( 'Project Manager', 'cpm' ), __( 'Project Manager', 'cpm' ), self::$capability, 'pm_projects', array( new Output, 'home_page' ), 'dashicons-networking', 3 );

		$submenu['pm_projects'][] = [ __( 'Projects', 'cpm' ), self::$capability, 'admin.php?page=pm_projects#/' ];
		if ( $ismanager ) {
			$submenu['pm_projects'][] = [ __( 'Categories', 'pm' ), self::$capability, 'admin.php?page=pm_projects#/categories' ];
		}
		$submenu['pm_projects']['my_task'] = [ __( 'My Tasks', 'pm' ), self::$capability, 'admin.php?page=pm_projects#/my-tasks' ];
		$submenu['pm_projects']['calendar'] = [ __( 'Calendar', 'pm' ), self::$capability, 'admin.php?page=pm_projects#/calendar' ];
		$submenu['pm_projects'][] = [ __( 'Add-ons', 'pm' ), self::$capability, 'admin.php?page=pm_projects#/add-ons' ];
		if ( $ismanager ) {
			$submenu['pm_projects'][] = [ __( 'Reports', 'pm' ), self::$capability, 'admin.php?page=pm_projects#/reports' ];
			$submenu['pm_projects'][] = [ __( 'Progress', 'pm' ), self::$capability, 'admin.php?page=pm_projects#/progress' ];
			$submenu['pm_projects'][] = [ __( 'Settings', 'pm' ), self::$capability, 'admin.php?page=pm_projects#/settings' ];
		}
		

		do_action( 'pm_menu_before_load_scripts', $home );
		
		add_action( 'admin_print_styles-' . $home, array( $this, 'scripts' ) );

		do_action( 'pm_menu_after_load_scripts', $home );
	}

	public function scripts() {
		Enqueue_Scripts::scripts();
		Enqueue_Scripts::styles();
	}
}