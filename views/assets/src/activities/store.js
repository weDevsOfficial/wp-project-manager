


/**
 * Make sure to call pm.Vue.use(Vuex) first if using a vuex module system
 */
export default new pm.Vuex.Store({

	state: {
		activities: [],
	},
	
	mutations: {
		setActivities (state, activities) {
			state.activities = activities;
		},

		setLoadedActivities (state, activities) {
			var new_activity = state.activities.concat(activities);
			state.activities = new_activity;
		}
	}
});