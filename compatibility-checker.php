<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

// Get all possible Pro package slugs dynamically
function wedevs_pm_get_pro_packages() {
    return [
        'wedevs-project-manager-pro',
        'wedevs-project-manager-business',
        'wedevs-project-manager-professional',
        'pm-pro' // Legacy package name
    ];
}

// Hook into any Pro plugin activation dynamically to prevent incompatible activation
add_action( 'activate_plugin', 'wedevs_pm_prevent_old_pro_activation', 1, 2 );

// Deactivate Pro BEFORE plugins_loaded to prevent fatal errors
wedevs_pm_deactivate_incompatible_pro();

// Check Pro version compatibility
add_action( 'plugins_loaded', 'wedevs_pm_check_pro_compatibility', 100 );


function wedevs_pm_prevent_old_pro_activation( $plugin, $network_wide = false ) {
    // Get all possible Pro package slugs
    $pro_packages = wedevs_pm_get_pro_packages();

    // Check if the plugin being activated is one of the Pro packages
    $is_pro_package = false;
    $pro_slug = '';
    foreach ( $pro_packages as $package ) {
        if ( strpos( $plugin, $package ) !== false ) {
            $is_pro_package = true;
            $pro_slug = $package;
            break;
        }
    }

    if ( ! $is_pro_package ) {
        return; // Not a Pro package, ignore
    }

    // Get the full path to the Pro plugin file
    $pro_file = WP_PLUGIN_DIR . '/' . $plugin;

    if ( file_exists( $pro_file ) ) {
        // Read the Pro plugin file to get version
        $pro_data = get_file_data( $pro_file, [ 'Version' => 'Version' ] );
        $pro_version = $pro_data['Version'] ?? null;

        // If Pro version is < 3.0.0, prevent activation
        if ( $pro_version && version_compare( $pro_version, '3.0.0', '<' ) ) {
            // Deactivate it immediately
            deactivate_plugins( $plugin, true );

            // Store version for notice
            update_option( 'wedevs_pm_pro_activation_blocked', $pro_version );

            // Redirect back to plugins page with error
            wp_die(
                sprintf(
                    /* translators: 1: Pro version number, 2: Free version number */
                    esc_html__( 'WP Project Manager Pro version %1$s is not compatible with WP Project Manager Free version %2$s. Please update WP Project Manager Pro to version 3.0.0 or higher before activating.', 'wedevs-project-manager' ),
                    esc_html( $pro_version ),
                    esc_html( PM_VERSION )
                ),
                esc_html__( 'Plugin Activation Error', 'wedevs-project-manager' ),
                [ 'back_link' => true ]
            );
        }
    }
}

function wedevs_pm_deactivate_incompatible_pro() {
    // Get the stored version from database
    $previous_version = get_option( 'cpm_version' );

    // Check if Pro is active
    if ( ! function_exists( 'is_plugin_active' ) ) {
        require_once ABSPATH . 'wp-admin/includes/plugin.php';
    }

    // Get all active plugins
    $active_plugins = get_option( 'active_plugins', [] );
    $pro_packages = wedevs_pm_get_pro_packages();

    // Check each active plugin to see if it's a Pro package
    foreach ( $active_plugins as $plugin ) {
        $is_pro_package = false;
        foreach ( $pro_packages as $package ) {
            if ( strpos( $plugin, $package ) !== false ) {
                $is_pro_package = true;
                break;
            }
        }

        if ( ! $is_pro_package ) {
            continue;
        }

        // Get the full path to the Pro plugin file
        $pro_file = WP_PLUGIN_DIR . '/' . $plugin;

        if ( ! file_exists( $pro_file ) ) {
            continue;
        }

        // Read the Pro plugin file to get version
        $pro_data = get_file_data( $pro_file, [ 'Version' => 'Version' ] );
        $pro_version = $pro_data['Version'] ?? null;

        // If updating from 2.x to 3.0 OR Pro version is < 3.0.0, deactivate Pro
        $is_updating = $previous_version && version_compare( $previous_version, '3.0.0', '<' );
        $pro_is_old = $pro_version && version_compare( $pro_version, '3.0.0', '<' );

        if ( $is_updating || $pro_is_old || ! $pro_version ) {
            // Deactivate Pro immediately to prevent fatal errors
            deactivate_plugins( $plugin, true ); // silent deactivation
            update_option( 'wedevs_pm_pro_deactivated_on_update', $pro_version ?: 'unknown' );

            // Add notice for next page load
            add_action( 'admin_notices', 'wedevs_pm_pro_deactivated_notice' );
        }
    }

    // Show notice if Pro was deactivated
    if ( get_option( 'wedevs_pm_pro_deactivated_on_update' ) ) {
        add_action( 'admin_notices', 'wedevs_pm_pro_deactivated_notice' );
    }
}

function wedevs_pm_pro_deactivated_notice() {
    $pro_version = get_option( 'wedevs_pm_pro_deactivated_on_update' );
    if ( ! $pro_version ) {
        return;
    }
    ?>
    <div class="notice notice-warning is-dismissible">
        <p>
            <strong><?php esc_html_e( 'WP Project Manager Pro Deactivated', 'wedevs-project-manager' ); ?></strong><br>
            <?php
            echo esc_html( sprintf(
                /* translators: 1: Free version number, 2: Pro version number */
                __( 'WP Project Manager has been updated to version %1$s. Your Pro version %2$s was automatically deactivated to prevent compatibility errors. Please update WP Project Manager Pro to version 3.0.0 or higher before reactivating it.', 'wedevs-project-manager' ),
                PM_VERSION,
                $pro_version
            ) );
            ?>
        </p>
    </div>
    <?php
    // Clear the notice after showing it
    delete_option( 'wedevs_pm_pro_deactivated_on_update' );
}


function wedevs_pm_check_pro_compatibility() {
    // Check if Pro version is active
    $required_version = '3.0.0';

    // Check if Pro is active
    if ( ! function_exists( 'is_plugin_active' ) ) {
        require_once ABSPATH . 'wp-admin/includes/plugin.php';
    }

    // Get all active plugins
    $active_plugins = get_option( 'active_plugins', [] );
    $pro_packages = wedevs_pm_get_pro_packages();

    // Check each active plugin to see if it's a Pro package
    foreach ( $active_plugins as $plugin ) {
        $is_pro_package = false;
        foreach ( $pro_packages as $package ) {
            if ( strpos( $plugin, $package ) !== false ) {
                $is_pro_package = true;
                break;
            }
        }

        if ( ! $is_pro_package ) {
            continue;
        }

        // Get the full path to the Pro plugin file
        $pro_file = WP_PLUGIN_DIR . '/' . $plugin;

        if ( ! file_exists( $pro_file ) ) {
            continue;
        }

        // Read the Pro plugin file to get version
        $pro_data = get_file_data( $pro_file, [ 'Version' => 'Version' ] );
        $pro_version = $pro_data['Version'] ?? null;

        // Check if Pro version is compatible (>= 3.0.0)
        if ( $pro_version && version_compare( $pro_version, $required_version, '<' ) ) {
            add_action( 'admin_notices', 'wedevs_pm_pro_incompatible_notice' );
            // Deactivate Pro plugin on admin_init to ensure proper context
            add_action( 'admin_init', function() use ( $plugin ) {
                deactivate_plugins( $plugin );
            } );
        }
    }
}


function wedevs_pm_pro_incompatible_notice() {
    $pro_version = defined( 'PM_PRO_VERSION' ) ? PM_PRO_VERSION : ( function_exists( 'pm_pro_config' ) ? pm_pro_config('app.version') : wedevs_pm_pro_config('app.version')  );
    $deactivated_on_update = get_option( 'wedevs_pm_pro_deactivated_on_update' );
    ?>
    <div class="error">
        <p>
            <strong><?php esc_html_e( 'WP Project Manager Pro Incompatible!', 'wedevs-project-manager' ); ?></strong><br>
            <?php
            if ( $deactivated_on_update ) {
                echo esc_html( sprintf(
                    /* translators: 1: Free version number, 2: Pro version number */
                    __( 'WP Project Manager has been updated to version %1$s. Your Pro version %2$s is not compatible and was automatically deactivated to prevent errors. Please update WP Project Manager Pro to version 3.0.0 or higher before reactivating it.', 'wedevs-project-manager' ),
                    PM_VERSION,
                    $pro_version
                ) );
                // Clear the flag after showing the notice once
                delete_option( 'wedevs_pm_pro_deactivated_on_update' );
            } else {
                echo esc_html( sprintf(
                    /* translators: 1: Free version number, 2: Pro version number */
                    __( 'WP Project Manager Free version %1$s requires WP Project Manager Pro version 3.0.0 or higher. Your Pro version %2$s is not compatible and has been deactivated. Please update WP Project Manager Pro to version 3.0.0 or higher.', 'wedevs-project-manager' ),
                    PM_VERSION,
                    $pro_version
                ) );
            }
            ?>
        </p>
    </div>
    <?php
}
