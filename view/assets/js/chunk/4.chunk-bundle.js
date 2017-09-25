webpackJsonp([4],{

/***/ 100:
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

/***/ 101:
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
     require("vue-hot-reload-api").rerender("data-v-483c3c1e", esExports)
  }
}

/***/ }),

/***/ 105:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_file_uploader_vue__ = __webpack_require__(107);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_4d9a1383_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_file_uploader_vue__ = __webpack_require__(122);
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
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_4d9a1383_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_file_uploader_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "view/assets/js/components/file-uploader.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] file-uploader.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-4d9a1383", Component.options)
  } else {
    hotAPI.reload("data-v-4d9a1383", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 106:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__text_editor_vue__ = __webpack_require__(99);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__file_uploader_vue__ = __webpack_require__(105);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
	props: ['discuss'],
	data() {
		return {
			submit_disabled: false,
			show_spinner: false,
			content: {
				html: typeof this.discuss.description == 'undefined' ? '' : this.discuss.description
			},
			milestone_id: this.discuss.milestone_id,
			files: []
		};
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
			handler: function (new_content) {
				this.discuss.description = new_content.html;
			},

			deep: true
		}
	},

	components: {
		'text-editor': __WEBPACK_IMPORTED_MODULE_0__text_editor_vue__["a" /* default */],
		'file-uploader': __WEBPACK_IMPORTED_MODULE_1__file_uploader_vue__["a" /* default */]
	},
	computed: {
		milestones() {
			return this.$store.state.milestones;
		},
		/**
         * Editor ID
         * 
         * @return string
         */
		editor_id: function () {
			var discuss_id = typeof this.discuss.id === 'undefined' ? '' : '-' + this.discuss.id;
			return 'cpm-discuss-editor' + discuss_id;
		}
	},
	methods: {}

});

/***/ }),

/***/ 107:
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
								//this.$on( 'cpm_file_upload_hook', this.fileUploaded );

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

/***/ 114:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_new_discuss_form_vue__ = __webpack_require__(106);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_602b6da4_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_new_discuss_form_vue__ = __webpack_require__(124);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_new_discuss_form_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_602b6da4_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_new_discuss_form_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "view/assets/js/components/discussions/new-discuss-form.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] new-discuss-form.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-602b6da4", Component.options)
  } else {
    hotAPI.reload("data-v-602b6da4", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 12:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_individual_discussions_vue__ = __webpack_require__(130);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_38b28927_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_individual_discussions_vue__ = __webpack_require__(186);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_individual_discussions_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_38b28927_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_individual_discussions_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "view/assets/js/components/discussions/individual-discussions.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] individual-discussions.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-38b28927", Component.options)
  } else {
    hotAPI.reload("data-v-38b28927", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),

/***/ 122:
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
  })), _vm._v("\n        To attach, "), _c('a', {
    attrs: {
      "id": "cpm-upload-pickfiles",
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
     require("vue-hot-reload-api").rerender("data-v-4d9a1383", esExports)
  }
}

/***/ }),

/***/ 124:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('form', {
    staticClass: "cpm-message-form",
    on: {
      "submit": function($event) {
        $event.preventDefault();
        _vm.newDiscuss()
      }
    }
  }, [_c('div', {
    staticClass: "item title"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.discuss.title),
      expression: "discuss.title"
    }],
    attrs: {
      "name": "title",
      "required": "required",
      "type": "text",
      "id": "message_title",
      "value": "",
      "placeholder": "Enter message title"
    },
    domProps: {
      "value": (_vm.discuss.title)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.discuss.title = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "item detail"
  }, [_c('text-editor', {
    attrs: {
      "editor_id": _vm.editor_id,
      "content": _vm.content
    }
  })], 1), _vm._v(" "), _c('div', {
    staticClass: "item milestone"
  }, [_c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.discuss.milestone_id),
      expression: "discuss.milestone_id"
    }],
    on: {
      "change": function($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
          return o.selected
        }).map(function(o) {
          var val = "_value" in o ? o._value : o.value;
          return val
        });
        _vm.discuss.milestone_id = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
      }
    }
  }, [_c('option', {
    attrs: {
      "value": "-1"
    }
  }, [_vm._v("\n\t\t\t            - Milestone -\n\t\t\t        ")]), _vm._v(" "), _vm._l((_vm.milestones), function(milestone) {
    return _c('option', {
      domProps: {
        "value": milestone.id
      }
    }, [_vm._v("\n\t\t\t            " + _vm._s(milestone.title) + "\n\t\t\t        ")])
  })], 2)]), _vm._v(" "), _c('file-uploader', {
    attrs: {
      "files": _vm.files
    }
  }), _vm._v(" "), _vm._m(0), _vm._v(" "), _c('div', {
    staticClass: "submit"
  }, [_c('input', {
    staticClass: "button-primary",
    attrs: {
      "type": "submit",
      "name": "create_message",
      "id": "create_message",
      "value": "Add Message"
    }
  }), _vm._v(" "), _c('a', {
    staticClass: "message-cancel button-secondary",
    attrs: {
      "href": ""
    },
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.showHideDiscussForm(false, _vm.discuss)
      }
    }
  }, [_vm._v("Cancel")])]), _vm._v(" "), _c('div', {
    staticClass: "cpm-loading",
    staticStyle: {
      "display": "none"
    }
  }, [_vm._v("Saving...")])], 1)])
}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "notify-users"
  }, [_c('h2', {
    staticClass: "cpm-box-title"
  }, [_vm._v(" \n\t        \t\tNotify users            \n\t        \t\t"), _c('label', {
    staticClass: "cpm-small-title",
    attrs: {
      "for": "select-all"
    }
  }, [_c('input', {
    staticClass: "cpm-toggle-checkbox",
    attrs: {
      "type": "checkbox",
      "name": "select-all",
      "id": "select-all"
    }
  }), _vm._v(" \n\t        \t\t\tSelect all\n\t        \t\t")])]), _vm._v(" "), _c('ul', {
    staticClass: "cpm-user-list"
  }, [_c('li', [_c('label', {
    attrs: {
      "for": "cpm_notify_1"
    }
  }, [_c('input', {
    attrs: {
      "type": "checkbox",
      "name": "notify_user[]",
      "id": "cpm_notify_1",
      "value": "1"
    }
  }), _vm._v(" \n\t\t            \t\tAdmin\n\t\t            \t")])]), _vm._v(" "), _c('div', {
    staticClass: "clearfix"
  })])])
}]
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-602b6da4", esExports)
  }
}

/***/ }),

/***/ 128:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__text_editor_vue__ = __webpack_require__(99);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__file_uploader_vue__ = __webpack_require__(105);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
    props: ['comment', 'discuss'],
    data() {
        return {
            content: {
                html: typeof this.comment.content == 'undefined' ? '' : this.comment.content
            },
            submit_disabled: false,
            show_spinner: false,
            files: []
        };
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
            handler: function (new_content) {
                this.comment.content = new_content.html;
            },

            deep: true
        }
    },

    components: {
        'text-editor': __WEBPACK_IMPORTED_MODULE_0__text_editor_vue__["a" /* default */],
        'file-uploader': __WEBPACK_IMPORTED_MODULE_1__file_uploader_vue__["a" /* default */]
    },

    computed: {
        /**
               * Editor ID
               * 
               * @return string
               */
        editor_id: function () {
            var comment_id = typeof this.comment.commentable_id === 'undefined' ? '' : '-' + this.comment.commentable_id;
            return 'cpm-comment-editor' + comment_id;
        }
    }
});

/***/ }),

/***/ 130:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__header_vue__ = __webpack_require__(97);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__new_discuss_form_vue__ = __webpack_require__(114);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__comment_form_vue__ = __webpack_require__(158);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
            vm.getDiscuss(vm);
            vm.getMilestones(vm);
        });
    },
    computed: {
        discuss() {
            if (this.$store.state.discussion.length) {
                return this.$store.state.discussion[0];
            }

            return {};
        },
        comments() {
            if (this.$store.state.discussion.length) {
                return this.$store.state.discussion[0].comments.data;
            }
            return [];
        },

        commentsTotal() {
            if (this.$store.state.discussion.length) {
                return this.$store.state.discussion[0].comments.meta.pagination.total;
            }
            return 0;
        }
    },
    components: {
        'pm-header': __WEBPACK_IMPORTED_MODULE_0__header_vue__["a" /* default */],
        'new-discuss-form': __WEBPACK_IMPORTED_MODULE_1__new_discuss_form_vue__["a" /* default */],
        'comment-form': __WEBPACK_IMPORTED_MODULE_2__comment_form_vue__["a" /* default */]
    }
});

/***/ }),

/***/ 158:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_comment_form_vue__ = __webpack_require__(128);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0877f902_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_comment_form_vue__ = __webpack_require__(178);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_comment_form_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0877f902_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_comment_form_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "view/assets/js/components/discussions/comment-form.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] comment-form.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0877f902", Component.options)
  } else {
    hotAPI.reload("data-v-0877f902", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 178:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('form', {
    staticClass: "cpm-comment-form",
    on: {
      "submit": function($event) {
        $event.preventDefault();
        _vm.newComment()
      }
    }
  }, [_c('div', {
    staticClass: "item message cpm-sm-col-12 "
  }, [_c('text-editor', {
    attrs: {
      "editor_id": _vm.editor_id,
      "content": _vm.content
    }
  })], 1), _vm._v(" "), _c('file-uploader', {
    attrs: {
      "files": _vm.files
    }
  }), _vm._v(" "), _vm._m(0), _vm._v(" "), _vm._m(1), _vm._v(" "), _c('div', {
    staticClass: "cpm-loading",
    staticStyle: {
      "display": "none"
    }
  }, [_vm._v("Saving...")])], 1)
}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "notify-users"
  }, [_c('h2', {
    staticClass: "cpm-box-title"
  }, [_vm._v(" \n                Notify users            \n                "), _c('label', {
    staticClass: "cpm-small-title",
    attrs: {
      "for": "select-all"
    }
  }, [_c('input', {
    staticClass: "cpm-toggle-checkbox",
    attrs: {
      "type": "checkbox",
      "name": "select-all",
      "id": "select-all"
    }
  }), _vm._v(" \n                    Select all\n                ")])]), _vm._v(" "), _c('ul', {
    staticClass: "cpm-user-list"
  }, [_c('li', [_c('label', {
    attrs: {
      "for": "cpm_notify_1"
    }
  }, [_c('input', {
    attrs: {
      "type": "checkbox",
      "name": "notify_user[]",
      "id": "cpm_notify_1",
      "value": "1"
    }
  }), _vm._v(" \n                        Admin\n                    ")])]), _vm._v(" "), _c('div', {
    staticClass: "clearfix"
  })])])
},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "submit"
  }, [_c('input', {
    staticClass: "button-primary",
    attrs: {
      "type": "submit",
      "name": "cpm_new_comment",
      "value": "Add this comment",
      "id": ""
    }
  })])
}]
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-0877f902", esExports)
  }
}

/***/ }),

/***/ 186:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "wrap cpm cpm-front-end"
  }, [_c('pm-header'), _vm._v(" "), _c('div', {
    attrs: {
      "id": "cpm-signle-message"
    }
  }, [_c('div', {
    staticClass: "cpm-single"
  }, [_c('h3', {
    staticClass: "cpm-box-title"
  }, [_vm._v("\n                    " + _vm._s(_vm.discuss.title) + "          \n                    "), _c('span', {
    staticClass: "cpm-right cpm-edit-link"
  }, [_c('a', {
    staticClass: "cpm-msg-edit dashicons dashicons-edit",
    attrs: {
      "href": "#",
      "data-msg_id": "97",
      "data-project_id": "60"
    },
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.showHideDiscussForm('toggle', _vm.discuss)
      }
    }
  }), _vm._v(" "), _c('span', {
    staticClass: "cpm-not-private"
  })]), _vm._v(" "), _vm._m(0)]), _vm._v(" "), _c('div', {
    staticClass: "cpm-entry-detail"
  }, [_c('div', {
    domProps: {
      "innerHTML": _vm._s(_vm.discuss.description)
    }
  })]), _vm._v(" "), _c('span', {
    staticClass: "cpm-msg-edit-form"
  }, [_c('div', {
    staticClass: "cpm-message-form-wrap"
  }, [(_vm.discuss.edit_mode) ? _c('new-discuss-form', {
    attrs: {
      "discuss": _vm.discuss
    }
  }) : _vm._e()], 1)])])]), _vm._v(" "), _c('div', {
    staticClass: "cpm-comment-area cpm-box-shadow"
  }, [_c('h3', [_vm._v(" " + _vm._s(_vm.commentsTotal) + " Comments")]), _vm._v(" "), _c('ul', {
    staticClass: "cpm-comment-wrap"
  }, _vm._l((_vm.comments), function(comment) {
    return _c('li', {
      staticClass: "cpm-comment clearfix even",
      attrs: {
        "id": "cpm-comment-309"
      }
    }, [_vm._m(1, true), _vm._v(" "), _c('div', {
      staticClass: "cpm-comment-container"
    }, [_c('div', {
      staticClass: "cpm-comment-meta"
    }, [_vm._m(2, true), _vm._v("\n                            On            \n                            "), _vm._m(3, true), _vm._v(" "), _c('div', {
      staticClass: "cpm-comment-action"
    }, [_c('span', {
      staticClass: "cpm-edit-link"
    }, [_c('a', {
      staticClass: "cpm-edit-comment-link dashicons dashicons-edit ",
      attrs: {
        "href": "#",
        "data-comment_id": "309",
        "data-project_id": "60",
        "data-object_id": "97"
      },
      on: {
        "click": function($event) {
          $event.preventDefault();
          _vm.showHideCommentForm('toggle', comment)
        }
      }
    })]), _vm._v(" "), _vm._m(4, true)])]), _vm._v(" "), _c('div', {
      staticClass: "cpm-comment-content"
    }, [_c('div', {
      domProps: {
        "innerHTML": _vm._s(comment.content)
      }
    })]), _vm._v(" "), _c('div', {
      staticClass: "cpm-comment-edit-form"
    }, [(comment.edit_mode) ? _c('comment-form', {
      attrs: {
        "comment": comment,
        "discuss": _vm.discuss
      }
    }) : _vm._e()], 1)])])
  })), _vm._v(" "), _c('div', {
    staticClass: "cpm-comment-form-wrap"
  }, [_vm._m(5), _vm._v(" "), _c('comment-form', {
    attrs: {
      "comment": {},
      "discuss": _vm.discuss
    }
  })], 1)])], 1)
}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "cpm-small-title"
  }, [_vm._v("\n                        By \n                        "), _c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_task&user_id=1",
      "title": "admin"
    }
  }, [_vm._v("\n                            admin\n                        ")]), _vm._v(" on September 11, 2017  at  01:34 pm            \n                    ")])
},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "cpm-avatar "
  }, [_c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_task&user_id=1",
      "title": "admin"
    }
  }, [_c('img', {
    staticClass: "avatar avatar-48 photo",
    attrs: {
      "alt": "admin",
      "src": "//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&r=g&d=mm",
      "srcset": "//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&r=g&d=mm 2x",
      "height": "48",
      "width": "48"
    }
  })])])
},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('span', {
    staticClass: "cpm-author"
  }, [_c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_task&user_id=1",
      "title": "admin"
    }
  }, [_vm._v("\n                                    admin\n                                ")])])
},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('span', {
    staticClass: "cpm-date"
  }, [_c('time', {
    attrs: {
      "datetime": "2017-09-11T13:34:37+00:00",
      "title": "2017-09-11T13:34:37+00:00"
    }
  }, [_vm._v("September 11, 2017 1:34 pm")])])
},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('span', {
    staticClass: "cpm-delete-link"
  }, [_c('a', {
    staticClass: "cpm-delete-comment-link dashicons dashicons-trash",
    attrs: {
      "href": "#",
      "data-project_id": "60",
      "data-id": "309",
      "data-confirm": "Are you sure to delete this comment?"
    }
  })])
},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "cpm-avatar"
  }, [_c('a', {
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_task&user_id=1",
      "title": "admin"
    }
  }, [_c('img', {
    staticClass: "avatar avatar-48 photo",
    attrs: {
      "alt": "admin",
      "src": "//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&r=g&d=mm",
      "srcset": "//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&r=g&d=mm 2x",
      "height": "48",
      "width": "48"
    }
  })])])
}]
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-38b28927", esExports)
  }
}

/***/ }),

/***/ 96:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__router__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__do_action_vue__ = __webpack_require__(9);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
            menu: [{
                route: {
                    name: 'pm_overview',
                    project_id: this.project_id
                },

                name: 'Overview',
                count: 0,
                class: 'overview cpm-sm-col-12'
            }, {
                route: {
                    name: 'activities',
                    project_id: this.project_id
                },

                name: 'Activities',
                count: 10,
                class: 'activity cpm-sm-col-12'
            }, {
                route: {
                    name: 'discussions',
                    project_id: this.project_id
                },

                name: 'Discussions',
                count: 40,
                class: 'message cpm-sm-col-12'
            }, {
                route: {
                    name: 'task_lists',
                    project_id: this.project_id
                },

                name: 'Task Lists',
                count: 30,
                class: 'to-do-list cpm-sm-col-12 active'
            }, {
                route: {
                    name: 'milestones',
                    project_id: this.project_id
                },

                name: 'Milestones',
                count: 25,
                class: 'milestone cpm-sm-col-12'
            }, {
                route: {
                    name: 'pm_files',
                    project_id: this.project_id
                },

                name: 'Files',
                count: 50,
                class: 'files cpm-sm-col-12'
            }]
        };
    },

    created() {
        this.getProject();
    },

    components: {
        'do-action': __WEBPACK_IMPORTED_MODULE_1__do_action_vue__["a" /* default */]
    }
});

/***/ }),

/***/ 97:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_header_vue__ = __webpack_require__(96);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_46bc394e_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_header_vue__ = __webpack_require__(98);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_header_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_46bc394e_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_header_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "view/assets/js/components/header.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] header.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-46bc394e", Component.options)
  } else {
    hotAPI.reload("data-v-46bc394e", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 98:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "cpm-top-bar cpm-no-padding cpm-project-header cpm-project-head"
  }, [_vm._m(0), _vm._v(" "), _c('div', {
    staticClass: "cpm-row cpm-project-group"
  }, [_c('ul', [_vm._l((_vm.menu), function(item) {
    return _c('li', [_c('router-link', {
      class: item.class,
      attrs: {
        "to": item.route
      }
    }, [_c('span', [_vm._v(_vm._s(item.name))]), _vm._v(" "), _c('div', [_vm._v(_vm._s(item.count))])])], 1)
  }), _vm._v(" "), _c('do-action', {
    attrs: {
      "hook": "pm-header"
    }
  })], 2)]), _vm._v(" "), _c('div', {
    staticClass: "clearfix"
  })])
}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "cpm-row cpm-no-padding cpm-border-bottom"
  }, [_c('div', {
    staticClass: "cpm-col-6 cpm-project-detail"
  }, [_c('h3', [_c('span', {
    staticClass: "cpm-project-title"
  }, [_vm._v(" eirugkdj ")]), _vm._v(" "), _c('a', {
    staticClass: "cpm-icon-edit cpm-project-edit-link small-text",
    attrs: {
      "href": "#"
    }
  }, [_c('span', {
    staticClass: "dashicons dashicons-edit"
  }), _vm._v(" "), _c('span', {
    staticClass: "text"
  }, [_vm._v("Edit")])])]), _vm._v(" "), _c('div', {
    staticClass: "detail"
  })]), _vm._v(" "), _c('div', {
    staticClass: "cpm-col-6 cpm-last-col cpm-top-right-btn cpm-text-right show_desktop_only"
  }, [_c('div', {
    staticClass: "cpm-single-project-search-wrap"
  }, [_c('input', {
    attrs: {
      "type": "text",
      "data-project_id": "60",
      "placeholder": "Search...",
      "id": "cpm-single-project-search"
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "cpm-project-action"
  }, [_c('span', {
    staticClass: "dashicons dashicons-admin-generic cpm-settings-bind"
  }), _vm._v(" "), _c('ul', {
    staticClass: "cpm-settings"
  }, [_c('li', [_c('span', {
    staticClass: "cpm-spinner"
  }), _vm._v(" "), _c('a', {
    staticClass: "cpm-project-delete-link",
    attrs: {
      "href": "http://localhost/test/wp-admin/admin.php?page=cpm_projects",
      "title": "Delete project",
      "data-confirm": "Are you sure to delete this project?",
      "data-project_id": "60"
    }
  }, [_c('span', {
    staticClass: "dashicons dashicons-trash"
  }), _vm._v(" "), _c('span', [_vm._v("Delete")])])]), _vm._v(" "), _c('li', [_c('span', {
    staticClass: "cpm-spinner"
  }), _vm._v(" "), _c('a', {
    staticClass: "cpm-archive",
    attrs: {
      "data-type": "archive",
      "data-project_id": "60",
      "href": "#"
    }
  }, [_c('span', {
    staticClass: "dashicons dashicons-yes"
  }), _vm._v(" "), _c('span', [_vm._v("Complete")])])]), _vm._v(" "), _c('li', [_c('span', {
    staticClass: "cpm-spinner"
  }), _vm._v(" "), _c('a', {
    staticClass: "cpm-duplicate-project",
    attrs: {
      "href": "/test/wp-admin/admin.php?page=cpm_projects&tab=project&action=overview&pid=60",
      "data-project_id": "60"
    }
  }, [_c('span', {
    staticClass: "dashicons dashicons-admin-page"
  }), _vm._v(" "), _c('span', [_vm._v("Duplicate")])])])])])]), _vm._v(" "), _c('div', {
    staticClass: "clearfix"
  }), _vm._v(" "), _c('div', {
    staticClass: "cpm-edit-project",
    staticStyle: {
      "display": "none"
    }
  }, [_c('form', {
    staticClass: "cpm-project-form",
    attrs: {
      "action": "",
      "method": "post"
    }
  }, [_c('input', {
    attrs: {
      "type": "hidden",
      "id": "_wpnonce",
      "name": "_wpnonce",
      "value": "9dd08c1e0f"
    }
  }), _vm._v(" "), _c('input', {
    attrs: {
      "type": "hidden",
      "name": "_wp_http_referer",
      "value": "/test/wp-admin/admin.php?page=cpm_projects&tab=project&action=overview&pid=60"
    }
  }), _vm._v(" "), _c('div', {
    staticClass: "cpm-form-item project-name"
  }, [_c('input', {
    attrs: {
      "type": "text",
      "name": "project_name",
      "id": "project_name",
      "placeholder": "Name of the project",
      "value": "eirugkdj",
      "size": "45"
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "cpm-form-item project-category"
  }, [_c('select', {
    staticClass: "chosen-select",
    attrs: {
      "name": "project_cat",
      "id": "project_cat"
    }
  }, [_c('option', {
    attrs: {
      "value": "-1",
      "selected": "selected"
    }
  }, [_vm._v("– Project Category –")])])]), _vm._v(" "), _c('div', {
    staticClass: "cpm-form-item project-detail"
  }, [_c('textarea', {
    staticClass: "cpm-project-description",
    attrs: {
      "name": "project_description",
      "id": "",
      "cols": "50",
      "rows": "3",
      "placeholder": "Some details about the project (optional)"
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "cpm-form-item cpm-project-role"
  }, [_c('table')]), _vm._v(" "), _c('div', {
    staticClass: "cpm-form-item project-users"
  }, [_c('input', {
    staticClass: "cpm-project-coworker",
    attrs: {
      "type": "text",
      "name": "",
      "placeholder": "Type 3 or more characters to search users...",
      "size": "45"
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "cpm-form-item project-notify"
  }, [_c('input', {
    attrs: {
      "type": "hidden",
      "name": "project_notify",
      "value": "no"
    }
  }), _vm._v(" "), _c('label', [_c('input', {
    attrs: {
      "type": "checkbox",
      "name": "project_notify",
      "id": "project-notify",
      "value": "yes"
    }
  }), _vm._v("\n                        Notify Co-Workers            \n                    ")])]), _vm._v(" "), _c('div', {
    staticClass: "submit"
  }, [_c('input', {
    attrs: {
      "type": "hidden",
      "name": "project_id",
      "value": "60"
    }
  }), _vm._v(" "), _c('input', {
    attrs: {
      "type": "hidden",
      "name": "action",
      "value": "cpm_project_update"
    }
  }), _vm._v(" "), _c('span', {
    staticClass: "cpm-pro-update-spinner"
  }), _vm._v(" "), _c('input', {
    staticClass: "button-primary",
    attrs: {
      "type": "submit",
      "name": "add_project",
      "id": "add_project",
      "value": "Update Project"
    }
  }), _vm._v(" "), _c('a', {
    staticClass: "button project-cancel",
    attrs: {
      "href": "#"
    }
  }, [_vm._v("Cancel")])]), _vm._v(" "), _c('div', {
    staticClass: "cpm-loading",
    staticStyle: {
      "display": "none"
    }
  }, [_vm._v("Saving...")])])])])
}]
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-46bc394e", esExports)
  }
}

/***/ }),

/***/ 99:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_text_editor_vue__ = __webpack_require__(100);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_483c3c1e_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_text_editor_vue__ = __webpack_require__(101);
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
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_483c3c1e_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_text_editor_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "view/assets/js/components/text-editor.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] text-editor.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-483c3c1e", Component.options)
  } else {
    hotAPI.reload("data-v-483c3c1e", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ })

});