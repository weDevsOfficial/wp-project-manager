<?php
/**
 * Plugin Name: WP Project Manager
 * Plugin URI: http://wedevs.com/plugin/wp-project-manager/
 * Description: A WordPress Project Management plugin. Simply it does everything and it was never been easier with WordPress.
 * Author: Tareq Hasan
 * Author URI: http://tareq.weDevs.com
 * Version: 0.4
 */

/**
 * Autoload class files on demand
 *
 * @param string $class requested class name
 */
function cpm_autoload( $class ) {
    $name = explode( '_', $class );
    if ( isset( $name[1] ) ) {
        $class_name = strtolower( $name[1] );
        $filename = dirname( __FILE__ ) . '/class/' . $class_name . '.php';

        if ( file_exists( $filename ) ) {
            require_once $filename;
        }
    }
}

spl_autoload_register( 'cpm_autoload' );

/**
 * Project Manager bootstrap class
 *
 * @author Tareq Hasan
 */
class WeDevs_CPM {

    function __construct() {

        $this->version = '0.4';
        $this->db_version = '0.3.1';

        $this->constants();
        $this->instantiate();

        add_action( 'admin_menu', array($this, 'admin_menu') );
        add_action( 'admin_init', array($this, 'admin_includes') );
        add_action( 'plugins_loaded', array($this, 'load_textdomain') );
        register_activation_hook( __FILE__, array($this, 'install') );
    }

    /**
     * Instantiate all th required classes
     *
     * @since 0.1
     */
    function instantiate() {
        $project = CPM_Project::getInstance();
        $message = CPM_Message::getInstance();
        $task = CPM_Task::getInstance();
        $milestone = CPM_Milestone::getInstance();
        $activity = new CPM_Activity();
        $ajax = new CPM_Ajax();
        $notification = new CPM_Notification();
    }

    /**
     * Runs the setup when the plugin is installed
     *
     * @since 0.3.1
     */
    function install() {
        update_option( 'cpm_version', $this->version );
        update_option( 'cpm_db_version', $this->db_version );
    }

    /**
     * Load plugin textdomain
     *
     * @since 0.3
     */
    function load_textdomain() {
        $locale = apply_filters( 'cpm_locale', get_locale() );
        $mofile = dirname( __FILE__ ) . "/languages/cpm-$locale.mo";

        if ( file_exists( $mofile ) ) {
            load_textdomain( 'cpm', $mofile );
        }
    }

    /**
     * Define some constants required by the plugin
     *
     * @since 0.1
     */
    function constants() {
        define( 'CPM_PLUGIN_PATH', dirname( __FILE__ ) );
        define( 'CPM_PLUGIN_URI', plugins_url( '', __FILE__ ) );
    }

    /**
     * Load all the plugin scripts and styles only for the
     * project area
     *
     * @since 0.1
     */
    function admin_scripts() {
        wp_enqueue_script( 'jquery-ui-core' );
        wp_enqueue_script( 'jquery-ui-dialog' );
        wp_enqueue_script( 'jquery-ui-datepicker' );
        wp_enqueue_script( 'chosen', plugins_url( 'js/chosen.jquery.min.js', __FILE__ ) );
        wp_enqueue_script( 'validate', plugins_url( 'js/jquery.validate.min.js', __FILE__ ) );
        wp_enqueue_script( 'plupload-handlers' );
        wp_enqueue_script( 'cpm_admin', plugins_url( 'js/admin.js', __FILE__ ) );
        wp_enqueue_script( 'cpm_task', plugins_url( 'js/task.js', __FILE__ ) );
        wp_enqueue_script( 'cpm_uploader', plugins_url( 'js/upload.js', __FILE__ ), array('jquery', 'plupload-handlers') );

        wp_localize_script( 'cpm_admin', 'CPM_Vars', array(
            'ajaxurl' => admin_url( 'admin-ajax.php' ),
            'nonce' => wp_create_nonce( 'cpm_nonce' ),
            'plupload' => array(
                'browse_button' => 'cpm-upload-pickfiles',
                'container' => 'cpm-upload-container',
                'max_file_size' => wp_max_upload_size() . 'b',
                'url' => admin_url( 'admin-ajax.php' ) . '?action=cpm_ajax_upload&nonce=' . wp_create_nonce( 'cpm_ajax_upload' ),
                'flash_swf_url' => includes_url( 'js/plupload/plupload.flash.swf' ),
                'silverlight_xap_url' => includes_url( 'js/plupload/plupload.silverlight.xap' ),
                'filters' => array(array('title' => __( 'Allowed Files' ), 'extensions' => '*')),
                'resize' => array('width' => (int) get_option( 'large_size_w' ), 'height' => (int) get_option( 'large_size_h' ), 'quality' => 100)
            )
        ) );

        wp_enqueue_style( 'cpm_admin', plugins_url( 'css/admin.css', __FILE__ ) );
        wp_enqueue_style( 'jquery-ui', plugins_url( 'css/jquery-ui-1.9.1.custom.css', __FILE__ ) );
        wp_enqueue_style( 'chosen', plugins_url( 'css/chosen.css', __FILE__ ) );
    }

    /**
     * Includes some required helper files
     *
     * @since 0.1
     */
    function admin_includes() {
        require_once CPM_PLUGIN_PATH . '/includes/functions.php';
        require_once CPM_PLUGIN_PATH . '/includes/urls.php';
        require_once CPM_PLUGIN_PATH . '/includes/html.php';
        require_once CPM_PLUGIN_PATH . '/includes/shortcodes.php';
    }

    /**
     * Register the plugin menu
     *
     * @since 0.1
     */
    function admin_menu() {
        $capability = 'read'; //minimum level: subscriber

        $hook = add_menu_page( __( 'Project Manager', 'cpm' ), __( 'Project Manager', 'cpm' ), $capability, 'cpm_projects', array($this, 'admin_page_handler'), '', 3 );
        add_submenu_page( 'cpm_projects', __( 'Projects', 'cpm' ), __( 'Projects', 'cpm' ), $capability, 'cpm_projects', array($this, 'admin_page_handler') );

        add_action( $hook, array($this, 'admin_scripts') );
    }

    /**
     * Main function that renders the admin area for all the project
     * related markup.
     *
     * @since 0.1
     */
    function admin_page_handler() {

        echo '<div class="wrap cpm">';

        $page = (isset( $_GET['page'] )) ? $_GET['page'] : '';
        $tab = (isset( $_GET['tab'] )) ? $_GET['tab'] : '';
        $action = (isset( $_GET['action'] )) ? $_GET['action'] : '';

        $project_id = (isset( $_GET['pid'] )) ? (int) $_GET['pid'] : 0;
        $message_id = (isset( $_GET['mid'] )) ? (int) $_GET['mid'] : 0;
        $tasklist_id = (isset( $_GET['tl_id'] )) ? (int) $_GET['tl_id'] : 0;
        $task_id = (isset( $_GET['task_id'] )) ? (int) $_GET['task_id'] : 0;
        $milestone_id = (isset( $_GET['ml_id'] )) ? (int) $_GET['ml_id'] : 0;

        switch ($page) {
            case 'cpm_projects':

                switch ($tab) {
                    case 'project':

                        switch ($action) {
                            case 'index':
                                include_once dirname( __FILE__ ) . '/views/project/index.php';
                                break;

                            case 'single':
                                include_once dirname( __FILE__ ) . '/views/project/single.php';
                                break;

                            default:
                                include_once dirname( __FILE__ ) . '/views/project/index.php';
                                break;
                        }

                        break;

                    case 'message':
                        switch ($action) {
                            case 'index':
                                include_once dirname( __FILE__ ) . '/views/message/index.php';
                                break;

                            case 'single':
                                include_once dirname( __FILE__ ) . '/views/message/single.php';
                                break;

                            default:
                                include_once dirname( __FILE__ ) . '/views/message/index.php';
                                break;
                        }

                        break;

                    case 'task':
                        switch ($action) {
                            case 'index':
                                include_once dirname( __FILE__ ) . '/views/task/index.php';
                                break;

                            case 'single':
                                include_once dirname( __FILE__ ) . '/views/task/single.php';
                                break;

                            case 'task_single':
                                include_once dirname( __FILE__ ) . '/views/task/task-single.php';
                                break;

                            default:
                                include_once dirname( __FILE__ ) . '/views/task/index.php';
                                break;
                        }

                        break;

                    case 'milestone':
                        switch ($action) {
                            case 'index':
                                include_once dirname( __FILE__ ) . '/views/milestone/index.php';
                                break;

                            default:
                                include_once dirname( __FILE__ ) . '/views/milestone/index.php';
                                break;
                        }

                        break;

                    case 'files':
                        include_once dirname( __FILE__ ) . '/views/files/index.php';
                        break;


                    default:
                        include_once dirname( __FILE__ ) . '/views/project/index.php';
                        break;
                }

            default:
                break;
        }
        echo '</div>';
    }

}

$wedevs_cpm = new WeDevs_CPM();

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
}

add_action( 'plugins_loaded', 'cpm_content_filter' );