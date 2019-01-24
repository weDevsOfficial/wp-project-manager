export default {

    computed: {

    },
	methods: {
        getImportStatus(bag, url){
            var self = this;
            var request = {
                type: 'GET',
                url: self.base_url+"/pm/v2/tools/"+url,
                success (res) {
                    if(res.length > 0){
                        res.forEach(function(val){
                            bag.push(val)
                        })
                    }
                    pm.NProgress.done();
                }
            };
            self.httpRequest(request);

        },

    },

}
