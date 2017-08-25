<?php

$suffix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';

return [
	'cpm-moment' => [
		'id'         => 'cpm-moment',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'view/assets/js/moment/moment.min.js',
		'dependency' => ['jquery'],
		'in_footer'  => true
	],

	'cpm-moment-timezone' => [
		'id'         => 'cpm-moment-timezone',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'view/assets/js/moment/moment-timezone.min.js',
		'dependency' => ['jquery'],
		'in_footer'  => true
	],

	'cpm-toastr' => [
		'id'         => 'cpm-toastr',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'view/assets/js/toastr/toastr.min.js',
		'dependency' => ['jquery'],
		'in_footer'  => true
	],

	'cpm-vue' => [
		'id'         => 'cpm-vue',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'view/assets/js/vue/vue' . $suffix . '.js',
		'dependency' => ['jquery'],
		'in_footer'  => true
	],

	'cpm-vuex' => [
		'id'         => 'cpm-vuex',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'view/assets/js/vue/vuex' . $suffix . '.js',
		'dependency' => ['jquery', 'cpm-vue'],
		'in_footer'  => true
	],

	'cpm-vue-router' => [
		'id'         => 'cpm-vue-router',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'view/assets/js/vue/vue-router' . $suffix . '.js', 
		'dependency' => ['jquery', 'cpm-vue', 'cpm-vuex'],
		'in_footer'  => true
	],
	
	'cpm' => [
		'id'         => 'cpm',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'view/assets/js/cpm-bundle' . $suffix . '.js',
		'dependency' => array( 'jquery' ),
		'in_footer'  => true
	],
];
