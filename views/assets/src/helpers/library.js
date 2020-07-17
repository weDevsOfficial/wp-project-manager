__webpack_public_path__ = PM_Vars.dir_url + 'views/assets/js/';

import Fragment from 'vue-fragment'
Vue.use(Fragment.Plugin)

pm.hooks = (wp && wp.hooks) ? wp.hooks : wedevsPMWPHook;

var color           = require('vue-color/src/components/Sketch.vue');
pm.color            = color.default;
pm.Multiselect      = require('vue-multiselect'); 

var commonComp      = require('./global-common-components');
pm.commonComponents = commonComp.default;

Vue.use(VTooltip);

import Lists from '@components/project-task-lists/mixin'
import Mixins from '@helpers/mixin/mixin'
import Settings from '@components/settings/mixin'
import SingleTask from '@components/project-task-lists/single-task.vue';
// import listpage from '@components/project-task-lists/lists.vue';

pm.SingleTask = SingleTask;

PmMixin.projectTaskLists = Lists;
PmMixin.mixins = Mixins;
PmMixin.settings = Settings;





