webpackJsonp([12],{

/***/ 102:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
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
    props: ['total_pages', 'current_page_number', 'component_name'],

    methods: {
        pageClass: function (page) {
            if (page == this.current_page_number) {
                return 'page-numbers current';
            }

            return 'page-numbers';
        }
    }
});

/***/ }),

/***/ 103:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_pagination_vue__ = __webpack_require__(102);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_00b52034_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_pagination_vue__ = __webpack_require__(104);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_pagination_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_00b52034_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_pagination_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "view/assets/js/components/pagination.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] pagination.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-00b52034", Component.options)
  } else {
    hotAPI.reload("data-v-00b52034", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),

/***/ 104:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return (_vm.total_pages > 1) ? _c('div', [_c('div', {
    staticClass: "cpm-pagination-wrap"
  }, [(parseInt(_vm.current_page_number) > 1) ? _c('router-link', {
    staticClass: "cpm-pagination-btn prev page-numbers",
    attrs: {
      "to": {
        name: _vm.component_name,
        params: {
          current_page_number: (_vm.current_page_number - 1)
        }
      }
    }
  }, [_vm._v("\n\t\t\t«\n\t\t")]) : _vm._e(), _vm._v(" "), _vm._l((_vm.total_pages), function(page) {
    return _c('router-link', {
      key: "page",
      class: _vm.pageClass(page) + ' cpm-pagination-btn',
      attrs: {
        "to": {
          name: _vm.component_name,
          params: {
            current_page_number: page
          }
        }
      }
    }, [_vm._v(_vm._s(page) + "\n\t\t")])
  }), _vm._v(" "), (parseInt(_vm.current_page_number) < parseInt(_vm.total_pages)) ? _c('router-link', {
    staticClass: "cpm-pagination-btn next page-numbers",
    attrs: {
      "to": {
        name: _vm.component_name,
        params: {
          current_page_number: (_vm.current_page_number + 1)
        }
      }
    }
  }, [_vm._v("\n\t\t\t»\n\t\t")]) : _vm._e()], 2), _vm._v(" "), _c('div', {
    staticClass: "cpm-clearfix"
  })]) : _vm._e()
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-00b52034", esExports)
  }
}

/***/ })

});