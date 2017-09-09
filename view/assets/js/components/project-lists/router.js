//import project_lists from './index.vue';

const project_lists = resolve => {
    require.ensure(['./index.vue'], () => {
        resolve(require('./index.vue'));
    });
}

export default { 
    path: '/', 
    components: { 
    	'project-lists': project_lists 
    }, 
    name: 'project_lists',
}
    
