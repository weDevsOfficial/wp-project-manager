import Popup from '@components/upgrade/popup';

weDevsPMRegisterChildrenRoute('project_root',
    [
        {
            path: '/pm-upgrade-popup',
            component: Popup,
            name: 'pm-upgrade-popup',
        }

    ]
);
