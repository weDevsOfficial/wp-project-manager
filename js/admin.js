jQuery(function($) {
    (function ($) {

        var weDevs_CPM = {
            init: function () {
                $('.cpm-form-tasks').on('click', '.cpm-add-task-item', this.Task.fieldAdd);
                $('.cpm-form-tasks').on('click', '.cpm-remove-task-item', this.Task.fieldRemove);
                $('.cpm-task').on('click', '.cpm-mark-task-complete', this.Task.markComplete);
                $('.cpm-task').on('click', '.cpm-mark-task-open', this.Task.markOpen);
                $('.cpm-task').on('click', '.cpm-mark-task-delete', this.Task.markDelete);
                $('.cpm-task-list').on('click', '.cpm-hide-tasks', this.Task.toggleTasks);
                $('.cpm-links').on('click', '.cpm-milestone-delete', this.Milestone.remove);
                $('.cpm-links').on('click', '.cpm-milestone-complete', this.Milestone.markComplete);
                $('.cpm-links').on('click', '.cpm-milestone-open', this.Milestone.markOpen);
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
                        '_wpnonce': cpm_nonce
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
                        '_wpnonce': cpm_nonce
                    };

                    that.addClass('cpm-loading');
                    $.post(ajaxurl, data, function (response) {
                        location.reload();
                    });
                }
            }
        };

        weDevs_CPM.init();

        $('#project_manager, #project_coworker, #project_client').chosen();
        $( "#project_started, #project_ends" ).datepicker();
        $( ".datepicker" ).datepicker();

        $( "#project-status-slider" ).slider({
            range: "min",
            value: 0,
            min: 0,
            max: 100,
            slide: function( event, ui ) {
                $( "#project-status" ).val( ui.value );
                $( "#project-status-text" ).text( ui.value + ' %' );
            }
        });

    })(jQuery);
});