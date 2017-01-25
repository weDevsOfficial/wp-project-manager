<div :class="taskFormClass(list)">

    <form v-on:submit.prevent="newTodoList()" action="" method="post">
        <div class="item title">
            <input type="text" required="required" name="tasklist_name" v-model="tasklist_name" placeholder="To-do list name">
        </div>

        <div class="item content">
            <textarea name="tasklist_detail" id="" v-model="tasklist_detail" cols="40" rows="2" placeholder="To-do list detail"></textarea>
        </div>

        <div class="item milestone">
            <select v-model="tasklist_milestone">
                <option value="-1">
                    --Milestone--
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
