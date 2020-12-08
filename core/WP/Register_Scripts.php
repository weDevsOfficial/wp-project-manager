<?php

namespace WeDevs\PM\Core\WP;

class Register_Scripts {
	
	public static function scripts() {
		$scripts = config('scripts');
		
		foreach ( $scripts as $script ) {
			$path = config( 'app.version' );
			
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
		$styles = config('style');
		
		foreach ( $styles as $style ) {
			$path = config( 'app.version' );
			
			if ( !empty( $script['path'] ) && file_exists( $script['path'] ) ) {
				$path = filemtime( $script['path'] );
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
