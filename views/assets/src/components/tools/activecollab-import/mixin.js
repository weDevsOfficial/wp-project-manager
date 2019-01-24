export default {

    computed: {

    },
	methods: {
        checkImportStatus:function(source, value){
            return source.includes(value);
        },

        cutString(string, length, dot){
            var output = "";
            output = string.substring(0, parseInt(length));
            if(dot && string.length > length){
                output += "...";
            }
            return output;
        },
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
