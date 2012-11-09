<?php
$cpm_active_menu = __( 'Task List', 'cpm' );

require_once CPM_PLUGIN_PATH . '/class/task.php';
require_once CPM_PLUGIN_PATH . '/admin/views/project/header.php';
?>

<h3 class="cpm-nav-title">
    <?php _e( 'Task Lists', 'cpm' ) ?> <a id="cpm-add-task" href="<?php echo cpm_url_new_tasklist( $project_id ) ?>" class="add-new-h2"><?php _e( 'Add New Task List', 'cpm' ) ?></a>
</h2>

<?php
$task_obj = CPM_Task::getInstance();
$lists = $task_obj->get_task_lists( $project_id );

if ( $lists ) {
    ?>

    <ul class="cpm-todolists">
    <?php foreach ($lists as $list) { ?>

        <li>
            <article class="cpm-todolist">
                <header>
                    <h3><?php echo get_the_title( $list->ID ); ?></h3>

                    <div class="cpm-entry-detail">
                        <?php echo cpm_print_content( $list->post_content ); ?>
                    </div>
                </header>

                <ul class="cpm-todos">
                    <?php
                    $tasks = $task_obj->get_tasks( $list->ID );
                    $tasks = cpm_tasks_filter( $tasks );
                    
                    if ( $tasks['pending'] ) {
                        foreach ($tasks['pending'] as $task) {
                            ?>
                            <li>
                                <?php echo cpm_task_html( $task, $project_id, $list->ID ); ?>
                            </li>
                        <?php
                        }
                    }
                    ?>
                </ul>
                <ul class="cpm-todos-new">
                    <li class="cpm-new-btn">
                        <a href="#" class="cpm-btn add-task">Add a to-do</a>
                    </li>
                    <li class="cpm-todo-form cpm-hide">
                        <?php cpm_task_new_form( $list->ID, $project_id ); ?>
                    </li>
                </ul>
                <ul class="cpm-todo-completed">
                    <?php
                    if ( $tasks['completed'] ) {
                        foreach ($tasks['completed'] as $task) {
                            ?>
                            <li>
                                <?php echo cpm_task_html( $task, $project_id, $list->ID ); ?>
                            </li>
                            <?php
                        }
                    }
                    ?>
                </ul>
            </article>
        </li>
    <?php } ?>
    </ul>
    <?php
} else {
    printf( '<h3>%s</h3>', __( 'No tasklist found', 'cpm' ) );
}
?>

<script type="text/javascript">
    (function($) {

        var CPM_Task = {
            
            init: function () {
                $('ul.cpm-todos-new').on('click', '.cpm-new-btn a.add-task', this.showNewTodoForm);
                $('ul.cpm-todos-new').on('click', 'a.cancel', this.hideNewTodoForm);
                $('ul.cpm-todos-new').on('submit', '.cpm-todo-form form', this.submitNewTodo);


                $('ul.cpm-todos').on('click', '.cpm-todo-wrap input[type=checkbox]', this.markDone);
                $('ul.cpm-todo-completed').on('click', '.cpm-todo-wrap input[type=checkbox]', this.markUnDone);

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

                // console.log(data); return;

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
            }
        };

        $(function() {
            CPM_Task.init();
        });

    })(jQuery);


</script>