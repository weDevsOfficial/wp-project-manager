var Store = {
    state: {
        taskTypes: [],
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

    mutations: {
        setTaskTypes ( state, taskTypes ) {
            state.taskTypes = [ ...taskTypes ];
        },

        setTaskType ( state, taskType ) {
            state.taskTypes.push( taskType );
        },

        updateTaskType ( state, taskType ) {
            var index = state.getIndex(state.taskTypes, taskType.id, 'id');
            
            state.taskTypes.splice( index, 1, taskType );
        },

        deleteTaskType ( state, id ) {
            var index = state.getIndex(state.taskTypes, parseInt(id), 'id');
            
            state.taskTypes.splice( index, 1 );
        },
    }
}

export default Store; 
