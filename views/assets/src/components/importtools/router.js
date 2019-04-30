//weDevsPmProRegisterModule('importtools', 'importtools');

import Mixin from './mixin';

PmProMixin.projectSettings = Mixin;

// const settingsContent = resolve => {
//     require.ensure(['./content.vue'], () => {
//         resolve(require('./content.vue'));
//     });
// }

import importtools from './content.vue';


weDevsPMRegisterChildrenRoute('project_root',
	[
		{
			path: '/importtools',
		    name: 'importtools',
		    component: importtools,
		}
	]
);



