var Task_Store = new Vuex.Store({
    state: {
        lists: [],
        milestones: [],
        init: {},
        project_users: [],
        loading: true,
        show_list_form: false,
        project_id: CPM_Vars.project_id ? CPM_Vars.project_id : false,
        permissions: {},
    },

    mutations: {
        setTaskInitData: function( state, task_init ) {
            state.lists         = task_init.data.lists;
            state.milestones    = task_init.data.milestones;
            state.init          = task_init.data;
            state.project_users = task_init.data.project_users;
            state.permissions   = task_init.data.permissions;

            state.loading    = false;
        },

        newTodoListForm: function( state ) {
            state.show_list_form = state.show_list_form ? false : true;;
        },

        showHideUpdatelistForm: function( state, list ) {
            state.lists[list.list_index].edit_mode = state.lists[list.list_index].edit_mode ? false : true; 
        },

        showHideTaskForm: function( state, index ) {
          
            if ( ( typeof index.task_index == 'undefined' ) || ( index.task_index === false ) ) {
                state.lists[index.list_index].show_task_form = state.lists[index.list_index].show_task_form ? false : true; 
            } else {
                state.lists[index.list_index].tasks[index.task_index].edit_mode = state.lists[index.list_index].tasks[index.task_index].edit_mode ? false : true; 
            }
        },

        update_todo_list: function( state, res ) {

            if ( res.is_update ) {
                state.lists.splice( res.index, 1 );
                state.lists.splice( res.index, 0, res.res_list );
            } else {
                state.lists.splice( 0, 0, res.res_list );
            }
        },

        update_task: function( state, data ) {
            var index = data.list_index;
            state.lists[index].tasks.splice( 0, 0, data.res.data.task );
        }
    }
});