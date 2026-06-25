<?php
namespace WeDevs\PM\Google_Workspace;

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * Thin Google OAuth2 + Drive client on the WordPress HTTP API — no external
 * SDK (WordPress.org-friendly). Stateless: callers pass the tokens they need.
 */
class Google_Client {

    const AUTH_URL   = 'https://accounts.google.com/o/oauth2/v2/auth';
    const TOKEN_URL  = 'https://oauth2.googleapis.com/token';
    const REVOKE_URL = 'https://oauth2.googleapis.com/revoke';
    const USERINFO   = 'https://www.googleapis.com/oauth2/v2/userinfo';

    // Least-privilege: drive.file = only files the user picks via the Picker.
    const SCOPES = 'openid email profile https://www.googleapis.com/auth/drive.file';

    // Pro Calendar feature — requested incrementally (only when the user opts
    // in via the Pro Calendar settings), so free-only users never grant it.
    const CALENDAR_SCOPE = 'https://www.googleapis.com/auth/calendar.events';

    private $client_id;
    private $client_secret;
    private $redirect_uri;

    public function __construct( $client_id, $client_secret, $redirect_uri ) {
        $this->client_id     = $client_id;
        $this->client_secret = $client_secret;
        $this->redirect_uri  = $redirect_uri;
    }

    public function get_auth_url( $state, $scope = self::SCOPES ) {
        return add_query_arg( [
            'client_id'     => rawurlencode( $this->client_id ),
            'redirect_uri'  => rawurlencode( $this->redirect_uri ),
            'response_type' => 'code',
            'scope'         => rawurlencode( $scope ),
            'access_type'   => 'offline',
            'include_granted_scopes' => 'true',
            'prompt'        => 'consent',
            'state'         => rawurlencode( $state ),
        ], self::AUTH_URL );
    }

    public function exchange_code( $code ) {
        return $this->token_request( [
            'code'          => $code,
            'client_id'     => $this->client_id,
            'client_secret' => $this->client_secret,
            'redirect_uri'  => $this->redirect_uri,
            'grant_type'    => 'authorization_code',
        ] );
    }

    public function refresh_token( $refresh_token ) {
        return $this->token_request( [
            'client_id'     => $this->client_id,
            'client_secret' => $this->client_secret,
            'refresh_token' => $refresh_token,
            'grant_type'    => 'refresh_token',
        ] );
    }

    private function token_request( $body ) {
        return $this->parse( wp_remote_post( self::TOKEN_URL, [
            'timeout' => 20,
            'body'    => $body,
        ] ) );
    }

    public function revoke( $token ) {
        wp_remote_post( self::REVOKE_URL, [
            'timeout' => 15,
            'body'    => [ 'token' => $token ],
        ] );
    }

    public function get_userinfo( $access_token ) {
        return $this->parse( wp_remote_get( self::USERINFO, [
            'timeout' => 15,
            'headers' => [ 'Authorization' => 'Bearer ' . $access_token ],
        ] ) );
    }

    private function parse( $res ) {
        if ( is_wp_error( $res ) ) {
            return [ 'ok' => false, 'status' => 0, 'error' => $res->get_error_message() ];
        }

        $status = (int) wp_remote_retrieve_response_code( $res );
        $body   = json_decode( wp_remote_retrieve_body( $res ), true );

        if ( $status < 200 || $status >= 300 ) {
            $message = 'Google API error';
            if ( isset( $body['error_description'] ) ) {
                $message = $body['error_description'];
            } elseif ( isset( $body['error']['message'] ) ) {
                $message = $body['error']['message'];
            } elseif ( isset( $body['error'] ) && is_string( $body['error'] ) ) {
                $message = $body['error'];
            }
            return [ 'ok' => false, 'status' => $status, 'error' => $message ];
        }

        return [ 'ok' => true, 'status' => $status, 'data' => $body ];
    }
}
