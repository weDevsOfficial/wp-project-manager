weDevsPmRegisterModule('settings', 'settings');

const settingsHeader = resolve => {
    require.ensure(['./header.vue'], () => {
        resolve(require('./header.vue'));
    });
}
const settingsGeneral = resolve => {
    require.ensure(['./general.vue'], () => {
        resolve(require('./general.vue'));
    });
}
const settingsEmail = resolve => {
    require.ensure(['./email.vue'], () => {
        resolve(require('./email.vue'));
    });
}

weDevsPMRegisterChildrenRoute('settings_root',
    [
        {
            path: '',
            component: settingsGeneral,
            name: 'general',
            meta: {
                permission: function(project) {
                    return pmHasManageCapability()
                }
            }
        },
        { 
            path: 'email', 
            component: settingsEmail, 
            name: 'email',
            meta: {
                permission: function(project) {
                    return pmHasManageCapability()
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
                    return pmHasManageCapability()
                },
                lebel: 'Settings',
                order: 7,
            },
            children: wedevsPMGetRegisterChildrenRoute('settings_root')
        }

    ]
);




