wedevsPmWebpack([3],{

/***/ 175:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__directive_js__ = __webpack_require__(177);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__directive_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__directive_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__project_new_user_form_vue__ = __webpack_require__(179);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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

    data: function data() {

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
    created: function created() {
        this.setProjectUser();
    },

    computed: {
        roles: function roles() {
            return this.$root.$store.state.roles;
        },
        categories: function categories() {
            return this.$root.$store.state.categories;
        },
        project: function project() {
            var projects = this.$root.$store.state.projects;
            var index = this.getIndex(projects, this.project_id, 'id');

            if (index !== false) {
                return projects[index];
            }
            return {};
        },
        selectedUsers: function selectedUsers() {
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
            get: function get() {
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
            set: function set(cat) {
                this.project_cat = cat;
            }
        }

    },

    methods: {
        deleteUser: function deleteUser(del_user) {
            this.$root.$store.commit('afterDeleteUserFromProject', {
                project_id: this.project_id,
                user_id: del_user.id
            });
        },

        /**
         * Action after submit the form to save and update
         * @return {[void]} 
         */
        projectFormAction: function projectFormAction() {
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
        setProjectUser: function setProjectUser() {
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

/***/ 176:
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
    data: function data() {
        return {
            username: '',
            first_name: '',
            last_name: '',
            email: '',
            show_spinner: false
        };
    },


    methods: {
        createUser: function createUser() {
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

                success: function success(res) {
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

/***/ 177:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Project = {
    coWorkerSearch: function coWorkerSearch(el, binding, vnode) {

        var $ = jQuery;
        var pm_abort;
        var context = vnode.context;

        $(".pm-project-coworker").autocomplete({
            minLength: 3,

            source: function source(request, response) {
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

            search: function search() {
                $(this).addClass('pm-spinner');
            },

            open: function open() {
                var self = $(this);
                self.autocomplete('widget').css('z-index', 999999);
                self.removeClass('pm-spinner');
                return false;
            },

            select: function select(event, ui) {
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
    inserted: function inserted(el, binding, vnode) {
        Project.coWorkerSearch(el, binding, vnode);
    }
});

// Register a global custom directive called v-pm-popup-box
pm.Vue.directive('pm-popup-box', {
    inserted: function inserted(el) {
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

    inserted: function inserted(el) {
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

/***/ 178:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_project_create_form_vue__ = __webpack_require__(175);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_005bbc60_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_project_create_form_vue__ = __webpack_require__(180);
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

/***/ 179:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_project_new_user_form_vue__ = __webpack_require__(176);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_1f4c3778_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_project_new_user_form_vue__ = __webpack_require__(181);
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

/***/ 180:
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

/***/ 181:
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

/***/ 182:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__router_router__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__router_router___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__router_router__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__do_action_vue__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__project_lists_project_create_form_vue__ = __webpack_require__(178);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
    data: function data() {
        return {};
    },


    computed: {
        is_project_edit_mode: function is_project_edit_mode() {
            return this.$root.$store.state.is_project_form_active;
        },
        project: function project() {
            var projects = this.$root.$store.state.projects;

            var index = this.getIndex(projects, this.project_id, 'id');

            if (index !== false) {
                return projects[index];
            }

            return {};
        },
        menu: function menu() {
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

    created: function created() {
        this.getProject();
        this.getProjectCategories();
        this.getRoles();
    },


    components: {
        'do-action': __WEBPACK_IMPORTED_MODULE_1__do_action_vue__["a" /* default */],
        'edit-project': __WEBPACK_IMPORTED_MODULE_2__project_lists_project_create_form_vue__["a" /* default */]
    },

    methods: {
        showProjectAction: function showProjectAction() {
            this.$root.$store.commit('showHideProjectDropDownAction', {
                status: 'toggle',
                project_id: this.project_id
            });
        },
        selfProjectMarkDone: function selfProjectMarkDone(project) {
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

/***/ 183:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(50)(undefined);
// imports


// module
exports.push([module.i, "\n.pm-project-header .router-link-active {\n    border-bottom: solid 2px #019dd6 !important;\n    color: #000000 !important;\n}\n", ""]);

// exports


/***/ }),

/***/ 184:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_header_vue__ = __webpack_require__(182);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_2be34404_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_header_vue__ = __webpack_require__(185);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(186)
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

/***/ 185:
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

/***/ 186:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(183);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(51)("4110dfe3", content, false);
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

/***/ 191:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_text_editor_vue__ = __webpack_require__(192);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_ca7d7328_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_text_editor_vue__ = __webpack_require__(193);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_text_editor_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_ca7d7328_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_text_editor_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/components/common/text-editor.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-ca7d7328", Component.options)
  } else {
    hotAPI.reload("data-v-ca7d7328", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 192:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({

    //mixins: pm_todo_list_mixins( PM_Todo_List.todo_list_text_editor ),    

    // Get passing data for this component.
    props: ['editor_id', 'content'],

    // Initial action for this component
    created: function created() {
        var self = this;
        this.$root.$on('after_comment', this.afterComment);
        // After ready dom
        pm.Vue.nextTick(function () {
            // Remove the editor
            tinymce.execCommand('mceRemoveEditor', true, self.editor_id);

            // Instantiate the editor
            var settings = {
                selector: 'textarea#' + self.editor_id,
                menubar: false,
                placeholder: self.text.write_a_comments,
                branding: false,

                setup: function setup(editor) {
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
        afterComment: function afterComment() {
            tinyMCE.get(this.editor_id).setContent('');
        }
    }
});

/***/ }),

/***/ 193:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", [
    _c("textarea", {
      directives: [
        {
          name: "model",
          rawName: "v-model",
          value: _vm.content.html,
          expression: "content.html"
        }
      ],
      attrs: { id: _vm.editor_id },
      domProps: { value: _vm.content.html },
      on: {
        input: function($event) {
          if ($event.target.composing) {
            return
          }
          _vm.$set(_vm.content, "html", $event.target.value)
        }
      }
    })
  ])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-ca7d7328", esExports)
  }
}

/***/ }),

/***/ 195:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_file_uploader_vue__ = __webpack_require__(197);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_5b9b7584_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_file_uploader_vue__ = __webpack_require__(200);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_file_uploader_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_5b9b7584_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_file_uploader_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/components/common/file-uploader.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-5b9b7584", Component.options)
  } else {
    hotAPI.reload("data-v-5b9b7584", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 196:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_notifyUser_vue__ = __webpack_require__(198);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_da6233b6_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_notifyUser_vue__ = __webpack_require__(201);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_notifyUser_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_da6233b6_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_notifyUser_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/components/common/notifyUser.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-da6233b6", Component.options)
  } else {
    hotAPI.reload("data-v-da6233b6", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 197:
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

/* harmony default export */ __webpack_exports__["a"] = ({
    props: ['files', 'delete'],

    // Initial action for this component
    created: function created() {
        //this.files = typeof files.data ===

        var self = this;

        // Instantiate file upload, After dom ready
        pm.Vue.nextTick(function () {
            new PM_Uploader('pm-upload-pickfiles', 'pm-upload-container', self);
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
        fileUploaded: function fileUploaded(file_res) {

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
        deletefile: function deletefile(file_id) {
            if (!confirm(this.text.are_you_sure)) {
                return;
            }
            var self = this;
            var index = self.getIndex(self.files, file_id, 'id');

            if (index !== false) {
                self.files.splice(index, 1);
                this.delete.push(file_id);
            }
        }
    }
});

/***/ }),

/***/ 198:
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


/* harmony default export */ __webpack_exports__["a"] = ({
    props: ['value'],
    data: function data() {
        return {
            notify_users: [],
            select_all: false
        };
    },

    watch: {
        notify_users: function notify_users(value) {
            if (this.assain_users.length == value.length) {
                this.select_all = true;
            }
            if (this.assain_users.length !== value.length) {
                this.select_all = false;
            }
            this.$emit('input', value);
        }
    },
    computed: {
        assain_users: function assain_users() {
            return this.$root.$store.state.project_users;
        }
    },
    methods: {
        select_all_user: function select_all_user() {
            var self = this;
            if (this.select_all) {
                this.notify_users = [];
                this.assain_users.forEach(function (user) {
                    self.notify_users.push(user.id);
                });
            } else {
                this.notify_users = [];
            }
        }
    }
});

/***/ }),

/***/ 199:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_new_task_form_vue__ = __webpack_require__(357);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7db5a654_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_new_task_form_vue__ = __webpack_require__(384);
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

/***/ 200:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "pm-attachment-area" }, [
    _c("div", { attrs: { id: "pm-upload-container" } }, [
      _c(
        "div",
        { staticClass: "pm-upload-filelist" },
        _vm._l(_vm.files, function(file) {
          return _c("div", { key: file.id, staticClass: "pm-uploaded-item" }, [
            _c("a", { attrs: { href: file.url, target: "_blank" } }, [
              _c("img", { attrs: { src: file.thumb, alt: file.name } })
            ]),
            _vm._v(" "),
            _c(
              "a",
              {
                staticClass: "button",
                attrs: { href: "#" },
                on: {
                  click: function($event) {
                    $event.preventDefault()
                    _vm.deletefile(file.id)
                  }
                }
              },
              [_vm._v(_vm._s(_vm.text.delete_file))]
            )
          ])
        })
      ),
      _vm._v(" "),
      _c("span", {
        domProps: { innerHTML: _vm._s(_vm.text.attach_from_computer) }
      })
    ])
  ])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-5b9b7584", esExports)
  }
}

/***/ }),

/***/ 201:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "notify-users" }, [
    _c("h2", { staticClass: "pm-box-title" }, [
      _vm._v(
        " \n        " +
          _vm._s(_vm.text.notify_user) +
          "               \n        "
      ),
      _c(
        "label",
        { staticClass: "pm-small-title", attrs: { for: "select-all" } },
        [
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model",
                value: _vm.select_all,
                expression: "select_all"
              }
            ],
            staticClass: "pm-toggle-checkbox",
            attrs: { type: "checkbox", id: "select-all" },
            domProps: {
              checked: Array.isArray(_vm.select_all)
                ? _vm._i(_vm.select_all, null) > -1
                : _vm.select_all
            },
            on: {
              change: [
                function($event) {
                  var $$a = _vm.select_all,
                    $$el = $event.target,
                    $$c = $$el.checked ? true : false
                  if (Array.isArray($$a)) {
                    var $$v = null,
                      $$i = _vm._i($$a, $$v)
                    if ($$el.checked) {
                      $$i < 0 && (_vm.select_all = $$a.concat([$$v]))
                    } else {
                      $$i > -1 &&
                        (_vm.select_all = $$a
                          .slice(0, $$i)
                          .concat($$a.slice($$i + 1)))
                    }
                  } else {
                    _vm.select_all = $$c
                  }
                },
                function($event) {
                  _vm.select_all_user()
                }
              ]
            }
          }),
          _vm._v(" \n            " + _vm._s(_vm.text.select_all) + "\n        ")
        ]
      )
    ]),
    _vm._v(" "),
    _c(
      "ul",
      { staticClass: "pm-user-list" },
      [
        _vm._l(_vm.assain_users, function(user) {
          return _c("li", [
            _c("label", { attrs: { for: "pm_notify_1" } }, [
              _c("input", {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.notify_users,
                    expression: "notify_users"
                  }
                ],
                ref: "users",
                refInFor: true,
                attrs: { type: "checkbox", id: "pm_notify_1" },
                domProps: {
                  value: user.id,
                  checked: Array.isArray(_vm.notify_users)
                    ? _vm._i(_vm.notify_users, user.id) > -1
                    : _vm.notify_users
                },
                on: {
                  change: function($event) {
                    var $$a = _vm.notify_users,
                      $$el = $event.target,
                      $$c = $$el.checked ? true : false
                    if (Array.isArray($$a)) {
                      var $$v = user.id,
                        $$i = _vm._i($$a, $$v)
                      if ($$el.checked) {
                        $$i < 0 && (_vm.notify_users = $$a.concat([$$v]))
                      } else {
                        $$i > -1 &&
                          (_vm.notify_users = $$a
                            .slice(0, $$i)
                            .concat($$a.slice($$i + 1)))
                      }
                    } else {
                      _vm.notify_users = $$c
                    }
                  }
                }
              }),
              _vm._v(
                " \n                " + _vm._s(user.nicename) + "\n            "
              )
            ])
          ])
        }),
        _vm._v(" "),
        _c("div", { staticClass: "clearfix" })
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
    require("vue-hot-reload-api")      .rerender("data-v-da6233b6", esExports)
  }
}

/***/ }),

/***/ 351:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_new_task_list_form_vue__ = __webpack_require__(358);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_179153b3_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_new_task_list_form_vue__ = __webpack_require__(379);
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

/***/ 353:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__new_task_form_vue__ = __webpack_require__(199);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
    computed: {
        route_name: function route_name() {
            if (this.$route.name === 'single_list') {
                return 'single_task';
            }

            return 'lists_single_task';
        }
    },
    methods: {
        is_assigned: function is_assigned(task) {
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

/***/ 354:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({
    props: ['value', 'dependency'],
    mounted: function mounted() {
        var self = this,
            limit_date = self.dependency == 'pm-datepickter-from' ? "maxDate" : "minDate";

        jQuery(self.$el).datepicker({
            dateFormat: 'yy-mm-dd',
            changeYear: true,
            changeMonth: true,
            numberOfMonths: 1,
            onClose: function onClose(selectedDate) {
                jQuery("." + self.dependency).datepicker("option", limit_date, selectedDate);
            },
            onSelect: function onSelect(dateText) {
                self.$emit('input', dateText);
            }
        });
    }
});

/***/ }),

/***/ 355:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__new_task_form_vue__ = __webpack_require__(199);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
    computed: {
        route_name: function route_name() {
            if (this.$route.name === 'single_list') {
                return 'single_task';
            }

            return 'lists_single_task';
        }
    },
    methods: {
        is_assigned: function is_assigned(task) {
            return true;
            var get_current_user_id = this.$store.state.get_current_user_id,
                in_task = task.assigned_to.indexOf(get_current_user_id);

            if (task.can_del_edit || in_task != '-1') {
                return true;
            }

            return false;
        },

        doneUndone: function doneUndone() {
            var status = !this.task.status;
            this.taskDoneUndone(this.task, status, this.list);
        }
    }
});

/***/ }),

/***/ 356:
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
        newTaskBtnClass: function newTaskBtnClass() {
            return this.list.show_task_form ? 'pm-new-task-btn-minus' : 'pm-new-task-btn';
        }
    }
});

/***/ }),

/***/ 357:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty__ = __webpack_require__(360);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__date_picker_vue__ = __webpack_require__(376);


var _props$data$created$c;

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["a"] = (_props$data$created$c = {
    // Get passing data for this component. Remember only array and objects are
    props: ['list', 'task'],

    /**
     * Initial data for this component
     * 
     * @return obj
     */
    data: function data() {
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
    created: function created() {},

    components: {
        'multiselect': pm.Multiselect.Multiselect,
        'pm-datepickter': __WEBPACK_IMPORTED_MODULE_1__date_picker_vue__["a" /* default */]
    },

    beforeMount: function beforeMount() {
        this.setDefaultValue();
    }
}, __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default()(_props$data$created$c, 'created', function created() {
    this.$on('pm_date_picker', this.getDatePicker);
}), __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default()(_props$data$created$c, 'watch', {
    date_from: function date_from(new_date) {
        this.task.start_at = new_date;
    },

    date_to: function date_to(new_date) {
        this.task.due_date = new_date;
    },
    /**
     * Live check is the task private or not
     * 
     * @param  boolean val 
     * 
     * @return void     
     */
    task_privacy: function task_privacy(val) {
        if (val) {
            this.task.task_privacy = 'yes';
        } else {
            this.task.task_privacy = 'no';
        }
    }
}), __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default()(_props$data$created$c, 'computed', {
    project_users: function project_users() {
        return this.$root.$store.state.project_users;
    },

    /**
     * Check current user can view the todo or not
     * 
     * @return boolean
     */
    todo_view_private: function todo_view_private() {
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
        get: function get() {
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
        set: function set(selected_users) {
            this.assigned_to = selected_users.map(function (user) {
                return user.id;
            });
        }
    }
}), __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default()(_props$data$created$c, 'methods', {
    setDefaultValue: function setDefaultValue() {
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
    getDatePicker: function getDatePicker(data) {

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
    hideNewTaskForm: function hideNewTaskForm(list_index, task_id) {
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

    taskFormAction: function taskFormAction() {
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
            callback: function callback(res) {
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
}), _props$data$created$c);

/***/ }),

/***/ 358:
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


var pm_todo_list_mixins = function pm_todo_list_mixins(mixins, mixin_parent) {
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
    data: function data() {
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

    created: function created() {
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
        milestones: function milestones() {
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
        todolistFormClass: function todolistFormClass(list) {
            return list.ID ? 'pm-todo-form-wrap pm-form pm-slide-' + list.ID : 'pm-todo-list-form-wrap pm-form pm-slide-list';
        },


        /**
         * Insert and update todo list
         * 
         * @return void
         */
        listFormAction: function listFormAction() {

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
                    milestone: self.milestone_id,
                    order: self.list.order
                },
                callback: function callback(res) {
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
        singleAfterNewList: function singleAfterNewList(self, res, is_update) {
            if (is_update) {
                var condition = 'incomplete_tasks,complete_tasks,comments';
                self.getList(self, self.list.id, condition);
            }
        }
    }
});

/***/ }),

/***/ 359:
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(361), __esModule: true };

/***/ }),

/***/ 360:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _defineProperty = __webpack_require__(359);

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (obj, key, value) {
  if (key in obj) {
    (0, _defineProperty2.default)(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

/***/ }),

/***/ 361:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(367);
var $Object = __webpack_require__(4).Object;
module.exports = function defineProperty(it, key, desc) {
  return $Object.defineProperty(it, key, desc);
};


/***/ }),

/***/ 367:
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(12);
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !__webpack_require__(1), 'Object', { defineProperty: __webpack_require__(10).f });


/***/ }),

/***/ 368:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(50)(undefined);
// imports


// module
exports.push([module.i, "\n.pm-new-task-button-icon {\n    display: inline-block;\n    padding-left: 28px;\n    background-size: 20px;\n    background-repeat: no-repeat;\n}\n", ""]);

// exports


/***/ }),

/***/ 375:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_completed_tasks_vue__ = __webpack_require__(353);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_57228e01_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_completed_tasks_vue__ = __webpack_require__(381);
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

/***/ 376:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_date_picker_vue__ = __webpack_require__(354);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_44e443fc_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_date_picker_vue__ = __webpack_require__(380);
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

/***/ 377:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_incompleted_tasks_vue__ = __webpack_require__(355);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_79a0d97c_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_incompleted_tasks_vue__ = __webpack_require__(383);
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

/***/ 378:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_new_task_btn_vue__ = __webpack_require__(356);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_59b1bafc_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_new_task_btn_vue__ = __webpack_require__(382);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(386)
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

/***/ 379:
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

/***/ 380:
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

/***/ 381:
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
                        name: _vm.route_name,
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
                    _vm.deleteTask({ task: _vm.task, list: _vm.list })
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

/***/ 382:
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

/***/ 383:
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
            _c(
              "span",
              { staticClass: "task-title" },
              [
                _c(
                  "router-link",
                  {
                    attrs: {
                      to: {
                        name: _vm.route_name,
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
                      "\n\n                        " +
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
                        name: _vm.route_name,
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
                    _vm.deleteTask({ task: _vm.task, list: _vm.list })
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

/***/ 384:
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

/***/ 386:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(368);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(51)("524c41bc", content, false);
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

/***/ 529:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_common_text_editor_vue__ = __webpack_require__(191);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_common_file_uploader_vue__ = __webpack_require__(195);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_common_notifyUser_vue__ = __webpack_require__(196);
//
//
//
//
//
//
//
//
//
//
//
//
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
    props: ['comment', 'list'],

    /**
     * Initial data for this component
     * 
     * @return obj
     */
    data: function data() {
        return {
            files: typeof this.comment.files === 'undefined' ? [] : this.comment.files.data,
            deleted_files: [],
            content: {
                html: typeof this.comment.content === 'undefined' ? '' : this.comment.content
            },
            notify_users: [],
            show_spinner: false,
            submit_disabled: false,
            list_id: this.$route.params.list_id
        };
    },

    /**
     * Observe onchange value
     */
    watch: {

        /**
         * Observe onchange comment message
         *
         * @param string new_content 
         * 
         * @type void
         */
        content: {
            handler: function handler(new_content) {
                this.comment.content = new_content.html;
            },

            deep: true
        }

    },

    components: {
        'text-editor': __WEBPACK_IMPORTED_MODULE_0__components_common_text_editor_vue__["a" /* default */],
        'file-uploader': __WEBPACK_IMPORTED_MODULE_1__components_common_file_uploader_vue__["a" /* default */],
        notifyUser: __WEBPACK_IMPORTED_MODULE_2__components_common_notifyUser_vue__["a" /* default */]
    },

    /**
     * Unassigned varable value
     */
    computed: {
        /**
         * Editor ID
         * 
         * @return string
         */
        editor_id: function editor_id() {
            var comment_id = typeof this.comment.id == 'undefined' ? '' : '-' + this.comment.id;
            return 'pm-list-editor' + comment_id;
        },

        /**
         * Get current projects co-worker
         * 
         * @return object
         */
        co_workers: function co_workers() {
            return this.get_porject_users_by_role('co_worker');
        },

        /**
         * Check has co-worker in project or not
         * 
         * @return boolean
         */
        hasCoWorker: function hasCoWorker() {
            var co_worker = this.get_porject_users_by_role('co_worker');

            if (co_worker.length) {
                return true;
            }

            return false;
        }
    },

    methods: {
        /**
         * Insert and update todo-list comment
         * 
         * @return void
         */
        listCommentAction: function listCommentAction() {
            // Prevent sending request when multiple click submit button 
            if (this.submit_disabled) {
                return;
            }
            // Disable submit button for preventing multiple click
            this.submit_disabled = true;
            // Showing loading option 
            this.show_spinner = true;
            var self = this;
            var args = {
                data: {
                    commentable_id: self.list_id,
                    content: self.comment.content,
                    commentable_type: 'task_list',
                    deleted_files: self.deleted_files || [],
                    files: self.files || [],
                    notify_users: this.notify_users
                }
            };
            if (typeof this.comment.id !== 'undefined') {
                args.data.id = this.comment.id;
                args.callback = function (res) {
                    self.$store.commit('listUpdateComment', {
                        list_id: self.list_id,
                        comment_id: self.comment.id,
                        comment: res.data
                    });
                    self.submit_disabled = false;
                    self.show_spinner = false;
                    self.files = [];self.deleted_files = [];
                };
                self.updateComment(args);
            } else {
                args.callback = function (res) {
                    self.$store.commit('listNewComment', {
                        list_id: self.list_id,
                        comment: res.data
                    });
                    self.submit_disabled = false;
                    self.show_spinner = false;
                    self.files = [];self.deleted_files = [];
                };
                self.addComment(args);
            }
        }
    }
});

/***/ }),

/***/ 530:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__list_comment_form_vue__ = __webpack_require__(631);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
    props: ['comments', 'list'],

    computed: {
        /**
         * Get current user avatar
         */
        getCurrentUserAvatar: function getCurrentUserAvatar() {
            return PM_Vars.current_user_avatar_url;
        }
    },

    methods: {
        current_user_can_edit_delete: function current_user_can_edit_delete(comment, list) {

            if (list.can_del_edit) {
                return true;
            }

            if (comment.user_id == this.$store.state.get_current_user_id && comment.comment_type == '') {
                return true;
            }

            return false;
        },
        deleteListComment: function deleteListComment(id) {
            if (!confirm(this.text.are_you_sure)) {
                return;
            }
            var self = this;

            var request_data = {
                url: self.base_url + '/pm/v2/projects/' + self.project_id + '/comments/' + id,
                type: 'DELETE',
                success: function success(res) {
                    var index = self.getIndex(self.comments, id, 'id');

                    self.comments.splice(index, 1);
                }
            };
            this.httpRequest(request_data);
        }
    },

    components: {
        'list-comment-form': __WEBPACK_IMPORTED_MODULE_0__list_comment_form_vue__["a" /* default */]
    }

});

/***/ }),

/***/ 534:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__new_task_form_vue__ = __webpack_require__(199);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__incompleted_tasks_vue__ = __webpack_require__(377);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__completed_tasks_vue__ = __webpack_require__(375);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
    data: function data() {
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
            loading_incomplete_tasks: true,
            completed_tasks_next_page_number: null,
            incompleted_tasks_next_page_number: null
        };
    },

    computed: {
        /**
         * Check, Has task from this props list
         * 
         * @return boolen
         */
        taskLength: function taskLength() {
            return typeof this.list.tasks != 'undefined' && this.list.tasks.length ? true : false;
        },

        /**
         * Get incomplete tasks
         * 
         * @param  array tasks 
         * 
         * @return array       
         */
        getIncompleteTasks: function getIncompleteTasks() {
            if (this.list.incomplete_tasks) {
                this.list.incomplete_tasks.data.map(function (task, index) {
                    task.status = false;
                });

                return this.list.incomplete_tasks.data;
            }
        },

        /**
         * Get completed tasks
         * 
         * @param  array tasks 
         * 
         * @return array       
         */
        getCompletedTask: function getCompletedTask() {
            if (this.list.complete_tasks) {
                this.list.complete_tasks.data.map(function (task, index) {
                    task.status = true;
                });

                return this.list.complete_tasks.data;
            }
        },
        incompletedLoadMoreButton: function incompletedLoadMoreButton() {

            if (typeof this.list.incomplete_tasks == 'undefined') {
                return false;
            }

            var pagination = this.list.incomplete_tasks.meta.pagination;
            if (pagination.current_page < pagination.total_pages) {
                this.incompleted_tasks_next_page_number = pagination.current_page + 1;
                return true;
            }

            return false;
        },
        completedLoadMoreButton: function completedLoadMoreButton() {
            if (typeof this.list.complete_tasks == 'undefined') {
                return false;
            }
            var pagination = this.list.complete_tasks.meta.pagination;
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
        is_assigned: function is_assigned(task) {
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
        getIncompletedTasks: function getIncompletedTasks(lists) {
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
        getCompleteTask: function getCompleteTask(lists) {
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
        privateClass: function privateClass(task) {
            return task.task_privacy == 'yes' ? 'pm-lock' : 'pm-unlock';
        }
    }
});

/***/ }),

/***/ 535:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__single_list_tasks_vue__ = __webpack_require__(634);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__list_comments_vue__ = __webpack_require__(632);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__new_task_list_form_vue__ = __webpack_require__(351);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__new_task_btn_vue__ = __webpack_require__(378);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__common_header_vue__ = __webpack_require__(184);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
    beforeRouteEnter: function beforeRouteEnter(to, from, next) {
        next(function (vm) {
            vm.getIndividualList();
            vm.getGlobalMilestones();
        });
    },

    /**
     * Initial data for this component
     * 
     * @return obj
     */
    data: function data() {
        return {
            list_id: this.$route.params.list_id,
            //list: {},
            render_tmpl: false,
            task_id: parseInt(this.$route.params.task_id) ? this.$route.params.task_id : false, //for single task popup
            loading: true

        };
    },

    /**
     * Initial action for this component
     * 
     * @return void
     */
    created: function created() {
        this.$store.state.is_single_list = true;
    },

    computed: {
        /**
         * Get todo lists from vuex store
         * 
         * @return array
         */
        list: function list() {
            if (this.$store.state.lists.length) {
                return this.$store.state.lists[0];
            }
        },

        /**
         * Get milestones from vuex store
         * 
         * @return array
         */
        milestones: function milestones() {
            return this.$store.state.milestones;
        },

        comments: function comments() {
            if (this.$store.state.lists.length) {
                return this.$store.state.lists[0].comments.data;
            }
        },


        /**
         * Get initial data from vuex store when this component loaded
         * 
         * @return obj
         */
        init: function init() {
            return this.$store.state.init;
        }

    },

    methods: {

        /**
         * Get todo list for single todo list page
         * 
         * @param  int list_id 
         * 
         * @return void         
         */
        getIndividualList: function getIndividualList() {
            var self = this;
            var args = {
                condition: {
                    with: 'incomplete_tasks,complete_tasks,comments'
                },
                list_id: this.list_id,
                callback: function callback(res) {
                    self.$store.commit('setList', res.data);
                    self.loading = false;
                }
            };

            this.getList(args);
        },
        showEditForm: function showEditForm(list) {
            list.edit_mode = list.edit_mode ? false : true;
        }
    },

    components: {
        'single-list-tasks': __WEBPACK_IMPORTED_MODULE_0__single_list_tasks_vue__["a" /* default */],
        'list-comments': __WEBPACK_IMPORTED_MODULE_1__list_comments_vue__["a" /* default */],
        'new-task-list-form': __WEBPACK_IMPORTED_MODULE_2__new_task_list_form_vue__["a" /* default */],
        'new-task-button': __WEBPACK_IMPORTED_MODULE_3__new_task_btn_vue__["a" /* default */],
        'pm-header': __WEBPACK_IMPORTED_MODULE_4__common_header_vue__["a" /* default */]
    }
});

/***/ }),

/***/ 624:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(50)(undefined);
// imports


// module
exports.push([module.i, "\n.pm-list-footer .pm-new-task-button-icon {\n    margin-top: 5px;\n}\n", ""]);

// exports


/***/ }),

/***/ 631:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_list_comment_form_vue__ = __webpack_require__(529);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_748a8ef6_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_list_comment_form_vue__ = __webpack_require__(653);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_list_comment_form_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_748a8ef6_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_list_comment_form_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/components/project-task-lists/list-comment-form.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-748a8ef6", Component.options)
  } else {
    hotAPI.reload("data-v-748a8ef6", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 632:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_list_comments_vue__ = __webpack_require__(530);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_d4446310_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_list_comments_vue__ = __webpack_require__(662);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_list_comments_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_d4446310_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_list_comments_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/components/project-task-lists/list-comments.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-d4446310", Component.options)
  } else {
    hotAPI.reload("data-v-d4446310", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 634:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_single_list_tasks_vue__ = __webpack_require__(534);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_a88f6d0e_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_single_list_tasks_vue__ = __webpack_require__(660);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(672)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_single_list_tasks_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_a88f6d0e_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_single_list_tasks_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/components/project-task-lists/single-list-tasks.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-a88f6d0e", Component.options)
  } else {
    hotAPI.reload("data-v-a88f6d0e", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 650:
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
              _c(
                "router-link",
                {
                  staticClass:
                    "pm-btn pm-btn-blue pm-margin-bottom add-tasklist",
                  attrs: {
                    to: {
                      name: "task_lists",
                      params: {
                        project_id: _vm.project_id
                      }
                    }
                  }
                },
                [
                  _c("i", { staticClass: "fa fa-angle-left" }),
                  _vm._v(_vm._s(_vm.text.back_to_task_lists) + "\n        ")
                ]
              ),
              _vm._v(" "),
              _c(
                "div",
                [
                  _c("ul", { staticClass: "pm-todolists" }, [
                    _c("li", { class: "pm-fade-out-" + _vm.list_id }, [
                      _c(
                        "article",
                        { staticClass: "pm-todolist" },
                        [
                          _c("header", { staticClass: "pm-list-header" }, [
                            _c("h3", [
                              _vm._v(
                                "\n                                " +
                                  _vm._s(_vm.list.title) +
                                  "\n                                "
                              ),
                              _c("span", { class: _vm.privateClass(_vm.list) }),
                              _vm._v(" "),
                              _c("div", { staticClass: "pm-right" }, [
                                _c(
                                  "a",
                                  {
                                    staticClass: "pm-icon-edit",
                                    attrs: {
                                      href: "#",
                                      title:
                                        "<?php _e( 'Edit this List', 'pm' ); ?>"
                                    },
                                    on: {
                                      click: function($event) {
                                        $event.preventDefault()
                                        _vm.showHideListForm("toggle", _vm.list)
                                      }
                                    }
                                  },
                                  [
                                    _c("span", {
                                      staticClass: "dashicons dashicons-edit"
                                    })
                                  ]
                                ),
                                _vm._v(" "),
                                _c(
                                  "a",
                                  {
                                    staticClass: "pm-btn pm-btn-xs",
                                    attrs: {
                                      href: "#",
                                      title: _vm.text.delete_list
                                    },
                                    on: {
                                      click: function($event) {
                                        $event.preventDefault()
                                        _vm.deleteList(_vm.list.id)
                                      }
                                    }
                                  },
                                  [
                                    _c("span", {
                                      staticClass: "dashicons dashicons-trash"
                                    })
                                  ]
                                )
                              ])
                            ]),
                            _vm._v(" "),
                            _c("div", { staticClass: "pm-entry-detail" }, [
                              _vm._v(
                                "\n                                " +
                                  _vm._s(_vm.list.description) +
                                  "\n                            "
                              )
                            ]),
                            _vm._v(" "),
                            _vm.list.edit_mode
                              ? _c(
                                  "div",
                                  { staticClass: "pm-update-todolist-form" },
                                  [
                                    _c("new-task-list-form", {
                                      attrs: {
                                        list: _vm.list,
                                        section: "single"
                                      }
                                    })
                                  ],
                                  1
                                )
                              : _vm._e()
                          ]),
                          _vm._v(" "),
                          _c("single-list-tasks", {
                            attrs: { list: _vm.list, index: "0" }
                          }),
                          _vm._v(" "),
                          _c(
                            "footer",
                            { staticClass: "pm-row pm-list-footer" },
                            [
                              _c("div", { staticClass: "pm-col-6" }, [
                                _c(
                                  "div",
                                  [
                                    _c("new-task-button", {
                                      attrs: {
                                        task: {},
                                        list: _vm.list,
                                        list_index: "0"
                                      }
                                    })
                                  ],
                                  1
                                )
                              ]),
                              _vm._v(" "),
                              _c(
                                "div",
                                { staticClass: "pm-col-4 pm-todo-prgress-bar" },
                                [
                                  _c("div", {
                                    staticClass: "bar completed",
                                    style: _vm.getProgressStyle(_vm.list)
                                  })
                                ]
                              ),
                              _vm._v(" "),
                              _c(
                                "div",
                                { staticClass: " pm-col-1 no-percent" },
                                [
                                  _vm._v(
                                    _vm._s(_vm.getProgressPercent(_vm.list)) +
                                      "%"
                                  )
                                ]
                              ),
                              _vm._v(" "),
                              _c("div", { staticClass: "clearfix" })
                            ]
                          )
                        ],
                        1
                      )
                    ])
                  ]),
                  _vm._v(" "),
                  _c("router-view", { attrs: { name: "single-task" } }),
                  _vm._v(" "),
                  _c("list-comments", {
                    attrs: { comments: _vm.comments, list: _vm.list }
                  })
                ],
                1
              )
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
    require("vue-hot-reload-api")      .rerender("data-v-62dcca78", esExports)
  }
}

/***/ }),

/***/ 653:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "pm-comment-form" }, [
    _c(
      "form",
      {
        staticClass: "pm-comment-form-vue",
        on: {
          submit: function($event) {
            $event.preventDefault()
            _vm.listCommentAction()
          }
        }
      },
      [
        _c(
          "div",
          { staticClass: "item message pm-sm-col-1" },
          [
            _c("text-editor", {
              attrs: { editor_id: _vm.editor_id, content: _vm.content }
            })
          ],
          1
        ),
        _vm._v(" "),
        _c("file-uploader", {
          attrs: { files: _vm.files, delete: _vm.deleted_files }
        }),
        _vm._v(" "),
        _c("notify-user", {
          model: {
            value: _vm.notify_users,
            callback: function($$v) {
              _vm.notify_users = $$v
            },
            expression: "notify_users"
          }
        }),
        _vm._v(" "),
        _c("div", { staticClass: "submit" }, [
          !_vm.comment.edit_mode
            ? _c("input", {
                staticClass: "button-primary",
                attrs: {
                  disabled: _vm.submit_disabled,
                  type: "submit",
                  value: "Add New Comment",
                  id: ""
                }
              })
            : _vm._e(),
          _vm._v(" "),
          _vm.comment.edit_mode
            ? _c("input", {
                staticClass: "button-primary",
                attrs: {
                  disabled: _vm.submit_disabled,
                  type: "submit",
                  value: "Update Comment",
                  id: ""
                }
              })
            : _vm._e(),
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
    require("vue-hot-reload-api")      .rerender("data-v-748a8ef6", esExports)
  }
}

/***/ }),

/***/ 660:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { attrs: { id: "pm-single-todo-list-view" } }, [
    _c("div", { staticClass: "pm-incomplete-tasks" }, [
      _c("h3", { staticClass: "pm-task-list-title pm-tag-gray" }, [
        _c("a", [_vm._v(_vm._s(_vm.text.incomplete_tasks))])
      ]),
      _vm._v(" "),
      _c(
        "ul",
        {
          directives: [{ name: "pm-sortable", rawName: "v-pm-sortable" }],
          staticClass:
            "pm-incomplete-task-list pm-todos pm-todolist-content pm-incomplete-task"
        },
        [
          _vm._l(_vm.getIncompleteTasks, function(task, task_index) {
            return _c(
              "li",
              {
                key: task.id,
                staticClass: "pm-todo",
                class: "pm-fade-out-" + task.ID,
                attrs: { "data-id": task.id, "data-order": task.menu_order }
              },
              [
                _c("incompleted-tasks", {
                  attrs: { task: task, list: _vm.list }
                })
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
          _vm.isIncompleteLoadMoreActive(_vm.list)
            ? _c("li", { staticClass: "nonsortable" }, [
                _c(
                  "a",
                  {
                    attrs: { href: "#" },
                    on: {
                      click: function($event) {
                        $event.preventDefault()
                        _vm.loadMoreIncompleteTasks(_vm.list)
                      }
                    }
                  },
                  [_vm._v(_vm._s(_vm.text.more_tasks))]
                ),
                _vm._v(" "),
                _c("span", {
                  directives: [
                    {
                      name: "show",
                      rawName: "v-show",
                      value: _vm.more_incomplete_task_spinner,
                      expression: "more_incomplete_task_spinner"
                    }
                  ],
                  staticClass: "pm-incomplete-task-spinner pm-spinner"
                })
              ])
            : _vm._e()
        ],
        2
      )
    ]),
    _vm._v(" "),
    _c("div", { staticClass: "pm-completed-tasks" }, [
      _c("h3", { staticClass: "pm-task-list-title pm-tag-gray" }, [
        _c("a", [_vm._v(_vm._s(_vm.text.completed_tasks))])
      ]),
      _vm._v(" "),
      _c(
        "ul",
        {
          directives: [{ name: "pm-sortable", rawName: "v-pm-sortable" }],
          staticClass:
            "pm-completed-task-list pm-todos pm-todolist-content pm-todo-completed"
        },
        [
          _vm._l(_vm.getCompletedTask, function(task, task_index) {
            return _c(
              "li",
              {
                key: task.id,
                staticClass: "pm-todo",
                class: "pm-todo pm-fade-out-" + task.id,
                attrs: { "data-id": task.id, "data-order": task.menu_order }
              },
              [
                _c("completed-tasks", { attrs: { task: task, list: _vm.list } })
              ],
              1
            )
          }),
          _vm._v(" "),
          !_vm.getCompletedTask.length
            ? _c("li", { staticClass: "nonsortable" }, [
                _vm._v(_vm._s(_vm.text.no_tasks_found))
              ])
            : _vm._e(),
          _vm._v(" "),
          _vm.isCompleteLoadMoreActive(_vm.list)
            ? _c("li", { staticClass: "nonsortable" }, [
                _c(
                  "a",
                  {
                    attrs: { href: "#" },
                    on: {
                      click: function($event) {
                        $event.preventDefault()
                        _vm.loadMoreCompleteTasks(_vm.list)
                      }
                    }
                  },
                  [_vm._v(_vm._s(_vm.text.more_tasks))]
                ),
                _vm._v(" "),
                _c("span", {
                  directives: [
                    {
                      name: "show",
                      rawName: "v-show",
                      value: _vm.more_completed_task_spinner,
                      expression: "more_completed_task_spinner"
                    }
                  ],
                  staticClass: "pm-completed-task-spinner pm-spinner"
                })
              ])
            : _vm._e()
        ],
        2
      )
    ]),
    _vm._v(" "),
    _vm.list.show_task_form
      ? _c(
          "div",
          { staticClass: "pm-todo-form" },
          [_c("new-task-form", { attrs: { task: {}, list: _vm.list } })],
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
    require("vue-hot-reload-api")      .rerender("data-v-a88f6d0e", esExports)
  }
}

/***/ }),

/***/ 662:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "pm-list-comment-wrap" }, [
    _c("h3", { staticClass: "pm-comment-title" }, [
      _vm._v(_vm._s(_vm.text.discuss_this_task_list))
    ]),
    _vm._v(" "),
    _c(
      "ul",
      { staticClass: "pm-comment-wrap" },
      _vm._l(_vm.comments, function(comment) {
        return _c(
          "li",
          {
            key: comment.id,
            class: "pm-comment clearfix even pm-fade-out-" + comment.id
          },
          [
            _c("div", { staticClass: "pm-avatar" }, [
              _c(
                "a",
                {
                  attrs: {
                    href: _vm.userTaskProfileUrl(comment.creator.data.id),
                    title: comment.creator.data.display_name
                  }
                },
                [
                  _c("img", {
                    staticClass: "avatar avatar-96 photo",
                    attrs: {
                      alt: comment.creator.data.display_name,
                      src: comment.creator.data.avatar_url,
                      height: "96",
                      width: "96"
                    }
                  })
                ]
              )
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "pm-comment-container" }, [
              _c("div", { staticClass: "pm-comment-meta" }, [
                _vm._v(
                  "\n                    " +
                    _vm._s(_vm.text.by) +
                    "\n                    "
                ),
                _c("span", { staticClass: "pm-author" }, [
                  _c(
                    "a",
                    {
                      attrs: {
                        href: _vm.userTaskProfileUrl(comment.creator.data.id),
                        title: comment.creator.data.display_name
                      }
                    },
                    [
                      _vm._v(
                        "\n                            " +
                          _vm._s(comment.creator.data.display_name) +
                          "\n                        "
                      )
                    ]
                  )
                ]),
                _vm._v(" "),
                _c("span", [_vm._v(_vm._s(_vm.text.on))]),
                _vm._v(" "),
                _c("span", { staticClass: "pm-date" }, [
                  _c(
                    "time",
                    {
                      attrs: {
                        datetime: _vm.dateISO8601Format(comment.comment_date),
                        title: _vm.dateISO8601Format(comment.comment_date)
                      }
                    },
                    [_vm._v(_vm._s(_vm.dateTimeFormat(comment.comment_date)))]
                  )
                ]),
                _vm._v(" "),
                _c("div", { staticClass: "pm-comment-action" }, [
                  _c("span", { staticClass: "pm-edit-link" }, [
                    _c("a", {
                      staticClass: "dashicons dashicons-edit",
                      attrs: { href: "#" },
                      on: {
                        click: function($event) {
                          $event.preventDefault()
                          _vm.showHideListCommentEditForm(comment)
                        }
                      }
                    })
                  ]),
                  _vm._v(" "),
                  _c("span", { staticClass: "pm-delete-link" }, [
                    _c("a", {
                      staticClass: "dashicons dashicons-trash",
                      attrs: { href: "#" },
                      on: {
                        click: function($event) {
                          $event.preventDefault()
                          _vm.deleteListComment(comment.id)
                        }
                      }
                    })
                  ])
                ])
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "pm-comment-content" }, [
                _c("div", { domProps: { innerHTML: _vm._s(comment.content) } }),
                _vm._v(" "),
                comment.files.data.length
                  ? _c(
                      "ul",
                      { staticClass: "pm-attachments" },
                      _vm._l(comment.files.data, function(commnetFile) {
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
              comment.edit_mode
                ? _c("div", { staticClass: "pm-comment-edit-form" }, [
                    _c(
                      "div",
                      { class: "pm-slide-" + comment.id },
                      [
                        _c("list-comment-form", {
                          attrs: { comment: comment, list: _vm.list }
                        })
                      ],
                      1
                    )
                  ])
                : _vm._e()
            ])
          ]
        )
      })
    ),
    _vm._v(" "),
    _c("div", { staticClass: "single-todo-comments" }, [
      _c(
        "div",
        { staticClass: "pm-comment-form-wrap" },
        [
          _c("div", { staticClass: "pm-avatar" }, [
            _c("img", {
              attrs: {
                src: _vm.getCurrentUserAvatar,
                height: "48",
                width: "48"
              }
            })
          ]),
          _vm._v(" "),
          _c("list-comment-form", { attrs: { comment: {}, list: _vm.list } })
        ],
        1
      )
    ])
  ])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-d4446310", esExports)
  }
}

/***/ }),

/***/ 672:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(624);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(51)("dd9a2734", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-a88f6d0e\",\"scoped\":false,\"hasInlineConfig\":false}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./single-list-tasks.vue", function() {
     var newContent = require("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-a88f6d0e\",\"scoped\":false,\"hasInlineConfig\":false}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./single-list-tasks.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 68:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_single_list_vue__ = __webpack_require__(535);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_62dcca78_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_single_list_vue__ = __webpack_require__(650);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_single_list_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_62dcca78_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_single_list_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/components/project-task-lists/single-list.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-62dcca78", Component.options)
  } else {
    hotAPI.reload("data-v-62dcca78", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ })

});