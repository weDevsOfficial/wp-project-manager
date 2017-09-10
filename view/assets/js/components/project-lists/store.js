import Vue from './../../vue/vue';
import Vuex from './../../vue/vuex';

/**
 * Make sure to call Vue.use(Vuex) first if using a vuex module system
 */
Vue.use(Vuex);

var Store = {
	state: {
		projects: [],
		project_users: [],
		roles: []
	},

	mutations: {
		setProjects (state, projects) {
			state.projects = projects.projects;
		},

		setProjectUsers (state, users) {
			var has_in_array = state.project_users.filter( user => {
				return user.id === users.users.id;
			});

			if( !has_in_array.length ) {
				state.project_users.push(users.users);
			}
		},

		setRoles (state, roles) {
			state.roles = roles.roles;
		}	
	}
}

export default new Vuex.Store(Store);