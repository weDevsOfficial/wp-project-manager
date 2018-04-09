__webpack_public_path__ = PM_Vars.dir_url + 'views/assets/js/';

Vue.use(VAutocomplete.default);

var color           = require('vue-color/src/components/Sketch.vue');
pm.color            = color.default;

var commonComp      = require('./global-common-components');
pm.commonComponents = commonComp.default;

pm.Multiselect      = require('vue-multiselect');
pm.color = require('vue-color/src/components/Sketch.vue');

import Lists from '@components/project-task-lists/mixin'
import Mixins from '@helpers/mixin/mixin'
import Settings from '@components/settings/mixin'

PmMixin.projectTaskLists = Lists;
PmMixin.mixins = Mixins;
PmMixin.settings = Settings;


