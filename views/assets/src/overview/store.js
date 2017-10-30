
/**
 * Make sure to call pm.Vue.use(Vuex) first if using a vuex module system
 */
export default new pm.Vuex.Store({

	state: {
		meta: {},
		assignees: [],
		graph: [],
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
		setOverViews (state, over_views) {
			state.meta = over_views.meta;
			state.assignees = over_views.assignees.data;
			state.graph = over_views.overview_graph.data;
		},
	}
});