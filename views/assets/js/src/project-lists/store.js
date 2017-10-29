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
		roles: [],
		categories: [],
		total_pages: 0,
		projects_view: '',
	},

	mutations: {

		newProject (state, projects) {
			state.projects.push(projects.projects);
		},

		setProjectUsers (state, users) {
			if (!users.users.hasOwnProperty('roles')) {
				users.users.roles = {
					'data': {
						'id': 3,
						'title': '',
						'description': ''
					}
				};
			}
			var has_in_array = state.project_users.filter( user => {
				return user.id === users.users.id;
			});

			if( !has_in_array.length ) {
				state.project_users.push(users.users);
			}
		},

		setRoles (state, roles) {
			state.roles = roles.roles;
		},

		setCategories (state, categories) {
			state.categories = categories.categories;
		},

		setPagination (state, pagination) {
			state.total_pages = pagination.pagination.total_pages;
		},
		setProjectsView(state, value){
			state.projects_view = value;
		}	
	}
}

export default new Vuex.Store(Store);