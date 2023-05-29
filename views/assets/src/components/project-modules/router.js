import Gantt from '@components/project-modules/gantt';
import kanboardPage from '@components/project-modules/kanboard';

weDevsPmProAddonRegisterModule('gantt', 'project-modules');
weDevsPmProAddonRegisterModule('kanboard', 'project-modules');

weDevsPMRegisterChildrenRoute('project_root',
    [
        {
            path: 'projects/:project_id/kanboard/',
            component: kanboardPage,
            name: 'kanboard',
        },
        {
            path: ':project_id/gantt/',
            component: Gantt,
            name: 'gantt',
        }
    ]
);

pm_add_filter( 'pm-project-menu', (menu) => {

    menu.splice(1, 0,
        {
            route: {
                name: 'kanboard'
            },
            name: __( 'Kanban board', 'wedevs-project-manager' ),
            count: '',
            class: 'kanboard pm-sm-col-12',
            order: 2,
            badge: true,
        }
    );

    menu.push(
        {
            route: {
                name: 'gantt'
            },
            name: __( 'Gantt Chart', 'wedevs-project-manager' ),
            count: '',
            class: 'logo icon-pm-gantchart',
            order: 4,
            badge: true,
        }
    );

    return menu;
} );
