weDevsPmRegisterModule( 'settings', 'settings' );

import Pages from '@components/pro-settings/pages';
import Invoices from '@components/pro-settings/invoice';
import Settings from '@components/pro-settings/settings';
import SettingsHeader from '@components/settings/header';
import PageSettingsTab from '@components/pro-settings/page-tab-menu';
import InvoiceSettingsTab from '@components/pro-settings/invoice-tab-menu';

weDevs_PM_Components.push(
    {
        hook: 'pm-settings-tab',
        component: 'pm-pro-invoice-settings-tab',
        property: InvoiceSettingsTab,
    },
    {
        hook: 'pm-settings-tab',
        component: 'pm-pro-page-settings-tab',
        property: PageSettingsTab,
    },
    {
        hook: 'pm_after_settings',
        component: 'pm-pro-settings',
        property: Settings
    },
);

weDevsPMRegisterChildrenRoute( 'settings_root',
    [
        {
            path: 'invoices',
            name: 'invoices_settings_tab',
            component: Invoices,
            meta: {
                permission: function( project ) {
                    return pmUserCanAccessPage( PM_Vars.admin_cap_slug );
                }
            }
        },
        {
            path: 'pages',
            name: 'pages_settings_tab',
            component: Pages,
            meta: {
                permission: function( project ) {
                    return pmUserCanAccessPage( PM_Vars.admin_cap_slug );
                }
            }
        }
    ]
);

weDevsPMRegisterChildrenRoute('project_root',
    [
        {
            path: 'settings',
            component: SettingsHeader,
            meta: {
                permission: function( project ) {
                    return pmUserCanAccessPage( PM_Vars.admin_cap_slug )
                },
                lebel: 'Settings',
                order: 7,
            },
            children: wedevsPMGetRegisterChildrenRoute( 'settings_root' )
        },
    ]
);
