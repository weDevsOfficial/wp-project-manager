<?php

namespace WeDevs\PM\Core\WP;

use WeDevs\PM\Core\WP\Menu;
use WeDevs\PM\Core\WP\Register_Scripts;
use WeDevs\PM\Core\WP\Enqueue_Scripts as Enqueue_Scripts;
//use PM\Project\Project_Ajax;
use WeDevs\PM\Core\File_System\File_System as File_System;

class Frontend {

	/**
     * Constructor for the PM class
     *
     * Sets up all the appropriate hooks and actions
     * within our plugin.
     */
	public function __construct() {
		// instantiate classes
        $this->instantiate();

		// Initialize the action hooks
        $this->init_actions();

        // Initialize the action hooks
        $this->init_filters();
	}

	/**
	 * All actions
	 * 
	 * @return void
	 */
	public function init_actions() {
		add_action( 'admin_menu', array( new Menu, 'admin_menu' ) );
		//add_action( 'admin_enqueue_scripts', array( new  Enqueue_Scripts, 'scripts' ) );
		//add_action( 'admin_enqueue_scripts', array( new  Enqueue_Scripts, 'styles' ) );
		add_action( 'wp_ajax_pm_ajax_upload', array ( new File_System, 'ajax_upload_file' ) );
	}

	/**
	 * All filters
	 * 
	 * @return void
	 */
	public function init_filters() {
		
	}

	/**
	 * instantiate classes
	 * 
	 * @return void
	 */
	public function instantiate() {
		Register_Scripts::scripts();
		Register_Scripts::styles();
	}
}
