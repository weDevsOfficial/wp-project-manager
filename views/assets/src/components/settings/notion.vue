<template>
    <div>
        <div class="metabox-holder">
            <div id="pm_notion_settings" class="group" style="">
                <form @submit.prevent="saveNotionSettings()" method="post">
                    <h2>{{ __( 'Notion Integration', 'wedevs-project-manager') }}</h2>
                    <p class="description" style="margin-bottom: 15px;">
                        {{ __( 'Connect your Notion workspace to show preview cards for Notion page and database URLs in task descriptions and comments.', 'wedevs-project-manager') }}
                    </p>

                    <table class="form-table">
                        <tbody>
                            <tr>
                                <th scope="row">
                                    <label for="notion_access_token">{{ __( 'Internal Integration Token', 'wedevs-project-manager') }}</label>
                                </th>
                                <td>
                                    <div style="display: flex; align-items: center; gap: 8px;">
                                        <input
                                            v-if="!editing_token && masked_token"
                                            :value="show_token ? masked_token : '••••••••••••••••••••••••••••••'"
                                            type="text"
                                            class="regular-text"
                                            id="notion_access_token"
                                            readonly
                                            style="background: #f7f7f7; color: #666;"
                                        >
                                        <input
                                            v-else
                                            v-model="access_token"
                                            type="text"
                                            class="regular-text"
                                            id="notion_access_token"
                                            :placeholder="__('secret_xxxxxxxxxxxxxxxxxxxx', 'wedevs-project-manager')"
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
                                        {{ __( 'A Notion Internal Integration Token allows access to pages and databases shared with the integration.', 'wedevs-project-manager') }}
                                        <span v-if="token_saved" style="color: #46b450; margin-left: 10px;">
                                            ✓ {{ __( 'Token is saved', 'wedevs-project-manager') }}
                                        </span>
                                    </p>
                                    <p class="description" style="margin-top: 5px;">
                                        <a href="https://www.notion.so/profile/integrations" target="_blank">
                                            {{ __( '→ Create or manage integrations on Notion', 'wedevs-project-manager') }}
                                        </a>
                                        <span style="margin-left: 5px; color: #666;">
                                            ({{ __( 'Create an internal integration, copy the secret token, then share pages/databases with it', 'wedevs-project-manager') }})
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
                                            {{ __( 'Show Notion page/database preview cards in task descriptions and comments', 'wedevs-project-manager') }}
                                        </label>
                                    </fieldset>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">
                                    <label>{{ __( 'Connection Status', 'wedevs-project-manager') }}</label>
                                </th>
                                <td>
                                    <div v-if="connection_status === 'untested'" class="pm-notion-status pm-notion-status-untested">
                                        <span class="dashicons dashicons-minus" style="color: #999;"></span>
                                        <span>{{ __( 'Not tested yet', 'wedevs-project-manager') }}</span>
                                    </div>
                                    <div v-if="connection_status === 'testing'" class="pm-notion-status">
                                        <span class="pm-spinner" style="float: none; margin: 0 5px 0 0;"></span>
                                        <span>{{ __( 'Testing connection...', 'wedevs-project-manager') }}</span>
                                    </div>
                                    <div v-if="connection_status === 'connected'" class="pm-notion-status pm-notion-status-connected">
                                        <span class="dashicons dashicons-yes-alt" style="color: #46b450;"></span>
                                        <span style="color: #46b450; font-weight: bold;">{{ __( 'Connected', 'wedevs-project-manager') }}</span>
                                        <span v-if="bot_name" style="margin-left: 5px;">
                                            {{ __( 'as', 'wedevs-project-manager') }}
                                            <strong>{{ bot_name }}</strong>
                                            <span v-if="workspace_name" style="color: #666; margin-left: 5px;">
                                                ({{ workspace_name }})
                                            </span>
                                        </span>
                                    </div>
                                    <div v-if="connection_status === 'failed'" class="pm-notion-status pm-notion-status-failed">
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
            enable_previews: this.getSettings('notion_enable_previews', true),
            connection_status: 'untested',
            connection_error: '',
            bot_name: '',
            workspace_name: '',
            show_spinner: false,
            save_changes: __( 'Save Changes', 'wedevs-project-manager')
        }
    },
    mixins: [Mixins],
    mounted: function(){
        pm.NProgress.done();
        this.loadNotionSettings();
    },
    methods: {
        loadNotionSettings () {
            var self = this;

            var tokenRequest = {
                url: this.base_url + 'pm/v2/settings?key=notion_access_token',
                type: 'GET',
                success (res) {
                    if (res && res.data) {
                        var data = Array.isArray(res.data) ? res.data : [res.data];
                        data.forEach(function(item) {
                            if (item.key === 'notion_access_token' && item.value) {
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

            var previewsRequest = {
                url: this.base_url + 'pm/v2/settings?key=notion_enable_previews',
                type: 'GET',
                success (res) {
                    if (res && res.data) {
                        var data = Array.isArray(res.data) ? res.data : [res.data];
                        data.forEach(function(item) {
                            if (item.key === 'notion_enable_previews') {
                                self.enable_previews = !(item.value === false || item.value === 'false' || item.value === '0');
                            }
                        });
                    }
                }
            };
            self.httpRequest(previewsRequest);
        },

        saveNotionSettings () {
            this.show_spinner = true;
            var self = this;
            var data = {
                notion_enable_previews: this.enable_previews
            };

            if (this.access_token && this.access_token.trim() !== '') {
                data.notion_access_token = this.access_token.trim();
            }

            this.saveSettings(data, false, function(res) {
                res.forEach( function( item ) {
                    PM_Vars.settings[item.key] = item.value;
                    if (item.key === 'notion_access_token' && item.value) {
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
            self.bot_name = '';
            self.workspace_name = '';

            var tokenToTest = (self.access_token && self.access_token.trim() !== '')
                ? self.access_token.trim()
                : '__saved__';

            var request = {
                url: self.base_url + 'pm/v2/notion/test-connection',
                type: 'POST',
                data: {
                    token: tokenToTest
                },
                success (res) {
                    if (res.success) {
                        self.connection_status = 'connected';
                        self.bot_name = res.data.bot_name || '';
                        self.workspace_name = res.data.workspace || '';
                    } else {
                        self.connection_status = 'failed';
                        self.connection_error = res.error || __('Connection failed', 'wedevs-project-manager');
                    }
                },
                error (res) {
                    self.connection_status = 'failed';
                    self.connection_error = __('Could not connect to Notion. Please check your token.', 'wedevs-project-manager');
                }
            };
            self.httpRequest(request);
        }
    }
}
</script>

<style scoped>
.pm-notion-status {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 5px 0;
}
</style>
