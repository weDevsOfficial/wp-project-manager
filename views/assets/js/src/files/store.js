import Vue from 'vue';
import Vuex from 'vuex';

/**
 * Make sure to call Vue.use(Vuex) first if using a vuex module system
 */
Vue.use(Vuex);

export default new Vuex.Store({

	state: {
		files: []
	},
	
	mutations: {
		setFiles (state, files) {
			state.files = files;
		}
	}
});