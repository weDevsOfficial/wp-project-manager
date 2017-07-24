/**
 * Global object for all components and root
 */
var cpm_task_store = {
    /**
     * Assign global property
     * 
     * @type Object
     */
    state: {
        lists: [],
        list_total: 0,
        milestones: [],
        init: {},
        is_single_list: false,
        project_users: [],
        loading: true,
        show_list_form: false,
        project_id: CPM_Vars.project_id ? CPM_Vars.project_id : false,
        permissions: {},
        task: {},
        is_single_task: false,
        add_filter: {},
        todo_list_per_page: 5,
        get_current_user_id: CPM_Vars.get_current_user_id,
        active_mode: 'list',
        inline_task_users: [],
        inline_task_start_date: '',
        inline_task_end_date: '',
        inline_task_description: '',
        inline_todo_list_id: 0,
        inline_display: {
            users: false,
            start: false,
            end: false,
            lists: false,
            description: false
        }
    },

    /**
     * Change any global property from here
     */
    mutations: {

        /**
         * Store todo lists page initial property
         * 
         * @param object state     
         * @param object task_init 
         *
         * @return void
         */
        setTaskInitData: function( state, task_init ) {
            state.lists         = [];
            state.list_total    = 0;
            state.milestones    = [];
            state.init          = {};
            state.project_users = [];
            state.permissions   = {};

            state.loading        = true;
            state.is_single_list = false,
            
            Vue.nextTick(function () {
                state.lists         = task_init.data.lists;
                state.milestones    = task_init.data.milestones;
                state.init          = task_init.data;
                state.project_users = task_init.data.project_users;
                state.permissions   = task_init.data.permissions;
                state.list_total    = task_init.data.list_total;
                state.todo_list_per_page = task_init.data.todo_list_per_page;
                state.active_mode = task_init.data.active_mode;
                state.loading        = false;
                state.is_single_list = false;
            });
        },

        loadingEffect: function(state, loading_status) {
            state.loading = loading_status;
        },

        /**
         * New todo list form showing or hiding
         * 
         * @param  object state 
         * 
         * @return void       
         */
        newTodoListForm: function( state ) {
            state.show_list_form = state.show_list_form ? false : true;;
        },

        /**
         * Update todo list form showing or hiding
         * 
         * @param  object state 
         * @param  object list  
         * 
         * @return void       
         */
        showHideUpdatelistForm: function( state, list ) {
            state.lists[list.list_index].edit_mode = state.lists[list.list_index].edit_mode ? false : true; 
        },

        /**
         * Showing and hiding task insert and edit form
         * 
         * @param  object state 
         * @param  int index 
         * 
         * @return void       
         */
        showHideTaskForm: function( state, index ) {
          	
            if ( ( typeof index.task_index == 'undefined' ) || ( index.task_index === false ) ) {
                state.lists[index.list_index].show_task_form = state.lists[index.list_index].show_task_form ? false : true; 
            } else {
                state.lists[index.list_index].tasks[index.task_index].edit_mode = state.lists[index.list_index].tasks[index.task_index].edit_mode ? false : true; 
            }
        },

        /**
         * Update state lists property after insert new todo list or update todo list
         * 
         * @param  object state 
         * @param  object res   
         * 
         * @return void       
         */
        update_todo_list: function( state, res ) {

            if ( res.is_update ) {
                state.lists.splice( res.index, 1 );
                state.lists.splice( res.index, 0, res.res_list );
            } else {
                state.lists.splice( 0, 0, res.res_list );
            }
        },

        /**
         * Insert new task to state lists.tasks property. 
         *  
         * @param  object state 
         * @param  object data  
         * 
         * @return void
         */
        update_task: function( state, data ) {
            var index = data.list_index;
            state.lists[data.list_index].count_incompleted_tasks = parseInt( state.lists[data.list_index].count_incompleted_tasks ) + 1;
            state.lists[index].tasks.splice( 0, 0, data.res.data.task );
        },

        /**
         * When goto single todo list page. Empty the state lists array and insert single todo list. 
         * 
         * @param  object state 
         * @param  object data  
         * 
         * @return void       
         */
        update_todo_list_single: function( state, data ) {
            
            state.lists          = [];
            state.milestones     = [];
            state.project_users  = [];

            Vue.nextTick(function () {
                state.lists.push(data.list);
                state.milestones     = data.milestones;
                state.project_users  = data.project_users;
                state.permissions    = data.permissions;
                state.is_single_list = true;
            });
        },

        /**
         * Make single task complete and incomplete
         * 
         * @param  object state 
         * @param  object data  
         * 
         * @return void        
         */
        task_done_undone: function( state, data ) {
            if ( data.is_done ) {
                state.lists[data.list_index].count_incompleted_tasks = parseInt( state.lists[data.list_index].count_incompleted_tasks ) - 1;
                state.lists[data.list_index].count_completed_tasks = parseInt( state.lists[data.list_index].count_completed_tasks ) + 1;
            } else {
                state.lists[data.list_index].count_incompleted_tasks = parseInt( state.lists[data.list_index].count_incompleted_tasks ) + 1;
                state.lists[data.list_index].count_completed_tasks = parseInt( state.lists[data.list_index].count_completed_tasks ) - 1;
            }

            state.lists[data.list_index].tasks[data.task_index].completed = data.is_done ? 1 : 0;
        },

        /**
         * After update list-comment store it in state lists
         * 
         * @param  object state 
         * @param  object data  
         * 
         * @return void        
         */
        update_todo_list_comment: function( state, data ) {
            var list_index = false;

            state.lists.filter( function( list, index ) {
                list_index = ( list.ID == data.list_id ) ? index : false;
            });

            if ( list_index !== false ) {
                state.lists[list_index].comments.push( data.comment );
            }
        },

        /**
         * Remove comment from list
         * 
         * @param  object state 
         * @param  object data  
         * 
         * @return void       
         */
        after_delete_comment: function( state, data ) {
            state.lists[data.list_index].comments.splice( data.comment_index, 1 );
        },

        /**
         * Remove comment from task
         * 
         * @param  object state 
         * @param  object data  
         * 
         * @return void       
         */
        after_delete_task_comment: function( state, data ) {
            state.lists[data.list_index].tasks[data.task_index].comments.splice( data.comment_index, 1 );
        },

        /**
         * Showing todo-list comment edit form
         * 
         * @param  object state 
         * @param  object data  
         * 
         * @return void
         */
        showHideListCommentEditForm: function( state, data ) {

            if ( data.comment_index !== false ) {
                state.lists[data.list_index].comments[data.comment_index].edit_mode = state.lists[data.list_index].comments[data.comment_index].edit_mode ? false : true;
            }
        },

        /**
         * Showing task comment edit form
         * 
         * @param  object state 
         * @param  object data  
         * 
         * @return void
         */
        showHideTaskCommentEditForm: function( state, data ) {
            if ( data.comment_index !== false ) {
                state.lists[data.list_index].tasks[data.task_index].comments[data.comment_index].edit_mode = state.lists[data.list_index].tasks[data.task_index].comments[data.comment_index].edit_mode ? false : true;
            }
        },

        /**
         * Set single task popup data to vuex store
         * 
         * @param  object state 
         * @param  object task  
         * 
         * @return void       
         */
        single_task_popup: function( state ) {
            //state.task = {};
            state.is_single_task = true;

            // Vue.nextTick(function() {
            //     state.task = task.task;
            //     state.is_single_task = true;
            // });
        },

        /**
         * Make empty store task and make false is_single_task
         * 
         * @param  object state 
         * 
         * @return void       
         */
        close_single_task_popup: function( state ) {
            state.is_single_task = false;
            //state.task = {};
        },

        update_task_comment: function( state, comment ) {
            state.lists[comment.list_index].tasks[comment.task_index].comments.push(comment.comment);
        },

        /**
         * Remove todo list 
         * 
         * @param  object state 
         * @param  object list  
         * 
         * @return return
         */
        after_delete_todo_list: function( state, list ) {
            state.lists.splice( list.list_index, 1 );
        },

        /**
         * After delete task
         * 
         * @param  object state 
         * @param  object task  
         * 
         * @return void       
         */
        after_delete_task: function( state, task ) {
            
            if ( state.lists[task.list_index].tasks[task.task_index].completed == '0' ) {
               state.lists[task.list_index].count_incompleted_tasks = parseInt( state.lists[task.list_index].count_incompleted_tasks ) - 1;
            }  

            if ( state.lists[task.list_index].tasks[task.task_index].completed == '1' ) {
                state.lists[task.list_index].count_completed_tasks = parseInt( state.lists[task.list_index].count_completed_tasks ) - 1;
            }

            state.lists[task.list_index].tasks.splice( task.task_index, 1 );
        },

        /**
         * After get tasks from list id
         * 
         * @param  object state 
         * @param  object task  
         * 
         * @return void       
         */
        insert_tasks: function( state, task ) {
            
            task.tasks.tasks.forEach(function(task_obj) {
                //console.log(task);
               state.lists[task.list_index].tasks.push(task_obj);
            });
            //state.lists[task.list_index].tasks = task.tasks.tasks;
        },

        emptyTodoLists: function(state) {
            state.lists = [];
        },

        /**
         * Chanage view active mode
         *
         * @param  object state 
         * @param  object mode 
         * 
         * @return void
         */
        change_active_mode: function(state, mode) {
            state.active_mode = mode.mode;
        },

        add_inline_task_users: function(state, users) {
            state.inline_task_users = users.users;
        },

        add_inline_task_start_date: function(state, date) {
            state.inline_task_start_date = date.date;
        },

        add_inline_task_end_date: function(state, date) {
            state.inline_task_end_date = date.date;
        },

        add_inline_task_description: function(state, description) {
            state.inline_task_description = description.description;
        },

        add_inline_todo_list_id: function(state, list) {
            state.inline_todo_list_id = list.list_id;
        },

        inline_display: function(state, inline_display) {
            state.inline_display = inline_display;
        },

        loading_effect: function(state, effect) {
            state.loading = effect.mode;
        },

        afterUpdateTaskElement: function(state, task) {
            jQuery.extend(true, state.lists[task.list_index].tasks[task.task_index], task.task);
            state.lists[task.list_index].tasks[task.task_index].assigned_to = task.task.assigned_to;
        }

    }
}