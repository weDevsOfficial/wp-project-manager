<div>
    <!-- Spinner before load task -->
    <div v-if="loading" class="cpm-data-load-before" >
        <div class="loadmoreanimation">
            <div class="load-spinner">
                <div class="rect1"></div>
                <div class="rect2"></div>
                <div class="rect3"></div>
                <div class="rect4"></div>
                <div class="rect5"></div>
            </div>
        </div>
    </div>

    <div v-else>
        <div v-if="!hasTodoLists">
            <todo-list-default-tmpl></todo-list-default-tmpl>
        </div>

        <div v-if="hasTodoLists">

            <div>
                <div v-if="is_visible_list_btn" class="cpm-list-header-new-todo-btn">
                    <new-todo-list-button v-if="active_mode == 'list'"></new-todo-list-button>
                    <?php do_action( 'cpm_before_todo_list_content' ); ?>
                </div>
                <div class="cpm-list-header-menu">
                    <cpm-list-corner-menu></cpm-list-corner-menu>
                    <div class="cpm-clearfix"></div>
                </div>
                <div class="cpm-clearfix"></div>
            </div>

            <!-- New Todo list form -->
            <div>
                <todo-list-form v-if="show_list_form" :list="list" :index="index"></todo-list-form>
                <?php do_action( 'cpm_after_todo_list_form' ); ?>
            </div>
            
            <!-- Show Task list and his child -->
            <div v-if="active_mode == 'list'"><todo-lists></todo-lists></div>

            <?php do_action( 'cpm_after_todo_lists' ); ?>
        </div>
    </div>
</div>