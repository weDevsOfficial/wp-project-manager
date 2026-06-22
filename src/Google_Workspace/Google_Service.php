<?php
namespace WeDevs\PM\Google_Workspace;

use WeDevs\PM\Google_Workspace\Models\Google_Token;
use Carbon\Carbon;

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * Per-user OAuth state: stores tokens, refreshes expired access tokens, and
 * hands callers a ready Google_Client. Refresh tokens are encrypted at rest
 * (AES-256-CBC, key derived from WP salts).
 */
class Google_Service {

    public static function client() {
        $settings = get_option( 'pm_google_workspace_settings', [] );

        return new Google_Client(
            isset( $settings['client_id'] ) ? $settings['client_id'] : '',
            self::get_client_secret(),
            Loader::redirect_uri()
        );
    }

    /**
     * Client secret is encrypted at rest. Falls back to the raw value for
     * secrets saved before encryption was added (legacy plaintext).
     */
    public static function get_client_secret() {
        $settings = get_option( 'pm_google_workspace_settings', [] );
        if ( empty( $settings['client_secret'] ) ) {
            return '';
        }
        $decrypted = self::decrypt( $settings['client_secret'] );
        return $decrypted !== null ? $decrypted : $settings['client_secret'];
    }

    public static function is_configured() {
        $settings = get_option( 'pm_google_workspace_settings', [] );
        return ! empty( $settings['client_id'] ) && ! empty( $settings['client_secret'] );
    }

    // ── Per-project, per-role access (Drive now; Calendar/Meet later) ────

    /**
     * Per-project Drive access by role. Stored in a project-scoped option so
     * the core capability tables are untouched. Defaults: co_worker on, client off.
     *
     * @return array{co_worker:bool, client:bool}
     */
    public static function project_drive_access( $project_id ) {
        $saved = get_option( 'pm_gdrive_access_' . (int) $project_id, null );
        if ( ! is_array( $saved ) ) {
            return [ 'co_worker' => true, 'client' => false ];
        }
        return [
            'co_worker' => ! empty( $saved['co_worker'] ),
            'client'    => ! empty( $saved['client'] ),
        ];
    }

    public static function save_project_drive_access( $project_id, $co_worker, $client ) {
        update_option( 'pm_gdrive_access_' . (int) $project_id, [
            'co_worker' => (bool) $co_worker,
            'client'    => (bool) $client,
        ] );
    }

    /** Per-user opt-out of Drive (toggled on the Google Workspace page). Default on. */
    public static function user_drive_enabled( $user_id ) {
        $v = get_user_meta( (int) $user_id, 'pm_gws_drive_on', true );
        return $v === '' ? true : (bool) $v;
    }

    public static function set_user_drive_enabled( $user_id, $on ) {
        update_user_meta( (int) $user_id, 'pm_gws_drive_on', $on ? 1 : 0 );
    }

    /**
     * Whether a user may use Drive in a project. Managers/admins always may;
     * co_worker/client gated by the per-project access map.
     */
    public static function user_can_use_drive( $project_id, $user_id = null ) {
        $user_id = $user_id ? $user_id : get_current_user_id();

        // Respect the user's own Drive on/off choice first.
        if ( ! self::user_drive_enabled( $user_id ) ) {
            return false;
        }

        if ( wedevs_pm_has_manage_capability( $user_id ) || wedevs_pm_is_manager( $project_id, $user_id ) ) {
            return true;
        }

        $role   = wedevs_pm_get_role( $project_id, $user_id ); // co_worker | client | null
        $access = self::project_drive_access( $project_id );

        return ! empty( $access[ $role ] );
    }

    /** Global on/off switch for the Drive feature (admin-controlled). */
    public static function drive_enabled() {
        $settings = get_option( 'pm_google_workspace_settings', [] );
        return ! empty( $settings['drive_enabled'] );
    }

    /** Picker also needs an API key + App ID (project number). */
    public static function picker_ready() {
        $settings = get_option( 'pm_google_workspace_settings', [] );
        return self::is_configured() && ! empty( $settings['api_key'] ) && ! empty( $settings['app_id'] );
    }

    public static function get_api_key() {
        $settings = get_option( 'pm_google_workspace_settings', [] );
        return isset( $settings['api_key'] ) ? $settings['api_key'] : '';
    }

    public static function get_app_id() {
        $settings = get_option( 'pm_google_workspace_settings', [] );
        return isset( $settings['app_id'] ) ? $settings['app_id'] : '';
    }

    /** Whether the user's stored grant includes a given OAuth scope. */
    public static function user_has_scope( $user_id, $needle ) {
        $token = self::get_user_token( $user_id );
        if ( ! $token || empty( $token->scope ) ) {
            return false;
        }
        return strpos( $token->scope, $needle ) !== false;
    }

    /** Whether the user has granted the Calendar scope (Pro Calendar feature). */
    public static function user_has_calendar( $user_id ) {
        return self::user_has_scope( $user_id, Google_Client::CALENDAR_SCOPE );
    }

    public static function get_user_token( $user_id ) {
        if ( empty( $user_id ) ) {
            return null;
        }
        return Google_Token::where( 'user_id', $user_id )->first();
    }

    /**
     * @return array{connected:bool, account_email:string, expired:bool}
     */
    public static function user_connection( $user_id ) {
        $token = self::get_user_token( $user_id );

        if ( ! $token ) {
            Loader::log( 'Status: no token row for user ' . $user_id );
            return [ 'connected' => false, 'account_email' => '', 'expired' => false ];
        }

        if ( self::token_undecryptable( $token ) ) {
            Loader::log( 'Status: token undecryptable for user ' . $user_id . ' — purging' );
            $token->delete();
            return [ 'connected' => false, 'account_email' => '', 'expired' => true ];
        }

        return [ 'connected' => true, 'account_email' => $token->google_email, 'expired' => false ];
    }

    private static function token_undecryptable( $token ) {
        $has_refresh = ! empty( $token->refresh_token );
        $has_access  = ! empty( $token->access_token );

        if ( ! $has_refresh && ! $has_access ) {
            return false;
        }

        $refresh_ok = ! $has_refresh || self::decrypt( $token->refresh_token ) !== null;
        $access_ok  = ! $has_access  || self::decrypt( $token->access_token ) !== null;

        return ! $refresh_ok && ! $access_ok;
    }

    public static function connect_user( $user_id, $code ) {
        $client = self::client();
        $token  = $client->exchange_code( $code );

        if ( empty( $token['ok'] ) ) {
            Loader::log( 'Token exchange failed for user ' . $user_id . ': ' . ( isset( $token['error'] ) ? $token['error'] : 'unknown' ) );
            return false;
        }

        $data  = $token['data'];
        $email = '';
        $profile = $client->get_userinfo( $data['access_token'] );
        if ( ! empty( $profile['ok'] ) && isset( $profile['data']['email'] ) ) {
            $email = $profile['data']['email'];
        }

        $expires_at = Carbon::now()->addSeconds( isset( $data['expires_in'] ) ? (int) $data['expires_in'] : 3600 );

        $existing = self::get_user_token( $user_id );

        $refresh_plain = isset( $data['refresh_token'] ) ? $data['refresh_token'] : null;
        if ( empty( $refresh_plain ) && $existing ) {
            $refresh_enc = $existing->refresh_token;
        } else {
            $refresh_enc = $refresh_plain ? self::encrypt( $refresh_plain ) : null;
        }

        $attrs = [
            'user_id'       => $user_id,
            'google_email'  => $email,
            'access_token'  => self::encrypt( $data['access_token'] ),
            'refresh_token' => $refresh_enc,
            'scope'         => isset( $data['scope'] ) ? $data['scope'] : Google_Client::SCOPES,
            'expires_at'    => $expires_at,
            'last_used_at'  => Carbon::now(),
            'updated_at'    => Carbon::now(),
        ];

        try {
            if ( $existing ) {
                $existing->update( $attrs );
            } else {
                $attrs['created_at'] = Carbon::now();
                Google_Token::create( $attrs );
            }
        } catch ( \Exception $e ) {
            // Surface the real DB error (e.g. missing column) instead of a
            // false "success" — the caller will report an error to the user.
            Loader::log( 'Token store FAILED for user ' . $user_id . ': ' . $e->getMessage() );
            return false;
        }

        Loader::log( 'Token stored for user ' . $user_id . ' (' . $email . ')' );
        return true;
    }

    public static function disconnect_user( $user_id ) {
        $token = self::get_user_token( $user_id );
        if ( ! $token ) {
            return;
        }

        $refresh = self::decrypt( $token->refresh_token );
        if ( $refresh ) {
            self::client()->revoke( $refresh );
        }

        $token->delete();
    }

    /**
     * Revoke + delete tokens not used for $days days (default 60). Runs daily
     * via cron so abandoned grants don't linger. Applies to every user.
     *
     * @return int number purged
     */
    public static function purge_stale( $days = 60 ) {
        $cutoff = Carbon::now()->subDays( $days );
        $purged = 0;

        $tokens = Google_Token::all();
        foreach ( $tokens as $token ) {
            $marker = $token->last_used_at ?: $token->updated_at ?: $token->created_at;
            if ( ! $marker || ! Carbon::parse( $marker )->lessThan( $cutoff ) ) {
                continue;
            }

            $refresh = self::decrypt( $token->refresh_token );
            if ( $refresh ) {
                self::client()->revoke( $refresh );
            }
            $token->delete();
            $purged++;
        }

        return $purged;
    }

    /**
     * Fresh access token for a user, refreshing if needed. Purges tokens that
     * can no longer be decrypted (salts rotated) so the UI prompts reconnect.
     *
     * @return string|null
     */
    public static function get_access_token( $user_id ) {
        $token = self::get_user_token( $user_id );
        if ( ! $token ) {
            return null;
        }

        if ( self::token_undecryptable( $token ) ) {
            $token->delete();
            return null;
        }

        // Track activity for the 60-day stale-token purge.
        $token->update( [ 'last_used_at' => Carbon::now() ] );

        $expires_at = $token->expires_at ? Carbon::parse( $token->expires_at ) : null;

        if ( $expires_at && $expires_at->isFuture() && $expires_at->diffInSeconds( Carbon::now() ) > 60 ) {
            return self::decrypt( $token->access_token );
        }

        $refresh = self::decrypt( $token->refresh_token );
        if ( empty( $refresh ) ) {
            return self::decrypt( $token->access_token );
        }

        $res = self::client()->refresh_token( $refresh );
        if ( empty( $res['ok'] ) ) {
            return null;
        }

        $data    = $res['data'];
        $expires = Carbon::now()->addSeconds( isset( $data['expires_in'] ) ? (int) $data['expires_in'] : 3600 );
        $access  = $data['access_token'];

        $token->update( [
            'access_token' => self::encrypt( $access ),
            'expires_at'   => $expires,
            'updated_at'   => Carbon::now(),
        ] );

        return $access;
    }

    // ── Encryption (AES-256-CBC, key from WP salts) ──────────────────────

    private static function key() {
        $salt  = defined( 'AUTH_KEY' ) ? AUTH_KEY : 'pm-google-fallback';
        $salt .= defined( 'AUTH_SALT' ) ? AUTH_SALT : 'pm-google-fallback-salt';
        return hash( 'sha256', $salt, true );
    }

    public static function encrypt( $plain ) {
        if ( $plain === null || $plain === '' || ! function_exists( 'openssl_encrypt' ) ) {
            return $plain;
        }
        $iv     = openssl_random_pseudo_bytes( 16 );
        $cipher = openssl_encrypt( $plain, 'aes-256-cbc', self::key(), OPENSSL_RAW_DATA, $iv );
        return base64_encode( $iv . $cipher );
    }

    public static function decrypt( $stored ) {
        if ( empty( $stored ) || ! function_exists( 'openssl_decrypt' ) ) {
            return $stored;
        }
        $raw = base64_decode( $stored, true );
        if ( $raw === false || strlen( $raw ) <= 16 ) {
            return null;
        }
        $iv     = substr( $raw, 0, 16 );
        $cipher = substr( $raw, 16 );
        $plain  = openssl_decrypt( $cipher, 'aes-256-cbc', self::key(), OPENSSL_RAW_DATA, $iv );
        return $plain === false ? null : $plain;
    }
}
