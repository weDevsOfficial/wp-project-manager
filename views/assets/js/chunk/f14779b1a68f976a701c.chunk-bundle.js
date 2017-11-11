wedevsPmWebpack([11],{

/***/ 150:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_text_editor_vue__ = __webpack_require__(151);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_ca7d7328_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_text_editor_vue__ = __webpack_require__(152);
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

/***/ 151:
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
    created: function () {
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

/***/ 152:
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

/***/ 154:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_file_uploader_vue__ = __webpack_require__(155);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_5b9b7584_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_file_uploader_vue__ = __webpack_require__(157);
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

/***/ 155:
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
	created: function () {
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

/***/ 157:
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

/***/ 32:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_single_task_vue__ = __webpack_require__(477);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0b94f842_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_single_task_vue__ = __webpack_require__(546);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(575)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_single_task_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0b94f842_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_single_task_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/components/project-task-lists/single-task.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0b94f842", Component.options)
  } else {
    hotAPI.reload("data-v-0b94f842", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),

/***/ 477:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__task_comments_vue__ = __webpack_require__(545);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
			vm.getTask(vm);
		});
	},
	data: function () {
		return {
			loading: true,
			is_task_title_edit_mode: false,
			is_task_details_edit_mode: false,
			is_task_date_edit_mode: false,
			is_enable_multi_select: false,
			task_id: this.$route.params.task_id,
			list: {},
			task: {},
			assigned_to: []
		};
	},

	computed: {
		// task () {
		// 	return this.$store.state.task;
		// },
		project_users: function () {
			return this.$root.$store.state.project_users;
		},
		task_users() {
			if (jQuery.isEmptyObject(this.$store.state.task)) {
				return [];
			}
			return this.$store.state.task.assignees.data;
		},

		// comments () {
		// 	if (jQuery.isEmptyObject(this.$store.state.task)) {
		// 		return [];
		// 	}

		// 	return this.$store.state.task.comments.data;
		// },

		/**
   * Get and Set task users
   */
		task_assign: {
			/**
    * Filter only current task assgin user from vuex state project_users
    *
    * @return array
    */
			get: function () {
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
			set: function (selected_users) {
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
		'multiselect': pm.Multiselect
	},

	created: function () {
		window.addEventListener('click', this.windowActivity);

		this.$root.$on('pm_date_picker', this.fromDate);
	},

	methods: {
		lineThrough(task) {
			if (task.status) {
				return 'pm-line-through';
			}
		},
		singleTaskDoneUndone: function () {

			var self = this;
			var url = self.base_url + '/pm/v2/projects/' + self.project_id + '/tasks/' + self.task.id;
			var type = 'PUT';

			var form_data = {
				'status': self.task.status ? 1 : 0
			};

			var request_data = {
				url: url,
				type: type,
				data: form_data,
				success(res) {}
			};

			self.httpRequest(request_data);
		},
		getTask: function (self) {

			var request = {
				url: self.base_url + '/pm/v2/projects/' + self.project_id + '/tasks/' + self.task_id + '?with=boards,comments',
				success(res) {
					self.addMeta(res.data);
					self.list = res.data.boards.data[0];
					//self.$store.commit('setSingleTask', res.data);
					self.task = res.data;
					self.loading = false;
					pm.NProgress.done();
				}
			};

			self.httpRequest(request);
		},

		addMeta(task) {
			if (task.status === 'complete') {
				task.status = true;
			} else {
				task.status = false;
			}

			task.comments.data.map(function (comment) {
				comment.edit_mode = false;
			});
		},

		afterSelect: function (selectedOption, id, event) {
			//jQuery('.pm-multiselect').find('.multiselect__tags').find('.multiselect__tag').remove(); 
		},
		isEnableMultiSelect: function () {
			this.is_enable_multi_select = true;

			pm.Vue.nextTick(function () {
				jQuery('.multiselect__input').focus();
			});
		},

		fromDate: function (date) {
			if (date.field == 'datepicker_from') {
				var task = this.task;

				task.start_at = date.date;
				this.updateTaskElement(task);
			}

			if (date.field == 'datepicker_to') {
				var task = this.task;

				var start = new Date(task.start_at),
				    due = new Date(date.date);

				if (!this.$store.state.permissions.task_start_field) {
					task.due_date.date = date.date;
					this.updateTaskElement(task);
				} else if (start <= due) {
					task.due_date.date = date.date;
					this.updateTaskElement(task);
				}
			}
		},
		updateTaskPrivacy: function (task, status) {
			task.task_privacy = status;
			this.updateTaskElement(task);
		},
		isTaskDetailsEditMode: function () {
			this.is_task_details_edit_mode = true;

			pm.Vue.nextTick(function () {
				jQuery('.pm-desc-field').focus();
			});
		},

		updateDescription: function (task, event) {
			if (event.keyCode == 13 && event.shiftKey) {
				return;
			}

			this.is_task_details_edit_mode = false, this.updateTaskElement(task);
		},

		closePopup: function () {
			var self = this;
			// named route
			self.$router.push({
				name: 'task_lists',
				params: {
					project_id: self.project_id
				}
			});
		},

		singleTaskTitle: function (task) {
			return task.completed ? 'pm-task-complete' : 'pm-task-incomplete';
		},

		updateTaskElement: function (task) {

			var update_data = {
				'title': task.title,
				'description': task.description,
				'estimation': task.estimation,
				'start_at': task.start_at ? task.start_at.date : '',
				'due_date': task.due_date ? task.due_date.date : '',
				'complexity': task.complexity,
				'priority': task.priority,
				'order': task.order,
				'payable': task.payable,
				'recurrent': task.recurrent,
				'status': task.status,
				'category_id': task.category_id,
				'assignees': this.assigned_to
			},
			    self = this,
			    url = this.base_url + '/pm/v2/projects/' + this.project_id + '/tasks/' + task.id;

			var request_data = {
				url: url,
				data: update_data,
				type: 'PUT',
				success(res) {
					self.is_task_title_edit_mode = false;
					self.is_task_details_edit_mode = false;
					self.is_enable_multi_select = false;
				}
			};

			this.httpRequest(request_data);
		},

		isTaskTitleEditMode: function () {
			this.is_task_title_edit_mode = true;
		},

		isTaskDateEditMode: function () {
			this.is_task_date_edit_mode = true;
		},

		windowActivity: function (el) {
			var title_blur = jQuery(el.target).hasClass('pm-task-title-activity'),
			    dscription_blur = jQuery(el.target).hasClass('pm-des-area'),
			    assign_user = jQuery(el.target).closest('.pm-assigned-user-wrap');

			if (!title_blur) {
				this.is_task_title_edit_mode = false;
			}

			if (!dscription_blur) {
				this.is_task_details_edit_mode = false;
			}

			if (!assign_user.length) {
				this.is_enable_multi_select = false;
			}

			this.datePickerDispaly(el);
		},

		datePickerDispaly: function (el) {
			var date_picker_blur = jQuery(el.target).closest('.pm-task-date-wrap').hasClass('pm-date-window');

			if (!date_picker_blur) {
				this.is_task_date_edit_mode = false;
			}
		}
	}
});

/***/ }),

/***/ 478:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_text_editor_vue__ = __webpack_require__(150);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_file_uploader_vue__ = __webpack_require__(154);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
	props: ['comment', 'comments'],
	data() {
		return {
			submit_disabled: false,
			show_spinner: false,
			hasCoWorker: false,
			content: {
				html: typeof this.comment.content == 'undefined' ? '' : this.comment.content
			},
			task_id: this.$route.params.task_id,
			files: typeof this.comment.files === 'undefined' ? [] : this.comment.files.data,
			deleted_files: []
		};
	},
	components: {
		'text-editor': __WEBPACK_IMPORTED_MODULE_0__common_text_editor_vue__["a" /* default */],
		'file-uploader': __WEBPACK_IMPORTED_MODULE_1__common_file_uploader_vue__["a" /* default */]
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

	computed: {
		/**
         * Editor ID
         * 
         * @return string
         */
		editor_id: function () {
			var comment_id = typeof this.comment.id === 'undefined' ? '' : '-' + this.comment.id;
			return 'pm-comment-editor' + comment_id;
		}
	},
	methods: {

		taskCommentAction() {
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
					commentable_id: self.task_id,
					content: self.comment.content,
					commentable_type: 'task',
					deleted_files: self.deleted_files || [],
					files: self.files || []
				}
			};

			if (typeof this.comment.id !== 'undefined') {
				args.data.id = this.comment.id;
				args.callback = function (res) {
					var index = self.getIndex(self.comments, self.comment.id, 'id');
					self.comments.splice(index, 1, res.data);

					self.submit_disabled = false;
					self.show_spinner = false;
					self.files = [];self.deleted_files = [];
				};

				self.updateComment(args);
			} else {

				args.callback = function (res) {
					self.comments.splice(0, 0, res.data);
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

/***/ 479:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__task_comment_form_vue__ = __webpack_require__(544);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
				props: ['comments'],

				data: function () {
								return {
												currnet_user_id: 1,
												avatar_url: PM_Vars.avatar_url
								};
				},

				computed: {
								/**
         * Get current user avatar
         */
								getCurrentUserAvatar: function () {
												return '';
								}
				},

				components: {
								'task-comment-form': __WEBPACK_IMPORTED_MODULE_0__task_comment_form_vue__["a" /* default */]
				},

				methods: {
								showHideTaskCommentForm(comment) {
												comment.edit_mode = comment.edit_mode ? false : true;
								},
								current_user_can_edit_delete: function (comment, task) {
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

								deleteTaskComment(id) {
												if (!confirm(this.text.are_you_sure)) {
																return;
												}
												var self = this;

												var request_data = {
																url: self.base_url + '/pm/v2/projects/' + self.project_id + '/comments/' + id,
																type: 'DELETE',
																success(res) {
																				var index = self.getIndex(self.comments, id, 'id');

																				self.comments.splice(index, 1);
																}
												};
												this.httpRequest(request_data);
								}

				}
});

/***/ }),

/***/ 527:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(15)(undefined);
// imports


// module
exports.push([module.i, "\n.pm-line-through {\n\ttext-decoration: line-through;\n}\n.pm-multiselect-single-task {\n\tposition: absolute;\n}\n", ""]);

// exports


/***/ }),

/***/ 544:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_task_comment_form_vue__ = __webpack_require__(478);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_99bad622_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_task_comment_form_vue__ = __webpack_require__(568);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_task_comment_form_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_99bad622_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_task_comment_form_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/components/project-task-lists/task-comment-form.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-99bad622", Component.options)
  } else {
    hotAPI.reload("data-v-99bad622", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 545:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_task_comments_vue__ = __webpack_require__(479);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_1dd1b8f1_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_task_comments_vue__ = __webpack_require__(550);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_task_comments_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_1dd1b8f1_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_task_comments_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "views/assets/src/components/project-task-lists/task-comments.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-1dd1b8f1", Component.options)
  } else {
    hotAPI.reload("data-v-1dd1b8f1", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 546:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", [
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
                  staticStyle: { width: "700px", height: "20000px" }
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
              _c(
                "div",
                {
                  staticClass: "modal-container",
                  staticStyle: { width: "700px" }
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
                  _c("div", { staticClass: "modal-body pm-todolist" }, [
                    _c("div", { staticClass: "pm-col-12 pm-todo" }, [
                      _c("div", { staticClass: "pm-modal-conetnt" }, [
                        _c("div", { staticClass: "cmp-task-header" }, [
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
                                  attrs: { type: "checkbox" },
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
                                            (_vm.task.status = $$a.concat([
                                              $$v
                                            ]))
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
                                    _vm.is_task_title_edit_mode
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
                                              value: _vm.task.title,
                                              value: _vm.task.title
                                            },
                                            on: {
                                              blur: function($event) {
                                                _vm.updateTaskElement(_vm.task)
                                              },
                                              keyup: function($event) {
                                                if (
                                                  !("button" in $event) &&
                                                  _vm._k(
                                                    $event.keyCode,
                                                    "enter",
                                                    13,
                                                    $event.key
                                                  )
                                                ) {
                                                  return null
                                                }
                                                _vm.updateTaskElement(_vm.task)
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
                                              "\n                                                \t" +
                                                _vm._s(_vm.task.title) +
                                                "\n                                                "
                                            )
                                          ]
                                        )
                                      : _vm._e()
                                  ]
                                ),
                                _vm._v(" "),
                                _c("div", { staticClass: "clearfix pm-clear" })
                              ]
                            ),
                            _vm._v(" "),
                            _c("div", { staticClass: "clearfix pm-clear" })
                          ]),
                          _vm._v(" "),
                          _c("div", { staticClass: "pm-task-meta" }, [
                            _c(
                              "span",
                              { staticClass: "pm-assigned-user-wrap" },
                              [
                                _vm._l(_vm.task.assignees.data, function(user) {
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
                                          staticStyle: { "font-size": "20px" },
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
                                          "pm-multiselect pm-multiselect-single-task",
                                        on: {
                                          click: function($event) {
                                            $event.preventDefault()
                                            _vm.afterSelect($event)
                                          }
                                        }
                                      },
                                      [
                                        _c("multiselect", {
                                          attrs: {
                                            options: _vm.project_users,
                                            multiple: true,
                                            "close-on-select": false,
                                            "clear-on-select": true,
                                            "hide-selected": false,
                                            "show-labels": true,
                                            placeholder: "Select User",
                                            "select-label": "",
                                            "selected-label": "selected",
                                            "deselect-label": "",
                                            taggable: true,
                                            label: "display_name",
                                            "track-by": "id",
                                            "allow-empty": true
                                          },
                                          scopedSlots: _vm._u([
                                            {
                                              key: "option",
                                              fn: function(props) {
                                                return [
                                                  _c("div", [
                                                    _c("img", {
                                                      staticClass:
                                                        "option__image",
                                                      attrs: {
                                                        height: "16",
                                                        width: "16",
                                                        src:
                                                          props.option
                                                            .avatar_url,
                                                        alt: "No Man’s Sky"
                                                      }
                                                    }),
                                                    _vm._v(" "),
                                                    _c(
                                                      "div",
                                                      {
                                                        staticClass:
                                                          "option__desc"
                                                      },
                                                      [
                                                        _c(
                                                          "span",
                                                          {
                                                            staticClass:
                                                              "option__title"
                                                          },
                                                          [
                                                            _vm._v(
                                                              _vm._s(
                                                                props.option
                                                                  .display_name
                                                              )
                                                            )
                                                          ]
                                                        )
                                                      ]
                                                    )
                                                  ])
                                                ]
                                              }
                                            }
                                          ]),
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
                                      _vm.taskDateWrap(_vm.task.due_date.date) +
                                      " pm-task-date-wrap pm-date-window"
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
                                      [
                                        _vm.task_start_field
                                          ? _c("span", [
                                              _vm._v(
                                                "\n\t                                                    " +
                                                  _vm._s(
                                                    _vm.dateFormat(
                                                      _vm.task.start_at.date
                                                    )
                                                  ) +
                                                  "\n\t                                                "
                                              )
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
                                        _vm.task.due_date
                                          ? _c("span", [
                                              _vm._v(
                                                "\n\t                                                    " +
                                                  _vm._s(
                                                    _vm.dateFormat(
                                                      _vm.task.due_date.date
                                                    )
                                                  ) +
                                                  "\n\t                                                "
                                              )
                                            ])
                                          : _vm._e()
                                      ]
                                    ),
                                    _vm._v(" "),
                                    _vm.is_task_date_edit_mode
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
                                                      rawName: "v-pm-datepicker"
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
                                    _vm.is_task_date_edit_mode
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
                                                      rawName: "v-pm-datepicker"
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
                                    _vm._s(_vm.text.comments)
                                )
                              ]
                            )
                          ])
                        ]),
                        _vm._v(" "),
                        _c("div", { staticClass: "task-details" }, [
                          !_vm.is_task_details_edit_mode
                            ? _c(
                                "p",
                                {
                                  staticClass: "pm-des-area pm-desc-content",
                                  on: {
                                    click: function($event) {
                                      $event.preventDefault()
                                      _vm.isTaskDetailsEditMode()
                                    }
                                  }
                                },
                                [
                                  _vm.task.description !== ""
                                    ? _c("span", {
                                        domProps: {
                                          innerHTML: _vm._s(
                                            _vm.task.description
                                          )
                                        }
                                      })
                                    : _vm._e(),
                                  _vm._v(" "),
                                  !_vm.task.description
                                    ? _c(
                                        "span",
                                        {
                                          staticStyle: { "margin-left": "-3px" }
                                        },
                                        [
                                          _c("i", {
                                            staticClass: "fa fa-pencil",
                                            staticStyle: {
                                              "font-size": "16px"
                                            },
                                            attrs: { "aria-hidden": "true" }
                                          }),
                                          _vm._v(
                                            "\n                                        \t " +
                                              _vm._s(
                                                _vm.text.updata_description
                                              ) +
                                              "\n                                        "
                                          )
                                        ]
                                      )
                                    : _vm._e()
                                ]
                              )
                            : _vm._e(),
                          _vm._v(" "),
                          _vm.is_task_details_edit_mode
                            ? _c("textarea", {
                                directives: [
                                  {
                                    name: "prevent-line-break",
                                    rawName: "v-prevent-line-break"
                                  },
                                  {
                                    name: "model",
                                    rawName: "v-model",
                                    value: _vm.task.description,
                                    expression: "task.description"
                                  }
                                ],
                                staticClass: "pm-des-area pm-desc-field",
                                domProps: { value: _vm.task.description },
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
                                        $event.key
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
                                    _vm.$set(
                                      _vm.task,
                                      "description",
                                      $event.target.value
                                    )
                                  }
                                }
                              })
                            : _vm._e(),
                          _vm._v(" "),
                          _vm.is_task_details_edit_mode
                            ? _c("div", { staticClass: "pm-help-text" }, [
                                _c("span", [
                                  _vm._v(_vm._s(_vm.text.line_break))
                                ])
                              ])
                            : _vm._e(),
                          _vm._v(" "),
                          _c("div", { staticClass: "clearfix pm-clear" })
                        ]),
                        _vm._v(" "),
                        _c("div", { staticClass: "pm-todo-wrap clearfix" }, [
                          _c("div", { staticClass: "pm-task-comment" }, [
                            _c(
                              "div",
                              { staticClass: "comment-content" },
                              [
                                _c("task-comments", {
                                  attrs: { comments: _vm.task.comments.data }
                                })
                              ],
                              1
                            )
                          ])
                        ])
                      ]),
                      _vm._v(" "),
                      _c("div", { staticClass: "clearfix" })
                    ])
                  ]),
                  _vm._v(" "),
                  _c("div", { staticClass: "clearfix" })
                ]
              )
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
    require("vue-hot-reload-api")      .rerender("data-v-0b94f842", esExports)
  }
}

/***/ }),

/***/ 550:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "pm-task-comment-wrap" }, [
    _c("h3", { staticClass: "pm-comment-title" }, [
      _vm._v(_vm._s(_vm.text.discussion_this_task))
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
                  "\n                        " +
                    _vm._s(_vm.text.by) +
                    "\n                        "
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
                        "\n                                " +
                          _vm._s(comment.creator.data.display_name) +
                          "\n                            "
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
                ? _c(
                    "div",
                    { staticClass: "pm-comment-edit-form" },
                    [
                      _c("task-comment-form", {
                        attrs: { comment: comment, comments: _vm.comments }
                      })
                    ],
                    1
                  )
                : _vm._e()
            ])
          ]
        )
      })
    ),
    _vm._v(" "),
    _c("div", { staticClass: "single-todo-comments" }, [
      _c("div", { staticClass: "pm-comment-form-wrap" }, [
        _c("div", { staticClass: "pm-avatar" }, [
          _c("img", {
            attrs: { src: _vm.avatar_url, height: "48", width: "48" }
          })
        ]),
        _vm._v(" "),
        _c(
          "div",
          { staticClass: "pm-new-doc-comment-form" },
          [
            _c("task-comment-form", {
              attrs: { comment: {}, comments: _vm.comments }
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
    require("vue-hot-reload-api")      .rerender("data-v-1dd1b8f1", esExports)
  }
}

/***/ }),

/***/ 568:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "form",
    {
      staticClass: "pm-comment-form-vue",
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
      _vm.hasCoWorker
        ? _c("div", { staticClass: "notify-users" }, [
            _c("h2", { staticClass: "pm-box-title" }, [
              _vm._v(
                " \n                    " +
                  _vm._s(_vm.text.notify_user) +
                  "           \n                    "
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
                        value: _vm.notify_all_co_worker,
                        expression: "notify_all_co_worker"
                      }
                    ],
                    staticClass: "pm-toggle-checkbox",
                    attrs: { type: "checkbox", id: "select-all" },
                    domProps: {
                      checked: Array.isArray(_vm.notify_all_co_worker)
                        ? _vm._i(_vm.notify_all_co_worker, null) > -1
                        : _vm.notify_all_co_worker
                    },
                    on: {
                      change: [
                        function($event) {
                          var $$a = _vm.notify_all_co_worker,
                            $$el = $event.target,
                            $$c = $$el.checked ? true : false
                          if (Array.isArray($$a)) {
                            var $$v = null,
                              $$i = _vm._i($$a, $$v)
                            if ($$el.checked) {
                              $$i < 0 &&
                                (_vm.notify_all_co_worker = $$a.concat([$$v]))
                            } else {
                              $$i > -1 &&
                                (_vm.notify_all_co_worker = $$a
                                  .slice(0, $$i)
                                  .concat($$a.slice($$i + 1)))
                            }
                          } else {
                            _vm.notify_all_co_worker = $$c
                          }
                        },
                        function($event) {
                          $event.preventDefault()
                          _vm.notify_all_coo_worker()
                        }
                      ]
                    }
                  }),
                  _vm._v(
                    " \n                        " +
                      _vm._s(_vm.text.select_all) +
                      "\n                    "
                  )
                ]
              )
            ]),
            _vm._v(" "),
            _c(
              "ul",
              { staticClass: "pm-user-list" },
              [
                _vm._l(_vm.co_workers, function(co_worker) {
                  return _c("li", [
                    _c(
                      "label",
                      { attrs: { for: "pm_notify_" + co_worker.id } },
                      [
                        _c("input", {
                          directives: [
                            {
                              name: "model",
                              rawName: "v-model",
                              value: _vm.notify_co_workers,
                              expression: "notify_co_workers"
                            }
                          ],
                          attrs: {
                            type: "checkbox",
                            name: "notify_co_workers[]",
                            id: "pm_notify_" + co_worker.id
                          },
                          domProps: {
                            value: co_worker.id,
                            checked: Array.isArray(_vm.notify_co_workers)
                              ? _vm._i(_vm.notify_co_workers, co_worker.id) > -1
                              : _vm.notify_co_workers
                          },
                          on: {
                            change: [
                              function($event) {
                                var $$a = _vm.notify_co_workers,
                                  $$el = $event.target,
                                  $$c = $$el.checked ? true : false
                                if (Array.isArray($$a)) {
                                  var $$v = co_worker.id,
                                    $$i = _vm._i($$a, $$v)
                                  if ($$el.checked) {
                                    $$i < 0 &&
                                      (_vm.notify_co_workers = $$a.concat([
                                        $$v
                                      ]))
                                  } else {
                                    $$i > -1 &&
                                      (_vm.notify_co_workers = $$a
                                        .slice(0, $$i)
                                        .concat($$a.slice($$i + 1)))
                                  }
                                } else {
                                  _vm.notify_co_workers = $$c
                                }
                              },
                              function($event) {
                                $event.preventDefault()
                                _vm.notify_coo_workers(co_worker.id)
                              }
                            ]
                          }
                        }),
                        _vm._v(
                          " \n                            " +
                            _vm._s(co_worker.name) +
                            "\n                        "
                        )
                      ]
                    )
                  ])
                }),
                _vm._v(" "),
                _c("div", { staticClass: "clearfix" })
              ],
              2
            )
          ])
        : _vm._e(),
      _vm._v(" "),
      _c("div", { staticClass: "submit" }, [
        !_vm.comment.edit_mode
          ? _c("input", {
              staticClass: "button-primary",
              attrs: { disabled: _vm.submit_disabled, type: "submit", id: "" },
              domProps: { value: _vm.text.add_new_comment }
            })
          : _vm._e(),
        _vm._v(" "),
        _vm.comment.edit_mode
          ? _c("input", {
              staticClass: "button-primary",
              attrs: { disabled: _vm.submit_disabled, type: "submit", id: "" },
              domProps: { value: _vm.text.update_comment }
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
    require("vue-hot-reload-api")      .rerender("data-v-99bad622", esExports)
  }
}

/***/ }),

/***/ 575:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(527);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(16)("8386c9d6", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-0b94f842\",\"scoped\":false,\"hasInlineConfig\":false}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./single-task.vue", function() {
     var newContent = require("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-0b94f842\",\"scoped\":false,\"hasInlineConfig\":false}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./single-task.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ })

});