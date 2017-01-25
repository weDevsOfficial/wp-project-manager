<div class="cpm-task-edit-form">
      <form action="" method="post" class="cpm-task-form">

        <div class="item task-title">
            <input type="text" name="task_title" class="task_title" placeholder="<?php esc_attr_e( 'Add a new to-do', 'cpm' ); ?>" value="" required="required">
        </div>

        <div class="item content">
            <textarea name="task_text" class="todo_content" cols="40" placeholder="<?php esc_attr_e( 'Add extra details about this to-do (optional)', 'cpm' ) ?>" rows="2"></textarea>
        </div>

        <div class="item date">
            
                <div class="cpm-task-start-field">
                    <label><?php _e( 'Start date', 'cpm' ); ?></label>
                    <input  type="text" autocomplete="off" class="date_picker_from" placeholder="<?php esc_attr_e( 'Start date', 'cpm' ); ?>" value="" name="task_start" />
                </div>
            

            <div class="cpm-task-due-field">
                <label><?php _e( 'Due date', 'cpm' ); ?></label>
                <input type="text" autocomplete="off" class="date_picker_to" placeholder="<?php esc_attr_e( 'Due date', 'cpm' ); ?>" value="" name="task_due" />
            </div>
        </div>

        <div class="item user">
            assign user
        </div>


        <?php do_action( 'cpm_task_new_form'); ?>

        <div class="item submit">
            <span class="cpm-new-task-spinner"></span>
            <input type="submit" class="button-primary" name="submit_todo" value="New Task">
            <a @click.prevent="hideNewTaskForm(list_index)" class="button todo-cancel" href="#"><?php _e( 'Cancel', 'cpm' ); ?></a>
        </div>
    </form>
</div>