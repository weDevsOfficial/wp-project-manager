<?php

namespace WeDevs\PM\Settings\AI;

use WeDevs\PM\Settings\Models\Settings;
use WeDevs\PM\Settings\Controllers\AI_Settings_Controller;

/**
 * AI Configuration - Single Source of Truth
 *
 * Centralized configuration for all AI providers and models.
 * This class provides consistent data across the entire plugin.
 *
 * @since WP_PM_SINCE
 */
class Config {

    /**
     * Get all provider configurations
     *
     * @return array Provider configurations
     */
    public static function get_providers() {
        return [
            'openai' => [
                'name' => 'OpenAI',
                'endpoint' => 'https://api.openai.com/v1/chat/completions',
                'requires_key' => true,
                'api_key_field' => 'openai_api_key',
                'api_key_url' => 'https://platform.openai.com/api-keys'
            ],
            'anthropic' => [
                'name' => 'Anthropic',
                'endpoint' => 'https://api.anthropic.com/v1/messages',
                'requires_key' => true,
                'api_key_field' => 'anthropic_api_key',
                'api_key_url' => 'https://console.anthropic.com/settings/keys'
            ],
            'google' => [
                'name' => 'Google',
                'endpoint' => 'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent',
                'requires_key' => true,
                'api_key_field' => 'google_api_key',
                'api_key_url' => 'https://aistudio.google.com/app/apikey'
            ]
        ];
    }

    /**
     * Get all model configurations - fully dynamic from cache
     *
     * @return array Model configurations
     */
    public static function get_models() {
        // Get cached models from WordPress transient
        $cached_models = get_transient('pm_ai_models_cache');

        // Extract models if they exist
        if (is_array($cached_models) && isset($cached_models['models']) && !empty($cached_models['models'])) {
            $models = $cached_models['models'];
            // Ensure Anthropic models are always included (they're static, no API key needed)
            // Merge will overwrite any existing Anthropic models with the latest static list
            $anthropic_models = self::fetch_anthropic_models();
            $models = array_merge($models, $anthropic_models);
            return $models;
        }

        // If no cache, return default models (includes Anthropic)
        return self::get_default_models();
    }

    /**
     * Get default models (shown when no API keys configured)
     *
     * @return array Default model configurations
     */
    private static function get_default_models() {
        return [
            // OpenAI defaults
            'gpt-4o' => [
                'name' => 'GPT-4o (OpenAI)',
                'provider' => 'openai',
                'token_param' => 'max_tokens',
                'token_location' => 'body',
                'supports_json_mode' => true,
                'supports_custom_temperature' => true
            ],
            'gpt-4o-mini' => [
                'name' => 'GPT-4o Mini (OpenAI)',
                'provider' => 'openai',
                'token_param' => 'max_tokens',
                'token_location' => 'body',
                'supports_json_mode' => true,
                'supports_custom_temperature' => true
            ],
            'gpt-4-turbo' => [
                'name' => 'GPT-4 Turbo (OpenAI)',
                'provider' => 'openai',
                'token_param' => 'max_tokens',
                'token_location' => 'body',
                'supports_json_mode' => true,
                'supports_custom_temperature' => true
            ],
            // Anthropic defaults (latest models)
            'claude-sonnet-4-5-20250929' => [
                'name' => 'Claude Sonnet 4.5 - Latest (Anthropic)',
                'provider' => 'anthropic',
                'token_param' => 'max_tokens',
                'token_location' => 'body',
                'supports_json_mode' => true,
                'supports_custom_temperature' => true
            ],
            'claude-haiku-4-5-20251001' => [
                'name' => 'Claude Haiku 4.5 - Latest (Anthropic)',
                'provider' => 'anthropic',
                'token_param' => 'max_tokens',
                'token_location' => 'body',
                'supports_json_mode' => true,
                'supports_custom_temperature' => true
            ],
            // Google defaults - removed hardcoded models since they may not exist
            // Models will be fetched dynamically from API when API key is configured
            // Keeping minimal defaults for when no API key is set
            'gemini-pro' => [
                'name' => 'Gemini Pro (Google)',
                'provider' => 'google',
                'token_param' => 'maxOutputTokens',
                'token_location' => 'generationConfig',
                'supports_json_mode' => true,
                'supports_custom_temperature' => true
            ]
        ];
    }

    /**
     * Get models for a specific provider
     *
     * @param string $provider Provider ID
     * @return array Models for the provider
     */
    public static function get_models_by_provider($provider) {
        $all_models = self::get_models();
        $provider_models = [];

        foreach ($all_models as $model_id => $model_config) {
            // Validate model config is an array with required keys
            if (!is_array($model_config) || !isset($model_config['provider'])) {
                continue;
            }

            if ($model_config['provider'] === $provider) {
                $provider_models[$model_id] = $model_config;
            }
        }

        return $provider_models;
    }

    /**
     * Get model configuration
     *
     * @param string $model_id Model ID
     * @return array|null Model configuration or null if not found
     */
    public static function get_model_config($model_id) {
        // Get all models from cache
        $all_models = self::get_models();

        // Check for exact match
        if (isset($all_models[$model_id])) {
            return $all_models[$model_id];
        }

        // Check for pattern matches (e.g., gpt-5-turbo-preview matches gpt-5-turbo)
        foreach ($all_models as $pattern => $config) {
            if (strpos($model_id, $pattern) === 0) {
                return $config;
            }
        }

        // Fallback to provider defaults
        $provider_defaults = [
            'openai' => [
                'token_param' => 'max_tokens',
                'token_location' => 'body',
                'supports_json_mode' => true,
                'supports_custom_temperature' => true
            ],
            'anthropic' => [
                'token_param' => 'max_tokens',
                'token_location' => 'body',
                'supports_json_mode' => true,
                'supports_custom_temperature' => true
            ],
            'google' => [
                'token_param' => 'maxOutputTokens',
                'token_location' => 'generationConfig',
                'supports_json_mode' => true,
                'supports_custom_temperature' => true
            ]
        ];

        // Try to detect provider from model ID
        if (strpos($model_id, 'gpt-') === 0 || strpos($model_id, 'o1') === 0) {
            return $provider_defaults['openai'];
        } elseif (strpos($model_id, 'claude-') === 0) {
            return $provider_defaults['anthropic'];
        } elseif (strpos($model_id, 'gemini-') === 0) {
            return $provider_defaults['google'];
        }

        return null;
    }

    /**
     * Get provider configuration
     *
     * @param string $provider_id Provider ID
     * @return array|null Provider configuration or null if not found
     */
    public static function get_provider_config($provider_id) {
        $providers = self::get_providers();
        return $providers[$provider_id] ?? null;
    }

    /**
     * Get models formatted for settings dropdown
     *
     * @return array Model options formatted as id => name
     */
    public static function get_model_options() {
        $models = self::get_models();
        $options = [];

        foreach ($models as $model_id => $model_config) {
            // Validate model config is an array with required keys
            if (!is_array($model_config) || !isset($model_config['name'])) {
                continue;
            }
            $options[$model_id] = $model_config['name'];
        }

        return $options;
    }

    /**
     * Get providers formatted for settings options
     *
     * @return array Provider options formatted as id => name
     */
    public static function get_provider_options() {
        $providers = self::get_providers();
        $options = [];

        foreach ($providers as $provider_id => $provider_config) {
            $options[$provider_id] = $provider_config['name'];
        }

        return $options;
    }

    /**
     * Get provider configurations with their models
     * Useful for FormGenerator initialization
     *
     * @return array Provider configurations with models
     */
    public static function get_provider_configs() {
        $providers = self::get_providers();
        $models = self::get_models();
        $configs = [];

        foreach ($providers as $provider_id => $provider_config) {
            $provider_models = [];

            // Get all models for this provider
            foreach ($models as $model_id => $model_config) {
                // Validate model config is an array with required keys
                if (!is_array($model_config) || !isset($model_config['provider'], $model_config['name'])) {
                    continue;
                }

                if ($model_config['provider'] === $provider_id) {
                    $provider_models[$model_id] = $model_config['name'];
                }
            }

            $configs[$provider_id] = [
                'name' => $provider_config['name'],
                'endpoint' => $provider_config['endpoint'],
                'models' => $provider_models,
                'requires_key' => $provider_config['requires_key']
            ];
        }

        return $configs;
    }

    /**
     * Get API key for a provider from database
     *
     * @param string $provider Provider ID
     * @return string Decrypted API key or empty string
     */
    private static function get_api_key($provider) {
        $api_key_key = 'ai_api_key_' . $provider;
        $api_key_setting = Settings::where('key', $api_key_key)->first();

        if ($api_key_setting && !empty($api_key_setting->value)) {
            $decrypted = AI_Settings_Controller::decrypt_api_key_static($api_key_setting->value);
            if (!empty($decrypted)) {
                return $decrypted;
            }
        }

        return '';
    }

    /**
     * Fetch available models from OpenAI API
     *
     * @param string $api_key OpenAI API key
     * @return array|\WP_Error Array of models or WP_Error on failure
     */
    public static function fetch_openai_models($api_key) {
        if (empty($api_key)) {
            return new \WP_Error('missing_api_key', 'API key is required');
        }

        $endpoint = 'https://api.openai.com/v1/models';

        $response = wp_safe_remote_get($endpoint, [
            'timeout' => 15,
            'headers' => [
                'Content-Type' => 'application/json',
                'Authorization' => 'Bearer ' . $api_key
            ]
        ]);

        if (is_wp_error($response)) {
            return $response;
        }

        $status_code = wp_remote_retrieve_response_code($response);
        if ($status_code !== 200) {
            $error_body = wp_remote_retrieve_body($response);
            return new \WP_Error('api_error', "OpenAI API returned HTTP {$status_code}: {$error_body}");
        }

        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            return new \WP_Error('json_error', 'Invalid JSON response from OpenAI API');
        }

        if (!isset($data['data']) || !is_array($data['data'])) {
            return new \WP_Error('invalid_response', 'Invalid response format from OpenAI API');
        }

        $available_models = [];
        $total_models = count($data['data']);

        foreach ($data['data'] as $model) {
            $model_id = $model['id'] ?? '';

            // Only include GPT models
            if (strpos($model_id, 'gpt-') !== 0 && strpos($model_id, 'o1') !== 0) {
                continue;
            }

            // Get model name
            $model_name = ucwords(str_replace(['-', '_'], ' ', $model_id));

            // Determine token parameter based on model type
            $token_param = (strpos($model_id, 'o1') === 0) ? 'max_completion_tokens' : 'max_tokens';
            
            // Models that don't support temperature:
            // - o1 models (reasoning models)
            // - search-api models (search API models)
            // - Any model with "search" in the name
            $supports_temp = (strpos($model_id, 'o1') !== 0) 
                && (strpos($model_id, 'search') === false)
                && (strpos($model_id, 'search-api') === false);

            $available_models[$model_id] = [
                'name' => $model_name . ' (OpenAI)',
                'provider' => 'openai',
                'token_param' => $token_param,
                'token_location' => 'body',
                'supports_json_mode' => true,
                'supports_custom_temperature' => $supports_temp
            ];
        }

        return $available_models;
    }

    /**
     * Fetch available models from Anthropic (static list)
     *
     * @return array Array of models
     */
    public static function fetch_anthropic_models() {
        // Anthropic doesn't have a models list endpoint, so we return known models
        // No API key required since these are static models
        // Models from: https://docs.claude.com/en/docs/about-claude/models/overview
        $available_models = [
            // Latest models (Claude 4.5)
            'claude-sonnet-4-5-20250929' => [
                'name' => 'Claude Sonnet 4.5 - Latest (Anthropic)',
                'provider' => 'anthropic',
                'token_param' => 'max_tokens',
                'token_location' => 'body',
                'supports_json_mode' => true,
                'supports_custom_temperature' => true,
                'max_output_tokens' => 65536,
                'context_window' => 200000
            ],
            'claude-haiku-4-5-20251001' => [
                'name' => 'Claude Haiku 4.5 - Latest (Anthropic)',
                'provider' => 'anthropic',
                'token_param' => 'max_tokens',
                'token_location' => 'body',
                'supports_json_mode' => true,
                'supports_custom_temperature' => true,
                'max_output_tokens' => 65536,
                'context_window' => 200000
            ],
            'claude-opus-4-1-20250805' => [
                'name' => 'Claude Opus 4.1 - Latest (Anthropic)',
                'provider' => 'anthropic',
                'token_param' => 'max_tokens',
                'token_location' => 'body',
                'supports_json_mode' => true,
                'supports_custom_temperature' => true,
                'max_output_tokens' => 32768,
                'context_window' => 200000
            ],
            // Legacy models (still available)
            'claude-sonnet-4-20250514' => [
                'name' => 'Claude Sonnet 4 (Anthropic)',
                'provider' => 'anthropic',
                'token_param' => 'max_tokens',
                'token_location' => 'body',
                'supports_json_mode' => true,
                'supports_custom_temperature' => true,
                'max_output_tokens' => 65536,
                'context_window' => 200000
            ],
            'claude-3-7-sonnet-20250219' => [
                'name' => 'Claude Sonnet 3.7 (Anthropic)',
                'provider' => 'anthropic',
                'token_param' => 'max_tokens',
                'token_location' => 'body',
                'supports_json_mode' => true,
                'supports_custom_temperature' => true,
                'max_output_tokens' => 65536,
                'context_window' => 200000
            ],
            'claude-opus-4-20250514' => [
                'name' => 'Claude Opus 4 (Anthropic)',
                'provider' => 'anthropic',
                'token_param' => 'max_tokens',
                'token_location' => 'body',
                'supports_json_mode' => true,
                'supports_custom_temperature' => true,
                'max_output_tokens' => 32768,
                'context_window' => 200000
            ],
            'claude-3-5-haiku-20241022' => [
                'name' => 'Claude Haiku 3.5 (Anthropic)',
                'provider' => 'anthropic',
                'token_param' => 'max_tokens',
                'token_location' => 'body',
                'supports_json_mode' => true,
                'supports_custom_temperature' => true,
                'max_output_tokens' => 8192,
                'context_window' => 200000
            ],
            'claude-3-haiku-20240307' => [
                'name' => 'Claude Haiku 3 (Anthropic)',
                'provider' => 'anthropic',
                'token_param' => 'max_tokens',
                'token_location' => 'body',
                'supports_json_mode' => true,
                'supports_custom_temperature' => true,
                'max_output_tokens' => 4096,
                'context_window' => 200000
            ]
        ];

        return $available_models;
    }

    /**
     * Fetch available models from Google Gemini API
     *
     * @param string $api_key Google API key
     * @return array|\WP_Error Array of models or WP_Error on failure
     */
    public static function fetch_google_models($api_key) {
        if (empty($api_key)) {
            return new \WP_Error('missing_api_key', 'API key is required');
        }

        // Google API endpoint to list models
        $endpoint = 'https://generativelanguage.googleapis.com/v1beta/models?key=' . $api_key;

        $response = wp_safe_remote_get($endpoint, [
            'timeout' => 15,
            'headers' => [
                'Content-Type' => 'application/json'
            ]
        ]);

        if (is_wp_error($response)) {
            return $response;
        }

        $status_code = wp_remote_retrieve_response_code($response);
        if ($status_code !== 200) {
            $error_body = wp_remote_retrieve_body($response);
            return new \WP_Error('api_error', "Google API returned HTTP {$status_code}: {$error_body}");
        }

        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            return new \WP_Error('json_error', 'Invalid JSON response from Google API: ' . json_last_error_msg());
        }

        if (!isset($data['models']) || !is_array($data['models'])) {
            return new \WP_Error('invalid_response', 'Invalid response format from Google API');
        }

        $available_models = [];

        foreach ($data['models'] as $model) {
            // Extract model ID (remove 'models/' prefix if present)
            $model_name = $model['name'] ?? '';
            $model_id = $model_name;
            if (strpos($model_id, 'models/') === 0) {
                $model_id = substr($model_id, 7);
            }

            $supported_methods = $model['supportedGenerationMethods'] ?? [];

            // Only include Gemini models that support generateContent
            if (strpos($model_id, 'gemini-') !== 0) {
                continue;
            }

            if (!in_array('generateContent', $supported_methods)) {
                continue;
            }

            // Get display name
            $display_name = $model['displayName'] ?? $model_id;

            // Get token limits
            $max_input_tokens = $model['inputTokenLimit'] ?? 8192;
            $max_output_tokens = $model['outputTokenLimit'] ?? 2048;

            // Store both the short ID and full path for reference
            $available_models[$model_id] = [
                'name' => $display_name . ' (Google)',
                'provider' => 'google',
                'model_id' => $model_id, // Short ID: gemini-1.5-flash
                'model_path' => $model_name, // Full path: models/gemini-1.5-flash (if needed)
                'token_param' => 'maxOutputTokens',
                'token_location' => 'generationConfig',
                'supports_json_mode' => true, // Most Gemini models support this
                'supports_custom_temperature' => true,
                'max_input_tokens' => $max_input_tokens,
                'max_output_tokens' => $max_output_tokens,
                'description' => $model['description'] ?? '',
                'supported_methods' => $supported_methods
            ];
        }

        return $available_models;
    }

    /**
     * Update all AI models from all providers
     *
     * @return bool|\WP_Error True on success, WP_Error on failure
     */
    public static function update_all_models() {
        $all_models = [];

        // Get API keys from database
        $openai_key = self::get_api_key('openai');
        $google_key = self::get_api_key('google');

        // Fetch OpenAI models if key exists
        if (!empty($openai_key)) {
            $openai_models = self::fetch_openai_models($openai_key);
            if (!is_wp_error($openai_models) && is_array($openai_models)) {
                $all_models = array_merge($all_models, $openai_models);
            }
        }

        // Always include Anthropic models (static, no API validation required)
        $anthropic_models = self::fetch_anthropic_models();
        if (is_array($anthropic_models)) {
            $all_models = array_merge($all_models, $anthropic_models);
        }

        // Fetch Google models if key exists
        if (!empty($google_key)) {
            $google_models = self::fetch_google_models($google_key);
            if (!is_wp_error($google_models) && is_array($google_models)) {
                $all_models = array_merge($all_models, $google_models);
            }
        }

        // Store cache if we have models
        if (!empty($all_models)) {
            $cache_data = [
                'models' => $all_models,
                'last_updated' => time(),
            ];

            // Use transient for auto-expiring cache (24 hours)
            set_transient('pm_ai_models_cache', $cache_data, DAY_IN_SECONDS);

            return true;
        }

        return new \WP_Error('no_models_fetched', __('Failed to fetch models from any provider.', 'wedevs-project-manager'));
    }

    /**
     * Clear models cache
     *
     * @return void
     */
    public static function clear_models_cache() {
        delete_transient('pm_ai_models_cache');
    }
}

