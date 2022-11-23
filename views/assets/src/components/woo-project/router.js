import WooProject from './woo-project.vue'

weDevsPMRegisterChildrenRoute('project_root',
    [
        {
            path: '/woo-project',
            component: WooProject,
            name: 'woo-project',
        }

    ]
);
