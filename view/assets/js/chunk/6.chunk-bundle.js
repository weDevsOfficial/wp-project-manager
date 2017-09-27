webpackJsonp([6],{

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

/***/ 102:
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

/***/ 153:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__task_comments_vue__ = __webpack_require__(182);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
			task_id: this.$route.params.task_id
		};
	},

	computed: {
		task() {
			return this.$store.state.task;
		},
		project_users: function () {
			var self = this;
			this.$store.state.project_users.map(function (user) {
				user.title = user.name;
				user.img = user.avatar_url;
			});

			return this.$store.state.project_users;
		},
		task_users() {
			if (jQuery.isEmptyObject(this.$store.state.task)) {
				return [];
			}
			return this.$store.state.task.assignees.data;
		},

		comments() {
			if (jQuery.isEmptyObject(this.$store.state.task)) {
				return [];
			}

			return this.$store.state.task.comments.data;
		},

		task_assign: {
			get: function () {
				var self = this;
				var filtered_user = this.$store.state.project_users.filter(function (user) {
					var has_user = self.task.assigned_to.indexOf(String(user.id));
					if (has_user != '-1') {
						return true;
					}
				});

				return filtered_user;
			},

			set: function (user) {
				var task = this.task,
				    assign = [];

				user.map(function (set_user, key) {
					assign.push(String(set_user.id));
				});

				task.assigned_to = assign;

				this.updateTaskElement(task);
			}
		}
	},

	components: {
		'task-comments': __WEBPACK_IMPORTED_MODULE_0__task_comments_vue__["a" /* default */]
	},

	created: function () {
		window.addEventListener('click', this.windowActivity);

		this.$root.$on('cpm_date_picker', this.fromDate);
	},

	methods: {
		// getTask: function(self) {
		//        var request = {
		//       		url: self.base_url + '/cpm/v2/projects/'+self.project_id+'/tasks/'+self.task_id+'?with=boards,comments',
		//       		success (res) {

		//       			self.task = res.data;	           		
		//       		}
		//        }

		//        self.httpRequest(request);
		//    },


		afterSelect: function (selectedOption, id, event) {
			//jQuery('.cpm-multiselect').find('.multiselect__tags').find('.multiselect__tag').remove(); 
		},
		isEnableMultiSelect: function () {
			this.is_enable_multi_select = true;

			//Vue.nextTick(function() {
			jQuery('.multiselect__input').focus();
			//});
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

			//Vue.nextTick(function() {
			jQuery('.cpm-desc-field').focus();
			//});
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
			return task.completed ? 'cpm-task-complete' : 'cpm-task-incomplete';
		},

		updateTaskElement: function (task) {

			var update_data = {
				title: task.title,
				description: task.description,
				estimation: task.estimation,
				start_at: task.start_at ? task.start_at.date : '',
				due_date: task.due_date ? task.due_date.date : '',
				complexity: task.complexity,
				priority: task.priority,
				order: task.order,
				payable: task.payable,
				recurrent: task.recurrent,
				status: task.status,
				category_id: task.category_id
			},
			    self = this,
			    url = this.base_url + '/cpm/v2/projects/' + this.project_id + '/tasks/' + task.id;

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
			var title_blur = jQuery(el.target).hasClass('cpm-task-title-activity'),
			    dscription_blur = jQuery(el.target).hasClass('cpm-des-area'),
			    assign_user = jQuery(el.target).closest('.cpm-assigned-user-wrap');

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
			var date_picker_blur = jQuery(el.target).closest('.cpm-task-date-wrap').hasClass('cpm-date-window');

			if (!date_picker_blur) {
				this.is_task_date_edit_mode = false;
			}
		}
	}
});

/***/ }),

/***/ 154:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__text_editor_vue__ = __webpack_require__(99);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
	props: ['comment'],
	data() {
		return {
			submit_disabled: false,
			show_spinner: false,
			hasCoWorker: false,
			content: {
				html: typeof this.comment.content == 'undefined' ? '' : this.comment.content
			},
			task_id: this.$route.params.task_id
		};
	},
	components: {
		'text-editor': __WEBPACK_IMPORTED_MODULE_0__text_editor_vue__["a" /* default */]
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
			return 'cpm-comment-editor' + comment_id;
		}
	},
	methods: {
		updateComment() {
			// Exit from this function, If submit button disabled 
			if (this.submit_disabled) {
				return;
			}

			// Disable submit button for preventing multiple click
			this.submit_disabled = true;
			var self = this,
			    is_update = typeof self.comment.id == 'undefined' ? false : true,
			    form_data = {
				content: self.comment.content,
				commentable_id: self.task_id,
				commentable_type: 'task'
			};

			// Showing loading option 
			this.show_spinner = true;

			if (is_update) {
				var url = self.base_url + '/cpm/v2/projects/' + self.project_id + '/comments/' + this.comment.id;
				var type = 'PUT';
			} else {
				var url = self.base_url + '/cpm/v2/projects/' + self.project_id + '/comments';
				var type = 'POST';
			}

			var request_data = {
				url: url,
				type: type,
				data: form_data,
				success(res) {
					self.getTask(self);
					self.show_spinner = false;

					// Display a success toast, with a title
					toastr.success(res.data.success);

					self.submit_disabled = false;
					self.showHideTaskCommentForm(false, self.comment);
				},

				error(res) {
					self.show_spinner = false;

					// Showing error
					res.data.error.map(function (value, index) {
						toastr.error(value);
					});
					self.submit_disabled = false;
				}
			};

			self.httpRequest(request_data);
		}
	}
});

/***/ }),

/***/ 155:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__task_comment_form_vue__ = __webpack_require__(181);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
            currnet_user_id: 1
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
        current_user_can_edit_delete: function (comment, task) {
            if (comment.comment_type == 'cpm_activity') {
                return false;
            }

            if (task.can_del_edit) {
                return true;
            }

            if (comment.user_id == this.currnet_user_id && comment.comment_type == '') {
                return true;
            }

            return false;
        }

    }
});

/***/ }),

/***/ 181:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_task_comment_form_vue__ = __webpack_require__(154);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_408f3278_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_task_comment_form_vue__ = __webpack_require__(195);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_task_comment_form_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_408f3278_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_task_comment_form_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "view/assets/js/components/task-lists/task-comment-form.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] task-comment-form.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-408f3278", Component.options)
  } else {
    hotAPI.reload("data-v-408f3278", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 182:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_task_comments_vue__ = __webpack_require__(155);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_625bbd46_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_task_comments_vue__ = __webpack_require__(202);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_task_comments_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_625bbd46_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_task_comments_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "view/assets/js/components/task-lists/task-comments.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] task-comments.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-625bbd46", Component.options)
  } else {
    hotAPI.reload("data-v-625bbd46", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 187:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [(_vm.loading) ? _c('div', {
    staticClass: "modal-mask half-modal cpm-task-modal modal-transition"
  }, [_c('div', {
    staticClass: "modal-wrapper"
  }, [_c('div', {
    staticClass: "modal-container",
    staticStyle: {
      "width": "700px",
      "height": "20000px"
    }
  }, [_c('span', {
    staticClass: "close-vue-modal"
  }, [_c('a', {
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.closePopup()
      }
    }
  }, [_c('span', {
    staticClass: "dashicons dashicons-no"
  })])]), _vm._v(" "), _vm._m(0)])])]) : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "modal-mask half-modal cpm-task-modal modal-transition"
  }, [_c('div', {
    staticClass: "modal-wrapper"
  }, [_c('div', {
    staticClass: "modal-container",
    staticStyle: {
      "width": "700px"
    }
  }, [_c('span', {
    staticClass: "close-vue-modal"
  }, [_c('a', {
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.closePopup()
      }
    }
  }, [_c('span', {
    staticClass: "dashicons dashicons-no"
  })])]), _vm._v(" "), _c('div', {
    staticClass: "modal-body cpm-todolist"
  }, [_c('div', {
    staticClass: "cpm-col-12 cpm-todo"
  }, [_c('div', {
    staticClass: "cpm-modal-conetnt"
  }, [_c('div', {
    staticClass: "cmp-task-header"
  }, [_c('h3', {
    staticClass: "cpm-task-title"
  }, [_c('span', {
    staticClass: "cpm-mark-done-checkbox"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.task.completed),
      expression: "task.completed"
    }],
    attrs: {
      "type": "checkbox"
    },
    domProps: {
      "checked": Array.isArray(_vm.task.completed) ? _vm._i(_vm.task.completed, null) > -1 : (_vm.task.completed)
    },
    on: {
      "click": function($event) {
        _vm.taskDoneUndone(_vm.task, _vm.task.completed)
      },
      "__c": function($event) {
        var $$a = _vm.task.completed,
          $$el = $event.target,
          $$c = $$el.checked ? (true) : (false);
        if (Array.isArray($$a)) {
          var $$v = null,
            $$i = _vm._i($$a, $$v);
          if ($$el.checked) {
            $$i < 0 && (_vm.task.completed = $$a.concat($$v))
          } else {
            $$i > -1 && (_vm.task.completed = $$a.slice(0, $$i).concat($$a.slice($$i + 1)))
          }
        } else {
          _vm.task.completed = $$c
        }
      }
    }
  })]), _vm._v(" "), _c('span', {
    class: _vm.singleTaskTitle(_vm.task) + ' cpm-task-title-wrap'
  }, [_c('div', {
    staticClass: "cpm-task-title-text"
  }, [(_vm.is_task_title_edit_mode) ? _c('span', [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.task.title),
      expression: "task.title"
    }],
    staticClass: "cpm-task-title-activity cpm-task-title-field",
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": _vm.task.title,
      "value": (_vm.task.title)
    },
    on: {
      "blur": function($event) {
        _vm.updateTaskElement(_vm.task)
      },
      "keyup": function($event) {
        if (!('button' in $event) && _vm._k($event.keyCode, "enter", 13)) { return null; }
        _vm.updateTaskElement(_vm.task)
      },
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.task.title = $event.target.value
      }
    }
  })]) : _vm._e(), _vm._v(" "), (!_vm.is_task_title_edit_mode) ? _c('span', {
    staticClass: "cpm-task-title-activity cpm-task-title-span",
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.isTaskTitleEditMode()
      }
    }
  }, [_vm._v("\n                                                \t" + _vm._s(_vm.task.title) + "\n                                                ")]) : _vm._e()]), _vm._v(" "), _c('div', {
    staticClass: "clearfix cpm-clear"
  })]), _vm._v(" "), _c('div', {
    staticClass: "clearfix cpm-clear"
  })]), _vm._v(" "), _c('div', {
    staticClass: "cpm-task-meta"
  }, [_c('span', {
    staticClass: "cpm-assigned-user-wrap"
  }, [_vm._l((_vm.task_users), function(user) {
    return (_vm.task_users) ? _c('span', {
      staticClass: "cpm-assigned-user",
      domProps: {
        "innerHTML": _vm._s(user.user_url)
      },
      on: {
        "click": function($event) {
          $event.preventDefault();
          _vm.isEnableMultiSelect()
        }
      }
    }) : _vm._e()
  }), _vm._v(" "), (!_vm.task_users.length) ? _c('span', {
    staticClass: "cpm-assigned-user",
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.isEnableMultiSelect()
      }
    }
  }, [_c('i', {
    staticClass: "fa fa-user",
    staticStyle: {
      "font-size": "20px"
    },
    attrs: {
      "aria-hidden": "true"
    }
  })]) : _vm._e(), _vm._v(" "), (_vm.task_users.length && _vm.is_enable_multi_select) ? _c('div', {
    staticClass: "cpm-multiselect cpm-multiselect-single-task",
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.afterSelect($event)
      }
    }
  }, [_c('multiselect', {
    attrs: {
      "options": _vm.project_users,
      "multiple": true,
      "close-on-select": false,
      "clear-on-select": true,
      "hide-selected": false,
      "show-labels": true,
      "placeholder": "<?php _e( 'Select User', 'cpm' ); ?>",
      "select-label": "",
      "selected-label": "selected",
      "deselect-label": "",
      "taggable": true,
      "label": "name",
      "track-by": "id",
      "allow-empty": true
    },
    scopedSlots: _vm._u([{
      key: "option",
      fn: function(props) {
        return [_c('div', [_c('img', {
          staticClass: "option__image",
          attrs: {
            "height": "16",
            "width": "16",
            "src": props.option.img,
            "alt": "<?php _e( 'No Man’s Sky', 'cpm' ); ?>"
          }
        }), _vm._v(" "), _c('div', {
          staticClass: "option__desc"
        }, [_c('span', {
          staticClass: "option__title"
        }, [_vm._v(_vm._s(props.option.title))])])])]
      }
    }]),
    model: {
      value: (_vm.task_assign),
      callback: function($$v) {
        _vm.task_assign = $$v
      },
      expression: "task_assign"
    }
  })], 1) : _vm._e()], 2), _vm._v(" "), ((_vm.task.start_at || _vm.task.due_date)) ? _c('span', {
    staticClass: "cpm-task-date-wrap cpm-date-window"
  }, [_c('span', {
    class: _vm.task.completed ? _vm.completedTaskWrap(_vm.task.start_at, _vm.task.due_date.date) : _vm.taskDateWrap(_vm.task.start_at, _vm.task.due_date.date),
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.isTaskDateEditMode()
      }
    }
  }, [(_vm.task_start_field) ? _c('span', [_vm._v("\n\t                                                    " + _vm._s(_vm.dateFormat(_vm.task.start_at)) + "\n\t                                                ")]) : _vm._e(), _vm._v(" "), (_vm.isBetweenDate(_vm.task_start_field, _vm.task.start_at, _vm.task.due_date.date)) ? _c('span', [_vm._v("–")]) : _vm._e(), _vm._v(" "), (_vm.task.due_date) ? _c('span', [_vm._v("\n\t                                                    " + _vm._s(_vm.dateFormat(_vm.task.due_date.date)) + "\n\t                                                ")]) : _vm._e()]), _vm._v(" "), (_vm.is_task_date_edit_mode) ? _c('div', {
    staticClass: "cpm-date-update-wrap"
  }, [(_vm.task_start_field) ? _c('div', {
    directives: [{
      name: "cpm-datepicker",
      rawName: "v-cpm-datepicker"
    }],
    staticClass: "cpm-date-picker-from cpm-inline-date-picker-from"
  }) : _vm._e(), _vm._v(" "), _c('div', {
    directives: [{
      name: "cpm-datepicker",
      rawName: "v-cpm-datepicker"
    }],
    staticClass: "cpm-date-picker-to cpm-inline-date-picker-to"
  }), _vm._v(" "), _c('div', {
    staticClass: "clearfix cpm-clear"
  })]) : _vm._e()]) : _vm._e(), _vm._v(" "), ((_vm.task.start_at == '' && _vm.task.due_date.date == '')) ? _c('span', {
    staticClass: "cpm-task-date-wrap cpm-date-window"
  }, [_c('span', {
    class: _vm.task.completed ? _vm.completedTaskWrap(_vm.task.start_at, _vm.task.due_date.date) : _vm.taskDateWrap(_vm.task.start_at, _vm.task.due_date.date),
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.isTaskDateEditMode()
      }
    }
  }, [_vm._m(1)]), _vm._v(" "), (_vm.is_task_date_edit_mode) ? _c('div', {
    staticClass: "cpm-date-update-wrap"
  }, [(_vm.task_start_field) ? _c('div', {
    directives: [{
      name: "cpm-datepicker",
      rawName: "v-cpm-datepicker"
    }],
    staticClass: "cpm-date-picker-from cpm-inline-date-picker-from"
  }) : _vm._e(), _vm._v(" "), _c('div', {
    directives: [{
      name: "cpm-datepicker",
      rawName: "v-cpm-datepicker"
    }],
    staticClass: "cpm-date-picker-to cpm-inline-date-picker-to"
  }), _vm._v(" "), _c('div', {
    staticClass: "clearfix cpm-clear"
  })]) : _vm._e()]) : _vm._e(), _vm._v(" "), _c('span', {
    staticClass: "cpm-task-comment-count"
  }, [_vm._v(_vm._s(_vm.comments.length) + " Comments")])])]), _vm._v(" "), _c('div', {
    staticClass: "task-details"
  }, [(!_vm.is_task_details_edit_mode) ? _c('p', {
    staticClass: "cpm-des-area cpm-desc-content",
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.isTaskDetailsEditMode()
      }
    }
  }, [(_vm.task.description !== '') ? _c('span', {
    domProps: {
      "innerHTML": _vm._s(_vm.task.description)
    }
  }) : _vm._e(), _vm._v(" "), (!_vm.task.description) ? _c('span', {
    staticStyle: {
      "margin-left": "-3px"
    }
  }, [_c('i', {
    staticClass: "fa fa-pencil",
    staticStyle: {
      "font-size": "16px"
    },
    attrs: {
      "aria-hidden": "true"
    }
  }), _vm._v("\n                                        \t Update Description\n                                        ")]) : _vm._e()]) : _vm._e(), _vm._v(" "), (_vm.is_task_details_edit_mode) ? _c('textarea', {
    directives: [{
      name: "prevent-line-break",
      rawName: "v-prevent-line-break"
    }, {
      name: "model",
      rawName: "v-model",
      value: (_vm.task.description),
      expression: "task.description"
    }],
    staticClass: "cpm-des-area cpm-desc-field",
    domProps: {
      "value": (_vm.task.description)
    },
    on: {
      "blur": function($event) {
        _vm.updateDescription(_vm.task, $event)
      },
      "keyup": function($event) {
        if (!('button' in $event) && _vm._k($event.keyCode, "enter", 13)) { return null; }
        _vm.updateDescription(_vm.task, $event)
      },
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.task.description = $event.target.value
      }
    }
  }) : _vm._e(), _vm._v(" "), (_vm.is_task_details_edit_mode) ? _c('div', {
    staticClass: "cpm-help-text"
  }, [_c('span', [_vm._v("Shift+Enter for line break")])]) : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "clearfix cpm-clear"
  })]), _vm._v(" "), _c('div', {
    staticClass: "cpm-todo-wrap clearfix"
  }, [_c('div', {
    staticClass: "cpm-task-comment"
  }, [_c('div', {
    staticClass: "comment-content"
  }, [_c('task-comments', {
    attrs: {
      "comments": _vm.comments
    }
  })], 1)])])]), _vm._v(" "), _c('div', {
    staticClass: "clearfix"
  })])]), _vm._v(" "), _c('div', {
    staticClass: "clearfix"
  })])])])])
}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "modal-body cpm-todolist"
  }, [_c('div', {
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
  })])])])])
},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('span', [_c('i', {
    staticClass: "fa fa-calendar",
    staticStyle: {
      "font-size": "20px"
    },
    attrs: {
      "aria-hidden": "true"
    }
  })])
}]
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-0ea2cd18", esExports)
  }
}

/***/ }),

/***/ 195:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('form', {
    staticClass: "cpm-comment-form-vue",
    on: {
      "submit": function($event) {
        $event.preventDefault();
        _vm.updateComment()
      }
    }
  }, [_c('div', {
    staticClass: "item message cpm-sm-col-12 "
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
    return _c('li', [_c('label', {
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
  })])])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-408f3278", esExports)
  }
}

/***/ }),

/***/ 20:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_single_task_vue__ = __webpack_require__(153);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0ea2cd18_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_single_task_vue__ = __webpack_require__(187);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_single_task_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0ea2cd18_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_single_task_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "view/assets/js/components/task-lists/single-task.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] single-task.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0ea2cd18", Component.options)
  } else {
    hotAPI.reload("data-v-0ea2cd18", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),

/***/ 202:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "cpm-task-comment-wrap"
  }, [_c('h3', {
    staticClass: "cpm-comment-title"
  }, [_vm._v("Discuss this task")]), _vm._v(" "), _c('ul', {
    staticClass: "cpm-comment-wrap"
  }, _vm._l((_vm.comments), function(comment) {
    return _c('li', {
      key: comment.id,
      class: 'cpm-comment clearfix even cpm-fade-out-' + comment.id
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
    }, [_vm._v(_vm._s(_vm.dateTimeFormat(comment.comment_date)))])]), _vm._v(" "), _c('div', {
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
          _vm.showHideTaskCommentForm('toggle', comment)
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
          _vm.deleteTaskComment(comment.id, _vm.task)
        }
      }
    })])])]), _vm._v(" "), _c('div', {
      staticClass: "cpm-comment-content"
    }, [_c('div', {
      domProps: {
        "innerHTML": _vm._s(comment.content)
      }
    }), _vm._v(" "), _c('ul', {
      staticClass: "cpm-attachments"
    }, _vm._l((comment.files), function(file) {
      return _c('li', [_c('a', {
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
    }, [_c('task-comment-form', {
      attrs: {
        "comment": comment
      }
    })], 1) : _vm._e()])])
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
  })]), _vm._v(" "), _c('div', {
    staticClass: "cpm-new-doc-comment-form"
  }, [_c('task-comment-form', {
    attrs: {
      "comment": {}
    }
  })], 1)])])])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-625bbd46", esExports)
  }
}

/***/ }),

/***/ 99:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_text_editor_vue__ = __webpack_require__(100);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_483c3c1e_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_text_editor_vue__ = __webpack_require__(102);
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