
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
		}
	]
);

// var activities = {
//     path: '/:project_id/activities/', 
//     components: { 
//         'activities': activities_route 
//     }, 
//     name: 'activities',
// }



// export default activities;

 