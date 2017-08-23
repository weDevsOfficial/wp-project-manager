<?php

namespace CPM\Core\WP;

use CPM\Core\WP\Output as Output;

class Menu {

	private static $capability = 'read';
	
	public static function admin_menu() {
		add_menu_page( __( 'Project Manager', 'cpm' ), __( 'Project Manager', 'cpm' ), self::$capability, 'cpm_projects', array( new Output, 'home_page' ), 'dashicons-networking', 3 );
	}
}