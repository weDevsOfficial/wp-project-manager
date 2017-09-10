import Vue from './../../vue/vue';
import Vuex from './../../vue/vuex';

/**
 * Make sure to call Vue.use(Vuex) first if using a vuex module system
 */
Vue.use(Vuex);

var Store = {
	state: {
		projects: [],
		project_users: [
			{
				display_name: 'Asaquzzaman',
				ID: 45,
				email: 'joy.mishu@gmail.com'
			},

			{
				display_name: 'Ashikur',
				ID: 46,
				email: 'ashi@gmail.com'
			}
		]
	},

	mutations: {
		setProjects (state, projects) {
			state.projects = projects.projects;
		},

		setProjectUsers (state, users) {
			state.project_users = users.users;
		}	
	}
}

export default new Vuex.Store(Store);