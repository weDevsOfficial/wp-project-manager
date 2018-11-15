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

        task_start_field () {
            if (!PM_Vars.is_pro) {
                return false;
            }

           return this.getSettings('task_start_field', false);
        },

        /**
         * Check is todo-list single or not
         * 
         * @return Boolean
         */
        is_single_list () {
            return this.$store.state.projectTaskLists.is_single_list;
        },

        /**
         * Check is task single or not
         * 
         * @return Boolean
         */
        is_single_task () {
            return this.$store.state.projectTaskLists.is_single_task;
        },
        can_create_list () {
            return this.user_can("create_list");
        },
        can_create_task () {
            return this.user_can("create_task");
        },
        isArchivedPage () {
            return this.$route.name == 'task_lists_archive' || this.$route.name == 'task_lists_archive_pagination'
        }

    },

    methods: {
        // ...pm.Vuex.mapMutations('projectTaskLists',
        //     [
        //         'setLists',
        //         'setListsMeta',
        //         'afterNewList',
        //         'afterNewListupdateListsMeta',
        //         'afterDeleteList',
        //         'afterNewTask',
        //         'afterUpdateTask',
        //         'projectTaskLists',
        //         'showHideListFormStatus',
        //         'single_task_popup',
        //         'balankTemplateStatus',
        //         'listTemplateStatus', 
        //         'setTasks',

        //         'afterUpdateList'
        //     ]
        // ),
        can_complete_task (task) {
            if (this.isArchivedTaskList(task)) {
                return true;
            }
            return !task.meta.can_complete_task;
        },
        can_edit_task_list (list) {
            
            var user = PM_Vars.current_user;
            if (this.is_manager()) {
                return true;
            }

            if ( list.creator.data.id == user.ID ){
                return true;
            }

            return false;
        },
        can_edit_task (task) {
            var user = PM_Vars.current_user;
            if (this.is_manager()) {
                return true;
            }

            if ( task.creator.data.id == user.ID ){
                return true;
            }

            return false;
        },

        isInboxList (id) {
           return this.isInbox(id);
        },

        isInbox (id) {
            return this.$store.state.project.list_inbox == id & 1;  
        },

        getInboxId () {
            return this.$store.state.project.list_inbox;
        },

        isArchivedList (list) {
            if (list.status === 'archived' ) {
                return true;
            }

            return false;
        },
        isArchivedTaskList (task) {
            if (typeof task.task_list !== 'undefined' ) {
                if (task.task_list.data.status === 'archived' ) {
                    return true;
                }
            }
            return false;
        },
        /**
         * Get task completed progress width
         * 
         * @param  array tasks 
         * 
         * @return obj       
         */
        getProgressStyle: function( list ) {
            if ( typeof list == 'undefined' ) {
                return 0;
            }
            var width = this.getProgressPercent( list );

            return { width: width+'%' };
        },

        /**
         * Get task completed percentage from todo list
         * 
         * @param  array tasks
         *  
         * @return float       
         */
        getProgressPercent: function( list ) {
            
            if (typeof list ==  'undefined') {
                return 0;
            }
            
            var total_tasks     = parseInt(list.meta.total_incomplete_tasks) + parseInt(list.meta.total_complete_tasks), //tasks.length,
                completed_tasks = list.meta.total_complete_tasks, //this.countCompletedTasks( list ),
                progress        = ( 100 * completed_tasks ) / total_tasks;

            return isNaN( progress ) ? 0 : progress.toFixed(0);
        },


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
                    with: 'incomplete_tasks,complete_tasks',
                    per_page: this.getSettings('list_per_page', 10),
                    page: this.setCurrentPageNumber()
                },
                callback: false,
            };

            var args = jQuery.extend(true, pre_define, args );
            
            var conditionobject = pm_apply_filters( 'before_get_task_list', args.condition );
            var condition = this.generateConditions(conditionobject);

            var request = {
                url: self.base_url + '/pm/v2/projects/'+self.$route.params.project_id+'/task-lists?'+condition,
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
                    self.$root.$store.state.projectTaskListLoaded = true;
                    self.$store.commit('projectTaskLists/setLists', res.data);
                    self.$store.commit('projectTaskLists/setListsMeta', res.meta.pagination);

                    self.listTemplateAction();
                  
                    if ( typeof args.callback === 'function' ) {
                        args.callback.call (self, res.data);
                    }
                },
                error (res) {
                    res.responseJSON.message.map( function( value, index ) {
                        pm.Toastr.error(value);
                    });
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
                    pm.NProgress.done();
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
                  order: 0
                },
                callback: false,
            },
            args = jQuery.extend(true, pre_define, args );
            var data = pm_apply_filters( 'before_task_list_save', args.data );
            var request_data = {
                url: self.base_url + '/pm/v2/projects/'+self.project_id+'/task-lists',
                data: data,
                type: 'POST',
                success (res) {
                    self.addMetaList(res.data);
                    res.data.incomplete_tasks = {data: []};
                    self.$store.commit('projectTaskLists/afterNewList', res.data);
                    self.$store.commit('projectTaskLists/afterNewListupdateListsMeta');
                    self.$store.commit('updateProjectMeta', 'total_task_lists');
                    self.$store.commit('updateProjectMeta', 'total_activities');
                    self.showHideListForm(false);
                    pm.Toastr.success(res.message);

                    if( typeof args.callback === 'function' ) {
                        args.callback.call( self,  res );
                    }
                    
                    pmBus.$emit('pm_after_create_list', res);
                },

                error (res) {
                    // Showing error
                    if (res.status == 500 ) {
                        res.responseJSON.message.map( function( value, index ) {
                            pm.Toastr.error(value);
                        });
                    }

                    if ( res.status == 400 ) {
                        var params = res.responseJSON.data.params;
                        for ( var obj in params ){
                            pm.Toastr.error(params[obj][0]);
                        }
                    }

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
                    id: 0,
                },
                callback: false,
            };
            var args = jQuery.extend(true, pre_define, args );
            var data = pm_apply_filters( 'before_task_list_save', args.data );
            var request_data = {
                url: self.base_url + '/pm/v2/projects/'+self.project_id+'/task-lists/'+ data.id+'/update',
                data: data,
                type: 'POST',
                success (res) {
                    self.addMetaList(res.data);
                    pm.Toastr.success(res.message);
                    
                    self.$store.commit( 'projectTaskLists/afterUpdateList', res.data);
                    self.showHideListForm(false, self.list);

                    if( typeof args.callback === 'function' ) {
                        args.callback.call( self,  res );
                    }
                    self.$store.commit('updateProjectMeta', 'total_activities');
                    pmBus.$emit('pm_after_update_list', res);
                },
                error (res) {
                    // Showing error
                    if (res.status == 500 ) {
                        res.responseJSON.message.map( function( value, index ) {
                            pm.Toastr.error(value);
                        });
                    }

                    if ( res.status == 400 ) {
                        var params = res.responseJSON.data.params;
                        for ( var obj in params ){
                            pm.Toastr.error(params[obj][0]);
                        }
                    }

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
            if ( ! confirm( this.__( 'Are you sure?', 'wedevs-project-manager') ) ) {
                return;
            }
            var self = this,
            pre_define = {
                list_id : false,
                callback: false,
            },
            args = jQuery.extend(true, pre_define, args);


            var request_data = {
                url: self.base_url + '/pm/v2/projects/'+self.project_id+'/task-lists/' + args.list_id +'/delete',
                type: 'POST',
                success: function(res) {
                    self.$store.commit( 'projectTaskLists/afterDeleteList', args.list_id );
                    pm.Toastr.success(res.message);
                    self.listTemplateAction();
                    self.$store.commit('decrementProjectMeta', 'total_task_lists');
                    self.$store.commit('updateProjectMeta', 'total_activities');
                    if( typeof args.callback === 'function' ) {
                      args.callback.call( self, res);
                    }
                },
                error (res) {
                    res.responseJSON.message.map( function( value, index ) {
                        pm.Toastr.error(value);
                    });
                }
            }
            if ( args.list_id ) {
                self.httpRequest(request_data);
            }
        },

        /**
         * Retrive a single list 
         * @param  {object}   args     condition and list id
         * @param  {Function} callback [description]
         * @return {void}            [description]
         */
        getTask ( args ) {
            var self = this, 
                project_id = typeof this.$route.params.project_id == 'undefined' 
                    ? args.project_id 
                    : this.$route.params.project_id;

            var pre_define = {
                condition: {
                    with: '', 
                },
                task_id: false,
                project_id: project_id,
                callback: false,
            };

            var args = jQuery.extend(true, pre_define, args );
            var  condition = self.generateConditions(args.condition);

            var request = {
                type: 'GET',
                url: self.base_url + '/pm/v2/projects/'+args.project_id+'/tasks/'+args.task_id+'?'+condition,
                success (res) {
                    if ( typeof args.callback === 'function' ) {
                        args.callback.call ( self, res );
                    }
                    pm.NProgress.done();
                }
            };

            if(args.task_id){
                self.httpRequest(request);
            }
            
        },

        /**
         * Insert  task
         * 
         * @return void
         */
        addTask ( args, list ) {
            var self      = this,
            list = list || {},
            pre_define = {
                data: {
                   
                },
                callback: false
            },
            args = jQuery.extend(true, pre_define, args);
            
            if(typeof args.data.board_id == 'undefined') {
                args.data.board_id = this.getInboxId();
                args.data.list_id = this.getInboxId();
            }
            
            var data = pm_apply_filters( 'before_task_save', args.data );
            
            var request_data = {
                url: self.base_url + '/pm/v2/projects/'+self.project_id+'/tasks',
                type: 'POST',
                data: data,
                success (res) {
                    self.addTaskMeta(res.data);
                    self.$store.commit( 'projectTaskLists/afterNewTask',
                        {
                            list_id: args.data.list_id,
                            task: res.data,
                            list: list
                        }
                    );

                    self.$store.commit('updateProjectMeta', 'total_activities');
                    // Display a success toast, with a title
                    pm.Toastr.success(res.message);                    
                    self.showHideTaskFrom(false, self.list, self.task );
                    if ( typeof args.callback === 'function' ) {
                        args.callback.call ( self, res );
                    }

                    pmBus.$emit('pm_after_create_task', res, args);

                },

                error (res) {
                    // Showing error
                    if (res.status == 500 ) {
                        res.responseJSON.message.map( function( value, index ) {
                            pm.Toastr.error(value);
                        });
                    }

                    if ( res.status == 400 ) {
                        var params = res.responseJSON.data.params;
                        for ( var obj in params ){
                            pm.Toastr.error(params[obj][0]);
                        }
                    }

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
                    project_id: self.project_id ? self.project_id : '',
                },
                callback: false
            };
            var args = jQuery.extend(true, pre_define, args);
            var data = pm_apply_filters( 'before_task_save', args.data );
            
            var request_data = {
                url: self.base_url + '/pm/v2/projects/'+args.data.project_id+'/tasks/'+args.data.task_id+'/update',
                type: 'POST',
                data: data,
                success (res) {
                    self.addTaskMeta(res.data);

                    self.$store.commit( 'projectTaskLists/afterUpdateTask',  {
                        list_id: args.data.list_id,
                        task: res.data
                    });
                    self.$store.commit('updateProjectMeta', 'total_activities');
                    // Display a success toast, with a title
                    pm.Toastr.success(res.message);                    
                    self.showHideTaskFrom(false, self.list, self.task );
                    if ( typeof args.callback === 'function' ) {
                        args.callback.call ( self, res );
                    }

                    pmBus.$emit('pm_after_update_task', res, args);
                },

                error (res) {
                    // Showing error
                    if (res.status == 500) {
                        res.responseJSON.message.map( function( value, index ) {
                            pm.Toastr.error(value);
                        });
                    }
                    if ( res.status == 400 ) {
                        var params = res.responseJSON.data.params;
                        for ( var obj in params ){
                            pm.Toastr.error(params[obj][0]);
                        }
                    }

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

        deleteTask (args) {
            if ( ! confirm( this.__( 'Are you sure?', 'wedevs-project-manager') ) ) {
                return;
            }

            var self      = this,
            pre_define = {
                callback: false
            };
            var args = jQuery.extend(true, pre_define, args);

            var request_data = {
                url: self.base_url + '/pm/v2/projects/'+self.project_id+'/tasks/' + args.task.id + '/delete',
                type: 'POST',
                success (res) {
                    self.$store.commit( 'projectTaskLists/afterDeleteTask', {
                        'task': args.task,
                        'list': args.list 
                    });
                    pm.Toastr.success(res.message);
                    self.$store.commit('updateProjectMeta', 'total_activities');
                    if ( typeof args.callback === 'function' ){
                        args.callback.call(self, res);
                    }
                },
                error (res) {
                    res.responseJSON.message.map( function( value, index ) {
                        pm.Toastr.error(value);
                    });
                }
            }
            this.httpRequest(request_data);
        },

        addComment ( args ) {
            var self      = this,
            project_id    = '',
            pre_define = {
                data: {
                },
                callback: false
            };
            var args = jQuery.extend(true, pre_define, args);
            var data = new FormData();

            if (self.project_id){
                project_id = self.project_id;
            } else {
                project_id = args.data.project_id;
            }

            data.append( 'content', args.data.content );
            data.append( 'mentioned_users', args.data.mentioned_users );
            data.append( 'commentable_id', args.data.commentable_id );
            data.append( 'commentable_type', args.data.commentable_type );
            data.append( 'notify_users', args.data.notify_users );

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
                url: self.base_url + '/pm/v2/projects/'+ project_id +'/comments',
                type: "POST",
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                success (res) { 
                    self.addListCommentMeta(res.data);
                    self.$root.$emit( 'after_comment' );
                    pm.Toastr.success(res.message);
                    self.$store.commit('updateProjectMeta', 'total_activities');
                    if( typeof args.callback === 'function'){
                        args.callback.call(self, res)
                    }
                  
                },
                error (res) {
                    if (res.status == 500) {

                        res.responseJSON.message.map( function( value, index ) {
                            pm.Toastr.error(value);
                        });
                    }
                    if ( res.status == 400 ) {
                        var params = res.responseJSON.data.params;
                        for ( var obj in params ){
                            pm.Toastr.error(params[obj][0]);
                        }
                    }
                    if( typeof args.callback === 'function'){
                        args.callback.call(self, res)
                    }
                }
            }

            self.httpRequest(request_data);
        },

        updateComment ( args ) {
            var self      = this,
            project_id = '',
            pre_define = {
                data: {
                },
                callback: false
            };
            var args = jQuery.extend(true, pre_define, args);
            var data = new FormData();
            if (self.project_id){
                project_id = self.project_id;
            } else {
                project_id = args.data.project_id;
            }
            data.append( 'content', args.data.content );
            data.append( 'mentioned_users', args.data.mentioned_users );
            data.append( 'commentable_id', args.data.commentable_id );
            data.append( 'commentable_type', args.data.commentable_type );
            data.append( 'notify_users', args.data.notify_users );

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
                url: self.base_url + '/pm/v2/projects/'+project_id+'/comments/'+args.data.id,
                type: "POST",
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                success (res) { 
                    self.addListCommentMeta(res.data);
                    pm.Toastr.success(res.message);
                    self.$root.$emit( 'after_comment' );
                    self.$store.commit('updateProjectMeta', 'total_activities');
                    if( typeof args.callback === 'function'){
                        args.callback.call(self, res)
                    }
                  
                },
                error (res) {
                    if (res.status == 500 ) {
                        res.responseJSON.message.map( function( value, index ) {
                            pm.Toastr.error(value);
                        });
                    }
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

            if ( list && typeof list.edit_mode != 'undefined' ) {
                if ( status === 'toggle' ) {
                    this.$store.commit( 'projectTaskLists/showHideListFormStatus', {
                        status: list.edit_mode ? false : true,
                        list: list
                    });
                } else {
                    this.$store.commit( 'projectTaskLists/showHideListFormStatus', {
                        status: status,
                        list: list
                    });
                }
            } else {
                this.$store.commit( 'projectTaskLists/showHideListFormStatus', {
                    status: status,
                    list: false
                });
            }
        },

        /**
         * Show task edit form
         * 
         * @param  int task_index 
         * 
         * @return void            
         */
        showHideTaskFrom ( status, list, task ) {
            var list = list || false;
            var task = task || false;
            
            if ( task ) {
                if ( status === 'toggle' ) {
                    task.edit_mode = !task.edit_mode;
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
            var current_page_number = this.$route.params.current_page_number ? this.$route.params.current_page_number : 1;
            this.current_page_number = current_page_number;

            return current_page_number;
        },

        /**
         * Adding task list meta for edit mode
         * @param {[Object]} list [Task list Object]
         */
        addMetaList ( list ) {
            let ids = this.$store.state.projectTaskLists.expandListIds;
            list.edit_mode  = false;
            list.show_task_form = false;
            list.task_loading_status = false;
            list.expand = ids.findIndex(x => x == list.id) === -1;
            list.moreMenu = false;
        },

        /**
         * addTaskMeta for task edit mode
         * @param {[Object]} task [Task Object]
         */
        addTaskMeta ( task ) {
            task.edit_mode = false;   
            task.moreMenu = false;
        },

        /**
         * comment meta for edit mode
         * @param {Object} comment Task comment
         */
        addListCommentMeta ( comment ) {
            comment.edit_mode = false;
        },

        /**
         * Show and hide comment form
         * @param  {Object} comment Comment Object
         * @return {void}         
         */
        showHideListCommentEditForm ( comment ) {
            comment.edit_mode = comment.edit_mode ? false : true; 
        },
        
        /**
         * Incomplete task load more Button
         * @param  {[Object]}  list [Task List object]
         * @return {Boolean}      [description]
         */
        isIncompleteLoadMoreActive ( list ) {
            
            if(typeof this.$route.query.filterTask != 'undefined') {
                if(this.$route.query.filterTask == 'active') {
                    //if(this.$route.query.status == 'complete') {
                        
                        return false;
                    //}
                }
            }

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
        loadMoreIncompleteTasks ( list ) {
            if ( list.task_loading_status ) {
                return;
            }
            var self = this;
            list.task_loading_status = true;

            var total_tasks = list.meta.total_incomplete_tasks;
            var per_page = this.getSettings ( 'incomplete_tasks_per_page', 10 );
            var current_page = Math.ceil ( list.incomplete_tasks.data.length/per_page );

            var args ={
                condition: {
                    with: 'incomplete_tasks',
                    incomplete_task_page: current_page+1,
                },
                list_id: list.id,
                callback: function ( res ){
                    self.$store.commit( 'projectTaskLists/setTasks', res.data );
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
        isCompleteLoadMoreActive ( list ) {
            if (typeof list.complete_tasks === 'undefined') {
                return false;
            }
            var count_tasks = list.meta.total_complete_tasks;
            var total_set_task = list.complete_tasks.data.length;
            if ( total_set_task === count_tasks ) {
                return false;
            }
            return true;
        },

        /**
         * Load More Incomplete task
         * @param  {[Object]} list Task List
         * @return {[viod]}      [More Task]
         */
        loadMoreCompleteTasks ( list ) {

            if ( list.task_loading_status ) {
                return;
            }

            list.task_loading_status = true;

            var total_tasks = list.meta.total_complete_tasks;
            var per_page = this.getSettings( 'complete_tasks_per_page', 10 );
            var current_page = Math.ceil ( list.complete_tasks.data.length/per_page );

            var args ={
                condition: {
                    with: 'complete_tasks',
                    complete_task_page: current_page+1,
                },
                list_id: list.id,
                callback: function ( res ){
                    this.$store.commit( 'projectTaskLists/setTasks', res.data);
                    list.task_loading_status = false;
                }
            } ;

            this.getList( args );
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
            var format = 'MMM DD';

            return pm.Moment( date ).format( String( format ) );
        },

        /**
         * WP settings date time format convert to pm.Moment date format with time zone
         * 
         * @param  string date 
         * 
         * @return string      
         */
        dateTimeFormat ( date ) {
            if ( date == '' ) {
                return;
            }

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

            return pm.Moment( date, ).format( format );
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
         * Task Order for sortable 
         * @param  {[Object]}   data     Data order
         * @param  {Function} callback 
         * @return {Void}            
         */
        taskOrder ( taskOrders ) {
            this.taskReceive(taskOrders);
        },

        /**
         * Show hide todo-list edit form
         * 
         * @param  int comment_id 
         * 
         * @return void            
         */
        showHideTaskCommentEditForm ( task, comment_id ) {
            var list_index = this.getIndex( this.$store.state.projectTaskLists.lists, task.post_parent, 'ID' ),
            task_index    = this.getIndex( this.$store.state.projectTaskLists.lists[list_index].tasks, task.ID, 'ID' ),
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

                pm.Vue.nextTick( function() {
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
            return this.$store.state.projectTaskLists.project_users.filter(function( user ) {
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

            this.$store.state.projectTaskLists.projectTaskLists.project_users.map(function(user) {
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

            filtered_users = this.$store.state.projectTaskLists.projectTaskLists.project_users.filter( function (user) {
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
                return '';
            } 

            due_date = new Date(due_date);
            due_date = pm.Moment(due_date).format('YYYY-MM-DD');

            if ( ! pm.Moment( due_date ).isValid() ) {
                return false;
            }

            var today   = pm.Moment().format( 'YYYY-MM-DD' ),
            due_day = pm.Moment( due_date ).format( 'YYYY-MM-DD' );
            return pm.Moment(today).isSameOrBefore(due_day) ? 'pm-current-date' : 'pm-due-date';
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
            due_date = pm.Moment(due_date).format('YYYY-MM-DD');

            if ( ! pm.Moment( due_date ).isValid() ) {
                return false;
            }

            var today   = pm.Moment().format( 'YYYY-MM-DD' ),
            due_day = pm.Moment( due_date ).format( 'YYYY-MM-DD' );

            return pm.Moment(today).isSameOrBefore(due_day) ? false : 'pm-task-done';
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
            if ( task_start_field && start_date && due_date ) {
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
        taskDoneUndone ( args ) {
            var self = this,
            pre_define = {
                data: {
                    task_id: '',
                    status:0,
                    project_id: self.project_id ? self.project_id: '',
                },
                callback: false,
            },
            args = jQuery.extend(true, pre_define, args );
            
            var request_data = {
                url: self.base_url + '/pm/v2/projects/'+args.data.project_id+'/tasks/'+args.data.task_id +'/change-status',
                type: 'POST',
                data: args.data,
                success ( res ) {
                    if( typeof args.callback === 'function' ) {
                        args.callback(res);
                    }
                    self.$store.commit('updateProjectMeta', 'total_activities');                   
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
            this.$store.commit( 'projectTaskLists/single_task_popup', { task: task });
        },

        /**
         * List templete action to show hide blank templete
         * @return {[type]} [description]
         */
        listTemplateAction () {
            var lists = this.$store.state.projectTaskLists.lists, 
                blank, 
                listTmpl;
            
            if(lists.length){
                blank = false; 
                listTmpl = true;
            }else{
                blank = true; 
                listTmpl = false;
            }
            this.$store.commit( 'projectTaskLists/balankTemplateStatus', blank);
            this.$store.commit( 'projectTaskLists/listTemplateStatus', listTmpl);
        },

        is_assigned: function(task) {
                       
            return true;
        },

        privateClass ( privacy ){
            if( typeof privacy !== 'undefined' ){
                if ( privacy == '1' ){
                    return 'dashicons dashicons-lock'
                }else {
                    return 'dashicons dashicons-unlock'
                }
                
            }
        },

        listLockUnlock (list) {
            if (this.isArchivedList(list)) {
                return ;
            }
            var self = this;
            var data = {
                is_private: list.meta.privacy == '0' ? 1 : 0
            }
            var request_data = {
                url: self.base_url + '/pm/v2/projects/'+self.project_id+'/task-lists/privacy/'+list.id,
                type: 'POST',
                data: data,
                success (res) {
                    self.$store.commit('projectTaskLists/updateListPrivacy', {
                        privacy: data.is_private,
                        project_id: self.project_id,
                        list_id: list.id

                    });
                },

                error (res) {
                  
                }
            }
            self.httpRequest(request_data);
        },

        TaskLockUnlock (task) {
            if (this.isArchivedTaskList(task)) {
                return ;
            }
            var self = this;
            var data = {
                is_private: task.meta.privacy == '0' ? 1 : 0
            }
            var request_data = {
                url: self.base_url + '/pm/v2/projects/'+self.project_id+'/tasks/privacy/'+task.id,
                type: 'POST',
                data: data,
                success (res) {
                    self.$store.commit('projectTaskLists/updateTaskPrivacy', {
                        privacy: data.is_private,
                        project_id: self.project_id,
                        task_id: task.id,
                        list_id: task.task_list.data.id

                    });
                },

                error (res) {
                    res.responseJSON.message.map( function( value, index ) {
                        pm.Toastr.error(value);
                    });
                }
            }
            self.httpRequest(request_data);
        },

        taskTimeWrap (task) {
            var isActive = this.getSettings ('task_start_field', false);

            if (isActive) {
                if (
                    typeof task.due_date == 'undefined'
                        &&
                    typeof task.start_at == 'undefined'
                ) {
                    return false;
                }

                if (
                    !task.due_date.date
                        &&
                    !task.start_at.date
                ) {
                    return false;
                }
            } else {
                if ( typeof task.due_date == 'undefined' ) {
                    return false;
                }

                if (!task.due_date.date) {
                    return false;
                }
            }
            
            return true;
        },

        getMatches(string, regex, index) {
            index || (index = 1);

            var matches = [];
            var match;
            while (match = regex.exec(string)) {
                matches.push(match[index]);
            }

            return matches;
        },
        taskReceive (receive, callback) {
            var self = this;
            var request_data = {
                url: self.base_url + '/pm/v2/projects/'+self.project_id+'/tasks/sorting',
                type: 'POST',
                data: receive,
                success (res) {
                    if (res.data.task.data) {
                        self.addTaskMeta(res.data.task.data);
                    }
                    if(receive.receive == '1') {
                        self.$store.commit('projectTaskLists/receiveTask', {
                            receive: receive,
                            res: res.data
                        });
                    }
                    if(typeof callback != 'undefined') {
                        callback(res, receive);
                    }
                },

                error (res) {

                }
            }
            self.httpRequest(request_data);
        },

        listOrder (orders) {
            var self = this;
            
            self.$store.commit('projectTaskLists/listOrdering', orders);
            
            var request_data = {
                url: self.base_url + '/pm/v2/projects/'+self.project_id+'/lists/sorting',
                type: 'POST',
                data: orders,
                success (res) {

                    // self.$store.commit('projectTaskLists/receiveTask', {
                    //     receive: receive,
                    //     res: res.data
                   
                },

                error (res) {

                }
            }
            self.httpRequest(request_data);
        },

        showHideTaskMoreMenu(task, lsit) {
            lsit = lsit || {};
            task.moreMenu = task.moreMenu ? false : true;
            var completeTasks = typeof lsit.complete_tasks == 'undefined' ? [] : lsit.complete_tasks.data;
            var incopleteTasks = typeof lsit.incomplete_tasks == 'undefined' ? [] : lsit.incomplete_tasks.data;

            completeTasks.forEach(function(taskItem) {
                if(task.id != taskItem.id) {
                    taskItem.moreMenu = false;
                }
            });

            incopleteTasks.forEach(function(taskItem) {
                if(task.id != taskItem.id) {
                    taskItem.moreMenu = false;
                }
            });
        },
    }
}

export default  PM_TaskList_Mixin;

