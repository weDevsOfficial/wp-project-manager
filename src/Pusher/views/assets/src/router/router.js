weDevsPmProAddonRegisterModule('pusher', 'pusher');

import PusherSettings from '@components/settings.vue';

weDevsPMRegisterChildrenRoute('settings_root',
    [
        {
            path: 'pusher',
            component: PusherSettings,
            name: 'pusher_settings_tab',
        }
    ]
)
