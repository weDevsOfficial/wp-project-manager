(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = '<h3>{{text.comments}}</h3>\n<div class="comment-content">\n    <ul class="cpm-comment-wrap">\n        <li class="cpm-comment" v-for="comment in comments" >\n\n            <div class="cpm-avatar ">{{{comment.avatar}}}</div>\n            <div class="cpm-comment-container">\n                <div class="cpm-comment-meta">\n                    <span class="cpm-author">{{comment.comment_author}}</span>\n                    {{text.on}}\n                    <span class="cpm-date">{{comment.comment_date}}</span>\n\n                </div>\n                <div class="cpm-comment-content">\n                    {{{comment.comment_content}}}\n                </div>\n\n                <div v-if="comment.files.length">\n                    <ul class="cpm-attachments">\n                        <li v-for="cfile in comment.files">\n                        <prettyphoto :file="cfile" ></prettyphoto>\n\n                        </li>\n                    </ul>\n\n                </div>\n\n            </div>\n\n        </li>\n    </ul>\n\n</div>\n\n<div class=\'cpm-new-doc-comment-form\'>\n    <form @submit.prevent="createComment(comments, formid, task)" :id="formid">\n        <input type="hidden" name="action" value="cpm_task_create_comment" />\n        <input type="hidden" name="project_id" value="{{pree_init_data.current_project}}" />\n        <input type="hidden" name="parent_id" value="{{task.ID}}" />\n        <input type="hidden" name="_wpnonce" value="{{pree_init_data.cpm_nonce}}" />\n\n        <div class="cpm-trix-editor">\n            <input id="cc-{{formid}}" type="hidden" name="description" value="" />\n            <trix-editor input="cc-{{formid}}"></trix-editor>\n        </div>\n\n        <fileuploader :files="" :uploderid="uploderid"></fileuploader>\n        <input type="submit" name="submit" value="{{text.add_comment}}" class="button-primary" />\n    </form>\n</div>';
},{}],2:[function(require,module,exports){
module.exports = '<div class=\'cpm-attachment-area\'>\n    <div id=\'cpm-upload-container-dc\'>\n\n        <div class=\'cpm-upload-filelist\'>\n            <div class="cpm-uploaded-item" v-if="files.length" v-for="file in files"  >\n                <a href="{{file.url}}" target="_blank">\n                    <img :src="file.thumb" alt="{{file.name}}" />\n                </a>\n                <a href="#" data-id="{{file.id}}" id="{{file.id}}" class="cpm-delete-file button" @click.prevent="deletefile(file.id)">{{text.delete_file}}</a>\n                <input type="hidden" name="cpm_attachment[]" value="{{file.id}}">\n            </div>\n        </div>\n        <div class=\'clearfix\'></div>\n    </div>\n\n    <span class="dashicons dashicons-paperclip"></span> {{text.to_attach}}, <a href=\'#\' id=\'cpm-upload-pickfiles-dc\' class="" > {{text.select_file}} </a> {{text.from_computer}}.\n\n</div>';
},{}],3:[function(require,module,exports){
module.exports = '<a  target="_new" v-bind:class="{\'cpm-colorbox-img\' : file.type !=\'file\'}"  title="{{file.name}}" href="{{file.url}}">\n    <img :src="file.thumb" alt="{{file.name}}" />\n</a>';
},{}],4:[function(require,module,exports){
module.exports = '<div class="cpm-todo-form">\n    <form action="" method="post" class="cpm-task-form"  @submit.prevent="savetask(task,list,fid)" id="{{fid}}">\n    <input type="hidden" name="list_id" value="{{list.ID}}">\n    <input type="hidden" name="action" value="{{form_action}}">\n    <input type="hidden" name="single" value="false">\n    <input type="hidden" name="type" value="json">\n    <input type="hidden" name="_wp_none" value="{{wp_nonce}}">\n    <input type="hidden" name="project_id" value="{{current_project}}">\n    <input type="hidden" name="task_assign" value="{{task.task_assign}}">\n\n\n     <input type="hidden" name="task_id" v-if="task && task.ID" value="{{task.ID}}">\n\n\n    <div class="item task-title">\n        <input type="text" name="task_title" class="task_title" placeholder="{{text.add_a_new_todo}}" value="{{task.post_title}}" required>\n    </div>\n\n    <div class="item content">\n        <textarea name="task_text" class="todo_content" cols="40" placeholder="{{text.add_todo_details_text}}" rows="2" value="{{task.post_content}}"></textarea>\n    </div>\n\n    <div class="item date">\n\n        <div class="cpm-task-start-field" v-if="pree_init_data.task_start_field">\n            <label>{{text.start_date}} </label>\n            <input  type="text"  placeholder="{{text.start_date}}" value="{{task.start_date}}" name="task_start" v-model="task_start" v-datepicker />\n        </div>\n\n        <div class="cpm-task-due-field">\n            <label>{{text.due_date}}  </label>\n            <input type="text" autocomplete="off" class="date_picker_to" placeholder="{{text.due_date}}" value="{{task.due_date}}" name="task_due"  v-datepicker :min-date="task_start" />\n        </div>\n    </div>\n\n    <div class="item user">\n        <multiselect\n            @update="updateTaskAssignUser"\n            :options="pree_init_data.users"\n            :selected="task.assigned_to"\n            :multiple="true"\n            label="name"\n            :multiple="true"\n            :taggable="true"\n            key="id"\n        ></multiselect>\n\n\n    </div>\n\n     <partial name="todoform_extra_field"> </partial>\n\n    <div class="item submit">\n        <span class="cpm-new-task-spinner"></span>\n\n        <input type="submit" class="button-primary" name="submit_todo" value="{{text.submit}}">\n        <a class="button todo-cancel" href="#" @click.prevent="hideTaskForm(list, task)">{{text.cancel}}</a>\n    </div>\n</form>\n</div>';
},{}],5:[function(require,module,exports){
module.exports = '\n<ul  class="cpm-todos cpm-todolist-content" >\n\n    <li v-for="task in pendingList ">\n\n        <div class="cpm-todo-wrap clearfix">\n            <div class="cpm-todo-content" >\n\n                <div>\n                    <div class="cpm-col-7">\n\n\n                        <span class="cpm-spinner"></span>\n\n                        <input class="" type="checkbox" checked="{{task.completed==1}}" @click.prevent="checktoggeltask(task, list)">\n\n                        <span class="cpm-todo-text"> <a href="#" @click.prevent="taskDetails(task, list)"> {{task.post_title}} </a> </span>\n                        <span class="cpm-lock" v-show="task.task_privacy"></span>\n                        <span> <partial name="hook_cpm_task_extra"></partial> </span>\n                        \n                        <span  v-if="task.completed==0">\n                            <user_show_list\n                                :users="task.assigned_to"\n                                ></user_show_list>\n                            <span class="{{task.date_css_class}}"> {{{task.date_show}}} </span>\n\n                        </span>\n\n\n                    </div>\n\n                    <div class="cpm-col-4">\n\n                        <span class="comments column-comments post-com-count-wrapper">\n                            <a href="#" @click.prevent="taskDetails(task, list)"  class="post-com-count post-com-count-approved">\n                                <span class="comment-count-approved" aria-hidden="true">{{task.comment_count}}</span>\n                            </a>\n                        </span>\n\n\n                        <partial name="hook_cpm_task_column"></partial>\n\n                    </div>\n\n                    <div class="cpm-col-1 cpm-todo-action-right cpm-last-col">\n\n\n                        <a href="#" class="cpm-todo-delete" @click.prevent="deleteTask(tasks,task)" ><span class="dashicons dashicons-trash"></span></a>\n\n\n                        <a href="#" @click.prevent="editTask(task)" class=""><span class="dashicons dashicons-edit"></span></a>\n\n                    </div>\n                    <div class="clearfix"></div>\n\n\n                </div>\n                <div class="" v-if="task.edit_mode" >\n\n                    <taskform\n                        :list="list"\n                        :task="task"\n                        :text="text"\n                        :current_project="current_project"\n                        :form_action="\'cpm_task_update\'"\n                        :wp_nonce="wp_nonce"\n                        :pree_init_data="pree_init_data"\n                        :extra_fields="task.extra_data"\n                        :fid="task.ID"\n                        ></taskform>\n                </div>\n                <div class="cpm-col-12">\n\n                    <partial name="hook_cpm_task_single_after"></partial>\n\n                </div>\n\n            </div>\n\n\n\n        </div>\n    </li>\n</ul>\n<div v-if="list.full_view_mode">\n    <ul  class="cpm-todos cpm-todolist-content" >\n        <li v-for="task in completeList " >\n\n            <div class="cpm-todo-wrap clearfix">\n                <div class="cpm-todo-content" >\n\n                    <div>\n                        <div class="cpm-col-7">\n\n\n                            <span class="cpm-spinner"></span>\n\n                            <input class="" type="checkbox" checked="{{task.completed==1}}" @click.prevent="checktoggeltask(task, list)">\n\n                            <span class="cpm-todo-text"> <a href="#" @click.prevent="taskDetails(task, list)"> {{task.post_title}} </a> </span>\n                            <span class="cpm-lock" v-show="task.task_privacy"></span>\n                            <span> <partial name="hook_cpm_task_extra"></partial> </span>\n                            <span  v-if="task.completed==1"> {{text.completed_by}}\n                                <user_show_list\n                                    :users="task.completed_by"\n                                    ></user_show_list>  {{text.on}}\n\n                                <span class="cpm-completed-by"> {{{task.date_show_complete}}} </span>\n\n                            </span>\n\n\n                        </div>\n\n                        <div class="cpm-col-4">\n\n                            <span class="comments column-comments post-com-count-wrapper">\n                                <a href="#" @click.prevent="taskDetails(task, list)" class="post-com-count post-com-count-approved">\n                                    <span class="comment-count-approved" aria-hidden="true">{{task.comment_count}}</span>\n                                </a>\n                            </span>\n\n\n                            <partial name="hook_cpm_task_column"></partial>\n\n                        </div>\n\n                        <div class="cpm-col-1 cpm-todo-action-right cpm-last-col">\n\n\n                            <a href="#" class="cpm-todo-delete" @click.prevent="deleteTask(tasks,task)" ><span class="dashicons dashicons-trash"></span></a>\n                        </div>\n                        <div class="clearfix"></div>\n\n\n                    </div>\n\n                    <div class="cpm-col-12">\n\n                        <partial name="hook_cpm_task_single_after"></partial>\n\n                    </div>\n\n                </div>\n\n\n\n            </div>\n        </li>\n    </ul>\n\n\n\n</div>';
},{}],6:[function(require,module,exports){
module.exports = '\n<div class="modal-mask half-modal cpm-task-modal"  v-show="show" transition="modal">\n    <div class="modal-wrapper" @click.prevent="closeTaskModal" >\n        <div class="modal-container"  :style="modalwide">\n            <span class="close-vue-modal"><a class=""  @click=""><span class="dashicons dashicons-no"></span></a></span>\n\n\n            <div class="modal-body cpm-todolists " @click.stop=""   >\n                <div class="cpm-col-12 cpm-todo " >\n                    <div class="cpm-modal-conetnt  ">\n                        <h3>\n                            <input class="" type="checkbox" v-model="task.completed" checked="{{task.completed==1}}" @click.prevent="checktoggeltask(task, list)">\n                            {{task.post_title}}\n                        </h3>\n\n\n                        <div class="task-details ">\n                            <div>{{task.post_content}}</div>\n\n                            <span class="cpm-lock" v-show="task.task_privacy">{{text.privet_task}}</span>\n                            <partial name="hook_cpm_task_extra"></partial>\n\n                            <span  v-if="task.completed==0">\n                                <user_show_list\n                                    :users="task.assigned_to"\n                                    ></user_show_list>\n                                <span class="{{task.date_css_class}}"> {{{task.date_show}}} </span>\n\n                            </span>\n\n                            <span class="">{{task.comment_count}} {{task.comment_count | pluralize  text.comment }} </span>\n\n\n                            <div class="clearfix cpm-clear"></div>\n                        </div>\n                        <hr/>\n\n                        <div class="cpm-todo-wrap clearfix">\n                            <div class="cpm-todo-content" >\n                                <partial name="hook_cpm_task_single_after"></partial>\n                            </div>\n\n                            <comment_warp :comments="comments" :task="task" :pree_init_data="pree_init_data" :formid="\'task_popup\'" :uploderid="\'tc\'"></comment_warp>\n                        </div>\n                        <br/>\n                        <br/>\n                    </div>\n                    <div class="clearfix"></div>\n                </div>\n            </div>\n            <div class="clearfix" ></div>\n        </div>\n\n    </div>\n</div>\n\n\n';
},{}],7:[function(require,module,exports){
module.exports = '<a href="" class="close-list-single cpm-btn cpm-btn-blue   cpm-margin-bottom add-tasklist" @click.prevent="hideTaskListDetails(list)" v-show="list.full_view_mode">\n    <span class="dashicons dashicons-arrow-left-alt"></span>\n    {{text.backtotasklist}}\n</a>\n<article class="cpm-todolist">\n    <header class="cpm-list-header">\n\n        <h3>\n            <a href="#" @click.prevent="taskListDetails(list)" > {{list.post_title}} </a>\n                <div class="cpm-right" v-if="list.ed_permission">\n                <a href="#" class="cpm-icon-edit" title="Edit this List " @click.prevent="editList(list)"><span class="dashicons dashicons-edit"></span></a>\n                <a href="#" class="cpm-btn cpm-btn-xs" @click.prevent="deletelist(list)" title="Delete this List" data-list_id="{{list.ID}}" data-confirm="Are you sure to delete this to-do list?"><span class="dashicons dashicons-trash"></span></a>\n            </div>\n            <div class="cpm-right cpm-pin-list" :class="{sticky_list:list.pin_list}" v-if="list.ed_permission" >\n                <a title="" href="#" class=" cpm-icon-pin " @click.prevent="pinlist(list)"  ><span class="dashicons dashicons-admin-post"></span></a>\n            </div>\n            <div v-else>\n                <a title="" href="#" class="cpm-list-pin cpm-icon-pin "   ><span class="dashicons dashicons-admin-post"></span></a>\n            </div>\n        </h3>\n\n        <div class="cpm-entry-detail" >  {{list.post_content}}</div>\n\n        <div class="cpm-list-edit-form" v-if="list.edit_mode">\n\n            <todolistform\n                :lists="list"\n                :pid="current_project"\n                :formaction="\'cpm_update_list\'"\n                :wp_nonce="wp_nonce"\n                :extra_fields="list.extra_data"\n                :milestonelist="milestonelist"\n                :slected_milestone="list.milestone"\n                :fid="list.ID"\n\n            ></todolistform>\n        </div>\n    </header>\n    <div class="cpm-todo">\n\n        <tasklist\n            :list="list"\n\n            :pree_init_data="pree_init_data"\n            :wp_nonce="wp_nonce"\n            :current_project="current_project"\n        ></tasklist>\n\n    </div>\n    <div v-show="list.show_new_task_form">\n        <taskform\n            :list="list"\n            :task="etask"\n            :text="text"\n            :current_project="current_project"\n            :form_action="\'cpm_task_add\'"\n            :wp_nonce="wp_nonce"\n            :pree_init_data="pree_init_data"\n            :extra_fields=""\n            :fid="list.ID"\n        ></taskform>\n    </div>\n <div class="cpm-new-btn" v-show="! list.show_new_task_form"> <a href="#" class="cpm-btn add-task" @click.prevent="list.show_new_task_form=true">{{text.add_task_btn}}</a> </div>\n\n <div class="list-comments" v-if="list.full_view_mode">\n\n     <comment_warp :comments="list.comments" :task="list" :pree_init_data="pree_init_data" :formid="\'list-comments\'" :uploderid="\'lc\'"></comment_warp>\n\n </div>\n\n\n\n    <footer class="cpm-row cpm-list-footer">\n        <div class="cpm-col-6">\n            <div class="cpm-col-3 cpm-todo-complete">\n                <a href="#" @click.prevent="taskListDetails(list)">\n                    <span> {{list.complete}} </span>\n                    Complete\n                </a>\n            </div>\n            <div class="cpm-col-3 cpm-todo-incomplete">\n                <a href="#" @click.prevent="taskListDetails(list)">\n                    <span> {{list.incomplete}} </span>\n                    Incomplete\n                </a>\n            </div>\n            <div class="cpm-col-3 cpm-todo-comment">\n                <a href="#" @click.prevent="taskListDetails(list)" >\n                    {{list.comment_count}} Comments\n                </a>\n            </div>\n        </div>\n\n        <div class="cpm-col-4 cpm-todo-prgress-bar">\n            <div class="cpm-progress cpm-progress-info">\n                <div :style="{width: list.complete_percent + \'%\'}" class="bar completed"></div>\n            </div>\n        </div>\n        <div class=" cpm-col-1 no-percent">\n            {{list.complete_percent}}%\n        </div>\n        <div class="clearfix"></div>\n\n    </footer>\n\n\n\n</article>';
},{}],8:[function(require,module,exports){
document.addEventListener('DOMContentLoaded', function ( ) {
// register modal component

    Vue.directive('fileupload', {
        bind: function ( ) {
            new CPM_Uploader('cpm-upload-pickfiles-nd', 'cpm-upload-container-nd');
        }
    });
    Vue.directive('colorimg', {
        bind: function ( ) {
            jQuery('body .cpm-colorbox-img').prettyPhoto( );
        }
    });

    Vue.directive('datepicker', {
        params: ['exclude', 'minDate'],

        bind: function () {
            var settings = {
                dateFormat: "yy-mm-dd",
                changeMonth: true,
                changeYear: true,
                yearRange: '-100:+0',
            };

            switch (this.params.exclude) {
                case 'prev':
                    settings.minDate = 0;
                    break;

                case 'next':
                    settings.maxDate = 0;
                    break;

                default:
                    break;
            }

            if (this.params.minDate) {
                settings.minDate = new Date(this.params.minDate);
            }

            jQuery(this.el).datepicker(settings);
        },

        paramWatchers: {
            minDate: function (newDate) {
                jQuery(this.el).datepicker('destroy');

                var settings = {
                    dateFormat: "yy-mm-dd",
                    changeMonth: true,
                    changeYear: true,
                    yearRange: '-100:+0',
                };

                switch (this.params.exclude) {
                    case 'prev':
                        settings.minDate = 0;
                        break;

                    case 'next':
                        settings.maxDate = 0;
                        break;

                    default:
                        break;
                }

                if (this.params.minDate) {
                    settings.minDate = new Date(newDate);
                }

                jQuery(this.el).datepicker(settings);
            }
        }

    });

// Maxxin
    var taskMixin = {

        data: function () {
            return {
                text: CPM_task.static_text,

                modalwide: 'width: 700px',

                etask: {
                    ID: 0,
                    post_title: '',
                    post_content: '',
                    start_date: '',
                    due_date: '',
                    task_start: '',
                    assigned_to: null,
                },
                listblank: {
                    ID: 0,
                    post_title: '',
                    post_content: '',
                    start_date: '',
                    due_date: '',
                    assigned_to: null,
                    slected_milestone: 0
                },

            }
        },
        methods: {

            checktoggeltask: function (task, list) {
                console.log(list);
                if (confirm(vm.text.confirm_update)) {
                    var self = this, task = task, task_id = task.ID, list = list, list_id = task.post_parent, actp = true;
                    var oct = list.complete;
                    var oict = list.incomplete;

                    var data = {
                        task_id: task_id,
                        list_id: list_id,
                        project_id: CPM_task.current_project,
                        _wpnonce: CPM_Vars.nonce
                    };
                    if (task.completed == 0) {
                        data.action = 'cpm_task_complete';
                    } else {
                        data.action = 'cpm_task_open';
                        actp = false;
                    }



                    jQuery.post(CPM_Vars.ajaxurl, data, function (res) {
                        res = JSON.parse(res);
                        if (res.success) {
                            task.completed = res.completed;
                            if (actp) {
                                list.complete = (oct + 1);
                                list.incomplete = (oict - 1);
                            } else {
                                list.complete = (oct - 1);
                                list.incomplete = (oict + 1);
                            }

                            var complete_percent = parseInt((100 * list.complete) / list.total);
                            list.complete_percent = complete_percent;
                        }
                    });
                }
            },

            get_list_extra_field: function (list) {
                var data = {
                    action: 'cpm_get_list_extra_field',
                    _wpnonce: CPM_Vars.nonce,
                    project_id: vm.current_project,
                    listid: list.ID
                }
                var self = this;
                jQuery.post(CPM_Vars.ajaxurl, data, function (res) {
                    // res = JSON.parse(res);
                    list.extra_data = res;
                });

            },

            get_task_extra_field: function (task) {
                var data = {
                    action: 'cpm_get_task_extra_field',
                    _wpnonce: CPM_Vars.nonce,
                    project_id: vm.current_project,
                    taskid: task.ID
                }

                var self = this;
                jQuery.post(CPM_Vars.ajaxurl, data, function (res) {
                    // res = JSON.parse(res);
                    task.extra_data = res;

                });

            },

            hide_list_form: function (list) {

                if (list.ID === 0 || (typeof list === "undefined")) {
                    vm.new_list_form = false;
                } else {

                    list.edit_mode = false;
                }
            },
            hideTaskForm: function (list, task) {
                list.show_new_task_form = false;
                if (task.ID = 0 || (typeof task !== "undefined")) {
                    task.edit_mode = false;
                }

            },

            clear_form_data: function (fid) {
                jQuery(fid + " input[type='text']").val('');
                jQuery(fid + " textarea").val('');
                jQuery(fid + " textarea").html('');
                jQuery(fid + " radio").prop('checked', false);
                jQuery(fid + " checkbox").prop('checked', false);
            },

            getTask: function (id) {
                var self = this;
                var data = {
                    action: 'cpm_get_task',
                    _wpnonce: CPM_Vars.nonce,
                    project_id: this.current_project,
                    task_id: id,
                    type: 'json',
                }

                jQuery.post(CPM_Vars.ajaxurl, data, function (res) {
                    res = JSON.parse(res);
                    if (res.success == true) {
                        vm.showtask = res.task;
                    }
                });

            },
            showLoadMoreBtn: function () {
               var totallist = parseInt(vm.project_obj.todolist - vm.project_obj.pin_list ) ;
                if ( totallist > vm.offset) {
                    vm.showMoreBtn = true;
                } else {
                    vm.showMoreBtn = false;
                }
            },
            hideLoading: function () {
                jQuery(".cpm-data-load-before").hide();
                jQuery(".cpm-task-container").show();

            },

        }
    }

    Vue.component('taskmodal', {
        template: require('./../html/task/tasksingle.html'),

        mixins: [taskMixin],
        props: {
            comments: {
                type: Array,
                default: function () {
                    return []
                }
            },
            pree_init_data: {
                type: Object,
                default: function () {
                    return {}
                }
            },

            current_project: {
                type: String,
                default: ""
            },
            wp_none: {
                type: String,
                default: ""
            },
            show: {
                type: Boolean,
                default: false
            },
        },

        data: function () {
            return {
                task: {},
                list: {},
                taskData: {}
            }
        },

        ready: function ( ) {

        },
        methods: {
            closeTaskModal: function () {

                this.taskData.completed = this.task.completed;
                this.taskData.comments = this.task.comments;
                this.taskData.subtasks = this.task.subtasks;

                this.show = false;
                vm.comments = [];
            },
        },

        events: {
            'open-taskmodal': function (task, list) {
                this.taskData = task;
                this.task = jQuery.extend(true, {}, task);
                this.list = list;
                this.show = true;
                Vue.set(this.task, "show_popup", true);
            }
        }
    });

    Vue.component('comment_warp', {
        template: require('./../html/common/comments.html'),

        mixins: [taskMixin],
        props: {

            comments: {
                type: Array,
                default: function () {
                    return []
                }
            },
            task: {
                type: Object,
                default: function () {
                    return []
                }
            },
            pree_init_data: {
                type: Object,
                default: function () {
                    return []
                }
            },
            formid: {
                type: String,
                default: ''
            },
            uploderid: {
                type: String,
                default: ''
            },

        },

        data: function () {
            return {

            }
        },

        ready: function ( ) {

        },
        methods: {

            createComment: function (comments, formid, post) {

                var data = jQuery("#" + formid).serialize( ), self = this;
                var totalc = parseInt(post.comment_count);
                if (jQuery("#" + formid + "#coment-content").val( ) == '') {
                    alert(vm.text.empty_comment);
                    return;
                }
                jQuery.post(CPM_Vars.ajaxurl, data, function (res) {
                    res = JSON.parse(res);
                    var c = res.comment;
                    if (res.success == true) {

                        var comment_obj = {
                            comment_ID: c.comment_ID,
                            comment_author: c.comment_author,
                            comment_author_email: c.comment_author_email,
                            comment_content: c.comment_content,
                            comment_date: c.comment_date,
                            comment_post_ID: c.comment_post_ID,
                            files: c.files,
                            user_id: c.user_id,
                            avatar: c.avatar
                        }
                        self.comments.push(comment_obj);
                        jQuery("#" + formid + " .cpm-upload-filelist").html('');
                        jQuery("#" + formid + " input[name='description']").val('');
                        jQuery("#" + formid + " trix-editor").val('');
                        //
                        post.comment_count = (totalc + 1);


                    } else {
                        alert(res.error);
                    }
                });
            },
        },

    });


// File Upload component ...   snns
    Vue.component('fileuploader', {
        template: require('./../html/common/fileuploader.html'),
        mixins: [taskMixin],
        props: ['files', 'baseurl', 'uploderid'],
        methods: {
        },
        ready: function ( ) {
            new CPM_Uploader('cpm-upload-pickfiles-dc', 'cpm-upload-container-dc');
        }

    });
    Vue.component('prettyphoto', {
        template: require('./../html/common/imageview.html'),
        mixins: [taskMixin],
        props: ['file'],
        methods: {
        },
        ready: function ( ) {
            jQuery('.cpm-colorbox-img').prettyPhoto( );
        }
    });

    Vue.component('todolists', {
        template: require('./../html/task/todolist.html'),
        mixins: [taskMixin],
        //props: ['list', 'show', 'showlistmodal',   'tasklist_form_extra_field_edit', 'milestonelist', 'wp_nonce', 'current_project'],
        props: {
            list: {
                type: Object,
                default: function () {
                    return {}
                }
            },
            milestonelist: {
                type: Array,
                default: function () {
                    return []
                }
            },

            comments: {
                type: Array,
                default: function () {
                    return []
                }
            },
            pree_init_data: {
                type: Object,
                default: function () {
                    return {}
                }
            },

            showlistmodal: {
                type: Boolean,
                default: false
            },
            show: {
                type: Boolean,
                default: false
            },
            tasklist_form_extra_field_edit: {
                type: String,
                default: ''
            },
            current_project: {
                type: String,
                default: ''
            },
            wp_nonce: {
                type: String,
                default: ''
            },

        },

        methods: {
            taskListDetails: function (list) {
                vm.tasklist.forEach(function (l) {
                    l.hideme = true;
                });
                this.getlistComments(list);

                this.list.hideme = false;
                this.list.full_view_mode = true;
                vm.listfullview = true;

            },

            hideTaskListDetails: function (list) {
                vm.tasklist.forEach(function (l) {
                    l.hideme = false;
                });

                this.list.full_view_mode = false;
                vm.listfullview = false;
            },

            getlistComments: function (list) {
                var data = {
                    action: 'cpm_get_post_comments',
                    _wpnonce: CPM_Vars.nonce,
                    post_id: list.ID,
                }
                var self = this;

                jQuery.post(CPM_Vars.ajaxurl, data, function (res) {
                    res = JSON.parse(res);
                    if (res.success == true) {

                        self.list.comments = res.comments;

                    } else {

                    }
                });
            },

            editList: function (list) {
                vm.get_list_extra_field(list);
                list.edit_mode = true;
                vm.submit_btn_text = vm.text.tasklist_update_btn_text;
            },

            deletelist: function (list) {
                if (confirm("Confirm to delete ?")) {
                    var self = this, list = list;
                    var list_id = list.ID;
                    var data = {
                        list_id: list_id,
                        action: 'cpm_tasklist_delete',
                        '_wpnonce': CPM_Vars.nonce
                    };
                    jQuery.post(CPM_Vars.ajaxurl, data, function (res) {
                        res = JSON.parse(res);
                        if (res.success) {
                            vm.tasklist.$remove(list);
                        }
                    });
                }
            },
            pinlist: function (list) {

                var conf_text = vm.text.confirm_pin, new_status = true;
                if (list.pin_list) {
                    conf_text = vm.text.confirm_unpin;
                    new_status = false;
                }
                if (confirm(conf_text)) {
                    var self = this, list = list;
                    var list_id = list.ID;
                    var data = {
                        list_id: list_id,
                        action: 'cpm_tasklist_pinstatus_update',
                        pin_status: new_status,
                        _wpnonce: CPM_Vars.nonce
                    };
                    jQuery.post(CPM_Vars.ajaxurl, data, function (res) {
                        res = JSON.parse(res);
                        if (res.success) {
                            list.pin_list = new_status;
                        }
                    });
                }
            },
        },
        ready: function ( ) {

            jQuery('.cpm-colorbox-img').prettyPhoto( );


        }
    });

    Vue.component('todolistform', {
        //template: require('./../html/task/tasklist-form.html'),
        template: "#task-list-form-t",
        mixins: [taskMixin],
        //  props: ['lists', 'pid', 'fid', 'formaction', 'milestonelist', 'pree_init_data',  'wp_nonce', 'extra_fields', 'slected_milestone', 'tasklist_form_extra_field_edit'],
        props: {
            lists: {
                type: Object,
                default: function () {
                    return []
                }
            },
            milestonelist: {
                type: Array,
                default: function () {
                    return []
                }
            },
            pid: {
                type: String,
                default: ''
            },
            fid: {
                type: [Number, String],
                default: 0
            },

            formaction: {
                type: String,
                default: ''
            },

            wp_nonce: {
                type: String,
                default: ''
            },
            extra_fields: {
                type: String,
                default: ''
            },
            slected_milestone: {
                type: [Number, String],
                default: 0
            },
            tasklist_form_extra_field_edit: {
                type: String,
                default: ''
            },

        },
        methods: {
            savetasklist: function (clist, fid) {

                var self = this, clist = clist, sform = jQuery("#" + fid), data = sform.serialize();
                if (jQuery("#" + fid + " input[name='tasklist_name'] ").val() == "") {
                    alert("Please Fillup the form ");
                    return;
                }

                sform.find(".cpm-new-list-spinner").show();
                jQuery.post(CPM_Vars.ajaxurl, data, function (res) {
                    res = JSON.parse(res);
                    var list = res.list;
                    if (res.success) {
                        if (res.newlist) {
                            vm.tasklist.unshift(list);
                            self.clear_form_data("#" + fid);
                            vm.new_list_form = false;
                        } else {

                            clist.post_title = list.post_title;
                            clist.post_content = list.post_content;
                            clist.edit_mode = list.edit_mode;
                            clist.tasklist_privacy = list.tasklist_privacy;
                            clist.milestone = list.milestone;
                            clist.private = list.private;
                            clist.extra_data = '';
                        }
                        sform.find(".cpm-new-list-spinner").hide();
                    }
                });
            },
        },
        ready: function ( ) {
            jQuery('.cpm-colorbox-img').prettyPhoto( );
        }
    });
    // Todo List show
    Vue.component('tasklist', {
        template: require('./../html/task/tasklist.html'),
        mixins: [taskMixin],
        props: ['lists', 'list', 'task', 'current_project', 'wp_nonce', 'pree_init_data'],

        computed: {

            tasks() {
                if (!this.list.tasklist || !this.list.tasklist.length) {
                    return [];
                }

                return this.list.tasklist;
            },

            completeList() {
                return this.tasks.filter(function (tasks) {
                    return parseInt(tasks.completed);
                });
            },
            pendingList() {
                return this.tasks.filter(function (tasks) {
                    return !parseInt(tasks.completed);
                });
            }
        },
        methods: {
            taskDetails: function (task, list) {
                this.getTaskComments(task);
                this.$dispatch('open-taskmodal', task, list);

            },

            getTaskComments: function (task) {
                var data = {
                    action: 'cpm_get_post_comments',
                    _wpnonce: CPM_Vars.nonce,
                    post_id: task.ID,
                }
                var self = this;

                jQuery.post(CPM_Vars.ajaxurl, data, function (res) {
                    res = JSON.parse(res);
                    if (res.success == true) {
                        vm.comments = res.comments;
                    } 
                });
            },
            editTask: function (task) {
                vm.get_task_extra_field(task);
                task.edit_mode = true;
                vm.submit_btn_text = vm.text.update_btn_text;
            },
            deleteTask: function (plist, task) {
                if (confirm("Confirm to delete ?")) {
                    var self = this, task = task;
                    var task_id = task.ID;
                    var list_id = task.post_parent;
                    var oct = plist.complete;
                    var oict = plist.incomplete;
                    var taskstatus = task.completed;
                    var total = plist.total;
                    var data = {
                        task_id: task_id,
                        action: 'cpm_task_delete',
                        list_id: list_id,
                        _wpnonce: CPM_Vars.nonce
                    };
                    jQuery.post(CPM_Vars.ajaxurl, data, function (res) {
                        res = JSON.parse(res);
                        if (res.success) {
                            plist.$remove(task);
                            if (taskstatus) {
                                plist.complete = (oct - 1);
                            } else {
                                plist.incomplete = (oict - 1);
                            }

                            plist.total = (total - 1);
                            var complete_percent = parseInt((100 * plist.complete) / plist.total);
                            plist.complete_percent = complete_percent;

                        }
                    });
                }
            },

        },
        ready: function ( ) {

        }
    });


    // Todo List add form
    Vue.component('taskform', {
        template: require('./../html/task/taskform.html'),
        mixins: [taskMixin],
        data: function () {
            return {

            }
        },
        props: ['list', 'assigned_users', 'task', 'task_start', 'multiselect', 'fid', 'current_project', 'extra_fields', 'form_action', 'wp_nonce', 'pree_init_data'],

        methods: {
            savetask: function (task, list, fid) {
                var self = this, ctask = task,
                        sform = jQuery("#" + fid),
                        data = sform.serialize();
                var oict = list.incomplete;
                var total = list.total;
                sform.find(".cpm-new-task-spinner").show();
                jQuery.post(CPM_Vars.ajaxurl, data, function (res) {
                    res = JSON.parse(res);
                    var task = res.task;
                    if (res.success) {
                        if (res.newtask) {

                            self.list.tasklist.unshift(task);
                            self.clear_form_data("#" + fid);
                            self.list.new_task_form = false;
                            self.list.incomplete = (oict + 1);
                            self.list.total = (total + 1);
                            var complete_percent = parseInt((100 * self.list.complete) / self.list.total);
                            self.list.complete_percent = complete_percent;
                        } else {
                            // ctask = task ;
                            ctask.post_title = task.post_title;
                            ctask.post_content = task.post_content;
                            ctask.edit_mode = task.edit_mode;
                            ctask.task_privacy = task.task_privacy;
                            ctask.private = task.private;
                            ctask.start_date = task.start_date;
                            ctask.due_date = task.due_date;
                            ctask.assigned_to = task.assigned_to;
                            ctask.completed_by = task.completed_by;
                            ctask.extra_data = '';
                            ctask.edit_mode = false;
                            ctask.date_css_class = task.date_css_class;
                            ctask.date_show = task.date_show;
                            ctask.hook_cpm_task_column = task.hook_cpm_task_column;
                        }
                    }
                    sform.find(".cpm-new-task-spinner").hide();
                });
                list.show_new_task_form = false;
            },
            updateTaskAssignUser: function (assigned_users) {
                var au = [], list = this.list, task = this.task;
                var sf = '';
                if (typeof task === "undefined") {
                    sf = "#" + list.ID;
                } else {
                    sf = "#" + task.ID;
                }

                assigned_users.forEach(function (user) {
                    au.push(user.id);
                });

                jQuery(sf + " input[name='task_assign']").val(au);

            }
        },
        ready: function ( ) {

        }
    });


    Vue.component('dataloading', {
        //  template: require('./../html/files/dataloading.html'),
        template: '',
        mixins: [taskMixin],
        props: ['dataLoading'],
        methods: {
        },
        ready: function ( ) {
        }

    });


    // Partial for Task List form extra data
    Vue.partial('lfe_field', '<div>{{{extra_fields}}}</div>');

    // Partial for todo form extra data
    Vue.partial('todoform_extra_field', '<div>{{{extra_fields}}}</div>');


    // Partial for Project Users
    Vue.partial('lfe_field', '<div>{{{extra_fields}}}</div>');
    Vue.partial('assigned_user', '<div>{{{assigned_user_input}}}</div>');
    Vue.partial('hook_cpm_task_column', CPM_task.cpm_task_column_partial);
    Vue.partial('hook_cpm_task_extra', CPM_task.cpm_task_extra_partial);
    Vue.partial('hook_cpm_task_column_popup', CPM_task.cpm_task_column_partial);
    Vue.partial('hook_cpm_task_single_after', CPM_task.cpm_task_single_after);
    Vue.partial('hook_cpm_task_single_after_popup', " POPup " + CPM_task.cpm_task_single_after);

    Vue.config.debug = true;

    var vm = new Vue({
        el: '#taskapp',
        mixins: [taskMixin],
        data: {
            fullLoad: false,
            offset: 0,
            milestonelist: [],
            tasklist: [],
            pinedtasklist: [],
            tasks: [],
            comments: [],
            attachments: [],
            new_list_form: false,
            wp_nonce: CPM_Vars.nonce,
            tasklist_new_action: 'cpm_add_list',
            tasklist_update_action: 'cpm_update_list',
            tasklist_form_extra_field: null,
            tasklist_form_extra_field_edit: '',
            task_form_extra_fields: '',
            showMoreBtn: false,
            current_project: CPM_task.current_project,
            submit_btn_text: CPM_task.static_text.submit_btn_text,
            project_obj: CPM_task.project_obj,
            //for dodal
            showlistmodal: false,
            list_org: null,
            showlist: null,
            showtask: [],
            showtaskmodal: false,
            listfullview: false,
            pree_init_data: {
                users: [],
                task_start: '',
                task_start_field: true
            },
        },

        ready: function ( ) {
            this.getInitData();
            this.getTaskList();
            this.hideLoading();
        },
        methods: {
            getInitData: function () {
                var data = {
                    action: 'cpm_get_task_init_data',
                    _wpnonce: CPM_Vars.nonce,
                    project_id: this.current_project,
                }
                var self = this;
                jQuery.post(CPM_Vars.ajaxurl, data, function (res) {
                    res = JSON.parse(res);

                    self.milestonelist = res.milestone;
                    self.tasklist_form_extra_field = res.tlf_extra_field;
                    self.pree_init_data = res.init_data;
                    Vue.set(self.pree_init_data, "cpm_nonce", CPM_Vars.nonce);
                    Vue.set(self.pree_init_data, "current_project", self.current_project);


                });
            },
            getTaskList: function ( ) {
                var self = this;
                var data = {
                    action: 'cpm_get_task_list',
                    _wpnonce: CPM_Vars.nonce,
                    project_id: this.current_project,
                    offset: this.offset,
                    show_pin: 'yes',
                    type: 'json',
                }
                this.tasklist = [];


                jQuery.post(CPM_Vars.ajaxurl, data, function (res) {
                    res = JSON.parse(res);
                    if (res.success == true) {
                        vm.tasklist = res.lists;
                        vm.offset = res.next_offset;

                        // get Task for the list
                        vm.getTasks(res.lists);
                        vm.showLoadMoreBtn();
                    }
                });
            },

            loadmorelist: function () {
                var self = this;
                var data = {
                    action: 'cpm_get_task_list',
                    _wpnonce: CPM_Vars.nonce,
                    project_id: vm.current_project,
                    offset: vm.offset,
                    show_pin: 'no',
                    type: 'json',
                }

                jQuery.post(CPM_Vars.ajaxurl, data, function (res) {
                    res = JSON.parse(res);
                    if (res.success == true) {
                        vm.offset = res.next_offset;
                        var thelists = res.lists;

                        for (var l in thelists) {
                            var tls = thelists[l];
                            vm.getListTask(tls);
                            vm.tasklist.push(tls);
                            vm.showLoadMoreBtn();
                        }
                    }
                });
            },
            getTasks: function (lists) {

                var data = {
                    project_id: vm.current_project,
                    single: true,
                    action: 'cpm_get_todo_list',
                    is_admin: CPM_Vars.is_admin,
                    type: 'json'
                }
                lists.forEach(function (list) {
                    var list_id = list.ID;
                    data.list_id = list_id;

                    jQuery.post(CPM_Vars.ajaxurl, data, function (res) {
                        res = JSON.parse(res);
                        if (res.success == true) {
                            list.tasklist = res.tasklist;
                        }
                    });

                })


            },

            getListTask: function (thelist) {

                var data = {
                    project_id: vm.current_project,
                    single: true,
                    action: 'cpm_get_todo_list',
                    is_admin: CPM_Vars.is_admin,
                    list_id: thelist.ID,
                    type: 'json'
                }
                jQuery.post(CPM_Vars.ajaxurl, data, function (res) {
                    res = JSON.parse(res);
                    if (res.success == true) {
                        thelist.tasklist = res.tasklist;
                    }
                });

            },

            fileUploadShow: function ( ) {
                this.hideAllform( );
                this.uploadFormShow = true;
            },
            getComments: function (postid) {
                var data = {
                    action: 'cpm_get_post_comments',
                    _wpnonce: CPM_Vars.nonce,
                    post_id: postid,
                }
                var self = this;
                self.comments = [];
                jQuery.post(CPM_Vars.ajaxurl, data, function (res) {
                    res = JSON.parse(res);
                    if (res.success == true) {
                        self.comments = res.comments;
                    } else {
                        alert(res.error);
                    }
                });
            },
        },

        events: {
            'open-taskmodal': function (task, list) {
                this.$broadcast('open-taskmodal', task, list);
            }
        }
    })
});
},{"./../html/common/comments.html":1,"./../html/common/fileuploader.html":2,"./../html/common/imageview.html":3,"./../html/task/taskform.html":4,"./../html/task/tasklist.html":5,"./../html/task/tasksingle.html":6,"./../html/task/todolist.html":7}]},{},[8]);
