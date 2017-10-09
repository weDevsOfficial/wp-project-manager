<?php

$suffix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';

return [
	'cpm-upload' => [
		'id'         => 'cpm-upload',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'view/assets/js/upload.js',
		'dependency' => ['jquery', 'plupload-handlers'],
		'in_footer'  => true
	],
	'cpm-timepicker' => [
		'id'         => 'cpm-timepicker',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'view/assets/js/jquery-ui/jquery-ui-timepicker.js',
		'dependency' => ['jquery'],
		'in_footer'  => true
	],
	'cpm-moment' => [
		'id'         => 'cpm-moment',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'view/assets/js/moment/moment.js',
		'dependency' => ['jquery'],
		'in_footer'  => true
	],

	'cpm-tiny-mce' => [
		'id'         => 'cpm-tiny-mce',
		'url'        => site_url( '/wp-includes/js/tinymce/tinymce.min.js' ),
		'dependency' => false,
		'in_footer'  => true
	],

	'cpm-moment-timezone' => [
		'id'         => 'cpm-moment-timezone',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'view/assets/js/moment/moment-timezone.js',
		'dependency' => ['jquery', 'cpm-moment'],
		'in_footer'  => true
	],

	'cpm-toastr' => [
		'id'         => 'cpm-toastr',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'view/assets/js/toastr/toastr.min.js',
		'dependency' => ['jquery'],
		'in_footer'  => true
	],

	'cpm-nprogress' => [
		'id'         => 'cpm-nprogress',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'view/assets/js/nprogress/nprogress.js',
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
	
	'pm-config' => [
		'id'         => 'pm-config',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'view/assets/js/config.js',
		'dependency' => array( 'jquery' ),
		'in_footer'  => false
	],

	'cpm' => [
		'id'         => 'pm-scripts',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'view/assets/js/cpm-bundle' . $suffix . '.js',
		'dependency' => [
			'jquery', 
			'underscore',
			'cpm-moment-timezone',
			'cpm-upload',
			'jquery-ui-datepicker',
			'cpm-timepicker',
			'cpm-nprogress', 
			'jquery-ui-dialog', 
			'jquery-ui-autocomplete',
			'cpm-tiny-mce',
			'cpm-toastr',
			'jquery-ui-sortable'

		],
		'in_footer'  => true
	]
];
