weDevsPmRegisterModule('categories', 'categories');

const categories = resolve => {
    require.ensure(['./categories.vue'], () => {
        resolve(require('./categories.vue'));
    });
}

weDevsPMRegisterChildrenRoute('project_root', 
    [
        { 
            path: '/categories',
            component: categories,
            name: 'categories',
        }

    ]
);
