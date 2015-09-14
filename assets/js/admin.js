;(function ($) {

    var weDevs_CPM = {
        init: function () {

            $('#cpm-create-user-wrap').on('submit', 'form.cpm-user-create-form', this.Project.UserCreate);
           // $( "button.click" ).on('click', this.Project.openDialogUserCreateForm);
            $( "a#cpm-create-project" ).on('click', this.Project.openDialog);
            $( "#cpm-project-dialog" ).on('click', 'a.project-cancel', this.Project.closeDialog);
            $( "a.cpm-project-delete-link" ).on('click', this.Project.remove);
            $( "#cpm-project-dialog" ).on('submit', 'form.cpm-project-form', this.Project.create);

            $('.cpm-edit-project').on('submit', 'form.cpm-project-form', this.Project.edit);
            $('.cpm-project-head').on('click', 'a.cpm-icon-edit', this.Project.toggleEditForm);
            $('.cpm-project-head').on('click', 'a.project-cancel', this.Project.toggleEditForm);
            $('.cpm-load-more').on('click', this.Project.loadActivity);
            $('.cpm-loads-more').on('click', this.Project.loadAllActivity);

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

            /* =============== Project Duplicate ============ */
            $('.cpm-duplicate-project').on('click', this.Project.ProjectDuplicate );

            /* =============== Project archive ============ */
            $('.cpm-archive').on('click', this.Project.ProjectArchive );

            $('.cpm-settings-bind').on('click', this.Project.Settings);

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


        tinymceInit: function( id ) {
            tinymce.execCommand( 'mceRemoveEditor', true, id );
            tinymce.execCommand( 'mceAddEditor', true, id );
        },

        Project: {
            UserCreate: function(e) {
                e.preventDefault();
                var self = $(this),
                    spinner = self.find('input[type=submit]').siblings('span');

                spinner.addClass('cpm-spinner');
                if( self.attr('disabled') == 'disabled' ) {
                    return false;
                }
                self.attr('disabled', true );

                var data = {
                        action: 'cpm_user_create',
                        data: self.serialize(),
                        _wpnonce: CPM_Vars.nonce
                    };

                $.post( CPM_Vars.ajaxurl, data, function( resp ) {
                    self.attr('disabled', false );
                    spinner.removeClass('cpm-spinner');
                    if( resp.success ) {
                        $( "#cpm-create-user-wrap" ).dialog( "close" );
                        $('.cpm-project-role>table').append( resp.data );
                        $('.cpm-error').html('');
                        $( "form.cpm-user-create-form input[type=text], input[type=email]" ).val('');
                    } else {
                        $('.cpm-error').html(resp.data);
                    }
                });

                return false;
            },

            Settings: function(e) {
                e.preventDefault();
                var self = $(this),
                    status = self.siblings('.cpm-settings');
                if( status.is(":visible") === false ) {
                    status.show();
                } else {
                    status.hide();
                }
            },

            ProjectArchive: function(e) {
                e.preventDefault();

                var self = $(this),
                    data = {
                        action: 'cpm_project_archive',
                        _nonce: CPM_Vars.nonce,
                        project_id: self.data( 'project_id' ),
                        type: self.data( 'type' ),
                    };
                if ( self.attr('disabled') == 'disabled' ) {
                    return false;
                }
                self.attr( 'disabled', true );
                self.siblings('span').addClass('cpm-loading');

                $.post( CPM_Vars.ajaxurl, data, function( resp ) {
                    self.attr( 'disabled', false );

                    if( resp.success ) {
                        if ( $('article.cpm-project').length ) {
                            $('.cpm-active').html( 'Active('+resp.data.count.active+')');
                            $('.cpm-archive-head').html( 'Completed('+resp.data.count.archive+')');
                            self.closest('article').fadeOut( 'slow', function() {
                                this.remove();
                            } );

                        } else {
                            location.href = resp.data.url;
                        }

                    };
                });

            },

            ProjectDuplicate: function(e) {
                e.preventDefault();
                var self = $(this),
                    data = {
                        action : 'cpm_project_duplicate',
                        _nonce : CPM_Vars.nonce,
                        url: self.attr('href'),
                        project_id : self.data( 'project_id' ),
                    };
                if ( self.attr('disabled') == 'disabled' ) {
                    return false;
                }

                self.attr( 'disabled', true );
                self.siblings('span').addClass('cpm-loading');

                $.post( CPM_Vars.ajaxurl, data, function( resp ) {

                    self.attr( 'disabled', false );
                    if( resp.success ) {

                        location.href = resp.data.url;
                    }
                });


            },

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
                var self = $(this).find('input[type=submit]');
                if( self.is(':disabled') ) {
                    return false;
                }

                var name = $.trim( $('#project_name').val() );

                if (name === '') {
                    alert('Enter a project name');

                    return false;
                }
                self.attr( 'disabled', true );
                var form = $(this),
                    data = form.serialize();

                form.find( '.cpm-loading' ).show(); //append('<div class="cpm-loading">Saving...</div>');
                $.post(CPM_Vars.ajaxurl, data, function (res) {
                    self.attr( 'disabled', false );
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
                    spinner = form.find('.cpm-pro-update-spinner');
                spinner.show();
                var container = $(this).closest('.cpm-project-head'),
                    data = form.serialize(),
                    button = form.find('input[type=submit]');

                button.attr('disabled', true);

                form.append('<div class="cpm-loading">Saving...</div>');

                $.post(CPM_Vars.ajaxurl, data, function (res) {
                    button.attr('disabled', false);
                    spinner.hide();

                    res = $.parseJSON( res );

                    if(res.success) {
                        container.find('.cpm-project-title').text(res.title);
                        container.find('.detail').html(res.content);
                        form.find('.cpm-project-role').children('table').html( res.users );

                        form.closest('.cpm-edit-project').slideUp();
                        container.find('.cpm-project-detail').slideToggle();

                        //re-initialize chosen dropdown
                        // $('#project_coworker').chosen();
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
                        url : self.attr('href'),
                        _wpnonce: CPM_Vars.nonce
                    };

                if(confirm(message)) {

                    self.siblings('span').addClass('cpm-loading');

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
            },

            loadAllActivity: function(e) {
                e.preventDefault();

                var self = $(this),
                    total = self.data('total'),
                    start = parseInt(self.data('start')),
                    data = {
                        projects_id: self.data('projects_id'),
                        offset: start,
                        action: 'cpm_get_projects_activity',
                        _wpnonce: CPM_Vars.nonce
                    };

                self.append('<div class="cpm-loading">Loading...</div>');
                $.get(CPM_Vars.ajaxurl, data, function (res) {
                    res = $.parseJSON(res);

                    if(res.success) {
                        start = res.count + start;
                        self.siblings('#cpm-progress-wrap').find('.cpm-activity').append(res.content);

                        self.data('start', start);
                    } else {
                        self.remove();
                    }

                    $('.cpm-loading').remove();
                });
            },

        },



        Milestone: {
            remove: function (e) {
                e.preventDefault();
                var self = $(this);

                if(confirm(self.data('confirm') ) ) {

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
                self.addClass( 'cpm-milestones-spinner' );
                $.post(CPM_Vars.ajaxurl, data, function (res) {
                    res = $.parseJSON(res);
                    if(res.success) {
                        parent.find('.milestone-detail').hide()
                            .next('.cpm-milestone-edit-form').html(res.content).fadeIn();

                        $('.datepicker').datepicker();
                        //console.log($('#cpm-milestone-editor-'+res.id) );
                        weDevs_CPM.tinymceInit('cpm-milestone-editor-'+res.id);
                    }
                });
            },

            add: function (e) {
                e.preventDefault();
                var form = $(this),
                    spinner = form.find( '.cpm-loading' ),
                    data = form.serialize(),
                    btn = form.find('input[name=create_milestone]');
                spinner.show();
                btn.attr( 'disabled', true );

                $.post(CPM_Vars.ajaxurl, data, function (res) {
                    spinner.hide();
                    btn.attr( 'disabled', false );
                    res = $.parseJSON(res);

                    if(res.success) {
                        window.location.reload();
                    }
                });
            },

            update: function (e) {
                e.preventDefault();

                var form = $(this),
                    spinner = form.find( '.cpm-loading' ),
                    btn = form.find('input[name=create_milestone]'),
                    data = form.serialize();

                spinner.show();
                btn.attr( 'disabled', true );
                $.post(CPM_Vars.ajaxurl, data, function (res) {
                    //spinner.hide();
                    //btn.attr( 'disabled', false );
                    res = $.parseJSON(res);

                    if(res.success) {
                        window.location.reload();
                    }
                });
            },

            cancelUpdate: function (e) {
                e.preventDefault();
                var self = $(this),
                    parent = self.closest('.cpm-milestone'),
                    spinner = parent.find( '.cpm-milestones-spinner' ),
                    id = self.data('milestone_id');
                spinner.removeClass( 'cpm-milestones-spinner' );
                tinymce.execCommand( 'mceRemoveEditor', true, 'cpm-milestone-editor-'+id );
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

                that.addClass('cpm-milestones-spinner');
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
                tinyMCE.triggerSave();
                var that = $(this),
                btn = that.find( 'input[name=cpm_new_comment]' ),
                spnier = that.find( '.cpm-loading' ),
                data = that.serialize();
                btn.attr( 'disabled', true );
                spnier.show();

                $.post(CPM_Vars.ajaxurl, data, function(res) {

                    btn.attr( 'disabled', false );
                    spnier.hide();

                    res = JSON.parse(res);

                    if(res.success) {
                        $('.cpm-comment-wrap').append(res.content).fadeIn('slow');
                        $('.cpm-comment-form textarea, .cpm-comment-form input[type=checkbox]').val('');
                        $('.cpm-comment-form .cpm-upload-filelist').html('');
                        //tinyMCE.activeEditor.setContent(res.placeholder);
                        tinyMCE.get('cpm-comment-editor-0').setContent(res.placeholder);

                    }
                    $('.cpm-colorbox-img').prettyPhoto();
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
                        weDevs_CPM.tinymceInit( 'cpm-comment-editor-'+res.id );
                    }
                });

            },

            cancelCommentEdit: function (e) {
                e.preventDefault();
                var that = $(this),
                    id = that.data('comment_id');
                tinymce.execCommand( 'mceRemoveEditor', true, 'cpm-comment-editor-'+id );
                that.parents('.cpm-comment').find('.cpm-comment-content').fadeIn();
                that.closest('.cpm-comment-edit-form').html('');
            },

            update: function (e) {
                e.preventDefault();

                var form = $(this),
                    btn = form.find( 'input[name=cpm_new_comment]' ),
                    spnier = form.find( '.cpm-loading' ),
                    container = form.closest('.cpm-comment-container'),
                    data = form.serialize(),
                    text = $.trim(form.find('textarea').val());

                if( text.length < 1 ) {
                    alert('Please enter some text');
                    return false;
                }


                btn.attr( 'disabled', true );
                spnier.show();

                $.post(CPM_Vars.ajaxurl, data, function(res) {

                    btn.attr( 'disabled', false );
                    spnier.hide();

                    res = $.parseJSON(res);

                    if(res.success) {
                        container.find('.cpm-comment-content').html(res.content).fadeIn();
                        form.parent().remove();
                    }
                    $('.cpm-colorbox-img').prettyPhoto();
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

                if( self.attr('disabled') == 'disabled' ) {
                    return false;
                }

                if(confirm(confirmMsg)) {
                    self.addClass( 'cpm-comment-spinner' );

                    self.attr( 'disabled', 'disabled' );

                    $.post(CPM_Vars.ajaxurl, data, function(res) {

                        self.removeClass( 'cpm-comment-spinner' );
                        self.removeAttr( 'disabled' );

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
                tinyMCE.triggerSave();
                var form = $(this),
                data = form.serialize(),
                btn = form.find('input[name=create_message]'),
                spnier = form.find('.cpm-loading');

                btn.attr( 'disabled', true );
                spnier.show();

                $.post(CPM_Vars.ajaxurl, data, function(res) {

                    btn.attr( 'disabled', false );
                    spnier.hide();

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
                    btn = self.find('input[name=create_message]'),
                    spnier = self.find('.cpm-loading'),
                    parent = self.closest('.cpm-single'),
                    data = self.serialize();

                btn.attr( 'disabled', true );
                spnier.show();

                $.post(CPM_Vars.ajaxurl, data, function(res) {

                    btn.attr( 'disabled', false );
                    spnier.hide();

                    res = $.parseJSON(res);

                    if( res.success ) {

                        parent.find('.cpm-entry-detail').html(res.content).fadeIn().next('.cpm-msg-edit-form').html('');

                        weDevs_CPM.tinymceInit( 'cpm-message-editor-'+res.id ).setContent('');
                    }
                    $('.cpm-colorbox-img').prettyPhoto();

                    $('.cpm-loading').remove();
                });
            },

            get: function(e) {
                e.preventDefault();

                var self = $(this);
                if( self.attr( 'disabled' ) == 'disabled' ) {
                    return false;
                }

                var parent = self.closest('.cpm-single'),
                    data = {
                        message_id: self.data('msg_id'),
                        project_id: self.data('project_id'),
                        action: 'cpm_message_get',
                        '_wpnonce': CPM_Vars.nonce
                    };
                self.addClass( 'cpm-single-spinner' );
                self.attr( 'disabled', true );
                $.post(CPM_Vars.ajaxurl, data, function(res) {
                    self.removeClass( 'cpm-single-spinner' );
                    self.attr( 'disabled', false );
                    res = $.parseJSON(res);

                    if( res.success ) {
                        parent.find('.cpm-entry-detail').hide().
                            next('.cpm-msg-edit-form').hide().html(res.content).fadeIn();

                        //re-initialize the uploader
                        new CPM_Uploader('cpm-upload-pickfiles-' + res.id, 'cpm-upload-container-' + res.id);
                        weDevs_CPM.tinymceInit( 'cpm-message-editor-'+res.id );//.setContent('');
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
                        is_admin : CPM_Vars.is_admin,
                        action: 'cpm_message_delete',
                        '_wpnonce': CPM_Vars.nonce
                    };

                if( confirm( self.data('confirm') ) ) {
                    self.css( 'opacity', '1' ).addClass( 'cpm-messages-spinner' );
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
        var cpm_abort;
        weDevs_CPM.init();
        $('.cpm-colorbox-img').prettyPhoto();

        $(".chosen-select").chosen({ width: '300px' });

        $('.cpm-timetraker').on( 'click', function() {
            $(this).runner('start');
        });

        $(".datepicker").datepicker({
            dateFormat: 'yy-mm-dd',
        });

        $( ".date_picker_from" ).datepicker({
            dateFormat: 'yy-mm-dd',
            changeYear: true,
            changeMonth: true,
            numberOfMonths: 1,
            onClose: function( selectedDate ) {

                $( ".date_picker_to" ).datepicker( "option", "minDate", selectedDate );
            }
        });
        $( ".date_picker_to" ).datepicker({
            dateFormat: 'yy-mm-dd',
            changeMonth: true,
            changeYear: true,
            numberOfMonths: 1,
            onClose: function( selectedDate ) {
                $( ".date_picker_from" ).datepicker( "option", "maxDate", selectedDate );
            }
        });

        if( $('#cpm-all-search').length || $('#cpm-single-project-search').length ) {
            cpm_all_sinle_project_search();
        }

        function cpm_all_sinle_project_search() {
            $( "#cpm-all-search, #cpm-single-project-search" ).autocomplete({
                minLength: 1,
                source: function( request, response) {
                    var self = this.element;

                    var data = {
                        action: 'all_search',
                        item: request.term,
                        project_id: self.data('project_id'),
                        is_admin: CPM_Vars.is_admin
                    };

                    if ( cpm_abort ) {
                        cpm_abort.abort();
                    }

                    cpm_abort = $.post( CPM_Vars.ajaxurl, data, function( resp ) {

                        if( resp.success ) {
                            var nme = eval( resp.data );
                            response( eval( resp.data ) );
                        } else {
                            response( '' );
                        }

                    });
                },
                select: function( event, ui) {
                    $(this).val("");
                    return false;
                }
            }).data( "ui-autocomplete" )._renderItem = function( ul, item ) {

                return $( "<li>" )
                    .append( item.label )
                    .appendTo( ul );
            };
        }



        if ( $("#cpm-search-client").length ) {
            cpm_project_search_by_client();
        }

        function cpm_project_search_by_client() {
            $( "#cpm-search-client" ).autocomplete({
                minLength: 1,
                source: function( request, response) {
                    var self = this.element,
                        data = {
                            action: 'search_client',
                            user: request.term,
                            is_admin: CPM_Vars.is_admin
                        };

                    if ( cpm_abort ) {
                        cpm_abort.abort();
                    }

                    cpm_abort = $.post( CPM_Vars.ajaxurl, data, function( resp ) {

                        if( resp.success ) {
                            var nme = eval( resp.data );
                            response( eval( resp.data ) );
                        } else {
                            response( '' );
                        }

                    });
                },
                select: function( event, ui) {
                    $(this).val("");
                    return false;
                }
            }).data( "ui-autocomplete" )._renderItem = function( ul, item ) {

                return $( "<li>" )
                    .append( item.label )
                    .appendTo( ul );
            };
        }

        if ( $( ".cpm-project-coworker" ).length ) {
            cpm_coworker_search()
        }

        function cpm_coworker_search() {

            $( ".cpm-project-coworker" ).autocomplete({
                minLength: 3,
                source: function( request, response) {
                    var data = {
                        action: 'cpm_user_autocomplete',
                        term: request.term
                    };

                    if ( cpm_abort ) {
                        cpm_abort.abort();
                    }

                    cpm_abort=$.post( CPM_Vars.ajaxurl, data, function( resp ) {

                        if( resp.success ) {
                            var nme = eval( resp.data );

                            response( eval( resp.data ) );
                        } else {
                            response( '' );
                        }

                    });
                },

                search: function() {
                    $(this).addClass('cpm-spinner');
                },

                open: function(){
                    var self = $(this);
                    self.autocomplete('widget').css('z-index', 9999);
                    self.removeClass('cpm-spinner');

                    return false;
                },

                select: function( event, ui) {
                    if( ui.item.value == 'cpm_create_user' ) {
                        $( "form.cpm-user-create-form" ).find('input[type=text]').val('');
                        $( "#cpm-create-user-wrap" ).dialog( "open" );
                    } else {
                        $('.cpm-project-role>table').append( ui.item._user_meta );
                        $( "input.cpm-project-coworker" ).val('');
                    }
                    return false;
                }
            }).data( "ui-autocomplete" )._renderItem = function( ul, item ) {
                return $( "<li>" )
                        .append( "<a>" + item.label + "</a>" )
                        .appendTo( ul );
            };
        }

        $('.cpm-project-form').on( 'click', '.cpm-project-role .cpm-del-proj-role', function() {
            $(this).closest('tr').remove();
        });
    });

})(jQuery);
