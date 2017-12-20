import pagination from '@components/common/pagination.vue';
import datePicker from '@components/common/date-picker.vue';
import activityParser from '@components/common/activity-parser.vue';
import Header from '@components/common/header.vue';
import VueContentLoading from '@components/common/VueContentLoading.vue';


pm.Vue.component('pmPagination', pagination);
pm.Vue.component('pm-date-picker', datePicker);
pm.Vue.component('activityParser', activityParser);
pm.Vue.component('pm-header', Header);
pm.Vue.component('VueContentLoading', VueContentLoading);

