import Vue from './vue/vue';
import Vuex from './vue/vuex';
import VueRouter from './vue/vue-router';

import store from './store';
import mixin from './mixin';
import router from './router';

import Projects from './components/projects.vue';

;(function($) {
	/**
	 * Make sure to call Vue.use(Vuex) first if using a vuex module system
	 */
	Vue.use(Vuex);
	/**
	 * Project template render
	 */
	var cpm_Vue = new Vue({
		store: new Vuex.Store(store),
		router: new VueRouter(router),
		mixin: [mixin],
		template: '<cpm-projects/>',
		components: { 
			'cpm-projects': Projects 
		}
		
	}).$mount('#wedevs-cpm');

})(jQuery);