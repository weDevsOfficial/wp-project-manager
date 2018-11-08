
/**
 * Make sure to call pm.Vue.use(Vuex) first if using a vuex module system
 */
export default {
    /**
     * Assign global property
     * 
     * @type Object
     */
    state: {
        isListFetch: false,
        lists: [],
        list: {},
        list_comments: [],
        lists_meta: {},
        init: {},
        balankTemplateStatus: false,
        listTemplateStatus: false,
        is_single_list: true,
        project_users: [],
        loading: true,
        is_active_list_form: false,
        project_id: false,
        permissions: {
            create_todolist: true
        },
        task: {},
        is_single_task: false,
        add_filter: {},
        todo_list_per_page: 5,
        get_current_user_id: 1,
        active_mode: 'list',
        inline_task_users: [],
        inline_task_start_date: '',
        inline_task_end_date: '',
        inline_task_description: '',
        inline_todo_list_id: 0,
        expandListIds: [],
        inline_display: {
            users: false,
            start: false,
            end: false,
            lists: false,
            description: false
        },
        total_list_page: 0,
        getIndex: function ( itemList, id, slug) {
            var index = false;

            itemList.forEach(function(item, key) {
                if (item[slug] == id) {
                    index = key;
                }
            });

            return index;
        },
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
            
            pm.Vue.nextTick(function () {
                state.lists         = task_init.data.lists;
                state.milestones    = task_init.data.milestones;
                state.init          = task_init.data;
                state.project_users = task_init.data.project_users;
                state.permissions   = task_init.data.permissions;
               // state.list_total    = task_init.data.list_total;
               // state.todo_list_per_page = task_init.data.todo_list_per_page;
                //state.active_mode = task_init.data.active_mode;
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
        afterUpdateTask: function( state, data ) {

            var list_index = state.getIndex( state.lists, data.list_id, 'id' );

            if (list_index === false) {
                return;
            }
            
            if ( data.task.status === 'incomplete' || data.task.status === false ) {
                var task_index = state.getIndex( 
                        state.lists[list_index].incomplete_tasks.data, 
                        data.task.id, 
                        'id' 
                );
                
                state.lists[list_index].incomplete_tasks.data.splice( task_index, 1, data.task );
            }

            if ( data.task.status === 'complete' || data.task.status === true ) {
                var task_index = state.getIndex( 
                        state.lists[list_index].complete_tasks.data, 
                        data.task.id, 
                        'id' 
                );
                
                state.lists[list_index].complete_tasks.data.splice( task_index, 1, data.task );
            }
        },

        afterNewTask (state, data) {
            var list_index = state.getIndex( state.lists, data.list_id, 'id' );

            if (list_index === false) {
                return false;
            }

            if ( data.task.status === 'incomplete' || data.task.status === false ) {

                if(typeof state.lists[list_index].incomplete_tasks !== 'undefined'){

                    if( typeof data.task.task_list === 'undefined') {
                        data.task.task_list = {
                            data: data.list 
                        };
                    }
                    state.lists[list_index].incomplete_tasks.data.push(data.task);
                }else{
                    state.lists[list_index].incomplete_tasks = { data: data.task };
                }                
            }

            state.lists[list_index].meta.total_incomplete_tasks = state.lists[list_index].meta.total_incomplete_tasks + 1;
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

            pm.Vue.nextTick(function () {
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
        afterTaskDoneUndone: function( state, data ) {
            var list_index = state.getIndex( state.lists, data.list_id, 'id' );
            
            if (data.status === 1) {
                if (typeof state.lists[list_index].incomplete_tasks == 'undefined') {
                    return;
                }
                var task_index = state.getIndex( state.lists[list_index].incomplete_tasks.data, data.task_id, 'id' );
                if(task_index === false ) {
                    return false;
                }
                var task = state.lists[list_index].incomplete_tasks.data[task_index];
                task.status = true;
                
                if (typeof state.lists[list_index].complete_tasks !== 'undefined') {
                    state.lists[list_index].complete_tasks.data.splice(0,0,task);
                } else {
                    state.lists[list_index].complete_tasks = { data : [task] }
                }

                state.lists[list_index].incomplete_tasks.data.splice(task_index, 1);
                state.lists[list_index].meta.total_complete_tasks = state.lists[list_index].meta.total_complete_tasks + 1;
                state.lists[list_index].meta.total_incomplete_tasks = state.lists[list_index].meta.total_incomplete_tasks - 1;
            }

            if (data.status === 0) {
                if (typeof state.lists[list_index].complete_tasks == 'undefined') {
                    return;
                }
                var task_index = state.getIndex( state.lists[list_index].complete_tasks.data, data.task_id, 'id' );

                var task = state.lists[list_index].complete_tasks.data[task_index];
                task.status = false;
                
                if (typeof state.lists[list_index].incomplete_tasks !== 'undefined') {
                    state.lists[list_index].incomplete_tasks.data.splice(0,0,task);
                } else {
                    state.lists[list_index].incomplete_tasks = { data: [task] }
                }

                state.lists[list_index].complete_tasks.data.splice(task_index, 1);
                state.lists[list_index].meta.total_complete_tasks = state.lists[list_index].meta.total_complete_tasks - 1;
                state.lists[list_index].meta.total_incomplete_tasks = state.lists[list_index].meta.total_incomplete_tasks + 1;
            }
        },

        /**
         * After update list-comment store it in state lists
         * 
         * @param  object state 
         * @param  object data  
         * 
         * @return void        
         */
        listNewComment: function( state, data ) {
            var list_index = state.getIndex( state.lists, data.list_id, 'id' );

            state.lists[list_index].comments.data.push(data.comment);
        },

        /**
         * After update list-comment store it in state lists
         * 
         * @param  object state 
         * @param  object data  
         * 
         * @return void        
         */
        listUpdateComment: function( state, data ) {
            var list_index = state.getIndex( state.lists, data.list_id, 'id' ),
                comment_index = state.getIndex( state.lists[list_index].comments.data, data.comment_id, 'id' );

            state.lists[list_index].comments.data.splice(comment_index,1,data.comment);
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
            state.task = task.task;
        },

        /**
         * Make empty store task and make false is_single_task
         * 
         * @param  object state 
         * 
         * @return void       
         */
        updateSingleTaskActiveMode: function( state, status ) {
            state.is_single_task = status;
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
        afterDeleteTask: function( state, data ) {
            var list_index = state.getIndex(state.lists, data.list.id, 'id');

            if ( data.task.status === false || data.task.status === 'incomplete' ) {
                var task_index = state.getIndex(state.lists[list_index].incomplete_tasks.data, data.task.id, 'id');
                state.lists[list_index].incomplete_tasks.data.splice(task_index, 1);
                state.lists[list_index].meta.total_incomplete_tasks = state.lists[list_index].meta.total_incomplete_tasks - 1;
            } else {
                var task_index = state.getIndex(state.lists[list_index].complete_tasks.data, data.task.id, 'id');
                state.lists[list_index].complete_tasks.data.splice(task_index, 1);
                state.lists[list_index].meta.total_incomplete_tasks = state.lists[list_index].meta.total_complete_tasks - 1;
            }
            
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
        },

        setLists (state, lists) {
            state.lists = lists; 
            state.isListFetch = true;
        },
        setList(state, list){
            state.lists = [list];
        },

        afterNewList (state, list) {
            var per_page = state.lists_meta.per_page,
                length   = state.lists.length;

            if (per_page <= length) {
                state.lists.splice(1,0,list);
                state.lists.pop();
            } else {
                state.lists.splice(1,0,list);
            }
        },
        afterUpdateList (state, list) {
            var list_index = state.getIndex(state.lists, list.id, 'id');
            var merge_list = jQuery.extend(true, list, state.lists[list_index]);
            state.lists.splice(list_index,1,list);
        },
        afterNewListupdateListsMeta (state) {
            state.lists_meta.total = state.lists_meta.total + 1;
            state.lists_meta.total_pages = Math.ceil( state.lists_meta.total / state.lists_meta.per_page );
        },
        afterDeleteList (state, list_id) {
            var list_index = state.getIndex(state.lists, list_id, 'id');
            state.lists.splice(list_index,1);
            state.lists_meta.total = state.lists_meta.total - 1;
        },

        setListComments (state, comments) {
            state.list_comments = comments;
        },

        setListForSingleListPage (state, list) {
            state.list = list;
        },

        setMilestones (state, milestones) {
            state.milestones = milestones;
        },

        showHideListFormStatus (state, data) {
            if(data.list && !jQuery.isEmptyObject(data.list)) {
                var list_index = state.getIndex(state.lists, data.list.id, 'id');
                pm.Vue.set(state.lists[list_index], 'edit_mode', data.status);
            } else {
                if ( data.status === 'toggle' ) {
                    state.is_active_list_form = state.is_active_list_form ? false : true;
                } else {
                    state.is_active_list_form = data.status;
                } 
            }
  
        },

        setTotalListPage (state, total) {
            state.total_list_page = total;
        },

        setListsMeta (state, meta) {
            state.lists_meta = meta;
        },
        setSingleTask (state, data) {
            state.task = data;
 
        },
        setTasks(state, data){
            var list_index = state.getIndex(state.lists, data.id, 'id');
            
            if(typeof data.incomplete_tasks !== 'undefined' ){
                data.incomplete_tasks.data.forEach(function(task){
                    state.lists[list_index].incomplete_tasks.data.push(task)
                });
                state.lists[list_index].incomplete_tasks.meta = data.incomplete_tasks.meta;
            } else {
                data.complete_tasks.data.forEach(function(task){
                    state.lists[list_index].complete_tasks.data.push(task)
                });
                state.lists[list_index].complete_tasks.meta = data.complete_tasks.meta;
            }
            
        },

        updateTaskEditMode (state, data) {
            var list_index = state.getIndex(state.lists, data.list_id, 'id');
            
            
            if(typeof state.lists[list_index].incomplete_tasks !== 'undefined' ){
                var task_index = state.getIndex(state.lists[list_index].incomplete_tasks.data, data.task.id, 'id');
                state.lists[list_index].incomplete_tasks.data[task_index].edit_mode = true;

                //state.lists[list_index].incomplete_tasks.data.splice(task_index, 1); 

                //state.lists[list_index].incomplete_tasks.data.splice(task_index, 1, data.task);

                //jQuery.extend(true, data.task, state.lists[list_index].incomplete_tasks.data[task_index] );

            } 

            if(typeof state.lists[list_index].complete_tasks !== 'undefined' ){
                var task_index = state.getIndex(state.lists[list_index].complete_tasks.data, data.task.id, 'id');
                state.lists[list_index].incomplete_tasks.data[task_index].edit_mode = data.edit_mode;
            }
        },
        balankTemplateStatus(state, status){
            state.balankTemplateStatus = status; 
        },
        listTemplateStatus(state, status){
            state.listTemplateStatus = status;
        },
        updateLists (state, lists) {
            state.lists = lists;
        },

        updateTask (state, task) {
            state.task = task;
        },
        updateListPrivacy (state, data) {
            var index = state.getIndex(state.lists, data.list_id, 'id');
            state.lists[index].meta.privacy = data.privacy;
        },

        updateTaskPrivacy (state, data) {
            var list_index = state.getIndex(state.lists, data.list_id, 'id');

            if(typeof state.lists[list_index].incomplete_tasks !== 'undefined' ){
                var task_index = state.getIndex(state.lists[list_index].incomplete_tasks.data, data.task_id, 'id');
                state.lists[list_index].incomplete_tasks.data[task_index].meta.privacy = data.privacy;
            } 
            
            if(typeof state.task.meta != 'undefined') {
                state.task.meta.privacy = data.privacy;
            }
        },
        fetchListStatus (state, status) {
            state.isListFetch = status;
        },

        receiveTask (state, data) {
            var receive = data.receive;
            var res = data.res;
            
            var setListindex = state.getIndex(state.lists, receive.list_id, 'id');
            var senderListindex = state.getIndex(state.lists, res.sender_list_id, 'id');
            var setIndex = false;

            receive.orders.forEach(function(val) {
                if(val.id == receive.task_id) {
                    setIndex = val.index;
                }
            });

            if(typeof state.lists[setListindex].incomplete_tasks != 'undefined' ){
                state.lists[setListindex].incomplete_tasks.data.splice(setIndex, 0, res.task.data);
                state.lists[setListindex].meta.total_incomplete_tasks = state.lists[setListindex].meta.total_incomplete_tasks + 1;
            } 

            if(typeof state.lists[senderListindex].incomplete_tasks != 'undefined' ){
                let task_index = state.getIndex(state.lists[senderListindex].incomplete_tasks.data, receive.task_id, 'id');
                state.lists[senderListindex].incomplete_tasks.data.splice(task_index, 1);
                state.lists[senderListindex].meta.total_incomplete_tasks = state.lists[senderListindex].meta.total_incomplete_tasks - 1;
            } 
        },

        listOrdering (state, orders) {
            var lists = [];
            orders.orders.forEach(function(order) {
                let index = state.getIndex( state.lists, order.id, 'id');

                lists.push(state.lists[index]);
            });

            state.lists = lists;
        },
        expandList (state, listId) {
            let i = state.expandListIds.findIndex(x => x == listId);
            if (i !== -1) {
                state.expandListIds.splice(i, 1);
            }else {
                state.expandListIds.push(listId);
            }
        }
    }
};
