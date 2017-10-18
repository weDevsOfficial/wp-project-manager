<?php
$suffix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';

return [
	'pm-vue-multiselect' => [
		'id'         => 'pm-vue-multiselect',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'view/assets/css/vue-multiselect/vue-multiselect.min.css',
		'dependency' => false,
	],
	'pm-nprogress' => [
		'id'         => 'pm-nprogress',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'view/assets/css/nprogress/nprogress.css',
		'dependency' => false,
	],
	'pm-fontawesome' => [
		'id'         => 'pm-fontawesome',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'view/assets/css/fontawesome/font-awesome.min.css',
		'dependency' => false,
	],
	'pm-jquery-ui' => [
		'id'         => 'pm-jquery-ui',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'view/assets/css/jquery-ui/jquery-ui-1.9.1.custom.css',
		'dependency' => false,
	],
	'pm-tiny-mce' => [
		'id'         => 'pm-tiny-mce',
		'url'        => site_url( '/wp-includes/css/editor.css' ),
		'dependency' => false,
	],
	'pm-style' => [
		'id'         => 'pm-style',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'view/assets/css/style.css',
		'dependency' => [
			'pm-vue-multiselect',
			'pm-nprogress',
			'pm-fontawesome',
			'pm-jquery-ui',
			'pm-tiny-mce',
		],
	],
];
