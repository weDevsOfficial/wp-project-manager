const files = resolve => {
    require.ensure(['./files.vue'], () => {
        resolve(require('./files.vue'));
    });
}

weDevsPmRegisterModule('projectFiles', 'project-files');

weDevsPMRegisterChildrenRoute('projects', 
    [
        {
            path: ':project_id/files', 
    		component: files,
    		name: 'pm_files',
    		children: wedevsPMGetRegisterChildrenRoute('pm_files')
        },
    ]
)

// export default { 
//     path: ':project_id/files', 
//     component: index,
//     name: 'pm_files',
//     children: wedevsPMGetRegisterChildrenRoute('pm_files')
// }
//  