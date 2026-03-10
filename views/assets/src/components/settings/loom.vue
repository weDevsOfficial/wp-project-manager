<template>
    <div>
        <div class="metabox-holder">
            <div id="pm_loom_settings" class="group" style="">
                <form @submit.prevent="saveLoomSettings()" method="post">
                    <h2>{{ __( 'Loom Integration', 'wedevs-project-manager') }}</h2>
                    <p class="description" style="margin-bottom: 15px;">
                        {{ __( 'Show preview cards for Loom video URLs in task descriptions and comments. Works with public Loom videos via oEmbed.', 'wedevs-project-manager') }}
                    </p>

                    <table class="form-table">
                        <tbody>
                            <tr>
                                <th scope="row">
                                    <label>{{ __( 'Enable Previews', 'wedevs-project-manager') }}</label>
                                </th>
                                <td>
                                    <fieldset>
                                        <label>
                                            <input type="checkbox" v-model="enable_previews" class="checkbox">
                                            {{ __( 'Show Loom video preview cards in task descriptions and comments', 'wedevs-project-manager') }}
                                        </label>
                                    </fieldset>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">
                                    <label>{{ __( 'Connection Status', 'wedevs-project-manager') }}</label>
                                </th>
                                <td>
                                    <div v-if="connection_status === 'untested'" class="pm-loom-status pm-loom-status-untested">
                                        <span class="dashicons dashicons-minus" style="color: #999;"></span>
                                        <span>{{ __( 'Not tested yet', 'wedevs-project-manager') }}</span>
                                    </div>
                                    <div v-if="connection_status === 'testing'" class="pm-loom-status">
                                        <span class="pm-spinner" style="float: none; margin: 0 5px 0 0;"></span>
                                        <span>{{ __( 'Testing connection...', 'wedevs-project-manager') }}</span>
                                    </div>
                                    <div v-if="connection_status === 'connected'" class="pm-loom-status pm-loom-status-connected">
                                        <span class="dashicons dashicons-yes-alt" style="color: #46b450;"></span>
                                        <span style="color: #46b450; font-weight: bold;">{{ __( 'Connected', 'wedevs-project-manager') }}</span>
                                        <span style="margin-left: 5px; color: #666;">
                                            ({{ __( 'oEmbed — public videos', 'wedevs-project-manager') }})
                                        </span>
                                    </div>
                                    <div v-if="connection_status === 'failed'" class="pm-loom-status pm-loom-status-failed">
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
            enable_previews: this.getSettings('loom_enable_previews', true),
            connection_status: 'untested',
            connection_error: '',
            show_spinner: false,
            save_changes: __( 'Save Changes', 'wedevs-project-manager')
        }
    },
    mixins: [Mixins],
    mounted: function(){
        pm.NProgress.done();
        this.loadLoomSettings();
    },
    methods: {
        loadLoomSettings () {
            var self = this;

            var previewsRequest = {
                url: this.base_url + 'pm/v2/settings?key=loom_enable_previews',
                type: 'GET',
                success (res) {
                    if (res && res.data) {
                        var data = Array.isArray(res.data) ? res.data : [res.data];
                        data.forEach(function(item) {
                            if (item.key === 'loom_enable_previews') {
                                self.enable_previews = !(item.value === false || item.value === 'false' || item.value === '0');
                            }
                        });
                    }
                }
            };
            self.httpRequest(previewsRequest);
        },

        saveLoomSettings () {
            this.show_spinner = true;
            var self = this;
            var data = {
                loom_enable_previews: this.enable_previews
            };

            this.saveSettings(data, false, function(res) {
                res.forEach( function( item ) {
                    PM_Vars.settings[item.key] = item.value;
                });

                self.show_spinner = false;
            });
        },

        testConnection () {
            var self = this;
            self.connection_status = 'testing';
            self.connection_error = '';

            var request = {
                url: self.base_url + 'pm/v2/loom/test-connection',
                type: 'POST',
                data: {},
                success (res) {
                    if (res.success) {
                        self.connection_status = 'connected';
                    } else {
                        self.connection_status = 'failed';
                        self.connection_error = res.error || __('Connection failed', 'wedevs-project-manager');
                    }
                },
                error () {
                    self.connection_status = 'failed';
                    self.connection_error = __('Could not connect to Loom. Please check your network.', 'wedevs-project-manager');
                }
            };
            self.httpRequest(request);
        }
    }
}
</script>

<style scoped>
.pm-loom-status {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 5px 0;
}
</style>
