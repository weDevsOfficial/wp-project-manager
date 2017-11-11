wedevsPmWebpack([6],{

/***/ 135:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__directive_js__ = __webpack_require__(137);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__directive_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__directive_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__project_new_user_form_vue__ = __webpack_require__(139);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
        //  var projects = this.$root.$store.state.projects;
        //              var index = this.getIndex(projects, this.project_id, 'id');

        //              if ( index !== false ) {
        //               return projects[index].assignees.data;
        //              } 
        //  return [];
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
        /**
         * Action after submit the form to save and update
         * @return {[void]} 
         */
        projectFormAction() {
            this.show_spinner = true;
            var args = {
                data: {
                    'title': this.project.title,
                    'categories': [this.project_cat],
                    'description': this.project.description,
                    'notify_users': this.project_notify,
                    'assignees': this.formatUsers(this.selectedUsers),
                    'status': this.project.status
                }
            };

            var self = this;
            if (this.is_update) {
                args.data.id = this.project.id;
                args.callback = function (res) {
                    self.show_spinner = false;
                };
                this.updateProject(args);
            } else {
                args.callback = function (res) {
                    self.show_spinner = false;
                    self.$router.push({
                        name: 'pm_overview',
                        params: {
                            project_id: res.data.id
                        }
                    });
                };
                this.newProject(args);
            }
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

/***/ 136:
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

/***/ 137:
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

/***/ 138:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_project_create_form_vue__ = __webpack_require__(135);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_005bbc60_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_project_create_form_vue__ = __webpack_require__(140);
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

/***/ 139:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_project_new_user_form_vue__ = __webpack_require__(136);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_1f4c3778_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_project_new_user_form_vue__ = __webpack_require__(141);
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

/***/ 140:
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
            _vm.projectFormAction()
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
              "\n                " +
                _vm._s(_vm.text.notify_co_workers) +
                "            \n            "
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

/***/ 141:
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

/***/ 147:
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

/***/ 149:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_pagination_vue__ = __webpack_require__(147);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_375a100b_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_pagination_vue__ = __webpack_require__(150);
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

/***/ 150:
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
                  [_vm._v("\n            «\n        ")]
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
                [_vm._v("\n            " + _vm._s(page) + "\n        ")]
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
                  [_vm._v("\n            »\n        ")]
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

/***/ 162:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__project_new_project_btn_vue__ = __webpack_require__(292);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__project_filter_by_category_vue__ = __webpack_require__(290);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__project_search_by_client_vue__ = __webpack_require__(294);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__project_search_all_vue__ = __webpack_require__(293);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__project_header_menu_vue__ = __webpack_require__(291);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__project_view_vue__ = __webpack_require__(296);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
        'project-new-project-btn': __WEBPACK_IMPORTED_MODULE_0__project_new_project_btn_vue__["a" /* default */],
        'project-filter-by-category': __WEBPACK_IMPORTED_MODULE_1__project_filter_by_category_vue__["a" /* default */],
        'project-search-by-client': __WEBPACK_IMPORTED_MODULE_2__project_search_by_client_vue__["a" /* default */],
        'project-search-all': __WEBPACK_IMPORTED_MODULE_3__project_search_all_vue__["a" /* default */],
        'project-header-menu': __WEBPACK_IMPORTED_MODULE_4__project_header_menu_vue__["a" /* default */],
        'project-view': __WEBPACK_IMPORTED_MODULE_5__project_view_vue__["a" /* default */]
    }
});

/***/ }),

/***/ 163:
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

/* harmony default export */ __webpack_exports__["a"] = ({
    data() {
        return {
            categorie_id: typeof this.$route.query.category === 'undefined' ? '-1' : this.$route.query.category
        };
    },
    computed: {
        categories() {
            return this.$root.$store.state.categories;
        }
    },

    methods: {
        categoryFilter() {
            var self = this;
            var extra_ele = {
                'category': self.categorie_id === '-1' ? false : self.categorie_id
            };

            var setQuery = this.setQuery(extra_ele);

            this.$router.push({
                query: setQuery
            });
        }
    }
});

/***/ }),

/***/ 164:
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

/* harmony default export */ __webpack_exports__["a"] = ({
    data() {
        return {
            all: '',
            complete: '',
            active: ''
        };
    },
    computed: {
        activated() {
            return this.$root.$store.state.projects_meta.total_incomplete;
        },
        completed() {
            return this.$root.$store.state.projects_meta.total_complete;
        },
        allof() {
            var incomplete = this.$root.$store.state.projects_meta.total_incomplete;
            var complete = this.$root.$store.state.projects_meta.total_complete;

            return incomplete + complete;
        }
    },
    created() {
        var route_name = this.$route.name;

        if (route_name === 'all_projects') {
            this.all = 'active';
        } else if (route_name === 'completed_projects') {
            this.complete = 'active';
        } else {
            this.active = 'active';
        }
    }
});

/***/ }),

/***/ 165:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//

var project_btn = {
    methods: {
        is_popup_active() {
            jQuery('#pm-project-dialog').dialog("open");
            //this.$store.commit('is_popup_active', {is_active: true});
        }
    }
};

/* harmony default export */ __webpack_exports__["a"] = (project_btn);

/***/ }),

/***/ 166:
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

/* harmony default export */ __webpack_exports__["a"] = ({
    data() {
        return {
            is_active_settings: false,
            is_update: false,
            project: {}
        };
    },
    computed: {
        projects() {
            return this.$root.$store.state.projects;
        },
        meta() {
            return this.$root.$store.state.projects_meta;
        }
    },

    methods: {

        settingsShowHide(project) {
            project.settings_hide = project.settings_hide ? false : true;
        },

        projectCompleteStatus(project) {
            //return ((100 * $progress['completed']) /  $progress['total']) + '%';
        },
        projectMarkAsDoneUndone(project) {
            var self = this;
            project.status = project.status === 'complete' ? 'incomplete' : 'complete';

            var args = {
                data: project,
                callback: function (project) {
                    switch (self.$route.name) {

                        case 'project_lists':
                            self.getProjects('status=incomplete');
                            break;

                        case 'completed_projects':
                            self.getProjects('status=complete');
                            break;

                        default:
                            self.getProjects();
                            break;
                    }
                }
            };

            this.updateProject(args);
        }
    }
});

/***/ }),

/***/ 167:
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

/* harmony default export */ __webpack_exports__["a"] = ({
    data() {
        return {
            projects_view: this.$store.state.projects_view
        };
    },
    created() {
        this.getCookie("project_view");
    },
    methods: {
        setcookie(name = "grid_view") {
            var d = new Date();
            d.setTime(d.getTime() + 365 * 24 * 60 * 60 * 1000);
            var expires = "expires=" + d.toUTCString();

            document.cookie = "project_view=" + name + ';' + expires;
            this.$store.commit('setProjectsView', name);
        },

        getCookie(key) {
            var cookies = document.cookie.split(';'),
                cookieslen = cookies.length;
            key = key + "=";

            for (var i = 0; i < cookieslen; i++) {
                var c = cookies[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }

                if (c.indexOf(name) == 0) {
                    this.$store.commit('setProjectsView', c.substring(key.length, c.length));
                    return c.substring(key.length, c.length);
                }
            }

            return "";
        },
        activeClass(view) {
            return this.$store.state.projects_view === view;
        }
    }
});

/***/ }),

/***/ 168:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

/**
 * Make sure to call pm.Vue.use(Vuex) first if using a vuex module system
 */
var Store = {
    state: {
        projects: [],
        project_users: [],
        roles: [],
        categories: [],
        total_pages: 0,
        projects_view: ''
    },

    mutations: {

        newProject(state, projects) {
            state.projects.push(projects.projects);
        },

        setProjectUsers(state, users) {
            if (!users.users.hasOwnProperty('roles')) {
                users.users.roles = {
                    'data': {
                        'id': 3,
                        'title': '',
                        'description': ''
                    }
                };
            }
            var has_in_array = state.project_users.filter(user => {
                return user.id === users.users.id;
            });

            if (!has_in_array.length) {
                state.project_users.push(users.users);
            }
        },

        setRoles(state, roles) {
            state.roles = roles.roles;
        },

        setCategories(state, categories) {
            state.categories = categories.categories;
        },

        setPagination(state, pagination) {
            state.total_pages = pagination.pagination.total_pages;
        },
        setProjectsView(state, value) {
            state.projects_view = value;
        }
    }
};

/* harmony default export */ __webpack_exports__["a"] = (new pm.Vuex.Store(Store));

/***/ }),

/***/ 170:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(18)(undefined);
// imports


// module
exports.push([module.i, "\n.fa-circle {\n    margin-right: 6%;\n}\n", ""]);

// exports


/***/ }),

/***/ 289:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_header_vue__ = __webpack_require__(162);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_254b3f3e_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_header_vue__ = __webpack_require__(299);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_header_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_254b3f3e_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_header_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/components/project-lists/header.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-254b3f3e", Component.options)
  } else {
    hotAPI.reload("data-v-254b3f3e", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 290:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_project_filter_by_category_vue__ = __webpack_require__(163);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_6e8f6544_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_project_filter_by_category_vue__ = __webpack_require__(302);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_project_filter_by_category_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_6e8f6544_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_project_filter_by_category_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/components/project-lists/project-filter-by-category.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-6e8f6544", Component.options)
  } else {
    hotAPI.reload("data-v-6e8f6544", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 291:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_project_header_menu_vue__ = __webpack_require__(164);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_1485f10a_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_project_header_menu_vue__ = __webpack_require__(298);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_project_header_menu_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_1485f10a_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_project_header_menu_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/components/project-lists/project-header-menu.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-1485f10a", Component.options)
  } else {
    hotAPI.reload("data-v-1485f10a", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 292:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_project_new_project_btn_vue__ = __webpack_require__(165);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7da9f1e6_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_project_new_project_btn_vue__ = __webpack_require__(303);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_project_new_project_btn_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7da9f1e6_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_project_new_project_btn_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/components/project-lists/project-new-project-btn.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7da9f1e6", Component.options)
  } else {
    hotAPI.reload("data-v-7da9f1e6", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 293:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_template_compiler_index_id_data_v_6d0cdce1_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_project_search_all_vue__ = __webpack_require__(301);
var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */
var __vue_script__ = null
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
  __vue_script__,
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_template_compiler_index_id_data_v_6d0cdce1_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_project_search_all_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/components/project-lists/project-search-all.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-6d0cdce1", Component.options)
  } else {
    hotAPI.reload("data-v-6d0cdce1", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 294:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_template_compiler_index_id_data_v_27bac741_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_project_search_by_client_vue__ = __webpack_require__(300);
var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */
var __vue_script__ = null
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
  __vue_script__,
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_template_compiler_index_id_data_v_27bac741_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_project_search_by_client_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/components/project-lists/project-search-by-client.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-27bac741", Component.options)
  } else {
    hotAPI.reload("data-v-27bac741", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 295:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_project_summary_vue__ = __webpack_require__(166);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0ca87a11_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_project_summary_vue__ = __webpack_require__(297);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(305)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_project_summary_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0ca87a11_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_project_summary_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/components/project-lists/project-summary.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0ca87a11", Component.options)
  } else {
    hotAPI.reload("data-v-0ca87a11", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 296:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_project_view_vue__ = __webpack_require__(167);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_fe2a4e6c_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_project_view_vue__ = __webpack_require__(304);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_project_view_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_fe2a4e6c_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_project_view_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/components/project-lists/project-view.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-fe2a4e6c", Component.options)
  } else {
    hotAPI.reload("data-v-fe2a4e6c", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 297:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    [
      !_vm.projects.length
        ? _c("div", [_vm._v(_vm._s(_vm.text.no_project_found))])
        : _vm._e(),
      _vm._v(" "),
      _vm._l(_vm.projects, function(project) {
        return _c(
          "article",
          { staticClass: "pm-project pm-column-gap-left pm-sm-col-12" },
          [
            _c(
              "router-link",
              {
                attrs: {
                  title: project.title,
                  to: {
                    name: "pm_overview",
                    params: { project_id: project.id }
                  }
                }
              },
              [
                _c("div", { staticClass: "project_head" }, [
                  _c("h5", [_vm._v(_vm._s(project.title))]),
                  _vm._v(" "),
                  _c("div", { staticClass: "pm-project-detail" })
                ])
              ]
            ),
            _vm._v(" "),
            _c("div", { staticClass: "pm-project-meta" }, [
              _c("ul", [
                _c(
                  "li",
                  { staticClass: "message" },
                  [
                    _c(
                      "router-link",
                      {
                        attrs: {
                          to: {
                            name: "discussions",
                            params: {
                              project_id: project.id
                            }
                          }
                        }
                      },
                      [
                        _c("strong", [
                          _c("i", {
                            staticClass: "fa fa-circle",
                            attrs: { "aria-hidden": "true" }
                          }),
                          _vm._v(
                            "\n                               " +
                              _vm._s(
                                parseInt(project.meta.total_discussion_boards)
                              ) +
                              "\n                           "
                          )
                        ]),
                        _vm._v(
                          " \n                               " +
                            _vm._s(_vm.text.discussions) +
                            "\n\n                       "
                        )
                      ]
                    )
                  ],
                  1
                ),
                _vm._v(" "),
                _c(
                  "li",
                  { staticClass: "todo" },
                  [
                    _c(
                      "router-link",
                      {
                        attrs: {
                          to: {
                            name: "task_lists",
                            params: {
                              project_id: project.id
                            }
                          }
                        }
                      },
                      [
                        _c("strong", [
                          _c("i", {
                            staticClass: "fa fa-circle",
                            attrs: { "aria-hidden": "true" }
                          }),
                          _vm._v(
                            "\n                               " +
                              _vm._s(parseInt(project.meta.total_task_lists)) +
                              "\n                           "
                          )
                        ]),
                        _vm._v(
                          " \n                               " +
                            _vm._s(_vm.text.task_lists) +
                            "\n                       "
                        )
                      ]
                    )
                  ],
                  1
                ),
                _vm._v(" "),
                _c(
                  "li",
                  { staticClass: "files" },
                  [
                    _c(
                      "router-link",
                      {
                        attrs: {
                          to: {
                            name: "task_lists",
                            params: {
                              project_id: project.id
                            }
                          }
                        }
                      },
                      [
                        _c("strong", [
                          _c("i", {
                            staticClass: "fa fa-circle",
                            attrs: { "aria-hidden": "true" }
                          }),
                          _vm._v(
                            "\n                               " +
                              _vm._s(parseInt(project.meta.total_tasks)) +
                              "\n                           "
                          )
                        ]),
                        _vm._v(
                          " \n                               " +
                            _vm._s(_vm.text.tasks) +
                            "\n                       "
                        )
                      ]
                    )
                  ],
                  1
                ),
                _vm._v(" "),
                _c(
                  "li",
                  { staticClass: "milestone" },
                  [
                    _c(
                      "router-link",
                      {
                        attrs: {
                          to: {
                            name: "milestones",
                            params: {
                              project_id: project.id
                            }
                          }
                        }
                      },
                      [
                        _c("strong", [
                          _c("i", {
                            staticClass: "fa fa-circle",
                            attrs: { "aria-hidden": "true" }
                          }),
                          _vm._v(
                            "\n                               " +
                              _vm._s(parseInt(project.meta.total_milestones)) +
                              "\n                           "
                          )
                        ]),
                        _vm._v(
                          " \n                               " +
                            _vm._s(_vm.text.milestones) +
                            "\n                       "
                        )
                      ]
                    )
                  ],
                  1
                ),
                _vm._v(" "),
                _c(
                  "li",
                  { staticClass: "files" },
                  [
                    _c(
                      "router-link",
                      {
                        attrs: {
                          to: {
                            name: "task_lists",
                            params: {
                              project_id: project.id
                            }
                          }
                        }
                      },
                      [
                        _c("strong", [
                          _c("i", {
                            staticClass: "fa fa-circle",
                            attrs: { "aria-hidden": "true" }
                          }),
                          _vm._v(
                            "\n                               " +
                              _vm._s(parseInt(project.meta.total_files)) +
                              "\n                           "
                          )
                        ]),
                        _vm._v(
                          " \n                               " +
                            _vm._s(_vm.text.files) +
                            "\n                       "
                        )
                      ]
                    )
                  ],
                  1
                ),
                _vm._v(" "),
                _c("li", { staticClass: "milestone" }, [
                  _c("a", { attrs: { href: "#" } }, [
                    _c("strong", [
                      _c("i", {
                        staticClass: "fa fa-circle",
                        attrs: { "aria-hidden": "true" }
                      }),
                      _vm._v(
                        "\n                               " +
                          _vm._s(parseInt(project.meta.total_comments)) +
                          "\n                           "
                      )
                    ]),
                    _vm._v(
                      " \n                               " +
                        _vm._s(_vm.text.comments) +
                        "\n                       "
                    )
                  ])
                ]),
                _vm._v(" "),
                _c("div", { staticClass: "clearfix" })
              ])
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "pm-progress pm-progress-info" }, [
              _c("div", {
                staticClass: "bar completed",
                style: _vm.projectCompleteStatus(project)
              })
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "pm-progress-percentage" }),
            _vm._v(" "),
            _c("footer", { staticClass: "pm-project-people" }, [
              _c(
                "div",
                { staticClass: "pm-scroll" },
                _vm._l(project.assignees.data, function(user) {
                  return _c("img", {
                    staticClass: "avatar avatar-48 photo",
                    attrs: {
                      alt: user.display_name,
                      src: user.avatar_url,
                      height: "48",
                      width: "48"
                    }
                  })
                })
              )
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "pm-project-action-icon" }, [
              _c("div", { staticClass: "pm-project-action" }, [
                _c("span", {
                  staticClass:
                    "dashicons dashicons-admin-generic pm-settings-bind",
                  attrs: { title: _vm.text.project_actions },
                  on: {
                    click: function($event) {
                      $event.preventDefault()
                      _vm.settingsShowHide(project)
                    }
                  }
                }),
                _vm._v(" "),
                project.settings_hide
                  ? _c("ul", { staticClass: "pm-settings" }, [
                      _c("li", [
                        _c("span", { staticClass: "pm-spinner" }),
                        _vm._v(" "),
                        _c(
                          "a",
                          {
                            staticClass: "pm-project-delete-link",
                            attrs: { title: _vm.text.delete_project },
                            on: {
                              click: function($event) {
                                $event.preventDefault()
                                _vm.deleteProject(project.id)
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
                            staticClass: "pm-archive",
                            on: {
                              click: function($event) {
                                $event.preventDefault()
                                _vm.projectMarkAsDoneUndone(project)
                              }
                            }
                          },
                          [
                            project.status === "incomplete"
                              ? _c("span", {
                                  staticClass: "dashicons dashicons-yes"
                                })
                              : _vm._e(),
                            _vm._v(" "),
                            project.status === "incomplete"
                              ? _c("span", [_vm._v(_vm._s(_vm.text.complete))])
                              : _vm._e(),
                            _vm._v(" "),
                            project.status === "complete"
                              ? _c("span", {
                                  staticClass: "dashicons dashicons-undo"
                                })
                              : _vm._e(),
                            _vm._v(" "),
                            project.status === "complete"
                              ? _c("span", [_vm._v(_vm._s(_vm.text.restore))])
                              : _vm._e()
                          ]
                        )
                      ])
                    ])
                  : _vm._e()
              ])
            ])
          ],
          1
        )
      }),
      _vm._v(" "),
      _c("div", { staticClass: "pm-clearfix" })
    ],
    2
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-0ca87a11", esExports)
  }
}

/***/ }),

/***/ 298:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "ul",
    { staticClass: "list-inline  pm-col-8 pm-project-group-ul" },
    [
      _c(
        "li",
        { class: _vm.active + " pm-sm-col-4" },
        [
          _c("router-link", { attrs: { to: { name: "project_lists" } } }, [
            _vm._v(
              "\n            " + _vm._s(_vm.text.active) + "\n            "
            ),
            _c("span", { staticClass: "count" }, [
              _vm._v(_vm._s(_vm.activated))
            ])
          ])
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "li",
        { class: _vm.complete + " pm-sm-col-4" },
        [
          _c("router-link", { attrs: { to: { name: "completed_projects" } } }, [
            _vm._v(
              "\n            " + _vm._s(_vm.text.completed) + " \n            "
            ),
            _c("span", { staticClass: "count" }, [
              _vm._v(_vm._s(_vm.completed))
            ])
          ])
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "li",
        { class: _vm.all + " pm-sm-col-4" },
        [
          _c("router-link", { attrs: { to: { name: "all_projects" } } }, [
            _vm._v("\n            " + _vm._s(_vm.text.all) + "\n            "),
            _c("span", { staticClass: "count" }, [_vm._v(_vm._s(_vm.allof))])
          ])
        ],
        1
      ),
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
    require("vue-hot-reload-api")      .rerender("data-v-1485f10a", esExports)
  }
}

/***/ }),

/***/ 299:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "pm-top-bar pm-no-padding" }, [
    _c("div", { staticClass: "pm-row pm-no-padding" }, [
      _c("div", { staticClass: "pm-col-6" }, [
        _c("h3", [_vm._v(_vm._s(_vm.text.project_manager))])
      ]),
      _vm._v(" "),
      _c("div", {
        staticClass:
          "pm-col-6 pm-top-right-btn pm-text-right pm-last-col show_desktop_only"
      }),
      _vm._v(" "),
      _c("div", { staticClass: "clearfix" })
    ]),
    _vm._v(" "),
    _c("div", { staticClass: "pm-row pm-no-padding pm-priject-search-bar" }, [
      _c(
        "div",
        { staticClass: "pm-col-3 pm-sm-col-12 pm-no-padding pm-no-margin" },
        [_c("project-new-project-btn")],
        1
      ),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "pm-col-9 pm-no-padding pm-no-margin pm-sm-col-12  " },
        [
          _c(
            "div",
            { staticClass: "pm-col-5 pm-sm-col-12" },
            [_c("project-filter-by-category")],
            1
          )
        ]
      ),
      _vm._v(" "),
      _c("div", { staticClass: "clearfix" })
    ]),
    _vm._v(" "),
    _c(
      "div",
      { staticClass: "pm-row pm-project-group" },
      [
        _c("project-header-menu"),
        _vm._v(" "),
        _c(
          "div",
          {
            staticClass: "pm-col-4 pm-last-col pm-text-right show_desktop_only"
          },
          [_c("project-view")],
          1
        )
      ],
      1
    ),
    _vm._v(" "),
    _c("div", { staticClass: "clearfix" })
  ])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-254b3f3e", esExports)
  }
}

/***/ }),

/***/ 30:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_completed_projects_vue__ = __webpack_require__(462);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_1356cd26_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_completed_projects_vue__ = __webpack_require__(551);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(580)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_completed_projects_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_1356cd26_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_completed_projects_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/components/project-lists/completed-projects.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-1356cd26", Component.options)
  } else {
    hotAPI.reload("data-v-1356cd26", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),

/***/ 300:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("input", {
    staticClass: "ui-autocomplete-input",
    attrs: {
      type: "text",
      id: "pm-search-client",
      name: "searchitem",
      placeholder: _vm.search_by_client,
      value: "",
      autocomplete: "off"
    }
  })
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-27bac741", esExports)
  }
}

/***/ }),

/***/ 301:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("input", {
    staticClass: "ui-autocomplete-input",
    attrs: {
      type: "text",
      id: "pm-all-search",
      name: "searchitem",
      placeholder: _vm.text.search_all,
      value: "",
      autocomplete: "off"
    }
  })
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-6d0cdce1", esExports)
  }
}

/***/ }),

/***/ 302:
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
        staticClass: "pm-project-filters",
        attrs: { action: "", method: "get", id: "pm-project-filters" }
      },
      [
        _c(
          "select",
          {
            directives: [
              {
                name: "model",
                rawName: "v-model",
                value: _vm.categorie_id,
                expression: "categorie_id"
              }
            ],
            on: {
              change: [
                function($event) {
                  var $$selectedVal = Array.prototype.filter
                    .call($event.target.options, function(o) {
                      return o.selected
                    })
                    .map(function(o) {
                      var val = "_value" in o ? o._value : o.value
                      return val
                    })
                  _vm.categorie_id = $event.target.multiple
                    ? $$selectedVal
                    : $$selectedVal[0]
                },
                function($event) {
                  _vm.categoryFilter()
                }
              ]
            }
          },
          [
            _c("option", { attrs: { value: "-1" } }, [
              _vm._v(
                "\n               " +
                  _vm._s(_vm.text.project_category) +
                  "\n            "
              )
            ]),
            _vm._v(" "),
            _vm._l(_vm.categories, function(categorie) {
              return _c("option", { domProps: { value: categorie.id } }, [
                _vm._v(
                  "\n                " +
                    _vm._s(categorie.title) +
                    "\n            "
                )
              ])
            })
          ],
          2
        )
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
    require("vue-hot-reload-api")      .rerender("data-v-6e8f6544", esExports)
  }
}

/***/ }),

/***/ 303:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "a",
    {
      staticClass: "pm-btn pm-plus-white pm-btn-uppercase",
      attrs: { href: "#", id: "pm-create-project" },
      on: {
        click: function($event) {
          $event.preventDefault()
          _vm.is_popup_active()
        }
      }
    },
    [
      _c("i", {
        staticClass: "fa fa-plus-circle",
        attrs: { "aria-hidden": "true" }
      }),
      _vm._v(" " + _vm._s(_vm.text.create_a_project) + "\n")
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
    require("vue-hot-reload-api")      .rerender("data-v-7da9f1e6", esExports)
  }
}

/***/ }),

/***/ 304:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("ul", { staticClass: "pm-project-view " }, [
    _c("li", [
      _c(
        "a",
        {
          staticClass: "change-view",
          attrs: { href: "javascript:void(0)", title: _vm.text.list_view },
          on: {
            click: function($event) {
              $event.preventDefault()
              _vm.setcookie("list_view")
            }
          }
        },
        [
          _c("span", {
            staticClass: " dashicons dashicons-menu",
            class: { active: _vm.activeClass("list_view") }
          })
        ]
      )
    ]),
    _vm._v(" "),
    _c("li", [
      _c(
        "a",
        {
          staticClass: "change-view",
          attrs: { href: "javascript:void(0)", title: _vm.text.grid_view },
          on: {
            click: function($event) {
              $event.preventDefault()
              _vm.setcookie("grid_view")
            }
          }
        },
        [
          _c("span", {
            staticClass: " dashicons dashicons-screenoptions",
            class: { active: _vm.activeClass("grid_view") }
          })
        ]
      )
    ]),
    _vm._v(" "),
    _c("div", { staticClass: "clearfix" })
  ])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-fe2a4e6c", esExports)
  }
}

/***/ }),

/***/ 305:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(170);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(19)("11f04804", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-0ca87a11\",\"scoped\":false,\"hasInlineConfig\":false}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./project-summary.vue", function() {
     var newContent = require("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-0ca87a11\",\"scoped\":false,\"hasInlineConfig\":false}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./project-summary.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 462:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__project_summary_vue__ = __webpack_require__(295);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_pagination_vue__ = __webpack_require__(149);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__project_create_form_vue__ = __webpack_require__(138);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__store__ = __webpack_require__(168);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__common_do_action_vue__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__header_vue__ = __webpack_require__(289);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
    store: __WEBPACK_IMPORTED_MODULE_3__store__["a" /* default */],

    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.projectQuery();
            vm.getRoles();
            vm.getProjectCategories();
        });
    },

    data() {
        return {
            current_page_number: 1,
            loading: true
        };
    },

    watch: {
        '$route'(route) {
            this.current_page_number = route.params.current_page_number;
            this.projectQuery();
        }
    },

    computed: {
        is_popup_active() {
            return this.$store.state.is_popup_active;
        },

        total_pages() {
            return this.$root.$store.state.pagination.total_pages;
        }
    },

    components: {
        'project-header': __WEBPACK_IMPORTED_MODULE_5__header_vue__["a" /* default */],
        'project-summary': __WEBPACK_IMPORTED_MODULE_0__project_summary_vue__["a" /* default */],
        'pm-pagination': __WEBPACK_IMPORTED_MODULE_1__common_pagination_vue__["a" /* default */],
        'project-create-form': __WEBPACK_IMPORTED_MODULE_2__project_create_form_vue__["a" /* default */],
        'do-action': __WEBPACK_IMPORTED_MODULE_4__common_do_action_vue__["a" /* default */]
    },

    methods: {
        projectQuery() {

            var add_query = {
                status: 'complete'
            };
            var query_params = this.getQueryParams(add_query);
            this.getProjects(query_params);
        }
    }
});

/***/ }),

/***/ 532:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(18)(undefined);
// imports


// module
exports.push([module.i, "\n.pm-project-meta .message .fa-circle {\n    color: #4975a8;\n}\n.pm-project-meta .todo .fa-circle {\n    color: #68af94;\n}\n.pm-project-meta .files .fa-circle {\n    color: #71c8cb;\n}\n.pm-project-meta .milestone .fa-circle {\n    color: #4975a8;\n}   \n\n", ""]);

// exports


/***/ }),

/***/ 551:
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
      _c("project-header"),
      _vm._v(" "),
      _vm.loading
        ? _c("div", { staticClass: "pm-data-load-before" }, [_vm._m(0)])
        : _vm._e(),
      _vm._v(" "),
      !_vm.loading
        ? _c(
            "div",
            {
              staticClass: "pm-projects pm-row pm-no-padding pm-no-margin",
              class: [_vm.projects_view_class()]
            },
            [
              _c("project-summary"),
              _vm._v(" "),
              _c("pm-pagination", {
                attrs: {
                  total_pages: _vm.total_pages,
                  current_page_number: _vm.current_page_number,
                  component_name: "completed_project_pagination"
                }
              })
            ],
            1
          )
        : _vm._e(),
      _vm._v(" "),
      _c(
        "div",
        {
          directives: [{ name: "pm-popup-box", rawName: "v-pm-popup-box" }],
          staticStyle: { "z-index": "999" },
          attrs: {
            id: "pm-project-dialog",
            title: _vm.text.start_a_new_project
          }
        },
        [_c("project-create-form", { attrs: { project: {} } })],
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
    require("vue-hot-reload-api")      .rerender("data-v-1356cd26", esExports)
  }
}

/***/ }),

/***/ 580:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(532);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(19)("c4d053e4", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-1356cd26\",\"scoped\":false,\"hasInlineConfig\":false}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./completed-projects.vue", function() {
     var newContent = require("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-1356cd26\",\"scoped\":false,\"hasInlineConfig\":false}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./completed-projects.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ })

});