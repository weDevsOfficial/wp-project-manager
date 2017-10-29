import Vue from 'vue';
/**
 * Task list mixin
 * All available function about task
 */

var PM_TaskList_Mixin = {

	data () {
		return {

		}
	},

	computed: {

		/**
         * Is current user can create task
         * 
         * @return object
         */
        canUserCreateTask: function() {
            return this.$store.state.permissions.create_todo;
        },

        task_start_field: function() {
           return this.$store.state.permissions.task_start_field;
        },

        /**
         * Check is todo-list single or not
         * 
         * @return Boolean
         */
        is_single_list: function() {
            return this.$store.state.is_single_list;
        },

        /**
         * Check is task single or not
         * 
         * @return Boolean
         */
        is_single_task: function() {
            return this.$store.state.is_single_task;
        },
	},

	methods: {

		/**
		 * Retrive All task list
		 * @param  {[object]}   args SSR url condition
		 * @param  {Function} callback  [description]
		 * @return {[void]}             [description]
		 */
		getLists (args) {
            var self = this,
             pre_define = {
             		condition: {
             			with: 'incomplete_tasks',
                    	per_page: this.getSettings('list_per_page', 10),
                    	page: this.setCurrentPageNumber()
             		},
             		callback: false,
                };

            var args = jQuery.extend(true, pre_define, args );

            var  condition = this.generateConditions(args.condition);
            
            var request = {
                url: self.base_url + '/pm/v2/projects/'+self.project_id+'/task-lists?'+condition,
                
                success (res) {
                    res.data.map(function(list,index) {
                        self.addMetaList(list);

                        if ( typeof list.incomplete_tasks !== 'undefined' ) {
                            list.incomplete_tasks.data.map(function(task) {
                                self.addTaskMeta(task);
                            });
                        }

                        if ( typeof list.complete_tasks !== 'undefined' ) {
                            list.complete_tasks.data.map(function(task) {
                                self.addTaskMeta(task);
                            });
                        }

                    });
                    
                    self.$store.commit('setLists', res.data);
                    self.$store.commit('setListsMeta', res.meta.pagination);

                    self.listTemplateAction();
                    
                    if ( typeof args.callback === 'function' ) {
                        args.callback.call (self, res.data);
                    }
                }
            };
            self.httpRequest(request);
        },

        /**
         * Retrive a single list 
         * @param  {object}   args     condition and list id
         * @param  {Function} callback [description]
         * @return {void}            [description]
         */
        getList ( args ) {
            var self = this, 
             pre_define = {
                    condition: {
                       with: 'incomplete_tasks', 
                    },
                    list_id: false,
                    callback: false,
                };

            var args = jQuery.extend(true, pre_define, args );

              var  condition = self.generateConditions(args.condition);

            var request = {
            	type: 'GET',
                url: self.base_url + '/pm/v2/projects/'+self.project_id+'/task-lists/'+ args.list_id +'?'+condition,
                success (res) {
                    self.addMetaList(res.data);
                    
                    if ( typeof res.data.comments !== 'undefined' ) {
                        res.data.comments.data.map(function(comment) {
                            self.addListCommentMeta(comment);
                        });
                    }

                    if ( typeof res.data.incomplete_tasks !== 'undefined' ) {
                        res.data.incomplete_tasks.data.map(function(task) {
                            self.addTaskMeta(task);
                        });
                    }

                    if ( typeof res.data.complete_tasks !== 'undefined' ) {
                        res.data.complete_tasks.data.map(function(task) {
                            self.addTaskMeta(task);
                        });
                    }

                    if ( typeof args.callback === 'function' ) {
                        args.callback.call ( self, res );
                    }

                    NProgress.done();
                }
            };
            if(args.list_id){
            	self.httpRequest(request);
            }
            
        },

        /**
         * Insert  todo list
         * 
         * @return void
         */
        addList: function(args) {

            var self = this,
            pre_define = {
            	data: {
            		id: false,
	            	title : '',
	            	description: '',
	            	milestone: '',
	            	order: 0
            	},
            	callback: false,
            },
            args = jQuery.extend(true, pre_define, args );
            
            
            var request_data = {
            	url: self.base_url + '/pm/v2/projects/'+self.project_id+'/task-lists',
            	data: args.data,
            	type: 'POST',
            	success (res) {

					          self.addMetaList(res.data);
                    res.data.incomplete_tasks = {data: []};
                  	self.$store.commit('afterNewList', res.data);
					          self.$store.commit('afterNewListupdateListsMeta');
                  	self.showHideListForm(false);
                    toastr.success(res.data.success);

                    if( typeof args.callback === 'function' ) {
                    	args.callback.call( self,  res );
                    }
            	},

            	error (res) {
                    // Showing error
                    res.data.error.map(function(value, index) {
                        toastr.error(value);
                    });

                    if( typeof args.callback === 'function' ) {
                    	args.callback.call( self, res );
                    }
            	},
            }

            self.httpRequest(request_data);
        },

        /**
         * Update  todo list
         * 
         * @return void
         */
        updateList ( args ){

            var self = this,
            pre_define = {
              data: {
                id: false,
                title : '',
                description: '',
                milestone: '',
                order: 0
              },
              callback: false,
            };
            var args = jQuery.extend(true, pre_define, args );

            var request_data = {
              url: self.base_url + '/pm/v2/projects/'+self.project_id+'/task-lists/'+self.list.id,
              data: args.data,
              type: 'PUT',
              success (res) {

                    self.addMetaList(res.data);
                    toastr.success(res.data.success);
                    self.$store.commit('afterUpdateList', res.data);
                    self.showHideListForm(false, self.list);
                    
                    if( typeof args.callback === 'function' ) {
                      args.callback.call( self,  res );
                    }
              },
              error (res) {
                    // Showing error
                    res.data.error.map(function(value, index) {
                        toastr.error(value);
                    });

                    if( typeof args.callback === 'function' ) {
                      args.callback.call( self, res );
                    }
              },
            }

            self.httpRequest(request_data);

        },
        /**
         * [modifyList description]
         * @param  {[type]} list [description]
         * @return {[type]}      [description]
         */
        modifyList ( list ){

          var args = {
            data: list
          }

          this.updateList(args);
        },

        /**
         * Delete list
         * 
         * @param  int list_id 
         * 
         * @return void         
         */
        deleteList ( args ) {
            if ( ! confirm( this.text.are_you_sure ) ) {
                return;
            }
            var self = this,
            	pre_define = {
            		list_id : false,
            		callback: false,
            	},
            	args = jQuery.extend(true, pre_define, args);


            var request_data = {
                url: self.base_url + '/pm/v2/projects/'+self.project_id+'/task-lists/' + args.list_id,
                type: 'DELETE',
                success: function(res) {
                    self.$store.commit('afterDeleteList', args.list_id);
                    // toastr.success(res.data.success);
                    self.listTemplateAction();
                    if( typeof args.callback === 'function' ) {
                        args.callback.call( self, res);
                    }
                }
            }
            if ( args.list_id ) {
            	self.httpRequest(request_data);
            }
        },

        /**
         * Insert  task
         * 
         * @return void
         */
        addTask ( args ) {
            var self      = this,
            	pre_define = {
            		data: {
            			task_id: false,
            			board_id: '',
                  assignees: '',
                  title: '',
                  description: '',
                  start_at: '',
                  due_date: '',
                  task_privacy: '',
                  list_id: '',
                  order: ''
            		},
            		callback: false
            	},
            	args = jQuery.extend(true, pre_define, args);
            var request_data = {
                url: self.base_url + '/pm/v2/projects/'+self.project_id+'/tasks',
                type: 'POST',
                data: args.data,
                success (res) {
                    self.addTaskMeta(res.data);
                    self.$store.commit('afterNewTask', {
                            list_id: args.data.list_id,
                            task: res.data
                        });

                    // Display a success toast, with a title
                    toastr.success(res.data.success);                    
                    self.showHideTaskFrom(false, self.list, self.task );
                    if ( typeof args.callback === 'function' ) {
                    	args.callback.call ( self, res );
                    }

                },

                error (res) {
                    // Showing error
                    res.data.error.map( function( value, index ) {
                        toastr.error(value);
                    });

                    if ( typeof args.callback === 'function' ) {
                    	args.callback.call ( self,  res );
                    }
                }
            }
            
            self.httpRequest(request_data);
        },

        /**
         * Update Task using Task object 
         * @param  {Object} task Task Object
         * @return {void}      Update a task
         */
        updateTask ( args ){
           var self      = this,
              pre_define = {
                data: {
                  task_id: false,
                  board_id: '',
                  assignees: '',
                  title: '',
                  description: '',
                  start_at: '',
                  due_date: '',
                  task_privacy: '',
                  list_id: '',
                  order: ''
                },
                callback: false
              };
            var args = jQuery.extend(true, pre_define, args);

            var request_data = {
                url: self.base_url + '/pm/v2/projects/'+self.project_id+'/tasks/'+args.data.task_id,
                type: 'PUT',
                data: args.data,
                success (res) {
                    self.addTaskMeta(res.data);
                    
                    self.$store.commit('afterUpdateTask', {
                        list_id: args.data.list_id,
                        task: res.data
                    });

                    // Display a success toast, with a title
                    toastr.success(res.data.success);                    
                    self.showHideTaskFrom(false, self.list, self.task );
                    if ( typeof args.callback === 'function' ) {
                      args.callback.call ( self, res );
                    }

                },

                error (res) {
                    // Showing error
                    res.data.error.map( function( value, index ) {
                        toastr.error(value);
                    });

                    if ( typeof args.callback === 'function' ) {
                      args.callback.call ( self,  res );
                    }
                }
            }
            
            self.httpRequest(request_data);
        },

        /**
         * Update Task using Task object 
         * @param  {Object} task Task Object
         * @return {void}      Update a task
         */
        modifyTask ( task ){
        	if(typeof task.id === 'undefined' ){
        		return ;
        	}
        	var args = {
          		data : task
          	}

          	this.updateTask ( args );
        },

        addComment(args){
           var self      = this,
              pre_define = {
                data: {
                  id: false,
                  commentable_id: '',
                  content: '',
                  commentable_type: '',
                  deleted_files: [],
                  files: [],
                },
                callback: false
              };
            var args = jQuery.extend(true, pre_define, args);
            var data = new FormData();

            data.append( 'content', args.data.content );
            data.append( 'commentable_id', args.data.commentable_id );
            data.append( 'commentable_type', args.data.commentable_type );

            args.data.deleted_files.map(function(del_file) {
                data.append('files_to_delete[]', del_file);
            });

            args.data.files.map(function(file) {
                if ( typeof file.attachment_id === 'undefined' ) {
                  var decode = self.dataURLtoFile(file.thumb, file.name);
                  data.append( 'files[]', decode );
                }
            });

            var request_data = {
                url: self.base_url + '/pm/v2/projects/'+self.project_id+'/comments',
                type: "POST",
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                success (res) { 
                  self.addListCommentMeta(res.data);
                  self.$root.$emit( 'after_comment' );
                  if( typeof args.callback === 'function'){
                    args.callback.call(self, res)
                  }
                      
                },
                error (res) {
                  if( typeof args.callback === 'function'){
                    args.callback.call(self, res)
                  }
                }
              }

              self.httpRequest(request_data);
        },

        updateComment(args){
          var self      = this,
              pre_define = {
                data: {
                  id: false,
                  commentable_id: '',
                  content: '',
                  commentable_type: '',
                  deleted_files: [],
                  files: [],
                },
                callback: false
              };
            var args = jQuery.extend(true, pre_define, args);
            var data = new FormData();

            data.append( 'content', args.content );
            data.append( 'commentable_id', args.commentable_id );
            data.append( 'commentable_type', args.commentable_type );
            if(typeof args.deleted_files !== 'undefined' ){
                args.deleted_files.map(function(del_file) {
                    data.append('files_to_delete[]', del_file);
                });
            }
            
              
            if(typeof args.files !== 'undefined' ){
                args.files.map(function(file) {
                    if ( typeof file.attachment_id === 'undefined' ) {
                      var decode = self.dataURLtoFile(file.thumb, file.name);
                      data.append( 'files[]', decode );
                    }
                });
            }

            var request_data = {
                url: self.base_url + '/pm/v2/projects/'+self.project_id+'/comments/'+args.id,
                type: "POST",
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                success (res) { 
                  self.addListCommentMeta(res.data);
                  self.$root.$emit( 'after_comment' );
                  if( typeof args.callback === 'function'){
                    args.callback.call(self, res)
                  }
                      
                },
                error (res) {
                  if( typeof args.callback === 'function'){
                    args.callback.call(self, res)
                  }
                }
              }

              self.httpRequest(request_data);
        },

        /**
         * Show and Hide list form for new and update
         * @param  {[String/boolean]} status [description]
         * @param  {[Object]} list   [Tasl List object for edit]
         * @return {[type]}        [description]
         */
        showHideListForm ( status, list ) {
            var list   = list || false,
                list   = jQuery.isEmptyObject(list) ? false : list;

            if ( list ) {
                if ( status === 'toggle' ) {
                    list.edit_mode = list.edit_mode ? false : true;
                } else {
                    list.edit_mode = status;
                }
            } else {
                this.$store.commit('showHideListFormStatus', status);
            }
        },

        /**
         * Show task edit form
         * 
         * @param  int task_index 
         * 
         * @return void            
         */
        showHideTaskFrom (status, list, task ) {
            var list = list || false;
            var task = task || false;
            
            if ( task ) {
                if ( status === 'toggle' ) {
                    task.edit_mode = task.edit_mode ? false : true; 
                } else {
                    task.edit_mode = status;
                }
            }
            
            if (list) {
                if ( status === 'toggle' ) {
                    list.show_task_form = list.show_task_form ? false : true; 
                } else {
                    list.show_task_form = status;
                }
                
            }
        },

        /**
         * List pagination set current page Number
         */
        setCurrentPageNumber () {
            var current_page_number = this.$route.params.current_page_number 
                ? this.$route.params.current_page_number : 1;
            this.current_page_number = current_page_number;
            
            return current_page_number;
        },

        /**
         * Adding task list meta for edit mode
         * @param {[Object]} list [Task list Object]
         */
        addMetaList ( list ) {
            list.edit_mode  = false;
            list.show_task_form = false;
            list.task_loading_status = false;
        },

        /**
         * addTaskMeta for task edit mode
         * @param {[Object]} task [Task Object]
         */
        addTaskMeta (task ) {
            task.edit_mode = false;
        },

        /**
         * comment meta for edit mode
         * @param {Object} comment Task comment
         */
        addListCommentMeta (comment) {
            comment.edit_mode = false;
        },

        /**
         * Show and hide comment form
         * @param  {Object} comment Comment Object
         * @return {void}         
         */
        showHideListCommentEditForm (comment) {
            comment.edit_mode = comment.edit_mode ? false : true; 
        },

        /**
         * private task class for lock
         * @param  {Object} list task list
         * @return {String}      pm-lock
         */
        privateClass(list ) {
            return list.private == 'on' ? 'pm-lock' : '';
        },

        /**
         * Incomplete task load more Button
         * @param  {[Object]}  list [Task List object]
         * @return {Boolean}      [description]
         */
        isIncompleteLoadMoreActive ( list ) {
            if (typeof list.incomplete_tasks === 'undefined') {
                return false;
            }

            var count_tasks = list.meta.total_incomplete_tasks;
            var total_set_task = list.incomplete_tasks.data.length;
            if (total_set_task === count_tasks) {
                return false;
            }

            return true;
        },

        /**
         * Load More Incomplete task
         * @param  {[Object]} list Task List
         * @return {[viod]}      [More Task]
         */
        loadMoreIncompleteTasks (list) {

            if ( list.task_loading_status ) {
                return;
            }
            var self = this;
            list.task_loading_status = true;

            var total_tasks = list.meta.total_incomplete_tasks;
            var per_page = this.getSettings('incomplete_tasks_per_page', 10);
            var current_page = Math.ceil(list.incomplete_tasks.data.length/per_page);
            
            var args ={
            	condition: {
	                with: 'incomplete_tasks',
	                incomplete_task_page: current_page+1,
	            },
	            list_id: list.id,
	            callback: function ( res ){
	            	self.$store.commit('setTasks', res.data);
	            	list.task_loading_status = false;
	            }
            } ;
            
            this.getList( args );
        },

        /**
         * Complete task load more Button
         * @param  {[Object]}  list [Task List object]
         * @return {Boolean}      [description]
         */
        isCompleteLoadMoreActive (list) {
            if (typeof list.complete_tasks === 'undefined') {
                return false;
            }

            var count_tasks = list.meta.total_complete_tasks;
            var total_set_task = list.complete_tasks.data.length;

            if (total_set_task === count_tasks) {
                return false;
            }

            return true;
        },

        /**
         * Load More Incomplete task
         * @param  {[Object]} list Task List
         * @return {[viod]}      [More Task]
         */
        loadMoreCompleteTasks (list) {

            if ( list.task_loading_status ) {
                return;
            }
            
            list.task_loading_status = true;

            var total_tasks = list.meta.total_complete_tasks;
            var per_page = this.getSettings('complete_tasks_per_page', 10);
            var current_page = Math.ceil(list.complete_tasks.data.length/per_page);
            
            var args ={
            	condition: {
	                with: 'complete_tasks',
	                complete_task_page: current_page+1,
	            },
	            list_id: list.id,
	            callback: function ( res ){
	            	this.$store.commit('setTasks', res.data);
	            	list.task_loading_status = false;
	            }
            } ;

            this.getList( args );
        },

         /**
         * WP settings date format convert to moment date format with time zone
         * 
         * @param  string date 
         * 
         * @return string      
         */
        dateFormat ( date ) {
            if ( !date ) {
                return;
            }

            moment.tz.add(PM_Vars.time_zones);
            moment.tz.link(PM_Vars.time_links);

            date = new Date(date);
            date = moment(date).format('YYYY-MM-DD');
            
            var format = 'MMMM DD YYYY';
            
            if ( PM_Vars.wp_date_format == 'Y-m-d' ) {
                format = 'YYYY-MM-DD';
            
            } else if ( PM_Vars.wp_date_format == 'm/d/Y' ) {
                format = 'MM/DD/YYYY';
            
            } else if ( PM_Vars.wp_date_format == 'd/m/Y' ) {
                format = 'DD/MM/YYYY';
            } 

            return moment.tz( date, PM_Vars.wp_time_zone ).format(format);
        },

        /**
         * WP settings date format convert to moment date format with time zone
         * 
         * @param  string date 
         * 
         * @return string      
         */
        shortDateFormat ( date ) {
            if ( date == '' ) {
                return;
            }

            moment.tz.add(PM_Vars.time_zones);
            moment.tz.link(PM_Vars.time_links);
            
            var format = 'MMM DD';

            return moment.tz( date, PM_Vars.wp_time_zone ).format( String( format ) );
        },

        /**
         * WP settings date time format convert to moment date format with time zone
         * 
         * @param  string date 
         * 
         * @return string      
         */
        dateTimeFormat ( date ) {
            if ( date == '' ) {
                return;
            }

            moment.tz.add(PM_Vars.time_zones);
            moment.tz.link(PM_Vars.time_links);
            
            var date_format = 'MMMM DD YYYY',
                time_format = 'h:mm:ss a';
            
            if ( PM_Vars.wp_date_format == 'Y-m-d' ) {
                date_format = 'YYYY-MM-DD';
            
            } else if ( PM_Vars.wp_date_format == 'm/d/Y' ) {
                date_format = 'MM/DD/YYYY';
            
            } else if ( PM_Vars.wp_date_format == 'd/m/Y' ) {
                date_format = 'DD/MM/YYYY';
            } 

            if ( PM_Vars.wp_time_format == 'g:i a' ) {
                time_format = 'h:m a';
            
            } else if ( PM_Vars.wp_time_format == 'g:i A' ) {
                time_format = 'h:m A';
            
            } else if ( PM_Vars.wp_time_format == 'H:i' ) {
                time_format = 'HH:m';
            } 

            var format = String( date_format+', '+time_format );

            return moment.tz( date, PM_Vars.wp_time_zone ).format( format );
        },

        /**
         * Get index from array object element
         * 
         * @param   array 
         * @param   id    
         * 
         * @return  int      
         */
        getIndex ( array,  id, slug) {
            var target = false;

            array.map(function(content, index) {
                if ( content[slug] == id ) {
                    target = index;
                }
            });

            return target;
        },

        /**
         * ISO_8601 Date format convert to moment date format
         * 
         * @param  string date 
         * 
         * @return string      
         */
        dateISO8601Format ( date ) {
            return moment( date ).format();
        },

        /**
         * Task Order for sortable 
         * @param  {[Object]}   data     Data order
         * @param  {Function} callback 
         * @return {Void}            
         */
        taskOrder (data, callback) {

            var self = this;
            
            var request_data = {
                url: self.base_url + '/pm/v2/projects/1/tasks/reorder',
                type: 'PUT',
                data: data,
                
                success (res) {
                    // Display a success toast, with a title
                    //toastr.success(res.data.success);

                    if (typeof callback !== 'undefined') {
                        callback(res);
                    }
                },

                error (res) {

                    // Showing error
                    res.data.error.map( function( value, index ) {
                        toastr.error(value);
                    });
                    
                }
            }
            
            self.httpRequest(request_data);
        },

        /**
         * Show hide todo-list edit form
         * 
         * @param  int comment_id 
         * 
         * @return void            
         */
        showHideTaskCommentEditForm ( task, comment_id ) {
            var list_index    = this.getIndex( this.$store.state.lists, task.post_parent, 'ID' ),
                task_index    = this.getIndex( this.$store.state.lists[list_index].tasks, task.ID, 'ID' ),
                comment_index = this.getIndex( this.task.comments, comment_id, 'comment_ID' ) ,
                self          = this;

            var edit_mode = this.task.comments[comment_index].edit_mode;
            
            if ( edit_mode ) {
                PM_Component_jQuery.slide( comment_id, function() {
                    //self.$store.commit( 'showHideTaskCommentEditForm', { list_index: list_index, task_index: task_index, comment_index: comment_index } );
                    self.task.comments[comment_index].edit_mode = false;    
                    
                });
            
            } else {
                //self.$store.commit( 'showHideTaskCommentEditForm', { list_index: list_index, task_index: task_index, comment_index: comment_index } );    
                self.task.comments[comment_index].edit_mode = true;

                Vue.nextTick( function() {
                    PM_Component_jQuery.slide( comment_id );
                } );
            }
        },


        /**
         * Get current project users by role
         * 
         * @param  string role 
         * 
         * @return array     
         */
        get_porject_users_by_role ( role ) {
            return this.$store.state.project_users.filter(function( user ) {
                return ( user.role == role ) ? true : false;
            });
        },

        /**
         * Get current project users by role
         * 
         * @param  string role 
         * 
         * @return array     
         */
        get_porject_users_id_by_role ( role ) {
            var ids = [];
            
            this.$store.state.project_users.map(function(user) {
                if ( user.role == role ) {
                    ids.push(user.id);
                } 

                if ( typeof role == 'undefined' ) {
                    ids.push(user.id);
                }
            });

            return ids;
        },

        /**
         * Get user information from task assigned user id
         *  
         * @param  array assigned_user 
         * 
         * @return obje               
         */
        getUsers ( assigned_user ) {
            if ( ! assigned_user ) {
                return [];
            }
            var filtered_users = [];
            
            var assigned_to = assigned_user.map(function (id) {
                    return parseInt(id);
                });


            filtered_users = this.$store.state.project_users.filter( function (user) {
                return ( assigned_to.indexOf( parseInt(user.id) ) >= 0 );
            });

            return filtered_users;
        },

        /**
         * CSS class for task date
         * 
         * @param  string start_date 
         * @param  string due_date   
         * 
         * @return string            
         */
        taskDateWrap ( due_date ) {
            if ( !due_date ) {
                return false;
            }

            due_date = new Date(due_date);
            due_date = moment(due_date).format('YYYY-MM-DD');

            if ( ! moment( due_date ).isValid() ) {
                return false;
            }

            moment.tz.add(PM_Vars.time_zones);
            moment.tz.link(PM_Vars.time_links);

            var today   = moment.tz( PM_Vars.wp_time_zone ).format( 'YYYY-MM-DD' ),
                due_day = moment.tz( due_date, PM_Vars.wp_time_zone ).format( 'YYYY-MM-DD' );
            
            
            return moment(today).isSameOrBefore(due_day) ? 'pm-current-date' : 'pm-due-date';
        },

        /**
         * class for completed task wrap div
         * @param  {date} due_date complete date
         * @return {String}          wrapper Class
         */
        completedTaskWrap ( due_date ) {
            if ( !due_date ) {
                return false;
            }

            due_date = new Date(due_date);
            due_date = moment(due_date).format('YYYY-MM-DD');

            if ( ! moment( due_date ).isValid() ) {
                return false;
            }

            moment.tz.add(PM_Vars.time_zones);
            moment.tz.link(PM_Vars.time_links);

            var today   = moment.tz( PM_Vars.wp_time_zone ).format( 'YYYY-MM-DD' ),
                due_day = moment.tz( due_date, PM_Vars.wp_time_zone ).format( 'YYYY-MM-DD' );
            
            return moment(today).isSameOrBefore(due_day) ? false : 'pm-task-done';
        },

        /**
         * Showing (-) between task start date and due date
         * 
         * @param  string  task_start_field 
         * @param  string  start_date       
         * @param  string  due_date         
         * 
         * @return Boolean                  
         */
        isBetweenDate ( task_start_field, start_date, due_date ) {
            if ( task_start_field && !start_date && !due_date ) {
                return true;
            }
            
            return false;
        },

        /**
         * Mark task done and undone
         * 
         * @param  int  task_id    
         * @param  Boolean is_checked 
         * @param  int  task_index 
         * 
         * @return void             
         */
        taskDoneUndone ( task, is_checked, list ) {
            var self = this;
            var url  = self.base_url + '/pm/v2/projects/'+self.project_id+'/tasks/'+task.id;
            var type = 'PUT'; 

            var form_data = {
                'status': is_checked ? 1 : 0
            }
            var request_data = {
                url: url,
                type: type,
                data: form_data,
                success ( res ) {
                    self.$store.commit( 'afterTaskDoneUndone', {
                        status: is_checked,
                        task: res.data,
                        list_id: list.id,
                        task_id: task.id
                    });
                    if ( self.$store.state.is_single_list ) {
                        // var condition = 'incomplete_tasks,complete_tasks,comments';
                        // self.getList(self, self.list.id, condition);
                    } else {
                        //self.getList(self, self.list.id );
                    }
                },
            }
            
            self.httpRequest( request_data );
               
        },
        /**
         * Checking empty object
         * @param  {Object}  obj 
         * @return {Boolean}     
         */
        isEmptyObject ( obj ) {
            return Object.keys(obj).length === 0;
        },

        /**
         * Single Task Poppu mutation setup
         * @param  {object} task Task Object
         * @param  {Object} list List object
         * @return {[type]}      [description]
         */
        singleTask ( task, list ) {
            this.$store.commit( 'single_task_popup', { task: task } );
        },

        /**
         * List templete action to show hide blank templete
         * @return {[type]} [description]
         */
        listTemplateAction () {
            var lists = this.$store.state.lists, blank, listTmpl;

            if(lists.length){
                blank = false; listTmpl = true;
            }else{
                blank = true; listTmpl = false;
            }
            this.$store.commit('balankTemplateStatus', blank);
            this.$store.commit('listTemplateStatus', listTmpl);

        }
	}
}

export default Vue.mixin(PM_TaskList_Mixin);