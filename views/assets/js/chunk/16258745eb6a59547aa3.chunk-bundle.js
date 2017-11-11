wedevsPmWebpack([4],{

/***/ 134:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__directive_js__ = __webpack_require__(136);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__directive_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__directive_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__project_new_user_form_vue__ = __webpack_require__(138);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
			'assignees': [],
			show_spinner: false
		};
	},
	components: {
		'project-new-user-form': __WEBPACK_IMPORTED_MODULE_1__project_new_user_form_vue__["a" /* default */]
	},
	created() {
		this.setProjectUser();
	},
	computed: {
		roles() {
			return this.$root.$store.state.roles;
		},

		categories() {
			return this.$root.$store.state.categories;
		},

		project() {
			var projects = this.$root.$store.state.projects;
			var index = this.getIndex(projects, this.project_id, 'id');

			if (index !== false) {
				return projects[index];
			}
			return {};
		},

		selectedUsers() {
			return this.$root.$store.state.assignees;
		},

		// project_users () {
		// 	var projects = this.$root.$store.state.projects;
		//              var index = this.getIndex(projects, this.project_id, 'id');

		//              if ( index !== false ) {
		//              	return projects[index].assignees.data;
		//              } 
		// 	return [];
		// },


		project_category: {
			get() {
				if (this.is_update) {
					var projects = this.$root.$store.state.projects;
					var index = this.getIndex(projects, this.project_id, 'id');
					var project = projects[index];

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

		deleteUser(del_user) {
			this.$root.$store.commit('afterDeleteUserFromProject', {
				project_id: this.project_id,
				user_id: del_user.id
			});
		},

		selfNewProject() {
			this.show_spinner = true;
			var self = this;
			if (this.is_update) {
				this.updateSelfProject();
			} else {
				this.newProject(function () {
					self.show_spinner = false;
				});
			}
		},

		updateSelfProject() {
			var data = {
				'id': this.project.id,
				'title': this.project.title,
				'categories': [this.project_cat],
				'description': this.project.description,
				'notify_users': this.project_notify,
				'assignees': this.formatUsers(this.selectedUsers),
				'status': typeof this.project.status === 'undefined' ? 'incomplete' : this.project.status
			},
			    self = this;

			self.updateProject(data, function (res) {
				self.show_spinner = false;
			});
		},
		setProjectUser() {
			var projects = this.$root.$store.state.projects;
			var index = this.getIndex(projects, this.project_id, 'id');

			if (index !== false && this.is_update) {
				this.$root.$store.commit('setSeletedUser', projects[index].assignees.data);
			}
		}
	}
};

/* harmony default export */ __webpack_exports__["a"] = (new_project_form);

/***/ }),

/***/ 135:
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


/* harmony default export */ __webpack_exports__["a"] = ({
    data() {
        return {
            username: '',
            first_name: '',
            last_name: '',
            email: '',
            show_spinner: false
        };
    },

    methods: {
        createUser() {
            var self = this;
            this.show_spinner = true;

            self.httpRequest({
                url: self.base_url + '/pm/v2/users',
                method: 'POST',
                data: {
                    username: this.username,
                    first_name: this.first_name,
                    last_name: this.last_name,
                    email: this.email
                },

                success: function (res) {
                    self.addUserMeta(res.data);
                    self.show_spinner = false;

                    // self.$root.$store.commit(
                    //     'setNewUser',
                    //     {
                    //         project_id: self.project_id,
                    //         user: res.data
                    //     }
                    // );

                    self.$root.$store.commit('updateSeletedUser', res.data);
                    jQuery("#pm-create-user-wrap").dialog("close");
                }
            });
        }
    }
});

/***/ }),

/***/ 136:
/***/ (function(module, exports) {


var Project = {
    coWorkerSearch: function (el, binding, vnode) {

        var $ = jQuery;
        var pm_abort;
        var context = vnode.context;

        $(".pm-project-coworker").autocomplete({
            minLength: 3,

            source: function (request, response) {
                var data = {},
                    url = context.base_url + '/pm/v2/users/search?query=' + request.term;

                if (pm_abort) {
                    pm_abort.abort();
                }

                pm_abort = $.get(url, data, function (resp) {

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
                $(this).addClass('pm-spinner');
            },

            open: function () {
                var self = $(this);
                self.autocomplete('widget').css('z-index', 999999);
                self.removeClass('pm-spinner');
                return false;
            },

            select: function (event, ui) {
                if (ui.item.value === '0') {
                    $("form.pm-user-create-form").find('input[type=text]').val('');
                    $("#pm-create-user-wrap").dialog("open");
                } else {

                    var has_user = context.selectedUsers.find(function (user) {
                        return ui.item.id === user.id ? true : false;
                    });

                    if (!has_user) {
                        context.addUserMeta(ui.item);
                        // context.$root.$store.commit(
                        //     'setNewUser',
                        //     {
                        //         project_id: context.project_id,
                        //         user: ui.item
                        //     }
                        // );
                        context.$root.$store.commit('updateSeletedUser', ui.item);
                    }

                    $('.pm-project-role>table').append(ui.item._user_meta);
                    $("input.pm-project-coworker").val('');
                }
                return false;
            }

        }).data("ui-autocomplete")._renderItem = function (ul, item) {
            var no_user = context.text.no_user_found,
                create_new_user = context.text.create_new_user;
            if (item.email) {
                return $("<li>").append('<a>' + item.display_name + '</a>').appendTo(ul);
            } else {
                return $("<li>").append('<a><div class="no-user-wrap"><p>' + no_user + '</p> <span class="button-primary">' + create_new_user + '</span></div></a>').appendTo(ul);
            }
        };
    }

    // Register a global custom directive called v-pm-popup-box
};pm.Vue.directive('pm-users', {
    inserted: function (el, binding, vnode) {
        Project.coWorkerSearch(el, binding, vnode);
    }
});

// Register a global custom directive called v-pm-popup-box
pm.Vue.directive('pm-popup-box', {
    inserted: function (el) {
        jQuery(el).dialog({
            autoOpen: false,
            modal: true,
            dialogClass: 'pm-ui-dialog',
            width: 485,
            height: 'auto',
            position: ['middle', 100]
        });
    }
});

// Register a global custom directive called v-pm-popup-box
pm.Vue.directive('pm-user-create-popup-box', {

    inserted: function (el) {
        jQuery(function ($) {
            $(el).dialog({
                autoOpen: false,
                modal: true,
                dialogClass: 'pm-ui-dialog pm-user-ui-dialog',
                width: 400,
                height: 'auto',
                position: ['middle', 100]
            });
        });
    }
});

/***/ }),

/***/ 137:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_project_create_form_vue__ = __webpack_require__(134);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_005bbc60_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_project_create_form_vue__ = __webpack_require__(139);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_project_create_form_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_005bbc60_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_project_create_form_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/components/project-lists/project-create-form.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-005bbc60", Component.options)
  } else {
    hotAPI.reload("data-v-005bbc60", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 138:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_project_new_user_form_vue__ = __webpack_require__(135);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_1f4c3778_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_project_new_user_form_vue__ = __webpack_require__(140);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_project_new_user_form_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_1f4c3778_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_project_new_user_form_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/components/project-lists/project-new-user-form.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-1f4c3778", Component.options)
  } else {
    hotAPI.reload("data-v-1f4c3778", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 139:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", [
    _c(
      "form",
      {
        staticClass: "pm-project-form",
        attrs: { action: "", method: "post" },
        on: {
          submit: function($event) {
            $event.preventDefault()
            _vm.selfNewProject()
          }
        }
      },
      [
        _c("div", { staticClass: "pm-form-item project-name" }, [
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model",
                value: _vm.project.title,
                expression: "project.title"
              }
            ],
            attrs: {
              type: "text",
              name: "project_name",
              id: "project_name",
              placeholder: _vm.text.name_of_the_project,
              value: "",
              size: "45"
            },
            domProps: { value: _vm.project.title },
            on: {
              input: function($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.$set(_vm.project, "title", $event.target.value)
              }
            }
          })
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "pm-form-item project-category" }, [
          _c(
            "select",
            {
              directives: [
                {
                  name: "model",
                  rawName: "v-model",
                  value: _vm.project_category,
                  expression: "project_category"
                }
              ],
              staticClass: "chosen-select",
              staticStyle: { height: "35px" },
              attrs: { name: "project_cat", id: "project_cat" },
              on: {
                change: function($event) {
                  var $$selectedVal = Array.prototype.filter
                    .call($event.target.options, function(o) {
                      return o.selected
                    })
                    .map(function(o) {
                      var val = "_value" in o ? o._value : o.value
                      return val
                    })
                  _vm.project_category = $event.target.multiple
                    ? $$selectedVal
                    : $$selectedVal[0]
                }
              }
            },
            [
              _c("option", { attrs: { value: "0" } }, [
                _vm._v(_vm._s(_vm.text.project_category))
              ]),
              _vm._v(" "),
              _vm._l(_vm.categories, function(category) {
                return _c("option", { domProps: { value: category.id } }, [
                  _vm._v(_vm._s(category.title))
                ])
              })
            ],
            2
          )
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "pm-form-item project-detail" }, [
          _c("textarea", {
            directives: [
              {
                name: "model",
                rawName: "v-model",
                value: _vm.project.description,
                expression: "project.description"
              }
            ],
            staticClass: "pm-project-description",
            attrs: {
              name: "project_description",
              id: "",
              cols: "50",
              rows: "3",
              placeholder: _vm.text.project_dsc_input
            },
            domProps: { value: _vm.project.description },
            on: {
              input: function($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.$set(_vm.project, "description", $event.target.value)
              }
            }
          })
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "pm-form-item pm-project-role" }, [
          _c(
            "table",
            _vm._l(_vm.selectedUsers, function(projectUser) {
              return _c("tr", { key: "projectUser.id" }, [
                _c("td", [_vm._v(_vm._s(projectUser.display_name))]),
                _vm._v(" "),
                _c("td", [
                  _c(
                    "select",
                    {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model",
                          value: projectUser.roles.data[0].id,
                          expression: "projectUser.roles.data[0].id"
                        }
                      ],
                      on: {
                        change: function($event) {
                          var $$selectedVal = Array.prototype.filter
                            .call($event.target.options, function(o) {
                              return o.selected
                            })
                            .map(function(o) {
                              var val = "_value" in o ? o._value : o.value
                              return val
                            })
                          _vm.$set(
                            projectUser.roles.data[0],
                            "id",
                            $event.target.multiple
                              ? $$selectedVal
                              : $$selectedVal[0]
                          )
                        }
                      }
                    },
                    _vm._l(_vm.roles, function(role) {
                      return _c("option", { domProps: { value: role.id } }, [
                        _vm._v(_vm._s(role.title))
                      ])
                    })
                  )
                ]),
                _vm._v(" "),
                _c("td", [
                  _c(
                    "a",
                    {
                      staticClass: "pm-del-proj-role pm-assign-del-user",
                      attrs: { hraf: "#" },
                      on: {
                        click: function($event) {
                          $event.preventDefault()
                          _vm.deleteUser(projectUser)
                        }
                      }
                    },
                    [
                      _c("span", { staticClass: "dashicons dashicons-trash" }),
                      _vm._v(" "),
                      _c("span", { staticClass: "title" }, [
                        _vm._v(_vm._s(_vm.text.delete))
                      ])
                    ]
                  )
                ])
              ])
            })
          )
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "pm-form-item project-users" }, [
          _c("input", {
            directives: [{ name: "pm-users", rawName: "v-pm-users" }],
            staticClass: "pm-project-coworker",
            attrs: {
              type: "text",
              name: "user",
              placeholder: _vm.text.project_user_input,
              size: "45"
            }
          })
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "pm-form-item project-notify" }, [
          _c("label", [
            _c("input", {
              directives: [
                {
                  name: "model",
                  rawName: "v-model",
                  value: _vm.project_notify,
                  expression: "project_notify"
                }
              ],
              attrs: {
                type: "checkbox",
                name: "project_notify",
                id: "project-notify",
                value: "yes"
              },
              domProps: {
                checked: Array.isArray(_vm.project_notify)
                  ? _vm._i(_vm.project_notify, "yes") > -1
                  : _vm.project_notify
              },
              on: {
                change: function($event) {
                  var $$a = _vm.project_notify,
                    $$el = $event.target,
                    $$c = $$el.checked ? true : false
                  if (Array.isArray($$a)) {
                    var $$v = "yes",
                      $$i = _vm._i($$a, $$v)
                    if ($$el.checked) {
                      $$i < 0 && (_vm.project_notify = $$a.concat([$$v]))
                    } else {
                      $$i > -1 &&
                        (_vm.project_notify = $$a
                          .slice(0, $$i)
                          .concat($$a.slice($$i + 1)))
                    }
                  } else {
                    _vm.project_notify = $$c
                  }
                }
              }
            }),
            _vm._v(
              "\n\t\t\t\t" +
                _vm._s(_vm.text.notify_co_workers) +
                "            \n\t\t\t"
            )
          ])
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "submit" }, [
          _vm.is_update
            ? _c("input", {
                staticClass: "button-primary",
                attrs: {
                  type: "submit",
                  name: "update_project",
                  id: "update_project"
                },
                domProps: { value: _vm.text.update_project }
              })
            : _vm._e(),
          _vm._v(" "),
          !_vm.is_update
            ? _c("input", {
                staticClass: "button-primary",
                attrs: {
                  type: "submit",
                  name: "add_project",
                  id: "add_project"
                },
                domProps: { value: _vm.text.create_a_project }
              })
            : _vm._e(),
          _vm._v(" "),
          _c(
            "a",
            {
              staticClass: "button project-cancel",
              attrs: { href: "#" },
              on: {
                click: function($event) {
                  $event.preventDefault()
                  _vm.showHideProjectForm(false)
                }
              }
            },
            [_vm._v(_vm._s(_vm.text.cancel))]
          ),
          _vm._v(" "),
          _c("span", {
            directives: [
              {
                name: "show",
                rawName: "v-show",
                value: _vm.show_spinner,
                expression: "show_spinner"
              }
            ],
            staticClass: "pm-loading"
          })
        ])
      ]
    ),
    _vm._v(" "),
    _c(
      "div",
      {
        directives: [
          {
            name: "pm-user-create-popup-box",
            rawName: "v-pm-user-create-popup-box"
          }
        ],
        attrs: { id: "pm-create-user-wrap", title: _vm.text.create_a_new_user }
      },
      [_c("project-new-user-form")],
      1
    )
  ])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-005bbc60", esExports)
  }
}

/***/ }),

/***/ 140:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "pm-create-user-form-wrap" }, [
    _c("div", { staticClass: "pm-error" }),
    _vm._v(" "),
    _c(
      "form",
      {
        staticClass: "pm-user-create-form",
        attrs: { action: "" },
        on: {
          submit: function($event) {
            $event.preventDefault()
            _vm.createUser()
          }
        }
      },
      [
        _c("div", { staticClass: "pm-field-wrap" }, [
          _c("label", [_vm._v(_vm._s(_vm.text.username))]),
          _vm._v(" "),
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model",
                value: _vm.username,
                expression: "username"
              }
            ],
            attrs: { type: "text", required: "", name: "user_name" },
            domProps: { value: _vm.username },
            on: {
              input: function($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.username = $event.target.value
              }
            }
          })
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "pm-field-wrap" }, [
          _c("label", [_vm._v(_vm._s(_vm.text.first_name))]),
          _vm._v(" "),
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model",
                value: _vm.first_name,
                expression: "first_name"
              }
            ],
            attrs: { type: "text", name: "first_name" },
            domProps: { value: _vm.first_name },
            on: {
              input: function($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.first_name = $event.target.value
              }
            }
          })
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "pm-field-wrap" }, [
          _c("label", [_vm._v(_vm._s(_vm.text.last_name))]),
          _vm._v(" "),
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model",
                value: _vm.last_name,
                expression: "last_name"
              }
            ],
            attrs: { type: "text", name: "last_name" },
            domProps: { value: _vm.last_name },
            on: {
              input: function($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.last_name = $event.target.value
              }
            }
          })
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "pm-field-wrap" }, [
          _c("label", [_vm._v(_vm._s(_vm.text.email))]),
          _vm._v(" "),
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model",
                value: _vm.email,
                expression: "email"
              }
            ],
            attrs: { type: "email", required: "", name: "email" },
            domProps: { value: _vm.email },
            on: {
              input: function($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.email = $event.target.value
              }
            }
          })
        ]),
        _vm._v(" "),
        _c("div", [
          _c("input", {
            staticClass: "button-primary",
            attrs: { type: "submit", name: "create_user" },
            domProps: { value: _vm.text.create_user }
          }),
          _vm._v(" "),
          _c("span", {
            directives: [
              {
                name: "show",
                rawName: "v-show",
                value: _vm.show_spinner,
                expression: "show_spinner"
              }
            ],
            staticClass: "pm-spinner"
          })
        ])
      ]
    )
  ])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-1f4c3778", esExports)
  }
}

/***/ }),

/***/ 141:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__router_router__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__do_action_vue__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__project_lists_project_create_form_vue__ = __webpack_require__(137);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
        return {};
    },

    computed: {
        is_project_edit_mode() {
            return this.$root.$store.state.is_project_form_active;
        },

        project() {
            var projects = this.$root.$store.state.projects;

            var index = this.getIndex(projects, this.project_id, 'id');

            if (index !== false) {
                return projects[index];
            }

            return {};
        },

        menu() {
            var projects = this.$root.$store.state.projects;
            var index = this.getIndex(projects, this.project_id, 'id');
            var project = {};

            if (index !== false) {
                project = projects[index];
            } else {
                return [];
            }

            return [{
                route: {
                    name: 'pm_overview',
                    project_id: this.project_id
                },

                name: this.text.overview,
                count: '',
                class: 'overview pm-sm-col-12'
            }, {
                route: {
                    name: 'activities',
                    project_id: this.project_id
                },

                name: this.text.activities,
                count: project.meta.total_activities,
                class: 'activity pm-sm-col-12'
            }, {
                route: {
                    name: 'discussions',
                    project_id: this.project_id
                },

                name: this.text.discussions,
                count: project.meta.total_discussion_boards,
                class: 'message pm-sm-col-12'
            }, {
                route: {
                    name: 'task_lists',
                    project_id: this.project_id
                },

                name: this.text.task_lists,
                count: project.meta.total_task_lists,
                class: 'to-do-list pm-sm-col-12'
            }, {
                route: {
                    name: 'milestones',
                    project_id: this.project_id
                },

                name: this.text.milestones,
                count: project.meta.total_milestones,
                class: 'milestone pm-sm-col-12'
            }, {
                route: {
                    name: 'pm_files',
                    project_id: this.project_id
                },

                name: this.text.files,
                count: project.meta.total_files,
                class: 'files pm-sm-col-12'
            }];
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

    methods: {
        showProjectAction() {
            this.$root.$store.commit('showHideProjectDropDownAction', {
                status: 'toggle',
                project_id: this.project_id
            });
        },

        selfProjectMarkDone(project) {
            var project = {
                id: project.id,
                status: project.status === 'complete' ? 'incomplete' : 'complete'
            },
                self = this;

            this.updateProject(project, function (project) {
                self.$root.$store.commit('showHideProjectDropDownAction', {
                    status: false,
                    project_id: self.project_id
                });
            });
        }
    }
});

/***/ }),

/***/ 142:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(15)(undefined);
// imports


// module
exports.push([module.i, "\n.pm-project-header .router-link-active {\n    border-bottom: solid 2px #019dd6 !important;\n    color: #000000 !important;\n}\n", ""]);

// exports


/***/ }),

/***/ 143:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_header_vue__ = __webpack_require__(141);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_2be34404_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_header_vue__ = __webpack_require__(144);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(145)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_header_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_2be34404_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_header_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/components/common/header.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-2be34404", Component.options)
  } else {
    hotAPI.reload("data-v-2be34404", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 144:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass: "pm-top-bar pm-no-padding pm-project-header pm-project-head"
    },
    [
      _c(
        "div",
        { staticClass: "pm-row pm-no-padding pm-border-bottom" },
        [
          _c("div", { staticClass: "pm-col-6 pm-project-detail" }, [
            _c("h3", [
              _c("span", { staticClass: "pm-project-title" }, [
                _vm._v(_vm._s(_vm.project.title))
              ]),
              _vm._v(" "),
              _c(
                "a",
                {
                  staticClass: "pm-icon-edit pm-project-edit-link small-text",
                  attrs: { href: "#" },
                  on: {
                    click: function($event) {
                      $event.preventDefault()
                      _vm.showHideProjectForm("toggle")
                    }
                  }
                },
                [
                  _c("span", { staticClass: "dashicons dashicons-edit" }),
                  _vm._v(" "),
                  _c("span", { staticClass: "text" }, [
                    _vm._v(_vm._s(_vm.text.edit))
                  ])
                ]
              )
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "detail" }, [
              _vm._v(_vm._s(_vm.project.description))
            ])
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "pm-completed-wrap" }, [
            _vm.project.status === "complete"
              ? _c("div", { staticClass: "ribbon-green" }, [
                  _vm._v(_vm._s(_vm.text.completed))
                ])
              : _vm._e(),
            _vm._v(" "),
            _vm.project.status === "incomplete"
              ? _c("div", { staticClass: "ribbon-green incomplete" }, [
                  _vm._v(_vm._s(_vm.text.incomplete))
                ])
              : _vm._e()
          ]),
          _vm._v(" "),
          _c(
            "div",
            {
              staticClass:
                "pm-col-6 pm-last-col pm-top-right-btn pm-text-right show_desktop_only"
            },
            [
              _c("div", { staticClass: "pm-project-action" }, [
                _c("span", {
                  staticClass:
                    "dashicons dashicons-admin-generic pm-settings-bind",
                  attrs: { title: _vm.text.Project_Actions },
                  on: {
                    click: function($event) {
                      $event.preventDefault()
                      _vm.showProjectAction()
                    }
                  }
                }),
                _vm._v(" "),
                _vm.project.settings_hide
                  ? _c("ul", { staticClass: "pm-settings" }, [
                      _c("li", [
                        _c("span", { staticClass: "pm-spinner" }),
                        _vm._v(" "),
                        _c(
                          "a",
                          {
                            attrs: {
                              href: "#",
                              title: _vm.text.delete_project
                            },
                            on: {
                              click: function($event) {
                                $event.preventDefault()
                                _vm.deleteProject(_vm.project.id)
                              }
                            }
                          },
                          [
                            _c("span", {
                              staticClass: "dashicons dashicons-trash"
                            }),
                            _vm._v(" "),
                            _c("span", [_vm._v(_vm._s(_vm.text.delete))])
                          ]
                        )
                      ]),
                      _vm._v(" "),
                      _c("li", [
                        _c("span", { staticClass: "pm-spinner" }),
                        _vm._v(" "),
                        _c(
                          "a",
                          {
                            attrs: { href: "#" },
                            on: {
                              click: function($event) {
                                $event.preventDefault()
                                _vm.selfProjectMarkDone(_vm.project)
                              }
                            }
                          },
                          [
                            _vm.project.status === "incomplete"
                              ? _c("span", {
                                  staticClass: "dashicons dashicons-yes"
                                })
                              : _vm._e(),
                            _vm._v(" "),
                            _vm.project.status === "incomplete"
                              ? _c("span", [_vm._v(_vm._s(_vm.text.complete))])
                              : _vm._e(),
                            _vm._v(" "),
                            _vm.project.status === "complete"
                              ? _c("span", {
                                  staticClass: "dashicons dashicons-undo"
                                })
                              : _vm._e(),
                            _vm._v(" "),
                            _vm.project.status === "complete"
                              ? _c("span", [_vm._v(_vm._s(_vm.text.restore))])
                              : _vm._e()
                          ]
                        )
                      ])
                    ])
                  : _vm._e()
              ])
            ]
          ),
          _vm._v(" "),
          _c("div", { staticClass: "clearfix" }),
          _vm._v(" "),
          _c("transition", { attrs: { name: "slide" } }, [
            _vm.is_project_edit_mode
              ? _c(
                  "div",
                  { staticClass: "pm-edit-project" },
                  [_c("edit-project", { attrs: { is_update: true } })],
                  1
                )
              : _vm._e()
          ])
        ],
        1
      ),
      _vm._v(" "),
      _c("div", { staticClass: "pm-row pm-project-group" }, [
        _c(
          "ul",
          [
            _vm._l(_vm.menu, function(item) {
              return _c(
                "li",
                [
                  _c(
                    "router-link",
                    { class: item.class, attrs: { to: item.route } },
                    [
                      _c("span", [_vm._v(_vm._s(item.name))]),
                      _vm._v(" "),
                      _c("div", [_vm._v(_vm._s(item.count))])
                    ]
                  )
                ],
                1
              )
            }),
            _vm._v(" "),
            _c("do-action", { attrs: { hook: "pm-header" } })
          ],
          2
        )
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "clearfix" })
    ]
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-2be34404", esExports)
  }
}

/***/ }),

/***/ 145:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(142);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(16)("4110dfe3", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-2be34404\",\"scoped\":false,\"hasInlineConfig\":false}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./header.vue", function() {
     var newContent = require("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-2be34404\",\"scoped\":false,\"hasInlineConfig\":false}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./header.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 146:
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

/* harmony default export */ __webpack_exports__["a"] = ({
	props: ['total_pages', 'current_page_number', 'component_name'],

	data() {
		return {
			route_query: this.$route.query
		};
	},

	watch: {
		'$route'(url) {
			this.route_query = url.query;
		}
	},

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

/***/ 148:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_pagination_vue__ = __webpack_require__(146);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_375a100b_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_pagination_vue__ = __webpack_require__(149);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_pagination_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_375a100b_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_pagination_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/components/common/pagination.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-375a100b", Component.options)
  } else {
    hotAPI.reload("data-v-375a100b", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 149:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _vm.total_pages > 1
    ? _c("div", [
        _c(
          "div",
          { staticClass: "pm-pagination-wrap" },
          [
            parseInt(_vm.current_page_number) > 1
              ? _c(
                  "router-link",
                  {
                    staticClass: "pm-pagination-btn prev page-numbers",
                    attrs: {
                      to: {
                        name: _vm.component_name,
                        params: {
                          current_page_number: _vm.current_page_number - 1
                        },
                        query: _vm.route_query
                      }
                    }
                  },
                  [_vm._v("\n\t\t\t«\n\t\t")]
                )
              : _vm._e(),
            _vm._v(" "),
            _vm._l(_vm.total_pages, function(page) {
              return _c(
                "router-link",
                {
                  key: "page",
                  class: _vm.pageClass(page) + " pm-pagination-btn",
                  attrs: {
                    to: {
                      name: _vm.component_name,
                      params: {
                        current_page_number: page
                      },
                      query: _vm.route_query
                    }
                  }
                },
                [_vm._v("\n\t\t\t" + _vm._s(page) + "\n\t\t")]
              )
            }),
            _vm._v(" "),
            parseInt(_vm.current_page_number) < parseInt(_vm.total_pages)
              ? _c(
                  "router-link",
                  {
                    staticClass: "pm-pagination-btn next page-numbers",
                    attrs: {
                      to: {
                        name: _vm.component_name,
                        params: {
                          current_page_number: _vm.current_page_number + 1
                        },
                        query: _vm.route_query
                      }
                    }
                  },
                  [_vm._v("\n\t\t\t»\n\t\t")]
                )
              : _vm._e()
          ],
          2
        ),
        _vm._v(" "),
        _c("div", { staticClass: "pm-clearfix" })
      ])
    : _vm._e()
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-375a100b", esExports)
  }
}

/***/ }),

/***/ 156:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_new_task_form_vue__ = __webpack_require__(311);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7db5a654_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_new_task_form_vue__ = __webpack_require__(329);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_new_task_form_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7db5a654_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_new_task_form_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/components/project-task-lists/new-task-form.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7db5a654", Component.options)
  } else {
    hotAPI.reload("data-v-7db5a654", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 30:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_lists_vue__ = __webpack_require__(473);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_410523ca_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_lists_vue__ = __webpack_require__(556);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(579)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_lists_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_410523ca_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_lists_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/components/project-task-lists/lists.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-410523ca", Component.options)
  } else {
    hotAPI.reload("data-v-410523ca", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),

/***/ 305:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_new_task_list_form_vue__ = __webpack_require__(312);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_179153b3_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_new_task_list_form_vue__ = __webpack_require__(324);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_new_task_list_form_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_179153b3_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_new_task_list_form_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/components/project-task-lists/new-task-list-form.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-179153b3", Component.options)
  } else {
    hotAPI.reload("data-v-179153b3", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 307:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__new_task_form_vue__ = __webpack_require__(156);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
    props: ['task', 'list'],
    components: {
        'new-task-form': __WEBPACK_IMPORTED_MODULE_0__new_task_form_vue__["a" /* default */]
    },
    methods: {
        is_assigned: function (task) {
            return true;
            var get_current_user_id = this.$store.state.get_current_user_id,
                in_task = task.assigned_to.indexOf(get_current_user_id);

            if (task.can_del_edit || in_task != '-1') {
                return true;
            }

            return false;
        }
    }
});

/***/ }),

/***/ 308:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({
    props: ['value', 'dependency'],
    mounted: function () {
        var self = this,
            limit_date = self.dependency == 'pm-datepickter-from' ? "maxDate" : "minDate";

        jQuery(self.$el).datepicker({
            dateFormat: 'yy-mm-dd',
            changeYear: true,
            changeMonth: true,
            numberOfMonths: 1,
            onClose: function (selectedDate) {
                jQuery("." + self.dependency).datepicker("option", limit_date, selectedDate);
            },
            onSelect: function (dateText) {
                self.$emit('input', dateText);
            }
        });
    }
});

/***/ }),

/***/ 309:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__new_task_form_vue__ = __webpack_require__(156);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
	props: ['task', 'list'],
	components: {
		'new-task-form': __WEBPACK_IMPORTED_MODULE_0__new_task_form_vue__["a" /* default */]
	},
	methods: {
		is_assigned: function (task) {
			return true;
			var get_current_user_id = this.$store.state.get_current_user_id,
			    in_task = task.assigned_to.indexOf(get_current_user_id);

			if (task.can_del_edit || in_task != '-1') {
				return true;
			}

			return false;
		},

		doneUndone() {
			var status = !this.task.status;
			this.taskDoneUndone(this.task, status, this.list);
		}

	}
});

/***/ }),

/***/ 310:
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

/* harmony default export */ __webpack_exports__["a"] = ({
    // Get passing data for this component. Remember only array and objects are
    props: ['list', 'task'],

    methods: {
        /**
         * Select new todo-list button class for +,- icon
         * 
         * @return string
         */
        newTaskBtnClass: function () {
            return this.list.show_task_form ? 'pm-new-task-btn-minus' : 'pm-new-task-btn';
        }
    }
});

/***/ }),

/***/ 311:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__date_picker_vue__ = __webpack_require__(321);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
											props: ['list', 'task'],

											/**
            * Initial data for this component
            * 
            * @return obj
            */
											data: function () {
																						return {
																																	task_privacy: this.task.task_privacy == 'yes' ? true : false,
																																	submit_disabled: false,
																																	before_edit: jQuery.extend(true, {}, this.task),
																																	show_spinner: false,
																																	date_from: '',
																																	date_to: '',
																																	assigned_to: []
																						};
											},

											components: {
																						'multiselect': pm.Multiselect,
																						'pm-datepickter': __WEBPACK_IMPORTED_MODULE_0__date_picker_vue__["a" /* default */]
											},

											beforeMount() {
																						this.setDefaultValue();
											},

											// Initial action for this component
											created: function () {
																						this.$on('pm_date_picker', this.getDatePicker);
											},

											watch: {
																						date_from: function (new_date) {
																																	this.task.start_at = new_date;
																						},

																						date_to: function (new_date) {
																																	this.task.due_date = new_date;
																						},
																						/**
                       * Live check is the task private or not
                       * 
                       * @param  boolean val 
                       * 
                       * @return void     
                       */
																						task_privacy: function (val) {
																																	if (val) {
																																												this.task.task_privacy = 'yes';
																																	} else {
																																												this.task.task_privacy = 'no';
																																	}
																						}
											},

											computed: {
																						project_users() {
																																	return this.$root.$store.state.project_users;
																						},
																						/**
                       * Check current user can view the todo or not
                       * 
                       * @return boolean
                       */
																						todo_view_private: function () {
																																	if (!this.$store.state.init.hasOwnProperty('premissions')) {
																																												return true;
																																	}

																																	if (this.$store.state.init.premissions.hasOwnProperty('todo_view_private')) {
																																												return this.$store.state.init.premissions.tdolist_view_private;
																																	}

																																	return true;
																						},

																						/**
                       * Get and Set task users
                       */
																						task_assign: {
																																	/**
                                  * Filter only current task assgin user from vuex state project_users
                                  *
                                  * @return array
                                  */
																																	get: function () {
																																												// var filtered_users = [];

																																												// if ( this.task.assigned_to && this.task.assigned_to.length ) {
																																												//     var assigned_to = this.task.assigned_to.map(function (id) {
																																												//         return parseInt(id);
																																												//     });


																																												//     filtered_users = this.project_users.filter(function (user) {
																																												//         return (assigned_to.indexOf(parseInt(user.id)) >= 0);
																																												//     });
																																												// }
																																												return typeof this.task.assignees === 'undefined' ? [] : this.task.assignees.data;
																																	},

																																	/**
                                  * Set selected users at task insert or edit time
                                  * 
                                  * @param array selected_users 
                                  */
																																	set: function (selected_users) {
																																												this.assigned_to = selected_users.map(function (user) {
																																																							return user.id;
																																												});
																																	}
																						}
											},

											methods: {
																						setDefaultValue() {
																																	if (typeof this.task.assignees !== 'undefined') {
																																												var self = this;
																																												this.task.assignees.data.map(function (user) {
																																																							self.assigned_to.push(user.id);
																																												});
																																	}

																																	if (typeof this.task.start_at === 'undefined') {
																																												this.task.start_at = {
																																																							date: ''
																																												};
																																	}

																																	if (typeof this.task.due_date === 'undefined') {
																																												this.task.due_date = {
																																																							date: ''
																																												};
																																	}
																						},
																						/**
                       * Set tast start and end date at task insert or edit time
                       * 
                       * @param  string data 
                       * 
                       * @return void   
                       */
																						getDatePicker: function (data) {

																																	if (data.field == 'datepicker_from') {
																																												//this.task.start_at = data.date;
																																	}

																																	if (data.field == 'datepicker_to') {
																																												//this.task.due_date = data.date;
																																	}
																						},

																						/**
                       * Show or hieding task insert and edit form
                       *  
                       * @param  int list_index 
                       * @param  int task_id    
                       * 
                       * @return void           
                       */
																						hideNewTaskForm: function (list_index, task_id) {
																																	var self = this,
																																	    task_index = this.getIndex(this.list.tasks, task_id, 'ID'),
																																	    list_index = this.getIndex(this.$store.state.lists, this.list.ID, 'ID');

																																	if (typeof task_id == 'undefined') {
																																												self.showHideTaskFrom(self.list);
																																												return;
																																	}

																																	this.list.tasks.map(function (task, index) {
																																												if (task.ID == task_id) {
																																																							self.showHideTaskFrom(self.list);
																																																							self.task = jQuery.extend(self.task, self.before_edit);
																																												}
																																	});
																						},

																						/**
                       * Insert and edit task
                       * 
                       * @return void
                       */

																						//     newTask: function() {
																						//         // Exit from this function, If submit button disabled 
																						//         if ( this.submit_disabled ) {
																						//             return;
																						//         }

																						//         // Disable submit button for preventing multiple click
																						//         this.submit_disabled = true;

																						//         var self      = this,
																						//             is_update = typeof this.task.id == 'undefined' ? false : true,

																						//             form_data = {
																						//                 board_id: this.list.id,
																						//                 assignees: this.assigned_to,
																						//                 title: this.task.title,
																						//                 description: this.task.description,
																						//                 start_at: this.task.start_at.date,
																						//                 due_date: this.task.due_date.date,
																						//                 task_privacy: this.task.task_privacy,
																						//                 list_id: this.list.id,
																						//                 order: this.task.order
																						//             };

																						//         // Showing loading option 
																						//         this.show_spinner = true;

																						//         if (is_update) {
																						//         	var url = self.base_url + '/pm/v2/projects/'+self.project_id+'/tasks/'+this.task.id;
																						//         	var type = 'PUT'; 
																						//         } else {
																						//         	var url = self.base_url + '/pm/v2/projects/'+self.project_id+'/tasks';
																						//         	var type = 'POST';
																						//         }

																						//         var request_data = {
																						//         	url: url,
																						//         	type: type,
																						//         	data: form_data,
																						//         	success (res) {
																						//         		if (is_update) {
																						//         			self.$store.commit('afterUpdateTask', {
																						//         				list_id: self.list.id,
																						//         				task: res.data
																						//         			});
																						//         		} else {
																						//         			self.$store.commit('afterNewTask', {
																						//         				list_id: self.list.id,
																						//         				task: res.data
																						//         			});
																						//         		}

																						//         		self.show_spinner = false;

																						//                 // Display a success toast, with a title
																						//                 pm.Toastr.success(res.data.success);

																						//                 self.submit_disabled = false;
																						//                 self.showHideTaskFrom(false, self.list, self.task);
																						//         	},

																						//         	error (res) {
																						//         		self.show_spinner = false;

																						//                 // Showing error
																						//                 res.data.error.map( function( value, index ) {
																						//                     pm.Toastr.error(value);
																						//                 });
																						//                 self.submit_disabled = false;
																						//         	}
																						//         }

																						//         self.httpRequest(request_data);
																						//     }

																						taskFormAction() {
																																	// Exit from this function, If submit button disabled 
																																	if (this.submit_disabled) {
																																												return;
																																	}
																																	var self = this;
																																	this.submit_disabled = true;
																																	// Showing loading option 
																																	this.show_spinner = true;
																																	var args = {
																																												data: {
																																																							task_id: this.task.id,
																																																							board_id: this.list.id,
																																																							assignees: this.assigned_to,
																																																							title: this.task.title,
																																																							description: this.task.description,
																																																							start_at: this.task.start_at.date,
																																																							due_date: this.task.due_date.date,
																																																							task_privacy: this.task.task_privacy,
																																																							list_id: this.list.id,
																																																							order: this.task.order
																																												},
																																												callback: function (res) {
																																																							self.show_spinner = false;
																																																							self.submit_disabled = false;
																																												}
																																	};
																																	if (typeof this.task.id !== 'undefined') {
																																												self.updateTask(args);
																																	} else {
																																												self.addTask(args);
																																	}
																						}
											}
});

/***/ }),

/***/ 312:
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


var pm_todo_list_mixins = function (mixins, mixin_parent) {
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
    props: ['list', 'section'],

    /**
     * Initial data for this component
     * 
     * @return obj
     */
    data: function () {
        return {
            tasklist_milestone: this.list.milestone ? this.list.milestone : '-1',
            show_spinner: false,
            error: [],
            success: '',
            submit_disabled: false,
            project_id: this.$route.params.project_id,
            milestone_id: '-1'
        };
    },

    created() {
        if (typeof this.list.milestone !== 'undefined') {
            this.milestone_id = this.list.milestone.data.id;
        }
    },

    computed: {

        /**
         * Get current project milestones 
         * 
         * @return array
         */
        milestones: function () {
            return this.$root.$store.state.milestones;
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
        todolistFormClass(list) {
            return list.ID ? 'pm-todo-form-wrap pm-form pm-slide-' + list.ID : 'pm-todo-list-form-wrap pm-form pm-slide-list';
        },

        /**
         * Insert and update todo list
         * 
         * @return void
         */
        listFormAction: function () {

            // Prevent sending request when multiple click submit button 
            if (this.submit_disabled) {
                return;
            }
            var self = this;
            // Make disable submit button
            this.submit_disabled = true;
            this.show_spinner = true;
            this.show_spinner = true;

            var is_update = typeof this.list.id !== 'undefined' ? true : false;
            var args = {
                data: {
                    id: self.list.id,
                    title: self.list.title,
                    description: self.list.description,
                    milestone: self.list.milestone,
                    order: self.list.order
                },
                callback: function (res) {
                    self.show_spinner = false;
                    self.submit_disabled = false;
                    self.listTemplateAction();
                }
            };

            if (!is_update) {
                self.addList(args);
            } else {
                self.updateList(args);
            }
        },
        singleAfterNewList(self, res, is_update) {
            if (is_update) {
                var condition = 'incomplete_tasks,complete_tasks,comments';
                self.getList(self, self.list.id, condition);
            }
        }
    }
});

/***/ }),

/***/ 313:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(15)(undefined);
// imports


// module
exports.push([module.i, "\n.pm-new-task-button-icon {\n\tdisplay: inline-block;\n    padding-left: 28px;\n    background-size: 20px;\n    background-repeat: no-repeat;\n}\n", ""]);

// exports


/***/ }),

/***/ 320:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_completed_tasks_vue__ = __webpack_require__(307);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_57228e01_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_completed_tasks_vue__ = __webpack_require__(326);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_completed_tasks_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_57228e01_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_completed_tasks_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/components/project-task-lists/completed-tasks.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-57228e01", Component.options)
  } else {
    hotAPI.reload("data-v-57228e01", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 321:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_date_picker_vue__ = __webpack_require__(308);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_44e443fc_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_date_picker_vue__ = __webpack_require__(325);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_date_picker_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_44e443fc_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_date_picker_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/components/project-task-lists/date-picker.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-44e443fc", Component.options)
  } else {
    hotAPI.reload("data-v-44e443fc", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 322:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_incompleted_tasks_vue__ = __webpack_require__(309);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_79a0d97c_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_incompleted_tasks_vue__ = __webpack_require__(328);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_incompleted_tasks_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_79a0d97c_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_incompleted_tasks_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/components/project-task-lists/incompleted-tasks.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-79a0d97c", Component.options)
  } else {
    hotAPI.reload("data-v-79a0d97c", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 323:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_new_task_btn_vue__ = __webpack_require__(310);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_59b1bafc_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_new_task_btn_vue__ = __webpack_require__(327);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(331)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_new_task_btn_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_59b1bafc_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_new_task_btn_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/components/project-task-lists/new-task-btn.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-59b1bafc", Component.options)
  } else {
    hotAPI.reload("data-v-59b1bafc", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 324:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { class: _vm.todolistFormClass(_vm.list) + " pm-new-todolist-form" },
    [
      _c(
        "form",
        {
          attrs: { action: "", method: "post" },
          on: {
            submit: function($event) {
              $event.preventDefault()
              _vm.listFormAction()
            }
          }
        },
        [
          _c("div", { staticClass: "item title" }, [
            _c("input", {
              directives: [
                {
                  name: "model",
                  rawName: "v-model",
                  value: _vm.list.title,
                  expression: "list.title"
                }
              ],
              attrs: {
                type: "text",
                required: "required",
                name: "tasklist_name",
                placeholder: _vm.text.task_list_name
              },
              domProps: { value: _vm.list.title },
              on: {
                input: function($event) {
                  if ($event.target.composing) {
                    return
                  }
                  _vm.$set(_vm.list, "title", $event.target.value)
                }
              }
            })
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "item content" }, [
            _c("textarea", {
              directives: [
                {
                  name: "model",
                  rawName: "v-model",
                  value: _vm.list.description,
                  expression: "list.description"
                }
              ],
              attrs: {
                name: "tasklist_detail",
                id: "",
                cols: "40",
                rows: "2",
                placeholder: _vm.text.task_list_details
              },
              domProps: { value: _vm.list.description },
              on: {
                input: function($event) {
                  if ($event.target.composing) {
                    return
                  }
                  _vm.$set(_vm.list, "description", $event.target.value)
                }
              }
            })
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "item milestone" }, [
            _c(
              "select",
              {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.milestone_id,
                    expression: "milestone_id"
                  }
                ],
                on: {
                  change: function($event) {
                    var $$selectedVal = Array.prototype.filter
                      .call($event.target.options, function(o) {
                        return o.selected
                      })
                      .map(function(o) {
                        var val = "_value" in o ? o._value : o.value
                        return val
                      })
                    _vm.milestone_id = $event.target.multiple
                      ? $$selectedVal
                      : $$selectedVal[0]
                  }
                }
              },
              [
                _c("option", { attrs: { value: "-1" } }, [
                  _vm._v(
                    "\n                    " +
                      _vm._s(_vm.text.milestones_select) +
                      "\n                "
                  )
                ]),
                _vm._v(" "),
                _vm._l(_vm.milestones, function(milestone) {
                  return _c("option", { domProps: { value: milestone.id } }, [
                    _vm._v(
                      "\n                    " +
                        _vm._s(milestone.title) +
                        "\n                "
                    )
                  ])
                })
              ],
              2
            )
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "item submit" }, [
            _vm.list.edit_mode
              ? _c("input", {
                  staticClass: "button-primary",
                  attrs: {
                    type: "submit",
                    disabled: _vm.submit_disabled,
                    name: "submit_todo"
                  },
                  domProps: { value: _vm.text.update_list }
                })
              : _vm._e(),
            _vm._v(" "),
            !_vm.list.edit_mode
              ? _c("input", {
                  staticClass: "button-primary",
                  attrs: {
                    type: "submit",
                    disabled: _vm.submit_disabled,
                    name: "submit_todo"
                  },
                  domProps: { value: _vm.text.add_list }
                })
              : _vm._e(),
            _vm._v(" "),
            _c(
              "a",
              {
                staticClass: "button list-cancel",
                attrs: { href: "#" },
                on: {
                  click: function($event) {
                    $event.preventDefault()
                    _vm.showHideListForm(false, _vm.list)
                  }
                }
              },
              [_vm._v(_vm._s(_vm.text.cancel))]
            ),
            _vm._v(" "),
            _c("span", {
              directives: [
                {
                  name: "show",
                  rawName: "v-show",
                  value: _vm.show_spinner,
                  expression: "show_spinner"
                }
              ],
              staticClass: "pm-spinner"
            })
          ])
        ]
      )
    ]
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-179153b3", esExports)
  }
}

/***/ }),

/***/ 325:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("input", {
    attrs: { type: "text" },
    domProps: { value: _vm.value }
  })
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-44e443fc", esExports)
  }
}

/***/ }),

/***/ 326:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "pm-todo-wrap clearfix" }, [
    _c("div", { staticClass: "pm-todo-content" }, [
      _c("div", [
        _c(
          "div",
          { staticClass: "pm-col-6" },
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
              attrs: { type: "checkbox", value: "", name: "" },
              domProps: {
                checked: Array.isArray(_vm.task.status)
                  ? _vm._i(_vm.task.status, "") > -1
                  : _vm.task.status
              },
              on: {
                click: function($event) {
                  _vm.taskDoneUndone(_vm.task, _vm.task.status, _vm.list)
                },
                change: function($event) {
                  var $$a = _vm.task.status,
                    $$el = $event.target,
                    $$c = $$el.checked ? true : false
                  if (Array.isArray($$a)) {
                    var $$v = "",
                      $$i = _vm._i($$a, $$v)
                    if ($$el.checked) {
                      $$i < 0 && (_vm.task.status = $$a.concat([$$v]))
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
            }),
            _vm._v(" "),
            _c(
              "span",
              { staticClass: "task-title" },
              [
                _c(
                  "router-link",
                  {
                    attrs: {
                      to: {
                        name: "single_task",
                        params: {
                          list_id: _vm.list.id,
                          task_id: _vm.task.id,
                          project_id: 1,
                          task: _vm.task
                        }
                      }
                    }
                  },
                  [
                    _c("span", { staticClass: "pm-todo-text" }, [
                      _vm._v(_vm._s(_vm.task.title))
                    ])
                  ]
                ),
                _vm._v(" "),
                _c("span", { class: _vm.privateClass(_vm.task) })
              ],
              1
            ),
            _vm._v(" "),
            _vm._l(_vm.getUsers(_vm.task.assigned_to), function(user) {
              return _c("span", {
                key: user.ID,
                staticClass: "pm-assigned-user",
                domProps: { innerHTML: _vm._s(user.user_url) }
              })
            }),
            _vm._v(" "),
            _c(
              "span",
              { class: _vm.completedTaskWrap(_vm.task.due_date.date) },
              [
                _vm.task_start_field
                  ? _c("span", [
                      _vm._v(_vm._s(_vm.dateFormat(_vm.task.start_at.date)))
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
                _c("span", [
                  _vm._v(_vm._s(_vm.dateFormat(_vm.task.due_date.date)))
                ])
              ]
            )
          ],
          2
        ),
        _vm._v(" "),
        _c("div", { staticClass: "pm-col-5" }, [
          _c("span", { staticClass: "pm-comment-count" }, [
            _c("a", { attrs: { href: "#" } }, [
              _vm._v(
                "\n                        " +
                  _vm._s(_vm.task.comment_count) +
                  "\n                    "
              )
            ])
          ])
        ]),
        _vm._v(" "),
        _c(
          "div",
          { staticClass: "pm-col-1 pm-todo-action-right pm-last-col" },
          [
            _c(
              "a",
              {
                staticClass: "pm-todo-delete",
                attrs: { href: "#" },
                on: {
                  click: function($event) {
                    $event.preventDefault()
                    _vm.deleteTask(_vm.task, _vm.list)
                  }
                }
              },
              [_c("span", { staticClass: "dashicons dashicons-trash" })]
            )
          ]
        ),
        _vm._v(" "),
        _c("div", { staticClass: "clearfix" })
      ])
    ]),
    _vm._v(" "),
    _vm.task.edit_mode
      ? _c(
          "div",
          { staticClass: "pm-todo-form" },
          [_c("new-task-form", { attrs: { task: _vm.task, list: _vm.list } })],
          1
        )
      : _vm._e()
  ])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-57228e01", esExports)
  }
}

/***/ }),

/***/ 327:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { class: _vm.newTaskBtnClass() + " pm-new-task-button-icon" },
    [
      _c(
        "a",
        {
          attrs: { href: "#" },
          on: {
            click: function($event) {
              $event.preventDefault()
              _vm.showHideTaskFrom("toggle", _vm.list, false)
            }
          }
        },
        [_vm._v(_vm._s(_vm.text.add_task))]
      )
    ]
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-59b1bafc", esExports)
  }
}

/***/ }),

/***/ 328:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "pm-todo-wrap clearfix" }, [
    _c("div", { staticClass: "pm-todo-content" }, [
      _c("div", [
        _c(
          "div",
          { staticClass: "pm-col-7" },
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
              attrs: {
                disabled: !_vm.is_assigned(_vm.task),
                type: "checkbox",
                value: "",
                name: ""
              },
              domProps: {
                checked: Array.isArray(_vm.task.status)
                  ? _vm._i(_vm.task.status, "") > -1
                  : _vm.task.status
              },
              on: {
                click: function($event) {
                  _vm.doneUndone()
                },
                change: function($event) {
                  var $$a = _vm.task.status,
                    $$el = $event.target,
                    $$c = $$el.checked ? true : false
                  if (Array.isArray($$a)) {
                    var $$v = "",
                      $$i = _vm._i($$a, $$v)
                    if ($$el.checked) {
                      $$i < 0 && (_vm.task.status = $$a.concat([$$v]))
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
            }),
            _vm._v(" "),
            _vm.is_single_list
              ? _c(
                  "span",
                  [
                    _c(
                      "router-link",
                      {
                        attrs: {
                          to: {
                            name: "lists_single_task",
                            params: {
                              list_id: _vm.list.id,
                              task_id: _vm.task.id,
                              project_id: _vm.project_id,
                              task: _vm.task
                            }
                          }
                        }
                      },
                      [
                        _vm._v(
                          "\n\n                    \t" +
                            _vm._s(_vm.task.title) +
                            "\n                \t"
                        )
                      ]
                    )
                  ],
                  1
                )
              : _c(
                  "span",
                  [
                    _c(
                      "router-link",
                      {
                        attrs: {
                          exact: "",
                          to: {
                            name: "lists_single_task",
                            params: {
                              task_id: _vm.task.id,
                              project_id: _vm.project_id
                            }
                          }
                        }
                      },
                      [
                        _vm._v(
                          "\n\n                    \t" +
                            _vm._s(_vm.task.title) +
                            "\n                    "
                        )
                      ]
                    )
                  ],
                  1
                ),
            _vm._v(" "),
            _c("span", { class: _vm.privateClass(_vm.task) }),
            _vm._v(" "),
            _vm._l(_vm.task.assignees.data, function(user) {
              return _c(
                "span",
                { key: user.ID, staticClass: "pm-assigned-user" },
                [
                  _c("a", { attrs: { href: "#", title: user.display_name } }, [
                    _c("img", {
                      attrs: {
                        src: user.avatar_url,
                        alt: user.display_name,
                        height: "48",
                        width: "48"
                      }
                    })
                  ])
                ]
              )
            }),
            _vm._v(" "),
            _c("span", { class: _vm.taskDateWrap(_vm.task.due_date.date) }, [
              _vm.task_start_field
                ? _c("span", [
                    _vm._v(_vm._s(_vm.dateFormat(_vm.task.start_at.date)))
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
              _c("span", [
                _vm._v(_vm._s(_vm.dateFormat(_vm.task.due_date.date)))
              ])
            ])
          ],
          2
        ),
        _vm._v(" "),
        _c("div", { staticClass: "pm-col-4 pm-todo-action-center" }, [
          _c("div", { staticClass: "pm-task-comment" }, [
            _c(
              "span",
              [
                _c(
                  "router-link",
                  {
                    attrs: {
                      to: {
                        name: "lists_single_task",
                        params: {
                          list_id: _vm.list.id,
                          task_id: _vm.task.id
                        }
                      }
                    }
                  },
                  [
                    _c("span", { staticClass: "pm-comment-count" }, [
                      _vm._v(
                        "\n                                " +
                          _vm._s(_vm.task.meta.total_comment) +
                          "\n                            "
                      )
                    ])
                  ]
                )
              ],
              1
            )
          ])
        ]),
        _vm._v(" "),
        _c(
          "div",
          { staticClass: "pm-col-1 pm-todo-action-right pm-last-col" },
          [
            _c(
              "a",
              {
                staticClass: "pm-todo-edit",
                attrs: { href: "#" },
                on: {
                  click: function($event) {
                    $event.preventDefault()
                    _vm.showHideTaskFrom("toggle", _vm.list, _vm.task)
                  }
                }
              },
              [_c("span", { staticClass: "dashicons dashicons-edit" })]
            ),
            _vm._v(" "),
            _c(
              "a",
              {
                staticClass: "pm-todo-delete",
                attrs: { href: "#" },
                on: {
                  click: function($event) {
                    $event.preventDefault()
                    _vm.deleteTask(_vm.task, _vm.list)
                  }
                }
              },
              [_c("span", { staticClass: "dashicons dashicons-trash" })]
            )
          ]
        ),
        _vm._v(" "),
        _c("div", { staticClass: "clearfix" })
      ])
    ]),
    _vm._v(" "),
    _vm.task.edit_mode
      ? _c(
          "div",
          { staticClass: "pm-todo-form" },
          [_c("new-task-form", { attrs: { task: _vm.task, list: _vm.list } })],
          1
        )
      : _vm._e()
  ])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-79a0d97c", esExports)
  }
}

/***/ }),

/***/ 329:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { class: "pm-task-edit-form pm-slide-" + _vm.task.id }, [
    _c(
      "form",
      {
        staticClass: "pm-task-form",
        attrs: { action: "", method: "post" },
        on: {
          submit: function($event) {
            $event.preventDefault()
            _vm.taskFormAction()
          }
        }
      },
      [
        _c("div", { staticClass: "item task-title" }, [
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model",
                value: _vm.task.title,
                expression: "task.title"
              }
            ],
            staticClass: "task_title",
            attrs: {
              type: "text",
              name: "task_title",
              placeholder: _vm.text.add_new_task,
              value: "",
              required: "required"
            },
            domProps: { value: _vm.task.title },
            on: {
              input: function($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.$set(_vm.task, "title", $event.target.value)
              }
            }
          })
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "item content" }, [
          _c("textarea", {
            directives: [
              {
                name: "model",
                rawName: "v-model",
                value: _vm.task.description,
                expression: "task.description"
              }
            ],
            staticClass: "todo_content",
            attrs: {
              name: "task_text",
              cols: "40",
              placeholder: _vm.text.task_extra_details,
              rows: "2"
            },
            domProps: { value: _vm.task.description },
            on: {
              input: function($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.$set(_vm.task, "description", $event.target.value)
              }
            }
          })
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "item date" }, [
          _vm.task_start_field
            ? _c(
                "div",
                { staticClass: "pm-task-start-field" },
                [
                  _c("label", [_vm._v("Start Date")]),
                  _vm._v(" "),
                  _c("pm-datepickter", {
                    staticClass: "pm-datepickter-from",
                    attrs: { dependency: "pm-datepickter-to" },
                    model: {
                      value: _vm.task.start_at.date,
                      callback: function($$v) {
                        _vm.$set(_vm.task.start_at, "date", $$v)
                      },
                      expression: "task.start_at.date"
                    }
                  })
                ],
                1
              )
            : _vm._e(),
          _vm._v(" "),
          _c(
            "div",
            { staticClass: "pm-task-due-field" },
            [
              _c("label", [_vm._v("Due Date")]),
              _vm._v(" "),
              _c("pm-datepickter", {
                staticClass: "pm-datepickter-to",
                attrs: { dependency: "pm-datepickter-from" },
                model: {
                  value: _vm.task.due_date.date,
                  callback: function($$v) {
                    _vm.$set(_vm.task.due_date, "date", $$v)
                  },
                  expression: "task.due_date.date"
                }
              })
            ],
            1
          )
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "item user" }, [
          _c(
            "div",
            [
              _c("multiselect", {
                attrs: {
                  options: _vm.project_users,
                  multiple: true,
                  "close-on-select": false,
                  "clear-on-select": false,
                  "hide-selected": true,
                  "show-labels": false,
                  placeholder: "Select User",
                  label: "display_name",
                  "track-by": "id"
                },
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
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "item submit" }, [
          _c("span", { staticClass: "pm-new-task-spinner" }),
          _vm._v(" "),
          _vm.task.edit_mode
            ? _c("span", [
                _c("input", {
                  staticClass: "button-primary",
                  attrs: {
                    disabled: _vm.submit_disabled,
                    type: "submit",
                    name: "submit_todo"
                  },
                  domProps: { value: _vm.text.update_task }
                })
              ])
            : _vm._e(),
          _vm._v(" "),
          !_vm.task.edit_mode
            ? _c("span", [
                _c("input", {
                  staticClass: "button-primary",
                  attrs: {
                    disabled: _vm.submit_disabled,
                    type: "submit",
                    name: "submit_todo"
                  },
                  domProps: { value: _vm.text.add_task }
                })
              ])
            : _vm._e(),
          _vm._v(" "),
          _c(
            "a",
            {
              staticClass: "button todo-cancel",
              attrs: { href: "#" },
              on: {
                click: function($event) {
                  $event.preventDefault()
                  _vm.showHideTaskFrom(false, _vm.list, _vm.task)
                }
              }
            },
            [_vm._v(_vm._s(_vm.text.cancel))]
          ),
          _vm._v(" "),
          _c("span", {
            directives: [
              {
                name: "show",
                rawName: "v-show",
                value: _vm.show_spinner,
                expression: "show_spinner"
              }
            ],
            staticClass: "pm-spinner"
          })
        ])
      ]
    )
  ])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-7db5a654", esExports)
  }
}

/***/ }),

/***/ 331:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(313);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(16)("524c41bc", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-59b1bafc\",\"scoped\":false,\"hasInlineConfig\":false}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./new-task-btn.vue", function() {
     var newContent = require("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-59b1bafc\",\"scoped\":false,\"hasInlineConfig\":false}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./new-task-btn.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 450:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_new_task_list_btn_vue__ = __webpack_require__(474);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_29e93486_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_new_task_list_btn_vue__ = __webpack_require__(551);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_new_task_list_btn_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_29e93486_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_new_task_list_btn_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/components/project-task-lists/new-task-list-btn.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-29e93486", Component.options)
  } else {
    hotAPI.reload("data-v-29e93486", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 469:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__new_task_list_btn_vue__ = __webpack_require__(450);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__new_task_list_form_vue__ = __webpack_require__(305);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
		'new-task-list-form': __WEBPACK_IMPORTED_MODULE_1__new_task_list_form_vue__["a" /* default */]
	},

	computed: {
		is_active_list_form() {
			return this.$store.state.is_active_list_form;
		}
	}
});

/***/ }),

/***/ 472:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__new_task_form_vue__ = __webpack_require__(156);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__incompleted_tasks_vue__ = __webpack_require__(322);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__completed_tasks_vue__ = __webpack_require__(320);
//
//
//
//
//
//
//
//
//
//
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
    props: ['list'],

    /**
     * Initial data for this component
     * 
     * @return obj
     */
    data() {
        return {
            showTaskForm: false,
            task: {},
            tasks: this.list.tasks,
            task_index: 'undefined', // Using undefined for slideToggle class
            task_loading_status: false,
            complete_show_load_more_btn: false,
            currnet_user_id: this.$store.state.get_current_user_id,
            more_incomplete_task_spinner: false,
            more_completed_task_spinner: false,
            loading_completed_tasks: true,
            loading_incomplete_tasks: true,
            completed_tasks_next_page_number: null
        };
    },

    computed: {
        /**
         * Check, Has task from this props list
         * 
         * @return boolen
         */
        taskLength() {
            return typeof this.list.tasks != 'undefined' && this.list.tasks.length ? true : false;
        },

        /**
         * Get incomplete tasks
         * 
         * @param  array tasks 
         * 
         * @return array       
         */
        getIncompleteTasks() {
            if (this.list.incomplete_tasks) {
                this.list.incomplete_tasks.data.map(function (task, index) {
                    task.status = false;
                });

                return this.list.incomplete_tasks.data;
            }

            return [];
        },

        /**
         * Get completed tasks
         * 
         * @param  array tasks 
         * 
         * @return array       
         */
        getCompletedTask() {
            if (this.list.complete_tasks) {
                this.list.complete_tasks.data.map(function (task, index) {
                    task.status = true;
                });

                return this.list.complete_tasks.data;
            }
        },

        loadMoreButton() {
            if (typeof this.list.incomplete_tasks == 'undefined') {
                return false;
            }
            var pagination = this.list.incomplete_tasks.meta.pagination;
            if (pagination.current_page < pagination.total_pages) {
                this.completed_tasks_next_page_number = pagination.current_page + 1;
                return true;
            }

            return false;
        }
    },

    components: {
        'new-task-form': __WEBPACK_IMPORTED_MODULE_0__new_task_form_vue__["a" /* default */],
        'incompleted-tasks': __WEBPACK_IMPORTED_MODULE_1__incompleted_tasks_vue__["a" /* default */],
        'completed-tasks': __WEBPACK_IMPORTED_MODULE_2__completed_tasks_vue__["a" /* default */]
    },

    methods: {
        is_assigned(task) {
            return true;
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
        getIncompletedTasks(lists) {
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
        getCompleteTask(lists) {
            return lists.tasks.filter(function (task) {
                return task.completed == '1' || task.completed;
            });
        },

        /**
         * Class for showing task private incon
         * 
         * @param  obje task 
         * 
         * @return string      
         */
        privateClass(task) {
            return task.task_privacy == 'yes' ? 'pm-lock' : 'pm-unlock';
        },

        /**
         * Delete task
         * 
         * @return void
         */
        deleteTask(list_id, task_id) {
            if (!confirm(PM_Vars.message.confirm)) {
                return;
            }

            var self = this,
                list_index = this.getIndex(this.$store.state.lists, list_id, 'ID'),
                task_index = this.getIndex(this.$store.state.lists[list_index].tasks, task_id, 'ID'),
                form_data = {
                action: 'pm_task_delete',
                task_id: task_id,
                _wpnonce: PM_Vars.nonce
            };

            // Seding request for insert or update todo list
            jQuery.post(PM_Vars.ajaxurl, form_data, function (res) {
                if (res.success) {
                    // Display a success message, with a title
                    //pm.Toastr.success(res.data.success);

                    PM_Component_jQuery.fadeOut(task_id, function () {
                        self.$store.commit('after_delete_task', {
                            list_index: list_index,
                            task_index: task_index
                        });
                    });
                } else {
                    // Showing error
                    res.data.error.map(function (value, index) {
                        pm.Toastr.error(value);
                    });
                }
            });
        }
    }
});

/***/ }),

/***/ 473:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__new_task_list_btn_vue__ = __webpack_require__(450);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__new_task_list_form_vue__ = __webpack_require__(305);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__new_task_btn_vue__ = __webpack_require__(323);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__common_pagination_vue__ = __webpack_require__(148);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__common_header_vue__ = __webpack_require__(143);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__list_tasks_vue__ = __webpack_require__(542);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__default_list_page_vue__ = __webpack_require__(539);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
												vm.getSelfLists();
												vm.getGlobalMilestones();
								});
				},
				components: {
								'new-task-list-btn': __WEBPACK_IMPORTED_MODULE_0__new_task_list_btn_vue__["a" /* default */],
								'new-task-list-form': __WEBPACK_IMPORTED_MODULE_1__new_task_list_form_vue__["a" /* default */],
								'new-task-button': __WEBPACK_IMPORTED_MODULE_2__new_task_btn_vue__["a" /* default */],
								'pm-pagination': __WEBPACK_IMPORTED_MODULE_3__common_pagination_vue__["a" /* default */],
								'pm-header': __WEBPACK_IMPORTED_MODULE_4__common_header_vue__["a" /* default */],
								'list-tasks': __WEBPACK_IMPORTED_MODULE_5__list_tasks_vue__["a" /* default */],
								'default-list-page': __WEBPACK_IMPORTED_MODULE_6__default_list_page_vue__["a" /* default */]
				},

				/**
     * Initial data for this component
     * 
     * @return obj
     */
				data() {
								return {
												list: {},
												index: false,
												project_id: this.$route.params.project_id,
												current_page_number: 1,
												loading: true
								};
				},

				watch: {
								'$route'(route) {
												this.getSelfLists();
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
								lists() {
												return this.$store.state.lists;
								},

								/**
         * Get milestones from vuex store
         * 
         * @return array
         */
								milestones() {
												return this.$store.state.milestones;
								},

								is_active_list_form() {
												return this.$store.state.is_active_list_form;
								},

								total_list_page() {
												return this.$store.state.lists_meta.total_pages;
								},

								is_blank_Template() {
												return this.$store.state.balankTemplateStatus;
								},
								is_list_Template() {
												return this.$store.state.listTemplateStatus;
								}

				},

				methods: {

								showEditForm(list, index) {
												list.edit_mode = list.edit_mode ? false : true;
								},

								getSelfLists() {
												var self = this;
												var args = {
																callback: function (res) {
																				pm.NProgress.done();
																				self.loading = false;
																}
												};
												this.getLists(args);
								},

								deleteSelfList(list) {
												var self = this;
												var args = {
																list_id: list.id,
																callback: function (res) {
																				if (!self.$store.state.lists.length) {
																								self.$router.push({
																												name: 'task_lists',
																												params: {
																																project_id: self.project_id
																												}
																								});
																				} else {

																								self.getLists();
																				}
																}
												};
												this.deleteList(args);
								}
				}
});

/***/ }),

/***/ 474:
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
            permissions: this.$store.state.permissions
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
    },

    methods: {}
});

/***/ }),

/***/ 531:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(15)(undefined);
// imports


// module
exports.push([module.i, "\n.pm-list-footer .pm-new-task-btn-li {\n\t\tpadding-left: 0 !important;\n}\n.pm-list-footer .pm-footer-left-ul li {\n\t\tdisplay: inline-block;\n\t\tpadding-left: 28px;\n\t    background-size: 20px;\n\t    background-repeat: no-repeat;\n\t    margin: 5px 0;\n\t    padding-bottom: 5px;\n\t    margin-right: 2%;\n}\n.pm-list-footer .pm-footer-left-ul li a {\n\t\tline-height: 150%;\n    \tfont-size: 12px;\n}\n.pm-list-footer .pm-footer-left {\n\t\twidth: 66%;\n}\n.pm-list-footer .pm-footer-right {\n\t\twidth: 30%;\n}\n.pm-list-footer .pm-footer-left, .pm-list-footer .pm-footer-right {\n\t\tfloat: left;\n}\n.pm-list-footer .pm-todo-progress-bar, .pm-list-footer .pm-progress-percent {\n\t\tdisplay: inline-block;\n}\n.pm-list-footer .pm-todo-progress-bar {\n\t\twidth: 70%;\n}\n.pm-list-footer .pm-progress-percent {\n\t\tmargin-left: 6px;\n}\n\n", ""]);

// exports


/***/ }),

/***/ 539:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_default_list_page_vue__ = __webpack_require__(469);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_ff8f8ff2_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_default_list_page_vue__ = __webpack_require__(574);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_default_list_page_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_ff8f8ff2_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_default_list_page_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/components/project-task-lists/default-list-page.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-ff8f8ff2", Component.options)
  } else {
    hotAPI.reload("data-v-ff8f8ff2", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 542:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_list_tasks_vue__ = __webpack_require__(472);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_e71f728c_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_list_tasks_vue__ = __webpack_require__(572);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_list_tasks_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_e71f728c_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_list_tasks_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/components/project-task-lists/list-tasks.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-e71f728c", Component.options)
  } else {
    hotAPI.reload("data-v-e71f728c", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 551:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", [
    _c(
      "a",
      {
        staticClass:
          "pm-btn pm-btn-blue pm-margin-bottom add-tasklist pm-btn-uppercase",
        attrs: { href: "#" },
        on: {
          click: function($event) {
            $event.preventDefault()
            _vm.showHideListForm("toggle")
          }
        }
      },
      [
        !_vm.show_list_form
          ? _c("i", {
              staticClass: "fa fa-plus-circle",
              attrs: { "aria-hidden": "true" }
            })
          : _vm._e(),
        _vm._v(" "),
        _vm.show_list_form
          ? _c("i", {
              staticClass: "fa fa-minus-circle",
              attrs: { "aria-hidden": "true" }
            })
          : _vm._e(),
        _vm._v("\n\t    " + _vm._s(_vm.text.new_task_list) + "\n\t")
      ]
    )
  ])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-29e93486", esExports)
  }
}

/***/ }),

/***/ 556:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    [
      _c("pm-header"),
      _vm._v(" "),
      _vm.loading
        ? _c("div", { staticClass: "pm-data-load-before" }, [_vm._m(0)])
        : _c(
            "div",
            [
              _vm.is_blank_Template ? _c("default-list-page") : _vm._e(),
              _vm._v(" "),
              _vm.is_list_Template
                ? _c(
                    "div",
                    {
                      staticClass: "pm-task-container wrap",
                      attrs: { id: "pm-task-el" }
                    },
                    [
                      _c("new-task-list-btn"),
                      _vm._v(" "),
                      _vm.is_active_list_form
                        ? _c("new-task-list-form", {
                            attrs: { section: "lists", list: {} }
                          })
                        : _vm._e(),
                      _vm._v(" "),
                      _c(
                        "ul",
                        { staticClass: "pm-todolists" },
                        _vm._l(_vm.lists, function(list, index) {
                          return _c(
                            "li",
                            { key: list.id, class: "pm-fade-out-" + list.id },
                            [
                              _c(
                                "article",
                                { staticClass: "pm-todolist" },
                                [
                                  _c(
                                    "header",
                                    { staticClass: "pm-list-header" },
                                    [
                                      _c(
                                        "h3",
                                        [
                                          _c(
                                            "router-link",
                                            {
                                              attrs: {
                                                to: {
                                                  name: "single_list",
                                                  params: {
                                                    list_id: list.id
                                                  }
                                                }
                                              }
                                            },
                                            [
                                              _vm._v(
                                                "\n\t\t\t                    \t" +
                                                  _vm._s(list.title) +
                                                  "\n\t\t\t                    \t\n\t\t\t                    \t"
                                              )
                                            ]
                                          ),
                                          _vm._v(" "),
                                          _c("span", {
                                            class: _vm.privateClass(list)
                                          }),
                                          _vm._v(" "),
                                          _c(
                                            "div",
                                            { staticClass: "pm-right" },
                                            [
                                              _c(
                                                "a",
                                                {
                                                  attrs: {
                                                    href: "#",
                                                    title: "Edit this List"
                                                  },
                                                  on: {
                                                    click: function($event) {
                                                      $event.preventDefault()
                                                      _vm.showEditForm(list)
                                                    }
                                                  }
                                                },
                                                [
                                                  _c("span", {
                                                    staticClass:
                                                      "dashicons dashicons-edit"
                                                  })
                                                ]
                                              ),
                                              _vm._v(" "),
                                              _c(
                                                "a",
                                                {
                                                  staticClass:
                                                    "pm-btn pm-btn-xs",
                                                  attrs: { href: "#" },
                                                  on: {
                                                    click: function($event) {
                                                      $event.preventDefault()
                                                      _vm.deleteSelfList(list)
                                                    }
                                                  }
                                                },
                                                [
                                                  _c("span", {
                                                    staticClass:
                                                      "dashicons dashicons-trash"
                                                  })
                                                ]
                                              )
                                            ]
                                          )
                                        ],
                                        1
                                      ),
                                      _vm._v(" "),
                                      _c(
                                        "div",
                                        { staticClass: "pm-entry-detail" },
                                        [
                                          _vm._v(
                                            "\n\t\t\t                        " +
                                              _vm._s(list.description) +
                                              "    \n\t\t\t                    "
                                          )
                                        ]
                                      ),
                                      _vm._v(" "),
                                      list.edit_mode
                                        ? _c(
                                            "div",
                                            {
                                              staticClass:
                                                "pm-update-todolist-form"
                                            },
                                            [
                                              _c("new-task-list-form", {
                                                attrs: {
                                                  section: "lists",
                                                  list: list
                                                }
                                              })
                                            ],
                                            1
                                          )
                                        : _vm._e()
                                    ]
                                  ),
                                  _vm._v(" "),
                                  _c("list-tasks", { attrs: { list: list } }),
                                  _vm._v(" "),
                                  _c(
                                    "footer",
                                    { staticClass: "pm-row pm-list-footer" },
                                    [
                                      _c(
                                        "div",
                                        { staticClass: "pm-footer-left" },
                                        [
                                          _c(
                                            "ul",
                                            {
                                              staticClass: "pm-footer-left-ul"
                                            },
                                            [
                                              _vm.isIncompleteLoadMoreActive(
                                                list
                                              )
                                                ? _c(
                                                    "li",
                                                    {
                                                      staticClass:
                                                        "pm-todo-refresh"
                                                    },
                                                    [
                                                      _c(
                                                        "a",
                                                        {
                                                          attrs: { href: "#" },
                                                          on: {
                                                            click: function(
                                                              $event
                                                            ) {
                                                              $event.preventDefault()
                                                              _vm.loadMoreIncompleteTasks(
                                                                list
                                                              )
                                                            }
                                                          }
                                                        },
                                                        [
                                                          _vm._v(
                                                            _vm._s(
                                                              _vm.text
                                                                .more_tasks
                                                            )
                                                          )
                                                        ]
                                                      )
                                                    ]
                                                  )
                                                : _vm._e(),
                                              _vm._v(" "),
                                              _c(
                                                "li",
                                                {
                                                  staticClass:
                                                    "pm-new-task-btn-li"
                                                },
                                                [
                                                  _c("new-task-button", {
                                                    attrs: {
                                                      task: {},
                                                      list: list
                                                    }
                                                  })
                                                ],
                                                1
                                              ),
                                              _vm._v(" "),
                                              _c(
                                                "li",
                                                {
                                                  staticClass:
                                                    "pm-todo-complete"
                                                },
                                                [
                                                  _c(
                                                    "router-link",
                                                    {
                                                      attrs: {
                                                        to: {
                                                          name: "single_list",
                                                          params: {
                                                            list_id: list.id
                                                          }
                                                        }
                                                      }
                                                    },
                                                    [
                                                      _c("span", [
                                                        _vm._v(
                                                          _vm._s(
                                                            list.meta
                                                              .total_complete_tasks
                                                          )
                                                        )
                                                      ]),
                                                      _vm._v(" "),
                                                      _vm._v(
                                                        "\n\t\t\t\t                                " +
                                                          _vm._s(
                                                            _vm.text.completed
                                                          ) +
                                                          "\n\t\t\t\t                            "
                                                      )
                                                    ]
                                                  )
                                                ],
                                                1
                                              ),
                                              _vm._v(" "),
                                              _c(
                                                "li",
                                                {
                                                  staticClass:
                                                    "pm-todo-incomplete"
                                                },
                                                [
                                                  _c(
                                                    "router-link",
                                                    {
                                                      attrs: {
                                                        to: {
                                                          name: "single_list",
                                                          params: {
                                                            list_id: list.id
                                                          }
                                                        }
                                                      }
                                                    },
                                                    [
                                                      _c("span", [
                                                        _vm._v(
                                                          _vm._s(
                                                            list.meta
                                                              .total_incomplete_tasks
                                                          )
                                                        )
                                                      ]),
                                                      _vm._v(" "),
                                                      _vm._v(
                                                        "\n\t\t\t\t                                " +
                                                          _vm._s(
                                                            _vm.text.incomplete
                                                          ) +
                                                          "\n\t\t\t\t                            "
                                                      )
                                                    ]
                                                  )
                                                ],
                                                1
                                              ),
                                              _vm._v(" "),
                                              _c(
                                                "li",
                                                {
                                                  staticClass: "pm-todo-comment"
                                                },
                                                [
                                                  _c(
                                                    "router-link",
                                                    {
                                                      attrs: {
                                                        to: {
                                                          name: "single_list",
                                                          params: {
                                                            list_id: list.id
                                                          }
                                                        }
                                                      }
                                                    },
                                                    [
                                                      _c("span", [
                                                        _vm._v(
                                                          _vm._s(
                                                            list.meta
                                                              .total_comments
                                                          ) +
                                                            " " +
                                                            _vm._s(
                                                              _vm.text.comments
                                                            )
                                                        )
                                                      ])
                                                    ]
                                                  )
                                                ],
                                                1
                                              )
                                            ]
                                          )
                                        ]
                                      ),
                                      _vm._v(" "),
                                      _c(
                                        "div",
                                        { staticClass: "pm-footer-right" },
                                        [
                                          _c(
                                            "div",
                                            {
                                              staticClass:
                                                "pm-todo-progress-bar"
                                            },
                                            [
                                              _c("div", {
                                                staticClass: "bar completed",
                                                style: _vm.getProgressStyle(
                                                  list
                                                )
                                              })
                                            ]
                                          ),
                                          _vm._v(" "),
                                          _c(
                                            "div",
                                            {
                                              staticClass: "pm-progress-percent"
                                            },
                                            [
                                              _vm._v(
                                                _vm._s(
                                                  _vm.getProgressPercent(list)
                                                ) + "%"
                                              )
                                            ]
                                          )
                                        ]
                                      ),
                                      _vm._v(" "),
                                      _c("div", { staticClass: "pm-clearfix" })
                                    ]
                                  )
                                ],
                                1
                              )
                            ]
                          )
                        })
                      ),
                      _vm._v(" "),
                      _c("pm-pagination", {
                        attrs: {
                          total_pages: _vm.total_list_page,
                          current_page_number: _vm.current_page_number,
                          component_name: "list_pagination"
                        }
                      })
                    ],
                    1
                  )
                : _vm._e(),
              _vm._v(" "),
              _vm.lists.length
                ? _c("router-view", { attrs: { name: "single-task" } })
                : _vm._e()
            ],
            1
          )
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
    require("vue-hot-reload-api")      .rerender("data-v-410523ca", esExports)
  }
}

/***/ }),

/***/ 572:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "pm-incomplete-tasks" }, [
    _c(
      "ul",
      {
        directives: [{ name: "pm-sortable", rawName: "v-pm-sortable" }],
        staticClass: "pm-todos pm-todolist-content pm-incomplete-task"
      },
      [
        _vm._l(_vm.getIncompleteTasks, function(task, task_index) {
          return _c(
            "li",
            {
              key: task.id,
              staticClass: "pm-todo",
              class: "pm-fade-out-" + task.id,
              attrs: { "data-id": task.id, "data-order": task.order }
            },
            [
              _c("incompleted-tasks", { attrs: { task: task, list: _vm.list } })
            ],
            1
          )
        }),
        _vm._v(" "),
        !_vm.getIncompleteTasks.length
          ? _c("li", { staticClass: "nonsortable" }, [
              _vm._v(_vm._s(_vm.text.no_tasks_found))
            ])
          : _vm._e(),
        _vm._v(" "),
        _vm.list.show_task_form
          ? _c(
              "li",
              { staticClass: "pm-todo-form nonsortable" },
              [_c("new-task-form", { attrs: { task: {}, list: _vm.list } })],
              1
            )
          : _vm._e()
      ],
      2
    )
  ])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-e71f728c", esExports)
  }
}

/***/ }),

/***/ 574:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "pm-blank-template todolist" }, [
    _c(
      "div",
      { staticClass: "pm-content" },
      [
        _c("h3", { staticClass: "pm-page-title" }, [
          _vm._v(_vm._s(_vm.text.task_lists))
        ]),
        _vm._v(" "),
        _c("p", [
          _vm._v(
            "\n            " + _vm._s(_vm.text.task_lists_define) + "\n        "
          )
        ]),
        _vm._v(" "),
        _c("new-task-list-btn"),
        _vm._v(" "),
        _vm.is_active_list_form
          ? _c("new-task-list-form", { attrs: { section: "lists", list: {} } })
          : _vm._e(),
        _vm._v(" "),
        _c("div", { staticClass: "pm-list-content" }, [
          _c("h3", { staticClass: "pm-why-for pm-page-title" }, [
            _vm._v(_vm._s(_vm.text.when_use_task))
          ]),
          _vm._v(" "),
          _c("ul", { staticClass: "pm-list" }, [
            _c("li", [_vm._v(_vm._s(_vm.text.to_pertition_project))]),
            _vm._v(" "),
            _c("li", [_vm._v(_vm._s(_vm.text.to_milestone_points))]),
            _vm._v(" "),
            _c("li", [_vm._v(_vm._s(_vm.text.to_assaign_task))])
          ])
        ])
      ],
      1
    )
  ])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-ff8f8ff2", esExports)
  }
}

/***/ }),

/***/ 579:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(531);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(16)("62dc73ce", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-410523ca\",\"scoped\":false,\"hasInlineConfig\":false}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./lists.vue", function() {
     var newContent = require("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-410523ca\",\"scoped\":false,\"hasInlineConfig\":false}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./lists.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ })

});