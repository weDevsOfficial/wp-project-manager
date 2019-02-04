/**
 * Make sure to call pm.Vue.use(Vuex) first if using a vuex module system
 */

export default {
    state :{
        workspaces: [],
        selectedAsanaProjects: [],
    },
    mutations:{
        setWorkspaces(state, workspace) {
            state.workspaces.push(workspace);
        },

        updateWorkspaceProject(state, workspaceIndex, projectIndex, project) {
            state.workspaces[workspaceIndex].projects[projectIndex] = project;
        },

        emptyAsanaWorkspaces (state) {
            state.workspaces = [];
        },

        setAsanaProjects (state, AsanaProject) {
            state.selectedAsanaProjects.push(AsanaProject);
        },
        unsetAsanaProjects (state, AsanaProject) {
            const index = state.selectedAsanaProjects.indexOf(AsanaProject);
            state.selectedAsanaProjects.splice(index, 1);
        },
        emptyAsanaProjects (state) {
            state.selectedAsanaProjects = [];
        },

    }
}
