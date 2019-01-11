export default {
    data(){
        return {
            api_url: 'https://api.trello.com/1/member/me/',
            api_url_all: 'https://api.trello.com/1/',
            // result:[],
            // selected_result:[],
            // selected:false
        }
    },
    methods:{
        // trelloGet(item, bag){
        //     var self = this;
        //     let url = this.api_url+item+'?key='+this.api_key+'&token='+this.token;
        //     let fields = 'all';
        //
        //     jQuery.get(url, function(response){
        //
        //         response.forEach(function (val, index) {
        //             bag.push(val)
        //             jQuery.get(self.api_url_all+'boards/'+val.id+'/lists?cards=all&card_fields='+fields+'&filter=all&fields=all&key='+self.api_key+'&token='+self.token, function(listCards){
        //                 bag.push({id:val.id, name:val.name, desc:val.desc, members:val.memberships, lists:listCards, clicked:false});
        //             });
        //
        //         });
        //     });
        // },

        trelloGet(item, bag){
            var self = this;
            let url = this.api_url+item+'?key='+this.api_key+'&token='+this.token;
            let fields = 'all';

            jQuery.get(url, function(response){

                response.forEach(function (val, index) {
                    // bag.push(val)
                    jQuery.get(self.api_url_all+'organizations/'+val.id+'/boards?key='+self.api_key+'&token='+self.token+'&fields=id,name,prefs', function(boards){

                        boards.map((obj) => {
                            obj.clicked = false;
                            return obj;
                        });

                        bag.push({
                            id:val.id,
                            name:val.displayName,
                            boards:boards,
                            clicked:false
                        });
                    });

                });
            });
        },

        trelloGet_of_byid(parentname,childname,parent_id,childs_param,bag){
            var url = this.api_url_all+parentname+'/'+parent_id+'/'+childname+'?key='+this.api_key+'&token='+this.token+childs_param;
            jQuery.get(url, function(response){
                response.forEach(function (val, index) {
                    val['selected'] = false;
                    bag.push(val)
                });
            });
        },


        loadScript: function(url, callback) {

            jQuery.ajax({
                url: url,
                dataType: 'script',
                success: callback,
                async: true
            });
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
                url: self.base_url+"/pm-pro/v2/tools/"+url,
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

        checkImportStatus:function(source, value){
            return source.includes(value);
        }
    }
}
