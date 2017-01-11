;(function($) {

    var CPM_Task = {

        init: function () {
            $('.cpm-task-complete .cpm-complete').attr('checked', 'checked').attr('disabled', false);
            $('.cpm-task-uncomplete .cpm-uncomplete').removeAttr('checked').attr('disabled', false);

            $('.cpm-todolists').on('click', 'a.add-task', this.showNewTodoForm);
            $('.cpm-todolists').on('click', '.cpm-todos-new-form a.todo-cancel', this.hideNewTodoForm);
            $('.cpm-todolists').on('submit', '.cpm-todo-form form.cpm-task-form', this.submitNewTodo);

            //edit todo
            $('.cpm-todolists').on('click', 'a.cpm-todo-edit', this.toggleEditTodo);
            $('.cpm-todolists').on('click', '.cpm-task-edit-form a.todo-cancel', this.toggleEditTodo);
            $('.cpm-todolists').on('submit', '.cpm-task-edit-form form', this.updateTodo);

            //single todo
            $('.cpm-single-task').on('click', '.cpm-todo-action-right a.cpm-todo-edit', this.toggleEditTodo);
            $('.cpm-single-task').on('click', '.cpm-task-edit-form a.todo-cancel', this.toggleEditTodo);
            $('.cpm-single-task').on('submit', '.cpm-task-edit-form form', this.updateTodo);
            $('.cpm-single-task').on('click', 'input[type=checkbox].cpm-uncomplete', this.markDone);
            $('body').on('click', '.cpm-complete', this.markUnDone);
            $('.cpm-single-task').on('click', 'a.cpm-todo-delete', this.deleteTodo);

            //task done, undone, delete
            $('.cpm-todolists').on('click', '.cpm-uncomplete', this.markDone);
            $('.cpm-todolists').on('click', 'a.cpm-todo-delete', this.deleteTodo);

            //todolist
            // $('.cpm-new-todolist-form').on('submit', 'form', this.addList);
            // $('.cpm-todolists').on('submit', '.cpm-list-edit-form form', this.updateList);
            //$('.cpm-new-todolist-form').on('click', 'a.list-cancel', this.toggleNewTaskListForm);
            //$('a#cpm-add-tasklist').on('click', this.toggleNewTaskListFormLink);

            //tasklist edit, delete links toggle
            // $('body').on('click', 'a.cpm-list-delete', this.deleteList);
            //$('body').on('click', 'a.cpm-list-edit', this.toggleEditList);
            //$('body').on('click', 'a.list-cancel', this.toggleEditList);
            // $('body').on('click', 'a.cpm-list-pin', this.togglePinStatus);
            // Load more


            this.makeSortableTodoList();
            this.makeSortableTodo();

        },

        datePicker: function() {
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

        },

        makeSortableTodoList: function() {
            var todos = $('ul.cpm-todolists');

            if (todos) {
                todos.sortable({
                    placeholder: "ui-state-highlight",
                    handle: '.move',
                    stop: function(e,ui) {
                        var items = $(ui.item).parents('ul.cpm-todolists').find('> li');
                        var ordered = [];

                        for (var i = 0; i < items.length; i++) {
                            ordered.push($(items[i]).data('id'));
                        }

                        CPM_Task.saveOrder(ordered);
                    }
                });
            }
        },

        makeSortableTodo: function() {
            var todos = $('ul.cpm-todolist-content');

            if (todos) {
                todos.sortable({
                    placeholder: "ui-state-highlight",
                    handle: '.move',
                    stop: function(e,ui) {
                        var items = $(ui.item).parents('ul.cpm-todolist-content').find('input[type=checkbox]');
                        var ordered = [];

                        for (var i = 0; i < items.length; i++) {
                            ordered.push($(items[i]).val());
                        }

                        CPM_Task.saveOrder(ordered);
                    }
                });
            }
        },

        saveOrder: function(order) {
            var data = {
                items: order,
                action: 'cpm_task_order'
            };

            $.post(CPM_Vars.ajaxurl, data);
        },

        showNewTodoForm: function (e) {
            e.preventDefault();
            var self = $(this),
                next = self.parent().next();

            self.closest('li').addClass('cpm-hide');
            next.removeClass('cpm-hide');
            $(".chosen-select").chosen({ width: '300px' });
            CPM_Task.datePicker();
        },

        hideNewTodoForm: function (e) {
            e.preventDefault();

            var self = $(this),
                list = self.closest('.cpm-todo-form');

            list.addClass('cpm-hide');
            list.prev().removeClass('cpm-hide');
        },

        markDone: function () {
            var self = $(this);

            self.attr( 'disabled', true );
            self.siblings('.cpm-spinner').show();

            var list = self.closest('li'),
                taskListEl = self.closest('article.cpm-todolist'),
                singleWrap = self.closest('.cpm-single-task'),
                data = {
                    task_id: self.val(),
                    project_id: self.data('project'),
                    list_id: self.data('list'),
                    single: self.data('single'),
                    action: 'cpm_task_complete',
                    '_wpnonce': CPM_Vars.nonce,
                    is_admin : self.data('is_admin')
                };

            $(document).trigger('cpm.markDone.before', [self]);

            $.post(CPM_Vars.ajaxurl, data, function (res) {

                res = JSON.parse(res);

                if (res.success === true ) {
                    $(document).trigger('cpm.markDone.after', [res,self]);

                    if ( list.length ) {
                        var completeList = $('ul.cpm-todolist-content').last();
                        var sp = $('ul.cpm-todolist-content').attr('data-status');

                        if(sp){
                            completeList.append('<li class="cpm-todo">' + res.content + '</li>');
                        }
                        // location.reload();
                        list.remove();
                        taskListEl.find('.cpm-todo-prgress-bar').html(res.progress);
                        taskListEl.find('.no-percent').html(res.percent);
                        taskListEl.find('.cpm-todo-complete span').html(res.task_complete);
                        taskListEl.find('.cpm-todo-incomplete span').html(res.task_uncomplete);

                    } else if(singleWrap.length) {
                        singleWrap.html(res.content);
                    }
                }
            });
        },

        markUnDone: function () {
            var self = $(this);
            self.attr( 'disabled', true );
            self.siblings('.cpm-spinner').show();

            var list = self.closest('li'),
                taskListEl = self.closest('article.cpm-todolist'),
                singleWrap = self.closest('.cpm-single-task'),
                data = {
                    task_id: self.val(),
                    project_id: self.data('project'),
                    list_id: self.data('list'),
                    single: self.data('single'),
                    action: 'cpm_task_open',
                    '_wpnonce': CPM_Vars.nonce,
                    is_admin: self.data('is_admin'),
                };

            $(document).trigger('cpm.markUnDone.before', [self]);
            $.post(CPM_Vars.ajaxurl, data, function (rest) {
                res = JSON.parse(rest);

                if(res.success === true ) {
                    $(document).trigger('cpm.markUnDone.after', [res,self]);
                  //  location.reload();

                    if(list.length) {
                      //  var currentList = list.parent().siblings('.cpm-todos');
                        var currentList = $('ul.cpm-todolist-content').last();
                        currentList.prepend('<li class="cpm-todo">' + res.content + '</li>');
                        list.remove();

                        //update progress
                        taskListEl.find('.cpm-todo-prgress-bar').html(res.progress);
                        taskListEl.find('.cpm-todo-complete span').html(res.task_complete);
                        taskListEl.find('.cpm-todo-incomplete span').html(res.task_uncomplete);
                        taskListEl.find('.no-percent').html(res.percent);
                    } else if(singleWrap.length) {
                        singleWrap.html(res.content);
                }

            }
        });
    },

        deleteTodo: function (e) {
            e.preventDefault();

            var self = $(this),
                list = self.closest('li'),
                taskListEl = self.closest('article.cpm-todolist'),
                confirmMsg = self.data('confirm'),
                single = self.data('single'),
                data = {
                    list_id: self.data('list_id'),
                    project_id: self.data('project_id'),
                    task_id: self.data('task_id'),
                    action: 'cpm_task_delete',
                    '_wpnonce': CPM_Vars.nonce,
                    is_admin : CPM_Vars.is_admin,
                };
            $(document).trigger('cpm.deleteTodo.before',[self]);
            if( confirm(confirmMsg) ) {
                self.addClass('cpm-icon-delete-spinner');
                self.closest('.cpm-todo-action').css('visibility', 'visible');

                $.post(CPM_Vars.ajaxurl, data, function (res) {
                    res = JSON.parse(res);
                    $(document).trigger('cpm.deleteTodo.after',[res,self]);
                    if(res.success) {
                        if(single !== '') {
                            location.href = res.list_url;
                        } else {
                            list.fadeOut(function() {
                                $(this).remove();
                            });

                            //update progress
                            taskListEl.find('h3 .cpm-right').html(res.progress);
                        }
                    }
                });
            }
        },

        toggleEditTodo: function (e) {

            e.preventDefault();

            var wrap = $(this).closest('.cpm-todo-wrap');
            wrap.find('.cpm-todo-content').toggle();
            wrap.find('.cpm-task-edit-form').slideToggle();
            $(".chosen-select").chosen({ width: '300px' });
            CPM_Task.datePicker();
        },

        updateTodo: function (e) {
            e.preventDefault();

            var self = $(this),
                this_btn = self.find('input[name=submit_todo]'),
                spinner = self.find('.cpm-new-task-spinner');

            var data = self.serialize(),
                list = self.closest('li'),
                singleWrap = self.closest('.cpm-single-task'),
                content = $.trim(self.find('.task_title').val());

            $(document).trigger('cpm.updateTodo.before',[self]);

            if(content !== '') {
                this_btn.attr( 'disabled', true );
                spinner.show();

                $.post(CPM_Vars.ajaxurl, data, function (res) {
                    this_btn.attr( 'disabled', false );
                    spinner.hide();
                    res = JSON.parse(res);

                    if(res.success === true) {
                        if(list.length) {
                            list.html(res.content); //update in task list
                        } else if(singleWrap.length) {
                            singleWrap.html(res.content); //update in single task
                        }
                        CPM_Task.datePicker();
                        $(".chosen-select").chosen({ width: '300px' });
                    } else {
                        alert('something went wrong!');
                    }
                    $(document).trigger('cpm.updateTodo.after',[res,self]);
                });
            } else {
                alert('type something');
            }
        },

        //toggle new task list form from top link
        toggleNewTaskListFormLink: function (e) {
            e.preventDefault();

            $('.cpm-new-todolist-form').slideToggle();
        },

        toggleNewTaskListForm: function (e) {
            e.preventDefault();

            $(this).closest('form').parent().slideToggle();
        },

        toggleEditList: function (e) {
            e.preventDefault();

            var article = $(this).closest('article.cpm-todolist');
                article.find('header').slideToggle();
                article.find('.cpm-list-edit-form').slideToggle();
        },

       togglePinStatus: function (e) {
            e.preventDefault();
            var spinner = $(this).find('.cpm-new-list-spinner');
            var status = $(this).attr('data-status');
            var new_status = 'yes';

            if ( status == 'yes' ) {
                new_status = 'no';
            }

            var data = {
                list_id: $(this).attr('data-list_id'),
                action: 'cpm_tasklist_pinstatus_update',
                pin_status: new_status,
                '_wpnonce': CPM_Vars.nonce
            };
            spinner.show();
            $.post(CPM_Vars.ajaxurl, data, function(res) {
                spinner.hide();
                res = JSON.parse(res);

                if (res.success === true) {
                    window.location.reload();
                } else {
                    alert('something went wrong!');
                }
            });
        },

        submitNewTodo: function (e) {
            e.preventDefault();

            var self = $(this),
                this_btn = self.find('input[name=submit_todo]'),
                spinner = self.find('.cpm-new-task-spinner');
            var data = self.serialize(),
                taskListEl = self.closest('.cpm-todolist'),
                content = $.trim(self.find('.task_title').val());


            $(document).trigger( 'cpm.submitNewTodo.before', [self] );

            if(content !== '') {

                this_btn.attr( 'disabled', true );
                spinner.show();
                $.post(CPM_Vars.ajaxurl, data, function (res) {

                    this_btn.attr( 'disabled', false );
                    spinner.hide();

                    res = JSON.parse(res);
                    if(res.success === true) {
                        var currentList = taskListEl.find('ul.cpm-todolist-content');
                        currentList.prepend( '<li class="cpm-todo">' + res.content + '</li>' );

                        //clear the form
                        self.find('textarea, input[type=text]').val('');
                        self.find('select').val('').trigger("chosen:updated");
                        //update progress
                        // taskListEl.find('h3 .cpm-right').html(res.progress);
                        taskListEl.find('.cpm-todo-prgress-bar').html(res.progress);
                        taskListEl.find('.cpm-todo-complete span').html(res.task_complete);
                        taskListEl.find('.cpm-todo-incomplete span').html(res.task_uncomplete);
                        taskListEl.find('.no-percent').html(res.percent);


                        CPM_Task.datePicker();
                    } else {
                        alert('something went wrong!');
                    }
                    $(document).trigger('cpm.submitNewTodo.after',[res,self]);
                    showterror();
                });
            } else {
                alert('type something');
            }
        },

        addList: function (e) {
            e.preventDefault();

            var self = $(this),
                this_btn = self.find('input[name=submit_todo]'),
                spinner = self.find('.cpm-new-list-spinner');

            var data = self.serialize(),
                content = $.trim(self.find('input[name=tasklist_name]').val());

            $(document).trigger('cpm.addList.before',[self]);
            if(content !== '') {
                this_btn.attr( 'disabled', true );
                spinner.show();
                $.post(CPM_Vars.ajaxurl, data, function (res) {

                    this_btn.attr( 'disabled', false );
                    spinner.hide();

                    res = JSON.parse(res);

                    if(res.success === true) {
                        if(! $("ul.cpm-todolists").length){
                             location.reload();
                        }
                        $('ul.cpm-todolists').append('<li id="cpm-list-' + res.id + '">' + res.content + '</li>');

                        var list = $('#cpm-list-' + res.id);

                        $('.cpm-new-todolist-form').slideToggle();
                        $('body, html').animate({
                            scrollTop: list.offset().top
                        });

                        list.find('a.add-task').click();
                        list.find('textarea.todo_content').focus();

                        self.find('textarea, input[type=text]').val('');
                        self.find('select').val('-1');
                        self.find('input[type=checkbox]').removeAttr('checked');
                        CPM_Task.datePicker();

                        CPM_Task.makeSortableTodoList();
                        CPM_Task.makeSortableTodo();
                        $(".chosen-select").chosen({ width: '300px' });
                        $(document).trigger('cpm.addList.after',[res,self]);
                        $(".cpm-blank-loading").remove() ;
                       showterror() ;
                    }
                });
            } else {
                alert('type something');
            }
        },

        tinyMCE: function(id) {

            tinyMCE.init({
                skin : "wp_theme",
                mode : "exact",
                elements : id,
                theme: "modern",
                menubar: false,
                toolbar1: 'bold,italic,underline,blockquote,strikethrough,bullist,numlist,alignleft,aligncenter,alignright,undo,redo,link,unlink,spellchecker,wp_fullscreen',
                plugins: "wpfullscreen,charmap,colorpicker,hr,lists,media,paste,tabfocus,textcolor,fullscreen,wordpress,wpautoresize,wpeditimage,wpgallery,wplink,wpdialogs,wpview"
            });
        },

        updateList: function (e) {
            e.preventDefault();

            var self = $(this),
                this_btn = self.find('input[name=submit_todo]'),
                spinner = self.find('.cpm-new-list-spinner');

            this_btn.attr( 'disabled', true );
            spinner.show();

            var data = self.serialize();

            $(document).trigger('cpm.updateList.before',[self]);

            $.post(CPM_Vars.ajaxurl, data, function (res) {
                res = JSON.parse(res);
                this_btn.attr( 'disabled', false );
                spinner.hide();

                if(res.success === true) {
                    self.closest('li').html(res.content);
                    CPM_Task.datePicker();
                }

                $(document).trigger('cpm.updateList.after',[res,self]);
            });
        },

        deleteList: function (e) {
            e.preventDefault();

            var self = $(this),
                list = self.closest('li'),
                confirmMsg = self.data('confirm'),
                data = {
                    list_id: self.data('list_id'),
                    action: 'cpm_tasklist_delete',
                    '_wpnonce': CPM_Vars.nonce
                };

            $(document).trigger('cpm.deleteList.before',[self]);

            if( confirm(confirmMsg) ) {

                self.addClass('cpm-icon-delete-spinner');
                self.closest('.cpm-list-actions').css('visibility', 'visible');

                $.post(CPM_Vars.ajaxurl, data, function (res) {
                    res = JSON.parse(res);
                    $(document).trigger('cpm.deleteList.after',[res,self]);
                    if(res.success) {
                        list.fadeOut(function() {
                           list.remove();
                          showterror();
                        });
                    }

                });

            }
        },
    };

    $(function() {
        CPM_Task.init();
        showterror();
        showmerror();
        loadtodos(0);
    });

 function  showterror(){

    var  li = $(".cpm-todolists li").length;
    if (li === 0) {
        $(".cpm-blank-template.todolist").show('500');
        $(".cpm-todo-formcontent").hide();
    }else {
        $(".cpm-blank-template.todolist").hide('500') ;
         $(".cpm-todo-formcontent").show() ;
    }
}


 function  showmerror(){

    var  li = $(".cpm-milestone-data").length;
     if(li === 0)
    {
        $(".cpm-blank-template.milestone").show('500') ;
    }else {
        $(".cpm-blank-template.milestone").hide() ;
    }
}



function loadtodos(fromli, complete){
var $ = jQuery ;
    $(".cpm-todolist-content").each(function(index, val){
        if(!$(this).hasClass("loadcomplete") || !$(this).hasClass("loadonprocess") ) {
            $(this).addClass("loadonprocess");
            var list_id = $(this).attr('data-listid');
            var project_id = $(this).attr('data-project-id');
            var single = $(this).attr('data-status');
            var data = {
                    project_id  : project_id,
                    list_id  : list_id,
                    single : single,
                    action: 'cpm_get_todo_list',
                    is_admin : CPM_Vars.is_admin,
                };
             $.post(CPM_Vars.ajaxurl, data, function (res) {
                $(val).html(res) ;
            });
            $(this).addClass("loadcomplete");
        }

    });
}



})(jQuery);
