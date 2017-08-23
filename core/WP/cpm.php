<?php

namespace CPM\Core\WP;

use CPM\Core\WP\Menu as Menu;
use CPM\Core\WP\Regiser_Scripts;
use CPM\Core\WP\Enqueue_Scripts as Enqueue_Scripts;

class CPM {

	/**
     * Constructor for the CPM class
     *
     * Sets up all the appropriate hooks and actions
     * within our plugin.
     */
	public function __construct() {
		add_action( 'init', array( $this, 'view_bundle' ) );
	}

	/**
     * View door
     *
     * @return  void
     */
	public function view_bundle() {
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
		add_action( 'admin_enqueue_scripts', array( new  Enqueue_Scripts, 'enqueue' ) );
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
		Regiser_Scripts::register();
	}
}
