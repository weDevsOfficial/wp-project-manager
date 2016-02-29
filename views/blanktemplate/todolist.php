<div class="cpm-blank-template todolist" style="display: none">
    <div class="cpm-content" >
        <h2>  <?php _e('To-Do Lists', 'cpm') ?> </h2>

        <p>
            <?php _e('You can list all your Tasks in a single thread using a To-Do list. Use these lists to divide a project into several sectors, assign co-workers and check progress.', 'cpm') ?>
        </p>

        <p>
            <img src="<?php echo plugins_url('../assets/images/blank_todolist.svg', dirname(__FILE__)) ?> " />
        </p>

        <h2> <?php _e('When to use To-Do lists?', 'cpm') ?> </h2>

        <ul class="cpm-list">
            <li> <?php _e('To partition a project internals.', 'cpm') ?> </li>
            <li><?php _e('To mark milestone points.', 'cpm') ?> </li>
            <li> <?php _e('To assign people to tasks.', 'cpm') ?> </li>
        </ul>
        <?php
    if ( cpm_user_can_access( $project_id, 'create_todolist' ) ) {
    ?>
        <a id="cpm-add-tasklist" href="#" itemref="blank" class="cpm-btn cpm-btn-blue cpm-plus-white cpm-margin-bottom add-tasklist"><?php _e( 'Add New To-do List', 'cpm' ) ?></a>

    <div class="cpm-new-todolist-form">
    <?php  echo cpm_tasklist_form( $project_id ); ?>
</div>

<?php } ?>



    </div>


</div>