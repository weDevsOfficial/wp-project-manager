export default {

	created: function() {

	},

	watch: {
		'$route' (val) {
			
			NProgress.start();
			NProgress.set(0.4);
		}
	},
	methods: {
		cpm_add_action: function() {
			console.log('mixin is now rendering');
		}
	}
}