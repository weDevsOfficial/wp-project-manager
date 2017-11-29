
weDevsPmRegisterModule('projectActivities', 'project-activities');

const activities_route = resolve => {
    require.ensure(['./activities.vue'], () => {
        resolve(require('./activities.vue'));
    });
}

weDevsPMRegisterChildrenRoute('project_root', 
	[
		{
		    path: ':project_id/activities/', 
		    component: activities_route, 
		    name: 'activities',
            children: [
                {
                    path: 'pages/:current_page_number', 
                    component: activities_route, 
                    name: 'activities_pagination',
                },
            ]
		}
	]
);
 