export default{
    data () {
        return {

        }
    },
    methods: {

        getProgects (callback) {
            var self = this;
            var request = {
                url: self.base_url + '/pm/v2/projects',
                type: 'GET',
                success (res) {
                    if (typeof callback !== 'undefined') {
                        callback(res);
                    }
                }
            };
            self.httpRequest(request);
        },
        save_map_users(usernames,callback){
            var self = this;
            var request = {
                url: self.base_url + '/pm/v2/save_users_map_name',
                data: {
                    usernames: usernames
                },
                type: 'POST',
                success (res) {
                    pm.Toastr.success('User mapping completed');
                    if (typeof callback !== 'undefined') {
                        callback();
                    }
                }
            };
            self.httpRequest(request);
        }
    }
}


