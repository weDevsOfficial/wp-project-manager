
/**
 * Make sure to call pm.Vue.use(Vuex) first if using a vuex module system
 */


export default new pm.Vuex.Store({

    state: {
        is_discuss_form_active: false,
        blank_template: false,
        discuss_template: false,
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
            var comment_index = state.getIndex(state.discussion[0].comments.data, data.comment_id, 'id');
            state.discussion[0].comments.data.splice( comment_index, 1 );
        },
        updateDiscuss (state, data) {
            var discuss_index = state.getIndex(state.discussion, data.id, 'id');
            jQuery.extend(true, state.discussion[discuss_index], data);
            //state.discussion.splice(discuss_index, 1, data);
        },

        newDiscuss (state, discuss) {
            var per_page = state.meta.per_page,
                length   = state.discussion.length;

            if (per_page <= length) {
                state.discussion.splice(0,0,discuss);
                state.discussion.pop();
            } else {
                state.discussion.splice(0,0,discuss);
            }
        },

        balankTemplateStatus (state, status) {
            state.blank_template = status;
        },

        discussTemplateStatus (state, status) {
            state.discuss_template = status;
        },

        updateMetaAfterNewDiscussion (state) {
            state.meta.total = state.meta.total + 1;
            state.meta.total_pages = Math.ceil( state.meta.total / state.meta.per_page );
        },

        afterNewComment (state, data) {
            var index = state.getIndex( state.discussion, data.commentable_id, 'id' );

            state.discussion[index].comments.data.splice(0,0,data.comment);
        },

        afterUpdateComment (state, data) {
            var index = state.getIndex( state.discussion, data.commentable_id, 'id' ),
                comment_index = state.getIndex( state.discussion[index].comments.data, data.comment_id, 'id' );

            state.discussion[index].comments.data.splice(comment_index,1,data.comment);
        }
    }
});