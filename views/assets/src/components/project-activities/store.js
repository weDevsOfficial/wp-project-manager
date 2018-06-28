
/**
 * Make sure to call pm.Vue.use(Vuex) first if using a vuex module system
 */
export default {

    state: {
        activities: [],
        isActivityFetched: false,
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
        setActivities (state, activities) {
            var index = state.getIndex(state.activities, activities.project_id, 'project_id');

            if (index === false) {
                var activity = {
                    activities: activities.data,
                    project_id: activities.project_id,
                    page: 1
                }

                state.activities.push(activity);

            } else {
                var prevData = state.activities[index];
                var page = prevData.page;

                if ( activities.loadStatus ) {
                    state.activities[index].activities = state.activities[index].activities.concat(activities.data);
                    state.activities[index].page = parseInt(state.activities[index].page) + 1;
                    
                } else {
                    var activity = {
                        activities: activities.data,
                        project_id: activities.project_id,
                        page: 1
                    }
                    state.activities.splice(index, 1, activity);
                }

            }
                
            state.isActivityFetched = true;
        },

        // setLoadedActivities (state, activities) {
        //     var new_activity = state.activities.concat(activities);
        //     state.activities = new_activity;
        // }
    }
};