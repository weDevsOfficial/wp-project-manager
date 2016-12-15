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
                if (confirm(vm.text.confirm_update)) {
                    var self = this, task = task, task_id = task.ID, list = list, list_id = task.post_parent;

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
                    }

                    jQuery.post(CPM_Vars.ajaxurl, data, function (res) {
                        res = JSON.parse(res);
                        if (res.success) {
                            task.completed = res.completed;
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
            'open-taskmodal': function (task) {
                this.taskData = task;
                this.task = jQuery.extend(true, {}, task);
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

            createComment: function (comments, formid) {

                var data = jQuery("#" + formid).serialize( ), self = this;
                console.log(formid);
                if (jQuery("#" + formid + "#coment-content").val( ) == '') {
                    alert(vm.text.empty_comment);
                    return;
                }
                jQuery.post(CPM_Vars.ajaxurl, data, function (res) {
                    res = JSON.parse(res);
                    var c = res.comment;
                    if (res.success == true) {
                        //

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
                    return []
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
                    action: 'cpm_get_doc_comments',
                    _wpnonce: CPM_Vars.nonce,
                    doc_id: list.ID,
                }
                var self = this;

                jQuery.post(CPM_Vars.ajaxurl, data, function (res) {
                    res = JSON.parse(res);
                    if (res.success == true) {

                        console.log(res);
                        console.log("success in ajax");
                        self.list.comments = res.comments;
                        console.log(list.comments)
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
        props: ['lists', 'list', 'tasks', 'task', 'current_project', 'wp_nonce', 'pree_init_data'],

        computed: {
            completeList() {
                return this.tasks.filter(function (task) {
                    return parseInt(task.completed);
                });
            },
            pendingList() {
                return this.tasks.filter(function (task) {
                    return !parseInt(task.completed);
                });
            }
        },
        methods: {
            taskDetails: function (task) {
                this.getTaskComments(task);
                this.$dispatch('open-taskmodal', task);

            },

            getTaskComments: function (task) {
                var data = {
                    action: 'cpm_get_doc_comments',
                    _wpnonce: CPM_Vars.nonce,
                    doc_id: task.ID,
                }
                var self = this;

                jQuery.post(CPM_Vars.ajaxurl, data, function (res) {
                    res = JSON.parse(res);
                    if (res.success == true) {

                        console.log(res);
                        console.log("success in ajax");
                        vm.comments = res.comments;

                    } else {

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
                sform.find(".cpm-new-task-spinner").show();
                jQuery.post(CPM_Vars.ajaxurl, data, function (res) {
                    res = JSON.parse(res);
                    var task = res.task;
                    if (res.success) {
                        if (res.newtask) {
                            self.list.tasklist.unshift(task);
                            self.clear_form_data("#" + fid);
                            self.list.new_task_form = false;
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
            project_obj: CPM_pro_files.project_obj,
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

                    }
                });
            },

            loadmorelist: function () {
                var self = this;
                var data = {
                    action: 'cpm_get_task_list',
                    _wpnonce: CPM_Vars.nonce,
                    project_id: this.current_project,
                    offset: this.offset,
                    type: 'json',
                }

                jQuery.post(CPM_Vars.ajaxurl, data, function (res) {
                    res = JSON.parse(res);
                    if (res.success == true) {
                        for (var i = 0; i <= res.lists.length; i++) {
                            var list = res.lists[i];
                            vm.tasklist.push(list);
                        }
                        vm.offset = res.next_offset;
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
                    var list_id = list.ID, clist = list;
                    data.list_id = list_id;

                    jQuery.post(CPM_Vars.ajaxurl, data, function (res) {
                        res = JSON.parse(res);
                        if (res.success == true) {
                            clist.tasklist = res.tasklist;
                        }
                    });

                })


            },
            fileUploadShow: function ( ) {
                this.hideAllform( );
                this.uploadFormShow = true;
            },
            getComments: function (docid) {
                var data = {
                    action: 'cpm_get_doc_comments',
                    _wpnonce: CPM_Vars.nonce,
                    doc_id: docid,
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
            'open-taskmodal': function (task) {
                this.$broadcast('open-taskmodal', task);
            }
        }
    })
});