 import Vue from './vue/vue';

 export default Vue.mixin({

 	data () {
 		return {
 			base_url: PM_Vars.base_url +'/'+ PM_Vars.rest_api_prefix,
 			project_id: typeof this.$route === 'undefined'? false : this.$route.params.project_id,
 		}
 	},

	methods: {
		httpRequest (property) {
			var before = function( xhr ) {
			    xhr.setRequestHeader("Authorization_name", btoa('asaquzzaman')); //btoa js encoding base64_encode
			    xhr.setRequestHeader("Authorization_password", btoa(12345678)); //atob js decode base64_decode
			};

			property.beforeSend = typeof property.beforeSend === 'undefined' ? before : property.beforeSend;

			jQuery.ajax(property);
		},

		getProject (project_id, callback) {
			var self = this;
            
            var callback   = callback || false;
			var project_id = project_id || self.project_id;

			if ( typeof self.project_id === 'undefined' ) {
				return;
			}

            var project = self.$root.$store.state.project;

            if ( !jQuery.isEmptyObject(project) ) {
                if (project.id === self.project_id) {
                    if (callback) {
                        callback(project);
                    }
                    return project;
                }
            }
            
            self.httpRequest({
                url: self.base_url + '/cpm/v2/projects/'+ self.project_id,
                success: function(res) {
                    self.$root.$store.commit('setProject', res.data);
                    self.$root.$store.commit('setProjectUsers', res.data.assignees.data);

                    if (callback) {
                        callback(res.data);
                    }
                }
            });
        },

        getProjectCategories (callback) {
            var callback = callback || false;
            var self = this;

            var categories = self.$root.$store.state.categories;

            if ( categories.length ) {
                if (callback) {
                    callback(categories);
                }
                return categories;
            }

            this.httpRequest({
                url: self.base_url + '/cpm/v2/categories?type=project',
                success: function(res) {
                    self.$root.$store.commit('setCategories', res.data);

                    if (callback) {
                        callback(res.data);
                    }
                }
            });
        },

        getRoles (callback) {
            var callback = callback || false;
            var self = this;

            var roles = self.$root.$store.state.roles;

            if ( roles.length ) {
                if (callback) {
                    callback(roles);
                }
                return roles;
            }

            self.httpRequest({
                url: self.base_url + '/cpm/v2/roles',
                success: function(res) {
                    self.$root.$store.commit('setRoles', res.data);

                    if (callback) {
                        callback(res.data);
                    }
                }
            });
        },
        /**
         * Get index from array object element
         *
         * @param   itemList
         * @param   id
         *
         * @return  int
         */
        getIndex: function ( itemList, id, slug) {
            var index = false;

            itemList.forEach(function(item, key) {
                if (item[slug] == id) {
                    index = key;
                }
            });

            return index;
        },
	}
});

