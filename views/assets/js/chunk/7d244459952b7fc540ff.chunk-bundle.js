wedevsPmWebpack([3],{

/***/ 29:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_eslint_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_single_task_vue__ = __webpack_require__(338);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_eslint_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_single_task_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_eslint_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_single_task_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0b94f842_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_single_task_vue__ = __webpack_require__(392);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(404)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_eslint_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_single_task_vue__["default"],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0b94f842_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_single_task_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/components/project-task-lists/single-task.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0b94f842", Component.options)
  } else {
    hotAPI.reload("data-v-0b94f842", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),

/***/ 338:
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: No ESLint configuration found.\n    at Config.getLocalConfigHierarchy (/Users/wedevs/Documents/wedevs/api/wp-content/plugins/pmapi/node_modules/eslint/lib/config.js:254:39)\n    at Config.getConfigHierarchy (/Users/wedevs/Documents/wedevs/api/wp-content/plugins/pmapi/node_modules/eslint/lib/config.js:180:43)\n    at Config.getConfigVector (/Users/wedevs/Documents/wedevs/api/wp-content/plugins/pmapi/node_modules/eslint/lib/config.js:285:21)\n    at Config.getConfig (/Users/wedevs/Documents/wedevs/api/wp-content/plugins/pmapi/node_modules/eslint/lib/config.js:328:29)\n    at processText (/Users/wedevs/Documents/wedevs/api/wp-content/plugins/pmapi/node_modules/eslint/lib/cli-engine.js:158:33)\n    at CLIEngine.executeOnText (/Users/wedevs/Documents/wedevs/api/wp-content/plugins/pmapi/node_modules/eslint/lib/cli-engine.js:606:17)\n    at lint (/Users/wedevs/Documents/wedevs/api/wp-content/plugins/pmapi/node_modules/eslint-loader/index.js:218:17)\n    at Object.module.exports (/Users/wedevs/Documents/wedevs/api/wp-content/plugins/pmapi/node_modules/eslint-loader/index.js:213:21)");

/***/ }),

/***/ 386:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(14)(undefined);
// imports


// module
exports.push([module.i, "\n.pm-line-through {\n    text-decoration: line-through;\n}\n.pm-multiselect-single-task {\n    position: absolute;\n}\n", ""]);

// exports


/***/ }),

/***/ 392:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", [
    _vm.loading
      ? _c(
          "div",
          {
            staticClass: "modal-mask half-modal pm-task-modal modal-transition"
          },
          [
            _c("div", { staticClass: "modal-wrapper" }, [
              _c(
                "div",
                {
                  staticClass: "modal-container",
                  staticStyle: { width: "700px", height: "20000px" }
                },
                [
                  _c("span", { staticClass: "close-vue-modal" }, [
                    _c(
                      "a",
                      {
                        on: {
                          click: function($event) {
                            $event.preventDefault()
                            _vm.closePopup()
                          }
                        }
                      },
                      [_c("span", { staticClass: "dashicons dashicons-no" })]
                    )
                  ]),
                  _vm._v(" "),
                  _vm._m(0)
                ]
              )
            ])
          ]
        )
      : _c(
          "div",
          {
            staticClass: "modal-mask half-modal pm-task-modal modal-transition"
          },
          [
            _c("div", { staticClass: "modal-wrapper" }, [
              _c(
                "div",
                {
                  staticClass: "modal-container",
                  staticStyle: { width: "700px" }
                },
                [
                  _c("span", { staticClass: "close-vue-modal" }, [
                    _c(
                      "a",
                      {
                        on: {
                          click: function($event) {
                            $event.preventDefault()
                            _vm.closePopup()
                          }
                        }
                      },
                      [_c("span", { staticClass: "dashicons dashicons-no" })]
                    )
                  ]),
                  _vm._v(" "),
                  _c("div", { staticClass: "modal-body pm-todolist" }, [
                    _c("div", { staticClass: "pm-col-12 pm-todo" }, [
                      _c("div", { staticClass: "pm-modal-conetnt" }, [
                        _c("div", { staticClass: "cmp-task-header" }, [
                          _c("h3", { staticClass: "pm-task-title" }, [
                            _c(
                              "span",
                              { staticClass: "pm-mark-done-checkbox" },
                              [
                                _c("input", {
                                  directives: [
                                    {
                                      name: "model",
                                      rawName: "v-model",
                                      value: _vm.task.status,
                                      expression: "task.status"
                                    }
                                  ],
                                  attrs: { type: "checkbox" },
                                  domProps: {
                                    checked: Array.isArray(_vm.task.status)
                                      ? _vm._i(_vm.task.status, null) > -1
                                      : _vm.task.status
                                  },
                                  on: {
                                    click: function($event) {
                                      _vm.singleTaskDoneUndone()
                                    },
                                    change: function($event) {
                                      var $$a = _vm.task.status,
                                        $$el = $event.target,
                                        $$c = $$el.checked ? true : false
                                      if (Array.isArray($$a)) {
                                        var $$v = null,
                                          $$i = _vm._i($$a, $$v)
                                        if ($$el.checked) {
                                          $$i < 0 &&
                                            (_vm.task.status = $$a.concat([
                                              $$v
                                            ]))
                                        } else {
                                          $$i > -1 &&
                                            (_vm.task.status = $$a
                                              .slice(0, $$i)
                                              .concat($$a.slice($$i + 1)))
                                        }
                                      } else {
                                        _vm.$set(_vm.task, "status", $$c)
                                      }
                                    }
                                  }
                                })
                              ]
                            ),
                            _vm._v(" "),
                            _c(
                              "span",
                              {
                                class:
                                  _vm.singleTaskTitle(_vm.task) +
                                  " pm-task-title-wrap"
                              },
                              [
                                _c(
                                  "div",
                                  { staticClass: "pm-task-title-text" },
                                  [
                                    _vm.is_task_title_edit_mode
                                      ? _c("span", [
                                          _c("input", {
                                            directives: [
                                              {
                                                name: "model",
                                                rawName: "v-model",
                                                value: _vm.task.title,
                                                expression: "task.title"
                                              }
                                            ],
                                            staticClass:
                                              "pm-task-title-activity pm-task-title-field",
                                            attrs: { type: "text" },
                                            domProps: {
                                              value: _vm.task.title,
                                              value: _vm.task.title
                                            },
                                            on: {
                                              blur: function($event) {
                                                _vm.updateTaskElement(_vm.task)
                                              },
                                              keyup: function($event) {
                                                if (
                                                  !("button" in $event) &&
                                                  _vm._k(
                                                    $event.keyCode,
                                                    "enter",
                                                    13,
                                                    $event.key
                                                  )
                                                ) {
                                                  return null
                                                }
                                                _vm.updateTaskElement(_vm.task)
                                              },
                                              input: function($event) {
                                                if ($event.target.composing) {
                                                  return
                                                }
                                                _vm.$set(
                                                  _vm.task,
                                                  "title",
                                                  $event.target.value
                                                )
                                              }
                                            }
                                          })
                                        ])
                                      : _vm._e(),
                                    _vm._v(" "),
                                    !_vm.is_task_title_edit_mode
                                      ? _c(
                                          "span",
                                          {
                                            class:
                                              _vm.lineThrough(_vm.task) +
                                              " pm-task-title-activity pm-task-title-span",
                                            on: {
                                              click: function($event) {
                                                $event.preventDefault()
                                                _vm.isTaskTitleEditMode()
                                              }
                                            }
                                          },
                                          [
                                            _vm._v(
                                              "\n                                                " +
                                                _vm._s(_vm.task.title) +
                                                "\n                                            "
                                            )
                                          ]
                                        )
                                      : _vm._e()
                                  ]
                                ),
                                _vm._v(" "),
                                _c("div", { staticClass: "clearfix pm-clear" })
                              ]
                            ),
                            _vm._v(" "),
                            _c("div", { staticClass: "clearfix pm-clear" })
                          ]),
                          _vm._v(" "),
                          _c("div", { staticClass: "pm-task-meta" }, [
                            _c(
                              "span",
                              { staticClass: "pm-assigned-user-wrap" },
                              [
                                _vm._l(_vm.task.assignees.data, function(user) {
                                  return _vm.task.assignees.data.length
                                    ? _c(
                                        "span",
                                        {
                                          staticClass: "pm-assigned-user",
                                          on: {
                                            click: function($event) {
                                              $event.preventDefault()
                                              _vm.isEnableMultiSelect()
                                            }
                                          }
                                        },
                                        [
                                          _c(
                                            "a",
                                            {
                                              attrs: {
                                                href: "#",
                                                title: user.display_name
                                              }
                                            },
                                            [
                                              _c("img", {
                                                staticClass:
                                                  "avatar avatar-48 photo",
                                                attrs: {
                                                  alt: user.display_name,
                                                  src: user.avatar_url,
                                                  height: "48",
                                                  width: "48"
                                                }
                                              })
                                            ]
                                          )
                                        ]
                                      )
                                    : _vm._e()
                                }),
                                _vm._v(" "),
                                !_vm.task.assignees.data.length
                                  ? _c(
                                      "span",
                                      {
                                        staticClass: "pm-assigned-user",
                                        on: {
                                          click: function($event) {
                                            $event.preventDefault()
                                            _vm.isEnableMultiSelect()
                                          }
                                        }
                                      },
                                      [
                                        _c("i", {
                                          staticClass: "fa fa-user",
                                          staticStyle: { "font-size": "20px" },
                                          attrs: { "aria-hidden": "true" }
                                        })
                                      ]
                                    )
                                  : _vm._e(),
                                _vm._v(" "),
                                _vm.is_enable_multi_select
                                  ? _c(
                                      "div",
                                      {
                                        staticClass:
                                          "pm-multiselect pm-multiselect-single-task",
                                        on: {
                                          click: function($event) {
                                            $event.preventDefault()
                                            _vm.afterSelect($event)
                                          }
                                        }
                                      },
                                      [
                                        _c("multiselect", {
                                          attrs: {
                                            options: _vm.project_users,
                                            multiple: true,
                                            "close-on-select": false,
                                            "clear-on-select": true,
                                            "hide-selected": false,
                                            "show-labels": true,
                                            placeholder: "Select User",
                                            "select-label": "",
                                            "selected-label": "selected",
                                            "deselect-label": "",
                                            taggable: true,
                                            label: "display_name",
                                            "track-by": "id",
                                            "allow-empty": true
                                          },
                                          scopedSlots: _vm._u([
                                            {
                                              key: "option",
                                              fn: function(props) {
                                                return [
                                                  _c("div", [
                                                    _c("img", {
                                                      staticClass:
                                                        "option__image",
                                                      attrs: {
                                                        height: "16",
                                                        width: "16",
                                                        src:
                                                          props.option
                                                            .avatar_url,
                                                        alt: "No Man’s Sky"
                                                      }
                                                    }),
                                                    _vm._v(" "),
                                                    _c(
                                                      "div",
                                                      {
                                                        staticClass:
                                                          "option__desc"
                                                      },
                                                      [
                                                        _c(
                                                          "span",
                                                          {
                                                            staticClass:
                                                              "option__title"
                                                          },
                                                          [
                                                            _vm._v(
                                                              _vm._s(
                                                                props.option
                                                                  .display_name
                                                              )
                                                            )
                                                          ]
                                                        )
                                                      ]
                                                    )
                                                  ])
                                                ]
                                              }
                                            }
                                          ]),
                                          model: {
                                            value: _vm.task_assign,
                                            callback: function($$v) {
                                              _vm.task_assign = $$v
                                            },
                                            expression: "task_assign"
                                          }
                                        })
                                      ],
                                      1
                                    )
                                  : _vm._e()
                              ],
                              2
                            ),
                            _vm._v(" "),
                            _vm.task.start_at.date || _vm.task.due_date.date
                              ? _c(
                                  "span",
                                  {
                                    class:
                                      _vm.taskDateWrap(_vm.task.due_date.date) +
                                      " pm-task-date-wrap pm-date-window"
                                  },
                                  [
                                    _c(
                                      "span",
                                      {
                                        class: _vm.task.status
                                          ? _vm.completedTaskWrap(
                                              _vm.task.start_at.date,
                                              _vm.task.due_date.date
                                            )
                                          : _vm.taskDateWrap(
                                              _vm.task.start_at.date,
                                              _vm.task.due_date.date
                                            ),
                                        on: {
                                          click: function($event) {
                                            $event.preventDefault()
                                            _vm.isTaskDateEditMode()
                                          }
                                        }
                                      },
                                      [
                                        _vm.task_start_field
                                          ? _c("span", [
                                              _vm._v(
                                                "\n                                                    " +
                                                  _vm._s(
                                                    _vm.dateFormat(
                                                      _vm.task.start_at.date
                                                    )
                                                  ) +
                                                  "\n                                                "
                                              )
                                            ])
                                          : _vm._e(),
                                        _vm._v(" "),
                                        _vm.isBetweenDate(
                                          _vm.task_start_field,
                                          _vm.task.start_at.date,
                                          _vm.task.due_date.date
                                        )
                                          ? _c("span", [_vm._v("–")])
                                          : _vm._e(),
                                        _vm._v(" "),
                                        _vm.task.due_date
                                          ? _c("span", [
                                              _vm._v(
                                                "\n                                                    " +
                                                  _vm._s(
                                                    _vm.dateFormat(
                                                      _vm.task.due_date.date
                                                    )
                                                  ) +
                                                  "\n                                                "
                                              )
                                            ])
                                          : _vm._e()
                                      ]
                                    ),
                                    _vm._v(" "),
                                    _vm.is_task_date_edit_mode
                                      ? _c(
                                          "div",
                                          {
                                            staticClass: "pm-date-update-wrap"
                                          },
                                          [
                                            _vm.task_start_field
                                              ? _c("div", {
                                                  directives: [
                                                    {
                                                      name: "pm-datepicker",
                                                      rawName: "v-pm-datepicker"
                                                    }
                                                  ],
                                                  staticClass:
                                                    "pm-date-picker-from pm-inline-date-picker-from"
                                                })
                                              : _vm._e(),
                                            _vm._v(" "),
                                            _c("div", {
                                              directives: [
                                                {
                                                  name: "pm-datepicker",
                                                  rawName: "v-pm-datepicker"
                                                }
                                              ],
                                              staticClass:
                                                "pm-date-picker-to pm-inline-date-picker-to"
                                            }),
                                            _vm._v(" "),
                                            _c("div", {
                                              staticClass: "clearfix pm-clear"
                                            })
                                          ]
                                        )
                                      : _vm._e()
                                  ]
                                )
                              : _vm._e(),
                            _vm._v(" "),
                            !_vm.task.start_at.date && !_vm.task.due_date.date
                              ? _c(
                                  "span",
                                  {
                                    staticClass:
                                      "pm-task-date-wrap pm-date-window"
                                  },
                                  [
                                    _c(
                                      "span",
                                      {
                                        class: _vm.task.status
                                          ? _vm.completedTaskWrap(
                                              _vm.task.start_at.date,
                                              _vm.task.due_date.date
                                            )
                                          : _vm.taskDateWrap(
                                              _vm.task.start_at.date,
                                              _vm.task.due_date.date
                                            ),
                                        on: {
                                          click: function($event) {
                                            $event.preventDefault()
                                            _vm.isTaskDateEditMode()
                                          }
                                        }
                                      },
                                      [_vm._m(1)]
                                    ),
                                    _vm._v(" "),
                                    _vm.is_task_date_edit_mode
                                      ? _c(
                                          "div",
                                          {
                                            staticClass: "pm-date-update-wrap"
                                          },
                                          [
                                            _vm.task_start_field
                                              ? _c("div", {
                                                  directives: [
                                                    {
                                                      name: "pm-datepicker",
                                                      rawName: "v-pm-datepicker"
                                                    }
                                                  ],
                                                  staticClass:
                                                    "pm-date-picker-from pm-inline-date-picker-from"
                                                })
                                              : _vm._e(),
                                            _vm._v(" "),
                                            _c("div", {
                                              directives: [
                                                {
                                                  name: "pm-datepicker",
                                                  rawName: "v-pm-datepicker"
                                                }
                                              ],
                                              staticClass:
                                                "pm-date-picker-to pm-inline-date-picker-to"
                                            }),
                                            _vm._v(" "),
                                            _c("div", {
                                              staticClass: "clearfix pm-clear"
                                            })
                                          ]
                                        )
                                      : _vm._e()
                                  ]
                                )
                              : _vm._e(),
                            _vm._v(" "),
                            _c(
                              "span",
                              { staticClass: "pm-task-comment-count" },
                              [
                                _vm._v(
                                  _vm._s(_vm.task.comments.data.length) +
                                    " " +
                                    _vm._s(_vm.text.comments)
                                )
                              ]
                            )
                          ])
                        ]),
                        _vm._v(" "),
                        _c("div", { staticClass: "task-details" }, [
                          !_vm.is_task_details_edit_mode
                            ? _c(
                                "p",
                                {
                                  staticClass: "pm-des-area pm-desc-content",
                                  on: {
                                    click: function($event) {
                                      $event.preventDefault()
                                      _vm.isTaskDetailsEditMode()
                                    }
                                  }
                                },
                                [
                                  _vm.task.description !== ""
                                    ? _c("span", {
                                        domProps: {
                                          innerHTML: _vm._s(
                                            _vm.task.description
                                          )
                                        }
                                      })
                                    : _vm._e(),
                                  _vm._v(" "),
                                  !_vm.task.description
                                    ? _c(
                                        "span",
                                        {
                                          staticStyle: { "margin-left": "-3px" }
                                        },
                                        [
                                          _c("i", {
                                            staticClass: "fa fa-pencil",
                                            staticStyle: {
                                              "font-size": "16px"
                                            },
                                            attrs: { "aria-hidden": "true" }
                                          }),
                                          _vm._v(
                                            "\n                                         " +
                                              _vm._s(
                                                _vm.text.updata_description
                                              ) +
                                              "\n                                    "
                                          )
                                        ]
                                      )
                                    : _vm._e()
                                ]
                              )
                            : _vm._e(),
                          _vm._v(" "),
                          _vm.is_task_details_edit_mode
                            ? _c("textarea", {
                                directives: [
                                  {
                                    name: "prevent-line-break",
                                    rawName: "v-prevent-line-break"
                                  },
                                  {
                                    name: "model",
                                    rawName: "v-model",
                                    value: _vm.task.description,
                                    expression: "task.description"
                                  }
                                ],
                                staticClass: "pm-des-area pm-desc-field",
                                domProps: { value: _vm.task.description },
                                on: {
                                  blur: function($event) {
                                    _vm.updateDescription(_vm.task, $event)
                                  },
                                  keyup: function($event) {
                                    if (
                                      !("button" in $event) &&
                                      _vm._k(
                                        $event.keyCode,
                                        "enter",
                                        13,
                                        $event.key
                                      )
                                    ) {
                                      return null
                                    }
                                    _vm.updateDescription(_vm.task, $event)
                                  },
                                  input: function($event) {
                                    if ($event.target.composing) {
                                      return
                                    }
                                    _vm.$set(
                                      _vm.task,
                                      "description",
                                      $event.target.value
                                    )
                                  }
                                }
                              })
                            : _vm._e(),
                          _vm._v(" "),
                          _vm.is_task_details_edit_mode
                            ? _c("div", { staticClass: "pm-help-text" }, [
                                _c("span", [
                                  _vm._v(_vm._s(_vm.text.line_break))
                                ])
                              ])
                            : _vm._e(),
                          _vm._v(" "),
                          _c("div", { staticClass: "clearfix pm-clear" })
                        ]),
                        _vm._v(" "),
                        _c("div", { staticClass: "pm-todo-wrap clearfix" }, [
                          _c("div", { staticClass: "pm-task-comment" }, [
                            _c(
                              "div",
                              { staticClass: "comment-content" },
                              [
                                _c("task-comments", {
                                  attrs: { comments: _vm.task.comments.data }
                                })
                              ],
                              1
                            )
                          ])
                        ])
                      ]),
                      _vm._v(" "),
                      _c("div", { staticClass: "clearfix" })
                    ])
                  ]),
                  _vm._v(" "),
                  _c("div", { staticClass: "clearfix" })
                ]
              )
            ])
          ]
        )
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "modal-body pm-todolist" }, [
      _c("div", { staticClass: "pm-data-load-before" }, [
        _c("div", { staticClass: "loadmoreanimation" }, [
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
      ])
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("span", [
      _c("i", {
        staticClass: "fa fa-calendar",
        staticStyle: { "font-size": "20px" },
        attrs: { "aria-hidden": "true" }
      })
    ])
  }
]
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-0b94f842", esExports)
  }
}

/***/ }),

/***/ 404:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(386);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(15)("8386c9d6", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-0b94f842\",\"scoped\":false,\"hasInlineConfig\":false}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./single-task.vue", function() {
     var newContent = require("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-0b94f842\",\"scoped\":false,\"hasInlineConfig\":false}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./single-task.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ })

});