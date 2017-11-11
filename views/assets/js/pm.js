/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	var parentJsonpFunction = window["wedevsPmWebpack"];
/******/ 	window["wedevsPmWebpack"] = function webpackJsonpCallback(chunkIds, moreModules, executeModules) {
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [], result;
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(chunkIds, moreModules, executeModules);
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 	};
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// objects to store loaded and loading chunks
/******/ 	var installedChunks = {
/******/ 		23: 0
/******/ 	};
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
/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = function requireEnsure(chunkId) {
/******/ 		var installedChunkData = installedChunks[chunkId];
/******/ 		if(installedChunkData === 0) {
/******/ 			return new Promise(function(resolve) { resolve(); });
/******/ 		}
/******/
/******/ 		// a Promise means "currently loading".
/******/ 		if(installedChunkData) {
/******/ 			return installedChunkData[2];
/******/ 		}
/******/
/******/ 		// setup Promise in chunk cache
/******/ 		var promise = new Promise(function(resolve, reject) {
/******/ 			installedChunkData = installedChunks[chunkId] = [resolve, reject];
/******/ 		});
/******/ 		installedChunkData[2] = promise;
/******/
/******/ 		// start chunk loading
/******/ 		var head = document.getElementsByTagName('head')[0];
/******/ 		var script = document.createElement('script');
/******/ 		script.type = 'text/javascript';
/******/ 		script.charset = 'utf-8';
/******/ 		script.async = true;
/******/ 		script.timeout = 120000;
/******/
/******/ 		if (__webpack_require__.nc) {
/******/ 			script.setAttribute("nonce", __webpack_require__.nc);
/******/ 		}
/******/ 		script.src = __webpack_require__.p + "chunk/" + {"3":"f9c3e450d2c3413fc2ef","4":"c915b150fb28d11dd003","5":"13a574fa231cfdc47b50","6":"50096d269462879b0dce","7":"51ac557fe46258f353b0","8":"453ca075947d8524509d","10":"54d3aa614c6969e95ecd","11":"00fa75d29b76ee2fb3ea","12":"9901dd835ad3ac758685","13":"32afcbfa77b2e21f7454","14":"05f3850f94a8091af2af","15":"a5f150c99b15cce6ade0"}[chunkId] + ".chunk-bundle.js";
/******/ 		var timeout = setTimeout(onScriptComplete, 120000);
/******/ 		script.onerror = script.onload = onScriptComplete;
/******/ 		function onScriptComplete() {
/******/ 			// avoid mem leaks in IE.
/******/ 			script.onerror = script.onload = null;
/******/ 			clearTimeout(timeout);
/******/ 			var chunk = installedChunks[chunkId];
/******/ 			if(chunk !== 0) {
/******/ 				if(chunk) {
/******/ 					chunk[1](new Error('Loading chunk ' + chunkId + ' failed.'));
/******/ 				}
/******/ 				installedChunks[chunkId] = undefined;
/******/ 			}
/******/ 		};
/******/ 		head.appendChild(script);
/******/
/******/ 		return promise;
/******/ 	};
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
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
/******/ 	// on error function for async loading
/******/ 	__webpack_require__.oe = function(err) { console.error(err); throw err; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 123);
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
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(6)(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 2 */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),
/* 4 */
/***/ (function(module, exports) {

var core = module.exports = { version: '2.5.0' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(25);
var defined = __webpack_require__(8);
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),
/* 7 */
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),
/* 8 */
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),
/* 9 */,
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(15);
var IE8_DOM_DEFINE = __webpack_require__(24);
var toPrimitive = __webpack_require__(21);
var dP = Object.defineProperty;

exports.f = __webpack_require__(1) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),
/* 11 */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(2);
var core = __webpack_require__(4);
var ctx = __webpack_require__(30);
var hide = __webpack_require__(13);
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && key in exports) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(10);
var createDesc = __webpack_require__(16);
module.exports = __webpack_require__(1) ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__(26);
var enumBugKeys = __webpack_require__(18);

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(3);
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),
/* 17 */
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),
/* 18 */
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(20)('keys');
var uid = __webpack_require__(17);
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(2);
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});
module.exports = function (key) {
  return store[key] || (store[key] = {});
};


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(3);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),
/* 22 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(3);
var document = __webpack_require__(2).document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(1) && !__webpack_require__(6)(function () {
  return Object.defineProperty(__webpack_require__(23)('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(22);
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__(11);
var toIObject = __webpack_require__(5);
var arrayIndexOf = __webpack_require__(29)(false);
var IE_PROTO = __webpack_require__(19)('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = pm.Vue.mixin({
    data: function data() {
        return {
            base_url: PM_Vars.base_url + '/' + PM_Vars.rest_api_prefix,
            project_id: typeof this.$route === 'undefined' ? false : this.$route.params.project_id,
            current_user: PM_Vars.current_user,
            avatar_url: PM_Vars.avatar_url,
            text: PM_Vars.text
        };
    },


    methods: {
        httpRequest: function httpRequest(property) {
            var before = function before(xhr) {
                xhr.setRequestHeader("Authorization_name", btoa('asaquzzaman')); //btoa js encoding base64_encode
                xhr.setRequestHeader("Authorization_password", btoa(12345678)); //atob js decode base64_decode
            };

            property.beforeSend = typeof property.beforeSend === 'undefined' ? before : property.beforeSend;

            jQuery.ajax(property);
        },
        registerStore: function registerStore(module_name) {
            var self = this;
            var mutations = self.$options.mutations;
            var state = self.$options.state;

            // register a module `myModule`
            self.$store.registerModule(module_name, {
                namespaced: true,
                state: state,
                mutations: mutations
            });
        },


        /**
         * Create a new project 
         * @param  {[Object]} args data with callback
         * @return {viod}      [description]
         */
        newProject: function newProject(args) {
            var self = this,
                pre_define = {
                data: {
                    title: '',
                    categories: '',
                    description: '',
                    notify_users: '',
                    assignees: '',
                    status: 'incomplete'
                },
                callback: false
            },
                args = jQuery.extend(true, pre_define, args);

            var request = {
                type: 'POST',
                url: this.base_url + '/pm/v2/projects/',
                data: args.data,
                success: function success(res) {
                    self.$root.$store.commit('newProject', res.data);
                    self.showHideProjectForm(false);
                    self.resetSelectedUsers();
                    jQuery("#pm-project-dialog").dialog("close");

                    if (typeof args.callback === 'function') {
                        args.callback.call(self, res);
                    }
                },

                error: function error(res) {
                    if (typeof args.callback === 'function') {
                        args.callback.call(self, res);
                    }
                }
            };

            this.httpRequest(request);
        },
        formatUsers: function formatUsers(users) {
            var format_users = [];

            users.map(function (user, index) {
                format_users.push({
                    'user_id': user.id,
                    'role_id': user.roles.data[0].id
                });
            });

            return format_users;
        },
        updateProject: function updateProject(args) {
            var self = this,
                pre_define = {
                data: {
                    id: '',
                    title: '',
                    categories: '',
                    description: '',
                    notify_users: '',
                    assignees: '',
                    status: 'incomplete'
                },
                callback: false
            },
                args = jQuery.extend(true, pre_define, args);

            var request = {
                type: 'PUT',
                url: this.base_url + '/pm/v2/projects/' + args.data.id,
                data: args.data,
                success: function success(res) {

                    self.$root.$store.commit('updateProject', res.data);

                    self.showHideProjectForm(false);
                    jQuery("#pm-project-dialog").dialog("close");
                    self.resetSelectedUsers();
                    if (typeof args.callback === 'function') {
                        args.callback.call(self, res);
                    }
                },

                error: function error(res) {
                    if (typeof args.callback === 'function') {
                        args.callback.call(self, res);
                    }
                }
            };

            this.httpRequest(request);
        },
        resetSelectedUsers: function resetSelectedUsers() {
            this.$root.$store.commit('resetSelectedUsers');
        },
        getProjects: function getProjects(condition, callback) {
            var condition = condition || '';
            var self = this;

            var request_data = {
                url: self.base_url + '/pm/v2/projects?per_page=2&page=' + self.setCurrentPageNumber(self) + '&' + condition,
                success: function success(res) {
                    res.data.map(function (project) {
                        self.addProjectMeta(project);
                    });
                    self.$root.$store.commit('setProjects', { 'projects': res.data });
                    self.$root.$store.commit('setProjectsMeta', res.meta);
                    pm.NProgress.done();
                    self.loading = false;
                    if (typeof callback !== 'undefined') {
                        callback(res.data);
                    }
                }
            };

            self.httpRequest(request_data);
        },
        setCurrentPageNumber: function setCurrentPageNumber(self) {
            var current_page_number = self.$route.params.current_page_number ? self.$route.params.current_page_number : 1;
            self.current_page_number = current_page_number;
            return current_page_number;
        },
        getProject: function getProject(project_id, callback) {
            var self = this;

            var callback = callback || false;
            var project_id = project_id || self.project_id;

            if (typeof self.project_id === 'undefined') {
                return;
            }

            var projects = self.$root.$store.state.projects,
                index = self.getIndex(projects, project_id, 'id');

            if (index !== false) {
                self.addProjectMeta(projects[index]);
                self.$root.$store.commit('setProject', projects[index]);
                self.$root.$store.commit('setProjectUsers', projects[index].assignees.data);
                if (callback) {
                    callback(res.data);
                }
            } else {
                self.httpRequest({
                    url: self.base_url + '/pm/v2/projects/' + self.project_id,
                    success: function success(res) {
                        self.addProjectMeta(res.data);
                        self.$root.$store.commit('setProject', res.data);
                        self.$root.$store.commit('setProjectUsers', res.data.assignees.data);

                        if (callback) {
                            callback(res.data);
                        }
                    }
                });
            }
        },
        addProjectMeta: function addProjectMeta(project) {
            project.edit_mode = false;
            project.settings_hide = false;
        },
        getProjectCategories: function getProjectCategories(callback) {
            var callback = callback || false;
            var self = this;

            var categories = self.$root.$store.state.categories;

            if (categories.length) {
                if (callback) {
                    //callback(categories);
                }
                return categories;
            }

            this.httpRequest({
                url: self.base_url + '/pm/v2/categories?type=project',
                success: function success(res) {
                    self.$root.$store.commit('setCategories', res.data);

                    if (callback) {
                        callback(res.data);
                    }
                }
            });
        },
        getRoles: function getRoles(callback) {
            var callback = callback || false;
            var self = this;

            var roles = self.$root.$store.state.roles;

            if (roles.length) {
                if (callback) {
                    callback(roles);
                }
                return roles;
            }

            self.httpRequest({
                url: self.base_url + '/pm/v2/roles',
                success: function success(res) {
                    self.$root.$store.commit('setRoles', res.data);

                    if (callback) {
                        callback(res.data);
                    }
                }
            });
        },

        /**
         * Get index from array object element
         *
         * @param   itemList
         * @param   id
         *
         * @return  int
         */
        getIndex: function getIndex(itemList, id, slug) {
            var index = false;

            itemList.forEach(function (item, key) {
                if (item[slug] == id) {
                    index = key;
                }
            });

            return index;
        },

        showHideProjectForm: function showHideProjectForm(status) {
            this.$root.$store.commit('showHideProjectForm', status);
        },
        deleteFile: function deleteFile(file_id, callback) {
            var self = this;

            self.httpRequest({
                url: self.base_url + '/pm/v2/projects/' + self.project_id + '/files/' + file_id,
                type: 'DELETE',
                success: function success(res) {

                    if (typeof callback !== 'undefined') {
                        callback(res.data);
                    }
                }
            });
        },
        userTaskProfileUrl: function userTaskProfileUrl(user_id) {
            return PM_Vars.ajaxurl + '?page=pm_task#/user/' + user_id;
        },


        /**
         * Set extra element in httpRequest query
         */
        getQueryParams: function getQueryParams(add_query) {

            var self = this,
                query_str = '';

            jQuery.each(add_query, function (key, val) {

                if (Array.isArray(val)) {

                    val.map(function (el, index) {
                        query_str = query_str + key + '=' + el + '&';
                    });
                } else {
                    query_str = query_str + key + '=' + val + '&';
                }
            });

            jQuery.each(this.$route.query, function (key, val) {

                if (Array.isArray(val)) {

                    val.map(function (el, index) {
                        query_str = query_str + key + '=' + el + '&';
                    });
                } else {
                    query_str = query_str + key + '=' + val + '&';
                }
            });

            var query_str = query_str.slice(0, -1);

            return query_str;
        },


        /**
         * Set extra element in this.$route.query
         */
        setQuery: function setQuery(add_query) {
            var self = this,
                route_query = {};

            jQuery.each(self.$route.query, function (key, val) {
                if (Array.isArray(val)) {
                    route_query[key] = [];

                    val.map(function (el, index) {
                        route_query[key].push(el);
                    });
                } else if (val) {
                    route_query[key] = [val];
                }
            });

            jQuery.each(add_query, function (key, val) {
                if (val) {
                    route_query[key] = [val];
                } else {
                    delete route_query[key];
                }
            });

            return route_query;
        },


        /**
         * ISO_8601 Date format convert to moment date format
         * 
         * @param  string date 
         * 
         * @return string      
         */
        pmDateISO8601Format: function pmDateISO8601Format(date, time) {
            var date = new Date(date + ' ' + time);

            return pm.Moment(date).format();
        },

        deleteProject: function deleteProject(id) {
            if (!confirm(this.text.delete_project_conf)) {
                return;
            }
            var self = this;
            var request_data = {
                url: self.base_url + '/pm/v2/projects/' + id,
                type: 'DELETE',
                success: function success(res) {
                    self.$root.$store.commit('afterDeleteProject', id);

                    if (!self.$root.$store.state.projects.length) {
                        self.$router.push({
                            name: 'project_lists'
                        });
                    } else {
                        self.getProjects();
                    }
                }
            };

            self.httpRequest(request_data);
        },
        addUserMeta: function addUserMeta(user) {
            if (!user.roles.data.length) {
                user.roles = {
                    data: [{
                        description: "Co-Worker for project manager",
                        id: 2,
                        title: "Co-Worker"
                    }]
                };
            }
        },
        projects_view_class: function projects_view_class() {
            return this.$store.state.projects_view === 'grid_view' ? 'pm-project-grid' : 'pm-project-list';
        },
        generateConditions: function generateConditions(conditions) {
            var query = '';

            if (jQuery.isEmptyObject(conditions)) {
                return '';
            }

            jQuery.each(conditions, function (condition, key) {
                query = query + condition + '=' + key + '&';
            });

            return query.slice(0, -1);
        },

        /**
         * [get Global Milestones in every page where milestone need and store in $root.$store.state.milestone ]
         * @param  {Function} callback [optional]
         * @return {[type]}            [milestone]
         */
        getGlobalMilestones: function getGlobalMilestones(callback) {
            var self = this,
                milestones = this.$root.$store.state.milestones,
                milestones_load = self.$root.$store.state.milestones_load;

            if (milestones_load) {
                if (typeof callback === 'function') {
                    callback.call(self, milestones);
                }
                return milestones;
            } else {
                var request = {
                    url: self.base_url + '/pm/v2/projects/' + self.project_id + '/milestones',
                    success: function success(res) {
                        self.$root.$store.commit('setMilestones', res.data);

                        if (typeof callback === 'function') {
                            callback.call(self, res.data);
                        }
                    }
                };
                self.httpRequest(request);
            }
        },
        loadingStart: function loadingStart(id, args) {
            var pre_define = {
                // loading text
                text: '',

                // from 0 to 100 
                percent: '',

                // duration in ms
                duration: '',

                // z-index property
                zIndex: '',

                // sets relative position to preloader's parent
                setRelative: false

            };
            var args = jQuery.extend(true, pre_define, args);

            jQuery('#' + id).preloader(args);
        },
        loadingStop: function loadingStop(id) {
            jQuery('#' + id).preloader('remove');
        }
    }
});

/***/ }),
/* 28 */
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(5);
var toLength = __webpack_require__(32);
var toAbsoluteIndex = __webpack_require__(31);
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(28);
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(7);
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(7);
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),
/* 33 */,
/* 34 */,
/* 35 */,
/* 36 */,
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */,
/* 42 */,
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = new pm.Vuex.Store({
    state: {
        projects: [],
        project: {},
        project_users: [],
        categories: [],
        roles: [],
        milestones: [],
        milestones_load: false,
        is_project_form_active: false,
        projects_meta: {},
        pagination: {},
        getIndex: function getIndex(itemList, id, slug) {
            var index = false;

            itemList.forEach(function (item, key) {
                if (item[slug] == id) {
                    index = key;
                }
            });

            return index;
        },
        assignees: []
    },

    mutations: {
        setProjects: function setProjects(state, projects) {
            state.projects = projects.projects;
        },
        setProject: function setProject(state, project) {
            state.projects.push(project);
        },
        setProjectUsers: function setProjectUsers(state, users) {
            state.project_users = users;
        },
        setCategories: function setCategories(state, categories) {
            state.categories = categories;
        },
        setRoles: function setRoles(state, roles) {
            state.roles = roles;
        },
        newProject: function newProject(state, projects) {
            var per_page = state.pagination.per_page,
                length = state.projects.length;

            if (per_page <= length) {
                state.projects.splice(0, 0, projects);
                state.projects.pop();
            } else {
                state.projects.splice(0, 0, projects);
            }

            //update pagination
            state.pagination.total = state.pagination.total + 1;
            state.projects_meta.total_incomplete = state.projects_meta.total_incomplete + 1;
            state.pagination.total_pages = Math.ceil(state.pagination.total / state.pagination.per_page);
        },
        showHideProjectForm: function showHideProjectForm(state, status) {
            if (status === 'toggle') {
                state.is_project_form_active = state.is_project_form_active ? false : true;
            } else {
                state.is_project_form_active = status;
            }
        },
        setProjectsMeta: function setProjectsMeta(state, data) {
            state.projects_meta = data;
            state.pagination = data.pagination;
        },
        afterDeleteProject: function afterDeleteProject(state, project_id) {
            var project_index = state.getIndex(state.projects, project_id, 'id');
            state.projects.splice(project_index, 1);
        },
        updateProject: function updateProject(state, project) {
            var index = state.getIndex(state.projects, project.id, 'id');
            //console.log(state.projects[index]);
            // console.log(state.projects[index], project);

            //state.projects[index] = project;
            jQuery.extend(true, state.projects[index], project);
            //console.log(state.projects[index], project);
            // jQuery.each(state.projects[index], function(key, value) {
            //  //console.log(state.projects[index][key], project[key]);
            //  jQuery.extend(true, state.projects[index][key], project[key]);
            // });

            // //console.log(state.projects[index]);
        },
        showHideProjectDropDownAction: function showHideProjectDropDownAction(state, data) {
            var index = state.getIndex(state.projects, data.project_id, 'id');

            if (data.status === 'toggle') {
                state.projects[index].settings_hide = state.projects[index].settings_hide ? false : true;
            } else {
                state.projects[index].settings_hide = data.status;
            }
        },
        afterDeleteUserFromProject: function afterDeleteUserFromProject(state, data) {
            var index = state.getIndex(state.projects, data.project_id, 'id');
            var users = state.projects[index].assignees.data;
            var user_index = state.getIndex(users, data.user_id, 'id');

            state.projects[index].assignees.data.splice(user_index, 1);
        },
        updateSeletedUser: function updateSeletedUser(state, assignees) {
            state.assignees.push(assignees);
        },
        setSeletedUser: function setSeletedUser(state, assignees) {
            state.assignees = assignees;
        },
        resetSelectedUsers: function resetSelectedUsers(state) {
            state.assignees = [];
        },
        setMilestones: function setMilestones(state, milestones) {
            state.milestones = milestones;
            state.milestones_load = true;
        }
    }

});

/***/ }),
/* 44 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_index_vue__ = __webpack_require__(73);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_3ef982c4_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_index_vue__ = __webpack_require__(154);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_index_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_3ef982c4_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_index_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/components/calendar/index.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-3ef982c4", Component.options)
  } else {
    hotAPI.reload("data-v-3ef982c4", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 45 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_template_compiler_index_id_data_v_be63d61a_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_index_vue__ = __webpack_require__(167);
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
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_template_compiler_index_id_data_v_be63d61a_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_index_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/components/my-tasks/index.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-be63d61a", Component.options)
  } else {
    hotAPI.reload("data-v-be63d61a", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 46 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_template_compiler_index_id_data_v_461a5f86_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_header_vue__ = __webpack_require__(155);
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
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_template_compiler_index_id_data_v_461a5f86_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_header_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/components/settings/header.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-461a5f86", Component.options)
  } else {
    hotAPI.reload("data-v-461a5f86", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _store = __webpack_require__(43);

var _store2 = _interopRequireDefault(_store);

var _router = __webpack_require__(53);

var _router2 = _interopRequireDefault(_router);

var _directive = __webpack_require__(121);

var _directive2 = _interopRequireDefault(_directive);

var _mixin = __webpack_require__(27);

var _mixin2 = _interopRequireDefault(_mixin);

var _App = __webpack_require__(133);

var _App2 = _interopRequireDefault(_App);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Project template render
 */
var PM_Vue = {
    el: '#wedevs-pm',
    store: _store2.default,
    router: _router2.default,
    render: function render(t) {
        return t(_App2.default);
    }
};

new pm.Vue(PM_Vue);

/***/ }),
/* 48 */,
/* 49 */,
/* 50 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/

var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

var listToStyles = __webpack_require__(171)

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

module.exports = function (parentId, list, _isProduction) {
  isProduction = _isProduction

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[data-vue-ssr-id~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),
/* 52 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_do_action_vue__ = __webpack_require__(77);
var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */
var __vue_template__ = null
/* template functional */
  var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_do_action_vue__["a" /* default */],
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/components/common/do-action.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-bd45e352", Component.options)
  } else {
    hotAPI.reload("data-v-bd45e352", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _router = __webpack_require__(105);

var _router2 = __webpack_require__(92);

var _router3 = _interopRequireDefault(_router2);

var _router4 = __webpack_require__(89);

var _router5 = _interopRequireDefault(_router4);

var _router6 = __webpack_require__(94);

var _router7 = _interopRequireDefault(_router6);

var _router8 = __webpack_require__(90);

var _router9 = _interopRequireDefault(_router8);

var _router10 = __webpack_require__(117);

var _router11 = _interopRequireDefault(_router10);

var _router12 = __webpack_require__(95);

var _router13 = _interopRequireDefault(_router12);

var _router14 = __webpack_require__(119);

var _router15 = __webpack_require__(111);

var _router16 = _interopRequireDefault(_router15);

var _router17 = __webpack_require__(97);

var _router18 = _interopRequireDefault(_router17);

var _router19 = __webpack_require__(103);

var _router20 = _interopRequireDefault(_router19);

var _router21 = __webpack_require__(115);

var _router22 = __webpack_require__(100);

var _router23 = __webpack_require__(107);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

weDevs_PM_Routers.push(_router14.general);
weDevs_PM_Routers.push(_router14.email);
weDevs_PM_Routers.push(_router.active);
weDevs_PM_Routers.push(_router.all);
weDevs_PM_Routers.push(_router.completed);
weDevs_PM_Routers.push(_router3.default);
weDevs_PM_Routers.push(_router5.default);

if (!PM_Vars.is_pro) {
	weDevs_PM_Routers.push(_router7.default);
	weDevs_PM_Routers.push(_router9.default);
}

weDevs_PM_Routers.push(_router11.default);
weDevs_PM_Routers.push(_router13.default);
weDevs_PM_Routers.push(_router16.default);
weDevs_PM_Routers.push(_router18.default);
weDevs_PM_Routers.push(_router22.discussions);
weDevs_PM_Routers.push(_router22.single_discussion);
weDevs_PM_Routers.push(_router23.milestones);
weDevs_PM_Routers.push(_router21.task_lists);
weDevs_PM_Routers.push(_router21.single_list);
weDevs_PM_Routers.push(_router20.default);

var router = new pm.VueRouter({
	routes: weDevs_PM_Routers
});

router.beforeEach(function (to, from, next) {
	pm.NProgress.start();
	next();
});

exports.default = router;

/***/ }),
/* 54 */,
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(8);
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),
/* 56 */,
/* 57 */,
/* 58 */,
/* 59 */,
/* 60 */,
/* 61 */,
/* 62 */,
/* 63 */,
/* 64 */,
/* 65 */,
/* 66 */,
/* 67 */,
/* 68 */,
/* 69 */,
/* 70 */,
/* 71 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_project_discussions_index_vue__ = __webpack_require__(140);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_project_lists_index_vue__ = __webpack_require__(142);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_project_overview_index_vue__ = __webpack_require__(144);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_project_activities_index_vue__ = __webpack_require__(139);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_project_milestones_index_vue__ = __webpack_require__(143);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_categories_index_vue__ = __webpack_require__(137);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_project_task_lists_index_vue__ = __webpack_require__(145);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_project_files_index_vue__ = __webpack_require__(141);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_common_do_action_vue__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__components_settings_index_vue__ = __webpack_require__(149);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__components_my_tasks_index_vue__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__components_calendar_index_vue__ = __webpack_require__(44);
//
//
//
//
//
//
//
//
//
//
//
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
        'pm-discussions': __WEBPACK_IMPORTED_MODULE_0__components_project_discussions_index_vue__["a" /* default */],
        'pm-projects': __WEBPACK_IMPORTED_MODULE_1__components_project_lists_index_vue__["a" /* default */],
        'pm-overview': __WEBPACK_IMPORTED_MODULE_2__components_project_overview_index_vue__["a" /* default */],
        'pm-activities': __WEBPACK_IMPORTED_MODULE_3__components_project_activities_index_vue__["a" /* default */],
        'pm-milestones': __WEBPACK_IMPORTED_MODULE_4__components_project_milestones_index_vue__["a" /* default */],
        'pm-categories': __WEBPACK_IMPORTED_MODULE_5__components_categories_index_vue__["a" /* default */],
        'pm-task-lists': __WEBPACK_IMPORTED_MODULE_6__components_project_task_lists_index_vue__["a" /* default */],
        'pm-files': __WEBPACK_IMPORTED_MODULE_7__components_project_files_index_vue__["a" /* default */],
        'do-action': __WEBPACK_IMPORTED_MODULE_8__components_common_do_action_vue__["a" /* default */],
        'pm-settings': __WEBPACK_IMPORTED_MODULE_9__components_settings_index_vue__["a" /* default */],
        'pm-my-tasks': __WEBPACK_IMPORTED_MODULE_10__components_my_tasks_index_vue__["default"],
        'pm-calendar': __WEBPACK_IMPORTED_MODULE_11__components_calendar_index_vue__["default"]
    },

    data: function data() {
        return {
            is_pro: PM_Vars.is_pro
        };
    }
});

/***/ }),
/* 72 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helpers_mixin_mixin__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helpers_mixin_mixin___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__helpers_mixin_mixin__);
//
//
//
//



/* harmony default export */ __webpack_exports__["a"] = ({
    mixins: [__WEBPACK_IMPORTED_MODULE_0__helpers_mixin_mixin___default.a],
    methods: {}
});

/***/ }),
/* 73 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({
    methods: {}
});

/***/ }),
/* 74 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__edit_category_form_vue__ = __webpack_require__(136);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
            vm.getCategories();
        });
    },


    components: {
        'edit-category-form': __WEBPACK_IMPORTED_MODULE_0__edit_category_form_vue__["a" /* default */]
    },

    data: function data() {
        return {
            title: '',
            description: '',
            submit_disabled: false,
            delete_items: [],
            bulk_action: '-1',
            select_all: false,
            show_spinner: false
        };
    },


    computed: {
        categories: function categories() {
            return this.$store.state.categories;
        }
    },

    methods: {
        selectAll: function selectAll() {
            var self = this;
            this.$store.state.categories.map(function (category, index) {
                self.delete_items.push(category.id);
            });
        },
        catTrClass: function catTrClass(category) {
            if (category.edit_mode) {
                return 'inline-edit-row inline-editor';
            }
        },
        selfDeleted: function selfDeleted() {
            if (!confirm(this.text.are_you_sure)) {
                return;
            }
            var self = this;
            switch (this.bulk_action) {
                case 'delete':
                    self.deleteCategories({ category_ids: this.delete_items });
                    break;
            }
        },
        categoryFormAction: function categoryFormAction() {
            // Exit from this function, If submit button disabled 
            if (this.submit_disabled) {
                return;
            }
            // Disable submit button for preventing multiple click
            this.submit_disabled = true;
            this.show_spinner = true;

            var args = {
                data: {
                    title: this.title,
                    description: this.description
                }
            };
            this.newCategory(args);
            this.title = '';
            this.description = '';
        }
    }
});

/***/ }),
/* 75 */
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

/* harmony default export */ __webpack_exports__["a"] = ({
    props: ['category'],

    data: function data() {
        return {
            submit_disabled: false,
            show_spinner: false
        };
    },


    methods: {
        updateSelfCategory: function updateSelfCategory() {
            // Exit from this function, If submit button disabled 
            if (this.submit_disabled) {
                return;
            }

            // Disable submit button for preventing multiple click
            this.submit_disabled = true;
            this.show_spinner = true;

            var args = {
                data: {
                    id: this.category.id,
                    title: this.category.title,
                    description: this.category.description
                }
            };

            this.updateCategory(args);
        }
    }
});

/***/ }),
/* 76 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__mixin__ = __webpack_require__(91);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__mixin___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__mixin__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__store__ = __webpack_require__(93);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__store___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__store__);
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["a"] = ({
    store: __WEBPACK_IMPORTED_MODULE_1__store___default.a
});

/***/ }),
/* 77 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helpers_mixin_mixin__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helpers_mixin_mixin___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__helpers_mixin_mixin__);




function PMGetComponents() {
    var components = {};

    window.weDevs_PM_Components.map(function (obj, key) {
        if (obj.property.mixins) {
            obj.property.mixins.push(__WEBPACK_IMPORTED_MODULE_0__helpers_mixin_mixin___default.a);
        } else {
            obj.property.mixins = [__WEBPACK_IMPORTED_MODULE_0__helpers_mixin_mixin___default.a];
        }

        components[obj.component] = obj.property;
    });

    return components;
}

var action = {
    props: ['hook'],

    components: PMGetComponents(),

    render: function render(h) {
        var components = [],
            self = this;

        window.weDevs_PM_Components.map(function (obj, key) {
            if (obj.hook == self.hook) {
                components.push(h(obj.component));
            }
        });

        return h('span', {}, components);
    }
};

/* harmony default export */ __webpack_exports__["a"] = (action);

/***/ }),
/* 78 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({
    methods: {}
});

/***/ }),
/* 79 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__mixin__ = __webpack_require__(96);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__mixin___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__mixin__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__store__ = __webpack_require__(98);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__store___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__store__);
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["a"] = ({
    store: __WEBPACK_IMPORTED_MODULE_1__store___default.a
});

/***/ }),
/* 80 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__store__ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__store___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__store__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mixin__ = __webpack_require__(99);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mixin___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__mixin__);
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["a"] = ({
    store: __WEBPACK_IMPORTED_MODULE_0__store___default.a
});

/***/ }),
/* 81 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__store__ = __webpack_require__(104);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__store___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__store__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mixin__ = __webpack_require__(102);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mixin___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__mixin__);
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["a"] = ({
    state: __WEBPACK_IMPORTED_MODULE_0__store___default.a.state,

    mutations: __WEBPACK_IMPORTED_MODULE_0__store___default.a.mutations,

    created: function created() {
        this.registerStore('pmFiles');
    }
});

/***/ }),
/* 82 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__store__ = __webpack_require__(108);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__store___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__store__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mixin__ = __webpack_require__(106);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mixin___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__mixin__);
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["a"] = ({
    store: __WEBPACK_IMPORTED_MODULE_0__store___default.a
});

/***/ }),
/* 83 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__directive__ = __webpack_require__(109);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__directive___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__directive__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__store__ = __webpack_require__(112);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__store___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__store__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__mixin__ = __webpack_require__(110);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__mixin___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__mixin__);
//
//
//
//
//
//
//





/* harmony default export */ __webpack_exports__["a"] = ({
    store: __WEBPACK_IMPORTED_MODULE_1__store___default.a
});

/***/ }),
/* 84 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__store__ = __webpack_require__(116);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__store___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__store__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mixin__ = __webpack_require__(114);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mixin___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__mixin__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__directive__ = __webpack_require__(113);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__directive___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__directive__);
//
//
//
//
//
//
//





/* harmony default export */ __webpack_exports__["a"] = ({
    store: __WEBPACK_IMPORTED_MODULE_0__store___default.a
});

/***/ }),
/* 85 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({
    methods: {}
});

/***/ }),
/* 86 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__header_vue__ = __webpack_require__(46);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
        'settings-header': __WEBPACK_IMPORTED_MODULE_0__header_vue__["a" /* default */]
    },

    data: function data() {
        return {
            from_email: this.getSettings('from_email', PM_Vars.current_user.data.user_email),
            link_to_backend: this.getSettings('link_to_backend', false),
            email_type: this.getSettings('email_type', 'text/html'),
            enable_bcc: this.getSettings('enable_bcc', false),
            show_spinner: false
        };
    },


    methods: {
        saveEmailSettings: function saveEmailSettings() {
            this.show_spinner = true;
            self = this;
            var data = {
                from_email: this.from_email,
                link_to_backend: this.link_to_backend,
                email_type: this.email_type,
                enable_bcc: this.enable_bcc
            };

            this.saveSettings(data, function (res) {
                self.show_spinner = false;
            });
        }
    }
});

/***/ }),
/* 87 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__header_vue__ = __webpack_require__(46);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
            upload_limit: this.getSettings('upload_limit', 2),
            project_per_page: this.getSettings('project_per_page', 10),
            list_per_page: this.getSettings('list_per_page', 10),
            incomplete_tasks_per_page: this.getSettings('incomplete_tasks_per_page', 10),
            complete_tasks_per_page: this.getSettings('complete_tasks_per_page', 10),
            roles: PM_Vars.roles,
            managing_capability: this.getSettings('managing_capability', []),
            project_create_capability: this.getSettings('project_create_capability', []),
            show_spinner: false
        };
    },


    components: {
        'settings-header': __WEBPACK_IMPORTED_MODULE_0__header_vue__["a" /* default */]
    },

    methods: {
        saveSelfSettings: function saveSelfSettings() {
            this.show_spinner = true;
            self = this;
            var data = {
                upload_limit: this.upload_limit,
                project_per_page: this.project_per_page,
                list_per_page: this.list_per_page,
                incomplete_tasks_per_page: this.incomplete_tasks_per_page,
                complete_tasks_per_page: this.complete_tasks_per_page,
                managing_capability: this.managing_capability,
                project_create_capability: this.project_create_capability
            };

            this.saveSettings(data, function (res) {
                self.show_spinner = false;
            });
        }
    }
});

/***/ }),
/* 88 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__store__ = __webpack_require__(120);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__store___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__store__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mixin__ = __webpack_require__(118);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mixin___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__mixin__);
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["a"] = ({
    store: __WEBPACK_IMPORTED_MODULE_0__store___default.a
});

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = __webpack_require__(134);

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    path: '/add-ons',
    components: { 'add-ons': _index2.default },
    name: 'add_ons'
};

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = __webpack_require__(44);

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    path: '/calendar',
    components: { 'calendar': _index2.default },
    name: 'calendar'
};

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = pm.Vue.mixin({
  methods: {
    /**
     * Insert categroy resource
     * @param  {Object} args Object with callback
     * @return {void}      
     */
    newCategory: function newCategory(args) {
      var self = this;
      var pre_define = {
        data: {
          title: this.title,
          description: this.description,
          categorible_type: 'project'
        },
        callback: false
      },
          args = jQuery.extend(true, pre_define, args);

      var request_data = {
        url: self.base_url + '/pm/v2/categories',
        type: 'POST',
        data: args.data,

        success: function success(res) {
          self.addCategoryMeta(res.data);

          self.show_spinner = false;

          // Display a success toast, with a title
          pm.Toastr.success(res.data.success);

          self.submit_disabled = false;

          self.$store.commit('afterNewCategories', res.data);
          if (typeof args.callback === 'function') {
            args.callback.call(self, res);
          }
        },
        error: function error(res) {
          self.show_spinner = false;
          // Showing error
          res.data.error.map(function (value, index) {
            pm.Toastr.error(value);
          });
          if (typeof args.callback === 'function') {
            args.callback.call(self, res);
          }
          self.submit_disabled = false;
        }
      };

      self.httpRequest(request_data);
    },


    /**
     * Get All categories 
     * @return {[data]} [description]
     */
    getCategories: function getCategories() {
      var self = this;

      var request_data = {
        url: self.base_url + '/pm/v2/categories',
        success: function success(res) {
          res.data.map(function (category, index) {
            self.addCategoryMeta(category);
          });

          self.$store.commit('setCategories', res.data);
        }
      };

      self.httpRequest(request_data);
    },
    getCategory: function getCategory() {},

    /**
     * Category meta
     * @param {Object} category 
     */
    addCategoryMeta: function addCategoryMeta(category) {
      category.edit_mode = false;
    },


    /**
     * Category form mood
     * @param  {Object} category 
     * @return {void}          
     */
    showHideCategoryEditForm: function showHideCategoryEditForm(category) {
      category.edit_mode = category.edit_mode ? false : true;
    },


    /**
     * Update Category 
     * @param  {Object} args 
     * @return {Data Collection}      
     */
    updateCategory: function updateCategory(args) {
      var self = this;

      var pre_define = {
        data: {
          id: '',
          title: '',
          description: '',
          categorible_type: 'project'
        },
        callback: false
      },
          args = jQuery.extend(true, pre_define, args);

      // Showing loading option 
      this.show_spinner = true;

      var request_data = {
        url: self.base_url + '/pm/v2/categories/' + args.data.id,
        type: 'PUT',
        data: args.data,

        success: function success(res) {
          self.addCategoryMeta(res.data);
          self.show_spinner = false;

          // Display a success toast, with a title
          pm.Toastr.success(res.data.success);

          self.submit_disabled = false;
          self.show_spinner = false;

          self.$store.commit('afterUpdateCategories', res.data);
          if (typeof args.callback === 'function') {
            args.callback.call(self, res);
          }
        },
        error: function error(res) {
          self.show_spinner = false;

          // Showing error
          res.data.error.map(function (value, index) {
            pm.Toastr.error(value);
          });
          if (typeof args.callback === 'function') {
            args.callback.call(self, res);
          }
          self.submit_disabled = false;
        }
      };

      self.httpRequest(request_data);
    },


    /**
     * Delete Bulk categories by categories ids
     * @param  {Object} args ids with callback
     * @return {void}      
     */
    deleteCategories: function deleteCategories(args) {
      var self = this;

      var pre_define = {
        category_ids: [],
        callback: false
      },
          args = jQuery.extend(true, pre_define, args);

      var request_data = {
        url: self.base_url + '/pm/v2/categories/bulk-delete/',
        data: {
          'category_ids': args.category_ids
        },
        type: 'DELETE',
        success: function success(res) {
          args.category_ids.map(function (id, index) {
            self.$store.commit('afterDeleteCategory', id);
          });

          if (typeof args.callback === 'function') {
            args.callback.call(self, res);
          }
        }
        //self.$store.commit('afterDeleteDiscuss', discuss_id);
      };self.httpRequest(request_data);
    }
  }
});

/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _categories = __webpack_require__(135);

var _categories2 = _interopRequireDefault(_categories);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    path: '/categories',
    components: {
        'categories': _categories2.default
    },
    name: 'categories'
};

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

/**
 * Make sure to call pm.Vue.use(Vuex) first if using a vuex module system
 */

exports.default = new pm.Vuex.Store({

    state: {
        categories: [],
        getIndex: function getIndex(itemList, id, slug) {
            var index = false;

            itemList.forEach(function (item, key) {
                if (item[slug] == id) {
                    index = key;
                }
            });

            return index;
        }
    },
    mutations: {
        afterNewCategories: function afterNewCategories(state, categories) {
            state.categories.push(categories);
        },
        setCategories: function setCategories(state, categories) {
            state.categories = categories;
        },
        afterUpdateCategories: function afterUpdateCategories(state, category) {
            var category_index = state.getIndex(state.categories, category.id, 'id');
            state.categories.splice(category_index, 1, category);
        },
        afterDeleteCategory: function afterDeleteCategory(state, id) {
            var category_index = state.getIndex(state.categories, id, 'id');
            state.categories.splice(category_index, 1);
        }
    }
});

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = __webpack_require__(45);

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    path: '/my-tasks',
    components: { 'my-tasks': _index2.default },
    name: 'my_tasks'
};

/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = __webpack_require__(138);

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    path: '/progress',
    components: { 'progress': _index2.default },
    name: 'progress'
};

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = pm.Vue.mixin({
    methods: {
        getActivities: function getActivities(condition, callback) {
            var self = this,
                condition = self.generateActivityCondition(condition) || '';

            var request = {
                url: self.base_url + '/pm/v2/projects/' + self.project_id + '/activities?' + condition,
                success: function success(res) {
                    if (typeof callback !== 'undefined') {
                        callback(res);
                    }
                    pm.NProgress.done();
                }
            };

            self.httpRequest(request);
        },
        setCurrentPageNumber: function setCurrentPageNumber(self) {
            var current_page_number = self.$route.params.current_page_number ? self.$route.params.current_page_number : 1;
            self.current_page_number = current_page_number;
            return current_page_number;
        },
        generateActivityCondition: function generateActivityCondition(conditions) {
            var query = '';

            jQuery.each(conditions, function (condition, key) {
                query = query + condition + '=' + key + '&';
            });

            return query.slice(0, -1);
        }
    }
});

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
//import project_lists from './index.vue';

var activities_route = function activities_route(resolve) {
    __webpack_require__.e/* require.ensure */(15).then((function () {
        resolve(__webpack_require__(58));
    }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
};

var activities = {
    path: '/:project_id/activities/',
    components: {
        'activities': activities_route
    },
    name: 'activities'
};

exports.default = activities;

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

/**
 * Make sure to call pm.Vue.use(Vuex) first if using a vuex module system
 */
exports.default = new pm.Vuex.Store({

    state: {
        activities: []
    },

    mutations: {
        setActivities: function setActivities(state, activities) {
            state.activities = activities;
        },
        setLoadedActivities: function setLoadedActivities(state, activities) {
            var new_activity = state.activities.concat(activities);
            state.activities = new_activity;
        }
    }
});

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = pm.Vue.mixin({
    methods: {
        showHideDiscussForm: function showHideDiscussForm(status, discuss) {
            var discuss = discuss || false,
                discuss = jQuery.isEmptyObject(discuss) ? false : discuss;

            if (discuss) {
                if (status === 'toggle') {
                    discuss.edit_mode = discuss.edit_mode ? false : true;
                } else {
                    discuss.edit_mode = status;
                }
            } else {
                this.$store.commit('showHideDiscussForm', status);
            }
        },
        showHideDiscussCommentForm: function showHideDiscussCommentForm(status, comment) {
            if (status === 'toggle') {
                comment.edit_mode = comment.edit_mode ? false : true;
            } else {
                comment.edit_mode = status;
            }
        },
        getDiscussion: function getDiscussion(args) {
            var self = this;
            var pre_define = {
                conditions: {
                    with: 'comments',
                    per_page: 2,
                    page: 1
                },
                callback: false
            };

            var args = jQuery.extend(true, pre_define, args);
            var conditions = self.generateConditions(args.conditions);

            var request = {
                url: self.base_url + '/pm/v2/projects/' + self.project_id + '/discussion-boards?' + conditions,
                success: function success(res) {
                    res.data.map(function (discuss, index) {
                        self.addDiscussMeta(discuss);
                    });
                    self.$store.commit('setDiscussion', res.data);
                    self.$store.commit('setDiscussionMeta', res.meta.pagination);

                    if (typeof args.callback === 'function') {
                        args.callback(res.data);
                    }
                }
            };
            self.httpRequest(request);
        },
        getDiscuss: function getDiscuss(args) {
            var self = this;
            var pre_define = {
                conditions: {
                    with: 'comments'
                },
                callback: false
            };

            var args = jQuery.extend(true, pre_define, args);
            var conditions = self.generateConditions(args.conditions);

            var request = {
                url: self.base_url + '/pm/v2/projects/' + self.project_id + '/discussion-boards/' + self.$route.params.discussion_id + '?' + conditions, ///with=comments',
                success: function success(res) {
                    self.addDiscussMeta(res.data);
                    self.$store.commit('setDiscuss', res.data);

                    if (typeof args.callback === 'function') {
                        args.callback(res.data);
                    }
                }
            };
            self.httpRequest(request);
        },
        addDiscussMeta: function addDiscussMeta(discuss) {
            var self = this;
            discuss.edit_mode = false;

            if (typeof discuss.comments !== 'undefined') {
                discuss.comments.data.map(function (comment, index) {
                    self.addCommentMeta(comment);
                });
            }
        },
        setCurrentPageNumber: function setCurrentPageNumber() {
            var self = this;
            var current_page_number = self.$route.params.current_page_number ? self.$route.params.current_page_number : 1;
            self.current_page_number = current_page_number;
            return current_page_number;
        },
        dataURLtoFile: function dataURLtoFile(dataurl, filename) {
            var arr = dataurl.split(','),
                mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]),
                n = bstr.length,
                u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], filename, { type: mime });
        },


        /**
         * Insert and edit task
         * 
         * @return void
         */
        newDiscuss: function newDiscuss(args) {
            // Exit from this function, If submit button disabled 
            if (this.submit_disabled) {
                return;
            }
            // Disable submit button for preventing multiple click
            this.submit_disabled = true;

            var self = this;
            var pre_define = {};
            var args = jQuery.extend(true, pre_define, args);
            var data = new FormData();

            data.append('title', args.title);
            data.append('description', args.description);
            data.append('milestone', args.milestone_id);
            data.append('notify_users', args.notify_users);
            data.append('order', 0);

            args.deleted_files.map(function (del_file) {
                data.append('files_to_delete[]', del_file);
            });

            args.files.map(function (file) {
                if (typeof file.attachment_id === 'undefined') {
                    var decode = self.dataURLtoFile(file.thumb, file.name);
                    data.append('files[]', decode);
                }
            });

            // Showing loading option 
            this.show_spinner = true;

            var request_data = {
                url: self.base_url + '/pm/v2/projects/' + self.project_id + '/discussion-boards',
                type: 'POST',
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                success: function success(res) {

                    // Display a success toast, with a title
                    pm.Toastr.success(res.data.success);
                    self.submit_disabled = false;
                    self.show_spinner = false;
                    self.addDiscussMeta(res.data);
                    self.showHideDiscussForm(false);
                    self.$root.$emit('after_comment');
                    self.$store.commit('newDiscuss', res.data);
                    self.$store.commit('updateMetaAfterNewDiscussion');

                    if (typeof args.callback === 'function') {
                        args.callback(res.data);
                    }
                },
                error: function error(res) {
                    self.show_spinner = false;

                    // Showing error
                    res.data.error.map(function (value, index) {
                        pm.Toastr.error(value);
                    });
                    self.submit_disabled = false;
                }
            };
            self.httpRequest(request_data);
        },

        updateDiscuss: function updateDiscuss(args) {
            // Exit from this function, If submit button disabled 
            if (this.submit_disabled) {
                return;
            }

            var self = this;
            var pre_define = {};
            var args = jQuery.extend(true, pre_define, args);
            var data = new FormData();

            // Disable submit button for preventing multiple click
            this.submit_disabled = true;

            data.append('title', args.title);
            data.append('description', args.description);
            data.append('milestone', args.milestone_id);
            data.append('notify_users', args.notify_users);
            data.append('order', 0);

            args.deleted_files.map(function (del_file) {
                data.append('files_to_delete[]', del_file);
            });

            args.files.map(function (file) {
                if (typeof file.attachment_id === 'undefined') {
                    var decode = self.dataURLtoFile(file.thumb, file.name);
                    data.append('files[]', decode);
                }
            });

            // Showing loading option 
            this.show_spinner = true;

            var request_data = {
                url: self.base_url + '/pm/v2/projects/' + self.project_id + '/discussion-boards/' + this.discuss.id,
                type: 'POST',
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                success: function success(res) {
                    self.show_spinner = false;
                    // Display a success toast, with a title
                    pm.Toastr.success(res.data.success);
                    self.addDiscussMeta(res.data);
                    self.submit_disabled = false;

                    self.showHideDiscussForm(false, self.discuss);

                    self.$store.commit('updateDiscuss', res.data);
                    self.$root.$emit('after_comment');

                    if (typeof args.callback === 'function') {
                        args.callback(res.data);
                    }
                },
                error: function error(res) {
                    self.show_spinner = false;

                    // Showing error
                    res.data.error.map(function (value, index) {
                        pm.Toastr.error(value);
                    });
                    self.submit_disabled = false;
                }
            };
            self.httpRequest(request_data);
        },
        newComment: function newComment(args) {
            // Exit from this function, If submit button disabled 
            if (this.submit_disabled) {
                return;
            }

            // Disable submit button for preventing multiple click
            this.submit_disabled = true;

            var self = this;
            var pre_define = {};
            var args = jQuery.extend(true, pre_define, args);
            var data = new FormData();

            data.append('content', args.content);
            data.append('commentable_id', args.commentable_id);
            data.append('commentable_type', args.commentable_type); //'discussion-board'
            data.append('notify_users', args.notify_users);

            args.files.map(function (file) {
                if (typeof file.attachment_id === 'undefined') {
                    var decode = self.dataURLtoFile(file.thumb, file.name);
                    data.append('files[]', decode);
                }
            });

            // Showing loading option 
            this.show_spinner = true;

            var request_data = {
                url: self.base_url + '/pm/v2/projects/' + self.project_id + '/comments',
                type: 'POST',
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                success: function success(res) {
                    self.addCommentMeta(res.data);
                    self.files = [];
                    //self.getDiscuss(self);
                    self.show_spinner = false;
                    // Display a success toast, with a title
                    pm.Toastr.success(res.data.success);

                    self.submit_disabled = false;

                    self.showHideCommentForm(false, self.comment);
                    self.$root.$emit('after_comment');
                    self.$store.commit('afterNewComment', {
                        'comment': res.data,
                        'commentable_id': args.commentable_id
                    });

                    if (typeof args.callback === 'function') {
                        args.callback(res.data);
                    }
                },
                error: function error(res) {
                    self.show_spinner = false;

                    // Showing error
                    res.data.error.map(function (value, index) {
                        pm.Toastr.error(value);
                    });
                    self.submit_disabled = false;
                }
            };

            self.httpRequest(request_data);
        },
        updateComment: function updateComment(args) {
            // Exit from this function, If submit button disabled 
            if (this.submit_disabled) {
                return;
            }

            // Disable submit button for preventing multiple click
            this.submit_disabled = true;

            var self = this;
            var pre_define = {};
            var args = jQuery.extend(true, pre_define, args);
            var data = new FormData();

            data.append('content', args.content);
            data.append('commentable_id', args.commentable_id);
            data.append('commentable_type', args.commentable_type); //'discussion-board'
            data.append('notify_users', args.notify_users);

            args.deleted_files.map(function (del_file) {
                data.append('files_to_delete[]', del_file);
            });

            args.files.map(function (file) {
                if (typeof file.attachment_id === 'undefined') {
                    var decode = self.dataURLtoFile(file.thumb, file.name);
                    data.append('files[]', decode);
                }
            });

            // Showing loading option 
            this.show_spinner = true;

            var request_data = {
                url: self.base_url + '/pm/v2/projects/' + self.project_id + '/comments/' + args.comment_id,
                type: 'POST',
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                success: function success(res) {
                    self.addCommentMeta(res.data);
                    self.files = [];
                    //self.getDiscuss(self);
                    self.show_spinner = false;
                    // Display a success toast, with a title
                    pm.Toastr.success(res.data.success);

                    self.submit_disabled = false;

                    self.showHideCommentForm(false, self.comment);
                    self.$root.$emit('after_comment');
                    self.$store.commit('afterUpdateComment', {
                        'comment': res.data,
                        'commentable_id': args.commentable_id,
                        'comment_id': args.comment_id
                    });

                    if (typeof args.callback === 'function') {
                        args.callback(res.data);
                    }
                },
                error: function error(res) {
                    self.show_spinner = false;

                    // Showing error
                    res.data.error.map(function (value, index) {
                        pm.Toastr.error(value);
                    });
                    self.submit_disabled = false;
                }
            };

            self.httpRequest(request_data);
        },
        addCommentMeta: function addCommentMeta(comment) {
            comment.edit_mode = false;
        },
        deleteDiscuss: function deleteDiscuss(args) {
            if (!confirm(this.text.are_you_sure)) {
                return;
            }
            var self = this;
            var pre_define = {
                discuss_id: false,
                callback: false
            };

            var args = jQuery.extend(true, pre_define, args);

            var request_data = {
                url: self.base_url + '/pm/v2/projects/' + self.project_id + '/discussion-boards/' + args.discuss_id,
                type: 'DELETE',
                success: function success(res) {
                    self.$store.commit('afterDeleteDiscuss', args.discuss_id);

                    if (!self.$store.state.discussion.length) {
                        self.$router.push({
                            name: 'discussions',
                            params: {
                                project_id: self.project_id
                            }
                        });
                    } else {
                        self.getDiscussion();
                    }

                    if (typeof args.callback === 'function') {
                        args.callback();
                    }
                }
            };

            self.httpRequest(request_data);
        },
        deleteComment: function deleteComment(args) {
            if (!confirm(this.text.delete_comment_conf)) {
                return;
            }

            var self = this;
            var pre_define = {
                comment_id: false,
                callback: false,
                commentable_id: false
            };

            var args = jQuery.extend(true, pre_define, args);

            var request_data = {
                url: self.base_url + '/pm/v2/projects/' + self.project_id + '/comments/' + args.comment_id,
                type: 'DELETE',
                success: function success(res) {
                    self.$store.commit('afterDeleteComment', {
                        comment_id: args.comment_id,
                        commentable_id: args.commentable_id
                    });
                }
            };

            self.httpRequest(request_data);
        },
        viewAction: function viewAction(blank, discuss) {
            var blank = blank || false;
            var discuss = discuss || false;

            this.$store.commit('balankTemplateStatus', blank);
            this.$store.commit('discussTemplateStatus', discuss);
        },
        lazyAction: function lazyAction() {
            var discussion = this.$store.state.discussion;

            if (discussion.length) {
                this.viewAction(false, true);
            }

            if (!discussion.length) {
                this.viewAction(true, false);
            }
        }
    }
});

/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
//import project_lists from './index.vue';

var discussions_route = function discussions_route(resolve) {
    __webpack_require__.e/* require.ensure */(11).then((function () {
        resolve(__webpack_require__(59));
    }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
};

var individual_discussion = function individual_discussion(resolve) {
    __webpack_require__.e/* require.ensure */(10).then((function () {
        resolve(__webpack_require__(60));
    }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
};

var discussions = {
    path: '/:project_id/discussions/',
    components: {
        'discussions': discussions_route
    },
    name: 'discussions',

    children: [{
        path: 'pages/:current_page_number',
        components: {
            'discussions': discussions_route
        },
        name: 'discussion_pagination'
    }]
};

var single_discussion = {
    path: '/:project_id/discussions/:discussion_id',
    components: {
        'individual-discussion': individual_discussion
    },
    name: 'individual_discussions'
};

exports.discussions = discussions;
exports.single_discussion = single_discussion;

/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

/**
 * Make sure to call pm.Vue.use(Vuex) first if using a vuex module system
 */

exports.default = new pm.Vuex.Store({

    state: {
        is_discuss_form_active: false,
        blank_template: false,
        discuss_template: false,
        discussion: [],
        discuss: {},
        meta: {},
        getIndex: function getIndex(itemList, id, slug) {
            var index = false;

            itemList.forEach(function (item, key) {
                if (item[slug] == id) {
                    index = key;
                }
            });

            return index;
        }
    },

    mutations: {
        showHideDiscussForm: function showHideDiscussForm(state, status) {
            if (status === 'toggle') {
                state.is_discuss_form_active = state.is_discuss_form_active ? false : true;
            } else {
                state.is_discuss_form_active = status;
            }
        },
        setMilestones: function setMilestones(state, milestones) {
            state.milestones = milestones;
        },
        setDiscussion: function setDiscussion(state, discussion) {

            state.discussion = discussion;
        },
        setDiscuss: function setDiscuss(state, discuss) {
            state.discussion = [];
            state.discussion.push(discuss);
        },
        afterDeleteDiscuss: function afterDeleteDiscuss(state, discuss_id) {
            var discuss_index = state.getIndex(state.discussion, discuss_id, 'id');
            state.discussion.splice(discuss_index, 1);
        },
        setDiscussionMeta: function setDiscussionMeta(state, meta) {
            state.meta = meta;
        },
        afterDeleteComment: function afterDeleteComment(state, data) {
            var comment_index = state.getIndex(state.discussion[0].comments.data, data.comment_id, 'id');
            state.discussion[0].comments.data.splice(comment_index, 1);
        },
        updateDiscuss: function updateDiscuss(state, data) {
            var discuss_index = state.getIndex(state.discussion, data.id, 'id');
            jQuery.extend(true, state.discussion[discuss_index], data);
            //state.discussion.splice(discuss_index, 1, data);
        },
        newDiscuss: function newDiscuss(state, discuss) {
            var per_page = state.meta.per_page,
                length = state.discussion.length;

            if (per_page <= length) {
                state.discussion.splice(0, 0, discuss);
                state.discussion.pop();
            } else {
                state.discussion.splice(0, 0, discuss);
            }
        },
        balankTemplateStatus: function balankTemplateStatus(state, status) {
            state.blank_template = status;
        },
        discussTemplateStatus: function discussTemplateStatus(state, status) {
            state.discuss_template = status;
        },
        updateMetaAfterNewDiscussion: function updateMetaAfterNewDiscussion(state) {
            state.meta.total = state.meta.total + 1;
            state.meta.total_pages = Math.ceil(state.meta.total / state.meta.per_page);
        },
        afterNewComment: function afterNewComment(state, data) {
            var index = state.getIndex(state.discussion, data.commentable_id, 'id');

            state.discussion[index].comments.data.splice(0, 0, data.comment);
        },
        afterUpdateComment: function afterUpdateComment(state, data) {
            var index = state.getIndex(state.discussion, data.commentable_id, 'id'),
                comment_index = state.getIndex(state.discussion[index].comments.data, data.comment_id, 'id');

            state.discussion[index].comments.data.splice(comment_index, 1, data.comment);
        }
    }
});

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _store = __webpack_require__(43);

var _store2 = _interopRequireDefault(_store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = pm.Vue.mixin({
    methods: {
        getFiles: function getFiles() {
            var self = this;
            var request = {
                url: self.base_url + '/pm/v2/projects/' + self.project_id + '/files',
                success: function success(res) {
                    self.$store.commit('pmFiles/setFiles', res.data);
                    pm.NProgress.done();
                    self.loading = false;
                }
            };
            self.httpRequest(request);
        }
    }
});

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
//import project_lists from './index.vue';

var files = function files(resolve) {
    __webpack_require__.e/* require.ensure */(12).then((function () {
        resolve(__webpack_require__(61));
    }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
};

exports.default = {
    path: '/:project_id/files',
    components: {
        'pm-files': files
    },
    name: 'pm_files'
};

/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    state: {
        files: []
    },
    mutations: {
        setFiles: function setFiles(state, files) {
            state.files = files;
        }
    }
};

/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
//import project_lists from './lists.vue';

var project_lists = function project_lists(resolve) {
    __webpack_require__.e/* require.ensure */(8).then((function () {
        resolve(__webpack_require__(62));
    }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
};

var all_projects = function all_projects(resolve) {
    __webpack_require__.e/* require.ensure */(7).then((function () {
        resolve(__webpack_require__(63));
    }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
};

var completed_projects = function completed_projects(resolve) {
    __webpack_require__.e/* require.ensure */(6).then((function () {
        resolve(__webpack_require__(64));
    }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
};

var active = {
    path: '/',
    components: {
        'project-lists': project_lists
    },
    name: 'project_lists',

    children: [{
        path: '/pages/:current_page_number',
        components: {
            'project-lists': project_lists
        },
        name: 'project_pagination'
    }]
};

var all = {
    path: '/all',
    components: {
        'all-projects': all_projects
    },
    name: 'all_projects',

    children: [{
        path: 'pages/:current_page_number',
        components: {
            'all-projects': all_projects
        },
        name: 'all_project_pagination'
    }]
};

var completed = {
    path: '/completed',
    components: {
        'completed-projects': completed_projects
    },
    name: 'completed_projects',

    children: [{
        path: 'pages/:current_page_number',
        components: {
            'completed-projects': completed_projects
        },
        name: 'completed_project_pagination'
    }]
};

exports.active = active;
exports.all = all;
exports.completed = completed;

/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = pm.Vue.mixin({
    methods: {
        showHideMilestoneForm: function showHideMilestoneForm(status, milestone) {
            var milestone = milestone || false,
                milestone = jQuery.isEmptyObject(milestone) ? false : milestone;

            if (milestone) {
                if (status === 'toggle') {
                    milestone.edit_mode = milestone.edit_mode ? false : true;
                } else {
                    milestone.edit_mode = status;
                }
            } else {
                this.$store.commit('showHideMilestoneForm', status);
            }
        },
        showHideCommentForm: function showHideCommentForm(status, comment) {
            if (status === 'toggle') {
                comment.edit_mode = comment.edit_mode ? false : true;
            } else {
                comment.edit_mode = status;
            }
        },

        /**
         * get single Milestones 
         *
         * @param {args} object [object with calback]
         */

        getMilestone: function getMilestone(args) {
            var self = this,
                pre_define = {
                conditions: {
                    with: 'discussion_boards,task_lists'
                },
                callback: false
            };

            var args = jQuery.extend(true, pre_define, args);
            var conditions = self.generateConditions(args.conditions);

            var request = {
                url: self.base_url + '/pm/v2/projects/' + self.project_id + '/milestones/' + self.$route.params.discussion_id + '?' + conditions,
                success: function success(res) {
                    self.addMeta(res.data);
                    self.$store.commit('setMilestone', res.data);

                    if (typeof args.callback === 'function') {
                        args.callback(res.data);
                    }
                }
            };
            self.httpRequest(request);
        },


        /**
         * Retrive milestones 
         * 
         * @param {Object} args Object with callback
         */
        getMilestones: function getMilestones(args) {
            var self = this,
                pre_define = {
                conditions: {
                    with: 'discussion_boards,task_lists',
                    per_page: 2,
                    page: 1
                },
                callback: false
            };

            var args = jQuery.extend(true, pre_define, args);
            var conditions = self.generateConditions(args.conditions);

            var request = {
                url: self.base_url + '/pm/v2/projects/' + self.project_id + '/milestones?' + conditions,
                success: function success(res) {
                    res.data.map(function (milestone, index) {
                        self.addMeta(milestone, index);
                    });
                    self.$store.commit('setMilestones', res.data);
                    self.$store.commit('setMilestonesMeta', res.meta.pagination);

                    if (typeof args.callback === 'function') {
                        args.callback(res.data);
                    }
                }
            };

            self.httpRequest(request);
        },
        getSelfMilestones: function getSelfMilestones() {
            var self = this,
                args = {
                conditions: {
                    with: 'discussion_boards,task_lists',
                    per_page: 2,
                    page: self.setCurrentPageNumber()
                },
                callback: function callback() {
                    pm.NProgress.done();
                    self.loading = false;
                    self.templateAction();
                }
            };

            self.getMilestones(args);
        },
        addMeta: function addMeta(milestone, index) {
            milestone.edit_mode = false;
        },
        setCurrentPageNumber: function setCurrentPageNumber() {
            var self = this;
            var current_page_number = self.$route.params.current_page_number ? self.$route.params.current_page_number : 1;
            self.current_page_number = current_page_number;
            return current_page_number;
        },


        /**
         * Add new milestone 
         *
         * @param {object} args upgoment with data
         * @return { void } [description]
         */
        addMilestone: function addMilestone(args) {
            var self = this,
                pre_define = {
                data: {
                    title: '',
                    description: '',
                    achieve_date: '',
                    order: 0,
                    status: 'incomplete'
                },
                callback: false
            };
            var args = jQuery.extend(true, pre_define, args);

            var request_data = {
                url: self.base_url + '/pm/v2/projects/' + self.project_id + '/milestones',
                type: 'POST',
                data: args.data,
                success: function success(res) {
                    self.addMeta(res.data);

                    self.$store.commit('newMilestone', res.data);
                    self.$root.$store.state.milestones_load = false;
                    // Display a success toast, with a title
                    pm.Toastr.success(res.data.success);

                    self.$root.$emit('after_comment');
                    self.templateAction();

                    if (typeof args.callback === 'function') {
                        args.callback.call(self, res);
                    }

                    if (self.section === 'milestones') {
                        self.afterNewMilestone();
                    }
                },
                error: function error(res) {
                    // Showing error
                    res.data.error.map(function (value, index) {
                        pm.Toastr.error(value);
                    });
                    if (typeof args.callback === 'function') {
                        args.callback.call(self, res);
                    }
                }
            };
            self.httpRequest(request_data);
        },


        /**
         * Update milesotne 
         * @param  {[Objecat]}   args [description]
         * @return {[type]}             [description]
         */
        updateMilestone: function updateMilestone(args) {
            var self = this,
                pre_define = {
                data: {
                    id: '',
                    title: '',
                    description: '',
                    achieve_date: '',
                    order: 0,
                    status: 'incomplete'
                },
                callback: false
            };
            var args = jQuery.extend(true, pre_define, args);

            var request_data = {
                url: self.base_url + '/pm/v2/projects/' + self.project_id + '/milestones/' + args.data.id,
                type: 'PUT',
                data: args.data,
                success: function success(res) {
                    self.addMeta(res.data);

                    // update milestone 
                    self.$store.commit('updateMilestone', res.data);
                    self.$root.$store.state.milestones_load = false;

                    // Display a success toast, with a title
                    pm.Toastr.success(res.data.success);
                    self.submit_disabled = false;
                    self.templateAction();

                    self.$root.$emit('after_comment');

                    if (typeof args.callback === 'function') {
                        args.callback.call(self, res);
                    }

                    if (self.section === 'milestones') {
                        self.afterNewMilestone();
                    }
                },
                error: function error(res) {
                    // Showing error
                    res.data.error.map(function (value, index) {
                        pm.Toastr.error(value);
                    });
                    if (typeof args.callback === 'function') {
                        args.callback.call(self, res);
                    }
                }
            };
            self.httpRequest(request_data);
        },
        deleteMilestone: function deleteMilestone(milestone, callback) {
            if (!confirm(this.text.milestone_delete_conf)) {
                return;
            }
            var self = this;
            var request_data = {
                url: self.base_url + '/pm/v2/projects/' + self.project_id + '/milestones/' + milestone.id,
                type: 'DELETE',
                success: function success(res) {
                    self.$store.commit('afterDeleteMilestone', milestone.id);
                    self.$root.$store.state.milestones_load = false;

                    if (typeof callback === 'function') {
                        callback.apply(res);
                    }
                }
            };

            self.httpRequest(request_data);
        },
        afterNewMilestone: function afterNewMilestone() {
            var self = this;

            if (self.$route.params.current_page_number > 1) {
                // named route
                self.$router.push({
                    name: 'milestones',
                    params: {
                        project_id: self.project_id
                    }
                });
            }
        },

        /**
         * Get task completed percentage from todo list
         * 
         * @param  array tasks
         *  
         * @return float       
         */
        getProgressPercent: function getProgressPercent(list) {

            if (typeof list == 'undefined') {
                return 0;
            }

            var total_tasks = parseInt(list.meta.total_incomplete_tasks) + parseInt(list.meta.total_complete_tasks),
                //tasks.length,
            completed_tasks = list.meta.total_complete_tasks,
                //this.countCompletedTasks( list ),
            progress = 100 * completed_tasks / total_tasks;

            return isNaN(progress) ? 0 : progress.toFixed(0);
        },

        /**
         * Get task completed progress width
         * 
         * @param  array tasks 
         * 
         * @return obj       
         */
        getProgressStyle: function getProgressStyle(list) {
            if (typeof list == 'undefined') {
                return 0;
            }
            var width = this.getProgressPercent(list);

            return { width: width + '%' };
        },
        humanDate: function humanDate(milestone) {
            var due_date = milestone.achieve_date.date ? milestone.achieve_date.date : milestone.created_at.date;
            due_date = new Date(due_date), due_date = pm.Moment(due_date).format();

            return pm.Moment(due_date).fromNow(true);
        },
        momentFormat: function momentFormat(milestone) {
            var due_date = milestone.achieve_date.date ? milestone.achieve_date.date : milestone.created_at.date;
            due_date = new Date(due_date), due_date = pm.Moment(due_date).format();

            return due_date;
        },
        getDueDate: function getDueDate(milestone) {
            var due_date = milestone.achieve_date.date ? milestone.achieve_date.date : milestone.created_at.date;
            var due_date = this.dateFormat(due_date);

            return due_date;
        },
        templateAction: function templateAction() {
            var blank, miltemp;

            var milestones = this.$store.state.milestones;

            if (milestones.length) {
                blank = false;miltemp = true;
            }

            if (!milestones.length) {
                blank = true;miltemp = false;
            }

            this.$store.commit('balankTemplateStatus', blank);
            this.$store.commit('milestoneTemplateStatus', miltemp);
        }
    }
});

/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
//import project_lists from './index.vue';

var milestones_route = function milestones_route(resolve) {
    __webpack_require__.e/* require.ensure */(5).then((function () {
        resolve(__webpack_require__(65));
    }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
};

var milestones = {
    path: '/:project_id/milestones/',
    components: {
        'milestones': milestones_route
    },
    name: 'milestones',

    children: [{
        path: 'pages/:current_page_number',
        components: {
            'milestones': milestones_route
        },
        name: 'milestone_pagination'
    }]
};

exports.milestones = milestones;

/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

/**
 * Make sure to call  first if using a vuex module system
 */
exports.default = new pm.Vuex.Store({

    state: {
        is_milestone_form_active: false,
        milestones: [],
        milestone: {},
        blank_template: false,
        milestone_template: false,
        milestone_meta: {},
        getIndex: function getIndex(itemList, id, slug) {
            var index = false;

            itemList.forEach(function (item, key) {
                if (item[slug] == id) {
                    index = key;
                }
            });

            return index;
        }
    },

    mutations: {
        showHideMilestoneForm: function showHideMilestoneForm(state, status) {
            if (status === 'toggle') {
                state.is_milestone_form_active = state.is_milestone_form_active ? false : true;
            } else {
                state.is_milestone_form_active = status;
            }
        },
        setMilestones: function setMilestones(state, milestones) {
            state.milestones = milestones;
        },
        setMilestonesMeta: function setMilestonesMeta(state, data) {
            state.milestone_meta = data;
        },
        setMilestone: function setMilestone(state, milestone) {
            state.milestones = [];
            state.milestones.push(milestone);
        },
        afterDeleteMilestone: function afterDeleteMilestone(state, milestone_id) {
            var milestone_index = state.getIndex(state.milestones, milestone_id, 'id');
            state.milestones.splice(milestone_index, 1);
        },
        updateMilestone: function updateMilestone(state, data) {
            var milestone_index = state.getIndex(state.milestones, data.id, 'id');
            jQuery.extend(true, state.milestones[milestone_index], data);
            //state.milestones.splice(milestone_index, 1,);
        },
        newMilestone: function newMilestone(state, milestone) {
            var per_page = state.milestone_meta.per_page,
                length = state.milestones.length;

            if (typeof milestone.discussion_boards === 'undefined') {
                milestone.discussion_boards = { data: [] };
            }

            if (typeof milestone.task_lists === 'undefined') {
                milestone.task_lists = { data: [] };
            }

            if (per_page <= length) {
                state.milestones.splice(0, 0, milestone);
                state.milestones.pop();
            } else {
                state.milestones.splice(0, 0, milestone);
            }
        },
        balankTemplateStatus: function balankTemplateStatus(state, status) {
            state.blank_template = status;
        },
        milestoneTemplateStatus: function milestoneTemplateStatus(state, status) {
            state.milestone_template = status;
        },
        updateMetaAfterNewDiscussion: function updateMetaAfterNewDiscussion(state) {
            state.meta.total = state.meta.total + 1;
            state.meta.total_pages = Math.ceil(state.meta.total / state.meta.per_page);
        }
    }
});

/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Required jQuery methods 
 * 
 * @type Object
 */
var PM_Overview = {
    chart: function chart(el, binding, vnode) {
        var activity = vnode.context.text.activity,
            Task = vnode.context.text.task;
        var data = {
            labels: PM_Overview.getLabels(vnode.context), //["Oct 05", "Oct 09", "Oct 15"],
            datasets: [{
                label: activity,
                fillColor: "rgba(120,200, 223, 0.4)",
                strokeColor: "#79C7DF",
                pointColor: "#79C7DF",
                pointStrokeColor: "#79C7DF",
                pointHighlightFill: "#79C7DF",
                pointHighlightStroke: "#79C7DF",
                data: PM_Overview.getActivities(vnode.context),
                backgroundColor: "rgba(120,200, 223, 0.4)"
            }, {
                label: Task,
                fillColor: "rgba(185, 114, 182,0.5)",
                strokeColor: "#B972B6",
                pointColor: "#B972B6",
                pointStrokeColor: "#B972B6",
                pointHighlightFill: "#B972B6",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: PM_Overview.getTasks(vnode.context),
                backgroundColor: "rgba(185, 114, 182,0.5)"
            }]
        };

        Chart.defaults.global.responsive = true;
        var ctx = el.getContext("2d");
        // This will get the first returned node in the jQuery collection.
        var pmChart = new pm.Chart(ctx, {
            type: 'line',
            data: data,
            pointDotRadius: 8,
            animationSteps: 60,
            tooltipTemplate: "<%= labels + sss %>%",
            animationEasing: "easeOutQuart"
        });
    },

    getLabels: function getLabels(self) {
        var labels = [],
            graph_data = self.$store.state.graph;

        graph_data.map(function (graph) {
            var date = PM_Overview.labelDateFormat(graph.date_time.date);
            labels.push(date);
        });

        return labels;
    },

    labelDateFormat: function labelDateFormat(date) {
        date = new Date(date);
        return pm.Moment(date).format('MMM DD');
    },

    getActivities: function getActivities(self) {
        var activities = self.$store.state.graph;
        var set_activities = [];

        activities.map(function (activity) {
            set_activities.push(activity.activities);
        });

        return set_activities;
    },

    getTasks: function getTasks(self) {
        var tasks = self.$store.state.graph;
        var set_tasks = [];

        tasks.map(function (task) {
            set_tasks.push(task.tasks);
        });

        return set_tasks;
    }

    // Register a global custom directive called v-pm-sortable
};pm.Vue.directive('pm-overview-chart', {
    update: function update(el, binding, vnode) {
        PM_Overview.chart(el, binding, vnode);
    }
});

/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = pm.Vue.mixin({
    methods: {
        getOverViews: function getOverViews(condition) {
            var condition = condition || '';
            var self = this;

            var request = {
                url: self.base_url + '/pm/v2/projects/' + self.project_id + '?' + condition,
                success: function success(res) {
                    // res.data.map(function(discuss, index) {
                    //  self.addDiscussMeta(discuss);
                    // });
                    self.$store.commit('setOverViews', res.data);
                    pm.NProgress.done();
                    self.loading = false;
                }
            };
            self.httpRequest(request);
        }
    }
});

/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
//import project_lists from './index.vue';

var overview = function overview(resolve) {
    __webpack_require__.e/* require.ensure */(14).then((function () {
        resolve(__webpack_require__(66));
    }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
};

exports.default = {
    path: '/:project_id/overview',
    components: {
        'pm-overview': overview
    },
    name: 'pm_overview'
};

/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

/**
 * Make sure to call pm.Vue.use(Vuex) first if using a vuex module system
 */
exports.default = new pm.Vuex.Store({

    state: {
        meta: {},
        assignees: [],
        graph: [],
        getIndex: function getIndex(itemList, id, slug) {
            var index = false;

            itemList.forEach(function (item, key) {
                if (item[slug] == id) {
                    index = key;
                }
            });

            return index;
        }
    },

    mutations: {
        setOverViews: function setOverViews(state, over_views) {
            state.meta = over_views.meta;
            state.assignees = over_views.assignees.data;
            state.graph = over_views.overview_graph.data;
        }
    }
});

/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Required jQuery methods 
 * 
 * @type Object
 */
var PM_Task = {
    init: function init() {
        this.datepicker();
        this.sortable();
    },

    sortable: function sortable(el, binding, vnode) {
        var $ = jQuery;
        var component = vnode.context;

        $(el).sortable({
            cancel: '.nonsortable,form',
            placeholder: "ui-state-highlight",
            update: function update(event, ui) {
                var newOrder = {},
                    orders = [],
                    ids = [],
                    send_data = [];

                // finding new order sequence and old orders
                $(this).find('li.pm-todo').each(function (e) {
                    var order = $(this).data('order'),
                        task_id = $(this).data('id');

                    orders.push(order);
                    ids.push(task_id);

                    var task_index = component.getIndex(component.list.incomplete_tasks.data, task_id, 'id');
                    if (task_index === false) {
                        var task_index = component.getIndex(component.list.complete_tasks.data, task_id, 'id');
                    }

                    if (typeof component.list.incomplete_tasks !== 'undefined') {
                        component.list.incomplete_tasks.data[task_index].order = order;
                    }

                    if (typeof component.list.complete_tasks !== 'undefined') {
                        component.list.complete_tasks.data[task_index].order = order;
                    }
                });

                var after_revers_order = orders.sort(),
                    after_revers_order = after_revers_order.reverse();

                after_revers_order.forEach(function (order, key) {
                    send_data.push({
                        id: ids[key],
                        order: order
                    });
                });

                var data = {
                    task_orders: send_data,
                    board_id: component.list.id,
                    board_type: 'task_list'
                };

                component.taskOrder(data);
            }
        });
    },

    datepicker: function datepicker(el, binding, vnode) {
        var $ = jQuery;
        $('.pm-date-field').datepicker({
            dateFormat: 'yy-mm-dd',
            changeMonth: true,
            changeYear: true,
            yearRange: '-50:+5',
            onSelect: function onSelect(dateText) {
                vnode.context.$root.$emit('pm_date_picker', { field: 'datepicker', date: dateText });
            }
        });

        $(".pm-date-picker-from").datepicker({
            dateFormat: 'yy-mm-dd',
            changeYear: true,
            changeMonth: true,
            numberOfMonths: 1,
            onClose: function onClose(selectedDate) {
                $(".pm-date-picker-to").datepicker("option", "minDate", selectedDate);
            },
            onSelect: function onSelect(dateText) {
                vnode.context.$root.$emit('pm_date_picker', { field: 'datepicker_from', date: dateText, self: this });
            }
        });

        $(".pm-date-picker-to").datepicker({
            dateFormat: 'yy-mm-dd',
            changeMonth: true,
            changeYear: true,
            numberOfMonths: 1,
            onClose: function onClose(selectedDate) {
                $(".pm-date-picker-from").datepicker("option", "maxDate", selectedDate);
            },
            onSelect: function onSelect(dateText) {
                vnode.context.$root.$emit('pm_date_picker', { field: 'datepicker_to', date: dateText });
            }
        });

        $(".pm-date-time-picker-from").datepicker({
            dateFormat: 'yy-mm-dd',
            changeYear: true,
            changeMonth: true,
            numberOfMonths: 1,
            onClose: function onClose(selectedDate) {
                $(".pm-date-time-picker-to").datepicker("option", "minDate", selectedDate);
            },
            onSelect: function onSelect(dateText) {}
        });

        $(".pm-date-time-picker-to").datepicker({
            dateFormat: 'yy-mm-dd',
            changeMonth: true,
            changeYear: true,
            numberOfMonths: 1,
            onClose: function onClose(selectedDate) {
                $(".pm-date-time-picker-from").datepicker("option", "maxDate", selectedDate);
            },
            onSelect: function onSelect(dateText) {}
        });
    },

    disableLineBreak: function disableLineBreak(element) {
        jQuery(element).on('keypress', function (e) {
            if (e.keyCode == 13 && !e.shiftKey) {
                e.preventDefault();
            }
        });
    }

    //Register a global custom directive called v-pm-datepicker
};pm.Vue.directive('pm-datepicker', {
    inserted: function inserted(el, binding, vnode) {
        PM_Task.datepicker(el, binding, vnode);
    }
});

// Register a global custom directive called v-pm-sortable
pm.Vue.directive('pm-sortable', {
    inserted: function inserted(el, binding, vnode) {
        PM_Task.sortable(el, binding, vnode);
    }
});

// Register a global custom directive called v-pm-sortable
pm.Vue.directive('pm-tiptip', {

    update: function update() {
        jQuery('.pm-tiptip').tipTip();
    }
});

// Register a global custom directive called v-pm-sortable
pm.Vue.directive('prevent-line-break', {

    inserted: function inserted(element) {
        PM_Task.disableLineBreak(element);
    }
});

/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _keys = __webpack_require__(124);

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Task list mixin
 * All available function about task
 */

var PM_TaskList_Mixin = {
    data: function data() {
        return {};
    },


    computed: {

        /**
         * Is current user can create task
         * 
         * @return object
         */
        canUserCreateTask: function canUserCreateTask() {
            return this.$store.state.permissions.create_todo;
        },

        task_start_field: function task_start_field() {
            return this.$store.state.permissions.task_start_field;
        },

        /**
         * Check is todo-list single or not
         * 
         * @return Boolean
         */
        is_single_list: function is_single_list() {
            return this.$store.state.is_single_list;
        },

        /**
         * Check is task single or not
         * 
         * @return Boolean
         */
        is_single_task: function is_single_task() {
            return this.$store.state.is_single_task;
        }
    },

    methods: {

        /**
         * Retrive All task list
         * @param  {[object]}   args SSR url condition
         * @param  {Function} callback  [description]
         * @return {[void]}             [description]
         */
        getLists: function getLists(args) {
            var self = this,
                pre_define = {
                condition: {
                    with: 'incomplete_tasks',
                    per_page: this.getSettings('list_per_page', 10),
                    page: this.setCurrentPageNumber()
                },
                callback: false
            };

            var args = jQuery.extend(true, pre_define, args);
            var condition = this.generateConditions(args.condition);
            var request = {
                url: self.base_url + '/pm/v2/projects/' + self.project_id + '/task-lists?' + condition,
                success: function success(res) {
                    res.data.map(function (list, index) {
                        self.addMetaList(list);

                        if (typeof list.incomplete_tasks !== 'undefined') {
                            list.incomplete_tasks.data.map(function (task) {
                                self.addTaskMeta(task);
                            });
                        }

                        if (typeof list.complete_tasks !== 'undefined') {
                            list.complete_tasks.data.map(function (task) {
                                self.addTaskMeta(task);
                            });
                        }
                    });

                    self.$store.commit('setLists', res.data);
                    self.$store.commit('setListsMeta', res.meta.pagination);

                    self.listTemplateAction();

                    if (typeof args.callback === 'function') {
                        args.callback.call(self, res.data);
                    }
                }
            };
            self.httpRequest(request);
        },


        /**
         * Retrive a single list 
         * @param  {object}   args     condition and list id
         * @param  {Function} callback [description]
         * @return {void}            [description]
         */
        getList: function getList(args) {
            var self = this,
                pre_define = {
                condition: {
                    with: 'incomplete_tasks'
                },
                list_id: false,
                callback: false
            };

            var args = jQuery.extend(true, pre_define, args);
            var condition = self.generateConditions(args.condition);

            var request = {
                type: 'GET',
                url: self.base_url + '/pm/v2/projects/' + self.project_id + '/task-lists/' + args.list_id + '?' + condition,
                success: function success(res) {
                    self.addMetaList(res.data);

                    if (typeof res.data.comments !== 'undefined') {
                        res.data.comments.data.map(function (comment) {
                            self.addListCommentMeta(comment);
                        });
                    }

                    if (typeof res.data.incomplete_tasks !== 'undefined') {
                        res.data.incomplete_tasks.data.map(function (task) {
                            self.addTaskMeta(task);
                        });
                    }

                    if (typeof res.data.complete_tasks !== 'undefined') {
                        res.data.complete_tasks.data.map(function (task) {
                            self.addTaskMeta(task);
                        });
                    }
                    if (typeof args.callback === 'function') {
                        args.callback.call(self, res);
                    }
                    pm.NProgress.done();
                }
            };

            if (args.list_id) {
                self.httpRequest(request);
            }
        },


        /**
         * Insert  todo list
         * 
         * @return void
         */
        addList: function addList(args) {
            var self = this,
                pre_define = {
                data: {
                    title: '',
                    description: '',
                    milestone: '',
                    order: 0
                },
                callback: false
            },
                args = jQuery.extend(true, pre_define, args);

            var request_data = {
                url: self.base_url + '/pm/v2/projects/' + self.project_id + '/task-lists',
                data: args.data,
                type: 'POST',
                success: function success(res) {
                    self.addMetaList(res.data);
                    res.data.incomplete_tasks = { data: [] };
                    self.$store.commit('afterNewList', res.data);
                    self.$store.commit('afterNewListupdateListsMeta');
                    self.showHideListForm(false);
                    pm.Toastr.success(res.data.success);

                    if (typeof args.callback === 'function') {
                        args.callback.call(self, res);
                    }
                },
                error: function error(res) {
                    // Showing error
                    res.data.error.map(function (value, index) {
                        pm.Toastr.error(value);
                    });

                    if (typeof args.callback === 'function') {
                        args.callback.call(self, res);
                    }
                }
            };

            self.httpRequest(request_data);
        },

        /**
         * Update  todo list
         * 
         * @return void
         */
        updateList: function updateList(args) {
            var self = this,
                pre_define = {
                data: {
                    id: '',
                    title: '',
                    description: '',
                    milestone: '',
                    order: 0
                },
                callback: false
            };
            var args = jQuery.extend(true, pre_define, args);

            var request_data = {
                url: self.base_url + '/pm/v2/projects/' + self.project_id + '/task-lists/' + self.list.id,
                data: args.data,
                type: 'PUT',
                success: function success(res) {
                    self.addMetaList(res.data);
                    pm.Toastr.success(res.data.success);
                    self.$store.commit('afterUpdateList', res.data);
                    self.showHideListForm(false, self.list);

                    if (typeof args.callback === 'function') {
                        args.callback.call(self, res);
                    }
                },
                error: function error(res) {
                    // Showing error
                    res.data.error.map(function (value, index) {
                        pm.Toastr.error(value);
                    });

                    if (typeof args.callback === 'function') {
                        args.callback.call(self, res);
                    }
                }
            };

            self.httpRequest(request_data);
        },

        /**
         * [modifyList description]
         * @param  {[type]} list [description]
         * @return {[type]}      [description]
         */
        modifyList: function modifyList(list) {

            var args = {
                data: list
            };

            this.updateList(args);
        },


        /**
         * Delete list
         * 
         * @param  int list_id 
         * 
         * @return void         
         */
        deleteList: function deleteList(args) {
            if (!confirm(this.text.are_you_sure)) {
                return;
            }
            var self = this,
                pre_define = {
                list_id: false,
                callback: false
            },
                args = jQuery.extend(true, pre_define, args);

            var request_data = {
                url: self.base_url + '/pm/v2/projects/' + self.project_id + '/task-lists/' + args.list_id,
                type: 'DELETE',
                success: function success(res) {
                    self.$store.commit('afterDeleteList', args.list_id);
                    // pm.Toastr.success(res.data.success);
                    self.listTemplateAction();
                    if (typeof args.callback === 'function') {
                        args.callback.call(self, res);
                    }
                }
            };
            if (args.list_id) {
                self.httpRequest(request_data);
            }
        },


        /**
         * Insert  task
         * 
         * @return void
         */
        addTask: function addTask(args) {
            var self = this,
                pre_define = {
                data: {
                    board_id: '',
                    assignees: '',
                    title: '',
                    description: '',
                    start_at: '',
                    due_date: '',
                    task_privacy: '',
                    list_id: '',
                    order: ''
                },
                callback: false
            },
                args = jQuery.extend(true, pre_define, args);

            var request_data = {
                url: self.base_url + '/pm/v2/projects/' + self.project_id + '/tasks',
                type: 'POST',
                data: args.data,
                success: function success(res) {
                    self.addTaskMeta(res.data);
                    self.$store.commit('afterNewTask', {
                        list_id: args.data.list_id,
                        task: res.data
                    });

                    // Display a success toast, with a title
                    pm.Toastr.success(res.data.success);
                    self.showHideTaskFrom(false, self.list, self.task);
                    if (typeof args.callback === 'function') {
                        args.callback.call(self, res);
                    }
                },
                error: function error(res) {
                    // Showing error
                    res.data.error.map(function (value, index) {
                        pm.Toastr.error(value);
                    });

                    if (typeof args.callback === 'function') {
                        args.callback.call(self, res);
                    }
                }
            };

            self.httpRequest(request_data);
        },


        /**
         * Update Task using Task object 
         * @param  {Object} task Task Object
         * @return {void}      Update a task
         */
        updateTask: function updateTask(args) {
            var self = this,
                pre_define = {
                data: {
                    task_id: '',
                    board_id: '',
                    assignees: '',
                    title: '',
                    description: '',
                    start_at: '',
                    due_date: '',
                    task_privacy: '',
                    list_id: '',
                    order: ''
                },
                callback: false
            };
            var args = jQuery.extend(true, pre_define, args);

            var request_data = {
                url: self.base_url + '/pm/v2/projects/' + self.project_id + '/tasks/' + args.data.task_id,
                type: 'PUT',
                data: args.data,
                success: function success(res) {
                    self.addTaskMeta(res.data);

                    self.$store.commit('afterUpdateTask', {
                        list_id: args.data.list_id,
                        task: res.data
                    });

                    // Display a success toast, with a title
                    pm.Toastr.success(res.data.success);
                    self.showHideTaskFrom(false, self.list, self.task);
                    if (typeof args.callback === 'function') {
                        args.callback.call(self, res);
                    }
                },
                error: function error(res) {
                    // Showing error
                    res.data.error.map(function (value, index) {
                        pm.Toastr.error(value);
                    });

                    if (typeof args.callback === 'function') {
                        args.callback.call(self, res);
                    }
                }
            };

            self.httpRequest(request_data);
        },


        /**
         * Update Task using Task object 
         * @param  {Object} task Task Object
         * @return {void}      Update a task
         */
        modifyTask: function modifyTask(task) {
            if (typeof task.id === 'undefined') {
                return;
            }
            var args = {
                data: task
            };

            this.updateTask(args);
        },
        deleteTask: function deleteTask(args) {
            if (!confirm(this.text.are_you_sure)) {
                return;
            }

            var self = this,
                pre_define = {
                task: '',
                list: '',
                callback: false
            };
            var args = jQuery.extend(true, pre_define, args);

            var request_data = {
                url: self.base_url + '/pm/v2/projects/' + self.project_id + '/tasks/' + args.task.id,
                type: 'DELETE',
                success: function success(res) {
                    self.$store.commit('afterDeleteTask', {
                        'task': args.task,
                        'list': args.list
                    });

                    if (typeof args.callback === 'function') {
                        args.callback.call(self, res);
                    }
                }
            };
            this.httpRequest(request_data);
        },
        addComment: function addComment(args) {
            var self = this,
                pre_define = {
                data: {
                    commentable_id: '',
                    content: '',
                    commentable_type: '',
                    deleted_files: [],
                    files: [],
                    notify_users: []
                },
                callback: false
            };
            var args = jQuery.extend(true, pre_define, args);
            var data = new FormData();

            data.append('content', args.data.content);
            data.append('commentable_id', args.data.commentable_id);
            data.append('commentable_type', args.data.commentable_type);
            data.append('notify_users', args.data.notify_users);

            args.data.deleted_files.map(function (del_file) {
                data.append('files_to_delete[]', del_file);
            });

            args.data.files.map(function (file) {
                if (typeof file.attachment_id === 'undefined') {
                    var decode = self.dataURLtoFile(file.thumb, file.name);
                    data.append('files[]', decode);
                }
            });

            var request_data = {
                url: self.base_url + '/pm/v2/projects/' + self.project_id + '/comments',
                type: "POST",
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                success: function success(res) {
                    self.addListCommentMeta(res.data);
                    self.$root.$emit('after_comment');
                    if (typeof args.callback === 'function') {
                        args.callback.call(self, res);
                    }
                },
                error: function error(res) {
                    if (typeof args.callback === 'function') {
                        args.callback.call(self, res);
                    }
                }
            };

            self.httpRequest(request_data);
        },
        updateComment: function updateComment(args) {
            var self = this,
                pre_define = {
                data: {
                    id: '',
                    commentable_id: '',
                    content: '',
                    commentable_type: '',
                    deleted_files: [],
                    files: [],
                    notify_users: []
                },
                callback: false
            };
            var args = jQuery.extend(true, pre_define, args);
            var data = new FormData();

            data.append('content', args.data.content);
            data.append('commentable_id', args.data.commentable_id);
            data.append('commentable_type', args.data.commentable_type);
            data.append('notify_users', args.data.notify_users);

            args.data.deleted_files.map(function (del_file) {
                data.append('files_to_delete[]', del_file);
            });

            args.data.files.map(function (file) {
                if (typeof file.attachment_id === 'undefined') {
                    var decode = self.dataURLtoFile(file.thumb, file.name);
                    data.append('files[]', decode);
                }
            });

            var request_data = {
                url: self.base_url + '/pm/v2/projects/' + self.project_id + '/comments/' + args.id,
                type: "POST",
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                success: function success(res) {
                    self.addListCommentMeta(res.data);
                    self.$root.$emit('after_comment');
                    if (typeof args.callback === 'function') {
                        args.callback.call(self, res);
                    }
                },
                error: function error(res) {
                    if (typeof args.callback === 'function') {
                        args.callback.call(self, res);
                    }
                }
            };

            self.httpRequest(request_data);
        },


        /**
         * Show and Hide list form for new and update
         * @param  {[String/boolean]} status [description]
         * @param  {[Object]} list   [Tasl List object for edit]
         * @return {[type]}        [description]
         */
        showHideListForm: function showHideListForm(status, list) {
            var list = list || false,
                list = jQuery.isEmptyObject(list) ? false : list;

            if (list) {
                if (status === 'toggle') {
                    list.edit_mode = list.edit_mode ? false : true;
                } else {
                    list.edit_mode = status;
                }
            } else {
                this.$store.commit('showHideListFormStatus', status);
            }
        },


        /**
         * Show task edit form
         * 
         * @param  int task_index 
         * 
         * @return void            
         */
        showHideTaskFrom: function showHideTaskFrom(status, list, task) {
            var list = list || false;
            var task = task || false;

            if (task) {
                if (status === 'toggle') {
                    task.edit_mode = task.edit_mode ? false : true;
                } else {
                    task.edit_mode = status;
                }
            }

            if (list) {
                if (status === 'toggle') {
                    list.show_task_form = list.show_task_form ? false : true;
                } else {
                    list.show_task_form = status;
                }
            }
        },


        /**
         * List pagination set current page Number
         */
        setCurrentPageNumber: function setCurrentPageNumber() {
            var current_page_number = this.$route.params.current_page_number ? this.$route.params.current_page_number : 1;
            this.current_page_number = current_page_number;

            return current_page_number;
        },


        /**
         * Adding task list meta for edit mode
         * @param {[Object]} list [Task list Object]
         */
        addMetaList: function addMetaList(list) {
            list.edit_mode = false;
            list.show_task_form = false;
            list.task_loading_status = false;
        },


        /**
         * addTaskMeta for task edit mode
         * @param {[Object]} task [Task Object]
         */
        addTaskMeta: function addTaskMeta(task) {
            task.edit_mode = false;
        },


        /**
         * comment meta for edit mode
         * @param {Object} comment Task comment
         */
        addListCommentMeta: function addListCommentMeta(comment) {
            comment.edit_mode = false;
        },


        /**
         * Show and hide comment form
         * @param  {Object} comment Comment Object
         * @return {void}         
         */
        showHideListCommentEditForm: function showHideListCommentEditForm(comment) {
            comment.edit_mode = comment.edit_mode ? false : true;
        },


        /**
         * private task class for lock
         * @param  {Object} list task list
         * @return {String}      pm-lock
         */
        privateClass: function privateClass(list) {
            return list.private == 'on' ? 'pm-lock' : '';
        },


        /**
         * Incomplete task load more Button
         * @param  {[Object]}  list [Task List object]
         * @return {Boolean}      [description]
         */
        isIncompleteLoadMoreActive: function isIncompleteLoadMoreActive(list) {
            if (typeof list.incomplete_tasks === 'undefined') {
                return false;
            }

            var count_tasks = list.meta.total_incomplete_tasks;
            var total_set_task = list.incomplete_tasks.data.length;
            if (total_set_task === count_tasks) {
                return false;
            }
            return true;
        },


        /**
         * Load More Incomplete task
         * @param  {[Object]} list Task List
         * @return {[viod]}      [More Task]
         */
        loadMoreIncompleteTasks: function loadMoreIncompleteTasks(list) {
            if (list.task_loading_status) {
                return;
            }
            var self = this;
            list.task_loading_status = true;

            var total_tasks = list.meta.total_incomplete_tasks;
            var per_page = this.getSettings('incomplete_tasks_per_page', 10);
            var current_page = Math.ceil(list.incomplete_tasks.data.length / per_page);

            var args = {
                condition: {
                    with: 'incomplete_tasks',
                    incomplete_task_page: current_page + 1
                },
                list_id: list.id,
                callback: function callback(res) {
                    self.$store.commit('setTasks', res.data);
                    list.task_loading_status = false;
                }
            };

            this.getList(args);
        },


        /**
         * Complete task load more Button
         * @param  {[Object]}  list [Task List object]
         * @return {Boolean}      [description]
         */
        isCompleteLoadMoreActive: function isCompleteLoadMoreActive(list) {
            if (typeof list.complete_tasks === 'undefined') {
                return false;
            }
            var count_tasks = list.meta.total_complete_tasks;
            var total_set_task = list.complete_tasks.data.length;
            if (total_set_task === count_tasks) {
                return false;
            }
            return true;
        },


        /**
         * Load More Incomplete task
         * @param  {[Object]} list Task List
         * @return {[viod]}      [More Task]
         */
        loadMoreCompleteTasks: function loadMoreCompleteTasks(list) {

            if (list.task_loading_status) {
                return;
            }

            list.task_loading_status = true;

            var total_tasks = list.meta.total_complete_tasks;
            var per_page = this.getSettings('complete_tasks_per_page', 10);
            var current_page = Math.ceil(list.complete_tasks.data.length / per_page);

            var args = {
                condition: {
                    with: 'complete_tasks',
                    complete_task_page: current_page + 1
                },
                list_id: list.id,
                callback: function callback(res) {
                    this.$store.commit('setTasks', res.data);
                    list.task_loading_status = false;
                }
            };

            this.getList(args);
        },


        /**
        * WP settings date format convert to pm.Moment date format with time zone
        * 
        * @param  string date 
        * 
        * @return string      
        */
        dateFormat: function dateFormat(date) {
            if (!date) {
                return;
            }

            date = new Date(date);
            date = pm.Moment(date).format('YYYY-MM-DD');

            var format = 'MMMM DD YYYY';

            if (PM_Vars.wp_date_format == 'Y-m-d') {
                format = 'YYYY-MM-DD';
            } else if (PM_Vars.wp_date_format == 'm/d/Y') {
                format = 'MM/DD/YYYY';
            } else if (PM_Vars.wp_date_format == 'd/m/Y') {
                format = 'DD/MM/YYYY';
            }

            return pm.Moment(date).format(format);
        },


        /**
         * WP settings date format convert to pm.Moment date format with time zone
         * 
         * @param  string date 
         * 
         * @return string      
         */
        shortDateFormat: function shortDateFormat(date) {
            if (date == '') {
                return;
            }
            var format = 'MMM DD';

            return pm.Moment(date).format(String(format));
        },


        /**
         * WP settings date time format convert to pm.Moment date format with time zone
         * 
         * @param  string date 
         * 
         * @return string      
         */
        dateTimeFormat: function dateTimeFormat(date) {
            if (date == '') {
                return;
            }

            var date_format = 'MMMM DD YYYY',
                time_format = 'h:mm:ss a';

            if (PM_Vars.wp_date_format == 'Y-m-d') {
                date_format = 'YYYY-MM-DD';
            } else if (PM_Vars.wp_date_format == 'm/d/Y') {
                date_format = 'MM/DD/YYYY';
            } else if (PM_Vars.wp_date_format == 'd/m/Y') {
                date_format = 'DD/MM/YYYY';
            }

            if (PM_Vars.wp_time_format == 'g:i a') {
                time_format = 'h:m a';
            } else if (PM_Vars.wp_time_format == 'g:i A') {
                time_format = 'h:m A';
            } else if (PM_Vars.wp_time_format == 'H:i') {
                time_format = 'HH:m';
            }

            var format = String(date_format + ', ' + time_format);

            return pm.Moment(date).format(format);
        },


        /**
         * Get index from array object element
         * 
         * @param   array 
         * @param   id    
         * 
         * @return  int      
         */
        getIndex: function getIndex(array, id, slug) {
            var target = false;

            array.map(function (content, index) {
                if (content[slug] == id) {
                    target = index;
                }
            });
            return target;
        },


        /**
         * ISO_8601 Date format convert to pm.Moment date format
         * 
         * @param  string date 
         * 
         * @return string      
         */
        dateISO8601Format: function dateISO8601Format(date) {
            return pm.Moment(date).format();
        },


        /**
         * Task Order for sortable 
         * @param  {[Object]}   data     Data order
         * @param  {Function} callback 
         * @return {Void}            
         */
        taskOrder: function taskOrder(data, callback) {
            var self = this;
            var request_data = {
                url: self.base_url + '/pm/v2/projects/1/tasks/reorder',
                type: 'PUT',
                data: data,
                success: function success(res) {
                    if (typeof callback !== 'undefined') {
                        callback.call(self, res);
                    }
                },
                error: function error(res) {
                    // Showing error
                    res.data.error.map(function (value, index) {
                        pm.Toastr.error(value);
                    });
                }
            };

            self.httpRequest(request_data);
        },


        /**
         * Show hide todo-list edit form
         * 
         * @param  int comment_id 
         * 
         * @return void            
         */
        showHideTaskCommentEditForm: function showHideTaskCommentEditForm(task, comment_id) {
            var list_index = this.getIndex(this.$store.state.lists, task.post_parent, 'ID'),
                task_index = this.getIndex(this.$store.state.lists[list_index].tasks, task.ID, 'ID'),
                comment_index = this.getIndex(this.task.comments, comment_id, 'comment_ID'),
                self = this;

            var edit_mode = this.task.comments[comment_index].edit_mode;

            if (edit_mode) {
                PM_Component_jQuery.slide(comment_id, function () {
                    //self.$store.commit( 'showHideTaskCommentEditForm', { list_index: list_index, task_index: task_index, comment_index: comment_index } );
                    self.task.comments[comment_index].edit_mode = false;
                });
            } else {
                //self.$store.commit( 'showHideTaskCommentEditForm', { list_index: list_index, task_index: task_index, comment_index: comment_index } );    
                self.task.comments[comment_index].edit_mode = true;

                pm.Vue.nextTick(function () {
                    PM_Component_jQuery.slide(comment_id);
                });
            }
        },


        /**
         * Get current project users by role
         * 
         * @param  string role 
         * 
         * @return array     
         */
        get_porject_users_by_role: function get_porject_users_by_role(role) {
            return this.$store.state.project_users.filter(function (user) {
                return user.role == role ? true : false;
            });
        },


        /**
         * Get current project users by role
         * 
         * @param  string role 
         * 
         * @return array     
         */
        get_porject_users_id_by_role: function get_porject_users_id_by_role(role) {
            var ids = [];

            this.$store.state.project_users.map(function (user) {
                if (user.role == role) {
                    ids.push(user.id);
                }

                if (typeof role == 'undefined') {
                    ids.push(user.id);
                }
            });
            return ids;
        },


        /**
         * Get user information from task assigned user id
         *  
         * @param  array assigned_user 
         * 
         * @return obje               
         */
        getUsers: function getUsers(assigned_user) {
            if (!assigned_user) {
                return [];
            }
            var filtered_users = [];

            var assigned_to = assigned_user.map(function (id) {
                return parseInt(id);
            });

            filtered_users = this.$store.state.project_users.filter(function (user) {
                return assigned_to.indexOf(parseInt(user.id)) >= 0;
            });

            return filtered_users;
        },


        /**
         * CSS class for task date
         * 
         * @param  string start_date 
         * @param  string due_date   
         * 
         * @return string            
         */
        taskDateWrap: function taskDateWrap(due_date) {
            if (!due_date) {
                return false;
            }

            due_date = new Date(due_date);
            due_date = pm.Moment(due_date).format('YYYY-MM-DD');

            if (!pm.Moment(due_date).isValid()) {
                return false;
            }

            var today = pm.Moment().format('YYYY-MM-DD'),
                due_day = pm.Moment(due_date).format('YYYY-MM-DD');
            return pm.Moment(today).isSameOrBefore(due_day) ? 'pm-current-date' : 'pm-due-date';
        },


        /**
         * class for completed task wrap div
         * @param  {date} due_date complete date
         * @return {String}          wrapper Class
         */
        completedTaskWrap: function completedTaskWrap(due_date) {
            if (!due_date) {
                return false;
            }

            due_date = new Date(due_date);
            due_date = pm.Moment(due_date).format('YYYY-MM-DD');

            if (!pm.Moment(due_date).isValid()) {
                return false;
            }

            var today = pm.Moment().format('YYYY-MM-DD'),
                due_day = pm.Moment(due_date).format('YYYY-MM-DD');

            return pm.Moment(today).isSameOrBefore(due_day) ? false : 'pm-task-done';
        },


        /**
         * Showing (-) between task start date and due date
         * 
         * @param  string  task_start_field 
         * @param  string  start_date       
         * @param  string  due_date         
         * 
         * @return Boolean                  
         */
        isBetweenDate: function isBetweenDate(task_start_field, start_date, due_date) {
            if (task_start_field && !start_date && !due_date) {
                return true;
            }
            return false;
        },


        /**
         * Mark task done and undone
         * 
         * @param  int  task_id    
         * @param  Boolean is_checked 
         * @param  int  task_index 
         * 
         * @return void             
         */
        taskDoneUndone: function taskDoneUndone(task, is_checked, list) {
            var self = this;
            var url = self.base_url + '/pm/v2/projects/' + self.project_id + '/tasks/' + task.id;
            var type = 'PUT';

            var form_data = {
                'status': is_checked ? 1 : 0
            };
            var request_data = {
                url: url,
                type: type,
                data: form_data,
                success: function success(res) {
                    self.$store.commit('afterTaskDoneUndone', {
                        status: is_checked,
                        task: res.data,
                        list_id: list.id,
                        task_id: task.id
                    });
                    if (self.$store.state.is_single_list) {
                        // var condition = 'incomplete_tasks,complete_tasks,comments';
                        // self.getList(self, self.list.id, condition);
                    } else {
                            //self.getList(self, self.list.id );
                        }
                }
            };
            self.httpRequest(request_data);
        },

        /**
         * Checking empty object
         * @param  {Object}  obj 
         * @return {Boolean}     
         */
        isEmptyObject: function isEmptyObject(obj) {
            return (0, _keys2.default)(obj).length === 0;
        },


        /**
         * Single Task Poppu mutation setup
         * @param  {object} task Task Object
         * @param  {Object} list List object
         * @return {[type]}      [description]
         */
        singleTask: function singleTask(task, list) {
            this.$store.commit('single_task_popup', { task: task });
        },


        /**
         * List templete action to show hide blank templete
         * @return {[type]} [description]
         */
        listTemplateAction: function listTemplateAction() {
            var lists = this.$store.state.lists,
                blank,
                listTmpl;

            if (lists.length) {
                blank = false;listTmpl = true;
            } else {
                blank = true;listTmpl = false;
            }
            this.$store.commit('balankTemplateStatus', blank);
            this.$store.commit('listTemplateStatus', listTmpl);
        }
    }
};

exports.default = pm.Vue.mixin(PM_TaskList_Mixin);

/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var task_lists_route = function task_lists_route(resolve) {
    __webpack_require__.e/* require.ensure */(4).then((function () {
        resolve(__webpack_require__(67));
    }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
};

var single_list_route = function single_list_route(resolve) {
    __webpack_require__.e/* require.ensure */(3).then((function () {
        resolve(__webpack_require__(68));
    }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
};

var single_task_route = function single_task_route(resolve) {
    __webpack_require__.e/* require.ensure */(13).then((function () {
        resolve(__webpack_require__(69));
    }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
};

var task_lists = {
    path: '/:project_id/task-lists/',
    components: {
        'task-lists': task_lists_route
    },
    name: 'task_lists',

    children: [{
        path: '/:project_id/task/:task_id',
        components: {
            'single-task': single_task_route
        },
        name: 'lists_single_task'
    }, {
        path: 'pages/:current_page_number',
        components: {
            'task-lists': task_lists_route
        },
        name: 'list_pagination'
    }]
};

var single_list = {
    path: '/:project_id/task-lists/:list_id',
    components: {
        'single-list': single_list_route
    },
    name: 'single_list',

    children: [{
        path: '/:project_id/task-lists/:list_id/task/:task_id',
        components: {
            'single-task': single_task_route
        },
        name: 'single_task'
    }]
};

exports.task_lists = task_lists;
exports.single_list = single_list;

/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

/**
 * Make sure to call pm.Vue.use(Vuex) first if using a vuex module system
 */
exports.default = new pm.Vuex.Store({
    /**
     * Assign global property
     * 
     * @type Object
     */
    state: {
        lists: [],
        list: {},
        list_comments: [],
        lists_meta: {},
        init: {},
        balankTemplateStatus: false,
        listTemplateStatus: false,
        is_single_list: true,
        project_users: [],
        loading: true,
        is_active_list_form: false,
        project_id: false,
        permissions: {
            create_todolist: true
        },
        task: {},
        is_single_task: false,
        add_filter: {},
        todo_list_per_page: 5,
        get_current_user_id: 1,
        active_mode: 'list',
        inline_task_users: [],
        inline_task_start_date: '',
        inline_task_end_date: '',
        inline_task_description: '',
        inline_todo_list_id: 0,
        inline_display: {
            users: false,
            start: false,
            end: false,
            lists: false,
            description: false
        },
        total_list_page: 0,
        getIndex: function getIndex(itemList, id, slug) {
            var index = false;

            itemList.forEach(function (item, key) {
                if (item[slug] == id) {
                    index = key;
                }
            });

            return index;
        }
    },

    /**
     * Change any global property from here
     */
    mutations: {

        /**
         * Store todo lists page initial property
         * 
         * @param object state     
         * @param object task_init 
         *
         * @return void
         */
        setTaskInitData: function setTaskInitData(state, task_init) {
            state.lists = [];
            state.list_total = 0;
            state.milestones = [];
            state.init = {};
            state.project_users = [];
            state.permissions = {};

            state.loading = true;
            state.is_single_list = false, pm.Vue.nextTick(function () {
                state.lists = task_init.data.lists;
                state.milestones = task_init.data.milestones;
                state.init = task_init.data;
                state.project_users = task_init.data.project_users;
                state.permissions = task_init.data.permissions;
                // state.list_total    = task_init.data.list_total;
                // state.todo_list_per_page = task_init.data.todo_list_per_page;
                //state.active_mode = task_init.data.active_mode;
                state.loading = false;
                state.is_single_list = false;
            });
        },

        loadingEffect: function loadingEffect(state, loading_status) {
            state.loading = loading_status;
        },

        /**
         * New todo list form showing or hiding
         * 
         * @param  object state 
         * 
         * @return void       
         */
        newTodoListForm: function newTodoListForm(state) {
            state.show_list_form = state.show_list_form ? false : true;;
        },

        /**
         * Update todo list form showing or hiding
         * 
         * @param  object state 
         * @param  object list  
         * 
         * @return void       
         */
        showHideUpdatelistForm: function showHideUpdatelistForm(state, list) {
            state.lists[list.list_index].edit_mode = state.lists[list.list_index].edit_mode ? false : true;
        },

        /**
         * Showing and hiding task insert and edit form
         * 
         * @param  object state 
         * @param  int index 
         * 
         * @return void       
         */
        showHideTaskForm: function showHideTaskForm(state, index) {

            if (typeof index.task_index == 'undefined' || index.task_index === false) {
                state.lists[index.list_index].show_task_form = state.lists[index.list_index].show_task_form ? false : true;
            } else {
                state.lists[index.list_index].tasks[index.task_index].edit_mode = state.lists[index.list_index].tasks[index.task_index].edit_mode ? false : true;
            }
        },

        /**
         * Update state lists property after insert new todo list or update todo list
         * 
         * @param  object state 
         * @param  object res   
         * 
         * @return void       
         */
        update_todo_list: function update_todo_list(state, res) {

            if (res.is_update) {
                state.lists.splice(res.index, 1);
                state.lists.splice(res.index, 0, res.res_list);
            } else {
                state.lists.splice(0, 0, res.res_list);
            }
        },

        /**
         * Insert new task to state lists.tasks property. 
         *  
         * @param  object state 
         * @param  object data  
         * 
         * @return void
         */
        afterUpdateTask: function afterUpdateTask(state, data) {
            var list_index = state.getIndex(state.lists, data.list_id, 'id');

            if (data.task.status === 'incomplete') {
                var task_index = state.getIndex(state.lists[list_index].incomplete_tasks.data, data.task.id, 'id');

                state.lists[list_index].incomplete_tasks.data.splice(task_index, 1, data.task);
            }
        },

        afterNewTask: function afterNewTask(state, data) {
            var list_index = state.getIndex(state.lists, data.list_id, 'id');
            if (data.task.status === 'incomplete') {

                if (typeof state.lists[list_index].incomplete_tasks !== 'undefined') {
                    state.lists[list_index].incomplete_tasks.data.splice(0, 0, data.task);
                } else {
                    state.lists[list_index].incomplete_tasks = { data: data.task };
                }
            }

            state.lists[list_index].meta.total_incomplete_tasks = state.lists[list_index].meta.total_incomplete_tasks + 1;
        },


        /**
         * When goto single todo list page. Empty the state lists array and insert single todo list. 
         * 
         * @param  object state 
         * @param  object data  
         * 
         * @return void       
         */
        update_todo_list_single: function update_todo_list_single(state, data) {

            state.lists = [];
            state.milestones = [];
            state.project_users = [];

            pm.Vue.nextTick(function () {
                state.lists.push(data.list);
                state.milestones = data.milestones;
                state.project_users = data.project_users;
                state.permissions = data.permissions;
                state.is_single_list = true;
            });
        },

        /**
         * Make single task complete and incomplete
         * 
         * @param  object state 
         * @param  object data  
         * 
         * @return void        
         */
        afterTaskDoneUndone: function afterTaskDoneUndone(state, data) {
            var list_index = state.getIndex(state.lists, data.list_id, 'id');

            if (data.status === true) {
                var task_index = state.getIndex(state.lists[list_index].incomplete_tasks.data, data.task_id, 'id');
                state.lists[list_index].incomplete_tasks.data.splice(task_index, 1);

                if (typeof state.lists[list_index].complete_tasks !== 'undefined') {

                    state.lists[list_index].complete_tasks.data.splice(0, 0, data.task);
                }

                state.lists[list_index].meta.total_complete_tasks = state.lists[list_index].meta.total_complete_tasks + 1;
                state.lists[list_index].meta.total_incomplete_tasks = state.lists[list_index].meta.total_incomplete_tasks - 1;
            }

            if (data.status === false) {
                var task_index = state.getIndex(state.lists[list_index].complete_tasks.data, data.task_id, 'id');
                state.lists[list_index].complete_tasks.data.splice(task_index, 1);

                if (typeof state.lists[list_index].incomplete_tasks !== 'undefined') {

                    state.lists[list_index].incomplete_tasks.data.splice(0, 0, data.task);
                }

                state.lists[list_index].meta.total_complete_tasks = state.lists[list_index].meta.total_complete_tasks - 1;
                state.lists[list_index].meta.total_incomplete_tasks = state.lists[list_index].meta.total_incomplete_tasks + 1;
            }
        },

        /**
         * After update list-comment store it in state lists
         * 
         * @param  object state 
         * @param  object data  
         * 
         * @return void        
         */
        listNewComment: function listNewComment(state, data) {
            var list_index = state.getIndex(state.lists, data.list_id, 'id');

            state.lists[list_index].comments.data.splice(0, 0, data.comment);
        },

        /**
         * After update list-comment store it in state lists
         * 
         * @param  object state 
         * @param  object data  
         * 
         * @return void        
         */
        listUpdateComment: function listUpdateComment(state, data) {
            var list_index = state.getIndex(state.lists, data.list_id, 'id'),
                comment_index = state.getIndex(state.lists[list_index].comments.data, data.comment_id, 'id');

            state.lists[list_index].comments.data.splice(comment_index, 1, data.comment);
        },

        /**
         * Remove comment from list
         * 
         * @param  object state 
         * @param  object data  
         * 
         * @return void       
         */
        after_delete_comment: function after_delete_comment(state, data) {
            state.lists[data.list_index].comments.splice(data.comment_index, 1);
        },

        /**
         * Remove comment from task
         * 
         * @param  object state 
         * @param  object data  
         * 
         * @return void       
         */
        after_delete_task_comment: function after_delete_task_comment(state, data) {
            state.lists[data.list_index].tasks[data.task_index].comments.splice(data.comment_index, 1);
        },

        /**
         * Showing todo-list comment edit form
         * 
         * @param  object state 
         * @param  object data  
         * 
         * @return void
         */
        showHideListCommentEditForm: function showHideListCommentEditForm(state, data) {

            if (data.comment_index !== false) {
                state.lists[data.list_index].comments[data.comment_index].edit_mode = state.lists[data.list_index].comments[data.comment_index].edit_mode ? false : true;
            }
        },

        /**
         * Showing task comment edit form
         * 
         * @param  object state 
         * @param  object data  
         * 
         * @return void
         */
        showHideTaskCommentEditForm: function showHideTaskCommentEditForm(state, data) {
            if (data.comment_index !== false) {
                state.lists[data.list_index].tasks[data.task_index].comments[data.comment_index].edit_mode = state.lists[data.list_index].tasks[data.task_index].comments[data.comment_index].edit_mode ? false : true;
            }
        },

        /**
         * Set single task popup data to vuex store
         * 
         * @param  object state 
         * @param  object task  
         * 
         * @return void       
         */
        single_task_popup: function single_task_popup(state) {
            state.task = task.task;
        },

        /**
         * Make empty store task and make false is_single_task
         * 
         * @param  object state 
         * 
         * @return void       
         */
        close_single_task_popup: function close_single_task_popup(state) {
            state.is_single_task = false;
            //state.task = {};
        },

        update_task_comment: function update_task_comment(state, comment) {
            state.lists[comment.list_index].tasks[comment.task_index].comments.push(comment.comment);
        },

        /**
         * Remove todo list 
         * 
         * @param  object state 
         * @param  object list  
         * 
         * @return return
         */
        after_delete_todo_list: function after_delete_todo_list(state, list) {
            state.lists.splice(list.list_index, 1);
        },

        /**
         * After delete task
         * 
         * @param  object state 
         * @param  object task  
         * 
         * @return void       
         */
        afterDeleteTask: function afterDeleteTask(state, data) {
            var list_index = state.getIndex(state.lists, data.list.id, 'id');

            if (data.task.status === false || data.task.status === 'incomplete') {
                var task_index = state.getIndex(state.lists[list_index].incomplete_tasks.data, data.task.id, 'id');
                state.lists[list_index].incomplete_tasks.data.splice(task_index, 1);
                state.lists[list_index].meta.total_incomplete_tasks = state.lists[list_index].meta.total_incomplete_tasks - 1;
            } else {
                var task_index = state.getIndex(state.lists[list_index].complete_tasks.data, data.task.id, 'id');
                state.lists[list_index].complete_tasks.data.splice(task_index, 1);
                state.lists[list_index].meta.total_incomplete_tasks = state.lists[list_index].meta.total_complete_tasks - 1;
            }
        },

        /**
         * After get tasks from list id
         * 
         * @param  object state 
         * @param  object task  
         * 
         * @return void       
         */
        insert_tasks: function insert_tasks(state, task) {

            task.tasks.tasks.forEach(function (task_obj) {
                state.lists[task.list_index].tasks.push(task_obj);
            });
            //state.lists[task.list_index].tasks = task.tasks.tasks;
        },

        emptyTodoLists: function emptyTodoLists(state) {
            state.lists = [];
        },

        /**
         * Chanage view active mode
         *
         * @param  object state 
         * @param  object mode 
         * 
         * @return void
         */
        change_active_mode: function change_active_mode(state, mode) {
            state.active_mode = mode.mode;
        },

        add_inline_task_users: function add_inline_task_users(state, users) {
            state.inline_task_users = users.users;
        },

        add_inline_task_start_date: function add_inline_task_start_date(state, date) {
            state.inline_task_start_date = date.date;
        },

        add_inline_task_end_date: function add_inline_task_end_date(state, date) {
            state.inline_task_end_date = date.date;
        },

        add_inline_task_description: function add_inline_task_description(state, description) {
            state.inline_task_description = description.description;
        },

        add_inline_todo_list_id: function add_inline_todo_list_id(state, list) {
            state.inline_todo_list_id = list.list_id;
        },

        inline_display: function inline_display(state, _inline_display) {
            state.inline_display = _inline_display;
        },

        loading_effect: function loading_effect(state, effect) {
            state.loading = effect.mode;
        },

        afterUpdateTaskElement: function afterUpdateTaskElement(state, task) {
            jQuery.extend(true, state.lists[task.list_index].tasks[task.task_index], task.task);
            state.lists[task.list_index].tasks[task.task_index].assigned_to = task.task.assigned_to;
        },

        setLists: function setLists(state, lists) {
            state.lists = lists;
        },
        setList: function setList(state, list) {
            state.lists = [list];
        },
        afterNewList: function afterNewList(state, list) {
            var per_page = state.lists_meta.per_page,
                length = state.lists.length;

            if (per_page <= length) {
                state.lists.splice(0, 0, list);
                state.lists.pop();
            } else {
                state.lists.splice(0, 0, list);
            }
        },
        afterUpdateList: function afterUpdateList(state, list) {
            var list_index = state.getIndex(state.lists, list.id, 'id');
            var merge_list = jQuery.extend(true, state.lists[list_index], list);
            state.lists.splice(list_index, 1, merge_list);
        },
        afterNewListupdateListsMeta: function afterNewListupdateListsMeta(state) {
            state.lists_meta.total = state.lists_meta.total + 1;
            state.lists_meta.total_pages = Math.ceil(state.lists_meta.total / state.lists_meta.per_page);
        },
        afterDeleteList: function afterDeleteList(state, list_id) {
            var list_index = state.getIndex(state.lists, list_id, 'id');
            state.lists.splice(list_index, 1);
        },
        setListComments: function setListComments(state, comments) {
            state.list_comments = comments;
        },
        setListForSingleListPage: function setListForSingleListPage(state, list) {
            state.list = list;
        },
        setMilestones: function setMilestones(state, milestones) {
            state.milestones = milestones;
        },
        showHideListFormStatus: function showHideListFormStatus(state, status) {
            if (status === 'toggle') {
                state.is_active_list_form = state.is_active_list_form ? false : true;
            } else {
                state.is_active_list_form = status;
            }
        },
        setTotalListPage: function setTotalListPage(state, total) {
            state.total_list_page = total;
        },
        setListsMeta: function setListsMeta(state, meta) {
            state.lists_meta = meta;
        },
        setSingleTask: function setSingleTask(state, data) {
            state.task = data;
        },
        setTasks: function setTasks(state, data) {
            var list_index = state.getIndex(state.lists, data.id, 'id');

            if (typeof data.incomplete_tasks !== 'undefined') {
                data.incomplete_tasks.data.forEach(function (task) {
                    state.lists[list_index].incomplete_tasks.data.push(task);
                });
                state.lists[list_index].incomplete_tasks.meta = data.incomplete_tasks.meta;
            } else {
                data.complete_tasks.data.forEach(function (task) {
                    state.lists[list_index].complete_tasks.data.push(task);
                });
                state.lists[list_index].complete_tasks.meta = data.complete_tasks.meta;
            }
        },
        updateTaskEditMode: function updateTaskEditMode(state, data) {
            var list_index = state.getIndex(state.lists, data.list_id, 'id');

            if (typeof state.lists[list_index].incomplete_tasks !== 'undefined') {
                var task_index = state.getIndex(state.lists[list_index].incomplete_tasks.data, data.task.id, 'id');
                state.lists[list_index].incomplete_tasks.data[task_index].edit_mode = true;

                //state.lists[list_index].incomplete_tasks.data.splice(task_index, 1); 

                //state.lists[list_index].incomplete_tasks.data.splice(task_index, 1, data.task);

                //jQuery.extend(true, data.task, state.lists[list_index].incomplete_tasks.data[task_index] );
            }

            if (typeof state.lists[list_index].complete_tasks !== 'undefined') {
                var task_index = state.getIndex(state.lists[list_index].complete_tasks.data, data.task.id, 'id');
                state.lists[list_index].incomplete_tasks.data[task_index].edit_mode = data.edit_mode;
            }
        },
        balankTemplateStatus: function balankTemplateStatus(state, status) {
            state.balankTemplateStatus = status;
        },
        listTemplateStatus: function listTemplateStatus(state, status) {
            state.listTemplateStatus = status;
        }
    }
});

/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = __webpack_require__(146);

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    path: '/reports',
    components: { 'reports': _index2.default },
    name: 'reports'
};

/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = pm.Vue.mixin({
    methods: {
        saveSettings: function saveSettings(settings, callback) {
            var settings = this.formatSettings(settings),
                self = this;

            var request = {
                url: self.base_url + '/pm/v2/settings',
                data: {
                    settings: settings
                },
                type: 'POST',
                success: function success(res) {
                    if (typeof callback !== 'undefined') {
                        callback();
                    }
                }
            };

            self.httpRequest(request);
        },
        formatSettings: function formatSettings(settings) {
            var data = [];

            jQuery.each(settings, function (name, value) {
                data.push({
                    key: name,
                    value: value
                });
            });

            return data;
        },
        getSettings: function getSettings(key, pre_define) {
            var pre_define = pre_define || false,
                settings = PM_Vars.settings;

            if (typeof PM_Vars.settings[key] === 'undefined') {
                return pre_define;
            }

            return PM_Vars.settings[key];
        }
    }
});

/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.email = exports.general = undefined;

var _general = __webpack_require__(148);

var _general2 = _interopRequireDefault(_general);

var _email = __webpack_require__(147);

var _email2 = _interopRequireDefault(_email);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var general = {
    path: '/settings',
    components: { 'general': _general2.default },
    name: 'general'
};

var email = {
    path: '/settings/email',
    components: { 'email': _email2.default },
    name: 'email'
};

exports.general = general;
exports.email = email;

/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/***/ }),
/* 122 */,
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__.p = PM_Vars.dir_url + 'views/assets/js/';

pmPromise.then(function (result) {
    __webpack_require__(47);
});

/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(125), __esModule: true };

/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(129);
module.exports = __webpack_require__(4).Object.keys;


/***/ }),
/* 126 */,
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

// most Object methods by ES6 should accept primitives
var $export = __webpack_require__(12);
var core = __webpack_require__(4);
var fails = __webpack_require__(6);
module.exports = function (KEY, exec) {
  var fn = (core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
};


/***/ }),
/* 128 */,
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 Object.keys(O)
var toObject = __webpack_require__(55);
var $keys = __webpack_require__(14);

__webpack_require__(127)('keys', function () {
  return function keys(it) {
    return $keys(toObject(it));
  };
});


/***/ }),
/* 130 */,
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(50)(undefined);
// imports


// module
exports.push([module.i, "\n#nprogress .bar {\n    z-index: 99999;\n}\n\n", ""]);

// exports


/***/ }),
/* 132 */,
/* 133 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_App_vue__ = __webpack_require__(71);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_116e6feb_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_App_vue__ = __webpack_require__(151);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(170)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_App_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_116e6feb_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_App_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/App.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-116e6feb", Component.options)
  } else {
    hotAPI.reload("data-v-116e6feb", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 134 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_index_vue__ = __webpack_require__(72);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_90f05dd0_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_index_vue__ = __webpack_require__(166);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_index_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_90f05dd0_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_index_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/components/add-ons/index.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-90f05dd0", Component.options)
  } else {
    hotAPI.reload("data-v-90f05dd0", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 135 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_categories_vue__ = __webpack_require__(74);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0f4cc6bc_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_categories_vue__ = __webpack_require__(150);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_categories_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0f4cc6bc_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_categories_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/components/categories/categories.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0f4cc6bc", Component.options)
  } else {
    hotAPI.reload("data-v-0f4cc6bc", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 136 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_edit_category_form_vue__ = __webpack_require__(75);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_be871760_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_edit_category_form_vue__ = __webpack_require__(168);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_edit_category_form_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_be871760_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_edit_category_form_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/components/categories/edit-category-form.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-be871760", Component.options)
  } else {
    hotAPI.reload("data-v-be871760", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 137 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_index_vue__ = __webpack_require__(76);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_179afd3c_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_index_vue__ = __webpack_require__(152);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_index_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_179afd3c_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_index_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/components/categories/index.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-179afd3c", Component.options)
  } else {
    hotAPI.reload("data-v-179afd3c", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 138 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_index_vue__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_f91aaa1a_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_index_vue__ = __webpack_require__(169);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_index_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_f91aaa1a_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_index_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/components/progress/index.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-f91aaa1a", Component.options)
  } else {
    hotAPI.reload("data-v-f91aaa1a", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 139 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_index_vue__ = __webpack_require__(79);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_1b64c127_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_index_vue__ = __webpack_require__(153);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_index_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_1b64c127_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_index_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/components/project-activities/index.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-1b64c127", Component.options)
  } else {
    hotAPI.reload("data-v-1b64c127", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 140 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_index_vue__ = __webpack_require__(80);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_508f87b2_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_index_vue__ = __webpack_require__(158);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_index_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_508f87b2_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_index_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/components/project-discussions/index.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-508f87b2", Component.options)
  } else {
    hotAPI.reload("data-v-508f87b2", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 141 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_index_vue__ = __webpack_require__(81);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_4db71713_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_index_vue__ = __webpack_require__(156);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_index_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_4db71713_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_index_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/components/project-files/index.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-4db71713", Component.options)
  } else {
    hotAPI.reload("data-v-4db71713", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 142 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_template_compiler_index_id_data_v_61d972b1_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_index_vue__ = __webpack_require__(161);
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
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_template_compiler_index_id_data_v_61d972b1_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_index_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/components/project-lists/index.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-61d972b1", Component.options)
  } else {
    hotAPI.reload("data-v-61d972b1", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 143 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_index_vue__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_4e969286_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_index_vue__ = __webpack_require__(157);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_index_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_4e969286_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_index_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/components/project-milestones/index.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-4e969286", Component.options)
  } else {
    hotAPI.reload("data-v-4e969286", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 144 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_index_vue__ = __webpack_require__(83);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_88e4011a_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_index_vue__ = __webpack_require__(165);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_index_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_88e4011a_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_index_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/components/project-overview/index.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-88e4011a", Component.options)
  } else {
    hotAPI.reload("data-v-88e4011a", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 145 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_index_vue__ = __webpack_require__(84);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_58ce0287_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_index_vue__ = __webpack_require__(159);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_index_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_58ce0287_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_index_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/components/project-task-lists/index.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-58ce0287", Component.options)
  } else {
    hotAPI.reload("data-v-58ce0287", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 146 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_index_vue__ = __webpack_require__(85);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_5f8b56cf_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_index_vue__ = __webpack_require__(160);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_index_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_5f8b56cf_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_index_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/components/reports/index.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-5f8b56cf", Component.options)
  } else {
    hotAPI.reload("data-v-5f8b56cf", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 147 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_email_vue__ = __webpack_require__(86);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7485d733_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_email_vue__ = __webpack_require__(164);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_email_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7485d733_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_email_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/components/settings/email.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7485d733", Component.options)
  } else {
    hotAPI.reload("data-v-7485d733", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 148 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_general_vue__ = __webpack_require__(87);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_6d9f4abf_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_general_vue__ = __webpack_require__(162);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_general_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_6d9f4abf_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_general_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/components/settings/general.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-6d9f4abf", Component.options)
  } else {
    hotAPI.reload("data-v-6d9f4abf", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 149 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_index_vue__ = __webpack_require__(88);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_73fdad2e_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_index_vue__ = __webpack_require__(163);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_index_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_73fdad2e_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_index_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/components/settings/index.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-73fdad2e", Component.options)
  } else {
    hotAPI.reload("data-v-73fdad2e", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 150 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "wrap nosubsub" }, [
    _c("h1", { staticClass: "wp-heading-inline" }, [
      _vm._v(_vm._s(_vm.text.categories))
    ]),
    _vm._v(" "),
    _c("hr", { staticClass: "wp-header-end" }),
    _vm._v(" "),
    _c("div", { attrs: { id: "ajax-response" } }),
    _vm._v(" "),
    _c("div", { staticClass: "wp-clearfix", attrs: { id: "col-container" } }, [
      _c("div", { attrs: { id: "col-left" } }, [
        _c("div", { staticClass: "col-wrap" }, [
          _c("div", { staticClass: "form-wrap" }, [
            _c("h2", [_vm._v(_vm._s(_vm.text.add_new_category))]),
            _vm._v(" "),
            _c(
              "form",
              {
                staticClass: "validate",
                attrs: {
                  id: "addtag",
                  method: "post",
                  action: "edit-tags.php"
                },
                on: {
                  submit: function($event) {
                    $event.preventDefault()
                    _vm.categoryFormAction()
                  }
                }
              },
              [
                _c(
                  "div",
                  { staticClass: "form-field form-required term-name-wrap" },
                  [
                    _c("label", { attrs: { for: "tag-name" } }, [
                      _vm._v(_vm._s(_vm.text.name))
                    ]),
                    _vm._v(" "),
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model",
                          value: _vm.title,
                          expression: "title"
                        }
                      ],
                      attrs: {
                        required: "required",
                        name: "tag-name",
                        id: "tag-name",
                        type: "text",
                        value: "",
                        size: "40",
                        "aria-required": "true"
                      },
                      domProps: { value: _vm.title },
                      on: {
                        input: function($event) {
                          if ($event.target.composing) {
                            return
                          }
                          _vm.title = $event.target.value
                        }
                      }
                    }),
                    _vm._v(" "),
                    _c("p")
                  ]
                ),
                _vm._v(" "),
                _c("div", { staticClass: "form-field term-description-wrap" }, [
                  _c("label", { attrs: { for: "tag-description" } }, [
                    _vm._v(_vm._s(_vm.text.description))
                  ]),
                  _vm._v(" "),
                  _c("textarea", {
                    directives: [
                      {
                        name: "model",
                        rawName: "v-model",
                        value: _vm.description,
                        expression: "description"
                      }
                    ],
                    attrs: {
                      name: "description",
                      id: "tag-description",
                      rows: "5",
                      cols: "40"
                    },
                    domProps: { value: _vm.description },
                    on: {
                      input: function($event) {
                        if ($event.target.composing) {
                          return
                        }
                        _vm.description = $event.target.value
                      }
                    }
                  }),
                  _vm._v(" "),
                  _c("p")
                ]),
                _vm._v(" "),
                _c("p", { staticClass: "submit" }, [
                  _c("input", {
                    staticClass: "button button-primary",
                    attrs: { type: "submit", name: "submit", id: "submit" },
                    domProps: { value: _vm.text.add_new_category }
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
        ])
      ]),
      _vm._v(" "),
      _c("div", { attrs: { id: "col-right" } }, [
        _c("div", { staticClass: "col-wrap" }, [
          _c(
            "form",
            {
              attrs: { id: "posts-filter", method: "post" },
              on: {
                submit: function($event) {
                  $event.preventDefault()
                  _vm.selfDeleted()
                }
              }
            },
            [
              _c("div", { staticClass: "tablenav top" }, [
                _c("div", { staticClass: "alignleft actions bulkactions" }, [
                  _c(
                    "label",
                    {
                      staticClass: "screen-reader-text",
                      attrs: { for: "bulk-action-selector-top" }
                    },
                    [_vm._v(_vm._s(_vm.text.select_bulk_action))]
                  ),
                  _vm._v(" "),
                  _c(
                    "select",
                    {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model",
                          value: _vm.bulk_action,
                          expression: "bulk_action"
                        }
                      ],
                      attrs: { name: "action" },
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
                          _vm.bulk_action = $event.target.multiple
                            ? $$selectedVal
                            : $$selectedVal[0]
                        }
                      }
                    },
                    [
                      _c("option", { attrs: { value: "-1" } }, [
                        _vm._v(_vm._s(_vm.text.bulk_actions))
                      ]),
                      _vm._v(" "),
                      _c("option", { attrs: { value: "delete" } }, [
                        _vm._v(_vm._s(_vm.text.delete))
                      ])
                    ]
                  ),
                  _vm._v(" "),
                  _c("input", {
                    staticClass: "button action",
                    attrs: { type: "submit", id: "doaction" },
                    domProps: { value: _vm.text.apply }
                  })
                ]),
                _vm._v(" "),
                _c("br", { staticClass: "clear" })
              ]),
              _vm._v(" "),
              _c(
                "table",
                { staticClass: "wp-list-table widefat fixed striped tags" },
                [
                  _c("thead", [
                    _c("tr", [
                      _c(
                        "td",
                        {
                          staticClass: "manage-column column-cb check-column",
                          attrs: { id: "cb" }
                        },
                        [
                          _c(
                            "label",
                            {
                              staticClass: "screen-reader-text",
                              attrs: { for: "cb-select-all-1" }
                            },
                            [_vm._v(_vm._s(_vm.text.select_all))]
                          ),
                          _vm._v(" "),
                          _c("input", {
                            directives: [
                              {
                                name: "model",
                                rawName: "v-model",
                                value: _vm.select_all,
                                expression: "select_all"
                              }
                            ],
                            attrs: { id: "cb-select-all-1", type: "checkbox" },
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
                                      $$i < 0 &&
                                        (_vm.select_all = $$a.concat([$$v]))
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
                                  _vm.selectAll()
                                }
                              ]
                            }
                          })
                        ]
                      ),
                      _vm._v(" "),
                      _c(
                        "th",
                        {
                          staticClass:
                            "manage-column column-name column-primary sortable desc",
                          attrs: { scope: "col", id: "name" }
                        },
                        [
                          _c("a", { attrs: { href: "#" } }, [
                            _c("span", [_vm._v(_vm._s(_vm.text.name))])
                          ])
                        ]
                      ),
                      _vm._v(" "),
                      _c(
                        "th",
                        {
                          staticClass:
                            "manage-column column-description sortable desc",
                          attrs: { scope: "col", id: "description" }
                        },
                        [
                          _c("a", { attrs: { href: "" } }, [
                            _c("span", [_vm._v(_vm._s(_vm.text.description))])
                          ])
                        ]
                      )
                    ])
                  ]),
                  _vm._v(" "),
                  _c(
                    "tbody",
                    { attrs: { id: "the-list", "data-wp-lists": "list:tag" } },
                    _vm._l(_vm.categories, function(category) {
                      return _c(
                        "tr",
                        {
                          key: "category.id",
                          class: _vm.catTrClass(category),
                          attrs: { id: "tag-1" }
                        },
                        [
                          !category.edit_mode
                            ? _c(
                                "th",
                                {
                                  staticClass: "check-column",
                                  attrs: { scope: "row" }
                                },
                                [
                                  _c("input", {
                                    directives: [
                                      {
                                        name: "model",
                                        rawName: "v-model",
                                        value: _vm.delete_items,
                                        expression: "delete_items"
                                      }
                                    ],
                                    attrs: {
                                      type: "checkbox",
                                      id: "cb-select-48"
                                    },
                                    domProps: {
                                      value: category.id,
                                      checked: Array.isArray(_vm.delete_items)
                                        ? _vm._i(
                                            _vm.delete_items,
                                            category.id
                                          ) > -1
                                        : _vm.delete_items
                                    },
                                    on: {
                                      change: function($event) {
                                        var $$a = _vm.delete_items,
                                          $$el = $event.target,
                                          $$c = $$el.checked ? true : false
                                        if (Array.isArray($$a)) {
                                          var $$v = category.id,
                                            $$i = _vm._i($$a, $$v)
                                          if ($$el.checked) {
                                            $$i < 0 &&
                                              (_vm.delete_items = $$a.concat([
                                                $$v
                                              ]))
                                          } else {
                                            $$i > -1 &&
                                              (_vm.delete_items = $$a
                                                .slice(0, $$i)
                                                .concat($$a.slice($$i + 1)))
                                          }
                                        } else {
                                          _vm.delete_items = $$c
                                        }
                                      }
                                    }
                                  })
                                ]
                              )
                            : _vm._e(),
                          _vm._v(" "),
                          !category.edit_mode
                            ? _c(
                                "td",
                                {
                                  staticClass:
                                    "name column-name has-row-actions column-primary",
                                  attrs: { "data-colname": "Name" }
                                },
                                [
                                  _c("strong", [
                                    _c(
                                      "a",
                                      {
                                        staticClass: "row-title",
                                        attrs: { href: "" }
                                      },
                                      [_vm._v(_vm._s(category.title))]
                                    )
                                  ]),
                                  _vm._v(" "),
                                  _c("div", { staticClass: "row-actions" }, [
                                    _c("span", { staticClass: "edit" }, [
                                      _c(
                                        "a",
                                        {
                                          attrs: { href: "#" },
                                          on: {
                                            click: function($event) {
                                              $event.preventDefault()
                                              _vm.showHideCategoryEditForm(
                                                category
                                              )
                                            }
                                          }
                                        },
                                        [_vm._v(_vm._s(_vm.text.edit))]
                                      )
                                    ])
                                  ])
                                ]
                              )
                            : _vm._e(),
                          _vm._v(" "),
                          !category.edit_mode
                            ? _c(
                                "td",
                                {
                                  staticClass: "description column-description",
                                  attrs: { "data-colname": "Description" }
                                },
                                [_vm._v(_vm._s(category.description))]
                              )
                            : _vm._e(),
                          _vm._v(" "),
                          category.edit_mode
                            ? _c(
                                "td",
                                { attrs: { colspan: "4" } },
                                [
                                  _c("edit-category-form", {
                                    attrs: { category: category }
                                  })
                                ],
                                1
                              )
                            : _vm._e()
                        ]
                      )
                    })
                  ),
                  _vm._v(" "),
                  _c("tfoot", [
                    _c("tr", [
                      _c(
                        "td",
                        { staticClass: "manage-column column-cb check-column" },
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
                            attrs: { id: "cb-select-all-2", type: "checkbox" },
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
                                      $$i < 0 &&
                                        (_vm.select_all = $$a.concat([$$v]))
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
                                  _vm.selectAll()
                                }
                              ]
                            }
                          })
                        ]
                      ),
                      _vm._v(" "),
                      _c(
                        "th",
                        {
                          staticClass:
                            "manage-column column-name column-primary sortable desc",
                          attrs: { scope: "col" }
                        },
                        [
                          _c("a", { attrs: { href: "#" } }, [
                            _c("span", [_vm._v(_vm._s(_vm.text.name))])
                          ])
                        ]
                      ),
                      _vm._v(" "),
                      _c(
                        "th",
                        {
                          staticClass:
                            "manage-column column-description sortable desc",
                          attrs: { scope: "col" }
                        },
                        [
                          _c("a", { attrs: { href: "#" } }, [
                            _c("span", [_vm._v(_vm._s(_vm.text.description))])
                          ])
                        ]
                      )
                    ])
                  ])
                ]
              ),
              _vm._v(" "),
              _c("div", { staticClass: "tablenav bottom" }, [
                _c("div", { staticClass: "alignleft actions bulkactions" }, [
                  _c(
                    "select",
                    {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model",
                          value: _vm.bulk_action,
                          expression: "bulk_action"
                        }
                      ],
                      attrs: {
                        name: "action",
                        id: "bulk-action-selector-bottom"
                      },
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
                          _vm.bulk_action = $event.target.multiple
                            ? $$selectedVal
                            : $$selectedVal[0]
                        }
                      }
                    },
                    [
                      _c("option", { attrs: { value: "-1" } }, [
                        _vm._v(_vm._s(_vm.text.bulk_actions))
                      ]),
                      _vm._v(" "),
                      _c("option", { attrs: { value: "delete" } }, [
                        _vm._v(_vm._s(_vm.text.delete))
                      ])
                    ]
                  ),
                  _vm._v(" "),
                  _c("input", {
                    staticClass: "button action",
                    attrs: { type: "submit", id: "doaction2" },
                    domProps: { value: _vm.text.apply }
                  })
                ]),
                _vm._v(" "),
                _c("br", { staticClass: "clear" })
              ])
            ]
          )
        ])
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
    require("vue-hot-reload-api")      .rerender("data-v-0f4cc6bc", esExports)
  }
}

/***/ }),
/* 151 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "wedevs-pm-wrap pm wrap" },
    [
      _c("pm-projects"),
      _vm._v(" "),
      _c("pm-overview"),
      _vm._v(" "),
      _c("pm-discussions"),
      _vm._v(" "),
      _c("pm-activities"),
      _vm._v(" "),
      _c("pm-milestones"),
      _vm._v(" "),
      _c("pm-categories"),
      _vm._v(" "),
      _c("pm-task-lists"),
      _vm._v(" "),
      _c("pm-files"),
      _vm._v(" "),
      _c("pm-settings"),
      _vm._v(" "),
      !_vm.is_pro ? _c("pm-my-tasks") : _vm._e(),
      _vm._v(" "),
      !_vm.is_pro ? _c("pm-calendar") : _vm._e(),
      _vm._v(" "),
      _c("router-view", { attrs: { name: "add-ons" } }),
      _vm._v(" "),
      _c("router-view", { attrs: { name: "reports" } }),
      _vm._v(" "),
      _c("router-view", { attrs: { name: "progress" } }),
      _vm._v(" "),
      _c("do-action", { attrs: { hook: "addons-component" } })
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-116e6feb", esExports)
  }
}

/***/ }),
/* 152 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", [_c("router-view", { attrs: { name: "categories" } })], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-179afd3c", esExports)
  }
}

/***/ }),
/* 153 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", [_c("router-view", { attrs: { name: "activities" } })], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-1b64c127", esExports)
  }
}

/***/ }),
/* 154 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", [_c("router-view", { attrs: { name: "calendar" } })], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-3ef982c4", esExports)
  }
}

/***/ }),
/* 155 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "h2",
    { staticClass: "pm-settings-nav-menu-wrap nav-tab-wrapper" },
    [
      _c(
        "router-link",
        { staticClass: "nav-tab", attrs: { to: { name: "general" } } },
        [_vm._v("\n        " + _vm._s(_vm.text.general_settings) + "\n    ")]
      ),
      _vm._v(" "),
      _c(
        "router-link",
        { staticClass: "nav-tab", attrs: { to: { name: "email" } } },
        [_vm._v("\n        " + _vm._s(_vm.text.email_settings) + "\n    ")]
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-461a5f86", esExports)
  }
}

/***/ }),
/* 156 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", [_c("router-view", { attrs: { name: "pm-files" } })], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-4db71713", esExports)
  }
}

/***/ }),
/* 157 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    [
      _c("router-view", { attrs: { name: "milestones" } }),
      _vm._v(" "),
      _c("router-view", { attrs: { name: "individual-milestone" } })
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-4e969286", esExports)
  }
}

/***/ }),
/* 158 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    [
      _c("router-view", { attrs: { name: "discussions" } }),
      _vm._v(" "),
      _c("router-view", { attrs: { name: "individual-discussion" } })
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-508f87b2", esExports)
  }
}

/***/ }),
/* 159 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    [
      _c("router-view", { attrs: { name: "task-lists" } }),
      _vm._v(" "),
      _c("router-view", { attrs: { name: "single-list" } })
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-58ce0287", esExports)
  }
}

/***/ }),
/* 160 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("p", [_vm._v("Hi i am reports")])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-5f8b56cf", esExports)
  }
}

/***/ }),
/* 161 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    [
      _c("router-view", { attrs: { name: "project-lists" } }),
      _vm._v(" "),
      _c("router-view", { attrs: { name: "completed-projects" } }),
      _vm._v(" "),
      _c("router-view", { attrs: { name: "all-projects" } })
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-61d972b1", esExports)
  }
}

/***/ }),
/* 162 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    [
      _c("settings-header"),
      _vm._v(" "),
      _c("div", { staticClass: "metabox-holder" }, [
        _c("div", { staticClass: "group", attrs: { id: "pm_general" } }, [
          _c(
            "form",
            {
              attrs: { method: "post", action: "options.php" },
              on: {
                submit: function($event) {
                  $event.preventDefault()
                  _vm.saveSelfSettings()
                }
              }
            },
            [
              _c("h2", [_vm._v(_vm._s(_vm.text.general_settings))]),
              _vm._v(" "),
              _c("table", { staticClass: "form-table" }, [
                _c("tbody", [
                  _c("tr", [
                    _c("th", { attrs: { scope: "row" } }, [
                      _c(
                        "label",
                        { attrs: { for: "pm_general[upload_limit]" } },
                        [_vm._v(_vm._s(_vm.text.file_upload_limit))]
                      )
                    ]),
                    _vm._v(" "),
                    _c("td", [
                      _c("input", {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value: _vm.upload_limit,
                            expression: "upload_limit"
                          }
                        ],
                        staticClass: "regular-text",
                        attrs: { type: "text" },
                        domProps: { value: _vm.upload_limit },
                        on: {
                          input: function($event) {
                            if ($event.target.composing) {
                              return
                            }
                            _vm.upload_limit = $event.target.value
                          }
                        }
                      }),
                      _vm._v(" "),
                      _c("p", { staticClass: "description" }, [
                        _vm._v(_vm._s(_vm.text.file_size_mb))
                      ])
                    ])
                  ]),
                  _vm._v(" "),
                  _c("tr", [
                    _c("th", { attrs: { scope: "row" } }, [
                      _c(
                        "label",
                        { attrs: { for: "pm_general[pagination]" } },
                        [_vm._v(_vm._s(_vm.text.project_pp))]
                      )
                    ]),
                    _vm._v(" "),
                    _c("td", [
                      _c("input", {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value: _vm.project_per_page,
                            expression: "project_per_page"
                          }
                        ],
                        staticClass: "regular-text",
                        attrs: { type: "text" },
                        domProps: { value: _vm.project_per_page },
                        on: {
                          input: function($event) {
                            if ($event.target.composing) {
                              return
                            }
                            _vm.project_per_page = $event.target.value
                          }
                        }
                      }),
                      _vm._v(" "),
                      _c("p", { staticClass: "description" }, [
                        _vm._v(_vm._s(_vm.text.for_uplimited))
                      ])
                    ])
                  ]),
                  _vm._v(" "),
                  _c("tr", [
                    _c("th", { attrs: { scope: "row" } }, [
                      _c("label", { attrs: { for: "pm_general[show_todo]" } }, [
                        _vm._v(_vm._s(_vm.text.task_lists_pp))
                      ])
                    ]),
                    _vm._v(" "),
                    _c("td", [
                      _c("input", {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value: _vm.list_per_page,
                            expression: "list_per_page"
                          }
                        ],
                        staticClass: "regular-text",
                        attrs: {
                          type: "text",
                          id: "pm_general[show_todo]",
                          name: "pm_general[show_todo]",
                          value: ""
                        },
                        domProps: { value: _vm.list_per_page },
                        on: {
                          input: function($event) {
                            if ($event.target.composing) {
                              return
                            }
                            _vm.list_per_page = $event.target.value
                          }
                        }
                      })
                    ])
                  ]),
                  _vm._v(" "),
                  _c("tr", [
                    _c("th", { attrs: { scope: "row" } }, [
                      _c(
                        "label",
                        { attrs: { for: "pm_general[show_incomplete_tasks]" } },
                        [_vm._v(_vm._s(_vm.text.incomplete_tasks_pp))]
                      )
                    ]),
                    _vm._v(" "),
                    _c("td", [
                      _c("input", {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value: _vm.incomplete_tasks_per_page,
                            expression: "incomplete_tasks_per_page"
                          }
                        ],
                        staticClass: "regular-text",
                        attrs: {
                          type: "text",
                          id: "pm_general[show_incomplete_tasks]",
                          name: "pm_general[show_incomplete_tasks]",
                          value: "2"
                        },
                        domProps: { value: _vm.incomplete_tasks_per_page },
                        on: {
                          input: function($event) {
                            if ($event.target.composing) {
                              return
                            }
                            _vm.incomplete_tasks_per_page = $event.target.value
                          }
                        }
                      })
                    ])
                  ]),
                  _vm._v(" "),
                  _c("tr", [
                    _c("th", { attrs: { scope: "row" } }, [
                      _c(
                        "label",
                        { attrs: { for: "pm_general[show_completed_tasks]" } },
                        [_vm._v(_vm._s(_vm.text.completed_tasks_pp))]
                      )
                    ]),
                    _vm._v(" "),
                    _c("td", [
                      _c("input", {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value: _vm.complete_tasks_per_page,
                            expression: "complete_tasks_per_page"
                          }
                        ],
                        staticClass: "regular-text",
                        attrs: {
                          type: "text",
                          id: "pm_general[show_completed_tasks]",
                          name: "pm_general[show_completed_tasks]",
                          value: "2"
                        },
                        domProps: { value: _vm.complete_tasks_per_page },
                        on: {
                          input: function($event) {
                            if ($event.target.composing) {
                              return
                            }
                            _vm.complete_tasks_per_page = $event.target.value
                          }
                        }
                      })
                    ])
                  ]),
                  _vm._v(" "),
                  _c("tr", [
                    _c("th", { attrs: { scope: "row" } }, [
                      _c(
                        "label",
                        { attrs: { for: "pm_general[project_manage_role]" } },
                        [_vm._v(_vm._s(_vm.text.pm_capability))]
                      )
                    ]),
                    _vm._v(" "),
                    _c("td", [
                      _c(
                        "fieldset",
                        [
                          _vm._l(_vm.roles, function(role_display_name, role) {
                            return _c("label", [
                              _c("input", {
                                directives: [
                                  {
                                    name: "model",
                                    rawName: "v-model",
                                    value: _vm.managing_capability,
                                    expression: "managing_capability"
                                  }
                                ],
                                staticClass: "checkbox",
                                attrs: { type: "checkbox" },
                                domProps: {
                                  value: role,
                                  checked: Array.isArray(
                                    _vm.managing_capability
                                  )
                                    ? _vm._i(_vm.managing_capability, role) > -1
                                    : _vm.managing_capability
                                },
                                on: {
                                  change: function($event) {
                                    var $$a = _vm.managing_capability,
                                      $$el = $event.target,
                                      $$c = $$el.checked ? true : false
                                    if (Array.isArray($$a)) {
                                      var $$v = role,
                                        $$i = _vm._i($$a, $$v)
                                      if ($$el.checked) {
                                        $$i < 0 &&
                                          (_vm.managing_capability = $$a.concat(
                                            [$$v]
                                          ))
                                      } else {
                                        $$i > -1 &&
                                          (_vm.managing_capability = $$a
                                            .slice(0, $$i)
                                            .concat($$a.slice($$i + 1)))
                                      }
                                    } else {
                                      _vm.managing_capability = $$c
                                    }
                                  }
                                }
                              }),
                              _vm._v(
                                "\n                                        " +
                                  _vm._s(role_display_name) +
                                  "\n                                    "
                              )
                            ])
                          }),
                          _vm._v(" "),
                          _c("p", { staticClass: "description" }, [
                            _vm._v(_vm._s(_vm.text.pm_capability_des))
                          ])
                        ],
                        2
                      )
                    ])
                  ]),
                  _vm._v(" "),
                  _c("tr", [
                    _c("th", { attrs: { scope: "row" } }, [
                      _c(
                        "label",
                        { attrs: { for: "pm_general[project_create_role]" } },
                        [_vm._v(_vm._s(_vm.text.pm_cc))]
                      )
                    ]),
                    _vm._v(" "),
                    _c("td", [
                      _c(
                        "fieldset",
                        [
                          _vm._l(_vm.roles, function(role_display_name, role) {
                            return _c("label", [
                              _c("input", {
                                directives: [
                                  {
                                    name: "model",
                                    rawName: "v-model",
                                    value: _vm.project_create_capability,
                                    expression: "project_create_capability"
                                  }
                                ],
                                staticClass: "checkbox",
                                attrs: { type: "checkbox" },
                                domProps: {
                                  value: role,
                                  checked: Array.isArray(
                                    _vm.project_create_capability
                                  )
                                    ? _vm._i(
                                        _vm.project_create_capability,
                                        role
                                      ) > -1
                                    : _vm.project_create_capability
                                },
                                on: {
                                  change: function($event) {
                                    var $$a = _vm.project_create_capability,
                                      $$el = $event.target,
                                      $$c = $$el.checked ? true : false
                                    if (Array.isArray($$a)) {
                                      var $$v = role,
                                        $$i = _vm._i($$a, $$v)
                                      if ($$el.checked) {
                                        $$i < 0 &&
                                          (_vm.project_create_capability = $$a.concat(
                                            [$$v]
                                          ))
                                      } else {
                                        $$i > -1 &&
                                          (_vm.project_create_capability = $$a
                                            .slice(0, $$i)
                                            .concat($$a.slice($$i + 1)))
                                      }
                                    } else {
                                      _vm.project_create_capability = $$c
                                    }
                                  }
                                }
                              }),
                              _vm._v(
                                "\n                                        " +
                                  _vm._s(role_display_name) +
                                  "\n                                    "
                              )
                            ])
                          }),
                          _vm._v(" "),
                          _c("p", { staticClass: "description" }, [
                            _vm._v(_vm._s(_vm.text.pm_cc_des))
                          ])
                        ],
                        2
                      )
                    ])
                  ])
                ])
              ]),
              _vm._v(" "),
              _c("div", { staticStyle: { "padding-left": "10px" } }, [
                _c("p", { staticClass: "submit" }, [
                  _c("input", {
                    staticClass: "button button-primary",
                    attrs: { type: "submit", name: "submit", id: "submit" },
                    domProps: { value: _vm.text.save_changes }
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
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-6d9f4abf", esExports)
  }
}

/***/ }),
/* 163 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    [
      _c("router-view", { attrs: { name: "general" } }),
      _vm._v(" "),
      _c("router-view", { attrs: { name: "email" } })
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-73fdad2e", esExports)
  }
}

/***/ }),
/* 164 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    [
      _c("settings-header"),
      _vm._v(" "),
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
              _c("h2", [_vm._v(_vm._s(_vm.text.email_settings))]),
              _vm._v(" "),
              _c("table", { staticClass: "form-table" }, [
                _c("tbody", [
                  _c("tr", [
                    _c("th", { attrs: { scope: "row" } }, [
                      _c("label", { attrs: { for: "pm_mails[email_from]" } }, [
                        _vm._v(_vm._s(_vm.text.from_email))
                      ])
                    ]),
                    _vm._v(" "),
                    _c("td", [
                      _c("input", {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value: _vm.from_email,
                            expression: "from_email"
                          }
                        ],
                        staticClass: "regular-text",
                        attrs: {
                          type: "text",
                          id: "pm_mails[email_from]",
                          name: "pm_mails[email_from]",
                          value: ""
                        },
                        domProps: { value: _vm.from_email },
                        on: {
                          input: function($event) {
                            if ($event.target.composing) {
                              return
                            }
                            _vm.from_email = $event.target.value
                          }
                        }
                      })
                    ])
                  ]),
                  _vm._v(" "),
                  _c("tr", [
                    _c("th", { attrs: { scope: "row" } }, [
                      _c(
                        "label",
                        { attrs: { for: "pm_mails[email_url_link]" } },
                        [_vm._v(_vm._s(_vm.text.links_email))]
                      )
                    ]),
                    _vm._v(" "),
                    _c("td", [
                      _c("fieldset", [
                        _c(
                          "label",
                          {
                            attrs: {
                              for: "wpuf-pm_mails[email_url_link][backend]"
                            }
                          },
                          [
                            _c("input", {
                              directives: [
                                {
                                  name: "model",
                                  rawName: "v-model",
                                  value: _vm.link_to_backend,
                                  expression: "link_to_backend"
                                }
                              ],
                              staticClass: "radio",
                              attrs: { type: "checkbox" },
                              domProps: {
                                checked: Array.isArray(_vm.link_to_backend)
                                  ? _vm._i(_vm.link_to_backend, null) > -1
                                  : _vm.link_to_backend
                              },
                              on: {
                                change: function($event) {
                                  var $$a = _vm.link_to_backend,
                                    $$el = $event.target,
                                    $$c = $$el.checked ? true : false
                                  if (Array.isArray($$a)) {
                                    var $$v = null,
                                      $$i = _vm._i($$a, $$v)
                                    if ($$el.checked) {
                                      $$i < 0 &&
                                        (_vm.link_to_backend = $$a.concat([
                                          $$v
                                        ]))
                                    } else {
                                      $$i > -1 &&
                                        (_vm.link_to_backend = $$a
                                          .slice(0, $$i)
                                          .concat($$a.slice($$i + 1)))
                                    }
                                  } else {
                                    _vm.link_to_backend = $$c
                                  }
                                }
                              }
                            }),
                            _vm._v(
                              _vm._s(_vm.text.link_to_backend) +
                                "\n                                    "
                            )
                          ]
                        ),
                        _vm._v(" "),
                        _c("br"),
                        _vm._v(" "),
                        _c("p", { staticClass: "description" }, [
                          _vm._v(
                            _vm._s(_vm.text.link_to_backend_des) +
                              "\n                                    "
                          )
                        ])
                      ])
                    ])
                  ]),
                  _vm._v(" "),
                  _c("tr", [
                    _c("th", { attrs: { scope: "row" } }, [
                      _c("label", { attrs: { for: "pm_mails[email_type]" } }, [
                        _vm._v(_vm._s(_vm.text.emial_type))
                      ])
                    ]),
                    _vm._v(" "),
                    _c("td", [
                      _c(
                        "select",
                        {
                          directives: [
                            {
                              name: "model",
                              rawName: "v-model",
                              value: _vm.email_type,
                              expression: "email_type"
                            }
                          ],
                          staticClass: "regular",
                          attrs: {
                            name: "pm_mails[email_type]",
                            id: "pm_mails[email_type]"
                          },
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
                              _vm.email_type = $event.target.multiple
                                ? $$selectedVal
                                : $$selectedVal[0]
                            }
                          }
                        },
                        [
                          _c("option", { attrs: { value: "text/html" } }, [
                            _vm._v(_vm._s(_vm.text.html_mail))
                          ]),
                          _vm._v(" "),
                          _c(
                            "option",
                            {
                              attrs: {
                                value: "text/plain",
                                selected: "selected"
                              }
                            },
                            [_vm._v(_vm._s(_vm.text.plain_text))]
                          )
                        ]
                      )
                    ])
                  ]),
                  _vm._v(" "),
                  _c("tr", [
                    _c("th", { attrs: { scope: "row" } }, [
                      _c(
                        "label",
                        { attrs: { for: "pm_mails[email_bcc_enable]" } },
                        [_vm._v(_vm._s(_vm.text.send_email_via_Bcc))]
                      )
                    ]),
                    _vm._v(" "),
                    _c("td", [
                      _c("fieldset", [
                        _c(
                          "label",
                          { attrs: { for: "wpuf-pm_mails[email_bcc_enable]" } },
                          [
                            _c("input", {
                              directives: [
                                {
                                  name: "model",
                                  rawName: "v-model",
                                  value: _vm.enable_bcc,
                                  expression: "enable_bcc"
                                }
                              ],
                              staticClass: "checkbox",
                              attrs: { type: "checkbox" },
                              domProps: {
                                checked: Array.isArray(_vm.enable_bcc)
                                  ? _vm._i(_vm.enable_bcc, null) > -1
                                  : _vm.enable_bcc
                              },
                              on: {
                                change: function($event) {
                                  var $$a = _vm.enable_bcc,
                                    $$el = $event.target,
                                    $$c = $$el.checked ? true : false
                                  if (Array.isArray($$a)) {
                                    var $$v = null,
                                      $$i = _vm._i($$a, $$v)
                                    if ($$el.checked) {
                                      $$i < 0 &&
                                        (_vm.enable_bcc = $$a.concat([$$v]))
                                    } else {
                                      $$i > -1 &&
                                        (_vm.enable_bcc = $$a
                                          .slice(0, $$i)
                                          .concat($$a.slice($$i + 1)))
                                    }
                                  } else {
                                    _vm.enable_bcc = $$c
                                  }
                                }
                              }
                            }),
                            _vm._v(
                              "\n                                        " +
                                _vm._s(_vm.text.enable_bcc) +
                                "\n                                    "
                            )
                          ]
                        )
                      ])
                    ])
                  ])
                ])
              ]),
              _vm._v(" "),
              _c("div", { staticStyle: { "padding-left": "10px" } }, [
                _c("p", { staticClass: "submit" }, [
                  _c("input", {
                    staticClass: "button button-primary",
                    attrs: { type: "submit", name: "submit", id: "submit" },
                    domProps: { value: _vm.text.save_changes }
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
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-7485d733", esExports)
  }
}

/***/ }),
/* 165 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", [_c("router-view", { attrs: { name: "pm-overview" } })], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-88e4011a", esExports)
  }
}

/***/ }),
/* 166 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("p", [_vm._v("Hi i am add ons")])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-90f05dd0", esExports)
  }
}

/***/ }),
/* 167 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", [_c("router-view", { attrs: { name: "my-tasks" } })], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-be63d61a", esExports)
  }
}

/***/ }),
/* 168 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "form-wrap" }, [
    _c(
      "form",
      {
        attrs: { action: "" },
        on: {
          submit: function($event) {
            $event.preventDefault()
            _vm.updateSelfCategory()
          }
        }
      },
      [
        _c("fieldset", [
          _c("legend", { staticClass: "inline-edit-legend" }, [
            _vm._v(_vm._s(_vm.text.quick_edit))
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "inline-edit-col" }, [
            _c("label", [
              _c("span", { staticClass: "title" }, [
                _vm._v(_vm._s(_vm.text.name))
              ]),
              _vm._v(" "),
              _c("span", { staticClass: "input-text-wrap" }, [
                _c("input", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model",
                      value: _vm.category.title,
                      expression: "category.title"
                    }
                  ],
                  staticClass: "ptitle",
                  attrs: { type: "text", name: "name", value: "" },
                  domProps: { value: _vm.category.title },
                  on: {
                    input: function($event) {
                      if ($event.target.composing) {
                        return
                      }
                      _vm.$set(_vm.category, "title", $event.target.value)
                    }
                  }
                })
              ])
            ]),
            _vm._v(" "),
            _c("label", [
              _c("span", { staticClass: "title" }, [
                _vm._v(_vm._s(_vm.text.description))
              ]),
              _vm._v(" "),
              _c("span", { staticClass: "input-text-wrap" }, [
                _c("textarea", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model",
                      value: _vm.category.description,
                      expression: "category.description"
                    }
                  ],
                  domProps: { value: _vm.category.description },
                  on: {
                    input: function($event) {
                      if ($event.target.composing) {
                        return
                      }
                      _vm.$set(_vm.category, "description", $event.target.value)
                    }
                  }
                })
              ])
            ])
          ])
        ]),
        _vm._v(" "),
        _c("p", { staticClass: "inline-edit-save submit" }, [
          _c(
            "button",
            {
              staticClass: "cancel button alignleft",
              attrs: { type: "button" },
              on: {
                click: function($event) {
                  $event.preventDefault()
                  _vm.showHideCategoryEditForm(_vm.category)
                }
              }
            },
            [_vm._v(_vm._s(_vm.text.cancel))]
          ),
          _vm._v(" "),
          _c("input", {
            staticClass: "save button button-primary alignright",
            attrs: { type: "submit" },
            domProps: { value: _vm.text.update_category }
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
          }),
          _vm._v(" "),
          _c("br", { staticClass: "clear" })
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
    require("vue-hot-reload-api")      .rerender("data-v-be871760", esExports)
  }
}

/***/ }),
/* 169 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("p", [_vm._v("Hi i am progress")])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-f91aaa1a", esExports)
  }
}

/***/ }),
/* 170 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(131);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(51)("5bc883bd", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-116e6feb\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./App.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-116e6feb\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./App.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 171 */
/***/ (function(module, exports) {

/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
module.exports = function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}


/***/ })
/******/ ]);