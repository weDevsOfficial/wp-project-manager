<?php
namespace WeDevs\PM\Google_Workspace\Controllers;

use WP_REST_Request;
use WeDevs\PM\Google_Workspace\Google_Service;
use WeDevs\PM\Google_Workspace\Loader;

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * Admin-only: site-level Google OAuth credentials + Picker keys.
 */
class Settings_Controller {

    public function get( WP_REST_Request $request ) {
        $settings = get_option( 'pm_google_workspace_settings', [] );

        return [
            'data' => [
                'client_id'    => isset( $settings['client_id'] ) ? $settings['client_id'] : '',
                'has_secret'   => ! empty( $settings['client_secret'] ),
                'api_key'      => isset( $settings['api_key'] ) ? $settings['api_key'] : '',
                'app_id'       => isset( $settings['app_id'] ) ? $settings['app_id'] : '',
                'configured'   => Google_Service::is_configured(),
                'picker_ready' => Google_Service::picker_ready(),
                'redirect_uri' => Loader::redirect_uri(),
            ],
        ];
    }

    public function save( WP_REST_Request $request ) {
        $client_id     = trim( (string) $request->get_param( 'client_id' ) );
        $client_secret = trim( (string) $request->get_param( 'client_secret' ) );

        $settings = get_option( 'pm_google_workspace_settings', [] );

        $settings['client_id'] = sanitize_text_field( $client_id );
        $settings['api_key']   = sanitize_text_field( (string) $request->get_param( 'api_key' ) );
        $settings['app_id']    = sanitize_text_field( (string) $request->get_param( 'app_id' ) );

        // Only overwrite the secret when a fresh value is sent (UI sends blank to keep).
        // Stored encrypted at rest.
        if ( $client_secret !== '' ) {
            $settings['client_secret'] = Google_Service::encrypt( $client_secret );
        }

        update_option( 'pm_google_workspace_settings', $settings );

        return $this->get( $request );
    }
}
