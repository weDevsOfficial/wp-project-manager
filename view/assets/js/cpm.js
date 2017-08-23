;(function($) {

	import './mixin';
	
	var CPM_Store_Propertie = new Vuex.Store(CPM_Store);

	/**
	 * Todo list router
	 */
	var CPM_Router_Properties = new VueRouter(CPM_Router);

	var cpm_Vue = new Vue({
		store: CPM_Store_Propertie,

		router: CPM_Router_Properties,
		
		mixin: [CPM_Mixin],
		
		components: {
	
		}

	//cpm-content-wrap class should be wraper for all pages
	}).$mount('#cpm');

})(jQuery);