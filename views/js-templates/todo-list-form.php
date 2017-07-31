
<div :class="todolistFormClass(list)+' cpm-new-todolist-form'" style="display: none;">

    <form v-on:submit.prevent="newTodoList()" action="" method="post">
        <div class="item title">
            <input type="text" required="required" name="tasklist_name" v-model="list.post_title" placeholder="<?php _e( 'Task list name', 'cpm' ); ?>">
        </div>

        <div class="item content">
            <textarea name="tasklist_detail" id="" v-model="list.post_content" cols="40" rows="2" placeholder="<?php _e( 'Task list details', 'cpm' ); ?>"></textarea>
        </div>

        <div class="item milestone">
            <select v-model="tasklist_milestone">
                <option value="-1">
                    <?php _e( '- Milestone -', 'cpm' ); ?>
                </option>
                <option v-for="milestone in milestones" :value="milestone.ID">
                    {{ milestone.post_title }}
                </option>
            </select>
        </div>

        <?php do_action( 'cpm_tasklist_form' ); ?>
        
        <div class="item submit">
            <span class="cpm-new-list-spinner"></span>
            <input type="submit" class="button-primary" :disabled="submit_disabled" name="submit_todo" :value="submit_btn_text">
            <a @click.prevent="showHideTodoListForm( list, index )" class="button list-cancel" href="#"><?php _e( 'Cancel', 'cpm' ); ?></a>
            <span v-show="show_spinner" class="cpm-spinner"></span>
        </div>
    </form>
</div>
