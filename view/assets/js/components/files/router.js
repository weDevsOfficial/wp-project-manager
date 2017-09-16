//import project_lists from './index.vue';

const files = resolve => {
    require.ensure(['./files.vue'], () => {
        resolve(require('./files.vue'));
    });
}

export default { 
    path: '/:project_id/files', 
    components: { 
    	'pm-files': files 
    }, 
    name: 'pm_files',
}
 