import Reports from '@components/reports/reports';

weDevsPMRegisterChildrenRoute('project_root', 
    [
        { 
            path: '/reports',
            component: Reports,
            name: 'reports',
        }
    ]
);
