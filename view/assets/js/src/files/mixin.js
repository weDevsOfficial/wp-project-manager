import Vue from './../../vue/vue';

export default Vue.mixin({
	methods: {
		getFiles (self) {
			var request = {
	            url: self.base_url + '/cpm/v2/projects/'+self.project_id+'/files',
	            success (res) {
	                self.$store.commit( 'setFiles', res.data );
	                NProgress.done();
	            }
	        };
	        self.httpRequest(request);
		}
	}
});