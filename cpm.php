<?php
/**
 * Plugin Name: WP Project Manager
 * Plugin URI: https://wordpress.org/plugins/wedevs-project-manager/
 * Description: WordPress Project Management plugin. Manage your projects and tasks, get things done.
 * Author: Tareq Hasan
 * Author URI: https://tareq.co
 * Version: 1.6.15
 * License: GPL2
 */
/**
 * Copyright (c) 2017 Tareq Hasan (email: info@wedevs.com). All rights reserved.
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
if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * Project Manager bootstrap class
 *
 * @author Tareq Hasan
 */
class WeDevs_CPM {

    /**
     * Plugin version
     *
     * @var string
     */
    public $version = '1.6.15';

     /**
     * Plugin Database version
     *
     * @var string
     */
    public $db_version = '1.5';

    /**
     * @var The single instance of the class
     *
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
     * Constructor for the WeDevs_CPM class
     *
     * Sets up all the appropriate hooks and actions
     * within our plugin.
     */
    function __construct() {
        // Define constants
        $this->define_constants();

        //Required class file include
        spl_autoload_register( array( $this, 'autoload' ) );

        // Include required files
        $this->includes();

        // instantiate classes
        $this->instantiate();

        // Initialize the action hooks
        $this->init_actions();

        // Initialize the action hooks
        $this->init_filters();

        //Execute only plugin install time
        register_activation_hook( __FILE__, array( $this, 'install' ) );

        //Do some thing after load this plugin
        do_action( 'cpm_loaded' );
    }

    /**
     * Initialize WordPress action hooks
     *
     * @return void
     */
    function init_filters() {
        add_filter( 'plugin_action_links', array( $this, 'plugin_action_links' ), 10, 2 );
    }

    /**
     * Initialize WordPress action hooks
     *
     * @return void
     */
    function init_actions() {
        add_action( 'admin_menu', array( $this, 'admin_menu' ) );
        add_action( 'plugins_loaded', array( $this, 'cpm_content_filter' ) );
        add_action( 'plugins_loaded', array( $this, 'load_textdomain' ) );
        add_action( 'admin_enqueue_scripts', array( $this, 'admin_scripts' ) );
        add_action( 'admin_footer', array( $this, 'admin_js_templates' ) );
        add_action( 'plugins_loaded', array( $this, 'after_loaded_plugins' ), 11 );
    }

    /**
     * Add shortcut links to the plugin action menu
     *
     * @since 1.6.9
     *
     * @return void
     */
    function after_loaded_plugins() {
        if ( ! cpm_is_pro() ) {
            include_once CPM_PATH . '/class/loader.php';
        }
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
                sprintf( '<a href="%s">%s</a>', 'https://wedevs.com/wp-project-manager-pro/pricing/', __( 'Pro Version', 'cpm' ) ),
                sprintf( '<a href="%s">%s</a>', 'https://wedevs.com/wp-project-manager-pro/extensions/', __( 'Add-ons', 'cpm' ) ),
                sprintf( '<a href="%s">%s</a>', admin_url( 'admin.php?page=cpm_settings' ), __( 'Settings', 'cpm' ) )
            );

            if ( cpm_is_pro() ) {
                unset( $new_links[0] );
            }

            return array_merge( $new_links, $links );
        }

        return $links;
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
     * Autoload class files on demand
     *
     * @param string $class requested class name
     */
    function autoload( $class ) {
        $name = explode( '_', $class );
        if ( isset( $name[1] ) ) {
            $class_name = strtolower( $name[1] );
            $filename   = dirname( __FILE__ ) . '/class/' . $class_name . '.php';

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
        $this->define( 'CPM_VERSION', $this->version );
        $this->define( 'CPM_DB_VERSION', $this->db_version );
        $this->define( 'CPM_PATH', dirname( __FILE__ ) );
        $this->define( 'CPM_URL', plugins_url( '', __FILE__ ) );
        $this->define( 'CPM_JS_TMPL', CPM_PATH . '/views/js-templates' );
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

        $this->project         = CPM_Project::getInstance();
        $this->message         = CPM_Message::getInstance();
        $this->task            = CPM_Task::getInstance();
        $this->milestone       = CPM_Milestone::getInstance();

        $this->activity        = CPM_Activity::getInstance();
        $this->ajax            = CPM_Ajax::getInstance();
        $this->notification    = CPM_Notification::getInstance();
        $this->managetransient = CPM_Managetransient::getInstance();

        if ( function_exists( 'json_api_init' ) ) {
            $this->api = CPM_API::instance();
        }

        // instantiate admin settings only on admin page
        if ( is_admin() ) {
            $this->admin   = new CPM_Admin();
            $this->upgrade = new CPM_Upgrade();
        }

        new CPM_Tracker();

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
        include_once dirname( __FILE__ ) . '/includes/lib/class-weforms-upsell.php';
        new WeForms_Upsell( '407' );

        $this->version    = CPM_VERSION;
        $this->db_version = CPM_DB_VERSION;
        $this->page()->cpm_function();
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

        $suffix  = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';

        ob_start();
        include CPM_PATH . '/assets/js/moment/latest.json';
        $time_zone_string      = ob_get_clean();
        $json_time_zone_string = json_decode( $time_zone_string, true );

        $upload_size = intval( cpm_get_option( 'upload_limit', 'cpm_general' ) ) * 1024 * 1024;
        wp_enqueue_script( 'jquery' );
        //wp_enqueue_script( 'underscore' );
        wp_enqueue_script( 'jquery-ui-core' );
        wp_enqueue_script( 'jquery-ui-autocomplete' );
        wp_enqueue_script( 'jquery-ui-dialog' );
        wp_enqueue_script( 'jquery-ui-datepicker' );
        wp_enqueue_script( 'jquery-ui-sortable' );

        //wp_enqueue_script( 'jquery-ui-sortable' );
        wp_enqueue_script( 'cpm-timepicker', CPM_URL . '/assets/js/jquery-ui-timepicker.js', array('jquery'), false, true );
        wp_register_script( 'cpm-tiny-mce', site_url( '/wp-includes/js/tinymce/tinymce.min.js' ) );
        //wp_register_script( 'cpm-trix', CPM_URL . '/assets/js/trix/trix.js', array( 'jquery' ), time(), false, true );

        wp_register_script( 'cpm-moment', CPM_URL . '/assets/js/moment/moment.min.js', false, time(), false );
        // this is removing conflict with buddypress momentjs
        $momentjs_dependency = apply_filters('momentjs', array('cpm-moment') );
        wp_register_script( 'cpm-moment-timezone', CPM_URL . '/assets/js/moment/moment-timezone.min.js', $momentjs_dependency, time(), false );

        wp_register_script( 'cpm-vue', CPM_URL . '/assets/js/vue/vue'.$suffix.'.js', array('cpm-tiny-mce','cpm-moment', 'cpm-moment-timezone'), time(), false, true );
        wp_register_script( 'cpm-vuex', CPM_URL . '/assets/js/vue/vuex'.$suffix.'.js', array( 'cpm-vue' ), time(), false, true );
        wp_register_script( 'cpm-vue-router', CPM_URL . '/assets/js/vue/vue-router'.$suffix.'.js', array( 'cpm-vue' ), time(), false, true );
        wp_register_script( 'cpm-waypoints', CPM_URL . '/assets/js/waypoints/jquery.waypoints.js', array( 'jquery' ), time(), false, true );

        wp_enqueue_script( 'jquery-prettyPhoto', plugins_url( 'assets/js/jquery.prettyPhoto.js', __FILE__ ), array( 'jquery' ), false, true );
        wp_enqueue_script( 'jquery-chosen', plugins_url( 'assets/js/chosen.jquery.min.js', __FILE__ ), array( 'jquery' ), false, true );
        wp_enqueue_script( 'cpm_chart', plugins_url( 'assets/js/chart.js', __FILE__ ), array( 'jquery' ), false, true );
        wp_register_script( 'cpm-trix-editor', plugins_url( 'assets/js/trix.js', __FILE__ ), array( 'jquery' ), false, true );
        wp_enqueue_script( 'validate', plugins_url( 'assets/js/jquery.validate.min.js', __FILE__ ), array( 'jquery' ), false, false );
        wp_enqueue_script( 'plupload-handlers' );
        if ( !wp_script_is( 'erp-trix-editor', 'enqueued' )){
            wp_enqueue_script( 'cpm-trix-editor' );
        }
        
        //wp_enqueue_script( 'cpm_vue-multiselect', plugins_url( 'assets/js/multiselect.js', __FILE__ ), array ( 'jquery', 'plupload-handlers' ), false, true );

        //swp_enqueue_script( 'cpm_common_js', plugins_url( 'assets/js/cpm_common_js.js', __FILE__ ), array('cpm-vue', 'cpm_vue-multiselect'), false, true );

        wp_register_script( 'cpm-uploader', CPM_URL . '/assets/js/upload.js', array( 'jquery', 'plupload-handlers' ), time(), true );
        //wp_enqueue_script( 'cpm_uploader', plugins_url( 'assets/js/upload.js', __FILE__ ), array( 'jquery', 'plupload-handlers' ), false, true );
        wp_enqueue_script( 'cpm_uploader_old', plugins_url( 'assets/js/upload-old.js', __FILE__ ), array( 'jquery', 'plupload-handlers' ), false, true );

        $cpm_dependency = array( 'jquery', 'cpm_uploader_old', 'jquery-ui-datepicker' );
        $cpm_dependency = apply_filters('cpm_dependency', $cpm_dependency);
        wp_register_script( 'cpm_admin', plugins_url( 'assets/js/admin.js', __FILE__ ), $cpm_dependency, false, true );

        if ( isset( $_GET[ 'page' ] ) AND $_GET[ 'page' ] == 'cpm_projects' ) {
            wp_enqueue_script( 'cpm-vue' );
            wp_enqueue_script( 'cpm_admin' );
        }

        //wp_enqueue_script( 'cpm_task', plugins_url( 'assets/js/task.js', __FILE__ ), array( 'jquery' ), false, true );

        $project_id = cpm_get_project_id();

        wp_localize_script( 'cpm_admin', 'CPM_Vars', array(
            'ajaxurl'        => admin_url( 'admin-ajax.php' ),
            'nonce'          => wp_create_nonce( 'cpm_nonce' ),
            'project_id'     => apply_filters( 'cpm_project_id', $project_id ),
            'is_admin'       => is_admin() ? 'yes' : 'no',
            'message'        => cpm_message(),
            'todolist_show'  => cpm_get_option( 'todolist_show', 'cpm_general' ),
            'pluginURL'      => CPM_URL,
            'wp_time_zone'   => cpm_get_wp_timezone(),
            'time_zones'     => $json_time_zone_string['zones'],
            'time_links'     => $json_time_zone_string['links'],
            'wp_date_format' => get_option( 'date_format' ),
            'wp_time_format' => get_option( 'time_format' ),
            'current_user_avatar_url' => get_avatar_url( get_current_user_id(), array( 'default' => 'mm') ),
            'get_current_user_id' => get_current_user_id(),
            'CPM_URL'        => CPM_URL,
            'plupload'      => array(
                'browse_button'       => 'cpm-upload-pickfiles',
                'container'           => 'cpm-upload-container',
                'max_file_size'       => $upload_size . 'b',
                'url'                 => admin_url( 'admin-ajax.php' ) . '?action=cpm_ajax_upload&nonce=' . wp_create_nonce( 'cpm_ajax_upload' ),
                'url_old'                 => admin_url( 'admin-ajax.php' ) . '?action=cpm_ajax_upload_old&nonce=' . wp_create_nonce( 'cpm_ajax_upload' ),
                'flash_swf_url'       => includes_url( 'js/plupload/plupload.flash.swf' ),
                'silverlight_xap_url' => includes_url( 'js/plupload/plupload.silverlight.xap' ),
                'filters'             => array( array( 'title' => __( 'Allowed Files' ), 'extensions' => '*' ) ),
                'resize'              => array( 'width' => ( int ) get_option( 'large_size_w' ), 'height' => ( int ) get_option( 'large_size_h' ), 'quality' => 100 )
            )
        ) );


        wp_register_script( 'cpm-vue-multiselect', CPM_URL . '/assets/js/vue-multiselect/vue-multiselect.min.js', array ( 'jquery' ), false, true );
        wp_register_script( 'cpm-toastr', CPM_URL . '/assets/js/toastr/toastr.min.js', array ( 'jquery' ), false, true );
        //wp_register_script( 'cpm-vue-focus', CPM_URL . '/assets/js/vue/vue.focus.min.js', array ( 'cpm-vue' ), false, true );
        wp_register_script( 'cpm-tiny-mce-component', CPM_URL. '/assets/js/text-editor/text-editor.js', array ( 'jquery' ), false, true );
        wp_register_script( 'cpm-task-mixin', CPM_URL . '/assets/js/task-component-mixin.js', array ( 'jquery' ), false, true );
        wp_register_script( 'cpm-task-store', CPM_URL . '/assets/js/task-store.js', array ( 'jquery', 'cpm_admin' ), false, true );
        wp_register_script( 'cpm-task-components', CPM_URL . '/assets/js/task-components.js', array ( 'jquery', 'cpm-vue-multiselect', 'cpm-toastr', 'cpm-task-store', 'cpm-task-mixin' ), false, true );
        wp_register_script( 'cpm-task-router', CPM_URL . '/assets/js/task-router.js', array ( 'jquery', 'cpm-task-components' ), false, true );
        wp_register_script( 'cpm-task-vue', CPM_URL . '/assets/js/task-vue.js', array ( 'jquery', 'plupload-handlers', 'cpm-task-components' ), false, true );
        wp_register_script( 'cpm-tiptip', CPM_URL . '/assets/js/tiptip/jquery.tipTip.min.js', array ( 'jquery' ), false, false );

        wp_register_style( 'cpm-tiptip', CPM_URL . '/assets/js/tiptip/tipTip.css' );
        wp_register_style( 'cpm-vue-multiselect', CPM_URL . '/assets/css/vue-multiselect/vue-multiselect.min.css' );

        wp_register_style( 'cpm-trix-editor', CPM_URL . '/assets/css/trix/trix.css' );
        wp_register_style( 'cpm-tiny-mce', site_url( '/wp-includes/css/editor.css' ) );
        wp_register_style( 'cpm-toastr', CPM_URL . '/assets/css/toastr/toastr.min.css' );
        wp_enqueue_style( 'atwhocss', plugins_url( 'assets/css/jquery.atwho.css', __FILE__ ) );
        wp_enqueue_style( 'cpm_prettyPhoto', plugins_url( 'assets/css/prettyPhoto.css', __FILE__ ) );
        wp_enqueue_style( 'jquery-ui', plugins_url( 'assets/css/jquery-ui-1.9.1.custom.css', __FILE__ ) );
        wp_enqueue_style( 'jquery-chosen', plugins_url( 'assets/css/chosen.css', __FILE__ ) );
        wp_enqueue_style( 'cpm_admin', plugins_url( 'assets/css/admin.css', __FILE__ ) );
        wp_enqueue_style( 'fontawesome', CPM_URL . '/assets/css/fontawesome/font-awesome.min.css' );
        wp_enqueue_style( 'dashicons' );
        wp_enqueue_style( 'cpm-trix-editor' );

        do_action( 'cpm_admin_scripts' );
    }

    /**
     * Register the plugin menu
     *
     * @since 0.1
     */
    function admin_menu() {

        $capability = 'read'; //minimum level: subscriber

        $hook = add_menu_page( __( 'Project Manager', 'cpm' ), __( 'Project Manager', 'cpm' ), $capability, 'cpm_projects', array( $this, 'admin_page_handler' ), 'dashicons-networking', 3 );
        add_submenu_page( 'cpm_projects', __( 'Projects', 'cpm' ), __( 'Projects', 'cpm' ), $capability, 'cpm_projects', array( $this, 'admin_page_handler' ) );
        if ( current_user_can( 'manage_options' ) ) {
            add_submenu_page( 'cpm_projects', __( 'Categories', 'cpm' ), __( 'Categories', 'cpm' ), $capability, 'edit-tags.php?taxonomy=cpm_project_category' );
        }
        add_submenu_page( 'cpm_projects', __( 'Add-ons', 'cpm' ), __( 'Add-ons', 'cpm' ), $capability, 'cpm_addons', array( $this, 'admin_page_addons' ) );

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

    /**
     * Print JS templates in footer
     *
     * @since  2.0.0
     *
     * @return void
     */
    public static function admin_js_templates() {

        $tab  = empty( $_GET['tab'] ) ? false : $_GET['tab'];

        if ( 'task' == $tab ) {
            CPM_Task::getInstance()->load_js_template();
            do_action( 'cpm_task_footer_template', $tab );
        }
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
