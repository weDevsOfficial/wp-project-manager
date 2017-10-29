import Vue from 'vue';

export default Vue.mixin({
	methods: {
		getActivities (condition, callback) {
			var self = this,
				condition = self.generateActivityCondition(condition) || '';

			var request = {
	            url: self.base_url + '/pm/v2/projects/'+self.project_id+'/activities?'+condition,
	            success (res) {
	                if ( typeof callback !== 'undefined' ) {
	                	callback(res);
	                }
	                NProgress.done();
	            }
	        };

	        self.httpRequest(request);
		},

		setCurrentPageNumber (self) {
            var current_page_number = self.$route.params.current_page_number ? self.$route.params.current_page_number : 1;
            self.current_page_number = current_page_number;
            return current_page_number;
        },

        generateActivityCondition (conditions) {
        	var query = '';

        	jQuery.each(conditions, function(condition, key) {
        		query = query + condition +'='+ key +'&';
        	});

        	return query.slice(0, -1);
        }
	},
});
