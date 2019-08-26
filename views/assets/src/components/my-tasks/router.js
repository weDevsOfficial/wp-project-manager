weDevsPmRegisterModule("myTask", 'my-tasks');

import mixin from './mixin';

// PmProMixin.myTasks = mixin;

import complete_task from './complete-task.vue';
import outstanding_task from './outstanding-task.vue';
import current_task from './search-task.vue';
import activities from './activities.vue';
import overview from './overview.vue';
import mytaskTemplete from './my-tasks.vue';

//'/my-tasks/:user_id(\\d+)?',

weDevsPMRegisterChildrenRoute('project_root',
    [
        {
            path: '/my-tasks/',
            name: 'my_tasks',
            component: mytaskTemplete,
            children: [
                {
                    path: '/',
                    component: current_task,
                    name: 'mytask-current',

                    children: [
                        {
                            path: 'projects/:project_id/tasks/:task_id',
                            components: {
                                'mytask-current-single-task': pm.SingleTask
                            },
                            name: 'mytask_current_single_task'
                        },
                        {
                            path: 'pages/:current_page_number', 
                            component: current_task,
                            name: 'my_task_pagination',
                        },
                    ]
                    
                },
                {
                    path: 'activities',
                    component: activities,
                    name: 'mytask-activities',
                },
                {
                    path: 'current-task',
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
                label: __('My Task', 'wedevs-project-manager'),
                order: 3
            }
        }
    ]
);

// var my_tasks = ;

// var user_tasks = ;

// export {my_tasks, user_tasks};
