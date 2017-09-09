<?php
$suffix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';

return [
	'cpm-nprogress' => [
		'id'         => 'cpm-nprogress',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'view/assets/css/nprogress/nprogress.css',
		'dependency' => false,
		'in_footer'  => true
	],

	'cpm-style' => [
		'id'         => 'cpm-style',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'view/assets/css/style.css',
		'dependency' => false,
		'in_footer'  => true
	],

	'cpm-fontawesome' => [
		'id'         => 'cpm-fontawesome',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'view/assets/css/fontawesome/font-awesome.min.css',
		'dependency' => false,
		'in_footer'  => true
	],
	'cpm-jquery-ui' => [
		'id'         => 'cpm-jquery-ui',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'view/assets/css/jquery-ui/jquery-ui-1.9.1.custom.css',
		'dependency' => false,
		'in_footer'  => true
	]
];
