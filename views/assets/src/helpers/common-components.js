import pagination from '@components/common/pagination.vue';
import datePicker from '@components/common/date-picker.vue';
import activityParser from '@components/common/activity-parser.vue';
import Header from '@components/common/header.vue';
import VueContentLoading from '@components/common/VueContentLoading.vue';
import DateTimePicker from '@components/common/time-picker.vue';
import colorPicker from '@components/common/color-picker.vue';
import DoAction from '@components/common/do-action.vue';
import ListForm from '@components/project-task-lists/new-task-list-form.vue';
import TaskForm from '@components/project-task-lists/new-task-form.vue';


pm.Vue.component('pm-pagination', pagination);
pm.Vue.component('pm-date-picker', datePicker);
pm.Vue.component('activityParser', activityParser);
pm.Vue.component('pm-header', Header);
pm.Vue.component('VueContentLoading', VueContentLoading);
pm.Vue.component('pm-date-time-picker', DateTimePicker);
pm.Vue.component('pm-color-picker', colorPicker);
pm.Vue.component('pm-do-action', DoAction);
pm.Vue.component('pm-new-list-form', ListForm);
pm.Vue.component('pm-new-task-form', TaskForm);



