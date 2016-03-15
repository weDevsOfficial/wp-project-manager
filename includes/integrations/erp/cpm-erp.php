<?php
/**
 * Plugin Name: WP Project Manager Pro - ERP Integration
 * Description: ERP integration add-on for WP Project Manager
 * Plugin URI:
 * Author: weDevs
 * Author URI: http://wedevs.com
 * Version: 0.1-alpha
 * License: GPL2
 * Text Domain: cpmerp
 * Domain Path: languages
 *
 * Copyright (c) 2014 weDevs (email: info@wedevs.com). All rights reserved.
 *
 * Released under the GPL license
 * http://www.opensource.org/licenses/gpl-license.php
 *
 * This is an add-on for WordPress
 * http://wordpress.org/
 *
 * **********************************************************************
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
 * **********************************************************************
 */

// don't call the file directly
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * CPM_ERP_Integration class
 *
 * @class CPM_ERP_Integration The class that holds the entire CPM_ERP_Integration plugin
 *
 * @package WP-ERP/WP Project Manager
 */
class CPM_ERP_Integration {

	/**
     * Plugin version
     *
     * @var string
     */
    public $version = '0.1';

   	/**
     * Check CPM active or not
     *
     * @var cpm $cpm
     */
    public static $cpm = true;

    /**
     * Check ERP active or not
     *
     * @var erp $erp
     */
    public static $erp = true;

    /**
     * Containing CPM_ERP activity class object
     *
     * @var activity $activity
     */
    public $activity;

    /**
     * Containing project object according current department
     *
     * @var array $project_info
     */
    public static $project_info;

    /**
     * Initializes the CPM_ERP_Integration() class
     *
     * @since  0.1
     *
     * Checks for an existing CPM_ERP_Integration() instance
     * and if it doesn't find one, creates it.
     */
    public static function init() {
        static $instance = false;

        if ( ! $instance ) {

            $instance = new self();
        }

        return $instance;
    }

    /**
     * Constructor for the CPM_ERP_Integration class
     *
     * Sets up all the appropriate hooks and actions
     * within our plugin.
     */
    public function __construct() {

    	// Define constants
        $this->define_constants();

        // Include required files
        $this->includes();

        // Initialize the action hooks
        $this->init_actions();

        // Loaded action
        do_action( 'cpmerp_loaded' );
    }

    /**
    * Define the plugin constants
    *
    * @since  0.1
    *
    * @return void
    */
    private function define_constants() {
        define( 'CPMERP_VERSION', $this->version );
        define( 'CPMERP_FILE', __FILE__ );
        define( 'CPMERP_PATH', dirname( CPMERP_FILE ) );
        define( 'CPMERP_INCLUDES', CPMERP_PATH . '/includes' );
        define( 'CPMERP_URL', plugins_url( '', CPMERP_FILE ) );
        define( 'CPMERP_ASSETS', CPMERP_URL . '/assets' );
        define( 'CPMERP_VIEWS', CPMERP_PATH . '/views' );
    }

    /**
    * Include the required files
    *
    * @since  0.1
    *
    * @return void
    */
    function includes() {
        require_once CPMERP_INCLUDES . '/class-cpmerp.php';

        $this->activity = CPM_ERP::init();
    }

    /**
    * Doing initial action for this class
    *
    * @since  0.1
    *
    * @return void
    */
    function init_actions() {
        add_action( 'admin_enqueue_scripts', array( $this, 'init_script' ) );
    }

    /**
     * Scripts for this plugin
     *
     * @since  0.1
     *
     * @return void
     */
    function init_script() {

        wp_enqueue_script( 'cpm-erp-integrate', CPMERP_ASSETS . '/js/cpm-erp.js', array( 'jquery' ), false, true );

        $employee_id   = isset( $_GET['id'] ) ? intval( $_GET['id'] ) : false;
        $employee      = new \WeDevs\ERP\HRM\Employee( $employee_id );
        $department_id = intval( $employee->department );

        self::$project_info = cpm_get_project_by_user( $department_id );

        wp_localize_script( 'cpm-erp-integrate', 'cpm_attr', array(
            'project_attr' => self::$project_info,
            'popup_title'  => __( 'Employee New Task', 'cpm' ),
            'submit'       => __( 'Submit', 'cpm' ),
            'alert'        => __( 'Text content is required', 'cpm' )
        ));
    }

    /**
     * Placeholder for activation function
     *
     * @since 0.1
     *
     * Nothing being called here yet.
     */
    public static function warning () {
    	require_once dirname ( __FILE__ ) . '/views/warning.php';
    }
}

/**
 * Initialize the integration with ERP
 *
 * @since  0.1
 *
 * @return void
 */
function cpmerp_init() {

    // Checking project manager plugin active or not
    if ( ! class_exists( 'WeDevs_CPM' ) ) {
        CPM_ERP_Integration::$cpm = false;
    }

    // Checking ERP plugin active or not
    if ( ! class_exists( 'WeDevs_ERP' ) ) {
        CPM_ERP_Integration::$erp = false;
    }

    // Show warning if CPM or ERP not installed
    if ( ! CPM_ERP_Integration::$cpm || ! CPM_ERP_Integration::$erp ) {
    	add_action( 'admin_notices', array( 'CPM_ERP_Integration', 'warning' ) );
        return;
    }

    $erp_active_modules = wperp()->modules->get_active_modules();

    // Checking HR module active or not
    if ( ! array_key_exists( 'hrm', $erp_active_modules ) ) {
        return;
    }

    // Instantiate Main class
    CPM_ERP_Integration::init();
}

add_action( 'plugins_loaded', 'cpmerp_init' );

/**
 * Get projects by user id
 *
 * @since  0.1
 *
 * @param  int $user_id
 *
 * @return object
 */
function cpm_get_project_by_user( $user_id ) {
    global $wpdb;

    $user_table = $wpdb->prefix . 'cpm_user_role';

    $sql = "SELECT post.ID as project_id, post.post_title as project_title, tl.ID as list_id, tl.post_title as list_title
            FROM $wpdb->posts as post
            LEFT JOIN $user_table as ut ON ut.project_id = post.ID
            LEFT JOIN $wpdb->posts as tl ON tl.post_parent = post.ID
            WHERE ut.user_id = $user_id AND ut.role ='co_worker' AND ut.component = 'erp-hrm'
            AND post.post_type = 'cpm_project'
            AND tl.post_type = 'cpm_task_list'";

    return $wpdb->get_results( $sql );
}

    /**
    * Doing after plugin active
    *
    * @since  0.1
    *
    * @return void
    */
    function  erp_integration_plugin_activated(){
        global $wpdb;

        $table  = $wpdb->prefix . 'cpm_user_role';
        $result = $wpdb->get_results ("SHOW COLUMNS FROM  $table LIKE 'component' ");
        if( !$result ) {
            $sql = " ALTER TABLE  $table ADD component VARCHAR(64) NOT NULL ; ";
            $wpdb->query($sql) ;
        }

    }
register_activation_hook( __FILE__, 'erp_integration_plugin_activated' );