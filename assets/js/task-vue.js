;(function($) {

    'use strict';

    /**
     * Required jQuery methods 
     * 
     * @type Object
     */
    var CPM_Task = {
        init: function() {
            this.datepicker();
        },

        datepicker: function() {
            $( '.cpm-date-field').datepicker({
                dateFormat: 'yy-mm-dd',
                changeMonth: true,
                changeYear: true,
                yearRange: '-50:+5',
                onSelect: function(dateText) {
                    CPM_Task_Vue.$emit( 'cpm_date_picker', { field: 'datepicker', date: dateText } );
                }
            });

            $( ".cpm-date-picker-from" ).datepicker({
                dateFormat: 'yy-mm-dd',
                changeYear: true,
                changeMonth: true,
                numberOfMonths: 1,
                onClose: function( selectedDate ) {
                    $( ".cpm-date-picker-to" ).datepicker( "option", "minDate", selectedDate );
                },
                onSelect: function(dateText) {
                    CPM_Task_Vue.$emit( 'cpm_date_picker', { field: 'datepicker_from', date: dateText } );
                }
            });

            $( ".cpm-date-picker-to" ).datepicker({
                dateFormat: 'yy-mm-dd',
                changeMonth: true,
                changeYear: true,
                numberOfMonths: 1,
                onClose: function( selectedDate ) {
                    $( ".cpm-date-picker-from" ).datepicker( "option", "maxDate", selectedDate );
                },
                onSelect: function(dateText) {
                    CPM_Task_Vue.$emit( 'cpm_date_picker', { field: 'datepicker_to', date: dateText } );
                }
            });
        }
    }

    /**
     * Handeling global property only for todo list page
     */
    var Task_Store = new Vuex.Store({
        /**
         * Assign global property
         * 
         * @type Object
         */
        state: {
            lists: [],
            milestones: [],
            init: {},
            is_single_list: false,
            project_users: [],
            loading: true,
            show_list_form: false,
            project_id: CPM_Vars.project_id ? CPM_Vars.project_id : false,
            permissions: {},
            task: {},
            is_single_task: false
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

                    state.loading        = false;
                    state.is_single_list = false;
                });
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
             * Set single task popup data to vuex store
             * 
             * @param  object state 
             * @param  object task  
             * 
             * @return void       
             */
            single_task_popup: function( state, task ) {
                state.task = {};
                state.is_single_task = false;

                Vue.nextTick(function() {
                    state.task = task.task;
                    state.is_single_task = true;
                });
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
                state.task = {};
            },

            update_task_comment: function( state, comment ) {
                state.lists[comment.list_index].tasks[comment.task_index].comments.push(comment.comment);
            }
        }
    });


    /**
     * Todo list router
     */
    var CPM_Task_Router = new VueRouter({

        routes: [
            // Default template. showing todolist and task
            { path: '/', component: CPM_Router_Init },

            // Todo list singe page
            { path: '/list/:list_id', component: CPM_List_Single, name: 'list_single' },
        ], 
    });

    // Register a global custom directive called v-cpm-datepicker
    Vue.directive('cpm-datepicker', {
        inserted: function (el) {
            CPM_Task.datepicker( el );
        }
    });

    /**
     * Todo list root or main instance
     * 
     * @type Vue
     */
    var CPM_Task_Vue = new Vue({
        
        store: Task_Store,

        router: CPM_Task_Router,

        mixins: [CPM_Mixin],

    }).$mount('#cpm-task-el');



})(jQuery);
