/**
 * Make sure to call pm.Vue.use(Vuex) first if using a vuex module system
 */

export default {
    state :{
        selectedAclProjects: [],
    },
    mutations:{
        setAclProjects (state, project) {
            state.selectedAclProjects.push(project);
        },
        unsetAclProjects (state, project) {
            const index = state.selectedAclProjects.indexOf(project);
            state.selectedAclProjects.splice(index, 1);
        },
        emptyAclProjects (state) {
            state.selectedAclProjects = [];
        },

    }
}
