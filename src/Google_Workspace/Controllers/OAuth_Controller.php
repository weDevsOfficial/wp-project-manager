<?php
namespace WeDevs\PM\Google_Workspace\Controllers;

use WP_REST_Request;
use WeDevs\PM\Google_Workspace\Google_Service;

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
                'connected'     => $conn['connected'],
                'account_email' => $conn['account_email'],
                'expired'       => $conn['expired'],
            ],
        ];
    }

    public function auth_url( WP_REST_Request $request ) {
        if ( ! Google_Service::is_configured() ) {
            return new \WP_Error( 'pm_google_not_configured', __( 'Google credentials are not configured. Ask an administrator to add the Client ID and Secret.', 'wedevs-project-manager' ), [ 'status' => 400 ] );
        }

        $user_id = get_current_user_id();
        $state   = $user_id . '|' . wp_create_nonce( 'pm_google_oauth_' . $user_id );

        return [
            'data' => [
                'auth_url' => Google_Service::client()->get_auth_url( $state ),
            ],
        ];
    }

    public function disconnect( WP_REST_Request $request ) {
        Google_Service::disconnect_user( get_current_user_id() );

        return [ 'data' => [ 'connected' => false ] ];
    }
}
