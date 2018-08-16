<template>
    <div>
        <div class="metabox-holder">
            <div id="pm_mails" class="group" style="">
                <form @submit.prevent="saveEmailSettings()" method="post" action="options.php">
            
                    <h2>{{ __( 'E-Mail Settings', 'wedevs-project-manager') }}</h2>
                    <table class="form-table">
                        <tbody>
                            <tr>
                                <th scope="row">
                                    <label for="pm_mails[email_from]">{{ __( 'From Email', 'wedevs-project-manager') }}</label>
                                </th>
                                <td>
                                    <input v-model="from_email" type="text" class="regular-text" id="pm_mails[email_from]" name="pm_mails[email_from]" value="">
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">
                                    <label for="pm_mails[email_url_link]">{{ __( 'Links in the Email', 'wedevs-project-manager') }}</label>
                                </th>
                                <td>
                                    <fieldset>
                                        <label for="wpuf-pm_mails[email_url_link][backend]">
                                            <input v-model="link_to_backend" type="checkbox" class="radio">{{ __( 'Link to Backend', 'wedevs-project-manager') }}
                                        </label>
                                        <br>
                                        <p class="description">{{ __( 'Select where do you want to take the user. Notification emails contain links.', 'wedevs-project-manager') }}
                                        </p>
                                    </fieldset>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">
                                    <label for="pm_mails[email_type]">{{ __( 'E-Mail Type', 'wedevs-project-manager') }}</label>
                                </th>
                                <td>
                                    <select v-model="email_type" class="regular" name="pm_mails[email_type]" id="pm_mails[email_type]">
                                        <option value="text/html">{{ __( 'HTML Mail', 'wedevs-project-manager') }}</option>
                                        <option value="text/plain" selected="selected">{{ __( 'Plain Text', 'wedevs-project-manager') }}</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">
                                    <label for="pm_mails[email_bcc_enable]">{{ __( 'Send email via Bcc', 'wedevs-project-manager') }}</label>
                                </th>
                                <td>
                                    <fieldset>
                                        <label for="wpuf-pm_mails[email_bcc_enable]">
                                            <input v-model="enable_bcc" type="checkbox" class="checkbox">
                                            {{ __( 'Enable Bcc', 'wedevs-project-manager') }}
                                        </label>
                                    </fieldset>
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
    import Mixins from './mixin';
    
    export default {
        data () {
            return {
                from_email: this.getSettings('from_email', PM_Vars.current_user.data.user_email),
                link_to_backend: this.getSettings('link_to_backend', false),
                email_type: this.getSettings('email_type', 'text/html'),
                enable_bcc: this.getSettings('enable_bcc', false),
                show_spinner: false,
                save_change: __( 'Save Changes', 'wedevs-project-manager')
            }
        },
        mixins: [Mixins],
        mounted: function(){
            pm.NProgress.done();
        },
        methods: {
            saveEmailSettings () {
                this.show_spinner = true;
                var self = this;
                var data = {
                    from_email: this.from_email,
                    link_to_backend: this.link_to_backend,
                    email_type: this.email_type,
                    enable_bcc: this.enable_bcc
                };
                

                this.saveSettings(data, '', function(res) {
                    self.show_spinner = false;
                });
            },
        }
    }
</script>

