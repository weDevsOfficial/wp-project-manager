/**
 * Component: Welcome
 */

import Welcome from './ProApp.vue'

weDevsPMRegisterChildrenRoute('project_root', 
    [
        { 
            path: '/premium',
            component: Welcome,
            name: 'premium',
        }

    ]
);
