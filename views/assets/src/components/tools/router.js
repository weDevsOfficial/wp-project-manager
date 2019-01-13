weDevsPmRegisterModule("pmTools", 'tools');
weDevsPmRegisterModule("trello", 'tools/trello-import');
weDevsPmRegisterModule("asana", 'tools/asana-import');


import mixin from './mixin';

PmProMixin.modulesLists = mixin;



import PmTools from './pm-tools.vue';

import PmToolList from './pm-tool-list.vue';

import PMtrelloImport from './trello-import/trelloImport.vue'
import PMasanaImport from './asana-import/asanaImport.vue'

weDevsPMRegisterChildrenRoute('project_root',
    [
        {
            path: 'tools',
            component: PmTools,
            name: 'pm_tools',
            meta: {
                permission: function(project) {
                    return pmHasManageCapability()
                },
                label: __('Tools', 'pm-pro'),
                order: 8,
            },
            children: [
                {
                    path: '',
                    component: PmToolList,
                    name: 'pm_tools_index'
                },
                {
                    path: 'trello-import',
                    component: PMtrelloImport,
                    name: 'pm_tools_trello',
                    props: true

                },
                {
                    path: 'asana-import',
                    component: PMasanaImport,
                    name: 'pm_tools_asana',
                    props: true

                }
            ]
        }
    ]
);

