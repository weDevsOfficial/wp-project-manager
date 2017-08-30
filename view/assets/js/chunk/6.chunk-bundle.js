webpackJsonp([6],{

/***/ 67:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _vm._m(0)
}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('ul', {
    staticClass: "list-inline  cpm-col-8 cpm-project-group-ul"
  }, [_c('li', {
    staticClass: "cpm-sm-col-4"
  }, [_c('a', {
    staticClass: "cpm-all-project",
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_projects&status=all"
    }
  }, [_vm._v("All")])]), _vm._v(" "), _c('li', {
    staticClass: "cpm-sm-col-4 active"
  }, [_c('a', {
    staticClass: "cpm-active-project ",
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_projects&status=active"
    }
  }, [_vm._v("Active "), _c('span', {
    staticClass: "count"
  }, [_vm._v("10")])])]), _vm._v(" "), _c('li', {
    staticClass: "cpm-sm-col-4"
  }, [_c('a', {
    staticClass: "cpm-archive-project ",
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_projects&status=archive"
    }
  }, [_vm._v("Completed "), _c('span', {
    staticClass: "count"
  }, [_vm._v("0")])])]), _vm._v(" "), _c('div', {
    staticClass: "clearfix"
  })])
}]
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-e550a0be", esExports)
  }
}

/***/ }),

/***/ 9:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_template_compiler_index_id_data_v_e550a0be_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_project_header_menu_vue__ = __webpack_require__(67);
var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */
var __vue_script__ = null
/* template */

/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_template_compiler_index_id_data_v_e550a0be_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_project_header_menu_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "view/assets/js/components/project-lists/project-header-menu.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] project-header-menu.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-e550a0be", Component.options)
  } else {
    hotAPI.reload("data-v-e550a0be", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ })

});