<?php

$suffix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';

return [
	'pm-chart' => [
		'id'         => 'pm-chart',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'view/assets/js/chart/chart.min.js',
		'dependency' => ['jquery'],
		'in_footer'  => true
	],
	'pm-upload' => [
		'id'         => 'pm-upload',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'view/assets/js/upload.js',
		'dependency' => ['jquery', 'plupload-handlers'],
		'in_footer'  => true
	],
	'pm-timepicker' => [
		'id'         => 'pm-timepicker',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'view/assets/js/jquery-ui/jquery-ui-timepicker.js',
		'dependency' => ['jquery'],
		'in_footer'  => true
	],
	'pm-moment' => [
		'id'         => 'pm-moment',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'view/assets/js/moment/moment.js',
		'dependency' => ['jquery'],
		'in_footer'  => true
	],

	'pm-tiny-mce' => [
		'id'         => 'pm-tiny-mce',
		'url'        => site_url( '/wp-includes/js/tinymce/tinymce.min.js' ),
		'dependency' => false,
		'in_footer'  => true
	],

	'pm-moment-timezone' => [
		'id'         => 'pm-moment-timezone',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'view/assets/js/moment/moment-timezone.js',
		'dependency' => ['jquery', 'pm-moment'],
		'in_footer'  => true
	],

	'pm-toastr' => [
		'id'         => 'pm-toastr',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'view/assets/js/toastr/toastr.min.js',
		'dependency' => ['jquery'],
		'in_footer'  => true
	],

	'pm-nprogress' => [
		'id'         => 'pm-nprogress',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'view/assets/js/nprogress/nprogress.js',
		'dependency' => ['jquery'],
		'in_footer'  => true
	],

	'pm-vue' => [
		'id'         => 'pm-vue',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'view/assets/js/vue/vue' . $suffix . '.js',
		'dependency' => ['jquery'],
		'in_footer'  => true
	],

	'pm-vuex' => [
		'id'         => 'pm-vuex',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'view/assets/js/vue/vuex' . $suffix . '.js',
		'dependency' => ['jquery', 'pm-vue'],
		'in_footer'  => true
	],

	'pm-vue-router' => [
		'id'         => 'pm-vue-router',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'view/assets/js/vue/vue-router' . $suffix . '.js', 
		'dependency' => ['jquery', 'pm-vue', 'pm-vuex'],
		'in_footer'  => true
	],
	
	'pm-config' => [
		'id'         => 'pm-config',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'view/assets/js/config.js',
		'dependency' => array( 'jquery' ),
		'in_footer'  => false
	],

	'pm' => [
		'id'         => 'pm-scripts',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'view/assets/js/pm-bundle' . $suffix . '.js',
		'dependency' => [
			'jquery', 
			'underscore',
			'pm-moment-timezone',
			'pm-upload',
			'jquery-ui-datepicker',
			'pm-timepicker',
			'pm-nprogress', 
			'jquery-ui-dialog', 
			'jquery-ui-autocomplete',
			'pm-tiny-mce',
			'pm-toastr',
			'jquery-ui-sortable',
			'pm-chart'

		],
		'in_footer'  => true
	]
];
