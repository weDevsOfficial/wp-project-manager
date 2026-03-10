<?php

namespace WeDevs\PM\Loom\Controllers;

use WP_REST_Request;
use WeDevs\PM\Settings\Models\Settings;

/**
 * Loom Preview Controller
 *
 * Handles fetching Loom video preview data via the oEmbed API.
 * Loom does not offer a public REST API — only oEmbed is available.
 */
class Loom_Preview_Controller {

    /**
     * Check if Loom previews are enabled.
     *
     * @return bool
     */
    private function is_previews_enabled() {
        $setting = Settings::where( 'key', 'loom_enable_previews' )
            ->whereNull( 'project_id' )
            ->first();

        if ( $setting ) {
            return ! in_array( $setting->value, [ false, 'false', '0', 0 ], true );
        }

        return true;
    }

    /**
     * Test Loom oEmbed connection.
     *
     * @param WP_REST_Request $request
     * @return array
     */
    public function test_connection( WP_REST_Request $request ) {
        $oembed_url = 'https://www.loom.com/v1/oembed?url=' . urlencode( 'https://www.loom.com/share/test' );

        $ssl_verify = ! ( defined( 'WP_DEBUG' ) && WP_DEBUG && defined( 'WP_LOCAL_DEV' ) && WP_LOCAL_DEV );

        $response = wp_remote_get( $oembed_url, [
            'timeout'   => 15,
            'headers'   => [
                'User-Agent' => 'WordPress/' . get_bloginfo( 'version' ),
                'Accept'     => 'application/json',
            ],
            'sslverify' => $ssl_verify,
        ] );

        if ( is_wp_error( $response ) ) {
            if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
                error_log( 'Loom oEmbed connection error: ' . $response->get_error_message() );
            }

            return [
                'success' => false,
                'error'   => __( 'Could not connect to Loom. Please check your network and try again.', 'wedevs-project-manager' ),
            ];
        }

        $status_code = wp_remote_retrieve_response_code( $response );

        // oEmbed returns 404 for invalid video IDs but the endpoint is reachable
        // A 5xx response means the service is down
        if ( $status_code >= 500 ) {
            return [
                'success' => false,
                'error'   => sprintf(
                    __( 'Loom API returned status %d.', 'wedevs-project-manager' ),
                    $status_code
                ),
            ];
        }

        return [
            'success' => true,
            'data'    => [
                'oembed_available' => true,
            ],
        ];
    }

    /**
     * Fetch preview data for a single Loom video URL.
     *
     * @param WP_REST_Request $request
     * @return array
     */
    public function preview( WP_REST_Request $request ) {
        if ( ! $this->is_previews_enabled() ) {
            return [
                'success' => false,
                'error'   => __( 'Loom previews are disabled.', 'wedevs-project-manager' ),
            ];
        }

        $url = $request->get_param( 'url' );

        if ( ! is_string( $url ) || empty( $url ) ) {
            return [
                'success' => false,
                'error'   => __( 'URL is required.', 'wedevs-project-manager' ),
            ];
        }

        $parsed = $this->parse_loom_url( $url );

        if ( ! $parsed ) {
            return [
                'success' => false,
                'error'   => __( 'Invalid Loom URL.', 'wedevs-project-manager' ),
            ];
        }

        $force_refresh = filter_var( $request->get_param( 'force_refresh' ), FILTER_VALIDATE_BOOLEAN );

        return $this->fetch_loom_data( $parsed, $force_refresh );
    }

    /**
     * Fetch preview data for multiple Loom URLs at once.
     *
     * @param WP_REST_Request $request
     * @return array
     */
    public function batch_preview( WP_REST_Request $request ) {
        if ( ! $this->is_previews_enabled() ) {
            return [
                'success' => false,
                'error'   => __( 'Loom previews are disabled.', 'wedevs-project-manager' ),
            ];
        }

        $urls = $request->get_param( 'urls' );

        if ( empty( $urls ) || ! is_array( $urls ) ) {
            return [
                'success' => false,
                'error'   => __( 'URLs array is required.', 'wedevs-project-manager' ),
            ];
        }

        $urls    = array_slice( $urls, 0, 10 );
        $results = [];

        foreach ( $urls as $url ) {
            if ( ! is_string( $url ) || empty( $url ) ) {
                continue;
            }

            $parsed = $this->parse_loom_url( $url );

            if ( ! $parsed ) {
                $results[ $url ] = [
                    'success' => false,
                    'error'   => __( 'Invalid Loom URL.', 'wedevs-project-manager' ),
                ];
                continue;
            }

            $results[ $url ] = $this->fetch_loom_data( $parsed, false );
        }

        return [
            'success' => true,
            'data'    => $results,
        ];
    }

    /**
     * Parse a Loom URL into its components.
     *
     * Supported URL patterns:
     * - https://www.loom.com/share/{video_id}
     * - https://www.loom.com/embed/{video_id}
     * - https://loom.com/share/{video_id}
     *
     * @param string $url
     * @return array|false
     */
    private function parse_loom_url( $url ) {
        $url = esc_url_raw( trim( $url ) );

        // Validate domain
        if ( ! preg_match( '/^https?:\/\/(?:www\.)?loom\.com\//i', $url ) ) {
            return false;
        }

        // Extract video ID from share or embed path (32-char hex)
        if ( ! preg_match( '/^https?:\/\/(?:www\.)?loom\.com\/(share|embed)\/([a-f0-9]{32})(?:[?#\/]|$)/i', $url, $matches ) ) {
            return false;
        }

        $video_id = sanitize_text_field( $matches[2] );
        $type     = sanitize_text_field( $matches[1] );

        if ( empty( $video_id ) ) {
            return false;
        }

        // Normalize URL to share format
        $share_url = sprintf( 'https://www.loom.com/share/%s', rawurlencode( $video_id ) );

        return [
            'video_id'  => $video_id,
            'type'      => $type,
            'url'       => $url,
            'share_url' => $share_url,
        ];
    }

    /**
     * Fetch data from Loom oEmbed API with transient caching.
     *
     * @param array $parsed         Parsed URL components.
     * @param bool  $force_refresh  Whether to bypass cache.
     * @return array
     */
    private function fetch_loom_data( $parsed, $force_refresh = false ) {
        $cache_key = 'pm_loom_preview_' . md5( $parsed['url'] );

        if ( $force_refresh ) {
            delete_transient( $cache_key );
        }

        $cached = get_transient( $cache_key );

        if ( false !== $cached ) {
            return $cached;
        }

        $result = $this->try_oembed( $parsed );

        if ( $result === null ) {
            $result = $this->build_error_result(
                $parsed['video_id'],
                $parsed['url'],
                __( 'Could not fetch video data from Loom.', 'wedevs-project-manager' )
            );

            set_transient( $cache_key, $result, 2 * MINUTE_IN_SECONDS );

            return $result;
        }

        // Cache based on state
        if ( isset( $result['data']['state'] ) && $result['data']['state'] === 'success' ) {
            set_transient( $cache_key, $result, HOUR_IN_SECONDS );
        } elseif ( isset( $result['data']['state'] ) && $result['data']['state'] === 'rate_limited' ) {
            set_transient( $cache_key, $result, 5 * MINUTE_IN_SECONDS );
        } else {
            set_transient( $cache_key, $result, 2 * MINUTE_IN_SECONDS );
        }

        return $result;
    }

    /**
     * Try fetching video data via Loom oEmbed API.
     *
     * @param array $parsed
     * @return array|null
     */
    private function try_oembed( $parsed ) {
        $oembed_url = 'https://www.loom.com/v1/oembed?url=' . urlencode( $parsed['share_url'] );

        $ssl_verify = ! ( defined( 'WP_DEBUG' ) && WP_DEBUG && defined( 'WP_LOCAL_DEV' ) && WP_LOCAL_DEV );

        $response = wp_remote_get( $oembed_url, [
            'timeout'   => 15,
            'headers'   => [
                'User-Agent' => 'WordPress/' . get_bloginfo( 'version' ),
                'Accept'     => 'application/json',
            ],
            'sslverify' => $ssl_verify,
        ] );

        if ( is_wp_error( $response ) ) {
            if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
                error_log( 'Loom oEmbed error for ' . $oembed_url . ': ' . $response->get_error_message() );
            }

            return $this->build_error_result(
                $parsed['video_id'],
                $parsed['url'],
                __( 'Could not connect to Loom.', 'wedevs-project-manager' )
            );
        }

        $status_code = wp_remote_retrieve_response_code( $response );
        $raw_body    = wp_remote_retrieve_body( $response );
        $body        = json_decode( $raw_body, true );

        if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
            error_log( 'Loom oEmbed status: ' . $status_code . ' for ' . $oembed_url );
            error_log( 'Loom oEmbed body length: ' . strlen( $raw_body ) );
        }

        if ( json_last_error() !== JSON_ERROR_NONE ) {
            if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
                error_log( 'Loom oEmbed JSON error: ' . json_last_error_msg() );
            }
            $body = null;
        }

        if ( $status_code === 404 ) {
            return $this->build_error_result(
                $parsed['video_id'],
                $parsed['url'],
                __( 'Video not found or is private.', 'wedevs-project-manager' ),
                'access_denied'
            );
        }

        if ( $status_code === 401 || $status_code === 403 ) {
            return [
                'success' => true,
                'data'    => [
                    'type'     => 'video',
                    'video_id' => $parsed['video_id'],
                    'state'    => 'access_denied',
                    'error'    => __( 'Video is private or access denied.', 'wedevs-project-manager' ),
                    'url'      => $parsed['url'],
                ],
            ];
        }

        if ( $status_code === 429 ) {
            return $this->build_error_result(
                $parsed['video_id'],
                $parsed['url'],
                __( 'Loom API rate limit exceeded. Please try again later.', 'wedevs-project-manager' ),
                'rate_limited'
            );
        }

        if ( $status_code !== 200 || empty( $body ) ) {
            return $this->build_error_result(
                $parsed['video_id'],
                $parsed['url'],
                __( 'Unable to fetch video data from Loom.', 'wedevs-project-manager' )
            );
        }

        // Extract data from oEmbed response
        $title         = isset( $body['title'] ) ? sanitize_text_field( $body['title'] ) : __( 'Untitled Video', 'wedevs-project-manager' );
        $author_name   = isset( $body['author_name'] ) ? sanitize_text_field( $body['author_name'] ) : '';
        $description   = isset( $body['description'] ) ? sanitize_text_field( $body['description'] ) : '';
        $thumbnail_url = isset( $body['thumbnail_url'] ) ? esc_url_raw( $body['thumbnail_url'] ) : '';
        $duration      = isset( $body['duration'] ) ? floatval( $body['duration'] ) : 0;
        $provider_name = isset( $body['provider_name'] ) ? sanitize_text_field( $body['provider_name'] ) : 'Loom';

        // Extract dimensions
        $thumbnail_width  = isset( $body['thumbnail_width'] ) ? intval( $body['thumbnail_width'] ) : 0;
        $thumbnail_height = isset( $body['thumbnail_height'] ) ? intval( $body['thumbnail_height'] ) : 0;
        $width            = isset( $body['width'] ) ? intval( $body['width'] ) : 0;
        $height           = isset( $body['height'] ) ? intval( $body['height'] ) : 0;

        return [
            'success' => true,
            'data'    => [
                'type'             => 'video',
                'video_id'         => sanitize_text_field( $parsed['video_id'] ),
                'title'            => $title,
                'author_name'      => $author_name,
                'description'      => $description,
                'thumbnail_url'    => $thumbnail_url,
                'thumbnail_width'  => $thumbnail_width,
                'thumbnail_height' => $thumbnail_height,
                'width'            => $width,
                'height'           => $height,
                'duration'         => $duration,
                'provider_name'    => $provider_name,
                'url'              => $parsed['url'],
                'embed_url'        => sprintf( 'https://www.loom.com/embed/%s', rawurlencode( $parsed['video_id'] ) ),
                'state'            => 'success',
            ],
        ];
    }

    /**
     * Build a standard error result array.
     *
     * @param string $video_id
     * @param string $url
     * @param string $error
     * @param string $state
     * @return array
     */
    private function build_error_result( $video_id, $url, $error, $state = 'error' ) {
        return [
            'success' => true,
            'data'    => [
                'type'     => 'video',
                'video_id' => $video_id,
                'state'    => $state,
                'error'    => $error,
                'url'      => $url,
            ],
        ];
    }
}
