
const overview = resolve => {
    require.ensure(['./overview.vue'], () => {
        resolve(require('./overview.vue'));
    });
}

weDevsPmRegisterModule('projectOverview', 'project-overview');

weDevsPMRegisterChildrenRoute('projects', 
    [
        {
            path: ':project_id/overview', 
    		component: overview,
    		name: 'pm_overview',
        },
    ]
)

