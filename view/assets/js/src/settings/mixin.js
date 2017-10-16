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

		getSettings (key, pre_define ) {
			var pre_define   = pre_define || false,
				settings  = PM_Vars.settings;

			if ( typeof PM_Vars.settings[key] === 'undefined' ) {
				return pre_define;
			}

			return PM_Vars.settings[key];

		}
	},
});


