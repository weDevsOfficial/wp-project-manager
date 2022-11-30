import Menu from '@components/tasks-report/menu';
import Reports from '@components/tasks-report/reports';

weDevsPMRegisterChildrenRoute( "my_tasks",
    [
        {
            path: 'reports',
            component: Reports,
            name: 'mytask-reports',
        }
    ]
);

weDevs_PM_Components.push({
    hook: 'pm-my-task-menu',
    component: 'pm-pro-my-task-menu',
    property: Menu
});
