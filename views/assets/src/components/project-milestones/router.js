weDevsPmRegisterModule('projectMilestones', 'project-milestones');

const milestones_route = resolve => {
    require.ensure(['./milestones.vue'], () => {
        resolve(require('./milestones.vue'));
    });
}

weDevsPMRegisterChildrenRoute('projects', 
    [
        {
            path: ':project_id/milestones/', 
            component: milestones_route,
            name: 'milestones',

            children: [
                {
                    path: 'pages/:current_page_number', 
                    component: milestones_route,
                    name: 'milestone_pagination',
                },
            ]
        }
    ]
)

// var milestones = {
//     path: '/:project_id/milestones/', 
//     components: { 
//         'milestones': milestones_route 
//     }, 
//     name: 'milestones',

//     children: [
//         {
//             path: 'pages/:current_page_number', 
//             components: { 
//                 'milestones': milestones_route
//             }, 
//             name: 'milestone_pagination',
//         },
//     ]
// }

// export { milestones };

 