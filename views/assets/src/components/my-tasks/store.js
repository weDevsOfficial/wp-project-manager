/**
 * Make sure to call pm.Vue.use(Vuex) first if using a vuex module system
 */
export default {

	state: {
		user: {},
        meta: {},
        graph: [],
        tasks: [],
        users: [],
        currentTasks: [],
        outstandingTasks: [],
        completeTasks: [],
        isFetchMyTaskOverview: false,
        isFetchMyTaskActivities: false,
        isFetchCurrentTasks: false,
        isFetchOutstandingTasks: false,
        isFetchCompleteTasks: false,
        activities: [],
        activitiesMeta: {},
        getIndex: function ( itemList, id, slug) {
            var index = false;

            itemList.forEach(function(item, key) {
                if (item[slug] == id) {
                    index = key;
                }
            });

            return index;
        }
	},

	mutations: {

        setUserTask (state, user){ 
            state.user = user;
            state.isFetchMyTask = true;
        },
        setGraph (state, graph) {
            state.graph = graph;
        },
        setTasks (state, tasks) {
            state.tasks = tasks;
        },
        setCurrentTasks (state, projects) {
            state.currentTasks = projects;
        },
        setOutstandingTasks (state, projects) {
            state.outstandingTasks = projects;
        },
        setCompleteTasks (state, projects) {
            state.completeTasks = projects;
        },
        setActivities (state, activities) {
            state.activities = activities;
        },
        setActivitiesMeta (state, activitiesMeta) {
            state.activitiesMeta = activitiesMeta;
        },

        setUsers (state, users){
            state.users = users;
        },
        setLoadFalse (state) {
            state.isFetchMyTaskOverview = false;
            state.isFetchMyTaskActivities = false;
            state.isFetchCurrentTasks = false;
            state.isFetchOutstandingTasks = false;
            state.isFetchCompleteTasks = false;
            state.activitiesMeta = {};
        },

        setMoreActivities(state, activities){
            state.activities = state.activities.concat(activities);
        },
        afterDoneUndoneTask(state, {task, route}) {
            if (route == 'mytask-current') {
                var pi = state.currentTasks.findIndex( p => p.id == task.project_id);
                if ( -1  !== pi ) {
                    var ti = state.currentTasks[pi].tasks.data.findIndex(t => t.id == task.id);
                        if (-1 !== ti) {
                            state.currentTasks[pi].tasks.data.splice(ti, 1);
                            state.isFetchCompleteTasks = false;
                            state.user.meta.data.total_current_tasks--;
                            state.user.meta.data.total_complete_tasks ++;
                        }
                }
            }
            if (route == 'mytask-outstanding') {
                var pi = state.outstandingTasks.findIndex( p => p.id == task.project_id);
                if ( -1  !== pi ) {
                    var ti = state.outstandingTasks[pi].tasks.data.findIndex(t => t.id == task.id);
                        if (-1 !== ti) {
                            state.outstandingTasks[pi].tasks.data.splice(ti, 1);
                            state.isFetchCompleteTasks = false;
                            state.user.meta.data.total_outstanding_tasks--;
                            state.user.meta.data.total_complete_tasks ++;
                        }
                }
            }
            if (route == 'mytask-complete') {
                var pi = state.completeTasks.findIndex( p => p.id == task.project_id);
                if ( -1  !== pi ) {
                    var ti = state.completeTasks[pi].tasks.data.findIndex(t => t.id == task.id);
                        if (-1 !== ti) {
                            state.completeTasks[pi].tasks.data.splice(ti, 1);
                            state.isFetchOutstandingTasks = false;
                            state.isFetchCurrentTasks = false;
                            state.user.meta.data.total_complete_tasks --;
                        }
                }
            }
        }
	},
}
