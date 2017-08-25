<?php

namespace CPM\Core\WP;

class Regiser_Scripts {
	
	public static function register() {
		$scripts = config('scripts');

		foreach ( $scripts as $script ) {
			wp_register_script( 
				$script['id'], 
				$script['url'], 
				$script['dependency'], 
				config( 'app.version' ), 
				$script['in_footer'] 
			);
		}
	}
}