weDevsPmRegisterModule('projectCategories', 'categories');

// const categories = resolve => {
//     require.ensure(['./categories.vue'], () => {
//         resolve(require('./categories.vue'));
//     });
// }

import categories from './categories.vue';

weDevsPMRegisterChildrenRoute('project_root', 
    [
        { 
            path: '/categories',
            component: categories,
            name: 'categories',
            meta: {
                permission: function(project) {
                    return pmHasManageCapability()
                },
                label: 'Categories',
                order: 2,
            },
            children: [
                {
                    path: 'pages/:current_page_number', 
                    component: categories,
                    name: 'category_pagination',
                },
            ]
        }

    ]
);
