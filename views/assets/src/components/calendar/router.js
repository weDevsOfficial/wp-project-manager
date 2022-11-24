import Calendar from '@components/calendar/calendar';

weDevsPMRegisterChildrenRoute('project_root', 
    [
        { 
            path: '/calendar',
            component: Calendar,
            name: 'calendar',
        },
    ]
);
