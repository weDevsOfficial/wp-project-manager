<?php

namespace WeDevs\PM\Settings\Controllers;

use WP_REST_Request;
use League\Fractal\Resource\Item as Item;
use League\Fractal\Resource\Collection as Collection;
use WeDevs\PM\Common\Traits\Request_Filter;
use WeDevs\PM\Common\Traits\Transformer_Manager;
use WeDevs\PM\Settings\Models\Settings;
use WeDevs\PM\Settings\Transformers\Settings_Transformer;

class AI_Settings_Controller {

    use Request_Filter, Transformer_Manager;

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
        $provider = $request->get_param( 'provider' );
        if ( !$provider ) {
            // Fall back to database value
            foreach ( $settings_collection as $setting ) {
                if ( $setting->key === 'ai_provider' ) {
                    $provider = $setting->value;
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

        // Transformer will mask the API key value for security
        $resource = new Collection( $settings_collection, new Settings_Transformer );

        return $this->get_response( $resource );
    }

    /**
     * Save AI settings
     *
     * @param WP_REST_Request $request
     * @return mixed
     */
    public function store( WP_REST_Request $request ) {
        $data = $this->extract_non_empty_values( $request );
        $settings_data = $request->get_param( 'settings' );

        if ( is_array( $settings_data ) ) {
            $settings_collection = [];

            foreach ( $settings_data as $index => $setting_item ) {
                // Encrypt API key if present and convert to provider-specific key
                if ( isset( $setting_item['key'] ) && $setting_item['key'] === 'ai_api_key' && !empty( $setting_item['value'] ) ) {
                    // Get provider from settings array to create provider-specific key
                    $provider = null;
                    foreach ( $settings_data as $item ) {
                        if ( isset( $item['key'] ) && $item['key'] === 'ai_provider' ) {
                            $provider = $item['value'];
                            break;
                        }
                    }
                    
                    if ( $provider ) {
                        // Create provider-specific key: ai_api_key_openai, ai_api_key_gemini, etc.
                        $setting_item['key'] = 'ai_api_key_' . $provider;
                        $encrypted = $this->encrypt_api_key( $setting_item['value'] );
                        $setting_item['value'] = $encrypted;
                    } else {
                        // Skip this setting if no provider
                        continue;
                    }
                }

                $saved_setting = Settings_Controller::save_settings( $setting_item, 0, 0 );
                $settings_collection[] = $saved_setting;
            }

            $resource = new Collection( $settings_collection, new Settings_Transformer );
        } else {
            // Handle single setting
            if ( isset( $data['key'] ) && $data['key'] === 'ai_api_key' && !empty( $data['value'] ) ) {
                // For single setting mode, we need provider context - skip for now
                // API key should be saved via array mode with provider context
            }

            $settings = Settings_Controller::save_settings( $data, 0, 0 );
            $resource = new Item( $settings, new Settings_Transformer );
        }

        $message = [
            'message' => pm_get_text('success_messages.setting_saved')
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
        $provider = $request->get_param( 'provider' );
        $api_key = $request->get_param( 'api_key' );

        if ( empty( $provider ) || empty( $api_key ) ) {
            return $this->get_response( false, [
                'message' => __( 'Provider and API key are required.', 'wedevs-project-manager' )
            ] );
        }

        $result = $this->test_ai_connection( $provider, $api_key );

        if ( $result['success'] ) {
            return $this->get_response( true, [
                'message' => __( 'Connection successful! AI integration is ready.', 'wedevs-project-manager' )
            ] );
        } else {
            return $this->get_response( false, [
                'message' => $result['message']
            ] );
        }
    }

    /**
     * Test connection to AI provider
     *
     * @param string $provider
     * @param string $api_key
     * @return array
     */
    private function test_ai_connection( $provider, $api_key ) {
        $providers = [
            'openai' => [
                'url' => 'https://api.openai.com/v1/models',
                'header_key' => 'Authorization',
                'header_value' => 'Bearer ' . $api_key
            ],
            'gemini' => [
                'url' => 'https://generativelanguage.googleapis.com/v1/models',
                'header_key' => 'x-goog-api-key',
                'header_value' => $api_key
            ],
            'deepseek' => [
                'url' => 'https://api.deepseek.com/v1/models',
                'header_key' => 'Authorization',
                'header_value' => 'Bearer ' . $api_key
            ]
        ];

        if ( !isset( $providers[ strtolower( $provider ) ] ) ) {
            return [
                'success' => false,
                'message' => __( 'Invalid provider selected.', 'wedevs-project-manager' )
            ];
        }

        $config = $providers[ strtolower( $provider ) ];
        $url = $config['url'];

        $args = [
            'method' => 'GET',
            'headers' => [
                $config['header_key'] => $config['header_value'],
                'Content-Type' => 'application/json'
            ],
            'timeout' => 15
        ];

        $response = wp_remote_request( $url, $args );

        if ( is_wp_error( $response ) ) {
            return [
                'success' => false,
                'message' => __( 'Connection failed. Please check your API key and settings.', 'wedevs-project-manager' )
            ];
        }

        $response_code = wp_remote_retrieve_response_code( $response );

        if ( $response_code === 200 ) {
            return [
                'success' => true,
                'message' => __( 'Connection successful! AI integration is ready.', 'wedevs-project-manager' )
            ];
        } else {
            return [
                'success' => false,
                'message' => __( 'Connection failed. Please check your API key and settings.', 'wedevs-project-manager' )
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
    public static function decrypt_api_key( $encrypted_key ) {
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
}

