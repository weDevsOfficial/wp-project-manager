webpackJsonp([7],{

/***/ 110:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_milestones_vue__ = __webpack_require__(111);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_2a0fcd1a_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_milestones_vue__ = __webpack_require__(112);
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
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_2a0fcd1a_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_milestones_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "view/assets/js/components/milestones/milestones.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] milestones.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-2a0fcd1a", Component.options)
  } else {
    hotAPI.reload("data-v-2a0fcd1a", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),

/***/ 111:
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
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ __webpack_exports__["a"] = ({});

/***/ }),

/***/ 112:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "wrap cpm cpm-front-end"
  }, [_vm._v("\n    i am milestones\n"), _vm._m(0), _vm._v(" "), _vm._m(1), _vm._v(" "), _vm._m(2), _vm._v(" "), _c('div', {
    staticClass: "cpm-row cpm-message-page"
  }, [_c('div', {
    staticClass: "cpm-message-list cpm-col-12 cpm-sm-col-12"
  }, [_c('div', {
    staticClass: "cpm-box-title"
  }, [_vm._v("Discussion List")]), _vm._v(" "), _c('ul', {
    staticClass: "dicussion-list"
  }, [_c('li', {
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
          discussion_id: 3
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
  }), _vm._v(" "), _c('div', [_vm._v("\n                       srthsrth                    \n                \t")])]), _vm._v(" "), _vm._m(3)], 1), _vm._v(" "), _vm._m(4), _vm._v(" "), _c('div', {
    staticClass: "cpm-col-2 cpm-last-col cpm-right comment-count",
    attrs: {
      "itemref": "http://localhost/test/wp-admin/admin.php?page=cpm_projects&tab=message&action=single&pid=60&mid=97"
    }
  }, [_vm._v("\n                 4 Comments            ")]), _vm._v(" "), _c('div', {
    staticClass: "clear"
  })]), _vm._v(" "), _vm._m(5), _vm._v(" "), _vm._m(6)])]), _vm._v(" "), _c('div', {
    staticClass: "clear"
  })]), _vm._v(" "), _vm._m(7)])
}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "cpm-top-bar cpm-no-padding cpm-project-header cpm-project-head"
  }, [_c('div', {
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
    staticClass: "ui-autocomplete-input",
    attrs: {
      "type": "text",
      "data-project_id": "60",
      "placeholder": "Search...",
      "id": "cpm-single-project-search",
      "autocomplete": "off"
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
      "href": "/test/wp-admin/admin.php?page=cpm_projects&tab=message&action=index&pid=60",
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
      "value": "e670638933"
    }
  }), _c('input', {
    attrs: {
      "type": "hidden",
      "name": "_wp_http_referer",
      "value": "/test/wp-admin/admin.php?page=cpm_projects&tab=message&action=index&pid=60"
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
    staticStyle: {
      "display": "none"
    },
    attrs: {
      "name": "project_cat",
      "id": "project_cat"
    }
  }, [_c('option', {
    attrs: {
      "value": "-1",
      "selected": "selected"
    }
  }, [_vm._v("– Project Category –")])]), _c('div', {
    staticClass: "chosen-container chosen-container-single",
    staticStyle: {
      "width": "300px"
    },
    attrs: {
      "title": "",
      "id": "project_cat_chosen"
    }
  }, [_c('a', {
    staticClass: "chosen-single",
    attrs: {
      "tabindex": "-1"
    }
  }, [_c('span', [_vm._v("– Project Category –")]), _c('div', [_c('b')])]), _c('div', {
    staticClass: "chosen-drop"
  }, [_c('div', {
    staticClass: "chosen-search"
  }, [_c('input', {
    attrs: {
      "type": "text",
      "autocomplete": "off"
    }
  })]), _c('ul', {
    staticClass: "chosen-results"
  })])])]), _vm._v(" "), _c('div', {
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
    staticClass: "cpm-project-coworker ui-autocomplete-input",
    attrs: {
      "type": "text",
      "name": "",
      "placeholder": "Type 3 or more characters to search users...",
      "size": "45",
      "autocomplete": "off"
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
  }), _vm._v("\n                Notify Co-Workers            ")])]), _vm._v(" "), _c('div', {
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
  }, [_vm._v("Saving...")])])])]), _vm._v(" "), _c('div', {
    staticClass: "cpm-row cpm-project-group"
  }, [_c('ul', {
    staticClass: "clearfix"
  }, [_c('li', [_c('a', {
    staticClass: "overview cpm-sm-col-12",
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_projects&tab=project&action=overview&pid=60",
      "title": "Overview"
    }
  }, [_vm._v("Overview"), _c('div')])]), _c('li', [_c('a', {
    staticClass: "activity cpm-sm-col-12",
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_projects&tab=project&action=single&pid=60",
      "title": "Activities"
    }
  }, [_vm._v("Activities"), _c('div', [_vm._v("48")])])]), _c('li', [_c('a', {
    staticClass: "message cpm-sm-col-12 active",
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_projects&tab=message&action=index&pid=60",
      "title": "Discussions"
    }
  }, [_vm._v("Discussions "), _c('div', [_vm._v("3")])])]), _c('li', [_c('a', {
    staticClass: "to-do-list cpm-sm-col-12",
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_projects&tab=task&action=index&pid=60",
      "title": "Task Lists"
    }
  }, [_vm._v("Task Lists"), _c('div', [_vm._v("1")])])]), _c('li', [_c('a', {
    staticClass: "milestone cpm-sm-col-12",
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_projects&tab=milestone&action=index&pid=60",
      "title": "Milestones"
    }
  }, [_vm._v("Milestones"), _c('div', [_vm._v("0")])])]), _c('li', [_c('a', {
    staticClass: "files cpm-sm-col-12",
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_projects&tab=files&action=index&pid=60",
      "title": "Files"
    }
  }, [_vm._v("Files"), _c('div', [_vm._v("0")])])]), _c('li', [_c('a', {
    staticClass: "settings cpm-sm-col-12",
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_projects&tab=settings&action=index&pid=60",
      "title": "Settings"
    }
  }, [_vm._v("Settings"), _c('div')])]), _c('li', [_c('a', {
    staticClass: "cpminvoice cpm-sm-col-12",
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_projects&tab=invoice&action=index&pid=60",
      "title": "Invoice"
    }
  }, [_vm._v("Invoice"), _c('div')])])])]), _vm._v(" "), _c('div', {
    staticClass: "clearfix"
  })])
},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('a', {
    staticClass: "cpm-btn cpm-plus-white cpm-new-message-btn cpm-btn-uppercase",
    attrs: {
      "href": "",
      "id": "cpm-add-message"
    }
  }, [_vm._v(" Add New Discussion ")])])
},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "cpm-new-message-form"
  }, [_c('h3', [_vm._v("Create a new message")]), _vm._v(" "), _c('form', {
    staticClass: "cpm-message-form"
  }, [_c('input', {
    attrs: {
      "type": "hidden",
      "id": "_wpnonce",
      "name": "_wpnonce",
      "value": "da9995404a"
    }
  }), _c('input', {
    attrs: {
      "type": "hidden",
      "name": "_wp_http_referer",
      "value": "/test/wp-admin/admin.php?page=cpm_projects&tab=message&action=index&pid=60"
    }
  }), _vm._v(" "), _c('div', {
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
  }), _vm._v("\n                    Private                ")])]), _vm._v(" "), _c('div', {
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
  }), _vm._v("\n        To attach, "), _c('a', {
    staticStyle: {
      "position": "relative",
      "z-index": "1"
    },
    attrs: {
      "id": "cpm-upload-pickfiles-nd",
      "href": "#"
    }
  }, [_vm._v("select files")]), _vm._v(" from your computer.    "), _c('div', {
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
  })])])]), _vm._v(" "), _c('div', {
    staticClass: "notify-users"
  }, [_c('h2', {
    staticClass: "cpm-box-title"
  }, [_vm._v(" Notify users            "), _c('label', {
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
  }), _vm._v(" Select all")])]), _vm._v(" "), _c('ul', {
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
  }), _vm._v(" Admin")])]), _vm._v(" "), _c('div', {
    staticClass: "clearfix"
  })])]), _vm._v(" "), _c('div', {
    staticClass: "submit"
  }, [_c('input', {
    attrs: {
      "type": "hidden",
      "name": "action",
      "value": "cpm_message_new"
    }
  }), _vm._v(" "), _c('input', {
    attrs: {
      "type": "hidden",
      "name": "project_id",
      "value": "60"
    }
  }), _vm._v(" "), _c('input', {
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
  }, [_vm._v("Saving...")])])])
},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "dicussion-meta"
  }, [_vm._v("\n                    By \n                    "), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_task&user_id=1",
      "title": "admin"
    }
  }, [_vm._v("\n                    \tadmin\n                    ")]), _vm._v(" \n                    on September 11, 2017 01:34 pm                    \n                ")])
},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "cpm-col-1"
  }, [_c('span', {
    staticClass: "cpm-message-action cpm-right"
  }, [_c('a', {
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
  })]), _vm._v(" "), _c('span', {
    staticClass: "cpm-unlock"
  })])])
},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('li', {
    staticClass: "cpm-col-12"
  }, [_c('div', {
    staticClass: "cpm-col-9",
    attrs: {
      "itemref": "http://localhost/test/wp-admin/admin.php?page=cpm_projects&tab=message&action=single&pid=60&mid=96"
    }
  }, [_c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_task&user_id=1",
      "title": "admin"
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
  })]), _vm._v(" "), _c('div', [_vm._v("\n                       kafd                    ")]), _vm._v(" "), _c('div', {
    staticClass: "dicussion-meta"
  }, [_vm._v("\n                        By "), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_task&user_id=1",
      "title": "admin"
    }
  }, [_vm._v("admin")]), _vm._v(" on September 11, 2017 01:34 pm                    ")])]), _vm._v(" "), _c('div', {
    staticClass: "cpm-col-1"
  }, [_c('span', {
    staticClass: "cpm-message-action cpm-right"
  }, [_c('a', {
    staticClass: "delete-message",
    attrs: {
      "href": "",
      "title": "Delete this message",
      "data-msg_id": "96",
      "data-project_id": "60",
      "data-confirm": "Are you sure to delete this message?"
    }
  }, [_c('span', {
    staticClass: "dashicons dashicons-trash"
  })]), _vm._v(" "), _c('span', {
    staticClass: "cpm-unlock"
  })])]), _vm._v(" "), _c('div', {
    staticClass: "cpm-col-2 cpm-last-col cpm-right comment-count",
    attrs: {
      "itemref": "http://localhost/test/wp-admin/admin.php?page=cpm_projects&tab=message&action=single&pid=60&mid=96"
    }
  }, [_vm._v("\n                 0 Comments            ")]), _vm._v(" "), _c('div', {
    staticClass: "clear"
  })])
},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('li', {
    staticClass: "cpm-col-12"
  }, [_c('div', {
    staticClass: "cpm-col-9",
    attrs: {
      "itemref": "http://localhost/test/wp-admin/admin.php?page=cpm_projects&tab=message&action=single&pid=60&mid=95"
    }
  }, [_c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_task&user_id=1",
      "title": "admin"
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
  })]), _vm._v(" "), _c('div', [_vm._v("\n                       message 1                    ")]), _vm._v(" "), _c('div', {
    staticClass: "dicussion-meta"
  }, [_vm._v("\n                        By "), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_task&user_id=1",
      "title": "admin"
    }
  }, [_vm._v("admin")]), _vm._v(" on September 11, 2017 01:33 pm                    ")])]), _vm._v(" "), _c('div', {
    staticClass: "cpm-col-1"
  }, [_c('span', {
    staticClass: "cpm-message-action cpm-right"
  }, [_c('a', {
    staticClass: "delete-message",
    attrs: {
      "href": "",
      "title": "Delete this message",
      "data-msg_id": "95",
      "data-project_id": "60",
      "data-confirm": "Are you sure to delete this message?"
    }
  }, [_c('span', {
    staticClass: "dashicons dashicons-trash"
  })]), _vm._v(" "), _c('span', {
    staticClass: "cpm-unlock"
  })])]), _vm._v(" "), _c('div', {
    staticClass: "cpm-col-2 cpm-last-col cpm-right comment-count",
    attrs: {
      "itemref": "http://localhost/test/wp-admin/admin.php?page=cpm_projects&tab=message&action=single&pid=60&mid=95"
    }
  }, [_vm._v("\n                 0 Comments            ")]), _vm._v(" "), _c('div', {
    staticClass: "clear"
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
  }, [_vm._v("  Discussion ")]), _vm._v(" "), _c('p', [_vm._v("\n            Use our built in discussion panel to create an open discussion, a group discussion or a private conversation. Note that the Admin can always moderate these discussions.        ")]), _vm._v(" "), _c('div', [_c('a', {
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
  }, [_c('input', {
    attrs: {
      "type": "hidden",
      "id": "_wpnonce",
      "name": "_wpnonce",
      "value": "da9995404a"
    }
  }), _c('input', {
    attrs: {
      "type": "hidden",
      "name": "_wp_http_referer",
      "value": "/test/wp-admin/admin.php?page=cpm_projects&tab=message&action=index&pid=60"
    }
  }), _vm._v(" "), _c('div', {
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
  }), _vm._v("\n                    Private                ")])]), _vm._v(" "), _c('div', {
    staticClass: "cpm-attachment-area"
  }, [_c('div', {
    attrs: {
      "id": "cpm-upload-container-nd"
    }
  }, [_c('div', {
    staticClass: "cpm-upload-filelist"
  }), _vm._v("\n        To attach, "), _c('a', {
    attrs: {
      "id": "cpm-upload-pickfiles-nd",
      "href": "#"
    }
  }, [_vm._v("select files")]), _vm._v(" from your computer.    ")])]), _vm._v(" "), _c('div', {
    staticClass: "notify-users"
  }, [_c('h2', {
    staticClass: "cpm-box-title"
  }, [_vm._v(" Notify users            "), _c('label', {
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
  }), _vm._v(" Select all")])]), _vm._v(" "), _c('ul', {
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
  }), _vm._v(" Admin")])]), _vm._v(" "), _c('div', {
    staticClass: "clearfix"
  })])]), _vm._v(" "), _c('div', {
    staticClass: "submit"
  }, [_c('input', {
    attrs: {
      "type": "hidden",
      "name": "action",
      "value": "cpm_message_new"
    }
  }), _vm._v(" "), _c('input', {
    attrs: {
      "type": "hidden",
      "name": "project_id",
      "value": "60"
    }
  }), _vm._v(" "), _c('input', {
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
     require("vue-hot-reload-api").rerender("data-v-2a0fcd1a", esExports)
  }
}

/***/ })

});