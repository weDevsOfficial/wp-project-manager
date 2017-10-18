<?php

namespace WeDevs\PM\Core\WP;

class Register_Scripts {
	
	public static function scripts() {
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

	public static function styles() {
		$styles = config('style');
		
		foreach ( $styles as $style ) {
			wp_register_style( 
				$style['id'], 
				$style['url'], 
				$style['dependency'], 
				config( 'app.version' ), 
				'all'
			);
		}
	}
}