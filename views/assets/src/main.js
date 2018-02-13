import Promise from 'promise-polyfill'; 

var store, router, directive, mixin, PM, PMComponents;

var scriptsLoaded = {
	'store': false,
	'router': false,
	'directive': false,
	'mixin': false,
	'PM': false,
	'PMComponents': false,
};

var promiseReturn = new Promise(function(resolve, reject) {

	require(['./router/router'], function(script) {
		router = script.default;
		scriptsLoaded.router = true;
		pmScriptsLoaded(resolve, reject);


		weDevsPmModules.forEach(function(module) {
            let mixin = require('./components/'+module.path+'/mixin.js');
            PmMixin[module.name] = mixin.default;
        });

		
		require(['./store/store'], function(script) {
			store = script.default;
			scriptsLoaded.store = true;
			pmScriptsLoaded(resolve, reject);
		});

		require(['./directives/directive'], function(script) {
			directive = script.default;
			scriptsLoaded.directive = true;
			pmScriptsLoaded(resolve, reject);
		});

		require(['./helpers/mixin/mixin'], function(script) {
			mixin = script.default;
			scriptsLoaded.mixin = true;
			pmScriptsLoaded(resolve, reject);
		});

		require(['./App.vue'], function(script) {
			PM = script.default;
			scriptsLoaded.PM = true;
			pmScriptsLoaded(resolve, reject);
		});

		require(['./helpers/common-components'], function(script) {
			PMComponents = script.default;
			scriptsLoaded.PMComponents = true;
			pmScriptsLoaded(resolve, reject);
		});
	});

});

function pmScriptsLoaded(resolve, reject) {
	var loaded = Object.values(scriptsLoaded);
	
	if (loaded.indexOf(false) === -1) {
		resolve(true);
	}
}

window.pmBus = new pm.Vue();

promiseReturn.then(function(result) {
	/**
	 * Project template render
	 */
	var PM_Vue = {
	    el: '#wedevs-pm',
	    store,
	    router,
	    render: t => t(PM),
	}

	pm.Vue.mixin(pm.Mixin.default);
	
	new pm.Vue(PM_Vue); 
});






