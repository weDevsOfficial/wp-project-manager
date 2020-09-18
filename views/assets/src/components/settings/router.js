weDevsPmRegisterModule('settings', 'settings');

// const settingsHeader = resolve => {
//     require.ensure(['./header.vue'], () => {
//         resolve(require('./header.vue'));
//     });
// }
import settingsHeader from './header.vue'
// const settingsGeneral = resolve => {
//     require.ensure(['./general.vue'], () => {
//         resolve(require('./general.vue'));
//     });
// }
import settingsGeneral from './general.vue'
// const settingsEmail = resolve => {
//     require.ensure(['./email.vue'], () => {
//         resolve(require('./email.vue'));
//     });
// }

import taskType from './task-types.vue'

import settingsEmail from './email.vue'

import Pusher from './pusher.vue'


weDevsPMRegisterChildrenRoute('settings_root',
    [
        {
            path: '',
            component: settingsGeneral,
            name: 'general',
            meta: {
                permission: function(project) {
                    return pmUserCanAccessPage(PM_Vars.settings_page_slug)
                }
            }
        },
        { 
            path: 'email', 
            component: settingsEmail, 
            name: 'email',
            meta: {
                permission: function(project) {
                    return pmUserCanAccessPage(PM_Vars.settings_page_slug)
                }
            }
        },
        { 
            path: 'pusher', 
            component: Pusher, 
            name: 'pusher_settings_tab',
            meta: {
                permission: function(project) {
                    return pmUserCanAccessPage(PM_Vars.settings_page_slug)
                }
            }
        },
        { 
            path: 'task-type', 
            component: taskType, 
            name: 'task_type_settings_tab',
            meta: {
                permission: function(project) {
                    return pmUserCanAccessPage(PM_Vars.settings_page_slug)
                }
            }
        }
    ]
);

weDevsPMRegisterChildrenRoute('project_root', 
    [
        { 
            path: 'settings', 
            component: settingsHeader,
            meta: {
                permission: function(project) {
                    return pmUserCanAccessPage(PM_Vars.settings_page_slug)
                },
                lebel: 'Settings',
                order: 7,
            },
            children: wedevsPMGetRegisterChildrenRoute('settings_root')
        }

    ]
);




