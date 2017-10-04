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
		total_milestone_page: 0,
		getIndex: function ( itemList, id, slug) {
            var index = false;

            itemList.forEach(function(item, key) {
                if (item[slug] == id) {
                    index = key;
                }
            });

            return index;
        },
	},
	
	mutations: {
		showHideMilestoneForm (state, status) {
			if ( status === 'toggle' ) {
                state.is_milestone_form_active = state.is_milestone_form_active ? false : true;
            } else {
                state.is_milestone_form_active = status;
            }
		},

		setSelfMilestones (state, milestones) {
			state.milestones = milestones;
		},

		setMilestone (state, milestone) {
			state.milestones = [];
			state.milestones.push(milestone);
		},

		setTotalMilestonePage (state, total) {
			state.total_milestone_page = total;
		},

		afterDeleteMilestone (state, milestone_id) {
			var milestone_index = state.getIndex(state.milestones, milestone_id, 'id');
            state.milestones.splice(milestone_index,1);
		}
	}
});