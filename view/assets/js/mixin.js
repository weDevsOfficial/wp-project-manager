 var Mixin = {

 	data () {
 		return {
 			prefix: PM_Vars.base_url +'/'+ PM_Vars.rest_api_prefix
 		}
 	},

	created: function() {

	},

	methods: {
		cpm_add_action: function() {
			console.log('mixin is now rendering');
		},

		send: function(property) {
			
			var before = function( xhr ) {
			    xhr.setRequestHeader("Authorization_name", btoa('asaquzzaman')); //btoa js encoding base64_encode
			    xhr.setRequestHeader("Authorization_password", btoa(12345678)); //atob js decode base64_decode
			};

			property.beforeSend = typeof property.beforeSend === 'undefined' ? before : property.beforeSend;

			jQuery.ajax(property);
		}
	}
}

export default Mixin;