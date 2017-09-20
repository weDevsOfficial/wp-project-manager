webpackJsonp([10],{

/***/ 142:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__task_comments_vue__ = __webpack_require__(201);
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
				beforeRouteEnter(to, from, next) {
								next(vm => {
												vm.getTask(vm);
								});
				},
				data: function () {
								return {
												task: typeof this.$route.params.task == 'undefined' ? false : this.$route.params.task,
												loading: true,
												is_task_title_edit_mode: false,
												is_task_details_edit_mode: false,
												is_task_date_edit_mode: false,
												is_enable_multi_select: false,
												task_id: this.$route.params.task_id,
												task: {}
								};
				},

				computed: {
								project_users: function () {
												var self = this;
												this.$store.state.project_users.map(function (user) {
																user.title = user.name;
																user.img = user.avatar_url;
												});

												return this.$store.state.project_users;
								},
								task_users() {
												if (jQuery.isEmptyObject(this.task.data)) {
																return [];
												}
												return this.task.data.assignees.data;
								},

								comments() {
												if (jQuery.isEmptyObject(this.task.data)) {
																return [];
												}
												return this.task.data.comments.data;
								},

								task_assign: {
												get: function () {
																var self = this;
																var filtered_user = this.$store.state.project_users.filter(function (user) {
																				var has_user = self.task.assigned_to.indexOf(String(user.id));
																				if (has_user != '-1') {
																								return true;
																				}
																});

																return filtered_user;
												},

												set: function (user) {
																var task = this.task,
																    assign = [];

																user.map(function (set_user, key) {
																				assign.push(String(set_user.id));
																});

																task.assigned_to = assign;

																this.updateTaskElement(task);
												}
								}
				},

				components: {
								'task-comments': __WEBPACK_IMPORTED_MODULE_0__task_comments_vue__["a" /* default */]
				},

				created: function () {
								window.addEventListener('click', this.windowActivity);

								this.$root.$on('cpm_date_picker', this.fromDate);
				},

				methods: {
								getTask: function (self) {
												var request = {
																url: self.base_url + '/cpm/v2/projects/' + self.project_id + '/tasks/' + self.task_id + '?with=boards,comments',
																success(res) {
																				self.task = res.data;
																}
												};

												self.httpRequest(request);
								},

								afterSelect: function (selectedOption, id, event) {
												//jQuery('.cpm-multiselect').find('.multiselect__tags').find('.multiselect__tag').remove(); 
								},
								isEnableMultiSelect: function () {
												this.is_enable_multi_select = true;

												Vue.nextTick(function () {
																jQuery('.multiselect__input').focus();
												});
								},

								fromDate: function (date) {
												if (date.field == 'datepicker_from') {
																var task = this.task;

																task.start_date = date.date;
																this.updateTaskElement(task);
												}

												if (date.field == 'datepicker_to') {
																var task = this.task;

																var start = new Date(task.start_date),
																    due = new Date(date.date);

																if (!this.$store.state.permissions.task_start_field) {
																				task.due_date = date.date;
																				this.updateTaskElement(task);
																} else if (start <= due) {
																				task.due_date = date.date;
																				this.updateTaskElement(task);
																}
												}
								},
								updateTaskPrivacy: function (task, status) {
												task.task_privacy = status;
												this.updateTaskElement(task);
								},
								isTaskDetailsEditMode: function () {
												this.is_task_details_edit_mode = true;

												Vue.nextTick(function () {
																jQuery('.cpm-desc-field').focus();
												});
								},

								updateDescription: function (task, event) {
												if (event.keyCode == 13 && event.shiftKey) {
																return;
												}

												is_task_details_edit_mode = false, this.updateTaskElement(task);
								},

								closePopup: function () {
												this.$store.commit('close_single_task_popup');

												if (this.$route.name == 'list_task_single_under_todo') {
																var list_id = this.task.post_parent,
																    push_url = '/list/' + list_id;
																this.$router.push(push_url);
												} else {
																this.$router.push('/');
												}
								},

								singleTaskTitle: function (task) {
												return task.completed ? 'cpm-task-complete' : 'cpm-task-incomplete';
								},

								updateTaskElement: function (task) {

												var request_data = {
																task_id: task.ID,
																list_id: task.post_parent,
																project_id: PM_Vars.project_id,
																task_assign: task.assigned_to,
																task_title: task.post_title,
																task_text: task.description,
																task_start: task.start_date,
																task_due: task.due_date,
																task_privacy: task.task_privacy,
																single: true,
																_wpnonce: PM_Vars.nonce
												},
												    self = this;

												wp.ajax.send('cpm_task_update', {
																data: request_data,
																success: function (res) {
																				var list_index = self.getIndex(self.$store.state.lists, task.post_parent, 'ID'),
																				    task_index = self.getIndex(self.$store.state.lists[0].tasks, task.ID, 'ID');

																				self.$store.commit('afterUpdateTaskElement', {
																								list_index: list_index,
																								task_index: task_index,
																								task: task
																				});
																				self.is_task_title_edit_mode = false;
																				self.is_task_details_edit_mode = false;
																				self.is_enable_multi_select = false;
																}
												});
								},

								isTaskTitleEditMode: function () {
												this.is_task_title_edit_mode = true;
								},

								isTaskDateEditMode: function () {
												this.is_task_date_edit_mode = true;
								},

								windowActivity: function (el) {
												var title_blur = jQuery(el.target).hasClass('cpm-task-title-activity'),
												    dscription_blur = jQuery(el.target).hasClass('cpm-des-area'),
												    assign_user = jQuery(el.target).closest('.cpm-assigned-user-wrap');

												if (!title_blur) {
																this.is_task_title_edit_mode = false;
												}

												if (!dscription_blur) {
																this.is_task_details_edit_mode = false;
												}

												if (!assign_user.length) {
																this.is_enable_multi_select = false;
												}

												this.datePickerDispaly(el);
								},

								datePickerDispaly: function (el) {
												var date_picker_blur = jQuery(el.target).closest('.cpm-task-date-wrap').hasClass('cpm-date-window');

												if (!date_picker_blur) {
																this.is_task_date_edit_mode = false;
												}
								}
				}
});

/***/ }),

/***/ 171:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [(_vm.loading) ? _c('div', {
    staticClass: "modal-mask half-modal cpm-task-modal modal-transition"
  }, [_c('div', {
    staticClass: "modal-wrapper"
  }, [_c('div', {
    staticClass: "modal-container",
    staticStyle: {
      "width": "700px",
      "height": "20000px"
    }
  }, [_c('span', {
    staticClass: "close-vue-modal"
  }, [_c('a', {
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.closePopup()
      }
    }
  }, [_c('span', {
    staticClass: "dashicons dashicons-no"
  })])]), _vm._v(" "), _vm._m(0)])])]) : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "modal-mask half-modal cpm-task-modal modal-transition"
  }, [_c('div', {
    staticClass: "modal-wrapper"
  }, [_c('div', {
    staticClass: "modal-container",
    staticStyle: {
      "width": "700px"
    }
  }, [_c('span', {
    staticClass: "close-vue-modal"
  }, [_c('a', {
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.closePopup()
      }
    }
  }, [_c('span', {
    staticClass: "dashicons dashicons-no"
  })])]), _vm._v(" "), _c('div', {
    staticClass: "modal-body cpm-todolist"
  }, [_c('div', {
    staticClass: "cpm-col-12 cpm-todo"
  }, [_c('div', {
    staticClass: "cpm-modal-conetnt"
  }, [_c('div', {
    staticClass: "cmp-task-header"
  }, [_c('h3', {
    staticClass: "cpm-task-title"
  }, [_c('span', {
    staticClass: "cpm-mark-done-checkbox"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.task.completed),
      expression: "task.completed"
    }],
    attrs: {
      "type": "checkbox"
    },
    domProps: {
      "checked": Array.isArray(_vm.task.completed) ? _vm._i(_vm.task.completed, null) > -1 : (_vm.task.completed)
    },
    on: {
      "click": function($event) {
        _vm.taskDoneUndone(_vm.task, _vm.task.completed)
      },
      "__c": function($event) {
        var $$a = _vm.task.completed,
          $$el = $event.target,
          $$c = $$el.checked ? (true) : (false);
        if (Array.isArray($$a)) {
          var $$v = null,
            $$i = _vm._i($$a, $$v);
          if ($$el.checked) {
            $$i < 0 && (_vm.task.completed = $$a.concat($$v))
          } else {
            $$i > -1 && (_vm.task.completed = $$a.slice(0, $$i).concat($$a.slice($$i + 1)))
          }
        } else {
          _vm.task.completed = $$c
        }
      }
    }
  })]), _vm._v(" "), _c('span', {
    class: _vm.singleTaskTitle(_vm.task) + ' cpm-task-title-wrap'
  }, [_c('div', {
    staticClass: "cpm-task-title-text"
  }, [(_vm.is_task_title_edit_mode) ? _c('span', [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.task.post_title),
      expression: "task.post_title"
    }],
    staticClass: "cpm-task-title-activity cpm-task-title-field",
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": _vm.task.post_title,
      "value": (_vm.task.post_title)
    },
    on: {
      "blur": function($event) {
        _vm.updateTaskElement(_vm.task)
      },
      "keyup": function($event) {
        if (!('button' in $event) && _vm._k($event.keyCode, "enter", 13)) { return null; }
        _vm.updateTaskElement(_vm.task)
      },
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.task.post_title = $event.target.value
      }
    }
  })]) : _vm._e(), _vm._v(" "), (!_vm.is_task_title_edit_mode) ? _c('span', {
    staticClass: "cpm-task-title-activity cpm-task-title-span",
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.isTaskTitleEditMode()
      }
    }
  }, [_vm._v("\n                                                \t" + _vm._s(_vm.task.title) + "\n                                                ")]) : _vm._e()]), _vm._v(" "), _c('div', {
    staticClass: "clearfix cpm-clear"
  })]), _vm._v(" "), _c('div', {
    staticClass: "clearfix cpm-clear"
  })]), _vm._v(" "), _c('div', {
    staticClass: "cpm-task-meta"
  }, [_c('span', {
    staticClass: "cpm-assigned-user-wrap"
  }, [_vm._l((_vm.task_users), function(user) {
    return (_vm.task_users) ? _c('span', {
      staticClass: "cpm-assigned-user",
      domProps: {
        "innerHTML": _vm._s(user.user_url)
      },
      on: {
        "click": function($event) {
          $event.preventDefault();
          _vm.isEnableMultiSelect()
        }
      }
    }) : _vm._e()
  }), _vm._v(" "), (!_vm.task_users.length) ? _c('span', {
    staticClass: "cpm-assigned-user",
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.isEnableMultiSelect()
      }
    }
  }, [_c('i', {
    staticClass: "fa fa-user",
    staticStyle: {
      "font-size": "20px"
    },
    attrs: {
      "aria-hidden": "true"
    }
  })]) : _vm._e(), _vm._v(" "), (_vm.task_users.length && _vm.is_enable_multi_select) ? _c('div', {
    staticClass: "cpm-multiselect cpm-multiselect-single-task",
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.afterSelect($event)
      }
    }
  }, [_c('multiselect', {
    attrs: {
      "options": _vm.project_users,
      "multiple": true,
      "close-on-select": false,
      "clear-on-select": true,
      "hide-selected": false,
      "show-labels": true,
      "placeholder": "<?php _e( 'Select User', 'cpm' ); ?>",
      "select-label": "",
      "selected-label": "selected",
      "deselect-label": "",
      "taggable": true,
      "label": "name",
      "track-by": "id",
      "allow-empty": true
    },
    scopedSlots: _vm._u([{
      key: "option",
      fn: function(props) {
        return [_c('div', [_c('img', {
          staticClass: "option__image",
          attrs: {
            "height": "16",
            "width": "16",
            "src": props.option.img,
            "alt": "<?php _e( 'No Man’s Sky', 'cpm' ); ?>"
          }
        }), _vm._v(" "), _c('div', {
          staticClass: "option__desc"
        }, [_c('span', {
          staticClass: "option__title"
        }, [_vm._v(_vm._s(props.option.title))])])])]
      }
    }]),
    model: {
      value: (_vm.task_assign),
      callback: function($$v) {
        _vm.task_assign = $$v
      },
      expression: "task_assign"
    }
  })], 1) : _vm._e()], 2), _vm._v(" "), ((_vm.task.start_date != '' || _vm.task.due_date != '')) ? _c('span', {
    staticClass: "cpm-task-date-wrap cpm-date-window"
  }, [_c('span', {
    class: _vm.task.completed ? _vm.completedTaskWrap(_vm.task.start_date, _vm.task.due_date) : _vm.taskDateWrap(_vm.task.start_date, _vm.task.due_date),
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.isTaskDateEditMode()
      }
    }
  }, [(_vm.task_start_field) ? _c('span', [_vm._v("\n\t                                                    " + _vm._s(_vm.dateFormat(_vm.task.start_date)) + "\n\t                                                ")]) : _vm._e(), _vm._v(" "), (_vm.isBetweenDate(_vm.task_start_field, _vm.task.start_date, _vm.task.due_date)) ? _c('span', [_vm._v("–")]) : _vm._e(), _vm._v(" "), _c('span', [_vm._v("\n\t                                                    " + _vm._s(_vm.dateFormat(_vm.task.due_date)) + "\n\t                                                ")])]), _vm._v(" "), (_vm.is_task_date_edit_mode) ? _c('div', {
    staticClass: "cpm-date-update-wrap"
  }, [(_vm.task_start_field) ? _c('div', {
    directives: [{
      name: "cpm-datepicker",
      rawName: "v-cpm-datepicker"
    }],
    staticClass: "cpm-date-picker-from cpm-inline-date-picker-from"
  }) : _vm._e(), _vm._v(" "), _c('div', {
    directives: [{
      name: "cpm-datepicker",
      rawName: "v-cpm-datepicker"
    }],
    staticClass: "cpm-date-picker-to cpm-inline-date-picker-to"
  }), _vm._v(" "), _c('div', {
    staticClass: "clearfix cpm-clear"
  })]) : _vm._e()]) : _vm._e(), _vm._v(" "), ((_vm.task.start_date == '' && _vm.task.due_date == '')) ? _c('span', {
    staticClass: "cpm-task-date-wrap cpm-date-window"
  }, [_c('span', {
    class: _vm.task.completed ? _vm.completedTaskWrap(_vm.task.start_date, _vm.task.due_date) : _vm.taskDateWrap(_vm.task.start_date, _vm.task.due_date),
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.isTaskDateEditMode()
      }
    }
  }, [_vm._m(1)]), _vm._v(" "), (_vm.is_task_date_edit_mode) ? _c('div', {
    staticClass: "cpm-date-update-wrap"
  }, [(_vm.task_start_field) ? _c('div', {
    directives: [{
      name: "cpm-datepicker",
      rawName: "v-cpm-datepicker"
    }],
    staticClass: "cpm-date-picker-from cpm-inline-date-picker-from"
  }) : _vm._e(), _vm._v(" "), _c('div', {
    directives: [{
      name: "cpm-datepicker",
      rawName: "v-cpm-datepicker"
    }],
    staticClass: "cpm-date-picker-to cpm-inline-date-picker-to"
  }), _vm._v(" "), _c('div', {
    staticClass: "clearfix cpm-clear"
  })]) : _vm._e()]) : _vm._e(), _vm._v(" "), _c('span', {
    staticClass: "cpm-task-comment-count"
  }, [_vm._v(_vm._s(_vm.comments.length) + " Comments")])])]), _vm._v(" "), _c('div', {
    staticClass: "task-details"
  }, [(!_vm.is_task_details_edit_mode) ? _c('p', {
    staticClass: "cpm-des-area cpm-desc-content",
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.isTaskDetailsEditMode()
      }
    }
  }, [(!_vm.task.description == '') ? _c('span', {
    domProps: {
      "innerHTML": _vm._s(_vm.task.description)
    }
  }) : _vm._e(), _vm._v(" "), (_vm.task.description == '') ? _c('span', {
    staticStyle: {
      "margin-left": "-3px"
    }
  }, [_c('i', {
    staticClass: "fa fa-pencil",
    staticStyle: {
      "font-size": "16px"
    },
    attrs: {
      "aria-hidden": "true"
    }
  }), _vm._v("\n                                        \t Update Description\n                                        ")]) : _vm._e()]) : _vm._e(), _vm._v(" "), (_vm.is_task_details_edit_mode) ? _c('textarea', {
    directives: [{
      name: "prevent-line-break",
      rawName: "v-prevent-line-break"
    }, {
      name: "model",
      rawName: "v-model",
      value: (_vm.task.description),
      expression: "task.description"
    }],
    staticClass: "cpm-des-area cpm-desc-field",
    domProps: {
      "value": (_vm.task.description)
    },
    on: {
      "blur": function($event) {
        _vm.updateDescription(_vm.task, $event)
      },
      "keyup": function($event) {
        if (!('button' in $event) && _vm._k($event.keyCode, "enter", 13)) { return null; }
        _vm.updateDescription(_vm.task, $event)
      },
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.task.description = $event.target.value
      }
    }
  }) : _vm._e(), _vm._v(" "), (_vm.is_task_details_edit_mode) ? _c('div', {
    staticClass: "cpm-help-text"
  }, [_c('span')]) : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "clearfix cpm-clear"
  })]), _vm._v(" "), _c('div', {
    staticClass: "cpm-todo-wrap clearfix"
  }, [_c('div', {
    staticClass: "cpm-task-comment"
  }, [_c('div', {
    staticClass: "comment-content"
  }, [_c('task-comments', {
    attrs: {
      "comments": _vm.comments,
      "task": _vm.task
    }
  })], 1)])])]), _vm._v(" "), _c('div', {
    staticClass: "clearfix"
  })])]), _vm._v(" "), _c('div', {
    staticClass: "clearfix"
  })])])])])
}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "modal-body cpm-todolist"
  }, [_c('div', {
    staticClass: "cpm-data-load-before"
  }, [_c('div', {
    staticClass: "loadmoreanimation"
  }, [_c('div', {
    staticClass: "load-spinner"
  }, [_c('div', {
    staticClass: "rect1"
  }), _vm._v(" "), _c('div', {
    staticClass: "rect2"
  }), _vm._v(" "), _c('div', {
    staticClass: "rect3"
  }), _vm._v(" "), _c('div', {
    staticClass: "rect4"
  }), _vm._v(" "), _c('div', {
    staticClass: "rect5"
  })])])])])
},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('span', [_c('i', {
    staticClass: "fa fa-calendar",
    staticStyle: {
      "font-size": "20px"
    },
    attrs: {
      "aria-hidden": "true"
    }
  })])
}]
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-0ea2cd18", esExports)
  }
}

/***/ }),

/***/ 18:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_single_task_vue__ = __webpack_require__(142);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0ea2cd18_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_single_task_vue__ = __webpack_require__(171);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_single_task_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0ea2cd18_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_single_task_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "view/assets/js/components/task-lists/single-task.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] single-task.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0ea2cd18", Component.options)
  } else {
    hotAPI.reload("data-v-0ea2cd18", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),

/***/ 200:
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
    // Get passing data for this component.
    props: ['comments'],

    data: function () {
        return {
            currnet_user_id: 1
        };
    },

    computed: {
        /**
         * Get current user avatar
         */
        getCurrentUserAvatar: function () {
            return '';
        }
    },

    methods: {
        current_user_can_edit_delete: function (comment, task) {
            if (comment.comment_type == 'cpm_activity') {
                return false;
            }

            if (task.can_del_edit) {
                return true;
            }

            if (comment.user_id == this.currnet_user_id && comment.comment_type == '') {
                return true;
            }

            return false;
        }

    }
});

/***/ }),

/***/ 201:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_task_comments_vue__ = __webpack_require__(200);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_625bbd46_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_task_comments_vue__ = __webpack_require__(202);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_task_comments_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_625bbd46_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_task_comments_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "view/assets/js/components/task-lists/task-comments.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] task-comments.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-625bbd46", Component.options)
  } else {
    hotAPI.reload("data-v-625bbd46", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 202:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "cpm-task-comment-wrap"
  }, [_c('h3', {
    staticClass: "cpm-comment-title"
  }, [_vm._v("<?php _e( 'Discuss this task', 'cpm' ); ?>")]), _vm._v(" "), _c('ul', {
    staticClass: "cpm-comment-wrap"
  }, _vm._l((_vm.comments), function(comment) {
    return _c('li', {
      key: comment.id,
      class: 'cpm-comment clearfix even cpm-fade-out-' + comment.id
    }, [_c('div', {
      staticClass: "cpm-avatar",
      domProps: {
        "innerHTML": _vm._s(comment.avatar)
      }
    }), _vm._v(" "), _c('div', {
      staticClass: "cpm-comment-container"
    }, [_c('div', {
      staticClass: "cpm-comment-meta"
    }, [_c('span', {
      staticClass: "cpm-author",
      domProps: {
        "innerHTML": _vm._s(comment.comment_user)
      }
    }), _vm._v(" "), _c('span', [_vm._v("<?php _e( 'On', 'cpm' ); ?>")]), _vm._v(" "), _c('span', {
      staticClass: "cpm-date"
    }, [_c('time', {
      attrs: {
        "datetime": _vm.dateISO8601Format(comment.comment_date),
        "title": _vm.dateISO8601Format(comment.comment_date)
      }
    }, [_vm._v(_vm._s(_vm.dateTimeFormat(comment.comment_date)))])]), _vm._v(" "), (_vm.current_user_can_edit_delete(comment, _vm.task)) ? _c('div', {
      staticClass: "cpm-comment-action"
    }, [_c('span', {
      staticClass: "cpm-edit-link"
    }, [_c('a', {
      staticClass: "dashicons dashicons-edit",
      attrs: {
        "href": "#"
      },
      on: {
        "click": function($event) {
          $event.preventDefault();
          _vm.showHideTaskCommentEditForm(_vm.task, comment.id)
        }
      }
    })]), _vm._v(" "), _c('span', {
      staticClass: "cpm-delete-link"
    }, [_c('a', {
      staticClass: "dashicons dashicons-trash",
      attrs: {
        "href": "#",
        "data-project_id": "111",
        "data-id": "82",
        "data-confirm": "Are you sure to delete this comment?"
      },
      on: {
        "click": function($event) {
          $event.preventDefault();
          _vm.deleteTaskComment(comment.id, _vm.task)
        }
      }
    })])]) : _vm._e()]), _vm._v(" "), _c('div', {
      staticClass: "cpm-comment-content"
    }, [_c('div', {
      domProps: {
        "innerHTML": _vm._s(comment.comment_content)
      }
    }), _vm._v(" "), _c('ul', {
      staticClass: "cpm-attachments"
    }, _vm._l((comment.files), function(file) {
      return _c('li', [_c('a', {
        staticClass: "cpm-colorbox-img",
        attrs: {
          "href": file.url,
          "title": "file.name",
          "target": "_blank"
        }
      }, [_c('img', {
        attrs: {
          "src": file.thumb
        }
      })])])
    }))]), _vm._v(" "), (comment.edit_mode) ? _c('div', {
      staticClass: "cpm-comment-edit-form"
    }, [_c('div', {
      class: 'cpm-slide-' + comment.id,
      staticStyle: {
        "display": "none"
      }
    }, [_c('cpm-task-comment-form', {
      attrs: {
        "comment": comment,
        "task": _vm.task
      }
    })], 1)]) : _vm._e()])])
  })), _vm._v(" "), _c('div', {
    staticClass: "single-todo-comments"
  }, [_c('div', {
    staticClass: "cpm-comment-form-wrap"
  }, [_c('div', {
    staticClass: "cpm-avatar"
  }, [_c('img', {
    attrs: {
      "src": _vm.getCurrentUserAvatar,
      "height": "48",
      "width": "48"
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "cpm-new-doc-comment-form"
  }, [_c('task-comment-form', {
    attrs: {
      "comment": {},
      "task": _vm.task
    }
  })], 1)])])])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-625bbd46", esExports)
  }
}

/***/ })

});