/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file.
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = injectStyles
  }

  if (hook) {
    var functional = options.functional
    var existing = functional
      ? options.render
      : options.beforeCreate

    if (!functional) {
      // inject component registration as beforeCreate hook
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    } else {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return existing(h, context)
      }
    }
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 1 */
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


/* harmony default export */ __webpack_exports__["a"] = ({
    data: function data() {
        return {
            appKey: this.getSettings('pusher_app_key', ''),
            secret: this.getSettings('pusher_secret', ''),
            appId: this.getSettings('pusher_app_id', ''),
            cluster: this.getSettings('pusher_cluster', ''),
            show_spinner: false,
            save_change: __('Save Changes', 'wedevs-project-manager')
        };
    },


    mounted: function mounted() {
        pm.NProgress.done();
    },
    methods: {
        saveEmailSettings: function saveEmailSettings() {
            this.show_spinner = true;
            var self = this;
            var data = {
                pusher_app_key: this.appKey,
                pusher_secret: this.secret,
                pusher_app_id: this.appId,
                pusher_cluster: this.cluster
            };

            this.saveSettings(data, '', function (res) {
                self.show_spinner = false;
            });
        }
    }
});

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({});

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__.p = PM_Vars.dir_url + 'modules/pusher/views/assets/js/';

__webpack_require__(4);

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _router = __webpack_require__(5);

var _router2 = _interopRequireDefault(_router);

var _settingsTabMenu = __webpack_require__(8);

var _settingsTabMenu2 = _interopRequireDefault(_settingsTabMenu);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

weDevs_PM_Components.push({
    hook: 'pm-settings-tab',
    component: 'pm-pro-pusher-settings-tab',
    property: _settingsTabMenu2.default
});

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _settings = __webpack_require__(6);

var _settings2 = _interopRequireDefault(_settings);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

weDevsPmProAddonRegisterModule('pusher', 'pusher');

weDevsPMRegisterChildrenRoute('settings_root', [{
    path: 'pusher',
    component: _settings2.default,
    name: 'pusher_settings_tab'
}]);

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_settings_vue__ = __webpack_require__(1);
/* empty harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_fbf85df6_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_settings_vue__ = __webpack_require__(7);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_settings_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_fbf85df6_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_settings_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/pusher/views/assets/src/components/settings.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-fbf85df6", Component.options)
  } else {
    hotAPI.reload("data-v-fbf85df6", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", [
    _c("div", { staticClass: "metabox-holder" }, [
      _c("div", { staticClass: "group", attrs: { id: "pm_mails" } }, [
        _c(
          "form",
          {
            attrs: { method: "post", action: "options.php" },
            on: {
              submit: function($event) {
                $event.preventDefault()
                _vm.saveEmailSettings()
              }
            }
          },
          [
            _c("h2", [
              _vm._v(
                _vm._s(_vm.__("Pusher Settings", "wedevs-project-manager"))
              )
            ]),
            _vm._v(" "),
            _c("table", { staticClass: "form-table" }, [
              _c("tbody", [
                _c("tr", [
                  _c("th", { attrs: { scope: "row" } }, [
                    _c("label", { attrs: { for: "pm_mails[email_from]" } }, [
                      _vm._v(_vm._s(_vm.__("App id", "wedevs-project-manager")))
                    ])
                  ]),
                  _vm._v(" "),
                  _c("td", [
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model",
                          value: _vm.appId,
                          expression: "appId"
                        }
                      ],
                      staticClass: "regular-text",
                      attrs: {
                        type: "text",
                        id: "pm_mails[email_from]",
                        name: "pm_mails[email_from]",
                        value: ""
                      },
                      domProps: { value: _vm.appId },
                      on: {
                        input: function($event) {
                          if ($event.target.composing) {
                            return
                          }
                          _vm.appId = $event.target.value
                        }
                      }
                    })
                  ])
                ]),
                _vm._v(" "),
                _c("tr", [
                  _c("th", { attrs: { scope: "row" } }, [
                    _c("label", { attrs: { for: "pm_mails[email_from]" } }, [
                      _vm._v(
                        _vm._s(_vm.__("App Key", "wedevs-project-manager"))
                      )
                    ])
                  ]),
                  _vm._v(" "),
                  _c("td", [
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model",
                          value: _vm.appKey,
                          expression: "appKey"
                        }
                      ],
                      staticClass: "regular-text",
                      attrs: {
                        type: "text",
                        id: "pm_mails[email_from]",
                        name: "pm_mails[email_from]",
                        value: ""
                      },
                      domProps: { value: _vm.appKey },
                      on: {
                        input: function($event) {
                          if ($event.target.composing) {
                            return
                          }
                          _vm.appKey = $event.target.value
                        }
                      }
                    })
                  ])
                ]),
                _vm._v(" "),
                _c("tr", [
                  _c("th", { attrs: { scope: "row" } }, [
                    _c("label", { attrs: { for: "pm_mails[email_from]" } }, [
                      _vm._v(_vm._s(_vm.__("secret", "wedevs-project-manager")))
                    ])
                  ]),
                  _vm._v(" "),
                  _c("td", [
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model",
                          value: _vm.secret,
                          expression: "secret"
                        }
                      ],
                      staticClass: "regular-text",
                      attrs: {
                        type: "text",
                        id: "pm_mails[email_from]",
                        name: "pm_mails[email_from]",
                        value: ""
                      },
                      domProps: { value: _vm.secret },
                      on: {
                        input: function($event) {
                          if ($event.target.composing) {
                            return
                          }
                          _vm.secret = $event.target.value
                        }
                      }
                    })
                  ])
                ]),
                _vm._v(" "),
                _c("tr", [
                  _c("th", { attrs: { scope: "row" } }, [
                    _c("label", { attrs: { for: "pm_mails[email_from]" } }, [
                      _vm._v(
                        _vm._s(_vm.__("Cluster", "wedevs-project-manager"))
                      )
                    ])
                  ]),
                  _vm._v(" "),
                  _c("td", [
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model",
                          value: _vm.cluster,
                          expression: "cluster"
                        }
                      ],
                      staticClass: "regular-text",
                      attrs: {
                        type: "text",
                        id: "pm_mails[email_from]",
                        name: "pm_mails[email_from]",
                        value: ""
                      },
                      domProps: { value: _vm.cluster },
                      on: {
                        input: function($event) {
                          if ($event.target.composing) {
                            return
                          }
                          _vm.cluster = $event.target.value
                        }
                      }
                    })
                  ])
                ])
              ])
            ]),
            _vm._v(" "),
            _c("div", [
              _c("p", { staticClass: "submit" }, [
                _c("input", {
                  staticClass: "button button-primary",
                  attrs: { type: "submit", name: "submit", id: "submit" },
                  domProps: { value: _vm.save_change }
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
            ])
          ]
        )
      ])
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
    require("vue-hot-reload-api")      .rerender("data-v-fbf85df6", esExports)
  }
}

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_settings_tab_menu_vue__ = __webpack_require__(2);
/* empty harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_3b7f6c8f_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_settings_tab_menu_vue__ = __webpack_require__(9);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_settings_tab_menu_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_3b7f6c8f_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_settings_tab_menu_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/pusher/views/assets/src/components/settings-tab-menu.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-3b7f6c8f", Component.options)
  } else {
    hotAPI.reload("data-v-3b7f6c8f", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "router-link",
    { staticClass: "nav-tab", attrs: { to: { name: "pusher_settings_tab" } } },
    [_vm._v("\n        " + _vm._s(_vm.__("Pusher", "pm-pro")) + "\n    ")]
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-3b7f6c8f", esExports)
  }
}

/***/ })
/******/ ]);