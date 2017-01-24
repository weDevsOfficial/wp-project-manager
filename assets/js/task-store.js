var Task_Store = new Vuex.Store({
    state: {
        lists: [],
        milestones: [],
        init: {},
        loading: true,
        show_list_form: false,
        project_id: CPM_Vars.project_id ? CPM_Vars.project_id : false,
    },

    // Set init data for todolist
    mutations: {
        setTaskInitData: function( state, task_init ) {
            state.lists      = task_init.data.lists;
            state.milestones = task_init.data.milestones;
            state.init       = task_init.data;
            state.loading    = false;
        },

        newTodoListForm: function( state ) {
            state.show_list_form = state.show_list_form ? false : true;;
        },

        showHideUpdatelistForm: function( state, list ) {
            state.lists[list.list_index].edit_mode = state.lists[list.list_index].edit_mode ? false : true; 
        },

        update_todo_list: function( state, res ) {

            if ( res.is_update ) {
                state.lists.splice( res.index, 1 );
                state.lists.splice( res.index, 0, res.res_list );
            } else {
                state.lists.splice( 0, 0, res.res_list );
            }
        }
    }
});