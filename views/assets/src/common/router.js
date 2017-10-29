
import {active, all, completed} from './../project-lists/router';
import categories from './../categories/router';
import add_ons from './../add-ons/router';
import my_tasks from './../my-tasks/router';
import calendar from './../calendar/router';
import reports from './../reports/router';
import progress from './../progress/router';
import {general, email} from './../settings/router';
import overview from './../overview/router';
import activities from './../activities/router';
import files from './../files/router';
import {task_lists, single_list} from './../task-lists/router';
import {discussions, single_discussion} from './../discussions/router';
import {milestones} from './../milestones/router';

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

var router = new pm.VueRouter({
	routes: weDevs_PM_Routers,
});

router.beforeEach((to, from, next) => {
  	pm.NProgress.start();
	next();
})

export default router;

