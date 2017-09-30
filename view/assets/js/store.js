import Vue from './vue/vue';
import Vuex from './vue/vuex';

/**
 * Make sure to call Vue.use(Vuex) first if using a vuex module system
 */
Vue.use(Vuex);

export default new Vuex.Store({
	
	state: {
		projects: [],
		project: {},
		project_users: [],
		categories: [],
		roles: [],
		is_project_form_active: false,
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
		},
		newProject (state, projects) {
			state.projects.push(projects.projects);
		},
		showHideProjectForm (state, status) {
			if ( status === 'toggle' ) {
                state.is_project_form_active = state.is_project_form_active ? false : true;
            } else {
                state.is_project_form_active = status;
            }
		},
	}
	
});
