;(function ($) {

    var weDevs_CPM = {
        init: function () {

            $('.cpm-links').on('click', '.cpm-milestone-delete', this.Milestone.remove);
            $('.cpm-links').on('click', '.cpm-milestone-complete', this.Milestone.markComplete);
            $('.cpm-links').on('click', '.cpm-milestone-open', this.Milestone.markOpen);

            $('.cpm-comment-wrap').on('click', '.cpm-edit-comment-link', this.Comment.get);
            $('.cpm-comment-wrap').on('click', '.cpm-comment-edit-cancel', this.Comment.cancelCommentEdit);
            $('.cpm-comment-wrap').on('submit', '.cpm-comment-form', this.Comment.update);

            // add new comment
            $('.cpm-comment-form').validate({
                submitHandler: function (form) {
                    weDevs_CPM.Comment.addNew.call(form);

                    return false;
                }
            });

            // add new message
            $('.cpm-new-message').validate({
                submitHandler: function (form) {
                    weDevs_CPM.Message.addNew.call(form);

                    return false;
                }
            });
            $('.cpm-new-message-btn').on('click', this.Message.toggleBtn);
            $('.cpm-get-message').on('click', this.Message.get);

            $('#cpm-upload-container').on('click', '.cpm-delete-file', weDevs_CPM.Uploader.deleteFile);
            $('.cpm-comment-wrap').on('click', '.cpm-delete-file', weDevs_CPM.Uploader.deleteFile);
        },
        Milestone: {
            remove: function (e) {
                e.preventDefault();
                weDevs_CPM.Milestone.ajaxRequest.call(this, 'cpm_delete_milestone');
            },
            markComplete: function (e) {
                e.preventDefault();
                weDevs_CPM.Milestone.ajaxRequest.call(this, 'cpm_milestone_complete');
            },
            markOpen: function (e) {
                e.preventDefault();
                weDevs_CPM.Milestone.ajaxRequest.call(this, 'cpm_milestone_open');
            },
            ajaxRequest: function (action) {
                var that = $(this),
                data = {
                    milestone_id: that.data('id'),
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
                        $('.cpm-comment-form textarea').val('');
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
                        parent.find('.cpm-comment-edit-form').html(res.form);

                        //re-initialize the uploader
                        new CPM_Uploader('cpm-upload-pickfiles-' + res.id, 'cpm-upload-container-' + res.id);
                    }
                });

            },

            cancelCommentEdit: function (e) {
                e.preventDefault();
                var that = $(this);

                that.parents('.cpm-comment').find('.cpm-comment-content').show();
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
                        container.find('.cpm-comment-content').html(res.content);
                        container.find('.cpm-comment-content').show();
                        form.parent().remove();
                    }
                });
            }
        },
        Message: {
            toggleBtn: function (e) {
                e.preventDefault();

                $('.cpm-new-message').slideToggle();
            },
            addNew: function () {
                var that = $(this),
                data = that.serialize();

                that.append('<div class="cpm-loading">Saving...</div>');
                $.post(CPM_Vars.ajaxurl, data, function(response) {
                    window.location.href = response;
                    $('.cpm-loading').remove();
                });
            },
            get: function(e) {
                e.preventDefault();

                var that = $(this),
                data = {
                    id: that.data('id'),
                    action: 'cpm_get_message',
                    '_wpnonce': CPM_Vars.nonce
                };

                //console.log(data);
                $.post(CPM_Vars.ajaxurl, data, function(response) {
                    //console.log(response);
                    });
            }
        }
    };

    //dom ready
    $(function() {
        weDevs_CPM.init();

        $('#project_manager, #project_coworker, #project_client').chosen();
        $(".datepicker").datepicker();

        $("#project-status-slider").slider({
            range: "min",
            value: 0,
            min: 0,
            max: 100,
            slide: function (event, ui) {
                $("input#project-status").attr('value', ui.value);
                $("#project-status-text").text(ui.value + ' %');
            }
        });
    });

})(jQuery);
