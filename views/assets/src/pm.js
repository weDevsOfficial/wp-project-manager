__webpack_public_path__ = PM_Vars.dir_url + 'views/assets/js/';

import store from './common/store';
import router from './common/router';
import directive from './common/directive';
import mixin from './common/mixin';

import PM from './pm.vue';

/**
 * Project template render
 */
var PM_Vue = {
	el: '#wedevs-pm',
	store,
	router,
	render: t => t(PM),
}

new pm.Vue(PM_Vue); 
