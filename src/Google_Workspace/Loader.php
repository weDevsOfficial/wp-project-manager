<?php
namespace WeDevs\PM\Google_Workspace;

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * Google Workspace (Drive) integration — FREE feature, always on.
 *
 * Wires the OAuth callback, pushes connection state into PM_Vars, and ensures
 * the DB tables exist. Drive browse/attach is read-only via the drive.file
 * scope + Google Picker.
 */
class Loader {

    const CLEANUP_HOOK = 'pm_google_workspace_cleanup';

    public function boot() {
        add_filter( 'wedevs_pm_localize', [ $this, 'localize' ] );
        add_action( 'admin_post_pm_google_oauth_callback', [ $this, 'handle_oauth_callback' ] );
        add_action( 'admin_init', [ $this, 'maybe_install' ] );

        // Daily purge of tokens unused for 60+ days.
        add_action( self::CLEANUP_HOOK, [ $this, 'run_cleanup' ] );
        if ( ! wp_next_scheduled( self::CLEANUP_HOOK ) ) {
            wp_schedule_event( time() + HOUR_IN_SECONDS, 'daily', self::CLEANUP_HOOK );
        }
    }

    public function run_cleanup() {
        Google_Service::purge_stale( 60 );
    }

    public static function redirect_uri() {
        return admin_url( 'admin-post.php?action=pm_google_oauth_callback' );
    }

    public function localize( $localize ) {
        $conn = Google_Service::user_connection( get_current_user_id() );

        $localize['google_workspace'] = [
            'configured'    => Google_Service::is_configured(),
            'picker_ready'  => Google_Service::picker_ready(),
            'drive_enabled' => Google_Service::drive_enabled(),
            'connected'     => $conn['connected'],
            'account_email' => $conn['account_email'],
            'expired'       => $conn['expired'],
            'redirect_uri'  => self::redirect_uri(),
        ];

        return $localize;
    }

    public function handle_oauth_callback() {
        if ( ! is_user_logged_in() ) {
            wp_die( esc_html__( 'You must be logged in to connect Google.', 'wedevs-project-manager' ) );
        }

        $state = isset( $_GET['state'] ) ? sanitize_text_field( wp_unslash( $_GET['state'] ) ) : '';
        $code  = isset( $_GET['code'] ) ? sanitize_text_field( wp_unslash( $_GET['code'] ) ) : '';

        $return = admin_url( 'admin.php?page=pm_projects#/google-workspace' );

        $parts = explode( '|', $state );
        if ( count( $parts ) !== 2 || (int) $parts[0] !== get_current_user_id()
            || ! wp_verify_nonce( $parts[1], 'pm_google_oauth_' . get_current_user_id() ) ) {
            wp_safe_redirect( add_query_arg( 'google_connected', 'invalid_state', $return ) );
            exit;
        }

        if ( empty( $code ) ) {
            wp_safe_redirect( add_query_arg( 'google_connected', 'denied', $return ) );
            exit;
        }

        $ok = Google_Service::connect_user( get_current_user_id(), $code );

        wp_safe_redirect( add_query_arg( 'google_connected', $ok ? 'success' : 'error', $return ) );
        exit;
    }

    /** Gated debug logger — writes when WP_DEBUG or PM_GOOGLE_DEBUG is on. */
    public static function log( $message ) {
        if ( ( defined( 'WP_DEBUG' ) && WP_DEBUG ) || ( defined( 'PM_GOOGLE_DEBUG' ) && PM_GOOGLE_DEBUG ) ) {
            error_log( '[PM Google Workspace] ' . $message );
        }
    }

    public function maybe_install() {
        // Always self-heal columns first (cheap) so upgrades from an older
        // schema — e.g. a table left by a previous install — get last_used_at
        // without depending on the version gate.
        self::ensure_columns();

        if ( get_option( 'pm_google_workspace_db_version' ) === '1.1' ) {
            return;
        }
        self::install();
    }

    /**
     * Idempotently add columns missing from an existing tokens table.
     * Works on both MySQL and MariaDB (no ADD COLUMN IF NOT EXISTS).
     */
    public static function ensure_columns() {
        global $wpdb;
        $table = $wpdb->prefix . 'pm_google_tokens';

        // Bail if the table doesn't exist yet (fresh install creates it with the column).
        $exists = $wpdb->get_var( $wpdb->prepare( 'SHOW TABLES LIKE %s', $table ) );
        if ( ! $exists ) {
            return;
        }

        $has = $wpdb->get_results( $wpdb->prepare(
            "SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = %s AND TABLE_NAME = %s AND COLUMN_NAME = %s",
            DB_NAME, $table, 'last_used_at'
        ) );

        if ( empty( $has ) ) {
            $wpdb->query( "ALTER TABLE {$table} ADD COLUMN `last_used_at` datetime DEFAULT NULL AFTER `expires_at`" );
            self::log( 'Added missing last_used_at column to ' . $table );
        }
    }

    public static function install() {
        global $wpdb;
        require_once ABSPATH . 'wp-admin/includes/upgrade.php';

        $tokens = $wpdb->prefix . 'pm_google_tokens';
        $files  = $wpdb->prefix . 'pm_google_drive_files';

        dbDelta( "CREATE TABLE IF NOT EXISTS {$tokens} (
            `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
            `user_id` bigint(20) UNSIGNED NOT NULL,
            `google_email` varchar(191) DEFAULT NULL,
            `access_token` text,
            `refresh_token` text,
            `scope` text,
            `expires_at` datetime DEFAULT NULL,
            `last_used_at` datetime DEFAULT NULL,
            `created_at` timestamp NULL DEFAULT NULL,
            `updated_at` timestamp NULL DEFAULT NULL,
            PRIMARY KEY (`id`),
            UNIQUE KEY `user_id` (`user_id`)
        ) DEFAULT CHARSET=utf8" );

        dbDelta( "CREATE TABLE IF NOT EXISTS {$files} (
            `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
            `project_id` bigint(20) UNSIGNED DEFAULT NULL,
            `task_id` bigint(20) UNSIGNED DEFAULT NULL,
            `user_id` bigint(20) UNSIGNED NOT NULL,
            `file_id` varchar(191) NOT NULL,
            `name` varchar(255) DEFAULT NULL,
            `mime_type` varchar(191) DEFAULT NULL,
            `icon_link` text,
            `thumbnail_link` text,
            `web_view_link` text,
            `modified_time` varchar(64) DEFAULT NULL,
            `created_at` timestamp NULL DEFAULT NULL,
            `updated_at` timestamp NULL DEFAULT NULL,
            PRIMARY KEY (`id`),
            KEY `task_id` (`task_id`),
            KEY `project_id` (`project_id`)
        ) DEFAULT CHARSET=utf8" );

        update_option( 'pm_google_workspace_db_version', '1.1' );
    }
}
