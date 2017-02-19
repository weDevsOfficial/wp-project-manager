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
 * Global object for all components and root
 */
var CPM_Mixin = {

    /**
     * Methods for global component
     */
	methods: {

        /**
         * Handel new todo list form show and hide
         * 
         * @param  obj list       
         * @param  int list_index 
         * 
         * @return void            
         */
        showHideTodoListForm: function( list, list_index ) {
            if ( list.ID ) {
                //this.$store.commit( 'showHideUpdatelistForm', { list: list, list_index: list_index } );
            } else {
                //this.$store.commit( 'newTodoListForm' );
            }


            var edit_mode = list.ID ? true : false,
                self      = this;
            
            if ( edit_mode ) {
                var is_edit = self.$store.state.lists[list_index].edit_mode;

                if ( is_edit ) {
                    CPM_Component_jQuery.slide( list.ID, function() {
                        self.$store.commit( 'showHideUpdatelistForm', { list: list, list_index: list_index } );
                    });
                
                } else {
                    self.$store.commit( 'showHideUpdatelistForm', { list: list, list_index: list_index } );
                 
                     Vue.nextTick( function() {

                        CPM_Component_jQuery.slide( list.ID );
                    });    
                }
            } else {
                var is_edit = self.$store.state.show_list_form;

                if ( is_edit ) {
                    CPM_Component_jQuery.slide( 'list', function() {
                        self.$store.commit( 'newTodoListForm' );
                    });
                } else {
                    self.$store.commit( 'newTodoListForm' );
                
                    Vue.nextTick( function() {

                        CPM_Component_jQuery.slide( 'list' );
                    } );

                }
                
            }
        },

        /**
         * Handel new todo or task form show and hide
         * 
         * @param  int list_index 
         * @param  int task_index 
         * 
         * @return void            
         */
        showHideTaskForm: function( list_index, task_index ) {
            
            if ( ( typeof task_index == 'undefined' ) || ( task_index === false ) ) {

                var edit_mode = this.$store.state.lists[list_index].show_task_form,
                    self      = this;

                if ( edit_mode ) {

                    CPM_Component_jQuery.slide( task_index, function() {
                        self.$store.commit( 'showHideTaskForm', { list_index: list_index, task_index: false } );
                    });
                
                } else {
                    self.$store.commit( 'showHideTaskForm', { list_index: list_index, task_index: false } );
                    
                    Vue.nextTick( function() {

                        CPM_Component_jQuery.slide( task_index );
                    } );
                }
                
            } else {
                var edit_mode = this.$store.state.lists[list_index].tasks[task_index].edit_mode,
                    self      = this;

                if ( edit_mode ) {
                    CPM_Component_jQuery.slide( task_index, function() {
                        self.$store.commit( 'showHideTaskForm', { list_index: list_index, task_index: task_index } );
                    });
                
                } else {
                    self.$store.commit( 'showHideTaskForm', { list_index: list_index, task_index: task_index } );
                    
                    Vue.nextTick( function() {

                        CPM_Component_jQuery.slide( task_index );
                    } );
                }
            }
        },

        /**
         * WP settings date format convert to moment date format with time zone
         * 
         * @param  string date 
         * 
         * @return string      
         */
        dateFormat: function( date ) {
            if ( date == '' ) {
                return;
            }

            moment.tz.add(CPM_Vars.time_zones);
            moment.tz.link(CPM_Vars.time_links);
            
            var format = 'MMMM DD YYYY';
            
            if ( CPM_Vars.wp_date_format == 'Y-m-d' ) {
                format = 'YYYY-MM-DD';
            
            } else if ( CPM_Vars.wp_date_format == 'm/d/Y' ) {
                format = 'MM/DD/YYYY';
            
            } else if ( CPM_Vars.wp_date_format == 'd/m/Y' ) {
                format = 'DD/MM/YYYY';
            } 

            return moment.tz( date, CPM_Vars.wp_time_zone ).format( String( format ) );
        },

        /**
         * WP settings date time format convert to moment date format with time zone
         * 
         * @param  string date 
         * 
         * @return string      
         */
        dateTimeFormat: function( date ) {
            if ( date == '' ) {
                return;
            }

            moment.tz.add(CPM_Vars.time_zones);
            moment.tz.link(CPM_Vars.time_links);
            
            var date_format = 'MMMM DD YYYY',
                time_format = 'h:mm:ss a';
            
            if ( CPM_Vars.wp_date_format == 'Y-m-d' ) {
                date_format = 'YYYY-MM-DD';
            
            } else if ( CPM_Vars.wp_date_format == 'm/d/Y' ) {
                date_format = 'MM/DD/YYYY';
            
            } else if ( CPM_Vars.wp_date_format == 'd/m/Y' ) {
                date_format = 'DD/MM/YYYY';
            } 

            if ( CPM_Vars.wp_time_format == 'g:i a' ) {
                time_format = 'h:m a';
            
            } else if ( CPM_Vars.wp_time_format == 'g:i A' ) {
                time_format = 'h:m A';
            
            } else if ( CPM_Vars.wp_time_format == 'H:i' ) {
                time_format = 'HH:m';
            } 

            var format = String( date_format+', '+time_format );

            return moment.tz( date, CPM_Vars.wp_time_zone ).format( format );
        },

        /**
         * Get index from array object element
         * 
         * @param   array 
         * @param   id    
         * 
         * @return  int      
         */
        getIndex: function ( array,  id, slug) {
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
        dateISO8601Format: function( date ) {
            return moment( date ).format();
        },

        /**
         * Show hide todo-list edit form
         * 
         * @param  int comment_id 
         * 
         * @return void            
         */
        showHideListCommentEditForm: function( comment_id ) {
            var comment_index = this.getIndex( this.$store.state.lists[0].comments, comment_id, 'comment_ID' ) ,
                self = this;

            var edit_mode = self.$store.state.lists[0].comments[comment_index].edit_mode;

            if ( edit_mode ) {
                CPM_Component_jQuery.slide( comment_id, function() {
                    self.$store.commit( 'showHideListCommentEditForm', { comment_index: comment_index, list_index: 0 } );    
                });
            
            } else {
                self.$store.commit( 'showHideListCommentEditForm', { comment_index: comment_index, list_index: 0 } );    
                
                Vue.nextTick( function() {
                    CPM_Component_jQuery.slide( comment_id );
                } );
            }
        },

        /**
         * Show hide todo-list edit form
         * 
         * @param  int comment_id 
         * 
         * @return void            
         */
        showHideTaskCommentEditForm: function( task, comment_id ) {
            var list_index    = this.getIndex( this.$store.state.lists, task.post_parent, 'ID' ),
                task_index    = this.getIndex( this.$store.state.lists[list_index].tasks, task.ID, 'ID' ),
                comment_index = this.getIndex( this.$store.state.lists[list_index].tasks[task_index].comments, comment_id, 'comment_ID' ) ,
                self          = this;

            var edit_mode = self.$store.state.lists[list_index].tasks[task_index].comments[comment_index].edit_mode;

            if ( edit_mode ) {
                CPM_Component_jQuery.slide( comment_id, function() {
                    self.$store.commit( 'showHideTaskCommentEditForm', { list_index: list_index, task_index: task_index, comment_index: comment_index } );    
                });
            
            } else {
                self.$store.commit( 'showHideTaskCommentEditForm', { list_index: list_index, task_index: task_index, comment_index: comment_index } );    
                
                Vue.nextTick( function() {
                    CPM_Component_jQuery.slide( comment_id );
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
        get_porject_users_by_role: function( role ) {
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
        get_porject_users_id_by_role: function( role ) {
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
         * Remove comment
         * 
         * @param int comment_id 
         * 
         * @return void            
         */
        deleteComment: function( comment_id, list_id ) {
            
            if ( ! confirm( CPM_Vars.message.confirm ) ) {
                return;
            }

            var self       = this,
                list_index = this.getIndex( this.$store.state.lists, list_id, 'ID' ),
                form_data  = {
                    action: 'cpm_comment_delete',
                    comment_id: comment_id,
                    _wpnonce: CPM_Vars.nonce,
                };
                comment_index = this.getIndex( this.$store.state.lists[list_index].comments, comment_id, 'comment_ID' );

            // Seding request for insert or update todo list
            jQuery.post( CPM_Vars.ajaxurl, form_data, function( res ) {
                if ( res.success ) {
                    // Display a success message, with a title
                    //toastr.success(res.data.success);

                    CPM_Component_jQuery.fadeOut( comment_id, function() {
                        self.$store.commit( 'after_delete_comment', { 
                            list_index: list_index,
                            comment_index: comment_index
                        });
                    });
                    
                    
                }
            });
        },

        /**
         * Remove comment
         * 
         * @param int comment_id 
         * 
         * @return void            
         */
        deleteTaskComment: function( comment_id, task ) {
            
            if ( ! confirm( CPM_Vars.message.confirm ) ) {
                return;
            }

            var self       = this,
                list_index = this.getIndex( this.$store.state.lists, task.post_parent, 'ID' ),
                task_index = this.getIndex( this.$store.state.lists[list_index].tasks, task.ID, 'ID' ),
                form_data  = {
                    action: 'cpm_comment_delete',
                    comment_id: comment_id,
                    _wpnonce: CPM_Vars.nonce,
                };
                comment_index = this.getIndex( task.comments, comment_id, 'comment_ID' );

            // Seding request for insert or update todo list
            jQuery.post( CPM_Vars.ajaxurl, form_data, function( res ) {
                if ( res.success ) {
                    // Display a success message, with a title
                    //toastr.success(res.data.success);

                    CPM_Component_jQuery.fadeOut( comment_id, function() {
                        self.$store.commit( 'after_delete_task_comment', { 
                            list_index: list_index,
                            task_index: task_index,
                            comment_index: comment_index
                        });
                    });
                }
            });
        },

        /**
         * Get user information from task assigned user id
         *  
         * @param  array assigned_user 
         * 
         * @return obje               
         */
        getUsers: function( assigned_user ) {
            filtered_users = [];
            
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
        taskDateWrap: function( start_date, due_date ) {
            if ( start_date == '' && due_date == '' ) {
                return false;
            }

            moment.tz.add(CPM_Vars.time_zones);
            moment.tz.link(CPM_Vars.time_links);
            
            var today   = moment.tz( CPM_Vars.wp_time_zone ).format( 'YYYY-MM-DD' ),
                due_day = moment.tz( due_date, CPM_Vars.wp_time_zone ).format( 'YYYY-MM-DD' );
            
            if ( ! moment( String(due_day), 'YYYY-MM-DD' ).isValid() ) {
                return false;
            }
            
           return moment( String(today), 'YYYY-MM-DD' ).isSameOrBefore( String(due_day) ) ? 'cpm-current-date' : 'cpm-due-date';
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
        isBetweenDate: function( task_start_field, start_date, due_date ) {
            if ( task_start_field && ( start_date != '' ) && ( due_date != '' ) ) {
                return true;
            }

            return false;
        },
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
                is_update = typeof this.list.ID == 'undefined' ? false : true,
                form_data = {
                    action: typeof this.list.ID == 'undefined' ? 'cpm_add_list' : 'cpm_update_list',
                    tasklist_name: this.list.post_title,
                    tasklist_detail: this.list.post_content,
                    project_id: this.$store.state.project_id,
                    tasklist_milestone: this.tasklist_milestone,
                    list_id: typeof this.list.ID == 'undefined' ? false : this.list.ID,
                    _wpnonce: CPM_Vars.nonce,
                };
            
            this.show_spinner = true;

            form_data = this.befor_new_todo_list( form_data, is_update, this );
            
            // Seding request for insert or update todo list
            jQuery.post( CPM_Vars.ajaxurl, form_data, function( res ) {

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

                    self.after_new_todo_list();
                    
                    // Update lists array from vuex store 
                    self.$store.commit( 'update_todo_list', { res_list: list, list: self.list, index: self.index, is_update: is_update } );
                
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
    mixins: [CPM_Mixin],

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

        /**
         * Get task for single task popup
         * 
         * @return object
         */
        task: function() {
            return this.$store.state.task;
        }
    },

    methods: {

        /**
         * Count completed tasks
         * 
         * @param  array tasks 
         * 
         * @return int      
         */
        countCompletedTasks: function( tasks ) {
            var completed_task = 0;
            
            tasks.filter( function( task ) {
                if ( ( task.completed === 1 ) || task.completed ) {
                    completed_task++;
                }
            });

            return completed_task;
        },

        /**
         * Count incompleted tasks
         * 
         * @param  array tasks
         *  
         * @return int       
         */
        countIncompletedTasks: function( tasks ) {
            var in_completed_task = 0;

            tasks.filter( function( task ) {
                if ( ( task.completed === 0 ) || !task.completed ) {
                    in_completed_task++;
                }
            });

            return in_completed_task;
        },

        /**
         * Get task completed percentage from todo list
         * 
         * @param  array tasks
         *  
         * @return float       
         */
        getProgressPercent: function( tasks ) {
            var total_tasks     = tasks.length,
                completed_tasks = this.countCompletedTasks( tasks ),
                progress        = ( 100 * completed_tasks ) / total_tasks;

            return isNaN( progress ) ? 0 : progress.toFixed(0);
        },

        /**
         * Get task completed progress width
         * 
         * @param  array tasks 
         * 
         * @return obj       
         */
        getProgressStyle: function( tasks ) {
            var width = this.getProgressPercent( tasks );

            return { width: width+'%' };
        },

        /**
         * Delete list
         * 
         * @param  int list_id 
         * 
         * @return void         
         */
        deleteList: function( list_id ) {
            if ( ! confirm( CPM_Vars.message.confirm ) ) {
                return;
            }

            var self       = this,
                list_index = this.getIndex( this.$store.state.lists, list_id, 'ID' ),
                form_data  = {
                    action: 'cpm_tasklist_delete',
                    list_id: list_id,
                    _wpnonce: CPM_Vars.nonce,
                };

            // Seding request for insert or update todo list
            jQuery.post( CPM_Vars.ajaxurl, form_data, function( res ) {
                if ( res.success ) {
                    // Display a success message, with a title
                    //toastr.success(res.data.success);
                    
                    CPM_Component_jQuery.fadeOut( list_id, function() {
                        self.$store.commit( 'after_delete_todo_list', { 
                            list_index: list_index,
                        });
                    });
                } else {
                    // Showing error
                    res.data.error.map( function( value, index ) {
                        toastr.error(value);
                    });
                }
            });
        }
    }

});

// Show all todos
Vue.component('tasks', {

    // Assign template for this component
    template: '#tmpl-cpm-tasks', 
    
    // Get passing data for this component. Remember only array and objects are
    props: ['list', 'index'],

    // Include global properties and methods
    mixins: [CPM_Mixin],

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
           task_start_field: this.$store.state.permissions.task_start_field == 'on' ? true : false,
           is_single_list: this.$store.state.is_single_list
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
            return this.list.tasks.filter(function( task ) {
                return ( task.completed == '1' || task.completed );
            }); 
        }
    },

    methods: {
        /**
         * Show task edit form
         * 
         * @param  int task_index 
         * 
         * @return void            
         */
        taskEdit: function( task_id ) {
            var self = this;

            this.tasks.map(function( task, index ) {
                if ( task.ID == task_id ) {
                    self.showHideTaskForm( self.index, index );
                }
            }); 
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
         * Mark task done and undone
         * 
         * @param  int  task_id    
         * @param  Boolean is_checked 
         * @param  int  task_index 
         * 
         * @return void             
         */
        taskDoneUndone: function( task_id, is_checked, task_index ) {
            var self = this,
                form_data = {
                    _wpnonce: CPM_Vars.nonce,
                    action: is_checked ? 'cpm_task_complete' : 'cpm_task_open',
                    task_id: task_id,
                    project_id: CPM_Vars.project_id
                }

            jQuery.post( CPM_Vars.ajaxurl, form_data, function( res ) {

                if ( res.success ) {
                    // Display a success message
                    toastr.success(res.data.success);
                    //self.$store.commit( 'task_done_undone', { is_done: is_checked, list_index: self.index, task_index: task_index } );
                } else {
                    // Showing error
                    res.data.error.map( function( value, index ) {
                        toastr.error(value);
                    });
                }
            });
        },

        /**
         * Single task popup
         * 
         * @param  object task
         *  
         * @return void      
         */
        singleTask: function( task ) {
            this.$store.commit( 'single_task_popup', { task: task } );
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
        }
    }

});

Vue.component('cpm-task-comment-form', {
    // Assign template for this component
    template: '#tmpl-cpm-task-comment-form',

    // Include global properties and methods
    mixins: [CPM_Mixin],

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
            return this.get_porject_users_by_role('co_worker');
        }
    },

    methods: {
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
    mixins: [CPM_Mixin],

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
    mixins: [CPM_Mixin],

    /**
     * Initial data for this component
     * 
     * @return obj
     */
    data: function() {
        return {
            
        }
    },

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
    mixins: [CPM_Mixin],

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
            var self = this;

            if ( typeof task_id == 'undefined'   ) {
                self.showHideTaskForm( list_index );
                return;
            }

            this.list.tasks.map(function( task, index ) {
                if ( task.ID == task_id ) {
                    self.showHideTaskForm( list_index, index );
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
                        // Update vuex state lists after insert or update task 
                        self.$store.commit( 'update_task', { res: res, list_index: self.list_index, is_update: is_update } );    
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
    mixins: [CPM_Mixin],

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
        }
    },

    computed: {
        lists: function () {
            return this.$store.state.lists;
        },

        loading: function() {
            return this.$store.state.loading;
        },

        show_list_form: function() {
            return this.$store.state.show_list_form;
        },

        hasTodoLists: function() {
            return this.$store.state.lists.length;
        }

    },

    // Initial doing 
    created: function() {
        this.getInitialData( this.$store.state.project_id );
    },

    methods: {

        // Get initial data for todo list page 
        getInitialData: function( project_id ) {

            var self = this,
                data = {
                    project_id: project_id,
                    _wpnonce: CPM_Vars.nonce,
                    action: 'cpm_initial_todo_list'
                }

                
            jQuery.post( CPM_Vars.ajaxurl, data, function( res ) {
                if ( res.success ) {
                    self.$store.commit( 'setTaskInitData', res );
                } 
                
            });
        },
    }
}

var CPM_List_Single = { 

    // Assign template for this component
    template: '#tmpl-cpm-todo-list-single',  

    // Include global properties and methods
    mixins: [CPM_Mixin],

    /**
     * Initial data for this component
     * 
     * @return obj
     */
    data: function() {
        return {
            list_id: this.$route.params.list_id,
            list: {},
            index: false,
        }
    },

    /**
     * Initial action for this component
     * 
     * @return void
     */
    created: function() {
        // Get todo list 
        this.getList( this.$route.params.list_id );
    },

    watch: {
        '$route': function (to, from) {
            
        },
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
    },

    methods: {
        /**
         * Get todo list for single todo list page
         * 
         * @param  int list_id 
         * 
         * @return void         
         */
        getList: function( list_id ) {
            
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
                        milestones: res.data.milestones,
                        project_users: res.data.project_users
                    });
                } 
            });
        }
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
        }
    }
});

Vue.component('cpm-list-comment-form', {
    // Assign template for this component
    template: '#tmpl-cpm-list-comment-form',

    // Include global properties and methods
    mixins: [CPM_Mixin],

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
        }

    }
});

Vue.component('cpm-list-comments', {
    // Assign template for this component
    template: '#tmpl-cpm-list-comments',

    // Get passing data for this component. 
    props: ['comments', 'list'],

    // Include global properties and methods
    mixins: [CPM_Mixin],

    computed: {
        /**
         * Get current user avatar
         */
        getCurrentUserAvatar: function() {
            return CPM_Vars.current_user_avatar_url;
        },
    }
});

Vue.component('cpm-task-comments', {
    // Assign template for this component
    template: '#tmpl-cpm-task-comments',

    // Get passing data for this component. 
    props: ['comments', 'task'],

    // Include global properties and methods
    mixins: [CPM_Mixin],

    computed: {
        /**
         * Get current user avatar
         */
        getCurrentUserAvatar: function() {
            return CPM_Vars.current_user_avatar_url;
        },
    }
});

Vue.component( 'cpm-loading', {
    template: '#tmpl-cpm-spinner'
});

Vue.component( 'cpm-single-task', {
    // Assign template for this component
    template: '#tmpl-cpm-task-single',

    // Get passing data for this component. 
    props: ['task'],

    // Include global properties and methods
    mixins: [CPM_Mixin],

    methods: {
        closePopup: function() {
            this.$store.commit( 'close_single_task_popup' );
        }
    },

    computed: {
        task_start_field: function() {
           return this.$store.state.permissions.task_start_field == 'on' ? true : false;
        }
    }
});

// Global multiselect
Vue.component('multiselect', VueMultiselect.default);





