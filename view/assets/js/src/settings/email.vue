<template>
	<div class="metabox-holder">
		<div id="cpm_mails" class="group" style="">
			<form method="post" action="options.php">
		
				<h2>E-Mail Settings</h2>
				<table class="form-table">
					<tbody>
						<tr>
							<th scope="row">
								<label for="cpm_mails[email_from]">From Email</label>
							</th>
							<td>
								<input type="text" class="regular-text" id="cpm_mails[email_from]" name="cpm_mails[email_from]" value="joy.mishu@gmail.com">
							</td>
						</tr>
						<tr>
							<th scope="row">
								<label for="cpm_mails[email_url_link]">Links in the Email</label>
							</th>
							<td>
								<fieldset>
									<label for="wpuf-cpm_mails[email_url_link][backend]">
										<input type="radio" class="radio" id="wpuf-cpm_mails[email_url_link][backend]" name="cpm_mails[email_url_link]" value="backend" checked="checked">Link to Backend
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
								<select class="regular" name="cpm_mails[email_type]" id="cpm_mails[email_type]">
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
										<input type="hidden" name="cpm_mails[email_bcc_enable]" value="off">
										<input type="checkbox" class="checkbox" id="wpuf-cpm_mails[email_bcc_enable]" name="cpm_mails[email_bcc_enable]" value="on">Enable Bcc
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
</template>