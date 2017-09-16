import Vue from './vue/vue';
import Router from './vue/vue-router';

import project_lists from './components/project-lists/router';
import categories from './components/categories/router';
import add_ons from './components/add-ons/router';
import my_tasks from './components/my-tasks/router';
import calendar from './components/calendar/router';
import reports from './components/reports/router';
import progress from './components/progress/router';
import settings from './components/settings/router';
import overview from './components/overview/router';
import activities from './components/activities/router';
import files from './components/files/router';
import {task_lists, single_list} from './components/task-lists/router';
import {discussions, single_discussion} from './components/discussions/router';
import {milestones, single_milestone} from './components/milestones/router';


weDevs_PM_Routers.push(project_lists);
weDevs_PM_Routers.push(categories);
weDevs_PM_Routers.push(add_ons);
weDevs_PM_Routers.push(my_tasks);
weDevs_PM_Routers.push(calendar);
weDevs_PM_Routers.push(reports);
weDevs_PM_Routers.push(progress);
weDevs_PM_Routers.push(settings);
weDevs_PM_Routers.push(overview);
weDevs_PM_Routers.push(activities);
weDevs_PM_Routers.push(discussions);
weDevs_PM_Routers.push(single_discussion);
weDevs_PM_Routers.push(milestones);
weDevs_PM_Routers.push(single_milestone);
weDevs_PM_Routers.push(task_lists);
weDevs_PM_Routers.push(single_list);
weDevs_PM_Routers.push(files);

Vue.use(Router);

var router = new Router({
	routes: weDevs_PM_Routers,
});

router.beforeEach((to, from, next) => {
  	NProgress.start();
	next();
})

export default router;

