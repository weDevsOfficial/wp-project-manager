<?php
function cpm_task_html( $task, $project_id, $list_id ) {
    ob_start();
    ?>
    <div class="cpm-todo-wrap">
        <input type="checkbox" data-project="<?php echo $project_id; ?>" data-list="<?php echo $list_id; ?>" 
            value="<?php echo $task->ID; ?>" name="" <?php checked( $task->completed, '1' ); ?>>

        <span class="cpm-todo-content">
            <a href="<?php echo cpm_url_single_task( $project_id, $list_id, $task->ID ); ?>">
                <span><?php echo $task->post_content; ?></span>
            </a>
        </span>
    </div>
    <?php

    return ob_get_clean();
}

function cpm_task_new_form( $list_id, $project_id ) {
    ?>
    <form action="" method="post">
        <input type="hidden" name="list_id" value="<?php echo $list_id; ?>">
        <input type="hidden" name="project_id" value="<?php echo $project_id; ?>">
        <input type="hidden" name="action" value="cpm_task_add">

        <div class="item content">
            <textarea name="task_text" class="todo_content" cols="40" placeholder="Add a new to-do" rows="1"></textarea>
        </div>
        <div class="item date">
            <input type="text" autocomplete="off" class="datepicker" name="task_due" />
        </div>
        <div class="item user">
            <?php wp_dropdown_users( array('name' => 'task_assign', 'show_option_none' => __( '-- select --', 'cpm' )) ); ?>
        </div>
        <div class="item submit">
            <input type="submit" name="submit_todo" value="Add this to-do">
            <a class="cancel" href="#">Cancel</a>
        </div>
    </form>
    <?php
}