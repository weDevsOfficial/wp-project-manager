<?php
/**
 * Plugin Name: WP Project Manager
 * Plugin URI: https://wordpress.org/plugins/wedevs-project-manager/
 * Description: A WordPress Project Management plugin. Simply it does everything and it was never been easier with WordPress.
 * Author: Tareq Hasan
 * Author URI: http://tareq.weDevs.com
 * Version: 1.3.4
 * License: GPL2
 */

/**
 * Copyright (c) 2015 Tareq Hasan (email: info@wedevs.com). All rights reserved.
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

/**
 * Project Manager bootstrap class
 *
 * @author Tareq Hasan
 */
class WeDevs_CPM {

    /**
     * @var The single instance of the class
     * @since 0.1
     */
    protected static $_instance = null;

    /**
     * @var CPM_Project $project
     */
    public $project;

    /**
     * @var CPM_Message $message
     */
    public $message;

    /**
     * @var CPM_Task $task
     */
    public $task;

    /**
     * @var CPM_Milestone $milestone
     */
    public $milestone;

    /**
     * @var CPM_Router $router
     */
    public $router;

    /**
     * @var CPM_Activity $activity
     */
    public $activity;

    /**
     * @var CPM_Ajax $ajax
     */
    public $ajax;

    /**
     * @var CPM_Notification $notification
     */
    public $notification;

    /**
     * @var CPM_Api $api
     */
    public $api;

    function __construct() {
        $this->init();

        add_action( 'admin_menu', array($this, 'admin_menu') );

        add_action( 'plugins_loaded', array( $this, 'cpm_content_filter' ) );
        add_action( 'plugins_loaded', array($this, 'load_textdomain') );

        add_action( 'wp_enqueue_scripts', array( $this, 'admin_scripts' ) );
        add_filter( 'plugin_action_links', array($this, 'plugin_action_links'), 10, 2 );
        register_activation_hook( __FILE__, array($this, 'install') );
    }

    /**
     * Add shortcut links to the plugin action menu
     *
     * @since 0.4.4
     *
     * @param array $links
     * @param string $file
     * @return array
     */
    function plugin_action_links( $links, $file ) {

        if ( $file == plugin_basename( __FILE__ ) ) {
            $new_links = array(
                sprintf( '<a href="%s">%s</a>', 'http://wedevs.com/plugin/wp-project-manager/', __( 'Pro Version', 'cpm' ) ),
                sprintf( '<a href="%s">%s</a>', 'http://wedevs.com/wp-project-manager-add-ons/', __( 'Add-ons', 'cpm' ) ),
                sprintf( '<a href="%s">%s</a>', admin_url( 'admin.php?page=cpm_settings' ), __( 'Settings', 'cpm' ) )
            );

            return array_merge( $new_links, $links );
        }

        return $links;
    }

    /**
     * Main CPM Instance
     *
     * @since 1.1
     * @static
     * @see cpm()
     * @return CPMRP - Main instance
     */
    public static function instance() {
        if ( is_null( self::$_instance ) ) {
            self::$_instance = new self();
        }

        return self::$_instance;
    }

    /**
     * Add filters for text displays on Project Manager texts
     *
     * @since 0.4
     */
    function cpm_content_filter() {
        add_filter( 'cpm_get_content', 'wptexturize' );
        add_filter( 'cpm_get_content', 'convert_smilies' );
        add_filter( 'cpm_get_content', 'convert_chars' );
        add_filter( 'cpm_get_content', 'wpautop' );
        add_filter( 'cpm_get_content', 'shortcode_unautop' );
        add_filter( 'cpm_get_content', 'prepend_attachment' );
        add_filter( 'cpm_get_content', 'make_clickable' );
    }

    /**
     * Initial do
     *
     * @since 1.1
     * @return type
     */
    function init() {
        $this->define_constants();
        spl_autoload_register( array( __CLASS__, 'autoload' ) );
        $this->page()->cpm_function();

        $this->version    = CPM_VERSION;
        $this->db_version = CPM_DB_VERSION;

        $this->includes();
        $this->instantiate();
    }

    /**
     * Autoload class files on demand
     *
     * @param string $class requested class name
     */
    function autoload( $class ) {
        $name = explode( '_', $class );
        if ( isset( $name[1] ) ) {
            $class_name = strtolower( $name[1] );
            $filename = dirname( __FILE__ ) . '/class/' . $class_name . '.php';

            if ( file_exists( $filename ) ) {
                require_once $filename;
            }
        }
    }

    /**
     * Define cpmrp Constants
     *
     * @since 1.1
     * @return type
     */
    public function define_constants() {

        $this->define( 'CPM_VERSION', '1.3.4' );
        $this->define( 'CPM_DB_VERSION', '1.1' );
        $this->define( 'CPM_PATH', dirname( __FILE__ ) );
        $this->define( 'CPM_URL', plugins_url( '', __FILE__ ) );
    }

    /**
     * Define constant if not already set
     *
     * @since 1.1
     *
     * @param  string $name
     * @param  string|bool $value
     * @return type
     */
    public function define( $name, $value ) {
        if ( ! defined( $name ) ) {
            define( $name, $value );
        }
    }

    /**
     * Instantiate all the required classes
     *
     * @since 0.1
     */
    function instantiate() {

        $this->project   = CPM_Project::getInstance();
        $this->message   = CPM_Message::getInstance();
        $this->task      = CPM_Task::getInstance();
        $this->milestone = CPM_Milestone::getInstance();

        $this->activity     = CPM_Activity::getInstance();
        $this->ajax         = CPM_Ajax::getInstance();
        $this->notification = CPM_Notification::getInstance();

        if ( function_exists( 'json_api_init' ) ) {
            $this->api   = CPM_API::instance();
        }

        // instantiate admin settings only on admin page
        if ( is_admin() ) {
            $this->admin   = new CPM_Admin();
            $this->upgrade = new CPM_Upgrade();
        }

        do_action( 'cpm_instantiate', $this );
    }

    /**
     * page router instanciate
     *
     * @since 1.1
     */
    function page() {
        $this->router = CPM_Router::instance();
        return $this->router;
    }

    /**
     * Include the required files
     *
     * @return void
     */
    function includes() {
        $this->router->includes();
    }

    /**
     * Runs the setup when the plugin is installed
     *
     * @since 0.3.1
     */
    function install() {
        $update = CPM_Upgrade::getInstance();

        $update->plugin_upgrades();
    }

    /**
     * Load plugin textdomain
     *
     * @since 0.3
     */
    function load_textdomain() {
        load_plugin_textdomain( 'cpm', false, dirname( plugin_basename( __FILE__ ) ) . '/languages/' );
    }

    /**
     * Load all the plugin scripts and styles only for the
     * project area
     *
     * @since 0.1
     */
    static function admin_scripts() {
        $upload_size = intval( cpm_get_option( 'upload_limit') ) * 1024 * 1024;
        wp_enqueue_script( 'jquery' );
        wp_enqueue_script( 'jquery-ui-core' );
        wp_enqueue_script( 'jquery-ui-autocomplete');
        wp_enqueue_script( 'jquery-ui-dialog' );
        wp_enqueue_script( 'jquery-ui-datepicker' );
        wp_enqueue_script( 'jquery-ui-sortable' );
        wp_enqueue_script( 'jquery-prettyPhoto', plugins_url( 'assets/js/jquery.prettyPhoto.js', __FILE__ ), array( 'jquery' ), false, true );
        wp_enqueue_script( 'jquery-chosen', plugins_url( 'assets/js/chosen.jquery.min.js', __FILE__ ), array('jquery'), false, true );
        wp_enqueue_script( 'validate', plugins_url( 'assets/js/jquery.validate.min.js', __FILE__ ), array('jquery'), false, true );
        wp_enqueue_script( 'plupload-handlers' );

        wp_enqueue_script( 'cpm_admin', plugins_url( 'assets/js/admin.js', __FILE__ ), array( 'jquery', 'jquery-prettyPhoto' ), false, true );
        wp_enqueue_script( 'cpm_task', plugins_url( 'assets/js/task.js', __FILE__ ), array('jquery'), false, true );
        wp_enqueue_script( 'cpm_uploader', plugins_url( 'assets/js/upload.js', __FILE__ ), array('jquery', 'plupload-handlers'), false, true );

        wp_localize_script( 'cpm_admin', 'CPM_Vars', array(
            'ajaxurl'  => admin_url( 'admin-ajax.php' ),
            'nonce'    => wp_create_nonce( 'cpm_nonce' ),
            'is_admin' => is_admin() ? 'yes' : 'no',
            'message'  => cpm_message(),
            'plupload' => array(
                'browse_button'       => 'cpm-upload-pickfiles',
                'container'           => 'cpm-upload-container',
                'max_file_size'       => $upload_size . 'b',
                'url'                 => admin_url( 'admin-ajax.php' ) . '?action=cpm_ajax_upload&nonce=' . wp_create_nonce( 'cpm_ajax_upload' ),
                'flash_swf_url'       => includes_url( 'js/plupload/plupload.flash.swf' ),
                'silverlight_xap_url' => includes_url( 'js/plupload/plupload.silverlight.xap' ),
                'filters'             => array(array('title' => __( 'Allowed Files' ), 'extensions' => '*')),
                'resize'              => array('width' => (int) get_option( 'large_size_w' ), 'height' => (int) get_option( 'large_size_h' ), 'quality' => 100)
            )
        ) );

        wp_enqueue_style( 'cpm_admin', plugins_url( 'assets/css/admin.css', __FILE__ ) );
        wp_enqueue_style( 'cpm_prettyPhoto', plugins_url( 'assets/css/prettyPhoto.css', __FILE__ ) );
        wp_enqueue_style( 'jquery-ui', plugins_url( 'assets/css/jquery-ui-1.9.1.custom.css', __FILE__ ) );
        wp_enqueue_style( 'jquery-chosen', plugins_url( 'assets/css/chosen.css', __FILE__ ) );

        do_action( 'cpm_admin_scripts' );

    }

    /**
     * Register the plugin menu
     *
     * @since 0.1
     */
    function admin_menu() {

        $capability = 'read'; //minimum level: subscriber

        $hook = add_menu_page( __( 'Project Manager', 'cpm' ), __( 'Project Manager', 'cpm' ), $capability, 'cpm_projects', array($this, 'admin_page_handler'), 'dashicons-networking', 3 );
        add_submenu_page( 'cpm_projects', __( 'Projects', 'cpm' ), __( 'Projects', 'cpm' ), $capability, 'cpm_projects', array($this, 'admin_page_handler') );
        if ( current_user_can( 'manage_options' ) ) {
            add_submenu_page( 'cpm_projects', __( 'Categories', 'cpm' ), __( 'Categories', 'cpm' ), $capability, 'edit-tags.php?taxonomy=project_category' );
        }
        add_submenu_page( 'cpm_projects', __( 'Add-ons', 'cpm' ), __( 'Add-ons', 'cpm' ), $capability, 'cpm_addons', array($this, 'admin_page_addons') );

        add_action( 'admin_print_styles-' . $hook, array( $this, 'admin_scripts' ) );

        do_action( 'cpm_admin_menu', $capability, $this );
    }

    /**
     * Main function that renders the admin area for all the project
     * related markup.
     *
     * @since 0.1
     */
    function admin_page_handler() {
        $this->router->output();
    }

    /**
     * Shows the add-ons page on admin
     *
     * @return void
     */
    function admin_page_addons() {
        $this->router->admin_page_addons();
    }
}

/**
 * Returns the main instance.
 *
 * @since  1.1
 * @return WeDevs_CPM
 */
function cpm() {
    return WeDevs_CPM::instance();
}

//cpm instance.
$cpm = cpm();
