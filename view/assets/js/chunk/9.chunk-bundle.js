webpackJsonp([9],{

/***/ 10:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_activities_vue__ = __webpack_require__(133);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7c1aa333_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_activities_vue__ = __webpack_require__(224);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_activities_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7c1aa333_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_activities_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "view/assets/js/components/activities/activities.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] activities.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7c1aa333", Component.options)
  } else {
    hotAPI.reload("data-v-7c1aa333", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),

/***/ 133:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__header_vue__ = __webpack_require__(96);
//
//
//
//
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
        'pm-header': __WEBPACK_IMPORTED_MODULE_0__header_vue__["a" /* default */]
    }
});

/***/ }),

/***/ 149:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__directive_js__ = __webpack_require__(165);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
			'project_cat': '0',
			'project_description': '',
			'project_notify': false
			//'project_users': this.$store.state.project_users,

		};
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
				return this.$root.$store.state.project;
			}

			return {};
		},

		project_category: {
			get() {

				if (this.is_update) {
					var project = this.$root.$store.state.project;

					if (typeof project.categories !== 'undefined' && project.categories.data.length) {
						return project.categories.data[0].id;
					}
				}

				return 0;
			},

			set(cat) {
				this.project_cat = cat;
			}
		},

		project_users() {
			if (this.is_update) {
				return this.$root.$store.state.project_users;
			}

			return [];
		}
	},

	methods: {
		newProject() {
			console.log(this.project_users);return;
			var self = this;

			var request = {
				type: 'POST',

				url: this.base_url + '/cpm/v2/projects/',

				data: {
					'title': this.project_name,
					'categories': [this.project_cat],
					'description': this.project_description,
					'notify_users': this.project_notify,
					'assignees': this.formatUsers(this.project_users)
				},

				success: function (res) {
					self.$store.commit('newProject', { 'projects': res.data });
					jQuery("#cpm-project-dialog").dialog("close");
				},

				error: function (res) {}
			};

			this.httpRequest(request);
		},

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

			//console.log(this.project_users, project_users);
		}
	}
};

/* harmony default export */ __webpack_exports__["a"] = (new_project_form);

/***/ }),

/***/ 165:
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
                    context.$store.commit('setProjectUsers', { users: ui.item });
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

/***/ 177:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_project_create_form_vue__ = __webpack_require__(149);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_792d7af7_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_project_create_form_vue__ = __webpack_require__(222);
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

/***/ 222:
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
        _vm.newProject()
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
  }), _vm._v("\n\t\t\t\tNotify Co-Workers            \n\t\t\t")])]), _vm._v(" "), _vm._m(0), _vm._v(" "), _c('div', {
    staticClass: "cpm-loading",
    staticStyle: {
      "display": "none"
    }
  }, [_vm._v("Saving...")])])])
}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
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
    }
  }, [_vm._v("Cancel")])])
}]
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

/***/ 224:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "wrap cpm cpm-front-end"
  }, [_c('pm-header'), _vm._v(" "), _vm._m(0), _vm._v(" "), _c('a', {
    staticClass: "button cpm-load-more",
    attrs: {
      "href": "#",
      "data-project_id": "60",
      "data-start": "21",
      "data-total": "48"
    }
  }, [_vm._v("Load More...")])], 1)
}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('ul', {
    staticClass: "cpm_activity_list"
  }, [_c('ul', {
    staticClass: "cpm-activity-list"
  }, [_c('li', {
    staticClass: "cpm-row"
  }, [_c('div', {
    staticClass: "cpm-activity-date cpm-col-1 cpm-sm-col-12"
  }, [_c('span', [_vm._v(" 11 ")]), _vm._v(" "), _c('br'), _vm._v(" September   ")]), _vm._v(" "), _c('div', {
    staticClass: "cpm-activity-body cpm-col-11 cpm-sm-col-12 cpm-right cpm-last-col"
  }, [_c('ul', [_c('li', [_c('div', {
    staticClass: "cpm-col-8 cpm-sm-col-12"
  }, [_c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_task&user_id=1",
      "title": "admin"
    }
  }, [_vm._v("admin")]), _vm._v(" commented on a "), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_projects&tab=message&action=single&pid=60&mid=97#cpm-comment-315"
    }
  }, [_vm._v("discussion")])]), _c('div', {
    staticClass: "date cpm-col-4 cpm-sm-col-12"
  }, [_c('time', {
    attrs: {
      "datetime": "2017-09-11T13:34:52+00:00",
      "title": "2017-09-11T13:34:52+00:00"
    }
  }, [_vm._v("September 11, 2017 1:34 pm")])]), _vm._v(" "), _c('div', {
    staticClass: "clear"
  })]), _c('li', [_c('div', {
    staticClass: "cpm-col-8 cpm-sm-col-12"
  }, [_c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_task&user_id=1",
      "title": "admin"
    }
  }, [_vm._v("admin")]), _vm._v(" commented on a "), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_projects&tab=message&action=single&pid=60&mid=97#cpm-comment-313"
    }
  }, [_vm._v("discussion")])]), _c('div', {
    staticClass: "date cpm-col-4 cpm-sm-col-12"
  }, [_c('time', {
    attrs: {
      "datetime": "2017-09-11T13:34:47+00:00",
      "title": "2017-09-11T13:34:47+00:00"
    }
  }, [_vm._v("September 11, 2017 1:34 pm")])]), _vm._v(" "), _c('div', {
    staticClass: "clear"
  })]), _c('li', [_c('div', {
    staticClass: "cpm-col-8 cpm-sm-col-12"
  }, [_c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_task&user_id=1",
      "title": "admin"
    }
  }, [_vm._v("admin")]), _vm._v(" commented on a "), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_projects&tab=message&action=single&pid=60&mid=97#cpm-comment-311"
    }
  }, [_vm._v("discussion")])]), _c('div', {
    staticClass: "date cpm-col-4 cpm-sm-col-12"
  }, [_c('time', {
    attrs: {
      "datetime": "2017-09-11T13:34:41+00:00",
      "title": "2017-09-11T13:34:41+00:00"
    }
  }, [_vm._v("September 11, 2017 1:34 pm")])]), _vm._v(" "), _c('div', {
    staticClass: "clear"
  })]), _c('li', [_c('div', {
    staticClass: "cpm-col-8 cpm-sm-col-12"
  }, [_c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_task&user_id=1",
      "title": "admin"
    }
  }, [_vm._v("admin")]), _vm._v(" commented on a "), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_projects&tab=message&action=single&pid=60&mid=97#cpm-comment-309"
    }
  }, [_vm._v("discussion")])]), _c('div', {
    staticClass: "date cpm-col-4 cpm-sm-col-12"
  }, [_c('time', {
    attrs: {
      "datetime": "2017-09-11T13:34:37+00:00",
      "title": "2017-09-11T13:34:37+00:00"
    }
  }, [_vm._v("September 11, 2017 1:34 pm")])]), _vm._v(" "), _c('div', {
    staticClass: "clear"
  })]), _c('li', [_c('div', {
    staticClass: "cpm-col-8 cpm-sm-col-12"
  }, [_vm._v("Message \""), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_projects&tab=message&action=single&pid=60&mid=97"
    }
  }, [_vm._v("srthsrth")]), _vm._v("\" created by "), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_task&user_id=1",
      "title": "admin"
    }
  }, [_vm._v("admin")])]), _c('div', {
    staticClass: "date cpm-col-4 cpm-sm-col-12"
  }, [_c('time', {
    attrs: {
      "datetime": "2017-09-11T13:34:23+00:00",
      "title": "2017-09-11T13:34:23+00:00"
    }
  }, [_vm._v("September 11, 2017 1:34 pm")])]), _vm._v(" "), _c('div', {
    staticClass: "clear"
  })]), _c('li', [_c('div', {
    staticClass: "cpm-col-8 cpm-sm-col-12"
  }, [_vm._v("Message \""), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_projects&tab=message&action=single&pid=60&mid=96"
    }
  }, [_vm._v("kafd")]), _vm._v("\" created by "), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_task&user_id=1",
      "title": "admin"
    }
  }, [_vm._v("admin")])]), _c('div', {
    staticClass: "date cpm-col-4 cpm-sm-col-12"
  }, [_c('time', {
    attrs: {
      "datetime": "2017-09-11T13:34:01+00:00",
      "title": "2017-09-11T13:34:01+00:00"
    }
  }, [_vm._v("September 11, 2017 1:34 pm")])]), _vm._v(" "), _c('div', {
    staticClass: "clear"
  })]), _c('li', [_c('div', {
    staticClass: "cpm-col-8 cpm-sm-col-12"
  }, [_vm._v("Message \""), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_projects&tab=message&action=single&pid=60&mid=95"
    }
  }, [_vm._v("message 1")]), _vm._v("\" created by "), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_task&user_id=1",
      "title": "admin"
    }
  }, [_vm._v("admin")])]), _c('div', {
    staticClass: "date cpm-col-4 cpm-sm-col-12"
  }, [_c('time', {
    attrs: {
      "datetime": "2017-09-11T13:33:26+00:00",
      "title": "2017-09-11T13:33:26+00:00"
    }
  }, [_vm._v("September 11, 2017 1:33 pm")])]), _vm._v(" "), _c('div', {
    staticClass: "clear"
  })]), _c('li', [_c('div', {
    staticClass: "cpm-col-8 cpm-sm-col-12"
  }, [_vm._v("Task \""), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_projects&tab=task&action=task_single&pid=60#/task/94"
    }
  }, [_vm._v("task 1")]), _vm._v("\" updated by "), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_task&user_id=1",
      "title": "admin"
    }
  }, [_vm._v("admin")])]), _c('div', {
    staticClass: "date cpm-col-4 cpm-sm-col-12"
  }, [_c('time', {
    attrs: {
      "datetime": "2017-09-11T10:09:50+00:00",
      "title": "2017-09-11T10:09:50+00:00"
    }
  }, [_vm._v("September 11, 2017 10:09 am")])]), _vm._v(" "), _c('div', {
    staticClass: "clear"
  })]), _c('li', [_c('div', {
    staticClass: "cpm-col-8 cpm-sm-col-12"
  }, [_vm._v("Task \""), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_projects&tab=task&action=task_single&pid=60#/task/94"
    }
  }, [_vm._v("task 1")]), _vm._v("\" updated by "), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_task&user_id=1",
      "title": "admin"
    }
  }, [_vm._v("admin")])]), _c('div', {
    staticClass: "date cpm-col-4 cpm-sm-col-12"
  }, [_c('time', {
    attrs: {
      "datetime": "2017-09-11T10:09:49+00:00",
      "title": "2017-09-11T10:09:49+00:00"
    }
  }, [_vm._v("September 11, 2017 10:09 am")])]), _vm._v(" "), _c('div', {
    staticClass: "clear"
  })]), _c('li', [_c('div', {
    staticClass: "cpm-col-8 cpm-sm-col-12"
  }, [_vm._v("Task \""), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_projects&tab=task&action=task_single&pid=60#/task/94"
    }
  }, [_vm._v("task 1")]), _vm._v("\" updated by "), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_task&user_id=1",
      "title": "admin"
    }
  }, [_vm._v("admin")])]), _c('div', {
    staticClass: "date cpm-col-4 cpm-sm-col-12"
  }, [_c('time', {
    attrs: {
      "datetime": "2017-09-11T10:09:48+00:00",
      "title": "2017-09-11T10:09:48+00:00"
    }
  }, [_vm._v("September 11, 2017 10:09 am")])]), _vm._v(" "), _c('div', {
    staticClass: "clear"
  })]), _c('li', [_c('div', {
    staticClass: "cpm-col-8 cpm-sm-col-12"
  }, [_vm._v("Task \""), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_projects&tab=task&action=task_single&pid=60#/task/94"
    }
  }, [_vm._v("task 1")]), _vm._v("\" updated by "), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_task&user_id=1",
      "title": "admin"
    }
  }, [_vm._v("admin")])]), _c('div', {
    staticClass: "date cpm-col-4 cpm-sm-col-12"
  }, [_c('time', {
    attrs: {
      "datetime": "2017-09-11T08:44:05+00:00",
      "title": "2017-09-11T08:44:05+00:00"
    }
  }, [_vm._v("September 11, 2017 8:44 am")])]), _vm._v(" "), _c('div', {
    staticClass: "clear"
  })]), _c('li', [_c('div', {
    staticClass: "cpm-col-8 cpm-sm-col-12"
  }, [_vm._v("Task \""), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_projects&tab=task&action=task_single&pid=60#/task/94"
    }
  }, [_vm._v("task 1")]), _vm._v("\" updated by "), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_task&user_id=1",
      "title": "admin"
    }
  }, [_vm._v("admin")])]), _c('div', {
    staticClass: "date cpm-col-4 cpm-sm-col-12"
  }, [_c('time', {
    attrs: {
      "datetime": "2017-09-11T08:43:32+00:00",
      "title": "2017-09-11T08:43:32+00:00"
    }
  }, [_vm._v("September 11, 2017 8:43 am")])]), _vm._v(" "), _c('div', {
    staticClass: "clear"
  })]), _c('li', [_c('div', {
    staticClass: "cpm-col-8 cpm-sm-col-12"
  }, [_vm._v("Task \""), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_projects&tab=task&action=task_single&pid=60#/task/94"
    }
  }, [_vm._v("task 1")]), _vm._v("\" added to task list \""), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_projects&tab=task&action=single&pid=60#/list/93"
    }
  }, [_vm._v("List 1")]), _vm._v("\" by "), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_task&user_id=1",
      "title": "admin"
    }
  }, [_vm._v("admin")])]), _c('div', {
    staticClass: "date cpm-col-4 cpm-sm-col-12"
  }, [_c('time', {
    attrs: {
      "datetime": "2017-09-11T08:43:24+00:00",
      "title": "2017-09-11T08:43:24+00:00"
    }
  }, [_vm._v("September 11, 2017 8:43 am")])]), _vm._v(" "), _c('div', {
    staticClass: "clear"
  })]), _c('li', [_c('div', {
    staticClass: "cpm-col-8 cpm-sm-col-12"
  }, [_vm._v("Task list \""), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_projects&tab=task&action=single&pid=60#/list/93"
    }
  }, [_vm._v("List 1")]), _vm._v("\" created by "), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_task&user_id=1",
      "title": "admin"
    }
  }, [_vm._v("admin")])]), _c('div', {
    staticClass: "date cpm-col-4 cpm-sm-col-12"
  }, [_c('time', {
    attrs: {
      "datetime": "2017-09-11T08:43:15+00:00",
      "title": "2017-09-11T08:43:15+00:00"
    }
  }, [_vm._v("September 11, 2017 8:43 am")])]), _vm._v(" "), _c('div', {
    staticClass: "clear"
  })]), _c('li', [_c('div', {
    staticClass: "cpm-col-8 cpm-sm-col-12"
  }, [_vm._v("Task list \"laskdf\" deleted by "), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_task&user_id=1",
      "title": "admin"
    }
  }, [_vm._v("admin")])]), _c('div', {
    staticClass: "date cpm-col-4 cpm-sm-col-12"
  }, [_c('time', {
    attrs: {
      "datetime": "2017-09-11T08:42:32+00:00",
      "title": "2017-09-11T08:42:32+00:00"
    }
  }, [_vm._v("September 11, 2017 8:42 am")])]), _vm._v(" "), _c('div', {
    staticClass: "clear"
  })]), _c('li', [_c('div', {
    staticClass: "cpm-col-8 cpm-sm-col-12"
  }, [_vm._v("Task list \"skgfkd\" deleted by "), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_task&user_id=1",
      "title": "admin"
    }
  }, [_vm._v("admin")])]), _c('div', {
    staticClass: "date cpm-col-4 cpm-sm-col-12"
  }, [_c('time', {
    attrs: {
      "datetime": "2017-09-11T08:42:27+00:00",
      "title": "2017-09-11T08:42:27+00:00"
    }
  }, [_vm._v("September 11, 2017 8:42 am")])]), _vm._v(" "), _c('div', {
    staticClass: "clear"
  })]), _c('li', [_c('div', {
    staticClass: "cpm-col-8 cpm-sm-col-12"
  }, [_vm._v("Task list \"list 1\" deleted by "), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_task&user_id=1",
      "title": "admin"
    }
  }, [_vm._v("admin")])]), _c('div', {
    staticClass: "date cpm-col-4 cpm-sm-col-12"
  }, [_c('time', {
    attrs: {
      "datetime": "2017-09-11T08:42:21+00:00",
      "title": "2017-09-11T08:42:21+00:00"
    }
  }, [_vm._v("September 11, 2017 8:42 am")])]), _vm._v(" "), _c('div', {
    staticClass: "clear"
  })]), _c('li', [_c('div', {
    staticClass: "cpm-col-8 cpm-sm-col-12"
  }, [_vm._v("Task list \""), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_projects&tab=task&action=single&pid=60#/list/81"
    }
  }, [_vm._v("skgfkd")]), _vm._v("\" created by "), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_task&user_id=1",
      "title": "admin"
    }
  }, [_vm._v("admin")])]), _c('div', {
    staticClass: "date cpm-col-4 cpm-sm-col-12"
  }, [_c('time', {
    attrs: {
      "datetime": "2017-09-11T06:21:11+00:00",
      "title": "2017-09-11T06:21:11+00:00"
    }
  }, [_vm._v("September 11, 2017 6:21 am")])]), _vm._v(" "), _c('div', {
    staticClass: "clear"
  })]), _c('li', [_c('div', {
    staticClass: "cpm-col-8 cpm-sm-col-12"
  }, [_vm._v("Task list \""), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_projects&tab=task&action=single&pid=60#/list/80"
    }
  }, [_vm._v("laskdf")]), _vm._v("\" created by "), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_task&user_id=1",
      "title": "admin"
    }
  }, [_vm._v("admin")])]), _c('div', {
    staticClass: "date cpm-col-4 cpm-sm-col-12"
  }, [_c('time', {
    attrs: {
      "datetime": "2017-09-11T06:21:06+00:00",
      "title": "2017-09-11T06:21:06+00:00"
    }
  }, [_vm._v("September 11, 2017 6:21 am")])]), _vm._v(" "), _c('div', {
    staticClass: "clear"
  })]), _c('li', [_c('div', {
    staticClass: "cpm-col-8 cpm-sm-col-12"
  }, [_vm._v("Task list \""), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_projects&tab=task&action=single&pid=60#/list/79"
    }
  }, [_vm._v("list 1")]), _vm._v("\" created by "), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_task&user_id=1",
      "title": "admin"
    }
  }, [_vm._v("admin")])]), _c('div', {
    staticClass: "date cpm-col-4 cpm-sm-col-12"
  }, [_c('time', {
    attrs: {
      "datetime": "2017-09-11T06:21:00+00:00",
      "title": "2017-09-11T06:21:00+00:00"
    }
  }, [_vm._v("September 11, 2017 6:21 am")])]), _vm._v(" "), _c('div', {
    staticClass: "clear"
  })])])])]), _vm._v(" "), _c('div', {
    staticClass: "clearfix"
  })])])
}]
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-7c1aa333", esExports)
  }
}

/***/ }),

/***/ 95:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__router__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__do_action_vue__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__project_lists_project_create_form_vue__ = __webpack_require__(177);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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

    created() {
        this.getProject();
        this.getProjectCategories();
        this.getRoles();
    },

    components: {
        'do-action': __WEBPACK_IMPORTED_MODULE_1__do_action_vue__["a" /* default */],
        'edit-project': __WEBPACK_IMPORTED_MODULE_2__project_lists_project_create_form_vue__["a" /* default */]
    }
});

/***/ }),

/***/ 96:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_header_vue__ = __webpack_require__(95);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_46bc394e_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_header_vue__ = __webpack_require__(97);
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

/***/ 97:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "cpm-top-bar cpm-no-padding cpm-project-header cpm-project-head"
  }, [_c('div', {
    staticClass: "cpm-row cpm-no-padding cpm-border-bottom"
  }, [_vm._m(0), _vm._v(" "), _vm._m(1), _vm._v(" "), _c('div', {
    staticClass: "clearfix"
  }), _vm._v(" "), _c('div', {
    staticClass: "cpm-edit-project"
  }, [_c('edit-project', {
    attrs: {
      "is_update": true
    }
  })], 1)]), _vm._v(" "), _c('div', {
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
  })])
},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
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

/***/ })

});