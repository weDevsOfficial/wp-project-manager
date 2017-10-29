

export default pm.Vue.mixin({
	methods: {
		getOverViews (condition) {
			var condition = condition || ''
				var self = this;

			var request = {
	            url: self.base_url + '/pm/v2/projects/'+self.project_id+'?'+condition,
	            success (res) {
	       			// res.data.map(function(discuss, index) {
			    	// 	self.addDiscussMeta(discuss);
			    	// });
	                self.$store.commit( 'setOverViews', res.data );
	                pm.NProgress.done();
	                self.loading = false;
	            }
	        };
	        self.httpRequest(request);
		},
	}
});