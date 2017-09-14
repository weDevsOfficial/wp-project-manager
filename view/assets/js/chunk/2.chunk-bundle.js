webpackJsonp([2],{

/***/ 121:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_new_task_list_btn_vue__ = __webpack_require__(96);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_17a13792_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_new_task_list_btn_vue__ = __webpack_require__(127);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_new_task_list_btn_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_17a13792_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_new_task_list_btn_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "view/assets/js/components/task-lists/new-task-list-btn.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] new-task-list-btn.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-17a13792", Component.options)
  } else {
    hotAPI.reload("data-v-17a13792", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 122:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_new_task_list_form_vue__ = __webpack_require__(97);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7db5bc7e_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_new_task_list_form_vue__ = __webpack_require__(141);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_new_task_list_form_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7db5bc7e_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_new_task_list_form_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "view/assets/js/components/task-lists/new-task-list-form.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] new-task-list-form.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7db5bc7e", Component.options)
  } else {
    hotAPI.reload("data-v-7db5bc7e", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 127:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [(_vm.permissions.create_todolist) ? _c('a', {
    staticClass: "cpm-btn cpm-btn-blue cpm-margin-bottom add-tasklist cpm-btn-uppercase",
    attrs: {
      "href": "#"
    },
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.showHideTodoListForm(_vm.list, _vm.index)
      }
    }
  }, [(!_vm.show_list_form) ? _c('i', {
    staticClass: "fa fa-plus-circle",
    attrs: {
      "aria-hidden": "true"
    }
  }) : _vm._e(), _vm._v(" "), (_vm.show_list_form) ? _c('i', {
    staticClass: "fa fa-minus-circle",
    attrs: {
      "aria-hidden": "true"
    }
  }) : _vm._e(), _vm._v("\n\t    " + _vm._s(_vm.text.new_todo) + "\n\t")]) : _vm._e()])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-17a13792", esExports)
  }
}

/***/ }),

/***/ 141:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    class: _vm.todolistFormClass(_vm.list) + ' cpm-new-todolist-form',
    staticStyle: {
      "display": "none"
    }
  }, [_c('form', {
    attrs: {
      "action": "",
      "method": "post"
    },
    on: {
      "submit": function($event) {
        $event.preventDefault();
        _vm.newTodoList()
      }
    }
  }, [_c('div', {
    staticClass: "item title"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.list.post_title),
      expression: "list.post_title"
    }],
    attrs: {
      "type": "text",
      "required": "required",
      "name": "tasklist_name",
      "placeholder": "Task list name"
    },
    domProps: {
      "value": (_vm.list.post_title)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.list.post_title = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "item content"
  }, [_c('textarea', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.list.post_content),
      expression: "list.post_content"
    }],
    attrs: {
      "name": "tasklist_detail",
      "id": "",
      "cols": "40",
      "rows": "2",
      "placeholder": "Task list details"
    },
    domProps: {
      "value": (_vm.list.post_content)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.list.post_content = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "item milestone"
  }, [_c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.tasklist_milestone),
      expression: "tasklist_milestone"
    }],
    on: {
      "change": function($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
          return o.selected
        }).map(function(o) {
          var val = "_value" in o ? o._value : o.value;
          return val
        });
        _vm.tasklist_milestone = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
      }
    }
  }, [_c('option', {
    attrs: {
      "value": "-1"
    }
  }, [_vm._v("\n                    - Milestone -\n                ")]), _vm._v(" "), _vm._l((_vm.milestones), function(milestone) {
    return _c('option', {
      domProps: {
        "value": milestone.ID
      }
    }, [_vm._v("\n                    " + _vm._s(milestone.post_title) + "\n                ")])
  })], 2)]), _vm._v("\n\n        <?php do_action( 'cpm_tasklist_form' ); ?>\n        \n        "), _c('div', {
    staticClass: "item submit"
  }, [_c('span', {
    staticClass: "cpm-new-list-spinner"
  }), _vm._v(" "), _c('input', {
    staticClass: "button-primary",
    attrs: {
      "type": "submit",
      "disabled": _vm.submit_disabled,
      "name": "submit_todo"
    },
    domProps: {
      "value": _vm.submit_btn_text
    }
  }), _vm._v(" "), _c('a', {
    staticClass: "button list-cancel",
    attrs: {
      "href": "#"
    },
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.showHideTodoListForm(_vm.list, _vm.index)
      }
    }
  }, [_vm._v("Cancel")]), _vm._v(" "), _c('span', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.show_spinner),
      expression: "show_spinner"
    }],
    staticClass: "cpm-spinner"
  })])])])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-7db5bc7e", esExports)
  }
}

/***/ }),

/***/ 145:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "cpm-task-container wrap",
    attrs: {
      "id": "cpm-task-el"
    }
  }, [_c('new-task-list-btn'), _vm._v(" "), _c('new-task-list-form', {
    attrs: {
      "list": {},
      "index": 0
    }
  }), _vm._v(" "), _c('ul', {
    staticClass: "cpm-todolists"
  }, _vm._l((_vm.lists), function(list) {
    return _c('li', {
      key: list.ID,
      class: 'cpm-fade-out-' + list.ID
    }, [_c('article', {
      staticClass: "cpm-todolist"
    }, [_c('header', {
      staticClass: "cpm-list-header"
    }, [_c('h3', [_c('router-link', {
      attrs: {
        "to": {
          name: 'single_list',
          params: {
            list_id: list.ID
          }
        }
      }
    }, [_vm._v(_vm._s(list.post_title))]), _vm._v(" "), _c('span', {
      class: _vm.privateClass(list)
    }), _vm._v(" "), (list.can_del_edit) ? _c('div', {
      staticClass: "cpm-right"
    }, [_c('a', {
      attrs: {
        "href": "#",
        "title": "Edit this List"
      },
      on: {
        "click": function($event) {
          $event.preventDefault();
          _vm.showHideTodoListForm(list, _vm.index)
        }
      }
    }, [_c('span', {
      staticClass: "dashicons dashicons-edit"
    })]), _vm._v(" "), _c('a', {
      staticClass: "cpm-btn cpm-btn-xs",
      attrs: {
        "href": "#",
        "title": "Delete this List",
        "data-list_id": list.ID,
        "data-confirm": "Are you sure to delete this task list?"
      },
      on: {
        "click": function($event) {
          $event.preventDefault();
          _vm.deleteList(list.ID)
        }
      }
    }, [_c('span', {
      staticClass: "dashicons dashicons-trash"
    })])]) : _vm._e()], 1), _vm._v(" "), _c('div', {
      staticClass: "cpm-entry-detail"
    }, [_vm._v("\n\t                        " + _vm._s(list.post_content) + "    \n\t                    ")]), _vm._v(" "), (list.edit_mode) ? _c('div', {
      staticClass: "cpm-update-todolist-form"
    }) : _vm._e()]), _vm._v(" "), _c('tasks', {
      attrs: {
        "list": list,
        "index": _vm.index
      }
    }), _vm._v(" "), _c('footer', {
      staticClass: "cpm-row cpm-list-footer"
    }, [_c('div', {
      staticClass: "cpm-col-6"
    }, [(_vm.canUserCreateTask) ? _c('div', [_c('new-task-button', {
      attrs: {
        "task": {},
        "list": list,
        "list_index": _vm.index
      }
    })], 1) : _vm._e(), _vm._v(" "), _c('div', {
      staticClass: "cpm-col-3 cpm-todo-complete"
    }, [_c('router-link', {
      attrs: {
        "to": {
          name: 'list_single',
          params: {
            list_id: list.ID
          }
        }
      }
    }, [_c('span', [_vm._v(_vm._s(list.count_completed_tasks))]), _vm._v(" "), _vm._v("\n\t                                Completed\n\t                            ")])], 1), _vm._v(" "), _c('div', {
      staticClass: "cpm-col-3 cpm-todo-incomplete"
    }, [_c('router-link', {
      attrs: {
        "to": {
          name: 'list_single',
          params: {
            list_id: list.ID
          }
        }
      }
    }, [_c('span', [_vm._v(_vm._s(list.count_incompleted_tasks))]), _vm._v(" "), _vm._v("\n\t                                Incomplete\n\t                            ")])], 1), _vm._v(" "), _c('div', {
      staticClass: "cpm-col-3 cpm-todo-comment"
    }, [_c('router-link', {
      attrs: {
        "to": {
          name: 'list_single',
          params: {
            list_id: list.ID
          }
        }
      }
    }, [_c('span', [_vm._v(_vm._s(list.comment_count) + " Comments")])])], 1)]), _vm._v(" "), _c('div', {
      staticClass: "cpm-col-4 cpm-todo-prgress-bar"
    }, [_c('div', {
      staticClass: "bar completed",
      style: (_vm.getProgressStyle(list))
    })]), _vm._v(" "), _c('div', {
      staticClass: " cpm-col-1 no-percent"
    }, [_vm._v(_vm._s(_vm.getProgressPercent(list)) + "%")]), _vm._v(" "), _c('div', {
      staticClass: "clearfix"
    })])], 1)])
  }))], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-d11df19a", esExports)
  }
}

/***/ }),

/***/ 17:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_task_lists_vue__ = __webpack_require__(99);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_d11df19a_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_task_lists_vue__ = __webpack_require__(145);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_task_lists_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_d11df19a_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_task_lists_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "view/assets/js/components/task-lists/task-lists.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] task-lists.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-d11df19a", Component.options)
  } else {
    hotAPI.reload("data-v-d11df19a", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),

/***/ 79:
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
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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

    // Get passing data for this component. Remember only array and objects are
    props: ['list', 'index'],

    // Include global properties and methods
    //mixins: [CPM_Task_Mixin],

    /**
     * Initial data for this component
     * 
     * @return obj
     */
    data: function () {
        return {
            showTaskForm: false,
            task: {},
            tasks: this.list.tasks,
            task_index: 'undefined', // Using undefined for slideToggle class
            task_loading_status: false,
            incomplete_show_load_more_btn: false,
            complete_show_load_more_btn: false,
            currnet_user_id: this.$store.state.get_current_user_id,
            more_incomplete_task_spinner: false,
            more_completed_task_spinner: false,
            loading_completed_tasks: true,
            loading_incomplete_tasks: true
        };
    },

    created: function () {

        var self = this;
        if (this.$store.state.is_single_list) {
            //For sigle todo-list page
            this.getTasks(this.list.ID, 0, 'cpm_get_tasks', function (res) {
                var getIncompletedTasks = self.getIncompletedTasks(self.list);
                var getCompleteTask = self.getCompleteTask(self.list);

                self.loading_completed_tasks = false;
                self.loading_incomplete_tasks = false;

                if (res.found_incompleted_tasks > getIncompletedTasks.length) {
                    self.incomplete_show_load_more_btn = true;
                }

                if (res.found_completed_tasks > getCompleteTask.length) {
                    self.complete_show_load_more_btn = true;
                }
            });
        } else {
            //self.list.tasks = [];
            //For todo-lists page
            this.getTasks(this.list.ID, 0, 'cpm_get_incompleted_tasks', function (res) {
                self.loading_incomplete_tasks = false;

                if (res.found_incompleted_tasks > self.list.tasks.length) {
                    self.incomplete_show_load_more_btn = true;
                }
            });
        }
    },

    computed: {
        /**
         * Check, Has task from this props list
         * 
         * @return boolen
         */
        taskLength: function () {
            return typeof this.list.tasks != 'undefined' && this.list.tasks.length ? true : false;
        },

        /**
         * Get incomplete tasks
         * 
         * @param  array tasks 
         * 
         * @return array       
         */
        getIncompleteTasks: function () {

            if (!this.list.tasks) {
                return [];
            }

            return this.list.tasks.filter(function (task) {
                return task.completed == '0' || !task.completed;
            });
        },

        /**
         * Get completed tasks
         * 
         * @param  array tasks 
         * 
         * @return array       
         */
        getCompletedTask: function () {
            if (!this.list.tasks) {
                return [];
            }

            return this.list.tasks.filter(function (task) {
                return task.completed == '1' || task.completed;
            });
        }
    },

    methods: {
        is_assigned: function (task) {

            var get_current_user_id = this.$store.state.get_current_user_id,
                in_task = task.assigned_to.indexOf(get_current_user_id);

            if (task.can_del_edit || in_task != '-1') {
                return true;
            }

            return false;
        },
        /**
         * Get incomplete tasks
         * 
         * @param  array tasks 
         * 
         * @return array       
         */
        getIncompletedTasks: function (lists) {
            return lists.tasks.filter(function (task) {
                return task.completed == '0' || !task.completed;
            });
        },

        /**
         * Get completed tasks
         * 
         * @param  array tasks 
         * 
         * @return array       
         */
        getCompleteTask: function (lists) {
            return lists.tasks.filter(function (task) {
                return task.completed == '1' || task.completed;
            });
        },
        /**
         * Show task edit form
         * 
         * @param  int task_index 
         * 
         * @return void            
         */
        taskEdit: function (task_id) {

            var self = this,
                lists = this.$store.state.lists,
                list_index = this.getIndex(lists, this.list.ID, 'ID');
            task_index = this.getIndex(self.list.tasks, task_id, 'ID');

            self.showHideTaskForm(list_index, task_index);
        },

        /**
         * Class for showing task private incon
         * 
         * @param  obje task 
         * 
         * @return string      
         */
        privateClass: function (task) {
            return task.task_privacy == 'yes' ? 'cpm-lock' : 'cpm-unlock';
        },

        /**
         * Delete task
         * 
         * @return void
         */
        deleteTask: function (list_id, task_id) {
            if (!confirm(PM_Vars.message.confirm)) {
                return;
            }

            var self = this,
                list_index = this.getIndex(this.$store.state.lists, list_id, 'ID'),
                task_index = this.getIndex(this.$store.state.lists[list_index].tasks, task_id, 'ID'),
                form_data = {
                action: 'cpm_task_delete',
                task_id: task_id,
                _wpnonce: PM_Vars.nonce
            };

            // Seding request for insert or update todo list
            jQuery.post(PM_Vars.ajaxurl, form_data, function (res) {
                if (res.success) {
                    // Display a success message, with a title
                    //toastr.success(res.data.success);

                    CPM_Component_jQuery.fadeOut(task_id, function () {
                        self.$store.commit('after_delete_task', {
                            list_index: list_index,
                            task_index: task_index
                        });
                    });
                } else {
                    // Showing error
                    res.data.error.map(function (value, index) {
                        toastr.error(value);
                    });
                }
            });
        },

        loadMoreIncompleteTasks: function (list) {
            if (this.task_loading_status) {
                return;
            }

            this.task_loading_status = true;
            this.more_incomplete_task_spinner = true;

            var incompleted_tasks = this.getIncompletedTasks(this.list);

            var page_number = incompleted_tasks.length,
                self = this;

            this.getTasks(list.ID, page_number, 'cpm_get_incompleted_tasks', function (res) {
                self.task_loading_status = false;
                self.more_incomplete_task_spinner = false;

                var incompleted_tasks = self.getIncompletedTasks(self.list);

                if (res.found_incompleted_tasks > incompleted_tasks.length) {
                    self.incomplete_show_load_more_btn = true;
                } else {
                    self.incomplete_show_load_more_btn = false;
                }
            });
        },

        loadMoreCompleteTasks: function (list) {
            if (this.task_loading_status) {
                return;
            }

            this.task_loading_status = true;
            this.more_completed_task_spinner = true;

            var completed_tasks = this.getCompleteTask(this.list);

            var page_number = completed_tasks.length,
                self = this;

            this.getTasks(list.ID, page_number, 'cpm_get_completed_tasks', function (res) {
                self.task_loading_status = false;
                self.more_completed_task_spinner = false;

                var completed_tasks = self.getCompleteTask(self.list);

                if (res.found_completed_tasks > completed_tasks.length) {
                    self.complete_show_load_more_btn = true;
                } else {
                    self.complete_show_load_more_btn = false;
                }
            });
        }
    }
});

/***/ }),

/***/ 80:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_tasks_vue__ = __webpack_require__(79);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_52cdc098_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_tasks_vue__ = __webpack_require__(81);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_tasks_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_52cdc098_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_tasks_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "view/assets/js/components/task-lists/tasks.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] tasks.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-52cdc098", Component.options)
  } else {
    hotAPI.reload("data-v-52cdc098", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 81:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [(_vm.is_single_list) ? _c('div', {
    attrs: {
      "id": "cpm-single-todo-list-view"
    }
  }, [_c('div', {
    staticClass: "cpm-incomplete-tasks"
  }, [_vm._m(0), _vm._v(" "), _c('ul', {
    staticClass: "cpm-incomplete-task-list cpm-todos cpm-todolist-content cpm-incomplete-task"
  }, [_vm._l((_vm.getIncompleteTasks), function(task, task_index) {
    return _c('li', {
      key: task.ID,
      staticClass: "cpm-todo",
      class: 'cpm-fade-out-' + task.ID,
      attrs: {
        "data-id": task.ID,
        "data-order": task.menu_order
      }
    }, [_c('div', {
      staticClass: "cpm-todo-wrap clearfix"
    }, [_c('div', {
      staticClass: "cpm-todo-content"
    }, [_c('div', {
      staticClass: "cpm-incomplete-todo"
    }, [_c('div', {
      staticClass: "cpm-col-6"
    }, [_c('input', {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: (task.completed),
        expression: "task.completed"
      }],
      attrs: {
        "disabled": !_vm.is_assigned(task),
        "type": "checkbox",
        "value": "",
        "name": ""
      },
      domProps: {
        "checked": Array.isArray(task.completed) ? _vm._i(task.completed, "") > -1 : (task.completed)
      },
      on: {
        "click": function($event) {
          _vm.taskDoneUndone(task, task.completed)
        },
        "__c": function($event) {
          var $$a = task.completed,
            $$el = $event.target,
            $$c = $$el.checked ? (true) : (false);
          if (Array.isArray($$a)) {
            var $$v = "",
              $$i = _vm._i($$a, $$v);
            if ($$el.checked) {
              $$i < 0 && (task.completed = $$a.concat($$v))
            } else {
              $$i > -1 && (task.completed = $$a.slice(0, $$i).concat($$a.slice($$i + 1)))
            }
          } else {
            task.completed = $$c
          }
        }
      }
    }), _vm._v(" "), _c('span', [_c('router-link', {
      attrs: {
        "to": {
          name: 'list_task_single_under_todo',
          params: {
            list_id: _vm.list.ID,
            task_id: task.ID,
            task: task
          }
        }
      }
    }, [_vm._v(_vm._s(task.post_title))])], 1), _vm._v(" "), _c('span', {
      class: _vm.privateClass(task)
    }), _vm._v(" "), _vm._l((_vm.getUsers(task.assigned_to)), function(user) {
      return _c('span', {
        key: user.ID,
        staticClass: "cpm-assigned-user",
        domProps: {
          "innerHTML": _vm._s(user.user_url)
        }
      })
    }), _vm._v(" "), _c('span', {
      class: _vm.taskDateWrap(task.start_date, task.due_date)
    }, [(_vm.task_start_field) ? _c('span', [_vm._v(_vm._s(_vm.dateFormat(task.start_date)))]) : _vm._e(), _vm._v(" "), (_vm.isBetweenDate(_vm.task_start_field, task.start_date, task.due_date)) ? _c('span', [_vm._v("–")]) : _vm._e(), _vm._v(" "), _c('span', [_vm._v(_vm._s(_vm.dateFormat(task.due_date)))])])], 2), _vm._v(" "), _c('div', {
      staticClass: "cpm-col-5 cpm-todo-action-center"
    }, [_c('div', {
      staticClass: "cpm-task-comment"
    }, [_c('router-link', {
      attrs: {
        "to": {
          name: 'list_task_single_under_todo',
          params: {
            list_id: _vm.list.ID,
            task_id: task.ID,
            task: task
          }
        }
      }
    }, [_c('span', {
      staticClass: "cpm-comment-count"
    }, [_vm._v("\n\t                                                " + _vm._s(task.comments.length) + "\n\t                                            ")])])], 1)]), _vm._v(" "), (task.can_del_edit) ? _c('div', {
      staticClass: "cpm-col-1 cpm-todo-action-right cpm-last-col"
    }, [_c('a', {
      staticClass: "cpm-todo-delete",
      attrs: {
        "href": "#"
      },
      on: {
        "click": function($event) {
          $event.preventDefault();
          _vm.deleteTask(task.post_parent, task.ID)
        }
      }
    }, [_c('span', {
      staticClass: "dashicons dashicons-trash"
    })]), _vm._v(" "), _c('a', {
      staticClass: "cpm-todo-edit",
      attrs: {
        "href": "#"
      },
      on: {
        "click": function($event) {
          $event.preventDefault();
          _vm.taskEdit(task.ID)
        }
      }
    }, [_c('span', {
      staticClass: "dashicons dashicons-edit"
    })])]) : _vm._e(), _vm._v(" "), _c('div', {
      staticClass: "clearfix"
    })])]), _vm._v(" "), (task.edit_mode) ? _c('div', {
      staticClass: "cpm-todo-form"
    }, [_c('new-task-form', {
      attrs: {
        "task": task,
        "task_index": task_index,
        "list": _vm.list,
        "list_index": _vm.index
      }
    })], 1) : _vm._e()])])
  }), _vm._v(" "), (!_vm.getIncompleteTasks.length) ? _c('li', {
    staticClass: "nonsortable"
  }, [_vm._v("No tasks found.")]) : _vm._e(), _vm._v(" "), (_vm.incomplete_show_load_more_btn) ? _c('li', {
    staticClass: "nonsortable"
  }, [_c('a', {
    attrs: {
      "href": "#"
    },
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.loadMoreIncompleteTasks(_vm.list)
      }
    }
  }, [_vm._v("More Tasks")]), _vm._v(" "), _c('span', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.more_incomplete_task_spinner),
      expression: "more_incomplete_task_spinner"
    }],
    staticClass: "cpm-incomplete-task-spinner cpm-spinner"
  })]) : _vm._e()], 2)]), _vm._v(" "), _c('div', {
    staticClass: "cpm-completed-tasks"
  }, [_vm._m(1), _vm._v(" "), _c('ul', {
    staticClass: "cpm-completed-task-list cpm-todos cpm-todolist-content cpm-todo-completed"
  }, [_vm._l((_vm.getCompletedTask), function(task, task_index) {
    return _c('li', {
      key: task.ID,
      staticClass: "cpm-todo",
      class: 'cpm-todo cpm-fade-out-' + task.ID,
      attrs: {
        "data-id": task.ID,
        "data-order": task.menu_order
      }
    }, [_c('div', {
      staticClass: "cpm-todo-wrap clearfix"
    }, [_c('div', {
      staticClass: "cpm-todo-content"
    }, [_c('div', [_c('div', {
      staticClass: "cpm-col-6"
    }, [_c('input', {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: (task.completed),
        expression: "task.completed"
      }],
      attrs: {
        "type": "checkbox",
        "value": "",
        "name": ""
      },
      domProps: {
        "checked": Array.isArray(task.completed) ? _vm._i(task.completed, "") > -1 : (task.completed)
      },
      on: {
        "click": function($event) {
          _vm.taskDoneUndone(task, task.completed, task_index)
        },
        "__c": function($event) {
          var $$a = task.completed,
            $$el = $event.target,
            $$c = $$el.checked ? (true) : (false);
          if (Array.isArray($$a)) {
            var $$v = "",
              $$i = _vm._i($$a, $$v);
            if ($$el.checked) {
              $$i < 0 && (task.completed = $$a.concat($$v))
            } else {
              $$i > -1 && (task.completed = $$a.slice(0, $$i).concat($$a.slice($$i + 1)))
            }
          } else {
            task.completed = $$c
          }
        }
      }
    }), _vm._v(" "), _c('span', {
      staticClass: "task-title"
    }, [(_vm.is_single_list) ? _c('span', [_c('router-link', {
      attrs: {
        "exact": "",
        "to": {
          name: 'list_task_single_under_todo',
          params: {
            list_id: _vm.list.ID,
            task_id: task.ID,
            task: task
          }
        }
      }
    }, [_c('span', {
      staticClass: "cpm-todo-text"
    }, [_vm._v(_vm._s(task.post_title))])])], 1) : _c('span', [_c('router-link', {
      attrs: {
        "exact": "",
        "to": {
          name: 'task_single_under_todo_lists',
          params: {
            list_id: _vm.list.ID,
            task_id: task.ID,
            task: task
          }
        }
      }
    }, [_c('span', {
      staticClass: "cpm-todo-text"
    }, [_vm._v(_vm._s(task.post_title))])])], 1), _vm._v(" "), _c('span', {
      class: _vm.privateClass(task)
    })]), _vm._v(" "), _vm._l((_vm.getUsers(task.assigned_to)), function(user) {
      return _c('span', {
        key: user.ID,
        staticClass: "cpm-assigned-user",
        domProps: {
          "innerHTML": _vm._s(user.user_url)
        }
      })
    }), _vm._v(" "), _c('span', {
      class: _vm.completedTaskWrap(task.start_date, task.due_date)
    }, [(_vm.task_start_field) ? _c('span', [_vm._v(_vm._s(_vm.dateFormat(task.start_date)))]) : _vm._e(), _vm._v(" "), (_vm.isBetweenDate(_vm.task_start_field, task.start_date, task.due_date)) ? _c('span', [_vm._v("–")]) : _vm._e(), _vm._v(" "), _c('span', [_vm._v(_vm._s(_vm.dateFormat(task.due_date)))])])], 2), _vm._v(" "), _c('div', {
      staticClass: "cpm-col-5"
    }, [_c('span', {
      staticClass: "cpm-comment-count"
    }, [_c('a', {
      attrs: {
        "href": "#"
      }
    }, [_vm._v("\n\t                                        " + _vm._s(task.comment_count) + "\n\t                                    ")])])]), _vm._v(" "), _c('div', {
      staticClass: "cpm-col-1 cpm-todo-action-right cpm-last-col"
    }, [_c('a', {
      staticClass: "cpm-todo-delete",
      attrs: {
        "href": "#"
      },
      on: {
        "click": function($event) {
          $event.preventDefault();
          _vm.deleteTask(task.post_parent, task.ID)
        }
      }
    }, [_c('span', {
      staticClass: "dashicons dashicons-trash"
    })])]), _vm._v(" "), _c('div', {
      staticClass: "clearfix"
    })])]), _vm._v(" "), (task.edit_mode) ? _c('div', {
      staticClass: "cpm-todo-form"
    }, [_c('new-task-form', {
      attrs: {
        "task": task,
        "task_index": task_index,
        "list": _vm.list,
        "list_index": _vm.index
      }
    })], 1) : _vm._e()])])
  }), _vm._v(" "), (!_vm.getCompletedTask.length) ? _c('li', {
    staticClass: "nonsortable"
  }, [_vm._v("No completed tasks.")]) : _vm._e(), _vm._v(" "), (_vm.complete_show_load_more_btn) ? _c('li', {
    staticClass: "nonsortable"
  }, [_c('a', {
    attrs: {
      "href": "#"
    },
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.loadMoreCompleteTasks(_vm.list)
      }
    }
  }, [_vm._v("More Tasks")]), _vm._v(" "), _c('span', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.more_completed_task_spinner),
      expression: "more_completed_task_spinner"
    }],
    staticClass: "cpm-completed-task-spinner cpm-spinner"
  })]) : _vm._e()], 2)]), _vm._v(" "), (_vm.list.show_task_form) ? _c('div', {
    staticClass: "cpm-todo-form"
  }, [_c('new-task-form', {
    attrs: {
      "task": {},
      "task_index": _vm.task_index,
      "list": _vm.list,
      "list_index": _vm.index
    }
  })], 1) : _vm._e()]) : _c('div', [_c('div', {
    staticClass: "cpm-incomplete-tasks"
  }, [_c('ul', {
    staticClass: "cpm-todos cpm-todolist-content cpm-incomplete-task"
  }, [(_vm.loading_incomplete_tasks) ? _c('li', {
    staticClass: "nonsortable"
  }, [_vm._m(2)]) : _vm._e(), _vm._v(" "), _vm._l((_vm.getIncompleteTasks), function(task, task_index) {
    return _c('li', {
      key: task.ID,
      staticClass: "cpm-todo",
      class: 'cpm-fade-out-' + task.ID,
      attrs: {
        "data-id": task.ID,
        "data-order": task.menu_order
      }
    }, [_c('div', {
      staticClass: "cpm-todo-wrap clearfix"
    }, [_c('div', {
      staticClass: "cpm-todo-content"
    }, [_c('div', [_c('div', {
      staticClass: "cpm-col-7"
    }, [_c('input', {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: (task.completed),
        expression: "task.completed"
      }],
      attrs: {
        "disabled": !_vm.is_assigned(task),
        "type": "checkbox",
        "value": "",
        "name": ""
      },
      domProps: {
        "checked": Array.isArray(task.completed) ? _vm._i(task.completed, "") > -1 : (task.completed)
      },
      on: {
        "click": function($event) {
          _vm.taskDoneUndone(task, task.completed)
        },
        "__c": function($event) {
          var $$a = task.completed,
            $$el = $event.target,
            $$c = $$el.checked ? (true) : (false);
          if (Array.isArray($$a)) {
            var $$v = "",
              $$i = _vm._i($$a, $$v);
            if ($$el.checked) {
              $$i < 0 && (task.completed = $$a.concat($$v))
            } else {
              $$i > -1 && (task.completed = $$a.slice(0, $$i).concat($$a.slice($$i + 1)))
            }
          } else {
            task.completed = $$c
          }
        }
      }
    }), _vm._v(" "), (_vm.is_single_list) ? _c('span', [_c('router-link', {
      attrs: {
        "to": {
          name: 'list_task_single_under_todo',
          params: {
            list_id: _vm.list.ID,
            task_id: task.ID,
            task: task
          }
        }
      }
    }, [_vm._v(_vm._s(task.post_title))])], 1) : _c('span', [_c('router-link', {
      attrs: {
        "exact": "",
        "to": {
          name: 'task_single_under_todo_lists',
          params: {
            list_id: _vm.list.ID,
            task_id: task.ID,
            task: task
          }
        }
      }
    }, [_vm._v(_vm._s(task.post_title))])], 1), _vm._v(" "), _c('span', {
      class: _vm.privateClass(task)
    }), _vm._v(" "), _vm._l((_vm.getUsers(task.assigned_to)), function(user) {
      return _c('span', {
        key: user.ID,
        staticClass: "cpm-assigned-user",
        domProps: {
          "innerHTML": _vm._s(user.user_url)
        }
      })
    }), _vm._v(" "), _c('span', {
      class: _vm.taskDateWrap(task.start_date, task.due_date)
    }, [(_vm.task_start_field) ? _c('span', [_vm._v(_vm._s(_vm.dateFormat(task.start_date)))]) : _vm._e(), _vm._v(" "), (_vm.isBetweenDate(_vm.task_start_field, task.start_date, task.due_date)) ? _c('span', [_vm._v("–")]) : _vm._e(), _vm._v(" "), _c('span', [_vm._v(_vm._s(_vm.dateFormat(task.due_date)))])])], 2), _vm._v(" "), _c('div', {
      staticClass: "cpm-col-4 cpm-todo-action-center"
    }, [_c('div', {
      staticClass: "cpm-task-comment"
    }, [(_vm.is_single_list) ? _c('span', [_c('router-link', {
      attrs: {
        "to": {
          name: 'list_task_single_under_todo',
          params: {
            list_id: _vm.list.ID,
            task_id: task.ID,
            task: task
          }
        }
      }
    }, [_c('span', {
      staticClass: "cpm-comment-count"
    }, [_vm._v("\n\t                                                " + _vm._s(task.comments.length) + "\n\t                                            ")])])], 1) : _c('span', [_c('router-link', {
      attrs: {
        "exact": "",
        "to": {
          name: 'task_single_under_todo_lists',
          params: {
            list_id: _vm.list.ID,
            task_id: task.ID,
            task: task
          }
        }
      }
    }, [_c('span', {
      staticClass: "cpm-comment-count"
    }, [_vm._v("\n\t                                                " + _vm._s(task.comments.length) + "\n\t                                            ")])])], 1)])]), _vm._v(" "), (task.can_del_edit) ? _c('div', {
      staticClass: "cpm-col-1 cpm-todo-action-right cpm-last-col"
    }, [_c('a', {
      staticClass: "cpm-todo-delete",
      attrs: {
        "href": "#"
      },
      on: {
        "click": function($event) {
          $event.preventDefault();
          _vm.deleteTask(task.post_parent, task.ID)
        }
      }
    }, [_c('span', {
      staticClass: "dashicons dashicons-trash"
    })]), _vm._v(" "), _c('a', {
      staticClass: "cpm-todo-edit",
      attrs: {
        "href": "#"
      },
      on: {
        "click": function($event) {
          $event.preventDefault();
          _vm.taskEdit(task.ID)
        }
      }
    }, [_c('span', {
      staticClass: "dashicons dashicons-edit"
    })])]) : _vm._e(), _vm._v(" "), _c('div', {
      staticClass: "clearfix"
    })])]), _vm._v(" "), (task.edit_mode) ? _c('div', {
      staticClass: "cpm-todo-form"
    }, [_c('new-task-form', {
      attrs: {
        "task": task,
        "task_index": task_index,
        "list": _vm.list,
        "list_index": _vm.index
      }
    })], 1) : _vm._e()])])
  }), _vm._v(" "), (!_vm.getIncompleteTasks.length) ? _c('li', {
    staticClass: "nonsortable"
  }, [_vm._v("No tasks found.")]) : _vm._e(), _vm._v(" "), (_vm.list.show_task_form) ? _c('li', {
    staticClass: "cpm-todo-form nonsortable"
  }, [_c('new-task-form', {
    attrs: {
      "task": {},
      "task_index": _vm.task_index,
      "list": _vm.list,
      "list_index": _vm.index
    }
  })], 1) : _vm._e(), _vm._v(" "), (_vm.incomplete_show_load_more_btn) ? _c('li', {
    staticClass: "nonsortable"
  }, [_c('a', {
    attrs: {
      "href": "#"
    },
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.loadMoreIncompleteTasks(_vm.list)
      }
    }
  }, [_vm._v("More Tasks")]), _vm._v(" "), _c('span', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.more_incomplete_task_spinner),
      expression: "more_incomplete_task_spinner"
    }],
    staticClass: "cpm-incomplete-task-spinner cpm-spinner"
  })]) : _vm._e()], 2)]), _vm._v(" "), _c('div', {
    staticClass: "cpm-completed-tasks"
  }, [(_vm.is_single_list) ? _c('ul', {
    staticClass: "cpm-todos cpm-todolist-content cpm-todo-completed"
  }, [_vm._l((_vm.getCompletedTask), function(task, task_index) {
    return _c('li', {
      key: task.ID,
      class: 'cpm-todo cpm-fade-out-' + task.ID,
      attrs: {
        "data-id": task.ID,
        "data-order": task.menu_order
      }
    }, [_c('div', {
      staticClass: "cpm-todo-wrap clearfix"
    }, [_c('div', {
      staticClass: "cpm-todo-content"
    }, [_c('div', [_c('div', {
      staticClass: "cpm-col-7"
    }, [_c('input', {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: (task.completed),
        expression: "task.completed"
      }],
      attrs: {
        "type": "checkbox",
        "value": "",
        "name": ""
      },
      domProps: {
        "checked": Array.isArray(task.completed) ? _vm._i(task.completed, "") > -1 : (task.completed)
      },
      on: {
        "click": function($event) {
          _vm.taskDoneUndone(task, task.completed, task_index)
        },
        "__c": function($event) {
          var $$a = task.completed,
            $$el = $event.target,
            $$c = $$el.checked ? (true) : (false);
          if (Array.isArray($$a)) {
            var $$v = "",
              $$i = _vm._i($$a, $$v);
            if ($$el.checked) {
              $$i < 0 && (task.completed = $$a.concat($$v))
            } else {
              $$i > -1 && (task.completed = $$a.slice(0, $$i).concat($$a.slice($$i + 1)))
            }
          } else {
            task.completed = $$c
          }
        }
      }
    }), _vm._v(" "), _c('span', {
      staticClass: "task-title"
    }, [(_vm.is_single_list) ? _c('span', [_c('router-link', {
      attrs: {
        "exact": "",
        "to": {
          name: 'list_task_single_under_todo',
          params: {
            list_id: _vm.list.ID,
            task_id: task.ID,
            task: task
          }
        }
      }
    }, [_c('span', {
      staticClass: "cpm-todo-text"
    }, [_vm._v(_vm._s(task.post_title))])])], 1) : _c('span', [_c('router-link', {
      attrs: {
        "exact": "",
        "to": {
          name: 'task_single_under_todo_lists',
          params: {
            list_id: _vm.list.ID,
            task_id: task.ID,
            task: task
          }
        }
      }
    }, [_c('span', {
      staticClass: "cpm-todo-text"
    }, [_vm._v(_vm._s(task.post_title))])])], 1), _vm._v(" "), _c('span', {
      class: _vm.privateClass(task)
    })]), _vm._v(" "), _vm._l((_vm.getUsers(task.assigned_to)), function(user) {
      return _c('span', {
        key: user.ID,
        staticClass: "cpm-assigned-user",
        domProps: {
          "innerHTML": _vm._s(user.user_url)
        }
      })
    }), _vm._v(" "), _c('span', {
      class: _vm.completedTaskWrap(task.start_date, task.due_date)
    }, [(_vm.task_start_field) ? _c('span', [_vm._v(_vm._s(_vm.dateFormat(task.start_date)))]) : _vm._e(), _vm._v(" "), (_vm.isBetweenDate(_vm.task_start_field, task.start_date, task.due_date)) ? _c('span', [_vm._v("–")]) : _vm._e(), _vm._v(" "), _c('span', [_vm._v(_vm._s(_vm.dateFormat(task.due_date)))])])], 2), _vm._v(" "), _c('div', {
      staticClass: "cpm-col-4"
    }, [_c('span', {
      staticClass: "cpm-comment-count"
    }, [_c('a', {
      attrs: {
        "href": "#"
      }
    }, [_vm._v("\n\t                                        " + _vm._s(task.comment_count) + "\n\t                                    ")])])]), _vm._v(" "), _c('div', {
      staticClass: "cpm-col-1 cpm-todo-action-right cpm-last-col"
    }, [_c('a', {
      staticClass: "cpm-todo-delete",
      attrs: {
        "href": "#"
      },
      on: {
        "click": function($event) {
          $event.preventDefault();
          _vm.deleteTask(task.post_parent, task.ID)
        }
      }
    }, [_c('span', {
      staticClass: "dashicons dashicons-trash"
    })])]), _vm._v(" "), _c('div', {
      staticClass: "clearfix"
    })]), _vm._v(" "), _vm._m(3, true)]), _vm._v(" "), (task.edit_mode) ? _c('div', {
      staticClass: "cpm-todo-form"
    }, [_c('new-task-form', {
      attrs: {
        "task": task,
        "task_index": task_index,
        "list": _vm.list,
        "list_index": _vm.index
      }
    })], 1) : _vm._e()])])
  }), _vm._v(" "), (!_vm.getCompletedTask.length) ? _c('li', {
    staticClass: "nonsortable"
  }, [_vm._v("No completed tasks.")]) : _vm._e(), _vm._v(" "), (_vm.complete_show_load_more_btn) ? _c('li', {
    staticClass: "nonsortable"
  }, [_c('a', {
    attrs: {
      "href": "#"
    },
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.loadMoreCompleteTasks(_vm.list)
      }
    }
  }, [_vm._v("More Tasks")]), _vm._v(" "), _c('span', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.more_completed_task_spinner),
      expression: "more_completed_task_spinner"
    }],
    staticClass: "cpm-completed-task-spinner cpm-spinner"
  })]) : _vm._e()], 2) : _vm._e()])])])
}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('h3', {
    staticClass: "cpm-task-list-title cpm-tag-gray"
  }, [_c('a', [_vm._v("Incomplete Tasks")])])
},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('h3', {
    staticClass: "cpm-task-list-title cpm-tag-gray"
  }, [_c('a', [_vm._v("Completed Tasks")])])
},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
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
  })])])])
},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "cpm-col-12"
  }, [_c('div', {
    staticClass: "cpm-todo-details"
  })])
}]
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-52cdc098", esExports)
  }
}

/***/ }),

/***/ 96:
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

/* harmony default export */ __webpack_exports__["a"] = ({
    /**
     * Initial data for this component
     * 
     * @return obj
     */
    data: function () {
        return {
            list: {},
            index: false,
            permissions: this.$store.state.permissions,
            text: {
                new_todo: 'New Task List'
            }
        };
    },

    computed: {
        /**
         * Show new todo-list form
         * 
         * @return boolean
         */
        show_list_form: function () {
            return this.$store.state.show_list_form;
        }
    }
});

/***/ }),

/***/ 97:
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


var cpm_todo_list_mixins = function (mixins, mixin_parent) {
    if (!mixins || !mixins.length) {
        return [];
    }
    if (!mixin_parent) {
        mixin_parent = window;
    }
    return mixins.map(function (mixin) {
        return mixin_parent[mixin];
    });
};

/* harmony default export */ __webpack_exports__["a"] = ({
    // Get passing data for this component. Remember only array and objects are 
    props: ['list', 'index'],

    // created () {
    // 	console.log('adlskjasdlfkj');
    // },

    // Include global properties and methods
    //mixins: cpm_todo_list_mixins( PM_Vars.todo_list_form ),

    /**
     * Initial data for this component
     * 
     * @return obj
     */
    data: function () {
        return {
            submit_btn_text: 'Submit',
            tasklist_milestone: this.list.milestone ? this.list.milestone : '-1',
            show_spinner: false,
            error: [],
            success: '',
            submit_disabled: false
        };
    },

    computed: {

        /**
         * Get current project milestones 
         * 
         * @return array
         */
        milestones: function () {
            return this.$store.state.milestones;
        }
    },

    methods: {

        /**
         * Get todo list form class
         * 
         * @param  obej list 
         * 
         * @return string     
         */
        todolistFormClass: function (list) {
            return list.ID ? 'cpm-todo-form-wrap cpm-form cpm-slide-' + list.ID : 'cpm-todo-list-form-wrap cpm-form cpm-slide-list';
        },

        /**
         * Insert and update todo list
         * 
         * @return void
         */
        newTodoList: function () {

            // Prevent sending request when multiple click submit button 
            if (this.submit_disabled) {
                return;
            }

            // Make disable submit button
            this.submit_disabled = true;

            var self = this,
                is_update = typeof this.list.ID == 'undefined' ? false : true;

            this.list_form_data.action = typeof this.list.ID == 'undefined' ? 'cpm_add_list' : 'cpm_update_list';
            this.list_form_data.tasklist_name = this.list.post_title;
            this.list_form_data.tasklist_detail = this.list.post_content;
            this.list_form_data.project_id = this.$store.state.project_id;
            this.list_form_data.tasklist_milestone = this.tasklist_milestone;
            this.list_form_data.list_id = typeof this.list.ID == 'undefined' ? false : this.list.ID;
            this.list_form_data._wpnonce = PM_Vars.nonce;

            this.show_spinner = true;

            // Seding request for insert or update todo list
            jQuery.post(PM_Vars.ajaxurl, this.list_form_data, function (res) {

                if (res.success) {
                    self.tasklist_milestone = '-1';
                    self.show_spinner = false;
                    self.list.post_title = '';
                    self.list.post_content = '';

                    if (is_update) {
                        var list = res.data.list;
                    } else {
                        var list = res.data.list.list;
                    }

                    // Display a success message, with a title
                    toastr.success(res.data.success);

                    // Hide the todo list update form
                    self.showHideTodoListForm(self.list, self.index);

                    self.refreshTodoListPage();
                } else {
                    self.show_spinner = false;

                    // Showing error
                    res.data.error.map(function (value, index) {
                        toastr.error(value);
                    });
                }

                // Make enable submit button
                self.submit_disabled = false;
            });
        }
    }
});

/***/ }),

/***/ 99:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__new_task_list_btn_vue__ = __webpack_require__(121);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__new_task_list_form_vue__ = __webpack_require__(122);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__tasks_vue__ = __webpack_require__(80);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
        'new-task-list-btn': __WEBPACK_IMPORTED_MODULE_0__new_task_list_btn_vue__["a" /* default */],
        'new-task-list-form': __WEBPACK_IMPORTED_MODULE_1__new_task_list_form_vue__["a" /* default */],
        'tasks': __WEBPACK_IMPORTED_MODULE_2__tasks_vue__["a" /* default */]
    },

    // Assign template for this component
    //template: '#tmpl-cpm-todo-list', 

    // Include global properties and methods
    // mixins: [CPM_Task_Mixin],

    props: ['current_page_number'],

    /**
     * Initial data for this component
     * 
     * @return obj
     */
    data: function () {
        return {
            list: {},
            index: false
        };
    },

    watch: {
        current_page_number: function (page_number) {
            var per_page = this.$store.state.todo_list_per_page,
                self = this;

            for (var i = 0; i < per_page; i++) {
                var request_data = {
                    per_page: per_page,
                    current_page: page_number,
                    project_id: CPM_Vars.project_id,
                    _wpnonce: CPM_Vars.nonce
                };

                wp.ajax.send('cpm_get_todo_lists', {
                    data: request_data,
                    success: function (res) {
                        self.$store.commit('new_todo_list', res);
                    }
                });
            }
        }
    },

    created() {
        this.$store.state.is_single_list = false;
    },

    computed: {
        /**
         * Get lists from vuex store
         * 
         * @return array
         */
        lists: function () {
            return this.$store.state.lists;
        },

        /**
         * Get milestones from vuex store
         * 
         * @return array
         */
        milestones: function () {
            return this.$store.state.milestones;
        },

        /**
         * Get current project id from vuex store
         * 
         * @return int
         */
        project_id: function () {
            return this.$store.state.project_id;
        },

        /**
         * Get initial data from vuex store when this component loaded
         * 
         * @return obj
         */
        init: function () {
            return this.$store.state.init;
        },

        /**
         * Get task for single task popup
         * 
         * @return object
         */
        task: function () {
            return this.$store.state.task;
        },

        total: function () {
            return Math.ceil(this.$store.state.list_total / this.$store.state.todo_list_per_page);
        },

        limit: function () {
            return this.$store.state.todo_list_per_page;
        },

        page_number: function () {
            return this.$route.params.page_number ? this.$route.params.page_number : 1;
        }
    }
});

/***/ })

});