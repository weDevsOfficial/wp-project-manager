<?php
/**
 * Plugin Name: WP Project Manager
 * Plugin URI: https://wedevs.com/wp-project-manager-pro/
 * Description: WordPress Project Management plugin. Manage your projects and tasks, get things done.
 * Author: weDevs
 * Author URI: https://wedevs.com
 * Version: 2.0
 * Text Domain: wedevs-project-manager
 * Domain Path: /languages
 * License: GPL2
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 */
define('PM_FILE', __FILE__);
define ('PM_BASENAME', plugin_basename(__FILE__));

require __DIR__.'/bootstrap/start.php';

register_activation_hook( __FILE__, 'pm_activate' );

function pm_activate () {
	new PM_Create_Table;
	(new \RoleTableSeeder())->run();
}
// register_deactivation_hook( __FILE__, 'pm_deactive' );