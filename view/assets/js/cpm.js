__webpack_public_path__ = 'http://localhost/api/wp-content/plugins/cpmapi/view/assets/js/';

import Vue from './vue/vue';
import store from './store';
import router from './router';
import mixin from './mixin';
import Controllers from './components/controllers.vue';

/**
 * Project template render
 */
var CPM_Vue = {
	el: '#wedevs-pm',
	store,
	router,
	mixins: [mixin],
	template: '<cpm-projects/>',
	components: { 'cpm-projects': Controllers }
}

new Vue(CPM_Vue); 
