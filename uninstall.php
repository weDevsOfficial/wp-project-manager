<?php
/**
 * Uninstall cleanup.
 *
 * Currently scoped to the Google Workspace integration: removes its tables,
 * options, and scheduled cron. Core Project Manager data is intentionally
 * left intact.
 */

if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
    exit;
}

global $wpdb;

// Google Workspace tables.
$wpdb->query( "DROP TABLE IF EXISTS {$wpdb->prefix}pm_google_tokens" );
$wpdb->query( "DROP TABLE IF EXISTS {$wpdb->prefix}pm_google_drive_files" );

// Google Workspace options.
delete_option( 'pm_google_workspace_settings' );
delete_option( 'pm_google_workspace_db_version' );

// Scheduled cleanup cron.
$timestamp = wp_next_scheduled( 'pm_google_workspace_cleanup' );
if ( $timestamp ) {
    wp_unschedule_event( $timestamp, 'pm_google_workspace_cleanup' );
}
wp_clear_scheduled_hook( 'pm_google_workspace_cleanup' );
