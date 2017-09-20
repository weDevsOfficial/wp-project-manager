webpackJsonp([5],{

/***/ 10:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_discussions_vue__ = __webpack_require__(123);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_13e4976b_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_discussions_vue__ = __webpack_require__(170);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_discussions_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_13e4976b_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_discussions_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "view/assets/js/components/discussions/discussions.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] discussions.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-13e4976b", Component.options)
  } else {
    hotAPI.reload("data-v-13e4976b", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),

/***/ 107:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_new_discuss_form_vue__ = __webpack_require__(99);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_602b6da4_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_new_discuss_form_vue__ = __webpack_require__(118);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_new_discuss_form_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_602b6da4_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_new_discuss_form_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "view/assets/js/components/discussions/new-discuss-form.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] new-discuss-form.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-602b6da4", Component.options)
  } else {
    hotAPI.reload("data-v-602b6da4", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 118:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('form', {
    staticClass: "cpm-message-form",
    on: {
      "submit": function($event) {
        $event.preventDefault();
        _vm.newDiscuss()
      }
    }
  }, [_c('div', {
    staticClass: "item title"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.discuss.title),
      expression: "discuss.title"
    }],
    attrs: {
      "name": "title",
      "required": "required",
      "type": "text",
      "id": "message_title",
      "value": "",
      "placeholder": "Enter message title"
    },
    domProps: {
      "value": (_vm.discuss.title)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.discuss.title = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "item detail"
  }, [_c('text-editor', {
    attrs: {
      "editor_id": _vm.editor_id,
      "content": _vm.content
    }
  })], 1), _vm._v(" "), _c('div', {
    staticClass: "item milestone"
  }, [_c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.discuss.milestone_id),
      expression: "discuss.milestone_id"
    }],
    on: {
      "change": function($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
          return o.selected
        }).map(function(o) {
          var val = "_value" in o ? o._value : o.value;
          return val
        });
        _vm.discuss.milestone_id = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
      }
    }
  }, [_c('option', {
    attrs: {
      "value": "-1"
    }
  }, [_vm._v("\n\t\t\t            - Milestone -\n\t\t\t        ")]), _vm._v(" "), _vm._l((_vm.milestones), function(milestone) {
    return _c('option', {
      domProps: {
        "value": milestone.id
      }
    }, [_vm._v("\n\t\t\t            " + _vm._s(milestone.title) + "\n\t\t\t        ")])
  })], 2)]), _vm._v(" "), _vm._m(0), _vm._v(" "), _vm._m(1), _vm._v(" "), _c('div', {
    staticClass: "submit"
  }, [_c('input', {
    staticClass: "button-primary",
    attrs: {
      "type": "submit",
      "name": "create_message",
      "id": "create_message",
      "value": "Add Message"
    }
  }), _vm._v(" "), _c('a', {
    staticClass: "message-cancel button-secondary",
    attrs: {
      "href": ""
    },
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.showHideDiscussForm(false, _vm.discuss)
      }
    }
  }, [_vm._v("Cancel")])]), _vm._v(" "), _c('div', {
    staticClass: "cpm-loading",
    staticStyle: {
      "display": "none"
    }
  }, [_vm._v("Saving...")])])])
}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "cpm-attachment-area"
  }, [_c('div', {
    staticStyle: {
      "position": "relative"
    },
    attrs: {
      "id": "cpm-upload-container-nd"
    }
  }, [_c('div', {
    staticClass: "cpm-upload-filelist"
  }), _vm._v("\n\t\t        \tTo attach, \n\t\t        \t"), _c('a', {
    staticStyle: {
      "position": "relative",
      "z-index": "1"
    },
    attrs: {
      "id": "cpm-upload-pickfiles-nd",
      "href": "#"
    }
  }, [_vm._v("select files")]), _vm._v(" \n\t\t        \tfrom your computer.    \n\t\t        \t"), _c('div', {
    staticClass: "moxie-shim moxie-shim-html5",
    staticStyle: {
      "position": "absolute",
      "top": "0px",
      "left": "0px",
      "width": "0px",
      "height": "0px",
      "overflow": "hidden",
      "z-index": "0"
    },
    attrs: {
      "id": "html5_1bpoid5a01j4s5vi1olihdq11kd3_container"
    }
  }, [_c('input', {
    staticStyle: {
      "font-size": "999px",
      "opacity": "0",
      "position": "absolute",
      "top": "0px",
      "left": "0px",
      "width": "100%",
      "height": "100%"
    },
    attrs: {
      "id": "html5_1bpoid5a01j4s5vi1olihdq11kd3",
      "type": "file",
      "multiple": "",
      "accept": ""
    }
  })])])])
},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "notify-users"
  }, [_c('h2', {
    staticClass: "cpm-box-title"
  }, [_vm._v(" \n\t        \t\tNotify users            \n\t        \t\t"), _c('label', {
    staticClass: "cpm-small-title",
    attrs: {
      "for": "select-all"
    }
  }, [_c('input', {
    staticClass: "cpm-toggle-checkbox",
    attrs: {
      "type": "checkbox",
      "name": "select-all",
      "id": "select-all"
    }
  }), _vm._v(" \n\t        \t\t\tSelect all\n\t        \t\t")])]), _vm._v(" "), _c('ul', {
    staticClass: "cpm-user-list"
  }, [_c('li', [_c('label', {
    attrs: {
      "for": "cpm_notify_1"
    }
  }, [_c('input', {
    attrs: {
      "type": "checkbox",
      "name": "notify_user[]",
      "id": "cpm_notify_1",
      "value": "1"
    }
  }), _vm._v(" \n\t\t            \t\tAdmin\n\t\t            \t")])]), _vm._v(" "), _c('div', {
    staticClass: "clearfix"
  })])])
}]
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-602b6da4", esExports)
  }
}

/***/ }),

/***/ 123:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__header_vue__ = __webpack_require__(91);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__new_discuss_form_vue__ = __webpack_require__(107);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
            vm.getDiscussion(vm);
            vm.getMilestones(vm);
        });
    },
    components: {
        'pm-header': __WEBPACK_IMPORTED_MODULE_0__header_vue__["a" /* default */],
        'new-discuss-form': __WEBPACK_IMPORTED_MODULE_1__new_discuss_form_vue__["a" /* default */]
    },
    computed: {
        is_discuss_form_active() {
            return this.$store.state.is_discuss_form_active;
        },

        discussion() {
            return this.$store.state.discussion;
        }
    },
    methods: {}
});

/***/ }),

/***/ 170:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "wrap cpm cpm-front-end"
  }, [_c('pm-header'), _vm._v(" "), _c('div', [_c('a', {
    staticClass: "cpm-btn cpm-plus-white cpm-new-message-btn cpm-btn-uppercase",
    attrs: {
      "href": "",
      "id": "cpm-add-message"
    },
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.showHideDiscussForm('toggle')
      }
    }
  }, [_vm._v(" \n                Add New Discussion \n            ")])]), _vm._v(" "), (_vm.is_discuss_form_active) ? _c('div', {
    staticClass: "cpm-new-message-form"
  }, [_c('h3', [_vm._v("Create a new message")]), _vm._v(" "), _c('new-discuss-form', {
    attrs: {
      "discuss": {}
    }
  })], 1) : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "cpm-row cpm-message-page"
  }, [_c('div', {
    staticClass: "cpm-message-list cpm-col-12 cpm-sm-col-12"
  }, [_c('div', {
    staticClass: "cpm-box-title"
  }, [_vm._v("Discussion List")]), _vm._v(" "), _c('ul', {
    staticClass: "dicussion-list"
  }, _vm._l((_vm.discussion), function(discuss) {
    return _c('li', {
      key: "discuss.id",
      staticClass: "cpm-col-12"
    }, [_c('div', {
      staticClass: "cpm-col-9",
      attrs: {
        "itemref": "http://localhost/test/wp-admin/admin.php?page=cpm_projects&tab=message&action=single&pid=60&mid=97"
      }
    }, [_c('router-link', {
      staticClass: "cpm-pagination-btn prev page-numbers",
      attrs: {
        "to": {
          name: 'individual_discussions',
          params: {
            discussion_id: discuss.id
          }
        }
      }
    }, [_c('img', {
      staticClass: "avatar avatar-48 photo",
      attrs: {
        "alt": "admin",
        "src": "//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&r=g&d=mm",
        "srcset": "//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&r=g&d=mm 2x",
        "height": "48",
        "width": "48"
      }
    }), _vm._v(" "), _c('div', [_vm._v("\n                                   " + _vm._s(discuss.title) + "                    \n                            \t")])]), _vm._v(" "), _vm._m(0, true)], 1), _vm._v(" "), _c('div', {
      staticClass: "cpm-col-1"
    }, [_c('span', {
      staticClass: "cpm-message-action cpm-right"
    }, [_c('a', {
      staticClass: "cpm-msg-edit dashicons dashicons-edit",
      attrs: {
        "href": "#"
      },
      on: {
        "click": function($event) {
          $event.preventDefault();
          _vm.showHideDiscussForm('toggle', discuss)
        }
      }
    }), _vm._v(" "), _vm._m(1, true), _vm._v(" "), _c('span', {
      staticClass: "cpm-unlock"
    })])]), _vm._v(" "), _c('div', {
      staticClass: "cpm-col-2 cpm-last-col cpm-right comment-count",
      attrs: {
        "itemref": "http://localhost/test/wp-admin/admin.php?page=cpm_projects&tab=message&action=single&pid=60&mid=97"
      }
    }, [_vm._v("\n                             4 Comments            \n                        ")]), _vm._v(" "), _c('div', {
      staticClass: "clear"
    }), _vm._v(" "), (discuss.edit_mode) ? _c('new-discuss-form', {
      attrs: {
        "discuss": discuss
      }
    }) : _vm._e()], 1)
  }))]), _vm._v(" "), _c('div', {
    staticClass: "clear"
  })]), _vm._v(" "), _vm._m(2)], 1)
}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "dicussion-meta"
  }, [_vm._v("\n                                By \n                                "), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_task&user_id=1",
      "title": "admin"
    }
  }, [_vm._v("\n                                \tadmin\n                                ")]), _vm._v(" \n                                on September 11, 2017 01:34 pm                    \n                            ")])
},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('a', {
    staticClass: "delete-message",
    attrs: {
      "href": "",
      "title": "Delete this message",
      "data-msg_id": "97",
      "data-project_id": "60",
      "data-confirm": "Are you sure to delete this message?"
    }
  }, [_c('span', {
    staticClass: "dashicons dashicons-trash"
  })])
},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "cpm-blank-template discussion",
    staticStyle: {
      "display": "none"
    }
  }, [_c('div', {
    staticClass: "cpm-content"
  }, [_c('h2', {
    staticClass: "cpm-page-title"
  }, [_vm._v("  Discussion ")]), _vm._v(" "), _c('p', [_vm._v("\n                    Use our built in discussion panel to create an open discussion, a group discussion or a private conversation. Note that the Admin can always moderate these discussions.        ")]), _vm._v(" "), _c('div', [_c('a', {
    staticClass: "cpm-btn cpm-plus-white cpm-new-message-btn cpm-btn-uppercase",
    attrs: {
      "href": "",
      "id": "cpm-add-message-new"
    }
  }, [_vm._v(" Add New Discussion ")])]), _vm._v(" "), _c('div', {
    staticClass: "cpm-new-message-form",
    attrs: {
      "id": "cpm-new-message-form-content"
    }
  }, [_c('h3', [_vm._v("Create a new message")]), _vm._v(" "), _c('form', {
    staticClass: "cpm-message-form"
  }, [_c('div', {
    staticClass: "item title"
  }, [_c('input', {
    attrs: {
      "name": "message_title",
      "required": "required",
      "type": "text",
      "id": "message_title",
      "value": "",
      "placeholder": "Enter message title"
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "item detail"
  }, [_c('input', {
    attrs: {
      "id": "message_detail",
      "type": "hidden",
      "name": "message_detail",
      "value": ""
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "item milestone"
  }, [_c('select', {
    attrs: {
      "name": "milestone",
      "id": "milestone"
    }
  }, [_c('option', {
    attrs: {
      "value": "0"
    }
  }, [_vm._v("- Milestone -")])])]), _vm._v(" "), _c('div', {
    staticClass: "cpm-make-privacy"
  }, [_c('label', [_c('input', {
    attrs: {
      "type": "checkbox",
      "value": "yes",
      "name": "message_privacy"
    }
  }), _vm._v("\n                                Private                \n                            ")])]), _vm._v(" "), _c('div', {
    staticClass: "cpm-attachment-area"
  }, [_c('div', {
    attrs: {
      "id": "cpm-upload-container-nd"
    }
  }, [_c('div', {
    staticClass: "cpm-upload-filelist"
  }), _vm._v("\n                                To attach, \n                                "), _c('a', {
    attrs: {
      "id": "cpm-upload-pickfiles-nd",
      "href": "#"
    }
  }, [_vm._v("select files")]), _vm._v(" from your computer.    \n                            ")])]), _vm._v(" "), _c('div', {
    staticClass: "notify-users"
  }, [_c('h2', {
    staticClass: "cpm-box-title"
  }, [_vm._v(" \n                                Notify users            \n                                "), _c('label', {
    staticClass: "cpm-small-title",
    attrs: {
      "for": "select-all"
    }
  }, [_c('input', {
    staticClass: "cpm-toggle-checkbox",
    attrs: {
      "type": "checkbox",
      "name": "select-all",
      "id": "select-all"
    }
  }), _vm._v(" \n                                    Select all\n                                ")])]), _vm._v(" "), _c('ul', {
    staticClass: "cpm-user-list"
  }, [_c('li', [_c('label', {
    attrs: {
      "for": "cpm_notify_1"
    }
  }, [_c('input', {
    attrs: {
      "type": "checkbox",
      "name": "notify_user[]",
      "id": "cpm_notify_1",
      "value": "1"
    }
  }), _vm._v(" \n                                        Admin\n                                    ")])]), _vm._v(" "), _c('div', {
    staticClass: "clearfix"
  })])]), _vm._v(" "), _c('div', {
    staticClass: "submit"
  }, [_c('input', {
    attrs: {
      "type": "hidden",
      "name": "message_id",
      "value": "nd"
    }
  }), _vm._v(" "), _c('input', {
    staticClass: "button-primary",
    attrs: {
      "type": "submit",
      "name": "create_message",
      "id": "create_message",
      "value": "Add Message"
    }
  }), _vm._v(" "), _c('a', {
    staticClass: "message-cancel button-secondary",
    attrs: {
      "href": ""
    }
  }, [_vm._v("Cancel")])]), _vm._v(" "), _c('div', {
    staticClass: "cpm-loading",
    staticStyle: {
      "display": "none"
    }
  }, [_vm._v("Saving...")])])]), _vm._v(" "), _c('div', {
    staticClass: "cpm-list-content"
  }, [_c('h2', {
    staticClass: "cpm-why-for cpm-page-title"
  }, [_vm._v(" When to use Discussions? ")]), _vm._v(" "), _c('ul', {
    staticClass: "cpm-list"
  }, [_c('li', [_vm._v(" To discuss a work matter privately. ")]), _vm._v(" "), _c('li', [_vm._v(" To exchange files privately.  ")]), _vm._v(" "), _c('li', [_vm._v(" To discuss in a group.  ")]), _vm._v(" "), _c('li', [_vm._v(" To create an open discussion visible to all.  ")])])])])])
}]
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-13e4976b", esExports)
  }
}

/***/ }),

/***/ 90:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__router__ = __webpack_require__(4);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
    data() {
        return {
            menu: [{
                route: {
                    name: 'pm_overview',
                    project_id: this.project_id
                },

                name: 'Overview',
                count: 0,
                class: 'overview cpm-sm-col-12'
            }, {
                route: {
                    name: 'activities',
                    project_id: this.project_id
                },

                name: 'Activities',
                count: 10,
                class: 'activity cpm-sm-col-12'
            }, {
                route: {
                    name: 'discussions',
                    project_id: this.project_id
                },

                name: 'Discussions',
                count: 40,
                class: 'message cpm-sm-col-12'
            }, {
                route: {
                    name: 'task_lists',
                    project_id: this.project_id
                },

                name: 'Task Lists',
                count: 30,
                class: 'to-do-list cpm-sm-col-12 active'
            }, {
                route: {
                    name: 'milestones',
                    project_id: this.project_id
                },

                name: 'Milestones',
                count: 25,
                class: 'milestone cpm-sm-col-12'
            }, {
                route: {
                    name: 'pm_files',
                    project_id: this.project_id
                },

                name: 'Files',
                count: 50,
                class: 'files cpm-sm-col-12'
            }]
        };
    }
});

/***/ }),

/***/ 91:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_header_vue__ = __webpack_require__(90);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_46bc394e_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_header_vue__ = __webpack_require__(92);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_header_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_46bc394e_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_header_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "view/assets/js/components/header.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] header.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-46bc394e", Component.options)
  } else {
    hotAPI.reload("data-v-46bc394e", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 92:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "cpm-top-bar cpm-no-padding cpm-project-header cpm-project-head"
  }, [_vm._m(0), _vm._v(" "), _c('div', {
    staticClass: "cpm-row cpm-project-group"
  }, [_c('ul', _vm._l((_vm.menu), function(item) {
    return _c('li', [_c('router-link', {
      class: item.class,
      attrs: {
        "to": item.route
      }
    }, [_c('span', [_vm._v(_vm._s(item.name))]), _vm._v(" "), _c('div', [_vm._v(_vm._s(item.count))])])], 1)
  }))]), _vm._v(" "), _c('div', {
    staticClass: "clearfix"
  })])
}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "cpm-row cpm-no-padding cpm-border-bottom"
  }, [_c('div', {
    staticClass: "cpm-col-6 cpm-project-detail"
  }, [_c('h3', [_c('span', {
    staticClass: "cpm-project-title"
  }, [_vm._v(" eirugkdj ")]), _vm._v(" "), _c('a', {
    staticClass: "cpm-icon-edit cpm-project-edit-link small-text",
    attrs: {
      "href": "#"
    }
  }, [_c('span', {
    staticClass: "dashicons dashicons-edit"
  }), _vm._v(" "), _c('span', {
    staticClass: "text"
  }, [_vm._v("Edit")])])]), _vm._v(" "), _c('div', {
    staticClass: "detail"
  })]), _vm._v(" "), _c('div', {
    staticClass: "cpm-col-6 cpm-last-col cpm-top-right-btn cpm-text-right show_desktop_only"
  }, [_c('div', {
    staticClass: "cpm-single-project-search-wrap"
  }, [_c('input', {
    attrs: {
      "type": "text",
      "data-project_id": "60",
      "placeholder": "Search...",
      "id": "cpm-single-project-search"
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "cpm-project-action"
  }, [_c('span', {
    staticClass: "dashicons dashicons-admin-generic cpm-settings-bind"
  }), _vm._v(" "), _c('ul', {
    staticClass: "cpm-settings"
  }, [_c('li', [_c('span', {
    staticClass: "cpm-spinner"
  }), _vm._v(" "), _c('a', {
    staticClass: "cpm-project-delete-link",
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_projects",
      "title": "Delete project",
      "data-confirm": "Are you sure to delete this project?",
      "data-project_id": "60"
    }
  }, [_c('span', {
    staticClass: "dashicons dashicons-trash"
  }), _vm._v(" "), _c('span', [_vm._v("Delete")])])]), _vm._v(" "), _c('li', [_c('span', {
    staticClass: "cpm-spinner"
  }), _vm._v(" "), _c('a', {
    staticClass: "cpm-archive",
    attrs: {
      "data-type": "archive",
      "data-project_id": "60",
      "href": "#"
    }
  }, [_c('span', {
    staticClass: "dashicons dashicons-yes"
  }), _vm._v(" "), _c('span', [_vm._v("Complete")])])]), _vm._v(" "), _c('li', [_c('span', {
    staticClass: "cpm-spinner"
  }), _vm._v(" "), _c('a', {
    staticClass: "cpm-duplicate-project",
    attrs: {
      "href": "/test/wp-admin/admin.php?page=cpm_projects&tab=project&action=overview&pid=60",
      "data-project_id": "60"
    }
  }, [_c('span', {
    staticClass: "dashicons dashicons-admin-page"
  }), _vm._v(" "), _c('span', [_vm._v("Duplicate")])])])])])]), _vm._v(" "), _c('div', {
    staticClass: "clearfix"
  }), _vm._v(" "), _c('div', {
    staticClass: "cpm-edit-project",
    staticStyle: {
      "display": "none"
    }
  }, [_c('form', {
    staticClass: "cpm-project-form",
    attrs: {
      "action": "",
      "method": "post"
    }
  }, [_c('input', {
    attrs: {
      "type": "hidden",
      "id": "_wpnonce",
      "name": "_wpnonce",
      "value": "9dd08c1e0f"
    }
  }), _vm._v(" "), _c('input', {
    attrs: {
      "type": "hidden",
      "name": "_wp_http_referer",
      "value": "/test/wp-admin/admin.php?page=cpm_projects&tab=project&action=overview&pid=60"
    }
  }), _vm._v(" "), _c('div', {
    staticClass: "cpm-form-item project-name"
  }, [_c('input', {
    attrs: {
      "type": "text",
      "name": "project_name",
      "id": "project_name",
      "placeholder": "Name of the project",
      "value": "eirugkdj",
      "size": "45"
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "cpm-form-item project-category"
  }, [_c('select', {
    staticClass: "chosen-select",
    attrs: {
      "name": "project_cat",
      "id": "project_cat"
    }
  }, [_c('option', {
    attrs: {
      "value": "-1",
      "selected": "selected"
    }
  }, [_vm._v("– Project Category –")])])]), _vm._v(" "), _c('div', {
    staticClass: "cpm-form-item project-detail"
  }, [_c('textarea', {
    staticClass: "cpm-project-description",
    attrs: {
      "name": "project_description",
      "id": "",
      "cols": "50",
      "rows": "3",
      "placeholder": "Some details about the project (optional)"
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "cpm-form-item cpm-project-role"
  }, [_c('table')]), _vm._v(" "), _c('div', {
    staticClass: "cpm-form-item project-users"
  }, [_c('input', {
    staticClass: "cpm-project-coworker",
    attrs: {
      "type": "text",
      "name": "",
      "placeholder": "Type 3 or more characters to search users...",
      "size": "45"
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "cpm-form-item project-notify"
  }, [_c('input', {
    attrs: {
      "type": "hidden",
      "name": "project_notify",
      "value": "no"
    }
  }), _vm._v(" "), _c('label', [_c('input', {
    attrs: {
      "type": "checkbox",
      "name": "project_notify",
      "id": "project-notify",
      "value": "yes"
    }
  }), _vm._v("\n                        Notify Co-Workers            \n                    ")])]), _vm._v(" "), _c('div', {
    staticClass: "submit"
  }, [_c('input', {
    attrs: {
      "type": "hidden",
      "name": "project_id",
      "value": "60"
    }
  }), _vm._v(" "), _c('input', {
    attrs: {
      "type": "hidden",
      "name": "action",
      "value": "cpm_project_update"
    }
  }), _vm._v(" "), _c('span', {
    staticClass: "cpm-pro-update-spinner"
  }), _vm._v(" "), _c('input', {
    staticClass: "button-primary",
    attrs: {
      "type": "submit",
      "name": "add_project",
      "id": "add_project",
      "value": "Update Project"
    }
  }), _vm._v(" "), _c('a', {
    staticClass: "button project-cancel",
    attrs: {
      "href": "#"
    }
  }, [_vm._v("Cancel")])]), _vm._v(" "), _c('div', {
    staticClass: "cpm-loading",
    staticStyle: {
      "display": "none"
    }
  }, [_vm._v("Saving...")])])])])
}]
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-46bc394e", esExports)
  }
}

/***/ }),

/***/ 93:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_text_editor_vue__ = __webpack_require__(95);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_483c3c1e_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_text_editor_vue__ = __webpack_require__(97);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_text_editor_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_483c3c1e_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_text_editor_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "view/assets/js/components/text-editor.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] text-editor.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-483c3c1e", Component.options)
  } else {
    hotAPI.reload("data-v-483c3c1e", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 94:
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
	props: ['milestones']
});

/***/ }),

/***/ 95:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vue_vue__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vue_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__vue_vue__);
//
//
//
//




/* harmony default export */ __webpack_exports__["a"] = ({

    //mixins: cpm_todo_list_mixins( CPM_Todo_List.todo_list_text_editor ),    

    // Get passing data for this component.
    props: ['editor_id', 'content'],

    // Initial action for this component
    created: function () {
        var self = this;
        this.$root.$on('after_comment', this.afterComment);
        // After ready dom
        __WEBPACK_IMPORTED_MODULE_0__vue_vue___default.a.nextTick(function () {
            // Remove the editor
            tinymce.execCommand('mceRemoveEditor', true, self.editor_id);

            // Instantiate the editor
            var settings = {
                selector: 'textarea#' + self.editor_id,
                menubar: false,
                placeholder: 'Write a comment...',
                branding: false,

                setup: function (editor) {
                    editor.on('change', function () {
                        self.content.html = editor.getContent();
                    });
                    editor.on('keyup', function (event) {
                        self.content.html = editor.getContent();
                    });
                    editor.on('NodeChange', function () {
                        self.content.html = editor.getContent();
                    });
                },

                external_plugins: {
                    'placeholder': PM_Vars.assets_url + 'js/tinymce/plugins/placeholder/plugin.min.js'
                },

                fontsize_formats: '10px 11px 13px 14px 16px 18px 22px 25px 30px 36px 40px 45px 50px 60px 65px 70px 75px 80px',
                font_formats: 'Arial=arial,helvetica,sans-serif;' + 'Comic Sans MS=comic sans ms,sans-serif;' + 'Courier New=courier new,courier;' + 'Georgia=georgia,palatino;' + 'Lucida=Lucida Sans Unicode, Lucida Grande, sans-serif;' + 'Tahoma=tahoma,arial,helvetica,sans-serif;' + 'Times New Roman=times new roman,times;' + 'Trebuchet MS=trebuchet ms,geneva;' + 'Verdana=verdana,geneva;',
                plugins: 'placeholder textcolor colorpicker wplink wordpress',
                toolbar1: 'shortcodes bold italic strikethrough bullist numlist alignleft aligncenter alignjustify alignright link',
                toolbar2: 'formatselect forecolor backcolor underline blockquote hr code',
                toolbar3: 'fontselect fontsizeselect removeformat undo redo'
            };

            if (self.tinyMCE_settings) {
                settings = jQuery.extend(settings, self.tinyMCE_settings);
            }

            tinymce.init(settings);
        });

        //tinymce.execCommand( 'mceRemoveEditor', true, id );
        //tinymce.execCommand( 'mceAddEditor', true, id );
        //tinymce.execCommand( 'mceAddControl', true, id );
    },

    methods: {
        afterComment: function () {
            tinyMCE.get(this.editor_id).setContent('');
        }
    }
});

/***/ }),

/***/ 96:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_milestones_vue__ = __webpack_require__(94);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_57dc70cf_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_milestones_vue__ = __webpack_require__(98);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_milestones_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_57dc70cf_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_milestones_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "view/assets/js/components/milestones.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] milestones.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-57dc70cf", Component.options)
  } else {
    hotAPI.reload("data-v-57dc70cf", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 97:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('textarea', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.content.html),
      expression: "content.html"
    }],
    attrs: {
      "id": _vm.editor_id
    },
    domProps: {
      "value": (_vm.content.html)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.content.html = $event.target.value
      }
    }
  })])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-483c3c1e", esExports)
  }
}

/***/ }),

/***/ 98:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('select', [_c('option', {
    attrs: {
      "value": "-1"
    }
  }, [_vm._v("\n            - Milestone -\n        ")]), _vm._v(" "), _vm._l((_vm.milestones), function(milestone) {
    return _c('option', {
      domProps: {
        "value": milestone.id
      }
    }, [_vm._v("\n            " + _vm._s(milestone.title) + "\n        ")])
  })], 2)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-57dc70cf", esExports)
  }
}

/***/ }),

/***/ 99:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__text_editor_vue__ = __webpack_require__(93);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__milestones_vue__ = __webpack_require__(96);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
	props: ['discuss'],
	data() {
		return {
			submit_disabled: false,
			show_spinner: false,
			content: {
				html: typeof this.discuss.description == 'undefined' ? '' : this.discuss.description
			},
			milestone_id: 4
		};
	},

	watch: {
		/**
         * Observe onchange comment message
         *
         * @param string new_content 
         * 
         * @type void
         */
		content: {
			handler: function (new_content) {
				this.discuss.description = new_content.html;
			},

			deep: true
		}
	},

	components: {
		'text-editor': __WEBPACK_IMPORTED_MODULE_0__text_editor_vue__["a" /* default */],
		'milestones': __WEBPACK_IMPORTED_MODULE_1__milestones_vue__["a" /* default */]
	},
	computed: {
		milestones() {
			return this.$store.state.milestones;
		},
		/**
         * Editor ID
         * 
         * @return string
         */
		editor_id: function () {
			var discuss_id = typeof this.discuss.id === 'undefined' ? '' : '-' + this.discuss.id;
			return 'cpm-discuss-editor' + discuss_id;
		}
	},
	methods: {}

});

/***/ })

});