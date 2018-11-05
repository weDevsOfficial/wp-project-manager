<?php

namespace WeDevs\PM\Core\WP;

class Register_Scripts {
	
	public static function scripts() {
		$scripts = config('scripts');

		foreach ( $scripts as $script ) {
			$path = empty( $script['path'] ) ? config( 'app.version' ) : filemtime( $script['path'] );
			
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
			$path = empty( $style['path'] ) ? config( 'app.version' ) : filemtime( $style['path'] );

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
