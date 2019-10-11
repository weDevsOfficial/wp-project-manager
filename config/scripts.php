<?php

global $wp_version;
$suffix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';
$view_path = dirname (__FILE__) . '/../views/';

$pm_scripts = [
	
	'pm-config' => [
		'id'         => 'pm-config',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'views/assets/vendor/bootstrap.js',
		'path'       => $view_path . '/assets/vendor/bootstrap.js',
		'dependency' => ['jquery'],
		'in_footer'  => true
	],

	'pm-tiny-mce' => [
		'id'         => 'pm-tiny-mce',
		'url'        => site_url( '/wp-includes/js/tinymce/tinymce.min.js' ),
		'dependency' => ['pm-config'],
		'in_footer'  => true
	],

	'pm-time-picker' => [
		'id'         => 'pm-time-picke',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'views/assets/vendor/jquery-ui-timepicker/jquery-ui-timepicker.js',
		'path'       => $view_path . '/assets/vendor/jquery-ui-timepicker/jquery-ui-timepicker.js',
		'dependency' => ['jquery-ui-datepicker','pm-tiny-mce'],
		'in_footer'  => true
	],

	'pm-jed' => [
		'id'         => 'pm-jed',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'views/assets/vendor/i18n/jed.js',
		'path'       => $view_path . '/assets/vendor/i18n/jed.js',
		'dependency' => ['pm-time-picke'],
		'in_footer'  => true
	],
	
	'pm-i18n' => [
		'id'         => 'pm-i18n',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'views/assets/vendor/i18n/i18n.js',
		'path'       => $view_path . '/assets/vendor/i18n/i18n.js',
		'dependency' => ['pm-jed'],
		'in_footer'  => true
	],

	'pm-vue' => [
		'id'         => 'pm-vue',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'views/assets/vendor/vue/vue'.$suffix.'.js',
		'path'       => $view_path . '/assets/vendor/vue/vue'.$suffix.'.js',
		'path' => 'https://cdn.jsdelivr.net/npm/vue',
		'dependency' => ['pm-i18n'],
		'in_footer'  => true
	],
	'pm-vuex' => [
		'id'         => 'pm-vuex',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'views/assets/vendor/vue/vuex'.$suffix.'.js',
		'path'       => $view_path . '/assets/vendor/vue/vuex'.$suffix.'.js',
		'path' => 'https://unpkg.com/vuex',
		'dependency' => ['pm-vue'],
		'in_footer'  => true
	],

	'pm-vue-router' => [
		'id'         => 'pm-vue-router',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'views/assets/vendor/vue/vue-router'.$suffix.'.js',
		'path'       => $view_path . '/assets/vendor/vue/vue-router'.$suffix.'.js',
		'dependency' => ['pm-vuex'],
		'in_footer'  => true
	],
	
	'pm-chart' => [
		'id'         => 'pm-chart',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'views/assets/vendor/chart/chart'.$suffix.'.js',
		'path'       => $view_path . '/assets/vendor/chart/chart'.$suffix.'.js',
		'dependency' => ['pm-vue-router'],
		'in_footer'  => true
	],
	'pm-preloader' => [
		'id'         => 'pm-preloader',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'views/assets/vendor/Elegant-Loading-Indicator/jquery.preloader'.$suffix.'.js',
		'path'       => $view_path . '/assets/vendor/Elegant-Loading-Indicator/jquery.preloader'.$suffix.'.js',
		'dependency' => ['pm-chart'],
		'in_footer'  => true
	],
	'pm-moment' => [
		'id'         => 'pm-moment',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'views/assets/vendor/moment/moment'.$suffix.'.js',
		'path'       => $view_path . '/assets/vendor/moment/moment'.$suffix.'.js',
		'dependency' => ['pm-preloader'],
		'in_footer'  => true
	],
	'pm-locale' => [
		'id'         => 'pm-locale',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'views/assets/vendor/fullcalendar/locale-all.js',
		'path'       => $view_path . '/assets/vendor/fullcalendar/locale-all.js',
		'dependency' => ['pm-moment'],
		'in_footer'  => true
	],
	'pm-fullcalendar' => [
		'id'         => 'pm-fullcalendar',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'views/assets/vendor/fullcalendar/fullcalendar'.$suffix.'.js',
		'path'       => $view_path . '/assets/vendor/fullcalendar/fullcalendar'.$suffix.'.js',
		'dependency' => ['pm-moment'],
		'in_footer'  => true
	],

	'pm-fullcalendar-scheduler' => [
		'id'         => 'pm-fullcalendar-scheduler',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'views/assets/vendor/scheduler/scheduler.min.js',
		'path'       => $view_path . '/assets/vendor/scheduler/scheduler.min.js',
		'dependency' => ['pm-fullcalendar'],
		'in_footer'  => true
	],

	'pm-v-tooltip' => [
		'id'         => 'pm-v-tooltip',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'views/assets/vendor/v-tooltip/v-tooltip.min.js',
		'path'       => $view_path . '/assets/vendor/v-tooltip/v-tooltip.min.js',
		'dependency' => ['pm-fullcalendar-scheduler'],
		'in_footer'  => true
	],

	'pm-v-fullscreen' => [
		'id'         => 'pm-v-fullscreen',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'views/assets/vendor/vue-fullscreen/vue-fullscreen.min.js',
		'path'       => $view_path . '/assets/vendor/vue-fullscreen/vue-fullscreen.min.js',
		'dependency' => ['pm-v-tooltip'],
		'in_footer'  => true
	],

	'pm-nprogress' => [
		'id'         => 'pm-nprogress',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'views/assets/vendor/nprogress/nprogress'.$suffix.'.js',
		'path'       => $view_path . '/assets/vendor/nprogress/nprogress'.$suffix.'.js',
		'dependency' => ['pm-v-tooltip', 'pm-locale', 'pm-v-fullscreen'],
		'in_footer'  => true
	],

	'pm-toastr' => [
		'id'         => 'pm-toastr',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'views/assets/vendor/toastr/toastr.min.js',
		'path'       => $view_path . '/assets/vendor/toastr/toastr.min.js',
		'dependency' => ['pm-nprogress'],
		'in_footer'  => true
	],

	'pm-vue-library' => [
		'id'         => 'pm-vue-library',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'views/assets/js/library.js',
		'path'       => $view_path . '/assets/js/library.js',
		'dependency' => ['pm-toastr'],
		'in_footer'  => true
	],

	'pm-pretty-photo' => [
		'id'         => 'pm-pretty-photo',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'views/assets/vendor/pretty-photo/jquery.prettyPhoto.js',
		'path'       => $view_path . '/assets/vendor/pretty-photo/jquery.prettyPhoto.js',
		'dependency' => ['pm-vue-library'],
		'in_footer'  => true
	],

	'pm-touch-punch' => [
		'id'         => 'pm-touch-punch',
		'path'       => $view_path . '/assets/vendor/touch-punch/draggabilly.min.js',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'views/assets/vendor/touch-punch/draggabilly.min.js',
		'dependency' => ['pm-pretty-photo'],
		'in_footer'  => true
	],

	'pm-date-range-picker' => [
		'id'         => 'pm-date-range-picker',
		'path'       => $view_path . '/assets/vendor/daterangepicker/daterangepicker.js',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'views/assets/vendor/daterangepicker/daterangepicker.js',
		'dependency' => ['pm-touch-punch'],
		'in_footer'  => true
	],

	'pm-tiptip' => [
		'id'         => 'pm-tiptip',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'views/assets/vendor/tiptip/jquery.tipTip.min.js',
		'path'       => $view_path . '/assets/vendor/tiptip/jquery.tipTip.min.js',
		'dependency' => ['pm-date-range-picker'],
		'in_footer'  => true
	],

	// 'pm-slicknav' => [
	// 	'id'         => 'pm-slicknav',
	// 	'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'views/assets/vendor/slicknav/slicknav.min.js',
	// 	'path'       => $view_path . '/assets/vendor/slicknav/slicknav.min.js',
	// 	'dependency' => ['pm-tiptip'],
	// 	'in_footer'  => true
	// ],

	'pm-uploader' => [
		'id'         => 'pm-uploader',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'views/assets/vendor/uploader/uploader.js',
		'path'       => $view_path . '/assets/vendor/uploader/uploader.js',
		'dependency' => ['pm-tiptip'],
		'in_footer'  => true
	],

	'pm-const' => [
		'id'         => 'pm-const',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'views/assets/vendor/const.js',
		'path'       => $view_path . '/assets/vendor/const.js',
		'dependency' => [
			'jquery', 
			'underscore',
			'plupload-handlers',
			'jquery-ui-progressbar',
			'jquery-ui-datepicker',
			'jquery-ui-dialog', 
			'jquery-ui-autocomplete',
			'jquery-ui-tooltip',
			'pm-tiny-mce',
			'jquery-ui-sortable',
			'jquery-touch-punch',
			'pm-uploader',
		],
		'in_footer'  => true
	],

	'pm' => [
		'id'         => 'pm-scripts',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'views/assets/js/pm.js',
		'path'       => $view_path . '/assets/js/pm.js',
		'dependency' => [
			'pm-const'
		],
		'in_footer'  => true
	],
	'pmglobal' => [
		'id'         => 'pmglobal',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'views/assets/js/pmglobal.js',
		'path'       => $view_path . '/assets/js/pmglobal.js',
		'dependency' => [
			'jquery',
			'jquery-ui-autocomplete',
		],
		'in_footer'  => true
	]
];

//if ( ( version_compare( $wp_version, '5.0', '<' ) ) || ! is_admin() ) {
    $pm_hooks = [
	    'pm-hooks' => [
			'id'         => 'pm-hooks',
			'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'views/assets/vendor/wp-hooks/pm-hooks.js',
			'path'       => $view_path . '/assets/vendor/wp-hooks/pm-hooks.js',
			'dependency' => [],
			'in_footer'  => true
		]
	];

	$pm_scripts['pm-vue-library']['dependency'] = array_merge( [$pm_hooks['pm-hooks']['id']], $pm_scripts['pm-vue-library']['dependency'] );

	$pm_scripts = array_merge( $pm_scripts, $pm_hooks );
//}

return $pm_scripts;



