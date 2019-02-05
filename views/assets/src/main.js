import '@helpers/less/pm-style.less'
import router from '@router/router'
import store from '@store/store'
import '@directives/directive'
import Mixin from '@helpers/mixin/mixin'
import ModuleMixin from '@helpers/mixin/module-mixin'
import PM from './App.vue'
import '@helpers/common-components'
import {PMmenuFix} from '@helpers/menu-fix';

window.pmBus = new pm.Vue();

//promiseReturn.then(function(result) {
	/**
	 * Project template render
	 */
	var PM_Vue = {
	    el: '#wedevs-pm',
	    store,
	    router,
	    render: t => t(PM),
	    moduleMixins: ModuleMixin
	}
	
	pm.Vue.mixin(Mixin);
	
	new pm.Vue(PM_Vue); 
	

	
	// fix the admin menu for the slug "vue-app"
	PMmenuFix('pm_projects');
//});






