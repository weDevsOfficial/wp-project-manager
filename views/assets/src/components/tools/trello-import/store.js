/**
 * Make sure to call pm.Vue.use(Vuex) first if using a vuex module system
 */

export default {
    state :{
        selectedBoards: [],
    },
    mutations:{
        setBoards (state, board) {
            state.selectedBoards.push(board);
        },
        unsetBoards (state, board) {
            const index = state.selectedBoards.indexOf(board);
            state.selectedBoards.splice(index, 1);
        },
        emptyBoards (state) {
            state.selectedBoards = [];
        },

    }
}
