
weDevsPmRegisterModule('projectTaskLists', 'project-task-lists');

import directive from './directive';

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
weDevsPMRegisterChildrenRoute('projects', 
    [
        { 
            path: ':project_id/task-lists/', 
            component: task_lists_route, 
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
                    component: task_lists_route,
                    name: 'list_pagination',
                },
            ] 
        }
    ]
);

weDevsPMRegisterChildrenRoute('projects', 
    [
        { 
            path: '/:project_id/task-lists/:list_id', 
            component: single_list_route,
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
    ]
);


