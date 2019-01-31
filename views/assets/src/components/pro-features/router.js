/**
 * Component: Welcome
 */

import Welcome from './ProApp.vue'

weDevsPMRegisterChildrenRoute('project_root', 
    [
        { 
            path: '/pro-feature',
            component: Welcome,
            name: 'pro-feature',
        }

    ]
);