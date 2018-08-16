<?php
/**
 * Plugin Name: WP Project Manager
 * Plugin URI: https://wedevs.com/wp-project-manager-pro/
 * Description: WordPress Project Management plugin. Manage your projects and tasks, get things done.
 * Author: weDevs
 * Author URI: https://wedevs.com
 * Version: 2.0.5
 * Text Domain: wedevs-project-manager
 * Domain Path: /languages
 * License: GPL2
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 */

// don't call the file directly
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

require __DIR__.'/bootstrap/loaders.php';
require __DIR__.'/libs/configurations.php';

if ( version_compare( phpversion(), '5.6.0', '<' ) ) {
    add_action( 'admin_notices',  'pm_php_version_notice'  );
    add_action( 'wp_ajax_pm_hide_php_notice',  'pm_hide_php_notice' );
}

if ( version_compare( phpversion(), '5.6.0', '>=' ) ) {
    include_once( ABSPATH . 'wp-admin/includes/plugin.php' );
    $is_erp_active = is_plugin_active('wp-erp/wp-erp.php');
    
    if ( class_exists('WeDevs_ERP') || $is_erp_active ) {
        add_action( 'admin_notices',  'pm_erp_compatibility_notices' );
        add_action( 'wp_ajax_pm_install_wp_project_manager',  'pm_install_project_manager' );
        return;
    }
}


define('PM_FILE', __FILE__);
define ('PM_BASENAME', plugin_basename(__FILE__));

require __DIR__.'/bootstrap/start.php';
