webpackJsonp([2],{

/***/ 102:
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

/* harmony default export */ __webpack_exports__["a"] = ({
    props: ['total_pages', 'current_page_number', 'component_name'],

    methods: {
        pageClass: function (page) {
            if (page == this.current_page_number) {
                return 'page-numbers current';
            }

            return 'page-numbers';
        }
    }
});

/***/ }),

/***/ 103:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_pagination_vue__ = __webpack_require__(102);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_00b52034_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_pagination_vue__ = __webpack_require__(104);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_pagination_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_00b52034_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_pagination_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "view/assets/js/components/pagination.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] pagination.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-00b52034", Component.options)
  } else {
    hotAPI.reload("data-v-00b52034", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 104:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return (_vm.total_pages > 1) ? _c('div', [_c('div', {
    staticClass: "cpm-pagination-wrap"
  }, [(parseInt(_vm.current_page_number) > 1) ? _c('router-link', {
    staticClass: "cpm-pagination-btn prev page-numbers",
    attrs: {
      "to": {
        name: _vm.component_name,
        params: {
          current_page_number: (_vm.current_page_number - 1)
        }
      }
    }
  }, [_vm._v("\n\t\t\t«\n\t\t")]) : _vm._e(), _vm._v(" "), _vm._l((_vm.total_pages), function(page) {
    return _c('router-link', {
      key: "page",
      class: _vm.pageClass(page) + ' cpm-pagination-btn',
      attrs: {
        "to": {
          name: _vm.component_name,
          params: {
            current_page_number: page
          }
        }
      }
    }, [_vm._v(_vm._s(page) + "\n\t\t")])
  }), _vm._v(" "), (parseInt(_vm.current_page_number) < parseInt(_vm.total_pages)) ? _c('router-link', {
    staticClass: "cpm-pagination-btn next page-numbers",
    attrs: {
      "to": {
        name: _vm.component_name,
        params: {
          current_page_number: (_vm.current_page_number + 1)
        }
      }
    }
  }, [_vm._v("\n\t\t\t»\n\t\t")]) : _vm._e()], 2), _vm._v(" "), _c('div', {
    staticClass: "cpm-clearfix"
  })]) : _vm._e()
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-00b52034", esExports)
  }
}

/***/ }),

/***/ 108:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({
    props: ['value', 'dependency'],
    mounted: function () {
        var self = this,
            limit_date = self.dependency == 'cpm-datepickter-from' ? "maxDate" : "minDate";

        jQuery(self.$el).datepicker({
            dateFormat: 'yy-mm-dd',
            changeYear: true,
            changeMonth: true,
            numberOfMonths: 1,
            onClose: function (selectedDate) {
                jQuery("." + self.dependency).datepicker("option", limit_date, selectedDate);
            },
            onSelect: function (dateText) {
                self.$emit('input', dateText);
            }
        });
    }
});

/***/ }),

/***/ 109:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({
    // Get passing data for this component. Remember only array and objects are
    props: ['list', 'task'],

    methods: {
        /**
         * Select new todo-list button class for +,- icon
         * 
         * @return string
         */
        newTaskBtnClass: function () {
            return this.list.show_task_form ? 'cpm-col-3 cpm-new-task-btn-minus' : 'cpm-col-3 cpm-new-task-btn';
        }
    }
});

/***/ }),

/***/ 110:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vue_multiselect_vue_multiselect_min__ = __webpack_require__(113);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vue_multiselect_vue_multiselect_min___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__vue_multiselect_vue_multiselect_min__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__date_picker_vue__ = __webpack_require__(115);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
    props: ['list', 'task'],

    /**
     * Initial data for this component
     * 
     * @return obj
     */
    data: function () {
        return {
            task_privacy: this.task.task_privacy == 'yes' ? true : false,
            submit_disabled: false,
            before_edit: jQuery.extend(true, {}, this.task),
            show_spinner: false,
            date_from: '',
            date_to: ''
        };
    },

    components: {
        'multiselect': __WEBPACK_IMPORTED_MODULE_0__vue_multiselect_vue_multiselect_min___default.a,
        'cpm-datepickter': __WEBPACK_IMPORTED_MODULE_1__date_picker_vue__["a" /* default */]
    },

    // Initial action for this component
    created: function () {
        this.$on('cpm_date_picker', this.getDatePicker);
    },

    watch: {
        date_from: function (new_date) {
            this.task.start_at = new_date;
        },

        date_to: function (new_date) {
            this.task.due_date = new_date;
        },
        /**
         * Live check is the task private or not
         * 
         * @param  boolean val 
         * 
         * @return void     
         */
        task_privacy: function (val) {
            if (val) {
                this.task.task_privacy = 'yes';
            } else {
                this.task.task_privacy = 'no';
            }
        }
    },

    computed: {
        project_users() {
            return this.$root.$store.state.project_users;
        },
        /**
         * Check current user can view the todo or not
         * 
         * @return boolean
         */
        todo_view_private: function () {
            if (!this.$store.state.init.hasOwnProperty('premissions')) {
                return true;
            }

            if (this.$store.state.init.premissions.hasOwnProperty('todo_view_private')) {
                return this.$store.state.init.premissions.tdolist_view_private;
            }

            return true;
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
            get: function () {
                var filtered_users = [];

                if (this.task.assigned_to && this.task.assigned_to.length) {
                    var assigned_to = this.task.assigned_to.map(function (id) {
                        return parseInt(id);
                    });

                    filtered_users = this.project_users.filter(function (user) {
                        return assigned_to.indexOf(parseInt(user.id)) >= 0;
                    });
                }

                return filtered_users;
            },

            /**
             * Set selected users at task insert or edit time
             * 
             * @param array selected_users 
             */
            set: function (selected_users) {
                this.task.assigned_to = selected_users.map(function (user) {
                    return user.id;
                });
            }
        }
    },

    methods: {
        /**
         * Set tast start and end date at task insert or edit time
         * 
         * @param  string data 
         * 
         * @return void   
         */
        getDatePicker: function (data) {

            if (data.field == 'datepicker_from') {
                //this.task.start_at = data.date;
            }

            if (data.field == 'datepicker_to') {
                //this.task.due_date = data.date;
            }
        },

        /**
         * Show or hieding task insert and edit form
         *  
         * @param  int list_index 
         * @param  int task_id    
         * 
         * @return void           
         */
        hideNewTaskForm: function (list_index, task_id) {
            var self = this,
                task_index = this.getIndex(this.list.tasks, task_id, 'ID'),
                list_index = this.getIndex(this.$store.state.lists, this.list.ID, 'ID');

            if (typeof task_id == 'undefined') {
                self.showHideTaskFrom(self.list);
                return;
            }

            this.list.tasks.map(function (task, index) {
                if (task.ID == task_id) {
                    self.showHideTaskFrom(self.list);
                    self.task = jQuery.extend(self.task, self.before_edit);
                }
            });
        },

        /**
         * Insert and edit task
         * 
         * @return void
         */
        newTask: function () {
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
                assign: this.task.assigned_to,
                title: this.task.title,
                description: this.task.description,
                start_at: this.task.start_at,
                due_date: this.task.due_date,
                task_privacy: this.task.task_privacy,
                list_id: this.list.id
            };

            // Showing loading option 
            this.show_spinner = true;

            if (is_update) {
                var url = self.base_url + '/cpm/v2/projects/' + self.project_id + '/tasks/' + this.task.id;
                var type = 'PUT';
            } else {
                var url = self.base_url + '/cpm/v2/projects/' + self.project_id + '/tasks';
                var type = 'POST';
            }

            var request_data = {
                url: url,
                type: type,
                data: form_data,
                success(res) {
                    self.getList(self, self.list.id);
                    self.show_spinner = false;

                    // Display a success toast, with a title
                    toastr.success(res.data.success);

                    self.submit_disabled = false;
                    self.showHideTaskFrom(self.list, self.task);
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

/***/ 111:
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


var cpm_todo_list_mixins = function (mixins, mixin_parent) {
    if (!mixins || !mixins.length) {
        return [];
    }
    if (!mixin_parent) {
        mixin_parent = window;
    }
    return mixins.map(function (mixin) {
        return mixin_parent[mixin];
    });
};

/* harmony default export */ __webpack_exports__["a"] = ({
    // Get passing data for this component. Remember only array and objects are 
    props: ['list', 'section'],

    /**
     * Initial data for this component
     * 
     * @return obj
     */
    data: function () {
        return {
            submit_btn_text: 'Submit',
            tasklist_milestone: this.list.milestone ? this.list.milestone : '-1',
            show_spinner: false,
            error: [],
            success: '',
            submit_disabled: false,
            project_id: this.$route.params.project_id,
            milestone_id: '-1'
        };
    },

    created() {
        if (typeof this.list.milestone !== 'undefined') {
            this.milestone_id = this.list.milestone.data.id;
        }
    },

    computed: {

        /**
         * Get current project milestones 
         * 
         * @return array
         */
        milestones: function () {
            return this.$store.state.milestones;
        }
    },

    methods: {

        /**
         * Get todo list form class
         * 
         * @param  obej list 
         * 
         * @return string     
         */
        todolistFormClass: function (list) {
            return list.ID ? 'cpm-todo-form-wrap cpm-form cpm-slide-' + list.ID : 'cpm-todo-list-form-wrap cpm-form cpm-slide-list';
        },

        /**
         * Insert and update todo list
         * 
         * @return void
         */
        newTodoList: function () {

            // Prevent sending request when multiple click submit button 
            if (this.submit_disabled) {
                return;
            }

            // Make disable submit button
            this.submit_disabled = true;

            var self = this,
                is_update = typeof this.list.id == 'undefined' ? false : true;

            this.show_spinner = true;

            if (is_update) {
                var type = 'PUT';
                var url = self.base_url + '/cpm/v2/projects/' + self.project_id + '/task-lists/' + self.list.id;
                var data = 'title=' + self.list.title + '&description=' + self.list.description + '&milestone=' + self.milestone_id + '&order' + 5;
            } else {
                var url = self.base_url + '/cpm/v2/projects/' + self.project_id + '/task-lists';
                var type = 'POST';
                var data = {
                    'title': self.list.title,
                    'description': self.list.description,
                    'milestone': self.milestone_id,
                    'order': 5
                };
            }

            var request_data = {
                url: url,
                data: data,
                type: type,
                success(res) {
                    self.milestone_id = '-1';
                    self.show_spinner = false;
                    self.list.title = '';
                    self.list.description = '';

                    // Display a success message, with a title
                    toastr.success(res.data.success);
                    self.submit_disabled = false;

                    if (is_update) {
                        self.showHideListForm(false, self.list);
                    } else {
                        self.showHideListForm(false);
                    }

                    if (self.section === 'lists') {
                        self.listsAfterNewList(self, res, is_update);
                    }

                    if (self.section === 'single') {
                        self.singleAfterNewList(self, res, is_update);
                    }

                    //               if ( self.$route.params.current_page_number > 1 && !is_update ) {
                    //               	// named route
                    // self.$router.push({ 
                    // 	name: 'task_lists', 
                    // 	params: { 
                    // 		project_id: self.project_id 
                    // 	}
                    // });

                    //               } else if (is_update) {
                    //               	self.getList(self, self.list.id);
                    //               }

                },

                error(res) {

                    self.show_spinner = false;
                    self.submit_disabled = false;

                    // Showing error
                    res.data.error.map(function (value, index) {
                        toastr.error(value);
                    });
                }
            };

            self.httpRequest(request_data);
        },

        listsAfterNewList(self, res, is_update) {
            if (is_update) {
                self.getList(self, self.list.id);
                return;
            }

            if (self.$route.params.current_page_number > 1) {
                // named route
                self.$router.push({
                    name: 'task_lists',
                    params: {
                        project_id: self.project_id
                    }
                });
            } else {
                self.getLists(self);
            }
        },

        singleAfterNewList(self, res, is_update) {
            if (is_update) {
                var condition = 'incomplete_tasks,complete_tasks,comments';
                self.getList(self, self.list.id, condition);
            }
        }
    }
});

/***/ }),

/***/ 112:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__new_task_form_vue__ = __webpack_require__(117);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
    props: ['list'],

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

    beforeCreate: function () {},

    created: function () {

        // var self = this;
        // if ( this.$store.state.is_single_list ) {
        //     //For sigle todo-list page
        //     this.getTasks(this.list.ID, 0, 'cpm_get_tasks', function(res) {
        //         var getIncompletedTasks = self.getIncompletedTasks(self.list);
        //         var getCompleteTask     = self.getCompleteTask(self.list);

        //         self.loading_completed_tasks = false;
        //         self.loading_incomplete_tasks = false;

        //         if ( res.found_incompleted_tasks > getIncompletedTasks.length ) {
        //             self.incomplete_show_load_more_btn = true;
        //         }

        //         if ( res.found_completed_tasks > getCompleteTask.length ) {
        //             self.complete_show_load_more_btn = true;
        //         }
        //     });
        // } else {
        //     self.list.tasks = [];
        //     //For todo-lists page
        //     this.getTasks(this.list.ID, 0, 'cpm_get_incompleted_tasks', function(res) {
        //         self.loading_incomplete_tasks = false;

        //         if ( res.found_incompleted_tasks > self.list.tasks.length ) {
        //             self.incomplete_show_load_more_btn = true;
        //         }
        //     }); 
        // }
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
            if (this.list.incomplete_tasks) {
                this.list.incomplete_tasks.data.map(function (task, index) {
                    task.status = false;
                });

                return this.list.incomplete_tasks.data;
            }
        },

        /**
         * Get completed tasks
         * 
         * @param  array tasks 
         * 
         * @return array       
         */
        getCompletedTask: function () {
            if (this.list.complete_tasks) {
                this.list.complete_tasks.data.map(function (task, index) {
                    task.status = true;
                });

                return this.list.complete_tasks.data;
            }
        }
    },

    components: {
        'new-task-form': __WEBPACK_IMPORTED_MODULE_0__new_task_form_vue__["a" /* default */]
    },

    methods: {
        is_assigned: function (task) {
            return true;
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

/***/ 113:
/***/ (function(module, exports, __webpack_require__) {

!function (e, t) {
   true ? module.exports = t() : "function" == typeof define && define.amd ? define([], t) : "object" == typeof exports ? exports.VueMultiselect = t() : e.VueMultiselect = t();
}(this, function () {
  return function (e) {
    function t(n) {
      if (i[n]) return i[n].exports;var s = i[n] = { i: n, l: !1, exports: {} };return e[n].call(s.exports, s, s.exports, t), s.l = !0, s.exports;
    }var i = {};return t.m = e, t.c = i, t.i = function (e) {
      return e;
    }, t.d = function (e, i, n) {
      t.o(e, i) || Object.defineProperty(e, i, { configurable: !1, enumerable: !0, get: n });
    }, t.n = function (e) {
      var i = e && e.__esModule ? function () {
        return e.default;
      } : function () {
        return e;
      };return t.d(i, "a", i), i;
    }, t.o = function (e, t) {
      return Object.prototype.hasOwnProperty.call(e, t);
    }, t.p = "/", t(t.s = 4);
  }([function (e, t, i) {
    "use strict";
    function n(e, t, i) {
      return t in e ? Object.defineProperty(e, t, { value: i, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = i, e;
    }function s(e, t) {
      return !!e && -1 !== e.toString().toLowerCase().indexOf(t.trim());
    }function l(e, t, i) {
      return i ? e.filter(function (e) {
        return s(e[i], t);
      }) : e.filter(function (e) {
        return s(e, t);
      });
    }function o(e) {
      return e.filter(function (e) {
        return !e.$isLabel;
      });
    }function r(e, t) {
      return function (i) {
        return i.reduce(function (i, n) {
          return n[e] && n[e].length ? (i.push({ $groupLabel: n[t], $isLabel: !0 }), i.concat(n[e])) : i.concat(n);
        }, []);
      };
    }function a(e, t, i, s) {
      return function (o) {
        return o.map(function (o) {
          var r,
              a = l(o[i], e, t);return a.length ? (r = {}, n(r, s, o[s]), n(r, i, a), r) : [];
        });
      };
    }Object.defineProperty(t, "__esModule", { value: !0 });var u = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
      return typeof e;
    } : function (e) {
      return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
    },
        c = i(2),
        h = function (e) {
      return e && e.__esModule ? e : { default: e };
    }(c),
        p = function () {
      for (var e = arguments.length, t = Array(e), i = 0; i < e; i++) t[i] = arguments[i];return function (e) {
        return t.reduce(function (e, t) {
          return t(e);
        }, e);
      };
    };t.default = { data: function () {
        return { search: "", isOpen: !1, hasEnoughSpace: !0, internalValue: this.value || 0 === this.value ? (0, h.default)(Array.isArray(this.value) ? this.value : [this.value]) : [] };
      }, props: { internalSearch: { type: Boolean, default: !0 }, options: { type: Array, required: !0 }, multiple: { type: Boolean, default: !1 }, value: { type: null, default: function () {
            return [];
          } }, trackBy: { type: String }, label: { type: String }, searchable: { type: Boolean, default: !0 }, clearOnSelect: { type: Boolean, default: !0 }, hideSelected: { type: Boolean, default: !1 }, placeholder: { type: String, default: "Select option" }, allowEmpty: { type: Boolean, default: !0 }, resetAfter: { type: Boolean, default: !1 }, closeOnSelect: { type: Boolean, default: !0 }, customLabel: { type: Function, default: function (e, t) {
            return t ? e[t] : e;
          } }, taggable: { type: Boolean, default: !1 }, tagPlaceholder: { type: String, default: "Press enter to create a tag" }, max: { type: Number }, id: { default: null }, optionsLimit: { type: Number, default: 1e3 }, groupValues: { type: String }, groupLabel: { type: String }, blockKeys: { type: Array, default: function () {
            return [];
          } } }, mounted: function () {
        this.multiple || this.clearOnSelect || console.warn("[Vue-Multiselect warn]: ClearOnSelect and Multiple props can’t be both set to false.");
      }, computed: { filteredOptions: function () {
          var e = this.search || "",
              t = e.toLowerCase(),
              i = this.options.concat();return this.internalSearch ? (i = this.groupValues ? this.filterAndFlat(i, t, this.label) : l(i, t, this.label), i = this.hideSelected ? i.filter(this.isNotSelected) : i) : i = this.groupValues ? r(this.groupValues, this.groupLabel)(i) : i, this.taggable && t.length && !this.isExistingOption(t) && i.unshift({ isTag: !0, label: e }), i.slice(0, this.optionsLimit);
        }, valueKeys: function () {
          var e = this;return this.trackBy ? this.internalValue.map(function (t) {
            return t[e.trackBy];
          }) : this.internalValue;
        }, optionKeys: function () {
          var e = this,
              t = this.groupValues ? this.flatAndStrip(this.options) : this.options;return this.label ? t.map(function (t) {
            return t[e.label].toString().toLowerCase();
          }) : t.map(function (e) {
            return e.toString().toLowerCase();
          });
        }, currentOptionLabel: function () {
          return this.multiple ? this.searchable ? "" : this.placeholder : this.internalValue[0] ? this.getOptionLabel(this.internalValue[0]) : this.searchable ? "" : this.placeholder;
        } }, watch: { internalValue: function (e, t) {
          this.resetAfter && this.internalValue.length && (this.search = "", this.internalValue = []);
        }, search: function () {
          this.$emit("search-change", this.search, this.id);
        }, value: function (e) {
          this.internalValue = this.getInternalValue(e);
        } }, methods: { getValue: function () {
          return this.multiple ? (0, h.default)(this.internalValue) : 0 === this.internalValue.length ? null : (0, h.default)(this.internalValue[0]);
        }, getInternalValue: function (e) {
          return null === e || void 0 === e ? [] : this.multiple ? (0, h.default)(e) : (0, h.default)([e]);
        }, filterAndFlat: function (e) {
          return p(a(this.search, this.label, this.groupValues, this.groupLabel), r(this.groupValues, this.groupLabel))(e);
        }, flatAndStrip: function (e) {
          return p(r(this.groupValues, this.groupLabel), o)(e);
        }, updateSearch: function (e) {
          this.search = e;
        }, isExistingOption: function (e) {
          return !!this.options && this.optionKeys.indexOf(e) > -1;
        }, isSelected: function (e) {
          var t = this.trackBy ? e[this.trackBy] : e;return this.valueKeys.indexOf(t) > -1;
        }, isNotSelected: function (e) {
          return !this.isSelected(e);
        }, getOptionLabel: function (e) {
          return e || 0 === e ? e.isTag ? e.label : this.customLabel(e, this.label) || "" : "";
        }, select: function (e, t) {
          if (!(-1 !== this.blockKeys.indexOf(t) || this.disabled || e.$isLabel || this.max && this.multiple && this.internalValue.length === this.max)) {
            if (e.isTag) this.$emit("tag", e.label, this.id), this.search = "", this.closeOnSelect && !this.multiple && this.deactivate();else {
              if (this.isSelected(e)) return void ("Tab" !== t && this.removeElement(e));this.multiple ? this.internalValue.push(e) : this.internalValue = [e], this.$emit("select", (0, h.default)(e), this.id), this.$emit("input", this.getValue(), this.id), this.clearOnSelect && (this.search = "");
            }this.closeOnSelect && this.deactivate();
          }
        }, removeElement: function (e) {
          if (!this.disabled && (this.allowEmpty || !(this.internalValue.length <= 1))) {
            var t = "object" === (void 0 === e ? "undefined" : u(e)) ? this.valueKeys.indexOf(e[this.trackBy]) : this.valueKeys.indexOf(e);this.internalValue.splice(t, 1), this.$emit("remove", (0, h.default)(e), this.id), this.$emit("input", this.getValue(), this.id), this.closeOnSelect && this.deactivate();
          }
        }, removeLastElement: function () {
          -1 === this.blockKeys.indexOf("Delete") && 0 === this.search.length && Array.isArray(this.internalValue) && this.removeElement(this.internalValue[this.internalValue.length - 1]);
        }, activate: function () {
          this.isOpen || this.disabled || (this.adjustPosition(), this.groupValues && 0 === this.pointer && this.filteredOptions.length && (this.pointer = 1), this.isOpen = !0, this.searchable ? (this.search = "", this.$refs.search.focus()) : this.$el.focus(), this.$emit("open", this.id));
        }, deactivate: function () {
          this.isOpen && (this.isOpen = !1, this.searchable ? this.$refs.search.blur() : this.$el.blur(), this.search = "", this.$emit("close", this.getValue(), this.id));
        }, toggle: function () {
          this.isOpen ? this.deactivate() : this.activate();
        }, adjustPosition: function () {
          "undefined" != typeof window && (this.hasEnoughSpace = this.$el.getBoundingClientRect().top + this.maxHeight < window.innerHeight);
        } } };
  }, function (e, t, i) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 }), t.default = { data: function () {
        return { pointer: 0, visibleElements: this.maxHeight / this.optionHeight };
      }, props: { showPointer: { type: Boolean, default: !0 }, optionHeight: { type: Number, default: 40 } }, computed: { pointerPosition: function () {
          return this.pointer * this.optionHeight;
        } }, watch: { filteredOptions: function () {
          this.pointerAdjust();
        } }, methods: { optionHighlight: function (e, t) {
          return { "multiselect__option--highlight": e === this.pointer && this.showPointer, "multiselect__option--selected": this.isSelected(t) };
        }, addPointerElement: function () {
          var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "Enter",
              t = e.key;this.filteredOptions.length > 0 && this.select(this.filteredOptions[this.pointer], t), this.pointerReset();
        }, pointerForward: function () {
          this.pointer < this.filteredOptions.length - 1 && (this.pointer++, this.$refs.list.scrollTop <= this.pointerPosition - this.visibleElements * this.optionHeight && (this.$refs.list.scrollTop = this.pointerPosition - (this.visibleElements - 1) * this.optionHeight), this.filteredOptions[this.pointer].$isLabel && this.pointerForward());
        }, pointerBackward: function () {
          this.pointer > 0 ? (this.pointer--, this.$refs.list.scrollTop >= this.pointerPosition && (this.$refs.list.scrollTop = this.pointerPosition), this.filteredOptions[this.pointer].$isLabel && this.pointerBackward()) : this.filteredOptions[0].$isLabel && this.pointerForward();
        }, pointerReset: function () {
          this.closeOnSelect && (this.pointer = 0, this.$refs.list && (this.$refs.list.scrollTop = 0));
        }, pointerAdjust: function () {
          this.pointer >= this.filteredOptions.length - 1 && (this.pointer = this.filteredOptions.length ? this.filteredOptions.length - 1 : 0);
        }, pointerSet: function (e) {
          this.pointer = e;
        } } };
  }, function (e, t, i) {
    "use strict";
    function n(e) {
      if (Array.isArray(e)) return e.map(n);if (e && "object" === (void 0 === e ? "undefined" : s(e))) {
        for (var t = {}, i = Object.keys(e), l = 0, o = i.length; l < o; l++) {
          var r = i[l];t[r] = n(e[r]);
        }return t;
      }return e;
    }Object.defineProperty(t, "__esModule", { value: !0 });var s = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
      return typeof e;
    } : function (e) {
      return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
    };t.default = n;
  }, function (e, t, i) {
    i(6);var n = i(7)(i(5), i(8), null, null);e.exports = n.exports;
  }, function (e, t, i) {
    "use strict";
    function n(e) {
      return e && e.__esModule ? e : { default: e };
    }Object.defineProperty(t, "__esModule", { value: !0 }), t.deepClone = t.pointerMixin = t.multiselectMixin = t.Multiselect = void 0;var s = i(3),
        l = n(s),
        o = i(0),
        r = n(o),
        a = i(1),
        u = n(a),
        c = i(2),
        h = n(c);t.default = l.default, t.Multiselect = l.default, t.multiselectMixin = r.default, t.pointerMixin = u.default, t.deepClone = h.default;
  }, function (e, t, i) {
    "use strict";
    function n(e) {
      return e && e.__esModule ? e : { default: e };
    }Object.defineProperty(t, "__esModule", { value: !0 });var s = i(0),
        l = n(s),
        o = i(1),
        r = n(o);t.default = { name: "vue-multiselect", mixins: [l.default, r.default], props: { selectLabel: { type: String, default: "Press enter to select" }, selectedLabel: { type: String, default: "Selected" }, deselectLabel: { type: String, default: "Press enter to remove" }, showLabels: { type: Boolean, default: !0 }, limit: { type: Number, default: 99999 }, maxHeight: { type: Number, default: 300 }, limitText: { type: Function, default: function (e) {
            return "and " + e + " more";
          } }, loading: { type: Boolean, default: !1 }, disabled: { type: Boolean, default: !1 } }, computed: { visibleValue: function () {
          return this.multiple ? this.internalValue.slice(0, this.limit) : [];
        }, deselectLabelText: function () {
          return this.showLabels ? this.deselectLabel : "";
        }, selectLabelText: function () {
          return this.showLabels ? this.selectLabel : "";
        }, selectedLabelText: function () {
          return this.showLabels ? this.selectedLabel : "";
        } } };
  }, function (e, t) {}, function (e, t) {
    e.exports = function (e, t, i, n) {
      var s,
          l = e = e || {},
          o = typeof e.default;"object" !== o && "function" !== o || (s = e, l = e.default);var r = "function" == typeof l ? l.options : l;if (t && (r.render = t.render, r.staticRenderFns = t.staticRenderFns), i && (r._scopeId = i), n) {
        var a = Object.create(r.computed || null);Object.keys(n).forEach(function (e) {
          var t = n[e];a[e] = function () {
            return t;
          };
        }), r.computed = a;
      }return { esModule: s, exports: l, options: r };
    };
  }, function (e, t) {
    e.exports = { render: function () {
        var e = this,
            t = e.$createElement,
            i = e._self._c || t;return i("div", { staticClass: "multiselect", class: { "multiselect--active": e.isOpen, "multiselect--disabled": e.disabled, "multiselect--above": !e.hasEnoughSpace }, attrs: { tabindex: e.searchable ? -1 : 0 }, on: { focus: function (t) {
              e.activate();
            }, blur: function (t) {
              !e.searchable && e.deactivate();
            }, keydown: [function (t) {
              e._k(t.keyCode, "down", 40) || t.target === t.currentTarget && (t.preventDefault(), e.pointerForward());
            }, function (t) {
              e._k(t.keyCode, "up", 38) || t.target === t.currentTarget && (t.preventDefault(), e.pointerBackward());
            }, function (t) {
              e._k(t.keyCode, "enter", 13) && e._k(t.keyCode, "tab", 9) || (t.stopPropagation(), t.target === t.currentTarget && e.addPointerElement(t));
            }], keyup: function (t) {
              e._k(t.keyCode, "esc", 27) || e.deactivate();
            } } }, [e._t("carret", [i("div", { staticClass: "multiselect__select", on: { mousedown: function (t) {
              t.preventDefault(), e.toggle();
            } } })]), e._v(" "), i("div", { ref: "tags", staticClass: "multiselect__tags" }, [e._l(e.visibleValue, function (t) {
          return i("span", { staticClass: "multiselect__tag", on: { mousedown: function (e) {
                e.preventDefault();
              } } }, [i("span", { domProps: { textContent: e._s(e.getOptionLabel(t)) } }), e._v(" "), i("i", { staticClass: "multiselect__tag-icon", attrs: { "aria-hidden": "true", tabindex: "1" }, on: { keydown: function (i) {
                e._k(i.keyCode, "enter", 13) || (i.preventDefault(), e.removeElement(t));
              }, mousedown: function (i) {
                i.preventDefault(), e.removeElement(t);
              } } })]);
        }), e._v(" "), e.internalValue && e.internalValue.length > e.limit ? [i("strong", { domProps: { textContent: e._s(e.limitText(e.internalValue.length - e.limit)) } })] : e._e(), e._v(" "), i("transition", { attrs: { name: "multiselect__loading" } }, [e._t("loading", [i("div", { directives: [{ name: "show", rawName: "v-show", value: e.loading, expression: "loading" }], staticClass: "multiselect__spinner" })])], 2), e._v(" "), e.searchable ? i("input", { ref: "search", staticClass: "multiselect__input", attrs: { type: "text", autocomplete: "off", placeholder: e.placeholder, disabled: e.disabled }, domProps: { value: e.isOpen ? e.search : e.currentOptionLabel }, on: { input: function (t) {
              e.updateSearch(t.target.value);
            }, focus: function (t) {
              t.preventDefault(), e.activate();
            }, blur: function (t) {
              t.preventDefault(), e.deactivate();
            }, keyup: function (t) {
              e._k(t.keyCode, "esc", 27) || e.deactivate();
            }, keydown: [function (t) {
              e._k(t.keyCode, "down", 40) || (t.preventDefault(), e.pointerForward());
            }, function (t) {
              e._k(t.keyCode, "up", 38) || (t.preventDefault(), e.pointerBackward());
            }, function (t) {
              e._k(t.keyCode, "enter", 13) || t.preventDefault();
            }, function (t) {
              e._k(t.keyCode, "enter", 13) && e._k(t.keyCode, "tab", 9) || (t.stopPropagation(), t.target === t.currentTarget && e.addPointerElement(t));
            }, function (t) {
              e._k(t.keyCode, "delete", [8, 46]) || e.removeLastElement();
            }] } }) : e._e(), e._v(" "), e.searchable ? e._e() : i("span", { staticClass: "multiselect__single", domProps: { textContent: e._s(e.currentOptionLabel) } })], 2), e._v(" "), i("transition", { attrs: { name: "multiselect" } }, [i("ul", { directives: [{ name: "show", rawName: "v-show", value: e.isOpen, expression: "isOpen" }], ref: "list", staticClass: "multiselect__content", style: { maxHeight: e.maxHeight + "px" }, on: { mousedown: function (e) {
              e.preventDefault();
            } } }, [e._t("beforeList"), e._v(" "), e.multiple && e.max === e.internalValue.length ? i("li", [i("span", { staticClass: "multiselect__option" }, [e._t("maxElements", [e._v("Maximum of " + e._s(e.max) + " options selected. First remove a selected option to select another.")])], 2)]) : e._e(), e._v(" "), !e.max || e.internalValue.length < e.max ? e._l(e.filteredOptions, function (t, n) {
          return i("li", { key: n, staticClass: "multiselect__element" }, [t.$isLabel ? e._e() : i("span", { staticClass: "multiselect__option", class: e.optionHighlight(n, t), attrs: { tabindex: "0", "data-select": t.isTag ? e.tagPlaceholder : e.selectLabelText, "data-selected": e.selectedLabelText, "data-deselect": e.deselectLabelText }, on: { mousedown: function (i) {
                i.preventDefault(), e.select(t);
              }, mouseenter: function (t) {
                e.pointerSet(n);
              } } }, [e._t("option", [i("span", [e._v(e._s(e.getOptionLabel(t)))])], { option: t, search: e.search })], 2), e._v(" "), t.$isLabel ? i("span", { staticClass: "multiselect__option multiselect__option--disabled", class: e.optionHighlight(n, t) }, [e._v("\n              " + e._s(t.$groupLabel) + "\n            ")]) : e._e()]);
        }) : e._e(), e._v(" "), i("li", { directives: [{ name: "show", rawName: "v-show", value: 0 === e.filteredOptions.length && e.search && !e.loading, expression: "filteredOptions.length === 0 && search && !loading" }] }, [i("span", { staticClass: "multiselect__option" }, [e._t("noResult", [e._v("No elements found. Consider changing the search query.")])], 2)]), e._v(" "), e._t("afterList")], 2)])], 2);
      }, staticRenderFns: [] };
  }]);
});

/***/ }),

/***/ 115:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_date_picker_vue__ = __webpack_require__(108);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_47f218d2_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_date_picker_vue__ = __webpack_require__(121);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_date_picker_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_47f218d2_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_date_picker_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "view/assets/js/components/task-lists/date-picker.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] date-picker.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-47f218d2", Component.options)
  } else {
    hotAPI.reload("data-v-47f218d2", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 116:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_new_task_btn_vue__ = __webpack_require__(109);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_2a5b5807_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_new_task_btn_vue__ = __webpack_require__(120);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_new_task_btn_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_2a5b5807_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_new_task_btn_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "view/assets/js/components/task-lists/new-task-btn.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] new-task-btn.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-2a5b5807", Component.options)
  } else {
    hotAPI.reload("data-v-2a5b5807", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 117:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_new_task_form_vue__ = __webpack_require__(110);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7b80aaae_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_new_task_form_vue__ = __webpack_require__(125);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_new_task_form_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7b80aaae_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_new_task_form_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "view/assets/js/components/task-lists/new-task-form.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] new-task-form.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7b80aaae", Component.options)
  } else {
    hotAPI.reload("data-v-7b80aaae", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 118:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_new_task_list_form_vue__ = __webpack_require__(111);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7db5bc7e_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_new_task_list_form_vue__ = __webpack_require__(126);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_new_task_list_form_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7db5bc7e_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_new_task_list_form_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "view/assets/js/components/task-lists/new-task-list-form.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] new-task-list-form.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7db5bc7e", Component.options)
  } else {
    hotAPI.reload("data-v-7db5bc7e", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 119:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_tasks_vue__ = __webpack_require__(112);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_52cdc098_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_tasks_vue__ = __webpack_require__(123);
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

/***/ 120:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    class: _vm.newTaskBtnClass()
  }, [_c('a', {
    attrs: {
      "href": "#"
    },
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.showHideTaskFrom('toggle', _vm.list)
      }
    }
  }, [_vm._v("New Task")])])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-2a5b5807", esExports)
  }
}

/***/ }),

/***/ 121:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('input', {
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": _vm.value
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
     require("vue-hot-reload-api").rerender("data-v-47f218d2", esExports)
  }
}

/***/ }),

/***/ 123:
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
        value: (task.status),
        expression: "task.status"
      }],
      attrs: {
        "disabled": !_vm.is_assigned(task),
        "type": "checkbox",
        "value": "",
        "name": ""
      },
      domProps: {
        "checked": Array.isArray(task.status) ? _vm._i(task.status, "") > -1 : (task.status)
      },
      on: {
        "click": function($event) {
          _vm.taskDoneUndone(task, task.status)
        },
        "__c": function($event) {
          var $$a = task.status,
            $$el = $event.target,
            $$c = $$el.checked ? (true) : (false);
          if (Array.isArray($$a)) {
            var $$v = "",
              $$i = _vm._i($$a, $$v);
            if ($$el.checked) {
              $$i < 0 && (task.status = $$a.concat($$v))
            } else {
              $$i > -1 && (task.status = $$a.slice(0, $$i).concat($$a.slice($$i + 1)))
            }
          } else {
            task.status = $$c
          }
        }
      }
    }), _vm._v(" "), _c('span', [_c('router-link', {
      attrs: {
        "to": {
          name: 'single_task',
          params: {
            list_id: _vm.list.id,
            task_id: task.id,
            project_id: 1,
            task: task
          }
        }
      }
    }, [_vm._v("\n\n\t                                    \t" + _vm._s(task.title) + "\n\t                                \t")])], 1), _vm._v(" "), _c('span', {
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
      class: _vm.taskDateWrap(task.start_at, task.due_date)
    }, [(_vm.task_start_field) ? _c('span', [_vm._v(_vm._s((task.start_at.date)))]) : _vm._e(), _vm._v(" "), (_vm.isBetweenDate(_vm.task_start_field, task.start_at, task.due_date)) ? _c('span', [_vm._v("–")]) : _vm._e(), _vm._v(" "), _c('span', [_vm._v(_vm._s((task.due_date.date || '')))])])], 2), _vm._v(" "), _c('div', {
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
    })])], 1)]), _vm._v(" "), _c('div', {
      staticClass: "cpm-col-1 cpm-todo-action-right cpm-last-col"
    }, [_c('a', {
      staticClass: "cpm-todo-delete",
      attrs: {
        "href": "#"
      },
      on: {
        "click": function($event) {
          $event.preventDefault();
          _vm.deleteTask(task)
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
          _vm.showHideTaskFrom('toggle', false, task)
        }
      }
    }, [_c('span', {
      staticClass: "dashicons dashicons-edit"
    })])]), _vm._v(" "), _c('div', {
      staticClass: "clearfix"
    })])]), _vm._v(" "), (task.edit_mode) ? _c('div', {
      staticClass: "cpm-todo-form"
    }, [_c('new-task-form', {
      attrs: {
        "task": task,
        "list": _vm.list
      }
    })], 1) : _vm._e()])])
  }), _vm._v(" "), (!_vm.getIncompleteTasks) ? _c('li', {
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
        value: (task.status),
        expression: "task.status"
      }],
      attrs: {
        "type": "checkbox",
        "value": "",
        "name": ""
      },
      domProps: {
        "checked": Array.isArray(task.status) ? _vm._i(task.status, "") > -1 : (task.status)
      },
      on: {
        "click": function($event) {
          _vm.taskDoneUndone(task, task.status)
        },
        "__c": function($event) {
          var $$a = task.status,
            $$el = $event.target,
            $$c = $$el.checked ? (true) : (false);
          if (Array.isArray($$a)) {
            var $$v = "",
              $$i = _vm._i($$a, $$v);
            if ($$el.checked) {
              $$i < 0 && (task.status = $$a.concat($$v))
            } else {
              $$i > -1 && (task.status = $$a.slice(0, $$i).concat($$a.slice($$i + 1)))
            }
          } else {
            task.status = $$c
          }
        }
      }
    }), _vm._v(" "), _c('span', {
      staticClass: "task-title"
    }, [_c('router-link', {
      attrs: {
        "to": {
          name: 'single_task',
          params: {
            list_id: _vm.list.id,
            task_id: task.id,
            project_id: 1,
            task: task
          }
        }
      }
    }, [_c('span', {
      staticClass: "cpm-todo-text"
    }, [_vm._v(_vm._s(task.title))])]), _vm._v(" "), _c('span', {
      class: _vm.privateClass(task)
    })], 1), _vm._v(" "), _vm._l((_vm.getUsers(task.assigned_to)), function(user) {
      return _c('span', {
        key: user.ID,
        staticClass: "cpm-assigned-user",
        domProps: {
          "innerHTML": _vm._s(user.user_url)
        }
      })
    }), _vm._v(" "), _c('span', {
      class: _vm.completedTaskWrap(task.start_at, task.due_date)
    }, [(_vm.task_start_field) ? _c('span', [_vm._v(_vm._s((task.start_at.date)))]) : _vm._e(), _vm._v(" "), (_vm.isBetweenDate(_vm.task_start_field, task.start_at.date, task.due_date.date)) ? _c('span', [_vm._v("–")]) : _vm._e(), _vm._v(" "), _c('span', [_vm._v(_vm._s((task.due_date.date)))])])], 2), _vm._v(" "), _c('div', {
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
        "list": _vm.list
      }
    })], 1) : _vm._e()])])
  }), _vm._v(" "), (!_vm.getCompletedTask) ? _c('li', {
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
      "list": _vm.list
    }
  })], 1) : _vm._e()]) : _c('div', [_c('div', {
    staticClass: "cpm-incomplete-tasks"
  }, [_c('ul', {
    staticClass: "cpm-todos cpm-todolist-content cpm-incomplete-task"
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
    }, [_c('div', [_c('div', {
      staticClass: "cpm-col-7"
    }, [_c('input', {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: (task.status),
        expression: "task.status"
      }],
      attrs: {
        "disabled": !_vm.is_assigned(task),
        "type": "checkbox",
        "value": "",
        "name": ""
      },
      domProps: {
        "checked": Array.isArray(task.status) ? _vm._i(task.status, "") > -1 : (task.status)
      },
      on: {
        "click": function($event) {
          _vm.taskDoneUndone(task, task.status)
        },
        "__c": function($event) {
          var $$a = task.status,
            $$el = $event.target,
            $$c = $$el.checked ? (true) : (false);
          if (Array.isArray($$a)) {
            var $$v = "",
              $$i = _vm._i($$a, $$v);
            if ($$el.checked) {
              $$i < 0 && (task.status = $$a.concat($$v))
            } else {
              $$i > -1 && (task.status = $$a.slice(0, $$i).concat($$a.slice($$i + 1)))
            }
          } else {
            task.status = $$c
          }
        }
      }
    }), _vm._v(" "), (_vm.is_single_list) ? _c('span', [_c('router-link', {
      attrs: {
        "to": {
          name: 'lists_single_task',
          params: {
            list_id: _vm.list.id,
            task_id: task.id,
            project_id: _vm.project_id,
            task: task
          }
        }
      }
    }, [_vm._v("\n\n\t                                    \t" + _vm._s(task.title) + "\n\t                                \t")])], 1) : _c('span', [_c('router-link', {
      attrs: {
        "exact": "",
        "to": {
          name: 'lists_single_task',
          params: {
            task_id: task.id,
            project_id: _vm.project_id,
          }
        }
      }
    }, [_vm._v("\n\n\t                                    \t" + _vm._s(task.title) + "\n\t                                    ")])], 1), _vm._v(" "), _c('span', {
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
      class: _vm.taskDateWrap(task.start_at, task.due_date)
    }, [(_vm.task_start_field) ? _c('span', [_vm._v(_vm._s((task.start_at.date)))]) : _vm._e(), _vm._v(" "), (_vm.isBetweenDate(_vm.task_start_field, task.start_at.date, task.due_date.date)) ? _c('span', [_vm._v("–")]) : _vm._e(), _vm._v(" "), _c('span', [_vm._v(_vm._s((task.due_date.date)))])])], 2), _vm._v(" "), _c('div', {
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
    })])], 1) : _c('span', [_c('router-link', {
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
    })])], 1)])]), _vm._v(" "), _c('div', {
      staticClass: "cpm-col-1 cpm-todo-action-right cpm-last-col"
    }, [_c('a', {
      staticClass: "cpm-todo-edit",
      attrs: {
        "href": "#"
      },
      on: {
        "click": function($event) {
          $event.preventDefault();
          _vm.showHideTaskFrom('toggle', false, task)
        }
      }
    }, [_c('span', {
      staticClass: "dashicons dashicons-edit"
    })]), _vm._v(" "), _c('a', {
      staticClass: "cpm-todo-delete",
      attrs: {
        "href": "#"
      },
      on: {
        "click": function($event) {
          $event.preventDefault();
          _vm.deleteTask(task)
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
        "list": _vm.list
      }
    })], 1) : _vm._e()])])
  }), _vm._v(" "), (!_vm.getIncompleteTasks.length) ? _c('li', {
    staticClass: "nonsortable"
  }, [_vm._v("No tasks found.")]) : _vm._e(), _vm._v(" "), (_vm.list.show_task_form) ? _c('li', {
    staticClass: "cpm-todo-form nonsortable"
  }, [_c('new-task-form', {
    attrs: {
      "task": {},
      "list": _vm.list
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
        value: (task.status),
        expression: "task.status"
      }],
      attrs: {
        "type": "checkbox",
        "value": "",
        "name": ""
      },
      domProps: {
        "checked": Array.isArray(task.status) ? _vm._i(task.status, "") > -1 : (task.status)
      },
      on: {
        "click": function($event) {
          _vm.taskDoneUndone(task, task.status)
        },
        "__c": function($event) {
          var $$a = task.status,
            $$el = $event.target,
            $$c = $$el.checked ? (true) : (false);
          if (Array.isArray($$a)) {
            var $$v = "",
              $$i = _vm._i($$a, $$v);
            if ($$el.checked) {
              $$i < 0 && (task.status = $$a.concat($$v))
            } else {
              $$i > -1 && (task.status = $$a.slice(0, $$i).concat($$a.slice($$i + 1)))
            }
          } else {
            task.status = $$c
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
      class: _vm.completedTaskWrap(task.start_at, task.due_date)
    }, [(_vm.task_start_field) ? _c('span', [_vm._v(_vm._s((task.start_at.date)))]) : _vm._e(), _vm._v(" "), (_vm.isBetweenDate(_vm.task_start_field, task.start_at.date, task.due_date.date)) ? _c('span', [_vm._v("–")]) : _vm._e(), _vm._v(" "), _c('span', [_vm._v(_vm._s((task.due_date.date)))])])], 2), _vm._v(" "), _c('div', {
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
          _vm.deleteTask(task)
        }
      }
    }, [_c('span', {
      staticClass: "dashicons dashicons-trash"
    })])]), _vm._v(" "), _c('div', {
      staticClass: "clearfix"
    })]), _vm._v(" "), _vm._m(2, true)]), _vm._v(" "), (task.edit_mode) ? _c('div', {
      staticClass: "cpm-todo-form"
    }, [_c('new-task-form', {
      attrs: {
        "task": task,
        "list": _vm.list
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

/***/ 125:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    class: 'cpm-task-edit-form cpm-slide-' + _vm.task.id
  }, [_c('form', {
    staticClass: "cpm-task-form",
    attrs: {
      "action": "",
      "method": "post"
    },
    on: {
      "submit": function($event) {
        $event.preventDefault();
        _vm.newTask()
      }
    }
  }, [_c('div', {
    staticClass: "item task-title"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.task.title),
      expression: "task.title"
    }],
    staticClass: "task_title",
    attrs: {
      "type": "text",
      "name": "task_title",
      "placeholder": "Add a new task",
      "value": "",
      "required": "required"
    },
    domProps: {
      "value": (_vm.task.title)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.task.title = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "item content"
  }, [_c('textarea', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.task.description),
      expression: "task.description"
    }],
    staticClass: "todo_content",
    attrs: {
      "name": "task_text",
      "cols": "40",
      "placeholder": "Add extra details about this task (optional)",
      "rows": "2"
    },
    domProps: {
      "value": (_vm.task.description)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.task.description = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "item date"
  }, [(_vm.task_start_field) ? _c('div', {
    staticClass: "cpm-task-start-field"
  }, [_c('label', [_vm._v("Start Date")]), _vm._v(" "), _c('cpm-datepickter', {
    staticClass: "cpm-datepickter-from",
    attrs: {
      "dependency": "cpm-datepickter-to"
    },
    model: {
      value: (_vm.task.start_at),
      callback: function($$v) {
        _vm.task.start_at = $$v
      },
      expression: "task.start_at"
    }
  })], 1) : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "cpm-task-due-field"
  }, [_c('label', [_vm._v("Due Date")]), _vm._v(" "), _c('cpm-datepickter', {
    staticClass: "cpm-datepickter-to",
    attrs: {
      "dependency": "cpm-datepickter-from"
    },
    model: {
      value: (_vm.task.due_date),
      callback: function($$v) {
        _vm.task.due_date = $$v
      },
      expression: "task.due_date"
    }
  })], 1)]), _vm._v(" "), _c('div', {
    staticClass: "item user"
  }, [_c('div', [_c('multiselect', {
    attrs: {
      "options": _vm.project_users,
      "multiple": true,
      "close-on-select": false,
      "clear-on-select": false,
      "hide-selected": true,
      "show-labels": false,
      "placeholder": "Select User",
      "label": "display_name",
      "track-by": "id"
    },
    model: {
      value: (_vm.task_assign),
      callback: function($$v) {
        _vm.task_assign = $$v
      },
      expression: "task_assign"
    }
  })], 1)]), _vm._v(" "), _c('div', {
    staticClass: "item submit"
  }, [_c('span', {
    staticClass: "cpm-new-task-spinner"
  }), _vm._v(" "), (_vm.task.edit_mode) ? _c('span', [_c('input', {
    staticClass: "button-primary",
    attrs: {
      "disabled": _vm.submit_disabled,
      "type": "submit",
      "name": "submit_todo",
      "value": "Update Task"
    }
  })]) : _vm._e(), _vm._v(" "), (!_vm.task.edit_mode) ? _c('span', [_c('input', {
    staticClass: "button-primary",
    attrs: {
      "disabled": _vm.submit_disabled,
      "type": "submit",
      "name": "submit_todo",
      "value": "New Task"
    }
  })]) : _vm._e(), _vm._v(" "), _c('a', {
    staticClass: "button todo-cancel",
    attrs: {
      "href": "#"
    },
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.showHideTaskFrom(false, _vm.list, _vm.task)
      }
    }
  }, [_vm._v("Cancel")]), _vm._v(" "), _c('span', {
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
     require("vue-hot-reload-api").rerender("data-v-7b80aaae", esExports)
  }
}

/***/ }),

/***/ 126:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    class: _vm.todolistFormClass(_vm.list) + ' cpm-new-todolist-form'
  }, [_c('form', {
    attrs: {
      "action": "",
      "method": "post"
    },
    on: {
      "submit": function($event) {
        $event.preventDefault();
        _vm.newTodoList()
      }
    }
  }, [_c('div', {
    staticClass: "item title"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.list.title),
      expression: "list.title"
    }],
    attrs: {
      "type": "text",
      "required": "required",
      "name": "tasklist_name",
      "placeholder": "Task list name"
    },
    domProps: {
      "value": (_vm.list.title)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.list.title = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "item content"
  }, [_c('textarea', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.list.description),
      expression: "list.description"
    }],
    attrs: {
      "name": "tasklist_detail",
      "id": "",
      "cols": "40",
      "rows": "2",
      "placeholder": "Task list details"
    },
    domProps: {
      "value": (_vm.list.description)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.list.description = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "item milestone"
  }, [_c('select', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.milestone_id),
      expression: "milestone_id"
    }],
    on: {
      "change": function($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function(o) {
          return o.selected
        }).map(function(o) {
          var val = "_value" in o ? o._value : o.value;
          return val
        });
        _vm.milestone_id = $event.target.multiple ? $$selectedVal : $$selectedVal[0]
      }
    }
  }, [_c('option', {
    attrs: {
      "value": "-1"
    }
  }, [_vm._v("\n                    - Milestone -\n                ")]), _vm._v(" "), _vm._l((_vm.milestones), function(milestone) {
    return _c('option', {
      domProps: {
        "value": milestone.id
      }
    }, [_vm._v("\n                    " + _vm._s(milestone.title) + "\n                ")])
  })], 2)]), _vm._v(" "), _c('div', {
    staticClass: "item submit"
  }, [_c('span', {
    staticClass: "cpm-new-list-spinner"
  }), _vm._v(" "), _c('input', {
    staticClass: "button-primary",
    attrs: {
      "type": "submit",
      "disabled": _vm.submit_disabled,
      "name": "submit_todo"
    },
    domProps: {
      "value": _vm.submit_btn_text
    }
  }), _vm._v(" "), _c('a', {
    staticClass: "button list-cancel",
    attrs: {
      "href": "#"
    },
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.showHideListForm(false, _vm.list)
      }
    }
  }, [_vm._v("Cancel")]), _vm._v(" "), _c('span', {
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
     require("vue-hot-reload-api").rerender("data-v-7db5bc7e", esExports)
  }
}

/***/ }),

/***/ 145:
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

/* harmony default export */ __webpack_exports__["a"] = ({
    /**
     * Initial data for this component
     * 
     * @return obj
     */
    data: function () {
        return {
            list: {},
            index: false,
            permissions: this.$store.state.permissions,
            text: {
                new_todo: 'New Task List'
            }
        };
    },

    computed: {
        /**
         * Show new todo-list form
         * 
         * @return boolean
         */
        show_list_form: function () {
            return this.$store.state.show_list_form;
        }
    },

    methods: {}
});

/***/ }),

/***/ 150:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__new_task_list_btn_vue__ = __webpack_require__(173);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__new_task_list_form_vue__ = __webpack_require__(118);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__new_task_btn_vue__ = __webpack_require__(116);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__pagination_vue__ = __webpack_require__(103);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__header_vue__ = __webpack_require__(97);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__tasks_vue__ = __webpack_require__(119);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
			vm.getLists(vm);
			vm.getMilestones(vm);
		});
	},
	components: {
		'new-task-list-btn': __WEBPACK_IMPORTED_MODULE_0__new_task_list_btn_vue__["a" /* default */],
		'new-task-list-form': __WEBPACK_IMPORTED_MODULE_1__new_task_list_form_vue__["a" /* default */],
		'new-task-button': __WEBPACK_IMPORTED_MODULE_2__new_task_btn_vue__["a" /* default */],
		'pm-pagination': __WEBPACK_IMPORTED_MODULE_3__pagination_vue__["a" /* default */],
		'pm-header': __WEBPACK_IMPORTED_MODULE_4__header_vue__["a" /* default */],
		'tasks': __WEBPACK_IMPORTED_MODULE_5__tasks_vue__["a" /* default */]
	},

	/**
  * Initial data for this component
  * 
  * @return obj
  */
	data() {
		return {
			list: {},
			index: false,
			project_id: this.$route.params.project_id,
			current_page_number: 1
		};
	},

	watch: {
		'$route'(route) {
			this.getLists(this);
		}
	},

	created() {
		this.$store.state.is_single_list = false;
	},

	computed: {
		/**
   * Get lists from vuex store
   * 
   * @return array
   */
		lists() {
			return this.$store.state.lists;
		},

		/**
   * Get milestones from vuex store
   * 
   * @return array
   */
		milestones() {
			return this.$store.state.milestones;
		},

		/**
   * Get initial data from vuex store when this component loaded
   * 
   * @return obj
   */
		init() {
			return this.$store.state.init;
		},

		/**
   * Get task for single task popup
   * 
   * @return object
   */
		task() {
			return this.$store.state.task;
		},

		total() {
			return Math.ceil(this.$store.state.list_total / this.$store.state.todo_list_per_page);
		},

		limit() {
			return this.$store.state.todo_list_per_page;
		},

		is_active_list_form() {
			return this.$store.state.is_active_list_form;
		},

		total_list_page() {
			return this.$store.state.total_list_page;
		}
	},

	methods: {

		showEditForm(list, index) {
			list.edit_mode = list.edit_mode ? false : true;
		}
	}
});

/***/ }),

/***/ 173:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_new_task_list_btn_vue__ = __webpack_require__(145);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_17a13792_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_new_task_list_btn_vue__ = __webpack_require__(181);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_new_task_list_btn_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_17a13792_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_new_task_list_btn_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "view/assets/js/components/task-lists/new-task-list-btn.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] new-task-list-btn.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-17a13792", Component.options)
  } else {
    hotAPI.reload("data-v-17a13792", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 181:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [(_vm.permissions.create_todolist) ? _c('a', {
    staticClass: "cpm-btn cpm-btn-blue cpm-margin-bottom add-tasklist cpm-btn-uppercase",
    attrs: {
      "href": "#"
    },
    on: {
      "click": function($event) {
        $event.preventDefault();
        _vm.showHideListForm('toggle')
      }
    }
  }, [(!_vm.show_list_form) ? _c('i', {
    staticClass: "fa fa-plus-circle",
    attrs: {
      "aria-hidden": "true"
    }
  }) : _vm._e(), _vm._v(" "), (_vm.show_list_form) ? _c('i', {
    staticClass: "fa fa-minus-circle",
    attrs: {
      "aria-hidden": "true"
    }
  }) : _vm._e(), _vm._v("\n\t    " + _vm._s(_vm.text.new_todo) + "\n\t")]) : _vm._e()])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-17a13792", esExports)
  }
}

/***/ }),

/***/ 20:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_task_lists_vue__ = __webpack_require__(150);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_d11df19a_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_task_lists_vue__ = __webpack_require__(203);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_task_lists_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_d11df19a_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_task_lists_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "view/assets/js/components/task-lists/task-lists.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] task-lists.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-d11df19a", Component.options)
  } else {
    hotAPI.reload("data-v-d11df19a", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),

/***/ 203:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('pm-header'), _vm._v(" "), _c('div', {
    staticClass: "cpm-task-container wrap",
    attrs: {
      "id": "cpm-task-el"
    }
  }, [_c('new-task-list-btn'), _vm._v(" "), (_vm.is_active_list_form) ? _c('new-task-list-form', {
    attrs: {
      "section": "lists",
      "list": {}
    }
  }) : _vm._e(), _vm._v(" "), _c('ul', {
    staticClass: "cpm-todolists"
  }, _vm._l((_vm.lists), function(list, index) {
    return _c('li', {
      key: list.id,
      class: 'cpm-fade-out-' + list.id
    }, [_c('article', {
      staticClass: "cpm-todolist"
    }, [_c('header', {
      staticClass: "cpm-list-header"
    }, [_c('h3', [_c('router-link', {
      attrs: {
        "to": {
          name: 'single_list',
          params: {
            list_id: list.id
          }
        }
      }
    }, [_vm._v(_vm._s(list.title))]), _vm._v(" "), _c('span', {
      class: _vm.privateClass(list)
    }), _vm._v(" "), _c('div', {
      staticClass: "cpm-right"
    }, [_c('a', {
      attrs: {
        "href": "#",
        "title": "Edit this List"
      },
      on: {
        "click": function($event) {
          $event.preventDefault();
          _vm.showEditForm(list)
        }
      }
    }, [_c('span', {
      staticClass: "dashicons dashicons-edit"
    })]), _vm._v(" "), _c('a', {
      staticClass: "cpm-btn cpm-btn-xs",
      attrs: {
        "href": "#",
        "title": "Delete this List",
        "data-list_id": list.ID,
        "data-confirm": "Are you sure to delete this task list?"
      },
      on: {
        "click": function($event) {
          $event.preventDefault();
          _vm.deleteList(list.id)
        }
      }
    }, [_c('span', {
      staticClass: "dashicons dashicons-trash"
    })])])], 1), _vm._v(" "), _c('div', {
      staticClass: "cpm-entry-detail"
    }, [_vm._v("\n\t                        " + _vm._s(list.description) + "    \n\t                    ")]), _vm._v(" "), (list.edit_mode) ? _c('div', {
      staticClass: "cpm-update-todolist-form"
    }, [_c('new-task-list-form', {
      attrs: {
        "section": "lists",
        "list": list
      }
    })], 1) : _vm._e()]), _vm._v(" "), _c('tasks', {
      attrs: {
        "list": list
      }
    }), _vm._v(" "), _c('footer', {
      staticClass: "cpm-row cpm-list-footer"
    }, [_c('div', {
      staticClass: "cpm-col-6"
    }, [_c('div', [_c('new-task-button', {
      attrs: {
        "task": {},
        "list": list
      }
    })], 1), _vm._v(" "), _c('div', {
      staticClass: "cpm-col-3 cpm-todo-complete"
    }, [_c('router-link', {
      attrs: {
        "to": {
          name: 'single_list',
          params: {
            list_id: list.id
          }
        }
      }
    }, [_c('span', [_vm._v(_vm._s(list.meta.total_complete_tasks))]), _vm._v(" "), _vm._v("\n\t                                Completed\n\t                            ")])], 1), _vm._v(" "), _c('div', {
      staticClass: "cpm-col-3 cpm-todo-incomplete"
    }, [_c('router-link', {
      attrs: {
        "to": {
          name: 'single_list',
          params: {
            list_id: list.id
          }
        }
      }
    }, [_c('span', [_vm._v(_vm._s(list.meta.total_incomplete_tasks))]), _vm._v(" "), _vm._v("\n\t                                Incomplete\n\t                            ")])], 1), _vm._v(" "), _c('div', {
      staticClass: "cpm-col-3 cpm-todo-comment"
    }, [_c('router-link', {
      attrs: {
        "to": {
          name: 'single_list',
          params: {
            list_id: list.id
          }
        }
      }
    }, [_c('span', [_vm._v(_vm._s(list.meta.total_comments) + " Comments")])])], 1)]), _vm._v(" "), _c('div', {
      staticClass: "cpm-col-4 cpm-todo-prgress-bar"
    }, [_c('div', {
      staticClass: "bar completed",
      style: (_vm.getProgressStyle(list))
    })]), _vm._v(" "), _c('div', {
      staticClass: " cpm-col-1 no-percent"
    }, [_vm._v(_vm._s(_vm.getProgressPercent(list)) + "%")]), _vm._v(" "), _c('div', {
      staticClass: "clearfix"
    })])], 1)])
  })), _vm._v(" "), _c('pm-pagination', {
    attrs: {
      "total_pages": _vm.total_list_page,
      "current_page_number": _vm.current_page_number,
      "component_name": "list_pagination"
    }
  })], 1), _vm._v(" "), _c('router-view', {
    attrs: {
      "name": "single-task"
    }
  })], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-d11df19a", esExports)
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

/***/ })

});