import Vue from 'vue';
import Router from 'vue-router';
import NProgress from 'nprogress';

import {active, all, completed} from './src/project-lists/router';
import categories from './src/categories/router';
import add_ons from './src/add-ons/router';
import my_tasks from './src/my-tasks/router';
import calendar from './src/calendar/router';
import reports from './src/reports/router';
import progress from './src/progress/router';
import {general, email} from './src/settings/router';
import overview from './src/overview/router';
import activities from './src/activities/router';
import files from './src/files/router';
import {task_lists, single_list} from './src/task-lists/router';
import {discussions, single_discussion} from './src/discussions/router';
import {milestones} from './src/milestones/router';

weDevs_PM_Routers.push(general);
weDevs_PM_Routers.push(email);
weDevs_PM_Routers.push(active);
weDevs_PM_Routers.push(all);
weDevs_PM_Routers.push(completed);
weDevs_PM_Routers.push(categories);
weDevs_PM_Routers.push(add_ons);
weDevs_PM_Routers.push(my_tasks);
weDevs_PM_Routers.push(calendar);
weDevs_PM_Routers.push(reports);
weDevs_PM_Routers.push(progress);
weDevs_PM_Routers.push(overview);
weDevs_PM_Routers.push(activities);
weDevs_PM_Routers.push(discussions);
weDevs_PM_Routers.push(single_discussion);
weDevs_PM_Routers.push(milestones);
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

