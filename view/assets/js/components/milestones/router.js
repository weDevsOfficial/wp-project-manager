//import project_lists from './index.vue';

const milestones_route = resolve => {
    require.ensure(['./milestones.vue'], () => {
        resolve(require('./milestones.vue'));
    });
}

const individual_milestone = resolve => {
    require.ensure(['./individual-milestones.vue'], () => {
        resolve(require('./individual-milestones.vue'));
    });
}

var milestones = {
    path: '/:project_id/milestones/', 
    components: { 
        'milestones': milestones_route 
    }, 
    name: 'milestones',
}

var single_milestone = { 
    path: '/:project_id/single-milestone/:milestone_id', 
    components: { 
        'individual-milestone': individual_milestone
    }, 
    name: 'individual_milestone' 
}

export { milestones, single_milestone };

 