import Vue from './../../vue/vue';
import Vuex from './../../vue/vuex';

/**
 * Make sure to call Vue.use(Vuex) first if using a vuex module system
 */
Vue.use(Vuex);

export default new Vuex.Store({

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