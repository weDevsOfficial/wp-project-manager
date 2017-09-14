<?php
return [
	'suffix'     => defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min',
	'patch'      => dirname( dirname( __FILE__ ) ),
	'view_path'  => dirname( dirname( __FILE__ ) ) . '/view',
	'url'        => plugin_dir_url( dirname( __FILE__ ) ),
	'assets_url' => plugin_dir_url( dirname( __FILE__ ) ) . 'view/assets/',
	'path'       => plugin_dir_path( __FILE__ )
];


