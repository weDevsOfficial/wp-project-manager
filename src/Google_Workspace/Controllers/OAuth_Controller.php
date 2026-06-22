<?php
namespace WeDevs\PM\Google_Workspace\Controllers;

use WP_REST_Request;
use WeDevs\PM\Google_Workspace\Google_Service;
use WeDevs\PM\Google_Workspace\Google_Client;

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * Per-user OAuth connection: consent URL, status, disconnect.
 */
class OAuth_Controller {

    public function status( WP_REST_Request $request ) {
        $conn = Google_Service::user_connection( get_current_user_id() );

        return [
            'data' => [
                'configured'    => Google_Service::is_configured(),
                'picker_ready'  => Google_Service::picker_ready(),
                'drive_enabled' => Google_Service::drive_enabled(),
                'connected'         => $conn['connected'],
                'account_email'     => $conn['account_email'],
                'expired'           => $conn['expired'],
                'calendar_connected'=> Google_Service::user_has_calendar( get_current_user_id() ),
                'drive_user_on'     => Google_Service::user_drive_enabled( get_current_user_id() ),
            ],
        ];
    }

    /** Per-user Workspace preferences (currently: Drive on/off for me). */
    public function save_my_prefs( WP_REST_Request $request ) {
        $user_id = get_current_user_id();
        if ( $request->get_param( 'drive_on' ) !== null ) {
            Google_Service::set_user_drive_enabled( $user_id, (bool) $request->get_param( 'drive_on' ) );
        }
        return [ 'data' => [ 'drive_user_on' => Google_Service::user_drive_enabled( $user_id ) ] ];
    }

    public function auth_url( WP_REST_Request $request ) {
        if ( ! Google_Service::is_configured() ) {
            return new \WP_Error( 'pm_google_not_configured', __( 'Google credentials are not configured. Ask an administrator to add the Client ID and Secret.', 'wedevs-project-manager' ), [ 'status' => 400 ] );
        }

        $user_id = get_current_user_id();
        $state   = $user_id . '|' . wp_create_nonce( 'pm_google_oauth_' . $user_id );

        // Incremental consent: when a Pro feature asks for Calendar, request the
        // Calendar scope alongside the base scopes (include_granted_scopes keeps
        // the previously granted Drive scope).
        $scope = Google_Client::SCOPES;
        if ( $request->get_param( 'with_calendar' ) ) {
            $scope .= ' ' . Google_Client::CALENDAR_SCOPE;
        }

        return [
            'data' => [
                'auth_url' => Google_Service::client()->get_auth_url( $state, $scope ),
            ],
        ];
    }

    public function disconnect( WP_REST_Request $request ) {
        Google_Service::disconnect_user( get_current_user_id() );

        return [ 'data' => [ 'connected' => false ] ];
    }
}
