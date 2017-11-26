<template>
    <div>
        <div class="metabox-holder">
            <div id="pm_mails" class="group" style="">
                <form @submit.prevent="saveEmailSettings()" method="post" action="options.php">
            
                    <h2>{{text.email_settings}}</h2>
                    <table class="form-table">
                        <tbody>
                            <tr>
                                <th scope="row">
                                    <label for="pm_mails[email_from]">{{text.from_email}}</label>
                                </th>
                                <td>
                                    <input v-model="from_email" type="text" class="regular-text" id="pm_mails[email_from]" name="pm_mails[email_from]" value="">
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">
                                    <label for="pm_mails[email_url_link]">{{text.links_email}}</label>
                                </th>
                                <td>
                                    <fieldset>
                                        <label for="wpuf-pm_mails[email_url_link][backend]">
                                            <input v-model="link_to_backend" type="checkbox" class="radio">{{text.link_to_backend}}
                                        </label>
                                        <br>
                                        <p class="description">{{text.link_to_backend_des}}
                                        </p>
                                    </fieldset>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">
                                    <label for="pm_mails[email_type]">{{text.emial_type}}</label>
                                </th>
                                <td>
                                    <select v-model="email_type" class="regular" name="pm_mails[email_type]" id="pm_mails[email_type]">
                                        <option value="text/html">{{text.html_mail}}</option>
                                        <option value="text/plain" selected="selected">{{text.plain_text}}</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">
                                    <label for="pm_mails[email_bcc_enable]">{{text.send_email_via_Bcc}}</label>
                                </th>
                                <td>
                                    <fieldset>
                                        <label for="wpuf-pm_mails[email_bcc_enable]">
                                            <input v-model="enable_bcc" type="checkbox" class="checkbox">
                                            {{text.enable_bcc}}
                                        </label>
                                    </fieldset>
                                </td>
                            </tr>
                        </tbody>
                    </table>                            
                    <div style="padding-left: 10px">
                        <p class="submit">
                            <input type="submit" name="submit" id="submit" class="button button-primary" :value="text.save_changes">
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
                from_email: this.getSettings('from_email', PM_Vars.current_user.data.user_email),
                link_to_backend: this.getSettings('link_to_backend', false),
                email_type: this.getSettings('email_type', 'text/html'),
                enable_bcc: this.getSettings('enable_bcc', false),
                show_spinner: false
            }
        },
        mixins: [PmMixin.settings],
        methods: {
            saveEmailSettings () {
                this.show_spinner = true;
                self = this;
                var data = {
                    from_email: this.from_email,
                    link_to_backend: this.link_to_backend,
                    email_type: this.email_type,
                    enable_bcc: this.enable_bcc
                };


                this.saveSettings(data, function(res) {
                    self.show_spinner = false;
                });
            },
        }
    }
</script>

