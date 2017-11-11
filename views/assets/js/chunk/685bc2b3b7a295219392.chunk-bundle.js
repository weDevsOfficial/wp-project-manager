wedevsPmWebpack([5],{

/***/ 25:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_eslint_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_milestones_vue__ = __webpack_require__(334);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_eslint_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_milestones_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_eslint_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_milestones_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_29f694b0_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_milestones_vue__ = __webpack_require__(394);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(406)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* template functional */
  var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_eslint_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_milestones_vue__["default"],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_29f694b0_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_milestones_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/components/project-milestones/milestones.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-29f694b0", Component.options)
  } else {
    hotAPI.reload("data-v-29f694b0", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),

/***/ 334:
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: No ESLint configuration found.\n    at Config.getLocalConfigHierarchy (/Users/wedevs/Documents/wedevs/api/wp-content/plugins/pmapi/node_modules/eslint/lib/config.js:254:39)\n    at Config.getConfigHierarchy (/Users/wedevs/Documents/wedevs/api/wp-content/plugins/pmapi/node_modules/eslint/lib/config.js:180:43)\n    at Config.getConfigVector (/Users/wedevs/Documents/wedevs/api/wp-content/plugins/pmapi/node_modules/eslint/lib/config.js:285:21)\n    at Config.getConfig (/Users/wedevs/Documents/wedevs/api/wp-content/plugins/pmapi/node_modules/eslint/lib/config.js:328:29)\n    at processText (/Users/wedevs/Documents/wedevs/api/wp-content/plugins/pmapi/node_modules/eslint/lib/cli-engine.js:158:33)\n    at CLIEngine.executeOnText (/Users/wedevs/Documents/wedevs/api/wp-content/plugins/pmapi/node_modules/eslint/lib/cli-engine.js:606:17)\n    at lint (/Users/wedevs/Documents/wedevs/api/wp-content/plugins/pmapi/node_modules/eslint-loader/index.js:218:17)\n    at Object.module.exports (/Users/wedevs/Documents/wedevs/api/wp-content/plugins/pmapi/node_modules/eslint-loader/index.js:213:21)");

/***/ }),

/***/ 388:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(14)(undefined);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", ""]);

// exports


/***/ }),

/***/ 394:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { attrs: { id: "pm-milestone-page" } },
    [
      _c("pm-header"),
      _vm._v(" "),
      _vm.loading
        ? _c("div", { staticClass: "pm-data-load-before" }, [_vm._m(0)])
        : _c("div", [
            _vm.blankTemplate
              ? _c("div", { staticClass: "pm-blank-template milestone" }, [
                  _c(
                    "div",
                    { staticClass: "pm-content" },
                    [
                      _c("h3", { staticClass: "pm-page-title" }, [
                        _vm._v("  " + _vm._s(_vm.text.milestones))
                      ]),
                      _vm._v(" "),
                      _c("p", [
                        _vm._v(
                          "\n                    " +
                            _vm._s(_vm.text.milestone_define) +
                            "\n                "
                        )
                      ]),
                      _vm._v(" "),
                      _c("div", { staticClass: "pm-milestone-link clearfix" }, [
                        _c(
                          "a",
                          {
                            staticClass: "pm-btn pm-btn-blue pm-plus-white",
                            attrs: { id: "pm-add-milestone", href: "#" },
                            on: {
                              click: function($event) {
                                $event.preventDefault()
                                _vm.showHideMilestoneForm("toggle")
                              }
                            }
                          },
                          [_vm._v(_vm._s(_vm.text.add_milestone))]
                        )
                      ]),
                      _vm._v(" "),
                      _c("transition", { attrs: { name: "slide" } }, [
                        _vm.is_milestone_form_active
                          ? _c(
                              "div",
                              { staticClass: "pm-new-milestone-form" },
                              [
                                _c(
                                  "div",
                                  { staticClass: "pm-milestone-form-wrap" },
                                  [
                                    _c("new-milestone-form", {
                                      attrs: {
                                        section: "milestones",
                                        milestone: {}
                                      }
                                    })
                                  ],
                                  1
                                )
                              ]
                            )
                          : _vm._e()
                      ]),
                      _vm._v(" "),
                      _c("div", { staticClass: "pm-list-content" }, [
                        _c("h3", { staticClass: "pm-page-title pm-why-for" }, [
                          _vm._v(" " + _vm._s(_vm.text.when_use_milestone))
                        ]),
                        _vm._v(" "),
                        _c("ul", { staticClass: "pm-list" }, [
                          _c("li", [
                            _vm._v(_vm._s(_vm.text.to_set_target_date) + " ")
                          ]),
                          _vm._v(" "),
                          _c("li", [
                            _vm._v(_vm._s(_vm.text.to_divide_project) + " ")
                          ]),
                          _vm._v(" "),
                          _c("li", [
                            _vm._v(_vm._s(_vm.text.to_coordinate_project) + " ")
                          ])
                        ])
                      ])
                    ],
                    1
                  )
                ])
              : _vm._e(),
            _vm._v(" "),
            _vm.milestoneTemplate
              ? _c(
                  "div",
                  [
                    _c(
                      "div",
                      { staticClass: "pm-row pm-milestone-details" },
                      [
                        _c(
                          "div",
                          { staticClass: "pm-milestone-link clearfix" },
                          [
                            _c(
                              "a",
                              {
                                staticClass: "pm-btn pm-btn-blue pm-plus-white",
                                attrs: { id: "pm-add-milestone", href: "#" },
                                on: {
                                  click: function($event) {
                                    $event.preventDefault()
                                    _vm.showHideMilestoneForm("toggle")
                                  }
                                }
                              },
                              [_vm._v(_vm._s(_vm.text.add_milestone))]
                            )
                          ]
                        ),
                        _vm._v(" "),
                        _c("transition", { attrs: { name: "slide" } }, [
                          _vm.is_milestone_form_active
                            ? _c(
                                "div",
                                {
                                  staticClass:
                                    "pm-new-milestone-form pm-col-6 pm-sm-col-12",
                                  staticStyle: { float: "none" }
                                },
                                [
                                  _c(
                                    "div",
                                    { staticClass: "pm-milestone-form-wrap" },
                                    [
                                      _c("new-milestone-form", {
                                        attrs: {
                                          section: "milestones",
                                          milestone: {}
                                        }
                                      })
                                    ],
                                    1
                                  )
                                ]
                              )
                            : _vm._e()
                        ]),
                        _vm._v(" "),
                        _c("late-milestones"),
                        _vm._v(" "),
                        _c("upcomming-milestone"),
                        _vm._v(" "),
                        _c("completed-milestones")
                      ],
                      1
                    ),
                    _vm._v(" "),
                    _c("pm-pagination", {
                      attrs: {
                        total_pages: _vm.total_milestone_page,
                        current_page_number: _vm.current_page_number,
                        component_name: "milestone_pagination"
                      }
                    })
                  ],
                  1
                )
              : _vm._e()
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
    require("vue-hot-reload-api")      .rerender("data-v-29f694b0", esExports)
  }
}

/***/ }),

/***/ 406:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(388);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(15)("6fbe9562", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-29f694b0\",\"scoped\":false,\"hasInlineConfig\":false}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./milestones.vue", function() {
     var newContent = require("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-29f694b0\",\"scoped\":false,\"hasInlineConfig\":false}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./milestones.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ })

});