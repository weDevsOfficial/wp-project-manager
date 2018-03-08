
import projects from './../components/project-lists/router';
import overview from './../components/project-overview/router';
import categories from './../components/categories/router';
import add_ons from './../components/add-ons/router';
import my_tasks from './../components/my-tasks/router';
import calendar from './../components/calendar/router';
import reports from './../components/reports/router';
import progress from './../components/progress/router';
import {general, email} from './../components/settings/router';
import activities from './../components/project-activities/router';
import files from './../components/project-files/router';
import {task_lists, single_list} from './../components/project-task-lists/router';
import {discussions, single_discussion} from './../components/project-discussions/router';
import {milestones} from './../components/project-milestones/router';

import Empty from '@components/common/empty.vue';

weDevs_PM_Routers.push({
	path: '/', 
    component:  Empty,
    name: 'project_root',

	children: wedevsPMGetRegisterChildrenRoute('project_root')
});

var router = new pm.VueRouter({
	routes: weDevs_PM_Routers,
});

router.beforeEach((to, from, next) => {
     pm.NProgress.start();
     next();
    // if (
    //     to.hasOwnProperty('meta')
    //     &&
    //     typeof to.meta.permission === 'function'
    // ) {
    //     var project = {};
    //     var project_id = to.params.project_id;
    //     var index = pmGetIndex(pmProjects, project_id, 'id');
    //     if (index === false && project_id ) {
    //        var url = PM_Vars.base_url +'/'+ PM_Vars.rest_api_prefix + '/pm/v2/projects/'+ project_id;
    //        jQuery.ajax({
    //             url: url,
    //             method: "GET",
    //             beforeSend (xhr) {

    //                 xhr.setRequestHeader("Authorization_name", btoa('asaquzzaman')); //btoa js encoding base64_encode
    //                 xhr.setRequestHeader("Authorization_password", btoa(12345678)); //atob js decode base64_decode

    //                 xhr.setRequestHeader("X-WP-Nonce", PM_Vars.permission);
          
    //             },
    //             success (res) {
    //                 var permission = to.meta.permission(res.data);
    //                 if (permission) {
    //                     next();
    //                 } else {
    //                     pm.NProgress.done()
    //                     next(false);

    //                 }
    //             }
    //        });
    //     } else {
    //         project = pmProjects[index];
    //         var permission = to.meta.permission(project);
    //         if (permission) {
    //             next();
    //         } else {
    //             pm.NProgress.done()
    //             next(false);
    //         }
    //     }
    // } else {
    //     next();
    // }
});

export default router;

