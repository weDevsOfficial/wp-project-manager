<?php
/**
 * Plugin Name: WP Project Manager
 * Plugin URI: https://wedevs.com/wp-project-manager-pro/
 * Description: WordPress Project Management plugin. Manage your projects and tasks, get things done.
 * Author: weDevs
 * Author URI: https://wedevs.com
 * Version: 2.3.10
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
    return;
}

define( 'PM_FILE', __FILE__ );
define( 'PM_BASENAME', plugin_basename(__FILE__) );
define( 'PM_PLUGIN_ASSEST', plugins_url( 'views/assets', __FILE__ ) );

require __DIR__.'/bootstrap/start.php';
