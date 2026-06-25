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

        // Remove Drive attachments when their parent entity is deleted.
        add_action( 'wedevs_cpm_comment_delete', [ $this, 'cleanup_comment_attachments' ], 10, 1 );
        add_action( 'wedevs_pm_after_delete_task', [ $this, 'cleanup_task_attachments' ], 10, 1 );
        add_action( 'wedevs_cpm_message_delete', [ $this, 'cleanup_discussion_attachments' ], 10, 1 );

        // Daily purge of tokens unused for 60+ days.
        add_action( self::CLEANUP_HOOK, [ $this, 'run_cleanup' ] );
        if ( ! wp_next_scheduled( self::CLEANUP_HOOK ) ) {
            wp_schedule_event( time() + HOUR_IN_SECONDS, 'daily', self::CLEANUP_HOOK );
        }
    }

    public function run_cleanup() {
        Google_Service::purge_stale( 60 );
    }

    private static function delete_attachments( $type, $id ) {
        global $wpdb;
        if ( empty( $id ) ) {
            return;
        }
        $wpdb->delete( $wpdb->prefix . 'pm_google_drive_files', [
            'attachable_type' => $type,
            'attachable_id'   => (int) $id,
        ] );
    }

    public function cleanup_comment_attachments( $comment ) {
        $id = is_object( $comment ) ? ( isset( $comment->id ) ? $comment->id : 0 ) : (int) $comment;
        self::delete_attachments( 'comment', $id );
    }

    public function cleanup_task_attachments( $task_id ) {
        self::delete_attachments( 'task', $task_id );
    }

    public function cleanup_discussion_attachments( $discussion_id ) {
        self::delete_attachments( 'discussion', (int) $discussion_id );
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
            'calendar_enabled' => Google_Service::calendar_master_enabled(),
            'meet_enabled'  => Google_Service::meet_master_enabled(),
            'connected'     => $conn['connected'],
            'account_email' => $conn['account_email'],
            'expired'       => $conn['expired'],
            'calendar_connected' => Google_Service::user_has_calendar( get_current_user_id() ),
            'meet_connected' => Google_Service::user_has_calendar( get_current_user_id() ),
            'drive_user_on' => Google_Service::user_drive_enabled( get_current_user_id() ),
            'drive_comments_on' => Google_Service::drive_comments_enabled(),
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

        if ( get_option( 'pm_google_workspace_db_version' ) === '1.3' ) {
            return;
        }
        self::install();
    }

    private static function column_missing( $table, $column ) {
        global $wpdb;
        $has = $wpdb->get_results( $wpdb->prepare(
            "SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = %s AND TABLE_NAME = %s AND COLUMN_NAME = %s",
            DB_NAME, $table, $column
        ) );
        return empty( $has );
    }

    /**
     * Idempotently add columns missing from existing tables (covers upgrades
     * from an older schema). MySQL + MariaDB safe (no ADD COLUMN IF NOT EXISTS).
     */
    public static function ensure_columns() {
        global $wpdb;
        $tokens = $wpdb->prefix . 'pm_google_tokens';
        $files  = $wpdb->prefix . 'pm_google_drive_files';

        if ( $wpdb->get_var( $wpdb->prepare( 'SHOW TABLES LIKE %s', $tokens ) ) && self::column_missing( $tokens, 'last_used_at' ) ) {
            $wpdb->query( "ALTER TABLE {$tokens} ADD COLUMN `last_used_at` datetime DEFAULT NULL AFTER `expires_at`" );
            self::log( 'Added last_used_at to ' . $tokens );
        }

        if ( $wpdb->get_var( $wpdb->prepare( 'SHOW TABLES LIKE %s', $files ) ) ) {
            if ( self::column_missing( $files, 'attachable_type' ) ) {
                $wpdb->query( "ALTER TABLE {$files} ADD COLUMN `attachable_type` varchar(40) DEFAULT NULL AFTER `task_id`" );
                $wpdb->query( "ALTER TABLE {$files} ADD COLUMN `attachable_id` bigint(20) UNSIGNED DEFAULT NULL AFTER `attachable_type`" );
                $wpdb->query( "ALTER TABLE {$files} ADD KEY `attachable` (`attachable_type`,`attachable_id`)" );
                // Migrate existing task attachments to the polymorphic columns.
                $wpdb->query( "UPDATE {$files} SET `attachable_type` = 'task', `attachable_id` = `task_id` WHERE `task_id` IS NOT NULL AND `attachable_type` IS NULL" );
                self::log( 'Added polymorphic columns + migrated task rows on ' . $files );
            }
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
            `attachable_type` varchar(40) DEFAULT NULL,
            `attachable_id` bigint(20) UNSIGNED DEFAULT NULL,
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
            KEY `project_id` (`project_id`),
            KEY `attachable` (`attachable_type`,`attachable_id`)
        ) DEFAULT CHARSET=utf8" );

        update_option( 'pm_google_workspace_db_version', '1.3' );
    }
}
