
/**
 * Make sure to call  first if using a vuex module system
 */
export default {

    state: {
        isFetchMilestone: false,
        is_milestone_form_active: false,
        milestones: [],
        milestone: {},
        blank_template: false,
        milestone_template: false,
        milestone_meta:{},
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

        setMilestones (state, milestones) {
            state.milestones = milestones;
            state.isFetchMilestone = true;
            state.blank_template = false;
        },

        setMilestonesMeta(state, data){
            state.milestone_meta = data;
        },

        setMilestone (state, milestone) {
            state.milestones = [];
            state.milestones.push(milestone);
        },

        afterDeleteMilestone (state, milestone_id) {
            var milestone_index = state.getIndex(state.milestones, milestone_id, 'id');
            state.milestones.splice(milestone_index,1);
            state.milestone_meta.total = state.milestone_meta.total - 1;
        },

        updateMilestone (state, data) {
            var milestone_index = state.getIndex(state.milestones, data.id, 'id');
            jQuery.extend(true, state.milestones[milestone_index], data )
            //state.milestones.splice(milestone_index, 1,);
        },

        newMilestone (state, milestone) {
            var per_page = state.milestone_meta.per_page,
                length   = state.milestones.length;

            if(typeof milestone.discussion_boards === 'undefined'){
                milestone.discussion_boards = {data:[]};
            }

            if(typeof milestone.task_lists === 'undefined'){
                milestone.task_lists = {data:[]};
            }

            if (per_page <= length) {
                state.milestones.splice(0,0,milestone);
                state.milestones.pop();
            } else {
                state.milestones.splice(0,0,milestone);
            }
        },

        afterNewMilestoneUpdateMeta (state) {
            state.milestone_meta.total = state.milestone_meta.total + 1;
            state.milestone_meta.total_pages = Math.ceil( state.milestone_meta.total / state.milestone_meta.per_page );
        },

        balankTemplateStatus (state, status) {
            state.blank_template = status;
        },

        milestoneTemplateStatus (state, status) {
            state.milestone_template = status;
        },

        updateMetaAfterNewDiscussion (state) {
            state.meta.total = state.meta.total + 1;
            state.meta.total_pages = Math.ceil( state.meta.total / state.meta.per_page );
        },
        updateMilestonePrivacy (state, data) {
            var index = state.getIndex(state.milestones, data.milestone_id, 'id');
            state.milestones[index].meta.privacy = data.privacy;
        },

        fetchMilestoneStatus (state, status) {
            state.isFetchMilestone = status;
        }
    }
};