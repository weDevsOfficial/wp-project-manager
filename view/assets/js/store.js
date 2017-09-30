import Vue from './vue/vue';
import Vuex from './vue/vuex';

/**
 * Make sure to call Vue.use(Vuex) first if using a vuex module system
 */
Vue.use(Vuex);

export default new Vuex.Store({
	
	state: {
		project: {},
		project_users: [],
		categories: [],
		roles: []
	},

	mutations: {
		setProject (state, project) {
			state.project = project;
		},

		setProjectUsers (state, users) {
			state.project_users = users;
		},
		setCategories (state, categories) {
			state.categories = categories;
		},
		setRoles (state, roles) {
			state.roles = roles;
		}
	}
	
});
