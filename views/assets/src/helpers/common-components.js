import pagination from '@components/common/pagination.vue';
import datePicker from '@components/common/date-picker.vue';
import activityParser from '@components/common/activity-parser.vue';
import Header from '@components/common/header.vue';
import notifyUser from '@components/common/notify-user.vue';
import VueContentLoading from '@components/common/VueContentLoading.vue';
import DateTimePicker from '@components/common/time-picker.vue';
import colorPicker from '@components/common/color-picker.vue';
import DoAction from '@components/common/do-action.vue';
import ListForm from '@components/project-task-lists/new-task-list-form.vue';
import TaskForm from '@components/project-task-lists/new-task-form.vue';
import DatePicker from '@components/project-task-lists/date-picker.vue';
import ContentDatePicker from '@components/common/content-date-picker.vue';
import pmFile from '@components/common/pm-file.vue';
import TaskList from '@components/project-task-lists/lists.vue';
import HeaderMenu from '@components/common/menu.vue';
import Comments from '@components/common/comments.vue';

pm.Vue.component('pm-pagination', pagination);
pm.Vue.component('pm-date-picker', datePicker);
pm.Vue.component('activityParser', activityParser);
pm.Vue.component('pm-header', Header);
pm.Vue.component('pm-notify-user', notifyUser);
pm.Vue.component('VueContentLoading', VueContentLoading);
pm.Vue.component('pm-date-time-picker', DateTimePicker);
pm.Vue.component('pm-color-picker', colorPicker);
pm.Vue.component('pm-do-action', DoAction);
pm.Vue.component('pm-new-list-form', ListForm);
pm.Vue.component('pm-new-task-form', TaskForm);
pm.Vue.component('pm-datepicker', DatePicker);
pm.Vue.component('pm-content-datepicker', ContentDatePicker);
pm.Vue.component('pm-file', pmFile);
pm.Vue.component('pm-task-list', TaskList);
pm.Vue.component('pm-heder-menu', HeaderMenu);
pm.Vue.component('pm-comments', Comments);




