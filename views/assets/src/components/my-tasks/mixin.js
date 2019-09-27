
export default {
    data () {
        return {
            user_id: this.$route.params.user_id
        }
    },
	methods: {
        canShowMyTask () {
            if (this.has_manage_capability()) {
                return true;
            }
            if (typeof this.$route.params.user_id === 'undefined' ) {
                return true;
            }

            if (this.$route.params.user_id == this.current_user.ID) {
                return true;
            }
            return false;
        },
        getProUser ( args ) {
            var self = this,
            pre_define = {
                conditions: {
                    with: '',
                },
                user_id: this.current_user.ID,
                callback: false,
            };
            if (!this.canShowMyTask()){
                return;
            }

            var args = jQuery.extend(true, pre_define, args );
            var  conditions = self.generateConditions(args.conditions);

            var request = {
                type: 'GET',
                data: args.data,
                url: self.base_url + '/pm/v2/users/'+ args.user_id +'?'+conditions,
                success (res) {
                    if ( typeof args.callback === 'function' ) {
                        args.callback.call ( self, res );
                    }
                    pm.NProgress.done();
                }
            };

            if(args.user_id){
                self.httpRequest(request);
            }
        },
        getUserMeta () {
            var user_id = typeof this.$route.params.user_id !== 'undefined' ? this.$route.params.user_id : this.current_user.ID;
            var args = {
                user_id: user_id,
                conditions: {
                    with: 'meta'
                },
                callback: function (res){
                    this.$store.commit('myTask/setUserTask', res.data);
                    pm.NProgress.inc();
                }
            }
            this.getProUser(args);
        },
        getUserActivites ( args ) {
            var self = this,
            pre_define = {
                data: {

                },
                user_id: this.current_user.ID,
                callback: false,
            };
            if (!this.canShowMyTask()){
                return;
            }
            var args = jQuery.extend(true, pre_define, args );
            var request = {
                type: 'GET',
                data: args.data,
                url: self.base_url + '/pm/v2/users/'+ args.user_id +'/user-activities',
                success (res) {
                    if ( typeof args.callback === 'function' ) {
                        args.callback.call ( self, res );
                    }
                    pm.NProgress.done();

                }
            };

            if(args.user_id){
                self.httpRequest(request);
            }
        },

        getUserTaskByType ( args ) {
            var self = this,
            pre_define = {
                data: {
                    with: 'projects',
                    task_type: 'current', // current, outstanding, complete
                },
                user_id: this.current_user.ID,
                callback: false,
            };
            if (!this.canShowMyTask()){
                return;
            }
            var args = jQuery.extend(true, pre_define, args );
            var request = {
                type: 'GET',
                data: args.data,
                url: self.base_url + '/pm/v2/users/'+ args.user_id +'/tasks',
                success (res) {
                    if ( typeof args.callback === 'function' ) {
                        args.callback.call ( self, res );
                    }
                    pm.NProgress.done();
                }
            };

            if(args.user_id){
                self.httpRequest(request);
            }
        },


        getAllusers( args ) {
            var self = this,
            pre_define = {
                callback: false,
            };
            if (!this.canShowMyTask()){
                return;
            }

            var args = jQuery.extend(true, pre_define, args );

            var request = {
                type: 'GET',
                url: self.base_url + '/pm/v2/assigned_users/',
                success (res) {
                    //console.log(res.data);
                    self.$store.commit('myTask/setUsers', res.data);
                    if ( typeof args.callback === 'function' ) {
                        args.callback.call ( self, res );
                    }
                    pm.NProgress.done();
                }
            };
            self.httpRequest(request);
        }
	}
};
