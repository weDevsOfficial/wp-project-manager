const index = resolve => {
    require.ensure(['./files.vue'], () => {
        resolve(require('./files.vue'));
    });
}

weDevsPmRegisterModule('projectFiles', 'project-files');

export default { 
    path: ':project_id/files', 
    component: index,
    name: 'pm_files',
    children: wedevsPMGetRegisterChildrenRoute('pm_files')
}
 