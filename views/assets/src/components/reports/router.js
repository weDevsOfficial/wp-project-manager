// const Reports = resolve => {
//     require.ensure(['./reports.vue'], () => {
//         resolve(require('./reports.vue'));
//     });
// }

import Reports from './reports.vue'

weDevsPMRegisterChildrenRoute('project_root', 
    [
        { 
            path: '/reports',
            component: Reports,
            name: 'reports',
        }

    ]
);
