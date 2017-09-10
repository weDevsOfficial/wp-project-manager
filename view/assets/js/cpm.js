__webpack_public_path__ = 'http://localhost/api/wp-content/plugins/cpmapi/view/assets/js/';

import Vue from './vue/vue';
import store from './store';
import router from './router';
import mixin from './mixin';

import Controller from './components/controller.vue';

/**
 * Project template render
 */
var CPM_Vue = {
	el: '#wedevs-pm',
	store,
	router,
	render: t => t(Controller),
}

new Vue(CPM_Vue); 
