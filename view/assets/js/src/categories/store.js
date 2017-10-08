import Vue from './../../vue/vue';
import Vuex from './../../vue/vuex';

/**
 * Make sure to call Vue.use(Vuex) first if using a vuex module system
 */
Vue.use(Vuex);

export default new Vuex.Store({

	state: {
		categories: [],
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
		afterNewCategories (state, categories) {
			state.categories.push(categories);
		},

		setCategories (state, categories) {
			state.categories = categories;
		},

		afterUpdateCategories (state, category) {
			var category_index = state.getIndex(state.categories, category.id, 'id');
            state.categories.splice(category_index,1, category);
		}
	}
});