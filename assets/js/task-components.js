var cpm_todo_list_mixins = function(mixins, mixin_parent) {
    if (!mixins || !mixins.length) {
        return [];
    }
    if (!mixin_parent) {
        mixin_parent = window;
    }
    return mixins.map(function (mixin) {
        return mixin_parent[mixin];
    });
};

/**
 * Global jQuery action for this component
 */
window.CPM_Component_jQuery = {
    /**
     * JQuery fadeIn
     * 
     * @param  int   id       
     * @param  Function callback 
     * 
     * @return void            
     */
    faceIn: function( id, callback ) {
        var class_id = ( typeof id == 'undefined' ) ? false : '-'+id;

        jQuery('.cpm-fade-in' + class_id).fadeOut(300, function() {
            if ( typeof callback != 'undefined' ) {
                callback( callback );
            }
        });
    },

    /**
     * JQuery fadeOut
     * 
     * @param  int   id       
     * @param  Function callback 
     * 
     * @return void            
     */
    fadeOut: function( id, callback ) {
        var class_id = ( typeof id == 'undefined' ) ? false : String( '-'+id );
        
        jQuery('.cpm-fade-out' + class_id).fadeOut(300, function() {
            if ( typeof callback != 'undefined' ) {
                callback( callback );
            }
        });
    },

    /**
     * JQuery slideUp
     * 
     * @param  int   id       
     * @param  Function callback 
     * 
     * @return void            
     */
    slide: function( id, callback ) {
        var class_id = '-'+id;//( typeof id == 'undefined' ) ? false : '-'+id;

        jQuery('.cpm-slide' + class_id).slideToggle(300, function() {
            if ( typeof callback != 'undefined' ) {
                callback( callback );
            }
        });
    }
}

/**
 * New todo list and update todo list form
 */
Vue.component('todo-list-form', {

    // Assign template for this component
    template: '#tmpl-cpm-todo-list-form', 
    
    // Get passing data for this component. Remember only array and objects are 
    props: [ 'list', 'index' ],
    
    // Include global properties and methods
    mixins: cpm_todo_list_mixins( CPM_Todo_List.todo_list_form ),

    /**
     * Initial data for this component
     * 
     * @return obj
     */
    data: function() {
        return {
            submit_btn_text: this.list.ID ? CPM_Vars.message.update_todo : CPM_Vars.message.new_todo,
            tasklist_milestone: this.list.milestone ? this.list.milestone : '-1',
            show_spinner: false,
            error: [],
            success: '',
            submit_disabled: false,
        };
    },

    computed: {
    
        /**
         * Get current project milestones 
         * 
         * @return array
         */
        milestones: function() {
            return this.$store.state.milestones;
        },
    },


    methods: {

        /**
         * Get todo list form class
         * 
         * @param  obej list 
         * 
         * @return string     
         */
        todolistFormClass: function( list ) {
            return list.ID ? 'cpm-todo-form-wrap cpm-form cpm-slide-'+ list.ID : 'cpm-todo-list-form-wrap cpm-form cpm-slide-list';
        },

        /**
         * Insert and update todo list
         * 
         * @return void
         */
        newTodoList: function() {

            // Prevent sending request when multiple click submit button 
            if ( this.submit_disabled ) {
                return;
            }

            // Make disable submit button
            this.submit_disabled = true;

            var self      = this,
                is_update = typeof this.list.ID == 'undefined' ? false : true;
               
            this.list_form_data.action = typeof this.list.ID == 'undefined' ? 'cpm_add_list' : 'cpm_update_list';
            this.list_form_data.tasklist_name = this.list.post_title;
            this.list_form_data.tasklist_detail = this.list.post_content;
            this.list_form_data.project_id = this.$store.state.project_id;
            this.list_form_data.tasklist_milestone = this.tasklist_milestone;
            this.list_form_data.list_id = typeof this.list.ID == 'undefined' ? false : this.list.ID;
            this.list_form_data._wpnonce = CPM_Vars.nonce;
                
            
            this.show_spinner = true;

            // Seding request for insert or update todo list
            jQuery.post( CPM_Vars.ajaxurl, this.list_form_data, function( res ) {

                if ( res.success ) {
                    self.tasklist_milestone = '-1';
                    self.show_spinner       = false;
                    self.list.post_title    = '';
                    self.list.post_content = '';

                    if ( is_update ) {
                        var list = res.data.list;
                    } else {
                        var list = res.data.list.list;
                    }

                    // Display a success message, with a title
                    toastr.success(res.data.success);

                    // Hide the todo list update form
                    self.showHideTodoListForm( self.list, self.index );

                    self.refreshTodoListPage();
                    
                } else {
                    self.show_spinner = false;

                    // Showing error
                    res.data.error.map(function(value, index) {
                        toastr.error(value);
                    });
                }

                // Make enable submit button
                self.submit_disabled = false;
            });
        },
    }
});

// Show todo lists
Vue.component('todo-lists', {

    // Assign template for this component
    template: '#tmpl-cpm-todo-list', 

    // Include global properties and methods
    mixins: [CPM_Task_Mixin],

    props: ['current_page_number'],

    /**
     * Initial data for this component
     * 
     * @return obj
     */
    data: function() {
        return {
            list: {},
            index: false,
        }
    },

    watch: {
        current_page_number: function( page_number ) {
            var per_page = this.$store.state.todo_list_per_page,
                self     = this;
            
            for (var i = 0; i < per_page; i++) {
                var request_data  = {
                    per_page: per_page,
                    current_page: page_number,
                    project_id: CPM_Vars.project_id,
                    _wpnonce: CPM_Vars.nonce,
                };

                wp.ajax.send('cpm_get_todo_lists', {
                    data: request_data,
                    success: function(res) {
                        self.$store.commit( 'new_todo_list', res );
                    }
                });
            }
        }
    },

    computed: {
        /**
         * Get lists from vuex store
         * 
         * @return array
         */
        lists: function () {
            return this.$store.state.lists;
        },

        /**
         * Get milestoes from vuex store
         * 
         * @return array
         */
        milestones: function() {
            return this.$store.state.milestones;
        },

        /**
         * Get current project id from vuex store
         * 
         * @return int
         */
        project_id: function() {
            return this.$store.state.project_id;
        },

        /**
         * Get initial data from vuex store when this component loaded
         * 
         * @return obj
         */
        init: function() {
            return this.$store.state.init;
        },

        /**
         * Get task for single task popup
         * 
         * @return object
         */
        task: function() {
            return this.$store.state.task;
        },

        total: function() {
            return Math.ceil( this.$store.state.list_total / this.$store.state.todo_list_per_page );
        },

        limit: function() {
            return this.$store.state.todo_list_per_page;
        },

        page_number: function() {
            return this.$route.params.page_number ? this.$route.params.page_number : 1;
        }
    },

});

// Show all todos
Vue.component('tasks', {

    // Assign template for this component
    template: '#tmpl-cpm-tasks', 
    
    // Get passing data for this component. Remember only array and objects are
    props: ['list', 'index'],

    // Include global properties and methods
    mixins: [CPM_Task_Mixin],

    /**
     * Initial data for this component
     * 
     * @return obj
     */
    data: function() {
        return {
           showTaskForm: false,
           task: {},
           tasks: this.list.tasks,
           task_index: 'undefined', // Using undefined for slideToggle class
           task_loading_status: false,
           incomplete_show_load_more_btn: false,
           complete_show_load_more_btn: false,
           currnet_user_id: this.$store.state.get_current_user_id,
           more_incomplete_task_spinner: false,
           more_completed_task_spinner: false,
           loading_completed_tasks: true,
           loading_incomplete_tasks: true
        }
    },

    created: function() {
        var self = this;
        if ( this.$store.state.is_single_list ) {
            this.getTasks(this.list.ID, 0, 'cpm_get_tasks', function(res) {
                var getIncompletedTasks = self.getIncompletedTasks(self.list);
                var getCompleteTask     = self.getCompleteTask(self.list);

                self.loading_completed_tasks = false;
                self.loading_incomplete_tasks = false;

                if ( res.found_incompleted_tasks > getIncompletedTasks.length ) {
                    self.incomplete_show_load_more_btn = true;
                }

                if ( res.found_completed_tasks > getCompleteTask.length ) {
                    self.complete_show_load_more_btn = true;
                }
            });
        } else {
            this.getTasks(this.list.ID, 0, 'cpm_get_incompleted_tasks', function(res) {
                self.loading_incomplete_tasks = false;
                
                if ( res.found_incompleted_tasks > self.list.tasks.length ) {
                    self.incomplete_show_load_more_btn = true;
                }
            });
        }
    },



    computed: {
        /**
         * Check, Has task from this props list
         * 
         * @return boolen
         */
        taskLength: function() {
            return typeof this.list.tasks != 'undefined' && this.list.tasks.length ? true : false;
        },

        /**
         * Get incomplete tasks
         * 
         * @param  array tasks 
         * 
         * @return array       
         */
        getIncompleteTasks: function() {
            if ( ! this.list.tasks ) {
                return [];
            }

            return this.list.tasks.filter(function( task ) {
                return ( task.completed == '0' || !task.completed );
            });
        },

        /**
         * Get completed tasks
         * 
         * @param  array tasks 
         * 
         * @return array       
         */
        getCompletedTask: function() {
            if ( ! this.list.tasks ) {
                return [];
            }

            return this.list.tasks.filter(function( task ) {
                return ( task.completed == '1' || task.completed );
            }); 
        },
    },

    methods: {
        is_assigned: function(task) {
            
            var get_current_user_id = this.$store.state.get_current_user_id,
                in_task  = task.assigned_to.indexOf(get_current_user_id);
            
            if ( task.can_del_edit || ( in_task != '-1' ) ) {
                return true;
            }

            return false;
        },
        /**
         * Get incomplete tasks
         * 
         * @param  array tasks 
         * 
         * @return array       
         */
        getIncompletedTasks: function(lists) {
            return lists.tasks.filter(function( task ) {
                return ( task.completed == '0' || !task.completed );
            });
        },

        /**
         * Get completed tasks
         * 
         * @param  array tasks 
         * 
         * @return array       
         */
        getCompleteTask: function(lists) {
            return lists.tasks.filter(function( task ) {
                return ( task.completed == '1' || task.completed );
            }); 
        },
        /**
         * Show task edit form
         * 
         * @param  int task_index 
         * 
         * @return void            
         */
        taskEdit: function( task_id ) {

            var self = this,
                lists = this.$store.state.lists,
                list_index = this.getIndex( lists, this.list.ID, 'ID' )
                task_index = this.getIndex( self.list.tasks, task_id, 'ID' );
            
                self.showHideTaskForm( list_index, task_index );
        },

        /**
         * Class for showing task private incon
         * 
         * @param  obje task 
         * 
         * @return string      
         */
        privateClass: function( task ) {
            return ( task.task_privacy == 'yes' ) ? 'cpm-lock' : 'cpm-unlock';
        },

        /**
         * Delete task
         * 
         * @return void
         */
        deleteTask: function( list_id, task_id ) {
            if ( ! confirm( CPM_Vars.message.confirm ) ) {
                return;
            }

            var self       = this,
                list_index = this.getIndex( this.$store.state.lists, list_id, 'ID' ),
                task_index = this.getIndex( this.$store.state.lists[list_index].tasks, task_id, 'ID' ),
                form_data  = {
                    action: 'cpm_task_delete',
                    task_id: task_id,
                    _wpnonce: CPM_Vars.nonce,
                };

            // Seding request for insert or update todo list
            jQuery.post( CPM_Vars.ajaxurl, form_data, function( res ) {
                if ( res.success ) {
                    // Display a success message, with a title
                    //toastr.success(res.data.success);
                    
                    CPM_Component_jQuery.fadeOut( task_id, function() {
                        self.$store.commit( 'after_delete_task', { 
                            list_index: list_index,
                            task_index: task_index,
                        });
                    });
                } else {
                    // Showing error
                    res.data.error.map( function( value, index ) {
                        toastr.error(value);
                    });
                }
            });
        },

        loadMoreIncompleteTasks: function(list) {
            if ( this.task_loading_status ) {
                return;
            }

            this.task_loading_status = true;
            this.more_incomplete_task_spinner = true;


            var incompleted_tasks = this.getIncompletedTasks( this.list );

            var page_number = incompleted_tasks.length,
                self   = this;
            
            this.getTasks( list.ID, page_number, 'cpm_get_incompleted_tasks', function(res) {
                self.task_loading_status = false;
                self.more_incomplete_task_spinner = false;

                var incompleted_tasks = self.getIncompletedTasks( self.list );
                
                if ( res.found_incompleted_tasks > incompleted_tasks.length ) {
                    self.incomplete_show_load_more_btn = true;
                } else {
                    self.incomplete_show_load_more_btn = false;
                }
            });

        },

        loadMoreCompleteTasks: function(list) {
            if ( this.task_loading_status ) {
                return;
            }

            this.task_loading_status = true;
            this.more_completed_task_spinner = true;

            var completed_tasks = this.getCompleteTask( this.list );

            var page_number = completed_tasks.length,
                self   = this;
            
            this.getTasks( list.ID, page_number, 'cpm_get_completed_tasks', function(res) {
                self.task_loading_status = false;
                self.more_completed_task_spinner = false;

                var completed_tasks = self.getCompleteTask( self.list );
                
                if ( res.found_completed_tasks > completed_tasks.length ) {
                    self.complete_show_load_more_btn = true;
                } else {
                    self.complete_show_load_more_btn = false;
                }
            });

        }
    }

});

Vue.component('cpm-task-comment-form', {
    // Assign template for this component
    template: '#tmpl-cpm-task-comment-form',

    // Include global properties and methods
    mixins: [CPM_Task_Mixin],

    // Get passing data for this component. 
    props: ['comment', 'task'],

    /**
     * Initial data for this component
     * 
     * @return obj
     */
    data: function() {
        return {
            files: typeof this.comment.files == 'undefined' ? [] : this.comment.files,
            content: {
                html: typeof this.comment.comment_content == 'undefined' ? '' : this.comment.comment_content,
            },
            notify_co_workers: [],
            notify_all_co_worker: false,
            show_spinner: false,
            submit_disabled: false,
        }
    },

    /**
     * Observe onchange value
     */
    watch: {
        /**
         * Observed comment file change
         * 
         * @param  array new_files 
         * 
         * @return void           
         */
        files: function( new_files ) {
            this.comment.files = new_files;
        },

        /**
         * Observe onchange comment message
         *
         * @param string new_content 
         * 
         * @type void
         */
        content: {
            handler: function( new_content ) {
                this.comment.comment_content = new_content.html;
            },

            deep: true
        },

    },

    /**
     * Unassigned varable value
     */
    computed: {
        /**
         * Editor ID
         * 
         * @return string
         */
        editor_id: function() {
            var comment_id = ( typeof this.comment.comment_ID == 'undefined' ) ? 
                '' : '-' + this.comment.comment_ID;

            return 'cpm-task-editor' + comment_id;
        },

        /**
         * Get current projects co-worker
         * 
         * @return object
         */
        co_workers: function() {
            return this.co_worker_lists();
        },

        /**
         * Check Co-Worker exist or not in a task
         *
         * @return boolean
         */
        hasCoWorker: function() {
            var co_workers = this.co_worker_lists();
            
            if ( co_workers.length ) {
                return true;
            }

            return false;
        }
    },

    methods: {
        /**
         * Get current projects co-worker
         * 
         * @return object
         */
        co_worker_lists: function() {
            var self = this;
            var project_users = this.get_porject_users_by_role('co_worker');
            
            var filtered_users = project_users.filter(function(user) {
                return self.task.assigned_to.indexOf(String(user.id)) != '-1';
            }); 

            return filtered_users;
        },
        /**
         * Insert and update todo-task comment
         * 
         * @return void
         */
        updateComment: function() {
            // Prevent sending request when multiple click submit button 
            if ( this.submit_disabled ) {
                return;
            }

            // Make disable submit button
            this.submit_disabled = true;

            var self       = this,
                list_index = this.getIndex( this.$store.state.lists, this.task.post_parent, 'ID' ),
                task_index = this.getIndex( this.$store.state.lists[list_index].tasks, this.task.ID, 'ID' ),
                is_update  = typeof this.comment.comment_ID == 'undefined' ? false : true,
                
                form_data = {
                    parent_id: typeof this.task.ID == 'undefined' ? false : this.task.ID,
                    comment_id: is_update ? this.comment.comment_ID : false,
                    action:  is_update ? 'cpm_comment_update' : 'cpm_comment_new', 
                    cpm_message: this.comment.comment_content,
                    cpm_attachment: this.filtersOnlyFileID( this.comment.files ),
                    project_id: CPM_Vars.project_id,
                    _wpnonce: CPM_Vars.nonce,
                };

            // Showing spinner    
            this.show_spinner = true;

            // Sending request for add and update comment
            jQuery.post( CPM_Vars.ajaxurl, form_data, function( res ) {
                
                self.show_spinner    = false;
                self.submit_disabled = false;
                
                if ( res.success ) {
                    
                    if ( ! is_update ) {
                        // After getting todo task, set it to vuex state tasks
                        self.$store.commit( 'update_task_comment', { 
                            task_index: task_index,
                            list_index: list_index,
                            comment: res.data.comment,
                        });

                        self.task.comments.push(res.data.comment);

                        self.files = [];
                        self.content.html = '';
                        
                        self.$root.$emit( 'after_comment' );
 
                    } else {
                        self.showHideTaskCommentEditForm( self.task, self.comment.comment_ID);
                    }

                    // Display a success toast, with a title
                    //toastr.success(res.data.success);
                } else {

                    // Showing error
                    res.data.error.map( function( value, index ) {
                        toastr.error(value);
                    });
                } 
            });
        },

        /**
         * Get files id array from file object
         * 
         * @param  object files 
         * 
         * @return array       
         */
        filtersOnlyFileID: function( files ) {
            if ( typeof files == 'undefined' ) {
                return [];
            }

            return files.map( function( file ) {
                return file.id;
            });
        },

        /**
         * Check select all check box enable or disabled. for notify users
         * 
         * @param  int user_id 
         * 
         * @return void         
         */
        notify_coo_workers: function( user_id ) {
            var co_worker_length = this.get_porject_users_id_by_role('co_worker').length,
                notify_co_worker_length = this.notify_co_workers.length;
            
            if ( co_worker_length != notify_co_worker_length ) {
                this.notify_all_co_worker = false;
            }

            if ( co_worker_length === notify_co_worker_length ) {
                this.notify_all_co_worker = true;
            }
        },

        /**
         * Is notification send all co-worker or not
         */
        notify_all_coo_worker: function() {

            if ( this.notify_all_co_worker ) {
                this.notify_co_workers = [];
                this.notify_co_workers = this.get_porject_users_id_by_role('co_worker');
            } else {
                this.notify_co_workers = [];
            }
        }

    }
});

// Default template for todo lists
Vue.component('todo-list-default-tmpl', {

    // Assign template for this component
    template: '#tmpl-todo-list-default',

    /**
     * Initial data for this component
     * 
     * @return obj
     */
    data: function() {
        return {
            list: {},
            index: false
        }
    },

    computed: {

        /**
         * Get lists from vuex store
         * 
         * @return array
         */
        lists: function() {
            return this.$store.state.lists;
        },

        /**
         * Check todo-list create premission for current user
         * 
         * @return boolean
         */
        create_todolist: function() {
            if ( ! this.$store.state.init.hasOwnProperty( 'premissions' ) ) {
                return true;
            }

            return this.$store.state.init.premissions.create_todolist;
        },

        /**
         * Show new todo-list form
         * 
         * @return boolean
         */
        show_list_form: function() {
            return this.$store.state.show_list_form;
        }
    }
});

// New todo list btn 
Vue.component('new-todo-list-button', {

    // Assign template for this component
    template: '#tmpl-new-todo-list-button',

    // Include global properties and methods
    mixins: [CPM_Task_Mixin],

    /**
     * Initial data for this component
     * 
     * @return obj
     */
    data: function() {
        return {
            list: {},
            index: false,
            text: {
                new_todo: CPM_Vars.message.new_todo
            },
        }
    },

    computed: {
        /**
         * Show new todo-list form
         * 
         * @return boolean
         */
        show_list_form: function() {
            return this.$store.state.show_list_form;
        },
    }
});

// New task btn 
Vue.component('new-task-button', {

    // Assign template for this component
    template: '#tmpl-cpm-new-task-button',

    // Get passing data for this component. Remember only array and objects are
    props: ['list', 'list_index', 'task'],

    // Include global properties and methods
    mixins: [CPM_Task_Mixin],

    methods: {
        /**
         * Select new todo-list button class for +,- icon
         * 
         * @return string
         */
        newTaskBtnClass: function() {
            return this.list.show_task_form ? 'cpm-col-3 cpm-new-task-btn-minus' : 'cpm-col-3 cpm-new-task-btn';
        },

        /**
         * Show new task form
         * 
         * @param  int list_index 
         * 
         * @return void            
         */
        showNewTaskForm: function( list_index ) {
            this.showHideTaskForm( list_index );
        }
    }
});

// New task form 
Vue.component('new-task-form', {

    // Assign template for this component
    template: '#tmpl-cpm-new-task-form',

    // Get passing data for this component. Remember only array and objects are
    props: ['list', 'list_index', 'task', 'task_index'],

    // Include global properties and methods
    mixins: [CPM_Task_Mixin],

    /**
     * Initial data for this component
     * 
     * @return obj
     */
    data: function() {
        return {
            project_users: this.$store.state.project_users,
            task_privacy: ( this.task.task_privacy == 'yes' ) ? true : false,
            submit_disabled: false,
            before_edit: jQuery.extend( true, {}, this.task ),
            show_spinner: false,
        }
    },

    // Initial action for this component
    created: function() {
        this.$root.$on( 'cpm_date_picker', this.getDatePicker );
    },

    watch: {
        /**
         * Live check is the task private or not
         * 
         * @param  boolean val 
         * 
         * @return void     
         */
        task_privacy: function( val ) {
            if ( val ) {
                this.task.task_privacy = 'yes';
            } else {
                this.task.task_privacy = 'no';
            }
        }
    },

    computed: {
        /**
         * Check current user can view the todo or not
         * 
         * @return boolean
         */
        todo_view_private: function() {
            if ( ! this.$store.state.init.hasOwnProperty('premissions')) {
                return true;
            }

            if ( this.$store.state.init.premissions.hasOwnProperty('todo_view_private')) {
                return this.$store.state.init.premissions.tdolist_view_private
            }

            return true;
        },

        /**
         * Get and Set task users
         */
        task_assign: {
            /**
             * Filter only current task assgin user from vuex state project_users
             *
             * @return array
             */
            get: function () {
                var filtered_users = [];

                if ( this.task.assigned_to && this.task.assigned_to.length ) {
                    var assigned_to = this.task.assigned_to.map(function (id) {
                        return parseInt(id);
                    });


                    filtered_users = this.project_users.filter(function (user) {
                        return (assigned_to.indexOf(parseInt(user.id)) >= 0);
                    });
                }

                return filtered_users;
            }, 

            /**
             * Set selected users at task insert or edit time
             * 
             * @param array selected_users 
             */
            set: function ( selected_users ) {
                this.task.assigned_to = selected_users.map(function (user) {
                    return user.id;
                });
            }
        },
    },

    methods: {
        /**
         * Set tast start and end date at task insert or edit time
         * 
         * @param  string data 
         * 
         * @return void   
         */
        getDatePicker: function( data ) {
            
            if ( data.field == 'datepicker_from' ) {
                this.task.start_date = data.date;
            }

            if ( data.field == 'datepicker_to' ) {
                this.task.due_date = data.date;
            }
        },

        /**
         * Show or hieding task insert and edit form
         *  
         * @param  int list_index 
         * @param  int task_id    
         * 
         * @return void           
         */
        hideNewTaskForm: function(list_index, task_id) {
            var self = this,
                task_index = this.getIndex(this.list.tasks, task_id, 'ID'),
                list_index = this.getIndex( this.$store.state.lists, this.list.ID, 'ID' );

            if ( typeof task_id == 'undefined'   ) {
                self.showHideTaskForm( list_index );
                return;
            }

            this.list.tasks.map(function( task, index ) {
                if ( task.ID == task_id ) {
                    self.showHideTaskForm( list_index, index );
                    self.task = jQuery.extend( self.task, self.before_edit );
                }
            }); 
        },

        /**
         * Insert and edit task
         * 
         * @return void
         */
        newTask: function() {
            // Exit from this function, If submit button disabled 
            if ( this.submit_disabled ) {
                return;
            }
            
            // Disable submit button for preventing multiple click
            this.submit_disabled = true;

            var self      = this,
                is_update = typeof this.task.ID == 'undefined' ? false : true,
                
                form_data = {
                    action: typeof this.task.ID == 'undefined' ? 'cpm_task_add' : 'cpm_task_update',
                    project_id: CPM_Vars.project_id,
                    task_assign: this.task.assigned_to,
                    task_title: this.task.post_title,
                    task_text: this.task.post_content,
                    task_start: this.task.start_date,
                    task_due: this.task.due_date,
                    task_privacy: this.task.task_privacy,
                    list_id: this.list.ID,
                    task_id: typeof this.task.ID == 'undefined' ? false : this.task.ID,
                    _wpnonce: CPM_Vars.nonce,
                };
            
            // Showing loading option 
            this.show_spinner = true;

            // Sending request for insert or update task
            jQuery.post( CPM_Vars.ajaxurl, form_data, function( res ) {

                if ( res.success ) {
                    
                    self.show_spinner = false;

                    // Display a success toast, with a title
                    toastr.success(res.data.success);

                    if ( form_data.task_id ) {
                        self.list.tasks.map(function( task, index ) {
                            if ( task.ID == form_data.task_id ) {
                                self.showHideTaskForm( self.list_index, index );
                            }
                        }); 
                        
                    } else {
                        // Hide the todo list update form
                        self.showHideTaskForm( self.list_index );  
                        self.task_privacy = false;  
                    }
                    
                    if ( ! form_data.task_id ) {
                        var list_index = self.getIndex( self.$store.state.lists, self.list.ID, 'ID' );
                        // Update vuex state lists after insert or update task 
                        self.$store.commit( 'update_task', { res: res, list_index: list_index, is_update: is_update } );    
                    }
                    
                } else {
                    self.show_spinner = false;
                    
                    // Showing error
                    res.data.error.map( function( value, index ) {
                        toastr.error(value);
                    });
                }

                self.submit_disabled = false;
            });
        }
    }
});

var CPM_Router_Init = {

    // Assign template for this component
    template: '#tmpl-cpm-todo-list-router-default',

    // Include global properties and methods
    mixins: cpm_todo_list_mixins( CPM_Todo_List.todo_list_router_default ),

    /**
     * Initial data for this component
     * 
     * @return obj
     */
    data: function() {
        return { 
            text: {
                new_todo: CPM_Vars.message.new_todo
            },
            list: {},
            index: false,
            current_page_number: 1,
            loading: true
        }
    },

    computed: {
        lists: function () {
            return this.$store.state.lists;
        },

        // loading: function() {
        //     return this.$store.state.loading;
        // },

        show_list_form: function() {
            return this.$store.state.show_list_form;
        },

        hasTodoLists: function() {
            return this.$store.state.lists.length;
        },

        is_visible_list_btn: function() {
            return this.$store.state.permissions.create_todolist;
        }

    },

    // Initial doing 
    created: function() {
        var self = this;
        this.$store.commit('emptyTodoLists');
        
        this.getInitialData( this.$store.state.project_id, function(status) {
            self.loading = false;
        } );
    },

    watch: {
        '$route': function (to, from) {
            var self = this;

            if ( this.$route.params.page_number ) {
                this.loading = true;
                this.$store.commit('emptyTodoLists');
                this.getInitialData( this.$store.state.project_id, function(res) {
                    self.loading = false;
                });
                this.current_page_number = this.$route.params.page_number;
            }
        }
    },
}

var CPM_Task_Single = {
    // Assign template for this component
    template: '#tmpl-cpm-task-single',

    // Include global properties and methods
    mixins: [CPM_Task_Mixin],

    data: function() {
        return {
            task: typeof this.$route.params.task == 'undefined' ? false : this.$route.params.task,
            loading: true
        }
    },

    created: function() {
        this.getTask();
    },


    methods: {
        closePopup: function() {
            this.$store.commit( 'close_single_task_popup' );
            
            if ( this.$route.name == 'list_task_single_under_todo'  ) {
                var list_id = this.task.post_parent,
                    push_url = '/list/'+list_id;
                this.$router.push(push_url);
            } else {
                this.$router.push('/');
            }
        },

        singleTaskTitle: function(task) {
            return task.completed ? 'cpm-task-complete' : 'cpm-task-incomplete';
        },

        getTask: function() {
            if ( ! this.$route.params.task_id ) {
                this.loading = false;
                return;
            }
        
            var request_data  = {
                task_id: this.$route.params.task_id,
                project_id: CPM_Vars.project_id,
                _wpnonce: CPM_Vars.nonce,
            },
            self = this;

            wp.ajax.send('cpm_get_task', {
                data: request_data,
                success: function(res) {
                    self.task = res.task;
                    self.$store.commit('single_task_popup');
                    self.loading = false;
                }
            });
        }
    },
}

var CPM_List_Single = { 

    // Assign template for this component
    template: '#tmpl-cpm-todo-list-single',  

    // Include global properties and methods
    mixins: [CPM_Task_Mixin],

    /**
     * Initial data for this component
     * 
     * @return obj
     */
    data: function() {
        return {
            list_id: this.$route.params.list_id,
            list: {},
            render_tmpl: false,
            task_id: parseInt(this.$route.params.task_id) ? this.$route.params.task_id : false, //for single task popup
            loading: true
        }
    },


    /**
     * Initial action for this component
     * 
     * @return void
     */
    created: function() {
        var self = this;
        
        this.$store.commit('emptyTodoLists');
        
        // Get todo list 
        this.getList( this.$route.params.list_id, function(res) {
            self.loading = false;
        });
    },

    computed: {
        /**
         * Get todo lists from vuex store
         * 
         * @return array
         */
        lists: function () {
            return this.$store.state.lists;
        },

        /**
         * Get milestones from vuex store
         * 
         * @return array
         */
        milestones: function() {
            return this.$store.state.milestones;
        },

        /**
         * Get current project id from vuex store
         * 
         * @return int
         */
        project_id: function() {
            return this.$store.state.project_id;
        },

        /**
         * Get initial data from vuex store when this component loaded
         * 
         * @return obj
         */
        init: function() {
            return this.$store.state.init;
        },

        comments: function() {
            if ( this.$store.state.lists.length ) {
                return this.$store.state.lists[0].comments;
            }

            return [];
        },

        comment_list: function() {
            if ( this.$store.state.lists.length ) {
                return this.$store.state.lists[0];
            }

            return {};
        }

    },

    methods: {
        /**
         * Get todo list for single todo list page
         * 
         * @param  int list_id 
         * 
         * @return void         
         */
        getList: function( list_id, callback ) {
            
            var self      = this,
                form_data = {
                    list_id: list_id,
                    action: 'cpm_get_todo_list_single',
                    project_id: CPM_Vars.project_id,
                    _wpnonce: CPM_Vars.nonce,
                };

            // Sending request for getting singel todo list 
            jQuery.post( CPM_Vars.ajaxurl, form_data, function( res ) {

                if ( res.success ) {

                    // After getting todo list, set it to vuex state lists
                    self.$store.commit( 'update_todo_list_single', { 
                        list: res.data.list,
                        permissions: res.data.permissions,
                        milestones: res.data.milestones,
                        project_users: res.data.project_users
                    });

                    self.render_tmpl = true;

                    if ( typeof callback != 'undefined'  ) {
                        callback(res);
                    }
                } 
            });
        },
    }

}

Vue.component('cpm-text-editor', {
    // Assign template for this component
    template: '<textarea :id="editor_id" v-model="content.html"></textarea></div>',

    // Get passing data for this component.
    props: ['editor_id', 'content'],

    // Initial action for this component
    created: function() {
        var self = this;
        this.$root.$on( 'after_comment', this.afterComment );
        // After ready dom
        Vue.nextTick(function() {

            // Remove the editor
            tinymce.execCommand( 'mceRemoveEditor', true, self.editor_id );
            
            // Instantiate the editor
            tinymce.init({
                selector: 'textarea#' +self.editor_id,
                menubar: false,
                placeholder: CPM_Vars.message.comment_placeholder,
                
                setup: function (editor) {
                    editor.on('change', function () {
                        self.content.html = editor.getContent();
                    });
                    editor.on('keyup', function () {
                        self.content.html = editor.getContent();
                    });
                    editor.on('NodeChange', function () {
                        self.content.html = editor.getContent();
                    });
                },

                external_plugins: {
                    'placeholder' : CPM_Vars.CPM_URL + '/assets/js/tinymce/plugins/placeholder/plugin.min.js'
                },

                fontsize_formats: '10px 11px 13px 14px 16px 18px 22px 25px 30px 36px 40px 45px 50px 60px 65px 70px 75px 80px',
                font_formats : 'Arial=arial,helvetica,sans-serif;'+
                    'Comic Sans MS=comic sans ms,sans-serif;'+
                    'Courier New=courier new,courier;'+
                    'Georgia=georgia,palatino;'+
                    'Lucida=Lucida Sans Unicode, Lucida Grande, sans-serif;'+
                    'Tahoma=tahoma,arial,helvetica,sans-serif;'+
                    'Times New Roman=times new roman,times;'+
                    'Trebuchet MS=trebuchet ms,geneva;'+
                    'Verdana=verdana,geneva;',
                plugins: 'placeholder textcolor colorpicker wplink wordpress',
                toolbar1: 'shortcodes bold italic strikethrough bullist numlist alignleft aligncenter alignjustify alignright link',
                toolbar2: 'formatselect forecolor backcolor underline blockquote hr code',
                toolbar3: 'fontselect fontsizeselect removeformat undo redo',
            });

            
        });
       
        //tinymce.execCommand( 'mceRemoveEditor', true, id );
        //tinymce.execCommand( 'mceAddEditor', true, id );
        //tinymce.execCommand( 'mceAddControl', true, id );
    },

    methods: {
        afterComment: function() {
            tinyMCE.get(this.editor_id).setContent('');
        }
    }
});

Vue.component('cpm-file-uploader', {
    // Assign template for this component
    template: '#tmpl-cpm-file-uploader',

    props: ['files'],

    // Include global properties and methods
    mixins: [CPM_Task_Mixin],

    // Initial action for this component
    created: function() {
        this.$on( 'cpm_file_upload_hook', this.fileUploaded );

        var self = this;

        // Instantiate file upload, After dom ready
        Vue.nextTick(function() {
            new CPM_Uploader('cpm-upload-pickfiles', 'cpm-upload-container', self );
        });
        
    },

    methods: {
        /**
         * Set the uploaded file 
         * 
         * @param  object file_res 
         * 
         * @return void          
         */
        fileUploaded: function( file_res ) {
            
            if ( typeof this.files == 'undefined' ) {
                this.files = [];
            }

            this.files.push( file_res.res.file );
        },

        /**
         * Delete file 
         * 
         * @param  object file_id 
         * 
         * @return void          
         */
        deletefile: function(file_id) {
            if ( ! confirm(CPM_Vars.message.confirm) ) {
                return;
            }

            var request_data  = {
                file_id: file_id,
                _wpnonce: CPM_Vars.nonce,
            },
            self = this;

            wp.ajax.send('cpm_delete_file', {
                data: request_data,
                success: function(res) {
                   var file_index = self.getIndex( self.files, file_id, 'id' );
                   self.files.splice(file_index,1);
                }
            });
        }
    }
});

Vue.component('cpm-list-comment-form', {
    // Assign template for this component
    template: '#tmpl-cpm-list-comment-form',

    // Include global properties and methods
    mixins: [CPM_Task_Mixin],

    // Get passing data for this component. 
    props: ['comment', 'list'],

    /**
     * Initial data for this component
     * 
     * @return obj
     */
    data: function() {
        return {
            files: typeof this.comment.files == 'undefined' ? [] : this.comment.files,
            content: {
                html: typeof this.comment.comment_content == 'undefined' ? '' : this.comment.comment_content,
            },
            notify_co_workers: [],
            notify_all_co_worker: false,
            show_spinner: false,
            submit_disabled: false,
        }
    },

    /**
     * Observe onchange value
     */
    watch: {
        /**
         * Observed comment file change
         * 
         * @param  array new_files 
         * 
         * @return void           
         */
        files: function( new_files ) {
            this.comment.files = new_files;
        },

        /**
         * Observe onchange comment message
         *
         * @param string new_content 
         * 
         * @type void
         */
        content: {
            handler: function( new_content ) {
                this.comment.comment_content = new_content.html;
            },

            deep: true
        },

    },

    /**
     * Unassigned varable value
     */
    computed: {
        /**
         * Editor ID
         * 
         * @return string
         */
        editor_id: function() {
            var comment_id = ( typeof this.comment.comment_ID == 'undefined' ) ? 
                '' : '-' + this.comment.comment_ID;

            return 'cpm-list-editor' + comment_id;
        },

        /**
         * Get current projects co-worker
         * 
         * @return object
         */
        co_workers: function() {
            return this.get_porject_users_by_role('co_worker');
        },

        /**
         * Check has co-worker in project or not
         * 
         * @return boolean
         */
        hasCoWorker: function() {
            var co_worker = this.get_porject_users_by_role('co_worker');

            if (co_worker.length) {
                return true;
            }

            return false;
        }
    },

    methods: {
        /**
         * Insert and update todo-list comment
         * 
         * @return void
         */
        updateComment: function() {
            // Prevent sending request when multiple click submit button 
            if ( this.submit_disabled ) {
                return;
            }

            // Make disable submit button
            this.submit_disabled = true;

            var self      = this,
                is_update = typeof this.comment.comment_ID == 'undefined' ? false : true,
                form_data = {
                    parent_id: typeof this.list.ID == 'undefined' ? false : this.list.ID,
                    comment_id: is_update ? this.comment.comment_ID : false,
                    action:  is_update ? 'cpm_comment_update' : 'cpm_comment_new', 
                    cpm_message: this.comment.comment_content,
                    cpm_attachment: this.filtersOnlyFileID( this.comment.files ),
                    project_id: CPM_Vars.project_id,
                    _wpnonce: CPM_Vars.nonce,
                };

            // Showing spinner    
            this.show_spinner = true;

            // Sending request for add and update comment
            jQuery.post( CPM_Vars.ajaxurl, form_data, function( res ) {
                
                self.show_spinner    = false;
                self.submit_disabled = false;
                
                if ( res.success ) {
                    
                    if ( ! is_update ) {
                        // After getting todo list, set it to vuex state lists
                        self.$store.commit( 'update_todo_list_comment', { 
                            list_id: self.list.ID,
                            comment: res.data.comment,
                        });

                        self.files = [];
                        self.content.html = '';
                        
                        self.$root.$emit( 'after_comment' );
 
                    } else {
                        self.showHideListCommentEditForm( self.comment.comment_ID );
                    }

                    // Display a success toast, with a title
                    //toastr.success(res.data.success);
                } else {

                    // Showing error
                    res.data.error.map( function( value, index ) {
                        toastr.error(value);
                    });
                } 
            });
        },

        /**
         * Get files id array from file object
         * 
         * @param  object files 
         * 
         * @return array       
         */
        filtersOnlyFileID: function( files ) {
            if ( typeof files == 'undefined' ) {
                return [];
            }

            return files.map( function( file ) {
                return file.id;
            });
        },

        /**
         * Check select all check box enable or disabled. for notify users
         * 
         * @param  int user_id 
         * 
         * @return void         
         */
        notify_coo_workers: function( user_id ) {
            var co_worker_length = this.get_porject_users_id_by_role('co_worker').length,
                notify_co_worker_length = this.notify_co_workers.length;
            
            if ( co_worker_length != notify_co_worker_length ) {
                this.notify_all_co_worker = false;
            }

            if ( co_worker_length === notify_co_worker_length ) {
                this.notify_all_co_worker = true;
            }
        },

        /**
         * Is notification send all co-worker or not
         */
        notify_all_coo_worker: function() {

            if ( this.notify_all_co_worker ) {
                this.notify_co_workers = [];
                this.notify_co_workers = this.get_porject_users_id_by_role('co_worker');
            } else {
                this.notify_co_workers = [];
            }
        },
    }
});

Vue.component('cpm-list-comments', {
    // Assign template for this component
    template: '#tmpl-cpm-list-comments',

    // Get passing data for this component. 
    props: ['comments', 'list'],

    // Include global properties and methods
    mixins: [CPM_Task_Mixin],

    computed: {
        /**
         * Get current user avatar
         */
        getCurrentUserAvatar: function() {
            return CPM_Vars.current_user_avatar_url;
        },
    },

    methods: {
        current_user_can_edit_delete: function( comment, list ) {
            
            if ( list.can_del_edit ) {
                return true;
            }
            
            if ( (comment.user_id == this.$store.state.get_current_user_id ) && (comment.comment_type == '') ) {
                return true;
            }

            return false;
        }
          
    }
});

Vue.component('cpm-task-comments', {
    // Assign template for this component
    template: '#tmpl-cpm-task-comments',

    // Get passing data for this component. 
    props: ['comments', 'task'],

    // Include global properties and methods
    mixins: [CPM_Task_Mixin],

    data: function() {
        return {
            currnet_user_id: this.$store.state.get_current_user_id
        }
    },

    computed: {
        /**
         * Get current user avatar
         */
        getCurrentUserAvatar: function() {
            return CPM_Vars.current_user_avatar_url;
        },
    },

    methods: {
        current_user_can_edit_delete: function( comment, task ) {
            if ( comment.comment_type == 'cpm_activity' ) {
                return false;
            }
            
            if ( task.can_del_edit ) {
                return true;
            }
            
            if ( (comment.user_id == this.currnet_user_id ) && (comment.comment_type == '') ) {
                return true;
            }

            return false;
        }
        
    }
});

Vue.component( 'cpm-loading', {
    template: '#tmpl-cpm-spinner'
});


Vue.component( 'cpm-paginaton', {
    template: '#tmpl-cpm-pagination',
    props: ['total', 'limit', 'page_number'],

    methods: {
        pageClass: function( page ) {
            if ( page == this.page_number ) {
                return 'page-numbers current'
            }

            return 'page-numbers';
        },
    }
});

// Global multiselect
Vue.component('multiselect', VueMultiselect.default);

