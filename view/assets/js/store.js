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
		project_meta: {},
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
			var per_page = state.project_meta.per_page,
                length   = state.projects.length;

            if (per_page <= length) {
                state.projects.splice(0,0,projects);
                state.projects.pop();
            } else {
                state.projects.splice(0,0,projects);
            }

            //update project_meta
           	state.project_meta.total = state.project_meta.total + 1;
            state.project_meta.total_pages = Math.ceil( state.project_meta.total / state.project_meta.per_page );
		},
		showHideProjectForm (state, status) {
			if ( status === 'toggle' ) {
                state.is_project_form_active = state.is_project_form_active ? false : true;
            } else {
                state.is_project_form_active = status;
            }
		},
		setProjectMeta (state, pagination) {
			state.project_meta = pagination.pagination;
		},

		afterDeleteProject (state, project_id) {
			var project_index = state.getIndex(state.projects, project_id, 'id');
            state.projects.splice(project_index,1);
		}
	}
	
});
