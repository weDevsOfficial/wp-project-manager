<template>
    <div>
        <div class="metabox-holder">
            <div id="pm_ai_settings" class="group" style="">
                <form @submit.prevent="saveAISettings()" method="post" action="options.php">
                    <h2>{{ __( 'AI Settings', 'wedevs-project-manager') }}</h2>
                    <table class="form-table">
                        <tbody>
                            <tr>
                                <th scope="row">
                                    <label for="ai_provider">{{ __( 'AI Service Provider', 'wedevs-project-manager') }}</label>
                                </th>
                                <td>
                                    <select v-model="provider" class="regular-text" id="ai_provider" name="ai_provider" @change="onProviderChange">
                                        <option value="openai">OpenAI</option>
                                        <option value="gemini">Gemini</option>
                                        <option value="deepseek">Deepseek</option>
                                    </select>
                                    <p class="description">{{ __( 'Select your preferred AI service provider.', 'wedevs-project-manager') }}</p>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">
                                    <label for="ai_api_key">{{ __( 'API Key', 'wedevs-project-manager') }}</label>
                                </th>
                                <td>
                                    <input v-model="api_key" type="text" class="regular-text" id="ai_api_key" name="ai_api_key" :placeholder="api_key_saved ? __('API key is saved', 'wedevs-project-manager') : __('Enter your API key here', 'wedevs-project-manager')">
                                    <p class="description">
                                        {{ __( 'Enter your API key for the selected provider.', 'wedevs-project-manager') }}
                                        <span v-if="api_key_saved" style="color: #46b450; margin-left: 10px;">
                                            ✓ {{ __( 'API key is saved', 'wedevs-project-manager') }}
                                        </span>
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">
                                    <label for="ai_model">{{ __( 'Model Selection', 'wedevs-project-manager') }}</label>
                                </th>
                                <td>
                                    <select v-model="model" class="regular-text" id="ai_model" name="ai_model">
                                        <option v-for="modelOption in availableModels" :key="modelOption.value" :value="modelOption.value">
                                            {{ modelOption.label }}
                                        </option>
                                    </select>
                                    <p class="description">{{ __( 'Select the AI model to use.', 'wedevs-project-manager') }}</p>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">
                                    <label for="ai_max_tokens">{{ __( 'Max Tokens', 'wedevs-project-manager') }}</label>
                                </th>
                                <td>
                                    <input v-model.number="max_tokens" type="number" class="regular-text" id="ai_max_tokens" name="ai_max_tokens" min="1" max="4096">
                                    <p class="description">{{ __( 'Maximum number of tokens for AI responses (1-4096).', 'wedevs-project-manager') }}</p>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">
                                    <label for="ai_temperature">{{ __( 'Temperature', 'wedevs-project-manager') }}</label>
                                </th>
                                <td>
                                    <input v-model.number="temperature" type="range" min="0" max="1" step="0.1" class="regular-text" id="ai_temperature" name="ai_temperature">
                                    <span class="description">{{ temperature }}</span>
                                    <p class="description">{{ __( 'Creativity level (0 to 1): 0.2 for deterministic, 0.8 for creative.', 'wedevs-project-manager') }}</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div>
                        <p class="submit">
                            <button type="button" @click="testConnection()" class="button" :disabled="testing_connection">
                                <span v-if="testing_connection" class="pm-spinner" style="margin-right: 5px;"></span>
                                {{ __( 'Test Connection', 'wedevs-project-manager') }}
                            </button>
                            <input type="submit" name="submit" id="submit" class="button button-primary" :value="save_change" style="margin-left: 10px;">
                            <span v-show="show_spinner" class="pm-spinner"></span>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import Mixins from './mixin';

export default {
    data () {
        return {
            provider: this.getSettings('ai_provider', 'openai'),
            api_key: '', // Don't load from settings, it's encrypted
            api_key_saved: false, // Track if API key exists in database
            saved_api_key_mask: '', // Store masked API key for display
            model: this.getSettings('ai_model', 'gpt-3.5-turbo'),
            max_tokens: this.getSettings('ai_max_tokens', 1000),
            temperature: parseFloat(this.getSettings('ai_temperature', 0.7)),
            show_spinner: false,
            testing_connection: false,
            save_change: __( 'Save Changes', 'wedevs-project-manager'),
            models: {
                openai: [
                    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
                    { value: 'gpt-4', label: 'GPT-4' },
                    { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' }
                ],
                gemini: [
                    { value: 'gemini-pro', label: 'Gemini Pro' },
                    { value: 'gemini-pro-vision', label: 'Gemini Pro Vision' }
                ],
                deepseek: [
                    { value: 'deepseek-chat', label: 'DeepSeek Chat' }
                ]
            }
        }
    },
    computed: {
        availableModels () {
            return this.models[this.provider] || this.models.openai;
        }
    },
    mixins: [Mixins],
    mounted: function(){
        pm.NProgress.done();
        
        // Check if API key exists in database
        this.checkApiKeyExists();
        
        // Set default model if current model is not available for selected provider
        if (!this.availableModels.find(m => m.value === this.model)) {
            this.model = this.availableModels[0].value;
        }
    },
    methods: {
        checkApiKeyExists () {
            var self = this;
            // Pass provider as query parameter so backend knows which API key to return
            var request = {
                url: this.base_url + 'pm/v2/settings/ai?provider=' + encodeURIComponent(self.provider),
                type: 'GET',
                success (res) {
                    if (res.data) {
                        // Look for provider-specific API key: ai_api_key_openai, ai_api_key_gemini, etc.
                        var apiKeyKey = 'ai_api_key_' + self.provider;
                        var apiKeyItem = res.data.find(function(item) {
                            return item.key === apiKeyKey;
                        });
                        if (apiKeyItem) {
                            // Check if value is a masked string (contains asterisks) or truthy
                            if (apiKeyItem.value && (typeof apiKeyItem.value === 'string' || apiKeyItem.value === true)) {
                                self.api_key_saved = true;
                                // Store masked value in input field for display
                                if (typeof apiKeyItem.value === 'string') {
                                    self.api_key = apiKeyItem.value;
                                    self.saved_api_key_mask = apiKeyItem.value;
                                }
                            } else {
                                self.api_key_saved = false;
                                self.api_key = '';
                            }
                        } else {
                            self.api_key_saved = false;
                            self.api_key = '';
                        }
                    } else {
                        self.api_key_saved = false;
                        self.api_key = '';
                    }
                },
                error (res) {
                    self.api_key_saved = false;
                    self.api_key = '';
                }
            };
            this.httpRequest(request);
        },
        onProviderChange () {
            // Update model to first available model for new provider
            this.model = this.availableModels[0].value;
            // Clear current API key display and check for saved key for new provider
            this.api_key = '';
            this.api_key_saved = false;
            this.saved_api_key_mask = '';
            // Check if API key exists for the new provider
            this.checkApiKeyExists();
        },
        testConnection () {
            if (!this.provider || !this.api_key) {
                pm.Toastr.error(__( 'Please provide provider and API key to test connection.', 'wedevs-project-manager'));
                return;
            }

            this.testing_connection = true;
            var self = this;
            var request = {
                url: this.base_url + 'pm/v2/settings/ai/test-connection',
                data: {
                    provider: this.provider,
                    api_key: this.api_key
                },
                type: 'POST',
                success (res) {
                    self.testing_connection = false;
                    if (res.message) {
                        pm.Toastr.success(res.message);
                    } else {
                        pm.Toastr.success(__( 'Connection successful! AI integration is ready.', 'wedevs-project-manager'));
                    }
                },
                error (res) {
                    self.testing_connection = false;
                    var errorMsg = res.message || __( 'Connection failed. Please check your API key and settings.', 'wedevs-project-manager');
                    pm.Toastr.error(errorMsg);
                }
            };

            this.httpRequest(request);
        },
        saveAISettings () {
            this.show_spinner = true;
            var self = this;
            var data = {
                ai_provider: this.provider,
                ai_model: this.model,
                ai_max_tokens: this.max_tokens,
                ai_temperature: this.temperature
            };

            // Add API key only if it's been entered and is NOT the masked version
            // If user hasn't changed the masked value, don't send it (to avoid overwriting with masked value)
            if (this.api_key && this.api_key.trim() !== '' && this.api_key.indexOf('*') === -1) {
                data.ai_api_key = this.api_key;
            }

            data = pm_apply_filters('ai_setting_data', data);
            
            var formattedSettings = this.formatSettings(data);
            
            // Use custom endpoint for AI settings
            var request = {
                url: this.base_url + 'pm/v2/settings/ai',
                data: {
                    settings: formattedSettings
                },
                type: 'POST',
                success (res) {
                    pm.Toastr.success(res.message);
                    if (res.data) {
                        res.data.forEach( function( item ) {
                            // Check if this is a provider-specific API key (ai_api_key_openai, ai_api_key_gemini, etc.)
                            if (item.key && item.key.indexOf('ai_api_key_') === 0) {
                                // Only process if it matches the current provider
                                var expectedKey = 'ai_api_key_' + self.provider;
                                if (item.key === expectedKey) {
                                    // Mark that API key is saved (value is a masked string or truthy)
                                    if (item.value && (typeof item.value === 'string' || item.value === true)) {
                                        self.api_key_saved = true;
                                        // Store masked value in input field for display
                                        if (typeof item.value === 'string') {
                                            self.api_key = item.value;
                                            self.saved_api_key_mask = item.value;
                                        }
                                    }
                                }
                            } else {
                                // Regular setting, save to PM_Vars
                                PM_Vars.settings[item.key] = item.value;
                            }
                        } );
                    }
                    self.show_spinner = false;
                },
                error (res) {
                    self.show_spinner = false;
                    var errorMsg = res.message || __( 'Failed to save settings.', 'wedevs-project-manager');
                    pm.Toastr.error(errorMsg);
                }
            };

            this.httpRequest(request);
        }
    }
}
</script>

