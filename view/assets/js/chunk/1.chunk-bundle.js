webpackJsonp([1],{

/***/ 102:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vue_vue__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vue_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__vue_vue__);
//
//
//
//




/* harmony default export */ __webpack_exports__["a"] = ({

    //mixins: cpm_todo_list_mixins( CPM_Todo_List.todo_list_text_editor ),    

    // Get passing data for this component.
    props: ['editor_id', 'content'],

    // Initial action for this component
    created: function () {
        var self = this;
        this.$root.$on('after_comment', this.afterComment);
        // After ready dom
        __WEBPACK_IMPORTED_MODULE_0__vue_vue___default.a.nextTick(function () {
            // Remove the editor
            tinymce.execCommand('mceRemoveEditor', true, self.editor_id);

            // Instantiate the editor
            var settings = {
                selector: 'textarea#' + self.editor_id,
                menubar: false,
                placeholder: 'Write a comment...',
                branding: false,

                setup: function (editor) {
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
        afterComment: function () {
            tinyMCE.get(this.editor_id).setContent('');
        }
    }
});

/***/ }),

/***/ 120:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_file_uploader_vue__ = __webpack_require__(94);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_62344bae_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_file_uploader_vue__ = __webpack_require__(138);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_file_uploader_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_62344bae_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_file_uploader_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "view/assets/js/components/task-lists/file-uploader.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] file-uploader.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-62344bae", Component.options)
  } else {
    hotAPI.reload("data-v-62344bae", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 121:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_list_comment_form_vue__ = __webpack_require__(95);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_bdbf3e6a_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_list_comment_form_vue__ = __webpack_require__(147);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_list_comment_form_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_bdbf3e6a_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_list_comment_form_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "view/assets/js/components/task-lists/list-comment-form.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] list-comment-form.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-bdbf3e6a", Component.options)
  } else {
    hotAPI.reload("data-v-bdbf3e6a", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 122:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_list_comments_vue__ = __webpack_require__(96);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_4b305a66_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_list_comments_vue__ = __webpack_require__(136);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_list_comments_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_4b305a66_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_list_comments_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "view/assets/js/components/task-lists/list-comments.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] list-comments.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-4b305a66", Component.options)
  } else {
    hotAPI.reload("data-v-4b305a66", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 125:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_text_editor_vue__ = __webpack_require__(102);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_269b1a17_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_text_editor_vue__ = __webpack_require__(132);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_text_editor_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_269b1a17_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_text_editor_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "view/assets/js/components/task-lists/text-editor.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] text-editor.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-269b1a17", Component.options)
  } else {
    hotAPI.reload("data-v-269b1a17", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 132:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('textarea', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.content.html),
      expression: "content.html"
    }],
    attrs: {
      "id": _vm.editor_id
    },
    domProps: {
      "value": (_vm.content.html)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.content.html = $event.target.value
      }
    }
  })])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-269b1a17", esExports)
  }
}

/***/ }),

/***/ 136:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "cpm-list-comment-wrap"
  }, [_c('h3', {
    staticClass: "cpm-comment-title"
  }, [_vm._v("Discuss this task list")]), _vm._v(" "), _c('ul', {
    staticClass: "cpm-comment-wrap"
  }, _vm._l((_vm.comments), function(comment) {
    return _c('li', {
      key: comment.comment_ID,
      class: 'cpm-comment clearfix even cpm-fade-out-' + comment.comment_ID
    }, [_c('div', {
      staticClass: "cpm-avatar",
      domProps: {
        "innerHTML": _vm._s(comment.avatar)
      }
    }), _vm._v(" "), _c('div', {
      staticClass: "cpm-comment-container"
    }, [_c('div', {
      staticClass: "cpm-comment-meta"
    }, [_c('span', {
      staticClass: "cpm-author",
      domProps: {
        "innerHTML": _vm._s(comment.comment_user)
      }
    }), _vm._v(" "), _c('span', [_vm._v("On")]), _vm._v(" "), _c('span', {
      staticClass: "cpm-date"
    }, [_c('time', {
      attrs: {
        "datetime": _vm.dateISO8601Format(comment.comment_date),
        "title": _vm.dateISO8601Format(comment.comment_date)
      }
    }, [_vm._v(_vm._s(_vm.dateTimeFormat(comment.comment_date)))])]), _vm._v(" "), (_vm.current_user_can_edit_delete(comment, _vm.list)) ? _c('div', {
      staticClass: "cpm-comment-action"
    }, [_c('span', {
      staticClass: "cpm-edit-link"
    }, [_c('a', {
      staticClass: "dashicons dashicons-edit",
      attrs: {
        "href": "#"
      },
      on: {
        "click": function($event) {
          $event.preventDefault();
          _vm.showHideListCommentEditForm(comment.comment_ID)
        }
      }
    })]), _vm._v(" "), _c('span', {
      staticClass: "cpm-delete-link"
    }, [_c('a', {
      staticClass: "dashicons dashicons-trash",
      attrs: {
        "href": "#",
        "data-project_id": "111",
        "data-id": "82",
        "data-confirm": "Are you sure to delete this comment?"
      },
      on: {
        "click": function($event) {
          $event.preventDefault();
          _vm.deleteComment(comment.comment_ID, _vm.list.ID)
        }
      }
    })])]) : _vm._e()]), _vm._v(" "), _c('div', {
      staticClass: "cpm-comment-content"
    }, [_c('div', {
      domProps: {
        "innerHTML": _vm._s(comment.comment_content)
      }
    }), _vm._v(" "), _c('ul', {
      staticClass: "cpm-attachments"
    }, _vm._l((comment.files), function(file) {
      return _c('li', {
        key: file.id
      }, [_c('a', {
        staticClass: "cpm-colorbox-img",
        attrs: {
          "href": file.url,
          "title": "file.name",
          "target": "_blank"
        }
      }, [_c('img', {
        attrs: {
          "src": file.thumb
        }
      })])])
    }))]), _vm._v(" "), (comment.edit_mode) ? _c('div', {
      staticClass: "cpm-comment-edit-form"
    }, [_c('div', {
      class: 'cpm-slide-' + comment.comment_ID,
      staticStyle: {
        "display": "none"
      }
    }, [_c('cpm-list-comment-form', {
      attrs: {
        "comment": comment,
        "list": _vm.list
      }
    })], 1)]) : _vm._e()])])
  })), _vm._v(" "), _c('div', {
    staticClass: "single-todo-comments"
  }, [_c('div', {
    staticClass: "cpm-comment-form-wrap"
  }, [_c('div', {
    staticClass: "cpm-avatar"
  }, [_c('img', {
    attrs: {
      "src": _vm.getCurrentUserAvatar,
      "height": "48",
      "width": "48"
    }
  })]), _vm._v(" "), _c('list-comment-form', {
    attrs: {
      "comment": {},
      "list": _vm.list
    }
  })], 1)])])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-4b305a66", esExports)
  }
}

/***/ }),

/***/ 137:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [(_vm.loading) ? _c('div', {
    staticClass: "cpm-data-load-before"
  }, [_vm._m(0)]) : _c('div', [_c('router-link', {
    staticClass: "cpm-btn cpm-btn-blue cpm-margin-bottom add-tasklist",
    attrs: {
      "to": "/"
    }
  }, [_c('i', {
    staticClass: "fa fa-angle-left"
  }), _vm._v("Back to Task Lists")]), _vm._v(" "), (_vm.render_tmpl) ? _c('div', [_c('ul', {
    staticClass: "cpm-todolists"
  }, _vm._l((_vm.lists), function(list, index) {
    return _c('li', {
      key: list.ID,
      class: 'cpm-fade-out-' + list.ID
    }, [_c('article', {
      staticClass: "cpm-todolist"
    }, [_c('header', {
      staticClass: "cpm-list-header"
    }, [_c('h3', [_c('router-link', {
      attrs: {
        "to": {
          name: 'single-list',
          params: {
            list_id: list.ID
          }
        }
      }
    }, [_vm._v(_vm._s(list.post_title))]), _vm._v(" "), _c('span', {
      class: _vm.privateClass(list)
    }), _vm._v(" "), _c('div', {
      staticClass: "cpm-right"
    }, [_c('a', {
      staticClass: "cpm-icon-edit",
      attrs: {
        "href": "#",
        "title": "<?php _e( 'Edit this List', 'cpm' ); ?>"
      },
      on: {
        "click": function($event) {
          $event.preventDefault();
          _vm.showHideTodoListForm(list, index)
        }
      }
    }, [_c('span', {
      staticClass: "dashicons dashicons-edit"
    })]), _vm._v(" "), _c('a', {
      staticClass: "cpm-btn cpm-btn-xs",
      attrs: {
        "href": "#",
        "title": "<?php _e( 'Delete this List', 'cpm' ); ?>",
        "data-list_id": list.ID,
        "data-confirm": "<?php _e( 'Are you sure to delete this task list?', 'cpm' ); ?>"
      },
      on: {
        "click": function($event) {
          $event.preventDefault();
          _vm.deleteList(list.ID)
        }
      }
    }, [_c('span', {
      staticClass: "dashicons dashicons-trash"
    })])])], 1), _vm._v(" "), _c('div', {
      staticClass: "cpm-entry-detail"
    }, [_vm._v("\n                                    " + _vm._s(list.post_content) + "\n                                ")]), _vm._v(" "), (list.edit_mode) ? _c('div', {
      staticClass: "cpm-update-todolist-form"
    }, [_c('todo-list-form', {
      attrs: {
        "list": list,
        "index": index
      }
    })], 1) : _vm._e()]), _vm._v(" "), _c('tasks', {
      attrs: {
        "list": list,
        "index": index
      }
    }), _vm._v(" "), _c('footer', {
      staticClass: "cpm-row cpm-list-footer"
    }, [_c('div', {
      staticClass: "cpm-col-6"
    }, [(_vm.canUserCreateTask) ? _c('div', [_c('new-task-button', {
      attrs: {
        "task": {},
        "list": list,
        "list_index": index
      }
    })], 1) : _vm._e()]), _vm._v(" "), _c('div', {
      staticClass: "cpm-col-4 cpm-todo-prgress-bar"
    }, [_c('div', {
      staticClass: "bar completed",
      style: (_vm.getProgressStyle(list))
    })]), _vm._v(" "), _c('div', {
      staticClass: " cpm-col-1 no-percent"
    }, [_vm._v(_vm._s(_vm.getProgressPercent(list)) + "%")]), _vm._v(" "), _c('div', {
      staticClass: "clearfix"
    })])], 1)])
  })), _vm._v(" "), _c('router-view', {
    attrs: {
      "name": "single_task"
    }
  }), _vm._v(" "), _c('list-comments', {
    attrs: {
      "comments": _vm.comments,
      "list": _vm.comment_list
    }
  })], 1) : _vm._e()], 1), _vm._v(" "), _c('router-view', {
    attrs: {
      "name": "single_task"
    }
  })], 1)
}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "loadmoreanimation"
  }, [_c('div', {
    staticClass: "load-spinner"
  }, [_c('div', {
    staticClass: "rect1"
  }), _vm._v(" "), _c('div', {
    staticClass: "rect2"
  }), _vm._v(" "), _c('div', {
    staticClass: "rect3"
  }), _vm._v(" "), _c('div', {
    staticClass: "rect4"
  }), _vm._v(" "), _c('div', {
    staticClass: "rect5"
  })])])
}]
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-6155e00d", esExports)
  }
}

/***/ }),

/***/ 138:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "cpm-attachment-area"
  }, [_c('div', {
    attrs: {
      "id": "cpm-upload-container"
    }
  }, [_c('div', {
    staticClass: "cpm-upload-filelist"
  }, _vm._l((_vm.files), function(file) {
    return _c('div', {
      key: file.id,
      staticClass: "cpm-uploaded-item"
    }, [_c('a', {
      attrs: {
        "href": file.url,
        "target": "_blank"
      }
    }, [_c('img', {
      attrs: {
        "src": file.thumb,
        "alt": file.name
      }
    })]), _vm._v(" "), _c('a', {
      staticClass: "button",
      attrs: {
        "href": "#"
      },
      on: {
        "click": function($event) {
          $event.preventDefault();
          _vm.deletefile(file.id)
        }
      }
    }, [_vm._v("Delete File")])])
  })), _vm._v("\n       To attach, "), _c('a', {
    attrs: {
      "id": "cpm-upload-pickfiles%s",
      "href": "#"
    }
  }, [_vm._v("select files")]), _vm._v(" from your computer.\n    ")])])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-62344bae", esExports)
  }
}

/***/ }),

/***/ 147:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "cpm-comment-form"
  }, [_c('form', {
    staticClass: "cpm-comment-form-vue",
    on: {
      "submit": function($event) {
        $event.preventDefault();
        _vm.updateComment()
      }
    }
  }, [_c('div', {
    staticClass: "item message cpm-sm-col-1"
  }, [_c('text-editor', {
    attrs: {
      "editor_id": _vm.editor_id,
      "content": _vm.content
    }
  })], 1), _vm._v(" "), (_vm.hasCoWorker) ? _c('div', {
    staticClass: "notify-users"
  }, [_c('h2', {
    staticClass: "cpm-box-title"
  }, [_vm._v(" \n                    Notify users            \n                    "), _c('label', {
    staticClass: "cpm-small-title",
    attrs: {
      "for": "select-all"
    }
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.notify_all_co_worker),
      expression: "notify_all_co_worker"
    }],
    staticClass: "cpm-toggle-checkbox",
    attrs: {
      "type": "checkbox",
      "id": "select-all"
    },
    domProps: {
      "checked": Array.isArray(_vm.notify_all_co_worker) ? _vm._i(_vm.notify_all_co_worker, null) > -1 : (_vm.notify_all_co_worker)
    },
    on: {
      "change": function($event) {
        $event.preventDefault();
        _vm.notify_all_coo_worker()
      },
      "__c": function($event) {
        var $$a = _vm.notify_all_co_worker,
          $$el = $event.target,
          $$c = $$el.checked ? (true) : (false);
        if (Array.isArray($$a)) {
          var $$v = null,
            $$i = _vm._i($$a, $$v);
          if ($$el.checked) {
            $$i < 0 && (_vm.notify_all_co_worker = $$a.concat($$v))
          } else {
            $$i > -1 && (_vm.notify_all_co_worker = $$a.slice(0, $$i).concat($$a.slice($$i + 1)))
          }
        } else {
          _vm.notify_all_co_worker = $$c
        }
      }
    }
  }), _vm._v(" \n                        Select all\n                    ")])]), _vm._v(" "), _c('ul', {
    staticClass: "cpm-user-list"
  }, [_vm._l((_vm.co_workers), function(co_worker) {
    return _c('li', {
      key: co_worker.id
    }, [_c('label', {
      attrs: {
        "for": 'cpm_notify_' + co_worker.id
      }
    }, [_c('input', {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: (_vm.notify_co_workers),
        expression: "notify_co_workers"
      }],
      attrs: {
        "type": "checkbox",
        "name": "notify_co_workers[]",
        "id": 'cpm_notify_' + co_worker.id
      },
      domProps: {
        "value": co_worker.id,
        "checked": Array.isArray(_vm.notify_co_workers) ? _vm._i(_vm.notify_co_workers, co_worker.id) > -1 : (_vm.notify_co_workers)
      },
      on: {
        "change": function($event) {
          $event.preventDefault();
          _vm.notify_coo_workers(co_worker.id)
        },
        "__c": function($event) {
          var $$a = _vm.notify_co_workers,
            $$el = $event.target,
            $$c = $$el.checked ? (true) : (false);
          if (Array.isArray($$a)) {
            var $$v = co_worker.id,
              $$i = _vm._i($$a, $$v);
            if ($$el.checked) {
              $$i < 0 && (_vm.notify_co_workers = $$a.concat($$v))
            } else {
              $$i > -1 && (_vm.notify_co_workers = $$a.slice(0, $$i).concat($$a.slice($$i + 1)))
            }
          } else {
            _vm.notify_co_workers = $$c
          }
        }
      }
    }), _vm._v(" \n                            " + _vm._s(co_worker.name) + "\n                        ")])])
  }), _vm._v(" "), _c('div', {
    staticClass: "clearfix"
  })], 2)]) : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "submit"
  }, [(!_vm.comment.edit_mode) ? _c('input', {
    staticClass: "button-primary",
    attrs: {
      "disabled": _vm.submit_disabled,
      "type": "submit",
      "value": "Add New Comment",
      "id": ""
    }
  }) : _vm._e(), _vm._v(" "), (_vm.comment.edit_mode) ? _c('input', {
    staticClass: "button-primary",
    attrs: {
      "disabled": _vm.submit_disabled,
      "type": "submit",
      "value": "Update Comment",
      "id": ""
    }
  }) : _vm._e(), _vm._v(" "), _c('span', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.show_spinner),
      expression: "show_spinner"
    }],
    staticClass: "cpm-spinner"
  })])])])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-bdbf3e6a", esExports)
  }
}

/***/ }),

/***/ 16:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_single_list_vue__ = __webpack_require__(99);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_6155e00d_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_single_list_vue__ = __webpack_require__(137);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_single_list_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_6155e00d_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_single_list_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "view/assets/js/components/task-lists/single-list.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] single-list.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-6155e00d", Component.options)
  } else {
    hotAPI.reload("data-v-6155e00d", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),

/***/ 80:
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
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
    props: ['list', 'index'],

    // Include global properties and methods
    //mixins: [CPM_Task_Mixin],

    /**
     * Initial data for this component
     * 
     * @return obj
     */
    data: function () {
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
            loading_incomplete_tasks: true
        };
    },

    created: function () {

        var self = this;
        if (this.$store.state.is_single_list) {
            //For sigle todo-list page
            this.getTasks(this.list.ID, 0, 'cpm_get_tasks', function (res) {
                var getIncompletedTasks = self.getIncompletedTasks(self.list);
                var getCompleteTask = self.getCompleteTask(self.list);

                self.loading_completed_tasks = false;
                self.loading_incomplete_tasks = false;

                if (res.found_incompleted_tasks > getIncompletedTasks.length) {
                    self.incomplete_show_load_more_btn = true;
                }

                if (res.found_completed_tasks > getCompleteTask.length) {
                    self.complete_show_load_more_btn = true;
                }
            });
        } else {
            //self.list.tasks = [];
            //For todo-lists page
            this.getTasks(this.list.ID, 0, 'cpm_get_incompleted_tasks', function (res) {
                self.loading_incomplete_tasks = false;

                if (res.found_incompleted_tasks > self.list.tasks.length) {
                    self.incomplete_show_load_more_btn = true;
                }
            });
        }
    },

    computed: {
        /**
         * Check, Has task from this props list
         * 
         * @return boolen
         */
        taskLength: function () {
            return typeof this.list.tasks != 'undefined' && this.list.tasks.length ? true : false;
        },

        /**
         * Get incomplete tasks
         * 
         * @param  array tasks 
         * 
         * @return array       
         */
        getIncompleteTasks: function () {

            if (!this.list.tasks) {
                return [];
            }

            return this.list.tasks.filter(function (task) {
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
        getCompletedTask: function () {
            if (!this.list.tasks) {
                return [];
            }

            return this.list.tasks.filter(function (task) {
                return task.completed == '1' || task.completed;
            });
        }
    },

    methods: {
        is_assigned: function (task) {

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
        getIncompletedTasks: function (lists) {
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
        getCompleteTask: function (lists) {
            return lists.tasks.filter(function (task) {
                return task.completed == '1' || task.completed;
            });
        },
        /**
         * Show task edit form
         * 
         * @param  int task_index 
         * 
         * @return void            
         */
        taskEdit: function (task_id) {

            var self = this,
                lists = this.$store.state.lists,
                list_index = this.getIndex(lists, this.list.ID, 'ID');
            task_index = this.getIndex(self.list.tasks, task_id, 'ID');

            self.showHideTaskForm(list_index, task_index);
        },

        /**
         * Class for showing task private incon
         * 
         * @param  obje task 
         * 
         * @return string      
         */
        privateClass: function (task) {
            return task.task_privacy == 'yes' ? 'cpm-lock' : 'cpm-unlock';
        },

        /**
         * Delete task
         * 
         * @return void
         */
        deleteTask: function (list_id, task_id) {
            if (!confirm(PM_Vars.message.confirm)) {
                return;
            }

            var self = this,
                list_index = this.getIndex(this.$store.state.lists, list_id, 'ID'),
                task_index = this.getIndex(this.$store.state.lists[list_index].tasks, task_id, 'ID'),
                form_data = {
                action: 'cpm_task_delete',
                task_id: task_id,
                _wpnonce: PM_Vars.nonce
            };

            // Seding request for insert or update todo list
            jQuery.post(PM_Vars.ajaxurl, form_data, function (res) {
                if (res.success) {
                    // Display a success message, with a title
                    //toastr.success(res.data.success);

                    CPM_Component_jQuery.fadeOut(task_id, function () {
                        self.$store.commit('after_delete_task', {
                            list_index: list_index,
                            task_index: task_index
                        });
                    });
                } else {
                    // Showing error
                    res.data.error.map(function (value, index) {
                        toastr.error(value);
                    });
                }
            });
        },

        loadMoreIncompleteTasks: function (list) {
            if (this.task_loading_status) {
                return;
            }

            this.task_loading_status = true;
            this.more_incomplete_task_spinner = true;

            var incompleted_tasks = this.getIncompletedTasks(this.list);

            var page_number = incompleted_tasks.length,
                self = this;

            this.getTasks(list.ID, page_number, 'cpm_get_incompleted_tasks', function (res) {
                self.task_loading_status = false;
                self.more_incomplete_task_spinner = false;

                var incompleted_tasks = self.getIncompletedTasks(self.list);

                if (res.found_incompleted_tasks > incompleted_tasks.length) {
                    self.incomplete_show_load_more_btn = true;
                } else {
                    self.incomplete_show_load_more_btn = false;
                }
            });
        },

        loadMoreCompleteTasks: function (list) {
            if (this.task_loading_status) {
                return;
            }

            this.task_loading_status = true;
            this.more_completed_task_spinner = true;

            var completed_tasks = this.getCompleteTask(this.list);

            var page_number = completed_tasks.length,
                self = this;

            this.getTasks(list.ID, page_number, 'cpm_get_completed_tasks', function (res) {
                self.task_loading_status = false;
                self.more_completed_task_spinner = false;

                var completed_tasks = self.getCompleteTask(self.list);

                if (res.found_completed_tasks > completed_tasks.length) {
                    self.complete_show_load_more_btn = true;
                } else {
                    self.complete_show_load_more_btn = false;
                }
            });
        }
    }
});

/***/ }),

/***/ 81:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_tasks_vue__ = __webpack_require__(80);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_52cdc098_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_tasks_vue__ = __webpack_require__(82);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_tasks_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_52cdc098_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_tasks_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "view/assets/js/components/task-lists/tasks.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] tasks.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-52cdc098", Component.options)
  } else {
    hotAPI.reload("data-v-52cdc098", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 82:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [(_vm.is_single_list) ? _c('div', {
    attrs: {
      "id": "cpm-single-todo-list-view"
    }
  }, [_c('div', {
    staticClass: "cpm-incomplete-tasks"
  }, [_vm._m(0), _vm._v(" "), _c('ul', {
    staticClass: "cpm-incomplete-task-list cpm-todos cpm-todolist-content cpm-incomplete-task"
  }, [_vm._l((_vm.getIncompleteTasks), function(task, task_index) {
    return _c('li', {
      key: task.ID,
      staticClass: "cpm-todo",
      class: 'cpm-fade-out-' + task.ID,
      attrs: {
        "data-id": task.ID,
        "data-order": task.menu_order
      }
    }, [_c('div', {
      staticClass: "cpm-todo-wrap clearfix"
    }, [_c('div', {
      staticClass: "cpm-todo-content"
    }, [_c('div', {
      staticClass: "cpm-incomplete-todo"
    }, [_c('div', {
      staticClass: "cpm-col-6"
    }, [_c('input', {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: (task.completed),
        expression: "task.completed"
      }],
      attrs: {
        "disabled": !_vm.is_assigned(task),
        "type": "checkbox",
        "value": "",
        "name": ""
      },
      domProps: {
        "checked": Array.isArray(task.completed) ? _vm._i(task.completed, "") > -1 : (task.completed)
      },
      on: {
        "click": function($event) {
          _vm.taskDoneUndone(task, task.completed)
        },
        "__c": function($event) {
          var $$a = task.completed,
            $$el = $event.target,
            $$c = $$el.checked ? (true) : (false);
          if (Array.isArray($$a)) {
            var $$v = "",
              $$i = _vm._i($$a, $$v);
            if ($$el.checked) {
              $$i < 0 && (task.completed = $$a.concat($$v))
            } else {
              $$i > -1 && (task.completed = $$a.slice(0, $$i).concat($$a.slice($$i + 1)))
            }
          } else {
            task.completed = $$c
          }
        }
      }
    }), _vm._v(" "), _c('span', [_c('router-link', {
      attrs: {
        "to": {
          name: 'single_task',
          params: {
            list_id: _vm.list.ID,
            task_id: task.ID,
            project_id: 1,
            task: task
          }
        }
      }
    }, [_vm._v("\n\n\t                                    \t" + _vm._s(task.post_title) + "\n\t                                \t")])], 1), _vm._v(" "), _c('span', {
      class: _vm.privateClass(task)
    }), _vm._v(" "), _vm._l((_vm.getUsers(task.assigned_to)), function(user) {
      return _c('span', {
        key: user.ID,
        staticClass: "cpm-assigned-user",
        domProps: {
          "innerHTML": _vm._s(user.user_url)
        }
      })
    }), _vm._v(" "), _c('span', {
      class: _vm.taskDateWrap(task.start_date, task.due_date)
    }, [(_vm.task_start_field) ? _c('span', [_vm._v(_vm._s(_vm.dateFormat(task.start_date)))]) : _vm._e(), _vm._v(" "), (_vm.isBetweenDate(_vm.task_start_field, task.start_date, task.due_date)) ? _c('span', [_vm._v("–")]) : _vm._e(), _vm._v(" "), _c('span', [_vm._v(_vm._s(_vm.dateFormat(task.due_date)))])])], 2), _vm._v(" "), _c('div', {
      staticClass: "cpm-col-5 cpm-todo-action-center"
    }, [_c('div', {
      staticClass: "cpm-task-comment"
    }, [_c('router-link', {
      attrs: {
        "to": {
          name: 'list_task_single_under_todo',
          params: {
            list_id: _vm.list.ID,
            task_id: task.ID,
            task: task
          }
        }
      }
    }, [_c('span', {
      staticClass: "cpm-comment-count"
    }, [_vm._v("\n\t                                                " + _vm._s(task.comments.length) + "\n\t                                            ")])])], 1)]), _vm._v(" "), (task.can_del_edit) ? _c('div', {
      staticClass: "cpm-col-1 cpm-todo-action-right cpm-last-col"
    }, [_c('a', {
      staticClass: "cpm-todo-delete",
      attrs: {
        "href": "#"
      },
      on: {
        "click": function($event) {
          $event.preventDefault();
          _vm.deleteTask(task.post_parent, task.ID)
        }
      }
    }, [_c('span', {
      staticClass: "dashicons dashicons-trash"
    })]), _vm._v(" "), _c('a', {
      staticClass: "cpm-todo-edit",
      attrs: {
        "href": "#"
      },
      on: {
        "click": function($event) {
          $event.preventDefault();
          _vm.taskEdit(task.ID)
        }
      }
    }, [_c('span', {
      staticClass: "dashicons dashicons-edit"
    })])]) : _vm._e(), _vm._v(" "), _c('div', {
      staticClass: "clearfix"
    })])]), _vm._v(" "), (task.edit_mode) ? _c('div', {
      staticClass: "cpm-todo-form"
    }, [_c('new-task-form', {
      attrs: {
        "task": task,
        "task_index": task_index,
        "list": _vm.list,
        "list_index": _vm.index
      }
    })], 1) : _vm._e()])])
  }), _vm._v(" "), (!_vm.getIncompleteTasks.length) ? _c('li', {
    staticClass: "nonsortable"
  }, [_vm._v("No tasks found.")]) : _vm._e(), _vm._v(" "), (_vm.incomplete_show_load_more_btn) ? _c('li', {
    staticClass: "nonsortable"
  }, [_c('a', {
    attrs: {
      "href": "#"
    },
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.loadMoreIncompleteTasks(_vm.list)
      }
    }
  }, [_vm._v("More Tasks")]), _vm._v(" "), _c('span', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.more_incomplete_task_spinner),
      expression: "more_incomplete_task_spinner"
    }],
    staticClass: "cpm-incomplete-task-spinner cpm-spinner"
  })]) : _vm._e()], 2)]), _vm._v(" "), _c('div', {
    staticClass: "cpm-completed-tasks"
  }, [_vm._m(1), _vm._v(" "), _c('ul', {
    staticClass: "cpm-completed-task-list cpm-todos cpm-todolist-content cpm-todo-completed"
  }, [_vm._l((_vm.getCompletedTask), function(task, task_index) {
    return _c('li', {
      key: task.ID,
      staticClass: "cpm-todo",
      class: 'cpm-todo cpm-fade-out-' + task.ID,
      attrs: {
        "data-id": task.ID,
        "data-order": task.menu_order
      }
    }, [_c('div', {
      staticClass: "cpm-todo-wrap clearfix"
    }, [_c('div', {
      staticClass: "cpm-todo-content"
    }, [_c('div', [_c('div', {
      staticClass: "cpm-col-6"
    }, [_c('input', {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: (task.completed),
        expression: "task.completed"
      }],
      attrs: {
        "type": "checkbox",
        "value": "",
        "name": ""
      },
      domProps: {
        "checked": Array.isArray(task.completed) ? _vm._i(task.completed, "") > -1 : (task.completed)
      },
      on: {
        "click": function($event) {
          _vm.taskDoneUndone(task, task.completed, task_index)
        },
        "__c": function($event) {
          var $$a = task.completed,
            $$el = $event.target,
            $$c = $$el.checked ? (true) : (false);
          if (Array.isArray($$a)) {
            var $$v = "",
              $$i = _vm._i($$a, $$v);
            if ($$el.checked) {
              $$i < 0 && (task.completed = $$a.concat($$v))
            } else {
              $$i > -1 && (task.completed = $$a.slice(0, $$i).concat($$a.slice($$i + 1)))
            }
          } else {
            task.completed = $$c
          }
        }
      }
    }), _vm._v(" "), _c('span', {
      staticClass: "task-title"
    }, [(_vm.is_single_list) ? _c('span', [_c('router-link', {
      attrs: {
        "exact": "",
        "to": {
          name: 'list_task_single_under_todo',
          params: {
            list_id: _vm.list.ID,
            task_id: task.ID,
            task: task
          }
        }
      }
    }, [_c('span', {
      staticClass: "cpm-todo-text"
    }, [_vm._v(_vm._s(task.post_title))])])], 1) : _c('span', [_c('router-link', {
      attrs: {
        "exact": "",
        "to": {
          name: 'task_single_under_todo_lists',
          params: {
            list_id: _vm.list.ID,
            task_id: task.ID,
            task: task
          }
        }
      }
    }, [_c('span', {
      staticClass: "cpm-todo-text"
    }, [_vm._v(_vm._s(task.post_title))])])], 1), _vm._v(" "), _c('span', {
      class: _vm.privateClass(task)
    })]), _vm._v(" "), _vm._l((_vm.getUsers(task.assigned_to)), function(user) {
      return _c('span', {
        key: user.ID,
        staticClass: "cpm-assigned-user",
        domProps: {
          "innerHTML": _vm._s(user.user_url)
        }
      })
    }), _vm._v(" "), _c('span', {
      class: _vm.completedTaskWrap(task.start_date, task.due_date)
    }, [(_vm.task_start_field) ? _c('span', [_vm._v(_vm._s(_vm.dateFormat(task.start_date)))]) : _vm._e(), _vm._v(" "), (_vm.isBetweenDate(_vm.task_start_field, task.start_date, task.due_date)) ? _c('span', [_vm._v("–")]) : _vm._e(), _vm._v(" "), _c('span', [_vm._v(_vm._s(_vm.dateFormat(task.due_date)))])])], 2), _vm._v(" "), _c('div', {
      staticClass: "cpm-col-5"
    }, [_c('span', {
      staticClass: "cpm-comment-count"
    }, [_c('a', {
      attrs: {
        "href": "#"
      }
    }, [_vm._v("\n\t                                        " + _vm._s(task.comment_count) + "\n\t                                    ")])])]), _vm._v(" "), _c('div', {
      staticClass: "cpm-col-1 cpm-todo-action-right cpm-last-col"
    }, [_c('a', {
      staticClass: "cpm-todo-delete",
      attrs: {
        "href": "#"
      },
      on: {
        "click": function($event) {
          $event.preventDefault();
          _vm.deleteTask(task.post_parent, task.ID)
        }
      }
    }, [_c('span', {
      staticClass: "dashicons dashicons-trash"
    })])]), _vm._v(" "), _c('div', {
      staticClass: "clearfix"
    })])]), _vm._v(" "), (task.edit_mode) ? _c('div', {
      staticClass: "cpm-todo-form"
    }, [_c('new-task-form', {
      attrs: {
        "task": task,
        "task_index": task_index,
        "list": _vm.list,
        "list_index": _vm.index
      }
    })], 1) : _vm._e()])])
  }), _vm._v(" "), (!_vm.getCompletedTask.length) ? _c('li', {
    staticClass: "nonsortable"
  }, [_vm._v("No completed tasks.")]) : _vm._e(), _vm._v(" "), (_vm.complete_show_load_more_btn) ? _c('li', {
    staticClass: "nonsortable"
  }, [_c('a', {
    attrs: {
      "href": "#"
    },
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.loadMoreCompleteTasks(_vm.list)
      }
    }
  }, [_vm._v("More Tasks")]), _vm._v(" "), _c('span', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.more_completed_task_spinner),
      expression: "more_completed_task_spinner"
    }],
    staticClass: "cpm-completed-task-spinner cpm-spinner"
  })]) : _vm._e()], 2)]), _vm._v(" "), (_vm.list.show_task_form) ? _c('div', {
    staticClass: "cpm-todo-form"
  }, [_c('new-task-form', {
    attrs: {
      "task": {},
      "task_index": _vm.task_index,
      "list": _vm.list,
      "list_index": _vm.index
    }
  })], 1) : _vm._e()]) : _c('div', [_c('div', {
    staticClass: "cpm-incomplete-tasks"
  }, [_c('ul', {
    staticClass: "cpm-todos cpm-todolist-content cpm-incomplete-task"
  }, [(_vm.loading_incomplete_tasks) ? _c('li', {
    staticClass: "nonsortable"
  }, [_vm._m(2)]) : _vm._e(), _vm._v(" "), _vm._l((_vm.getIncompleteTasks), function(task, task_index) {
    return _c('li', {
      key: task.ID,
      staticClass: "cpm-todo",
      class: 'cpm-fade-out-' + task.ID,
      attrs: {
        "data-id": task.ID,
        "data-order": task.menu_order
      }
    }, [_c('div', {
      staticClass: "cpm-todo-wrap clearfix"
    }, [_c('div', {
      staticClass: "cpm-todo-content"
    }, [_c('div', [_c('div', {
      staticClass: "cpm-col-7"
    }, [_c('input', {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: (task.completed),
        expression: "task.completed"
      }],
      attrs: {
        "disabled": !_vm.is_assigned(task),
        "type": "checkbox",
        "value": "",
        "name": ""
      },
      domProps: {
        "checked": Array.isArray(task.completed) ? _vm._i(task.completed, "") > -1 : (task.completed)
      },
      on: {
        "click": function($event) {
          _vm.taskDoneUndone(task, task.completed)
        },
        "__c": function($event) {
          var $$a = task.completed,
            $$el = $event.target,
            $$c = $$el.checked ? (true) : (false);
          if (Array.isArray($$a)) {
            var $$v = "",
              $$i = _vm._i($$a, $$v);
            if ($$el.checked) {
              $$i < 0 && (task.completed = $$a.concat($$v))
            } else {
              $$i > -1 && (task.completed = $$a.slice(0, $$i).concat($$a.slice($$i + 1)))
            }
          } else {
            task.completed = $$c
          }
        }
      }
    }), _vm._v(" "), (_vm.is_single_list) ? _c('span', [_c('router-link', {
      attrs: {
        "to": {
          name: 'lists_single_task',
          params: {
            list_id: _vm.list.ID,
            task_id: task.ID,
            project_id: 1,
            task: task
          }
        }
      }
    }, [_vm._v("\n\n\t                                    \t" + _vm._s(task.post_title) + "\n\t                                \t")])], 1) : _c('span', [_c('router-link', {
      attrs: {
        "exact": "",
        "to": {
          name: 'lists_single_task',
          params: {
            list_id: _vm.list.ID,
            task_id: task.ID,
            project_id: 1,
            task: task
          }
        }
      }
    }, [_vm._v("\n\n\t                                    \t" + _vm._s(task.post_title) + "\n\t                                    ")])], 1), _vm._v(" "), _c('span', {
      class: _vm.privateClass(task)
    }), _vm._v(" "), _vm._l((_vm.getUsers(task.assigned_to)), function(user) {
      return _c('span', {
        key: user.ID,
        staticClass: "cpm-assigned-user",
        domProps: {
          "innerHTML": _vm._s(user.user_url)
        }
      })
    }), _vm._v(" "), _c('span', {
      class: _vm.taskDateWrap(task.start_date, task.due_date)
    }, [(_vm.task_start_field) ? _c('span', [_vm._v(_vm._s(_vm.dateFormat(task.start_date)))]) : _vm._e(), _vm._v(" "), (_vm.isBetweenDate(_vm.task_start_field, task.start_date, task.due_date)) ? _c('span', [_vm._v("–")]) : _vm._e(), _vm._v(" "), _c('span', [_vm._v(_vm._s(_vm.dateFormat(task.due_date)))])])], 2), _vm._v(" "), _c('div', {
      staticClass: "cpm-col-4 cpm-todo-action-center"
    }, [_c('div', {
      staticClass: "cpm-task-comment"
    }, [(_vm.is_single_list) ? _c('span', [_c('router-link', {
      attrs: {
        "to": {
          name: 'list_task_single_under_todo',
          params: {
            list_id: _vm.list.ID,
            task_id: task.ID,
            task: task
          }
        }
      }
    }, [_c('span', {
      staticClass: "cpm-comment-count"
    }, [_vm._v("\n\t                                                " + _vm._s(task.comments.length) + "\n\t                                            ")])])], 1) : _c('span', [_c('router-link', {
      attrs: {
        "exact": "",
        "to": {
          name: 'task_single_under_todo_lists',
          params: {
            list_id: _vm.list.ID,
            task_id: task.ID,
            task: task
          }
        }
      }
    }, [_c('span', {
      staticClass: "cpm-comment-count"
    }, [_vm._v("\n\t                                                " + _vm._s(task.comments.length) + "\n\t                                            ")])])], 1)])]), _vm._v(" "), (task.can_del_edit) ? _c('div', {
      staticClass: "cpm-col-1 cpm-todo-action-right cpm-last-col"
    }, [_c('a', {
      staticClass: "cpm-todo-delete",
      attrs: {
        "href": "#"
      },
      on: {
        "click": function($event) {
          $event.preventDefault();
          _vm.deleteTask(task.post_parent, task.ID)
        }
      }
    }, [_c('span', {
      staticClass: "dashicons dashicons-trash"
    })]), _vm._v(" "), _c('a', {
      staticClass: "cpm-todo-edit",
      attrs: {
        "href": "#"
      },
      on: {
        "click": function($event) {
          $event.preventDefault();
          _vm.taskEdit(task.ID)
        }
      }
    }, [_c('span', {
      staticClass: "dashicons dashicons-edit"
    })])]) : _vm._e(), _vm._v(" "), _c('div', {
      staticClass: "clearfix"
    })])]), _vm._v(" "), (task.edit_mode) ? _c('div', {
      staticClass: "cpm-todo-form"
    }, [_c('new-task-form', {
      attrs: {
        "task": task,
        "task_index": task_index,
        "list": _vm.list,
        "list_index": _vm.index
      }
    })], 1) : _vm._e()])])
  }), _vm._v(" "), (!_vm.getIncompleteTasks.length) ? _c('li', {
    staticClass: "nonsortable"
  }, [_vm._v("No tasks found.")]) : _vm._e(), _vm._v(" "), (_vm.list.show_task_form) ? _c('li', {
    staticClass: "cpm-todo-form nonsortable"
  }, [_c('new-task-form', {
    attrs: {
      "task": {},
      "task_index": _vm.task_index,
      "list": _vm.list,
      "list_index": _vm.index
    }
  })], 1) : _vm._e(), _vm._v(" "), (_vm.incomplete_show_load_more_btn) ? _c('li', {
    staticClass: "nonsortable"
  }, [_c('a', {
    attrs: {
      "href": "#"
    },
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.loadMoreIncompleteTasks(_vm.list)
      }
    }
  }, [_vm._v("More Tasks")]), _vm._v(" "), _c('span', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.more_incomplete_task_spinner),
      expression: "more_incomplete_task_spinner"
    }],
    staticClass: "cpm-incomplete-task-spinner cpm-spinner"
  })]) : _vm._e()], 2)]), _vm._v(" "), _c('div', {
    staticClass: "cpm-completed-tasks"
  }, [(_vm.is_single_list) ? _c('ul', {
    staticClass: "cpm-todos cpm-todolist-content cpm-todo-completed"
  }, [_vm._l((_vm.getCompletedTask), function(task, task_index) {
    return _c('li', {
      key: task.ID,
      class: 'cpm-todo cpm-fade-out-' + task.ID,
      attrs: {
        "data-id": task.ID,
        "data-order": task.menu_order
      }
    }, [_c('div', {
      staticClass: "cpm-todo-wrap clearfix"
    }, [_c('div', {
      staticClass: "cpm-todo-content"
    }, [_c('div', [_c('div', {
      staticClass: "cpm-col-7"
    }, [_c('input', {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: (task.completed),
        expression: "task.completed"
      }],
      attrs: {
        "type": "checkbox",
        "value": "",
        "name": ""
      },
      domProps: {
        "checked": Array.isArray(task.completed) ? _vm._i(task.completed, "") > -1 : (task.completed)
      },
      on: {
        "click": function($event) {
          _vm.taskDoneUndone(task, task.completed, task_index)
        },
        "__c": function($event) {
          var $$a = task.completed,
            $$el = $event.target,
            $$c = $$el.checked ? (true) : (false);
          if (Array.isArray($$a)) {
            var $$v = "",
              $$i = _vm._i($$a, $$v);
            if ($$el.checked) {
              $$i < 0 && (task.completed = $$a.concat($$v))
            } else {
              $$i > -1 && (task.completed = $$a.slice(0, $$i).concat($$a.slice($$i + 1)))
            }
          } else {
            task.completed = $$c
          }
        }
      }
    }), _vm._v(" "), _c('span', {
      staticClass: "task-title"
    }, [(_vm.is_single_list) ? _c('span', [_c('router-link', {
      attrs: {
        "exact": "",
        "to": {
          name: 'list_task_single_under_todo',
          params: {
            list_id: _vm.list.ID,
            task_id: task.ID,
            task: task
          }
        }
      }
    }, [_c('span', {
      staticClass: "cpm-todo-text"
    }, [_vm._v(_vm._s(task.post_title))])])], 1) : _c('span', [_c('router-link', {
      attrs: {
        "exact": "",
        "to": {
          name: 'task_single_under_todo_lists',
          params: {
            list_id: _vm.list.ID,
            task_id: task.ID,
            task: task
          }
        }
      }
    }, [_c('span', {
      staticClass: "cpm-todo-text"
    }, [_vm._v(_vm._s(task.post_title))])])], 1), _vm._v(" "), _c('span', {
      class: _vm.privateClass(task)
    })]), _vm._v(" "), _vm._l((_vm.getUsers(task.assigned_to)), function(user) {
      return _c('span', {
        key: user.ID,
        staticClass: "cpm-assigned-user",
        domProps: {
          "innerHTML": _vm._s(user.user_url)
        }
      })
    }), _vm._v(" "), _c('span', {
      class: _vm.completedTaskWrap(task.start_date, task.due_date)
    }, [(_vm.task_start_field) ? _c('span', [_vm._v(_vm._s(_vm.dateFormat(task.start_date)))]) : _vm._e(), _vm._v(" "), (_vm.isBetweenDate(_vm.task_start_field, task.start_date, task.due_date)) ? _c('span', [_vm._v("–")]) : _vm._e(), _vm._v(" "), _c('span', [_vm._v(_vm._s(_vm.dateFormat(task.due_date)))])])], 2), _vm._v(" "), _c('div', {
      staticClass: "cpm-col-4"
    }, [_c('span', {
      staticClass: "cpm-comment-count"
    }, [_c('a', {
      attrs: {
        "href": "#"
      }
    }, [_vm._v("\n\t                                        " + _vm._s(task.comment_count) + "\n\t                                    ")])])]), _vm._v(" "), _c('div', {
      staticClass: "cpm-col-1 cpm-todo-action-right cpm-last-col"
    }, [_c('a', {
      staticClass: "cpm-todo-delete",
      attrs: {
        "href": "#"
      },
      on: {
        "click": function($event) {
          $event.preventDefault();
          _vm.deleteTask(task.post_parent, task.ID)
        }
      }
    }, [_c('span', {
      staticClass: "dashicons dashicons-trash"
    })])]), _vm._v(" "), _c('div', {
      staticClass: "clearfix"
    })]), _vm._v(" "), _vm._m(3, true)]), _vm._v(" "), (task.edit_mode) ? _c('div', {
      staticClass: "cpm-todo-form"
    }, [_c('new-task-form', {
      attrs: {
        "task": task,
        "task_index": task_index,
        "list": _vm.list,
        "list_index": _vm.index
      }
    })], 1) : _vm._e()])])
  }), _vm._v(" "), (!_vm.getCompletedTask.length) ? _c('li', {
    staticClass: "nonsortable"
  }, [_vm._v("No completed tasks.")]) : _vm._e(), _vm._v(" "), (_vm.complete_show_load_more_btn) ? _c('li', {
    staticClass: "nonsortable"
  }, [_c('a', {
    attrs: {
      "href": "#"
    },
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.loadMoreCompleteTasks(_vm.list)
      }
    }
  }, [_vm._v("More Tasks")]), _vm._v(" "), _c('span', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.more_completed_task_spinner),
      expression: "more_completed_task_spinner"
    }],
    staticClass: "cpm-completed-task-spinner cpm-spinner"
  })]) : _vm._e()], 2) : _vm._e()])])])
}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('h3', {
    staticClass: "cpm-task-list-title cpm-tag-gray"
  }, [_c('a', [_vm._v("Incomplete Tasks")])])
},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('h3', {
    staticClass: "cpm-task-list-title cpm-tag-gray"
  }, [_c('a', [_vm._v("Completed Tasks")])])
},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "cpm-data-load-before"
  }, [_c('div', {
    staticClass: "loadmoreanimation"
  }, [_c('div', {
    staticClass: "load-spinner"
  }, [_c('div', {
    staticClass: "rect1"
  }), _vm._v(" "), _c('div', {
    staticClass: "rect2"
  }), _vm._v(" "), _c('div', {
    staticClass: "rect3"
  }), _vm._v(" "), _c('div', {
    staticClass: "rect4"
  }), _vm._v(" "), _c('div', {
    staticClass: "rect5"
  })])])])
},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "cpm-col-12"
  }, [_c('div', {
    staticClass: "cpm-todo-details"
  })])
}]
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-52cdc098", esExports)
  }
}

/***/ }),

/***/ 94:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vue_vue__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vue_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__vue_vue__);
//
//
//
//
//
//
//
//
//
//
//
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
	props: ['files'],

	// Initial action for this component
	created: function () {
		this.$on('cpm_file_upload_hook', this.fileUploaded);

		var self = this;

		// Instantiate file upload, After dom ready
		__WEBPACK_IMPORTED_MODULE_0__vue_vue___default.a.nextTick(function () {
			new CPM_Uploader('cpm-upload-pickfiles', 'cpm-upload-container', self);
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
		fileUploaded: function (file_res) {

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
		deletefile: function (file_id) {
			if (!confirm(CPM_Vars.message.confirm)) {
				return;
			}

			var request_data = {
				file_id: file_id,
				_wpnonce: CPM_Vars.nonce
			},
			    self = this;

			wp.ajax.send('cpm_delete_file', {
				data: request_data,
				success: function (res) {
					var file_index = self.getIndex(self.files, file_id, 'id');
					self.files.splice(file_index, 1);
				}
			});
		}
	}
});

/***/ }),

/***/ 95:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__text_editor_vue__ = __webpack_require__(125);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__file_uploader_vue__ = __webpack_require__(120);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
    data: function () {
        return {
            files: typeof this.comment.files == 'undefined' ? [] : this.comment.files,
            content: {
                html: typeof this.comment.comment_content == 'undefined' ? '' : this.comment.comment_content
            },
            notify_co_workers: [],
            notify_all_co_worker: false,
            show_spinner: false,
            submit_disabled: false
        };
    },

    /**
     * Observe onchange value
     */
    watch: {
        /**
         * Observed comment file change
         * 
         * @param  array new_files 
         * 
         * @return void           
         */
        files: function (new_files) {
            this.comment.files = new_files;
        },

        /**
         * Observe onchange comment message
         *
         * @param string new_content 
         * 
         * @type void
         */
        content: {
            handler: function (new_content) {
                this.comment.comment_content = new_content.html;
            },

            deep: true
        }

    },

    components: {
        'text-editor': __WEBPACK_IMPORTED_MODULE_0__text_editor_vue__["a" /* default */],
        'file-uploader': __WEBPACK_IMPORTED_MODULE_1__file_uploader_vue__["a" /* default */]
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
        editor_id: function () {
            var comment_id = typeof this.comment.comment_ID == 'undefined' ? '' : '-' + this.comment.comment_ID;
            return 'cpm-list-editor' + comment_id;
        },

        /**
         * Get current projects co-worker
         * 
         * @return object
         */
        co_workers: function () {
            return this.get_porject_users_by_role('co_worker');
        },

        /**
         * Check has co-worker in project or not
         * 
         * @return boolean
         */
        hasCoWorker: function () {
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
        updateComment: function () {
            // Prevent sending request when multiple click submit button 
            if (this.submit_disabled) {
                return;
            }

            // Make disable submit button
            this.submit_disabled = true;

            var self = this,
                is_update = typeof this.comment.comment_ID == 'undefined' ? false : true,
                form_data = {
                parent_id: typeof this.list.ID == 'undefined' ? false : this.list.ID,
                comment_id: is_update ? this.comment.comment_ID : false,
                action: is_update ? 'cpm_comment_update' : 'cpm_comment_new',
                cpm_message: this.comment.comment_content,
                cpm_attachment: this.filtersOnlyFileID(this.comment.files),
                project_id: PM_Vars.project_id,
                _wpnonce: PM_Vars.nonce
            };

            // Showing spinner    
            this.show_spinner = true;

            // Sending request for add and update comment
            jQuery.post(PM_Vars.ajaxurl, form_data, function (res) {

                self.show_spinner = false;
                self.submit_disabled = false;

                if (res.success) {

                    if (!is_update) {
                        // After getting todo list, set it to vuex state lists
                        self.$store.commit('update_todo_list_comment', {
                            list_id: self.list.ID,
                            comment: res.data.comment
                        });

                        self.files = [];
                        self.content.html = '';

                        self.$root.$emit('after_comment');
                    } else {
                        self.showHideListCommentEditForm(self.comment.comment_ID);
                    }

                    // Display a success toast, with a title
                    //toastr.success(res.data.success);
                } else {

                    // Showing error
                    res.data.error.map(function (value, index) {
                        toastr.error(value);
                    });
                }
            });
        },

        /**
         * Get files id array from file object
         * 
         * @param  object files 
         * 
         * @return array       
         */
        filtersOnlyFileID: function (files) {
            if (typeof files == 'undefined') {
                return [];
            }

            return files.map(function (file) {
                return file.id;
            });
        },

        /**
         * Check select all check box enable or disabled. for notify users
         * 
         * @param  int user_id 
         * 
         * @return void         
         */
        notify_coo_workers: function (user_id) {
            var co_worker_length = this.get_porject_users_id_by_role('co_worker').length,
                notify_co_worker_length = this.notify_co_workers.length;

            if (co_worker_length != notify_co_worker_length) {
                this.notify_all_co_worker = false;
            }

            if (co_worker_length === notify_co_worker_length) {
                this.notify_all_co_worker = true;
            }
        },

        /**
         * Is notification send all co-worker or not
         */
        notify_all_coo_worker: function () {

            if (this.notify_all_co_worker) {
                this.notify_co_workers = [];
                this.notify_co_workers = this.get_porject_users_id_by_role('co_worker');
            } else {
                this.notify_co_workers = [];
            }
        }
    }
});

/***/ }),

/***/ 96:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__list_comment_form_vue__ = __webpack_require__(121);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
        getCurrentUserAvatar: function () {
            return PM_Vars.current_user_avatar_url;
        }
    },

    methods: {
        current_user_can_edit_delete: function (comment, list) {

            if (list.can_del_edit) {
                return true;
            }

            if (comment.user_id == this.$store.state.get_current_user_id && comment.comment_type == '') {
                return true;
            }

            return false;
        }

    },

    components: {
        'list-comment-form': __WEBPACK_IMPORTED_MODULE_0__list_comment_form_vue__["a" /* default */]
    }
});

/***/ }),

/***/ 99:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__tasks_vue__ = __webpack_require__(81);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__list_comments_vue__ = __webpack_require__(122);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
            list_id: this.$route.params.list_id,
            list: this.$store.state.lists[0],
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
    created: function () {
        this.loading = false;
        this.render_tmpl = true;
        this.$store.state.is_single_list = true;
        return;
        var self = this;

        this.$store.commit('emptyTodoLists');

        // Get todo list 
        this.getList(this.$route.params.list_id, function (res) {
            self.loading = false;
        });
    },

    computed: {
        /**
         * Get todo lists from vuex store
         * 
         * @return array
         */
        lists: function () {
            return this.$store.state.lists;
        },

        /**
         * Get milestones from vuex store
         * 
         * @return array
         */
        milestones: function () {
            return this.$store.state.milestones;
        },

        /**
         * Get current project id from vuex store
         * 
         * @return int
         */
        project_id: function () {
            return this.$store.state.project_id;
        },

        /**
         * Get initial data from vuex store when this component loaded
         * 
         * @return obj
         */
        init: function () {
            return this.$store.state.init;
        },

        comments: function () {
            if (this.$store.state.lists.length) {
                return this.$store.state.lists[0].comments;
            }

            return [];
        },

        comment_list: function () {
            if (this.$store.state.lists.length) {
                return this.$store.state.lists[0];
            }

            return {};
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
        getList: function (list_id, callback) {

            var self = this,
                form_data = {
                list_id: list_id,
                action: 'cpm_get_todo_list_single',
                project_id: PM_Vars.project_id,
                _wpnonce: PM_Vars.nonce
            };

            // Sending request for getting singel todo list 
            jQuery.post(PM_Vars.ajaxurl, form_data, function (res) {

                if (res.success) {

                    // After getting todo list, set it to vuex state lists
                    self.$store.commit('update_todo_list_single', {
                        list: res.data.list,
                        permissions: res.data.permissions,
                        milestones: res.data.milestones,
                        project_users: res.data.project_users
                    });

                    self.render_tmpl = true;

                    if (typeof callback != 'undefined') {
                        callback(res);
                    }
                }
            });
        }
    },

    components: {
        tasks: __WEBPACK_IMPORTED_MODULE_0__tasks_vue__["a" /* default */],
        'list-comments': __WEBPACK_IMPORTED_MODULE_1__list_comments_vue__["a" /* default */]
    }
});

/***/ })

});