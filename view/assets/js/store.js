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
		projects_meta: {},
		pagination: {},
		getIndex: function ( itemList, id, slug) {
            var index = false;

            itemList.forEach(function(item, key) {
                if (item[slug] == id) {
                    index = key;
                }
            });

            return index;
        },
	},

	mutations: {
		setProjects (state, projects) {
			state.projects = projects.projects;
		},
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
			var per_page = state.pagination.per_page,
                length   = state.projects.length;

            if (per_page <= length) {
                state.projects.splice(0,0,projects);
                state.projects.pop();
            } else {
                state.projects.splice(0,0,projects);
            }

            //update pagination
           	state.pagination.total = state.pagination.total + 1;
           	state.projects_meta.total_incomplete = state.projects_meta.total_incomplete + 1;
            state.pagination.total_pages = Math.ceil( state.pagination.total / state.pagination.per_page );
		},
		showHideProjectForm (state, status) {
			if ( status === 'toggle' ) {
                state.is_project_form_active = state.is_project_form_active ? false : true;
            } else {
                state.is_project_form_active = status;
            }
		},
		setProjectsMeta (state, data) {
			state.projects_meta = data;
			state.pagination = data.pagination;
		},

		afterDeleteProject (state, project_id) {
			var project_index = state.getIndex(state.projects, project_id, 'id');
            state.projects.splice(project_index,1);
		},

		updateProject (state, project) {
			var index = state.getIndex(state.projects, project.id, 'id');
			jQuery.extend(true, state.projects[index], project);
		},

		showHideProjectDropDownAction (state, status) {
			if (status === 'toggle') {
				state.project.settings_hide = state.project.settings_hide ? false : true;
			} else {
				state.project.settings_hide = status;
			}
		}
	}
	
});
