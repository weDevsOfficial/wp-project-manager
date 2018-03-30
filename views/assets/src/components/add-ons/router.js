const AddOns = resolve => {
    require.ensure(['./add-ons.vue'], () => {
        resolve(require('./add-ons.vue'));
    });
}

weDevsPMRegisterChildrenRoute('project_root', 
    [
        { 
            path: '/add-ons',
            component: AddOns,
            name: 'add-ons',
        }

    ]
);