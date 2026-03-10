<template>
    <div>
        <div class="metabox-holder">
            <div id="pm_github_settings" class="group" style="">
                <form @submit.prevent="saveGitHubSettings()" method="post">
                    <h2>{{ __( 'GitHub Integration', 'wedevs-project-manager') }}</h2>
                    <p class="description" style="margin-bottom: 15px;">
                        {{ __( 'Connect your GitHub account to show preview cards for issue and pull request URLs in task descriptions and comments.', 'wedevs-project-manager') }}
                    </p>

                    <table class="form-table">
                        <tbody>
                            <tr>
                                <th scope="row">
                                    <label for="github_access_token">{{ __( 'Personal Access Token', 'wedevs-project-manager') }}</label>
                                </th>
                                <td>
                                    <div style="display: flex; align-items: center; gap: 8px;">
                                        <input
                                            v-if="!editing_token && masked_token"
                                            :value="show_token ? masked_token : '••••••••••••••••••••••••••••••'"
                                            type="text"
                                            class="regular-text"
                                            id="github_access_token"
                                            readonly
                                            style="background: #f7f7f7; color: #666;"
                                        >
                                        <input
                                            v-else
                                            v-model="access_token"
                                            type="text"
                                            class="regular-text"
                                            id="github_access_token"
                                            :placeholder="__('ghp_xxxxxxxxxxxxxxxxxxxx', 'wedevs-project-manager')"
                                        >
                                        <button v-if="!editing_token && masked_token" type="button" class="button" @click="show_token = !show_token" style="min-width: 70px;">
                                            {{ show_token ? __('Hide', 'wedevs-project-manager') : __('Show', 'wedevs-project-manager') }}
                                        </button>
                                        <button v-if="!editing_token && masked_token" type="button" class="button" @click="editing_token = true">
                                            {{ __('Change', 'wedevs-project-manager') }}
                                        </button>
                                        <button v-if="editing_token && masked_token" type="button" class="button" @click="editing_token = false; access_token = ''">
                                            {{ __('Cancel', 'wedevs-project-manager') }}
                                        </button>
                                    </div>
                                    <p class="description">
                                        {{ __( 'A GitHub Personal Access Token allows access to private repos and increases the API rate limit from 60 to 5,000 requests/hour.', 'wedevs-project-manager') }}
                                        <span v-if="token_saved" style="color: #46b450; margin-left: 10px;">
                                            ✓ {{ __( 'Token is saved', 'wedevs-project-manager') }}
                                        </span>
                                    </p>
                                    <p class="description" style="margin-top: 5px;">
                                        <a href="https://github.com/settings/tokens/new?scopes=repo&description=WP%20Project%20Manager" target="_blank">
                                            {{ __( '→ Generate a new token on GitHub', 'wedevs-project-manager') }}
                                        </a>
                                        <span style="margin-left: 5px; color: #666;">
                                            ({{ __( 'Select "repo" scope for private repository access', 'wedevs-project-manager') }})
                                        </span>
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">
                                    <label>{{ __( 'Enable Previews', 'wedevs-project-manager') }}</label>
                                </th>
                                <td>
                                    <fieldset>
                                        <label>
                                            <input type="checkbox" v-model="enable_previews" class="checkbox">
                                            {{ __( 'Show GitHub issue/PR preview cards in task descriptions and comments', 'wedevs-project-manager') }}
                                        </label>
                                    </fieldset>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">
                                    <label>{{ __( 'Connection Status', 'wedevs-project-manager') }}</label>
                                </th>
                                <td>
                                    <div v-if="connection_status === 'untested'" class="pm-github-status pm-github-status-untested">
                                        <span class="dashicons dashicons-minus" style="color: #999;"></span>
                                        <span>{{ __( 'Not tested yet', 'wedevs-project-manager') }}</span>
                                    </div>
                                    <div v-if="connection_status === 'testing'" class="pm-github-status">
                                        <span class="pm-spinner" style="float: none; margin: 0 5px 0 0;"></span>
                                        <span>{{ __( 'Testing connection...', 'wedevs-project-manager') }}</span>
                                    </div>
                                    <div v-if="connection_status === 'connected'" class="pm-github-status pm-github-status-connected">
                                        <span class="dashicons dashicons-yes-alt" style="color: #46b450;"></span>
                                        <span style="color: #46b450; font-weight: bold;">{{ __( 'Connected', 'wedevs-project-manager') }}</span>
                                        <span v-if="github_user" style="margin-left: 5px;">
                                            {{ __( 'as', 'wedevs-project-manager') }}
                                            <strong>{{ github_user }}</strong>
                                            <span v-if="rate_limit_info" style="color: #666; margin-left: 5px;">
                                                ({{ rate_limit_info }})
                                            </span>
                                        </span>
                                    </div>
                                    <div v-if="connection_status === 'failed'" class="pm-github-status pm-github-status-failed">
                                        <span class="dashicons dashicons-dismiss" style="color: #dc3232;"></span>
                                        <span style="color: #dc3232;">{{ connection_error }}</span>
                                    </div>
                                    <div style="margin-top: 8px;">
                                        <button 
                                            type="button" 
                                            class="button" 
                                            @click="testConnection()" 
                                            :disabled="connection_status === 'testing'"
                                        >
                                            {{ __( 'Test Connection', 'wedevs-project-manager') }}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div style="padding-left: 10px">
                        <p class="submit">
                            <input type="submit" name="submit" id="submit" class="button button-primary" :value="save_changes">
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
            access_token: '',
            masked_token: '',
            editing_token: false,
            show_token: false,
            token_saved: false,
            enable_previews: this.getSettings('github_enable_previews', true),
            connection_status: 'untested',
            connection_error: '',
            github_user: '',
            rate_limit_info: '',
            show_spinner: false,
            save_changes: __( 'Save Changes', 'wedevs-project-manager')
        }
    },
    mixins: [Mixins],
    mounted: function(){
        pm.NProgress.done();
        this.loadGitHubSettings();
    },
    methods: {
        loadGitHubSettings () {
            var self = this;

            // Load token saved status
            var tokenRequest = {
                url: this.base_url + 'pm/v2/settings?key=github_access_token',
                type: 'GET',
                success (res) {
                    if (res && res.data) {
                        var data = Array.isArray(res.data) ? res.data : [res.data];
                        data.forEach(function(item) {
                            if (item.key === 'github_access_token' && item.value) {
                                self.token_saved = true;
                                if (typeof item.value === 'string' && item.value.length > 1) {
                                    self.masked_token = item.value;
                                }
                            }
                        });
                    }
                }
            };
            self.httpRequest(tokenRequest);

            // Load enable_previews setting from server
            var previewsRequest = {
                url: this.base_url + 'pm/v2/settings?key=github_enable_previews',
                type: 'GET',
                success (res) {
                    if (res && res.data) {
                        var data = Array.isArray(res.data) ? res.data : [res.data];
                        data.forEach(function(item) {
                            if (item.key === 'github_enable_previews') {
                                self.enable_previews = !(item.value === false || item.value === 'false' || item.value === '0');
                            }
                        });
                    }
                }
            };
            self.httpRequest(previewsRequest);
        },

        saveGitHubSettings () {
            this.show_spinner = true;
            var self = this;
            var data = {
                github_enable_previews: this.enable_previews
            };

            // Only include token if user entered a new one
            if (this.access_token && this.access_token.trim() !== '') {
                data.github_access_token = this.access_token.trim();
            }

            this.saveSettings(data, false, function(res) {
                res.forEach( function( item ) {
                    PM_Vars.settings[item.key] = item.value;
                    if (item.key === 'github_access_token' && item.value) {
                        self.token_saved = true;
                        if (typeof item.value === 'string' && item.value.length > 1) {
                            self.masked_token = item.value;
                        }
                    }
                });

                if (self.access_token && self.access_token.trim() !== '') {
                    self.access_token = '';
                    self.editing_token = false;
                }
                self.show_spinner = false;
            });
        },

        testConnection () {
            var self = this;
            self.connection_status = 'testing';
            self.connection_error = '';
            self.github_user = '';
            self.rate_limit_info = '';

            // Use any token entered in the field, or fall back to saved token
            var tokenToTest = (self.access_token && self.access_token.trim() !== '') 
                ? self.access_token.trim() 
                : '__saved__';

            var request = {
                url: self.base_url + 'pm/v2/github/test-connection',
                type: 'POST',
                data: {
                    token: tokenToTest
                },
                success (res) {
                    if (res.success) {
                        self.connection_status = 'connected';
                        self.github_user = res.data.login || '';
                        if (res.data.rate_limit) {
                            self.rate_limit_info = res.data.rate_limit.remaining + '/' + res.data.rate_limit.limit + ' ' + __('requests remaining', 'wedevs-project-manager');
                        }
                    } else {
                        self.connection_status = 'failed';
                        self.connection_error = res.error || __('Connection failed', 'wedevs-project-manager');
                    }
                },
                error (res) {
                    self.connection_status = 'failed';
                    self.connection_error = __('Could not connect to GitHub. Please check your token.', 'wedevs-project-manager');
                }
            };
            self.httpRequest(request);
        }
    }
}
</script>

<style scoped>
.pm-github-status {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 5px 0;
}
</style>
