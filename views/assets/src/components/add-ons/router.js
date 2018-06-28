// const AddOns = resolve => {
//     require.ensure(['./add-ons.vue'], () => {
//         resolve(require('./add-ons.vue'));
//     });
// }

import AddOns from './add-ons.vue'

weDevsPMRegisterChildrenRoute('project_root', 
    [
        { 
            path: '/add-ons',
            component: AddOns,
            name: 'add-ons',
        }

    ]
);