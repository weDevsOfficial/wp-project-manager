import Vue from './vue/vue';
import Vuex from './vue/vuex';
import VueRouter from './vue/vue-router';

import store from './store';
import mixin from './mixin';
import router from './router';

import Projects from './components/projects.vue';


/**
 * Make sure to call Vue.use(Vuex) first if using a vuex module system
 */
Vue.use(Vuex);

/**
 * Project template render
 */
var CPM_Vue = {
	el: '#wedevs-cpm',
	mixins: [mixin],
	store: new Vuex.Store(store),
	router: new VueRouter(router),
	template: '<cpm-projects/>',
	components: { 'cpm-projects': Projects }
}

new Vue(CPM_Vue);

