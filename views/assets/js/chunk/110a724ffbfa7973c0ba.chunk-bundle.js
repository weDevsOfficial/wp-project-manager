wedevsPmWebpack([13],{

/***/ 20:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_eslint_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_individual_discussions_vue__ = __webpack_require__(329);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_eslint_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_individual_discussions_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_eslint_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_individual_discussions_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_d423a9dc_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_individual_discussions_vue__ = __webpack_require__(402);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_eslint_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_individual_discussions_vue__["default"],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_d423a9dc_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_individual_discussions_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/components/project-discussions/individual-discussions.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-d423a9dc", Component.options)
  } else {
    hotAPI.reload("data-v-d423a9dc", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),

/***/ 329:
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: No ESLint configuration found.\n    at Config.getLocalConfigHierarchy (/Users/wedevs/Documents/wedevs/api/wp-content/plugins/pmapi/node_modules/eslint/lib/config.js:254:39)\n    at Config.getConfigHierarchy (/Users/wedevs/Documents/wedevs/api/wp-content/plugins/pmapi/node_modules/eslint/lib/config.js:180:43)\n    at Config.getConfigVector (/Users/wedevs/Documents/wedevs/api/wp-content/plugins/pmapi/node_modules/eslint/lib/config.js:285:21)\n    at Config.getConfig (/Users/wedevs/Documents/wedevs/api/wp-content/plugins/pmapi/node_modules/eslint/lib/config.js:328:29)\n    at processText (/Users/wedevs/Documents/wedevs/api/wp-content/plugins/pmapi/node_modules/eslint/lib/cli-engine.js:158:33)\n    at CLIEngine.executeOnText (/Users/wedevs/Documents/wedevs/api/wp-content/plugins/pmapi/node_modules/eslint/lib/cli-engine.js:606:17)\n    at lint (/Users/wedevs/Documents/wedevs/api/wp-content/plugins/pmapi/node_modules/eslint-loader/index.js:218:17)\n    at Object.module.exports (/Users/wedevs/Documents/wedevs/api/wp-content/plugins/pmapi/node_modules/eslint-loader/index.js:213:21)");

/***/ }),

/***/ 402:
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
        : _c("div", [
            _vm.discuss
              ? _c("div", { attrs: { id: "pm-signle-message" } }, [
                  _c("div", { staticClass: "pm-single" }, [
                    _c("h3", { staticClass: "pm-box-title" }, [
                      _vm._v(
                        "\n                    " +
                          _vm._s(_vm.discuss.title) +
                          "          \n                    "
                      ),
                      _c("span", { staticClass: "pm-right pm-edit-link" }, [
                        _c("a", {
                          staticClass: "pm-msg-edit dashicons dashicons-edit",
                          attrs: {
                            href: "#",
                            "data-msg_id": "97",
                            "data-project_id": "60"
                          },
                          on: {
                            click: function($event) {
                              $event.preventDefault()
                              _vm.showHideDiscussForm("toggle", _vm.discuss)
                            }
                          }
                        }),
                        _vm._v(" "),
                        _c("span", { staticClass: "pm-not-private" })
                      ]),
                      _vm._v(" "),
                      _c("div", { staticClass: "pm-small-title" }, [
                        _vm._v(
                          "\n                        " +
                            _vm._s(_vm.text.by) +
                            "\n                        "
                        ),
                        _c(
                          "a",
                          {
                            attrs: {
                              href: "#",
                              title: _vm.discuss.creator.data.display_name
                            }
                          },
                          [
                            _vm._v(
                              "\n                            " +
                                _vm._s(_vm.discuss.creator.data.display_name) +
                                "\n                        "
                            )
                          ]
                        ),
                        _vm._v(
                          " " +
                            _vm._s(_vm.text.on) +
                            " " +
                            _vm._s(_vm.discuss.created_at.date) +
                            " " +
                            _vm._s(_vm.discuss.created_at.time) +
                            "             \n                    "
                        )
                      ])
                    ]),
                    _vm._v(" "),
                    _c("div", { staticClass: "pm-entry-detail" }, [
                      _c("div", {
                        domProps: { innerHTML: _vm._s(_vm.discuss.description) }
                      }),
                      _vm._v(" "),
                      _vm.discuss.files.data.length
                        ? _c(
                            "ul",
                            { staticClass: "pm-attachments" },
                            _vm._l(_vm.discuss.files.data, function(file) {
                              return _c("li", [
                                _c(
                                  "a",
                                  {
                                    staticClass: "pm-colorbox-img",
                                    attrs: {
                                      href: file.url,
                                      title: file.name,
                                      target: "_blank"
                                    }
                                  },
                                  [
                                    _c("img", {
                                      attrs: { src: file.thumb, alt: file.name }
                                    })
                                  ]
                                )
                              ])
                            })
                          )
                        : _vm._e()
                    ]),
                    _vm._v(" "),
                    _c("span", { staticClass: "pm-msg-edit-form" }, [
                      _c(
                        "div",
                        { staticClass: "pm-message-form-wrap" },
                        [
                          _vm.discuss.edit_mode
                            ? _c("new-discuss-form", {
                                attrs: { discuss: _vm.discuss }
                              })
                            : _vm._e()
                        ],
                        1
                      )
                    ])
                  ])
                ])
              : _vm._e(),
            _vm._v(" "),
            _vm.discuss
              ? _c("div", { staticClass: "pm-comment-area pm-box-shadow" }, [
                  _c("h3", [
                    _vm._v(
                      " " +
                        _vm._s(_vm.discuss.meta.total_comments) +
                        " " +
                        _vm._s(_vm.text.comments)
                    )
                  ]),
                  _vm._v(" "),
                  _c(
                    "ul",
                    { staticClass: "pm-comment-wrap" },
                    _vm._l(_vm.comments, function(comment) {
                      return _c(
                        "li",
                        {
                          key: "comment.id",
                          staticClass: "pm-comment clearfix even",
                          attrs: { id: "pm-comment-" + comment.id }
                        },
                        [
                          _c("div", { staticClass: "pm-avatar " }, [
                            _c(
                              "a",
                              {
                                attrs: {
                                  href: _vm.userTaskProfileUrl(
                                    comment.creator.data.id
                                  ),
                                  title: comment.creator.data.display_name
                                }
                              },
                              [
                                _c("img", {
                                  staticClass: "avatar avatar-48 photo",
                                  attrs: {
                                    alt: comment.creator.data.display_name,
                                    src: comment.creator.data.avatar_url,
                                    height: "48",
                                    width: "48"
                                  }
                                })
                              ]
                            )
                          ]),
                          _vm._v(" "),
                          _c("div", { staticClass: "pm-comment-container" }, [
                            _c("div", { staticClass: "pm-comment-meta" }, [
                              _c("span", { staticClass: "pm-author" }, [
                                _c(
                                  "a",
                                  {
                                    attrs: {
                                      href: _vm.userTaskProfileUrl(
                                        comment.creator.data.id
                                      ),
                                      title: comment.creator.data.display_name
                                    }
                                  },
                                  [
                                    _vm._v(
                                      "\n                                    " +
                                        _vm._s(
                                          comment.creator.data.display_name
                                        ) +
                                        "\n                                "
                                    )
                                  ]
                                )
                              ]),
                              _vm._v(
                                "\n                            " +
                                  _vm._s(_vm.text.on) +
                                  "           \n                            "
                              ),
                              _c("span", { staticClass: "pm-date" }, [
                                _c(
                                  "time",
                                  {
                                    attrs: {
                                      datetime:
                                        comment.created_at.date +
                                        " " +
                                        comment.created_at.time,
                                      title:
                                        comment.created_at.date +
                                        " " +
                                        comment.created_at.time
                                    }
                                  },
                                  [
                                    _vm._v(
                                      _vm._s(
                                        comment.created_at.date +
                                          " " +
                                          comment.created_at.time
                                      )
                                    )
                                  ]
                                )
                              ]),
                              _vm._v(" "),
                              _c("div", { staticClass: "pm-comment-action" }, [
                                _c("span", { staticClass: "pm-edit-link" }, [
                                  _c("a", {
                                    staticClass:
                                      "pm-edit-comment-link dashicons dashicons-edit ",
                                    attrs: { href: "#" },
                                    on: {
                                      click: function($event) {
                                        $event.preventDefault()
                                        _vm.showHideDiscussCommentForm(
                                          "toggle",
                                          comment
                                        )
                                      }
                                    }
                                  })
                                ]),
                                _vm._v(" "),
                                _c("span", { staticClass: "pm-delete-link" }, [
                                  _c("a", {
                                    staticClass:
                                      "pm-delete-comment-link dashicons dashicons-trash",
                                    attrs: { href: "#" },
                                    on: {
                                      click: function($event) {
                                        $event.preventDefault()
                                        _vm.deleteSelfComment(
                                          comment.id,
                                          _vm.discuss.id
                                        )
                                      }
                                    }
                                  })
                                ])
                              ])
                            ]),
                            _vm._v(" "),
                            _c("div", { staticClass: "pm-comment-content" }, [
                              _c("div", {
                                domProps: { innerHTML: _vm._s(comment.content) }
                              }),
                              _vm._v(" "),
                              comment.files.data.length
                                ? _c(
                                    "ul",
                                    { staticClass: "pm-attachments" },
                                    _vm._l(comment.files.data, function(
                                      commnetFile
                                    ) {
                                      return _c("li", [
                                        _c(
                                          "a",
                                          {
                                            staticClass: "pm-colorbox-img",
                                            attrs: {
                                              href: commnetFile.url,
                                              title: commnetFile.name,
                                              target: "_blank"
                                            }
                                          },
                                          [
                                            _c("img", {
                                              attrs: {
                                                src: commnetFile.thumb,
                                                alt: commnetFile.name
                                              }
                                            })
                                          ]
                                        )
                                      ])
                                    })
                                  )
                                : _vm._e()
                            ]),
                            _vm._v(" "),
                            _c(
                              "div",
                              { staticClass: "pm-comment-edit-form" },
                              [
                                comment.edit_mode
                                  ? _c("comment-form", {
                                      attrs: {
                                        comment: comment,
                                        discuss: _vm.discuss
                                      }
                                    })
                                  : _vm._e()
                              ],
                              1
                            )
                          ])
                        ]
                      )
                    })
                  ),
                  _vm._v(" "),
                  _c(
                    "div",
                    { staticClass: "pm-comment-form-wrap" },
                    [
                      _c("div", { staticClass: "pm-avatar" }, [
                        _c(
                          "a",
                          {
                            attrs: {
                              href: _vm.userTaskProfileUrl(_vm.current_user.ID),
                              title: _vm.current_user.data.display_name
                            }
                          },
                          [
                            _c("img", {
                              staticClass: "avatar avatar-48 photo",
                              attrs: {
                                alt: _vm.current_user.data.display_name,
                                src: _vm.avatar_url,
                                srcset: _vm.avatar_url,
                                height: "48",
                                width: "48"
                              }
                            })
                          ]
                        )
                      ]),
                      _vm._v(" "),
                      _c("comment-form", {
                        attrs: { comment: {}, discuss: _vm.discuss }
                      })
                    ],
                    1
                  )
                ])
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
    require("vue-hot-reload-api")      .rerender("data-v-d423a9dc", esExports)
  }
}

/***/ })

});