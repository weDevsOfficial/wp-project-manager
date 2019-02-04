import projects from '@components/project-lists/router';
import categories from '@components/categories/router';
import add_ons from '@components/add-ons/router';

if (!PM_Vars.is_pro) {
    require( '@components/my-tasks/router');
    require('@components/calendar/router');
    require('@components/reports/router');
    require('@components/progress/router'); 
    require('@components/welcome/router'); 
    require('@components/pro-features/router'); 
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
