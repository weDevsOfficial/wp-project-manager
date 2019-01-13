/**
 * Make sure to call pm.Vue.use(Vuex) first if using a vuex module system
 */

export default {
    state :{
        selectedAsanaProjects: [],
    },
    mutations:{
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
