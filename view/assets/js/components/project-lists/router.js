//import project_lists from './lists.vue';

const project_lists = resolve => {
    require.ensure(['./lists.vue'], () => {
        resolve(require('./lists.vue'));
    });
}

export default { 
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
    
