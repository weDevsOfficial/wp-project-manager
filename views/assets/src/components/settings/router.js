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

weDevsPMRegisterChildrenRoute('project_root', 
    [
        { 
            path: 'settings', 
            component: settingsHeader, 
            children: [
                {
                    path: '/',
                    component: settingsGeneral,
                    name: 'general',
                },
                { 
                    path: 'email', 
                    component: settingsEmail, 
                    name: 'email',
                }
            ]
        }

    ]
);