<?php
/**
 * Plugin Name: WP Project Manager
 * Plugin URI: https://wedevs.com/wp-project-manager-pro/
 * Description: WordPress Project Management plugin. Manage your projects and tasks, get things done.
 * Author: weDevs
 * Author URI: https://wedevs.com
 * Version: 2.0.1
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
    // is_plugin_active( 'erp/wp-erp.php' ) ||
    if ( class_exists('WeDevs_ERP') ) {
        add_action( 'admin_notices',  'pm_erp_compatibility_notices' );
        add_action( 'wp_ajax_pm_install_wp_project_manager',  'pm_install_project_manager' );
        return;
    }
}

    /**
    * php version notices
    *  @return void
    */
    function pm_php_version_notice() {
        if ( ! current_user_can( 'manage_options' ) ) {
            return;
        }
        $option = get_option('pm_hide_php_notice');
        if ( $option['hide'] == '1' ) {
            return ;
        }
        ?>
            <div class="error notice is-dismissible" id="pm-php-notice" style="padding: 1em; position: relative;">
                <h2><?php _e( 'WP Project Manager moving PHP 5.6!', 'wedevs-project-manager' ); ?></h2>
                <p><?php _e( 'WP Project Manager moving PHP 5.6 very soon. Please upgrader your php version.', 'wedevs-project-manager' ); ?></p>
            </div>
            <script type="text/javascript">
            (function ($) {
                var wrapper = $('#pm-php-notice');

                wrapper.on('click', 'button.notice-dismiss', function (e) {
                    var self = $(this);

                    e.preventDefault();

                    var data = {
                        action: 'pm_hide_php_notice',
                        _wpnonce: '<?php echo wp_create_nonce('pm-php-nonce'); ?>'
                    };

                    $.post(ajaxurl, data);
                });
            })(jQuery);
        </script>
        <?php 
    }

    function pm_hide_php_notice () {
        if ( ! isset( $_REQUEST['_wpnonce'] ) || ! wp_verify_nonce( $_REQUEST['_wpnonce'], 'pm-php-nonce' ) ) {
            wp_send_json_error( __( 'Error: Nonce verification failed', 'wedevs-project-manager') );
        }

        update_option('pm_hide_php_notice', [ 'hide' => 1, 'date'=> format_date(current_time('mysql'))]);
        wp_send_json_success();
    }

     /**
     * Show message if plugin not capable with WPERP
     *
     * @since 2.0.2
     */
    function pm_erp_compatibility_notices() {
        if ( ! current_user_can( 'manage_options' ) ) {
            return;
        }
        ?>
        <div class="updated" id="pm-installer-notice" style="padding: 1em; position: relative;">
            <h2><?php _e( 'WP Project Manager Not compatible with WPERP', 'wedevs-project-manager' ); ?></h2>
            <p><?php _e( 'Please Install the compatible version', 'wedevs-project-manager' ); ?></p>

                <p>
                    <button id="pm-installer" class="button"><?php _e( 'Install', 'wedevs-project-manager' ); ?></button>
                </p>

        </div>

        <script type="text/javascript">
            (function ($) {
                var wrapper = $('#pm-installer-notice');

                wrapper.on('click', '#pm-installer', function (e) {
                    var self = $(this);

                    e.preventDefault();
                    self.addClass('install-now updating-message');
                    self.text('<?php echo esc_js( 'Installing...', 'wedevs-project-manager' ); ?>');

                    var data = {
                        action: 'pm_install_wp_project_manager',
                        _wpnonce: '<?php echo wp_create_nonce('pm-installer-nonce'); ?>'
                    };

                    $.post(ajaxurl, data, function (response) {
                        if (response.success) {
                            self.attr('disabled', 'disabled');
                            self.removeClass('install-now updating-message');
                            self.text('<?php echo esc_js( 'Installed', 'wedevs-project-manager' ); ?>');

                            window.location.reload();
                        }
                    });
                });
            })(jQuery);
        </script>
        <?php
    }


    /**
     * Install the WP project Manager plugin via ajax
     *
     * @since 2.0.2
     *
     * @return json
     */
    function pm_install_project_manager() {

        if ( ! isset( $_REQUEST['_wpnonce'] ) || ! wp_verify_nonce( $_REQUEST['_wpnonce'], 'pm-installer-nonce' ) ) {
            wp_send_json_error( __( 'Error: Nonce verification failed', 'wedevs-project-manager') );
        }

        include_once ABSPATH . 'wp-admin/includes/plugin-install.php';
        include_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';

        $upgrader = new Plugin_Upgrader( new WP_Ajax_Upgrader_Skin() );

        add_filter( 'upgrader_package_options', function ( $options ) {
            $options['clear_destination'] = true;
            $options['hook_extra'] = [
                'type' => 'plugin',
                'action' => 'install',
                'plugin'  => 'wedevs-project-manager/cpm.php',
            ];
            return  $options;
        });

        add_filter('upgrader_pre_install', array($upgrader, 'deactivate_plugin_before_upgrade'), 10, 2);
        add_filter('upgrader_clear_destination', array($upgrader, 'delete_old_plugin'), 10, 4);

        $result   = $upgrader->install( 'https://github.com/weDevsOfficial/wp-project-manager/releases/download/v2.0.1/wedevs-project-manager-php5.6-v2.0.1.zip' );

        if ( is_wp_error( $result ) ) {
             wp_send_json_error( $result );
        }

        $result = activate_plugin( 'wedevs-project-manager/cpm.php' );

        if ( is_wp_error( $result ) ) {
             wp_send_json_error( $result );
        }
        wp_send_json_success();
    }

define('PM_FILE', __FILE__);
define ('PM_BASENAME', plugin_basename(__FILE__));

require __DIR__.'/bootstrap/start.php';