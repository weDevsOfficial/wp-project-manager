import projects from '@components/project-lists/router';
import categories from '@components/categories/router';
import add_ons from '@components/add-ons/router';
import '@components/importtools/router';
//import '@components/tools/router';
import '@components/my-tasks/router';
import '@components/reports/router';

if ( !PM_Vars.is_pro ) {
    require('@components/welcome/router');
    require('@components/premium/router');
    require('@components/upgrade/router');
    require('@components/progress/router');
    require('@components/calendar/router');
    require('@components/pro-modules/router');
    require('@components/woo-project/router');

    // Pro prompt pages.
    require('@components/pro-settings/router');
    require('@components/project-modules/router');
    require('@components/project-settings/router');

    // Pro prompt fields.
    require('@components/privacy/router');
    require('@components/pro-task-lists/router');
}

import {general, email} from '@components/settings/router';
import Empty from '@components/root/init.vue';

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
});


//Load all components mixin
weDevsPmModules.forEach(function(module) {
    let mixin = require('@components/'+module.path+'/mixin.js');
    PmMixin[module.name] = mixin.default;
});


export default router;
