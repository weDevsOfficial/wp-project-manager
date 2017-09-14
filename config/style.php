<?php
$suffix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';

return [
	'cpm-nprogress' => [
		'id'         => 'cpm-nprogress',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'view/assets/css/nprogress/nprogress.css',
		'dependency' => false,
	],
	'cpm-fontawesome' => [
		'id'         => 'cpm-fontawesome',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'view/assets/css/fontawesome/font-awesome.min.css',
		'dependency' => false,
	],
	'cpm-jquery-ui' => [
		'id'         => 'cpm-jquery-ui',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'view/assets/css/jquery-ui/jquery-ui-1.9.1.custom.css',
		'dependency' => false,
	],
	'cpm-tiny-mce' => [
		'id'         => 'cpm-tiny-mce',
		'url'        => site_url( '/wp-includes/css/editor.css' ),
		'dependency' => false,
	],
	'cpm-style' => [
		'id'         => 'cpm-style',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'view/assets/css/style.css',
		'dependency' => [
			'cpm-nprogress',
			'cpm-fontawesome',
			'cpm-jquery-ui',
			'cpm-tiny-mce',
		],
	],
];
