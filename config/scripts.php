<?php

$suffix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';

return [
	// 'pm-chart' => [
	// 	'id'         => 'pm-chart',
	// 	'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'views/assets/js/chart/chart.min.js',
	// 	'dependency' => ['jquery'],
	// 	'in_footer'  => true
	// ],
	// 'pm-upload' => [
	// 	'id'         => 'pm-upload',
	// 	'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'views/assets/js/upload.js',
	// 	'dependency' => ['jquery', 'plupload-handlers'],
	// 	'in_footer'  => true
	// ],
	// 'pm-timepicker' => [
	// 	'id'         => 'pm-timepicker',
	// 	'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'views/assets/js/jquery-ui/jquery-ui-timepicker.js',
	// 	'dependency' => ['jquery'],
	// 	'in_footer'  => true
	// ],
	// 'pm-moment' => [
	// 	'id'         => 'pm-moment',
	// 	'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'views/assets/js/moment/moment.js',
	// 	'dependency' => ['jquery'],
	// 	'in_footer'  => true
	// ],

	'pm-tiny-mce' => [
		'id'         => 'pm-tiny-mce',
		'url'        => site_url( '/wp-includes/js/tinymce/tinymce.min.js' ),
		'dependency' => false,
		'in_footer'  => true
	],

	// 'pm-moment-timezone' => [
	// 	'id'         => 'pm-moment-timezone',
	// 	'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'views/assets/js/moment/moment-timezone.js',
	// 	'dependency' => ['jquery', 'pm-moment'],
	// 	'in_footer'  => true
	// ],

	// 'pm-toastr' => [
	// 	'id'         => 'pm-toastr',
	// 	'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'views/assets/js/toastr/toastr.min.js',
	// 	'dependency' => ['jquery'],
	// 	'in_footer'  => true
	// ],

	// 'pm-nprogress' => [
	// 	'id'         => 'pm-nprogress',
	// 	'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'views/assets/js/nprogress/nprogress.js',
	// 	'dependency' => ['jquery'],
	// 	'in_footer'  => true
	// ],

	// 'pm-vue' => [
	// 	'id'         => 'pm-vue',
	// 	'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'views/assets/js/vue/vue' . $suffix . '.js',
	// 	'dependency' => ['jquery'],
	// 	'in_footer'  => true
	// ],

	// 'pm-vuex' => [
	// 	'id'         => 'pm-vuex',
	// 	'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'views/assets/js/vue/vuex' . $suffix . '.js',
	// 	'dependency' => ['jquery', 'pm-vue'],
	// 	'in_footer'  => true
	// ],

	// 'pm-vue-router' => [
	// 	'id'         => 'pm-vue-router',
	// 	'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'views/assets/js/vue/vue-router' . $suffix . '.js', 
	// 	'dependency' => ['jquery', 'pm-vue', 'pm-vuex'],
	// 	'in_footer'  => true
	// ],

	'pm-library' => [
		'id'         => 'pm-library',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'views/assets/js/library.js',
		'dependency' => array( 'jquery' ),
		'in_footer'  => false
	],

	'pm-config' => [
		'id'         => 'pm-config',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'views/assets/js/config.js',
		'dependency' => array( 'pm-library' ),
		'in_footer'  => false
	],

	'pm' => [
		'id'         => 'pm-scripts',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'views/assets/js/pm.js',
		'dependency' => [
			'pm-config',
			'jquery', 
			'underscore',
			'plupload-handlers',
			'jquery-ui-datepicker',
			'jquery-ui-dialog', 
			'jquery-ui-autocomplete',
			'pm-tiny-mce',
			'jquery-ui-sortable',
		],
		'in_footer'  => true
	]
];
