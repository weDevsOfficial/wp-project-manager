import store from './store/store';
import router from './router/router';
import directive from './directives/directive';
import mixin from './helpers/mixin/mixin';
import PM from './App.vue';
import pagination from '@components/common/pagination.vue';
import datePicker from '@components/common/date-picker.vue';

pm.Vue.component('pmPagination', pagination);
pm.Vue.component('pmDatePicker', datePicker);
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





