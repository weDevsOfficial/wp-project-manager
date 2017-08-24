<div class="cpm-blank-template todolist">
    <div class="cpm-content" >
        <h3 class="cpm-page-title">  <?php _e( 'Task Lists', 'cpm' ) ?> </h3>

        <p>
            <?php _e( 'You can list all your Tasks in a single discussion using a Task list. Use these lists to divide a project into several sectors, assign co-workers and check progress.', 'cpm' ) ?>
        </p>

        <div v-if="create_todolist">
            <!-- <a id="cpm-add-tasklist" href="#" itemref="blank" class="cpm-btn cpm-btn-blue cpm-plus-white cpm-margin-bottom add-tasklist"><?php _e( 'Add New Task List', 'cpm' ) ?></a> -->

            <new-todo-list-button></new-todo-list-button>

            <div class="cpm-new-todolist-form" v-if="show_list_form">
                <!-- New Todo list form -->
                <todo-list-form :list="list" :index="index"></todo-list-form>
            </div>

        </div>

        <div class="cpm-list-content">
            <h3 class="cpm-why-for cpm-page-title"> <?php _e( 'When to use Task Lists?', 'cpm' ) ?> </h3>

            <ul class="cpm-list">
                <li> <?php _e( 'To partition a project internals.', 'cpm' ) ?> </li>
                <li><?php _e( 'To mark milestone points.', 'cpm' ) ?> </li>
                <li> <?php _e( 'To assign people to tasks.', 'cpm' ) ?> </li>
            </ul>

        </div>
    </div>
</div>