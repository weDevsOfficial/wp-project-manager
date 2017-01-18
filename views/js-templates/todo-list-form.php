<div class="cpm-todo-list-form-wrap">
    <form v-on:submit.prevent="newTodoList()" action="" method="post">
        <div class="item title">
            <input type="text" required="required" name="tasklist_name" v-model="tasklist_name" placeholder="To-do list name">
        </div>

        <div class="item content">
            <textarea name="tasklist_detail" id="" v-model="tasklist_detail" cols="40" rows="2" placeholder="To-do list detail"></textarea>
        </div>

        <div class="item milestone">
            <milestone-dropdown :selected_milestone="selected_milestone" :milestones="milestones"></milestone-dropdown> 
        </div>

        <?php do_action( 'cpm_tasklist_form' ); ?>

        <div class="item submit">
            <span class="cpm-new-list-spinner"></span>
            <input type="submit" class="button-primary" name="submit_todo" :value="submit_btn_text">
            <a @click.prevent="hideTodoListForm()" class="button list-cancel" href="#"><?php _e( 'Cancel', 'cpm' ); ?></a>
        </div>
    </form>
</div>



