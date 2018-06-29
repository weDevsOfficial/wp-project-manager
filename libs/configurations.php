<?php

use WeDevs\PM\Core\Config\Config;

if ( ! function_exists( 'config' ) ) {
		
	function config( $key = null ) {
	    return Config::get( $key );
	}
}

function pm_config( $key = null ) {
    return Config::get( $key );
}

function pm_wp_config( $key ) {
    return constant( $key );
}

function migrations_table_prefix() {
    $slug 	= config( 'app.slug' );
    $prefix = str_replace( '-', '_', str_replace( ' ', '_', $slug ) );

    return $prefix;
}
