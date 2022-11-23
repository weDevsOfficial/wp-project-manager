import Reports from './reports';
weDevsPMRegisterChildrenRoute( "my_tasks",
    [
        {
            path: 'reports',
            component: Reports,
            name: 'mytask-reports',
        }
    ]
);

import Menu from './menu';
weDevs_PM_Components.push({
    hook: 'pm-my-task-menu',
    component: 'pm-pro-my-task-menu',
    property: Menu
});
