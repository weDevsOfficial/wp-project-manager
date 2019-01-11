/**
 * Make sure to call pm.Vue.use(Vuex) first if using a vuex module system
 */
export default {

	state: {
        apiKey:""
	},

	mutations: {
        setApiKey(state, value){
           state.apiKey = value;
        }
	}
};
