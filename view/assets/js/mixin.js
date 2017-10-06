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

        newProject () {
            var self = this;

            if (this.is_update) {
                var type = 'PUT';
                var url = this.base_url + '/cpm/v2/projects/'+ this.project.id;
            } else {
                var type = 'POST';
                var url = this.base_url + '/cpm/v2/projects/';
            }

            var request = {
                type: type,

                url: url,

                data: {
                    'title': this.project.title,
                    'categories': [this.project_cat],
                    'description': this.project.description,
                    'notify_users': this.project_notify,
                    'assignees': this.formatUsers(this.project_users),
                    'status': typeof this.project.status === 'undefined' ? 'incomplete' : this.project.status,
                },

                success: function(res) {
                    if (!this.is_update) {
                        self.$root.$store.commit('newProject', res.data);
                    }
                    self.showHideProjectForm(false);
                    jQuery( "#cpm-project-dialog" ).dialog("close");
                },

                error: function(res) {
                    
                }
            };
    
            this.httpRequest(request);
        },

        updateProject (project, callback) {
            var self = this;

            var request = {
                type: 'PUT',

                url: this.base_url + '/cpm/v2/projects/'+ project.id,

                data: project,

                success: function(res) {
                    
                    self.$root.$store.commit('updateProject', res.data);
                   
                    self.showHideProjectForm(false);
                    jQuery( "#cpm-project-dialog" ).dialog("close");

                    if ( typeof callback !== 'undefined' ) {
                        callback(res.data);
                    }
                },

                error: function(res) {
                    
                }
            };
    
            this.httpRequest(request);
        },

        getProjects (condition) {
            var condition = condition || '';
            var self = this;

            var request_data = {
                url: self.base_url + '/cpm/v2/projects?per_page=2&page='+ self.setCurrentPageNumber(self) +'&'+ condition,
                success: function(res) {
                    res.data.map(function(project) {
                        self.addProjectMeta(project);
                    });
                    self.$root.$store.commit('setProjects', {'projects': res.data});
                    self.$root.$store.commit('setProjectsMeta', res.meta );
                }
            };

            self.httpRequest(request_data);
        },

        setCurrentPageNumber (self) {
            var current_page_number = self.$route.params.current_page_number ? self.$route.params.current_page_number : 1;
            self.current_page_number = current_page_number;
            return current_page_number;
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
                    self.addProjectMeta(res.data);
                    self.$root.$store.commit('setProject', res.data);
                    self.$root.$store.commit('setProjectUsers', res.data.assignees.data);

                    if (callback) {
                        callback(res.data);
                    }
                }
            });
        },

        addProjectMeta (project) {
            project.edit_mode = false;
            project.settings_hide = false;
        },

        getProjectCategories (callback) {
            var callback = callback || false;
            var self = this;

            var categories = self.$root.$store.state.categories;

            if ( categories.length ) {
                if (callback) {
                    //callback(categories);
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

        showHideProjectForm (status) {
            this.$root.$store.commit('showHideProjectForm', status);
        },

        deleteFile (file_id, callback) {
            var self = this;

            self.httpRequest({
                url: self.base_url + '/cpm/v2/projects/'+self.project_id+'/files/' + file_id,
                type: 'DELETE',
                success: function(res) {
                    

                    if (typeof callback !== 'undefined') {
                        callback(res.data);
                    }
                }
            });
        },

         /**
         * Set extra element in httpRequest query
         */
        getQueryParams (add_query) {

            var self = this,
                query_str = '';

             jQuery.each(add_query, function(key, val) {
                
                if (Array.isArray(val)) {

                    val.map(function(el, index) {
                        query_str = query_str + key +'='+ el + '&'; 
                    });
                } else {
                    query_str = query_str + key +'='+ val + '&'; 
                }
                
            });
                

            jQuery.each(this.$route.query, function(key, val) {
                
                if (Array.isArray(val)) {

                    val.map(function(el, index) {
                        query_str = query_str + key +'='+ el + '&'; 
                    });
                } else {
                    query_str = query_str + key +'='+ val + '&'; 
                }
                
            });

            var query_str = query_str.slice(0, -1);

            return query_str;
        },

        /**
         * Set extra element in this.$route.query
         */
        setQuery (add_query) {
            var self = this,
                route_query = {};


            jQuery.each(self.$route.query, function(key, val) {
                if (Array.isArray(val)) {
                    route_query[key] = [];
                    
                    val.map(function(el, index) {
                        route_query[key].push(el);
                    });
                
                } else if (val) {
                    route_query[key] = [val];
                }
                
            });

            jQuery.each(add_query, function(key, val) {
                if (val) {
                    route_query[key] = [val];
                } else {
                    delete route_query[key];
                }
                
            });
            
            return route_query;
        }
	}
});

