<?php

namespace WeDevs\PM\Notion\Controllers;

use WP_REST_Request;
use WeDevs\PM\Settings\Models\Settings;

/**
 * Notion Preview Controller
 *
 * Handles fetching Notion page/database preview data via the Notion API.
 * Requires an internal integration token for all requests.
 */
class Notion_Preview_Controller {

    /**
     * Notion API version header value.
     */
    const NOTION_API_VERSION = '2022-06-28';

    /**
     * Get the saved Notion integration token from settings.
     *
     * @return string|false
     */
    private function get_saved_token() {
        $setting = Settings::where( 'key', 'notion_access_token' )
            ->whereNull( 'project_id' )
            ->first();

        if ( $setting && ! empty( $setting->value ) ) {
            return $setting->value;
        }

        return false;
    }

    /**
     * Check if Notion previews are enabled.
     *
     * @return bool
     */
    private function is_previews_enabled() {
        $setting = Settings::where( 'key', 'notion_enable_previews' )
            ->whereNull( 'project_id' )
            ->first();

        if ( $setting ) {
            return ! in_array( $setting->value, [ false, 'false', '0', 0 ], true );
        }

        return true;
    }

    /**
     * Build HTTP headers for Notion API requests.
     *
     * @param string|null $token Optional token override.
     * @return array
     */
    private function get_api_headers( $token = null ) {
        if ( $token === null ) {
            $token = $this->get_saved_token();
        }

        $headers = [
            'Notion-Version' => self::NOTION_API_VERSION,
            'Content-Type'   => 'application/json',
            'User-Agent'     => 'WordPress-PM-Plugin',
        ];

        if ( $token && $token !== false ) {
            $headers['Authorization'] = 'Bearer ' . $token;
        }

        return $headers;
    }

    /**
     * Test Notion connection with the provided or saved token.
     *
     * @param WP_REST_Request $request
     * @return array
     */
    public function test_connection( WP_REST_Request $request ) {
        $token = $request->get_param( 'token' );

        if ( $token === '__saved__' ) {
            $token = $this->get_saved_token();

            if ( ! $token ) {
                return [
                    'success' => false,
                    'error'   => __( 'No token saved. Please enter a Notion Internal Integration Token and save settings first.', 'wedevs-project-manager' ),
                ];
            }
        }

        if ( empty( $token ) ) {
            return [
                'success' => false,
                'error'   => __( 'A Notion integration token is required. Please enter your token.', 'wedevs-project-manager' ),
            ];
        }

        $headers = $this->get_api_headers( $token );

        // Test with /users/me endpoint
        $response = wp_remote_get( 'https://api.notion.com/v1/users/me', [
            'timeout'   => 15,
            'headers'   => $headers,
            'sslverify' => true,
        ] );

        if ( is_wp_error( $response ) ) {
            if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
                error_log( 'Notion API connection error: ' . $response->get_error_message() );
            }

            return [
                'success' => false,
                'error'   => __( 'Could not connect to Notion. Please check your network and try again.', 'wedevs-project-manager' ),
            ];
        }

        $status_code = wp_remote_retrieve_response_code( $response );
        $body        = json_decode( wp_remote_retrieve_body( $response ), true );

        if ( $status_code === 401 ) {
            return [
                'success' => false,
                'error'   => __( 'Invalid token. Please check your Notion Internal Integration Token.', 'wedevs-project-manager' ),
            ];
        }

        if ( $status_code !== 200 || empty( $body ) ) {
            return [
                'success' => false,
                'error'   => sprintf(
                    __( 'Notion API returned status %d.', 'wedevs-project-manager' ),
                    $status_code
                ),
            ];
        }

        $result = [
            'success' => true,
            'data'    => [
                'bot_name' => isset( $body['name'] ) ? sanitize_text_field( $body['name'] ) : '',
                'bot_type' => isset( $body['type'] ) ? sanitize_text_field( $body['type'] ) : 'bot',
            ],
        ];

        if ( isset( $body['bot']['workspace_name'] ) ) {
            $result['data']['workspace'] = sanitize_text_field( $body['bot']['workspace_name'] );
        }

        return $result;
    }

    /**
     * Fetch preview data for a Notion page or database URL.
     *
     * @param WP_REST_Request $request
     * @return array
     */
    public function preview( WP_REST_Request $request ) {
        if ( ! $this->is_previews_enabled() ) {
            return [
                'success' => false,
                'error'   => __( 'Notion previews are disabled.', 'wedevs-project-manager' ),
            ];
        }

        $token = $this->get_saved_token();

        if ( ! $token ) {
            return [
                'success' => false,
                'error'   => __( 'Notion integration token is not configured. Please add it in Settings → Notion.', 'wedevs-project-manager' ),
            ];
        }

        $url = $request->get_param( 'url' );

        if ( ! is_string( $url ) || empty( $url ) ) {
            return [
                'success' => false,
                'error'   => __( 'URL is required.', 'wedevs-project-manager' ),
            ];
        }

        $parsed = $this->parse_notion_url( $url );

        if ( ! $parsed ) {
            return [
                'success' => false,
                'error'   => __( 'Invalid Notion URL.', 'wedevs-project-manager' ),
            ];
        }

        $force_refresh = filter_var( $request->get_param( 'force_refresh' ), FILTER_VALIDATE_BOOLEAN );

        return $this->fetch_notion_data( $parsed, $force_refresh );
    }

    /**
     * Fetch preview data for multiple Notion URLs at once.
     *
     * @param WP_REST_Request $request
     * @return array
     */
    public function batch_preview( WP_REST_Request $request ) {
        if ( ! $this->is_previews_enabled() ) {
            return [
                'success' => false,
                'error'   => __( 'Notion previews are disabled.', 'wedevs-project-manager' ),
            ];
        }

        $token = $this->get_saved_token();

        if ( ! $token ) {
            return [
                'success' => false,
                'error'   => __( 'Notion integration token is not configured.', 'wedevs-project-manager' ),
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
            $parsed = $this->parse_notion_url( $url );

            if ( ! $parsed ) {
                $results[ $url ] = [
                    'success' => false,
                    'error'   => __( 'Invalid Notion URL.', 'wedevs-project-manager' ),
                ];
                continue;
            }

            $results[ $url ] = $this->fetch_notion_data( $parsed, false );
        }

        return [
            'success' => true,
            'data'    => $results,
        ];
    }

    /**
     * Parse a Notion URL into its components.
     *
     * Supported URL patterns:
     * - https://www.notion.so/Page-Title-{32hex}
     * - https://www.notion.so/{workspace}/Page-Title-{32hex}
     * - https://www.notion.so/{workspace}/{32hex}?v={view_id}
     * - https://notion.so/{32hex}
     * - https://www.notion.so/{workspace}/{32hex}
     *
     * @param string $url
     * @return array|false
     */
    private function parse_notion_url( $url ) {
        $url = esc_url_raw( trim( $url ) );

        // Validate domain
        if ( ! preg_match( '#^https?://(?:www\.)?notion\.so/#i', $url ) ) {
            return false;
        }

        // Extract the ID (32 hex chars, possibly with dashes for UUID format)
        // Pattern 1: ID at end of path after title slug: Page-Title-{32hex}
        // Pattern 2: ID as path segment: /{workspace}/{32hex} or /{32hex}
        $id = null;

        // Try to extract 32 hex char ID (no dashes) from end of last path segment
        if ( preg_match( '/([a-f0-9]{32})(?:\?|#|$)/i', $url, $matches ) ) {
            $id = $matches[1];
        }
        // Try UUID format with dashes
        elseif ( preg_match( '/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})(?:\?|#|$)/i', $url, $matches ) ) {
            $id = str_replace( '-', '', $matches[1] );
        }

        if ( ! $id ) {
            return false;
        }

        // Format as UUID for Notion API
        $uuid = sprintf(
            '%s-%s-%s-%s-%s',
            substr( $id, 0, 8 ),
            substr( $id, 8, 4 ),
            substr( $id, 12, 4 ),
            substr( $id, 16, 4 ),
            substr( $id, 20, 12 )
        );

        // Check if URL contains database view indicator
        $is_database = (bool) preg_match( '/[?&]v=[a-f0-9]/i', $url );

        return [
            'id'          => sanitize_text_field( $uuid ),
            'id_raw'      => sanitize_text_field( $id ),
            'is_database' => $is_database,
            'url'         => $url,
        ];
    }

    /**
     * Fetch data from the Notion API with transient caching.
     *
     * Tries page endpoint first; if 404, tries database endpoint.
     *
     * @param array $parsed         Parsed URL components.
     * @param bool  $force_refresh  Whether to bypass cache.
     * @return array
     */
    private function fetch_notion_data( $parsed, $force_refresh = false ) {
        $cache_key = 'pm_notion_preview_' . md5( $parsed['url'] );

        if ( $force_refresh ) {
            delete_transient( $cache_key );
        }

        $cached = get_transient( $cache_key );

        if ( false !== $cached ) {
            return $cached;
        }

        $uuid    = $parsed['id'];
        $headers = $this->get_api_headers();

        // Decide which endpoint to try first
        if ( $parsed['is_database'] ) {
            $result = $this->try_fetch_database( $uuid, $headers, $parsed );

            if ( $result === null ) {
                $result = $this->try_fetch_page( $uuid, $headers, $parsed );
            }
        } else {
            $result = $this->try_fetch_page( $uuid, $headers, $parsed );

            if ( $result === null ) {
                $result = $this->try_fetch_database( $uuid, $headers, $parsed );
            }
        }

        if ( $result === null ) {
            $result = [
                'success' => true,
                'data'    => [
                    'type'  => 'page',
                    'id'    => $uuid,
                    'state' => 'error',
                    'error' => __( 'Could not fetch data from Notion. Make sure the page or database is shared with your integration (In Notion: click ••• → Connections → Add your integration).', 'wedevs-project-manager' ),
                    'url'   => $parsed['url'],
                ],
            ];

            set_transient( $cache_key, $result, 2 * MINUTE_IN_SECONDS );
        }

        return $result;
    }

    /**
     * Try to fetch as a Notion page.
     *
     * @param string $uuid
     * @param array  $headers
     * @param array  $parsed
     * @return array|null  Returns null if 404 (so caller can try database).
     */
    private function try_fetch_page( $uuid, $headers, $parsed ) {
        $cache_key = 'pm_notion_preview_' . md5( $parsed['url'] );

        $api_url  = sprintf( 'https://api.notion.com/v1/pages/%s', $uuid );
        $response = wp_remote_get( $api_url, [
            'timeout'   => 10,
            'headers'   => $headers,
            'sslverify' => true,
        ] );

        if ( is_wp_error( $response ) ) {
            if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
                error_log( 'Notion API error (page): ' . $response->get_error_message() );
            }
            $result = $this->build_error_result( 'page', $uuid, $parsed['url'], __( 'Could not connect to Notion.', 'wedevs-project-manager' ) );
            set_transient( $cache_key, $result, 2 * MINUTE_IN_SECONDS );
            return $result;
        }

        $status_code = wp_remote_retrieve_response_code( $response );
        $body        = json_decode( wp_remote_retrieve_body( $response ), true );

        if ( json_last_error() !== JSON_ERROR_NONE ) {
            $body = null;
        }

        if ( $status_code === 404 ) {
            return null; // Let caller try database endpoint
        }

        if ( $status_code === 401 || $status_code === 403 ) {
            $result = [
                'success' => true,
                'data'    => [
                    'type'  => 'page',
                    'id'    => $uuid,
                    'state' => 'access_denied',
                    'error' => __( 'Page not shared with integration', 'wedevs-project-manager' ),
                    'url'   => $parsed['url'],
                ],
            ];
            set_transient( $cache_key, $result, 2 * MINUTE_IN_SECONDS );
            return $result;
        }

        if ( $status_code === 429 ) {
            $result = $this->build_error_result( 'page', $uuid, $parsed['url'], __( 'Notion API rate limit exceeded. Please try again later.', 'wedevs-project-manager' ), 'rate_limited' );
            set_transient( $cache_key, $result, 5 * MINUTE_IN_SECONDS );
            return $result;
        }

        if ( $status_code !== 200 || empty( $body ) ) {
            $result = $this->build_error_result( 'page', $uuid, $parsed['url'], __( 'Unable to fetch data from Notion.', 'wedevs-project-manager' ) );
            set_transient( $cache_key, $result, 2 * MINUTE_IN_SECONDS );
            return $result;
        }

        // Parse page data
        $title = $this->extract_page_title( $body );
        $icon  = $this->extract_icon( $body );
        $cover = $this->extract_cover( $body );

        $last_edited_by   = null;
        $last_edited_time = isset( $body['last_edited_time'] ) ? sanitize_text_field( $body['last_edited_time'] ) : '';

        if ( isset( $body['last_edited_by']['id'] ) ) {
            $last_edited_by = $this->fetch_user_info( $body['last_edited_by']['id'], $headers );
        }

        $parent_type = 'workspace';
        if ( isset( $body['parent']['type'] ) ) {
            $parent_type = sanitize_text_field( $body['parent']['type'] );
        }

        $result = [
            'success' => true,
            'data'    => [
                'type'             => 'page',
                'id'               => $uuid,
                'title'            => $title,
                'icon'             => $icon,
                'cover'            => $cover,
                'last_edited_by'   => $last_edited_by,
                'last_edited_time' => $last_edited_time,
                'url'              => isset( $body['url'] ) ? esc_url_raw( $body['url'] ) : $parsed['url'],
                'parent_type'      => $parent_type,
            ],
        ];

        set_transient( $cache_key, $result, HOUR_IN_SECONDS );

        return $result;
    }

    /**
     * Try to fetch as a Notion database.
     *
     * @param string $uuid
     * @param array  $headers
     * @param array  $parsed
     * @return array|null  Returns null if 404.
     */
    private function try_fetch_database( $uuid, $headers, $parsed ) {
        $cache_key = 'pm_notion_preview_' . md5( $parsed['url'] );

        $api_url  = sprintf( 'https://api.notion.com/v1/databases/%s', $uuid );
        $response = wp_remote_get( $api_url, [
            'timeout'   => 10,
            'headers'   => $headers,
            'sslverify' => true,
        ] );

        if ( is_wp_error( $response ) ) {
            if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
                error_log( 'Notion API error (database): ' . $response->get_error_message() );
            }
            $result = $this->build_error_result( 'database', $uuid, $parsed['url'], __( 'Could not connect to Notion.', 'wedevs-project-manager' ) );
            set_transient( $cache_key, $result, 2 * MINUTE_IN_SECONDS );
            return $result;
        }

        $status_code = wp_remote_retrieve_response_code( $response );
        $body        = json_decode( wp_remote_retrieve_body( $response ), true );

        if ( json_last_error() !== JSON_ERROR_NONE ) {
            $body = null;
        }

        if ( $status_code === 404 ) {
            return null;
        }

        if ( $status_code === 401 || $status_code === 403 ) {
            $result = [
                'success' => true,
                'data'    => [
                    'type'  => 'database',
                    'id'    => $uuid,
                    'state' => 'access_denied',
                    'error' => __( 'Database not shared with integration', 'wedevs-project-manager' ),
                    'url'   => $parsed['url'],
                ],
            ];
            set_transient( $cache_key, $result, 2 * MINUTE_IN_SECONDS );
            return $result;
        }

        if ( $status_code === 429 ) {
            $result = $this->build_error_result( 'database', $uuid, $parsed['url'], __( 'Notion API rate limit exceeded. Please try again later.', 'wedevs-project-manager' ), 'rate_limited' );
            set_transient( $cache_key, $result, 5 * MINUTE_IN_SECONDS );
            return $result;
        }

        if ( $status_code !== 200 || empty( $body ) ) {
            $result = $this->build_error_result( 'database', $uuid, $parsed['url'], __( 'Unable to fetch data from Notion.', 'wedevs-project-manager' ) );
            set_transient( $cache_key, $result, 2 * MINUTE_IN_SECONDS );
            return $result;
        }

        // Parse database data
        $title = $this->extract_database_title( $body );
        $icon  = $this->extract_icon( $body );
        $cover = $this->extract_cover( $body );

        $last_edited_by   = null;
        $last_edited_time = isset( $body['last_edited_time'] ) ? sanitize_text_field( $body['last_edited_time'] ) : '';

        if ( isset( $body['last_edited_by']['id'] ) ) {
            $last_edited_by = $this->fetch_user_info( $body['last_edited_by']['id'], $headers );
        }

        $parent_type = 'workspace';
        if ( isset( $body['parent']['type'] ) ) {
            $parent_type = sanitize_text_field( $body['parent']['type'] );
        }

        $result = [
            'success' => true,
            'data'    => [
                'type'             => 'database',
                'id'               => $uuid,
                'title'            => $title,
                'icon'             => $icon,
                'cover'            => $cover,
                'last_edited_by'   => $last_edited_by,
                'last_edited_time' => $last_edited_time,
                'url'              => isset( $body['url'] ) ? esc_url_raw( $body['url'] ) : $parsed['url'],
                'parent_type'      => $parent_type,
            ],
        ];

        set_transient( $cache_key, $result, HOUR_IN_SECONDS );

        return $result;
    }

    /**
     * Extract page title from Notion page response.
     *
     * @param array $body
     * @return string
     */
    private function extract_page_title( $body ) {
        if ( ! isset( $body['properties'] ) || ! is_array( $body['properties'] ) ) {
            return __( 'Untitled', 'wedevs-project-manager' );
        }

        foreach ( $body['properties'] as $prop ) {
            if ( isset( $prop['type'] ) && $prop['type'] === 'title' && isset( $prop['title'] ) && is_array( $prop['title'] ) ) {
                $parts = [];
                foreach ( $prop['title'] as $text_obj ) {
                    if ( isset( $text_obj['plain_text'] ) ) {
                        $parts[] = $text_obj['plain_text'];
                    }
                }
                $title = implode( '', $parts );
                if ( ! empty( $title ) ) {
                    return sanitize_text_field( $title );
                }
            }
        }

        return __( 'Untitled', 'wedevs-project-manager' );
    }

    /**
     * Extract database title from Notion database response.
     *
     * @param array $body
     * @return string
     */
    private function extract_database_title( $body ) {
        if ( isset( $body['title'] ) && is_array( $body['title'] ) ) {
            $parts = [];
            foreach ( $body['title'] as $text_obj ) {
                if ( isset( $text_obj['plain_text'] ) ) {
                    $parts[] = $text_obj['plain_text'];
                }
            }
            $title = implode( '', $parts );
            if ( ! empty( $title ) ) {
                return sanitize_text_field( $title );
            }
        }

        return __( 'Untitled Database', 'wedevs-project-manager' );
    }

    /**
     * Extract icon from Notion response (emoji or external URL).
     *
     * @param array $body
     * @return string|null
     */
    private function extract_icon( $body ) {
        if ( ! isset( $body['icon'] ) || ! is_array( $body['icon'] ) ) {
            return null;
        }

        $icon = $body['icon'];

        $type = isset( $icon['type'] ) ? $icon['type'] : '';

        if ( $type === 'emoji' && isset( $icon['emoji'] ) ) {
            return sanitize_text_field( $icon['emoji'] );
        }

        if ( $type === 'external' && isset( $icon['external']['url'] ) ) {
            return esc_url_raw( $icon['external']['url'] );
        }

        if ( $type === 'file' && isset( $icon['file']['url'] ) ) {
            return esc_url_raw( $icon['file']['url'] );
        }

        return null;
    }

    /**
     * Extract cover image URL from Notion response.
     *
     * @param array $body
     * @return string|null
     */
    private function extract_cover( $body ) {
        if ( ! isset( $body['cover'] ) || ! is_array( $body['cover'] ) ) {
            return null;
        }

        $cover = $body['cover'];

        $type = isset( $cover['type'] ) ? $cover['type'] : '';

        if ( $type === 'external' && isset( $cover['external']['url'] ) ) {
            return esc_url_raw( $cover['external']['url'] );
        }

        if ( $type === 'file' && isset( $cover['file']['url'] ) ) {
            return esc_url_raw( $cover['file']['url'] );
        }

        return null;
    }

    /**
     * Fetch user info from Notion API.
     *
     * @param string $user_id
     * @param array  $headers
     * @return array|null
     */
    private function fetch_user_info( $user_id, $headers ) {
        $cache_key = 'pm_notion_user_' . md5( $user_id );
        $cached    = get_transient( $cache_key );

        if ( false !== $cached ) {
            return $cached;
        }

        $api_url  = sprintf( 'https://api.notion.com/v1/users/%s', sanitize_text_field( $user_id ) );
        $response = wp_remote_get( $api_url, [
            'timeout'   => 5,
            'headers'   => $headers,
            'sslverify' => true,
        ] );

        if ( is_wp_error( $response ) ) {
            return null;
        }

        $status_code = wp_remote_retrieve_response_code( $response );
        $body        = json_decode( wp_remote_retrieve_body( $response ), true );

        if ( $status_code !== 200 || empty( $body ) ) {
            return null;
        }

        $user_info = [
            'name'       => isset( $body['name'] ) ? sanitize_text_field( $body['name'] ) : '',
            'avatar_url' => isset( $body['avatar_url'] ) ? esc_url_raw( $body['avatar_url'] ) : '',
        ];

        set_transient( $cache_key, $user_info, DAY_IN_SECONDS );

        return $user_info;
    }

    /**
     * Build a standard error result array.
     *
     * @param string $type
     * @param string $uuid
     * @param string $url
     * @param string $error
     * @param string $state
     * @return array
     */
    private function build_error_result( $type, $uuid, $url, $error, $state = 'error' ) {
        return [
            'success' => true,
            'data'    => [
                'type'  => $type,
                'id'    => $uuid,
                'state' => $state,
                'error' => $error,
                'url'   => $url,
            ],
        ];
    }
}
