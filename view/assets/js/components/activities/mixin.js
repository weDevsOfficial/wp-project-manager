import Vue from './../../vue/vue';

export default Vue.mixin({
	methods: {
		getActivities () {
			var self = this;
			var request = {
	            url: self.base_url + '/cpm/v2/activities?per_page=3&page='+ self.setCurrentPageNumber(self),
	            success (res) {
	            	res.data.map(function(discuss, index) {
			    		//self.addMeta(discuss);
			    	});
	                //self.$store.commit( 'setDiscussion', res.data );
	                //self.$store.commit( 'setDiscussionMeta', res.meta.pagination );
	            }
	        };
	        self.httpRequest(request);
		},

		setCurrentPageNumber (self) {
            var current_page_number = self.$route.params.current_page_number ? self.$route.params.current_page_number : 1;
            self.current_page_number = current_page_number;
            return current_page_number;
        },
	},
});