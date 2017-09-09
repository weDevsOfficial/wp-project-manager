import Vue from './../../vue/vue';
import Vuex from './../../vue/vuex';

/**
 * Make sure to call Vue.use(Vuex) first if using a vuex module system
 */
Vue.use(Vuex);

var Store = {
	state: {
		projects: []
	},

	mutations: {
		getProjects (state, projects) {
			state.projects = projects.projects;
		}	
	}
}

export default new Vuex.Store(Store);