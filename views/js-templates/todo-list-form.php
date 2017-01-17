<div>
<form action="" method="post">
    <input type="hidden" name="project_id" value="">
    <input type="hidden" name="action" value="">
    <input type="hidden" id="_wpnonce" name="_wpnonce" value="">


    <input type="hidden" name="list_id" value="">


    <div class="item title">
        <input type="text" name="tasklist_name" value="" placeholder="To-do list name">
    </div>

    <div class="item content">
        <textarea name="tasklist_detail" id="" cols="40" rows="2" placeholder="To-do list detail"></textarea>
    </div>

    <div class="item milestone">
        <milestone-dropdown :selected_milestone="selected_milestone" :milestones="milestones"></milestone-dropdown> 
    </div>

    <?php do_action( 'cpm_tasklist_form' ); ?>

    <div class="item submit">
        <span class="cpm-new-list-spinner"></span>
        <input type="submit" class="button-primary" name="submit_todo" :value="submit_btn_text">
        <a class="button list-cancel" href="#"><?php _e( 'Cancel', 'cpm' ); ?></a>
    </div>
</form>
</div>



