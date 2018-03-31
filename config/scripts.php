<?php

$suffix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';

return [

	'pm-tiny-mce' => [
		'id'         => 'pm-tiny-mce',
		'url'        => site_url( '/wp-includes/js/tinymce/tinymce.min.js' ),
		'dependency' => false,
		'in_footer'  => true
	],

	'pm-library' => [
		'id'         => 'pm-library',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'views/assets/js/library.js',
		'dependency' => array( 'jquery' ),
		'in_footer'  => false
	],

	'pm-time-picker' => [
		'id'         => 'pm-time-picke',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'views/assets/vendor/jquery-ui-timepicker/jquery-ui-timepicker.js',
		'dependency' => array( 'pm-library' ),
		'in_footer'  => false
	],

	'pm-config' => [
		'id'         => 'pm-config',
		'url'        => plugin_dir_url( dirname( __FILE__ ) ) . 'views/assets/vendor/config.js',
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
			'jquery-ui-progressbar',
			'jquery-ui-datepicker',
			'jquery-ui-dialog', 
			'jquery-ui-autocomplete',
			'pm-tiny-mce',
			'jquery-ui-sortable',
		],
		'in_footer'  => true
	]
];
