export default {

    data () {
        return {
            base_url: PM_Vars.base_url +'/'+ PM_Vars.rest_api_prefix,
            project_id: typeof this.$route === 'undefined'? false : parseInt( this.$route.params.project_id ),
            current_user: PM_Vars.current_user,
            avatar_url: PM_Vars.avatar_url,
            text: PM_Vars.text,
            PM_Vars: PM_Vars,
            pm: pm
        }
    },

    methods: {
        __ (text, domain) {
            return pm.i18n.__(text, domain);
        },
        //sprintf : pm.i18n.sprintf,
        user_can (cap) {
            return pmUserCan( cap, this.$store.state.project );
        },
        is_user_in_project () {
            return pmIsUserInProject( this.$store.state.project );
        },
        is_manager () {
            return pmIsManager( this.$store.state.project )
        },
        has_manage_capability () {
            return pmHasManageCapability();
        },
        has_create_capability () {
            return pmHasCreateCapability();
        },
        intersect(a, b) {
            var d = {};
            var results = [];
            for (var i = 0; i < b.length; i++) {
                d[b[i]] = true;
            }
            for (var j = 0; j < a.length; j++) {
                if (d[a[j]]) 
                    results.push(a[j]);
            }
            return results;
        },
        pad2 (number) {
           return (number < 10 ? '0' : '') + number;
        },
        stringToTime (seconds) {
            var numdays = Math.floor(seconds / 86400);

            var numhours = Math.floor((seconds % 86400) / 3600);

            var numminutes = Math.floor(((seconds % 86400) % 3600) / 60);

            var numseconds = ((seconds % 86400) % 3600) % 60;

            return {
                'days': this.pad2(numdays),
                'hours': this.pad2(numhours),
                'minutes': this.pad2(numminutes),
                'seconds': this.pad2(numseconds)
            }
        },

        /**
         * WP settings date format convert to pm.Moment date format with time zone
         * 
         * @param  string date 
         * 
         * @return string      
         */
        shortDateFormat ( date ) {
            if ( date == '' ) {
                return;
            }      

            date = new Date(date);
            date = pm.Moment(date).format('YYYY-MM-DD');

            var format = 'MMM DD';

            return pm.Moment( date ).format( String( format ) );
        },


        /**
         * WP settings date format convert to pm.Moment date format with time zone
         * 
         * @param  string date 
         * 
         * @return string      
         */
        dateFormat ( date ) {
            if ( !date ) {
                return;
            }

            date = new Date(date);
            date = pm.Moment(date).format('YYYY-MM-DD');

            var format = 'MMMM DD YYYY';

            if ( PM_Vars.wp_date_format == 'Y-m-d' ) {
            format = 'YYYY-MM-DD';

            } else if ( PM_Vars.wp_date_format == 'm/d/Y' ) {
                format = 'MM/DD/YYYY';

            } else if ( PM_Vars.wp_date_format == 'd/m/Y' ) {
                format = 'DD/MM/YYYY';
            } 

            return pm.Moment( date ).format(format);
        },
        getSettings (key, pre_define, objKey ) {

            var pre_define  = typeof pre_define == 'undefined' ? false : pre_define,
                objKey = typeof objKey == 'undefined' ? false : objKey,
                settings  = PM_Vars.settings;
            if (objKey) {
                if ( typeof PM_Vars.settings[objKey] === 'undefined' ) {
                    return pre_define;
                }
                if ( typeof PM_Vars.settings[objKey][key] === 'undefined' ){
                    return pre_define;
                }
                        
                
                if ( PM_Vars.settings[objKey][key] === "true" ){
                    return true;
                } else if ( PM_Vars.settings[objKey][key] === "false" ){
                    return false;
                } else {
                    return PM_Vars.settings[objKey][key];
                }
            }


            if ( typeof PM_Vars.settings[key] == 'undefined' ) {
                return pre_define;
            }

            if ( PM_Vars.settings[key] === "true" ){
                return true;
            } else if ( PM_Vars.settings[key] === "false" ){
                return false;
            } else {
                return PM_Vars.settings[key];
            }
            
        },
        getLogo () {

            if (jQuery.isEmptyObject(PM_Pro_Vars.pm_logo)){
                return false;
            } else {
                return PM_Pro_Vars.pm_logo
            }
        },
        dataURLtoFile (dataurl, filename) {
            var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while(n--){
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], filename, {type:mime});
        },
        httpRequest (property) {
            var before = function( xhr ) {
                xhr.setRequestHeader("Authorization_name", btoa('asaquzzaman')); //btoa js encoding base64_encode
                xhr.setRequestHeader("Authorization_password", btoa(12345678)); //atob js decode base64_decode

                xhr.setRequestHeader("X-WP-Nonce", PM_Vars.permission);
            };

            property.beforeSend = typeof property.beforeSend === 'undefined' ? before : property.beforeSend;

            return jQuery.ajax(property);
        },

        registerStore (module_name, store) {
            if (typeof store === 'undefined') {
                return false;
            }
            
            var self = this;
            if( typeof store !== 'undefined' ) {
                var mutations = store.mutations || {}; //self.$options.mutations;
                var state = store.state || {}; //self.$options.state;
            }
            
            // register a module `myModule`

            self.$store.registerModule(module_name, {
                namespaced: true,
                state,
                mutations,
            });
        },

        /**
         * Create a new project 
         * @param  {[Object]} args data with callback
         * @return {viod}      [description]
         */
        newProject (args) {
            var self = this,
            pre_define = {
                data: {
                    title : '',
                    categories : '',
                    description: '',
                    notify_users: '',
                    assignees: '',
                    status: 'incomplete'
                },
                callback: false,
            },
            args = jQuery.extend(true, pre_define, args );
            args = pm_apply_filters( 'before_project_save', args );
            var request = {
                type: 'POST',
                url: this.base_url + '/pm/v2/projects/',
                data: args.data,
                success: function(res) {
                    self.$root.$store.commit('newProject', res.data);
                    self.showHideProjectForm(false);
                    self.resetSelectedUsers();
                    pm.Toastr.success(res.message);
                    jQuery( "#pm-project-dialog" ).dialog("close");

                    if(typeof args.callback === 'function'){
                        args.callback.call(self, res);
                    }
                },

                error: function(res) {
                    res.responseJSON.message.map( function ( message ) {
                        pm.Toastr.error( message );
                    });
                    
                }
            };

            this.httpRequest(request);
        },

        formatUsers (users) {
            var format_users = [];
            
            users.map(function(user, index) {
                format_users.push({
                    'user_id': user.id,
                    'role_id': user.roles.data[0].id
                });
            });

            return format_users;
        },

        updateProject (args) {
            var self = this,
            pre_define = {
              data: {
                status: 'incomplete'
              },
              callback: false,
            },
            args = jQuery.extend(true, pre_define, args );
            args = pm_apply_filters( 'before_project_save', args );
            var request = {
                type: 'PUT',
                url: this.base_url + '/pm/v2/projects/'+ args.data.id,
                data: args.data,
                success: function(res) {
                    
                    self.$root.$store.commit('updateProject', res.data);
                    pm.Toastr.success(res.message);
                    self.showHideProjectForm(false);
                    jQuery( "#pm-project-dialog" ).dialog("close");
                    self.resetSelectedUsers();
                    if(typeof args.callback === 'function'){
                        args.callback.call(self, res);
                    }
                },

                error: function(res) {
                    if(typeof args.callback === 'function'){
                        args.callback.call(self, res);
                    }                    
                }
            };
            
            this.httpRequest(request);
        },

        resetSelectedUsers () {
            this.$root.$store.commit('resetSelectedUsers');
        },

        getProjects ( args ) {

            var self = this;
            var pre_define ={
                conditions : {
                    status: '',
                    per_page: this.getSettings('project_per_page', 10),
                    page : this.setCurrentPageNumber(),
                    category: typeof this.$route.query.category !== 'undefined' ? this.$route.query.category[0] : '',
                },
                callback: false
            }

            var  args = jQuery.extend(true, pre_define, args );
            var conditions = pm_apply_filters( 'before_get_project', args.conditions );
            conditions = self.generateConditions(conditions);

            var request_data = {
                url: self.base_url + '/pm/v2/projects?'+conditions,
                success: function(res) {
                    res.data.map(function(project) {
                        self.addProjectMeta(project);
                    });
                    self.$root.$store.commit('setProjects', {'projects': res.data});
                    self.$root.$store.commit('setProjectsMeta', res.meta );
                    pm.NProgress.done();
                    self.loading = false;
                    if(typeof callback !== 'undefined'){
                        callback(res.data);
                    }

                    pmProjects = res.data;
                }
            };

            self.httpRequest(request_data);
        },

        setCurrentPageNumber () {
            var current_page_number = this.$route.params.current_page_number ? this.$route.params.current_page_number : 1;
            this.current_page_number = current_page_number;
            return current_page_number;
        },

        getProject ( args ) {
            var self = this;
            var pre_define ={
                conditions : {

                },
                project_id: this.project_id,
                callback: false
            }

            var  args = jQuery.extend(true, pre_define, args );
            var conditions = self.generateConditions(args.conditions);

            if ( typeof args.project_id === 'undefined' ) {
                return;
            }

            self.httpRequest({
                url:self.base_url + '/pm/v2/projects/'+ args.project_id + '?' + conditions ,
                success: function(res) {
                     if (typeof args.callback === 'function' ) {
                        args.callback.call(self, res);
                    }
                }
            });

        },

        getUser ( args ) {
            var self = this;
            var pre_define ={
                data: {
                },
                conditions : {

                },
                callback: false
            }

            var  args = jQuery.extend(true, pre_define, args );
            var conditions = self.generateConditions(args.conditions);

            if (typeof args.data.user_id === 'undefined' ){
                return ;
            }

            self.httpRequest({
                url:self.base_url + '/pm/v2/users/'+ args.data.user_id + '?' + conditions ,
                success: function(res) {
                    if (typeof args.callback === 'function' ) {
                        args.callback.call(self, res);
                    }
                }
            });
        },


        get_search_user(args) {
            var self = this;
            var pre_define ={
                data: {
                },
                conditions : {

                },
                callback: false
            }

            var  args = jQuery.extend(true, pre_define, args );
            var conditions = self.generateConditions(args.conditions);

            var request = {
                url: self.base_url + '/pm/v2/users/search?' + conditions ,
                success: function(res) {
                    if (typeof args.callback === 'function' ) {
                        args.callback.call(self, res);
                    }
                }
            }

            return self.httpRequest(request);
        },

        getGloabalProject(){
            var args ={
                callback : function (res) {
                    this.addProjectMeta(res.data);
                    this.$root.$store.commit('setProject', res.data);
                    this.$root.$store.commit('setDefaultLoaded');
                    this.$root.$store.commit('setProjectUsers', res.data.assignees.data);
                }
            }
            this.$root.$store.state.project_switch = false;
            var project = this.$root.$store.state.project;
            if ( ! project.hasOwnProperty('id') || project.id !== this.project_id ) {
                this.$root.$store.state.project_switch = true;
                this.getProject(args);
            }

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
                url: self.base_url + '/pm/v2/categories?type=project',
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
                url: self.base_url + '/pm/v2/roles',
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

            jQuery.each(itemList, function(key, item) {
        
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
                url: self.base_url + '/pm/v2/projects/'+self.project_id+'/files/' + file_id,
                type: 'DELETE',
                success: function(res) {
                    

                    if (typeof callback !== 'undefined') {
                        callback(res.data);
                    }
                }
            });
        },


        userTaskProfileUrl ( user_id ) {
            return PM_Vars.ajaxurl + '?page=pm_task#/user/' + user_id;
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
        },

        /**
         * ISO_8601 Date format convert to moment date format
         * 
         * @param  string date 
         * 
         * @return string      
         */
        pmDateISO8601Format: function( date, time ) {
            var date = new Date(date +' '+ time);
            
            return pm.Moment( date).format();
        },

        deleteProject (id) {
            if ( ! confirm( this.__( 'Are you sure to delete this project?', 'wedevs-project-manager') ) ) {
                return;
            }
            var self = this;
            var request_data = {
                url: self.base_url + '/pm/v2/projects/' + id,
                type: 'DELETE',
                success: function(res) {
                    self.$root.$store.commit('afterDeleteProject', id);
                    pm.Toastr.success(res.message);
                    if (!self.$root.$store.state.projects.length) {
                        self.$router.push({
                            name: 'project_lists', 
                        });
                    } else {
                        self.getProjects();
                    }
                }
            }

            self.httpRequest(request_data);
        },

        addUserMeta (user) {
            if(!user.roles.data.length) {
                user.roles = {
                    data: [{
                        description: "Co-Worker for project manager",
                        id:2,
                        title:"Co-Worker"
                    }]
                }
            } 
        },
        projects_view_class (){
            return this.$store.state.projects_view === 'grid_view' ? 'pm-project-grid': 'pm-project-list'
        },

        generateConditions (conditions) {
            var query = '';

            if (jQuery.isEmptyObject(conditions)) {
                return ''
            }

            jQuery.each(conditions, function(condition, key) {
                if(key){
                    query = query + condition +'='+ key +'&';
                }
                
            });

            return query.slice(0, -1);
        },
        /**
         * [get Global Milestones in every page where milestone need and store in $root.$store.state.milestone ]
         * @param  {Function} callback [optional]
         * @return {[type]}            [milestone]
         */
        getGlobalMilestones (callback) {
          var self = this,
          milestones = this.$root.$store.state.milestones,
          milestones_load = self.$root.$store.state.milestones_load;

          if(milestones_load){
            if(typeof callback === 'function' ){
                callback.call(self, milestones);
            }
            return milestones;
          }else {
            var request = {
              url: self.base_url + '/pm/v2/projects/'+self.project_id+'/milestones',
              success (res) {
                self.$root.$store.commit( 'setMilestones', res.data );

                if (typeof callback === 'function') {
                  callback.call( self, res.data);
                }
              }
            };
            self.httpRequest(request);
          }    
        },

        loadingStart (id, args) {
            var pre_define = {
                // loading text
                text: '', 

                // from 0 to 100 
                percent: '', 

                // duration in ms
                duration: '', 

                // z-index property
                zIndex: '', 

                // sets relative position to preloader's parent
                setRelative: false 

            };
            var args = jQuery.extend(true, pre_define, args);
            
            jQuery('#'+id).preloader(args);
        },

        loadingStop (id) {
            jQuery('#'+id).preloader('remove');
        },

        arrayDiffer ( arr1, arr2 ) {
            var diff =[];
            arr1.forEach(function (arr) {
                if( arr2.indexOf( arr) > -1 ){
                    diff.push(arr);
                }
            });
            return diff;
        },

        saveSettings (settings, project_id, callback) {
            var settings = this.formatSettings(settings);
            var project_id = project_id || false;
            var self = this;
            
            var url = project_id 
                ? self.base_url + '/pm/v2/projects/'+project_id+'/settings' 
                : self.base_url + '/pm/v2/settings';

            var request = {
                url: url,
                data: {
                    settings: settings
                },
                type: 'POST',
                success (res) {
                    //pm.Toastr.success(res.message);
                    if (typeof callback !== 'undefined') {
                        callback(res.data);
                    }
                }
            };
            
            self.httpRequest(request);
        },

        formatSettings (settings) {
            var data = [];

            jQuery.each(settings, function(name, value) {
                data.push({
                    key: name,
                    value: value
                });
            });

            return data;
        },

        getViewType(callback) {
            let is_need_fetch_view_type = this.$store.state.is_need_fetch_view_type;

            if ( !is_need_fetch_view_type ) {
                callback(
                    {
                        'value': this.$store.state.listView
                    }
                );
                return;
            }

            var self = this;
            var request = {
                url: self.base_url + '/pm/v2/projects/'+this.project_id+'/settings?key=list_view_type',
                data: {},
                type: 'GET',
                success (res) {
                    self.$store.commit('is_need_fetch_view_type', false);
                    if ( res.length ) {
                        self.setViewType(res.data.value);
                    }else {
                        self.setViewType('list');
                    }
                    

                    if (typeof callback !== 'undefined') {
                        callback(res.data);
                    }
                }
            };

            self.httpRequest(request);
        },

        setViewType(view_type) {
            this.$store.commit('listViewType', view_type);
        },

        getClients () {
            
            var project = this.$store.state.project,
                assignees = this.$store.state.project.assignees.data;

            return assignees.filter(function(user) {

                var roles = user.roles.data.filter(function(role) {
                    return role.slug == 'client' ? true : false;
                });

                return roles.length ? true : false;
            });
        }
    }
};


 




