import Vue from './../../vue/vue';
import Vuex from './../../vue/vuex';

/**
 * Make sure to call Vue.use(Vuex) first if using a vuex module system
 */
Vue.use(Vuex);

export default new Vuex.Store({

	state: {
		is_discuss_form_active: false,
		milestones: [],
		discussion: [],
		discuss: {},
		meta: {},
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
		showHideDiscussForm (state, status) {
			if ( status === 'toggle' ) {
                state.is_discuss_form_active = state.is_discuss_form_active ? false : true;
            } else {
                state.is_discuss_form_active = status;
            }
		},

		setMilestones (state, milestones) {
			state.milestones = milestones;
		},

		setDiscussion (state, discussion) {
			
			state.discussion = discussion;
		},

		setDiscuss (state, discuss) {
			state.discussion = [];
			state.discussion.push(discuss);
		},

		afterDeleteDiscuss (state, discuss_id) {
			var discuss_index = state.getIndex(state.discussion, discuss_id, 'id');
            state.discussion.splice(discuss_index,1);
		},
		setDiscussionMeta (state, meta) {
			state.meta = meta;
		},
		afterDeleteComment(state, data ) {
			console.log(data)
			console.log(state.discussion[0].comments)
			var comment_index = state.getIndex(state.discussion[0].comments.data, data.comment_id, 'id');
			state.discussion[0].comments.data.splice( comment_index, 1 );
		}
	}
});