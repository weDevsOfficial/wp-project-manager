import Vue from './../../vue/vue';

export default Vue.mixin({
	methods: {
		saveSettings (settings, callback) {
			var settings = this.formatSettings(settings),
				self = this;

			var request = {
                url: self.base_url + '/cpm/v2/settings',
                data: {
                	settings: settings
                },
                type: 'POST',
                success (res) {
                	if (typeof callback !== 'undefined') {
						callback();
					}
                }
            };

            self.httpRequest(request);
		},

		formatSettings (settings) {
			var data = [];

			jQuery.each(settings, function(name, value) {
				data.push({
					key: name,
					value: value
				});
			});

			return data;
		},

		getSetting (key, with_obj) {
			var with_obj = with_obj || false;
			var settings = JSON.parse(PM_Vars.settings);

			settings.data.map(function(setting, index) {
				console.log(settings, index);
			});
		}
	},
});


