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

            <div v-if="is_visible_list_btn"><new-todo-list-button></new-todo-list-button></div>

            <!-- New Todo list form -->
            <div class="cpm-new-todolist-form" v-if="show_list_form">
                <todo-list-form :list="list" :index="index"></todo-list-form>
            </div>
            
            <!-- Show Task list and his child -->
            <todo-lists></todo-lists>
        </div>
    </div>
</div>