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
                this.$store.commit( 'showHideUpdatelistForm', { list: list, list_index: list_index } );
            } else {
                this.$store.commit( 'newTodoListForm' );
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
            this.$store.commit( 'showHideTaskForm', { list_index: list_index, task_index: task_index } );
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
            
            var format = 'MMMM DD YYYY';
            
            if ( CPM_Vars.wp_date_fomat == 'Y-m-d' ) {
                format = 'YYYY-MM-DD';
            
            } else if ( CPM_Vars.wp_date_fomat == 'm/d/Y' ) {
                format = 'MM/DD/YYYY';
            
            } else if ( CPM_Vars.wp_date_fomat == 'd/m/Y' ) {
                format = 'DD/MM/YYYY';
            } 

            return moment.tz( date, CPM_Vars.wp_time_zone ).format( String( format ) );
        }
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
    mixins: [CPM_Mixin],

    /**
     * Initial data for this component
     * 
     * @return obj
     */
    data: function() {
    	return {
            tasklist_privacy: this.list.private == 'on' ? true : false,
            submit_btn_text: this.list.ID ? CPM_Vars.message.update_todo : CPM_Vars.message.new_todo,
            tasklist_milestone: this.list.milestone ? this.list.milestone : '-1',
            show_spinner: false,
            error: [],
            success: '',
            submit_disabled: false
    	}
    },

    computed: {
        
        /**
         * Checking, is todo list view private 
         * 
         * @return boolen
         */
        tdolist_view_private: function() {

            if ( ! this.$store.state.init.hasOwnProperty('premissions')) {
                return true;
            }

            if ( this.$store.state.init.premissions.hasOwnProperty('tdolist_view_private')) {
                return this.$store.state.init.premissions.tdolist_view_private
            }

            return true;
        },

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
            return list.ID ? 'cpm-todo-form-wrap cpm-form' : 'cpm-todo-list-form-wrap cpm-form';
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
                    tasklist_privacy: this.tasklist_privacy ? 'on' : 'no',
                    project_id: this.$store.state.project_id,
                    tasklist_milestone: this.tasklist_milestone,
                    list_id: typeof this.list.ID == 'undefined' ? false : this.list.ID,
                    _wpnonce: CPM_Vars.nonce,
                };
            
            this.show_spinner = true;
            
            // Seding request for insert or update todo list
            jQuery.post( CPM_Vars.ajaxurl, form_data, function( res ) {

                if ( res.success ) {
                    self.tasklist_privacy   = false;
                    self.tasklist_milestone = '-1';
                    self.show_spinner       = false;

                    if ( is_update ) {
                        var list = res.data.list;
                    } else {
                        var list = res.data.list.list;
                    }

                    // Display a success message, with a title
                    toastr.success(res.data.success);

                    // Hide the todo list update form
                    self.showHideTodoListForm( self.list, self.index );
                    
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
            index: false
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

        is_single_list: function() {
            return this.$store.state.is_single_list;
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
           task_index: false,
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
            task_privacy: this.task.task_privacy == 'yes' ? true : false,
            submit_disabled: false,
            show_spinner: false,
        }
    },

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

        task_assign: {
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

            set: function ( selected_users ) {
                this.task.assigned_to = selected_users.map(function (user) {
                    return user.id;
                });
            }
        },
    },

    methods: {

        getDatePicker: function( data ) {
            
            if ( data.field == 'datepicker_from' ) {
                this.task.start_date = data.date;
            }

            if ( data.field == 'datepicker_to' ) {
                this.task.due_date = data.date;
            }
        },

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

        newTask: function() {
            if ( this.submit_disabled ) {
                return;
            }

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
            
            this.show_spinner = true;

            jQuery.post( CPM_Vars.ajaxurl, form_data, function( res ) {

                if ( res.success ) {
                    self.task_privacy = false;
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
                    }
                    
                    if ( ! form_data.task_id ) {
                        // Update store lists array 
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
            content: 'I am text content',
            editor_id: 'test'
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

        cpm_content: function( new_val ) {
            console.log(new_val);
        }
    },

    computed: {

        /**
         * Get current user avatar
         */
        getCurrentUserAvatar: function() {
            return CPM_Vars.current_user_avatar_url;
        },

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
            
            var self = this,
                form_data = {
                    list_id: list_id,
                    action: 'cpm_get_todo_list_single',
                    project_id: CPM_Vars.project_id,
                    _wpnonce: CPM_Vars.nonce,
                }

            jQuery.post( CPM_Vars.ajaxurl, form_data, function( res ) {

                if ( res.success ) {
                    // self.list = res.data.list;
                    self.$store.commit( 'update_todo_list_single', { 
                        list: res.data.list,
                        milestones: res.data.milestones,
                        project_users: res.data.project_users
                    });
                
                } else {

                }
            });
        }
    }

}

Vue.component('cpm-text-editor', {
    template: '<textarea :id="editor_id" v-model="content"></textarea>',

    props: ['editor_id', 'content'],

    created: function() {
        var self = this;
        tinymce.execCommand( 'mceRemoveEditor', true, self.editor_id );
        
        tinymce.init({
            selector: 'textarea#' +self.editor_id,
            menubar: false,
            setup: function (editor) {
                
                editor.on('change', function () {
                    self.content = editor.getContent();
                });
                editor.on('keyup', function () {
                    self.content = editor.getContent();
                });
                editor.on('NodeChange', function () {
                    self.content = editor.getContent();
                });
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
            plugins: 'wplink wordpress',
            toolbar1: 'shortcodes bold italic strikethrough bullist numlist alignleft aligncenter alignjustify alignright link',
            toolbar2: 'formatselect forecolor backcolor underline blockquote hr code',
            toolbar3: 'fontselect fontsizeselect removeformat undo redo',
        });

        //tinymce.execCommand( 'mceRemoveEditor', true, id );
            //tinymce.execCommand( 'mceAddEditor', true, id );
           // tinymce.execCommand( 'mceAddControl', true, id );
    },

    watch: {
        content: function(new_val) {
            console.log(new_val);
        }
    },

});

// Global multiselect
Vue.component('multiselect', VueMultiselect.default);





