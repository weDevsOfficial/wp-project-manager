<?php

namespace WeDevs\PM\Settings\Controllers;

use WP_REST_Request;
use League\Fractal\Resource\Item as Item;
use League\Fractal\Resource\Collection as Collection;
use WeDevs\PM\Common\Traits\Request_Filter;
use WeDevs\PM\Common\Traits\Transformer_Manager;
use WeDevs\PM\Settings\Models\Settings;
use WeDevs\PM\Settings\Transformers\Settings_Transformer;
use WeDevs\PM\Settings\Helper\Settings as Helper;
use WeDevs\PM\Settings\AI\Config as AI_Config;

class AI_Settings_Controller {

    use Request_Filter, Transformer_Manager;

    const TIMEOUT_DURATION = 300;

    /**
     * Get all available AI providers
     *
     * @return array Provider configurations
     */
    public static function get_providers() {
        return AI_Config::get_providers();
    }

    /**
     * Get all model configurations with their technical parameters
     *
     * @return array Model configurations
     */
    public static function get_models() {
        return AI_Config::get_models();
    }

    /**
     * Get models filtered by provider
     *
     * @param string $provider Provider key (e.g., 'openai', 'anthropic', 'google')
     * @return array Models for the specified provider
     */
    public static function get_models_by_provider( $provider ) {
        return AI_Config::get_models_by_provider( $provider );
    }

    /**
     * Get AI settings
     *
     * @param WP_REST_Request $request
     * @return mixed
     */
    public function index( WP_REST_Request $request ) {
        $ai_settings_keys = [
            'ai_provider',
            'ai_model',
            'ai_max_tokens',
            'ai_temperature'
        ];

        $settings_collection = [];

        foreach ( $ai_settings_keys as $key ) {
            $setting = Settings::where( 'key', $key )->first();
            if ( $setting ) {
                $settings_collection[] = $setting;
            }
        }

        // Get provider from request parameter (for UI provider switching) or from database
        $provider = sanitize_text_field( $request->get_param( 'provider' ) );

        if ( !$provider ) {
            // Fall back to database value
            foreach ( $settings_collection as $setting ) {
                if ( $setting->key === 'ai_provider' ) {
                    $provider = sanitize_text_field( $setting->value );
                    break;
                }
            }
        }

        // If provider is set, load the provider-specific API key
        if ( $provider ) {
            $api_key_key = 'ai_api_key_' . $provider;
            $api_key_setting = Settings::where( 'key', $api_key_key )->first();
            if ( $api_key_setting ) {
                $settings_collection[] = $api_key_setting;
            }
        }

        // Get models
        $models = self::get_models();

        // If we have an API key but no cache, try to fetch models in the background
        if ( $provider && isset( $api_key_setting ) && !empty( $api_key_setting->value ) ) {
            $cached_models = get_transient( 'pm_ai_models_cache' );
            if ( empty( $cached_models ) || !isset( $cached_models['models'] ) || empty( $cached_models['models'] ) ) {
                // Trigger model update in background (non-blocking)
                // Use a transient flag to prevent multiple simultaneous fetches
                $fetch_lock = get_transient( 'pm_ai_models_fetching' );
                if ( !$fetch_lock ) {
                    set_transient( 'pm_ai_models_fetching', true, 60 ); // Lock for 60 seconds
                    // Schedule the fetch (non-blocking)
                    AI_Config::update_all_models();
                    delete_transient( 'pm_ai_models_fetching' );
                }
            }
        }

        // Transformer will mask the API key value for security
        $resource = new Collection( $settings_collection, new Settings_Transformer );

        // Format models for frontend - group by provider
        $formatted_models = [
            'openai' => [],
            'anthropic' => [],
            'google' => []
        ];

        foreach ( $models as $model_id => $model_config ) {
            if ( isset( $model_config['provider'] ) && isset( $model_config['name'] ) ) {
                $provider_key = $model_config['provider'];
                if ( isset( $formatted_models[ $provider_key ] ) ) {
                    $formatted_models[ $provider_key ][] = [
                        'value' => $model_id,
                        'label' => $model_config['name']
                    ];
                }
            }
        }

        // Pass models in extra parameter so they're merged into the response
        return $this->get_response( $resource, [ 'models' => $formatted_models ] );
    }

    /**
     * Save AI settings
     *
     * @param WP_REST_Request $request
     * @return mixed
     */
    public function store( WP_REST_Request $request ) {
        $project_id = intval( $request->get_param( 'project_id' ) );
        $settings_data = $request->get_param( 'settings' );
        $id = intval( $request->get_param( 'id' ) );

        if ( is_array( $settings_data ) ) {
            $settings_collection = [];

            foreach ( $settings_data as $setting_item ) {
                // Handle API key - encrypt if present, delete if blank
                if ( isset( $setting_item['key'] ) && $setting_item['key'] === 'ai_api_key' ) {
                    // Get provider from settings array to create provider-specific key
                    $provider = null;
                    foreach ( $settings_data as $item ) {
                        if ( isset( $item['key'] ) && $item['key'] === 'ai_provider' ) {
                            $provider = sanitize_text_field( $item['value'] );
                            break;
                        }
                    }

                    if ( $provider ) {
                        // Create provider-specific key: ai_api_key_openai, ai_api_key_gemini, etc.
                        $setting_item['key'] = 'ai_api_key_' . $provider;

                        // If value is empty, delete the setting instead of saving
                        if ( empty( $setting_item['value'] ) ) {
                            $api_key_setting = Settings::where( 'key', $setting_item['key'] )->first();
                            if ( $api_key_setting ) {
                                $api_key_setting->delete();
                            }
                            // Skip adding to collection since it's deleted
                            continue;
                        } else {
                            // Encrypt the API key
                            $encrypted = $this->encrypt_api_key( sanitize_text_field( $setting_item['value'] ) );
                            $setting_item['value'] = $encrypted;
                        }
                    } else {
                        // Skip this setting if no provider
                        continue;
                    }
                }

                $saved_setting = Settings_Controller::save_settings( $setting_item, $project_id, $id );
                $settings_collection[] = $saved_setting;
            }

            $resource = new Collection( $settings_collection, new Settings_Transformer );
            ( new Helper )->update_project_permission( $settings_data, $project_id );
            $settings = $settings_collection;
        } else {
            $data = $this->extract_non_empty_values( $request );
            $settings = Settings_Controller::save_settings( $data, $project_id, $id );
            $resource = new Item( $settings, new Settings_Transformer );
            ( new Helper )->update_project_permission( $data, $project_id );
        }

        do_action( 'wedevs_pm_after_save_settings', $settings );

        // Update models cache if API key was saved
        if ( is_array( $settings_data ) ) {
            foreach ( $settings_data as $setting_item ) {
                if ( isset( $setting_item['key'] ) && strpos( $setting_item['key'], 'ai_api_key_' ) === 0 ) {
                    // API key was saved, refresh models cache
                    AI_Config::update_all_models();
                    break;
                }
            }
        }

        $message = [
            'message' => __( 'Settings has been changed successfully.', 'wedevs-project-manager' )
        ];

        return $this->get_response( $resource, $message );
    }

    /**
     * Test AI connection
     *
     * @param WP_REST_Request $request
     * @return mixed
     */
    public function test_connection( WP_REST_Request $request ) {
        $provider = sanitize_text_field( $request->get_param( 'provider' ) );
        $api_key = sanitize_text_field( $request->get_param( 'api_key' ) );

        // Validate provider against allowed list
        $allowed_providers = array_keys( self::get_providers() );
        if ( empty( $provider ) || !in_array( strtolower( $provider ), $allowed_providers, true ) ) {
            return $this->get_response( null, [
                'success' => false,
                'message' => __( 'Provider is required and must be a valid provider.', 'wedevs-project-manager' )
            ] );
        }

        $provider = strtolower( $provider );

        // If API key is not provided or appears to be masked (contains asterisks and matches masked pattern length ~30 chars), try to get it from database
        $is_masked = !empty( $api_key ) && strpos( $api_key, '*' ) !== false && strlen( $api_key ) <= 30;
        if ( empty( $api_key ) || $is_masked ) {
            $api_key_key = 'ai_api_key_' . $provider;
            $api_key_setting = Settings::where( 'key', $api_key_key )->first();

            if ( $api_key_setting && !empty( $api_key_setting->value ) ) {
                $api_key = self::decrypt_api_key_static( $api_key_setting->value );
            }
        }

        if ( empty( $api_key ) ) {
            return $this->get_response( null, [
                'success' => false,
                'message' => __( 'API key is required. Please enter your API key.', 'wedevs-project-manager' )
            ] );
        }

        $result = $this->test_ai_connection( $provider, $api_key );

        return $this->get_response( null, [
            'success' => $result['success'],
            'message' => $result['message']
        ] );
    }

    /**
     * Test connection to AI provider
     *
     * @param string $provider
     * @param string $api_key
     * @return array
     */
    private function test_ai_connection( $provider, $api_key ) {
        // Validate provider (should already be validated, but double-check for security)
        $allowed_providers = array_keys( self::get_providers() );
        $provider = strtolower( sanitize_text_field( $provider ) );

        if ( !in_array( $provider, $allowed_providers, true ) ) {
            return [
                'success' => false,
                'message' => __( 'Invalid provider selected.', 'wedevs-project-manager' )
            ];
        }

        // Get provider config from static method
        $providers_config = self::get_providers();
        $provider_config = $providers_config[ $provider ];

        // Build test configuration based on provider
        if ( $provider === 'anthropic' ) {
            // Anthropic requires POST with a body to test connection
            $url = 'https://api.anthropic.com/v1/messages';
            $args = [
                'method'    => 'POST',
                'timeout'   => self::TIMEOUT_DURATION,
                'sslverify' => true,
                'headers'   => [
                    'x-api-key'         => $api_key,
                    'anthropic-version' => '2023-06-01',
                    'Content-Type'      => 'application/json',
                ],
                'body'      => json_encode(
                    [
                        'model'      => 'claude-sonnet-4-5-20250929',
                        'max_tokens' => 10,
                        'messages'   => [
                            [
                                'role'    => 'user',
                                'content' => 'Hi',
                            ],
                        ],
                    ]
                ),
            ];
        } elseif ( $provider === 'google' ) {
            // Google uses GET with API key in query string
            $url = 'https://generativelanguage.googleapis.com/v1/models?key=' . urlencode( $api_key );
            $args = [
                'method'    => 'GET',
                'timeout'   => self::TIMEOUT_DURATION,
                'sslverify' => true,
                'headers'   => [
                    'Content-Type' => 'application/json',
                ],
            ];
        } else {
            // OpenAI uses GET with Bearer token
            $url  = 'https://api.openai.com/v1/models';
            $args = [
                'method'    => 'GET',
                'timeout'   => self::TIMEOUT_DURATION,
                'sslverify' => true,
                'headers'   => [
                    'Authorization' => 'Bearer ' . $api_key,
                    'Content-Type'  => 'application/json',
                ],
            ];
        }

        $response = wp_remote_request( $url, $args );

        if ( is_wp_error( $response ) ) {
            $error_message = $response->get_error_message();
            return [
                'success' => false,
                // translators: %s: error message
                'message' => sprintf( __( 'Connection failed: %s', 'wedevs-project-manager' ), esc_html( $error_message ) )
            ];
        }

        $response_code = wp_remote_retrieve_response_code( $response );
        $response_body = wp_remote_retrieve_body( $response );

        if ( $response_code === 200 ) {
            // For Anthropic, verify we got a valid response structure
            if ( $provider === 'anthropic' ) {
                $response_data = json_decode( $response_body, true );

                // Anthropic success response should have 'content' or 'id' field
                if ( isset( $response_data['content'] ) || isset( $response_data['id'] ) ) {
                    return [
                        'success' => true,
                        'message' => __( 'Connection successful! AI integration is ready.', 'wedevs-project-manager' )
                    ];
                } else {
                    // Check if there's an error in the response even with 200 status
                    if ( isset( $response_data['error'] ) ) {
                        $error_message = __( 'Connection failed. Please check your API key and settings.', 'wedevs-project-manager' );
                        if ( isset( $response_data['error']['message'] ) && is_string( $response_data['error']['message'] ) ) {
                            $error_message = sanitize_text_field( $response_data['error']['message'] );
                        } elseif ( isset( $response_data['error']['type'] ) ) {
                            $error_message = sanitize_text_field( $response_data['error']['type'] );
                            if ( isset( $response_data['error']['message'] ) ) {
                                $error_message .= ': ' . sanitize_text_field( $response_data['error']['message'] );
                            }
                        }
                        return [
                            'success' => false,
                            'message' => esc_html( $error_message )
                        ];
                    }

                    // Unexpected response format
                    return [
                        'success' => false,
                        'message' => __( 'Connection test completed but received unexpected response format.', 'wedevs-project-manager' )
                    ];
                }
            }

            // For OpenAI and Google, 200 status is sufficient
            return [
                'success' => true,
                'message' => __( 'Connection successful! AI integration is ready.', 'wedevs-project-manager' )
            ];
        } else {
            $error_data = json_decode( $response_body, true );

            // Try to extract a meaningful error message
            $error_message = __( 'Connection failed. Please check your API key and settings.', 'wedevs-project-manager' );

            // Handle Anthropic error format
            if ( $provider === 'anthropic' && isset( $error_data['error'] ) ) {
                if ( isset( $error_data['error']['message'] ) && is_string( $error_data['error']['message'] ) ) {
                    $error_message = sanitize_text_field( $error_data['error']['message'] );
                } elseif ( isset( $error_data['error']['type'] ) ) {
                    $error_message = sanitize_text_field( $error_data['error']['type'] );
                    if ( isset( $error_data['error']['message'] ) ) {
                        $error_message .= ': ' . sanitize_text_field( $error_data['error']['message'] );
                    }
                }
            } elseif ( isset( $error_data['error']['message'] ) && is_string( $error_data['error']['message'] ) ) {
                $error_message = sanitize_text_field( $error_data['error']['message'] );
            } elseif ( isset( $error_data['error'] ) && is_string( $error_data['error'] ) ) {
                $error_message = sanitize_text_field( $error_data['error'] );
            }

            return [
                'success' => false,
                'message' => esc_html( $error_message )
            ];
        }
    }

    /**
     * Encrypt API key
     *
     * @param string $api_key
     * @return string
     */
    private function encrypt_api_key( $api_key ) {
        if ( empty( $api_key ) ) {
            return '';
        }

        $key = wp_salt( 'auth' );
        $method = 'AES-256-CBC';
        $iv_length = openssl_cipher_iv_length( $method );

        if ( $iv_length === false ) {
            return '';
        }

        $iv = openssl_random_pseudo_bytes( $iv_length );
        if ( $iv === false ) {
            return '';
        }

        $encrypted = openssl_encrypt( $api_key, $method, $key, 0, $iv );

        if ( $encrypted === false ) {
            return '';
        }

        $result = base64_encode( $encrypted . '::' . $iv );

        return $result;
    }

    /**
     * Decrypt API key
     *
     * @param string $encrypted_key
     * @return string
     */
    public static function decrypt_api_key_static( $encrypted_key ) {
        if ( empty( $encrypted_key ) ) {
            return '';
        }

        $key = wp_salt( 'auth' );
        $method = 'AES-256-CBC';

        $data = base64_decode( $encrypted_key );
        if ( $data === false ) {
            return '';
        }

        $parts = explode( '::', $data, 2 );
        if ( count( $parts ) !== 2 ) {
            return '';
        }

        list( $encrypted, $iv ) = $parts;

        $decrypted = openssl_decrypt( $encrypted, $method, $key, 0, $iv );

        if ( $decrypted === false ) {
            return '';
        }

        return $decrypted;
    }

    /**
     * Update AI models cache from all providers
     *
     * @param WP_REST_Request $request
     * @return mixed
     */
    public function update_models( WP_REST_Request $request ) {
        $result = AI_Config::update_all_models();

        if ( is_wp_error( $result ) ) {
            return $this->get_response( null, [
                'success' => false,
                'message' => $result->get_error_message()
            ] );
        }

        return $this->get_response( null, [
            'success' => true,
            'message' => __( 'Models cache updated successfully.', 'wedevs-project-manager' )
        ] );
    }

    /**
     * Clear AI models cache
     *
     * @param WP_REST_Request $request
     * @return mixed
     */
    public function clear_models_cache( WP_REST_Request $request ) {
        AI_Config::clear_models_cache();

        return $this->get_response( null, [
            'success' => true,
            'message' => __( 'Models cache cleared successfully.', 'wedevs-project-manager' )
        ] );
    }
}

