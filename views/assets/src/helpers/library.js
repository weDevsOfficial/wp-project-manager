__webpack_public_path__ = PM_Vars.dir_url + 'views/assets/js/';

Vue.use(VAutocomplete.default);

var color           = require('vue-color/src/components/Sketch.vue');
pm.color            = color.default;
pm.Multiselect      = require('vue-multiselect'); 

var commonComp      = require('./global-common-components');
pm.commonComponents = commonComp.default;



// console.log(commonComp2);

pm.color = require('vue-color/src/components/Sketch.vue');


import Lists from '@components/project-task-lists/mixin'
import Mixins from '@helpers/mixin/mixin'
import Settings from '@components/settings/mixin'
import SingleTask from '@components/project-task-lists/single-task.vue';


pm.SingleTask = SingleTask;

PmMixin.projectTaskLists = Lists;
PmMixin.mixins = Mixins;
PmMixin.settings = Settings;


