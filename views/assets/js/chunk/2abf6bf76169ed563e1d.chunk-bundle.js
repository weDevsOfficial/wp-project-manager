wedevsPmWebpack([11],{

/***/ 26:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_eslint_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_overview_vue__ = __webpack_require__(335);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_eslint_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_overview_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_eslint_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_overview_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_f2575430_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_overview_vue__ = __webpack_require__(403);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_eslint_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_overview_vue__["default"],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_f2575430_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_overview_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/components/project-overview/overview.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-f2575430", Component.options)
  } else {
    hotAPI.reload("data-v-f2575430", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),

/***/ 335:
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: No ESLint configuration found.\n    at Config.getLocalConfigHierarchy (/Users/wedevs/Documents/wedevs/api/wp-content/plugins/pmapi/node_modules/eslint/lib/config.js:254:39)\n    at Config.getConfigHierarchy (/Users/wedevs/Documents/wedevs/api/wp-content/plugins/pmapi/node_modules/eslint/lib/config.js:180:43)\n    at Config.getConfigVector (/Users/wedevs/Documents/wedevs/api/wp-content/plugins/pmapi/node_modules/eslint/lib/config.js:285:21)\n    at Config.getConfig (/Users/wedevs/Documents/wedevs/api/wp-content/plugins/pmapi/node_modules/eslint/lib/config.js:328:29)\n    at processText (/Users/wedevs/Documents/wedevs/api/wp-content/plugins/pmapi/node_modules/eslint/lib/cli-engine.js:158:33)\n    at CLIEngine.executeOnText (/Users/wedevs/Documents/wedevs/api/wp-content/plugins/pmapi/node_modules/eslint/lib/cli-engine.js:606:17)\n    at lint (/Users/wedevs/Documents/wedevs/api/wp-content/plugins/pmapi/node_modules/eslint-loader/index.js:218:17)\n    at Object.module.exports (/Users/wedevs/Documents/wedevs/api/wp-content/plugins/pmapi/node_modules/eslint-loader/index.js:213:21)");

/***/ }),

/***/ 403:
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
      _vm._v(" "),
      _vm.loading
        ? _c("div", { staticClass: "pm-data-load-before" }, [_vm._m(0)])
        : _vm._e(),
      _vm._v(" "),
      _c("div", { staticClass: "project-overview" }, [
        _c("div", { staticClass: "pm-col-10 pm-sm-col-12" }, [
          _c("div", { staticClass: "overview-menu" }, [
            _c("ul", [
              _c(
                "li",
                { staticClass: "message" },
                [
                  _c(
                    "router-link",
                    {
                      attrs: {
                        to: {
                          name: "discussions",
                          params: {
                            project_id: _vm.project_id
                          }
                        }
                      }
                    },
                    [
                      _c("div", { staticClass: "icon" }),
                      _vm._v(" "),
                      _c("div", { staticClass: "count" }, [
                        _c("span", [
                          _vm._v(_vm._s(_vm.meta.total_discussion_boards))
                        ]),
                        _vm._v(
                          " \n                                " +
                            _vm._s(_vm.text.discussions) +
                            "\n                            "
                        )
                      ])
                    ]
                  )
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "li",
                { staticClass: "todo" },
                [
                  _c(
                    "router-link",
                    {
                      attrs: {
                        to: {
                          name: "task_lists",
                          params: {
                            project_id: _vm.project_id
                          }
                        }
                      }
                    },
                    [
                      _c("div", { staticClass: "icon" }),
                      _vm._v(" "),
                      _c("div", { staticClass: "count" }, [
                        _c("span", [_vm._v(_vm._s(_vm.meta.total_task_lists))]),
                        _vm._v(
                          " \n                                " +
                            _vm._s(_vm.text.task_lists) +
                            "\n                            "
                        )
                      ])
                    ]
                  )
                ],
                1
              ),
              _vm._v(" "),
              _c("li", { staticClass: "todos" }, [
                _c("a", { attrs: { href: "javascript:void(0)" } }, [
                  _c("div", { staticClass: "icon" }),
                  _vm._v(" "),
                  _c("div", { staticClass: "count" }, [
                    _c("span", [_vm._v(_vm._s(_vm.meta.total_tasks))]),
                    _vm._v(
                      " \n                            " +
                        _vm._s(_vm.text.tasks) +
                        "\n                        "
                    )
                  ])
                ])
              ]),
              _vm._v(" "),
              _c("li", { staticClass: "comments" }, [
                _c("a", [
                  _c("div", { staticClass: "icon" }),
                  _vm._v(" "),
                  _c("div", { staticClass: "count" }, [
                    _c("span", [_vm._v(_vm._s(_vm.meta.total_comments))]),
                    _vm._v(
                      "  \n                                " +
                        _vm._s(_vm.text.comments) +
                        "\n                            "
                    )
                  ])
                ])
              ]),
              _vm._v(" "),
              _c(
                "li",
                { staticClass: "files" },
                [
                  _c(
                    "router-link",
                    {
                      attrs: {
                        to: {
                          name: "pm_files",
                          params: {
                            project_id: _vm.project_id
                          }
                        }
                      }
                    },
                    [
                      _c("div", { staticClass: "icon" }),
                      _vm._v(" "),
                      _c("div", { staticClass: "count" }, [
                        _c("span", [_vm._v(_vm._s(_vm.meta.total_files))]),
                        _vm._v(
                          "  \n                                    " +
                            _vm._s(_vm.text.files) +
                            "\n                            "
                        )
                      ])
                    ]
                  )
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "li",
                { staticClass: "milestone" },
                [
                  _c(
                    "router-link",
                    {
                      attrs: {
                        to: {
                          name: "milestones",
                          params: {
                            project_id: _vm.project_id
                          }
                        }
                      }
                    },
                    [
                      _c("div", { staticClass: "icon" }),
                      _vm._v(" "),
                      _c("div", { staticClass: "count" }, [
                        _c("span", [_vm._v(_vm._s(_vm.meta.total_milestones))]),
                        _vm._v(
                          " \n                                    " +
                            _vm._s(_vm.text.milestones) +
                            "\n                            "
                        )
                      ])
                    ]
                  )
                ],
                1
              ),
              _vm._v(" "),
              _c("div", { staticClass: "clearfix" })
            ])
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "pm-chart", attrs: { id: "pm-chart" } }, [
            _c("h3", [_vm._v(_vm._s(_vm.text.this_month))]),
            _vm._v(" "),
            _c("canvas", {
              directives: [
                { name: "pm-overview-chart", rawName: "v-pm-overview-chart" }
              ],
              staticStyle: { width: "819px", height: "328px" },
              attrs: { width: "1638", height: "656" }
            })
          ])
        ]),
        _vm._v(" "),
        _c(
          "div",
          { staticClass: "pm-col-2 pm-sm-col-12 pm-right-part pm-last-col" },
          [
            _c("h3", { staticClass: "pm-border-bottom" }, [
              _vm._v(" " + _vm._s(_vm.text.users) + " ")
            ]),
            _vm._v(" "),
            _c(
              "ul",
              { staticClass: "user_list" },
              _vm._l(_vm.users, function(user) {
                return _c(
                  "li",
                  [
                    _c("img", {
                      staticClass: "avatar avatar-34 photo",
                      attrs: {
                        alt: "admin",
                        src: user.avatar_url,
                        height: "34",
                        width: "34"
                      }
                    }),
                    _vm._v(" "),
                    _c("a", { attrs: { href: "#" } }, [
                      _vm._v(
                        "\n                        " +
                          _vm._s(user.display_name) +
                          "\n                    "
                      )
                    ]),
                    _vm._v(" "),
                    _vm._l(user.roles.data, function(role) {
                      return _c("span", [_vm._v(_vm._s(role.title))])
                    })
                  ],
                  2
                )
              })
            )
          ]
        ),
        _vm._v(" "),
        _c("div", { staticClass: "clearfix" })
      ])
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
  }
]
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-f2575430", esExports)
  }
}

/***/ })

});