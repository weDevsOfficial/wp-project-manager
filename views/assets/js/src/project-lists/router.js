//import project_lists from './lists.vue';

const project_lists = resolve => {
    require.ensure(['./active-projects.vue'], () => {
        resolve(require('./active-projects.vue'));
    });
}

const all_projects = resolve => {
    require.ensure(['./all-projects.vue'], () => {
        resolve(require('./all-projects.vue'));
    });
}

const completed_projects = resolve => {
    require.ensure(['./completed-projects.vue'], () => {
        resolve(require('./completed-projects.vue'));
    });
}


var active = {
    path: '/', 
    components: { 
    	'project-lists': project_lists 
    }, 
    name: 'project_lists',

    children: [
        {
            path: '/pages/:current_page_number', 
            components: { 
            	'project-lists': project_lists
            }, 
            name: 'project_pagination',
        },
    ]
}

var all = {
    path: '/all', 
    components: { 
        'all-projects': all_projects 
    }, 
    name: 'all_projects',

    children: [
        {
            path: 'pages/:current_page_number', 
            components: { 
                'all-projects': all_projects
            }, 
            name: 'all_project_pagination',
        },
    ]
}

var completed = {
    path: '/completed', 
    components: { 
        'completed-projects': completed_projects 
    }, 
    name: 'completed_projects',

    children: [
        {
            path: 'pages/:current_page_number', 
            components: { 
                'completed-projects': completed_projects
            }, 
            name: 'completed_project_pagination',
        },
    ]
}

export {active, all, completed}
    
