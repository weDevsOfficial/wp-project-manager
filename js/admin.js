;(function ($) {

    window.weDevs_CPM = {
        init: function () {

            //initialize uploader
            this.Uploader.init();

            $('.cpm-form-tasks').on('click', '.cpm-add-task-item', this.Task.fieldAdd);
            $('.cpm-form-tasks').on('click', '.cpm-remove-task-item', this.Task.fieldRemove);
            $('.cpm-task').on('click', '.cpm-mark-task-complete', this.Task.markComplete);
            $('.cpm-task').on('click', '.cpm-mark-task-open', this.Task.markOpen);
            $('.cpm-task').on('click', '.cpm-mark-task-delete', this.Task.markDelete);
            $('.cpm-task-list').on('click', '.cpm-hide-tasks', this.Task.toggleTasks);

            $('.cpm-links').on('click', '.cpm-milestone-delete', this.Milestone.remove);
            $('.cpm-links').on('click', '.cpm-milestone-complete', this.Milestone.markComplete);
            $('.cpm-links').on('click', '.cpm-milestone-open', this.Milestone.markOpen);

            $('.cpm-comment-wrap').on('click', '.cpm-edit-comment-link', this.Comment.get);
            $('.cpm-comment-wrap').on('click', '.cpm-comment-edit-cancel', this.Comment.cancelCommentEdit);
            $('.cpm-comment').on('submit', '.cpm-comment-edit', this.Comment.update);

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

            $('.cpm-invoice-items').on('click', '.cpm-add-invoice-item', this.Invoice.fieldAdd);
            $('.cpm-invoice-items').on('click', '.cpm-remove-invoice-item', this.Invoice.fieldRemove);
            $('.cpm-invoice-items').on('click', '.toggle-description', weDevs_CPM.Invoice.toggleDescripton);
            $('.cpm-invoice-items').on('change', '.qty', weDevs_CPM.Invoice.changeQty);
            $('.cpm-invoice-items').on('change', '.price', weDevs_CPM.Invoice.changePrice);
            $('.cpm-invoice-items').on('change', '.tax', weDevs_CPM.Invoice.changePrice);
            $('#discount').on('change', weDevs_CPM.Invoice.calculateTotal);

            $('#cpm-upload-container').on('click', '.cpm-delete-file', weDevs_CPM.Uploader.deleteFile);
            $('.cpm-comment-wrap').on('click', '.cpm-delete-file', weDevs_CPM.Uploader.deleteFile);

            // add/update new invoice
            $('.cpm-new-invoice, .cpm-update-invoice').validate({
                submitHandler: function(form) {
                    weDevs_CPM.Invoice.submit.call(form);
                }
            });
        },
        Task: {
            fieldAdd: function () {
                var row = $('#cpm-form-tasks-new').html();

                $(row).insertAfter($(this).parent().parent());
                $(".datepicker").datepicker();

                return false;
            },
            fieldRemove: function () {
                $(this).parent().parent().remove();

                return false;
            },
            markComplete: function (e) {
                e.preventDefault();

                weDevs_CPM.Task.ajaxRequest.call(this, 'cpm_task_complete');
            },
            markOpen: function (e) {
                e.preventDefault();

                weDevs_CPM.Task.ajaxRequest.call(this, 'cpm_task_open');
            },
            markDelete: function (e) {
                e.preventDefault();

                if (confirm('Are you sure?')) {
                    weDevs_CPM.Task.ajaxRequest.call(this, 'cpm_task_delete');
                }
            },
            ajaxRequest: function (action) {
                var that = $(this),
                data = {
                    task_id: that.data('id'),
                    action: action,
                    '_wpnonce': CPM_Vars.nonce
                };

                that.addClass('cpm-loading');
                $.post(ajaxurl, data, function (response) {
                    location.reload();
                });
            },
            toggleTasks: function (e) {
                e.preventDefault();

                $(this).parent().next('.cpm-tasks').slideToggle();
            }
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
        Invoice: {
            fieldAdd: function () {
                var row = $('#cpm-form-invoice-tmpl').html();
                var tpl = _.template($('#cpm-form-invoice-tmpl').html()),
                type = 'item';

                if($(this).parents('table').hasClass('hourly')) {
                    console.log('hourly');
                    type = 'hour';
                } else {
                    console.log('normal');
                }

                $(tpl({
                    type:type
                })).insertAfter($(this).parent().parent());

                return false;
            },
            fieldRemove: function () {
                var that = $(this),
                count = that.parent().parent().parent().find('tr');

                if(count.length > 1) {
                    that.parent().parent().remove();
                    weDevs_CPM.Invoice.calculateTotal();
                }

                return false;
            },
            toggleDescripton: function (){
                $(this).next('.entry-details').slideToggle('fast');

                return false;
            },
            changeQty: function () {
                weDevs_CPM.Invoice.calculateRow.call(this);
            },
            changePrice: function() {
                weDevs_CPM.Invoice.calculateRow.call(this);
            },
            changeTax: function() {
                weDevs_CPM.Invoice.calculateRow.call(this);
            },
            calculateRow: function () {
                var that = $(this).parent(),
                parent = that.parent(),
                qty = parseInt(parent.find('.qty').val()),
                tax = parseInt(parent.find('.tax').val()),
                amount = parseFloat(parent.find('.price').val()),
                total = qty*amount;

                total = isNaN(total) ? 0 : total;
                tax = isNaN(tax) ? 0 : (tax * total)/100;

                parent.find('.total').text(total.toFixed(2));
                parent.find('.entry-total').val(total.toFixed(2));
                parent.find('.entry-tax').val(tax.toFixed(2));

                weDevs_CPM.Invoice.calculateTotal();
            },
            calculateTotal: function () {
                var sub_total = 0,
                invoice_total = 0,
                total_tax = 0,
                totals_table = $('table.cpm-invoice-totals');
                discount = parseFloat($('#discount').val()),
                paid = parseFloat($('.total-paid').text()),

                //loop thorough the table row and calculate
                $('.cpm-invoice-items tr').each(function(){
                    var that = $(this),
                    row_total = 0,
                    row_tax = 0;

                    //console.log(that);

                    row_total = parseFloat(that.find('input.entry-total').val());
                    row_tax = parseFloat(that.find('input.entry-tax').val());

                    sub_total += isNaN(row_total) ? 0 : row_total;
                    total_tax += isNaN(row_tax) ? 0 : row_tax;
                });

                //Now update the values
                discount = isNaN(discount) ? 0 : discount;
                paid = isNaN(paid) ? 0 : paid;
                invoice_total = sub_total + total_tax - discount;
                total = invoice_total - paid;

                //update subtotal
                totals_table.find('span.subtotal').text(sub_total.toFixed(2));
                totals_table.find('input.subtotal').val(sub_total.toFixed(2));

                //update discount
                totals_table.find('span.discount').text('0.00');
                totals_table.find('input.invoice-discount').val('0.00');

                //update tax
                totals_table.find('span.tax').text(total_tax.toFixed(2));
                totals_table.find('input.tax').val(total_tax.toFixed(2));

                //update discount
                totals_table.find('span.invoice-discount').text(discount.toFixed(2));
                totals_table.find('input.invoice-discount').val(discount.toFixed(2));

                //update invoice total
                totals_table.find('span.invoice-total').text(invoice_total.toFixed(2));
                totals_table.find('input.invoice-total').val(invoice_total.toFixed(2));

                //update grand total
                totals_table.find('span.invoice-balance').text(total.toFixed(2));
                totals_table.find('input.invoice-balance').val(total.toFixed(2));
            },
            submit: function () {
                var that = $(this),
                data = that.serialize();

                that.append('<div class="cpm-loading">Saving...</div>');
                $.post(CPM_Vars.ajaxurl, data, function(response) {
                    $('#ajax-response').html(response);
                    window.location.href = response;
                    $('.cpm-loading').remove();
                });

                return false;
            }
        },
        Uploader: {
            init: function() {

            },
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
                    that.closest('.cpm-uploaded-item').remove();
                }
            }
        },
        Comment: {
            addNew: function () {
                var that = $(this),
                data = that.serialize();

                that.append('<div class="cpm-loading">Saving...</div>');
                $.post(CPM_Vars.ajaxurl, data, function(response) {
                    //console.log(response);
                    $('.cpm-comment-wrap').append(response).fadeIn('slow');
                    $('.cpm-comment-form textarea').val('');
                    $('.cpm-comment-form #cpm-upload-filelist').html('');
                    $('.cpm-loading').remove();
                });
            },
            get: function (e) {
                e.preventDefault();

                var that = $(this),
                data = {
                    id: that.data('id'),
                    action: 'cpm_get_comment',
                    '_wpnonce': CPM_Vars.nonce
                };

                //console.log(data);
                $.post(CPM_Vars.ajaxurl, data, function(response) {
                    if(that.parent().parent().find('form').length == 0 ) {

                        var tpl = _.template($('#cpm-comment-edit').html()),

                        html = tpl($.parseJSON(response));
                        that.parent().parent().append(html);
                        that.parent().parent().find('.cpm-comment-container').hide();
                    }

                //console.log(html);
                });

            },
            cancelCommentEdit: function (e) {
                e.preventDefault();
                var that = $(this);

                that.parents('.cpm-comment').find('.cpm-comment-container').show();
                that.closest('form.cpm-comment-edit').remove();
            },
            update: function () {
                var that = $(this),
                data = that.serialize(),
                text = $.trim(that.find('textarea').val())

                if( text.length < 1 ) {
                    alert('Please enter some text');
                    return false;
                }

                $.post(CPM_Vars.ajaxurl, data, function(response) {
                    var json = $.parseJSON(response);
                    that.parent().find('.cpm-comment-content').text(json.comment_content);
                    that.parent().find('.cpm-comment-container').show();
                    that.remove();
                });

                return false;
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
        $("#project_started, #project_ends").datepicker();
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
