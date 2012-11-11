(function($) {

    var CPM_Task = {

        init: function () {
            $('ul.cpm-todolists').on('click', 'a.add-task', this.showNewTodoForm);
            $('ul.cpm-todolists').on('click', '.cpm-todos-new a.todo-cancel', this.hideNewTodoForm);
            $('ul.cpm-todolists').on('submit', '.cpm-todo-form form', this.submitNewTodo);

            //edit todo
            $('ul.cpm-todolists').on('click', '.cpm-todo-action a.cpm-todo-edit', this.toggleEditTodo);
            $('ul.cpm-todolists').on('click', '.cpm-task-edit-form a.todo-cancel', this.toggleEditTodo);
            $('ul.cpm-todolists').on('submit', '.cpm-task-edit-form form', this.updateTodo);

            //single todo
            $('.cpm-single-task').on('click', '.cpm-todo-action a.cpm-todo-edit', this.toggleEditTodo);
            $('.cpm-single-task').on('click', '.cpm-task-edit-form a.todo-cancel', this.toggleEditTodo);
            $('.cpm-single-task').on('submit', '.cpm-task-edit-form form', this.updateTodo);

            //task done, undone, delete
            $('ul.cpm-todolists').on('click', '.cpm-todos input[type=checkbox]', this.markDone);
            $('ul.cpm-todolists').on('click', '.cpm-todo-completed input[type=checkbox]', this.markUnDone);
            $('ul.cpm-todolists').on('click', 'a.cpm-todo-delete', this.deleteTodo);

            //todolist
            $('.cpm-new-todolist-form').on('submit', 'form', this.addList);
            $('ul.cpm-todolists').on('submit', '.cpm-list-edit-form form', this.updateList);
            $('.cpm-new-todolist-form').on('click', 'a.list-cancel', this.toggleNewTaskListForm);
            $('a#cpm-add-tasklist').on('click', this.toggleNewTaskListFormLink);

            //tasklist edit, delete links toggle
            $('ul.cpm-todolists').on('click', 'a.cpm-list-delete', this.deleteList);
            $('ul.cpm-todolists').on('click', 'a.cpm-list-edit', this.toggleEditList);
            $('ul.cpm-todolists').on('click', 'a.list-cancel', this.toggleEditList);
        },

        showNewTodoForm: function (e) {
            e.preventDefault();

            var self = $(this),
                next = self.parent().next();

            self.closest('li').addClass('cpm-hide');
            next.removeClass('cpm-hide');
        },

        hideNewTodoForm: function (e) {
            e.preventDefault();

            var self = $(this),
                list = self.closest('li');

            list.addClass('cpm-hide');
            list.prev().removeClass('cpm-hide');
        },

        markDone: function () {

            var self = $(this),
                list = self.closest('li'),
                data = {
                    task_id: self.val(),
                    project_id: self.data('project'),
                    list_id: self.data('list'),
                    action: 'cpm_task_complete',
                    '_wpnonce': CPM_Vars.nonce
                };

            $.post(CPM_Vars.ajaxurl, data, function (res) {
                res = JSON.parse(res);

                if(res.success === true ) {
                    var completeList = list.parent().siblings('.cpm-todo-completed');
                    completeList.append('<li>' + res.content + '</li>');

                    list.remove();
                }
            });
        },

        markUnDone: function () {

            var self = $(this),
                list = self.closest('li'),
                data = {
                    task_id: self.val(),
                    project_id: self.data('project'),
                    list_id: self.data('list'),
                    action: 'cpm_task_open',
                    '_wpnonce': CPM_Vars.nonce
                };


            $.post(CPM_Vars.ajaxurl, data, function (res) {
                res = JSON.parse(res);

                if(res.success === true ) {
                    var currentList = list.parent().siblings('.cpm-todos');

                    currentList.append('<li>' + res.content + '</li>');
                    list.remove();
                }
            });
        },

        submitNewTodo: function (e) {
            e.preventDefault();

            var self = $(this),
                data = self.serialize(),
                content = $.trim(self.find('.todo_content').val());

            if(content !== '') {
                $.post(CPM_Vars.ajaxurl, data, function (res) {
                    res = JSON.parse(res);

                    if(res.success === true) {
                        var currentList = self.closest('ul.cpm-todos-new').siblings('.cpm-todos');
                        currentList.append( '<li>' + res.content + '</li>' );

                        //clear the form
                        self.find('textarea, input[type=text], select').val('');
                    } else {
                        alert('something went wrong!');
                    }
                });
            } else {
                alert('type something');
            }
        },

        deleteTodo: function (e) {
            e.preventDefault();

            var self = $(this),
                list = self.closest('li'),
                confirmMsg = self.data('confirm'),
                data = {
                    task_id: self.data('task_id'),
                    action: 'cpm_task_delete',
                    '_wpnonce': CPM_Vars.nonce
                };

            if( confirm(confirmMsg) ) {
                $.post(CPM_Vars.ajaxurl, data, function (res) {
                    res = JSON.parse(res);

                    if(res.success) {
                        list.remove();
                    }
                });
            }
        },

        toggleEditTodo: function (e) {
            e.preventDefault();

            var wrap = $(this).closest('.cpm-todo-wrap');

            wrap.find('.cpm-todo-content').toggle();
            wrap.find('.cpm-task-edit-form').slideToggle();
        },

        updateTodo: function (e) {
            e.preventDefault();

            var self = $(this),
                data = self.serialize(),
                list = self.closest('li'),
                singleWrap = self.closest('.cpm-single-task'),
                content = $.trim(self.find('.todo_content').val());

            if(content !== '') {
                $.post(CPM_Vars.ajaxurl, data, function (res) {
                    res = JSON.parse(res);

                    if(res.success === true) {
                        if(list.length) {
                            list.html(res.content); //update in task list
                        } else if(singleWrap.length) {
                            singleWrap.html(res.content); //update in single task
                        }

                    } else {
                        alert('something went wrong!');
                    }
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

        addList: function (e) {
            e.preventDefault();

            var self = $(this),
                data = self.serialize();

            $.post(CPM_Vars.ajaxurl, data, function (res) {
                res = JSON.parse(res);

                if(res.success === true) {
                    $('ul.cpm-todolists').append('<li id="cpm-list-' + res.id + '">' + res.content + '</li>');

                    $('body, html').animate({
                        scrollTop: $('#cpm-list-' + res.id).offset().top
                    });

                    self.find('textarea, input[type=text], select').val('');
                    $('.datepicker').datepicker();
                }
            });
        },

        updateList: function (e) {
            e.preventDefault();

            var self = $(this),
                data = self.serialize();

            $.post(CPM_Vars.ajaxurl, data, function (res) {
                res = JSON.parse(res);

                if(res.success === true) {
                    self.closest('li').html(res.content);
                    $('.datepicker').datepicker();
                }
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

            if( confirm(confirmMsg) ) {
                $.post(CPM_Vars.ajaxurl, data, function (res) {
                    res = JSON.parse(res);

                    if(res.success) {
                        list.fadeOut(function() {
                            $(this).remove();
                        });
                    }
                });
            }
        }
    };

    $(function() {
        CPM_Task.init();
    });

})(jQuery);