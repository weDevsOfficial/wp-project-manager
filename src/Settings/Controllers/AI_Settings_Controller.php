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

        do_action( 'pm_after_save_settings', $settings );
        
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
        $provider = sanitize_text_field( $request->get_param( 'provider' ) );
        $api_key = sanitize_text_field( $request->get_param( 'api_key' ) );

        // Validate provider against allowed list
        $allowed_providers = [ 'openai', 'gemini', 'deepseek' ];
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
        $allowed_providers = [ 'openai', 'gemini', 'deepseek' ];
        $provider = strtolower( sanitize_text_field( $provider ) );
        
        if ( !in_array( $provider, $allowed_providers, true ) ) {
            return [
                'success' => false,
                'message' => __( 'Invalid provider selected.', 'wedevs-project-manager' )
            ];
        }

        $providers = [
            'openai' => [
                'url' => 'https://api.openai.com/v1/models',
                'header_key' => 'Authorization',
                'header_value' => 'Bearer ' . $api_key
            ],
            'gemini' => [
                'url' => 'https://generativelanguage.googleapis.com/v1/models?key=' . urlencode( $api_key ),
                'header_key' => '',
                'header_value' => ''
            ],
            'deepseek' => [
                'url' => 'https://api.deepseek.com/v1/models',
                'header_key' => 'Authorization',
                'header_value' => 'Bearer ' . $api_key
            ]
        ];

        $config = $providers[ $provider ];
        $url = $config['url'];

        $args = [
            'method' => 'GET',
            'timeout' => 15,
            'sslverify' => true
        ];

        // Add headers only if they're specified (Gemini uses query param instead)
        if ( !empty( $config['header_key'] ) && !empty( $config['header_value'] ) ) {
            $args['headers'] = [
                $config['header_key'] => $config['header_value'],
                'Content-Type' => 'application/json'
            ];
        } else {
            $args['headers'] = [
                'Content-Type' => 'application/json'
            ];
        }

        $response = wp_remote_request( $url, $args );

        if ( is_wp_error( $response ) ) {
            $error_message = $response->get_error_message();
            return [
                'success' => false,
                'message' => sprintf( __( 'Connection failed: %s', 'wedevs-project-manager' ), esc_html( $error_message ) )
            ];
        }

        $response_code = wp_remote_retrieve_response_code( $response );

        if ( $response_code === 200 ) {
            return [
                'success' => true,
                'message' => __( 'Connection successful! AI integration is ready.', 'wedevs-project-manager' )
            ];
        } else {
            $response_body = wp_remote_retrieve_body( $response );
            $error_data = json_decode( $response_body, true );
            
            // Try to extract a meaningful error message
            $error_message = __( 'Connection failed. Please check your API key and settings.', 'wedevs-project-manager' );
            if ( isset( $error_data['error']['message'] ) && is_string( $error_data['error']['message'] ) ) {
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
}

