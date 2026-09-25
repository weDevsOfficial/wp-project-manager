<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

// Lowest Pro version that works with this Free version (Free and Pro 4.1.0 ship as a pair)
function wedevs_pm_min_pro_version() {
    return '4.1.0';
}

/**
 * Whether an outdated Pro can stay active in a paused state.
 *
 * Pro 4.0.8 is the first build with the Appsero updater. Deactivating it
 * would stop that updater, and WordPress would never offer the Pro update,
 * so it stays active with its features off and only the updater running.
 * Older builds have no working updater and are deactivated as before.
 *
 * @param string $pro_version Installed Pro version.
 *
 * @return bool
 */
function wedevs_pm_can_pause_pro( $pro_version ) {
    return $pro_version
        && version_compare( $pro_version, '4.0.8', '>=' )
        && version_compare( $pro_version, wedevs_pm_min_pro_version(), '<' );
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

// Pause an outdated Pro that can still update itself (runs before Pro boots at 90)
add_action( 'plugins_loaded', 'wedevs_pm_pause_outdated_pro', 1 );


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

        // If Pro is older than the required version, prevent activation
        if ( $pro_version && version_compare( $pro_version, wedevs_pm_min_pro_version(), '<' ) && ! wedevs_pm_can_pause_pro( $pro_version ) ) {
            // Deactivate it immediately
            deactivate_plugins( $plugin, true );

            // Store version for notice
            update_option( 'wedevs_pm_pro_activation_blocked', $pro_version );

            // Redirect back to plugins page with error
            wp_die(
                sprintf(
                    /* translators: 1: Pro version number, 2: Free version number, 3: required Pro version */
                    esc_html__( 'WP Project Manager Pro version %1$s is not compatible with WP Project Manager Free version %2$s. Please update WP Project Manager Pro to version %3$s or higher before activating.', 'wedevs-project-manager' ),
                    esc_html( $pro_version ),
                    esc_html( PM_VERSION ),
                    esc_html( wedevs_pm_min_pro_version() )
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
        $is_updating = $previous_version && version_compare( $previous_version, '4.0.0', '<' );
        $pro_is_old = $pro_version && version_compare( $pro_version, wedevs_pm_min_pro_version(), '<' ) && ! wedevs_pm_can_pause_pro( $pro_version );

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
                /* translators: 1: Free version number, 2: Pro version number, 3: required Pro version */
                __( 'WP Project Manager has been updated to version %1$s. Your Pro version %2$s was automatically deactivated to prevent compatibility errors. Please update WP Project Manager Pro to version %3$s or higher before reactivating it.', 'wedevs-project-manager' ),
                PM_VERSION,
                $pro_version,
                wedevs_pm_min_pro_version()
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
    $required_version = wedevs_pm_min_pro_version();

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
        if ( $pro_version && version_compare( $pro_version, $required_version, '<' ) && ! wedevs_pm_can_pause_pro( $pro_version ) ) {
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
                    /* translators: 1: Free version number, 2: Pro version number, 3: required Pro version */
                    __( 'WP Project Manager has been updated to version %1$s. Your Pro version %2$s is not compatible and was automatically deactivated to prevent errors. Please update WP Project Manager Pro to version %3$s or higher before reactivating it.', 'wedevs-project-manager' ),
                    PM_VERSION,
                    $pro_version,
                    wedevs_pm_min_pro_version()
                ) );
                // Clear the flag after showing the notice once
                delete_option( 'wedevs_pm_pro_deactivated_on_update' );
            } else {
                echo esc_html( sprintf(
                    /* translators: 1: Free version number, 2: Pro version number, 3: required Pro version */
                    __( 'WP Project Manager Free version %1$s requires WP Project Manager Pro version %3$s or higher. Your Pro version %2$s is not compatible and has been deactivated. Please update WP Project Manager Pro to version %3$s or higher.', 'wedevs-project-manager' ),
                    PM_VERSION,
                    $pro_version,
                    wedevs_pm_min_pro_version()
                ) );
            }
            ?>
        </p>
    </div>
    <?php
}

/**
 * Keep a paused Pro from booting, but let its updater run.
 */
function wedevs_pm_pause_outdated_pro() {
    if ( ! function_exists( 'wedevs_pm_pro_init' ) || ! defined( 'PM_PRO_VERSION' ) || ! wedevs_pm_can_pause_pro( PM_PRO_VERSION ) ) {
        return;
    }

    remove_action( 'plugins_loaded', 'wedevs_pm_pro_init', 90 );
    add_action( 'plugins_loaded', 'wedevs_pm_boot_paused_pro_updater', 90 );
    add_action( 'admin_notices', 'wedevs_pm_paused_pro_notice' );
}

/**
 * Boot only the Appsero updater of a paused Pro, so its update shows under Plugins.
 */
function wedevs_pm_boot_paused_pro_updater() {
    $update_class = '\\WeDevs\\PM_Pro\\Core\\Update\\Update';

    if ( ! class_exists( $update_class ) || ! method_exists( $update_class, 'init' ) ) {
        return;
    }

    try {
        if ( ! function_exists( 'wedevs_pm_pro_config' ) ) {
            $reflection = new ReflectionFunction( 'wedevs_pm_pro_init' );
            $config_lib = dirname( $reflection->getFileName(), 2 ) . '/libs/configurations.php';

            if ( ! file_exists( $config_lib ) ) {
                return;
            }

            require_once $config_lib;
        }

        $update_class::init();
    } catch ( \Throwable $e ) {
        // Best effort: the notice still tells the admin to update Pro.
        return;
    }
}

function wedevs_pm_paused_pro_notice() {
    if ( ! current_user_can( 'update_plugins' ) && ! current_user_can( 'activate_plugins' ) ) {
        return;
    }
    ?>
    <div class="notice notice-error">
        <p>
            <strong><?php esc_html_e( 'WP Project Manager Pro is paused', 'wedevs-project-manager' ); ?></strong><br>
            <?php
            echo esc_html( sprintf(
                /* translators: 1: Free version number, 2: required Pro version, 3: installed Pro version */
                __( 'WP Project Manager %1$s needs WP Project Manager Pro %2$s or newer, and version %3$s is installed. Pro features are off until you update Pro. Your projects and data are not affected.', 'wedevs-project-manager' ),
                PM_VERSION,
                wedevs_pm_min_pro_version(),
                PM_PRO_VERSION
            ) );
            ?>
            <a href="<?php echo esc_url( admin_url( 'plugins.php' ) ); ?>"><?php esc_html_e( 'Go to Plugins to update', 'wedevs-project-manager' ); ?></a>
        </p>
    </div>
    <?php
}
