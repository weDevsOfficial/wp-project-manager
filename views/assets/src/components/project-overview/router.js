//import project_lists from './index.vue';

const overview = resolve => {
    require.ensure(['./overview.vue'], () => {
        resolve(require('./overview.vue'));
    });
}

export default { 
    path: '/:project_id/overview', 
    components: { 
        'pm-overview': overview 
    }, 
    name: 'pm_overview',
}
 