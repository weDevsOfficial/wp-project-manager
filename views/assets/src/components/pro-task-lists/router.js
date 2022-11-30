weDevsPmProRegisterModule( 'proProLabel', 'pro-task-lists' );

import TaskLabel from '@components/pro-task-lists/task-label';
import TimeTracker from '@components/pro-task-lists/time-tracker';
import TaskRecurrent from '@components/pro-task-lists/task-recurrent';
import SingleSubtasks from '@components/pro-task-lists/subtask-lists';
import EstimationField from '@components/pro-task-lists/task-estimation';

weDevs_PM_Components.push({
    hook: 'single_task_tools',
    component: 'pm-pro-single-task-watch',
    property: TimeTracker
});

weDevs_PM_Components.push({
    hook: 'single_task_tools',
    component: 'pm-pro-single-task-estimation-field',
    property: EstimationField
});

weDevs_PM_Components.push({
    hook: 'single_task_tools',
    component: 'pm-pro-in-single-task-label',
    property: TaskLabel
});

weDevs_PM_Components.push({
    hook: 'single_task_tools',
    component: 'pm_task_recurrent_popup',
    property: TaskRecurrent
});

weDevs_PM_Components.push({
    hook: 'aftre_single_task_content',
    component: 'after-single-task',
    property: SingleSubtasks,
});
