weDevsPmProRegisterModule( 'invoice', 'project-settings' );
weDevsPmProRegisterModule( 'pmProSettings', 'project-settings' );
weDevsPmProAddonRegisterModule('customFields', 'Custom_Fields');

import invoiceContent from '@components/project-settings/invoice';
import settingsContent from '@components/project-settings/settings';
import customFieldContent from '@components/project-settings/custom-field.vue';
import customFieldsSingleTaskContent from '@components/project-settings/task-content.vue';

weDevsPMRegisterChildrenRoute('project_root',
    [
        {
            path: ':project_id/invoice',
            name: 'pm_pro_invoice',
            component: invoiceContent,
        },
        {
            path: ':project_id/settings',
            name: 'pm_pro_settings',
            component: settingsContent,
        }
    ]
);

pm_add_filter( 'pm-project-menu', (menu) => {
    menu.push(
        {
            route: {
                name: 'pm_pro_invoice'
            },
            name: __( 'Invoice', 'pm-pro' ),
            count: '',
            badge: true,
            class: 'logo icon-pm-invoice',
            order: 50,
        },
        {
            route: {
                name: 'pm_pro_settings'
            },
            name: __( 'Settings', 'pm-pro' ),
            count: '',
            badge: true,
            class: 'logo icon-pm-settings',
            order: 100,
        }
    )

    return menu;
} );

weDevs_PM_Components.push({
    hook: 'after_single_task_tools',
    component: 'pm-pro-custom-field-single-task-content',
    property: customFieldsSingleTaskContent
});

weDevs_PM_Components.push({
    hook: 'pm_pro_settings_content',
    component: 'pm-pro-settings-custom-field-content',
    property: customFieldContent
});
