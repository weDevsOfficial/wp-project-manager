webpackJsonp([10],{

/***/ 10:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_activities_vue__ = __webpack_require__(107);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7c1aa333_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_activities_vue__ = __webpack_require__(166);
var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_activities_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7c1aa333_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_activities_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "view/assets/js/components/activities/activities.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] activities.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7c1aa333", Component.options)
  } else {
    hotAPI.reload("data-v-7c1aa333", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),

/***/ 107:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__header_vue__ = __webpack_require__(9);
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["a"] = ({
    components: {
        'pm-header': __WEBPACK_IMPORTED_MODULE_0__header_vue__["a" /* default */]
    }
});

/***/ }),

/***/ 166:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "wrap cpm cpm-front-end"
  }, [_c('pm-header'), _vm._v(" "), _vm._m(0), _vm._v(" "), _c('a', {
    staticClass: "button cpm-load-more",
    attrs: {
      "href": "#",
      "data-project_id": "60",
      "data-start": "21",
      "data-total": "48"
    }
  }, [_vm._v("Load More...")])], 1)
}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('ul', {
    staticClass: "cpm_activity_list"
  }, [_c('ul', {
    staticClass: "cpm-activity-list"
  }, [_c('li', {
    staticClass: "cpm-row"
  }, [_c('div', {
    staticClass: "cpm-activity-date cpm-col-1 cpm-sm-col-12"
  }, [_c('span', [_vm._v(" 11 ")]), _vm._v(" "), _c('br'), _vm._v(" September   ")]), _vm._v(" "), _c('div', {
    staticClass: "cpm-activity-body cpm-col-11 cpm-sm-col-12 cpm-right cpm-last-col"
  }, [_c('ul', [_c('li', [_c('div', {
    staticClass: "cpm-col-8 cpm-sm-col-12"
  }, [_c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_task&user_id=1",
      "title": "admin"
    }
  }, [_vm._v("admin")]), _vm._v(" commented on a "), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_projects&tab=message&action=single&pid=60&mid=97#cpm-comment-315"
    }
  }, [_vm._v("discussion")])]), _c('div', {
    staticClass: "date cpm-col-4 cpm-sm-col-12"
  }, [_c('time', {
    attrs: {
      "datetime": "2017-09-11T13:34:52+00:00",
      "title": "2017-09-11T13:34:52+00:00"
    }
  }, [_vm._v("September 11, 2017 1:34 pm")])]), _vm._v(" "), _c('div', {
    staticClass: "clear"
  })]), _c('li', [_c('div', {
    staticClass: "cpm-col-8 cpm-sm-col-12"
  }, [_c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_task&user_id=1",
      "title": "admin"
    }
  }, [_vm._v("admin")]), _vm._v(" commented on a "), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_projects&tab=message&action=single&pid=60&mid=97#cpm-comment-313"
    }
  }, [_vm._v("discussion")])]), _c('div', {
    staticClass: "date cpm-col-4 cpm-sm-col-12"
  }, [_c('time', {
    attrs: {
      "datetime": "2017-09-11T13:34:47+00:00",
      "title": "2017-09-11T13:34:47+00:00"
    }
  }, [_vm._v("September 11, 2017 1:34 pm")])]), _vm._v(" "), _c('div', {
    staticClass: "clear"
  })]), _c('li', [_c('div', {
    staticClass: "cpm-col-8 cpm-sm-col-12"
  }, [_c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_task&user_id=1",
      "title": "admin"
    }
  }, [_vm._v("admin")]), _vm._v(" commented on a "), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_projects&tab=message&action=single&pid=60&mid=97#cpm-comment-311"
    }
  }, [_vm._v("discussion")])]), _c('div', {
    staticClass: "date cpm-col-4 cpm-sm-col-12"
  }, [_c('time', {
    attrs: {
      "datetime": "2017-09-11T13:34:41+00:00",
      "title": "2017-09-11T13:34:41+00:00"
    }
  }, [_vm._v("September 11, 2017 1:34 pm")])]), _vm._v(" "), _c('div', {
    staticClass: "clear"
  })]), _c('li', [_c('div', {
    staticClass: "cpm-col-8 cpm-sm-col-12"
  }, [_c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_task&user_id=1",
      "title": "admin"
    }
  }, [_vm._v("admin")]), _vm._v(" commented on a "), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_projects&tab=message&action=single&pid=60&mid=97#cpm-comment-309"
    }
  }, [_vm._v("discussion")])]), _c('div', {
    staticClass: "date cpm-col-4 cpm-sm-col-12"
  }, [_c('time', {
    attrs: {
      "datetime": "2017-09-11T13:34:37+00:00",
      "title": "2017-09-11T13:34:37+00:00"
    }
  }, [_vm._v("September 11, 2017 1:34 pm")])]), _vm._v(" "), _c('div', {
    staticClass: "clear"
  })]), _c('li', [_c('div', {
    staticClass: "cpm-col-8 cpm-sm-col-12"
  }, [_vm._v("Message \""), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_projects&tab=message&action=single&pid=60&mid=97"
    }
  }, [_vm._v("srthsrth")]), _vm._v("\" created by "), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_task&user_id=1",
      "title": "admin"
    }
  }, [_vm._v("admin")])]), _c('div', {
    staticClass: "date cpm-col-4 cpm-sm-col-12"
  }, [_c('time', {
    attrs: {
      "datetime": "2017-09-11T13:34:23+00:00",
      "title": "2017-09-11T13:34:23+00:00"
    }
  }, [_vm._v("September 11, 2017 1:34 pm")])]), _vm._v(" "), _c('div', {
    staticClass: "clear"
  })]), _c('li', [_c('div', {
    staticClass: "cpm-col-8 cpm-sm-col-12"
  }, [_vm._v("Message \""), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_projects&tab=message&action=single&pid=60&mid=96"
    }
  }, [_vm._v("kafd")]), _vm._v("\" created by "), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_task&user_id=1",
      "title": "admin"
    }
  }, [_vm._v("admin")])]), _c('div', {
    staticClass: "date cpm-col-4 cpm-sm-col-12"
  }, [_c('time', {
    attrs: {
      "datetime": "2017-09-11T13:34:01+00:00",
      "title": "2017-09-11T13:34:01+00:00"
    }
  }, [_vm._v("September 11, 2017 1:34 pm")])]), _vm._v(" "), _c('div', {
    staticClass: "clear"
  })]), _c('li', [_c('div', {
    staticClass: "cpm-col-8 cpm-sm-col-12"
  }, [_vm._v("Message \""), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_projects&tab=message&action=single&pid=60&mid=95"
    }
  }, [_vm._v("message 1")]), _vm._v("\" created by "), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_task&user_id=1",
      "title": "admin"
    }
  }, [_vm._v("admin")])]), _c('div', {
    staticClass: "date cpm-col-4 cpm-sm-col-12"
  }, [_c('time', {
    attrs: {
      "datetime": "2017-09-11T13:33:26+00:00",
      "title": "2017-09-11T13:33:26+00:00"
    }
  }, [_vm._v("September 11, 2017 1:33 pm")])]), _vm._v(" "), _c('div', {
    staticClass: "clear"
  })]), _c('li', [_c('div', {
    staticClass: "cpm-col-8 cpm-sm-col-12"
  }, [_vm._v("Task \""), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_projects&tab=task&action=task_single&pid=60#/task/94"
    }
  }, [_vm._v("task 1")]), _vm._v("\" updated by "), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_task&user_id=1",
      "title": "admin"
    }
  }, [_vm._v("admin")])]), _c('div', {
    staticClass: "date cpm-col-4 cpm-sm-col-12"
  }, [_c('time', {
    attrs: {
      "datetime": "2017-09-11T10:09:50+00:00",
      "title": "2017-09-11T10:09:50+00:00"
    }
  }, [_vm._v("September 11, 2017 10:09 am")])]), _vm._v(" "), _c('div', {
    staticClass: "clear"
  })]), _c('li', [_c('div', {
    staticClass: "cpm-col-8 cpm-sm-col-12"
  }, [_vm._v("Task \""), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_projects&tab=task&action=task_single&pid=60#/task/94"
    }
  }, [_vm._v("task 1")]), _vm._v("\" updated by "), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_task&user_id=1",
      "title": "admin"
    }
  }, [_vm._v("admin")])]), _c('div', {
    staticClass: "date cpm-col-4 cpm-sm-col-12"
  }, [_c('time', {
    attrs: {
      "datetime": "2017-09-11T10:09:49+00:00",
      "title": "2017-09-11T10:09:49+00:00"
    }
  }, [_vm._v("September 11, 2017 10:09 am")])]), _vm._v(" "), _c('div', {
    staticClass: "clear"
  })]), _c('li', [_c('div', {
    staticClass: "cpm-col-8 cpm-sm-col-12"
  }, [_vm._v("Task \""), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_projects&tab=task&action=task_single&pid=60#/task/94"
    }
  }, [_vm._v("task 1")]), _vm._v("\" updated by "), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_task&user_id=1",
      "title": "admin"
    }
  }, [_vm._v("admin")])]), _c('div', {
    staticClass: "date cpm-col-4 cpm-sm-col-12"
  }, [_c('time', {
    attrs: {
      "datetime": "2017-09-11T10:09:48+00:00",
      "title": "2017-09-11T10:09:48+00:00"
    }
  }, [_vm._v("September 11, 2017 10:09 am")])]), _vm._v(" "), _c('div', {
    staticClass: "clear"
  })]), _c('li', [_c('div', {
    staticClass: "cpm-col-8 cpm-sm-col-12"
  }, [_vm._v("Task \""), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_projects&tab=task&action=task_single&pid=60#/task/94"
    }
  }, [_vm._v("task 1")]), _vm._v("\" updated by "), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_task&user_id=1",
      "title": "admin"
    }
  }, [_vm._v("admin")])]), _c('div', {
    staticClass: "date cpm-col-4 cpm-sm-col-12"
  }, [_c('time', {
    attrs: {
      "datetime": "2017-09-11T08:44:05+00:00",
      "title": "2017-09-11T08:44:05+00:00"
    }
  }, [_vm._v("September 11, 2017 8:44 am")])]), _vm._v(" "), _c('div', {
    staticClass: "clear"
  })]), _c('li', [_c('div', {
    staticClass: "cpm-col-8 cpm-sm-col-12"
  }, [_vm._v("Task \""), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_projects&tab=task&action=task_single&pid=60#/task/94"
    }
  }, [_vm._v("task 1")]), _vm._v("\" updated by "), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_task&user_id=1",
      "title": "admin"
    }
  }, [_vm._v("admin")])]), _c('div', {
    staticClass: "date cpm-col-4 cpm-sm-col-12"
  }, [_c('time', {
    attrs: {
      "datetime": "2017-09-11T08:43:32+00:00",
      "title": "2017-09-11T08:43:32+00:00"
    }
  }, [_vm._v("September 11, 2017 8:43 am")])]), _vm._v(" "), _c('div', {
    staticClass: "clear"
  })]), _c('li', [_c('div', {
    staticClass: "cpm-col-8 cpm-sm-col-12"
  }, [_vm._v("Task \""), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_projects&tab=task&action=task_single&pid=60#/task/94"
    }
  }, [_vm._v("task 1")]), _vm._v("\" added to task list \""), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_projects&tab=task&action=single&pid=60#/list/93"
    }
  }, [_vm._v("List 1")]), _vm._v("\" by "), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_task&user_id=1",
      "title": "admin"
    }
  }, [_vm._v("admin")])]), _c('div', {
    staticClass: "date cpm-col-4 cpm-sm-col-12"
  }, [_c('time', {
    attrs: {
      "datetime": "2017-09-11T08:43:24+00:00",
      "title": "2017-09-11T08:43:24+00:00"
    }
  }, [_vm._v("September 11, 2017 8:43 am")])]), _vm._v(" "), _c('div', {
    staticClass: "clear"
  })]), _c('li', [_c('div', {
    staticClass: "cpm-col-8 cpm-sm-col-12"
  }, [_vm._v("Task list \""), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_projects&tab=task&action=single&pid=60#/list/93"
    }
  }, [_vm._v("List 1")]), _vm._v("\" created by "), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_task&user_id=1",
      "title": "admin"
    }
  }, [_vm._v("admin")])]), _c('div', {
    staticClass: "date cpm-col-4 cpm-sm-col-12"
  }, [_c('time', {
    attrs: {
      "datetime": "2017-09-11T08:43:15+00:00",
      "title": "2017-09-11T08:43:15+00:00"
    }
  }, [_vm._v("September 11, 2017 8:43 am")])]), _vm._v(" "), _c('div', {
    staticClass: "clear"
  })]), _c('li', [_c('div', {
    staticClass: "cpm-col-8 cpm-sm-col-12"
  }, [_vm._v("Task list \"laskdf\" deleted by "), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_task&user_id=1",
      "title": "admin"
    }
  }, [_vm._v("admin")])]), _c('div', {
    staticClass: "date cpm-col-4 cpm-sm-col-12"
  }, [_c('time', {
    attrs: {
      "datetime": "2017-09-11T08:42:32+00:00",
      "title": "2017-09-11T08:42:32+00:00"
    }
  }, [_vm._v("September 11, 2017 8:42 am")])]), _vm._v(" "), _c('div', {
    staticClass: "clear"
  })]), _c('li', [_c('div', {
    staticClass: "cpm-col-8 cpm-sm-col-12"
  }, [_vm._v("Task list \"skgfkd\" deleted by "), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_task&user_id=1",
      "title": "admin"
    }
  }, [_vm._v("admin")])]), _c('div', {
    staticClass: "date cpm-col-4 cpm-sm-col-12"
  }, [_c('time', {
    attrs: {
      "datetime": "2017-09-11T08:42:27+00:00",
      "title": "2017-09-11T08:42:27+00:00"
    }
  }, [_vm._v("September 11, 2017 8:42 am")])]), _vm._v(" "), _c('div', {
    staticClass: "clear"
  })]), _c('li', [_c('div', {
    staticClass: "cpm-col-8 cpm-sm-col-12"
  }, [_vm._v("Task list \"list 1\" deleted by "), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_task&user_id=1",
      "title": "admin"
    }
  }, [_vm._v("admin")])]), _c('div', {
    staticClass: "date cpm-col-4 cpm-sm-col-12"
  }, [_c('time', {
    attrs: {
      "datetime": "2017-09-11T08:42:21+00:00",
      "title": "2017-09-11T08:42:21+00:00"
    }
  }, [_vm._v("September 11, 2017 8:42 am")])]), _vm._v(" "), _c('div', {
    staticClass: "clear"
  })]), _c('li', [_c('div', {
    staticClass: "cpm-col-8 cpm-sm-col-12"
  }, [_vm._v("Task list \""), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_projects&tab=task&action=single&pid=60#/list/81"
    }
  }, [_vm._v("skgfkd")]), _vm._v("\" created by "), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_task&user_id=1",
      "title": "admin"
    }
  }, [_vm._v("admin")])]), _c('div', {
    staticClass: "date cpm-col-4 cpm-sm-col-12"
  }, [_c('time', {
    attrs: {
      "datetime": "2017-09-11T06:21:11+00:00",
      "title": "2017-09-11T06:21:11+00:00"
    }
  }, [_vm._v("September 11, 2017 6:21 am")])]), _vm._v(" "), _c('div', {
    staticClass: "clear"
  })]), _c('li', [_c('div', {
    staticClass: "cpm-col-8 cpm-sm-col-12"
  }, [_vm._v("Task list \""), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_projects&tab=task&action=single&pid=60#/list/80"
    }
  }, [_vm._v("laskdf")]), _vm._v("\" created by "), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_task&user_id=1",
      "title": "admin"
    }
  }, [_vm._v("admin")])]), _c('div', {
    staticClass: "date cpm-col-4 cpm-sm-col-12"
  }, [_c('time', {
    attrs: {
      "datetime": "2017-09-11T06:21:06+00:00",
      "title": "2017-09-11T06:21:06+00:00"
    }
  }, [_vm._v("September 11, 2017 6:21 am")])]), _vm._v(" "), _c('div', {
    staticClass: "clear"
  })]), _c('li', [_c('div', {
    staticClass: "cpm-col-8 cpm-sm-col-12"
  }, [_vm._v("Task list \""), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_projects&tab=task&action=single&pid=60#/list/79"
    }
  }, [_vm._v("list 1")]), _vm._v("\" created by "), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_task&user_id=1",
      "title": "admin"
    }
  }, [_vm._v("admin")])]), _c('div', {
    staticClass: "date cpm-col-4 cpm-sm-col-12"
  }, [_c('time', {
    attrs: {
      "datetime": "2017-09-11T06:21:00+00:00",
      "title": "2017-09-11T06:21:00+00:00"
    }
  }, [_vm._v("September 11, 2017 6:21 am")])]), _vm._v(" "), _c('div', {
    staticClass: "clear"
  })])])])]), _vm._v(" "), _c('div', {
    staticClass: "clearfix"
  })])])
}]
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-7c1aa333", esExports)
  }
}

/***/ })

});