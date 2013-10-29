;(function ($) {

    var weDevs_CPM = {
        init: function () {

            $( "a#cpm-create-project" ).on('click', this.Project.openDialog);
            $( "#cpm-project-dialog" ).on('click', 'a.project-cancel', this.Project.closeDialog);
            $( "a.cpm-project-delete-link" ).on('click', this.Project.remove);
            $( "#cpm-project-dialog" ).on('submit', 'form.cpm-project-form', this.Project.create);

            $('.cpm-edit-project').on('submit', 'form.cpm-project-form', this.Project.edit);
            $('.cpm-project-head').on('click', 'a.cpm-icon-edit', this.Project.toggleEditForm);
            $('.cpm-project-head').on('click', 'a.project-cancel', this.Project.toggleEditForm);
            $('.cpm-load-more').on('click', this.Project.loadActivity);

            /* =============== Milestones ============ */
            $('.cpm-links').on('click', '.cpm-milestone-delete', this.Milestone.remove);
            $('.cpm-links').on('click', '.cpm-milestone-complete', this.Milestone.markComplete);
            $('.cpm-links').on('click', '.cpm-milestone-open', this.Milestone.markOpen);
            $('.cpm-links').on('click', 'a.cpm-icon-edit', this.Milestone.get);
            $('.cpm-new-milestone-form').on('submit', 'form.cpm-milestone-form', this.Milestone.add);
            $('.cpm-new-milestone-form').on('click', 'a.milestone-cancel', this.Milestone.hide);
            $('a#cpm-add-milestone').on('click', this.Milestone.show);
            $('.cpm-milestone').on('click', 'a.milestone-cancel', this.Milestone.cancelUpdate);
            $('.cpm-milestone').on('submit', 'form.cpm-milestone-form', this.Milestone.update);

            /* =============== Comments ============ */
            $('.cpm-comment-wrap').on('click', '.cpm-edit-comment-link', this.Comment.get);
            $('.cpm-comment-wrap').on('click', '.cpm-comment-edit-cancel', this.Comment.cancelCommentEdit);
            $('.cpm-comment-wrap').on('click', '.cpm-delete-comment-link', this.Comment.deleteComment);
            $('.cpm-comment-wrap').on('submit', '.cpm-comment-form', this.Comment.update);
            $('.cpm-comment-wrap').on('click', '.cpm-delete-file', this.Uploader.deleteFile);
            $('.cpm-comment-form-wrap').on('click', '.cpm-delete-file', this.Uploader.deleteFile);

            // add new commenttoggleForm
            $('.cpm-comment-form').validate({
                submitHandler: function (form) {
                    weDevs_CPM.Comment.addNew.call(form);

                    return false;
                }
            });
            
            // toggle all user notification checkbox
            $('.cpm').on('click', '.cpm-toggle-checkbox', function(e) {
                e.preventDefault();
                
                var $checkBoxes = $('.notify-users').find('input[type=checkbox][name="notify_user[]"]')
                $checkBoxes.prop('checked', !$checkBoxes.prop('checked'));
            });


            /* =============== Messages ============ */

            // add new message
            $('.cpm-new-message-form form').validate({
                submitHandler: function (form) {
                    weDevs_CPM.Message.addNew.call(form);

                    return false;
                }
            });

            $('.cpm-new-message-btn').on('click', this.Message.show);
            $('.cpm-new-message-form').on('click', 'a.message-cancel', this.Message.hide);
            $('.cpm-single').on('click', 'a.cpm-msg-edit', this.Message.get);
            $('.cpm-single').on('click', 'a.message-cancel', this.Message.hideEditForm);
            $('.cpm-single').on('click', '.cpm-delete-file', this.Uploader.deleteFile);
            $('.cpm-new-message-form').on('click', '.cpm-delete-file', this.Uploader.deleteFile);
            $('.cpm-single').on('submit', 'form.cpm-message-form', this.Message.update);
            $('table.cpm-messages-table').on('click', 'a.delete-message', this.Message.remove);

            /* =============== Uploder ============ */
            // $('#cpm-upload-container').on('click', '.cpm-delete-file', this.Uploader.deleteFile);

        },
        Project: {
            openDialog: function(e) {
                e.preventDefault();

                $( "#cpm-project-dialog" ).dialog( "open" );
            },

            closeDialog: function(e) {
                e.preventDefault();

                $( "#cpm-project-dialog" ).dialog( "close" );
            },

            create: function (e) {
                e.preventDefault();

                var name = $.trim( $('#project_name').val() );

                if (name === '') {
                    alert('Enter a project name');

                    return false;
                }

                var form = $(this),
                    data = form.serialize();

                form.append('<div class="cpm-loading">Saving...</div>');
                $.post(CPM_Vars.ajaxurl, data, function (res) {
                    res = $.parseJSON(res);

                    if(res.success) {
                        window.location.href = res.url;
                    }
                });

            },

            toggleEditForm: function (e) {
                e.preventDefault();

                var container = $(this).closest('.cpm-project-head');

                container.find('.cpm-edit-project').slideToggle();
                container.find('.cpm-project-detail').slideToggle();
            },

            edit: function (e) {
                e.preventDefault();

                var form = $(this),
                    container = $(this).closest('.cpm-project-head');
                    data = form.serialize();

                form.append('<div class="cpm-loading">Saving...</div>');
                $.post(CPM_Vars.ajaxurl, data, function (res) {
                    res = $.parseJSON(res);

                    if(res.success) {
                        container.find('h2 span').text(res.title);
                        container.find('.detail').html(res.content);
                        form.find('.project-users').html(res.users);

                        form.closest('.cpm-edit-project').slideUp();
                        container.find('.cpm-project-detail').slideToggle();

                        //re-initialize chosen dropdown
                        $('#project_coworker').chosen();
                    }
                });

                $('.cpm-loading').remove();
            },

            remove: function (e) {
                e.preventDefault();

                var self = $(this),
                    message = self.data('confirm'),
                    data = {
                        project_id: self.data('project_id'),
                        action: 'cpm_project_delete',
                        _wpnonce: CPM_Vars.nonce
                    };

                if(confirm(message)) {

                    self.addClass('cpm-loading');

                    $.post(CPM_Vars.ajaxurl, data, function(res) {
                        res = $.parseJSON(res);

                        if(res.success) {
                            location.href = res.url;
                        }
                    });
                }

            },

            loadActivity: function(e) {
                e.preventDefault();

                var self = $(this),
                    total = self.data('total'),
                    start = parseInt(self.data('start')),
                    data = {
                        project_id: self.data('project_id'),
                        offset: start,
                        action: 'cpm_get_activity',
                        _wpnonce: CPM_Vars.nonce
                    };

                self.append('<div class="cpm-loading">Loading...</div>');
                $.get(CPM_Vars.ajaxurl, data, function (res) {
                    res = $.parseJSON(res);

                    if(res.success) {
                        start = res.count + start;
                        self.prev('ul.cpm-activity').append(res.content);
                        self.data('start', start);
                    } else {
                        self.remove();
                    }

                    $('.cpm-loading').remove();
                });
            }
        },

        Milestone: {
            remove: function (e) {
                e.preventDefault();

                if(confirm($(this).data('confirm') ) ) {
                    weDevs_CPM.Milestone.ajaxRequest.call(this, 'cpm_delete_milestone');
                }
            },

            markComplete: function (e) {
                e.preventDefault();
                weDevs_CPM.Milestone.ajaxRequest.call(this, 'cpm_milestone_complete');
            },

            markOpen: function (e) {
                e.preventDefault();
                weDevs_CPM.Milestone.ajaxRequest.call(this, 'cpm_milestone_open');
            },

            show: function (e) {
                e.preventDefault();

                $('.cpm-new-milestone-form').slideDown();
            },

            hide: function (e) {
                e.preventDefault();

                $('.cpm-new-milestone-form').slideUp();
            },

            get: function (e) {
                e.preventDefault();

                var self = $(this),
                    parent = self.closest('.cpm-milestone'),
                    data = {
                        id: self.data('id'),
                        project_id: self.data('project_id'),
                        action: 'cpm_milestone_get',
                        '_wpnonce': CPM_Vars.nonce
                    };

                $.post(CPM_Vars.ajaxurl, data, function (res) {
                    res = $.parseJSON(res);

                    if(res.success) {
                        parent.find('.milestone-detail').hide()
                            .next('.cpm-milestone-edit-form').html(res.content).fadeIn();

                        $('.datepicker').datepicker();
                    }
                });
            },

            add: function (e) {
                e.preventDefault();

                var form = $(this),
                    data = form.serialize();

                form.append('<div class="cpm-loading">Saving...</div>');
                $.post(CPM_Vars.ajaxurl, data, function (res) {
                    res = $.parseJSON(res);

                    if(res.success) {
                        window.location.reload();
                    }
                });
            },

            update: function (e) {
                e.preventDefault();

                var form = $(this),
                    data = form.serialize();

                $.post(CPM_Vars.ajaxurl, data, function (res) {
                    res = $.parseJSON(res);

                    if(res.success) {
                        window.location.reload();
                    }
                });
            },

            cancelUpdate: function (e) {
                e.preventDefault();

                var self = $(this),
                    parent = self.closest('.cpm-milestone');

                parent.find('.cpm-milestone-edit-form').hide().prev('.milestone-detail').fadeIn();
            },

            ajaxRequest: function (action) {
                var that = $(this),
                    data = {
                        milestone_id: that.data('id'),
                        project_id: that.data('project'),
                        action: action,
                        '_wpnonce': CPM_Vars.nonce
                    };

                that.addClass('cpm-loading');
                $.post(CPM_Vars.ajaxurl, data, function (response) {
                    location.reload();
                });
            }
        },
        Uploader: {
            deleteFile: function (e) {
                e.preventDefault();

                if(confirm('This file will be deleted permanently')) {
                    var that = $(this),
                        data = {
                            file_id: that.data('id'),
                            action: 'cpm_delete_file',
                            '_wpnonce': CPM_Vars.nonce
                        };

                    $.post(CPM_Vars.ajaxurl, data, function() {});
                    that.closest('.cpm-uploaded-item').fadeOut(function(){
                        $(this).remove();
                    });
                }
            }
        },
        Comment: {
            addNew: function () {
                var that = $(this),
                data = that.serialize();

                that.append('<div class="cpm-loading">Saving...</div>');
                $.post(CPM_Vars.ajaxurl, data, function(res) {
                    res = JSON.parse(res);

                    if(res.success) {
                        $('.cpm-comment-wrap').append(res.content).fadeIn('slow');
                        $('.cpm-comment-form textarea, .cpm-comment-form input[type=checkbox]').val('');
                        $('.cpm-comment-form .cpm-upload-filelist').html('');
                    }

                    $('.cpm-loading').remove();
                });
            },
            get: function (e) {
                e.preventDefault();

                var that = $(this),
                    parent = that.closest('.cpm-comment'),
                    data = {
                        comment_id: that.data('comment_id'),
                        project_id: that.data('project_id'),
                        object_id: that.data('object_id'),
                        action: 'cpm_comment_get',
                        '_wpnonce': CPM_Vars.nonce
                    };

                //console.log(data);
                $.post(CPM_Vars.ajaxurl, data, function(res) {
                    res = $.parseJSON(res);

                    if(res.success && parent.find('form').length === 0) {

                        parent.find('.cpm-comment-content').hide();
                        parent.find('.cpm-comment-edit-form').hide().html(res.form).fadeIn();

                        //re-initialize the uploader
                        new CPM_Uploader('cpm-upload-pickfiles-' + res.id, 'cpm-upload-container-' + res.id);
                    }
                });

            },

            cancelCommentEdit: function (e) {
                e.preventDefault();
                var that = $(this);

                that.parents('.cpm-comment').find('.cpm-comment-content').fadeIn();
                that.closest('.cpm-comment-edit-form').html('');
            },

            update: function (e) {
                e.preventDefault();

                var form = $(this),
                    container = form.closest('.cpm-comment-container'),
                    data = form.serialize(),
                    text = $.trim(form.find('textarea').val());

                if( text.length < 1 ) {
                    alert('Please enter some text');
                    return false;
                }

                $.post(CPM_Vars.ajaxurl, data, function(res) {
                    res = $.parseJSON(res);

                    if(res.success) {
                        container.find('.cpm-comment-content').html(res.content).fadeIn();
                        form.parent().remove();
                    }
                });
            },

            deleteComment: function (e) {
                e.preventDefault();

                var self = $(this),
                    confirmMsg = self.data('confirm'),
                    data = {
                        comment_id: self.data('id'),
                        project_id: self.data('project_id'),
                        action: 'cpm_comment_delete',
                        '_wpnonce': CPM_Vars.nonce
                    };

                if(confirm(confirmMsg)) {
                    $.post(CPM_Vars.ajaxurl, data, function(res) {
                        res = $.parseJSON(res);

                        if(res.success) {
                            self.closest('li').fadeOut(function() {
                                $(this).remove();
                            });
                        }
                    });
                }
            }
        },
        Message: {
            show: function (e) {
                e.preventDefault();

                $('.cpm-new-message-form').slideDown();
            },

            hide: function (e) {
                e.preventDefault();

                $('.cpm-new-message-form').slideUp();
            },

            addNew: function (e) {
                // e.preventDefault();

                var that = $(this),
                data = that.serialize();

                that.append('<div class="cpm-loading">Saving...</div>');
                $.post(CPM_Vars.ajaxurl, data, function(res) {
                    res = $.parseJSON(res);

                    if( res.success ) {
                        window.location.href= res.url;
                    }

                    $('.cpm-loading').remove();
                });

                return false;
            },

            update: function (e) {
                e.preventDefault();

                var self = $(this),
                    parent = self.closest('.cpm-single'),
                    data = self.serialize();

                self.append('<div class="cpm-loading">Saving...</div>');

                $.post(CPM_Vars.ajaxurl, data, function(res) {
                    res = $.parseJSON(res);

                    if( res.success ) {
                        console.log(parent);
                        parent.find('.cpm-entry-detail').html(res.content).fadeIn().next('.cpm-msg-edit-form').html('');
                    }

                    $('.cpm-loading').remove();
                });
            },

            get: function(e) {
                e.preventDefault();

                var self = $(this),
                    parent = self.closest('.cpm-single'),
                    data = {
                        message_id: self.data('msg_id'),
                        project_id: self.data('project_id'),
                        action: 'cpm_message_get',
                        '_wpnonce': CPM_Vars.nonce
                    };

                $.post(CPM_Vars.ajaxurl, data, function(res) {
                    res = $.parseJSON(res);

                    if( res.success ) {
                        parent.find('.cpm-entry-detail').hide().
                            next('.cpm-msg-edit-form').hide().html(res.content).fadeIn();

                        //re-initialize the uploader
                        new CPM_Uploader('cpm-upload-pickfiles-' + res.id, 'cpm-upload-container-' + res.id);
                    }
                });
            },

            hideEditForm: function (e) {
                e.preventDefault();

                var parent = $(this).closest('.cpm-single');

                parent.find('.cpm-entry-detail').fadeIn().next('.cpm-msg-edit-form').fadeOut(function() {
                    $(this).html('');
                });
            },

            remove: function (e) {
                e.preventDefault();

                var self = $(this),
                    data = {
                        message_id: self.data('msg_id'),
                        project_id: self.data('project_id'),
                        action: 'cpm_message_delete',
                        '_wpnonce': CPM_Vars.nonce
                    };

                if( confirm( self.data('confirm') ) ) {
                    $.post(CPM_Vars.ajaxurl, data, function (res) {
                        res = $.parseJSON(res);

                        if(res.success) {
                            window.location.href = res.url;
                        }
                    });
                }
            }
        }
    };

    //dom ready
    $(function() {
        weDevs_CPM.init();

        $('#project_coworker').chosen();
        $(".datepicker").datepicker();
    });

})(jQuery);
