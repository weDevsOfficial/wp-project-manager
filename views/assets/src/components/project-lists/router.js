
weDevsPmRegisterModule('projectLists', 'project-lists');

const project_lists = resolve => {
    require.ensure(['./active-projects.vue'], () => {
        resolve(require('./active-projects.vue'));
    });
}

const all_projects = resolve => {
    require.ensure(['./all-projects.vue'], () => {
        resolve(require('./all-projects.vue'));
    });
}

const completed_projects = resolve => {
    require.ensure(['./completed-projects.vue'], () => {
        resolve(require('./completed-projects.vue'));
    });
}

weDevsPMRegisterChildrenRoute('project_root', 
    [
        {
            path: 'projects', 
            component: project_lists,
            name: 'project_lists',

            children: [
                {
                    path: 'pages/:current_page_number', 
                    component: project_lists,
                    name: 'project_pagination',
                },
            ]
        },

        {
            path: 'all', 
            component: all_projects,
            name: 'all_projects',

            children: [
                {
                    path: 'pages/:current_page_number', 
                    component: all_projects,
                    name: 'all_project_pagination',
                },
            ]
        },

        {
            path: 'completed', 
            component: completed_projects,
            name: 'completed_projects',

            children: [
                {
                    path: 'pages/:current_page_number', 
                    component: completed_projects,
                    name: 'completed_project_pagination',
                },
            ]
        },
    ]
);


