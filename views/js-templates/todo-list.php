<div>
    <cpm-paginaton :total="total" :limit="limit" :page_number="page_number"></cpm-paginaton>

    <ul class="cpm-todolists">
        
        <li v-for="( list, index ) in lists" :key="list.ID"  :class="'cpm-fade-out-'+list.ID">

            <article class="cpm-todolist">
                <header class="cpm-list-header">
                    <h3>
                        <router-link :to="{ name: 'list_single', params: { list_id: list.ID }}">{{ list.post_title }}</router-link>
                        <span :class="privateClass(list)"></span>
                        <div class="cpm-right" v-if="list.can_del_edit">
                            <a href="#" @click.prevent="showHideTodoListForm( list, index )" class="cpm-icon-edit" title="<?php _e( 'Edit this List', 'cpm' ); ?>"><span class="dashicons dashicons-edit"></span></a>
                            <a href="#" class="cpm-btn cpm-btn-xs" @click.prevent="deleteList( list.ID )" title="<?php _e( 'Delete this List', 'cpm' ); ?>" :data-list_id="list.ID" data-confirm="<?php _e( 'Are you sure to delete this task list?', 'cpm' ); ?>"><span class="dashicons dashicons-trash"></span></a>
                        </div>
                    </h3>

                    <div class="cpm-entry-detail" >
                        {{ list.post_content }}    
                    </div>

                    <!-- <div class="cpm-entry-detail">{{list.post_content}}</div> -->
                    <div class="cpm-update-todolist-form" v-if="list.edit_mode">
                        <!-- New Todo list form -->
                        <todo-list-form :list="list" :index="index"></todo-list-form>
                    </div>
                </header>

                <!-- Todos component -->
                <tasks :list="list" :index="index"></tasks>

                <footer class="cpm-row cpm-list-footer">
                    <div class="cpm-col-6">
                        <div v-if="canUserCreateTask"><new-task-button :task="{}" :list="list" :list_index="index"></new-task-button></div>
                       
                        <div class="cpm-col-3 cpm-todo-complete">
                            <router-link :to="{ name: 'list_single', params: { list_id: list.ID }}">
                                <span>{{ list.count_completed_tasks }}</span>  <!-- countCompletedTasks( list.tasks ) -->
                                <?php _e( 'Completed', 'cpm' ) ?>
                            </router-link>
                        </div>
                        <div  class="cpm-col-3 cpm-todo-incomplete">
                            <router-link :to="{ name: 'list_single', params: { list_id: list.ID }}">
                                <span>{{ list.count_incompleted_tasks }}</span> <!-- countIncompletedTasks( list.tasks ) -->
                                <?php _e( 'Incomplete', 'cpm' ) ?>
                            </router-link>
                        </div>
                        <div  class="cpm-col-3 cpm-todo-comment">
                            <router-link :to="{ name: 'list_single', params: { list_id: list.ID }}">
                                <span>{{ list.comment_count }} <?php _e( 'Comments', 'cpm' ); ?></span>
                            </router-link>
                        </div>
                    </div>

                    <div class="cpm-col-4 cpm-todo-prgress-bar">
                        <div :style="getProgressStyle( list )" class="bar completed"></div>
                    </div>
                    <div class=" cpm-col-1 no-percent">{{ getProgressPercent( list ) }}%</div>
                    <div class="clearfix"></div>
                </footer>
            </article>
        </li>
    </ul>

    <router-view name="single_task"></router-view>
    
    <cpm-paginaton :total="total" :limit="limit" :page_number="page_number"></cpm-paginaton>
    
</div>
