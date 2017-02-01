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
})
