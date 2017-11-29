
/**
 * Make sure to call pm.Vue.use(Vuex) first if using a vuex module system
 */
export default {

    state: {
        activities: [],
    },
    
    mutations: {
        setActivities (state, activities) {
            if ( state.activities.length > 0 ){
                state.activities = state.activities.concat(activities);
            }else{
                state.activities = activities;
            }
        },

        // setLoadedActivities (state, activities) {
        //     var new_activity = state.activities.concat(activities);
        //     state.activities = new_activity;
        // }
    }
};