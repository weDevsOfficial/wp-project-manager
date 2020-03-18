
export default {
    methods: {
        getFiles () {
            var self = this;
            var request = {
                url: self.base_url + 'pm/v2/projects/'+self.project_id+'/files',
                success (res) {
                    self.$store.commit( 'projectFiles/setFiles', res.data );
                    pm.NProgress.done();
                    self.loading = false;
                }
            };
            self.httpRequest(request);
        }, 
    }
};
