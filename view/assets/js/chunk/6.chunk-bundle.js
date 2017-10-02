webpackJsonp([6],{

/***/ 100:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__directive_js__ = __webpack_require__(102);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__project_new_user_form_vue__ = __webpack_require__(104);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




var new_project_form = {

	props: ['is_update'],

	data() {

		return {
			'project_name': '',
			'project_cat': 0,
			'project_description': '',
			'project_notify': false,
			'project_users': []

		};
	},
	components: {
		'project-new-user-form': __WEBPACK_IMPORTED_MODULE_1__project_new_user_form_vue__["a" /* default */]
	},
	computed: {
		roles() {
			return this.$root.$store.state.roles;
		},

		categories() {
			return this.$root.$store.state.categories;
		},

		project() {
			if (this.is_update) {
				this.project_users = this.$root.$store.state.project_users;
				return this.$root.$store.state.project;
			}

			return {};
		},

		project_category: {
			get() {
				if (this.is_update) {
					var project = this.$root.$store.state.project;

					if (typeof project.categories !== 'undefined' && project.categories.data.length) {

						this.project_cat = project.categories.data[0].id;

						return project.categories.data[0].id;
					}
				}

				return this.project_cat;
			},

			set(cat) {
				this.project_cat = cat;
			}
		}

	},

	methods: {

		formatUsers(users) {
			var format_users = [];

			users.map(function (user, index) {
				format_users.push({
					'user_id': user.id,
					'role_id': user.roles.data.id
				});
			});

			return format_users;
		},

		deleteUser(del_user) {
			this.project_users = this.project_users.filter(function (user) {
				if (user.id === del_user.id) {
					return false;
				} else {
					return user;
				}
			});
		}
	}
};

/* harmony default export */ __webpack_exports__["a"] = (new_project_form);

/***/ }),

/***/ 101:
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


/* harmony default export */ __webpack_exports__["a"] = ({
    props: ['project_users'],

    data() {
        return {
            username: '',
            first_name: '',
            last_name: '',
            email: ''
        };
    },

    methods: {
        createUser() {
            var self = this;

            self.httpRequest({
                url: self.base_url + '/cpm/v2/users',
                method: 'POST',
                data: {
                    username: this.username,
                    first_name: this.first_name,
                    last_name: this.last_name,
                    email: this.email
                },

                success: function (res) {
                    if (!res.data.hasOwnProperty('roles')) {
                        res.data.roles = {
                            data: {
                                description: "Co-Worker for project manager",
                                id: 1,
                                title: "Co-Worker"
                            }
                        };
                    }
                    self.project_users.push(res.data);
                    jQuery("#cpm-create-user-wrap").dialog("close");
                }
            });
        }
    }
});

/***/ }),

/***/ 102:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vue_vue__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vue_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__vue_vue__);


var Project = {
    coWorkerSearch: function (el, binding, vnode) {

        var $ = jQuery;
        var cpm_abort;
        var context = vnode.context;

        $(".cpm-project-coworker").autocomplete({
            minLength: 3,

            source: function (request, response) {
                var data = {},
                    url = context.base_url + '/cpm/v2/users/search?query=' + request.term;

                if (cpm_abort) {
                    cpm_abort.abort();
                }

                cpm_abort = $.get(url, data, function (resp) {

                    if (resp.data.length) {
                        response(resp.data);
                    } else {
                        response({
                            value: '0'
                        });
                    }
                });
            },

            search: function () {
                $(this).addClass('cpm-spinner');
            },

            open: function () {
                var self = $(this);
                self.autocomplete('widget').css('z-index', 999999);
                self.removeClass('cpm-spinner');
                return false;
            },

            select: function (event, ui) {

                if (ui.item.value === '0') {
                    $("form.cpm-user-create-form").find('input[type=text]').val('');
                    $("#cpm-create-user-wrap").dialog("open");
                } else {

                    var has_user = context.project_users.find(function (user) {
                        return ui.item.id === user.id ? true : false;
                    });

                    if (!has_user) {
                        if (!ui.item.hasOwnProperty('roles')) {
                            ui.item.roles = {
                                data: {
                                    description: "Co-Worker for project manager",
                                    id: 1,
                                    title: "Co-Worker"
                                }
                            };
                        }
                        context.project_users.push(ui.item);
                    }

                    $('.cpm-project-role>table').append(ui.item._user_meta);
                    $("input.cpm-project-coworker").val('');
                }
                return false;
            }

        }).data("ui-autocomplete")._renderItem = function (ul, item) {
            if (item.email) {
                return $("<li>").append('<a>' + item.display_name + '</a>').appendTo(ul);
            } else {
                return $("<li>").append('<a><div class="no-user-wrap"><p>No users found.</p> <span class="button-primary">Create a new user?</span></div></a>').appendTo(ul);
            }
        };
    }

    // Register a global custom directive called v-pm-popup-box
};__WEBPACK_IMPORTED_MODULE_0__vue_vue___default.a.directive('pm-users', {
    inserted: function (el, binding, vnode) {
        Project.coWorkerSearch(el, binding, vnode);
    }
});

// Register a global custom directive called v-pm-popup-box
__WEBPACK_IMPORTED_MODULE_0__vue_vue___default.a.directive('pm-popup-box', {
    inserted: function (el) {
        jQuery(el).dialog({
            autoOpen: false,
            modal: true,
            dialogClass: 'cpm-ui-dialog',
            width: 485,
            height: 'auto',
            position: ['middle', 100]
        });
    }
});

// Register a global custom directive called v-pm-popup-box
__WEBPACK_IMPORTED_MODULE_0__vue_vue___default.a.directive('cpm-user-create-popup-box', {

    inserted: function (el) {
        jQuery(function ($) {
            $(el).dialog({
                autoOpen: false,
                modal: true,
                dialogClass: 'cpm-ui-dialog cpm-user-ui-dialog',
                width: 400,
                height: 'auto',
                position: ['middle', 100]
            });
        });
    }
});

/***/ }),

/***/ 103:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_project_create_form_vue__ = __webpack_require__(100);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_792d7af7_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_project_create_form_vue__ = __webpack_require__(105);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_project_create_form_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_792d7af7_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_project_create_form_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "view/assets/js/components/project-lists/project-create-form.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] project-create-form.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-792d7af7", Component.options)
  } else {
    hotAPI.reload("data-v-792d7af7", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 104:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_project_new_user_form_vue__ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7bb6591b_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_project_new_user_form_vue__ = __webpack_require__(106);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_project_new_user_form_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7bb6591b_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_project_new_user_form_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "view/assets/js/components/project-lists/project-new-user-form.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] project-new-user-form.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7bb6591b", Component.options)
  } else {
    hotAPI.reload("data-v-7bb6591b", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 105:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('form', {
    staticClass: "cpm-project-form",
    attrs: {
      "action": "",
      "method": "post"
    },
    on: {
      "submit": function($event) {
        $event.preventDefault();
        _vm.newProject();
      }
    }
  }, [_c('div', {
    staticClass: "cpm-form-item project-name"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.project.title),
      expression: "project.title"
    }],
    attrs: {
      "type": "text",
      "name": "project_name",
      "id": "project_name",
      "placeholder": "Name of the project",
      "value": "",
      "size": "45"
    },
    domProps: {
      "value": (_vm.project.title)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.project.title = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "cpm-form-item project-category"
  }, [_c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.project_category),
      expression: "project_category"
    }],
    staticClass: "chosen-select",
    attrs: {
      "name": "project_cat",
      "id": "project_cat"
    },
    on: {
      "change": function($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
          return o.selected
        }).map(function(o) {
          var val = "_value" in o ? o._value : o.value;
          return val
        });
        _vm.project_category = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
      }
    }
  }, [_c('option', {
    attrs: {
      "value": "0"
    }
  }, [_vm._v("– Project Category –")]), _vm._v(" "), _vm._l((_vm.categories), function(category) {
    return _c('option', {
      domProps: {
        "value": category.id
      }
    }, [_vm._v(_vm._s(category.title))])
  })], 2)]), _vm._v(" "), _c('div', {
    staticClass: "cpm-form-item project-detail"
  }, [_c('textarea', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.project.description),
      expression: "project.description"
    }],
    staticClass: "cpm-project-description",
    attrs: {
      "name": "project_description",
      "id": "",
      "cols": "50",
      "rows": "3",
      "placeholder": "Some details about the project (optional)"
    },
    domProps: {
      "value": (_vm.project.description)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.project.description = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "cpm-form-item cpm-project-role"
  }, [_c('table', _vm._l((_vm.project_users), function(projectUser) {
    return _c('tr', [_c('td', [_vm._v(_vm._s(projectUser.display_name))]), _vm._v(" "), _c('td', [_c('select', {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: (projectUser.roles.data.id),
        expression: "projectUser.roles.data.id"
      }],
      on: {
        "change": function($event) {
          var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
            return o.selected
          }).map(function(o) {
            var val = "_value" in o ? o._value : o.value;
            return val
          });
          projectUser.roles.data.id = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
        }
      }
    }, _vm._l((_vm.roles), function(role) {
      return _c('option', {
        domProps: {
          "value": role.id
        }
      }, [_vm._v(_vm._s(role.title))])
    }))]), _vm._v(" "), _c('td', [_c('a', {
      staticClass: "cpm-del-proj-role cpm-assign-del-user",
      attrs: {
        "hraf": "#"
      },
      on: {
        "click": function($event) {
          $event.preventDefault();
          _vm.deleteUser(projectUser)
        }
      }
    }, [_c('span', {
      staticClass: "dashicons dashicons-trash"
    }), _vm._v(" "), _c('span', {
      staticClass: "title"
    }, [_vm._v("Delete")])])])])
  }))]), _vm._v(" "), _c('div', {
    staticClass: "cpm-form-item project-users"
  }, [_c('input', {
    directives: [{
      name: "pm-users",
      rawName: "v-pm-users"
    }],
    staticClass: "cpm-project-coworker",
    attrs: {
      "type": "text",
      "name": "user",
      "placeholder": "Type 3 or more characters to search users...",
      "size": "45"
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "cpm-form-item project-notify"
  }, [_c('label', [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.project_notify),
      expression: "project_notify"
    }],
    attrs: {
      "type": "checkbox",
      "name": "project_notify",
      "id": "project-notify",
      "value": "yes"
    },
    domProps: {
      "checked": Array.isArray(_vm.project_notify) ? _vm._i(_vm.project_notify, "yes") > -1 : (_vm.project_notify)
    },
    on: {
      "__c": function($event) {
        var $$a = _vm.project_notify,
          $$el = $event.target,
          $$c = $$el.checked ? (true) : (false);
        if (Array.isArray($$a)) {
          var $$v = "yes",
            $$i = _vm._i($$a, $$v);
          if ($$el.checked) {
            $$i < 0 && (_vm.project_notify = $$a.concat($$v))
          } else {
            $$i > -1 && (_vm.project_notify = $$a.slice(0, $$i).concat($$a.slice($$i + 1)))
          }
        } else {
          _vm.project_notify = $$c
        }
      }
    }
  }), _vm._v("\n\t\t\t\tNotify Co-Workers            \n\t\t\t")])]), _vm._v(" "), _c('div', {
    staticClass: "submit"
  }, [_c('input', {
    attrs: {
      "type": "hidden",
      "name": "action",
      "value": "cpm_project_new"
    }
  }), _vm._v(" "), _c('span', {
    staticClass: "cpm-pro-update-spinner"
  }), _vm._v(" "), _c('input', {
    staticClass: "button-primary",
    attrs: {
      "type": "submit",
      "name": "add_project",
      "id": "add_project",
      "value": "Add New Project"
    }
  }), _vm._v(" "), _c('a', {
    staticClass: "button project-cancel",
    attrs: {
      "href": "#"
    },
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.showHideProjectForm(false)
      }
    }
  }, [_vm._v("Cancel")])]), _vm._v(" "), _c('div', {
    staticClass: "cpm-loading",
    staticStyle: {
      "display": "none"
    }
  }, [_vm._v("Saving...")])]), _vm._v(" "), _c('div', {
    directives: [{
      name: "cpm-user-create-popup-box",
      rawName: "v-cpm-user-create-popup-box"
    }],
    attrs: {
      "id": "cpm-create-user-wrap",
      "title": "Create a new user"
    }
  }, [_c('project-new-user-form', {
    attrs: {
      "project_users": _vm.project_users
    }
  })], 1)])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-792d7af7", esExports)
  }
}

/***/ }),

/***/ 106:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "cpm-create-user-form-wrap"
  }, [_c('div', {
    staticClass: "cpm-error"
  }), _vm._v(" "), _c('form', {
    staticClass: "cpm-user-create-form",
    attrs: {
      "action": ""
    },
    on: {
      "submit": function($event) {
        $event.preventDefault();
        _vm.createUser()
      }
    }
  }, [_c('div', {
    staticClass: "cpm-field-wrap"
  }, [_c('label', [_vm._v("Username")]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.username),
      expression: "username"
    }],
    attrs: {
      "type": "text",
      "required": "",
      "name": "user_name"
    },
    domProps: {
      "value": (_vm.username)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.username = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "cpm-field-wrap"
  }, [_c('label', [_vm._v("First Name")]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.first_name),
      expression: "first_name"
    }],
    attrs: {
      "type": "text",
      "name": "first_name"
    },
    domProps: {
      "value": (_vm.first_name)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.first_name = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "cpm-field-wrap"
  }, [_c('label', [_vm._v("Last Name")]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.last_name),
      expression: "last_name"
    }],
    attrs: {
      "type": "text",
      "name": "last_name"
    },
    domProps: {
      "value": (_vm.last_name)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.last_name = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "cpm-field-wrap"
  }, [_c('label', [_vm._v("Email")]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.email),
      expression: "email"
    }],
    attrs: {
      "type": "email",
      "required": "",
      "name": "email"
    },
    domProps: {
      "value": (_vm.email)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.email = $event.target.value
      }
    }
  })]), _vm._v(" "), _vm._m(0)])])
}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('input', {
    staticClass: "button-primary",
    attrs: {
      "type": "submit",
      "value": "Create User",
      "name": "create_user"
    }
  }), _vm._v(" "), _c('span')])
}]
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-7bb6591b", esExports)
  }
}

/***/ }),

/***/ 107:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__router__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__do_action_vue__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__project_lists_project_create_form_vue__ = __webpack_require__(103);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
    },

    computed: {
        is_project_edit_mode() {
            return this.$root.$store.state.is_project_form_active;
        }
    },

    created() {
        this.getProject();
        this.getProjectCategories();
        this.getRoles();
    },

    components: {
        'do-action': __WEBPACK_IMPORTED_MODULE_1__do_action_vue__["a" /* default */],
        'edit-project': __WEBPACK_IMPORTED_MODULE_2__project_lists_project_create_form_vue__["a" /* default */]
    },

    methods: {}
});

/***/ }),

/***/ 108:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_header_vue__ = __webpack_require__(107);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_46bc394e_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_header_vue__ = __webpack_require__(109);
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

/***/ 109:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
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
    },
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.showHideProjectForm('toggle')
      }
    }
  }, [_c('span', {
    staticClass: "dashicons dashicons-edit"
  }), _vm._v(" "), _c('span', {
    staticClass: "text"
  }, [_vm._v("Edit")])])]), _vm._v(" "), _c('div', {
    staticClass: "detail"
  })]), _vm._v(" "), _vm._m(0), _vm._v(" "), _c('div', {
    staticClass: "clearfix"
  }), _vm._v(" "), (_vm.is_project_edit_mode) ? _c('div', {
    staticClass: "cpm-edit-project"
  }, [_c('edit-project', {
    attrs: {
      "is_update": true
    }
  })], 1) : _vm._e()]), _vm._v(" "), _c('div', {
    staticClass: "cpm-row cpm-project-group"
  }, [_c('ul', [_vm._l((_vm.menu), function(item) {
    return _c('li', [_c('router-link', {
      class: item.class,
      attrs: {
        "to": item.route
      }
    }, [_c('span', [_vm._v(_vm._s(item.name))]), _vm._v(" "), _c('div', [_vm._v(_vm._s(item.count))])])], 1)
  }), _vm._v(" "), _c('do-action', {
    attrs: {
      "hook": "pm-header"
    }
  })], 2)]), _vm._v(" "), _c('div', {
    staticClass: "clearfix"
  })])
}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
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
  }), _vm._v(" "), _c('span', [_vm._v("Duplicate")])])])])])])
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

/***/ 11:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_discussions_vue__ = __webpack_require__(171);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_13e4976b_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_discussions_vue__ = __webpack_require__(223);
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

/***/ 110:
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

/***/ 111:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_pagination_vue__ = __webpack_require__(110);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_00b52034_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_pagination_vue__ = __webpack_require__(112);
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

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 112:
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

/***/ }),

/***/ 113:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_text_editor_vue__ = __webpack_require__(114);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_483c3c1e_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_text_editor_vue__ = __webpack_require__(116);
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

/***/ 114:
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

/***/ 116:
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

/***/ 142:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_file_uploader_vue__ = __webpack_require__(145);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_4d9a1383_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_file_uploader_vue__ = __webpack_require__(163);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_file_uploader_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_4d9a1383_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_file_uploader_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "view/assets/js/components/file-uploader.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] file-uploader.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-4d9a1383", Component.options)
  } else {
    hotAPI.reload("data-v-4d9a1383", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 144:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__text_editor_vue__ = __webpack_require__(113);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__file_uploader_vue__ = __webpack_require__(142);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
			milestone_id: typeof this.discuss.milestone === 'undefined' ? '-1' : this.discuss.milestone.data.id,
			files: [],
			pfiles: []
		};
	},

	watch: {
		milestone_id(milestone_id) {
			this.discuss.milestone_id = milestone_id;
		},
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
		'file-uploader': __WEBPACK_IMPORTED_MODULE_1__file_uploader_vue__["a" /* default */]
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
	methods: {
		filesChange($event, $files) {
			this.pfiles = $files;
		}
	}

});

/***/ }),

/***/ 145:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vue_vue__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vue_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__vue_vue__);
//
//
//
//
//
//
//
//
//
//
//
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
				props: ['files'],

				// Initial action for this component
				created: function () {
								//this.$on( 'cpm_file_upload_hook', this.fileUploaded );

								var self = this;

								// Instantiate file upload, After dom ready
								__WEBPACK_IMPORTED_MODULE_0__vue_vue___default.a.nextTick(function () {
												new CPM_Uploader('cpm-upload-pickfiles', 'cpm-upload-container', self);
								});
				},

				methods: {
								/**
         * Set the uploaded file
         *
         * @param  object file_res
         *
         * @return void
         */
								fileUploaded: function (file_res) {

												if (typeof this.files == 'undefined') {
																this.files = [];
												}

												this.files.push(file_res.res.file);
								},

								/**
         * Delete file
         *
         * @param  object file_id
         *
         * @return void
         */
								deletefile: function (file_id) {
												if (!confirm(CPM_Vars.message.confirm)) {
																return;
												}

												var request_data = {
																file_id: file_id,
																_wpnonce: CPM_Vars.nonce
												},
												    self = this;

												wp.ajax.send('cpm_delete_file', {
																data: request_data,
																success: function (res) {
																				var file_index = self.getIndex(self.files, file_id, 'id');
																				self.files.splice(file_index, 1);
																}
												});
								}
				}
});

/***/ }),

/***/ 152:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_new_discuss_form_vue__ = __webpack_require__(144);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_602b6da4_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_new_discuss_form_vue__ = __webpack_require__(164);
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

/***/ 163:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "cpm-attachment-area"
  }, [_c('div', {
    attrs: {
      "id": "cpm-upload-container"
    }
  }, [_c('div', {
    staticClass: "cpm-upload-filelist"
  }, _vm._l((_vm.files), function(file) {
    return _c('div', {
      key: file.id,
      staticClass: "cpm-uploaded-item"
    }, [_c('a', {
      attrs: {
        "href": file.url,
        "target": "_blank"
      }
    }, [_c('img', {
      attrs: {
        "src": file.thumb,
        "alt": file.name
      }
    })]), _vm._v(" "), _c('a', {
      staticClass: "button",
      attrs: {
        "href": "#"
      },
      on: {
        "click": function($event) {
          $event.preventDefault();
          _vm.deletefile(file.id)
        }
      }
    }, [_vm._v("Delete File")])])
  })), _vm._v("\n        To attach, "), _c('a', {
    attrs: {
      "id": "cpm-upload-pickfiles",
      "href": "#"
    }
  }, [_vm._v("select files")]), _vm._v(" from your computer.\n    ")])])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-4d9a1383", esExports)
  }
}

/***/ }),

/***/ 164:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('form', {
    staticClass: "cpm-message-form",
    attrs: {
      "id": "myForm",
      "enctype": "multipart/form-data"
    },
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
      value: (_vm.milestone_id),
      expression: "milestone_id"
    }],
    on: {
      "change": function($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
          return o.selected
        }).map(function(o) {
          var val = "_value" in o ? o._value : o.value;
          return val
        });
        _vm.milestone_id = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
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
  })], 2)]), _vm._v(" "), _c('file-uploader', {
    attrs: {
      "files": _vm.files
    }
  }), _vm._v(" "), _c('input', {
    attrs: {
      "type": "file",
      "name": "myfiles",
      "multiple": ""
    },
    on: {
      "change": function($event) {
        _vm.filesChange($event.target.name, $event.target.files)
      }
    }
  }), _vm._v(" "), _vm._m(0), _vm._v(" "), _c('div', {
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
  }, [_vm._v("Saving...")])], 1)])
}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
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

/***/ 171:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__header_vue__ = __webpack_require__(108);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__new_discuss_form_vue__ = __webpack_require__(152);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__pagination_vue__ = __webpack_require__(111);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
    data() {
        return {
            current_page_number: 1
        };
    },
    watch: {
        '$route'(route) {
            this.getDiscussion(this);
        }
    },
    components: {
        'pm-header': __WEBPACK_IMPORTED_MODULE_0__header_vue__["a" /* default */],
        'new-discuss-form': __WEBPACK_IMPORTED_MODULE_1__new_discuss_form_vue__["a" /* default */],
        'pm-pagination': __WEBPACK_IMPORTED_MODULE_2__pagination_vue__["a" /* default */]
    },
    computed: {
        is_discuss_form_active() {
            return this.$store.state.is_discuss_form_active;
        },

        discussion() {
            return this.$store.state.discussion;
        },

        total_discussion_page() {
            return this.$store.state.meta.total_pages;
        }
    }

});

/***/ }),

/***/ 223:
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
      staticClass: "cpm-col-9"
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
        "alt": discuss.creator.data.display_name,
        "src": discuss.creator.data.avatar_url,
        "height": "48",
        "width": "48"
      }
    }), _vm._v(" "), _c('div', [_vm._v("\n                                   " + _vm._s(discuss.title) + "                    \n                            \t")])]), _vm._v(" "), _c('div', {
      staticClass: "dicussion-meta"
    }, [_vm._v("\n                                By \n                                "), _c('a', {
      attrs: {
        "href": "#",
        "title": discuss.creator.data.display_name
      }
    }, [_vm._v("\n                                \t" + _vm._s(discuss.creator.data.display_name) + "\n                                ")]), _vm._v(" \n                                on \n                                " + _vm._s(discuss.created_at.date) + "                  \n                            ")])], 1), _vm._v(" "), _c('div', {
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
    }), _vm._v(" "), _c('a', {
      staticClass: "delete-message",
      attrs: {
        "href": "",
        "title": "Delete this message",
        "data-msg_id": "97",
        "data-project_id": "60",
        "data-confirm": "Are you sure to delete this message?"
      },
      on: {
        "click": function($event) {
          $event.preventDefault();
          _vm.deleteDiscuss(discuss.id)
        }
      }
    }, [_c('span', {
      staticClass: "dashicons dashicons-trash"
    })]), _vm._v(" "), _c('span', {
      staticClass: "cpm-unlock"
    })])]), _vm._v(" "), _c('div', {
      staticClass: "cpm-col-2 cpm-last-col cpm-right comment-count"
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
    }, [_vm._v("\n                                " + _vm._s(discuss.meta.total_comments) + " Comments \n                            ")])], 1), _vm._v(" "), _c('div', {
      staticClass: "clear"
    }), _vm._v(" "), (discuss.edit_mode) ? _c('new-discuss-form', {
      attrs: {
        "discuss": discuss
      }
    }) : _vm._e()], 1)
  }))]), _vm._v(" "), _c('div', {
    staticClass: "clear"
  })]), _vm._v(" "), _c('pm-pagination', {
    attrs: {
      "total_pages": _vm.total_discussion_page,
      "current_page_number": _vm.current_page_number,
      "component_name": "discussion_pagination"
    }
  })], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-13e4976b", esExports)
  }
}

/***/ })

});