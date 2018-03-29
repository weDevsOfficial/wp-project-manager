
weDevsPmRegisterModule('projectLists', 'project-lists');

import overview from '@components/project-overview/router';
import activities from '@components/project-activities/router';
import files from '@components/project-files/router';
import {task_lists, single_list} from '@components/project-task-lists/router';
import {discussions, single_discussion} from '@components/project-discussions/router';
import {milestones} from '@components/project-milestones/router';

// const projectListHeader = resolve => {
//     require.ensure(['./header.vue'], () => {
//         resolve(require('./header.vue'));
//     });
// }
const empty = resolve => {
    require.ensure(['./empty.vue'], () => {
        resolve(require('./empty.vue'));
    });
}
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

weDevsPMRegisterChildrenRoute('projects', 
    [
        {
            path: 'active', 
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
)



weDevsPMRegisterChildrenRoute('project_root', 
    [   
        {
            path: 'projects', 
            component: empty,
            meta: {
                label: "Projects",
                order: 1,
            },
            name: 'projects',
            children: wedevsPMGetRegisterChildrenRoute('projects'),

            // children: 
            // [
            //     {
            //         path: '', 
            //         component: project_lists,
            //         name: 'project_lists',
            //         children: [
            //             {
            //                 path: 'pages/:current_page_number', 
            //                 component: project_lists,
            //                 name: 'project_pagination',
            //             },
            //         ]
            //     },

            //     {
            //         path: 'all', 
            //         component: all_projects,
            //         name: 'all_projects',

            //         children: [
            //             {
            //                 path: 'pages/:current_page_number', 
            //                 component: all_projects,
            //                 name: 'all_project_pagination',
            //             },
            //         ]
            //     },

            //     {
            //         path: 'completed', 
            //         component: completed_projects,
            //         name: 'completed_projects',

            //         children: [
            //             {
            //                 path: 'pages/:current_page_number', 
            //                 component: completed_projects,
            //                 name: 'completed_project_pagination',
            //             },
            //         ]
            //     },

            // ]
        }
        
    ]
);




