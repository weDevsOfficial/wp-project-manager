const Calendar = resolve => {
    require.ensure(['./calendar.vue'], () => {
        resolve(require('./calendar.vue'));
    });
}

weDevsPMRegisterChildrenRoute('project_root', 
    [
        { 
            path: '/calendar',
            component: Calendar,
            name: 'calendar',
        }

    ]
);