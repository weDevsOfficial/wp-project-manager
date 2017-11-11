wedevsPmWebpack([12],{

/***/ 28:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_files_vue__ = __webpack_require__(458);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_files_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_files_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_306f4e38_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_files_vue__ = __webpack_require__(556);
var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* template functional */
  var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_files_vue__["default"],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_306f4e38_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_files_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/components/project-files/files.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-306f4e38", Component.options)
  } else {
    hotAPI.reload("data-v-306f4e38", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),

/***/ 458:
/***/ (function(module, exports) {

throw new Error("Module build failed: SyntaxError: Unexpected token (110:12)\n\n\u001b[0m \u001b[90m 108 | \u001b[39m    methods\u001b[33m:\u001b[39m {\n \u001b[90m 109 | \u001b[39m        mapMutations([\n\u001b[31m\u001b[1m>\u001b[22m\u001b[39m\u001b[90m 110 | \u001b[39m            \u001b[32m'ketumi'\u001b[39m\u001b[33m,\u001b[39m\n \u001b[90m     | \u001b[39m            \u001b[31m\u001b[1m^\u001b[22m\u001b[39m\n \u001b[90m 111 | \u001b[39m        ])\u001b[33m,\u001b[39m\n \u001b[90m 112 | \u001b[39m    }\u001b[33m,\u001b[39m\n \u001b[90m 113 | \u001b[39m        \u001b[90m// attachTo (file) {\u001b[39m\u001b[0m\n");

/***/ }),

/***/ 556:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "wrap pm pm-front-end" },
    [
      _c("pm-header"),
      _vm._v("\n    " + _vm._s(_vm.test) + "\n    "),
      _c("do-action", { attrs: { hook: "after_files_header" } }),
      _vm._v(" "),
      _vm.loading
        ? _c("div", { staticClass: "pm-data-load-before" }, [_vm._m(0)])
        : _vm._e(),
      _vm._v(" "),
      !_vm.loading
        ? _c("div", { staticClass: "pm-files-page" }, [
            _c(
              "ul",
              { staticClass: "pm-files" },
              _vm._l(_vm.files, function(file) {
                return _c("li", [
                  _c("div", { staticClass: "pm-thumb" }, [
                    _c(
                      "a",
                      {
                        staticClass: "pm-colorbox-img",
                        attrs: { title: file.name, href: file.url }
                      },
                      [
                        _c("img", {
                          attrs: { src: file.thumb, alt: file.name }
                        })
                      ]
                    )
                  ]),
                  _vm._v(" "),
                  _c("div", {}, [
                    _c("h3", { staticClass: "pm-file-name" }, [
                      _vm._v(_vm._s(file.name))
                    ]),
                    _vm._v(" "),
                    _c("div", { staticClass: "pm-file-meta" }, [
                      _vm._v(
                        "\n                        Attached to \n                        "
                      ),
                      _c("a", { attrs: { href: _vm.contentURL(file) } }, [
                        _vm._v(_vm._s(_vm.attachTo(file)))
                      ]),
                      _vm._v(
                        " \n                        by \n                        "
                      ),
                      _c("a", { attrs: { href: "#/", title: "admin" } }, [
                        _vm._v(
                          "\n                            admin\n                        "
                        )
                      ])
                    ]),
                    _vm._v(" "),
                    _c("div", { staticClass: "pm-file-action" }, [
                      _c("ul", [
                        _c("li", { staticClass: "pm-go-discussion" }, [
                          _c("a", { attrs: { href: _vm.contentURL(file) } })
                        ]),
                        _vm._v(" "),
                        _c("li", { staticClass: "pm-download-file" }, [
                          _c("a", { attrs: { href: file.url } })
                        ]),
                        _vm._v(" "),
                        _vm._m(1, true)
                      ])
                    ])
                  ])
                ])
              })
            )
          ])
        : _vm._e()
    ],
    1
  )
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "loadmoreanimation" }, [
      _c("div", { staticClass: "load-spinner" }, [
        _c("div", { staticClass: "rect1" }),
        _vm._v(" "),
        _c("div", { staticClass: "rect2" }),
        _vm._v(" "),
        _c("div", { staticClass: "rect3" }),
        _vm._v(" "),
        _c("div", { staticClass: "rect4" }),
        _vm._v(" "),
        _c("div", { staticClass: "rect5" })
      ])
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("li", { staticClass: "pm-comments-count" }, [
      _c("span"),
      _vm._v(" "),
      _c("div", { staticClass: "pm-btn pm-btn-blue pm-comment-count" }, [
        _vm._v(" 1")
      ])
    ])
  }
]
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-306f4e38", esExports)
  }
}

/***/ })

});