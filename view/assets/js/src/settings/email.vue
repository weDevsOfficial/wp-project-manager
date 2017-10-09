<template>
	<div>
		<settings-header></settings-header>
		<div class="metabox-holder">
			<div id="cpm_mails" class="group" style="">
				<form @submit.prevent="saveEmailSettings()" method="post" action="options.php">
			
					<h2>E-Mail Settings</h2>
					<table class="form-table">
						<tbody>
							<tr>
								<th scope="row">
									<label for="cpm_mails[email_from]">From Email</label>
								</th>
								<td>
									<input v-model="from_email" type="text" class="regular-text" id="cpm_mails[email_from]" name="cpm_mails[email_from]" value="joy.mishu@gmail.com">
								</td>
							</tr>
							<tr>
								<th scope="row">
									<label for="cpm_mails[email_url_link]">Links in the Email</label>
								</th>
								<td>
									<fieldset>
										<label for="wpuf-cpm_mails[email_url_link][backend]">
											<input v-model="link_to_backend" type="checkbox" class="radio">Link to Backend
										</label>
										<br>
										<p class="description">Select where do you want to take the user. Notification emails contain links.
										</p>
									</fieldset>
								</td>
							</tr>
							<tr>
								<th scope="row">
									<label for="cpm_mails[email_type]">E-Mail Type</label>
								</th>
								<td>
									<select v-model="email_type" class="regular" name="cpm_mails[email_type]" id="cpm_mails[email_type]">
										<option value="text/html">HTML Mail</option>
										<option value="text/plain" selected="selected">Plain Text</option>
									</select>
								</td>
							</tr>
							<tr>
								<th scope="row">
									<label for="cpm_mails[email_bcc_enable]">Send email via Bcc</label>
								</th>
								<td>
									<fieldset>
										<label for="wpuf-cpm_mails[email_bcc_enable]">
											<input v-model="enable_bcc" type="checkbox" class="checkbox">
											Enable Bcc
										</label>
									</fieldset>
								</td>
							</tr>
						</tbody>
					</table>                            
					<div style="padding-left: 10px">
						<p class="submit">
							<input type="submit" name="submit" id="submit" class="button button-primary" value="Save Changes">
						</p>                            
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<script>
	import header from './header.vue';
	export default {

        components: {
            'settings-header': header
        },

        data () {
            return {
                from_email: this.getSettings('from_email', PM_Vars.current_user.data.user_email),
                link_to_backend: this.getSettings('link_to_backend', false),
                email_type: this.getSettings('email_type', 'text/html'),
                enable_bcc: this.getSettings('enable_bcc', false),
            }
        },

        methods: {
            saveEmailSettings () {
                var data = {
                    from_email: this.from_email,
                    link_to_backend: this.link_to_backend,
                    email_type: this.email_type,
                    enable_bcc: this.enable_bcc
                };


                this.saveSettings(data, function(res) {

                });
            },
        }
    }
</script>

