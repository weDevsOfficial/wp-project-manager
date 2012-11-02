<?php

/**
 * Plugin Name: Client Project Manager
 * Plugin URI: http://weDevs.com
 * Description: Client Project Management was never been easier
 * Author: Tareq Hasan
 * Author URI: http://tareq.weDevs.com
 * Version: 0.1
 */
//notification module
require_once dirname( __FILE__ ) . '/class/notification.php';

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
 * WeDevs Client Project Manager
 *
 * @author weDevs
 */
class WeDevs_CPM {

    private $_db;

    function __construct() {
        global $wpdb;

        $this->_db = $wpdb;

        $this->constants();
        $this->instantiate();

        register_activation_hook( __FILE__, array($this, 'install') );

        add_action( 'admin_menu', array($this, 'admin_menu') );
        add_action( 'admin_init', array($this, 'admin_includes') );
        add_action( 'admin_enqueue_scripts', array($this, 'admin_scripts') );
    }

    function instantiate() {
        $project = CPM_Project::getInstance();
        $message = CPM_Message::getInstance();
        $task = CPM_Task::getInstance();
        $milestone = CPM_Milestone::getInstance();
    }

    function constants() {
        define( 'CPM_PROJECT_TABLE', $this->_db->prefix . 'cpm_projects' );
        define( 'CPM_MESSAGE_TABLE', $this->_db->prefix . 'cpm_messages' );
        define( 'CPM_COMMENT_TABLE', $this->_db->prefix . 'cpm_comments' );
        define( 'CPM_TASK_LIST_TABLE', $this->_db->prefix . 'cpm_task_list' );
        define( 'CPM_TASKS_TABLE', $this->_db->prefix . 'cpm_tasks' );
        define( 'CPM_FILES_TABLE', $this->_db->prefix . 'cpm_files' );
        define( 'CPM_INVOICE_TABLE', $this->_db->prefix . 'cpm_invoice' );
        define( 'CPM_INVOICE_ITEM_TABLE', $this->_db->prefix . 'cpm_invoice_item' );
        define( 'CPM_MILESTONE_TABLE', $this->_db->prefix . 'cpm_milestone' );

        define( 'CPM_PLUGIN_PATH', dirname( __FILE__ ) );
        define( 'CPM_PLUGIN_URI', plugins_url( '', __FILE__ ) );
    }

    function admin_scripts() {
        wp_enqueue_script( 'jquery-ui-core' );
        wp_enqueue_script( 'jquery-ui-dialog' );
        wp_enqueue_script( 'jquery-ui-slider' );
        wp_enqueue_script( 'jquery-ui-datepicker' );
        wp_enqueue_script( 'chosen', plugins_url( 'js/chosen.jquery.min.js', __FILE__ ) );
        wp_enqueue_script( 'validate', plugins_url( 'js/jquery.validate.min.js', __FILE__ ) );
        wp_enqueue_script( 'plupload-handlers' );
        wp_enqueue_script( 'underscore', plugins_url( 'js/underscore-min.js', __FILE__ ) );
        wp_enqueue_script( 'cpm_admin', plugins_url( 'js/admin.js', __FILE__ ) );

        $post_params = array();
        wp_localize_script( 'cpm_admin', 'CPM_Vars', array(
            'ajaxurl' => admin_url( 'admin-ajax.php' ),
            'nonce' => wp_create_nonce( 'cpm_nonce' ),
            'pay_symbol' => '$',
            'plupload' => array(
                'runtimes' => 'html5,silverlight,flash,html4',
                'browse_button' => 'cpm-upload-pickfiles',
                'container' => 'cpm-upload-container',
                'file_data_name' => 'cpm_attachment',
                'multiple_queues' => false,
                'max_file_size' => wp_max_upload_size() . 'b',
                'url' => admin_url( 'admin-ajax.php' ) . '?action=cpm_ajax_upload&nonce=' . wp_create_nonce( 'cpm_ajax_upload' ),
                'flash_swf_url' => includes_url( 'js/plupload/plupload.flash.swf' ),
                'silverlight_xap_url' => includes_url( 'js/plupload/plupload.silverlight.xap' ),
                'filters' => array(array('title' => __( 'Allowed Files' ), 'extensions' => '*')),
                'multipart' => true,
                'urlstream_upload' => true,
                'multipart_params' => $post_params,
                'resize' => array('width' => (int) get_option( 'large_size_w' ), 'height' => (int) get_option( 'large_size_h' ), 'quality' => 100)
            )
        ) );

        wp_enqueue_style( 'cpm_admin', plugins_url( 'css/admin.css', __FILE__ ) );
        wp_enqueue_style( 'jquery-ui', plugins_url( 'css/jquery-ui-1.8.18.custom.css', __FILE__ ) );
        wp_enqueue_style( 'chosen', plugins_url( 'css/chosen.css', __FILE__ ) );
    }

    function admin_includes() {
        require_once CPM_PLUGIN_PATH . '/helpers.php';
        require_once CPM_PLUGIN_PATH . '/class/ajax.php';
    }

    function admin_menu() {
        $capability = 'activate_plugins';

        add_menu_page( __( 'Project Manager', 'cpm' ), __( 'Project Manager', 'cpm' ), $capability, 'cpm_projects', array($this, 'admin_page_handler'), '', 3 );
        add_submenu_page( 'cpm_projects', __( 'Projects', 'cpm' ), __( 'Projects', 'cpm' ), $capability, 'cpm_projects', array($this, 'admin_page_handler') );
//        add_submenu_page( 'cpm_projects', __( 'Messages', 'cpm' ), __( 'Messages', 'cpm' ), $capability, 'cpm_messages', array($this, 'admin_page_hanlder') );
//        add_submenu_page( 'cpm_projects', __( 'Task Lists', 'cpm' ), __( 'Task Lists', 'cpm' ), $capability, 'cpm_tasklist', array($this, 'admin_page_hanlder') );
//        add_submenu_page( 'cpm_projects', __( 'Milestones', 'cpm' ), __( 'Milestones', 'cpm' ), $capability, 'cpm_milestones', array($this, 'admin_page_hanlder') );
//        add_submenu_page( 'cpm_projects', __( 'Invoices', 'cpm' ), __( 'Invoices', 'cpm' ), $capability, 'cpm_invoices', array($this, 'admin_page_hanlder') );
//        add_submenu_page( 'cpm_projects', __( 'Files', 'cpm' ), __( 'Files', 'cpm' ), $capability, 'cpm_files', array($this, 'admin_page_hanlder') );
    }

    function admin_page_handler() {

        if ( !class_exists( 'WP_List_Table' ) ) {
            require_once ABSPATH . 'wp-admin/includes/class-wp-list-table.php';
        }

        echo '<div class="wrap">';

        $page = (isset( $_GET['page'] )) ? $_GET['page'] : '';
        $tab = (isset( $_GET['tab'] )) ? $_GET['tab'] : '';
        $action = (isset( $_GET['action'] )) ? $_GET['action'] : '';

        $project_id = (isset( $_GET['pid'] )) ? (int) $_GET['pid'] : 0;
        $message_id = (isset( $_GET['mid'] )) ? (int) $_GET['mid'] : 0;
        $tasklist_id = (isset( $_GET['tl_id'] )) ? (int) $_GET['tl_id'] : 0;
        $task_id = (isset( $_GET['task_id'] )) ? (int) $_GET['task_id'] : 0;
        $milestone_id = (isset( $_GET['ml_id'] )) ? (int) $_GET['ml_id'] : 0;
        $invoice_id = (isset( $_GET['in_id'] )) ? (int) $_GET['in_id'] : 0;

        switch ($page) {
            case 'cpm_projects':

                switch ($tab) {
                    case 'project':

                        switch ($action) {
                            case 'index':
                                include_once dirname( __FILE__ ) . '/admin/views/project/index.php';
                                break;

                            case 'single':
                                include_once dirname( __FILE__ ) . '/admin/views/project/single.php';
                                break;

                            case 'new':
                                include_once dirname( __FILE__ ) . '/admin/views/project/new.php';
                                break;

                            case 'edit':
                                include_once dirname( __FILE__ ) . '/admin/views/project/edit.php';
                                break;

                            default:
                                include_once dirname( __FILE__ ) . '/admin/views/project/index.php';
                                break;
                        }

                        break;

                    case 'message':
                        switch ($action) {
                            case 'index':
                                include_once dirname( __FILE__ ) . '/admin/views/message/index.php';
                                break;

                            case 'single':
                                include_once dirname( __FILE__ ) . '/admin/views/message/single.php';
                                break;

                            case 'new':
                                include_once dirname( __FILE__ ) . '/admin/views/message/new.php';
                                break;

                            case 'edit':
                                include_once dirname( __FILE__ ) . '/admin/views/message/edit.php';
                                break;

                            default:
                                include_once dirname( __FILE__ ) . '/admin/views/message/index.php';
                                break;
                        }

                        break;

                    case 'task':
                        switch ($action) {
                            case 'index':
                                include_once dirname( __FILE__ ) . '/admin/views/task/index.php';
                                break;

                            case 'single':
                                include_once dirname( __FILE__ ) . '/admin/views/task/single.php';
                                break;

                            case 'new':
                                include_once dirname( __FILE__ ) . '/admin/views/task/new.php';
                                break;

                            case 'edit':
                                include_once dirname( __FILE__ ) . '/admin/views/task/edit.php';
                                break;

                            case 'task_new':
                                include_once dirname( __FILE__ ) . '/admin/views/task/task-new.php';
                                break;

                            case 'task_edit':
                                include_once dirname( __FILE__ ) . '/admin/views/task/task-edit.php';
                                break;

                            case 'task_single':
                                include_once dirname( __FILE__ ) . '/admin/views/task/task-single.php';
                                break;

                            default:
                                include_once dirname( __FILE__ ) . '/admin/views/task/index.php';
                                break;
                        }

                        break;

                    case 'milestone':
                        switch ($action) {
                            case 'index':
                                include_once dirname( __FILE__ ) . '/admin/views/milestone/index.php';
                                break;

                            case 'single':
                                include_once dirname( __FILE__ ) . '/admin/views/milestone/single.php';
                                break;

                            case 'new':
                                include_once dirname( __FILE__ ) . '/admin/views/milestone/new.php';
                                break;

                            case 'edit':
                                include_once dirname( __FILE__ ) . '/admin/views/milestone/edit.php';
                                break;

                            default:
                                include_once dirname( __FILE__ ) . '/admin/views/milestone/index.php';
                                break;
                        }

                        break;


                    default:
                        include_once dirname( __FILE__ ) . '/admin/views/project/index.php';
                        break;
                }

            default:
                break;
        }
        echo '</div>';
    }

}

$cpm = new WeDevs_CPM();

//test function
function cpm_init() {

}

add_action( 'init', 'cpm_init' );