wedevsPmWebpack([12],{

/***/ 348:
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;


/***/ }),

/***/ 513:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(542);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

// import header from './../common/header.vue';
// import do_action from '@components/common/do-action.vue';

/* harmony default export */ __webpack_exports__["a"] = ({
    beforeRouteEnter: function beforeRouteEnter(to, from, next) {

        next(function (vm) {
            vm.registerStore('pmFiles');
            vm.getFiles();
        });
    },

    state: {
        files: []
    },
    mutations: {
        setFiles: function setFiles(state, files) {
            state.files = files;
        }
    },
    components: {
        // 'pm-header': header,
        // 'do-action': do_action
    },

    created: function created() {},

    computed: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, pm.Vuex.mapState('pmFiles', ['files'])),

    data: function data() {
        return {
            loading: true
        };
    },


    methods: {
        attachTo: function attachTo(file) {
            if (file.fileable_type === 'discussion_board') {
                return 'Discuss';
            }
        },
        contentURL: function contentURL(file) {
            var self = this;
            switch (file.fileable_type) {

                case 'discussion_board':
                    return '#/' + self.project_id + '/discussions/' + file.fileable_id;
                    break;

                case 'task_list':
                    return '#/' + self.project_id + '/task-lists/' + file.fileable_id;
                    break;

                case 'task':
                    return '#/' + self.project_id + '/task/' + file.fileable_id;
                    break;

                default:
                    break;
            }
        }
    }

});

/***/ }),

/***/ 539:
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(592), __esModule: true };

/***/ }),

/***/ 54:
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;


/***/ }),

/***/ 542:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _assign = __webpack_require__(539);

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _assign2.default || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

/***/ }),

/***/ 592:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(610);
module.exports = __webpack_require__(4).Object.assign;


/***/ }),

/***/ 603:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.2.1 Object.assign(target, source, ...)
var getKeys = __webpack_require__(14);
var gOPS = __webpack_require__(348);
var pIE = __webpack_require__(54);
var toObject = __webpack_require__(56);
var IObject = __webpack_require__(26);
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || __webpack_require__(6)(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
  } return T;
} : $assign;


/***/ }),

/***/ 61:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_files_vue__ = __webpack_require__(513);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_306f4e38_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_files_vue__ = __webpack_require__(643);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_files_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_306f4e38_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_files_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/components/project-files/files.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-306f4e38", Component.options)
  } else {
    hotAPI.reload("data-v-306f4e38", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),

/***/ 610:
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.1 Object.assign(target, source)
var $export = __webpack_require__(12);

$export($export.S + $export.F, 'Object', { assign: __webpack_require__(603) });


/***/ }),

/***/ 643:
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
      _c("pre", [_vm._v(_vm._s(_vm.files))]),
      _vm._v(" "),
      _c("do-action", { attrs: { hook: "after_files_header" } }),
      _vm._v(" "),
      _vm.loading
        ? _c("div", { staticClass: "pm-data-load-before" }, [_vm._m(0)])
        : _vm._e(),
      _vm._v(" "),
      !_vm.loading
        ? _c("div", { staticClass: "pm-files-page" }, [
            _c(
              "ul",
              { staticClass: "pm-files" },
              _vm._l(_vm.files, function(file) {
                return _c("li", [
                  _c("div", { staticClass: "pm-thumb" }, [
                    _c(
                      "a",
                      {
                        staticClass: "pm-colorbox-img",
                        attrs: { title: file.name, href: file.url }
                      },
                      [
                        _c("img", {
                          attrs: { src: file.thumb, alt: file.name }
                        })
                      ]
                    )
                  ]),
                  _vm._v(" "),
                  _c("div", {}, [
                    _c("h3", { staticClass: "pm-file-name" }, [
                      _vm._v(_vm._s(file.name))
                    ]),
                    _vm._v(" "),
                    _c("div", { staticClass: "pm-file-meta" }, [
                      _vm._v(
                        "\n                        Attached to \n                        "
                      ),
                      _c("a", { attrs: { href: _vm.contentURL(file) } }, [
                        _vm._v(_vm._s(_vm.attachTo(file)))
                      ]),
                      _vm._v(
                        " \n                        by \n                        "
                      ),
                      _c("a", { attrs: { href: "#/", title: "admin" } }, [
                        _vm._v(
                          "\n                            admin\n                        "
                        )
                      ])
                    ]),
                    _vm._v(" "),
                    _c("div", { staticClass: "pm-file-action" }, [
                      _c("ul", [
                        _c("li", { staticClass: "pm-go-discussion" }, [
                          _c("a", { attrs: { href: _vm.contentURL(file) } })
                        ]),
                        _vm._v(" "),
                        _c("li", { staticClass: "pm-download-file" }, [
                          _c("a", { attrs: { href: file.url } })
                        ]),
                        _vm._v(" "),
                        _vm._m(1, true)
                      ])
                    ])
                  ])
                ])
              })
            )
          ])
        : _vm._e()
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
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("li", { staticClass: "pm-comments-count" }, [
      _c("span"),
      _vm._v(" "),
      _c("div", { staticClass: "pm-btn pm-btn-blue pm-comment-count" }, [
        _vm._v(" 1")
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
    require("vue-hot-reload-api")      .rerender("data-v-306f4e38", esExports)
  }
}

/***/ })

});