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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 208);
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
/* 2 */
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

var listToStyles = __webpack_require__(99)

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
var options = null
var ssrIdKey = 'data-vue-ssr-id'

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

module.exports = function (parentId, list, _isProduction, _options) {
  isProduction = _isProduction

  options = _options || {}

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
  var styleElement = document.querySelector('style[' + ssrIdKey + '~="' + obj.id + '"]')

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
  if (options.ssrId) {
    styleElement.setAttribute(ssrIdKey, obj.id)
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
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _keys = __webpack_require__(59);

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
        task_start_field: function task_start_field() {
            if (!PM_Vars.is_pro) {
                return false;
            }
            return this.getSettings('task_start_field', false);
        },


        /**
         * Check is todo-list single or not
         * 
         * @return Boolean
         */
        is_single_list: function is_single_list() {
            return this.$store.state.projectTaskLists.is_single_list;
        },


        /**
         * Check is task single or not
         * 
         * @return Boolean
         */
        is_single_task: function is_single_task() {
            return this.$store.state.projectTaskLists.is_single_task;
        },
        can_create_list: function can_create_list() {
            return this.user_can("create_list");
        },
        can_create_task: function can_create_task() {
            return this.user_can("create_task");
        }
    },

    methods: {
        // ...pm.Vuex.mapMutations('projectTaskLists',
        //     [
        //         'setLists',
        //         'setListsMeta',
        //         'afterNewList',
        //         'afterNewListupdateListsMeta',
        //         'afterDeleteList',
        //         'afterNewTask',
        //         'afterUpdateTask',
        //         'projectTaskLists',
        //         'showHideListFormStatus',
        //         'single_task_popup',
        //         'balankTemplateStatus',
        //         'listTemplateStatus', 
        //         'setTasks',

        //         'afterUpdateList'
        //     ]
        // ),
        can_complete_task: function can_complete_task(task) {
            return !task.meta.can_complete_task;
        },
        can_edit_task_list: function can_edit_task_list(lsit) {
            var user = PM_Vars.current_user;
            if (this.is_manager()) {
                return true;
            }

            if (lsit.creator.data.id == user.ID) {
                return true;
            }

            return false;
        },
        can_edit_task: function can_edit_task(task) {
            var user = PM_Vars.current_user;
            if (this.is_manager()) {
                return true;
            }

            if (task.creator.data.id == user.ID) {
                return true;
            }

            return false;
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
                    self.$root.$store.state.projectTaskListLoaded = true;
                    self.$store.commit('projectTaskLists/setLists', res.data);
                    self.$store.commit('projectTaskLists/setListsMeta', res.meta.pagination);

                    self.listTemplateAction();

                    if (typeof args.callback === 'function') {
                        args.callback.call(self, res.data);
                    }
                },
                error: function error(res) {
                    res.responseJSON.message.map(function (value, index) {
                        pm.Toastr.error(value);
                    });
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
                    order: 0
                },
                callback: false
            },
                args = jQuery.extend(true, pre_define, args);
            var data = pm_apply_filters('before_task_list_save', args.data);
            var request_data = {
                url: self.base_url + '/pm/v2/projects/' + self.project_id + '/task-lists',
                data: data,
                type: 'POST',
                success: function success(res) {
                    self.addMetaList(res.data);
                    res.data.incomplete_tasks = { data: [] };
                    self.$store.commit('projectTaskLists/afterNewList', res.data);
                    self.$store.commit('projectTaskLists/afterNewListupdateListsMeta');
                    self.$store.commit('updateProjectMeta', 'total_task_lists');
                    self.$store.commit('updateProjectMeta', 'total_activities');
                    self.showHideListForm(false);
                    pm.Toastr.success(res.message);

                    if (typeof args.callback === 'function') {
                        args.callback.call(self, res);
                    }

                    pmBus.$emit('pm_after_create_list', res);
                },
                error: function error(res) {
                    // Showing error
                    if (res.status == 500) {
                        res.responseJSON.message.map(function (value, index) {
                            pm.Toastr.error(value);
                        });
                    }

                    if (res.status == 400) {
                        var params = res.responseJSON.data.params;
                        for (var obj in params) {
                            pm.Toastr.error(params[obj][0]);
                        }
                    }

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
                    order: 0
                },
                callback: false
            };
            var args = jQuery.extend(true, pre_define, args);
            var data = pm_apply_filters('before_task_list_save', args.data);
            var request_data = {
                url: self.base_url + '/pm/v2/projects/' + self.project_id + '/task-lists/' + self.list.id,
                data: data,
                type: 'PUT',
                success: function success(res) {
                    self.addMetaList(res.data);
                    pm.Toastr.success(res.message);
                    self.$store.commit('projectTaskLists/afterUpdateList', res.data);
                    self.showHideListForm(false, self.list);

                    if (typeof args.callback === 'function') {
                        args.callback.call(self, res);
                    }
                    self.$store.commit('updateProjectMeta', 'total_activities');
                    pmBus.$emit('pm_after_update_list', res);
                },
                error: function error(res) {
                    // Showing error
                    if (res.status == 500) {
                        res.responseJSON.message.map(function (value, index) {
                            pm.Toastr.error(value);
                        });
                    }

                    if (res.status == 400) {
                        var params = res.responseJSON.data.params;
                        for (var obj in params) {
                            pm.Toastr.error(params[obj][0]);
                        }
                    }

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
            if (!confirm(this.__('Are you sure!', 'pm'))) {
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
                    self.$store.commit('projectTaskLists/afterDeleteList', args.list_id);
                    pm.Toastr.success(res.message);
                    self.listTemplateAction();
                    self.$store.commit('updateProjectMeta', 'total_activities');
                    self.$store.commit('decrementProjectMeta', 'total_task_lists');
                    if (typeof args.callback === 'function') {
                        args.callback.call(self, res);
                    }
                },
                error: function error(res) {
                    res.responseJSON.message.map(function (value, index) {
                        pm.Toastr.error(value);
                    });
                }
            };
            if (args.list_id) {
                self.httpRequest(request_data);
            }
        },


        /**
         * Retrive a single list 
         * @param  {object}   args     condition and list id
         * @param  {Function} callback [description]
         * @return {void}            [description]
         */
        getTask: function getTask(args) {
            var self = this,
                project_id = typeof this.$route.params.project_id == 'undefined' ? args.project_id : this.$route.params.project_id;

            var pre_define = {
                condition: {
                    with: ''
                },
                task_id: false,
                project_id: project_id,
                callback: false
            };

            var args = jQuery.extend(true, pre_define, args);
            var condition = self.generateConditions(args.condition);

            var request = {
                type: 'GET',
                url: self.base_url + '/pm/v2/projects/' + args.project_id + '/tasks/' + args.task_id + '?' + condition,
                success: function success(res) {
                    if (typeof args.callback === 'function') {
                        args.callback.call(self, res);
                    }
                    pm.NProgress.done();
                }
            };

            if (args.task_id) {
                self.httpRequest(request);
            }
        },


        /**
         * Insert  task
         * 
         * @return void
         */
        addTask: function addTask(args, list) {
            var self = this,
                list = list || {},
                pre_define = {
                data: {},
                callback: false
            },
                args = jQuery.extend(true, pre_define, args);
            var data = pm_apply_filters('before_task_save', args.data);
            var request_data = {
                url: self.base_url + '/pm/v2/projects/' + self.project_id + '/tasks',
                type: 'POST',
                data: data,
                success: function success(res) {
                    self.addTaskMeta(res.data);
                    self.$store.commit('projectTaskLists/afterNewTask', {
                        list_id: args.data.list_id,
                        task: res.data,
                        list: list
                    });

                    self.$store.commit('updateProjectMeta', 'total_activities');
                    // Display a success toast, with a title
                    pm.Toastr.success(res.message);
                    self.showHideTaskFrom(false, self.list, self.task);
                    if (typeof args.callback === 'function') {
                        args.callback.call(self, res);
                    }

                    pmBus.$emit('pm_after_create_task', res, args);
                },
                error: function error(res) {
                    // Showing error
                    if (res.status == 500) {
                        res.responseJSON.message.map(function (value, index) {
                            pm.Toastr.error(value);
                        });
                    }

                    if (res.status == 400) {
                        var params = res.responseJSON.data.params;
                        for (var obj in params) {
                            pm.Toastr.error(params[obj][0]);
                        }
                    }

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
                    project_id: self.project_id ? self.project_id : ''
                },
                callback: false
            };
            var args = jQuery.extend(true, pre_define, args);
            var data = pm_apply_filters('before_task_save', args.data);

            var request_data = {
                url: self.base_url + '/pm/v2/projects/' + args.data.project_id + '/tasks/' + args.data.task_id,
                type: 'PUT',
                data: data,
                success: function success(res) {
                    self.addTaskMeta(res.data);

                    self.$store.commit('projectTaskLists/afterUpdateTask', {
                        list_id: args.data.list_id,
                        task: res.data
                    });
                    self.$store.commit('updateProjectMeta', 'total_activities');
                    // Display a success toast, with a title
                    pm.Toastr.success(res.message);
                    self.showHideTaskFrom(false, self.list, self.task);
                    if (typeof args.callback === 'function') {
                        args.callback.call(self, res);
                    }

                    pmBus.$emit('pm_after_update_task', res, args);
                },
                error: function error(res) {
                    // Showing error
                    if (res.status == 500) {
                        res.responseJSON.message.map(function (value, index) {
                            pm.Toastr.error(value);
                        });
                    }
                    if (res.status == 400) {
                        var params = res.responseJSON.data.params;
                        for (var obj in params) {
                            pm.Toastr.error(params[obj][0]);
                        }
                    }

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
            if (!confirm(this.__('Are you sure!', 'pm'))) {
                return;
            }

            var self = this,
                pre_define = {
                callback: false
            };
            var args = jQuery.extend(true, pre_define, args);

            var request_data = {
                url: self.base_url + '/pm/v2/projects/' + self.project_id + '/tasks/' + args.task.id,
                type: 'DELETE',
                success: function success(res) {
                    self.$store.commit('projectTaskLists/afterDeleteTask', {
                        'task': args.task,
                        'list': args.list
                    });
                    self.$store.commit('updateProjectMeta', 'total_activities');
                    pm.Toastr.success(res.message);
                    if (typeof args.callback === 'function') {
                        args.callback.call(self, res);
                    }
                },
                error: function error(res) {
                    res.responseJSON.message.map(function (value, index) {
                        pm.Toastr.error(value);
                    });
                }
            };
            this.httpRequest(request_data);
        },
        addComment: function addComment(args) {
            var self = this,
                project_id = '',
                pre_define = {
                data: {},
                callback: false
            };
            var args = jQuery.extend(true, pre_define, args);
            var data = new FormData();

            if (self.project_id) {
                project_id = self.project_id;
            } else {
                project_id = args.data.project_id;
            }

            data.append('content', args.data.content);
            data.append('mentioned_users', args.data.mentioned_users);
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
                url: self.base_url + '/pm/v2/projects/' + project_id + '/comments',
                type: "POST",
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                success: function success(res) {
                    self.addListCommentMeta(res.data);
                    self.$root.$emit('after_comment');
                    pm.Toastr.success(res.message);
                    self.$store.commit('updateProjectMeta', 'total_activities');
                    if (typeof args.callback === 'function') {
                        args.callback.call(self, res);
                    }
                },
                error: function error(res) {
                    if (res.status == 500) {

                        res.responseJSON.message.map(function (value, index) {
                            pm.Toastr.error(value);
                        });
                    }
                    if (res.status == 400) {
                        var params = res.responseJSON.data.params;
                        for (var obj in params) {
                            pm.Toastr.error(params[obj][0]);
                        }
                    }
                    if (typeof args.callback === 'function') {
                        args.callback.call(self, res);
                    }
                }
            };

            self.httpRequest(request_data);
        },
        updateComment: function updateComment(args) {
            var self = this,
                project_id = '',
                pre_define = {
                data: {},
                callback: false
            };
            var args = jQuery.extend(true, pre_define, args);
            var data = new FormData();
            if (self.project_id) {
                project_id = self.project_id;
            } else {
                project_id = args.data.project_id;
            }
            data.append('content', args.data.content);
            data.append('mentioned_users', args.data.mentioned_users);
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
                url: self.base_url + '/pm/v2/projects/' + project_id + '/comments/' + args.data.id,
                type: "POST",
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                success: function success(res) {
                    self.addListCommentMeta(res.data);
                    pm.Toastr.success(res.message);
                    self.$root.$emit('after_comment');
                    self.$store.commit('updateProjectMeta', 'total_activities');
                    if (typeof args.callback === 'function') {
                        args.callback.call(self, res);
                    }
                },
                error: function error(res) {
                    if (res.status == 500) {
                        res.responseJSON.message.map(function (value, index) {
                            pm.Toastr.error(value);
                        });
                    }
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

            if (list && typeof list.edit_mode != 'undefined') {
                if (status === 'toggle') {
                    list.edit_mode = list.edit_mode ? false : true;
                } else {
                    list.edit_mode = status;
                }
            } else {
                this.$store.commit('projectTaskLists/showHideListFormStatus', status);
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
                    self.$store.commit('projectTaskLists/setTasks', res.data);
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
                    this.$store.commit('projectTaskLists/setTasks', res.data);
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
            var list_index = this.getIndex(this.$store.state.projectTaskLists.lists, task.post_parent, 'ID'),
                task_index = this.getIndex(this.$store.state.projectTaskLists.lists[list_index].tasks, task.ID, 'ID'),
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
            return this.$store.state.projectTaskLists.project_users.filter(function (user) {
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

            this.$store.state.projectTaskLists.projectTaskLists.project_users.map(function (user) {
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

            filtered_users = this.$store.state.projectTaskLists.projectTaskLists.project_users.filter(function (user) {
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
                return 'pm-current-date';
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
            if (task_start_field && start_date && due_date) {
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
        taskDoneUndone: function taskDoneUndone(args) {
            var self = this,
                pre_define = {
                data: {
                    task_id: '',
                    status: 0,
                    project_id: self.project_id ? self.project_id : ''
                },
                callback: false
            },
                args = jQuery.extend(true, pre_define, args);

            var request_data = {
                url: self.base_url + '/pm/v2/projects/' + args.data.project_id + '/tasks/' + args.data.task_id + '/change-status',
                type: 'PUT',
                data: args.data,
                success: function success(res) {
                    if (typeof args.callback === 'function') {
                        args.callback(res);
                    }
                    self.$store.commit('updateProjectMeta', 'total_activities');
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
            this.$store.commit('projectTaskLists/single_task_popup', { task: task });
        },


        /**
         * List templete action to show hide blank templete
         * @return {[type]} [description]
         */
        listTemplateAction: function listTemplateAction() {
            var lists = this.$store.state.projectTaskLists.lists,
                blank,
                listTmpl;

            if (lists.length) {
                blank = false;
                listTmpl = true;
            } else {
                blank = true;
                listTmpl = false;
            }
            this.$store.commit('projectTaskLists/balankTemplateStatus', blank);
            this.$store.commit('projectTaskLists/listTemplateStatus', listTmpl);
        },


        is_assigned: function is_assigned(task) {

            return true;
        },

        privateClass: function privateClass(privacy) {
            if (typeof privacy !== 'undefined') {
                if (privacy == '1') {
                    return 'dashicons dashicons-lock';
                } else {
                    return 'dashicons dashicons-unlock';
                }
            }
        },
        listLockUnlock: function listLockUnlock(list) {

            var self = this;
            var data = {
                is_private: list.meta.privacy == '0' ? 1 : 0
            };
            var request_data = {
                url: self.base_url + '/pm/v2/projects/' + self.project_id + '/task-lists/privacy/' + list.id,
                type: 'POST',
                data: data,
                success: function success(res) {
                    self.$store.commit('projectTaskLists/updateListPrivacy', {
                        privacy: data.is_private,
                        project_id: self.project_id,
                        list_id: list.id

                    });
                },
                error: function error(res) {}
            };
            self.httpRequest(request_data);
        },
        TaskLockUnlock: function TaskLockUnlock(task) {

            var self = this;
            var data = {
                is_private: task.meta.privacy == '0' ? 1 : 0
            };
            var request_data = {
                url: self.base_url + '/pm/v2/projects/' + self.project_id + '/tasks/privacy/' + task.id,
                type: 'POST',
                data: data,
                success: function success(res) {
                    self.$store.commit('projectTaskLists/updateTaskPrivacy', {
                        privacy: data.is_private,
                        project_id: self.project_id,
                        task_id: task.id,
                        list_id: task.task_list.data.id

                    });
                },
                error: function error(res) {
                    res.responseJSON.message.map(function (value, index) {
                        pm.Toastr.error(value);
                    });
                }
            };
            self.httpRequest(request_data);
        },
        taskTimeWrap: function taskTimeWrap(task) {
            var isActive = this.getSettings('task_start_field', false);

            if (isActive) {
                if (typeof task.due_date == 'undefined' && typeof task.start_at == 'undefined') {
                    return false;
                }

                if (!task.due_date.date && !task.start_at.date) {
                    return false;
                }
            } else {
                if (typeof task.due_date == 'undefined') {
                    return false;
                }

                if (!task.due_date.date) {
                    return false;
                }
            }

            return true;
        },
        getMatches: function getMatches(string, regex, index) {
            index || (index = 1);

            var matches = [];
            var match;
            while (match = regex.exec(string)) {
                matches.push(match[index]);
            }

            return matches;
        }
    }
};

exports.default = PM_TaskList_Mixin;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

var core = module.exports = { version: '2.5.7' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_do_action_vue__ = __webpack_require__(29);
/* empty harmony namespace reexport */
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_do_action_vue__["a" /* default */],
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/components/common/do-action.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-92d70bf6", Component.options)
  } else {
    hotAPI.reload("data-v-92d70bf6", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(11)(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 7 */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),
/* 8 */,
/* 9 */,
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_pagination_vue__ = __webpack_require__(32);
/* empty harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_6ddfcbc6_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_pagination_vue__ = __webpack_require__(92);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_pagination_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_6ddfcbc6_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_pagination_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/components/common/pagination.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-6ddfcbc6", Component.options)
  } else {
    hotAPI.reload("data-v-6ddfcbc6", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),
/* 12 */,
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(7);
var core = __webpack_require__(4);
var ctx = __webpack_require__(65);
var hide = __webpack_require__(15);
var has = __webpack_require__(14);
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
    if (own && has(exports, key)) continue;
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
/* 14 */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(17);
var createDesc = __webpack_require__(50);
module.exports = __webpack_require__(6) ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(20);
var IE8_DOM_DEFINE = __webpack_require__(66);
var toPrimitive = __webpack_require__(71);
var dP = Object.defineProperty;

exports.f = __webpack_require__(6) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
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
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_notify_user_vue__ = __webpack_require__(31);
/* empty harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_39a04148_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_notify_user_vue__ = __webpack_require__(89);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(97)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_notify_user_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_39a04148_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_notify_user_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/components/common/notify-user.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-39a04148", Component.options)
  } else {
    hotAPI.reload("data-v-39a04148", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_text_editor_vue__ = __webpack_require__(33);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_3fcc7e9a_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_text_editor_vue__ = __webpack_require__(90);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_text_editor_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_3fcc7e9a_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_text_editor_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/components/common/text-editor.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-3fcc7e9a", Component.options)
  } else {
    hotAPI.reload("data-v-3fcc7e9a", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(16);
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),
/* 21 */
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),
/* 22 */
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(47);
var defined = __webpack_require__(21);
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),
/* 24 */,
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_file_uploader_vue__ = __webpack_require__(30);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_615029ec_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_file_uploader_vue__ = __webpack_require__(91);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_file_uploader_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_615029ec_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_file_uploader_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/components/common/file-uploader.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-615029ec", Component.options)
  } else {
    hotAPI.reload("data-v-615029ec", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    data: function data() {
        return {};
    },

    methods: {
        // saveSettings (settings, callback) {
        //     var settings = this.formatSettings(settings),
        //         self = this;

        //     var request = {
        //         url: self.base_url + '/pm/v2/settings',
        //         data: {
        //             settings: settings
        //         },
        //         type: 'POST',
        //         success (res) {
        //             pm.Toastr.success(res.message);
        //             if (typeof callback !== 'undefined') {
        //                 callback();
        //             }
        //         }
        //     };

        //     self.httpRequest(request);
        // },

        // formatSettings (settings) {
        //     var data = [];

        //     jQuery.each(settings, function(name, value) {
        //         data.push({
        //             key: name,
        //             value: value
        //         });
        //     });

        //     return data;
        // },

        // getSettings (key, pre_define ) {
        //     var pre_define   = pre_define || false,
        //         settings  = PM_Vars.settings;

        //     if ( typeof PM_Vars.settings[key] === 'undefined' ) {
        //         return pre_define;
        //     }

        //     return PM_Vars.settings[key];

        // }
    }
};

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mixin = __webpack_require__(3);

var _mixin2 = _interopRequireDefault(_mixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    data: function data() {
        return {
            base_url: PM_Vars.base_url + '/' + PM_Vars.rest_api_prefix,
            project_id: typeof this.$route === 'undefined' ? false : parseInt(this.$route.params.project_id),
            current_user: PM_Vars.current_user,
            avatar_url: PM_Vars.avatar_url,
            text: PM_Vars.text,
            PM_Vars: PM_Vars,
            pm: pm,
            taskLists: _mixin2.default,
            currentDate: pm.Moment(new Date()).format('YYYY-MM-DD')
        };
    },
    created: function created() {
        setLocaleData(PM_Vars.language.pm);
    },


    methods: {
        __: function (_) {
            function __(_x, _x2) {
                return _.apply(this, arguments);
            }

            __.toString = function () {
                return _.toString();
            };

            return __;
        }(function (text, domain) {
            return __(text, domain);
        }),

        sprintf: sprintf,
        user_can: function user_can(cap) {
            return pmUserCan(cap, this.$store.state.project);
        },
        is_user_in_project: function is_user_in_project() {
            return pmIsUserInProject(this.$store.state.project);
        },
        is_manager: function is_manager(project) {
            var project = project || this.$store.state.project;
            return pmIsManager(project);
        },
        has_manage_capability: function has_manage_capability() {
            return pmHasManageCapability();
        },
        has_create_capability: function has_create_capability() {
            return pmHasCreateCapability();
        },
        intersect: function intersect(a, b) {
            var d = {};
            var results = [];
            for (var i = 0; i < b.length; i++) {
                d[b[i]] = true;
            }
            for (var j = 0; j < a.length; j++) {
                if (d[a[j]]) results.push(a[j]);
            }
            return results;
        },
        can_edit_comment: function can_edit_comment(commnet) {
            var user = PM_Vars.current_user;
            if (commnet.commentable_type == 'task_activity') {
                return false;
            }
            if (this.is_manager()) {
                return true;
            }
            if (commnet.creator.data.id == user.ID) {
                return true;
            }

            return false;
        },
        pad2: function pad2(number) {
            return (number < 10 ? '0' : '') + number;
        },
        stringToTime: function stringToTime(seconds) {
            var numdays = Math.floor(seconds / 86400);

            var numhours = Math.floor(seconds % 86400 / 3600);

            var numminutes = Math.floor(seconds % 86400 % 3600 / 60);

            var numseconds = seconds % 86400 % 3600 % 60;

            return {
                'days': this.pad2(numdays),
                'hours': this.pad2(numhours),
                'minutes': this.pad2(numminutes),
                'seconds': this.pad2(numseconds)
            };
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

            date = new Date(date);
            date = pm.Moment(date).format('YYYY-MM-DD');

            var format = 'MMM DD';

            return pm.Moment(date).format(String(format));
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
        taskDateFormat: function taskDateFormat(date) {
            if (!date) {
                return;
            }

            date = new Date(date);
            return pm.Moment(date).format('MMMM DD');
        },
        getSettings: function getSettings(key, pre_define, objKey) {

            var pre_define = typeof pre_define == 'undefined' ? false : pre_define,
                objKey = typeof objKey == 'undefined' ? false : objKey,
                settings = PM_Vars.settings;
            if (objKey) {
                if (typeof PM_Vars.settings[objKey] === 'undefined') {
                    return pre_define;
                }
                if (typeof PM_Vars.settings[objKey][key] === 'undefined') {
                    return pre_define;
                }

                if (PM_Vars.settings[objKey][key] === "true") {
                    return true;
                } else if (PM_Vars.settings[objKey][key] === "false") {
                    return false;
                } else {
                    return PM_Vars.settings[objKey][key];
                }
            }

            if (typeof PM_Vars.settings[key] == 'undefined') {
                return pre_define;
            }

            if (PM_Vars.settings[key] == "true") {
                return true;
            } else if (PM_Vars.settings[key] == "false") {
                return false;
            } else {
                return PM_Vars.settings[key];
            }
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
        httpRequest: function httpRequest(property) {
            var before = function before(xhr) {
                xhr.setRequestHeader("Authorization_name", btoa('asaquzzaman')); //btoa js encoding base64_encode
                xhr.setRequestHeader("Authorization_password", btoa(12345678)); //atob js decode base64_decode

                xhr.setRequestHeader("X-WP-Nonce", PM_Vars.permission);
            };

            property.beforeSend = typeof property.beforeSend === 'undefined' ? before : property.beforeSend;

            return jQuery.ajax(property);
        },
        registerStore: function registerStore(module_name, store) {
            if (typeof store === 'undefined') {
                return false;
            }

            var self = this;
            if (typeof store !== 'undefined') {
                var mutations = store.mutations || {}; //self.$options.mutations;
                var state = store.state || {}; //self.$options.state;
            }

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
                }
            },
                args = jQuery.extend(true, pre_define, args);
            args = pm_apply_filters('before_project_save', args);
            var request = {
                type: 'POST',
                url: this.base_url + '/pm/v2/projects/',
                data: args.data,
                success: function success(res) {
                    jQuery("#pm-project-dialog").dialog('destroy');
                    self.$root.$store.commit('newProject', res.data);
                    self.showHideProjectForm(false);
                    self.resetSelectedUsers();
                    pm.Toastr.success(res.message);

                    if (typeof args.callback === 'function') {
                        args.callback(res);
                    }
                },
                error: function error(res) {
                    if (res.status == 400) {
                        var params = res.responseJSON.data.params;
                        for (var obj in params) {
                            pm.Toastr.error(params[obj][0]);
                        }
                    }
                    if (res.status == 500) {
                        res.responseJSON.message.map(function (value, index) {
                            pm.Toastr.error(value);
                        });
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
                    status: 'incomplete'
                },
                callback: false
            },
                args = jQuery.extend(true, pre_define, args);
            args = pm_apply_filters('before_project_save', args);
            var request = {
                type: 'PUT',
                url: this.base_url + '/pm/v2/projects/' + args.data.id,
                data: args.data,
                success: function success(res) {

                    self.$root.$store.commit('updateProject', res.data);
                    pm.Toastr.success(res.message);
                    self.showHideProjectForm(false);
                    jQuery("#pm-project-dialog").dialog("close");
                    self.resetSelectedUsers();
                    self.$store.commit('updateProjectMeta', 'total_activities');
                    if (typeof args.callback === 'function') {
                        args.callback.call(self, res);
                    }
                },
                error: function error(res) {
                    if (res.status == 400) {
                        var params = res.responseJSON.data.params;
                        for (var obj in params) {
                            pm.Toastr.error(params[obj][0]);
                        }
                    }
                    if (res.status == 500) {
                        res.responseJSON.message.map(function (value, index) {
                            pm.Toastr.error(value);
                        });
                    }
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
        getProjects: function getProjects(args) {

            var self = this;
            var pre_define = {
                conditions: {
                    status: '',
                    per_page: this.getSettings('project_per_page', 10),
                    page: this.setCurrentPageNumber(),
                    category: typeof this.$route.query.category !== 'undefined' ? this.$route.query.category[0] : ''
                }
            };

            var args = jQuery.extend(true, pre_define, args);
            var conditions = pm_apply_filters('before_get_project', args.conditions);
            conditions = self.generateConditions(conditions);

            var request_data = {
                url: self.base_url + '/pm/v2/projects?' + conditions,
                success: function success(res) {
                    res.data.map(function (project) {
                        self.addProjectMeta(project);
                    });

                    self.$store.commit('setProjects', { 'projects': res.data });
                    self.$store.commit('setProjectsMeta', res.meta);

                    pm.NProgress.done();
                    self.loading = false;

                    if (typeof args.callback != 'undefined') {
                        args.callback(res.data);
                    }

                    pmProjects = res.data;
                }
            };

            self.httpRequest(request_data);
        },
        setCurrentPageNumber: function setCurrentPageNumber() {
            var current_page_number = this.$route.params.current_page_number ? this.$route.params.current_page_number : 1;
            this.current_page_number = current_page_number;
            return current_page_number;
        },
        getProject: function getProject(args) {
            var self = this;
            var pre_define = {
                conditions: {},
                project_id: this.project_id,
                callback: false
            };

            var args = jQuery.extend(true, pre_define, args);
            var conditions = self.generateConditions(args.conditions);

            if (typeof args.project_id === 'undefined') {
                return;
            }

            self.httpRequest({
                url: self.base_url + '/pm/v2/projects/' + args.project_id + '?' + conditions,
                success: function success(res) {

                    if (typeof args.callback === 'function') {
                        args.callback.call(self, res);
                    }
                },
                error: function error(res) {
                    if (res.status === 404) {
                        pm.Toastr.success(res.responseJSON.message);
                    }

                    self.$router.push({
                        name: 'project_lists'
                    });
                }
            });
        },
        getUser: function getUser(args) {
            var self = this;
            var pre_define = {
                data: {},
                conditions: {},
                callback: false
            };

            var args = jQuery.extend(true, pre_define, args);
            var conditions = self.generateConditions(args.conditions);

            if (typeof args.data.user_id === 'undefined') {
                return;
            }

            self.httpRequest({
                url: self.base_url + '/pm/v2/users/' + args.data.user_id + '?' + conditions,
                success: function success(res) {
                    if (typeof args.callback === 'function') {
                        args.callback.call(self, res);
                    }
                }
            });
        },
        get_search_user: function get_search_user(args) {
            var self = this;
            var pre_define = {
                data: {},
                conditions: {},
                callback: false
            };

            var args = jQuery.extend(true, pre_define, args);
            var conditions = self.generateConditions(args.conditions);

            var request = {
                url: self.base_url + '/pm/v2/users/search?' + conditions,
                success: function success(res) {
                    if (typeof args.callback === 'function') {
                        args.callback.call(self, res);
                    }
                }
            };

            return self.httpRequest(request);
        },
        getGloabalProject: function getGloabalProject() {
            var args = {
                callback: function callback(res) {
                    this.addProjectMeta(res.data);
                    this.$root.$store.commit('setProject', res.data);
                    this.$root.$store.commit('setProjectMeta', res.meta);
                    this.$root.$store.commit('setProjectUsers', res.data.assignees.data);
                    pmBus.$emit('pm_after_fetch_project', res.data);
                }
            };
            this.$root.$store.state.project_switch = false;
            var project = this.$root.$store.state.project;
            if (!project.hasOwnProperty('id') || project.id !== this.project_id) {
                this.$root.$store.commit('setDefaultLoaded');
                this.getProject(args);
            } else {
                pmBus.$emit('pm_after_fetch_project', project);
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

            jQuery.each(itemList, function (key, item) {

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
        deleteProject: function deleteProject(id, project) {
            if (!confirm(this.__('Are you sure to delete this project?', 'pm'))) {
                return;
            }
            var self = this;
            var request_data = {
                url: self.base_url + '/pm/v2/projects/' + id,
                type: 'DELETE',
                success: function success(res) {
                    self.$store.commit('afterDeleteProject', id);
                    self.$store.commit('afterDeleteProjectCount', { project: project });
                    pm.Toastr.success(res.message);
                    var total_page = self.$store.state.pagination.total_pages;

                    if (self.project_id || !self.$store.state.projects.length) {
                        self.$router.push({
                            name: 'project_lists'
                        });

                        if (total_page > 1 && typeof self.$route.params.current_page_number == 'undefined') {
                            self.getProjects();
                        }
                    } else {
                        //self.getProjects();
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
                if (key) {
                    query = query + condition + '=' + key + '&';
                }
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
        },
        arrayDiffer: function arrayDiffer(arr1, arr2) {
            var diff = [];
            arr1.forEach(function (arr) {
                if (arr2.indexOf(arr) > -1) {
                    diff.push(arr);
                }
            });
            return diff;
        },
        saveSettings: function saveSettings(settings, project_id, callback) {
            settings = this.formatSettings(settings), project_id = project_id || false, self = this;

            var url = project_id ? self.base_url + '/pm/v2/projects/' + project_id + '/settings' : self.base_url + '/pm/v2/settings';

            var request = {
                url: url,
                data: {
                    settings: settings
                },
                type: 'POST',
                success: function success(res) {
                    pm.Toastr.success(res.message);
                    if (typeof callback !== 'undefined') {
                        callback(res.data);
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
        getViewType: function getViewType(callback) {
            var is_need_fetch_view_type = this.$store.state.is_need_fetch_view_type;

            if (!is_need_fetch_view_type) {
                callback({
                    'value': this.$store.state.listView
                });
                return;
            }

            var self = this;
            var request = {
                url: self.base_url + '/pm/v2/projects/' + this.project_id + '/settings?key=list_view_type',
                data: {},
                type: 'GET',
                success: function success(res) {
                    self.$store.commit('is_need_fetch_view_type', false);
                    if (res.length) {
                        self.setViewType(res.data.value);
                    } else {
                        self.setViewType('list');
                    }

                    if (typeof callback !== 'undefined') {
                        callback(res.data);
                    }
                }
            };

            self.httpRequest(request);
        },
        setViewType: function setViewType(view_type) {
            this.$store.commit('listViewType', view_type);
        },
        getClients: function getClients() {

            var project = this.$store.state.project,
                assignees = this.$store.state.project.assignees.data;

            return assignees.filter(function (user) {

                var roles = user.roles.data.filter(function (role) {
                    return role.slug == 'client' ? true : false;
                });

                return roles.length ? true : false;
            });
        },
        myTaskRedirect: function myTaskRedirect(userid) {
            var current_user = PM_Vars.current_user.ID;

            if (!PM_Vars.is_pro) {
                return this.$router.resolve({ name: 'my-tasks' }).href;
            }

            if (userid == current_user) {
                return this.$router.resolve({ name: 'mytask-tasks' }).href;
            }

            return this.$router.resolve({ name: 'mytask-tasks', params: { user_id: userid } }).href;
        },
        fileDownload: function fileDownload(fileId) {
            window.location.href = this.base_url + '/pm/v2/projects/' + this.project_id + '/files/' + fileId + '/users/' + PM_Vars.current_user.ID + '/download';
        },
        getDownloadUrl: function getDownloadUrl(fileId) {
            return this.base_url + '/pm/v2/projects/' + this.project_id + '/files/' + fileId + '/users/' + PM_Vars.current_user.ID + '/download';
        },
        copy: function copy(text) {
            var $temp = $("<input>");
            $("body").append($temp);
            $temp.val(text).select();
            document.execCommand("copy");
            $temp.remove();
        },
        deleteSettings: function deleteSettings(key, pre_define) {
            var pre_define = pre_define || false,
                settings = PM_Vars.settings;

            if (typeof PM_Vars.settings[key] === 'undefined') {
                return pre_define;
            }

            return PM_Vars.settings[key];
        }
    }
};

/***/ }),
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({
    props: ['value', 'dependency'],
    data: function data() {
        return {
            dateValue: ''
        };
    },
    created: function created() {
        if (!this.value) {
            return '';
        }
        var date = new Date(this.value);
        date = pm.Moment(date).format('YYYY-MM-DD');
        this.dateValue = date;
    },

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

        jQuery(self.$el).on("change", function () {
            var date = jQuery(self.$el).val();
            self.$emit('input', date);
        });
    }
});

/***/ }),
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helpers_mixin_mixin__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helpers_mixin_mixin___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__helpers_mixin_mixin__);




function PMGetComponents() {
    var components = {};

    weDevs_PM_Components.map(function (obj, key) {
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
    props: {
        hook: {
            type: String,
            required: true
        },

        actionData: {
            type: [Object, Array, String, Number],

            default: function _default() {
                return {};
            }
        }
    },

    components: PMGetComponents(),

    render: function render(h) {
        this.$options.components = PMGetComponents();

        var components = [],
            self = this;

        weDevs_PM_Components.map(function (obj, key) {
            if (obj.hook == self.hook) {
                components.push(Vue.compile('<' + obj.component + ' :actionData="actionData"></' + obj.component + '>').render.call(self));
            }
        });

        return h('span', {}, components);
    }
};

/* harmony default export */ __webpack_exports__["a"] = (action);

/***/ }),
/* 30 */
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

// Register a global custom directive called v-pm-popup-box
Vue.directive('pm-uploader', {
    inserted: function inserted(el, binding, vnode) {
        new PM_Uploader(el, 'pm-upload-container', vnode.context);
    },

    update: function update(el, binding, vnode) {
        //new PM_Uploader('pm-upload-pickfiles', 'pm-upload-container', vnode.context );
    }
});

/* harmony default export */ __webpack_exports__["a"] = ({
    props: {
        files: {
            type: Array,
            default: function _default() {
                return [];
            }
        },
        delete: {
            type: Array,
            default: function _default() {
                return [];
            }
        },
        single: {
            type: Boolean,
            default: false
        }
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
        },
        test: function test() {}
    }
});

/***/ }),
/* 31 */
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
    props: {
        value: {
            type: [Array],
            default: function _default() {
                return [];
            }
        },
        users: {
            type: [Array],
            default: function _default() {
                return this.$root.$store.state.project_users;
            }
        }
    },
    data: function data() {
        return {
            notify_users: this.value,
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
        },
        value: function value(v) {
            this.notify_users = v;
        }
    },
    computed: {
        assain_users: function assain_users() {
            var _this = this;

            return this.users.filter(function (user) {
                return user.id !== _this.current_user.ID;
            });
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
/* 32 */
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

    data: function data() {
        return {
            route_query: this.$route.query
        };
    },


    watch: {
        '$route': function $route(url) {
            this.route_query = url.query;
        }
    },

    methods: {
        pageClass: function pageClass(page) {
            if (page == this.current_page_number) {
                return 'page-numbers current';
            }

            return 'page-numbers';
        }
    }
});

/***/ }),
/* 33 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty__ = __webpack_require__(60);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty__);

//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({

    watch: {
        content: {
            handler: function handler(html) {
                if (html.html == '') {

                    tinymce.get(this.editor_id).setContent(html.html);
                    tinymce.get(this.editor_id).save();
                }
            },

            deep: true
        }
    },

    // Get passing data for this component.
    props: ['editor_id', 'content'],

    // Initial action for this component
    mounted: function mounted() {
        var _settings;

        var self = this;

        if (tinymce.get(this.editor_id)) {
            tinymce.execCommand('mceRemoveEditor', false, this.editor_id);
        }

        // Instantiate the editor
        var settings = (_settings = {
            selector: 'textarea#' + self.editor_id,
            menubar: false,
            placeholder: self.__('Write a comment...', 'pm'),
            branding: false
        }, __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default()(_settings, 'menubar', false), __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default()(_settings, 'setup', function setup(editor) {
            editor.on('change', function () {
                self.content.html = editor.getContent();
            });
            editor.on('keyup', function (event) {
                self.content.html = editor.getContent();
            });
            editor.on('NodeChange', function () {
                self.content.html = editor.getContent();
            });
        }), __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default()(_settings, 'external_plugins', PM_Vars.todo_list_text_editor.external_plugins), __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default()(_settings, 'fontsize_formats', '10px 11px 13px 14px 16px 18px 22px 25px 30px 36px 40px 45px 50px 60px 65px 70px 75px 80px'), __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default()(_settings, 'font_formats', 'Arial=arial,helvetica,sans-serif;' + 'Comic Sans MS=comic sans ms,sans-serif;' + 'Courier New=courier new,courier;' + 'Georgia=georgia,palatino;' + 'Lucida=Lucida Sans Unicode, Lucida Grande, sans-serif;' + 'Tahoma=tahoma,arial,helvetica,sans-serif;' + 'Times New Roman=times new roman,times;' + 'Trebuchet MS=trebuchet ms,geneva;' + 'Verdana=verdana,geneva;'), __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default()(_settings, 'plugins', PM_Vars.todo_list_text_editor.plugins), __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default()(_settings, 'toolbar1', 'shortcodes bold italic strikethrough bullist numlist alignleft aligncenter alignjustify alignright link wp_adv'), __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default()(_settings, 'toolbar2', 'formatselect forecolor backcolor underline blockquote hr code'), __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default()(_settings, 'toolbar3', 'fontselect fontsizeselect removeformat undo redo'), _settings);

        if (PmProComment.hasOwnProperty('mentions')) {
            PmProComment.mentions['source'] = self.$store.state.project_users;
            settings = jQuery.extend(settings, PmProComment);
        }

        tinymce.init(settings);
    }
});

/***/ }),
/* 34 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__task_comments_vue__ = __webpack_require__(86);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_do_action_vue__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__mixin__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__mixin___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__mixin__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_vue_multiselect__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_vue_multiselect___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_vue_multiselect__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
    props: {
        taskId: {
            type: [Number, Boolean, String],
            default: function _default() {
                return false;
            }
        },
        projectId: {
            type: [Number, Boolean, String],
            default: function _default() {
                return false;
            }
        }
    },
    data: function data() {
        return {
            loading: true,
            is_task_title_edit_mode: false,
            is_task_details_edit_mode: false,
            is_task_date_edit_mode: false,
            is_enable_multi_select: false,
            task_description: '',
            update_description: __('Update Description', 'pm'),
            task_id: this.$route.params.task_id,
            list: {},
            task: {},
            assigned_to: []
        };
    },

    mixins: [__WEBPACK_IMPORTED_MODULE_2__mixin___default.a],

    watch: {
        is_enable_multi_select: function is_enable_multi_select(val) {

            if (val) {
                pm.Vue.nextTick(function () {
                    jQuery('.multiselect__input').show().focus();
                });
            }
        }
    },

    computed: {
        doActionData: function doActionData() {
            return {
                task: this.task,
                list: this.list,
                is_single_task_open: true
            };
        },


        project_users: function project_users() {
            return this.$root.$store.state.project_users;
        },
        task_users: function task_users() {
            if (jQuery.isEmptyObject(this.$store.state.projectTaskLists.task)) {
                return [];
            }
            return this.$store.state.projectTaskLists.task.assignees.data;
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
                this.assigned_to = this.task.assignees.data.map(function (user) {
                    return user.id;
                });
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

                this.task.assignees.data = selected_users;

                this.updateTaskElement(this.task);
            }
        }
    },

    components: {
        'task-comments': __WEBPACK_IMPORTED_MODULE_0__task_comments_vue__["a" /* default */],
        'multiselect': __WEBPACK_IMPORTED_MODULE_3_vue_multiselect___default.a,
        'do-action': __WEBPACK_IMPORTED_MODULE_1__common_do_action_vue__["default"]
    },

    created: function created() {
        this.getSelfTask();
        window.addEventListener('click', this.windowActivity);
        this.$root.$on('pm_date_picker', this.fromDate);
    },

    methods: {
        copyUrl: function copyUrl(task) {
            pmBus.$emit('pm_generate_task_url', task);
            // var url  = PM_Vars.project_page + '#' + this.$route.path + '/tasks/' + task.id; 
            // this.copy(url);
        },
        lineThrough: function lineThrough(task) {
            if (task.status) {
                return 'pm-line-through';
            }
        },

        singleTaskDoneUndone: function singleTaskDoneUndone() {
            var self = this,
                status = !this.task.status ? 1 : 0;
            var args = {
                data: {
                    task_id: this.task.id ? this.task.id : this.taskId,
                    status: status,
                    project_id: this.task.project_id
                },
                callback: function callback(res) {
                    if (status == '1') {
                        self.task.status = true;
                    } else {
                        self.task.status = false;
                    }

                    pmBus.$emit('pm_after_task_doneUndone', res);
                }
            };
            this.taskDoneUndone(args);
        },
        getSelfTask: function getSelfTask() {
            var self = this;
            var args = {
                condition: {
                    with: 'boards,comments'
                },
                task_id: self.task_id ? self.task_id : this.taskId,
                project_id: self.projectId ? self.projectId : self.project_id,
                callback: function callback(res) {
                    if (typeof res.data === 'undefined') {
                        pm.Toastr.error(res.message);
                        self.$router.go(-1);
                        return;
                    }
                    self.addMeta(res.data);
                    //self.list = res.data.boards.data[0];
                    //self.$store.commit('projectTaskLists/setSingleTask', res.data);
                    self.task = res.data;

                    self.loading = false;
                }
            };

            this.getTask(args);
        },
        addMeta: function addMeta(task) {
            task.edit_mode = false;

            if (task.status === 'complete') {
                task.status = true;
            } else {
                task.status = false;
            }

            task.comments.data.map(function (comment) {
                comment.edit_mode = false;
            });
        },


        isEnableMultiSelect: function isEnableMultiSelect() {
            if (!this.can_edit_task(this.task)) {
                return false;
            }
            this.is_enable_multi_select = true;

            pm.Vue.nextTick(function () {
                jQuery('.multiselect__input').focus();
            });
        },

        fromDate: function fromDate(date) {
            if (date.field == 'datepicker_from') {

                if (this.task.due_date.date) {
                    var start = new Date(date.date);
                    var end = new Date(this.task.due_date.date);
                    var compare = pm.Moment(end).isBefore(start);

                    if (this.task_start_field && compare) {
                        pm.Toastr.error('Invalid date range!');
                        return;
                    }
                }

                this.task.start_at.date = date.date;

                this.updateTaskElement(this.task);
            }

            if (date.field == 'datepicker_to') {

                if (this.task.start_at.date) {
                    var start = new Date(this.task.start_at.date);
                    var end = new Date(date.date);
                    var compare = pm.Moment(end).isBefore(start);

                    if (this.task_start_field && compare) {
                        pm.Toastr.error('Invalid date range!');
                        return;
                    }
                }

                var task = this.task;

                var start = new Date(task.start_at),
                    due = new Date(date.date);

                if (!this.$store.state.projectTaskLists.permissions.task_start_field) {
                    task.due_date.date = date.date;
                    this.updateTaskElement(task);
                } else if (start <= due) {
                    task.due_date.date = date.date;
                    this.updateTaskElement(task);
                }
            }
        },
        updateTaskPrivacy: function updateTaskPrivacy(task, status) {
            task.task_privacy = status;
            this.updateTaskElement(task);
        },
        isTaskDetailsEditMode: function isTaskDetailsEditMode() {
            if (!this.can_edit_task(this.task)) {
                this.is_task_details_edit_mode = false;
            } else {
                this.task_description = this.task.description.content;
                this.is_task_details_edit_mode = true;
            }

            pm.Vue.nextTick(function () {
                jQuery('.pm-desc-field').focus();
            });
        },

        updateDescription: function updateDescription(task, event) {
            if (event.keyCode == 13 && event.shiftKey) {
                return;
            }

            if (this.task_description.trim() == task.description.content) {
                return;
            }
            task.description.content = this.task_description.trim();
            this.is_task_details_edit_mode = false, this.updateTaskElement(task);
        },

        closePopup: function closePopup() {
            pmBus.$emit('pm_after_close_single_task_modal');
            return;
            this.$router.go(-1);
            return;
            var history = this.$store.state.history;

            if (!history.from.name) {
                this.$router.push({
                    name: 'task_lists',
                    params: {
                        project_id: this.$route.params.project_id
                    }
                });
            } else {
                this.$router.push(history.from);
            }
        },

        singleTaskTitle: function singleTaskTitle(task) {
            return task.completed ? 'pm-task-complete' : 'pm-task-incomplete';
        },

        updateTaskElement: function updateTaskElement(task) {
            var start = new Date(task.start_at.date);
            var end = new Date(task.due_date.date);
            var compare = pm.Moment(end).isBefore(start);
            var project_id = this.project_id ? this.project_id : task.project_id;

            if (task.start_at.date && task.due_date.date && this.task_start_field && compare) {
                pm.Toastr.error('Invalid date range!');
                return;
            }

            var update_data = {
                'title': task.title,
                'description': task.description.content,
                'estimation': task.estimation,
                'start_at': task.start_at ? task.start_at.date : '',
                'due_date': task.due_date ? task.due_date.date : '',
                'complexity': task.complexity,
                'priority': task.priority,
                'order': task.order,
                'payable': task.payable,
                'recurrent': task.recurrent,
                'status': task.status ? 1 : 0,
                'category_id': task.category_id,
                'assignees': this.assigned_to
            },
                self = this,
                url = this.base_url + '/pm/v2/projects/' + project_id + '/tasks/' + task.id;

            var request_data = {
                url: url,
                data: update_data,
                type: 'PUT',
                success: function success(res) {
                    pmBus.$emit('pm_after_update_single_task', res);
                    self.is_task_title_edit_mode = false;
                    self.is_task_details_edit_mode = false;
                    self.is_enable_multi_select = false;
                    self.task.description = res.data.description;
                    self.$store.commit('updateProjectMeta', 'total_activities');
                },
                error: function error(res) {
                    res.responseJSON.message.map(function (value, index) {
                        pm.Toastr.error(value);
                    });
                }
            };

            this.httpRequest(request_data);
        },

        isTaskTitleEditMode: function isTaskTitleEditMode() {
            if (!this.can_edit_task(this.task)) {
                return this.is_task_title_edit_mode = false;
            }
            return this.is_task_title_edit_mode = true;
        },

        isTaskDateEditMode: function isTaskDateEditMode() {
            if (!this.can_edit_task(this.task)) {
                return this.is_task_date_edit_mode = false;
            }
            return this.is_task_date_edit_mode = true;
        },

        windowActivity: function windowActivity(el) {
            var title_blur = jQuery(el.target).hasClass('pm-task-title-activity'),
                dscription_blur = jQuery(el.target).closest('.pm-des-area'),
                assign_user = jQuery(el.target).closest('.pm-assigned-user-wrap');

            if (!title_blur) {
                this.is_task_title_edit_mode = false;
            }

            if (!dscription_blur.length) {
                this.is_task_details_edit_mode = false;
            }

            if (!assign_user.length) {
                this.is_enable_multi_select = false;
            }

            this.datePickerDispaly(el);
        },

        datePickerDispaly: function datePickerDispaly(el) {
            var date_picker_blur = jQuery(el.target).closest('.pm-task-date-wrap').hasClass('pm-date-window');

            if (!date_picker_blur) {
                this.is_task_date_edit_mode = false;
            }
        },

        singleTaskLockUnlock: function singleTaskLockUnlock(task) {
            var self = this;
            var data = {
                is_private: task.meta.privacy == '0' ? 1 : 0
            };
            var request_data = {
                url: self.base_url + '/pm/v2/projects/' + task.project_id + '/tasks/privacy/' + task.id,
                type: 'POST',
                data: data,
                success: function success(res) {
                    task.meta.privacy = data.is_private;
                },
                error: function error(res) {
                    res.responseJSON.message.map(function (value, index) {
                        pm.Toastr.error(value);
                    });
                }
            };
            self.httpRequest(request_data);
        }
    },

    destroyed: function destroyed() {
        this.$store.commit('isSigleTask', false);
        pmBus.$emit('pm_before_destroy_single_task', this.task);
    }
});

/***/ }),
/* 35 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_common_text_editor_vue__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_common_file_uploader_vue__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_common_notify_user_vue__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__mixin__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__mixin___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__mixin__);
//
//
//
//
//
//
//
//
//
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
    props: {
        comment: {
            type: [Object],
            default: function _default() {
                return {};
            }
        },

        comments: {
            type: [Array],
            default: function _default() {
                return [];
            }
        },

        task: {
            type: [Object],
            default: function _default() {
                return {
                    id: false
                };
            }
        }
    },

    mixins: [__WEBPACK_IMPORTED_MODULE_3__mixin___default.a],

    data: function data() {
        return {
            submit_disabled: false,
            show_spinner: false,
            content: {
                html: typeof this.comment.content == 'undefined' ? '' : this.comment.content
            },
            task_id: typeof this.task.id == 'undefined' ? false : this.task.id,
            files: typeof this.comment.files === 'undefined' ? [] : this.comment.files.data,
            deleted_files: [],
            mentioned_user_ids: null,
            add_new_comment: __('Add New Comment', 'pm'),
            update_comment: __('Update Comment', 'pm'),
            notify_users: []
        };
    },


    components: {
        'text-editor': __WEBPACK_IMPORTED_MODULE_0__components_common_text_editor_vue__["a" /* default */],
        'file-uploader': __WEBPACK_IMPORTED_MODULE_1__components_common_file_uploader_vue__["a" /* default */],
        notifyUser: __WEBPACK_IMPORTED_MODULE_2__components_common_notify_user_vue__["default"]
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
            handler: function handler(new_content) {
                this.comment.content = new_content.html;
            },

            deep: true
        }
    },

    computed: {
        /**
        * Editor ID
        * 
        * @return string
        */
        editor_id: function editor_id() {
            var comment_id = typeof this.comment.id === 'undefined' ? '' : '-' + this.comment.id;
            return 'pm-comment-editor' + comment_id;
        }
    },
    methods: {
        taskCommentAction: function taskCommentAction() {
            var regEx = /data-pm-user-id=":(.+?):"/g;
            this.mentioned_user_ids = this.getMatches(this.comment.content, regEx, 1);

            // Prevent sending request when multiple click submit button 
            if (this.submit_disabled) {
                return;
            }
            if (typeof this.comment.content === 'undefined' || this.comment.content == '') {
                return;
            }
            // Disable submit button for preventing multiple click
            this.submit_disabled = true;
            // Showing loading option 
            this.show_spinner = true;
            var self = this;

            var args = {
                data: {
                    commentable_id: self.task_id,
                    content: self.comment.content,
                    commentable_type: 'task',
                    deleted_files: self.deleted_files || [],
                    mentioned_users: self.mentioned_user_ids,
                    files: self.files || [],
                    project_id: self.task.project_id,
                    notify_users: this.notify_users
                }
            };

            if (typeof this.comment.id !== 'undefined') {
                args.data.id = this.comment.id;
                args.callback = function (res) {
                    var index = self.getIndex(self.comments, self.comment.id, 'id');
                    self.comments.splice(index, 1, res.data);
                };

                self.updateComment(args);
            } else {

                args.callback = function (res) {
                    self.comments.push(res.data);
                    self.submit_disabled = false;
                    self.show_spinner = false;
                    self.content.html = '';
                    self.comment.content = '';
                    self.notify_users = [];
                    self.files = [];
                    self.deleted_files = [];
                };
                self.addComment(args);
            }
        }
    }
});

/***/ }),
/* 36 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__task_comment_form_vue__ = __webpack_require__(85);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mixin__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mixin___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__mixin__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
    props: ['comments', 'task'],

    mixins: [__WEBPACK_IMPORTED_MODULE_1__mixin___default.a],

    data: function data() {
        return {
            currnet_user_id: 1,
            avatar_url: PM_Vars.avatar_url
        };
    },

    components: {
        'task-comment-form': __WEBPACK_IMPORTED_MODULE_0__task_comment_form_vue__["a" /* default */]
    },

    methods: {
        commentDate: function commentDate(comment) {
            if (typeof comment.created_at != 'undefined') {
                return comment.created_at.date + ', ' + comment.created_at.time;
            }

            return '';
        },
        showHideTaskCommentForm: function showHideTaskCommentForm(comment) {
            comment.edit_mode = comment.edit_mode ? false : true;
        },

        current_user_can_edit_delete: function current_user_can_edit_delete(comment, task) {
            if (comment.comment_type == 'pm_activity') {
                return false;
            }

            if (task.can_del_edit) {
                return true;
            }

            if (comment.user_id == this.currnet_user_id && comment.comment_type == '') {
                return true;
            }

            return false;
        },

        deleteTaskComment: function deleteTaskComment(id) {
            if (!confirm(this.__('Are you sure!', 'pm'))) {
                return;
            }
            var self = this;

            var request_data = {
                url: self.base_url + '/pm/v2/projects/' + self.project_id + '/comments/' + id,
                type: 'DELETE',
                success: function success(res) {
                    var index = self.getIndex(self.comments, id, 'id');
                    pm.Toastr.success(res.message);
                    self.comments.splice(index, 1);
                }
            };
            this.httpRequest(request_data);
        }
    }
});

/***/ }),
/* 37 */,
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__(67);
var enumBugKeys = __webpack_require__(46);

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(51)('keys');
var uid = __webpack_require__(52);
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(21);
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),
/* 41 */,
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

!function(t,e){ true?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.VueMultiselect=e():t.VueMultiselect=e()}(this,function(){return function(t){function e(i){if(n[i])return n[i].exports;var r=n[i]={i:i,l:!1,exports:{}};return t[i].call(r.exports,r,r.exports,e),r.l=!0,r.exports}var n={};return e.m=t,e.c=n,e.i=function(t){return t},e.d=function(t,n,i){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:i})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="/",e(e.s=66)}([function(t,e){var n=t.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=n)},function(t,e,n){t.exports=!n(12)(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},function(t,e){var n={}.hasOwnProperty;t.exports=function(t,e){return n.call(t,e)}},function(t,e,n){var i=n(10),r=n(43),o=n(31),s=Object.defineProperty;e.f=n(1)?Object.defineProperty:function(t,e,n){if(i(t),e=o(e,!0),i(n),r)try{return s(t,e,n)}catch(t){}if("get"in n||"set"in n)throw TypeError("Accessors not supported!");return"value"in n&&(t[e]=n.value),t}},function(t,e,n){var i=n(77),r=n(21);t.exports=function(t){return i(r(t))}},function(t,e,n){var i=n(9),r=n(52),o=n(18),s=n(55),u=n(53),a=function(t,e,n){var l,c,f,p,h=t&a.F,d=t&a.G,v=t&a.S,y=t&a.P,g=t&a.B,b=d?i:v?i[e]||(i[e]={}):(i[e]||{}).prototype,m=d?r:r[e]||(r[e]={}),_=m.prototype||(m.prototype={});d&&(n=e);for(l in n)c=!h&&b&&void 0!==b[l],f=(c?b:n)[l],p=g&&c?u(f,i):y&&"function"==typeof f?u(Function.call,f):f,b&&s(b,l,f,t&a.U),m[l]!=f&&o(m,l,p),y&&_[l]!=f&&(_[l]=f)};i.core=r,a.F=1,a.G=2,a.S=4,a.P=8,a.B=16,a.W=32,a.U=64,a.R=128,t.exports=a},function(t,e,n){var i=n(3),r=n(15);t.exports=n(1)?function(t,e,n){return i.f(t,e,r(1,n))}:function(t,e,n){return t[e]=n,t}},function(t,e,n){var i=n(29)("wks"),r=n(16),o=n(0).Symbol,s="function"==typeof o;(t.exports=function(t){return i[t]||(i[t]=s&&o[t]||(s?o:r)("Symbol."+t))}).store=i},function(t,e){t.exports=function(t){try{return!!t()}catch(t){return!0}}},function(t,e){var n=t.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=n)},function(t,e,n){var i=n(13);t.exports=function(t){if(!i(t))throw TypeError(t+" is not an object!");return t}},function(t,e){var n=t.exports={version:"2.4.0"};"number"==typeof __e&&(__e=n)},function(t,e){t.exports=function(t){try{return!!t()}catch(t){return!0}}},function(t,e){t.exports=function(t){return"object"==typeof t?null!==t:"function"==typeof t}},function(t,e,n){var i=n(48),r=n(22);t.exports=Object.keys||function(t){return i(t,r)}},function(t,e){t.exports=function(t,e){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:e}}},function(t,e){var n=0,i=Math.random();t.exports=function(t){return"Symbol(".concat(void 0===t?"":t,")_",(++n+i).toString(36))}},function(t,e){t.exports=function(t){if(void 0==t)throw TypeError("Can't call method on  "+t);return t}},function(t,e,n){var i=n(109),r=n(110);t.exports=n(35)?function(t,e,n){return i.f(t,e,r(1,n))}:function(t,e,n){return t[e]=n,t}},function(t,e){t.exports=function(t){return"object"==typeof t?null!==t:"function"==typeof t}},function(t,e,n){var i=n(8);t.exports=function(t,e){return!!t&&i(function(){e?t.call(null,function(){},1):t.call(null)})}},function(t,e){t.exports=function(t){if(void 0==t)throw TypeError("Can't call method on  "+t);return t}},function(t,e){t.exports="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")},function(t,e,n){var i=n(0),r=n(11),o=n(74),s=n(6),u=function(t,e,n){var a,l,c,f=t&u.F,p=t&u.G,h=t&u.S,d=t&u.P,v=t&u.B,y=t&u.W,g=p?r:r[e]||(r[e]={}),b=g.prototype,m=p?i:h?i[e]:(i[e]||{}).prototype;p&&(n=e);for(a in n)(l=!f&&m&&void 0!==m[a])&&a in g||(c=l?m[a]:n[a],g[a]=p&&"function"!=typeof m[a]?n[a]:v&&l?o(c,i):y&&m[a]==c?function(t){var e=function(e,n,i){if(this instanceof t){switch(arguments.length){case 0:return new t;case 1:return new t(e);case 2:return new t(e,n)}return new t(e,n,i)}return t.apply(this,arguments)};return e.prototype=t.prototype,e}(c):d&&"function"==typeof c?o(Function.call,c):c,d&&((g.virtual||(g.virtual={}))[a]=c,t&u.R&&b&&!b[a]&&s(b,a,c)))};u.F=1,u.G=2,u.S=4,u.P=8,u.B=16,u.W=32,u.U=64,u.R=128,t.exports=u},function(t,e){t.exports={}},function(t,e){t.exports=!0},function(t,e){e.f={}.propertyIsEnumerable},function(t,e,n){var i=n(3).f,r=n(2),o=n(7)("toStringTag");t.exports=function(t,e,n){t&&!r(t=n?t:t.prototype,o)&&i(t,o,{configurable:!0,value:e})}},function(t,e,n){var i=n(29)("keys"),r=n(16);t.exports=function(t){return i[t]||(i[t]=r(t))}},function(t,e,n){var i=n(0),r=i["__core-js_shared__"]||(i["__core-js_shared__"]={});t.exports=function(t){return r[t]||(r[t]={})}},function(t,e){var n=Math.ceil,i=Math.floor;t.exports=function(t){return isNaN(t=+t)?0:(t>0?i:n)(t)}},function(t,e,n){var i=n(13);t.exports=function(t,e){if(!i(t))return t;var n,r;if(e&&"function"==typeof(n=t.toString)&&!i(r=n.call(t)))return r;if("function"==typeof(n=t.valueOf)&&!i(r=n.call(t)))return r;if(!e&&"function"==typeof(n=t.toString)&&!i(r=n.call(t)))return r;throw TypeError("Can't convert object to primitive value")}},function(t,e,n){var i=n(0),r=n(11),o=n(25),s=n(33),u=n(3).f;t.exports=function(t){var e=r.Symbol||(r.Symbol=o?{}:i.Symbol||{});"_"==t.charAt(0)||t in e||u(e,t,{value:s.f(t)})}},function(t,e,n){e.f=n(7)},function(t,e,n){var i=n(53),r=n(36),o=n(57),s=n(37),u=n(104);t.exports=function(t,e){var n=1==t,a=2==t,l=3==t,c=4==t,f=6==t,p=5==t||f,h=e||u;return function(e,u,d){for(var v,y,g=o(e),b=r(g),m=i(u,d,3),_=s(b.length),x=0,w=n?h(e,_):a?h(e,0):void 0;_>x;x++)if((p||x in b)&&(v=b[x],y=m(v,x,g),t))if(n)w[x]=y;else if(y)switch(t){case 3:return!0;case 5:return v;case 6:return x;case 2:w.push(v)}else if(c)return!1;return f?-1:l||c?c:w}}},function(t,e,n){t.exports=!n(8)(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},function(t,e,n){var i=n(51);t.exports=Object("z").propertyIsEnumerable(0)?Object:function(t){return"String"==i(t)?t.split(""):Object(t)}},function(t,e,n){var i=n(56),r=Math.min;t.exports=function(t){return t>0?r(i(t),9007199254740991):0}},function(t,e,n){var i=n(111)("wks"),r=n(58),o=n(9).Symbol,s="function"==typeof o;(t.exports=function(t){return i[t]||(i[t]=s&&o[t]||(s?o:r)("Symbol."+t))}).store=i},function(t,e,n){"use strict";function i(t){return 0!==t&&(!(!Array.isArray(t)||0!==t.length)||!t)}function r(t){return function(){return!t.apply(void 0,arguments)}}function o(t,e){return void 0===t&&(t="undefined"),null===t&&(t="null"),!1===t&&(t="false"),-1!==t.toString().toLowerCase().indexOf(e.trim())}function s(t,e,n,i){return t.filter(function(t){return o(i(t,n),e)})}function u(t){return t.filter(function(t){return!t.$isLabel})}function a(t,e){return function(n){return n.reduce(function(n,i){return i[t]&&i[t].length?(n.push({$groupLabel:i[e],$isLabel:!0}),n.concat(i[t])):n},[])}}function l(t,e,n,i,r){return function(o){return o.map(function(o){var u;if(!o[n])return console.warn("Options passed to vue-multiselect do not contain groups, despite the config."),[];var a=s(o[n],t,e,r);return a.length?(u={},v()(u,i,o[i]),v()(u,n,a),u):[]})}}var c=n(65),f=n.n(c),p=n(59),h=(n.n(p),n(122)),d=(n.n(h),n(64)),v=n.n(d),y=n(120),g=(n.n(y),n(121)),b=(n.n(g),n(117)),m=(n.n(b),n(123)),_=(n.n(m),n(118)),x=(n.n(_),n(119)),w=(n.n(x),function(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];return function(t){return e.reduce(function(t,e){return e(t)},t)}});e.a={data:function(){return{search:"",isOpen:!1,prefferedOpenDirection:"below",optimizedHeight:this.maxHeight}},props:{internalSearch:{type:Boolean,default:!0},options:{type:Array,required:!0},multiple:{type:Boolean,default:!1},value:{type:null,default:function(){return[]}},trackBy:{type:String},label:{type:String},searchable:{type:Boolean,default:!0},clearOnSelect:{type:Boolean,default:!0},hideSelected:{type:Boolean,default:!1},placeholder:{type:String,default:"Select option"},allowEmpty:{type:Boolean,default:!0},resetAfter:{type:Boolean,default:!1},closeOnSelect:{type:Boolean,default:!0},customLabel:{type:Function,default:function(t,e){return i(t)?"":e?t[e]:t}},taggable:{type:Boolean,default:!1},tagPlaceholder:{type:String,default:"Press enter to create a tag"},tagPosition:{type:String,default:"top"},max:{type:[Number,Boolean],default:!1},id:{default:null},optionsLimit:{type:Number,default:1e3},groupValues:{type:String},groupLabel:{type:String},groupSelect:{type:Boolean,default:!1},blockKeys:{type:Array,default:function(){return[]}},preserveSearch:{type:Boolean,default:!1},preselectFirst:{type:Boolean,default:!1}},mounted:function(){this.multiple||this.clearOnSelect||console.warn("[Vue-Multiselect warn]: ClearOnSelect and Multiple props can’t be both set to false."),!this.multiple&&this.max&&console.warn("[Vue-Multiselect warn]: Max prop should not be used when prop Multiple equals false."),this.preselectFirst&&!this.internalValue.length&&this.options.length&&this.select(this.filteredOptions[0])},computed:{internalValue:function(){return this.value||0===this.value?Array.isArray(this.value)?this.value:[this.value]:[]},filteredOptions:function(){var t=this.search||"",e=t.toLowerCase().trim(),n=this.options.concat();return n=this.internalSearch?this.groupValues?this.filterAndFlat(n,e,this.label):s(n,e,this.label,this.customLabel):this.groupValues?a(this.groupValues,this.groupLabel)(n):n,n=this.hideSelected?n.filter(r(this.isSelected)):n,this.taggable&&e.length&&!this.isExistingOption(e)&&("bottom"===this.tagPosition?n.push({isTag:!0,label:t}):n.unshift({isTag:!0,label:t})),n.slice(0,this.optionsLimit)},valueKeys:function(){var t=this;return this.trackBy?this.internalValue.map(function(e){return e[t.trackBy]}):this.internalValue},optionKeys:function(){var t=this;return(this.groupValues?this.flatAndStrip(this.options):this.options).map(function(e){return t.customLabel(e,t.label).toString().toLowerCase()})},currentOptionLabel:function(){return this.multiple?this.searchable?"":this.placeholder:this.internalValue.length?this.getOptionLabel(this.internalValue[0]):this.searchable?"":this.placeholder}},watch:{internalValue:function(){this.resetAfter&&this.internalValue.length&&(this.search="",this.$emit("input",this.multiple?[]:null))},search:function(){this.$emit("search-change",this.search,this.id)}},methods:{getValue:function(){return this.multiple?this.internalValue:0===this.internalValue.length?null:this.internalValue[0]},filterAndFlat:function(t,e,n){return w(l(e,n,this.groupValues,this.groupLabel,this.customLabel),a(this.groupValues,this.groupLabel))(t)},flatAndStrip:function(t){return w(a(this.groupValues,this.groupLabel),u)(t)},updateSearch:function(t){this.search=t},isExistingOption:function(t){return!!this.options&&this.optionKeys.indexOf(t)>-1},isSelected:function(t){var e=this.trackBy?t[this.trackBy]:t;return this.valueKeys.indexOf(e)>-1},getOptionLabel:function(t){if(i(t))return"";if(t.isTag)return t.label;if(t.$isLabel)return t.$groupLabel;var e=this.customLabel(t,this.label);return i(e)?"":e},select:function(t,e){if(t.$isLabel&&this.groupSelect)return void this.selectGroup(t);if(!(-1!==this.blockKeys.indexOf(e)||this.disabled||t.$isDisabled||t.$isLabel)&&(!this.max||!this.multiple||this.internalValue.length!==this.max)&&("Tab"!==e||this.pointerDirty)){if(t.isTag)this.$emit("tag",t.label,this.id),this.search="",this.closeOnSelect&&!this.multiple&&this.deactivate();else{if(this.isSelected(t))return void("Tab"!==e&&this.removeElement(t));this.$emit("select",t,this.id),this.multiple?this.$emit("input",this.internalValue.concat([t]),this.id):this.$emit("input",t,this.id),this.clearOnSelect&&(this.search="")}this.closeOnSelect&&this.deactivate()}},selectGroup:function(t){var e=this,n=this.options.find(function(n){return n[e.groupLabel]===t.$groupLabel});if(n)if(this.wholeGroupSelected(n)){this.$emit("remove",n[this.groupValues],this.id);var i=this.internalValue.filter(function(t){return-1===n[e.groupValues].indexOf(t)});this.$emit("input",i,this.id)}else{var o=n[this.groupValues].filter(r(this.isSelected));this.$emit("select",o,this.id),this.$emit("input",this.internalValue.concat(o),this.id)}},wholeGroupSelected:function(t){return t[this.groupValues].every(this.isSelected)},removeElement:function(t){var e=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];if(!this.disabled){if(!this.allowEmpty&&this.internalValue.length<=1)return void this.deactivate();var n="object"===f()(t)?this.valueKeys.indexOf(t[this.trackBy]):this.valueKeys.indexOf(t);if(this.$emit("remove",t,this.id),this.multiple){var i=this.internalValue.slice(0,n).concat(this.internalValue.slice(n+1));this.$emit("input",i,this.id)}else this.$emit("input",null,this.id);this.closeOnSelect&&e&&this.deactivate()}},removeLastElement:function(){-1===this.blockKeys.indexOf("Delete")&&0===this.search.length&&Array.isArray(this.internalValue)&&this.removeElement(this.internalValue[this.internalValue.length-1],!1)},activate:function(){var t=this;this.isOpen||this.disabled||(this.adjustPosition(),this.groupValues&&0===this.pointer&&this.filteredOptions.length&&(this.pointer=1),this.isOpen=!0,this.searchable?(this.preserveSearch||(this.search=""),this.$nextTick(function(){return t.$refs.search.focus()})):this.$el.focus(),this.$emit("open",this.id))},deactivate:function(){this.isOpen&&(this.isOpen=!1,this.searchable?this.$refs.search.blur():this.$el.blur(),this.preserveSearch||(this.search=""),this.$emit("close",this.getValue(),this.id))},toggle:function(){this.isOpen?this.deactivate():this.activate()},adjustPosition:function(){if("undefined"!=typeof window){var t=this.$el.getBoundingClientRect().top,e=window.innerHeight-this.$el.getBoundingClientRect().bottom;e>this.maxHeight||e>t||"below"===this.openDirection||"bottom"===this.openDirection?(this.prefferedOpenDirection="below",this.optimizedHeight=Math.min(e-40,this.maxHeight)):(this.prefferedOpenDirection="above",this.optimizedHeight=Math.min(t-40,this.maxHeight))}}}}},function(t,e,n){"use strict";var i=n(59);n.n(i);e.a={data:function(){return{pointer:0,pointerDirty:!1}},props:{showPointer:{type:Boolean,default:!0},optionHeight:{type:Number,default:40}},computed:{pointerPosition:function(){return this.pointer*this.optionHeight},visibleElements:function(){return this.optimizedHeight/this.optionHeight}},watch:{filteredOptions:function(){this.pointerAdjust()},isOpen:function(){this.pointerDirty=!1}},methods:{optionHighlight:function(t,e){return{"multiselect__option--highlight":t===this.pointer&&this.showPointer,"multiselect__option--selected":this.isSelected(e)}},groupHighlight:function(t,e){var n=this;if(!this.groupSelect)return["multiselect__option--disabled"];var i=this.options.find(function(t){return t[n.groupLabel]===e.$groupLabel});return[this.groupSelect?"multiselect__option--group":"multiselect__option--disabled",{"multiselect__option--highlight":t===this.pointer&&this.showPointer},{"multiselect__option--group-selected":this.wholeGroupSelected(i)}]},addPointerElement:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"Enter",e=t.key;this.filteredOptions.length>0&&this.select(this.filteredOptions[this.pointer],e),this.pointerReset()},pointerForward:function(){this.pointer<this.filteredOptions.length-1&&(this.pointer++,this.$refs.list.scrollTop<=this.pointerPosition-(this.visibleElements-1)*this.optionHeight&&(this.$refs.list.scrollTop=this.pointerPosition-(this.visibleElements-1)*this.optionHeight),this.filteredOptions[this.pointer]&&this.filteredOptions[this.pointer].$isLabel&&!this.groupSelect&&this.pointerForward()),this.pointerDirty=!0},pointerBackward:function(){this.pointer>0?(this.pointer--,this.$refs.list.scrollTop>=this.pointerPosition&&(this.$refs.list.scrollTop=this.pointerPosition),this.filteredOptions[this.pointer]&&this.filteredOptions[this.pointer].$isLabel&&!this.groupSelect&&this.pointerBackward()):this.filteredOptions[this.pointer]&&this.filteredOptions[0].$isLabel&&!this.groupSelect&&this.pointerForward(),this.pointerDirty=!0},pointerReset:function(){this.closeOnSelect&&(this.pointer=0,this.$refs.list&&(this.$refs.list.scrollTop=0))},pointerAdjust:function(){this.pointer>=this.filteredOptions.length-1&&(this.pointer=this.filteredOptions.length?this.filteredOptions.length-1:0),this.filteredOptions.length>0&&this.filteredOptions[this.pointer].$isLabel&&!this.groupSelect&&this.pointerForward()},pointerSet:function(t){this.pointer=t,this.pointerDirty=!0}}}},function(t,e){var n={}.toString;t.exports=function(t){return n.call(t).slice(8,-1)}},function(t,e,n){var i=n(13),r=n(0).document,o=i(r)&&i(r.createElement);t.exports=function(t){return o?r.createElement(t):{}}},function(t,e,n){t.exports=!n(1)&&!n(12)(function(){return 7!=Object.defineProperty(n(42)("div"),"a",{get:function(){return 7}}).a})},function(t,e,n){"use strict";var i=n(25),r=n(23),o=n(49),s=n(6),u=n(2),a=n(24),l=n(79),c=n(27),f=n(86),p=n(7)("iterator"),h=!([].keys&&"next"in[].keys()),d=function(){return this};t.exports=function(t,e,n,v,y,g,b){l(n,e,v);var m,_,x,w=function(t){if(!h&&t in P)return P[t];switch(t){case"keys":case"values":return function(){return new n(this,t)}}return function(){return new n(this,t)}},S=e+" Iterator",O="values"==y,L=!1,P=t.prototype,k=P[p]||P["@@iterator"]||y&&P[y],E=k||w(y),j=y?O?w("entries"):E:void 0,V="Array"==e?P.entries||k:k;if(V&&(x=f(V.call(new t)))!==Object.prototype&&(c(x,S,!0),i||u(x,p)||s(x,p,d)),O&&k&&"values"!==k.name&&(L=!0,E=function(){return k.call(this)}),i&&!b||!h&&!L&&P[p]||s(P,p,E),a[e]=E,a[S]=d,y)if(m={values:O?E:w("values"),keys:g?E:w("keys"),entries:j},b)for(_ in m)_ in P||o(P,_,m[_]);else r(r.P+r.F*(h||L),e,m);return m}},function(t,e,n){var i=n(10),r=n(83),o=n(22),s=n(28)("IE_PROTO"),u=function(){},a=function(){var t,e=n(42)("iframe"),i=o.length;for(e.style.display="none",n(76).appendChild(e),e.src="javascript:",t=e.contentWindow.document,t.open(),t.write("<script>document.F=Object<\/script>"),t.close(),a=t.F;i--;)delete a.prototype[o[i]];return a()};t.exports=Object.create||function(t,e){var n;return null!==t?(u.prototype=i(t),n=new u,u.prototype=null,n[s]=t):n=a(),void 0===e?n:r(n,e)}},function(t,e,n){var i=n(48),r=n(22).concat("length","prototype");e.f=Object.getOwnPropertyNames||function(t){return i(t,r)}},function(t,e){e.f=Object.getOwnPropertySymbols},function(t,e,n){var i=n(2),r=n(4),o=n(73)(!1),s=n(28)("IE_PROTO");t.exports=function(t,e){var n,u=r(t),a=0,l=[];for(n in u)n!=s&&i(u,n)&&l.push(n);for(;e.length>a;)i(u,n=e[a++])&&(~o(l,n)||l.push(n));return l}},function(t,e,n){t.exports=n(6)},function(t,e){t.exports=function(t){if("function"!=typeof t)throw TypeError(t+" is not a function!");return t}},function(t,e){var n={}.toString;t.exports=function(t){return n.call(t).slice(8,-1)}},function(t,e){var n=t.exports={version:"2.4.0"};"number"==typeof __e&&(__e=n)},function(t,e,n){var i=n(50);t.exports=function(t,e,n){if(i(t),void 0===e)return t;switch(n){case 1:return function(n){return t.call(e,n)};case 2:return function(n,i){return t.call(e,n,i)};case 3:return function(n,i,r){return t.call(e,n,i,r)}}return function(){return t.apply(e,arguments)}}},function(t,e,n){var i=n(51);t.exports=Array.isArray||function(t){return"Array"==i(t)}},function(t,e,n){var i=n(9),r=n(18),o=n(107),s=n(58)("src"),u=Function.toString,a=(""+u).split("toString");n(52).inspectSource=function(t){return u.call(t)},(t.exports=function(t,e,n,u){var l="function"==typeof n;l&&(o(n,"name")||r(n,"name",e)),t[e]!==n&&(l&&(o(n,s)||r(n,s,t[e]?""+t[e]:a.join(String(e)))),t===i?t[e]=n:u?t[e]?t[e]=n:r(t,e,n):(delete t[e],r(t,e,n)))})(Function.prototype,"toString",function(){return"function"==typeof this&&this[s]||u.call(this)})},function(t,e){var n=Math.ceil,i=Math.floor;t.exports=function(t){return isNaN(t=+t)?0:(t>0?i:n)(t)}},function(t,e,n){var i=n(17);t.exports=function(t){return Object(i(t))}},function(t,e){var n=0,i=Math.random();t.exports=function(t){return"Symbol(".concat(void 0===t?"":t,")_",(++n+i).toString(36))}},function(t,e,n){"use strict";var i=n(5),r=n(34)(5),o=!0;"find"in[]&&Array(1).find(function(){o=!1}),i(i.P+i.F*o,"Array",{find:function(t){return r(this,t,arguments.length>1?arguments[1]:void 0)}}),n(99)("find")},function(t,e,n){"use strict";function i(t){n(124)}var r=n(67),o=n(126),s=n(125),u=i,a=s(r.a,o.a,!1,u,null,null);e.a=a.exports},function(t,e,n){t.exports=n(68)},function(t,e,n){t.exports=n(69)},function(t,e,n){t.exports=n(70)},function(t,e,n){function i(t,e,n){return e in t?r(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var r=n(61);t.exports=i},function(t,e,n){function i(t){return(i="function"==typeof s&&"symbol"==typeof o?function(t){return typeof t}:function(t){return t&&"function"==typeof s&&t.constructor===s&&t!==s.prototype?"symbol":typeof t})(t)}function r(e){return"function"==typeof s&&"symbol"===i(o)?t.exports=r=function(t){return i(t)}:t.exports=r=function(t){return t&&"function"==typeof s&&t.constructor===s&&t!==s.prototype?"symbol":i(t)},r(e)}var o=n(63),s=n(62);t.exports=r},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n(60),r=n(39),o=n(40);n.d(e,"Multiselect",function(){return i.a}),n.d(e,"multiselectMixin",function(){return r.a}),n.d(e,"pointerMixin",function(){return o.a}),e.default=i.a},function(t,e,n){"use strict";var i=n(39),r=n(40);e.a={name:"vue-multiselect",mixins:[i.a,r.a],props:{name:{type:String,default:""},selectLabel:{type:String,default:"Press enter to select"},selectGroupLabel:{type:String,default:"Press enter to select group"},selectedLabel:{type:String,default:"Selected"},deselectLabel:{type:String,default:"Press enter to remove"},deselectGroupLabel:{type:String,default:"Press enter to deselect group"},showLabels:{type:Boolean,default:!0},limit:{type:Number,default:99999},maxHeight:{type:Number,default:300},limitText:{type:Function,default:function(t){return"and ".concat(t," more")}},loading:{type:Boolean,default:!1},disabled:{type:Boolean,default:!1},openDirection:{type:String,default:""},showNoResults:{type:Boolean,default:!0},tabindex:{type:Number,default:0}},computed:{isSingleLabelVisible:function(){return this.singleValue&&(!this.isOpen||!this.searchable)&&!this.visibleValues.length},isPlaceholderVisible:function(){return!(this.internalValue.length||this.searchable&&this.isOpen)},visibleValues:function(){return this.multiple?this.internalValue.slice(0,this.limit):[]},singleValue:function(){return this.internalValue[0]},deselectLabelText:function(){return this.showLabels?this.deselectLabel:""},deselectGroupLabelText:function(){return this.showLabels?this.deselectGroupLabel:""},selectLabelText:function(){return this.showLabels?this.selectLabel:""},selectGroupLabelText:function(){return this.showLabels?this.selectGroupLabel:""},selectedLabelText:function(){return this.showLabels?this.selectedLabel:""},inputStyle:function(){if(this.multiple&&this.value&&this.value.length)return this.isOpen?{width:"auto"}:{width:"0",position:"absolute",padding:"0"}},contentStyle:function(){return this.options.length?{display:"inline-block"}:{display:"block"}},isAbove:function(){return"above"===this.openDirection||"top"===this.openDirection||"below"!==this.openDirection&&"bottom"!==this.openDirection&&"above"===this.prefferedOpenDirection},showSearchInput:function(){return this.searchable&&(!this.hasSingleSelectedSlot||!this.visibleSingleValue&&0!==this.visibleSingleValue||this.isOpen)}}}},function(t,e,n){n(92);var i=n(11).Object;t.exports=function(t,e,n){return i.defineProperty(t,e,n)}},function(t,e,n){n(95),n(93),n(96),n(97),t.exports=n(11).Symbol},function(t,e,n){n(94),n(98),t.exports=n(33).f("iterator")},function(t,e){t.exports=function(t){if("function"!=typeof t)throw TypeError(t+" is not a function!");return t}},function(t,e){t.exports=function(){}},function(t,e,n){var i=n(4),r=n(89),o=n(88);t.exports=function(t){return function(e,n,s){var u,a=i(e),l=r(a.length),c=o(s,l);if(t&&n!=n){for(;l>c;)if((u=a[c++])!=u)return!0}else for(;l>c;c++)if((t||c in a)&&a[c]===n)return t||c||0;return!t&&-1}}},function(t,e,n){var i=n(71);t.exports=function(t,e,n){if(i(t),void 0===e)return t;switch(n){case 1:return function(n){return t.call(e,n)};case 2:return function(n,i){return t.call(e,n,i)};case 3:return function(n,i,r){return t.call(e,n,i,r)}}return function(){return t.apply(e,arguments)}}},function(t,e,n){var i=n(14),r=n(47),o=n(26);t.exports=function(t){var e=i(t),n=r.f;if(n)for(var s,u=n(t),a=o.f,l=0;u.length>l;)a.call(t,s=u[l++])&&e.push(s);return e}},function(t,e,n){t.exports=n(0).document&&document.documentElement},function(t,e,n){var i=n(41);t.exports=Object("z").propertyIsEnumerable(0)?Object:function(t){return"String"==i(t)?t.split(""):Object(t)}},function(t,e,n){var i=n(41);t.exports=Array.isArray||function(t){return"Array"==i(t)}},function(t,e,n){"use strict";var i=n(45),r=n(15),o=n(27),s={};n(6)(s,n(7)("iterator"),function(){return this}),t.exports=function(t,e,n){t.prototype=i(s,{next:r(1,n)}),o(t,e+" Iterator")}},function(t,e){t.exports=function(t,e){return{value:e,done:!!t}}},function(t,e,n){var i=n(14),r=n(4);t.exports=function(t,e){for(var n,o=r(t),s=i(o),u=s.length,a=0;u>a;)if(o[n=s[a++]]===e)return n}},function(t,e,n){var i=n(16)("meta"),r=n(13),o=n(2),s=n(3).f,u=0,a=Object.isExtensible||function(){return!0},l=!n(12)(function(){return a(Object.preventExtensions({}))}),c=function(t){s(t,i,{value:{i:"O"+ ++u,w:{}}})},f=function(t,e){if(!r(t))return"symbol"==typeof t?t:("string"==typeof t?"S":"P")+t;if(!o(t,i)){if(!a(t))return"F";if(!e)return"E";c(t)}return t[i].i},p=function(t,e){if(!o(t,i)){if(!a(t))return!0;if(!e)return!1;c(t)}return t[i].w},h=function(t){return l&&d.NEED&&a(t)&&!o(t,i)&&c(t),t},d=t.exports={KEY:i,NEED:!1,fastKey:f,getWeak:p,onFreeze:h}},function(t,e,n){var i=n(3),r=n(10),o=n(14);t.exports=n(1)?Object.defineProperties:function(t,e){r(t);for(var n,s=o(e),u=s.length,a=0;u>a;)i.f(t,n=s[a++],e[n]);return t}},function(t,e,n){var i=n(26),r=n(15),o=n(4),s=n(31),u=n(2),a=n(43),l=Object.getOwnPropertyDescriptor;e.f=n(1)?l:function(t,e){if(t=o(t),e=s(e,!0),a)try{return l(t,e)}catch(t){}if(u(t,e))return r(!i.f.call(t,e),t[e])}},function(t,e,n){var i=n(4),r=n(46).f,o={}.toString,s="object"==typeof window&&window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[],u=function(t){try{return r(t)}catch(t){return s.slice()}};t.exports.f=function(t){return s&&"[object Window]"==o.call(t)?u(t):r(i(t))}},function(t,e,n){var i=n(2),r=n(90),o=n(28)("IE_PROTO"),s=Object.prototype;t.exports=Object.getPrototypeOf||function(t){return t=r(t),i(t,o)?t[o]:"function"==typeof t.constructor&&t instanceof t.constructor?t.constructor.prototype:t instanceof Object?s:null}},function(t,e,n){var i=n(30),r=n(21);t.exports=function(t){return function(e,n){var o,s,u=String(r(e)),a=i(n),l=u.length;return a<0||a>=l?t?"":void 0:(o=u.charCodeAt(a),o<55296||o>56319||a+1===l||(s=u.charCodeAt(a+1))<56320||s>57343?t?u.charAt(a):o:t?u.slice(a,a+2):s-56320+(o-55296<<10)+65536)}}},function(t,e,n){var i=n(30),r=Math.max,o=Math.min;t.exports=function(t,e){return t=i(t),t<0?r(t+e,0):o(t,e)}},function(t,e,n){var i=n(30),r=Math.min;t.exports=function(t){return t>0?r(i(t),9007199254740991):0}},function(t,e,n){var i=n(21);t.exports=function(t){return Object(i(t))}},function(t,e,n){"use strict";var i=n(72),r=n(80),o=n(24),s=n(4);t.exports=n(44)(Array,"Array",function(t,e){this._t=s(t),this._i=0,this._k=e},function(){var t=this._t,e=this._k,n=this._i++;return!t||n>=t.length?(this._t=void 0,r(1)):"keys"==e?r(0,n):"values"==e?r(0,t[n]):r(0,[n,t[n]])},"values"),o.Arguments=o.Array,i("keys"),i("values"),i("entries")},function(t,e,n){var i=n(23);i(i.S+i.F*!n(1),"Object",{defineProperty:n(3).f})},function(t,e){},function(t,e,n){"use strict";var i=n(87)(!0);n(44)(String,"String",function(t){this._t=String(t),this._i=0},function(){var t,e=this._t,n=this._i;return n>=e.length?{value:void 0,done:!0}:(t=i(e,n),this._i+=t.length,{value:t,done:!1})})},function(t,e,n){"use strict";var i=n(0),r=n(2),o=n(1),s=n(23),u=n(49),a=n(82).KEY,l=n(12),c=n(29),f=n(27),p=n(16),h=n(7),d=n(33),v=n(32),y=n(81),g=n(75),b=n(78),m=n(10),_=n(4),x=n(31),w=n(15),S=n(45),O=n(85),L=n(84),P=n(3),k=n(14),E=L.f,j=P.f,V=O.f,C=i.Symbol,T=i.JSON,A=T&&T.stringify,$=h("_hidden"),D=h("toPrimitive"),F={}.propertyIsEnumerable,M=c("symbol-registry"),B=c("symbols"),N=c("op-symbols"),R=Object.prototype,H="function"==typeof C,G=i.QObject,I=!G||!G.prototype||!G.prototype.findChild,K=o&&l(function(){return 7!=S(j({},"a",{get:function(){return j(this,"a",{value:7}).a}})).a})?function(t,e,n){var i=E(R,e);i&&delete R[e],j(t,e,n),i&&t!==R&&j(R,e,i)}:j,z=function(t){var e=B[t]=S(C.prototype);return e._k=t,e},U=H&&"symbol"==typeof C.iterator?function(t){return"symbol"==typeof t}:function(t){return t instanceof C},W=function(t,e,n){return t===R&&W(N,e,n),m(t),e=x(e,!0),m(n),r(B,e)?(n.enumerable?(r(t,$)&&t[$][e]&&(t[$][e]=!1),n=S(n,{enumerable:w(0,!1)})):(r(t,$)||j(t,$,w(1,{})),t[$][e]=!0),K(t,e,n)):j(t,e,n)},J=function(t,e){m(t);for(var n,i=g(e=_(e)),r=0,o=i.length;o>r;)W(t,n=i[r++],e[n]);return t},q=function(t,e){return void 0===e?S(t):J(S(t),e)},X=function(t){var e=F.call(this,t=x(t,!0));return!(this===R&&r(B,t)&&!r(N,t))&&(!(e||!r(this,t)||!r(B,t)||r(this,$)&&this[$][t])||e)},Y=function(t,e){if(t=_(t),e=x(e,!0),t!==R||!r(B,e)||r(N,e)){var n=E(t,e);return!n||!r(B,e)||r(t,$)&&t[$][e]||(n.enumerable=!0),n}},Q=function(t){for(var e,n=V(_(t)),i=[],o=0;n.length>o;)r(B,e=n[o++])||e==$||e==a||i.push(e);return i},Z=function(t){for(var e,n=t===R,i=V(n?N:_(t)),o=[],s=0;i.length>s;)!r(B,e=i[s++])||n&&!r(R,e)||o.push(B[e]);return o};H||(C=function(){if(this instanceof C)throw TypeError("Symbol is not a constructor!");var t=p(arguments.length>0?arguments[0]:void 0),e=function(n){this===R&&e.call(N,n),r(this,$)&&r(this[$],t)&&(this[$][t]=!1),K(this,t,w(1,n))};return o&&I&&K(R,t,{configurable:!0,set:e}),z(t)},u(C.prototype,"toString",function(){return this._k}),L.f=Y,P.f=W,n(46).f=O.f=Q,n(26).f=X,n(47).f=Z,o&&!n(25)&&u(R,"propertyIsEnumerable",X,!0),d.f=function(t){return z(h(t))}),s(s.G+s.W+s.F*!H,{Symbol:C});for(var tt="hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(","),et=0;tt.length>et;)h(tt[et++]);for(var tt=k(h.store),et=0;tt.length>et;)v(tt[et++]);s(s.S+s.F*!H,"Symbol",{for:function(t){return r(M,t+="")?M[t]:M[t]=C(t)},keyFor:function(t){if(U(t))return y(M,t);throw TypeError(t+" is not a symbol!")},useSetter:function(){I=!0},useSimple:function(){I=!1}}),s(s.S+s.F*!H,"Object",{create:q,defineProperty:W,defineProperties:J,getOwnPropertyDescriptor:Y,getOwnPropertyNames:Q,getOwnPropertySymbols:Z}),T&&s(s.S+s.F*(!H||l(function(){var t=C();return"[null]"!=A([t])||"{}"!=A({a:t})||"{}"!=A(Object(t))})),"JSON",{stringify:function(t){if(void 0!==t&&!U(t)){for(var e,n,i=[t],r=1;arguments.length>r;)i.push(arguments[r++]);return e=i[1],"function"==typeof e&&(n=e),!n&&b(e)||(e=function(t,e){if(n&&(e=n.call(this,t,e)),!U(e))return e}),i[1]=e,A.apply(T,i)}}}),C.prototype[D]||n(6)(C.prototype,D,C.prototype.valueOf),f(C,"Symbol"),f(Math,"Math",!0),f(i.JSON,"JSON",!0)},function(t,e,n){n(32)("asyncIterator")},function(t,e,n){n(32)("observable")},function(t,e,n){n(91);for(var i=n(0),r=n(6),o=n(24),s=n(7)("toStringTag"),u=["NodeList","DOMTokenList","MediaList","StyleSheetList","CSSRuleList"],a=0;a<5;a++){var l=u[a],c=i[l],f=c&&c.prototype;f&&!f[s]&&r(f,s,l),o[l]=o.Array}},function(t,e,n){var i=n(38)("unscopables"),r=Array.prototype;void 0==r[i]&&n(18)(r,i,{}),t.exports=function(t){r[i][t]=!0}},function(t,e,n){var i=n(19);t.exports=function(t){if(!i(t))throw TypeError(t+" is not an object!");return t}},function(t,e,n){var i=n(115),r=n(37),o=n(114);t.exports=function(t){return function(e,n,s){var u,a=i(e),l=r(a.length),c=o(s,l);if(t&&n!=n){for(;l>c;)if((u=a[c++])!=u)return!0}else for(;l>c;c++)if((t||c in a)&&a[c]===n)return t||c||0;return!t&&-1}}},function(t,e,n){var i=n(50),r=n(57),o=n(36),s=n(37);t.exports=function(t,e,n,u,a){i(e);var l=r(t),c=o(l),f=s(l.length),p=a?f-1:0,h=a?-1:1;if(n<2)for(;;){if(p in c){u=c[p],p+=h;break}if(p+=h,a?p<0:f<=p)throw TypeError("Reduce of empty array with no initial value")}for(;a?p>=0:f>p;p+=h)p in c&&(u=e(u,c[p],p,l));return u}},function(t,e,n){var i=n(19),r=n(54),o=n(38)("species");t.exports=function(t){var e;return r(t)&&(e=t.constructor,"function"!=typeof e||e!==Array&&!r(e.prototype)||(e=void 0),i(e)&&null===(e=e[o])&&(e=void 0)),void 0===e?Array:e}},function(t,e,n){var i=n(103);t.exports=function(t,e){return new(i(t))(e)}},function(t,e,n){var i=n(19),r=n(9).document,o=i(r)&&i(r.createElement);t.exports=function(t){return o?r.createElement(t):{}}},function(t,e,n){"use strict";var i=n(18),r=n(55),o=n(8),s=n(17),u=n(38);t.exports=function(t,e,n){var a=u(t),l=n(s,a,""[t]),c=l[0],f=l[1];o(function(){var e={};return e[a]=function(){return 7},7!=""[t](e)})&&(r(String.prototype,t,c),i(RegExp.prototype,a,2==e?function(t,e){return f.call(t,this,e)}:function(t){return f.call(t,this)}))}},function(t,e){var n={}.hasOwnProperty;t.exports=function(t,e){return n.call(t,e)}},function(t,e,n){t.exports=!n(35)&&!n(8)(function(){return 7!=Object.defineProperty(n(105)("div"),"a",{get:function(){return 7}}).a})},function(t,e,n){var i=n(100),r=n(108),o=n(116),s=Object.defineProperty;e.f=n(35)?Object.defineProperty:function(t,e,n){if(i(t),e=o(e,!0),i(n),r)try{return s(t,e,n)}catch(t){}if("get"in n||"set"in n)throw TypeError("Accessors not supported!");return"value"in n&&(t[e]=n.value),t}},function(t,e){t.exports=function(t,e){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:e}}},function(t,e,n){var i=n(9),r=i["__core-js_shared__"]||(i["__core-js_shared__"]={});t.exports=function(t){return r[t]||(r[t]={})}},function(t,e,n){var i=n(5),r=n(17),o=n(8),s=n(113),u="["+s+"]",a="​",l=RegExp("^"+u+u+"*"),c=RegExp(u+u+"*$"),f=function(t,e,n){var r={},u=o(function(){return!!s[t]()||a[t]()!=a}),l=r[t]=u?e(p):s[t];n&&(r[n]=l),i(i.P+i.F*u,"String",r)},p=f.trim=function(t,e){return t=String(r(t)),1&e&&(t=t.replace(l,"")),2&e&&(t=t.replace(c,"")),t};t.exports=f},function(t,e){t.exports="\t\n\v\f\r   ᠎             　\u2028\u2029\ufeff"},function(t,e,n){var i=n(56),r=Math.max,o=Math.min;t.exports=function(t,e){return t=i(t),t<0?r(t+e,0):o(t,e)}},function(t,e,n){var i=n(36),r=n(17);t.exports=function(t){return i(r(t))}},function(t,e,n){var i=n(19);t.exports=function(t,e){if(!i(t))return t;var n,r;if(e&&"function"==typeof(n=t.toString)&&!i(r=n.call(t)))return r;if("function"==typeof(n=t.valueOf)&&!i(r=n.call(t)))return r;if(!e&&"function"==typeof(n=t.toString)&&!i(r=n.call(t)))return r;throw TypeError("Can't convert object to primitive value")}},function(t,e,n){"use strict";var i=n(5),r=n(34)(2);i(i.P+i.F*!n(20)([].filter,!0),"Array",{filter:function(t){return r(this,t,arguments[1])}})},function(t,e,n){"use strict";var i=n(5),r=n(101)(!1),o=[].indexOf,s=!!o&&1/[1].indexOf(1,-0)<0;i(i.P+i.F*(s||!n(20)(o)),"Array",{indexOf:function(t){return s?o.apply(this,arguments)||0:r(this,t,arguments[1])}})},function(t,e,n){var i=n(5);i(i.S,"Array",{isArray:n(54)})},function(t,e,n){"use strict";var i=n(5),r=n(34)(1);i(i.P+i.F*!n(20)([].map,!0),"Array",{map:function(t){return r(this,t,arguments[1])}})},function(t,e,n){"use strict";var i=n(5),r=n(102);i(i.P+i.F*!n(20)([].reduce,!0),"Array",{reduce:function(t){return r(this,t,arguments.length,arguments[1],!1)}})},function(t,e,n){n(106)("search",1,function(t,e,n){return[function(n){"use strict";var i=t(this),r=void 0==n?void 0:n[e];return void 0!==r?r.call(n,i):new RegExp(n)[e](String(i))},n]})},function(t,e,n){"use strict";n(112)("trim",function(t){return function(){return t(this,3)}})},function(t,e){},function(t,e){t.exports=function(t,e,n,i,r,o){var s,u=t=t||{},a=typeof t.default;"object"!==a&&"function"!==a||(s=t,u=t.default);var l="function"==typeof u?u.options:u;e&&(l.render=e.render,l.staticRenderFns=e.staticRenderFns,l._compiled=!0),n&&(l.functional=!0),r&&(l._scopeId=r);var c;if(o?(c=function(t){t=t||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext,t||"undefined"==typeof __VUE_SSR_CONTEXT__||(t=__VUE_SSR_CONTEXT__),i&&i.call(this,t),t&&t._registeredComponents&&t._registeredComponents.add(o)},l._ssrRegister=c):i&&(c=i),c){var f=l.functional,p=f?l.render:l.beforeCreate;f?(l._injectStyles=c,l.render=function(t,e){return c.call(e),p(t,e)}):l.beforeCreate=p?[].concat(p,c):[c]}return{esModule:s,exports:u,options:l}}},function(t,e,n){"use strict";var i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"multiselect",class:{"multiselect--active":t.isOpen,"multiselect--disabled":t.disabled,"multiselect--above":t.isAbove},attrs:{tabindex:t.searchable?-1:t.tabindex},on:{focus:function(e){t.activate()},blur:function(e){!t.searchable&&t.deactivate()},keydown:[function(e){return"button"in e||!t._k(e.keyCode,"down",40,e.key,"ArrowDown")?e.target!==e.currentTarget?null:(e.preventDefault(),void t.pointerForward()):null},function(e){return"button"in e||!t._k(e.keyCode,"up",38,e.key,"ArrowUp")?e.target!==e.currentTarget?null:(e.preventDefault(),void t.pointerBackward()):null},function(e){return"button"in e||!t._k(e.keyCode,"enter",13,e.key,"Enter")||!t._k(e.keyCode,"tab",9,e.key,"Tab")?(e.stopPropagation(),e.target!==e.currentTarget?null:void t.addPointerElement(e)):null}],keyup:function(e){if(!("button"in e)&&t._k(e.keyCode,"esc",27,e.key,"Escape"))return null;t.deactivate()}}},[t._t("caret",[n("div",{staticClass:"multiselect__select",on:{mousedown:function(e){e.preventDefault(),e.stopPropagation(),t.toggle()}}})],{toggle:t.toggle}),t._v(" "),t._t("clear",null,{search:t.search}),t._v(" "),n("div",{ref:"tags",staticClass:"multiselect__tags"},[n("div",{directives:[{name:"show",rawName:"v-show",value:t.visibleValues.length>0,expression:"visibleValues.length > 0"}],staticClass:"multiselect__tags-wrap"},[t._l(t.visibleValues,function(e){return[t._t("tag",[n("span",{staticClass:"multiselect__tag"},[n("span",{domProps:{textContent:t._s(t.getOptionLabel(e))}}),t._v(" "),n("i",{staticClass:"multiselect__tag-icon",attrs:{"aria-hidden":"true",tabindex:"1"},on:{keydown:function(n){if(!("button"in n)&&t._k(n.keyCode,"enter",13,n.key,"Enter"))return null;n.preventDefault(),t.removeElement(e)},mousedown:function(n){n.preventDefault(),t.removeElement(e)}}})])],{option:e,search:t.search,remove:t.removeElement})]})],2),t._v(" "),t.internalValue&&t.internalValue.length>t.limit?[t._t("limit",[n("strong",{staticClass:"multiselect__strong",domProps:{textContent:t._s(t.limitText(t.internalValue.length-t.limit))}})])]:t._e(),t._v(" "),n("transition",{attrs:{name:"multiselect__loading"}},[t._t("loading",[n("div",{directives:[{name:"show",rawName:"v-show",value:t.loading,expression:"loading"}],staticClass:"multiselect__spinner"})])],2),t._v(" "),n("input",{directives:[{name:"show",rawName:"v-show",value:t.isOpen&&t.searchable,expression:"isOpen && searchable"}],ref:"search",staticClass:"multiselect__input",style:t.inputStyle,attrs:{name:t.name,id:t.id,type:"text",autocomplete:"off",placeholder:t.placeholder,disabled:t.disabled,tabindex:t.tabindex},domProps:{value:t.search},on:{input:function(e){t.updateSearch(e.target.value)},focus:function(e){e.preventDefault(),t.activate()},blur:function(e){e.preventDefault(),t.deactivate()},keyup:function(e){if(!("button"in e)&&t._k(e.keyCode,"esc",27,e.key,"Escape"))return null;t.deactivate()},keydown:[function(e){if(!("button"in e)&&t._k(e.keyCode,"down",40,e.key,"ArrowDown"))return null;e.preventDefault(),t.pointerForward()},function(e){if(!("button"in e)&&t._k(e.keyCode,"up",38,e.key,"ArrowUp"))return null;e.preventDefault(),t.pointerBackward()},function(e){return"button"in e||!t._k(e.keyCode,"enter",13,e.key,"Enter")?(e.preventDefault(),e.stopPropagation(),e.target!==e.currentTarget?null:void t.addPointerElement(e)):null},function(e){if(!("button"in e)&&t._k(e.keyCode,"delete",[8,46],e.key,["Backspace","Delete"]))return null;e.stopPropagation(),t.removeLastElement()}]}}),t._v(" "),t.isSingleLabelVisible?n("span",{staticClass:"multiselect__single",on:{mousedown:function(e){return e.preventDefault(),t.toggle(e)}}},[t._t("singleLabel",[[t._v(t._s(t.currentOptionLabel))]],{option:t.singleValue})],2):t._e(),t._v(" "),t.isPlaceholderVisible?n("span",{on:{mousedown:function(e){return e.preventDefault(),t.toggle(e)}}},[t._t("placeholder",[n("span",{staticClass:"multiselect__single"},[t._v("\n            "+t._s(t.placeholder)+"\n          ")])])],2):t._e()],2),t._v(" "),n("transition",{attrs:{name:"multiselect"}},[n("div",{directives:[{name:"show",rawName:"v-show",value:t.isOpen,expression:"isOpen"}],ref:"list",staticClass:"multiselect__content-wrapper",style:{maxHeight:t.optimizedHeight+"px"},on:{focus:t.activate,mousedown:function(t){t.preventDefault()}}},[n("ul",{staticClass:"multiselect__content",style:t.contentStyle},[t._t("beforeList"),t._v(" "),t.multiple&&t.max===t.internalValue.length?n("li",[n("span",{staticClass:"multiselect__option"},[t._t("maxElements",[t._v("Maximum of "+t._s(t.max)+" options selected. First remove a selected option to select another.")])],2)]):t._e(),t._v(" "),!t.max||t.internalValue.length<t.max?t._l(t.filteredOptions,function(e,i){return n("li",{key:i,staticClass:"multiselect__element"},[e&&(e.$isLabel||e.$isDisabled)?t._e():n("span",{staticClass:"multiselect__option",class:t.optionHighlight(i,e),attrs:{"data-select":e&&e.isTag?t.tagPlaceholder:t.selectLabelText,"data-selected":t.selectedLabelText,"data-deselect":t.deselectLabelText},on:{click:function(n){n.stopPropagation(),t.select(e)},mouseenter:function(e){if(e.target!==e.currentTarget)return null;t.pointerSet(i)}}},[t._t("option",[n("span",[t._v(t._s(t.getOptionLabel(e)))])],{option:e,search:t.search})],2),t._v(" "),e&&(e.$isLabel||e.$isDisabled)?n("span",{staticClass:"multiselect__option",class:t.groupHighlight(i,e),attrs:{"data-select":t.groupSelect&&t.selectGroupLabelText,"data-deselect":t.groupSelect&&t.deselectGroupLabelText},on:{mouseenter:function(e){if(e.target!==e.currentTarget)return null;t.groupSelect&&t.pointerSet(i)},mousedown:function(n){n.preventDefault(),t.selectGroup(e)}}},[t._t("option",[n("span",[t._v(t._s(t.getOptionLabel(e)))])],{option:e,search:t.search})],2):t._e()])}):t._e(),t._v(" "),n("li",{directives:[{name:"show",rawName:"v-show",value:t.showNoResults&&0===t.filteredOptions.length&&t.search&&!t.loading,expression:"showNoResults && (filteredOptions.length === 0 && search && !loading)"}]},[n("span",{staticClass:"multiselect__option"},[t._t("noResult",[t._v("No elements found. Consider changing the search query.")])],2)]),t._v(" "),t._t("afterList")],2)])])],2)},r=[],o={render:i,staticRenderFns:r};e.a=o}])});

/***/ }),
/* 43 */,
/* 44 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(16);
var document = __webpack_require__(7).document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),
/* 46 */
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(44);
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),
/* 48 */,
/* 49 */
/***/ (function(module, exports) {

module.exports = true;


/***/ }),
/* 50 */
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
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__(4);
var global = __webpack_require__(7);
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: __webpack_require__(49) ? 'pure' : 'global',
  copyright: '© 2018 Denis Pushkarev (zloirock.ru)'
});


/***/ }),
/* 52 */
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),
/* 53 */,
/* 54 */,
/* 55 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_single_task_vue__ = __webpack_require__(34);
/* empty harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_289031e6_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_single_task_vue__ = __webpack_require__(88);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(95)
  __webpack_require__(96)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_single_task_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_289031e6_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_single_task_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/components/project-task-lists/single-task.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-289031e6", Component.options)
  } else {
    hotAPI.reload("data-v-289031e6", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 56 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_Sketch_vue__ = __webpack_require__(100);
/* empty harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__vue_loader_lib_template_compiler_index_id_data_v_511efdd0_hasScoped_false_buble_transforms_vue_loader_lib_selector_type_template_index_0_Sketch_vue__ = __webpack_require__(342);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_Sketch_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__vue_loader_lib_template_compiler_index_id_data_v_511efdd0_hasScoped_false_buble_transforms_vue_loader_lib_selector_type_template_index_0_Sketch_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "node_modules/vue-color/src/components/Sketch.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-511efdd0", Component.options)
  } else {
    hotAPI.reload("data-v-511efdd0", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 57 */,
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(61), __esModule: true };

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(62), __esModule: true };

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _defineProperty = __webpack_require__(58);

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
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(72);
var $Object = __webpack_require__(4).Object;
module.exports = function defineProperty(it, key, desc) {
  return $Object.defineProperty(it, key, desc);
};


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(73);
module.exports = __webpack_require__(4).Object.keys;


/***/ }),
/* 63 */
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(23);
var toLength = __webpack_require__(70);
var toAbsoluteIndex = __webpack_require__(69);
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
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(63);
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
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(6) && !__webpack_require__(11)(function () {
  return Object.defineProperty(__webpack_require__(45)('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__(14);
var toIObject = __webpack_require__(23);
var arrayIndexOf = __webpack_require__(64)(false);
var IE_PROTO = __webpack_require__(39)('IE_PROTO');

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
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

// most Object methods by ES6 should accept primitives
var $export = __webpack_require__(13);
var core = __webpack_require__(4);
var fails = __webpack_require__(11);
module.exports = function (KEY, exec) {
  var fn = (core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
};


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(22);
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(22);
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(16);
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
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(13);
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !__webpack_require__(6), 'Object', { defineProperty: __webpack_require__(17).f });


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 Object.keys(O)
var toObject = __webpack_require__(40);
var $keys = __webpack_require__(38);

__webpack_require__(68)('keys', function () {
  return function keys(it) {
    return $keys(toObject(it));
  };
});


/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(false);
// imports


// module
exports.push([module.i, "\n.pm-todo .pm-modal-conetnt .pm-desc-content{\n    position: relative;\n}\n.pm-todo .pm-modal-conetnt .pm-task-title-right {\n    float: right;\n}\ntextarea.pm-desc-field {\n    line-height: 1.6;\n}\n.pm-task-modal .pm-multiselect-single-task .multiselect__input{\n    width: 100%;\n}\n.pm-task-modal .pm-multiselect-single-task .multiselect__select {\n    display: none;\n}\n.pm-task-modal .pm-multiselect-single-task .multiselect__tags {\n    padding: 8px 12px 0 8px;\n}\n.pm-task-modal .pm-multiselect-single-task .multiselect__tag {\n    display: none;\n    margin: 0;\n    padding: 0;\n}\na.task-description-edit-icon {\n    position: absolute;\n    top: -22px;\n    right: 0px;\n    padding: 10px;\n}\n\n", ""]);

// exports


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(false);
// imports


// module
exports.push([module.i, "\n.pm-line-through {\n    text-decoration: line-through;\n}\n.pm-multiselect-single-task {\n    position: absolute;\n    width: 26%;\n}\n", ""]);

// exports


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(false);
// imports


// module
exports.push([module.i, "\n.pm-small-title input[type=\"checkbox\"] {\n    margin: -3px 0 0 !important;\n}\n.pm-user-list input[type=\"checkbox\"] {\n    margin: -1px 0 0 !important;\n}\n", ""]);

// exports


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(false);
// imports


// module
exports.push([module.i, "\n.pm-task-comment-thumb {\n    height: 80px;\n    width: 80px;\n}\n", ""]);

// exports


/***/ }),
/* 78 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_date_picker_vue__ = __webpack_require__(28);
/* empty harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_158f4fcc_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_date_picker_vue__ = __webpack_require__(87);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_date_picker_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_158f4fcc_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_date_picker_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/components/common/date-picker.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-158f4fcc", Component.options)
  } else {
    hotAPI.reload("data-v-158f4fcc", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 79 */,
/* 80 */,
/* 81 */,
/* 82 */,
/* 83 */,
/* 84 */,
/* 85 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_task_comment_form_vue__ = __webpack_require__(35);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_f52544c6_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_task_comment_form_vue__ = __webpack_require__(94);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_task_comment_form_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_f52544c6_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_task_comment_form_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/components/project-task-lists/task-comment-form.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-f52544c6", Component.options)
  } else {
    hotAPI.reload("data-v-f52544c6", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 86 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_task_comments_vue__ = __webpack_require__(36);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_8f6feec2_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_task_comments_vue__ = __webpack_require__(93);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(98)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_task_comments_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_8f6feec2_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_task_comments_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/components/project-task-lists/task-comments.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-8f6feec2", Component.options)
  } else {
    hotAPI.reload("data-v-8f6feec2", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 87 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("input", {
    staticClass: "pm-datepicker",
    attrs: { type: "text" },
    domProps: { value: _vm.dateValue }
  })
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-158f4fcc", esExports)
  }
}

/***/ }),
/* 88 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "nonsortable" }, [
    _vm.loading
      ? _c(
          "div",
          {
            staticClass: "modal-mask half-modal pm-task-modal modal-transition"
          },
          [
            _c("div", { staticClass: "modal-wrapper" }, [
              _c(
                "div",
                {
                  staticClass: "modal-container",
                  staticStyle: { height: "20000px" }
                },
                [
                  _c("span", { staticClass: "close-vue-modal" }, [
                    _c(
                      "a",
                      {
                        on: {
                          click: function($event) {
                            $event.preventDefault()
                            _vm.closePopup()
                          }
                        }
                      },
                      [_c("span", { staticClass: "dashicons dashicons-no" })]
                    )
                  ]),
                  _vm._v(" "),
                  _vm._m(0)
                ]
              )
            ])
          ]
        )
      : _c(
          "div",
          {
            staticClass: "modal-mask half-modal pm-task-modal modal-transition"
          },
          [
            _c("div", { staticClass: "modal-wrapper" }, [
              _c("div", { staticClass: "modal-container" }, [
                _c("span", { staticClass: "close-vue-modal" }, [
                  _c(
                    "a",
                    {
                      on: {
                        click: function($event) {
                          $event.preventDefault()
                          _vm.closePopup()
                        }
                      }
                    },
                    [_c("span", { staticClass: "dashicons dashicons-no" })]
                  )
                ]),
                _vm._v(" "),
                _c("div", { staticClass: "modal-body pm-todolist" }, [
                  _c("div", { staticClass: "pm-col-12 pm-todo" }, [
                    _c(
                      "div",
                      { staticClass: "pm-modal-conetnt" },
                      [
                        _c(
                          "div",
                          { staticClass: "cmp-task-header" },
                          [
                            _c("h3", { staticClass: "pm-task-title" }, [
                              _c(
                                "span",
                                { staticClass: "pm-mark-done-checkbox" },
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
                                      disabled: _vm.can_complete_task(_vm.task),
                                      type: "checkbox"
                                    },
                                    domProps: {
                                      checked: Array.isArray(_vm.task.status)
                                        ? _vm._i(_vm.task.status, null) > -1
                                        : _vm.task.status
                                    },
                                    on: {
                                      click: function($event) {
                                        _vm.singleTaskDoneUndone()
                                      },
                                      change: function($event) {
                                        var $$a = _vm.task.status,
                                          $$el = $event.target,
                                          $$c = $$el.checked ? true : false
                                        if (Array.isArray($$a)) {
                                          var $$v = null,
                                            $$i = _vm._i($$a, $$v)
                                          if ($$el.checked) {
                                            $$i < 0 &&
                                              _vm.$set(
                                                _vm.task,
                                                "status",
                                                $$a.concat([$$v])
                                              )
                                          } else {
                                            $$i > -1 &&
                                              _vm.$set(
                                                _vm.task,
                                                "status",
                                                $$a
                                                  .slice(0, $$i)
                                                  .concat($$a.slice($$i + 1))
                                              )
                                          }
                                        } else {
                                          _vm.$set(_vm.task, "status", $$c)
                                        }
                                      }
                                    }
                                  })
                                ]
                              ),
                              _vm._v(" "),
                              _c(
                                "span",
                                {
                                  class:
                                    _vm.singleTaskTitle(_vm.task) +
                                    " pm-task-title-wrap"
                                },
                                [
                                  _c(
                                    "div",
                                    { staticClass: "pm-task-title-text" },
                                    [
                                      _vm.is_task_title_edit_mode &&
                                      _vm.can_edit_task(_vm.task)
                                        ? _c("span", [
                                            _c("input", {
                                              directives: [
                                                {
                                                  name: "model",
                                                  rawName: "v-model",
                                                  value: _vm.task.title,
                                                  expression: "task.title"
                                                }
                                              ],
                                              staticClass:
                                                "pm-task-title-activity pm-task-title-field",
                                              attrs: { type: "text" },
                                              domProps: {
                                                value: _vm.task.title
                                              },
                                              on: {
                                                blur: function($event) {
                                                  _vm.updateTaskElement(
                                                    _vm.task
                                                  )
                                                },
                                                keyup: function($event) {
                                                  if (
                                                    !("button" in $event) &&
                                                    _vm._k(
                                                      $event.keyCode,
                                                      "enter",
                                                      13,
                                                      $event.key,
                                                      "Enter"
                                                    )
                                                  ) {
                                                    return null
                                                  }
                                                  _vm.updateTaskElement(
                                                    _vm.task
                                                  )
                                                },
                                                input: function($event) {
                                                  if ($event.target.composing) {
                                                    return
                                                  }
                                                  _vm.$set(
                                                    _vm.task,
                                                    "title",
                                                    $event.target.value
                                                  )
                                                }
                                              }
                                            })
                                          ])
                                        : _vm._e(),
                                      _vm._v(" "),
                                      !_vm.is_task_title_edit_mode
                                        ? _c(
                                            "span",
                                            {
                                              class:
                                                _vm.lineThrough(_vm.task) +
                                                " pm-task-title-activity pm-task-title-span",
                                              on: {
                                                click: function($event) {
                                                  $event.preventDefault()
                                                  _vm.isTaskTitleEditMode()
                                                }
                                              }
                                            },
                                            [
                                              _vm._v(
                                                "\n                                                " +
                                                  _vm._s(_vm.task.title) +
                                                  "\n                                            "
                                              )
                                            ]
                                          )
                                        : _vm._e()
                                    ]
                                  ),
                                  _vm._v(" "),
                                  _c("div", {
                                    staticClass: "clearfix pm-clear"
                                  })
                                ]
                              ),
                              _vm._v(" "),
                              _c(
                                "div",
                                { staticClass: "pm-task-title-right" },
                                [
                                  _vm.PM_Vars.is_pro &&
                                  _vm.task.status == "0" &&
                                  _vm.can_edit_task(_vm.task) &&
                                  _vm.user_can("view_private_task")
                                    ? _c(
                                        "a",
                                        {
                                          attrs: { href: "#" },
                                          on: {
                                            click: function($event) {
                                              $event.preventDefault()
                                              _vm.singleTaskLockUnlock(_vm.task)
                                            }
                                          }
                                        },
                                        [
                                          _c("span", {
                                            class: _vm.privateClass(
                                              _vm.task.meta.privacy
                                            )
                                          })
                                        ]
                                      )
                                    : _vm._e(),
                                  _vm._v(" "),
                                  _c(
                                    "a",
                                    {
                                      directives: [
                                        {
                                          name: "pm-tooltip",
                                          rawName: "v-pm-tooltip"
                                        }
                                      ],
                                      attrs: {
                                        title: _vm.__(
                                          "Copy this task URL",
                                          "pm"
                                        ),
                                        href: "#"
                                      },
                                      on: {
                                        click: function($event) {
                                          $event.preventDefault()
                                          _vm.copyUrl(_vm.task)
                                        }
                                      }
                                    },
                                    [
                                      _c("i", {
                                        staticClass: "fa fa-clipboard",
                                        attrs: { "aria-hidden": "true" }
                                      })
                                    ]
                                  )
                                ]
                              ),
                              _vm._v(" "),
                              _c("div", { staticClass: "clearfix pm-clear" })
                            ]),
                            _vm._v(" "),
                            _c("do-action", {
                              attrs: {
                                hook: "single_task_inline",
                                actionData: _vm.doActionData
                              }
                            }),
                            _vm._v(" "),
                            _c("div", { staticClass: "pm-task-meta" }, [
                              _c(
                                "span",
                                { staticClass: "pm-assigned-user-wrap" },
                                [
                                  _vm._l(_vm.task.assignees.data, function(
                                    user
                                  ) {
                                    return _vm.task.assignees.data.length
                                      ? _c(
                                          "span",
                                          {
                                            staticClass: "pm-assigned-user",
                                            on: {
                                              click: function($event) {
                                                $event.preventDefault()
                                                _vm.isEnableMultiSelect()
                                              }
                                            }
                                          },
                                          [
                                            _c(
                                              "a",
                                              {
                                                attrs: {
                                                  href: "#",
                                                  title: user.display_name
                                                }
                                              },
                                              [
                                                _c("img", {
                                                  staticClass:
                                                    "avatar avatar-48 photo",
                                                  attrs: {
                                                    alt: user.display_name,
                                                    src: user.avatar_url,
                                                    height: "48",
                                                    width: "48"
                                                  }
                                                })
                                              ]
                                            )
                                          ]
                                        )
                                      : _vm._e()
                                  }),
                                  _vm._v(" "),
                                  !_vm.task.assignees.data.length
                                    ? _c(
                                        "span",
                                        {
                                          staticClass: "pm-assigned-user",
                                          on: {
                                            click: function($event) {
                                              $event.preventDefault()
                                              _vm.isEnableMultiSelect()
                                            }
                                          }
                                        },
                                        [
                                          _c("i", {
                                            staticClass: "fa fa-user",
                                            staticStyle: {
                                              "font-size": "20px"
                                            },
                                            attrs: { "aria-hidden": "true" }
                                          })
                                        ]
                                      )
                                    : _vm._e(),
                                  _vm._v(" "),
                                  _vm.is_enable_multi_select
                                    ? _c(
                                        "div",
                                        {
                                          staticClass:
                                            "pm-multiselect pm-multiselect-single-task"
                                        },
                                        [
                                          _c("multiselect", {
                                            attrs: {
                                              options: _vm.project_users,
                                              multiple: true,
                                              "close-on-select": false,
                                              "clear-on-select": true,
                                              "show-labels": true,
                                              searchable: true,
                                              placeholder: "Select User",
                                              "select-label": "",
                                              "selected-label": "selected",
                                              "deselect-label": "",
                                              label: "display_name",
                                              "track-by": "id",
                                              "allow-empty": true
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
                                    : _vm._e()
                                ],
                                2
                              ),
                              _vm._v(" "),
                              _vm.task.start_at.date || _vm.task.due_date.date
                                ? _c(
                                    "span",
                                    {
                                      class:
                                        _vm.taskDateWrap(
                                          _vm.task.due_date.date
                                        ) + " pm-task-date-wrap pm-date-window"
                                    },
                                    [
                                      _c(
                                        "span",
                                        {
                                          on: {
                                            click: function($event) {
                                              $event.preventDefault()
                                              _vm.isTaskDateEditMode()
                                            }
                                          }
                                        },
                                        [
                                          _vm.task_start_field
                                            ? _c("span", [
                                                _vm._v(
                                                  "\n                                                    " +
                                                    _vm._s(
                                                      _vm.dateFormat(
                                                        _vm.task.start_at.date
                                                      )
                                                    ) +
                                                    "\n                                                "
                                                )
                                              ])
                                            : _vm._e(),
                                          _vm._v(" "),
                                          _vm.task_start_field &&
                                          _vm.task.start_at.date &&
                                          _vm.task.due_date.date
                                            ? _c("span", [_vm._v("–")])
                                            : _vm._e(),
                                          _vm._v(" "),
                                          _vm.task.due_date
                                            ? _c("span", [
                                                _vm._v(
                                                  "\n                                                    " +
                                                    _vm._s(
                                                      _vm.dateFormat(
                                                        _vm.task.due_date.date
                                                      )
                                                    ) +
                                                    "\n                                                "
                                                )
                                              ])
                                            : _vm._e()
                                        ]
                                      ),
                                      _vm._v(" "),
                                      _vm.is_task_date_edit_mode &&
                                      _vm.can_edit_task(_vm.task)
                                        ? _c(
                                            "div",
                                            {
                                              staticClass: "pm-date-update-wrap"
                                            },
                                            [
                                              _vm.task_start_field
                                                ? _c("div", {
                                                    directives: [
                                                      {
                                                        name: "pm-datepicker",
                                                        rawName:
                                                          "v-pm-datepicker"
                                                      }
                                                    ],
                                                    staticClass:
                                                      "pm-date-picker-from pm-inline-date-picker-from"
                                                  })
                                                : _vm._e(),
                                              _vm._v(" "),
                                              _c("div", {
                                                directives: [
                                                  {
                                                    name: "pm-datepicker",
                                                    rawName: "v-pm-datepicker"
                                                  }
                                                ],
                                                staticClass:
                                                  "pm-date-picker-to pm-inline-date-picker-to"
                                              }),
                                              _vm._v(" "),
                                              _c("div", {
                                                staticClass: "clearfix pm-clear"
                                              })
                                            ]
                                          )
                                        : _vm._e()
                                    ]
                                  )
                                : _vm._e(),
                              _vm._v(" "),
                              !_vm.task.start_at.date && !_vm.task.due_date.date
                                ? _c(
                                    "span",
                                    {
                                      staticClass:
                                        "pm-task-date-wrap pm-date-window"
                                    },
                                    [
                                      _c(
                                        "span",
                                        {
                                          class: _vm.task.status
                                            ? _vm.completedTaskWrap(
                                                _vm.task.start_at.date,
                                                _vm.task.due_date.date
                                              )
                                            : _vm.taskDateWrap(
                                                _vm.task.start_at.date,
                                                _vm.task.due_date.date
                                              ),
                                          on: {
                                            click: function($event) {
                                              $event.preventDefault()
                                              _vm.isTaskDateEditMode()
                                            }
                                          }
                                        },
                                        [_vm._m(1)]
                                      ),
                                      _vm._v(" "),
                                      _vm.is_task_date_edit_mode &&
                                      _vm.can_edit_task(_vm.task)
                                        ? _c(
                                            "div",
                                            {
                                              staticClass: "pm-date-update-wrap"
                                            },
                                            [
                                              _vm.task_start_field
                                                ? _c("div", {
                                                    directives: [
                                                      {
                                                        name: "pm-datepicker",
                                                        rawName:
                                                          "v-pm-datepicker"
                                                      }
                                                    ],
                                                    staticClass:
                                                      "pm-date-picker-from pm-inline-date-picker-from"
                                                  })
                                                : _vm._e(),
                                              _vm._v(" "),
                                              _c("div", {
                                                directives: [
                                                  {
                                                    name: "pm-datepicker",
                                                    rawName: "v-pm-datepicker"
                                                  }
                                                ],
                                                staticClass:
                                                  "pm-date-picker-to pm-inline-date-picker-to"
                                              }),
                                              _vm._v(" "),
                                              _c("div", {
                                                staticClass: "clearfix pm-clear"
                                              })
                                            ]
                                          )
                                        : _vm._e()
                                    ]
                                  )
                                : _vm._e(),
                              _vm._v(" "),
                              _c(
                                "span",
                                { staticClass: "pm-task-comment-count" },
                                [
                                  _vm._v(
                                    _vm._s(_vm.task.comments.data.length) +
                                      " " +
                                      _vm._s(_vm.__("Comments", "pm"))
                                  )
                                ]
                              )
                            ])
                          ],
                          1
                        ),
                        _vm._v(" "),
                        _c(
                          "div",
                          { staticClass: "task-details" },
                          [
                            !_vm.is_task_details_edit_mode
                              ? _c(
                                  "div",
                                  {
                                    staticClass: "pm-des-area pm-desc-content"
                                  },
                                  [
                                    _vm.task.description.content != ""
                                      ? _c("div", [
                                          _c("div", {
                                            staticClass: "pm-task-description",
                                            domProps: {
                                              innerHTML: _vm._s(
                                                _vm.task.description.html
                                              )
                                            }
                                          })
                                        ])
                                      : _vm._e(),
                                    _vm._v(" "),
                                    _c(
                                      "a",
                                      {
                                        staticClass:
                                          "task-description-edit-icon",
                                        attrs: {
                                          title: _vm.update_description
                                        },
                                        on: {
                                          click: function($event) {
                                            $event.preventDefault()
                                            _vm.isTaskDetailsEditMode()
                                          }
                                        }
                                      },
                                      [
                                        _c("i", {
                                          staticClass: "fa fa-pencil",
                                          staticStyle: { "font-size": "16px" },
                                          attrs: { "aria-hidden": "true" }
                                        })
                                      ]
                                    )
                                  ]
                                )
                              : _vm._e(),
                            _vm._v(" "),
                            _vm.is_task_details_edit_mode &&
                            _vm.can_edit_task(_vm.task)
                              ? _c("textarea", {
                                  directives: [
                                    {
                                      name: "prevent-line-break",
                                      rawName: "v-prevent-line-break"
                                    },
                                    {
                                      name: "model",
                                      rawName: "v-model",
                                      value: _vm.task_description,
                                      expression: "task_description"
                                    }
                                  ],
                                  staticClass: "pm-des-area pm-desc-field",
                                  domProps: { value: _vm.task_description },
                                  on: {
                                    blur: function($event) {
                                      _vm.updateDescription(_vm.task, $event)
                                    },
                                    keyup: function($event) {
                                      if (
                                        !("button" in $event) &&
                                        _vm._k(
                                          $event.keyCode,
                                          "enter",
                                          13,
                                          $event.key,
                                          "Enter"
                                        )
                                      ) {
                                        return null
                                      }
                                      _vm.updateDescription(_vm.task, $event)
                                    },
                                    input: function($event) {
                                      if ($event.target.composing) {
                                        return
                                      }
                                      _vm.task_description = $event.target.value
                                    }
                                  }
                                })
                              : _vm._e(),
                            _vm._v(" "),
                            _vm.is_task_details_edit_mode &&
                            _vm.can_edit_task(_vm.task)
                              ? _c("div", { staticClass: "pm-help-text" }, [
                                  _c("span", [
                                    _vm._v(
                                      _vm._s(
                                        _vm.__(
                                          "Shift+Enter for line break",
                                          "pm"
                                        )
                                      )
                                    )
                                  ])
                                ])
                              : _vm._e(),
                            _vm._v(" "),
                            _c("div", { staticClass: "clearfix pm-clear" }),
                            _vm._v(" "),
                            _c("do-action", {
                              attrs: {
                                hook: "aftre_single_task_details",
                                actionData: _vm.doActionData
                              }
                            })
                          ],
                          1
                        ),
                        _vm._v(" "),
                        _c("do-action", {
                          attrs: {
                            hook: "aftre_single_task_content",
                            actionData: _vm.doActionData
                          }
                        }),
                        _vm._v(" "),
                        _c("div", { staticClass: "pm-todo-wrap clearfix" }, [
                          _c("div", { staticClass: "pm-task-comment" }, [
                            _c(
                              "div",
                              { staticClass: "comment-content" },
                              [
                                _c("task-comments", {
                                  attrs: {
                                    task: _vm.task,
                                    comments: _vm.task.comments.data
                                  }
                                })
                              ],
                              1
                            )
                          ])
                        ])
                      ],
                      1
                    ),
                    _vm._v(" "),
                    _c("div", { staticClass: "clearfix" })
                  ])
                ]),
                _vm._v(" "),
                _c("div", { staticClass: "clearfix" })
              ])
            ])
          ]
        )
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "modal-body pm-todolist" }, [
      _c("div", { staticClass: "pm-data-load-before" }, [
        _c("div", { staticClass: "loadmoreanimation" }, [
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
      ])
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("span", [
      _c("i", {
        staticClass: "fa fa-calendar",
        staticStyle: { "font-size": "20px" },
        attrs: { "aria-hidden": "true" }
      })
    ])
  }
]
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-289031e6", esExports)
  }
}

/***/ }),
/* 89 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _vm.assain_users.length
    ? _c("div", { staticClass: "notify-users" }, [
        _c("h2", { staticClass: "pm-box-title" }, [
          _vm._v(
            " \n        " +
              _vm._s(_vm.__("Notify users", "pm")) +
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
              _vm._v(
                " \n            " +
                  _vm._s(_vm.__("Select all", "pm")) +
                  "\n        "
              )
            ]
          )
        ]),
        _vm._v(" "),
        _c(
          "ul",
          { staticClass: "pm-user-list" },
          [
            _vm._l(_vm.assain_users, function(user) {
              return _c("li", { key: user.id }, [
                _c("label", [
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
                    attrs: { type: "checkbox" },
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
                    " \n                " +
                      _vm._s(user.display_name) +
                      "\n            "
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
    : _vm._e()
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-39a04148", esExports)
  }
}

/***/ }),
/* 90 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("textarea", {
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
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-3fcc7e9a", esExports)
  }
}

/***/ }),
/* 91 */
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
            _c(
              "a",
              {
                staticClass: "pm-uploaded-img",
                attrs: { href: file.url, target: "_blank" }
              },
              [
                _c("img", {
                  staticClass: "pm-uploaded-file",
                  attrs: { src: file.thumb, alt: file.name }
                })
              ]
            ),
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
              [_vm._v(_vm._s(_vm.__("Delete File", "pm")))]
            )
          ])
        })
      ),
      _vm._v(" "),
      _c("span", [
        _vm._v(
          " \n            " +
            _vm._s(_vm.__("To attach", "pm")) +
            " \n            "
        ),
        _c(
          "a",
          {
            directives: [{ name: "pm-uploader", rawName: "v-pm-uploader" }],
            staticClass: "pm-upload-pickfiles",
            attrs: { href: "#" }
          },
          [_vm._v(_vm._s(_vm.__("select files", "pm")))]
        ),
        _vm._v(
          " \n            " +
            _vm._s(_vm.__("from your computer.", "pm")) +
            "\n        "
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
    require("vue-hot-reload-api")      .rerender("data-v-615029ec", esExports)
  }
}

/***/ }),
/* 92 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _vm.total_pages > 1
    ? _c("div", { staticClass: "pm-pagination-wrap" }, [
        _c(
          "div",
          { staticClass: "pm-pagination-inner" },
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
                  key: page,
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
    require("vue-hot-reload-api")      .rerender("data-v-6ddfcbc6", esExports)
  }
}

/***/ }),
/* 93 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "pm-task-comment-wrap" }, [
    _c("h3", { staticClass: "pm-comment-title" }, [
      _vm._v(_vm._s(_vm.__("Discuss this task", "pm")))
    ]),
    _vm._v(" "),
    _vm.comments.length
      ? _c(
          "ul",
          { staticClass: "pm-comment-wrap" },
          _vm._l(_vm.comments, function(comment) {
            return _c(
              "li",
              {
                key: "tasks-comments-" + comment.id,
                class: "pm-comment clearfix even pm-fade-out-" + comment.id
              },
              [
                _c("div", { staticClass: "pm-avatar" }, [
                  _c(
                    "a",
                    {
                      attrs: {
                        href: _vm.myTaskRedirect(comment.creator.data.id),
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
                _c(
                  "div",
                  { staticClass: "pm-comment-container" },
                  [
                    _c("div", { staticClass: "pm-comment-meta" }, [
                      _vm._v(
                        "\n                    " +
                          _vm._s(_vm.__("By", "pm")) +
                          "\n                    "
                      ),
                      _c("span", { staticClass: "pm-author" }, [
                        _c(
                          "a",
                          {
                            attrs: {
                              href: _vm.myTaskRedirect(comment.creator.data.id),
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
                      _c("span", [_vm._v(_vm._s(_vm.__("on", "pm")))]),
                      _vm._v(" "),
                      _c("span", { staticClass: "pm-date" }, [
                        _c(
                          "time",
                          {
                            attrs: {
                              datetime: _vm.dateISO8601Format(
                                comment.comment_date
                              ),
                              title: _vm.dateISO8601Format(comment.comment_date)
                            }
                          },
                          [_vm._v(_vm._s(_vm.commentDate(comment)))]
                        )
                      ]),
                      _vm._v(" "),
                      _vm.can_edit_comment(comment)
                        ? _c("div", { staticClass: "pm-comment-action" }, [
                            _c("span", { staticClass: "pm-edit-link" }, [
                              _c("a", {
                                staticClass: "dashicons dashicons-edit",
                                attrs: { href: "#" },
                                on: {
                                  click: function($event) {
                                    $event.preventDefault()
                                    _vm.showHideTaskCommentForm(comment)
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
                                    _vm.deleteTaskComment(comment.id)
                                  }
                                }
                              })
                            ])
                          ])
                        : _vm._e()
                    ]),
                    _vm._v(" "),
                    _c("div", { staticClass: "pm-comment-content" }, [
                      _c("div", {
                        domProps: { innerHTML: _vm._s(comment.content) }
                      }),
                      _vm._v(" "),
                      comment.files.data.length
                        ? _c(
                            "ul",
                            { staticClass: "pm-attachments" },
                            _vm._l(comment.files.data, function(file) {
                              return _c("li", [
                                file.type == "image"
                                  ? _c(
                                      "a",
                                      {
                                        directives: [
                                          {
                                            name: "pm-pretty-photo",
                                            rawName: "v-pm-pretty-photo"
                                          }
                                        ],
                                        staticClass: "pm-colorbox-img",
                                        attrs: {
                                          href: _vm.getDownloadUrl(
                                            file.attachment_id
                                          ),
                                          title: file.name,
                                          target: "_blank"
                                        }
                                      },
                                      [
                                        _c("img", {
                                          staticClass: "pm-content-img-size",
                                          attrs: {
                                            src: file.thumb,
                                            alt: file.name
                                          }
                                        })
                                      ]
                                    )
                                  : _c(
                                      "a",
                                      {
                                        staticClass: "pm-colorbox-img",
                                        attrs: {
                                          href: _vm.getDownloadUrl(
                                            file.attachment_id
                                          ),
                                          title: file.name,
                                          target: "_blank"
                                        }
                                      },
                                      [
                                        _c("img", {
                                          staticClass: "pm-content-img-size",
                                          attrs: {
                                            src: file.thumb,
                                            alt: file.name
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
                    _vm.can_edit_comment(comment)
                      ? _c("transition", { attrs: { name: "slide" } }, [
                          comment.edit_mode
                            ? _c(
                                "div",
                                { staticClass: "pm-comment-edit-form" },
                                [
                                  _c("task-comment-form", {
                                    attrs: {
                                      task: _vm.task,
                                      comment: comment,
                                      comments: _vm.comments
                                    }
                                  })
                                ],
                                1
                              )
                            : _vm._e()
                        ])
                      : _vm._e()
                  ],
                  1
                )
              ]
            )
          })
        )
      : _vm._e(),
    _vm._v(" "),
    _c("div", { staticClass: "single-todo-comments" }, [
      _c("div", { staticClass: "pm-comment-form-wrap" }, [
        _c("div", { staticClass: "pm-avatar" }, [
          _c(
            "a",
            {
              attrs: { href: _vm.myTaskRedirect(_vm.PM_Vars.current_user.ID) }
            },
            [
              _c("img", {
                attrs: { src: _vm.avatar_url, height: "48", width: "48" }
              })
            ]
          )
        ]),
        _vm._v(" "),
        _c(
          "div",
          { staticClass: "pm-new-doc-comment-form" },
          [
            _c("task-comment-form", {
              attrs: { task: _vm.task, comment: {}, comments: _vm.comments }
            })
          ],
          1
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
    require("vue-hot-reload-api")      .rerender("data-v-8f6feec2", esExports)
  }
}

/***/ }),
/* 94 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "form",
    {
      staticClass: "pm-comment-form-vue pm-comment-form",
      on: {
        submit: function($event) {
          $event.preventDefault()
          _vm.taskCommentAction()
        }
      }
    },
    [
      _c(
        "div",
        { staticClass: "item message pm-sm-col-12 " },
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
        attrs: { users: _vm.task.assignees.data },
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
              attrs: { disabled: _vm.submit_disabled, type: "submit", id: "" },
              domProps: { value: _vm.add_new_comment }
            })
          : _vm._e(),
        _vm._v(" "),
        _vm.comment.edit_mode
          ? _c("input", {
              staticClass: "button-primary",
              attrs: { disabled: _vm.submit_disabled, type: "submit", id: "" },
              domProps: { value: _vm.update_comment }
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
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-f52544c6", esExports)
  }
}

/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(74);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("2403bce3", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-289031e6\",\"scoped\":false,\"hasInlineConfig\":false}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./single-task.vue", function() {
     var newContent = require("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-289031e6\",\"scoped\":false,\"hasInlineConfig\":false}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./single-task.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(75);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("f342587c", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-289031e6\",\"scoped\":false,\"hasInlineConfig\":false}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=1!./single-task.vue", function() {
     var newContent = require("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-289031e6\",\"scoped\":false,\"hasInlineConfig\":false}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=1!./single-task.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(76);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("3fbcc252", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-39a04148\",\"scoped\":false,\"hasInlineConfig\":false}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./notify-user.vue", function() {
     var newContent = require("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-39a04148\",\"scoped\":false,\"hasInlineConfig\":false}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./notify-user.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(77);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("3a17a2b8", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-8f6feec2\",\"scoped\":false,\"hasInlineConfig\":false}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./task-comments.vue", function() {
     var newContent = require("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-8f6feec2\",\"scoped\":false,\"hasInlineConfig\":false}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./task-comments.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 99 */
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


/***/ }),
/* 100 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__mixin_color__ = __webpack_require__(261);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_EditableInput_vue__ = __webpack_require__(263);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__common_Saturation_vue__ = __webpack_require__(265);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__common_Hue_vue__ = __webpack_require__(264);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__common_Alpha_vue__ = __webpack_require__(262);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__common_Checkboard_vue__ = __webpack_require__(170);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//








var presetColors = ['#D0021B', '#F5A623', '#F8E71C', '#8B572A', '#7ED321', '#417505', '#BD10E0', '#9013FE', '#4A90E2', '#50E3C2', '#B8E986', '#000000', '#4A4A4A', '#9B9B9B', '#FFFFFF'];

/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'Sketch',
  mixins: [__WEBPACK_IMPORTED_MODULE_0__mixin_color__["a" /* default */]],
  components: {
    saturation: __WEBPACK_IMPORTED_MODULE_2__common_Saturation_vue__["a" /* default */],
    hue: __WEBPACK_IMPORTED_MODULE_3__common_Hue_vue__["a" /* default */],
    alpha: __WEBPACK_IMPORTED_MODULE_4__common_Alpha_vue__["a" /* default */],
    'ed-in': __WEBPACK_IMPORTED_MODULE_1__common_EditableInput_vue__["a" /* default */],
    checkboard: __WEBPACK_IMPORTED_MODULE_5__common_Checkboard_vue__["a" /* default */]
  },
  props: {
    presetColors: {
      type: Array,
      default: function _default() {
        return presetColors;
      }
    },
    disableAlpha: {
      type: Boolean,
      default: false
    },
    disableFields: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    hex: function hex() {
      return this.colors.hex.replace('#', '');
    },
    activeColor: function activeColor() {
      var rgba = this.colors.rgba;
      return 'rgba(' + [rgba.r, rgba.g, rgba.b, rgba.a].join(',') + ')';
    }
  },
  methods: {
    handlePreset: function handlePreset(c) {
      this.colorChange({
        hex: c,
        source: 'hex'
      });
    },
    childChange: function childChange(data) {
      this.colorChange(data);
    },
    inputChange: function inputChange(data) {
      if (!data) {
        return;
      }
      if (data.hex) {
        this.isValidHex(data.hex) && this.colorChange({
          hex: data.hex,
          source: 'hex'
        });
      } else if (data.r || data.g || data.b || data.a) {
        this.colorChange({
          r: data.r || this.colors.rgba.r,
          g: data.g || this.colors.rgba.g,
          b: data.b || this.colors.rgba.b,
          a: data.a || this.colors.rgba.a,
          source: 'rgba'
        });
      }
    }
  }
});

/***/ }),
/* 101 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Checkboard_vue__ = __webpack_require__(170);
//
//
//
//
//
//
//
//
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
  name: 'Alpha',
  props: {
    value: Object,
    onChange: Function
  },
  components: {
    checkboard: __WEBPACK_IMPORTED_MODULE_0__Checkboard_vue__["a" /* default */]
  },
  computed: {
    colors: function colors() {
      return this.value;
    },
    gradientColor: function gradientColor() {
      var rgba = this.colors.rgba;
      var rgbStr = [rgba.r, rgba.g, rgba.b].join(',');
      return 'linear-gradient(to right, rgba(' + rgbStr + ', 0) 0%, rgba(' + rgbStr + ', 1) 100%)';
    }
  },
  methods: {
    handleChange: function handleChange(e, skip) {
      !skip && e.preventDefault();
      var container = this.$refs.container;
      var containerWidth = container.clientWidth;

      var xOffset = container.getBoundingClientRect().left + window.pageXOffset;
      var pageX = e.pageX || (e.touches ? e.touches[0].pageX : 0);
      var left = pageX - xOffset;

      var a;
      if (left < 0) {
        a = 0;
      } else if (left > containerWidth) {
        a = 1;
      } else {
        a = Math.round(left * 100 / containerWidth) / 100;
      }

      if (this.colors.a !== a) {
        this.$emit('change', {
          h: this.colors.hsl.h,
          s: this.colors.hsl.s,
          l: this.colors.hsl.l,
          a: a,
          source: 'rgba'
        });
      }
    },
    handleMouseDown: function handleMouseDown(e) {
      this.handleChange(e, true);
      window.addEventListener('mousemove', this.handleChange);
      window.addEventListener('mouseup', this.handleMouseUp);
    },
    handleMouseUp: function handleMouseUp() {
      this.unbindEventListeners();
    },
    unbindEventListeners: function unbindEventListeners() {
      window.removeEventListener('mousemove', this.handleChange);
      window.removeEventListener('mouseup', this.handleMouseUp);
    }
  }
});

/***/ }),
/* 102 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//

var _checkboardCache = {};

/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'Checkboard',
  props: {
    size: {
      type: [Number, String],
      default: 8
    },
    white: {
      type: String,
      default: '#fff'
    },
    grey: {
      type: String,
      default: '#e6e6e6'
    }
  },
  computed: {
    bgStyle: function bgStyle() {
      return {
        'background-image': 'url(' + getCheckboard(this.white, this.grey, this.size) + ')'
      };
    }
  }

  /**
   * get base 64 data by canvas
   *
   * @param {String} c1 hex color
   * @param {String} c2 hex color
   * @param {Number} size
   */

});function renderCheckboard(c1, c2, size) {
  // Dont Render On Server
  if (typeof document === 'undefined') {
    return null;
  }
  var canvas = document.createElement('canvas');
  canvas.width = canvas.height = size * 2;
  var ctx = canvas.getContext('2d');
  // If no context can be found, return early.
  if (!ctx) {
    return null;
  }
  ctx.fillStyle = c1;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = c2;
  ctx.fillRect(0, 0, size, size);
  ctx.translate(size, size);
  ctx.fillRect(0, 0, size, size);
  return canvas.toDataURL();
}

/**
 * get checkboard base data and cache
 *
 * @param {String} c1 hex color
 * @param {String} c2 hex color
 * @param {Number} size
 */

function getCheckboard(c1, c2, size) {
  var key = c1 + ',' + c2 + ',' + size;

  if (_checkboardCache[key]) {
    return _checkboardCache[key];
  } else {
    var checkboard = renderCheckboard(c1, c2, size);
    _checkboardCache[key] = checkboard;
    return checkboard;
  }
}

/***/ }),
/* 103 */
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

/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'editableInput',
  props: {
    label: String,
    desc: String,
    value: [String, Number],
    max: Number,
    min: Number,
    arrowOffset: {
      type: Number,
      default: 1
    }
  },
  computed: {
    val: {
      get: function get() {
        return this.value;
      },
      set: function set(v) {
        // TODO: min
        if (!(this.max === undefined) && +v > this.max) {
          this.$refs.input.value = this.max;
        } else {
          return v;
        }
      }
    }
  },
  methods: {
    update: function update(e) {
      this.handleChange(e.target.value);
    },
    handleChange: function handleChange(newVal) {
      var data = {};
      data[this.label] = newVal;
      if (data.hex === undefined && data['#'] === undefined) {
        this.$emit('change', data);
      } else if (newVal.length > 5) {
        this.$emit('change', data);
      }
    },
    handleBlur: function handleBlur(e) {
      console.log(e);
    },
    handleKeyDown: function handleKeyDown(e) {
      var val = this.val;
      var number = Number(val);

      if (number) {
        var amount = this.arrowOffset || 1;

        // Up
        if (e.keyCode === 38) {
          val = number + amount;
          this.handleChange(val);
          e.preventDefault();
        }

        // Down
        if (e.keyCode === 40) {
          val = number - amount;
          this.handleChange(val);
          e.preventDefault();
        }
      }
    },
    handleDrag: function handleDrag(e) {
      console.log(e);
    },
    handleMouseDown: function handleMouseDown(e) {
      console.log(e);
    }
  }
});

/***/ }),
/* 104 */
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

/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'Hue',
  props: {
    value: Object,
    direction: {
      type: String,
      // [horizontal | vertical]
      default: 'horizontal'
    }
  },
  data: function data() {
    return {
      oldHue: 0,
      pullDirection: ''
    };
  },

  computed: {
    colors: function colors() {
      var h = this.value.hsl.h;
      if (h !== 0 && h - this.oldHue > 0) this.pullDirection = 'right';
      if (h !== 0 && h - this.oldHue < 0) this.pullDirection = 'left';
      this.oldHue = h;

      return this.value;
    },
    directionClass: function directionClass() {
      return {
        'vc-hue--horizontal': this.direction === 'horizontal',
        'vc-hue--vertical': this.direction === 'vertical'
      };
    },
    pointerTop: function pointerTop() {
      if (this.direction === 'vertical') {
        if (this.colors.hsl.h === 0 && this.pullDirection === 'right') return 0;
        return -(this.colors.hsl.h * 100 / 360) + 100 + '%';
      } else {
        return 0;
      }
    },
    pointerLeft: function pointerLeft() {
      if (this.direction === 'vertical') {
        return 0;
      } else {
        if (this.colors.hsl.h === 0 && this.pullDirection === 'right') return '100%';
        return this.colors.hsl.h * 100 / 360 + '%';
      }
    }
  },
  methods: {
    handleChange: function handleChange(e, skip) {
      !skip && e.preventDefault();

      var container = this.$refs.container;
      var containerWidth = container.clientWidth;
      var containerHeight = container.clientHeight;

      var xOffset = container.getBoundingClientRect().left + window.pageXOffset;
      var yOffset = container.getBoundingClientRect().top + window.pageYOffset;
      var pageX = e.pageX || (e.touches ? e.touches[0].pageX : 0);
      var pageY = e.pageY || (e.touches ? e.touches[0].pageY : 0);
      var left = pageX - xOffset;
      var top = pageY - yOffset;

      var h;
      var percent;

      if (this.direction === 'vertical') {
        if (top < 0) {
          h = 360;
        } else if (top > containerHeight) {
          h = 0;
        } else {
          percent = -(top * 100 / containerHeight) + 100;
          h = 360 * percent / 100;
        }

        if (this.colors.hsl.h !== h) {
          this.$emit('change', {
            h: h,
            s: this.colors.hsl.s,
            l: this.colors.hsl.l,
            a: this.colors.hsl.a,
            source: 'hsl'
          });
        }
      } else {
        if (left < 0) {
          h = 0;
        } else if (left > containerWidth) {
          h = 360;
        } else {
          percent = left * 100 / containerWidth;
          h = 360 * percent / 100;
        }

        if (this.colors.hsl.h !== h) {
          this.$emit('change', {
            h: h,
            s: this.colors.hsl.s,
            l: this.colors.hsl.l,
            a: this.colors.hsl.a,
            source: 'hsl'
          });
        }
      }
    },
    handleMouseDown: function handleMouseDown(e) {
      this.handleChange(e, true);
      window.addEventListener('mousemove', this.handleChange);
      window.addEventListener('mouseup', this.handleMouseUp);
    },
    handleMouseUp: function handleMouseUp(e) {
      this.unbindEventListeners();
    },
    unbindEventListeners: function unbindEventListeners() {
      window.removeEventListener('mousemove', this.handleChange);
      window.removeEventListener('mouseup', this.handleMouseUp);
    }
  }
});

/***/ }),
/* 105 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_throttle__ = __webpack_require__(259);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_throttle___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash_throttle__);
//
//
//
//
//
//
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
  name: 'Saturation',
  props: {
    value: Object
  },
  computed: {
    colors: function colors() {
      return this.value;
    },
    bgColor: function bgColor() {
      return 'hsl(' + this.colors.hsv.h + ', 100%, 50%)';
    },
    pointerTop: function pointerTop() {
      return -(this.colors.hsv.v * 100) + 1 + 100 + '%';
    },
    pointerLeft: function pointerLeft() {
      return this.colors.hsv.s * 100 + '%';
    }
  },
  methods: {
    throttle: __WEBPACK_IMPORTED_MODULE_0_lodash_throttle___default()(function (fn, data) {
      fn(data);
    }, 20, {
      'leading': true,
      'trailing': false
    }),
    handleChange: function handleChange(e, skip) {
      !skip && e.preventDefault();
      var container = this.$refs.container;
      var containerWidth = container.clientWidth;
      var containerHeight = container.clientHeight;

      var xOffset = container.getBoundingClientRect().left + window.pageXOffset;
      var yOffset = container.getBoundingClientRect().top + window.pageYOffset;
      var pageX = e.pageX || (e.touches ? e.touches[0].pageX : 0);
      var pageY = e.pageY || (e.touches ? e.touches[0].pageY : 0);
      var left = pageX - xOffset;
      var top = pageY - yOffset;

      if (left < 0) {
        left = 0;
      } else if (left > containerWidth) {
        left = containerWidth;
      } else if (top < 0) {
        top = 0;
      } else if (top > containerHeight) {
        top = containerHeight;
      }

      var saturation = left / containerWidth;
      var bright = -(top / containerHeight) + 1;

      bright = bright > 0 ? bright : 0;
      bright = bright > 1 ? 1 : bright;

      this.throttle(this.onChange, {
        h: this.colors.hsv.h,
        s: saturation,
        v: bright,
        a: this.colors.hsv.a,
        source: 'hsva'
      });
    },
    onChange: function onChange(param) {
      this.$emit('change', param);
    },
    handleMouseDown: function handleMouseDown(e) {
      // this.handleChange(e, true)
      window.addEventListener('mousemove', this.handleChange);
      window.addEventListener('mouseup', this.handleChange);
      window.addEventListener('mouseup', this.handleMouseUp);
    },
    handleMouseUp: function handleMouseUp(e) {
      this.unbindEventListeners();
    },
    unbindEventListeners: function unbindEventListeners() {
      window.removeEventListener('mousemove', this.handleChange);
      window.removeEventListener('mouseup', this.handleChange);
      window.removeEventListener('mouseup', this.handleMouseUp);
    }
  }
});

/***/ }),
/* 106 */,
/* 107 */,
/* 108 */,
/* 109 */,
/* 110 */,
/* 111 */,
/* 112 */,
/* 113 */,
/* 114 */,
/* 115 */,
/* 116 */,
/* 117 */,
/* 118 */,
/* 119 */,
/* 120 */,
/* 121 */,
/* 122 */,
/* 123 */,
/* 124 */,
/* 125 */,
/* 126 */,
/* 127 */,
/* 128 */,
/* 129 */,
/* 130 */,
/* 131 */,
/* 132 */,
/* 133 */,
/* 134 */,
/* 135 */,
/* 136 */,
/* 137 */,
/* 138 */,
/* 139 */,
/* 140 */,
/* 141 */,
/* 142 */,
/* 143 */,
/* 144 */,
/* 145 */,
/* 146 */,
/* 147 */,
/* 148 */,
/* 149 */,
/* 150 */,
/* 151 */,
/* 152 */,
/* 153 */,
/* 154 */,
/* 155 */,
/* 156 */,
/* 157 */,
/* 158 */,
/* 159 */,
/* 160 */,
/* 161 */,
/* 162 */,
/* 163 */,
/* 164 */,
/* 165 */,
/* 166 */,
/* 167 */,
/* 168 */,
/* 169 */,
/* 170 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_Checkboard_vue__ = __webpack_require__(102);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__vue_loader_lib_template_compiler_index_id_data_v_550f7e4e_hasScoped_false_buble_transforms_vue_loader_lib_selector_type_template_index_0_Checkboard_vue__ = __webpack_require__(346);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(388)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_Checkboard_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__vue_loader_lib_template_compiler_index_id_data_v_550f7e4e_hasScoped_false_buble_transforms_vue_loader_lib_selector_type_template_index_0_Checkboard_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "node_modules/vue-color/src/components/common/Checkboard.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-550f7e4e", Component.options)
  } else {
    hotAPI.reload("data-v-550f7e4e", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 171 */,
/* 172 */,
/* 173 */,
/* 174 */,
/* 175 */,
/* 176 */,
/* 177 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
//import pmSingleTask from '@components/project-task-lists/single-task.vue';
exports.default = {
	pagination: __webpack_require__(10),
	datePicker: __webpack_require__(78)
};

/***/ }),
/* 178 */,
/* 179 */,
/* 180 */,
/* 181 */,
/* 182 */,
/* 183 */,
/* 184 */,
/* 185 */,
/* 186 */,
/* 187 */,
/* 188 */,
/* 189 */,
/* 190 */,
/* 191 */,
/* 192 */,
/* 193 */,
/* 194 */,
/* 195 */,
/* 196 */,
/* 197 */,
/* 198 */,
/* 199 */,
/* 200 */,
/* 201 */,
/* 202 */,
/* 203 */,
/* 204 */,
/* 205 */,
/* 206 */,
/* 207 */,
/* 208 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _mixin = __webpack_require__(3);

var _mixin2 = _interopRequireDefault(_mixin);

var _mixin3 = __webpack_require__(27);

var _mixin4 = _interopRequireDefault(_mixin3);

var _mixin5 = __webpack_require__(26);

var _mixin6 = _interopRequireDefault(_mixin5);

var _singleTask = __webpack_require__(55);

var _singleTask2 = _interopRequireDefault(_singleTask);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

__webpack_require__.p = PM_Vars.dir_url + 'views/assets/js/';

Vue.use(VAutocomplete.default);

var color = __webpack_require__(56);
pm.color = color.default;
pm.Multiselect = __webpack_require__(42);

var commonComp = __webpack_require__(177);
pm.commonComponents = commonComp.default;

// console.log(commonComp2);

pm.color = __webpack_require__(56);

pm.SingleTask = _singleTask2.default;

PmMixin.projectTaskLists = _mixin2.default;
PmMixin.mixins = _mixin4.default;
PmMixin.settings = _mixin6.default;

/***/ }),
/* 209 */,
/* 210 */,
/* 211 */,
/* 212 */,
/* 213 */,
/* 214 */,
/* 215 */,
/* 216 */,
/* 217 */,
/* 218 */,
/* 219 */,
/* 220 */,
/* 221 */,
/* 222 */,
/* 223 */,
/* 224 */,
/* 225 */,
/* 226 */,
/* 227 */,
/* 228 */,
/* 229 */,
/* 230 */,
/* 231 */,
/* 232 */,
/* 233 */,
/* 234 */,
/* 235 */,
/* 236 */,
/* 237 */,
/* 238 */,
/* 239 */,
/* 240 */,
/* 241 */,
/* 242 */,
/* 243 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(false);
// imports


// module
exports.push([module.i, "\n.vc-sketch {\n  position: relative;\n  width: 200px;\n  padding: 10px 10px 0;\n  box-sizing: initial;\n  background: #fff;\n  border-radius: 4px;\n  box-shadow: 0 0 0 1px rgba(0,0,0,.15), 0 8px 16px rgba(0,0,0,.15);\n}\n.vc-sketch-saturation-wrap {\n  width: 100%;\n  padding-bottom: 75%;\n  position: relative;\n  overflow: hidden;\n}\n.vc-sketch-controls {\n  display: flex;\n}\n.vc-sketch-sliders {\n  padding: 4px 0;\n  flex: 1;\n}\n.vc-sketch-sliders .vc-hue,\n.vc-sketch-sliders .vc-alpha-gradient {\n  border-radius: 2px;\n}\n.vc-sketch-hue-wrap {\n  position: relative;\n  height: 10px;\n}\n.vc-sketch-alpha-wrap {\n  position: relative;\n  height: 10px;\n  margin-top: 4px;\n  overflow: hidden;\n}\n.vc-sketch-color-wrap {\n  width: 24px;\n  height: 24px;\n  position: relative;\n  margin-top: 4px;\n  margin-left: 4px;\n  border-radius: 3px;\n}\n.vc-sketch-active-color {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  border-radius: 2px;\n  box-shadow: inset 0 0 0 1px rgba(0,0,0,.15), inset 0 0 4px rgba(0,0,0,.25);\n  z-index: 2;\n}\n.vc-sketch-color-wrap .vc-checkerboard {\n  background-size: auto;\n}\n.vc-sketch-field {\n  display: flex;\n  padding-top: 4px;\n}\n.vc-sketch-field .vc-input__input {\n  width: 80%;\n  padding: 4px 10% 3px;\n  border: none;\n  box-shadow: inset 0 0 0 1px #ccc;\n  font-size: 11px;\n}\n.vc-sketch-field .vc-input__label {\n  display: block;\n  text-align: center;\n  font-size: 11px;\n  color: #222;\n  padding-top: 3px;\n  padding-bottom: 4px;\n  text-transform: capitalize;\n}\n.vc-sketch-field--single {\n  flex: 1;\n  padding-left: 6px;\n}\n.vc-sketch-field--double {\n  flex: 2;\n}\n.vc-sketch-presets {\n  margin-right: -10px;\n  margin-left: -10px;\n  padding-left: 10px;\n  padding-top: 10px;\n  border-top: 1px solid #eee;\n}\n.vc-sketch-presets-color {\n  border-radius: 3px;\n  overflow: hidden;\n  position: relative;\n  display: inline-block;\n  margin: 0 10px 10px 0;\n  vertical-align: top;\n  cursor: pointer;\n  width: 16px;\n  height: 16px;\n  box-shadow: inset 0 0 0 1px rgba(0,0,0,.15);\n}\n.vc-sketch__disable-alpha .vc-sketch-color-wrap {\n  height: 10px;\n}\n", ""]);

// exports


/***/ }),
/* 244 */,
/* 245 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(false);
// imports


// module
exports.push([module.i, "\n.vc-checkerboard {\n  position: absolute;\n  top: 0px;\n  right: 0px;\n  bottom: 0px;\n  left: 0px;\n  background-size: contain;\n}\n", ""]);

// exports


/***/ }),
/* 246 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(false);
// imports


// module
exports.push([module.i, "\n.vc-hue {\n  position: absolute;\n  top: 0px;\n  right: 0px;\n  bottom: 0px;\n  left: 0px;\n  border-radius: 2px;\n}\n.vc-hue--horizontal {\n  background: linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);\n}\n.vc-hue--vertical {\n  background: linear-gradient(to top, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);\n}\n.vc-hue-container {\n  cursor: pointer;\n  margin: 0 2px;\n  position: relative;\n  height: 100%;\n}\n.vc-hue-pointer {\n  z-index: 2;\n  position: absolute;\n}\n.vc-hue-picker {\n  cursor: pointer;\n  margin-top: 1px;\n  width: 4px;\n  border-radius: 1px;\n  height: 8px;\n  box-shadow: 0 0 2px rgba(0, 0, 0, .6);\n  background: #fff;\n  transform: translateX(-2px) ;\n}\n", ""]);

// exports


/***/ }),
/* 247 */,
/* 248 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(false);
// imports


// module
exports.push([module.i, "\n.vc-editable-input {\n  position: relative;\n}\n.vc-input__input {\n  padding: 0;\n  border: 0;\n  outline: none;\n}\n.vc-input__label {\n  text-transform: capitalize;\n}\n", ""]);

// exports


/***/ }),
/* 249 */,
/* 250 */,
/* 251 */,
/* 252 */,
/* 253 */,
/* 254 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(false);
// imports


// module
exports.push([module.i, "\n.vc-saturation,\n.vc-saturation--white,\n.vc-saturation--black {\n  cursor: pointer;\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n}\n.vc-saturation--white {\n  background: linear-gradient(to right, #fff, rgba(255,255,255,0));\n}\n.vc-saturation--black {\n  background: linear-gradient(to top, #000, rgba(0,0,0,0));\n}\n.vc-saturation-pointer {\n  cursor: pointer;\n  position: absolute;\n}\n.vc-saturation-circle {\n  cursor: head;\n  width: 4px;\n  height: 4px;\n  box-shadow: 0 0 0 1.5px #fff, inset 0 0 1px 1px rgba(0,0,0,.3), 0 0 1px 2px rgba(0,0,0,.4);\n  border-radius: 50%;\n  transform: translate(-2px, -2px);\n}\n", ""]);

// exports


/***/ }),
/* 255 */,
/* 256 */,
/* 257 */,
/* 258 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(false);
// imports


// module
exports.push([module.i, "\n.vc-alpha {\n  position: absolute;\n  top: 0px;\n  right: 0px;\n  bottom: 0px;\n  left: 0px;\n}\n.vc-alpha-checkboard-wrap {\n  position: absolute;\n  top: 0px;\n  right: 0px;\n  bottom: 0px;\n  left: 0px;\n  overflow: hidden;\n}\n.vc-alpha-gradient {\n  position: absolute;\n  top: 0px;\n  right: 0px;\n  bottom: 0px;\n  left: 0px;\n}\n.vc-alpha-container {\n  cursor: pointer;\n  position: relative;\n  z-index: 2;\n  height: 100%;\n  margin: 0 3px;\n}\n.vc-alpha-pointer {\n  z-index: 2;\n  position: absolute;\n}\n.vc-alpha-picker {\n  cursor: pointer;\n  width: 4px;\n  border-radius: 1px;\n  height: 8px;\n  box-shadow: 0 0 2px rgba(0, 0, 0, .6);\n  background: #fff;\n  margin-top: 1px;\n  transform: translateX(-2px);\n}\n", ""]);

// exports


/***/ }),
/* 259 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

/**
 * Creates a throttled function that only invokes `func` at most once per
 * every `wait` milliseconds. The throttled function comes with a `cancel`
 * method to cancel delayed `func` invocations and a `flush` method to
 * immediately invoke them. Provide `options` to indicate whether `func`
 * should be invoked on the leading and/or trailing edge of the `wait`
 * timeout. The `func` is invoked with the last arguments provided to the
 * throttled function. Subsequent calls to the throttled function return the
 * result of the last `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the throttled function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.throttle` and `_.debounce`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to throttle.
 * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=true]
 *  Specify invoking on the leading edge of the timeout.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new throttled function.
 * @example
 *
 * // Avoid excessively updating the position while scrolling.
 * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
 *
 * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
 * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
 * jQuery(element).on('click', throttled);
 *
 * // Cancel the trailing throttled invocation.
 * jQuery(window).on('popstate', throttled.cancel);
 */
function throttle(func, wait, options) {
  var leading = true,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  if (isObject(options)) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  return debounce(func, wait, {
    'leading': leading,
    'maxWait': wait,
    'trailing': trailing
  });
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = throttle;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(402)))

/***/ }),
/* 260 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;// TinyColor v1.4.1
// https://github.com/bgrins/TinyColor
// Brian Grinstead, MIT License

(function(Math) {

var trimLeft = /^\s+/,
    trimRight = /\s+$/,
    tinyCounter = 0,
    mathRound = Math.round,
    mathMin = Math.min,
    mathMax = Math.max,
    mathRandom = Math.random;

function tinycolor (color, opts) {

    color = (color) ? color : '';
    opts = opts || { };

    // If input is already a tinycolor, return itself
    if (color instanceof tinycolor) {
       return color;
    }
    // If we are called as a function, call using new instead
    if (!(this instanceof tinycolor)) {
        return new tinycolor(color, opts);
    }

    var rgb = inputToRGB(color);
    this._originalInput = color,
    this._r = rgb.r,
    this._g = rgb.g,
    this._b = rgb.b,
    this._a = rgb.a,
    this._roundA = mathRound(100*this._a) / 100,
    this._format = opts.format || rgb.format;
    this._gradientType = opts.gradientType;

    // Don't let the range of [0,255] come back in [0,1].
    // Potentially lose a little bit of precision here, but will fix issues where
    // .5 gets interpreted as half of the total, instead of half of 1
    // If it was supposed to be 128, this was already taken care of by `inputToRgb`
    if (this._r < 1) { this._r = mathRound(this._r); }
    if (this._g < 1) { this._g = mathRound(this._g); }
    if (this._b < 1) { this._b = mathRound(this._b); }

    this._ok = rgb.ok;
    this._tc_id = tinyCounter++;
}

tinycolor.prototype = {
    isDark: function() {
        return this.getBrightness() < 128;
    },
    isLight: function() {
        return !this.isDark();
    },
    isValid: function() {
        return this._ok;
    },
    getOriginalInput: function() {
      return this._originalInput;
    },
    getFormat: function() {
        return this._format;
    },
    getAlpha: function() {
        return this._a;
    },
    getBrightness: function() {
        //http://www.w3.org/TR/AERT#color-contrast
        var rgb = this.toRgb();
        return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    },
    getLuminance: function() {
        //http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
        var rgb = this.toRgb();
        var RsRGB, GsRGB, BsRGB, R, G, B;
        RsRGB = rgb.r/255;
        GsRGB = rgb.g/255;
        BsRGB = rgb.b/255;

        if (RsRGB <= 0.03928) {R = RsRGB / 12.92;} else {R = Math.pow(((RsRGB + 0.055) / 1.055), 2.4);}
        if (GsRGB <= 0.03928) {G = GsRGB / 12.92;} else {G = Math.pow(((GsRGB + 0.055) / 1.055), 2.4);}
        if (BsRGB <= 0.03928) {B = BsRGB / 12.92;} else {B = Math.pow(((BsRGB + 0.055) / 1.055), 2.4);}
        return (0.2126 * R) + (0.7152 * G) + (0.0722 * B);
    },
    setAlpha: function(value) {
        this._a = boundAlpha(value);
        this._roundA = mathRound(100*this._a) / 100;
        return this;
    },
    toHsv: function() {
        var hsv = rgbToHsv(this._r, this._g, this._b);
        return { h: hsv.h * 360, s: hsv.s, v: hsv.v, a: this._a };
    },
    toHsvString: function() {
        var hsv = rgbToHsv(this._r, this._g, this._b);
        var h = mathRound(hsv.h * 360), s = mathRound(hsv.s * 100), v = mathRound(hsv.v * 100);
        return (this._a == 1) ?
          "hsv("  + h + ", " + s + "%, " + v + "%)" :
          "hsva(" + h + ", " + s + "%, " + v + "%, "+ this._roundA + ")";
    },
    toHsl: function() {
        var hsl = rgbToHsl(this._r, this._g, this._b);
        return { h: hsl.h * 360, s: hsl.s, l: hsl.l, a: this._a };
    },
    toHslString: function() {
        var hsl = rgbToHsl(this._r, this._g, this._b);
        var h = mathRound(hsl.h * 360), s = mathRound(hsl.s * 100), l = mathRound(hsl.l * 100);
        return (this._a == 1) ?
          "hsl("  + h + ", " + s + "%, " + l + "%)" :
          "hsla(" + h + ", " + s + "%, " + l + "%, "+ this._roundA + ")";
    },
    toHex: function(allow3Char) {
        return rgbToHex(this._r, this._g, this._b, allow3Char);
    },
    toHexString: function(allow3Char) {
        return '#' + this.toHex(allow3Char);
    },
    toHex8: function(allow4Char) {
        return rgbaToHex(this._r, this._g, this._b, this._a, allow4Char);
    },
    toHex8String: function(allow4Char) {
        return '#' + this.toHex8(allow4Char);
    },
    toRgb: function() {
        return { r: mathRound(this._r), g: mathRound(this._g), b: mathRound(this._b), a: this._a };
    },
    toRgbString: function() {
        return (this._a == 1) ?
          "rgb("  + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ")" :
          "rgba(" + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ", " + this._roundA + ")";
    },
    toPercentageRgb: function() {
        return { r: mathRound(bound01(this._r, 255) * 100) + "%", g: mathRound(bound01(this._g, 255) * 100) + "%", b: mathRound(bound01(this._b, 255) * 100) + "%", a: this._a };
    },
    toPercentageRgbString: function() {
        return (this._a == 1) ?
          "rgb("  + mathRound(bound01(this._r, 255) * 100) + "%, " + mathRound(bound01(this._g, 255) * 100) + "%, " + mathRound(bound01(this._b, 255) * 100) + "%)" :
          "rgba(" + mathRound(bound01(this._r, 255) * 100) + "%, " + mathRound(bound01(this._g, 255) * 100) + "%, " + mathRound(bound01(this._b, 255) * 100) + "%, " + this._roundA + ")";
    },
    toName: function() {
        if (this._a === 0) {
            return "transparent";
        }

        if (this._a < 1) {
            return false;
        }

        return hexNames[rgbToHex(this._r, this._g, this._b, true)] || false;
    },
    toFilter: function(secondColor) {
        var hex8String = '#' + rgbaToArgbHex(this._r, this._g, this._b, this._a);
        var secondHex8String = hex8String;
        var gradientType = this._gradientType ? "GradientType = 1, " : "";

        if (secondColor) {
            var s = tinycolor(secondColor);
            secondHex8String = '#' + rgbaToArgbHex(s._r, s._g, s._b, s._a);
        }

        return "progid:DXImageTransform.Microsoft.gradient("+gradientType+"startColorstr="+hex8String+",endColorstr="+secondHex8String+")";
    },
    toString: function(format) {
        var formatSet = !!format;
        format = format || this._format;

        var formattedString = false;
        var hasAlpha = this._a < 1 && this._a >= 0;
        var needsAlphaFormat = !formatSet && hasAlpha && (format === "hex" || format === "hex6" || format === "hex3" || format === "hex4" || format === "hex8" || format === "name");

        if (needsAlphaFormat) {
            // Special case for "transparent", all other non-alpha formats
            // will return rgba when there is transparency.
            if (format === "name" && this._a === 0) {
                return this.toName();
            }
            return this.toRgbString();
        }
        if (format === "rgb") {
            formattedString = this.toRgbString();
        }
        if (format === "prgb") {
            formattedString = this.toPercentageRgbString();
        }
        if (format === "hex" || format === "hex6") {
            formattedString = this.toHexString();
        }
        if (format === "hex3") {
            formattedString = this.toHexString(true);
        }
        if (format === "hex4") {
            formattedString = this.toHex8String(true);
        }
        if (format === "hex8") {
            formattedString = this.toHex8String();
        }
        if (format === "name") {
            formattedString = this.toName();
        }
        if (format === "hsl") {
            formattedString = this.toHslString();
        }
        if (format === "hsv") {
            formattedString = this.toHsvString();
        }

        return formattedString || this.toHexString();
    },
    clone: function() {
        return tinycolor(this.toString());
    },

    _applyModification: function(fn, args) {
        var color = fn.apply(null, [this].concat([].slice.call(args)));
        this._r = color._r;
        this._g = color._g;
        this._b = color._b;
        this.setAlpha(color._a);
        return this;
    },
    lighten: function() {
        return this._applyModification(lighten, arguments);
    },
    brighten: function() {
        return this._applyModification(brighten, arguments);
    },
    darken: function() {
        return this._applyModification(darken, arguments);
    },
    desaturate: function() {
        return this._applyModification(desaturate, arguments);
    },
    saturate: function() {
        return this._applyModification(saturate, arguments);
    },
    greyscale: function() {
        return this._applyModification(greyscale, arguments);
    },
    spin: function() {
        return this._applyModification(spin, arguments);
    },

    _applyCombination: function(fn, args) {
        return fn.apply(null, [this].concat([].slice.call(args)));
    },
    analogous: function() {
        return this._applyCombination(analogous, arguments);
    },
    complement: function() {
        return this._applyCombination(complement, arguments);
    },
    monochromatic: function() {
        return this._applyCombination(monochromatic, arguments);
    },
    splitcomplement: function() {
        return this._applyCombination(splitcomplement, arguments);
    },
    triad: function() {
        return this._applyCombination(triad, arguments);
    },
    tetrad: function() {
        return this._applyCombination(tetrad, arguments);
    }
};

// If input is an object, force 1 into "1.0" to handle ratios properly
// String input requires "1.0" as input, so 1 will be treated as 1
tinycolor.fromRatio = function(color, opts) {
    if (typeof color == "object") {
        var newColor = {};
        for (var i in color) {
            if (color.hasOwnProperty(i)) {
                if (i === "a") {
                    newColor[i] = color[i];
                }
                else {
                    newColor[i] = convertToPercentage(color[i]);
                }
            }
        }
        color = newColor;
    }

    return tinycolor(color, opts);
};

// Given a string or object, convert that input to RGB
// Possible string inputs:
//
//     "red"
//     "#f00" or "f00"
//     "#ff0000" or "ff0000"
//     "#ff000000" or "ff000000"
//     "rgb 255 0 0" or "rgb (255, 0, 0)"
//     "rgb 1.0 0 0" or "rgb (1, 0, 0)"
//     "rgba (255, 0, 0, 1)" or "rgba 255, 0, 0, 1"
//     "rgba (1.0, 0, 0, 1)" or "rgba 1.0, 0, 0, 1"
//     "hsl(0, 100%, 50%)" or "hsl 0 100% 50%"
//     "hsla(0, 100%, 50%, 1)" or "hsla 0 100% 50%, 1"
//     "hsv(0, 100%, 100%)" or "hsv 0 100% 100%"
//
function inputToRGB(color) {

    var rgb = { r: 0, g: 0, b: 0 };
    var a = 1;
    var s = null;
    var v = null;
    var l = null;
    var ok = false;
    var format = false;

    if (typeof color == "string") {
        color = stringInputToObject(color);
    }

    if (typeof color == "object") {
        if (isValidCSSUnit(color.r) && isValidCSSUnit(color.g) && isValidCSSUnit(color.b)) {
            rgb = rgbToRgb(color.r, color.g, color.b);
            ok = true;
            format = String(color.r).substr(-1) === "%" ? "prgb" : "rgb";
        }
        else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.v)) {
            s = convertToPercentage(color.s);
            v = convertToPercentage(color.v);
            rgb = hsvToRgb(color.h, s, v);
            ok = true;
            format = "hsv";
        }
        else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.l)) {
            s = convertToPercentage(color.s);
            l = convertToPercentage(color.l);
            rgb = hslToRgb(color.h, s, l);
            ok = true;
            format = "hsl";
        }

        if (color.hasOwnProperty("a")) {
            a = color.a;
        }
    }

    a = boundAlpha(a);

    return {
        ok: ok,
        format: color.format || format,
        r: mathMin(255, mathMax(rgb.r, 0)),
        g: mathMin(255, mathMax(rgb.g, 0)),
        b: mathMin(255, mathMax(rgb.b, 0)),
        a: a
    };
}


// Conversion Functions
// --------------------

// `rgbToHsl`, `rgbToHsv`, `hslToRgb`, `hsvToRgb` modified from:
// <http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript>

// `rgbToRgb`
// Handle bounds / percentage checking to conform to CSS color spec
// <http://www.w3.org/TR/css3-color/>
// *Assumes:* r, g, b in [0, 255] or [0, 1]
// *Returns:* { r, g, b } in [0, 255]
function rgbToRgb(r, g, b){
    return {
        r: bound01(r, 255) * 255,
        g: bound01(g, 255) * 255,
        b: bound01(b, 255) * 255
    };
}

// `rgbToHsl`
// Converts an RGB color value to HSL.
// *Assumes:* r, g, and b are contained in [0, 255] or [0, 1]
// *Returns:* { h, s, l } in [0,1]
function rgbToHsl(r, g, b) {

    r = bound01(r, 255);
    g = bound01(g, 255);
    b = bound01(b, 255);

    var max = mathMax(r, g, b), min = mathMin(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min) {
        h = s = 0; // achromatic
    }
    else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }

        h /= 6;
    }

    return { h: h, s: s, l: l };
}

// `hslToRgb`
// Converts an HSL color value to RGB.
// *Assumes:* h is contained in [0, 1] or [0, 360] and s and l are contained [0, 1] or [0, 100]
// *Returns:* { r, g, b } in the set [0, 255]
function hslToRgb(h, s, l) {
    var r, g, b;

    h = bound01(h, 360);
    s = bound01(s, 100);
    l = bound01(l, 100);

    function hue2rgb(p, q, t) {
        if(t < 0) t += 1;
        if(t > 1) t -= 1;
        if(t < 1/6) return p + (q - p) * 6 * t;
        if(t < 1/2) return q;
        if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
    }

    if(s === 0) {
        r = g = b = l; // achromatic
    }
    else {
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return { r: r * 255, g: g * 255, b: b * 255 };
}

// `rgbToHsv`
// Converts an RGB color value to HSV
// *Assumes:* r, g, and b are contained in the set [0, 255] or [0, 1]
// *Returns:* { h, s, v } in [0,1]
function rgbToHsv(r, g, b) {

    r = bound01(r, 255);
    g = bound01(g, 255);
    b = bound01(b, 255);

    var max = mathMax(r, g, b), min = mathMin(r, g, b);
    var h, s, v = max;

    var d = max - min;
    s = max === 0 ? 0 : d / max;

    if(max == min) {
        h = 0; // achromatic
    }
    else {
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: h, s: s, v: v };
}

// `hsvToRgb`
// Converts an HSV color value to RGB.
// *Assumes:* h is contained in [0, 1] or [0, 360] and s and v are contained in [0, 1] or [0, 100]
// *Returns:* { r, g, b } in the set [0, 255]
 function hsvToRgb(h, s, v) {

    h = bound01(h, 360) * 6;
    s = bound01(s, 100);
    v = bound01(v, 100);

    var i = Math.floor(h),
        f = h - i,
        p = v * (1 - s),
        q = v * (1 - f * s),
        t = v * (1 - (1 - f) * s),
        mod = i % 6,
        r = [v, q, p, p, t, v][mod],
        g = [t, v, v, q, p, p][mod],
        b = [p, p, t, v, v, q][mod];

    return { r: r * 255, g: g * 255, b: b * 255 };
}

// `rgbToHex`
// Converts an RGB color to hex
// Assumes r, g, and b are contained in the set [0, 255]
// Returns a 3 or 6 character hex
function rgbToHex(r, g, b, allow3Char) {

    var hex = [
        pad2(mathRound(r).toString(16)),
        pad2(mathRound(g).toString(16)),
        pad2(mathRound(b).toString(16))
    ];

    // Return a 3 character hex if possible
    if (allow3Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1)) {
        return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
    }

    return hex.join("");
}

// `rgbaToHex`
// Converts an RGBA color plus alpha transparency to hex
// Assumes r, g, b are contained in the set [0, 255] and
// a in [0, 1]. Returns a 4 or 8 character rgba hex
function rgbaToHex(r, g, b, a, allow4Char) {

    var hex = [
        pad2(mathRound(r).toString(16)),
        pad2(mathRound(g).toString(16)),
        pad2(mathRound(b).toString(16)),
        pad2(convertDecimalToHex(a))
    ];

    // Return a 4 character hex if possible
    if (allow4Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1) && hex[3].charAt(0) == hex[3].charAt(1)) {
        return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0) + hex[3].charAt(0);
    }

    return hex.join("");
}

// `rgbaToArgbHex`
// Converts an RGBA color to an ARGB Hex8 string
// Rarely used, but required for "toFilter()"
function rgbaToArgbHex(r, g, b, a) {

    var hex = [
        pad2(convertDecimalToHex(a)),
        pad2(mathRound(r).toString(16)),
        pad2(mathRound(g).toString(16)),
        pad2(mathRound(b).toString(16))
    ];

    return hex.join("");
}

// `equals`
// Can be called with any tinycolor input
tinycolor.equals = function (color1, color2) {
    if (!color1 || !color2) { return false; }
    return tinycolor(color1).toRgbString() == tinycolor(color2).toRgbString();
};

tinycolor.random = function() {
    return tinycolor.fromRatio({
        r: mathRandom(),
        g: mathRandom(),
        b: mathRandom()
    });
};


// Modification Functions
// ----------------------
// Thanks to less.js for some of the basics here
// <https://github.com/cloudhead/less.js/blob/master/lib/less/functions.js>

function desaturate(color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var hsl = tinycolor(color).toHsl();
    hsl.s -= amount / 100;
    hsl.s = clamp01(hsl.s);
    return tinycolor(hsl);
}

function saturate(color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var hsl = tinycolor(color).toHsl();
    hsl.s += amount / 100;
    hsl.s = clamp01(hsl.s);
    return tinycolor(hsl);
}

function greyscale(color) {
    return tinycolor(color).desaturate(100);
}

function lighten (color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var hsl = tinycolor(color).toHsl();
    hsl.l += amount / 100;
    hsl.l = clamp01(hsl.l);
    return tinycolor(hsl);
}

function brighten(color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var rgb = tinycolor(color).toRgb();
    rgb.r = mathMax(0, mathMin(255, rgb.r - mathRound(255 * - (amount / 100))));
    rgb.g = mathMax(0, mathMin(255, rgb.g - mathRound(255 * - (amount / 100))));
    rgb.b = mathMax(0, mathMin(255, rgb.b - mathRound(255 * - (amount / 100))));
    return tinycolor(rgb);
}

function darken (color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var hsl = tinycolor(color).toHsl();
    hsl.l -= amount / 100;
    hsl.l = clamp01(hsl.l);
    return tinycolor(hsl);
}

// Spin takes a positive or negative amount within [-360, 360] indicating the change of hue.
// Values outside of this range will be wrapped into this range.
function spin(color, amount) {
    var hsl = tinycolor(color).toHsl();
    var hue = (hsl.h + amount) % 360;
    hsl.h = hue < 0 ? 360 + hue : hue;
    return tinycolor(hsl);
}

// Combination Functions
// ---------------------
// Thanks to jQuery xColor for some of the ideas behind these
// <https://github.com/infusion/jQuery-xcolor/blob/master/jquery.xcolor.js>

function complement(color) {
    var hsl = tinycolor(color).toHsl();
    hsl.h = (hsl.h + 180) % 360;
    return tinycolor(hsl);
}

function triad(color) {
    var hsl = tinycolor(color).toHsl();
    var h = hsl.h;
    return [
        tinycolor(color),
        tinycolor({ h: (h + 120) % 360, s: hsl.s, l: hsl.l }),
        tinycolor({ h: (h + 240) % 360, s: hsl.s, l: hsl.l })
    ];
}

function tetrad(color) {
    var hsl = tinycolor(color).toHsl();
    var h = hsl.h;
    return [
        tinycolor(color),
        tinycolor({ h: (h + 90) % 360, s: hsl.s, l: hsl.l }),
        tinycolor({ h: (h + 180) % 360, s: hsl.s, l: hsl.l }),
        tinycolor({ h: (h + 270) % 360, s: hsl.s, l: hsl.l })
    ];
}

function splitcomplement(color) {
    var hsl = tinycolor(color).toHsl();
    var h = hsl.h;
    return [
        tinycolor(color),
        tinycolor({ h: (h + 72) % 360, s: hsl.s, l: hsl.l}),
        tinycolor({ h: (h + 216) % 360, s: hsl.s, l: hsl.l})
    ];
}

function analogous(color, results, slices) {
    results = results || 6;
    slices = slices || 30;

    var hsl = tinycolor(color).toHsl();
    var part = 360 / slices;
    var ret = [tinycolor(color)];

    for (hsl.h = ((hsl.h - (part * results >> 1)) + 720) % 360; --results; ) {
        hsl.h = (hsl.h + part) % 360;
        ret.push(tinycolor(hsl));
    }
    return ret;
}

function monochromatic(color, results) {
    results = results || 6;
    var hsv = tinycolor(color).toHsv();
    var h = hsv.h, s = hsv.s, v = hsv.v;
    var ret = [];
    var modification = 1 / results;

    while (results--) {
        ret.push(tinycolor({ h: h, s: s, v: v}));
        v = (v + modification) % 1;
    }

    return ret;
}

// Utility Functions
// ---------------------

tinycolor.mix = function(color1, color2, amount) {
    amount = (amount === 0) ? 0 : (amount || 50);

    var rgb1 = tinycolor(color1).toRgb();
    var rgb2 = tinycolor(color2).toRgb();

    var p = amount / 100;

    var rgba = {
        r: ((rgb2.r - rgb1.r) * p) + rgb1.r,
        g: ((rgb2.g - rgb1.g) * p) + rgb1.g,
        b: ((rgb2.b - rgb1.b) * p) + rgb1.b,
        a: ((rgb2.a - rgb1.a) * p) + rgb1.a
    };

    return tinycolor(rgba);
};


// Readability Functions
// ---------------------
// <http://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef (WCAG Version 2)

// `contrast`
// Analyze the 2 colors and returns the color contrast defined by (WCAG Version 2)
tinycolor.readability = function(color1, color2) {
    var c1 = tinycolor(color1);
    var c2 = tinycolor(color2);
    return (Math.max(c1.getLuminance(),c2.getLuminance())+0.05) / (Math.min(c1.getLuminance(),c2.getLuminance())+0.05);
};

// `isReadable`
// Ensure that foreground and background color combinations meet WCAG2 guidelines.
// The third argument is an optional Object.
//      the 'level' property states 'AA' or 'AAA' - if missing or invalid, it defaults to 'AA';
//      the 'size' property states 'large' or 'small' - if missing or invalid, it defaults to 'small'.
// If the entire object is absent, isReadable defaults to {level:"AA",size:"small"}.

// *Example*
//    tinycolor.isReadable("#000", "#111") => false
//    tinycolor.isReadable("#000", "#111",{level:"AA",size:"large"}) => false
tinycolor.isReadable = function(color1, color2, wcag2) {
    var readability = tinycolor.readability(color1, color2);
    var wcag2Parms, out;

    out = false;

    wcag2Parms = validateWCAG2Parms(wcag2);
    switch (wcag2Parms.level + wcag2Parms.size) {
        case "AAsmall":
        case "AAAlarge":
            out = readability >= 4.5;
            break;
        case "AAlarge":
            out = readability >= 3;
            break;
        case "AAAsmall":
            out = readability >= 7;
            break;
    }
    return out;

};

// `mostReadable`
// Given a base color and a list of possible foreground or background
// colors for that base, returns the most readable color.
// Optionally returns Black or White if the most readable color is unreadable.
// *Example*
//    tinycolor.mostReadable(tinycolor.mostReadable("#123", ["#124", "#125"],{includeFallbackColors:false}).toHexString(); // "#112255"
//    tinycolor.mostReadable(tinycolor.mostReadable("#123", ["#124", "#125"],{includeFallbackColors:true}).toHexString();  // "#ffffff"
//    tinycolor.mostReadable("#a8015a", ["#faf3f3"],{includeFallbackColors:true,level:"AAA",size:"large"}).toHexString(); // "#faf3f3"
//    tinycolor.mostReadable("#a8015a", ["#faf3f3"],{includeFallbackColors:true,level:"AAA",size:"small"}).toHexString(); // "#ffffff"
tinycolor.mostReadable = function(baseColor, colorList, args) {
    var bestColor = null;
    var bestScore = 0;
    var readability;
    var includeFallbackColors, level, size ;
    args = args || {};
    includeFallbackColors = args.includeFallbackColors ;
    level = args.level;
    size = args.size;

    for (var i= 0; i < colorList.length ; i++) {
        readability = tinycolor.readability(baseColor, colorList[i]);
        if (readability > bestScore) {
            bestScore = readability;
            bestColor = tinycolor(colorList[i]);
        }
    }

    if (tinycolor.isReadable(baseColor, bestColor, {"level":level,"size":size}) || !includeFallbackColors) {
        return bestColor;
    }
    else {
        args.includeFallbackColors=false;
        return tinycolor.mostReadable(baseColor,["#fff", "#000"],args);
    }
};


// Big List of Colors
// ------------------
// <http://www.w3.org/TR/css3-color/#svg-color>
var names = tinycolor.names = {
    aliceblue: "f0f8ff",
    antiquewhite: "faebd7",
    aqua: "0ff",
    aquamarine: "7fffd4",
    azure: "f0ffff",
    beige: "f5f5dc",
    bisque: "ffe4c4",
    black: "000",
    blanchedalmond: "ffebcd",
    blue: "00f",
    blueviolet: "8a2be2",
    brown: "a52a2a",
    burlywood: "deb887",
    burntsienna: "ea7e5d",
    cadetblue: "5f9ea0",
    chartreuse: "7fff00",
    chocolate: "d2691e",
    coral: "ff7f50",
    cornflowerblue: "6495ed",
    cornsilk: "fff8dc",
    crimson: "dc143c",
    cyan: "0ff",
    darkblue: "00008b",
    darkcyan: "008b8b",
    darkgoldenrod: "b8860b",
    darkgray: "a9a9a9",
    darkgreen: "006400",
    darkgrey: "a9a9a9",
    darkkhaki: "bdb76b",
    darkmagenta: "8b008b",
    darkolivegreen: "556b2f",
    darkorange: "ff8c00",
    darkorchid: "9932cc",
    darkred: "8b0000",
    darksalmon: "e9967a",
    darkseagreen: "8fbc8f",
    darkslateblue: "483d8b",
    darkslategray: "2f4f4f",
    darkslategrey: "2f4f4f",
    darkturquoise: "00ced1",
    darkviolet: "9400d3",
    deeppink: "ff1493",
    deepskyblue: "00bfff",
    dimgray: "696969",
    dimgrey: "696969",
    dodgerblue: "1e90ff",
    firebrick: "b22222",
    floralwhite: "fffaf0",
    forestgreen: "228b22",
    fuchsia: "f0f",
    gainsboro: "dcdcdc",
    ghostwhite: "f8f8ff",
    gold: "ffd700",
    goldenrod: "daa520",
    gray: "808080",
    green: "008000",
    greenyellow: "adff2f",
    grey: "808080",
    honeydew: "f0fff0",
    hotpink: "ff69b4",
    indianred: "cd5c5c",
    indigo: "4b0082",
    ivory: "fffff0",
    khaki: "f0e68c",
    lavender: "e6e6fa",
    lavenderblush: "fff0f5",
    lawngreen: "7cfc00",
    lemonchiffon: "fffacd",
    lightblue: "add8e6",
    lightcoral: "f08080",
    lightcyan: "e0ffff",
    lightgoldenrodyellow: "fafad2",
    lightgray: "d3d3d3",
    lightgreen: "90ee90",
    lightgrey: "d3d3d3",
    lightpink: "ffb6c1",
    lightsalmon: "ffa07a",
    lightseagreen: "20b2aa",
    lightskyblue: "87cefa",
    lightslategray: "789",
    lightslategrey: "789",
    lightsteelblue: "b0c4de",
    lightyellow: "ffffe0",
    lime: "0f0",
    limegreen: "32cd32",
    linen: "faf0e6",
    magenta: "f0f",
    maroon: "800000",
    mediumaquamarine: "66cdaa",
    mediumblue: "0000cd",
    mediumorchid: "ba55d3",
    mediumpurple: "9370db",
    mediumseagreen: "3cb371",
    mediumslateblue: "7b68ee",
    mediumspringgreen: "00fa9a",
    mediumturquoise: "48d1cc",
    mediumvioletred: "c71585",
    midnightblue: "191970",
    mintcream: "f5fffa",
    mistyrose: "ffe4e1",
    moccasin: "ffe4b5",
    navajowhite: "ffdead",
    navy: "000080",
    oldlace: "fdf5e6",
    olive: "808000",
    olivedrab: "6b8e23",
    orange: "ffa500",
    orangered: "ff4500",
    orchid: "da70d6",
    palegoldenrod: "eee8aa",
    palegreen: "98fb98",
    paleturquoise: "afeeee",
    palevioletred: "db7093",
    papayawhip: "ffefd5",
    peachpuff: "ffdab9",
    peru: "cd853f",
    pink: "ffc0cb",
    plum: "dda0dd",
    powderblue: "b0e0e6",
    purple: "800080",
    rebeccapurple: "663399",
    red: "f00",
    rosybrown: "bc8f8f",
    royalblue: "4169e1",
    saddlebrown: "8b4513",
    salmon: "fa8072",
    sandybrown: "f4a460",
    seagreen: "2e8b57",
    seashell: "fff5ee",
    sienna: "a0522d",
    silver: "c0c0c0",
    skyblue: "87ceeb",
    slateblue: "6a5acd",
    slategray: "708090",
    slategrey: "708090",
    snow: "fffafa",
    springgreen: "00ff7f",
    steelblue: "4682b4",
    tan: "d2b48c",
    teal: "008080",
    thistle: "d8bfd8",
    tomato: "ff6347",
    turquoise: "40e0d0",
    violet: "ee82ee",
    wheat: "f5deb3",
    white: "fff",
    whitesmoke: "f5f5f5",
    yellow: "ff0",
    yellowgreen: "9acd32"
};

// Make it easy to access colors via `hexNames[hex]`
var hexNames = tinycolor.hexNames = flip(names);


// Utilities
// ---------

// `{ 'name1': 'val1' }` becomes `{ 'val1': 'name1' }`
function flip(o) {
    var flipped = { };
    for (var i in o) {
        if (o.hasOwnProperty(i)) {
            flipped[o[i]] = i;
        }
    }
    return flipped;
}

// Return a valid alpha value [0,1] with all invalid values being set to 1
function boundAlpha(a) {
    a = parseFloat(a);

    if (isNaN(a) || a < 0 || a > 1) {
        a = 1;
    }

    return a;
}

// Take input from [0, n] and return it as [0, 1]
function bound01(n, max) {
    if (isOnePointZero(n)) { n = "100%"; }

    var processPercent = isPercentage(n);
    n = mathMin(max, mathMax(0, parseFloat(n)));

    // Automatically convert percentage into number
    if (processPercent) {
        n = parseInt(n * max, 10) / 100;
    }

    // Handle floating point rounding errors
    if ((Math.abs(n - max) < 0.000001)) {
        return 1;
    }

    // Convert into [0, 1] range if it isn't already
    return (n % max) / parseFloat(max);
}

// Force a number between 0 and 1
function clamp01(val) {
    return mathMin(1, mathMax(0, val));
}

// Parse a base-16 hex value into a base-10 integer
function parseIntFromHex(val) {
    return parseInt(val, 16);
}

// Need to handle 1.0 as 100%, since once it is a number, there is no difference between it and 1
// <http://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0>
function isOnePointZero(n) {
    return typeof n == "string" && n.indexOf('.') != -1 && parseFloat(n) === 1;
}

// Check to see if string passed in is a percentage
function isPercentage(n) {
    return typeof n === "string" && n.indexOf('%') != -1;
}

// Force a hex value to have 2 characters
function pad2(c) {
    return c.length == 1 ? '0' + c : '' + c;
}

// Replace a decimal with it's percentage value
function convertToPercentage(n) {
    if (n <= 1) {
        n = (n * 100) + "%";
    }

    return n;
}

// Converts a decimal to a hex value
function convertDecimalToHex(d) {
    return Math.round(parseFloat(d) * 255).toString(16);
}
// Converts a hex value to a decimal
function convertHexToDecimal(h) {
    return (parseIntFromHex(h) / 255);
}

var matchers = (function() {

    // <http://www.w3.org/TR/css3-values/#integers>
    var CSS_INTEGER = "[-\\+]?\\d+%?";

    // <http://www.w3.org/TR/css3-values/#number-value>
    var CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";

    // Allow positive/negative integer/number.  Don't capture the either/or, just the entire outcome.
    var CSS_UNIT = "(?:" + CSS_NUMBER + ")|(?:" + CSS_INTEGER + ")";

    // Actual matching.
    // Parentheses and commas are optional, but not required.
    // Whitespace can take the place of commas or opening paren
    var PERMISSIVE_MATCH3 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
    var PERMISSIVE_MATCH4 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";

    return {
        CSS_UNIT: new RegExp(CSS_UNIT),
        rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
        rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
        hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
        hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
        hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
        hsva: new RegExp("hsva" + PERMISSIVE_MATCH4),
        hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
        hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
        hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
        hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
    };
})();

// `isValidCSSUnit`
// Take in a single string / number and check to see if it looks like a CSS unit
// (see `matchers` above for definition).
function isValidCSSUnit(color) {
    return !!matchers.CSS_UNIT.exec(color);
}

// `stringInputToObject`
// Permissive string parsing.  Take in a number of formats, and output an object
// based on detected format.  Returns `{ r, g, b }` or `{ h, s, l }` or `{ h, s, v}`
function stringInputToObject(color) {

    color = color.replace(trimLeft,'').replace(trimRight, '').toLowerCase();
    var named = false;
    if (names[color]) {
        color = names[color];
        named = true;
    }
    else if (color == 'transparent') {
        return { r: 0, g: 0, b: 0, a: 0, format: "name" };
    }

    // Try to match string input using regular expressions.
    // Keep most of the number bounding out of this function - don't worry about [0,1] or [0,100] or [0,360]
    // Just return an object and let the conversion functions handle that.
    // This way the result will be the same whether the tinycolor is initialized with string or object.
    var match;
    if ((match = matchers.rgb.exec(color))) {
        return { r: match[1], g: match[2], b: match[3] };
    }
    if ((match = matchers.rgba.exec(color))) {
        return { r: match[1], g: match[2], b: match[3], a: match[4] };
    }
    if ((match = matchers.hsl.exec(color))) {
        return { h: match[1], s: match[2], l: match[3] };
    }
    if ((match = matchers.hsla.exec(color))) {
        return { h: match[1], s: match[2], l: match[3], a: match[4] };
    }
    if ((match = matchers.hsv.exec(color))) {
        return { h: match[1], s: match[2], v: match[3] };
    }
    if ((match = matchers.hsva.exec(color))) {
        return { h: match[1], s: match[2], v: match[3], a: match[4] };
    }
    if ((match = matchers.hex8.exec(color))) {
        return {
            r: parseIntFromHex(match[1]),
            g: parseIntFromHex(match[2]),
            b: parseIntFromHex(match[3]),
            a: convertHexToDecimal(match[4]),
            format: named ? "name" : "hex8"
        };
    }
    if ((match = matchers.hex6.exec(color))) {
        return {
            r: parseIntFromHex(match[1]),
            g: parseIntFromHex(match[2]),
            b: parseIntFromHex(match[3]),
            format: named ? "name" : "hex"
        };
    }
    if ((match = matchers.hex4.exec(color))) {
        return {
            r: parseIntFromHex(match[1] + '' + match[1]),
            g: parseIntFromHex(match[2] + '' + match[2]),
            b: parseIntFromHex(match[3] + '' + match[3]),
            a: convertHexToDecimal(match[4] + '' + match[4]),
            format: named ? "name" : "hex8"
        };
    }
    if ((match = matchers.hex3.exec(color))) {
        return {
            r: parseIntFromHex(match[1] + '' + match[1]),
            g: parseIntFromHex(match[2] + '' + match[2]),
            b: parseIntFromHex(match[3] + '' + match[3]),
            format: named ? "name" : "hex"
        };
    }

    return false;
}

function validateWCAG2Parms(parms) {
    // return valid WCAG2 parms for isReadable.
    // If input parms are invalid, return {"level":"AA", "size":"small"}
    var level, size;
    parms = parms || {"level":"AA", "size":"small"};
    level = (parms.level || "AA").toUpperCase();
    size = (parms.size || "small").toLowerCase();
    if (level !== "AA" && level !== "AAA") {
        level = "AA";
    }
    if (size !== "small" && size !== "large") {
        size = "small";
    }
    return {"level":level, "size":size};
}

// Node: Export function
if (typeof module !== "undefined" && module.exports) {
    module.exports = tinycolor;
}
// AMD/requirejs: Define the module
else if (true) {
    !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {return tinycolor;}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}
// Browser: Expose to window
else {
    window.tinycolor = tinycolor;
}

})(Math);


/***/ }),
/* 261 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tinycolor2__ = __webpack_require__(260);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tinycolor2___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_tinycolor2__);


function _colorChange (data, oldHue) {
  var alpha = data && data.a
  var color

  // hsl is better than hex between conversions
  if (data && data.hsl) {
    color = __WEBPACK_IMPORTED_MODULE_0_tinycolor2___default()(data.hsl)
  } else if (data && data.hex && data.hex.length > 0) {
    color = __WEBPACK_IMPORTED_MODULE_0_tinycolor2___default()(data.hex)
  } else {
    color = __WEBPACK_IMPORTED_MODULE_0_tinycolor2___default()(data)
  }

  if (color && (color._a === undefined || color._a === null)) {
    color.setAlpha(alpha || 1)
  }

  var hsl = color.toHsl()
  var hsv = color.toHsv()

  if (hsl.s === 0) {
    hsv.h = hsl.h = data.h || (data.hsl && data.hsl.h) || oldHue || 0
  }

  /* --- comment this block to fix #109, may cause #25 again --- */
  // when the hsv.v is less than 0.0164 (base on test)
  // because of possible loss of precision
  // the result of hue and saturation would be miscalculated
  // if (hsv.v < 0.0164) {
  //   hsv.h = data.h || (data.hsv && data.hsv.h) || 0
  //   hsv.s = data.s || (data.hsv && data.hsv.s) || 0
  // }

  // if (hsl.l < 0.01) {
  //   hsl.h = data.h || (data.hsl && data.hsl.h) || 0
  //   hsl.s = data.s || (data.hsl && data.hsl.s) || 0
  // }
  /* ------ */

  return {
    hsl: hsl,
    hex: color.toHexString().toUpperCase(),
    rgba: color.toRgb(),
    hsv: hsv,
    oldHue: data.h || oldHue || hsl.h,
    source: data.source,
    a: data.a || color.getAlpha()
  }
}

/* harmony default export */ __webpack_exports__["a"] = ({
  props: ['value'],
  data () {
    return {
      val: _colorChange(this.value)
    }
  },
  computed: {
    colors: {
      get () {
        return this.val
      },
      set (newVal) {
        this.val = newVal
        this.$emit('input', newVal)
      }
    }
  },
  watch: {
    value (newVal) {
      this.val = _colorChange(newVal)
    }
  },
  methods: {
    colorChange (data, oldHue) {
      this.oldHue = this.colors.hsl.h
      this.colors = _colorChange(data, oldHue || this.oldHue)
    },
    isValidHex (hex) {
      return __WEBPACK_IMPORTED_MODULE_0_tinycolor2___default()(hex).isValid()
    },
    simpleCheckForValidColor (data) {
      var keysToCheck = ['r', 'g', 'b', 'a', 'h', 's', 'l', 'v']
      var checked = 0
      var passed = 0

      for (var i = 0; i < keysToCheck.length; i++) {
        var letter = keysToCheck[i]
        if (data[letter]) {
          checked++
          if (!isNaN(data[letter])) {
            passed++
          }
        }
      }

      if (checked === passed) {
        return data
      }
    }
  }
});


/***/ }),
/* 262 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_Alpha_vue__ = __webpack_require__(101);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__vue_loader_lib_template_compiler_index_id_data_v_fc5ffbc4_hasScoped_false_buble_transforms_vue_loader_lib_selector_type_template_index_0_Alpha_vue__ = __webpack_require__(379);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(401)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_Alpha_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__vue_loader_lib_template_compiler_index_id_data_v_fc5ffbc4_hasScoped_false_buble_transforms_vue_loader_lib_selector_type_template_index_0_Alpha_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "node_modules/vue-color/src/components/common/Alpha.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-fc5ffbc4", Component.options)
  } else {
    hotAPI.reload("data-v-fc5ffbc4", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 263 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_EditableInput_vue__ = __webpack_require__(103);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__vue_loader_lib_template_compiler_index_id_data_v_6a3fe6f4_hasScoped_false_buble_transforms_vue_loader_lib_selector_type_template_index_0_EditableInput_vue__ = __webpack_require__(354);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(391)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_EditableInput_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__vue_loader_lib_template_compiler_index_id_data_v_6a3fe6f4_hasScoped_false_buble_transforms_vue_loader_lib_selector_type_template_index_0_EditableInput_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "node_modules/vue-color/src/components/common/EditableInput.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-6a3fe6f4", Component.options)
  } else {
    hotAPI.reload("data-v-6a3fe6f4", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 264 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_Hue_vue__ = __webpack_require__(104);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__vue_loader_lib_template_compiler_index_id_data_v_61a5b2b8_hasScoped_false_buble_transforms_vue_loader_lib_selector_type_template_index_0_Hue_vue__ = __webpack_require__(349);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(389)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_Hue_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__vue_loader_lib_template_compiler_index_id_data_v_61a5b2b8_hasScoped_false_buble_transforms_vue_loader_lib_selector_type_template_index_0_Hue_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "node_modules/vue-color/src/components/common/Hue.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-61a5b2b8", Component.options)
  } else {
    hotAPI.reload("data-v-61a5b2b8", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 265 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_Saturation_vue__ = __webpack_require__(105);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__vue_loader_lib_template_compiler_index_id_data_v_c6d01d7c_hasScoped_false_buble_transforms_vue_loader_lib_selector_type_template_index_0_Saturation_vue__ = __webpack_require__(369);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(397)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_vue_loader_lib_selector_type_script_index_0_Saturation_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__vue_loader_lib_template_compiler_index_id_data_v_c6d01d7c_hasScoped_false_buble_transforms_vue_loader_lib_selector_type_template_index_0_Saturation_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "node_modules/vue-color/src/components/common/Saturation.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-c6d01d7c", Component.options)
  } else {
    hotAPI.reload("data-v-c6d01d7c", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 266 */,
/* 267 */,
/* 268 */,
/* 269 */,
/* 270 */,
/* 271 */,
/* 272 */,
/* 273 */,
/* 274 */,
/* 275 */,
/* 276 */,
/* 277 */,
/* 278 */,
/* 279 */,
/* 280 */,
/* 281 */,
/* 282 */,
/* 283 */,
/* 284 */,
/* 285 */,
/* 286 */,
/* 287 */,
/* 288 */,
/* 289 */,
/* 290 */,
/* 291 */,
/* 292 */,
/* 293 */,
/* 294 */,
/* 295 */,
/* 296 */,
/* 297 */,
/* 298 */,
/* 299 */,
/* 300 */,
/* 301 */,
/* 302 */,
/* 303 */,
/* 304 */,
/* 305 */,
/* 306 */,
/* 307 */,
/* 308 */,
/* 309 */,
/* 310 */,
/* 311 */,
/* 312 */,
/* 313 */,
/* 314 */,
/* 315 */,
/* 316 */,
/* 317 */,
/* 318 */,
/* 319 */,
/* 320 */,
/* 321 */,
/* 322 */,
/* 323 */,
/* 324 */,
/* 325 */,
/* 326 */,
/* 327 */,
/* 328 */,
/* 329 */,
/* 330 */,
/* 331 */,
/* 332 */,
/* 333 */,
/* 334 */,
/* 335 */,
/* 336 */,
/* 337 */,
/* 338 */,
/* 339 */,
/* 340 */,
/* 341 */,
/* 342 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      class: ["vc-sketch", _vm.disableAlpha ? "vc-sketch__disable-alpha" : ""]
    },
    [
      _c(
        "div",
        { staticClass: "vc-sketch-saturation-wrap" },
        [
          _c("saturation", {
            on: { change: _vm.childChange },
            model: {
              value: _vm.colors,
              callback: function($$v) {
                _vm.colors = $$v
              },
              expression: "colors"
            }
          })
        ],
        1
      ),
      _vm._v(" "),
      _c("div", { staticClass: "vc-sketch-controls" }, [
        _c("div", { staticClass: "vc-sketch-sliders" }, [
          _c(
            "div",
            { staticClass: "vc-sketch-hue-wrap" },
            [
              _c("hue", {
                on: { change: _vm.childChange },
                model: {
                  value: _vm.colors,
                  callback: function($$v) {
                    _vm.colors = $$v
                  },
                  expression: "colors"
                }
              })
            ],
            1
          ),
          _vm._v(" "),
          !_vm.disableAlpha
            ? _c(
                "div",
                { staticClass: "vc-sketch-alpha-wrap" },
                [
                  _c("alpha", {
                    on: { change: _vm.childChange },
                    model: {
                      value: _vm.colors,
                      callback: function($$v) {
                        _vm.colors = $$v
                      },
                      expression: "colors"
                    }
                  })
                ],
                1
              )
            : _vm._e()
        ]),
        _vm._v(" "),
        _c(
          "div",
          { staticClass: "vc-sketch-color-wrap" },
          [
            _c("div", {
              staticClass: "vc-sketch-active-color",
              style: { background: _vm.activeColor }
            }),
            _vm._v(" "),
            _c("checkboard")
          ],
          1
        )
      ]),
      _vm._v(" "),
      !_vm.disableFields
        ? _c("div", { staticClass: "vc-sketch-field" }, [
            _c(
              "div",
              { staticClass: "vc-sketch-field--double" },
              [
                _c("ed-in", {
                  attrs: { label: "hex", value: _vm.hex },
                  on: { change: _vm.inputChange }
                })
              ],
              1
            ),
            _vm._v(" "),
            _c(
              "div",
              { staticClass: "vc-sketch-field--single" },
              [
                _c("ed-in", {
                  attrs: { label: "r", value: _vm.colors.rgba.r },
                  on: { change: _vm.inputChange }
                })
              ],
              1
            ),
            _vm._v(" "),
            _c(
              "div",
              { staticClass: "vc-sketch-field--single" },
              [
                _c("ed-in", {
                  attrs: { label: "g", value: _vm.colors.rgba.g },
                  on: { change: _vm.inputChange }
                })
              ],
              1
            ),
            _vm._v(" "),
            _c(
              "div",
              { staticClass: "vc-sketch-field--single" },
              [
                _c("ed-in", {
                  attrs: { label: "b", value: _vm.colors.rgba.b },
                  on: { change: _vm.inputChange }
                })
              ],
              1
            ),
            _vm._v(" "),
            !_vm.disableAlpha
              ? _c(
                  "div",
                  { staticClass: "vc-sketch-field--single" },
                  [
                    _c("ed-in", {
                      attrs: {
                        label: "a",
                        value: _vm.colors.a,
                        "arrow-offset": 0.01,
                        max: 1
                      },
                      on: { change: _vm.inputChange }
                    })
                  ],
                  1
                )
              : _vm._e()
          ])
        : _vm._e(),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "vc-sketch-presets" },
        _vm._l(_vm.presetColors, function(c) {
          return _c("div", {
            key: c,
            staticClass: "vc-sketch-presets-color",
            style: { background: c },
            on: {
              click: function($event) {
                _vm.handlePreset(c)
              }
            }
          })
        })
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
    require("vue-hot-reload-api")      .rerender("data-v-511efdd0", esExports)
  }
}

/***/ }),
/* 343 */,
/* 344 */,
/* 345 */,
/* 346 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "vc-checkerboard", style: _vm.bgStyle })
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-550f7e4e", esExports)
  }
}

/***/ }),
/* 347 */,
/* 348 */,
/* 349 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { class: ["vc-hue", _vm.directionClass] }, [
    _c(
      "div",
      {
        ref: "container",
        staticClass: "vc-hue-container",
        on: {
          mousedown: _vm.handleMouseDown,
          touchmove: _vm.handleChange,
          touchstart: _vm.handleChange
        }
      },
      [
        _c(
          "div",
          {
            staticClass: "vc-hue-pointer",
            style: { top: _vm.pointerTop, left: _vm.pointerLeft }
          },
          [_c("div", { staticClass: "vc-hue-picker" })]
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
    require("vue-hot-reload-api")      .rerender("data-v-61a5b2b8", esExports)
  }
}

/***/ }),
/* 350 */,
/* 351 */,
/* 352 */,
/* 353 */,
/* 354 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "vc-editable-input" }, [
    _c("input", {
      directives: [
        { name: "model", rawName: "v-model", value: _vm.val, expression: "val" }
      ],
      ref: "input",
      staticClass: "vc-input__input",
      attrs: { "aria-label": _vm.value },
      domProps: { value: _vm.val },
      on: {
        keydown: _vm.handleKeyDown,
        input: [
          function($event) {
            if ($event.target.composing) {
              return
            }
            _vm.val = $event.target.value
          },
          _vm.update
        ]
      }
    }),
    _vm._v(" "),
    _c("span", { staticClass: "vc-input__label" }, [_vm._v(_vm._s(_vm.label))]),
    _vm._v(" "),
    _c("span", { staticClass: "vc-input__desc" }, [_vm._v(_vm._s(_vm.desc))])
  ])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-6a3fe6f4", esExports)
  }
}

/***/ }),
/* 355 */,
/* 356 */,
/* 357 */,
/* 358 */,
/* 359 */,
/* 360 */,
/* 361 */,
/* 362 */,
/* 363 */,
/* 364 */,
/* 365 */,
/* 366 */,
/* 367 */,
/* 368 */,
/* 369 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      ref: "container",
      staticClass: "vc-saturation",
      style: { background: _vm.bgColor },
      on: {
        mousedown: _vm.handleMouseDown,
        touchmove: _vm.handleChange,
        touchstart: _vm.handleChange
      }
    },
    [
      _c("div", { staticClass: "vc-saturation--white" }),
      _vm._v(" "),
      _c("div", { staticClass: "vc-saturation--black" }),
      _vm._v(" "),
      _c(
        "div",
        {
          staticClass: "vc-saturation-pointer",
          style: { top: _vm.pointerTop, left: _vm.pointerLeft }
        },
        [_c("div", { staticClass: "vc-saturation-circle" })]
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
    require("vue-hot-reload-api")      .rerender("data-v-c6d01d7c", esExports)
  }
}

/***/ }),
/* 370 */,
/* 371 */,
/* 372 */,
/* 373 */,
/* 374 */,
/* 375 */,
/* 376 */,
/* 377 */,
/* 378 */,
/* 379 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "vc-alpha" }, [
    _c(
      "div",
      { staticClass: "vc-alpha-checkboard-wrap" },
      [_c("checkboard")],
      1
    ),
    _vm._v(" "),
    _c("div", {
      staticClass: "vc-alpha-gradient",
      style: { background: _vm.gradientColor }
    }),
    _vm._v(" "),
    _c(
      "div",
      {
        ref: "container",
        staticClass: "vc-alpha-container",
        on: {
          mousedown: _vm.handleMouseDown,
          touchmove: _vm.handleChange,
          touchstart: _vm.handleChange
        }
      },
      [
        _c(
          "div",
          {
            staticClass: "vc-alpha-pointer",
            style: { left: _vm.colors.a * 100 + "%" }
          },
          [_c("div", { staticClass: "vc-alpha-picker" })]
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
    require("vue-hot-reload-api")      .rerender("data-v-fc5ffbc4", esExports)
  }
}

/***/ }),
/* 380 */,
/* 381 */,
/* 382 */,
/* 383 */,
/* 384 */,
/* 385 */,
/* 386 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(243);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("ae972db6", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../css-loader/index.js!../../../vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-511efdd0\",\"scoped\":false,\"hasInlineConfig\":false}!../../../vue-loader/lib/selector.js?type=styles&index=0!./Sketch.vue", function() {
     var newContent = require("!!../../../css-loader/index.js!../../../vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-511efdd0\",\"scoped\":false,\"hasInlineConfig\":false}!../../../vue-loader/lib/selector.js?type=styles&index=0!./Sketch.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 387 */,
/* 388 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(245);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("582e9e8e", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../css-loader/index.js!../../../../vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-550f7e4e\",\"scoped\":false,\"hasInlineConfig\":false}!../../../../vue-loader/lib/selector.js?type=styles&index=0!./Checkboard.vue", function() {
     var newContent = require("!!../../../../css-loader/index.js!../../../../vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-550f7e4e\",\"scoped\":false,\"hasInlineConfig\":false}!../../../../vue-loader/lib/selector.js?type=styles&index=0!./Checkboard.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 389 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(246);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("657219e1", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../css-loader/index.js!../../../../vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-61a5b2b8\",\"scoped\":false,\"hasInlineConfig\":false}!../../../../vue-loader/lib/selector.js?type=styles&index=0!./Hue.vue", function() {
     var newContent = require("!!../../../../css-loader/index.js!../../../../vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-61a5b2b8\",\"scoped\":false,\"hasInlineConfig\":false}!../../../../vue-loader/lib/selector.js?type=styles&index=0!./Hue.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 390 */,
/* 391 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(248);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("7a7cc2ee", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../css-loader/index.js!../../../../vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6a3fe6f4\",\"scoped\":false,\"hasInlineConfig\":false}!../../../../vue-loader/lib/selector.js?type=styles&index=0!./EditableInput.vue", function() {
     var newContent = require("!!../../../../css-loader/index.js!../../../../vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-6a3fe6f4\",\"scoped\":false,\"hasInlineConfig\":false}!../../../../vue-loader/lib/selector.js?type=styles&index=0!./EditableInput.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 392 */,
/* 393 */,
/* 394 */,
/* 395 */,
/* 396 */,
/* 397 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(254);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("692530ea", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../css-loader/index.js!../../../../vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-c6d01d7c\",\"scoped\":false,\"hasInlineConfig\":false}!../../../../vue-loader/lib/selector.js?type=styles&index=0!./Saturation.vue", function() {
     var newContent = require("!!../../../../css-loader/index.js!../../../../vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-c6d01d7c\",\"scoped\":false,\"hasInlineConfig\":false}!../../../../vue-loader/lib/selector.js?type=styles&index=0!./Saturation.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 398 */,
/* 399 */,
/* 400 */,
/* 401 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(258);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("e2958a72", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../css-loader/index.js!../../../../vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-fc5ffbc4\",\"scoped\":false,\"hasInlineConfig\":false}!../../../../vue-loader/lib/selector.js?type=styles&index=0!./Alpha.vue", function() {
     var newContent = require("!!../../../../css-loader/index.js!../../../../vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-fc5ffbc4\",\"scoped\":false,\"hasInlineConfig\":false}!../../../../vue-loader/lib/selector.js?type=styles&index=0!./Alpha.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 402 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ })
/******/ ]);