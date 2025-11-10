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
     * Get all available AI providers
     *
     * @return array Provider configurations
     */
    public static function get_providers() {
        return [
            'openai' => [
                'name'          => 'OpenAI',
                'endpoint'      => 'https://api.openai.com/v1/chat/completions',
                'requires_key'  => true,
                'api_key_field' => 'openai_api_key',
                'api_key_url'   => 'https://platform.openai.com/api-keys',
            ],
            'anthropic' => [
                'name' => 'Anthropic',
                'endpoint' => 'https://api.anthropic.com/v1/messages',
                'requires_key' => true,
                'api_key_field' => 'anthropic_api_key',
                'api_key_url' => 'https://console.anthropic.com/settings/keys',
            ],
            'google' => [
                'name' => 'Google',
                'endpoint' => 'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent',
                'requires_key' => true,
                'api_key_field' => 'google_api_key',
                'api_key_url' => 'https://aistudio.google.com/app/apikey',
            ],
        ];
    }

    /**
     * Get all model configurations with their technical parameters
     *
     * @return array Model configurations
     */
    public static function get_models() {

        return [

            // OpenAI GPT-4.1 Series (Latest - December 2024)

            'gpt-4.1' => [

                'name' => 'GPT-4.1 - Latest Flagship (OpenAI)',

                'provider' => 'openai',

                'token_param' => 'max_tokens',

                'token_location' => 'body',

                'supports_json_mode' => true,

                'supports_custom_temperature' => true

            ],

            'gpt-4.1-mini' => [

                'name' => 'GPT-4.1 Mini - Fast & Smart (OpenAI)',

                'provider' => 'openai',

                'token_param' => 'max_tokens',

                'token_location' => 'body',

                'supports_json_mode' => true,

                'supports_custom_temperature' => true

            ],

            'gpt-4.1-nano' => [

                'name' => 'GPT-4.1 Nano - Fastest & Cheapest (OpenAI)',

                'provider' => 'openai',

                'token_param' => 'max_tokens',

                'token_location' => 'body',

                'supports_json_mode' => true,

                'supports_custom_temperature' => true

            ],

            // OpenAI O1 Series (Reasoning Models)

            'o1' => [

                'name' => 'O1 - Full Reasoning Model (OpenAI)',

                'provider' => 'openai',

                'token_param' => 'max_completion_tokens',

                'token_location' => 'body',

                'temperature' => 1.0,

                'supports_json_mode' => false,

                'supports_custom_temperature' => false

            ],

            'o1-mini' => [

                'name' => 'O1 Mini - Cost-Effective Reasoning (OpenAI)',

                'provider' => 'openai',

                'token_param' => 'max_completion_tokens',

                'token_location' => 'body',

                'temperature' => 1.0,

                'supports_json_mode' => false,

                'supports_custom_temperature' => false

            ],

            'o1-preview' => [

                'name' => 'O1 Preview - Limited Access (OpenAI)',

                'provider' => 'openai',

                'token_param' => 'max_completion_tokens',

                'token_location' => 'body',

                'temperature' => 1.0,

                'supports_json_mode' => false,

                'supports_custom_temperature' => false

            ],

            // OpenAI GPT-4o Series (Multimodal)

            'gpt-4o' => [

                'name' => 'GPT-4o - Multimodal (OpenAI)',

                'provider' => 'openai',

                'token_param' => 'max_tokens',

                'token_location' => 'body',

                'supports_json_mode' => true,

                'supports_custom_temperature' => true

            ],

            'gpt-4o-mini' => [

                'name' => 'GPT-4o Mini - Efficient Multimodal (OpenAI)',

                'provider' => 'openai',

                'token_param' => 'max_tokens',

                'token_location' => 'body',

                'supports_json_mode' => true,

                'supports_custom_temperature' => true

            ],

            'gpt-4o-2024-08-06' => [

                'name' => 'GPT-4o Latest Snapshot (OpenAI)',

                'provider' => 'openai',

                'token_param' => 'max_tokens',

                'token_location' => 'body',

                'supports_json_mode' => true,

                'supports_custom_temperature' => true

            ],

            // OpenAI GPT-4 Turbo & Legacy

            'gpt-4-turbo' => [

                'name' => 'GPT-4 Turbo (OpenAI)',

                'provider' => 'openai',

                'token_param' => 'max_tokens',

                'token_location' => 'body',

                'supports_json_mode' => true,

                'supports_custom_temperature' => true

            ],

            'gpt-4-turbo-2024-04-09' => [

                'name' => 'GPT-4 Turbo Latest (OpenAI)',

                'provider' => 'openai',

                'token_param' => 'max_tokens',

                'token_location' => 'body',

                'supports_json_mode' => true,

                'supports_custom_temperature' => true

            ],

            'gpt-4' => [

                'name' => 'GPT-4 (OpenAI)',

                'provider' => 'openai',

                'token_param' => 'max_tokens',

                'token_location' => 'body',

                'supports_json_mode' => true,

                'supports_custom_temperature' => true

            ],

            'gpt-3.5-turbo' => [

                'name' => 'GPT-3.5 Turbo (OpenAI)',

                'provider' => 'openai',

                'token_param' => 'max_tokens',

                'token_location' => 'body',

                'supports_json_mode' => true,

                'supports_custom_temperature' => true

            ],

            'gpt-3.5-turbo-0125' => [

                'name' => 'GPT-3.5 Turbo Latest (OpenAI)',

                'provider' => 'openai',

                'token_param' => 'max_tokens',

                'token_location' => 'body',

                'supports_json_mode' => true,

                'supports_custom_temperature' => true

            ],

            // Anthropic Claude 4 Series (Latest Generation)

            'claude-4-opus' => [

                'name' => 'Claude 4 Opus - Best Coding Model (Anthropic)',

                'provider' => 'anthropic',

                'token_param' => 'max_tokens',

                'token_location' => 'body',

                'supports_json_mode' => true,

                'supports_custom_temperature' => true

            ],

            'claude-4-sonnet' => [

                'name' => 'Claude 4 Sonnet - Advanced Reasoning (Anthropic)',

                'provider' => 'anthropic',

                'token_param' => 'max_tokens',

                'token_location' => 'body',

                'supports_json_mode' => true,

                'supports_custom_temperature' => true

            ],

            'claude-4.1-opus' => [

                'name' => 'Claude 4.1 Opus - Most Capable (Anthropic)',

                'provider' => 'anthropic',

                'token_param' => 'max_tokens',

                'token_location' => 'body',

                'supports_json_mode' => true,

                'supports_custom_temperature' => true

            ],

            // Anthropic Claude 3.7 Series

            'claude-3.7-sonnet' => [

                'name' => 'Claude 3.7 Sonnet - Hybrid Reasoning (Anthropic)',

                'provider' => 'anthropic',

                'token_param' => 'max_tokens',

                'token_location' => 'body',

                'supports_json_mode' => true,

                'supports_custom_temperature' => true

            ],

            // Anthropic Claude 3.5 Series (Current Available)

            'claude-3-5-sonnet-20241022' => [

                'name' => 'Claude 3.5 Sonnet Latest (Anthropic)',

                'provider' => 'anthropic',

                'token_param' => 'max_tokens',

                'token_location' => 'body',

                'supports_json_mode' => true,

                'supports_custom_temperature' => true

            ],

            'claude-3-5-sonnet-20240620' => [

                'name' => 'Claude 3.5 Sonnet (Anthropic)',

                'provider' => 'anthropic',

                'token_param' => 'max_tokens',

                'token_location' => 'body',

                'supports_json_mode' => true,

                'supports_custom_temperature' => true

            ],

            'claude-3-5-haiku-20241022' => [

                'name' => 'Claude 3.5 Haiku (Anthropic)',

                'provider' => 'anthropic',

                'token_param' => 'max_tokens',

                'token_location' => 'body',

                'supports_json_mode' => true,

                'supports_custom_temperature' => true

            ],

            // Anthropic Claude 3 Legacy

            'claude-3-opus-20240229' => [

                'name' => 'Claude 3 Opus (Anthropic)',

                'provider' => 'anthropic',

                'token_param' => 'max_tokens',

                'token_location' => 'body',

                'supports_json_mode' => true,

                'supports_custom_temperature' => true

            ],

            'claude-3-sonnet-20240229' => [

                'name' => 'Claude 3 Sonnet (Anthropic)',

                'provider' => 'anthropic',

                'token_param' => 'max_tokens',

                'token_location' => 'body',

                'supports_json_mode' => true,

                'supports_custom_temperature' => true

            ],

            'claude-3-haiku-20240307' => [

                'name' => 'Claude 3 Haiku (Anthropic)',

                'provider' => 'anthropic',

                'token_param' => 'max_tokens',

                'token_location' => 'body',

                'supports_json_mode' => true,

                'supports_custom_temperature' => true

            ],

            // Google Gemini (Current Models)

            'gemini-2.0-flash-exp' => [

                'name' => 'Gemini 2.0 Flash Experimental - Latest (Google)',

                'provider' => 'google',

                'token_param' => 'maxOutputTokens',

                'token_location' => 'generationConfig',

                'supports_json_mode' => true,

                'supports_custom_temperature' => true

            ],

            'gemini-1.5-flash' => [

                'name' => 'Gemini 1.5 Flash - Fast & Free (Google)',

                'provider' => 'google',

                'token_param' => 'maxOutputTokens',

                'token_location' => 'generationConfig',

                'supports_json_mode' => true,

                'supports_custom_temperature' => true

            ],

            'gemini-1.5-flash-8b' => [

                'name' => 'Gemini 1.5 Flash 8B - Fast & Free (Google)',

                'provider' => 'google',

                'token_param' => 'maxOutputTokens',

                'token_location' => 'generationConfig',

                'supports_json_mode' => true,

                'supports_custom_temperature' => true

            ],

            'gemini-1.5-pro' => [

                'name' => 'Gemini 1.5 Pro - Most Capable (Google)',

                'provider' => 'google',

                'token_param' => 'maxOutputTokens',

                'token_location' => 'generationConfig',

                'supports_json_mode' => true,

                'supports_custom_temperature' => true

            ],

            'gemini-1.0-pro' => [

                'name' => 'Gemini 1.0 Pro - Stable (Google)',

                'provider' => 'google',

                'token_param' => 'maxOutputTokens',

                'token_location' => 'generationConfig',

                'supports_json_mode' => true,

                'supports_custom_temperature' => true

            ]

        ];

    }

    /**
     * Get models filtered by provider
     *
     * @param string $provider Provider key (e.g., 'openai', 'anthropic', 'google')
     * @return array Models for the specified provider
     */
    public static function get_models_by_provider( $provider ) {
        $all_models = self::get_models();
        $filtered = [];

        foreach ( $all_models as $model_key => $model_config ) {
            if ( isset( $model_config['provider'] ) && $model_config['provider'] === $provider ) {
                $filtered[ $model_key ] = $model_config;
            }
        }

        return $filtered;
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

        // Build test URL based on provider
        $test_urls = [
            'openai' => 'https://api.openai.com/v1/models',
            'anthropic' => 'https://api.anthropic.com/v1/messages',
            'google' => 'https://generativelanguage.googleapis.com/v1/models?key=' . urlencode( $api_key )
        ];

        $providers = [];
        foreach ( $providers_config as $key => $config ) {
            if ( $key === 'google' ) {
                $providers[ $key ] = [
                    'url' => $test_urls[ $key ],
                    'header_key' => '',
                    'header_value' => ''
                ];
            } elseif ( $key === 'anthropic' ) {
                $providers[ $key ] = [
                    'url' => $test_urls[ $key ],
                    'header_key' => 'x-api-key',
                    'header_value' => $api_key
                ];
            } else {
                $providers[ $key ] = [
                    'url' => $test_urls[ $key ],
                    'header_key' => 'Authorization',
                    'header_value' => 'Bearer ' . $api_key
                ];
            }
        }

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

