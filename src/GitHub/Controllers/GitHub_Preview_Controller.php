<?php

namespace WeDevs\PM\GitHub\Controllers;

use WP_REST_Request;
use WeDevs\PM\Settings\Models\Settings;

/**
 * GitHub Preview Controller
 *
 * Handles fetching GitHub issue/PR preview data via the GitHub API.
 * Supports both authenticated (token) and unauthenticated requests.
 */
class GitHub_Preview_Controller {

    /**
     * Get the saved GitHub access token from settings.
     *
     * @return string|false
     */
    private function get_saved_token() {
        $setting = Settings::where( 'key', 'github_access_token' )
            ->whereNull( 'project_id' )
            ->first();

        if ( $setting && ! empty( $setting->value ) ) {
            return $setting->value;
        }

        return false;
    }

    /**
     * Check if GitHub previews are enabled.
     *
     * @return bool
     */
    private function is_previews_enabled() {
        $setting = Settings::where( 'key', 'github_enable_previews' )
            ->whereNull( 'project_id' )
            ->first();

        if ( $setting ) {
            return $setting->value !== false && $setting->value !== 'false' && $setting->value !== '0';
        }

        // Enabled by default
        return true;
    }

    /**
     * Build HTTP headers for GitHub API requests.
     *
     * @param string|false $token Optional token override.
     * @return array
     */
    private function get_api_headers( $token = null ) {
        $headers = [
            'Accept'     => 'application/vnd.github.v3+json',
            'User-Agent' => 'WordPress-PM-Plugin',
        ];

        if ( $token === null ) {
            $token = $this->get_saved_token();
        }

        if ( $token && $token !== false ) {
            $headers['Authorization'] = 'token ' . $token;
        }

        return $headers;
    }

    /**
     * Test GitHub connection with the provided or saved token.
     *
     * @param WP_REST_Request $request
     * @return array
     */
    public function test_connection( WP_REST_Request $request ) {
        $token = $request->get_param( 'token' );

        // If token is '__saved__', use the saved token
        if ( $token === '__saved__' ) {
            $token = $this->get_saved_token();

            if ( ! $token ) {
                return [
                    'success' => false,
                    'error'   => __( 'No token saved. Please enter a GitHub Personal Access Token and save settings first.', 'wedevs-project-manager' ),
                ];
            }
        }

        $headers = $this->get_api_headers( $token ?: false );

        // Test with the /user endpoint (requires token) or /rate_limit (works without)
        if ( $token && ! empty( $token ) ) {
            $api_url = 'https://api.github.com/user';
        } else {
            $api_url = 'https://api.github.com/rate_limit';
        }

        $response = wp_remote_get( $api_url, [
            'timeout'   => 15,
            'headers'   => $headers,
            'sslverify' => true,
        ] );

        if ( is_wp_error( $response ) ) {
            return [
                'success' => false,
                'error'   => $response->get_error_message(),
            ];
        }

        $status_code = wp_remote_retrieve_response_code( $response );
        $body        = json_decode( wp_remote_retrieve_body( $response ), true );

        if ( $status_code === 401 ) {
            return [
                'success' => false,
                'error'   => __( 'Invalid token. Please check your GitHub Personal Access Token.', 'wedevs-project-manager' ),
            ];
        }

        if ( $status_code !== 200 ) {
            return [
                'success' => false,
                'error'   => sprintf(
                    __( 'GitHub API returned status %d.', 'wedevs-project-manager' ),
                    $status_code
                ),
            ];
        }

        // Get rate limit info from headers
        $rate_limit_remaining = wp_remote_retrieve_header( $response, 'x-ratelimit-remaining' );
        $rate_limit_total     = wp_remote_retrieve_header( $response, 'x-ratelimit-limit' );

        $result = [
            'success' => true,
            'data'    => [
                'login'      => isset( $body['login'] ) ? sanitize_text_field( $body['login'] ) : '',
                'rate_limit' => [
                    'remaining' => intval( $rate_limit_remaining ),
                    'limit'     => intval( $rate_limit_total ),
                ],
            ],
        ];

        if ( ! $token || empty( $token ) ) {
            $result['data']['login'] = __( 'Anonymous (no token)', 'wedevs-project-manager' );
        }

        return $result;
    }

    /**
     * Fetch preview data for a GitHub issue or pull request URL.
     *
     * @param WP_REST_Request $request
     * @return array
     */
    public function preview( WP_REST_Request $request ) {
        if ( ! $this->is_previews_enabled() ) {
            return [
                'success' => false,
                'error'   => __( 'GitHub previews are disabled.', 'wedevs-project-manager' ),
            ];
        }

        $url = $request->get_param( 'url' );

        if ( empty( $url ) ) {
            return [
                'success' => false,
                'error'   => __( 'URL is required.', 'wedevs-project-manager' ),
            ];
        }

        $parsed = $this->parse_github_url( $url );

        if ( ! $parsed ) {
            return [
                'success' => false,
                'error'   => __( 'Invalid GitHub issue or pull request URL.', 'wedevs-project-manager' ),
            ];
        }

        return $this->fetch_github_data( $parsed );
    }

    /**
     * Fetch preview data for multiple GitHub URLs at once.
     *
     * @param WP_REST_Request $request
     * @return array
     */
    public function batch_preview( WP_REST_Request $request ) {
        if ( ! $this->is_previews_enabled() ) {
            return [
                'success' => false,
                'error'   => __( 'GitHub previews are disabled.', 'wedevs-project-manager' ),
            ];
        }

        $urls = $request->get_param( 'urls' );

        if ( empty( $urls ) || ! is_array( $urls ) ) {
            return [
                'success' => false,
                'error'   => __( 'URLs array is required.', 'wedevs-project-manager' ),
            ];
        }

        // Limit batch size to 10
        $urls    = array_slice( $urls, 0, 10 );
        $results = [];

        foreach ( $urls as $url ) {
            $parsed = $this->parse_github_url( $url );

            if ( ! $parsed ) {
                $results[ $url ] = [
                    'success' => false,
                    'error'   => __( 'Invalid GitHub URL.', 'wedevs-project-manager' ),
                ];
                continue;
            }

            $results[ $url ] = $this->fetch_github_data( $parsed );
        }

        return [
            'success' => true,
            'data'    => $results,
        ];
    }

    /**
     * Parse a GitHub URL into its components.
     *
     * @param string $url
     * @return array|false
     */
    private function parse_github_url( $url ) {
        $url = esc_url_raw( trim( $url ) );

        $pattern = '#https?://github\.com/([^/]+)/([^/]+)/(issues|pull)/(\d+)#i';

        if ( preg_match( $pattern, $url, $matches ) ) {
            return [
                'owner'  => sanitize_text_field( $matches[1] ),
                'repo'   => sanitize_text_field( $matches[2] ),
                'type'   => $matches[3] === 'pull' ? 'pull_request' : 'issue',
                'number' => intval( $matches[4] ),
                'url'    => $url,
            ];
        }

        return false;
    }

    /**
     * Fetch data from the GitHub API with transient caching.
     *
     * @param array $parsed Parsed URL components.
     * @return array
     */
    private function fetch_github_data( $parsed ) {
        $cache_key = 'pm_github_preview_' . md5( $parsed['url'] );
        $cached    = get_transient( $cache_key );

        if ( false !== $cached ) {
            return $cached;
        }

        $owner  = $parsed['owner'];
        $repo   = $parsed['repo'];
        $number = $parsed['number'];
        $type   = $parsed['type'];

        // Build GitHub API URL
        if ( $type === 'pull_request' ) {
            $api_url = sprintf(
                'https://api.github.com/repos/%s/%s/pulls/%d',
                $owner, $repo, $number
            );
        } else {
            $api_url = sprintf(
                'https://api.github.com/repos/%s/%s/issues/%d',
                $owner, $repo, $number
            );
        }

        $response = wp_remote_get( $api_url, [
            'timeout'   => 10,
            'headers'   => $this->get_api_headers(),
            'sslverify' => true,
        ] );

        if ( is_wp_error( $response ) ) {
            $error_result = [
                'success' => true,
                'data'    => [
                    'type'       => $type,
                    'number'     => $number,
                    'state'      => 'error',
                    'repository' => [
                        'owner'     => $owner,
                        'name'      => $repo,
                        'full_name' => $owner . '/' . $repo,
                    ],
                    'error'    => __( 'Could not connect to GitHub.', 'wedevs-project-manager' ),
                    'html_url' => $parsed['url'],
                ],
            ];

            set_transient( $cache_key, $error_result, 5 * MINUTE_IN_SECONDS );

            return $error_result;
        }

        $status_code = wp_remote_retrieve_response_code( $response );
        $body        = json_decode( wp_remote_retrieve_body( $response ), true );

        // Handle access denied / not found
        if ( $status_code === 403 || $status_code === 404 || $status_code === 401 ) {
            $result = [
                'success' => true,
                'data'    => [
                    'type'       => $type,
                    'number'     => $number,
                    'state'      => 'access_denied',
                    'repository' => [
                        'owner'     => $owner,
                        'name'      => $repo,
                        'full_name' => $owner . '/' . $repo,
                    ],
                    'error'    => __( 'Access denied', 'wedevs-project-manager' ),
                    'html_url' => $parsed['url'],
                ],
            ];

            set_transient( $cache_key, $result, 10 * MINUTE_IN_SECONDS );

            return $result;
        }

        // Handle rate limiting
        if ( $status_code === 429 ) {
            return [
                'success' => true,
                'data'    => [
                    'type'       => $type,
                    'number'     => $number,
                    'state'      => 'rate_limited',
                    'repository' => [
                        'owner'     => $owner,
                        'name'      => $repo,
                        'full_name' => $owner . '/' . $repo,
                    ],
                    'error'    => __( 'GitHub API rate limit exceeded. Please try again later.', 'wedevs-project-manager' ),
                    'html_url' => $parsed['url'],
                ],
            ];
        }

        // Handle unexpected status codes
        if ( $status_code !== 200 || empty( $body ) ) {
            return [
                'success' => true,
                'data'    => [
                    'type'       => $type,
                    'number'     => $number,
                    'state'      => 'error',
                    'repository' => [
                        'owner'     => $owner,
                        'name'      => $repo,
                        'full_name' => $owner . '/' . $repo,
                    ],
                    'error'    => __( 'Unable to fetch data from GitHub.', 'wedevs-project-manager' ),
                    'html_url' => $parsed['url'],
                ],
            ];
        }

        // Determine state for PRs (can be merged)
        $state = isset( $body['state'] ) ? sanitize_text_field( $body['state'] ) : 'unknown';
        if ( $type === 'pull_request' && $state === 'closed' && ! empty( $body['merged'] ) ) {
            $state = 'merged';
        }

        // Build labels array
        $labels = [];
        if ( ! empty( $body['labels'] ) && is_array( $body['labels'] ) ) {
            foreach ( $body['labels'] as $label ) {
                $labels[] = [
                    'name'  => sanitize_text_field( $label['name'] ),
                    'color' => sanitize_hex_color_no_hash( $label['color'] ),
                ];
            }
        }

        // Build assignees array
        $assignees = [];
        if ( ! empty( $body['assignees'] ) && is_array( $body['assignees'] ) ) {
            foreach ( $body['assignees'] as $assignee ) {
                $assignees[] = [
                    'login'      => sanitize_text_field( $assignee['login'] ),
                    'avatar_url' => esc_url_raw( $assignee['avatar_url'] ),
                ];
            }
        }

        $result = [
            'success' => true,
            'data'    => [
                'type'       => $type,
                'number'     => $number,
                'title'      => sanitize_text_field( $body['title'] ),
                'state'      => $state,
                'repository' => [
                    'owner'     => $owner,
                    'name'      => $repo,
                    'full_name' => $owner . '/' . $repo,
                ],
                'author' => [
                    'login'      => isset( $body['user']['login'] ) ? sanitize_text_field( $body['user']['login'] ) : '',
                    'avatar_url' => isset( $body['user']['avatar_url'] ) ? esc_url_raw( $body['user']['avatar_url'] ) : '',
                ],
                'labels'     => $labels,
                'assignees'  => $assignees,
                'created_at' => isset( $body['created_at'] ) ? sanitize_text_field( $body['created_at'] ) : '',
                'html_url'   => esc_url_raw( $body['html_url'] ),
            ],
        ];

        // Cache successful responses for 1 hour
        set_transient( $cache_key, $result, HOUR_IN_SECONDS );

        return $result;
    }
}
