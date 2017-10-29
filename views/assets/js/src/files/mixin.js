import Vue from 'vue';

export default Vue.mixin({
	methods: {
		getFiles () {
			var self = this;
			var request = {
	            url: self.base_url + '/pm/v2/projects/'+self.project_id+'/files',
	            success (res) {
	                self.$store.commit( 'setFiles', res.data );
	                NProgress.done();
	                self.loading = false;
	            }
	        };
	        self.httpRequest(request);
		}
	}
});