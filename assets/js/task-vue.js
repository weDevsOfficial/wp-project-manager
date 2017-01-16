;(function($) {

    'use strict';

    Vue.directive('fileupload', {
        bind: function ( ) {
            new CPM_Uploader('cpm-upload-pickfiles-nd', 'cpm-upload-container-nd');
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

                mixin_task: {},

            }
        },
        methods: {

            checktoggeltask: function (task, list) {
                
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

            // Get single task 
            getTask: function ( project_id, task_id ) {
                var self = this,
                    data = {
                    task_id: task_id,
                    project_id: project_id,
                    action: 'cpm_get_task',
                    _wpnonce: CPM_Vars.nonce
                }

                $.post( CPM_Vars.ajaxurl, data, function( res ) {
                    if ( res.success ) {
                        self.mixin_task = res.data.task;
                    } 
                });
            },

            showLoadMoreBtn: function () {
                var totallist = parseInt(vm.project_obj.todolist - vm.project_obj.pin_list);
                if (totallist > vm.offset) {
                    vm.showMoreBtn = true;
                } else {
                    vm.showMoreBtn = false;
                }
            },
            hideLoading: function () {
                jQuery(".cpm-data-load-before").hide();
                jQuery(".cpm-task-container").show();

            },

            getUrlParameter: function (name) {
                name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
                var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
                var results = regex.exec(location.search);
                return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
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

        }
    }

    // Task List show
    Vue.component('task-list', {
        template: '#tmpl-cpm-task-list', 
        mixins: [taskMixin],
        props: ['list', 'project_id'],

        computed: {
            completed_task: function() {
                return this.list.tasklist.filter(function (tasks) {
                    return parseInt(tasks.completed);
                });
            },

            incomplete_task: function() {
                return this.list.tasklist.filter(function (tasks) {
                    return ! parseInt(tasks.completed);
                });
            }
        },

        methods: {
            taskDetails: function ( project_id, task_id ) {
                this.$dispatch( 'single-task', project_id, task_id );
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
    });

    // Component for single task
    Vue.component('single-task', {
        template: '#tmpl-cpm-task-single', 

        mixins: [taskMixin],
        
        props: ['project_id', 'tasklist'],

        data: function () {
            return {
                task_id: false,
                task: {}
            }
        },

        watch: {
            task_id: function( new_val, old_val ) {
                if ( ! new_val ) {
                    this.task = {};
                    return;
                }

                var self = this,
                    task;

                this.tasklist.map( function( list, list_index ) {
                    list.tasklist.map( function( list_task, task_index ) {
                        if ( list_task.ID == self.task_id ) {
                            task = list_task;
                        }
                    });
                });

                this.task = task;
            }
        },

        methods: {
            closeTaskModal: function () {
                this.task_id = false;
            }
        },

        events: {
            // Set single task data
            'single-task': function( project_id, task_id ) {
                this.task_id = task_id;
            }
        }
    });

        Vue.component('comment_warp_task', {
        template: '#tmpl-cpm-task-comments', //require('./../html/common/comments_task.html'),

        mixins: [taskMixin],
        
        props: ['task'],
        
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
                console.log(jQuery("#" + formid + " input[name='description'] ").val() ) ;

                if (jQuery("#" + formid + " input[name='description'] ").val( ) == '') {
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
            deleteComment:
                function ( comment ) {
                if (confirm("Confirm to delete ?")) {
                    var self = this;
                    var totalComment = this.task.comment_count;
                    var commentsCalc = totalComment -1;
                    var comment_id = comment.comment_ID;
                    var data = {
                        comment_id: comment_id,
                        action: 'cpm_comment_delete',
                        _wpnonce: CPM_Vars.nonce
                    };
                    jQuery.post(CPM_Vars.ajaxurl, data, function (res) {
                        res = JSON.parse(res);
                        if (res.success) {
                            self.comments.$remove(comment);
                            self.task.comment_count = commentsCalc;
                        }
                    });
                }
            },
        },

    });

    Vue.component('comment_warp', {
        template: '#tmpl-cpm-comments', //require('./../html/common/comments.html'),

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
                console.log(jQuery("#" + formid + " input[name='description'] ").val() ) ;

                if (jQuery("#" + formid + " input[name='description'] ").val( ) == '') {
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
            deleteComment:
                function ( comment ) {
                if (confirm("Confirm to delete ?")) {
                    var self = this;
                    var comment_id = comment.comment_ID;
                    var data = {
                        comment_id: comment_id,
                        action: 'cpm_comment_delete',
                        _wpnonce: CPM_Vars.nonce
                    };
                    jQuery.post(CPM_Vars.ajaxurl, data, function (res) {
                        res = JSON.parse(res);
                        if (res.success) {
                            self.comments.$remove(comment);
                        }
                    });
                }
            },
        },

    });





// File Upload component ...
    Vue.component('fileuploader', {
        template: '#tmpl-cpm-file-uploader', //require('./../html/common/fileuploader.html'),
        mixins: [taskMixin],
        props: ['files', 'baseurl', 'uploderid'],
        methods: {
        },
        ready: function ( ) {
            new CPM_Uploader('cpm-upload-pickfiles-dc', 'cpm-upload-container-dc');
        }

    });

    Vue.component('fileuploader_task', {
        template: '#tmpl-cpm-task-file-uploader', //require('./../html/common/fileuploader_task.html'),
        mixins: [taskMixin],
        props: ['files', 'baseurl', 'uploderid'],
        methods: {
        },
        ready: function ( ) {
            new CPM_Uploader('cpm-upload-pickfiles-task', 'cpm-upload-container-task');
        }

    });


    Vue.component('prettyphoto', {
        template: '#tmpl-cpm-image-view', //require('./../html/common/imageview.html'),
        mixins: [taskMixin],
        props: ['file'],
        methods: {
        },
        ready: function ( ) {
            jQuery('.cpm-colorbox-img').prettyPhoto( );
        }
    });

    Vue.component('todolists', {
        template: '#tmpl-cpm-todo-list', //require('./../html/task/todolist.html'),
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
                            if(vm.tasklist.length === 0 ){
                                vm.emptylist = true;
                            }
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
                            vm.emptylist = false;
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

    // Todo List add form
    Vue.component('taskform', {
        template: '#tmpl-cpm-task-form', //require('./../html/task/taskform.html'),
        mixins: [taskMixin],
        data: function () {
            return {
            }
        },
        props: ['list', 'assigned_users', 'task', 'task_start', 'multiselect', 'tfid', 'current_project', 'extra_fields', 'form_action', 'wp_nonce', 'pree_init_data'],

        methods: {
            savetask: function (task, list, tfid) {

                var self = this, ctask = task,
                        sform = jQuery("#" + tfid);
                var data = sform.serialize();

                var oict = list.incomplete;
                var total = list.total;
                sform.find(".cpm-new-task-spinner").show();
                jQuery.post(CPM_Vars.ajaxurl, data, function (res) {
                    res = JSON.parse(res);
                    var task = res.task;
                    if (res.success) {
                        if (res.newtask) {
                            self.list.tasklist.unshift(task);
                            self.clear_form_data("#" + tfid);
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
                if (0 === task.ID  || (typeof task !== "undefined")) {
                    sf = task.ID;
                } else {
                    sf = task.ID;
                }
                assigned_users.forEach(function (user) {
                    au.push(user.id);
                });

                if (sf != "") {
                    jQuery("#" + 'ttl-'+sf + " input[name='task_assign']").val(au);
                }
                return false;
            },

            changeTaskUser: function( selectedVal, id ) {
                console.log( selectedVal, id );
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

    Vue.component('blanktemplate', {

        template: '#tmpl-cpm-blank-template', //require('./../html/task/blanktemplate.html'),
        mixins: [taskMixin],
        data: function () {
            return {
                user_create_access: CPM_task.user_can_create,
            }
        },
        props: ['emptylist', 'new_list_form'],
        methods: {
        },
        ready: function () {

        }
    });


    // Partial for todo form extra data
    Vue.partial('todoform_extra_field', '<div>{{{extra_fields}}}</div>');

    // Partial for Project Users
    Vue.partial('lfe_field', '<div>{{{extra_fields}}}</div>');
    Vue.partial('assigned_user', '<div>{{{assigned_user_input}}}</div>');
    Vue.partial('hook_cpm_task_column', CPM_task.cpm_task_column_partial);
    //Vue.partial('hook_cpm_task_extra', CPM_task.cpm_task_extra_partial);
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
            new_list_form_btn: false,
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
            emptylist: false,
            user_create_access: CPM_task.user_can_create,

            pree_init_data: {
                users: [],
                task_start: '',
                task_start_field: true
            },
        },
        
        created: function () {

        },

        ready: function ( ) {
            this.getInitData();
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
                    
                    vm.getTaskLists();
                });
            },
            getTaskLists: function ( ) {
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
                        vm.getTasks(res.lists);
                        vm.showLoadMoreBtn();
                        vm.loadListfist();

                    } else {
                        vm.emptylist = true;
                    }


                    vm.hideLoading();
                     vm.showNewListFormBtn();
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
                            vm.getListTasks(tls);
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
                            vm.loadTaskfirst(list);
                        }
                    });

                })


            },

            loadTaskfirst: function (list) {
                var act = vm.getUrlParameter('action');
                if (act === 'task_single') {
                    var task_id = parseInt(vm.getUrlParameter('task_id'));

                    for (var t in list.tasklist) {
                        var ct = list.tasklist[t];

                        if (_.isMatch(ct, {ID: task_id})) {
                            vm.getTaskComments(ct);
                            vm.$dispatch('open-taskmodal', ct, list);
                        }
                    }

                }
            },

            getListTasks: function (thelist) {
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
                        vm.loadTaskfirst(thelist);
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

            loadListfist: function () {

                var act = this.getUrlParameter('action');
                if (act === 'task_single' || act == 'single') {
                    var list_id = this.getUrlParameter('tl_id');
                    var task_id = this.getUrlParameter('task_id');
                    var self = this;
                    var data = {
                        action: 'cpm_get_task_list_single',
                        _wpnonce: CPM_Vars.nonce,
                        project_id: this.current_project,
                        offset: this.offset,
                        list_id: list_id,
                        type: 'json',
                    }
                    jQuery.post(CPM_Vars.ajaxurl, data, function (res) {
                        res = JSON.parse(res);
                        if (res.success == true) {
                            var ls = res.list;
                            var estlist = self.tasklist;
                            var ne = false;
                            vm.listfullview = true;
                            var current_list;
                            for (var l in estlist) {
                                var nsl = estlist[l];
                                nsl.hideme = true;
                                if (_.isMatch(nsl, {ID: ls.ID})) {
                                    nsl.hideme = false;
                                    nsl.full_view_mode = true;
                                    ne = true;
                                    current_list = nsl;
                                }
                            }
                            if (!ne) {
                                ls.full_view_mode = true;
                                ls.hideme = false;
                                self.getListTasks(ls);
                                self.tasklist.push(ls);
                                current_list = ls;
                            }
                        }
                    });
                }
            },


            showNewListFormBtn: function () {

                var r = false;

                if (this.user_create_access)
                    r = true;

                if (!this.listfullview)
                    r = true;

                if (this.emptylist )
                    r = false;

                this.new_list_form_btn = r;

            },

        },

        events: {
            'open-taskmodal': function (task, list) {
                this.$broadcast('open-taskmodal', task, list);
            },

            'single-task': function( project_id, task_id ) {
                this.$broadcast( 'single-task', project_id, task_id );
            }
        }
    });

})(jQuery);


