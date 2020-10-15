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
/******/ 	return __webpack_require__(__webpack_require__.s = 812);
/******/ })
/************************************************************************/
/******/ ({

/***/ 242:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export addAction */
/* unused harmony export addFilter */
/* unused harmony export removeAction */
/* unused harmony export removeFilter */
/* unused harmony export hasAction */
/* unused harmony export hasFilter */
/* unused harmony export removeAllActions */
/* unused harmony export removeAllFilters */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return doAction; });
/* unused harmony export applyFilters */
/* unused harmony export currentAction */
/* unused harmony export currentFilter */
/* unused harmony export doingAction */
/* unused harmony export doingFilter */
/* unused harmony export didAction */
/* unused harmony export didFilter */
/* unused harmony export actions */
/* unused harmony export filters */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__createHooks__ = __webpack_require__(813);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__createHooks__["a"]; });


var _createHooks = Object(__WEBPACK_IMPORTED_MODULE_0__createHooks__["a" /* default */])(),
    addAction = _createHooks.addAction,
    addFilter = _createHooks.addFilter,
    removeAction = _createHooks.removeAction,
    removeFilter = _createHooks.removeFilter,
    hasAction = _createHooks.hasAction,
    hasFilter = _createHooks.hasFilter,
    removeAllActions = _createHooks.removeAllActions,
    removeAllFilters = _createHooks.removeAllFilters,
    doAction = _createHooks.doAction,
    applyFilters = _createHooks.applyFilters,
    currentAction = _createHooks.currentAction,
    currentFilter = _createHooks.currentFilter,
    doingAction = _createHooks.doingAction,
    doingFilter = _createHooks.doingFilter,
    didAction = _createHooks.didAction,
    didFilter = _createHooks.didFilter,
    actions = _createHooks.actions,
    filters = _createHooks.filters;


//# sourceMappingURL=index.js.map

/***/ }),

/***/ 243:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Validate a hookName string.
 *
 * @param  {string} hookName The hook name to validate. Should be a non empty string containing
 *                           only numbers, letters, dashes, periods and underscores. Also,
 *                           the hook name cannot begin with `__`.
 *
 * @return {boolean}            Whether the hook name is valid.
 */
function validateHookName(hookName) {
  if ('string' !== typeof hookName || '' === hookName) {
    // eslint-disable-next-line no-console
    console.error('The hook name must be a non-empty string.');
    return false;
  }

  if (/^__/.test(hookName)) {
    // eslint-disable-next-line no-console
    console.error('The hook name cannot begin with `__`.');
    return false;
  }

  if (!/^[a-zA-Z][a-zA-Z0-9_.-]*$/.test(hookName)) {
    // eslint-disable-next-line no-console
    console.error('The hook name can only contain numbers, letters, dashes, periods and underscores.');
    return false;
  }

  return true;
}

/* harmony default export */ __webpack_exports__["a"] = (validateHookName);
//# sourceMappingURL=validateHookName.js.map

/***/ }),

/***/ 373:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Validate a namespace string.
 *
 * @param  {string} namespace The namespace to validate - should take the form
 *                            `vendor/plugin/function`.
 *
 * @return {boolean}             Whether the namespace is valid.
 */
function validateNamespace(namespace) {
  if ('string' !== typeof namespace || '' === namespace) {
    // eslint-disable-next-line no-console
    console.error('The namespace must be a non-empty string.');
    return false;
  }

  if (!/^[a-zA-Z][a-zA-Z0-9_.\-\/]*$/.test(namespace)) {
    // eslint-disable-next-line no-console
    console.error('The namespace can only contain numbers, letters, dashes, periods, underscores and slashes.');
    return false;
  }

  return true;
}

/* harmony default export */ __webpack_exports__["a"] = (validateNamespace);
//# sourceMappingURL=validateNamespace.js.map

/***/ }),

/***/ 812:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__wordpress_hooks__ = __webpack_require__(242);
 //Remove this file from grunt. But it will store in github

window.wedevsPMWPHook = Object(__WEBPACK_IMPORTED_MODULE_0__wordpress_hooks__["a" /* createHooks */])();


/***/ }),

/***/ 813:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__createAddHook__ = __webpack_require__(814);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__createRemoveHook__ = __webpack_require__(815);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__createHasHook__ = __webpack_require__(816);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__createRunHook__ = __webpack_require__(817);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__createCurrentHook__ = __webpack_require__(818);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__createDoingHook__ = __webpack_require__(819);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__createDidHook__ = __webpack_require__(820);







/**
 * Returns an instance of the hooks object.
 *
 * @return {Object} Object that contains all hooks.
 */

function createHooks() {
  var actions = Object.create(null);
  var filters = Object.create(null);
  actions.__current = [];
  filters.__current = [];
  return {
    addAction: Object(__WEBPACK_IMPORTED_MODULE_0__createAddHook__["a" /* default */])(actions),
    addFilter: Object(__WEBPACK_IMPORTED_MODULE_0__createAddHook__["a" /* default */])(filters),
    removeAction: Object(__WEBPACK_IMPORTED_MODULE_1__createRemoveHook__["a" /* default */])(actions),
    removeFilter: Object(__WEBPACK_IMPORTED_MODULE_1__createRemoveHook__["a" /* default */])(filters),
    hasAction: Object(__WEBPACK_IMPORTED_MODULE_2__createHasHook__["a" /* default */])(actions),
    hasFilter: Object(__WEBPACK_IMPORTED_MODULE_2__createHasHook__["a" /* default */])(filters),
    removeAllActions: Object(__WEBPACK_IMPORTED_MODULE_1__createRemoveHook__["a" /* default */])(actions, true),
    removeAllFilters: Object(__WEBPACK_IMPORTED_MODULE_1__createRemoveHook__["a" /* default */])(filters, true),
    doAction: Object(__WEBPACK_IMPORTED_MODULE_3__createRunHook__["a" /* default */])(actions),
    applyFilters: Object(__WEBPACK_IMPORTED_MODULE_3__createRunHook__["a" /* default */])(filters, true),
    currentAction: Object(__WEBPACK_IMPORTED_MODULE_4__createCurrentHook__["a" /* default */])(actions),
    currentFilter: Object(__WEBPACK_IMPORTED_MODULE_4__createCurrentHook__["a" /* default */])(filters),
    doingAction: Object(__WEBPACK_IMPORTED_MODULE_5__createDoingHook__["a" /* default */])(actions),
    doingFilter: Object(__WEBPACK_IMPORTED_MODULE_5__createDoingHook__["a" /* default */])(filters),
    didAction: Object(__WEBPACK_IMPORTED_MODULE_6__createDidHook__["a" /* default */])(actions),
    didFilter: Object(__WEBPACK_IMPORTED_MODULE_6__createDidHook__["a" /* default */])(filters),
    actions: actions,
    filters: filters
  };
}

/* harmony default export */ __webpack_exports__["a"] = (createHooks);
//# sourceMappingURL=createHooks.js.map

/***/ }),

/***/ 814:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__validateNamespace_js__ = __webpack_require__(373);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__validateHookName_js__ = __webpack_require__(243);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2____ = __webpack_require__(242);



/**
 * Returns a function which, when invoked, will add a hook.
 *
 * @param  {Object}   hooks Stored hooks, keyed by hook name.
 *
 * @return {Function}       Function that adds a new hook.
 */

function createAddHook(hooks) {
  /**
   * Adds the hook to the appropriate hooks container.
   *
   * @param {string}   hookName  Name of hook to add
   * @param {string}   namespace The unique namespace identifying the callback in the form `vendor/plugin/function`.
   * @param {Function} callback  Function to call when the hook is run
   * @param {?number}  priority  Priority of this hook (default=10)
   */
  return function addHook(hookName, namespace, callback) {
    var priority = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 10;

    if (!Object(__WEBPACK_IMPORTED_MODULE_1__validateHookName_js__["a" /* default */])(hookName)) {
      return;
    }

    if (!Object(__WEBPACK_IMPORTED_MODULE_0__validateNamespace_js__["a" /* default */])(namespace)) {
      return;
    }

    if ('function' !== typeof callback) {
      // eslint-disable-next-line no-console
      console.error('The hook callback must be a function.');
      return;
    } // Validate numeric priority


    if ('number' !== typeof priority) {
      // eslint-disable-next-line no-console
      console.error('If specified, the hook priority must be a number.');
      return;
    }

    var handler = {
      callback: callback,
      priority: priority,
      namespace: namespace
    };

    if (hooks[hookName]) {
      // Find the correct insert index of the new hook.
      var handlers = hooks[hookName].handlers;
      var i;

      for (i = handlers.length; i > 0; i--) {
        if (priority >= handlers[i - 1].priority) {
          break;
        }
      }

      if (i === handlers.length) {
        // If append, operate via direct assignment.
        handlers[i] = handler;
      } else {
        // Otherwise, insert before index via splice.
        handlers.splice(i, 0, handler);
      } // We may also be currently executing this hook.  If the callback
      // we're adding would come after the current callback, there's no
      // problem; otherwise we need to increase the execution index of
      // any other runs by 1 to account for the added element.


      (hooks.__current || []).forEach(function (hookInfo) {
        if (hookInfo.name === hookName && hookInfo.currentIndex >= i) {
          hookInfo.currentIndex++;
        }
      });
    } else {
      // This is the first hook of its type.
      hooks[hookName] = {
        handlers: [handler],
        runs: 0
      };
    }

    if (hookName !== 'hookAdded') {
      Object(__WEBPACK_IMPORTED_MODULE_2____["b" /* doAction */])('hookAdded', hookName, namespace, callback, priority);
    }
  };
}

/* harmony default export */ __webpack_exports__["a"] = (createAddHook);
//# sourceMappingURL=createAddHook.js.map

/***/ }),

/***/ 815:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__validateNamespace_js__ = __webpack_require__(373);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__validateHookName_js__ = __webpack_require__(243);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2____ = __webpack_require__(242);



/**
 * Returns a function which, when invoked, will remove a specified hook or all
 * hooks by the given name.
 *
 * @param  {Object}   hooks      Stored hooks, keyed by hook name.
 * @param  {boolean}     removeAll  Whether to remove all callbacks for a hookName, without regard to namespace. Used to create `removeAll*` functions.
 *
 * @return {Function}            Function that removes hooks.
 */

function createRemoveHook(hooks, removeAll) {
  /**
   * Removes the specified callback (or all callbacks) from the hook with a
   * given hookName and namespace.
   *
   * @param {string}    hookName  The name of the hook to modify.
   * @param {string}    namespace The unique namespace identifying the callback in the form `vendor/plugin/function`.
   *
   * @return {number}             The number of callbacks removed.
   */
  return function removeHook(hookName, namespace) {
    if (!Object(__WEBPACK_IMPORTED_MODULE_1__validateHookName_js__["a" /* default */])(hookName)) {
      return;
    }

    if (!removeAll && !Object(__WEBPACK_IMPORTED_MODULE_0__validateNamespace_js__["a" /* default */])(namespace)) {
      return;
    } // Bail if no hooks exist by this name


    if (!hooks[hookName]) {
      return 0;
    }

    var handlersRemoved = 0;

    if (removeAll) {
      handlersRemoved = hooks[hookName].handlers.length;
      hooks[hookName] = {
        runs: hooks[hookName].runs,
        handlers: []
      };
    } else {
      // Try to find the specified callback to remove.
      var handlers = hooks[hookName].handlers;

      var _loop = function _loop(i) {
        if (handlers[i].namespace === namespace) {
          handlers.splice(i, 1);
          handlersRemoved++; // This callback may also be part of a hook that is
          // currently executing.  If the callback we're removing
          // comes after the current callback, there's no problem;
          // otherwise we need to decrease the execution index of any
          // other runs by 1 to account for the removed element.

          (hooks.__current || []).forEach(function (hookInfo) {
            if (hookInfo.name === hookName && hookInfo.currentIndex >= i) {
              hookInfo.currentIndex--;
            }
          });
        }
      };

      for (var i = handlers.length - 1; i >= 0; i--) {
        _loop(i);
      }
    }

    if (hookName !== 'hookRemoved') {
      Object(__WEBPACK_IMPORTED_MODULE_2____["b" /* doAction */])('hookRemoved', hookName, namespace);
    }

    return handlersRemoved;
  };
}

/* harmony default export */ __webpack_exports__["a"] = (createRemoveHook);
//# sourceMappingURL=createRemoveHook.js.map

/***/ }),

/***/ 816:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Returns a function which, when invoked, will return whether any handlers are
 * attached to a particular hook.
 *
 * @param  {Object}   hooks Stored hooks, keyed by hook name.
 *
 * @return {Function}       Function that returns whether any handlers are
 *                          attached to a particular hook.
 */
function createHasHook(hooks) {
  /**
   * Returns how many handlers are attached for the given hook.
   *
   * @param  {string}  hookName The name of the hook to check for.
   *
   * @return {boolean} Whether there are handlers that are attached to the given hook.
   */
  return function hasHook(hookName) {
    return hookName in hooks;
  };
}

/* harmony default export */ __webpack_exports__["a"] = (createHasHook);
//# sourceMappingURL=createHasHook.js.map

/***/ }),

/***/ 817:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Returns a function which, when invoked, will execute all callbacks
 * registered to a hook of the specified type, optionally returning the final
 * value of the call chain.
 *
 * @param  {Object}   hooks          Stored hooks, keyed by hook name.
 * @param  {?boolean}    returnFirstArg Whether each hook callback is expected to
 *                                   return its first argument.
 *
 * @return {Function}                Function that runs hook callbacks.
 */
function createRunHook(hooks, returnFirstArg) {
  /**
   * Runs all callbacks for the specified hook.
   *
   * @param  {string} hookName The name of the hook to run.
   * @param  {...*}   args     Arguments to pass to the hook callbacks.
   *
   * @return {*}               Return value of runner, if applicable.
   */
  return function runHooks(hookName) {
    if (!hooks[hookName]) {
      hooks[hookName] = {
        handlers: [],
        runs: 0
      };
    }

    hooks[hookName].runs++;
    var handlers = hooks[hookName].handlers;

    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    if (!handlers || !handlers.length) {
      return returnFirstArg ? args[0] : undefined;
    }

    var hookInfo = {
      name: hookName,
      currentIndex: 0
    };

    hooks.__current.push(hookInfo);

    while (hookInfo.currentIndex < handlers.length) {
      var handler = handlers[hookInfo.currentIndex];
      var result = handler.callback.apply(null, args);

      if (returnFirstArg) {
        args[0] = result;
      }

      hookInfo.currentIndex++;
    }

    hooks.__current.pop();

    if (returnFirstArg) {
      return args[0];
    }
  };
}

/* harmony default export */ __webpack_exports__["a"] = (createRunHook);
//# sourceMappingURL=createRunHook.js.map

/***/ }),

/***/ 818:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Returns a function which, when invoked, will return the name of the
 * currently running hook, or `null` if no hook of the given type is currently
 * running.
 *
 * @param  {Object}   hooks          Stored hooks, keyed by hook name.
 *
 * @return {Function}                Function that returns the current hook.
 */
function createCurrentHook(hooks) {
  /**
   * Returns the name of the currently running hook, or `null` if no hook of
   * the given type is currently running.
   *
   * @return {?string}             The name of the currently running hook, or
   *                               `null` if no hook is currently running.
   */
  return function currentHook() {
    if (!hooks.__current || !hooks.__current.length) {
      return null;
    }

    return hooks.__current[hooks.__current.length - 1].name;
  };
}

/* harmony default export */ __webpack_exports__["a"] = (createCurrentHook);
//# sourceMappingURL=createCurrentHook.js.map

/***/ }),

/***/ 819:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Returns a function which, when invoked, will return whether a hook is
 * currently being executed.
 *
 * @param  {Object}   hooks Stored hooks, keyed by hook name.
 *
 * @return {Function}       Function that returns whether a hook is currently
 *                          being executed.
 */
function createDoingHook(hooks) {
  /**
   * Returns whether a hook is currently being executed.
   *
   * @param  {?string} hookName The name of the hook to check for.  If
   *                            omitted, will check for any hook being executed.
   *
   * @return {boolean}             Whether the hook is being executed.
   */
  return function doingHook(hookName) {
    // If the hookName was not passed, check for any current hook.
    if ('undefined' === typeof hookName) {
      return 'undefined' !== typeof hooks.__current[0];
    } // Return the __current hook.


    return hooks.__current[0] ? hookName === hooks.__current[0].name : false;
  };
}

/* harmony default export */ __webpack_exports__["a"] = (createDoingHook);
//# sourceMappingURL=createDoingHook.js.map

/***/ }),

/***/ 820:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__validateHookName_js__ = __webpack_require__(243);

/**
 * Returns a function which, when invoked, will return the number of times a
 * hook has been called.
 *
 * @param  {Object}   hooks Stored hooks, keyed by hook name.
 *
 * @return {Function}       Function that returns a hook's call count.
 */

function createDidHook(hooks) {
  /**
   * Returns the number of times an action has been fired.
   *
   * @param  {string} hookName The hook name to check.
   *
   * @return {number}          The number of times the hook has run.
   */
  return function didHook(hookName) {
    if (!Object(__WEBPACK_IMPORTED_MODULE_0__validateHookName_js__["a" /* default */])(hookName)) {
      return;
    }

    return hooks[hookName] && hooks[hookName].runs ? hooks[hookName].runs : 0;
  };
}

/* harmony default export */ __webpack_exports__["a"] = (createDidHook);
//# sourceMappingURL=createDidHook.js.map

/***/ })

/******/ });