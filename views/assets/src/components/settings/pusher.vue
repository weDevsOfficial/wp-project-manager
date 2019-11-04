<template>
    <div>
        <div class="metabox-holder">
            <div id="pm_mails" class="group" style="">
                <form @submit.prevent="saveEmailSettings()" method="post" action="options.php">

                    <h2>{{ __( 'Pusher Settings', 'wedevs-project-manager') }}</h2>
                    <table class="form-table">
                        <tbody>
                            <tr>
                                <th scope="row">
                                    <label for="pm_mails[email_from]">{{ __( 'App id', 'wedevs-project-manager') }}</label>
                                </th>
                                <td>
                                    <input v-model="appId" type="text" class="regular-text" id="pm_mails[email_from]" name="pm_mails[email_from]" value="">
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">
                                    <label for="pm_mails[email_from]">{{ __( 'App Key', 'wedevs-project-manager') }}</label>
                                </th>
                                <td>
                                    <input v-model="appKey" type="text" class="regular-text" id="pm_mails[email_from]" name="pm_mails[email_from]" value="">
                                </td>
                            </tr>
                             <tr>
                                <th scope="row">
                                    <label for="pm_mails[email_from]">{{ __( 'secret', 'wedevs-project-manager') }}</label>
                                </th>
                                <td>
                                    <input v-model="secret" type="text" class="regular-text" id="pm_mails[email_from]" name="pm_mails[email_from]" value="">
                                </td>
                            </tr>

                            <tr>
                                <th scope="row">
                                    <label for="pm_mails[email_from]">{{ __( 'Cluster', 'wedevs-project-manager') }}</label>
                                </th>
                                <td>
                                    <input v-model="cluster" type="text" class="regular-text" id="pm_mails[email_from]" name="pm_mails[email_from]" value="">
                                </td>
                            </tr>

                        </tbody>
                    </table>
                    <div>
                        <p class="submit">
                            <input type="submit" name="submit" id="submit" class="button button-primary" :value="save_change">
                            <span v-show="show_spinner" class="pm-spinner"></span>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>


    export default {
        data () {
            return {
                appKey: this.getSettings('pusher_app_key', ''),
                secret: this.getSettings('pusher_secret', ''),
                appId: this.getSettings('pusher_app_id', ''),
                cluster: this.getSettings('pusher_cluster', ''),
                show_spinner: false,
                save_change: __( 'Save Changes', 'wedevs-project-manager')
            }
        },

        mounted: function(){
            pm.NProgress.done();
        },
        methods: {
            saveEmailSettings () {
                this.show_spinner = true;
                var self = this;
                var data = {
                    pusher_app_key: this.appKey,
                    pusher_secret: this.secret,
                    pusher_app_id: this.appId,
                    pusher_cluster: this.cluster
                };


                this.saveSettings(data, '', function(res) {
                    self.show_spinner = false;
                });
            },
        }
    }
</script>

