export default {
    data() {
        return {
            loading: true,
        }
    },
    methods: {
        /**
         * Insert categroy resource
         * @param  {Object} args Object with callback
         * @return {void}      
         */
        newCategory (args) {
            var self = this;
            var pre_define = {
                data:{
                    title: this.title,
                    description: this.description,
                    categorible_type: 'project'
                },
                callback: false
              },
            args = jQuery.extend(true, pre_define, args );

            var request_data = {
                url: self.base_url + '/pm/v2/categories',
                type: 'POST',
                data: args.data,
                
                success (res) {
                    self.addCategoryMeta(res.data);
                    
                    self.show_spinner = false;

                    // Display a success toast, with a title
                    pm.Toastr.success(res.message);
             
                    self.submit_disabled = false;

                    self.$root.$store.commit('afterNewCategories', res.data);
                    if(typeof args.callback === 'function' ){
                        args.callback.call(self, res);
                    }

                },

                error (res) {
                    self.show_spinner = false;
                    // Showing error
                    if ( res.status == 400 ) {
                        var params = res.responseJSON.data.params;
                        for ( var obj in params ){
                            pm.Toastr.error(params[obj][0]);
                        }
                    }

                    if(typeof args.callback === 'function' ){
                        args.callback.call(self, res.responseJSON.data);
                    }
                    self.submit_disabled = false;
                }
            }
          
            self.httpRequest(request_data);
        },

        /**
         * Get All categories 
         * @return {[data]} [description]
         */
        getCategories (args) {
            var self = this;
            var pre_define = {
                    conditions: {
                        per_page: 20,
                        page: this.setCurrentPageNumber(),
                    },
                    callback: false
                };

            var args       = jQuery.extend(true, pre_define, args );
            var conditions = self.generateConditions(args.conditions);

            var request_data = {
                url: self.base_url + '/pm/v2/categories?' + conditions,
                success: function(res) {
                    res.data.map(function(category, index) {
                        self.addCategoryMeta(category);
                    });
                    pm.NProgress.done();  
                    self.$root.$store.commit('setCategories', res.data);
                    self.$root.$store.commit('setCategoryMeta', res.meta);
                }
            };

            self.httpRequest(request_data);
        },

        getCategory () {

        },
        /**
         * Category meta
         * @param {Object} category 
         */
        addCategoryMeta (category) {
            category.edit_mode = false;
        },

        /**
         * Category form mood
         * @param  {Object} category 
         * @return {void}          
         */
        showHideCategoryEditForm (category) {
            category.edit_mode = category.edit_mode ? false : true;
        },

        /**
         * Update Category 
         * @param  {Object} args 
         * @return {Data Collection}      
         */
        updateCategory (args) {
            var self      = this;
            var pre_define = {
                data:{
                    id: '',
                    title: '',
                    description: '',
                    categorible_type: 'project'
                },
                callback: false
            },
            args = jQuery.extend(true, pre_define, args );

              // Showing loading option 
            this.show_spinner = true;

            var request_data = {
                url: self.base_url + '/pm/v2/categories/' + args.data.id + '/update',
                type: 'POST',
                data: args.data,
                
                success (res) {
                    self.addCategoryMeta(res.data);
                    self.show_spinner = false;

                    // Display a success toast, with a title
                    pm.Toastr.success(res.message);
             
                    self.submit_disabled = false;
                    self.show_spinner = false;

                    self.$root.$store.commit('afterUpdateCategories', res.data);
                    if(typeof args.callback === 'function' ){
                        args.callback.call(self, res);
                    }

                },

                error (res) {
                    self.show_spinner = false;
                    // Showing error
                    if ( res.status == 400 ) {
                        var params = res.responseJSON.data.params;
                        for ( var obj in params ){
                            pm.Toastr.error(params[obj][0]);
                        }
                    }
                    
                    if(typeof args.callback === 'function' ){
                        args.callback.call(self, res.responseJSON.data);
                    }
                    self.submit_disabled = false;
                }
            }
            self.httpRequest(request_data);
        },

        deleteCategory (args) {
            if ( ! confirm( this.__( 'Are you sure?', 'wedevs-project-manager') ) ) {
                return;
            }
            var self = this;
            var pre_define = {
                    id: false,
                    callback: false
                };

            var args = jQuery.extend(true, pre_define, args );

            var request_data = {
                url: self.base_url + '/pm/v2/categories/'+args.id+'/delete',
                type: 'POST',
                success (res) {
                    self.$store.commit('projectDiscussions/afterDeleteDiscuss', args.discuss_id);

                    if (!self.$root.$store.state.categories.length) {
                        self.$router.push({
                            name: 'categories',
                        });
                    } else {
                        self.getCategories();
                    }                
                    pm.Toastr.success(res.message);
                    if (typeof args.callback === 'function') {
                        args.callback();
                    } 
                },

                error ( res ) {
                    res.responseJSON.message.map( function( value, index ) {
                        pm.Toastr.error(value);
                    });
                }
            }
            
            self.httpRequest(request_data);
        },

        /**
         * Delete Bulk categories by categories ids
         * @param  {Object} args ids with callback
         * @return {void}      
         */
        deleteCategories (args) {
            var self = this;

            var pre_define = {
                category_ids: [],
                callback: false
              },
            args = jQuery.extend(true, pre_define, args );

            var request_data = {
                url: self.base_url + '/pm/v2/categories/bulk-delete/',
                data: {
                    'category_ids': args.category_ids
                },
                type: 'POST',
                success: function(res) {
                    args.category_ids.map(function(id, index) {
                        self.$root.$store.commit('afterDeleteCategory', id);
                    });
                    pm.Toastr.success(res.message);
                    if(typeof args.callback === 'function' ){
                      args.callback.call(self, res);
                    }
                }
            }
            self.httpRequest(request_data);
        },
        setCurrentPageNumber () {
            var self = this;
            var current_page_number = self.$route.params.current_page_number ? self.$route.params.current_page_number : 1;
            self.current_page_number = current_page_number;
            return current_page_number;
        },
    },
};
