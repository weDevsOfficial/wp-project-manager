<?php

$suffix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';

return [
	'cpm-nprogress' => [
		'id'         => 'cpm-nprogress',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'view/assets/css/nprogress/nprogress.css',
		'dependency' => false,
		'in_footer'  => true
	],
];
