__webpack_public_path__ = PM_Vars.dir_url + 'views/assets/js/';


var color           = require('vue-color/src/components/Sketch.vue');
pm.color            = color.default;

var autocomplete    = require('v-autocomplete');

pm.Autocomplete     = autocomplete.default;

var commonComp      = require('./global-common-components');
pm.commonComponents = commonComp.default;

pm.Multiselect      = require('vue-multiselect');

import Lists from '@components/project-task-lists/mixin'

PmMixin.projectTaskLists = Lists;


