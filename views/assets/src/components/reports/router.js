const Reports = resolve => {
    require.ensure(['./reports.vue'], () => {
        resolve(require('./reports.vue'));
    });
}

weDevsPMRegisterChildrenRoute('project_root', 
    [
        { 
            path: '/reports',
            component: Reports,
            name: 'reports',
        }

    ]
);