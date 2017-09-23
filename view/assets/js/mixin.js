 import Vue from './vue/vue';

 export default Vue.mixin({

 	data () {
 		return {
 			base_url: PM_Vars.base_url +'/'+ PM_Vars.rest_api_prefix,
 			project_id: typeof this.$route === 'undefined'? false : this.$route.params.project_id,
 		}
 	},

	methods: {
		httpRequest (property) {
			var before = function( xhr ) {
			    xhr.setRequestHeader("Authorization_name", btoa('asaquzzaman')); //btoa js encoding base64_encode
			    xhr.setRequestHeader("Authorization_password", btoa(12345678)); //atob js decode base64_decode
			};

			property.beforeSend = typeof property.beforeSend === 'undefined' ? before : property.beforeSend;

			jQuery.ajax(property);
		},

		getProject (project_id) {
			var self = this;
			var project_id = project_id || self.project_id;

			if ( typeof self.project_id === 'undefined' ) {
				return;
			}

            self.httpRequest({
                url: self.base_url + '/cpm/v2/projects/'+ self.project_id,
                success: function(res) {
                    self.$root.$store.commit('setProject', res.data);
                    self.$root.$store.commit('setProjectUsers', res.data.assignees.data);
                }
            });
        }
	}
});

