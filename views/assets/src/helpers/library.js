__webpack_public_path__ = PM_Vars.dir_url + 'views/assets/js/';

import Promise from 'promise-polyfill'; 

// To add to window
if (!window.Promise) {
  window.Promise = Promise;
}

window.pm = {};

var scriptsLoaded = {
	'Vue': false,
	'Vuex': false,
	'VueRouter': false,
	'Chart': false,
	'Fullcalendar': false,
	'Multiselect': false,
	'NProgress': false,
	'Moment': false,
	'Toastr': false,
	'Uploader': false
};

window.pmPromise = new Promise(function(resolve, reject) {
		require.ensure(
			['vue'],
			function(require) {
				require(['vue'], function(script) {
					pm.Vue = script.default;
				});
			}
		).then(function() {
			scriptsLoaded.Vue = true;
			pmIsAllScriptsLoaded(resolve, reject);
		});

		require.ensure(
			['vuex'],
			function(require) {
				pm.Vuex = require('vuex');
			}
		).then(function() {
			scriptsLoaded.Vuex = true;
			pmIsAllScriptsLoaded(resolve, reject);
		});

		require.ensure(
			['vue-router'],
			function(require) {
				require(['vue-router'], function(script) {
					pm.VueRouter = script.default;
				});
			}
		).then(function() {
			scriptsLoaded.VueRouter = true;
			pmIsAllScriptsLoaded(resolve, reject);
		});

		require.ensure(
			['chart.js'],
			function(require) {
				pm.Chart = require('chart.js');
			}
		).then(function() {
			scriptsLoaded.Chart = true;
			pmIsAllScriptsLoaded(resolve, reject);
		});

		require.ensure(
			['fullcalendar'],
			function(require) {
				pm.Fullcalendar = require('fullcalendar');
			}
		).then(function() {
			scriptsLoaded.Fullcalendar = true;
			pmIsAllScriptsLoaded(resolve, reject);
		});

		require.ensure(
			['vue-multiselect'],
			function(require) {
				pm.Multiselect = require('vue-multiselect');
			}
		).then(function() {
			scriptsLoaded.Multiselect = true;
			pmIsAllScriptsLoaded(resolve, reject);
		});

		require.ensure(
			['nprogress'],
			function(require) {
				pm.NProgress = require('nprogress');
			}
		).then(function() {
			scriptsLoaded.NProgress = true;
			pmIsAllScriptsLoaded(resolve, reject);
		});

		require.ensure(
			['moment'],
			function(require) {
				pm.Moment = require('moment');
			}
		).then(function() {
			scriptsLoaded.Moment = true;
			pmIsAllScriptsLoaded(resolve, reject);
		});

		require.ensure(
			['toastr'],
			function(require) {
				pm.Toastr = require('toastr');
			}
		).then(function() {
			scriptsLoaded.Toastr = true;
			pmIsAllScriptsLoaded(resolve, reject);
		});

		require.ensure(
			['./pm-upload/upload'],
			function(require) {
				pm.Uploader = require('./pm-upload/upload');
			}
		).then(function() {
			scriptsLoaded.Uploader = true;
			pmIsAllScriptsLoaded(resolve, reject);
		});

	
});

function pmIsAllScriptsLoaded(resolve, reject) {
	var loaded = Object.values(scriptsLoaded);

	if (loaded.indexOf(false) === -1) {
		resolve(true);
	}
}

pmPromise.then(function(result) {
	pm.Vue.use(pm.Vuex);
	pm.Vue.use(pm.VueRouter);
});


