<?php

namespace WeDevs\PM\Core\WP;

class Output {

	public static function home_page() {
		echo wp_kses( wedevs_pm_root_element(), array( 'div' => array( 'id' => array() ) ) );
	}
}
