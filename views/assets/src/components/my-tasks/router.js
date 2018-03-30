const MyTasks = resolve => {
    require.ensure(['./my-tasks.vue'], () => {
        resolve(require('./my-tasks.vue'));
    });
}

weDevsPMRegisterChildrenRoute('project_root', 
    [
        { 
            path: '/my-tasks',
            component: MyTasks,
            name: 'my-tasks',
        }

    ]
);