__webpack_public_path__ = PM_Vars.dir_url + 'views/assets/js/';

import Vue from 'vue';
import store from './store';
import router from './router';
import directive from './directive';
import mixin from './mixin';

import Controller from './src/controller.vue';

/**
 * Project template render
 */
var PM_Vue = {
	el: '#wedevs-pm',
	store,
	router,
	render: t => t(Controller),
}

new Vue(PM_Vue); 
