<?php
$suffix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';
$view_path = dirname (__FILE__) . '/../views/';

return [
	'pm-vue-multiselect' => [
		'id'         => 'pm-vue-multiselect',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'views/assets/css/vue-multiselect/vue-multiselect.min.css',
		'dependency' => false,
		'path'       => $view_path . '/assets/css/vue-multiselect/vue-multiselect.min.css',
	],
	'pm-nprogress' => [
		'id'         => 'pm-nprogress',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'views/assets/css/nprogress/nprogress.css',
		'dependency' => false,
		'path'       => $view_path . '/assets/css/nprogress/nprogress.css',
	],
	'pm-fontawesome' => [
		'id'         => 'pm-fontawesome',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'views/assets/css/fontawesome/font-awesome.min.css',
		'dependency' => false,
		'path'       => $view_path . '/assets/css/fontawesome/font-awesome.min.css',
	],
	'pm-toastr' => [
		'id'         => 'pm-toastr',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'views/assets/css/toastr/toastr.min.css',
		'dependency' => false,
		'path'       => $view_path . '/assets/css/toastr/toastr.min.css',
	],
	'pm-fullcalendar' => [
		'id'         => 'pm-fullcalendar',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'views/assets/css/jquery-fullcalendar/fullcalendar.min.css',
		'dependency' => false,
		'path'       => $view_path . '/assets/css/jquery-fullcalendar/fullcalendar.min.css',
	],
	'pm-jquery-ui' => [
		'id'         => 'pm-jquery-ui',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'views/assets/css/jquery-ui/jquery-ui-1.12.1.custom.css',
		'dependency' => false,
		'path'       => $view_path . '/assets/css/jquery-ui/jquery-ui-1.12.1.custom.css',
	],
	'pm-pretty-photo' => [
		'id'         => 'pm-pretty-photo',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'views/assets/css/pretty-photo/prettyPhoto.css',
		'dependency' => false,
		'path'       => $view_path . '/assets/css/pretty-photo/prettyPhoto.css',
	],
	'pm-tiny-mce' => [
		'id'         => 'pm-tiny-mce',
		'url'        => site_url( '/wp-includes/css/editor.css' ),
		'dependency' => false,
	],
	'pm-loading' => [
		'id'         => 'pm-loading',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'views/assets/css/Elegant-Loading-Indicator/preloader.css',
		'dependency' => false,
		'path'       => $view_path . '/assets/css/Elegant-Loading-Indicator/preloader.css',
	],
	'pm-autocomplete' => [
		'id'         => 'pm-loaautocompleteding',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'views/assets/css/v-autocomplete/v-autocomplete.css',
		'dependency' => false,
		'path'       => $view_path . '/assets/css/v-autocomplete/v-autocomplete.css',
	],
	'pm-tiptip' => [
		'id'         => 'pm-tiptip',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'views/assets/css/tiptip/tipTip.css',
		'dependency' => false,
		'path'       => $view_path . '/assets/css/tiptip/tipTip.css',
	],
	'pm-daterangepicker' => [
		'id'         => 'pm-daterangepicker',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'views/assets/css/daterangepicker/daterangepicker.css',
		'dependency' => false,
		'path'       => $view_path . '/assets/css/daterangepicker/daterangepicker.css',
	],
	'pm-v-tooltip' => [
		'id'         => 'pm-v-tooltip',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'views/assets/css/v-tooltip/v-tooltip.css',
		'dependency' => false,
		'path'       => $view_path . '/assets/css/v-tooltip/v-tooltip.css',
	],
	'pm-scheduler' => [
		'id'         => 'pm-scheduler',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'views/assets/css/scheduler/scheduler.min.css',
		'dependency' => false,
		'path'       => $view_path . '/assets/css/scheduler/scheduler.min.css',
	],
	'pm-new-style' => [
		'id'         => 'pm-new-style',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'views/assets/css/pm-style.css',
		'dependency' => false,
		'path'       => $view_path . '/assets/css/pm-style.css',
	],
	'pm-slicknav' => [
		'id'         => 'pm-slicknav',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'views/assets/css/slicknav/slicknav.min.css',
		'dependency' => false,
		'path'       => $view_path . '/assets/css/slicknav/slicknav.min.css',
	],
	'pm-const-style' => [
		'id'         => 'pm-const-style',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'views/assets/css/const-style.css',
		'dependency' => false,
		'path'       => $view_path . '/assets/css/const-style.css',
	],
	'pmglobal' => [
        'id'         => 'pmglobal',
        'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'views/assets/css/pmglobal.css',
        'path'       => $view_path . '/assets/css/pmglobal.css',
        'dependency' => [
			//'pm-const-style'
        ],
    ],
	'pm-style' => [
		'id'         => 'pm-style',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'views/assets/css/style.css',
		'path'       => $view_path . '/assets/css/style.css',
		'dependency' => [
			'pm-vue-multiselect',
			'pm-nprogress',
			'pm-fontawesome',
			'pm-toastr',
			'pm-jquery-ui',
			'pm-fullcalendar',
			'pm-tiny-mce',
			'pm-loading',
			'pm-loaautocompleteding',
			'pm-pretty-photo',
			'pm-tiptip',
			'pm-v-tooltip',
			'pm-scheduler',
			'pm-daterangepicker',
			'pm-const-style',
			'pm-new-style',
			'pm-slicknav'
		]
	],


];
