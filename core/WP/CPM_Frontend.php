<?php

namespace CPM\Core\WP;

use CPM\Core\WP\Menu as Menu;
use CPM\Core\WP\Regiser_Scripts;
use CPM\Core\WP\Enqueue_Scripts as Enqueue_Scripts;
//use CPM\Project\Project_Ajax;
use CPM\Core\File_System\File_System as File_System;

class CPM_Frontend {

	/**
     * Constructor for the CPM class
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
		add_action( 'admin_enqueue_scripts', array( new  Enqueue_Scripts, 'scripts' ) );
		add_action( 'admin_enqueue_scripts', array( new  Enqueue_Scripts, 'styles' ) );
		add_action( 'wp_ajax_cpm_ajax_upload', array ( new File_System, 'ajax_upload_file' ) );
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
		Regiser_Scripts::scripts();
		Regiser_Scripts::styles();
	}
}
