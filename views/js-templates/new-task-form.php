<div :class="'cpm-task-edit-form cpm-slide-'+task.ID" style="display: none;">
      <form action="" v-on:submit.prevent="newTask()" method="post" class="cpm-task-form">
      
        <div class="item task-title">
            <input v-model="task.post_title" type="text" name="task_title" class="task_title" placeholder="<?php esc_attr_e( 'Add a new task', 'cpm' ); ?>" value="" required="required">
        </div>

        <div class="item content">
            <textarea v-model="task.post_content" name="task_text" class="todo_content" cols="40" placeholder="<?php esc_attr_e( 'Add extra details about this task (optional)', 'cpm' ) ?>" rows="2"></textarea>
        </div>

        <div class="item date">
            
            <div class="cpm-task-start-field" v-if="task_start_field">
                <label><?php _e( 'Start Date', 'cpm' ); ?></label>
                <cpm-datepickter v-model="task.start_date" class="cpm-datepickter-from" dependency="cpm-datepickter-to"></cpm-datepickter>
                
            </div>
            

            <div class="cpm-task-due-field">
                <label><?php _e( 'Due Date', 'cpm' ); ?></label>
                <cpm-datepickter v-model="task.due_date" class="cpm-datepickter-to" dependency="cpm-datepickter-from"></cpm-datepickter>
            </div>
        </div>

        <div class="item user">
            
            <div>
                <multiselect 
                    v-model="task_assign" 
                    :options="project_users" 
                    :multiple="true" 
                    :close-on-select="false"
                    :clear-on-select="false"
                    :hide-selected="true"
                    :show-labels="false"
                    placeholder="<?php _e( 'Select User', 'cpm' ); ?>"
                    label="name"
                    track-by="id">
                        
                </multiselect>
            </div>
        </div>


        <?php do_action( 'cpm_task_new_form' ); ?>

        <div class="item submit">
            <span class="cpm-new-task-spinner"></span>
            <span v-if="task.edit_mode"><input :disabled="submit_disabled" type="submit" class="button-primary" name="submit_todo" value="<?php _e( 'Update Task', 'cpm' ); ?>"></span>
            <span v-if="!task.edit_mode"><input :disabled="submit_disabled" type="submit" class="button-primary" name="submit_todo" value="<?php _e( 'New Task', 'cpm' ); ?>"></span>
            <a @click.prevent="hideNewTaskForm(list_index, task.ID)" class="button todo-cancel" href="#"><?php _e( 'Cancel', 'cpm' ); ?></a>
            <span v-show="show_spinner" class="cpm-spinner"></span>
        </div>
    </form>
</div>