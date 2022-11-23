import Calendar from './calendar.vue'

weDevsPMRegisterChildrenRoute('project_root', 
    [
        { 
            path: '/calendar',
            component: Calendar,
            name: 'calendar',
        }

    ]
);
