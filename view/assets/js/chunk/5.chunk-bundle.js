webpackJsonp([5],{

/***/ 114:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__header_vue__ = __webpack_require__(4);
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

/***/ 16:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_overview_vue__ = __webpack_require__(114);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_ebe1519a_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_overview_vue__ = __webpack_require__(173);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_overview_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_ebe1519a_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_overview_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "view/assets/js/components/overview/overview.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] overview.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-ebe1519a", Component.options)
  } else {
    hotAPI.reload("data-v-ebe1519a", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),

/***/ 173:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "wrap cpm cpm-front-end"
  }, [_c('pm-header'), _vm._v(" "), _vm._m(0)], 1)
}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "project-overview"
  }, [_c('div', {
    staticClass: "cpm-col-10 cpm-sm-col-12"
  }, [_c('div', {
    staticClass: "overview-menu"
  }, [_c('ul', [_c('li', {
    staticClass: "message"
  }, [_c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_projects&tab=message&action=index&pid=60"
    }
  }, [_c('div', {
    staticClass: "icon"
  }), _vm._v(" "), _c('div', {
    staticClass: "count"
  }, [_c('span', [_vm._v("0")]), _vm._v(" \n\t\t         \t\t\t\tDiscussions\n\t\t         \t\t\t")])])]), _vm._v(" "), _c('li', {
    staticClass: "todo"
  }, [_c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_projects&tab=task&action=index&pid=60"
    }
  }, [_c('div', {
    staticClass: "icon"
  }), _vm._v(" "), _c('div', {
    staticClass: "count"
  }, [_c('span', [_vm._v("1")]), _vm._v(" \n\t\t         \t\t\t\tTask List\n\t\t         \t\t\t")])])]), _vm._v(" "), _c('li', {
    staticClass: "todos"
  }, [_c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_projects&tab=task&action=index&pid=60"
    }
  }, [_c('div', {
    staticClass: "icon"
  }), _vm._v(" "), _c('div', {
    staticClass: "count"
  }, [_c('span', [_vm._v("1")]), _vm._v(" \n\t\t\t         \t\t\tTask\n\t\t\t         \t\t")])])]), _vm._v(" "), _c('li', {
    staticClass: "comments"
  }, [_c('a', [_c('div', {
    staticClass: "icon"
  }), _vm._v(" "), _c('div', {
    staticClass: "count"
  }, [_c('span', [_vm._v("0")]), _vm._v(" \n\t\t\t\t         \t\tComments\n\t\t\t\t         \t")])])]), _vm._v(" "), _c('li', {
    staticClass: "files"
  }, [_c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_projects&tab=files&action=index&pid=60"
    }
  }, [_c('div', {
    staticClass: "icon"
  }), _vm._v(" "), _c('div', {
    staticClass: "count"
  }, [_c('span', [_vm._v("0")]), _vm._v(" \n\t\t\t\t\t    \t\t\tFiles\n\t\t\t\t\t    \t")])])]), _vm._v(" "), _c('li', {
    staticClass: "milestone"
  }, [_c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_projects&tab=milestone&action=index&pid=60"
    }
  }, [_c('div', {
    staticClass: "icon"
  }), _vm._v(" "), _c('div', {
    staticClass: "count"
  }, [_c('span', [_vm._v("0")]), _vm._v(" \n\t\t\t\t\t\t\t\t\tMilestones\n\t\t\t\t\t\t\t")])])]), _vm._v(" "), _c('div', {
    staticClass: "clearfix"
  })])]), _vm._v(" "), _c('div', {
    staticClass: "cpm-chart",
    attrs: {
      "id": "cpm-chart"
    }
  }, [_c('h3', [_vm._v("Last 30 days")]), _vm._v(" "), _c('div', {
    staticClass: "inside"
  }, [_c('div', {
    staticClass: "cpm-chart-legend cpm-text-right"
  }, [_c('span', {
    staticClass: "to-do"
  }, [_vm._v("Task")]), _vm._v(" "), _c('span', {
    staticClass: "activity"
  }, [_vm._v("Activity")])]), _vm._v(" "), _c('div', {
    staticClass: "clearfix"
  }), _vm._v(" "), _c('canvas', {
    staticStyle: {
      "width": "819px",
      "height": "328px"
    },
    attrs: {
      "width": "1638",
      "height": "656"
    }
  })])])]), _vm._v(" "), _c('div', {
    staticClass: "cpm-col-2 cpm-sm-col-12 cpm-right-part cpm-last-col"
  }, [_c('h3', {
    staticClass: "cpm-border-bottom"
  }, [_vm._v(" Users ")]), _vm._v(" "), _c('ul', {
    staticClass: "user_list"
  }, [_c('li', [_c('img', {
    staticClass: "avatar avatar-34 photo",
    attrs: {
      "alt": "admin",
      "src": "//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=34&r=g&d=mm",
      "srcset": "//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=34&r=g&d=mm 2x",
      "height": "34",
      "width": "34"
    }
  }), _vm._v(" "), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_task&user_id=1",
      "title": "admin"
    }
  }, [_vm._v("admin")]), _c('span', [_vm._v("Manager")])])])]), _vm._v(" "), _c('div', {
    staticClass: "clearfix"
  })])
}]
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-ebe1519a", esExports)
  }
}

/***/ })

});