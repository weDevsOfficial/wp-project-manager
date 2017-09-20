import Vue from './../../vue/vue';
import Vuex from './../../vue/vuex';

/**
 * Make sure to call Vue.use(Vuex) first if using a vuex module system
 */
Vue.use(Vuex);

export default new Vuex.Store({

	state: {
		is_milestone_form_active: false,
		milestones: [],
		milestone: {},
		// comments: [],
		// meta: {}
	},
	
	mutations: {
		showHideMilestoneForm (state, status) {
			if ( status === 'toggle' ) {
                state.is_milestone_form_active = state.is_milestone_form_active ? false : true;
            } else {
                state.is_milestone_form_active = status;
            }
		},

		setMilestones (state, milestones) {
			state.milestones = milestones;
		},

		setMilestone (state, milestone) {
			state.milestones = [];
			state.milestones.push(milestone);
		},

		// setComments (state, discussion) {
		// 	state.comments = discussion.comments.data;
		// },

		// setCommentsMeta (state, discussion) {
			
		// 	state.meta = discussion.comments.meta.pagination;
		// }
	}
});