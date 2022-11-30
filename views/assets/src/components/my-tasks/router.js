weDevsPmRegisterModule("myTask", 'my-tasks');

import mixin from './mixin';

// PmProMixin.myTasks = mixin;

import complete_task from './complete-task.vue';
import outstanding_task from './outstanding-task.vue';
import current_task from './search-task.vue';
import activities from './activities.vue';
import overview from './overview.vue';
import mytaskTemplete from './my-tasks.vue';

if ( !PM_Vars.is_pro ) {
    require('@components/tasks-report/router');
}

//'/my-tasks/:user_id(\\d+)?',

weDevsPMRegisterChildrenRoute('my_tasks',
    [
        {
            path: '/',
            component: current_task,
            name: 'mytask-current',
            meta: {
                label: __('My tasks', 'wedevs-project-manager'),
                order: 3,
            },

            children: [
                {
                    path: 'projects/:project_id/tasks/:task_id',
                    components: {
                        'mytask-current-single-task': pm.SingleTask
                    },
                    name: 'mytask_current_single_task'
                },
            ]
        },
        {
            path: 'pages/:current_page_number', 
            component: current_task,
            name: 'my_task_pagination',
        },
        {
            path: 'activities',
            component: activities,
            name: 'mytask-activities',
        },
        {
            path: 'overview',
            component: overview,
            name: 'mytask-tasks',
            children: [
                {
                    path: 'projects/:project_id/tasks/:task_id',
                    components: {
                        'mytask-calendar-single-task': pm.SingleTask
                    },
                    name: 'mytask_calendar_single_task'
                }
            ]
        }
    ]
);

weDevsPMRegisterChildrenRoute('project_root', 
    [
        {
            path: '/my-tasks/:user_id(\\d+)?',
            name: 'my_tasks',
            component: mytaskTemplete,
            children: wedevsPMGetRegisterChildrenRoute('my_tasks'),
        }
    ]
);

// var my_tasks = ;

// var user_tasks = ;

// export {my_tasks, user_tasks};
