import store from './store/store';
import router from './router/router';
import directive from './directives/directive';
import mixin from './helpers/mixin/mixin';
import PM from './App.vue';
import PMComponents from './helpers/common-components';

/**
 * Project template render
 */
var PM_Vue = {
    el: '#wedevs-pm',
    store,
    router,
    render: t => t(PM),
}

new pm.Vue(PM_Vue); 





