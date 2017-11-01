const task_lists_route = resolve => {
    require.ensure(['./lists.vue'], () => {
        resolve(require('./lists.vue'));
    });
}

const single_list_route = resolve => {
    require.ensure(['./single-list.vue'], () => {
        resolve(require('./single-list.vue'));
    });
}

const single_task_route = resolve => {
    require.ensure(['./single-task.vue'], () => {
        resolve(require('./single-task.vue'));
    });
}

var task_lists = {
    path: '/:project_id/task-lists/', 
    components: { 
        'task-lists': task_lists_route 
    }, 
    name: 'task_lists',

    children: [
        {
            path: '/:project_id/task/:task_id', 
            components: { 
                'single-task': single_task_route
            }, 
            name: 'lists_single_task' 
        },

        {
            path: 'pages/:current_page_number', 
            components: { 
                'task-lists': task_lists_route
            }, 
            name: 'list_pagination',
        },
    ]
}

var single_list = { 
    path: '/:project_id/task-lists/:list_id', 
    components: { 
        'single-list': single_list_route
    }, 
    name: 'single_list',

    children: [
        {
            path: '/:project_id/task-lists/:list_id/task/:task_id', 
            components: { 
                'single-task': single_task_route
            }, 
            name: 'single_task' 
        }
    ]
}

export {task_lists, single_list}


