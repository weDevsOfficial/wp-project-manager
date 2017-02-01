<ul class="cpm-todolists">
    <li v-for="( list, index ) in lists">
        <article class="cpm-todolist" >
            <header class="cpm-list-header">
                <h3>
                    <router-link :to="{ name: 'list_single', params: { list_id: list.ID }}">{{ list.post_title }}</router-link>
                    
                    <div class="cpm-right">
                        <a href="#" @click.prevent="showHideTodoListForm( list, index )" class="cpm-icon-edit" title="Edit this List"><span class="dashicons dashicons-edit"></span></a>
                        <a href="#" class="cpm-btn cpm-btn-xs" title="Delete this List" :data-list_id="list.ID" data-confirm="Are you sure to delete this to-do list?"><span class="dashicons dashicons-trash"></span></a>
                    </div>
                </h3>

                <div class="cpm-entry-detail" >
                    {{ list.post_content }}    
                </div>

                <!-- <div class="cpm-entry-detail">{{list.post_content}}</div> -->
                <div class="cpm-update-todolist-form" v-if="list.edit_mode">
                    <!-- New Todo list form -->
                    <todo-list-form :list="list" :index="index" :key="list.ID"></todo-list-form>
                </div>
            </header>

            <!-- Todos component -->
            <tasks :list="list" :index="index" :key="list.ID"></tasks>

            <footer class="cpm-row cpm-list-footer">
                <div class="cpm-col-6">
                    
                        <new-task-button :task="{}" :list="list" :list_index="index"></new-task-button>
                    
                    <div class="cpm-col-3 cpm-todo-complete">
                        <a href="#">
                            <span>{{ countCompletedTasks( list.tasks ) }}</span>
                            <?php _e( 'Completed', 'cpm' ) ?>
                        </a>
                    </div>
                    <div class="cpm-col-3 cpm-todo-incomplete">
                        <a href="#">
                            <span>{{ countIncompletedTasks( list.tasks ) }}</span>
                            <?php _e( 'Incomplete', 'cpm' ) ?>
                        </a>
                    </div>
                    <div class="cpm-col-3 cpm-todo-comment">
                        <a href="#">
                            <span>{{ list.comment_count }} <?php _e( 'Comment', 'cpm' ); ?></span>
                        </a>
                    </div>
                </div>

                <div class="cpm-col-4 cpm-todo-prgress-bar">
                    <div :style="getProgressStyle( list.tasks )" class="bar completed"></div>
                </div>
                <div class=" cpm-col-1 no-percent">{{ getProgressPersent( list.tasks ) }}%</div>
                <div class="clearfix"></div>
            </footer>
        </article>
    </li>
</ul>
