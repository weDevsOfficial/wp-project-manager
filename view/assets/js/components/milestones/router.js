//import project_lists from './index.vue';

const milestones_route = resolve => {
    require.ensure(['./milestones.vue'], () => {
        resolve(require('./milestones.vue'));
    });
}

var milestones = {
    path: '/:project_id/milestones/', 
    components: { 
        'milestones': milestones_route 
    }, 
    name: 'milestones',

    children: [
        {
            path: 'pages/:current_page_number', 
            components: { 
                'milestones': milestones_route
            }, 
            name: 'milestone_pagination',
        },
    ]
}

export { milestones };

 