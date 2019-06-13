weDevsPmRegisterModule("myTask", 'my-tasks');

import mixin from './mixin';

// PmProMixin.myTasks = mixin;

import complete_task from './complete-task.vue';
import outstanding_task from './outstanding-task.vue';
import current_task from './current-task.vue';
import activities from './activities.vue';
import overview from './overview.vue';
import mytaskTemplete from './my-tasks.vue';


weDevsPMRegisterChildrenRoute('project_root',
    [
        {
            path: '/my-tasks/:user_id(\\d+)?',
            component: mytaskTemplete,
            children: [
                {
                    path: '/',
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
                },
                {
                    path: 'activities',
                    component: activities,
                    name: 'mytask-activities',
                },
                {
                    path: 'current-task',
                    component: current_task,
                    name: 'mytask-current',

                    children: [
                        {
                            path: 'projects/:project_id/tasks/:task_id',
                            components: {
                                'mytask-current-single-task': pm.SingleTask
                            },
                            name: 'mytask_current_single_task'
                        }
                    ]
                },
                {
                    path: 'outstanding-task',
                    component: outstanding_task,
                    name: 'mytask-outstanding',
                    children: [
                        {
                            path: 'projects/:project_id/tasks/:task_id',
                            components: {
                                'mytask-outstanding-single-task': pm.SingleTask
                            },
                            name: 'mytask_outstanding_single_task'
                        }
                    ]
                },
                {
                    path: 'complete-task',
                    component: complete_task,
                    name: 'mytask-complete',
                    children: [
                        {
                            path: 'projects/:project_id/tasks/:task_id',
                            components: {
                                'mytask-complete-single-task': pm.SingleTask
                            },
                            name: 'mytask_complete_single_task'
                        }
                    ]
                }
            ],
            meta: {
                label: __('My Task', 'pm-pro'),
                order: 3
            }
        }
    ]
);

// var my_tasks = ;

// var user_tasks = ;

// export {my_tasks, user_tasks};
