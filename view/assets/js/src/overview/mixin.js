import Vue from './../../vue/vue';

export default Vue.mixin({
	methods: {
		getOverViews (condition) {
			var condition = condition || '',
				self = this;

			var request = {
	            url: self.base_url + '/cpm/v2/projects/'+self.project_id+'?'+condition,
	            success (res) {
	       			// res.data.map(function(discuss, index) {
			    	// 	self.addDiscussMeta(discuss);
			    	// });
	                self.$store.commit( 'setOverViews', res.data );
	            }
	        };
	        self.httpRequest(request);
		},
	}
});