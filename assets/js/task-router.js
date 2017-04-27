var CPM_Task_Routes = {

	routes: [

	// Default template. showing todolist and task
    { path: '/', components:{ Initital_view: CPM_Router_Init }, name: 'all_lists', 
        children: [
            { path: 'task/:task_id', components:{ single_task: CPM_Task_Single}, name: 'task_single_under_todo_lists' },
        ] 
    },

    // Todo list singe page
    { path: '/list/:list_id', components: { single_list: CPM_List_Single }, name: 'list_single', 

        children: [
            { path: 'task/:task_id', components:{ single_task: CPM_Task_Single}, name: 'list_task_single_under_todo' },
        ]
    },

    { path: '/single-task/:task_id', components:{ single_task: CPM_Task_Single}, name: 'task_single' },

    // Pagination
    { path: '/page/:page_number', components:{ pagination: CPM_Router_Init }, name: 'pagination' },

	]
}