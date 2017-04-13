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

            <div v-if="is_visible_list_btn">
                <div class="cpm-list-header-new-todo-btn">
                    <new-todo-list-button></new-todo-list-button>
                </div>

                <div class="cpm-list-header-menu">
                    <ul class="cpm-lists-view">
                        <li class="cpm-lists-view-li"><a title="To-do List" class="background-position to-do-list" href=""></a></li>
                        <?php do_action( 'cpm_corner_menu' ); ?>
                    </ul>
                    <div class="cpm-clearfix"></div>
                </div>
                <div class="cpm-clearfix"></div>
            </div>

            <!-- New Todo list form -->
            <div class="cpm-new-todolist-form" v-if="show_list_form">
                <todo-list-form :list="list" :index="index"></todo-list-form>
            </div>
            
            <!-- Show Task list and his child -->
            <todo-lists></todo-lists>
        </div>
    </div>
</div>