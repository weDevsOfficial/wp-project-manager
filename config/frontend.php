<?php
return [
	'suffix'     => defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min',
	'patch'      => dirname( dirname( __FILE__ ) ),
	'view_path'  => dirname( dirname( __FILE__ ) ) . '/views',
	'url'        => plugin_dir_url( dirname( __FILE__ ) ),
	'assets_url' => plugin_dir_url( dirname( __FILE__ ) ) . 'views/assets/',
	'path'       => plugin_dir_path( __FILE__ ),
	'basename' 	=> basename( dirname( dirname( __FILE__ ) ) )
];


