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
/******/ 		13: 0
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
/******/ 		script.src = __webpack_require__.p + "chunk/" + {"0":"359caa609bf5f26a669d","1":"9a9a78160b7194f6219c","2":"be10ccb70e501896492f","3":"e1fecf5cf9ecaf691614","4":"effa7f63596a51aa1709","5":"4ab5645061a7b247a8ec","6":"084de48429dc6bcd70c4","7":"7939d38510cf3e728857","8":"17f356e22723ee56df0d","9":"ce1eb6f84e6611590231","10":"fc38b57d7b8de0546fc8","11":"a53420a4aaa27d8c717a"}[chunkId] + ".chunk-bundle.js";
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
/******/ 	return __webpack_require__(__webpack_require__.s = 322);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */
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
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

/* harmony default export */ __webpack_exports__["a"] = (pm.Vue.mixin({

    data() {
        return {
            base_url: PM_Vars.base_url + '/' + PM_Vars.rest_api_prefix,
            project_id: typeof this.$route === 'undefined' ? false : this.$route.params.project_id,
            current_user: PM_Vars.current_user,
            avatar_url: PM_Vars.avatar_url,
            text: PM_Vars.text
        };
    },

    methods: {
        httpRequest(property) {
            var before = function (xhr) {
                xhr.setRequestHeader("Authorization_name", btoa('asaquzzaman')); //btoa js encoding base64_encode
                xhr.setRequestHeader("Authorization_password", btoa(12345678)); //atob js decode base64_decode
            };

            property.beforeSend = typeof property.beforeSend === 'undefined' ? before : property.beforeSend;

            jQuery.ajax(property);
        },

        newProject(callback) {
            var self = this;

            var request = {
                type: 'POST',

                url: this.base_url + '/pm/v2/projects/',

                data: {
                    'title': this.project.title,
                    'categories': [this.project_cat],
                    'description': this.project.description,
                    'notify_users': this.project_notify,
                    'assignees': this.formatUsers(this.selectedUsers),
                    'status': typeof this.project.status === 'undefined' ? 'incomplete' : this.project.status
                },

                success: function (res) {
                    self.$root.$store.commit('newProject', res.data);
                    self.showHideProjectForm(false);
                    self.resetSelectedUsers();
                    jQuery("#pm-project-dialog").dialog("close");

                    if (typeof callback !== 'undefined') {
                        callback(res);
                    }
                },

                error: function (res) {
                    if (typeof callback !== 'undefined') {
                        callback(res);
                    }
                }
            };

            this.httpRequest(request);
        },

        formatUsers(users) {
            var format_users = [];

            users.map(function (user, index) {
                format_users.push({
                    'user_id': user.id,
                    'role_id': user.roles.data[0].id
                });
            });

            return format_users;
        },

        updateProject(project, callback) {
            var self = this;

            var request = {
                type: 'PUT',

                url: this.base_url + '/pm/v2/projects/' + project.id,

                data: project,

                success: function (res) {

                    self.$root.$store.commit('updateProject', res.data);

                    self.showHideProjectForm(false);
                    jQuery("#pm-project-dialog").dialog("close");
                    self.resetSelectedUsers();
                    if (typeof callback !== 'undefined') {
                        callback(res.data);
                    }
                },

                error: function (res) {}
            };

            this.httpRequest(request);
        },

        resetSelectedUsers() {
            this.$root.$store.commit('resetSelectedUsers');
        },

        getProjects(condition, callback) {
            var condition = condition || '';
            var self = this;

            var request_data = {
                url: self.base_url + '/pm/v2/projects?per_page=2&page=' + self.setCurrentPageNumber(self) + '&' + condition,
                success: function (res) {
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

        setCurrentPageNumber(self) {
            var current_page_number = self.$route.params.current_page_number ? self.$route.params.current_page_number : 1;
            self.current_page_number = current_page_number;
            return current_page_number;
        },

        getProject(project_id, callback) {
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
                    success: function (res) {
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

        addProjectMeta(project) {
            project.edit_mode = false;
            project.settings_hide = false;
        },

        getProjectCategories(callback) {
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
                success: function (res) {
                    self.$root.$store.commit('setCategories', res.data);

                    if (callback) {
                        callback(res.data);
                    }
                }
            });
        },

        getRoles(callback) {
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
                success: function (res) {
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
        getIndex: function (itemList, id, slug) {
            var index = false;

            itemList.forEach(function (item, key) {
                if (item[slug] == id) {
                    index = key;
                }
            });

            return index;
        },

        showHideProjectForm(status) {
            this.$root.$store.commit('showHideProjectForm', status);
        },

        deleteFile(file_id, callback) {
            var self = this;

            self.httpRequest({
                url: self.base_url + '/pm/v2/projects/' + self.project_id + '/files/' + file_id,
                type: 'DELETE',
                success: function (res) {

                    if (typeof callback !== 'undefined') {
                        callback(res.data);
                    }
                }
            });
        },

        userTaskProfileUrl(user_id) {
            return PM_Vars.ajaxurl + '?page=pm_task#/user/' + user_id;
        },

        /**
         * Set extra element in httpRequest query
         */
        getQueryParams(add_query) {

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
        setQuery(add_query) {
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
        pmDateISO8601Format: function (date, time) {
            var date = new Date(date + ' ' + time);

            return pm.Moment(date).format();
        },

        deleteProject(id) {
            if (!confirm(this.text.delete_project_conf)) {
                return;
            }
            var self = this;
            var request_data = {
                url: self.base_url + '/pm/v2/projects/' + id,
                type: 'DELETE',
                success: function (res) {
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

        addUserMeta(user) {
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
        projects_view_class() {
            return this.$store.state.projects_view === 'grid_view' ? 'pm-project-grid' : 'pm-project-list';
        },

        generateConditions(conditions) {
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
        getGlobalMilestones(callback) {
            var self = this,
                milestones = this.$root.$store.state.milestones;

            if (milestones.length) {
                if (typeof callback === 'function') {
                    callback.apply(milestones);
                }

                return milestones;
            }

            var request = {
                url: self.base_url + '/pm/v2/projects/' + self.project_id + '/milestones',
                success(res) {
                    self.$root.$store.commit('setMilestones', res.data);

                    if (typeof callback === 'function') {
                        args.callback(res.data);
                    }
                }
            };
            self.httpRequest(request);
        }
    }
}));

/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__projects_router__ = __webpack_require__(324);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__categories_router__ = __webpack_require__(305);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__add_ons_router__ = __webpack_require__(302);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__my_tasks_router__ = __webpack_require__(317);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__calendar_router__ = __webpack_require__(303);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__reports_router__ = __webpack_require__(325);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__progress_router__ = __webpack_require__(323);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__settings_router__ = __webpack_require__(327);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__overview_router__ = __webpack_require__(320);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__activities_router__ = __webpack_require__(300);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__files_router__ = __webpack_require__(311);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__task_lists_router__ = __webpack_require__(331);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__discussions_router__ = __webpack_require__(308);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__milestones_router__ = __webpack_require__(315);
















weDevs_PM_Routers.push(__WEBPACK_IMPORTED_MODULE_7__settings_router__["a" /* general */]);
weDevs_PM_Routers.push(__WEBPACK_IMPORTED_MODULE_7__settings_router__["b" /* email */]);
weDevs_PM_Routers.push(__WEBPACK_IMPORTED_MODULE_0__projects_router__["a" /* active */]);
weDevs_PM_Routers.push(__WEBPACK_IMPORTED_MODULE_0__projects_router__["b" /* all */]);
weDevs_PM_Routers.push(__WEBPACK_IMPORTED_MODULE_0__projects_router__["c" /* completed */]);
weDevs_PM_Routers.push(__WEBPACK_IMPORTED_MODULE_1__categories_router__["a" /* default */]);
weDevs_PM_Routers.push(__WEBPACK_IMPORTED_MODULE_2__add_ons_router__["a" /* default */]);
weDevs_PM_Routers.push(__WEBPACK_IMPORTED_MODULE_3__my_tasks_router__["a" /* default */]);
weDevs_PM_Routers.push(__WEBPACK_IMPORTED_MODULE_4__calendar_router__["a" /* default */]);
weDevs_PM_Routers.push(__WEBPACK_IMPORTED_MODULE_5__reports_router__["a" /* default */]);
weDevs_PM_Routers.push(__WEBPACK_IMPORTED_MODULE_6__progress_router__["a" /* default */]);
weDevs_PM_Routers.push(__WEBPACK_IMPORTED_MODULE_8__overview_router__["a" /* default */]);
weDevs_PM_Routers.push(__WEBPACK_IMPORTED_MODULE_9__activities_router__["a" /* default */]);
weDevs_PM_Routers.push(__WEBPACK_IMPORTED_MODULE_12__discussions_router__["a" /* discussions */]);
weDevs_PM_Routers.push(__WEBPACK_IMPORTED_MODULE_12__discussions_router__["b" /* single_discussion */]);
weDevs_PM_Routers.push(__WEBPACK_IMPORTED_MODULE_13__milestones_router__["a" /* milestones */]);
weDevs_PM_Routers.push(__WEBPACK_IMPORTED_MODULE_11__task_lists_router__["a" /* task_lists */]);
weDevs_PM_Routers.push(__WEBPACK_IMPORTED_MODULE_11__task_lists_router__["b" /* single_list */]);
weDevs_PM_Routers.push(__WEBPACK_IMPORTED_MODULE_10__files_router__["a" /* default */]);

var router = new pm.VueRouter({
	routes: weDevs_PM_Routers
});

router.beforeEach((to, from, next) => {
	pm.NProgress.start();
	next();
});

/* harmony default export */ __webpack_exports__["a"] = (router);

/***/ }),
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */,
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
/* 43 */,
/* 44 */,
/* 45 */,
/* 46 */,
/* 47 */,
/* 48 */,
/* 49 */,
/* 50 */,
/* 51 */,
/* 52 */,
/* 53 */,
/* 54 */,
/* 55 */,
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
/* 71 */,
/* 72 */,
/* 73 */,
/* 74 */,
/* 75 */,
/* 76 */,
/* 77 */,
/* 78 */,
/* 79 */,
/* 80 */,
/* 81 */,
/* 82 */,
/* 83 */,
/* 84 */,
/* 85 */,
/* 86 */,
/* 87 */,
/* 88 */,
/* 89 */,
/* 90 */,
/* 91 */,
/* 92 */,
/* 93 */,
/* 94 */,
/* 95 */,
/* 96 */,
/* 97 */,
/* 98 */,
/* 99 */,
/* 100 */,
/* 101 */,
/* 102 */,
/* 103 */,
/* 104 */,
/* 105 */,
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
/* 170 */,
/* 171 */,
/* 172 */,
/* 173 */,
/* 174 */,
/* 175 */,
/* 176 */,
/* 177 */,
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
/* 208 */,
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
/* 243 */,
/* 244 */,
/* 245 */,
/* 246 */,
/* 247 */,
/* 248 */,
/* 249 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_template_compiler_index_id_data_v_287c30e3_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_header_vue__ = __webpack_require__(411);
var disposed = false
var normalizeComponent = __webpack_require__(4)
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
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_template_compiler_index_id_data_v_287c30e3_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_header_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/settings/header.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-287c30e3", Component.options)
  } else {
    hotAPI.reload("data-v-287c30e3", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 250 */,
/* 251 */,
/* 252 */
/***/ (function(module, exports) {



/***/ }),
/* 253 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

/**
 * Make sure to call pm.Vue.use(Vuex) first if using a vuex module system
 */

/* harmony default export */ __webpack_exports__["a"] = (new pm.Vuex.Store({

	state: {
		projects: [],
		project: {},
		project_users: [],
		categories: [],
		roles: [],
		milestones: [],
		is_project_form_active: false,
		projects_meta: {},
		pagination: {},
		getIndex: function (itemList, id, slug) {
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
		setProjects(state, projects) {
			state.projects = projects.projects;
		},
		setProject(state, project) {
			state.projects.push(project);
		},

		setProjectUsers(state, users) {
			state.project_users = users;
		},
		setCategories(state, categories) {
			state.categories = categories;
		},
		setRoles(state, roles) {
			state.roles = roles;
		},
		newProject(state, projects) {
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
		showHideProjectForm(state, status) {
			if (status === 'toggle') {
				state.is_project_form_active = state.is_project_form_active ? false : true;
			} else {
				state.is_project_form_active = status;
			}
		},
		setProjectsMeta(state, data) {
			state.projects_meta = data;
			state.pagination = data.pagination;
		},

		afterDeleteProject(state, project_id) {
			var project_index = state.getIndex(state.projects, project_id, 'id');
			state.projects.splice(project_index, 1);
		},

		updateProject(state, project) {
			var index = state.getIndex(state.projects, project.id, 'id');
			//console.log(state.projects[index]);
			// console.log(state.projects[index], project);

			//state.projects[index] = project;
			jQuery.extend(true, state.projects[index], project);
			//console.log(state.projects[index], project);
			// jQuery.each(state.projects[index], function(key, value) {
			// 	//console.log(state.projects[index][key], project[key]);
			// 	jQuery.extend(true, state.projects[index][key], project[key]);
			// });

			// //console.log(state.projects[index]);
		},

		showHideProjectDropDownAction(state, data) {
			var index = state.getIndex(state.projects, data.project_id, 'id');

			if (data.status === 'toggle') {
				state.projects[index].settings_hide = state.projects[index].settings_hide ? false : true;
			} else {
				state.projects[index].settings_hide = data.status;
			}
		},

		afterDeleteUserFromProject(state, data) {
			var index = state.getIndex(state.projects, data.project_id, 'id');
			var users = state.projects[index].assignees.data;
			var user_index = state.getIndex(users, data.user_id, 'id');

			state.projects[index].assignees.data.splice(user_index, 1);
		},

		updateSeletedUser(state, assignees) {
			state.assignees.push(assignees);
		},

		setSeletedUser(state, assignees) {
			state.assignees = assignees;
		},

		resetSelectedUsers(state) {
			state.assignees = [];
		},

		setMilestones(state, milestones) {
			state.milestones = milestones;
		}
	}

}));

/***/ }),
/* 254 */,
/* 255 */,
/* 256 */,
/* 257 */,
/* 258 */,
/* 259 */,
/* 260 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_pm_vue__ = __webpack_require__(292);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_ca61d7fa_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_pm_vue__ = __webpack_require__(419);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(424)
}
var normalizeComponent = __webpack_require__(4)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_pm_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_ca61d7fa_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_pm_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/pm.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-ca61d7fa", Component.options)
  } else {
    hotAPI.reload("data-v-ca61d7fa", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 261 */,
/* 262 */,
/* 263 */,
/* 264 */,
/* 265 */
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
/* 266 */
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

var listToStyles = __webpack_require__(425)

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
/* 267 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_do_action_vue__ = __webpack_require__(286);
var disposed = false
var normalizeComponent = __webpack_require__(4)
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
Component.options.__file = "views/assets/src/common/do-action.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0b35689a", Component.options)
  } else {
    hotAPI.reload("data-v-0b35689a", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
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
/* 280 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__mixin__ = __webpack_require__(299);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__store__ = __webpack_require__(301);
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["a"] = ({
	store: __WEBPACK_IMPORTED_MODULE_1__store__["a" /* default */]
});

/***/ }),
/* 281 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_mixin__ = __webpack_require__(10);
//
//
//
//



/* harmony default export */ __webpack_exports__["a"] = ({
	mixins: [__WEBPACK_IMPORTED_MODULE_0__common_mixin__["a" /* default */]],
	methods: {}
});

/***/ }),
/* 282 */
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
/* 283 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__edit_category_form_vue__ = __webpack_require__(390);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
			vm.getCategories();
		});
	},

	components: {
		'edit-category-form': __WEBPACK_IMPORTED_MODULE_0__edit_category_form_vue__["a" /* default */]
	},

	data() {
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
		categories() {
			return this.$store.state.categories;
		}
	},

	methods: {

		selectAll() {
			var self = this;
			this.$store.state.categories.map(function (category, index) {
				self.delete_items.push(category.id);
			});
		},
		catTrClass(category) {
			if (category.edit_mode) {
				return 'inline-edit-row inline-editor';
			}
		},

		selfDeleted() {
			var self = this;
			switch (this.bulk_action) {
				case 'delete':
					self.deleteCategories(this.delete_items);
					break;
			}
		}
	}
});

/***/ }),
/* 284 */
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

	data() {
		return {
			submit_disabled: false,
			show_spinner: false
		};
	},

	methods: {
		updateSelfCategory() {
			var data = {
				id: this.category.id,
				title: this.category.title,
				description: this.category.description
			};

			this.updateCategory(data);
		}
	}
});

/***/ }),
/* 285 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__mixin__ = __webpack_require__(304);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__store__ = __webpack_require__(306);
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["a"] = ({
	store: __WEBPACK_IMPORTED_MODULE_1__store__["a" /* default */]
});

/***/ }),
/* 286 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__mixin__ = __webpack_require__(10);




function PMGetComponents() {
	var components = {};

	window.weDevs_PM_Components.map(function (obj, key) {
		if (obj.property.mixins) {
			obj.property.mixins.push(__WEBPACK_IMPORTED_MODULE_0__mixin__["a" /* default */]);
		} else {
			obj.property.mixins = [__WEBPACK_IMPORTED_MODULE_0__mixin__["a" /* default */]];
		}

		components[obj.component] = obj.property;
	});

	return components;
}

var action = {
	props: ['hook'],

	components: PMGetComponents(),

	render(h) {
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
/* 287 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__store__ = __webpack_require__(309);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mixin__ = __webpack_require__(307);
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["a"] = ({
    store: __WEBPACK_IMPORTED_MODULE_0__store__["a" /* default */]
});

/***/ }),
/* 288 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__store__ = __webpack_require__(312);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mixin__ = __webpack_require__(310);
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["a"] = ({
    store: __WEBPACK_IMPORTED_MODULE_0__store__["a" /* default */]
});

/***/ }),
/* 289 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__store__ = __webpack_require__(316);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mixin__ = __webpack_require__(314);
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["a"] = ({
    store: __WEBPACK_IMPORTED_MODULE_0__store__["a" /* default */]
});

/***/ }),
/* 290 */
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
/* 291 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__directive__ = __webpack_require__(318);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__directive___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__directive__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__store__ = __webpack_require__(321);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__mixin__ = __webpack_require__(319);
//
//
//
//
//
//
//





/* harmony default export */ __webpack_exports__["a"] = ({
    store: __WEBPACK_IMPORTED_MODULE_1__store__["a" /* default */]
});

/***/ }),
/* 292 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__discussions_index_vue__ = __webpack_require__(392);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__projects_index_vue__ = __webpack_require__(398);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__overview_index_vue__ = __webpack_require__(396);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__activities_index_vue__ = __webpack_require__(386);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__milestones_index_vue__ = __webpack_require__(394);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__categories_index_vue__ = __webpack_require__(391);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__task_lists_index_vue__ = __webpack_require__(403);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__files_index_vue__ = __webpack_require__(393);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__common_do_action_vue__ = __webpack_require__(267);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__settings_index_vue__ = __webpack_require__(402);
//
//
//
//
//
//
//
//
//
//
//
//
//
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
		'pm-discussions': __WEBPACK_IMPORTED_MODULE_0__discussions_index_vue__["a" /* default */],
		'pm-projects': __WEBPACK_IMPORTED_MODULE_1__projects_index_vue__["a" /* default */],
		'pm-overview': __WEBPACK_IMPORTED_MODULE_2__overview_index_vue__["a" /* default */],
		'pm-activities': __WEBPACK_IMPORTED_MODULE_3__activities_index_vue__["a" /* default */],
		'pm-milestones': __WEBPACK_IMPORTED_MODULE_4__milestones_index_vue__["a" /* default */],
		'pm-categories': __WEBPACK_IMPORTED_MODULE_5__categories_index_vue__["a" /* default */],
		'pm-task-lists': __WEBPACK_IMPORTED_MODULE_6__task_lists_index_vue__["a" /* default */],
		'pm-files': __WEBPACK_IMPORTED_MODULE_7__files_index_vue__["a" /* default */],
		'do-action': __WEBPACK_IMPORTED_MODULE_8__common_do_action_vue__["a" /* default */],
		'pm-settings': __WEBPACK_IMPORTED_MODULE_9__settings_index_vue__["a" /* default */]
	}

});

/***/ }),
/* 293 */
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
/* 294 */
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
/* 295 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__header_vue__ = __webpack_require__(249);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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

    data() {
        return {
            from_email: this.getSettings('from_email', PM_Vars.current_user.data.user_email),
            link_to_backend: this.getSettings('link_to_backend', false),
            email_type: this.getSettings('email_type', 'text/html'),
            enable_bcc: this.getSettings('enable_bcc', false),
            show_spinner: false
        };
    },

    methods: {
        saveEmailSettings() {
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
/* 296 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__header_vue__ = __webpack_require__(249);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
        saveSelfSettings() {
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
/* 297 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__store__ = __webpack_require__(328);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__store___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__store__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mixin__ = __webpack_require__(326);
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
/* 298 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__store__ = __webpack_require__(332);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mixin__ = __webpack_require__(330);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__directive__ = __webpack_require__(329);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__directive___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__directive__);
//
//
//
//
//
//
//



//import mixin from './newmixin';


/* harmony default export */ __webpack_exports__["a"] = ({
	store: __WEBPACK_IMPORTED_MODULE_0__store__["a" /* default */]
});

/***/ }),
/* 299 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

/* unused harmony default export */ var _unused_webpack_default_export = (pm.Vue.mixin({
	methods: {
		getActivities(condition, callback) {
			var self = this,
			    condition = self.generateActivityCondition(condition) || '';

			var request = {
				url: self.base_url + '/pm/v2/projects/' + self.project_id + '/activities?' + condition,
				success(res) {
					if (typeof callback !== 'undefined') {
						callback(res);
					}
					pm.NProgress.done();
				}
			};

			self.httpRequest(request);
		},

		setCurrentPageNumber(self) {
			var current_page_number = self.$route.params.current_page_number ? self.$route.params.current_page_number : 1;
			self.current_page_number = current_page_number;
			return current_page_number;
		},

		generateActivityCondition(conditions) {
			var query = '';

			jQuery.each(conditions, function (condition, key) {
				query = query + condition + '=' + key + '&';
			});

			return query.slice(0, -1);
		}
	}
}));

/***/ }),
/* 300 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//import project_lists from './index.vue';

const activities_route = resolve => {
    __webpack_require__.e/* require.ensure */(11).then((() => {
        resolve(__webpack_require__(268));
    }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
};

var activities = {
    path: '/:project_id/activities/',
    components: {
        'activities': activities_route
    },
    name: 'activities'
};

/* harmony default export */ __webpack_exports__["a"] = (activities);

/***/ }),
/* 301 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

/**
 * Make sure to call pm.Vue.use(Vuex) first if using a vuex module system
 */
/* harmony default export */ __webpack_exports__["a"] = (new pm.Vuex.Store({

	state: {
		activities: []
	},

	mutations: {
		setActivities(state, activities) {
			state.activities = activities;
		},

		setLoadedActivities(state, activities) {
			var new_activity = state.activities.concat(activities);
			state.activities = new_activity;
		}
	}
}));

/***/ }),
/* 302 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__index_vue__ = __webpack_require__(387);


/* harmony default export */ __webpack_exports__["a"] = ({
    path: '/add-ons',
    components: { 'add-ons': __WEBPACK_IMPORTED_MODULE_0__index_vue__["a" /* default */] },
    name: 'add_ons'
});

/***/ }),
/* 303 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__index_vue__ = __webpack_require__(388);


/* harmony default export */ __webpack_exports__["a"] = ({
    path: '/calendar',
    components: { 'calendar': __WEBPACK_IMPORTED_MODULE_0__index_vue__["a" /* default */] },
    name: 'calendar'
});

/***/ }),
/* 304 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

/* unused harmony default export */ var _unused_webpack_default_export = (pm.Vue.mixin({
	methods: {
		newCategory() {
			// Exit from this function, If submit button disabled 
			if (this.submit_disabled) {
				return;
			}

			// Disable submit button for preventing multiple click
			this.submit_disabled = true;
			this.show_spinner = true;

			var self = this,
			    form_data = {
				title: this.title,
				description: this.description,
				categorible_type: 'project'
			};

			var request_data = {
				url: self.base_url + '/pm/v2/categories',
				type: 'POST',
				data: form_data,

				success(res) {
					self.addCategoryMeta(res.data);

					self.show_spinner = false;

					// Display a success toast, with a title
					pm.Toastr.success(res.data.success);

					self.submit_disabled = false;

					self.$store.commit('afterNewCategories', res.data);
				},

				error(res) {
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

		getCategories() {
			var self = this;

			var request_data = {
				url: self.base_url + '/pm/v2/categories',
				success: function (res) {
					res.data.map(function (category, index) {
						self.addCategoryMeta(category);
					});

					self.$store.commit('setCategories', res.data);
				}
			};

			self.httpRequest(request_data);
		},

		getCategory() {},

		addCategoryMeta(category) {
			category.edit_mode = false;
		},

		showHideCategoryEditForm(category) {
			category.edit_mode = category.edit_mode ? false : true;
		},
		updateCategory(category) {
			// Exit from this function, If submit button disabled 
			if (this.submit_disabled) {
				return;
			}

			// Disable submit button for preventing multiple click
			this.submit_disabled = true;
			this.show_spinner = true;

			var self = this,
			    form_data = category;

			// Showing loading option 
			this.show_spinner = true;

			var request_data = {
				url: self.base_url + '/pm/v2/categories/' + category.id,
				type: 'PUT',
				data: form_data,

				success(res) {
					self.addCategoryMeta(res.data);
					self.show_spinner = false;

					// Display a success toast, with a title
					pm.Toastr.success(res.data.success);

					self.submit_disabled = false;
					self.show_spinner = false;

					self.$store.commit('afterUpdateCategories', res.data);
				},

				error(res) {
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

		deleteCategories(ids) {
			if (!confirm('Are you sure!')) {
				return;
			}
			var self = this;
			var request_data = {
				url: self.base_url + '/pm/v2/categories/bulk-delete/',
				data: {
					'category_ids': ids
				},
				type: 'DELETE',
				success: function (res) {
					ids.map(function (id, index) {
						self.$store.commit('afterDeleteCategory', id);
					});

					// if (!self.$store.state.discussion.length) {
					//     self.$router.push({
					//         name: 'discussions', 
					//         params: { 
					//             project_id: self.project_id 
					//         }
					//     });
					// } else {
					//     self.getDiscussion(self);
					// }
				}
				//self.$store.commit('afterDeleteDiscuss', discuss_id);
			};self.httpRequest(request_data);
		}
	}
}));

/***/ }),
/* 305 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__categories_vue__ = __webpack_require__(389);


/* harmony default export */ __webpack_exports__["a"] = ({
    path: '/categories',
    components: {
        'categories': __WEBPACK_IMPORTED_MODULE_0__categories_vue__["a" /* default */]
    },
    name: 'categories'
});

/***/ }),
/* 306 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

/**
 * Make sure to call pm.Vue.use(Vuex) first if using a vuex module system
 */

/* harmony default export */ __webpack_exports__["a"] = (new pm.Vuex.Store({

	state: {
		categories: [],
		getIndex: function (itemList, id, slug) {
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
		afterNewCategories(state, categories) {
			state.categories.push(categories);
		},

		setCategories(state, categories) {
			state.categories = categories;
		},

		afterUpdateCategories(state, category) {
			var category_index = state.getIndex(state.categories, category.id, 'id');
			state.categories.splice(category_index, 1, category);
		},
		afterDeleteCategory(state, id) {
			var category_index = state.getIndex(state.categories, id, 'id');
			state.categories.splice(category_index, 1);
		}
	}
}));

/***/ }),
/* 307 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

/* unused harmony default export */ var _unused_webpack_default_export = (pm.Vue.mixin({
	methods: {
		showHideDiscussForm(status, discuss) {
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

		showHideDiscussCommentForm(status, comment) {
			if (status === 'toggle') {
				comment.edit_mode = comment.edit_mode ? false : true;
			} else {
				comment.edit_mode = status;
			}
		},

		getDiscussion(args) {
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
				success(res) {
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

		getDiscuss(args) {
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
				success(res) {
					self.addDiscussMeta(res.data);
					self.$store.commit('setDiscuss', res.data);

					if (typeof args.callback === 'function') {
						args.callback(res.data);
					}
				}
			};
			self.httpRequest(request);
		},

		addDiscussMeta(discuss) {
			var self = this;
			discuss.edit_mode = false;

			if (typeof discuss.comments !== 'undefined') {
				discuss.comments.data.map(function (comment, index) {
					self.addCommentMeta(comment);
				});
			}
		},

		setCurrentPageNumber() {
			var self = this;
			var current_page_number = self.$route.params.current_page_number ? self.$route.params.current_page_number : 1;
			self.current_page_number = current_page_number;
			return current_page_number;
		},

		dataURLtoFile(dataurl, filename) {
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
		newDiscuss: function (args) {
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
				success(res) {

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

				error(res) {
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

		updateDiscuss(args) {
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
				success(res) {
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

				error(res) {
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

		newComment(args) {
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
				success(res) {
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

				error(res) {
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

		updateComment(args) {
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
				success(res) {
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

				error(res) {
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

		addCommentMeta(comment) {
			comment.edit_mode = false;
		},

		deleteDiscuss(args) {
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
				success: function (res) {
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

		deleteComment(args) {
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
				success: function (res) {
					self.$store.commit('afterDeleteComment', {
						comment_id: args.comment_id,
						commentable_id: args.commentable_id
					});
				}
			};

			self.httpRequest(request_data);
		},

		viewAction(blank, discuss) {
			var blank = blank || false;
			var discuss = discuss || false;

			this.$store.commit('balankTemplateStatus', blank);
			this.$store.commit('discussTemplateStatus', discuss);
		},

		lazyAction() {
			var discussion = this.$store.state.discussion;

			if (discussion.length) {
				this.viewAction(false, true);
			}

			if (!discussion.length) {
				this.viewAction(true, false);
			}
		}
	}
}));

/***/ }),
/* 308 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return discussions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return single_discussion; });
//import project_lists from './index.vue';

const discussions_route = resolve => {
    __webpack_require__.e/* require.ensure */(7).then((() => {
        resolve(__webpack_require__(269));
    }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
};

const individual_discussion = resolve => {
    __webpack_require__.e/* require.ensure */(6).then((() => {
        resolve(__webpack_require__(270));
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



/***/ }),
/* 309 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

/**
 * Make sure to call pm.Vue.use(Vuex) first if using a vuex module system
 */

/* harmony default export */ __webpack_exports__["a"] = (new pm.Vuex.Store({

	state: {
		is_discuss_form_active: false,
		blank_template: false,
		discuss_template: false,
		discussion: [],
		discuss: {},
		meta: {},
		getIndex: function (itemList, id, slug) {
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
		showHideDiscussForm(state, status) {
			if (status === 'toggle') {
				state.is_discuss_form_active = state.is_discuss_form_active ? false : true;
			} else {
				state.is_discuss_form_active = status;
			}
		},

		setMilestones(state, milestones) {
			state.milestones = milestones;
		},

		setDiscussion(state, discussion) {

			state.discussion = discussion;
		},

		setDiscuss(state, discuss) {
			state.discussion = [];
			state.discussion.push(discuss);
		},

		afterDeleteDiscuss(state, discuss_id) {
			var discuss_index = state.getIndex(state.discussion, discuss_id, 'id');
			state.discussion.splice(discuss_index, 1);
		},
		setDiscussionMeta(state, meta) {
			state.meta = meta;
		},
		afterDeleteComment(state, data) {
			var comment_index = state.getIndex(state.discussion[0].comments.data, data.comment_id, 'id');
			state.discussion[0].comments.data.splice(comment_index, 1);
		},
		updateDiscuss(state, data) {
			var discuss_index = state.getIndex(state.discussion, data.id, 'id');
			state.discussion.splice(discuss_index, 1, data);
		},

		newDiscuss(state, discuss) {
			var per_page = state.meta.per_page,
			    length = state.discussion.length;

			if (per_page <= length) {
				state.discussion.splice(0, 0, discuss);
				state.discussion.pop();
			} else {
				state.discussion.splice(0, 0, discuss);
			}
		},

		balankTemplateStatus(state, status) {
			state.blank_template = status;
		},

		discussTemplateStatus(state, status) {
			state.discuss_template = status;
		},

		updateMetaAfterNewDiscussion(state) {
			state.meta.total = state.meta.total + 1;
			state.meta.total_pages = Math.ceil(state.meta.total / state.meta.per_page);
		},

		afterNewComment(state, data) {
			var index = state.getIndex(state.discussion, data.commentable_id, 'id');

			state.discussion[index].comments.data.splice(0, 0, data.comment);
		},

		afterUpdateComment(state, data) {
			var index = state.getIndex(state.discussion, data.commentable_id, 'id'),
			    comment_index = state.getIndex(state.discussion[index].comments.data, data.comment_id, 'id');

			state.discussion[index].comments.data.splice(comment_index, 1, data.comment);
		}
	}
}));

/***/ }),
/* 310 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

/* unused harmony default export */ var _unused_webpack_default_export = (pm.Vue.mixin({
	methods: {
		getFiles() {
			var self = this;
			var request = {
				url: self.base_url + '/pm/v2/projects/' + self.project_id + '/files',
				success(res) {
					self.$store.commit('setFiles', res.data);
					pm.NProgress.done();
					self.loading = false;
				}
			};
			self.httpRequest(request);
		}
	}
}));

/***/ }),
/* 311 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//import project_lists from './index.vue';

const files = resolve => {
    __webpack_require__.e/* require.ensure */(10).then((() => {
        resolve(__webpack_require__(271));
    }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
};

/* harmony default export */ __webpack_exports__["a"] = ({
    path: '/:project_id/files',
    components: {
        'pm-files': files
    },
    name: 'pm_files'
});

/***/ }),
/* 312 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


/**
 * Make sure to call pm.Vue.use(Vuex) first if using a vuex module system
 */

/* harmony default export */ __webpack_exports__["a"] = (new pm.Vuex.Store({

	state: {
		files: []
	},

	mutations: {
		setFiles(state, files) {
			state.files = files;
		}
	}
}));

/***/ }),
/* 313 */,
/* 314 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

/* unused harmony default export */ var _unused_webpack_default_export = (pm.Vue.mixin({
    methods: {
        showHideMilestoneForm(status, milestone) {
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

        showHideCommentForm(status, comment) {
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

        getMilestone(args) {
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
                success(res) {
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
        getMilestones(args) {
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
                success(res) {
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

        getSelfMilestones() {
            var self = this,
                args = {
                conditions: {
                    with: 'discussion_boards,task_lists',
                    per_page: 2,
                    page: self.setCurrentPageNumber()
                },
                callback: function () {
                    pm.NProgress.done();
                    self.loading = false;
                    self.templateAction();
                }
            };

            self.getMilestones(args);
        },

        addMeta(milestone, index) {
            milestone.edit_mode = false;
        },

        setCurrentPageNumber() {
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
        addMilestone(args) {
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
                success(res) {
                    self.addMeta(res.data);

                    self.$store.commit('newMilestone', res.data);
                    // Display a success toast, with a title
                    toastr.success(res.data.success);

                    self.$root.$emit('after_comment');
                    self.templateAction();

                    if (typeof args.callback === 'function') {
                        args.callback.call(self, res);
                    }

                    if (self.section === 'milestones') {
                        self.afterNewMilestone();
                    }
                },

                error(res) {
                    // Showing error
                    res.data.error.map(function (value, index) {
                        toastr.error(value);
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
        updateMilestone(args) {
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
                url: self.base_url + '/pm/v2/projects/' + self.project_id + '/milestones/' + milestone.id,
                type: 'PUT',
                data: data,
                success(res) {
                    self.addMeta(res.data);

                    // update milestone 
                    self.$store.commit('updateMilestone', res.data);

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

                error(res) {
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

        deleteMilestone(milestone, callback) {
            if (!confirm(this.text.milestone_delete_conf)) {
                return;
            }
            var self = this;
            var request_data = {
                url: self.base_url + '/pm/v2/projects/' + self.project_id + '/milestones/' + milestone.id,
                type: 'DELETE',
                success: function (res) {
                    self.$store.commit('afterDeleteMilestone', milestone.id);

                    if (typeof callback === 'function') {
                        callback.apply(res);
                    }
                }
            };

            self.httpRequest(request_data);
        },

        /**
         * Insert and edit task
         * 
         * @return void
         */
        //  newMilestone: function() {
        //      // Exit from this function, If submit button disabled 
        //      if ( this.submit_disabled ) {
        //          return;
        //      }

        //      // Disable submit button for preventing multiple click
        //      this.submit_disabled = true;

        //      var self      = this,
        //          is_update = typeof this.milestone.id == 'undefined' ? false : true,
        //          form_data = {
        //              title: this.milestone.title,
        //              description: this.milestone.description,
        //              achieve_date: this.due_date,
        //              status: typeof this.milestone.status  === 'undefined' ? 'incomplete' : this.milestone.status,
        //              order: '',
        //          };

        //      // Showing loading option 
        //      this.show_spinner = true;

        //      if (is_update) {
        // var url  = self.base_url + '/pm/v2/projects/'+self.project_id+'/milestones/'+this.milestone.id;
        // var type = 'PUT'; 
        //      } else {
        // var url  = self.base_url + '/pm/v2/projects/'+self.project_id+'/milestones';
        // var type = 'POST';
        //      }

        //      var request_data = {
        //          url: url,
        //          type: type,
        //          data: form_data,
        //          success (res) {

        //           self.getMilestones();

        //              self.show_spinner = false;

        //              // Display a success toast, with a title
        //              pm.Toastr.success(res.data.success);

        //              self.submit_disabled = false;

        //              if (is_update) {

        //               self.showHideMilestoneForm(false, self.milestone);
        //              } else {
        //               self.showHideMilestoneForm(false);
        //              }

        //              if ( self.section === 'milestones' ) {
        //                  self.afterNewMilestone(self, res, is_update);
        //                 }

        //                 if ( self.section === 'single' ) {
        //                  //self.afterNewSingleMilestone(self, res, is_update);
        //                 }
        //          },

        //          error (res) {
        //              self.show_spinner = false;

        //              // Showing error
        //              res.data.error.map( function( value, index ) {
        //                  pm.Toastr.error(value);
        //              });
        //              self.submit_disabled = false;
        //          }
        //      }

        //      self.httpRequest(request_data);
        //  },

        afterNewMilestone() {
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
        getProgressPercent: function (list) {

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
        getProgressStyle: function (list) {
            if (typeof list == 'undefined') {
                return 0;
            }
            var width = this.getProgressPercent(list);

            return { width: width + '%' };
        },
        humanDate(milestone) {
            var due_date = milestone.achieve_date.date ? milestone.achieve_date.date : milestone.created_at.date;
            due_date = new Date(due_date), due_date = pm.Moment(due_date).format();

            return pm.Moment(due_date).fromNow(true);
        },
        momentFormat(milestone) {
            var due_date = milestone.achieve_date.date ? milestone.achieve_date.date : milestone.created_at.date;
            due_date = new Date(due_date), due_date = pm.Moment(due_date).format();

            return due_date;
        },
        getDueDate(milestone) {
            var due_date = milestone.achieve_date.date ? milestone.achieve_date.date : milestone.created_at.date;
            var due_date = this.dateFormat(due_date);

            return due_date;
        },
        templateAction() {
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
}));

/***/ }),
/* 315 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return milestones; });
//import project_lists from './index.vue';

const milestones_route = resolve => {
    __webpack_require__.e/* require.ensure */(2).then((() => {
        resolve(__webpack_require__(272));
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



/***/ }),
/* 316 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

/**
 * Make sure to call  first if using a vuex module system
 */
/* harmony default export */ __webpack_exports__["a"] = (new pm.Vuex.Store({

	state: {
		is_milestone_form_active: false,
		milestones: [],
		milestone: {},
		blank_template: false,
		milestone_template: false,
		milestone_meta: {},
		getIndex: function (itemList, id, slug) {
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
		showHideMilestoneForm(state, status) {
			if (status === 'toggle') {
				state.is_milestone_form_active = state.is_milestone_form_active ? false : true;
			} else {
				state.is_milestone_form_active = status;
			}
		},

		setMilestones(state, milestones) {
			state.milestones = milestones;
		},

		setMilestonesMeta(state, data) {
			state.milestone_meta = data;
		},

		setMilestone(state, milestone) {
			state.milestones = [];
			state.milestones.push(milestone);
		},

		afterDeleteMilestone(state, milestone_id) {
			var milestone_index = state.getIndex(state.milestones, milestone_id, 'id');
			state.milestones.splice(milestone_index, 1);
		},

		updateMilestone(state, data) {
			var milestone_index = state.getIndex(state.milestones, data.id, 'id');
			jQuery.extend(true, state.milestones[milestone_index], data);
			//state.milestones.splice(milestone_index, 1,);
		},

		newMilestone(state, milestone) {
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

		balankTemplateStatus(state, status) {
			state.blank_template = status;
		},

		milestoneTemplateStatus(state, status) {
			state.milestone_template = status;
		},

		updateMetaAfterNewDiscussion(state) {
			state.meta.total = state.meta.total + 1;
			state.meta.total_pages = Math.ceil(state.meta.total / state.meta.per_page);
		}
	}
}));

/***/ }),
/* 317 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__index_vue__ = __webpack_require__(395);


/* harmony default export */ __webpack_exports__["a"] = ({
    path: '/my-tasks',
    components: { 'my-tasks': __WEBPACK_IMPORTED_MODULE_0__index_vue__["a" /* default */] },
    name: 'my_tasks'
});

/***/ }),
/* 318 */
/***/ (function(module, exports) {


/**
 * Required jQuery methods 
 * 
 * @type Object
 */
var PM_Overview = {
	chart: function (el, binding, vnode) {
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

	getLabels: function (self) {
		var labels = [],
		    graph_data = self.$store.state.graph;

		graph_data.map(function (graph) {
			var date = PM_Overview.labelDateFormat(graph.date_time.date);
			labels.push(date);
		});

		return labels;
	},

	labelDateFormat: function (date) {
		date = new Date(date);
		return pm.Moment(date).format('MMM DD');
	},

	getActivities: function (self) {
		var activities = self.$store.state.graph;
		var set_activities = [];

		activities.map(function (activity) {
			set_activities.push(activity.activities);
		});

		return set_activities;
	},

	getTasks: function (self) {
		var tasks = self.$store.state.graph;
		var set_tasks = [];

		tasks.map(function (task) {
			set_tasks.push(task.tasks);
		});

		return set_tasks;
	}

	// Register a global custom directive called v-pm-sortable
};pm.Vue.directive('pm-overview-chart', {
	update: function (el, binding, vnode) {
		PM_Overview.chart(el, binding, vnode);
	}
});

/***/ }),
/* 319 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

/* unused harmony default export */ var _unused_webpack_default_export = (pm.Vue.mixin({
	methods: {
		getOverViews(condition) {
			var condition = condition || '';
			var self = this;

			var request = {
				url: self.base_url + '/pm/v2/projects/' + self.project_id + '?' + condition,
				success(res) {
					// res.data.map(function(discuss, index) {
					// 	self.addDiscussMeta(discuss);
					// });
					self.$store.commit('setOverViews', res.data);
					pm.NProgress.done();
					self.loading = false;
				}
			};
			self.httpRequest(request);
		}
	}
}));

/***/ }),
/* 320 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//import project_lists from './index.vue';

const overview = resolve => {
    __webpack_require__.e/* require.ensure */(9).then((() => {
        resolve(__webpack_require__(273));
    }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
};

/* harmony default export */ __webpack_exports__["a"] = ({
    path: '/:project_id/overview',
    components: {
        'pm-overview': overview
    },
    name: 'pm_overview'
});

/***/ }),
/* 321 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

/**
 * Make sure to call pm.Vue.use(Vuex) first if using a vuex module system
 */
/* harmony default export */ __webpack_exports__["a"] = (new pm.Vuex.Store({

	state: {
		meta: {},
		assignees: [],
		graph: [],
		getIndex: function (itemList, id, slug) {
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
		setOverViews(state, over_views) {
			state.meta = over_views.meta;
			state.assignees = over_views.assignees.data;
			state.graph = over_views.overview_graph.data;
		}
	}
}));

/***/ }),
/* 322 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_store__ = __webpack_require__(253);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_router__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__common_directive__ = __webpack_require__(252);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__common_directive___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__common_directive__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__common_mixin__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pm_vue__ = __webpack_require__(260);
__webpack_require__.p = PM_Vars.dir_url + 'views/assets/js/';








/**
 * Project template render
 */
var PM_Vue = {
	el: '#wedevs-pm',
	store: __WEBPACK_IMPORTED_MODULE_0__common_store__["a" /* default */],
	router: __WEBPACK_IMPORTED_MODULE_1__common_router__["a" /* default */],
	render: t => t(__WEBPACK_IMPORTED_MODULE_4__pm_vue__["a" /* default */])
};

new pm.Vue(PM_Vue);

/***/ }),
/* 323 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__index_vue__ = __webpack_require__(397);


/* harmony default export */ __webpack_exports__["a"] = ({
    path: '/progress',
    components: { 'progress': __WEBPACK_IMPORTED_MODULE_0__index_vue__["a" /* default */] },
    name: 'progress'
});

/***/ }),
/* 324 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return active; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return all; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return completed; });
//import project_lists from './lists.vue';

const project_lists = resolve => {
    __webpack_require__.e/* require.ensure */(5).then((() => {
        resolve(__webpack_require__(274));
    }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
};

const all_projects = resolve => {
    __webpack_require__.e/* require.ensure */(4).then((() => {
        resolve(__webpack_require__(275));
    }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
};

const completed_projects = resolve => {
    __webpack_require__.e/* require.ensure */(3).then((() => {
        resolve(__webpack_require__(276));
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



/***/ }),
/* 325 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__index_vue__ = __webpack_require__(399);


/* harmony default export */ __webpack_exports__["a"] = ({
    path: '/reports',
    components: { 'reports': __WEBPACK_IMPORTED_MODULE_0__index_vue__["a" /* default */] },
    name: 'reports'
});

/***/ }),
/* 326 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

/* unused harmony default export */ var _unused_webpack_default_export = (pm.Vue.mixin({
	methods: {
		saveSettings(settings, callback) {
			var settings = this.formatSettings(settings),
			    self = this;

			var request = {
				url: self.base_url + '/pm/v2/settings',
				data: {
					settings: settings
				},
				type: 'POST',
				success(res) {
					if (typeof callback !== 'undefined') {
						callback();
					}
				}
			};

			self.httpRequest(request);
		},

		formatSettings(settings) {
			var data = [];

			jQuery.each(settings, function (name, value) {
				data.push({
					key: name,
					value: value
				});
			});

			return data;
		},

		getSettings(key, pre_define) {
			var pre_define = pre_define || false,
			    settings = PM_Vars.settings;

			if (typeof PM_Vars.settings[key] === 'undefined') {
				return pre_define;
			}

			return PM_Vars.settings[key];
		}
	}
}));

/***/ }),
/* 327 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return general; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return email; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__general_vue__ = __webpack_require__(401);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__email_vue__ = __webpack_require__(400);



var general = {
    path: '/settings',
    components: { 'general': __WEBPACK_IMPORTED_MODULE_0__general_vue__["a" /* default */] },
    name: 'general'
};

var email = {
    path: '/settings/email',
    components: { 'email': __WEBPACK_IMPORTED_MODULE_1__email_vue__["a" /* default */] },
    name: 'email'
};



/***/ }),
/* 328 */
/***/ (function(module, exports) {



/***/ }),
/* 329 */
/***/ (function(module, exports) {


/**
 * Required jQuery methods 
 * 
 * @type Object
 */
var PM_Task = {
    init: function () {
        this.datepicker();
        this.sortable();
    },

    sortable: function (el, binding, vnode) {
        var $ = jQuery;
        var component = vnode.context;

        $(el).sortable({
            cancel: '.nonsortable,form',
            placeholder: "ui-state-highlight",
            update: function (event, ui) {
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

                console.log(send_data, after_revers_order);

                var data = {
                    task_orders: send_data,
                    board_id: component.list.id,
                    board_type: 'task_list'
                };

                component.taskOrder(data);
            }
        });
    },

    datepicker: function (el, binding, vnode) {
        var $ = jQuery;
        $('.pm-date-field').datepicker({
            dateFormat: 'yy-mm-dd',
            changeMonth: true,
            changeYear: true,
            yearRange: '-50:+5',
            onSelect: function (dateText) {
                vnode.context.$root.$emit('pm_date_picker', { field: 'datepicker', date: dateText });
            }
        });

        $(".pm-date-picker-from").datepicker({
            dateFormat: 'yy-mm-dd',
            changeYear: true,
            changeMonth: true,
            numberOfMonths: 1,
            onClose: function (selectedDate) {
                $(".pm-date-picker-to").datepicker("option", "minDate", selectedDate);
            },
            onSelect: function (dateText) {
                vnode.context.$root.$emit('pm_date_picker', { field: 'datepicker_from', date: dateText, self: this });
            }
        });

        $(".pm-date-picker-to").datepicker({
            dateFormat: 'yy-mm-dd',
            changeMonth: true,
            changeYear: true,
            numberOfMonths: 1,
            onClose: function (selectedDate) {
                $(".pm-date-picker-from").datepicker("option", "maxDate", selectedDate);
            },
            onSelect: function (dateText) {
                vnode.context.$root.$emit('pm_date_picker', { field: 'datepicker_to', date: dateText });
            }
        });

        $(".pm-date-time-picker-from").datetimepicker({
            dateFormat: 'yy-mm-dd',
            changeYear: true,
            changeMonth: true,
            numberOfMonths: 1,
            onClose: function (selectedDate) {
                $(".pm-date-time-picker-to").datetimepicker("option", "minDate", selectedDate);
            },
            onSelect: function (dateText) {}
        });

        $(".pm-date-time-picker-to").datetimepicker({
            dateFormat: 'yy-mm-dd',
            changeMonth: true,
            changeYear: true,
            numberOfMonths: 1,
            onClose: function (selectedDate) {
                $(".pm-date-time-picker-from").datetimepicker("option", "maxDate", selectedDate);
            },
            onSelect: function (dateText) {}
        });
    },

    disableLineBreak: function (element) {
        jQuery(element).on('keypress', function (e) {
            if (e.keyCode == 13 && !e.shiftKey) {
                e.preventDefault();
            }
        });
    }

    //Register a global custom directive called v-pm-datepicker
};pm.Vue.directive('pm-datepicker', {
    inserted: function (el, binding, vnode) {
        PM_Task.datepicker(el, binding, vnode);
    }
});

// Register a global custom directive called v-pm-sortable
pm.Vue.directive('pm-sortable', {
    inserted: function (el, binding, vnode) {
        PM_Task.sortable(el, binding, vnode);
    }
});

// Register a global custom directive called v-pm-sortable
pm.Vue.directive('pm-tiptip', {

    update: function () {
        jQuery('.pm-tiptip').tipTip();
    }
});

// Register a global custom directive called v-pm-sortable
pm.Vue.directive('prevent-line-break', {

    inserted: function (element) {
        PM_Task.disableLineBreak(element);
    }
});

/***/ }),
/* 330 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

/**
* Global jQuery action for this component
*/
window.PM_Component_jQuery = {
    /**
     * JQuery fadeIn
     * 
     * @param  int   id       
     * @param  Function callback 
     * 
     * @return void            
     */
    faceIn: function (id, callback) {
        var class_id = typeof id == 'undefined' ? false : '-' + id;

        jQuery('.pm-fade-in' + class_id).fadeOut(300, function () {
            if (typeof callback != 'undefined') {
                callback(callback);
            }
        });
    },

    /**
     * JQuery fadeOut
     * 
     * @param  int   id       
     * @param  Function callback 
     * 
     * @return void            
     */
    fadeOut: function (id, callback) {
        var class_id = typeof id == 'undefined' ? false : String('-' + id);

        jQuery('.pm-fade-out' + class_id).fadeOut(300, function () {
            if (typeof callback != 'undefined') {
                callback(callback);
            }
        });
    },

    /**
     * JQuery slideUp
     * 
     * @param  int   id       
     * @param  Function callback 
     * 
     * @return void            
     */
    slide: function (id, callback) {
        var class_id = '-' + id; //( typeof id == 'undefined' ) ? false : '-'+id;

        jQuery('.pm-slide' + class_id).slideToggle(300, function () {
            if (typeof callback != 'undefined') {
                callback(callback);
            }
        });
    }

    /**
     * Global object for all components and root
     */
};var PM_Task_Mixin = {
    data: function () {
        return {
            list_form_data: {},
            project_id: typeof this.$route === 'undefined' ? false : this.$route.params.project_id,
            task_list_form: false
        };
    },

    computed: {
        /**
         * Is current user can create task
         * 
         * @return object
         */
        canUserCreateTask: function () {
            return this.$store.state.permissions.create_todo;
        },

        task_start_field: function () {
            return this.$store.state.permissions.task_start_field;
        },

        /**
         * Check is todo-list single or not
         * 
         * @return Boolean
         */
        is_single_list: function () {
            return this.$store.state.is_single_list;
        },

        /**
         * Check is task single or not
         * 
         * @return Boolean
         */
        is_single_task: function () {
            return this.$store.state.is_single_task;
        },

        /**
         * Todo-lists view active mode
         * 
         * @return string
         */
        active_mode: function () {
            return this.$store.state.active_mode == '' ? 'list' : this.$store.state.active_mode;
        }

    },

    /**
     * Methods for global component
     */
    methods: {
        test: function () {},

        /**
         * Single task popup
         * 
         * @param  object task
         *  
         * @return void      
         */
        singleTask: function (task, list) {
            this.$store.commit('single_task_popup', { task: task });
        },

        /**
         * Handel new todo list form show and hide
         * 
         * @param  obj list       
         * @param  int list_index 
         * 
         * @return void            
         */
        showHideTodoListForm: function (list, list_index) {
            if (list.ID) {
                //this.$store.commit( 'showHideUpdatelistForm', { list: list, list_index: list_index } );
            } else {
                    //this.$store.commit( 'newTodoListForm' );
                }

            var edit_mode = list.ID ? true : false,
                self = this;

            if (edit_mode) {
                var is_edit = self.$store.state.lists[list_index].edit_mode;

                if (is_edit) {
                    PM_Component_jQuery.slide(list.ID, function () {
                        self.$store.commit('showHideUpdatelistForm', { list: list, list_index: list_index });
                    });
                } else {
                    self.$store.commit('showHideUpdatelistForm', { list: list, list_index: list_index });

                    pm.Vue.nextTick(function () {

                        PM_Component_jQuery.slide(list.ID);
                    });
                }
            } else {
                var is_edit = self.$store.state.show_list_form;

                if (is_edit) {
                    PM_Component_jQuery.slide('list', function () {
                        self.$store.commit('newTodoListForm');
                    });
                } else {
                    self.$store.commit('newTodoListForm');

                    pm.Vue.nextTick(function () {

                        PM_Component_jQuery.slide('list');
                    });
                }
            }
        },

        /**
         * Handel new todo or task form show and hide
         * 
         * @param  int list_index 
         * @param  int task_index 
         * 
         * @return void            
         */
        showHideTaskForm: function (list_index, task_index) {

            if (typeof task_index == 'undefined' || task_index === false) {

                var edit_mode = this.$store.state.lists[list_index].show_task_form,
                    list_id = this.$store.state.lists[list_index].ID,
                    self = this;

                if (edit_mode) {

                    PM_Component_jQuery.slide('undefined', function () {
                        self.$store.commit('showHideTaskForm', { list_index: list_index, task_index: false });
                    });
                } else {
                    self.$store.commit('showHideTaskForm', { list_index: list_index, task_index: false });

                    pm.Vue.nextTick(function () {
                        PM_Component_jQuery.slide('undefined');
                    });
                }
            } else {
                var edit_mode = this.$store.state.lists[list_index].tasks[task_index].edit_mode,
                    list_id = this.$store.state.lists[list_index].ID,
                    task_id = this.$store.state.lists[list_index].tasks[task_index].ID,
                    self = this;

                if (edit_mode) {

                    PM_Component_jQuery.slide(task_id, function () {
                        self.$store.commit('showHideTaskForm', { list_index: list_index, task_index: task_index });
                    });
                } else {
                    self.$store.commit('showHideTaskForm', { list_index: list_index, task_index: task_index });

                    pm.Vue.nextTick(function () {

                        PM_Component_jQuery.slide(task_id);
                    });
                }
            }
        },

        /**
         * WP settings date format convert to moment date format with time zone
         * 
         * @param  string date 
         * 
         * @return string      
         */
        dateFormat: function (date) {
            if (!date) {
                return;
            }

            pm.Moment.tz.add(PM_Vars.time_zones);
            pm.Moment.tz.link(PM_Vars.time_links);

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

            return pm.Moment.tz(date, PM_Vars.wp_time_zone).format(format);
        },

        /**
         * WP settings date format convert to moment date format with time zone
         * 
         * @param  string date 
         * 
         * @return string      
         */
        shortDateFormat: function (date) {
            if (date == '') {
                return;
            }

            pm.Moment.tz.add(PM_Vars.time_zones);
            pm.Moment.tz.link(PM_Vars.time_links);

            var format = 'MMM DD';

            return pm.Moment.tz(date, PM_Vars.wp_time_zone).format(String(format));
        },

        /**
         * WP settings date time format convert to moment date format with time zone
         * 
         * @param  string date 
         * 
         * @return string      
         */
        dateTimeFormat: function (date) {
            if (date == '') {
                return;
            }

            pm.Moment.tz.add(PM_Vars.time_zones);
            pm.Moment.tz.link(PM_Vars.time_links);

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

            return pm.Moment.tz(date, PM_Vars.wp_time_zone).format(format);
        },

        /**
         * Get index from array object element
         * 
         * @param   array 
         * @param   id    
         * 
         * @return  int      
         */
        getIndex: function (array, id, slug) {
            var target = false;

            array.map(function (content, index) {
                if (content[slug] == id) {
                    target = index;
                }
            });

            return target;
        },

        /**
         * ISO_8601 Date format convert to moment date format
         * 
         * @param  string date 
         * 
         * @return string      
         */
        dateISO8601Format: function (date) {
            return pm.Moment(date).format();
        },

        /**
         * Show hide todo-list edit form
         * 
         * @param  int comment_id 
         * 
         * @return void            
         */
        showHideTaskCommentEditForm: function (task, comment_id) {
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
        get_porject_users_by_role: function (role) {
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
        get_porject_users_id_by_role: function (role) {
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
        getUsers: function (assigned_user) {
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
        taskDateWrap: function (due_date) {
            if (!due_date) {
                return false;
            }

            due_date = new Date(due_date);
            due_date = pm.Moment(due_date).format('YYYY-MM-DD');

            if (!pm.Moment(due_date).isValid()) {
                return false;
            }

            pm.Moment.tz.add(PM_Vars.time_zones);
            pm.Moment.tz.link(PM_Vars.time_links);

            var today = pm.Moment.tz(PM_Vars.wp_time_zone).format('YYYY-MM-DD'),
                due_day = pm.Moment.tz(due_date, PM_Vars.wp_time_zone).format('YYYY-MM-DD');

            return pm.Moment(today).isSameOrBefore(due_day) ? 'pm-current-date' : 'pm-due-date';
        },

        completedTaskWrap(due_date) {
            if (!due_date) {
                return false;
            }

            due_date = new Date(due_date);
            due_date = pm.Moment(due_date).format('YYYY-MM-DD');

            if (!pm.Moment(due_date).isValid()) {
                return false;
            }

            pm.Moment.tz.add(PM_Vars.time_zones);
            pm.Moment.tz.link(PM_Vars.time_links);

            var today = pm.Moment.tz(PM_Vars.wp_time_zone).format('YYYY-MM-DD'),
                due_day = pm.Moment.tz(due_date, PM_Vars.wp_time_zone).format('YYYY-MM-DD');

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
        isBetweenDate: function (task_start_field, start_date, due_date) {
            if (task_start_field && !start_date && !due_date) {
                return true;
            }

            return false;
        },

        /**
         * Get initial data for todo-list page
         * 
         * @param  int project_id 
         * 
         * @return void            
         */
        getInitialData: function (project_id, callback) {

            var self = this,
                data = {
                project_id: project_id,
                current_page: this.$route.params.page_number,
                _wpnonce: PM_Vars.nonce,
                action: 'pm_initial_todo_list'
            };

            jQuery.post(PM_Vars.ajaxurl, data, function (res) {
                if (res.success) {
                    self.$store.commit('setTaskInitData', res);
                    if (typeof callback != 'undefined') {
                        callback(true);
                    }
                } else {
                    if (typeof callback != 'undefined') {
                        callback(false);
                    }
                }
            });
        },

        /**
         * Refresh todo-list page
         * 
         * @return void
         */
        refreshTodoListPage: function () {
            // Redirect to first page
            this.$router.push('/');

            // Condition because $route is watch in PM_Router_Init component
            // When watch is not active then its execute 
            if (!this.$route.params.page_number) {
                this.getInitialData(this.$store.state.project_id);
            }
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
        taskDoneUndone: function (task, is_checked, list) {
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
                success(res) {
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

        isEmptyObject: function (obj) {
            return Object.keys(obj).length === 0;
        },

        getTasks: function (list_id, condition, callback) {
            var self = this;
            var condition = self.generateListsCondition(condition);

            var request = {
                url: self.base_url + '/pm/v2/projects/' + self.project_id + '/task-lists/' + list_id + '?' + condition,
                success(res) {
                    // res.data.map(function(task){
                    //     self.addTaskMeta(task);
                    // });

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

                    self.$store.commit('setTasks', res.data);

                    if (typeof callback != 'undefined') {
                        callback(res);
                    }
                }
            };

            this.httpRequest(request);
        },

        addTaskMeta(task) {
            task.edit_mode = false;
        },

        /**
         * Count completed tasks
         * 
         * @param  array tasks 
         * 
         * @return int      
         */
        countCompletedTasks: function (list) {

            return list.count_completed_tasks;
        },

        /**
         * Count incompleted tasks
         * 
         * @param  array tasks
         *  
         * @return int       
         */
        countIncompletedTasks: function (tasks) {
            if (!tasks) {
                return 0;
            }

            var in_completed_task = 0;

            tasks.filter(function (task) {
                if (task.completed === 0 || !task.completed) {
                    in_completed_task++;
                }
            });

            return in_completed_task;
        },

        /**
         * Get task completed percentage from todo list
         * 
         * @param  array tasks
         *  
         * @return float       
         */
        getProgressPercent: function (list) {

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
        getProgressStyle: function (list) {
            if (typeof list == 'undefined') {
                return 0;
            }
            var width = this.getProgressPercent(list);

            return { width: width + '%' };
        },

        /**
         * Delete list
         * 
         * @param  int list_id 
         * 
         * @return void         
         */
        deleteList: function (list_id) {
            if (!confirm(this.text.are_you_sure)) {
                return;
            }
            var self = this;
            var request_data = {
                url: self.base_url + '/pm/v2/projects/' + self.project_id + '/task-lists/' + list_id,
                type: 'DELETE',
                success: function (res) {
                    self.$store.commit('afterDeleteList', list_id);

                    if (!self.$store.state.lists.length) {
                        self.$router.push({
                            name: 'task_lists',
                            params: {
                                project_id: self.project_id
                            }
                        });
                    } else {
                        self.getLists(self);
                    }
                }
            };

            self.httpRequest(request_data);
        },

        privateClass: function (list) {
            return list.private == 'on' ? 'pm-lock' : '';
        },

        updateActiveMode(mode) {
            var self = this,
                form_data = {
                project_id: PM_Vars.project_id,
                mode: mode,
                _wpnonce: PM_Vars.nonce
            };

            wp.ajax.send('pm_update_active_mode', {
                data: form_data,
                success: function (res) {},
                error: function (res) {}
            });
        },

        /**
         * Show task edit form
         * 
         * @param  int task_index 
         * 
         * @return void            
         */
        showHideTaskFrom: function (status, list, task) {
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

        showHideListForm(status, list) {
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

        getLists(condition, callback) {
            var self = this,
                condition = self.generateListsCondition(condition);

            var request = {
                url: self.base_url + '/pm/v2/projects/' + self.project_id + '/task-lists?' + condition,

                success(res) {
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

                    if (typeof callback !== 'undefined') {
                        callback(res.data);
                    }
                }
            };
            self.httpRequest(request);
        },

        getList(self, list_id, condition, callback) {
            var condition = condition || 'incomplete_tasks';

            var request = {
                url: self.base_url + '/pm/v2/projects/' + self.project_id + '/task-lists/' + list_id + '?with=' + condition,
                success(res) {
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

                    self.$store.commit('setList', res.data);

                    if (callback) {
                        callback(res);
                    }

                    pm.NProgress.done();
                }
            };
            self.httpRequest(request);
        },

        addMetaList(list) {
            list.edit_mode = false;
            list.show_task_form = false;
            list.task_loading_status = false;
        },

        setCurrentPageNumber() {
            var current_page_number = this.$route.params.current_page_number ? this.$route.params.current_page_number : 1;
            this.current_page_number = current_page_number;

            return current_page_number;
        },

        addListCommentMeta(comment) {
            comment.edit_mode = false;
        },
        showHideListCommentEditForm(comment) {
            comment.edit_mode = comment.edit_mode ? false : true;
        },

        deleteTask(task, list) {
            if (!confirm('Are you sure!')) {
                return;
            }
            var self = this;
            var request_data = {
                url: self.base_url + '/pm/v2/projects/' + self.project_id + '/tasks/' + task.id,
                type: 'DELETE',
                success(res) {
                    self.$store.commit('afterDeleteTask', {
                        'task': task,
                        'list': list
                    });
                }
            };

            this.httpRequest(request_data);
        },

        /**
         * Insert and edit task
         * 
         * @return void
         */
        newTask() {
            // Exit from this function, If submit button disabled 
            if (this.submit_disabled) {
                return;
            }

            // Disable submit button for preventing multiple click
            this.submit_disabled = true;

            var self = this,
                is_update = typeof this.task.id == 'undefined' ? false : true,
                form_data = {
                board_id: this.list.id,
                assignees: this.assigned_to,
                title: this.task.title,
                description: this.task.description,
                start_at: this.task.start_at.date,
                due_date: this.task.due_date.date,
                task_privacy: this.task.task_privacy,
                list_id: this.list.id,
                order: this.task.order
            };

            // Showing loading option 
            this.show_spinner = true;

            if (is_update) {
                var url = self.base_url + '/pm/v2/projects/' + self.project_id + '/tasks/' + this.task.id;
                var type = 'PUT';
            } else {
                var url = self.base_url + '/pm/v2/projects/' + self.project_id + '/tasks';
                var type = 'POST';
            }

            var request_data = {
                url: url,
                type: type,
                data: form_data,
                success(res) {
                    self.addTaskMeta(res.data);

                    if (is_update) {
                        self.$store.commit('afterUpdateTask', {
                            list_id: self.list.id,
                            task: res.data
                        });
                    } else {
                        self.$store.commit('afterNewTask', {
                            list_id: self.list.id,
                            task: res.data
                        });
                    }

                    self.show_spinner = false;

                    // Display a success toast, with a title
                    pm.Toastr.success(res.data.success);

                    self.submit_disabled = false;
                    self.showHideTaskFrom(false, self.list, self.task);
                },

                error(res) {
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

        generateListsCondition(conditions) {
            var query = '';

            if (jQuery.isEmptyObject(conditions)) {
                return '';
            }

            jQuery.each(conditions, function (condition, key) {
                query = query + condition + '=' + key + '&';
            });

            return query.slice(0, -1);
        },

        taskOrder(data, callback) {

            var self = this;

            var request_data = {
                url: self.base_url + '/pm/v2/projects/1/tasks/reorder',
                type: 'PUT',
                data: data,

                success(res) {
                    // Display a success toast, with a title
                    //pm.Toastr.success(res.data.success);

                    if (typeof callback !== 'undefined') {
                        callback(res);
                    }
                },

                error(res) {

                    // Showing error
                    res.data.error.map(function (value, index) {
                        pm.Toastr.error(value);
                    });
                }
            };

            self.httpRequest(request_data);
        },

        isIncompleteLoadMoreActive(list) {
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

        loadMoreIncompleteTasks(list) {

            if (list.task_loading_status) {
                return;
            }

            list.task_loading_status = true;

            var total_tasks = list.meta.total_incomplete_tasks;
            var per_page = this.getSettings('incomplete_tasks_per_page', 10);
            var current_page = Math.ceil(list.incomplete_tasks.data.length / per_page);

            var condition = {
                with: 'incomplete_tasks',
                incomplete_task_page: current_page + 1
            };

            var self = this;

            this.getTasks(list.id, condition, function (res) {
                list.task_loading_status = false;
            });
        },

        isCompleteLoadMoreActive(list) {
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

        loadMoreCompleteTasks(list) {

            if (list.task_loading_status) {
                return;
            }

            list.task_loading_status = true;

            var total_tasks = list.meta.total_complete_tasks;
            var per_page = this.getSettings('complete_tasks_per_page', 10);
            var current_page = Math.ceil(list.complete_tasks.data.length / per_page);

            var condition = {
                with: 'complete_tasks',
                complete_task_page: current_page + 1
            };

            var self = this;

            this.getTasks(list.id, condition, function (res) {
                list.task_loading_status = false;
            });
        },
        listTemplateAction() {
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

/* unused harmony default export */ var _unused_webpack_default_export = (pm.Vue.mixin(PM_Task_Mixin));

/***/ }),
/* 331 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return task_lists; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return single_list; });
const task_lists_route = resolve => {
    __webpack_require__.e/* require.ensure */(1).then((() => {
        resolve(__webpack_require__(277));
    }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
};

const single_list_route = resolve => {
    __webpack_require__.e/* require.ensure */(0).then((() => {
        resolve(__webpack_require__(278));
    }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
};

const single_task_route = resolve => {
    __webpack_require__.e/* require.ensure */(8).then((() => {
        resolve(__webpack_require__(279));
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
        path: '/:project_id/:list_id/task/:task_id',
        components: {
            'single-task': single_task_route
        },
        name: 'single_task'
    }]
};



/***/ }),
/* 332 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

/**
 * Make sure to call pm.Vue.use(Vuex) first if using a vuex module system
 */
/* harmony default export */ __webpack_exports__["a"] = (new pm.Vuex.Store({
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
        getIndex: function (itemList, id, slug) {
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
        setTaskInitData: function (state, task_init) {
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

        loadingEffect: function (state, loading_status) {
            state.loading = loading_status;
        },

        /**
         * New todo list form showing or hiding
         * 
         * @param  object state 
         * 
         * @return void       
         */
        newTodoListForm: function (state) {
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
        showHideUpdatelistForm: function (state, list) {
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
        showHideTaskForm: function (state, index) {

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
        update_todo_list: function (state, res) {

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
        afterUpdateTask: function (state, data) {
            var list_index = state.getIndex(state.lists, data.list_id, 'id');

            if (data.task.status === 'incomplete') {
                var task_index = state.getIndex(state.lists[list_index].incomplete_tasks.data, data.task.id, 'id');

                state.lists[list_index].incomplete_tasks.data.splice(task_index, 1, data.task);
            }
        },

        afterNewTask(state, data) {
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
        update_todo_list_single: function (state, data) {

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
        afterTaskDoneUndone: function (state, data) {
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
        listNewComment: function (state, data) {
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
        listUpdateComment: function (state, data) {
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
        after_delete_comment: function (state, data) {
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
        after_delete_task_comment: function (state, data) {
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
        showHideListCommentEditForm: function (state, data) {

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
        showHideTaskCommentEditForm: function (state, data) {
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
        single_task_popup: function (state) {
            state.task = task.task;
        },

        /**
         * Make empty store task and make false is_single_task
         * 
         * @param  object state 
         * 
         * @return void       
         */
        close_single_task_popup: function (state) {
            state.is_single_task = false;
            //state.task = {};
        },

        update_task_comment: function (state, comment) {
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
        after_delete_todo_list: function (state, list) {
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
        afterDeleteTask: function (state, data) {
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
        insert_tasks: function (state, task) {

            task.tasks.tasks.forEach(function (task_obj) {
                state.lists[task.list_index].tasks.push(task_obj);
            });
            //state.lists[task.list_index].tasks = task.tasks.tasks;
        },

        emptyTodoLists: function (state) {
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
        change_active_mode: function (state, mode) {
            state.active_mode = mode.mode;
        },

        add_inline_task_users: function (state, users) {
            state.inline_task_users = users.users;
        },

        add_inline_task_start_date: function (state, date) {
            state.inline_task_start_date = date.date;
        },

        add_inline_task_end_date: function (state, date) {
            state.inline_task_end_date = date.date;
        },

        add_inline_task_description: function (state, description) {
            state.inline_task_description = description.description;
        },

        add_inline_todo_list_id: function (state, list) {
            state.inline_todo_list_id = list.list_id;
        },

        inline_display: function (state, inline_display) {
            state.inline_display = inline_display;
        },

        loading_effect: function (state, effect) {
            state.loading = effect.mode;
        },

        afterUpdateTaskElement: function (state, task) {
            jQuery.extend(true, state.lists[task.list_index].tasks[task.task_index], task.task);
            state.lists[task.list_index].tasks[task.task_index].assigned_to = task.task.assigned_to;
        },

        setLists(state, lists) {
            state.lists = lists;
        },
        setList(state, list) {
            state.lists = [list];
        },

        afterNewList(state, list) {
            var per_page = state.lists_meta.per_page,
                length = state.lists.length;

            if (per_page <= length) {
                state.lists.splice(0, 0, list);
                state.lists.pop();
            } else {
                state.lists.splice(0, 0, list);
            }
        },
        afterUpdateList(state, list) {
            var list_index = state.getIndex(state.lists, list.id, 'id');
            var merge_list = jQuery.extend(true, state.lists[list_index], list);
            state.lists.splice(list_index, 1, merge_list);
        },
        afterNewListupdateListsMeta(state) {
            state.lists_meta.total = state.lists_meta.total + 1;
            state.lists_meta.total_pages = Math.ceil(state.lists_meta.total / state.lists_meta.per_page);
        },
        afterDeleteList(state, list_id) {
            var list_index = state.getIndex(state.lists, list_id, 'id');
            state.lists.splice(list_index, 1);
        },

        setListComments(state, comments) {
            state.list_comments = comments;
        },

        setListForSingleListPage(state, list) {
            state.list = list;
        },

        setMilestones(state, milestones) {
            state.milestones = milestones;
        },

        showHideListFormStatus(state, status) {
            if (status === 'toggle') {
                state.is_active_list_form = state.is_active_list_form ? false : true;
            } else {
                state.is_active_list_form = status;
            }
        },

        setTotalListPage(state, total) {
            state.total_list_page = total;
        },

        setListsMeta(state, meta) {
            state.lists_meta = meta;
        },
        setSingleTask(state, data) {
            state.task = data;
        },
        setTasks(state, data) {
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

        updateTaskEditMode(state, data) {
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
        balankTemplateStatus(state, status) {
            state.balankTemplateStatus = status;
        },
        listTemplateStatus(state, status) {
            state.listTemplateStatus = status;
        }
    }
}));

/***/ }),
/* 333 */,
/* 334 */,
/* 335 */,
/* 336 */,
/* 337 */,
/* 338 */,
/* 339 */,
/* 340 */,
/* 341 */,
/* 342 */,
/* 343 */,
/* 344 */,
/* 345 */,
/* 346 */,
/* 347 */,
/* 348 */,
/* 349 */,
/* 350 */,
/* 351 */,
/* 352 */,
/* 353 */,
/* 354 */,
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
/* 369 */,
/* 370 */,
/* 371 */,
/* 372 */,
/* 373 */,
/* 374 */,
/* 375 */,
/* 376 */,
/* 377 */,
/* 378 */,
/* 379 */,
/* 380 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(265)(undefined);
// imports


// module
exports.push([module.i, "\n#nprogress .bar {\n\tz-index: 99999;\n}\n\n", ""]);

// exports


/***/ }),
/* 381 */,
/* 382 */,
/* 383 */,
/* 384 */,
/* 385 */,
/* 386 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_index_vue__ = __webpack_require__(280);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_4ce68036_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_index_vue__ = __webpack_require__(412);
var disposed = false
var normalizeComponent = __webpack_require__(4)
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
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_4ce68036_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_index_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/activities/index.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-4ce68036", Component.options)
  } else {
    hotAPI.reload("data-v-4ce68036", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 387 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_index_vue__ = __webpack_require__(281);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_180f5496_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_index_vue__ = __webpack_require__(409);
var disposed = false
var normalizeComponent = __webpack_require__(4)
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
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_180f5496_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_index_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/add-ons/index.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-180f5496", Component.options)
  } else {
    hotAPI.reload("data-v-180f5496", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 388 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_index_vue__ = __webpack_require__(282);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_deccdc72_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_index_vue__ = __webpack_require__(421);
var disposed = false
var normalizeComponent = __webpack_require__(4)
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
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_deccdc72_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_index_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/calendar/index.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-deccdc72", Component.options)
  } else {
    hotAPI.reload("data-v-deccdc72", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 389 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_categories_vue__ = __webpack_require__(283);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_12f15e59_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_categories_vue__ = __webpack_require__(407);
var disposed = false
var normalizeComponent = __webpack_require__(4)
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
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_12f15e59_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_categories_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/categories/categories.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-12f15e59", Component.options)
  } else {
    hotAPI.reload("data-v-12f15e59", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 390 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_edit_category_form_vue__ = __webpack_require__(284);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0bd21eed_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_edit_category_form_vue__ = __webpack_require__(405);
var disposed = false
var normalizeComponent = __webpack_require__(4)
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
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0bd21eed_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_edit_category_form_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/categories/edit-category-form.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0bd21eed", Component.options)
  } else {
    hotAPI.reload("data-v-0bd21eed", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 391 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_index_vue__ = __webpack_require__(285);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_5e0adba5_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_index_vue__ = __webpack_require__(416);
var disposed = false
var normalizeComponent = __webpack_require__(4)
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
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_5e0adba5_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_index_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/categories/index.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-5e0adba5", Component.options)
  } else {
    hotAPI.reload("data-v-5e0adba5", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 392 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_index_vue__ = __webpack_require__(287);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_53234210_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_index_vue__ = __webpack_require__(414);
var disposed = false
var normalizeComponent = __webpack_require__(4)
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
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_53234210_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_index_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/discussions/index.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-53234210", Component.options)
  } else {
    hotAPI.reload("data-v-53234210", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 393 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_index_vue__ = __webpack_require__(288);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0d2feaa4_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_index_vue__ = __webpack_require__(406);
var disposed = false
var normalizeComponent = __webpack_require__(4)
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
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0d2feaa4_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_index_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/files/index.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0d2feaa4", Component.options)
  } else {
    hotAPI.reload("data-v-0d2feaa4", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 394 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_index_vue__ = __webpack_require__(289);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0a3675cc_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_index_vue__ = __webpack_require__(404);
var disposed = false
var normalizeComponent = __webpack_require__(4)
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
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0a3675cc_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_index_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/milestones/index.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0a3675cc", Component.options)
  } else {
    hotAPI.reload("data-v-0a3675cc", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 395 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_index_vue__ = __webpack_require__(290);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_1b23b814_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_index_vue__ = __webpack_require__(410);
var disposed = false
var normalizeComponent = __webpack_require__(4)
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
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_1b23b814_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_index_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/my-tasks/index.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-1b23b814", Component.options)
  } else {
    hotAPI.reload("data-v-1b23b814", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 396 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_index_vue__ = __webpack_require__(291);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_ed7b937c_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_index_vue__ = __webpack_require__(423);
var disposed = false
var normalizeComponent = __webpack_require__(4)
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
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_ed7b937c_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_index_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/overview/index.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-ed7b937c", Component.options)
  } else {
    hotAPI.reload("data-v-ed7b937c", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 397 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_index_vue__ = __webpack_require__(293);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_55da8c14_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_index_vue__ = __webpack_require__(415);
var disposed = false
var normalizeComponent = __webpack_require__(4)
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
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_55da8c14_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_index_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/progress/index.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-55da8c14", Component.options)
  } else {
    hotAPI.reload("data-v-55da8c14", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 398 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_template_compiler_index_id_data_v_d5e557fa_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_index_vue__ = __webpack_require__(420);
var disposed = false
var normalizeComponent = __webpack_require__(4)
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
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_template_compiler_index_id_data_v_d5e557fa_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_index_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/projects/index.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-d5e557fa", Component.options)
  } else {
    hotAPI.reload("data-v-d5e557fa", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 399 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_index_vue__ = __webpack_require__(294);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_c8084928_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_index_vue__ = __webpack_require__(418);
var disposed = false
var normalizeComponent = __webpack_require__(4)
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
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_c8084928_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_index_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/reports/index.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-c8084928", Component.options)
  } else {
    hotAPI.reload("data-v-c8084928", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 400 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_email_vue__ = __webpack_require__(295);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_73b43394_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_email_vue__ = __webpack_require__(417);
var disposed = false
var normalizeComponent = __webpack_require__(4)
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
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_73b43394_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_email_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/settings/email.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-73b43394", Component.options)
  } else {
    hotAPI.reload("data-v-73b43394", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 401 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_general_vue__ = __webpack_require__(296);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_5110b5fc_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_general_vue__ = __webpack_require__(413);
var disposed = false
var normalizeComponent = __webpack_require__(4)
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
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_5110b5fc_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_general_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/settings/general.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-5110b5fc", Component.options)
  } else {
    hotAPI.reload("data-v-5110b5fc", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 402 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_index_vue__ = __webpack_require__(297);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_17a1386c_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_index_vue__ = __webpack_require__(408);
var disposed = false
var normalizeComponent = __webpack_require__(4)
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
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_17a1386c_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_index_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/settings/index.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-17a1386c", Component.options)
  } else {
    hotAPI.reload("data-v-17a1386c", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 403 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_index_vue__ = __webpack_require__(298);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_eb607cd4_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_index_vue__ = __webpack_require__(422);
var disposed = false
var normalizeComponent = __webpack_require__(4)
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
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_eb607cd4_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_index_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/task-lists/index.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-eb607cd4", Component.options)
  } else {
    hotAPI.reload("data-v-eb607cd4", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 404 */
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
    require("vue-hot-reload-api")      .rerender("data-v-0a3675cc", esExports)
  }
}

/***/ }),
/* 405 */
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
    require("vue-hot-reload-api")      .rerender("data-v-0bd21eed", esExports)
  }
}

/***/ }),
/* 406 */
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
    require("vue-hot-reload-api")      .rerender("data-v-0d2feaa4", esExports)
  }
}

/***/ }),
/* 407 */
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
                    _vm.newCategory()
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
    require("vue-hot-reload-api")      .rerender("data-v-12f15e59", esExports)
  }
}

/***/ }),
/* 408 */
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
    require("vue-hot-reload-api")      .rerender("data-v-17a1386c", esExports)
  }
}

/***/ }),
/* 409 */
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
    require("vue-hot-reload-api")      .rerender("data-v-180f5496", esExports)
  }
}

/***/ }),
/* 410 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("p", [_vm._v("Hi i am my tasks")])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-1b23b814", esExports)
  }
}

/***/ }),
/* 411 */
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
        [_vm._v("\n\t\t" + _vm._s(_vm.text.general_settings) + "\n\t")]
      ),
      _vm._v(" "),
      _c(
        "router-link",
        { staticClass: "nav-tab", attrs: { to: { name: "email" } } },
        [_vm._v("\n\t\t" + _vm._s(_vm.text.email_settings) + "\n\t")]
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
    require("vue-hot-reload-api")      .rerender("data-v-287c30e3", esExports)
  }
}

/***/ }),
/* 412 */
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
    require("vue-hot-reload-api")      .rerender("data-v-4ce68036", esExports)
  }
}

/***/ }),
/* 413 */
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
    require("vue-hot-reload-api")      .rerender("data-v-5110b5fc", esExports)
  }
}

/***/ }),
/* 414 */
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
    require("vue-hot-reload-api")      .rerender("data-v-53234210", esExports)
  }
}

/***/ }),
/* 415 */
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
    require("vue-hot-reload-api")      .rerender("data-v-55da8c14", esExports)
  }
}

/***/ }),
/* 416 */
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
    require("vue-hot-reload-api")      .rerender("data-v-5e0adba5", esExports)
  }
}

/***/ }),
/* 417 */
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
                                "\n\t\t\t\t\t\t\t\t\t"
                            )
                          ]
                        ),
                        _vm._v(" "),
                        _c("br"),
                        _vm._v(" "),
                        _c("p", { staticClass: "description" }, [
                          _vm._v(
                            _vm._s(_vm.text.link_to_backend_des) +
                              "\n\t\t\t\t\t\t\t\t\t"
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
                              "\n\t\t\t\t\t\t\t\t\t\t" +
                                _vm._s(_vm.text.enable_bcc) +
                                "\n\t\t\t\t\t\t\t\t\t"
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
    require("vue-hot-reload-api")      .rerender("data-v-73b43394", esExports)
  }
}

/***/ }),
/* 418 */
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
    require("vue-hot-reload-api")      .rerender("data-v-c8084928", esExports)
  }
}

/***/ }),
/* 419 */
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
      _c("router-view", { attrs: { name: "add-ons" } }),
      _vm._v(" "),
      _c("router-view", { attrs: { name: "my-tasks" } }),
      _vm._v(" "),
      _c("router-view", { attrs: { name: "calendar" } }),
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
    require("vue-hot-reload-api")      .rerender("data-v-ca61d7fa", esExports)
  }
}

/***/ }),
/* 420 */
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
    require("vue-hot-reload-api")      .rerender("data-v-d5e557fa", esExports)
  }
}

/***/ }),
/* 421 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("p", [_vm._v("Hi i am calendar")])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-deccdc72", esExports)
  }
}

/***/ }),
/* 422 */
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
    require("vue-hot-reload-api")      .rerender("data-v-eb607cd4", esExports)
  }
}

/***/ }),
/* 423 */
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
    require("vue-hot-reload-api")      .rerender("data-v-ed7b937c", esExports)
  }
}

/***/ }),
/* 424 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(380);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(266)("51d05cee", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-ca61d7fa\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./pm.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-ca61d7fa\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./pm.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 425 */
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