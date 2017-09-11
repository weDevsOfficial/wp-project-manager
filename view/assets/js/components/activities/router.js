//import project_lists from './index.vue';

const activities_route = resolve => {
    require.ensure(['./activities.vue'], () => {
        resolve(require('./activities.vue'));
    });
}

var activities = {
    path: '/:project_id/activities/', 
    components: { 
        'activities': activities_route 
    }, 
    name: 'activities',
}



export default activities;

 