// const Progress = resolve => {
//     require.ensure(['./progress.vue'], () => {
//         resolve(require('./progress.vue'));
//     });
// }

import Progress from './progress.vue'

weDevsPMRegisterChildrenRoute('project_root', 
    [
        { 
            path: '/progress',
            component: Progress,
            name: 'progress',
        }

    ]
);