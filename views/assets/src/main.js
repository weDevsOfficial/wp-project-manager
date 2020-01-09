import '@helpers/less/pm-style.less'
import router from '@router/router'
import store from '@store/store'
import '@directives/directive'
import Mixin from '@helpers/mixin/mixin'
import ModuleMixin from '@helpers/mixin/module-mixin'
import App from './App.vue'
import '@helpers/common-components'
import menuFix from '@helpers/menu-fix';

window.pmBus = new Vue();

Vue.config.devtools = true;

/**
 * Project template render
 */
var PM_Vue = {
    el: `#${PM_Vars.id}`,
    store,
    router,
    render: t => t(App),
    moduleMixins: ModuleMixin
}

Vue.mixin(Mixin);

new Vue(PM_Vue); 

// fix the admin menu for the slug "vue-app"
menuFix('pm_projects');
