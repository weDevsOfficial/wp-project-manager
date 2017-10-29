__webpack_public_path__ = PM_Vars.dir_url + 'views/assets/js/';

import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import Chart from 'chart.js';
import Fullcalendar from 'fullcalendar';
import Multiselect from 'vue-multiselect';
import NProgress from 'nprogress';
import Moment from 'moment';
import Moment_Timezone from 'moment-timezone';
import Toastr from 'toastr';
import Upload from './helper/pm-upload/upload';

window.pm = {};

pm.Vue             = Vue;
pm.Vuex            = Vuex;
pm.VueRouter       = VueRouter;
pm.Chart           = Chart;
pm.Fullcalendar    = Fullcalendar;
pm.Multiselect     = Multiselect;
pm.NProgress       = NProgress;
pm.Moment          = Moment; 
pm.Moment_Timezone = Moment_Timezone;
pm.Toastr          = Toastr;

pm.Vue.use(pm.Vuex);
pm.Vue.use(pm.VueRouter);