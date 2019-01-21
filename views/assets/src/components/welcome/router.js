/**
 * Component: Welcome
 */

import Welcome from './welcome.vue'

weDevsPMRegisterChildrenRoute('project_root', 
    [
        { 
            path: '/welcome',
            component: Welcome,
            name: 'welcome',
        }

    ]
);