


/**
 * Make sure to call pm.Vue.use(Vuex) first if using a vuex module system
 */


export default new pm.Vuex.Store({

	state: {
		files: []
	},
	
	mutations: {
		setFiles (state, files) {
			state.files = files;
		}
	}
});