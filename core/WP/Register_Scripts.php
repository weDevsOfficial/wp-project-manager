<?php

namespace WeDevs\PM\Core\WP;

class Register_Scripts {
	
	public static function scripts() {
		$scripts = wedevs_pm_config('scripts');
		
		foreach ( $scripts as $script ) {
			$path = wedevs_pm_config( 'app.version' );
			
			if ( !empty( $script['path'] ) && file_exists( $script['path'] ) ) {
				$path = filemtime( $script['path'] );
			}
			
			wp_register_script( 
				$script['id'], 
				$script['url'], 
				$script['dependency'], 
				$path, 
				$script['in_footer'] 
			);
		}
	}

	public static function styles() {
		$styles = wedevs_pm_config('style');
		
		foreach ( $styles as $style ) {
			$path = wedevs_pm_config( 'app.version' );
			
			
			if ( !empty( $style['path'] ) && file_exists( $style['path'] ) ) {
				$path = filemtime( $style['path'] );
			}

			wp_register_style( 
				$style['id'], 
				$style['url'], 
				$style['dependency'], 
				$path, 
				'all'
			);
		}
	}
}
