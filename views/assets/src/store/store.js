export default new pm.Vuex.Store({
    state: {
        is_need_fetch_view_type: true,
        projects: [],
        project: {},
        project_users: [],
        is_single_task: false,
        categories: [],
        roles: [],
        milestones: [],
        milestones_load: false,
        is_project_form_active: false,
        projects_meta: {},
        pagination: {},
        listView: 'list',
        getIndex: function ( itemList, id, slug) {
            var index = false;

            itemList.forEach(function(item, key) {
                if (item[slug] == id) {
                    index = key;
                }
            });

            return index;
        },
        assignees: []
    },

    mutations: {
        listViewType (state, view_type) {
            state.listView = view_type;
        },
        isSigleTask (state, status) {
            state.is_single_task = status;
        },
        setProjects (state, projects) {
            state.projects = projects.projects;
        },
        setProject (state, project) {
            state.projects.push(project);
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
            if ( typeof data !== 'undefined' ) {
                state.projects_meta = data;
                state.pagination = data.pagination;
            }
        },

        afterDeleteProject (state, project_id) {
            var project_index = state.getIndex(state.projects, project_id, 'id');
            state.projects.splice(project_index,1);
        },

        updateProject (state, project) {
            var index = state.getIndex(state.projects, project.id, 'id');
            //console.log(state.projects[index]);
            // console.log(state.projects[index], project);

            //state.projects[index] = project;
            jQuery.extend(true, state.projects[index], project);
            jQuery.extend(true, state.project, project);
            //console.log(state.projects[index], project);
            // jQuery.each(state.projects[index], function(key, value) {
            //  //console.log(state.projects[index][key], project[key]);
            //  jQuery.extend(true, state.projects[index][key], project[key]);
            // });

            // //console.log(state.projects[index]);
        },

        showHideProjectDropDownAction (state, data) {
            var index = state.getIndex(state.projects, data.project_id, 'id');
            
            if (data.status === 'toggle') {
                state.projects[index].settings_hide = state.projects[index].settings_hide ? false : true;
            } else {
                state.projects[index].settings_hide = data.status;
            }
        },

        afterDeleteUserFromProject (state, data) {
            var index = state.getIndex(state.projects, data.project_id, 'id');
            var users = state.projects[index].assignees.data;
            var user_index = state.getIndex(users, data.user_id, 'id');

            state.projects[index].assignees.data.splice(user_index, 1);
        },

        updateSeletedUser (state, assignees) {
            state.assignees.push(assignees);
        },

        setSeletedUser(state, assignees) {
            state.assignees = assignees;
        },

        resetSelectedUsers (state) {
            state.assignees = [];
        },

        setMilestones(state, milestones){
            state.milestones = milestones;
            state.milestones_load = true;
        },

        is_need_fetch_view_type (state, status) {
            state.is_need_fetch_view_type = status;
        }
    }
    
});
