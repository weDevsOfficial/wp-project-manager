<div v-if="is_single_list" id="cpm-single-todo-list-view">
    <div class="cpm-incomplete-tasks">
        <h3 class="cpm-task-list-title cpm-tag-gray"><a><?php _e( 'Incomplete Tasks',  'cpm'); ?></a></h3>
        <ul v-cpm-sortable class="cpm-incomplete-task-list cpm-todos cpm-todolist-content cpm-incomplete-task">

            <li v-if="loading_incomplete_tasks" class="nonsortable">
                <div class="cpm-data-load-before" >
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
            </li>

            <li class="cpm-todo" :data-id="task.ID" :data-order="task.menu_order" v-for="(task, task_index) in getIncompleteTasks" :key="task.ID" :class="'cpm-fade-out-'+task.ID">

                <div class="cpm-todo-wrap clearfix">
                    <div class="cpm-todo-content" >
                        <div class="cpm-incomplete-todo">
                            <div class="cpm-col-6">
                                <input :disabled="!is_assigned(task)" v-model="task.completed" @click="taskDoneUndone( task, task.completed )" class="" type="checkbox"  value="" name="" >

                                <span>
                                    <router-link :to="{ name: 'list_task_single_under_todo', params: { list_id: list.ID, task_id: task.ID, task: task }}"">{{ task.post_title }}</router-link>
                                </span>
                                
                                <span :class="privateClass( task )"></span>
                                
                                <span class='cpm-assigned-user' 
                                    v-for="user in getUsers( task.assigned_to )" 
                                    v-html="user.user_url" :key="user.ID">

                                </span>

                                <span :class="taskDateWrap( task.start_date, task.due_date)">
                                    <span v-if="task_start_field">{{ dateFormat( task.start_date ) }}</span>
                                    <span v-if="isBetweenDate( task_start_field, task.start_date, task.due_date )">&ndash;</span>
                                    {{ task.due_date }}
                                    <span>{{ dateFormat( task.due_date ) }}</span>
                                </span>
                            </div>

                            <div class="cpm-col-5 cpm-todo-action-center">
                                <div class="cpm-task-comment">
                                        <router-link :to="{ name: 'list_task_single_under_todo', params: { list_id: list.ID, task_id: task.ID, task: task }}"">
                                            <span class="cpm-comment-count">
                                                {{ task.comments.length }}
                                            </span>
                                        </router-link>
                                    <!-- </a> -->
                                </div>

                                <!-- deprecated -->
                                <?php do_action( 'cpm_task_column' ); ?>
                                
                                <?php do_action( 'cpm_after_task_title' ); ?>
                            </div>


                            <div class="cpm-col-1 cpm-todo-action-right cpm-last-col" v-if="task.can_del_edit">
                                <a href="#" @click.prevent="deleteTask( task.post_parent, task.ID )" class="cpm-todo-delete"><span class="dashicons dashicons-trash"></span></a>
                                    
                                <a href="#" @click.prevent="taskEdit( task.ID )" class="cpm-todo-edit"><span class="dashicons dashicons-edit"></span></a>
                            </div>
                            <div class="clearfix"></div>
                        </div>

                        <div class="cpm-col-12">

                            <?php if ( true ) { ?>
                                <div class="cpm-todo-details">
                                    
                                </div>
                            <?php } ?>

                            <?php do_action( 'cpm_task_single_after' ); ?>
                        </div>
                    </div>
                    <div class="cpm-todo-form" v-if="task.edit_mode">
                        <new-task-form :task="task" :task_index="task_index" :list="list" :list_index="index"></new-task-form>
                    </div>
                </div>
            </li>

            <li v-if="!getIncompleteTasks.length" class="nonsortable"><?php _e( 'No tasks found.', 'cpm'); ?></li>
            <li v-if="incomplete_show_load_more_btn" class="nonsortable">
                <a @click.prevent="loadMoreIncompleteTasks(list)" href="#"><?php _e( 'More Tasks', 'cpm' ); ?></a>
                <span v-show="more_incomplete_task_spinner" class="cpm-incomplete-task-spinner cpm-spinner"></span>
            </li>
        </ul>
    </div>

    <div class="cpm-completed-tasks">
        <h3 class="cpm-task-list-title cpm-tag-gray"><a><?php _e( 'Completed Tasks', 'cpm' ); ?></a></h3>
        <ul v-cpm-sortable class="cpm-completed-task-list cpm-todos cpm-todolist-content cpm-todo-completed">

            <li v-if="loading_completed_tasks" class="nonsortable">
                <div class="cpm-data-load-before" >
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
            </li>

            <li :data-id="task.ID" :data-order="task.menu_order" class="cpm-todo" v-for="(task, task_index) in getCompletedTask" :key="task.ID" :class="'cpm-todo cpm-fade-out-'+task.ID">
                
                <div class="cpm-todo-wrap clearfix">
                    <div class="cpm-todo-content" >
                        <div>
                            <div class="cpm-col-6">
                                <!-- <span class="cpm-spinner"></span> -->
                                <input v-model="task.completed" @click="taskDoneUndone( task, task.completed, task_index )" class="" type="checkbox"  value="" name="" >

                                <!-- <span class="task-title">
                                    <span class="cpm-todo-text">{{ task.post_title }}</span>
                                    <span :class="privateClass( task )"></span>
                                </span> -->
                                <span class="task-title">
                                    <span v-if="is_single_list"><router-link exact :to="{ name: 'list_task_single_under_todo', params: { list_id: list.ID, task_id: task.ID, task: task }}""><span class="cpm-todo-text">{{ task.post_title }}</span></router-link></span>
                                    <span v-else><router-link exact :to="{ name: 'task_single_under_todo_lists', params: { list_id: list.ID, task_id: task.ID, task: task }}""><span class="cpm-todo-text">{{ task.post_title }}</span></router-link></span>
                                    <span :class="privateClass( task )"></span>
                                </span>

                                <span class='cpm-assigned-user' 
                                    v-for="user in getUsers( task.assigned_to )" 
                                    v-html="user.user_url" :key="user.ID">

                                </span>

                                <span :class="completedTaskWrap( task.start_date, task.due_date )">
                                    <span v-if="task_start_field">{{ dateFormat( task.start_date ) }}</span>
                                    <span v-if="isBetweenDate( task_start_field, task.start_date, task.due_date )">&ndash;</span>
                                    <span>{{ dateFormat( task.due_date ) }}</span>
                                </span>
                            </div>

                            <div class="cpm-col-5">
                                
                                <span class="cpm-comment-count">
                                    <a href="#">
                                        {{ task.comment_count }}
                                    </a>
                                </span>

                                <?php do_action( 'cpm_task_column' ); ?>
                            </div>


                            <div class="cpm-col-1 cpm-todo-action-right cpm-last-col">
                                <a href="#" @click.prevent="deleteTask( task.post_parent, task.ID )" class="cpm-todo-delete"><span class="dashicons dashicons-trash"></span></a>
                            </div>
                            <div class="clearfix"></div>
                        </div>

                        <div class="cpm-col-12">
                            <div class="cpm-todo-details">
                                
                            </div>
                            <?php do_action( 'cpm_task_single_after' ); ?>
                        </div>
                    </div>
                    <div class="cpm-todo-form" v-if="task.edit_mode">
                        <new-task-form :task="task" :task_index="task_index" :list="list" :list_index="index"></new-task-form>
                    </div>

                </div>
            </li>

            <li v-if="!getCompletedTask.length" class="nonsortable"><?php _e( 'No completed tasks.', 'cpm'); ?></li>

            <li v-if="complete_show_load_more_btn" class="nonsortable">
                <a @click.prevent="loadMoreCompleteTasks(list)" href="#"><?php _e( 'More Tasks', 'cpm' ); ?></a>
                <span v-show="more_completed_task_spinner" class="cpm-completed-task-spinner cpm-spinner"></span>
            </li>
        </ul>
    </div>

    <div v-if="list.show_task_form" class="cpm-todo-form">
        <new-task-form :task="{}" :task_index="task_index" :list="list" :list_index="index"></new-task-form>
    </div>

</div>

<!-- original code without v-else -->
<div v-else>
    
    <div class="cpm-incomplete-tasks">
        <ul v-cpm-sortable class="cpm-todos cpm-todolist-content cpm-incomplete-task">

            <li v-if="loading_incomplete_tasks" class="nonsortable">
                <div class="cpm-data-load-before" >
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
            </li>

            <li :data-id="task.ID" :data-order="task.menu_order" class="cpm-todo" v-for="(task, task_index) in getIncompleteTasks" :key="task.ID" :class="'cpm-fade-out-'+task.ID">
                <div class="cpm-todo-wrap clearfix">
                    <div class="cpm-todo-content" >
                        <div>
                            <div class="cpm-col-7">
                                <!-- <span class="cpm-spinner"></span> -->
                               <input :disabled="!is_assigned(task)" v-model="task.completed" @click="taskDoneUndone( task, task.completed )" class="" type="checkbox"  value="" name="" >

                                <!-- <a class="task-title" href="#">
                                    <span @click.prevent="singleTask( task )" class="cpm-todo-text">{{ task.post_title }} </span>
                                    <span :class="privateClass( task )"></span>
                                </a> -->

                                <span v-if="is_single_list">
                                    <router-link :to="{ name: 'list_task_single_under_todo', params: { list_id: list.ID, task_id: task.ID, task: task }}"">{{ task.post_title }}</router-link>
                                </span>
                                <span v-else>
                                    <router-link exact :to="{ name: 'task_single_under_todo_lists', params: { list_id: list.ID, task_id: task.ID, task: task }}"">{{ task.post_title }}</router-link>
                                </span>

                                <span :class="privateClass( task )"></span>
                                
                                <span class='cpm-assigned-user' 
                                    v-for="user in getUsers( task.assigned_to )" 
                                    v-html="user.user_url" :key="user.ID">

                                </span>

                                <span :class="taskDateWrap( task.start_date, task.due_date)">
                                    <span v-if="task_start_field">{{ dateFormat( task.start_date ) }}</span>
                                    <span v-if="isBetweenDate( task_start_field, task.start_date, task.due_date )">&ndash;</span>
                                    <span>{{ dateFormat( task.due_date ) }}</span>
                                </span>
                            </div>

                            <div class="cpm-col-4 cpm-todo-action-center">
                                <div class="cpm-task-comment">
                                    <span v-if="is_single_list">
                                        <router-link :to="{ name: 'list_task_single_under_todo', params: { list_id: list.ID, task_id: task.ID, task: task }}"">
                                            <span class="cpm-comment-count">
                                                {{ task.comments.length }}
                                            </span>
                                        </router-link>
                                    </span>
                                    <span v-else>
                                        <router-link exact :to="{ name: 'task_single_under_todo_lists', params: { list_id: list.ID, task_id: task.ID, task: task }}"">
                                            <span class="cpm-comment-count">
                                                {{ task.comments.length }}
                                            </span>
                                        </router-link>
                                    </span>
                                </div>

                                <!-- deprecated -->
                                <?php do_action( 'cpm_task_column' ); ?>
                                
                                <?php do_action( 'cpm_after_task_title' ); ?>
                            </div>


                            <div class="cpm-col-1 cpm-todo-action-right cpm-last-col" v-if="task.can_del_edit">
                                
                                    <!-- <a class="move"><span class="dashicons dashicons-menu"></span></a> -->
                                    <a href="#" @click.prevent="deleteTask( task.post_parent, task.ID )" class="cpm-todo-delete"><span class="dashicons dashicons-trash"></span></a>
                                    
                                    <a href="#" @click.prevent="taskEdit( task.ID )" class="cpm-todo-edit"><span class="dashicons dashicons-edit"></span></a>

                            </div>
                            <div class="clearfix"></div>
                        </div>

                        <div class="cpm-col-12">

                            <?php if ( true ) { ?>
                                <div class="cpm-todo-details">
                                    
                                </div>
                            <?php } ?>

                            <?php do_action( 'cpm_task_single_after' ); ?>
                        </div>
                    </div>
                    <div class="cpm-todo-form" v-if="task.edit_mode">
                        <new-task-form :task="task" :task_index="task_index" :list="list" :list_index="index"></new-task-form>
                    </div>
                </div>
            </li>

            <li v-if="!getIncompleteTasks.length" class="nonsortable"><?php _e( 'No tasks found.', 'cpm'); ?></li>

            <li v-if="list.show_task_form" class="cpm-todo-form nonsortable">
                <new-task-form :task="{}" :task_index="task_index" :list="list" :list_index="index"></new-task-form>
            </li>
            <li v-if="incomplete_show_load_more_btn" class="nonsortable">
                <a @click.prevent="loadMoreIncompleteTasks(list)" href="#"><?php _e( 'More Tasks', 'cpm' ); ?></a>
                <span v-show="more_incomplete_task_spinner"  class="cpm-incomplete-task-spinner cpm-spinner"></span>
            </li>
        </ul> 
    </div>

    <div class="cpm-completed-tasks">
        <ul v-cpm-sortable v-if="is_single_list"  v-cpm-sortable class="cpm-todos cpm-todolist-content cpm-todo-completed">
            <li :data-id="task.ID" :data-order="task.menu_order" v-for="(task, task_index) in getCompletedTask" :key="task.ID" :class="'cpm-todo cpm-fade-out-'+task.ID">
                
                <div class="cpm-todo-wrap clearfix">
                    <div class="cpm-todo-content" >
                        <div>
                            <div class="cpm-col-7">
                                <!-- <span class="cpm-spinner"></span> -->
                                <input v-model="task.completed" @click="taskDoneUndone( task, task.completed, task_index )" class="" type="checkbox"  value="" name="" >

                                <!-- <span class="task-title">
                                    <span class="cpm-todo-text">{{ task.post_title }}</span>
                                    <span :class="privateClass( task )"></span>
                                </span> -->
                                <span class="task-title">
                                    <span v-if="is_single_list"><router-link exact :to="{ name: 'list_task_single_under_todo', params: { list_id: list.ID, task_id: task.ID, task: task }}""><span class="cpm-todo-text">{{ task.post_title }}</span></router-link></span>
                                    <span v-else><router-link exact :to="{ name: 'task_single_under_todo_lists', params: { list_id: list.ID, task_id: task.ID, task: task }}""><span class="cpm-todo-text">{{ task.post_title }}</span></router-link></span>
                                    <span :class="privateClass( task )"></span>
                                </span>

                                <span class='cpm-assigned-user' 
                                    v-for="user in getUsers( task.assigned_to )" 
                                    v-html="user.user_url" :key="user.ID">

                                </span>

                                <span :class="completedTaskWrap( task.start_date, task.due_date )">
                                    <span v-if="task_start_field">{{ dateFormat( task.start_date ) }}</span>
                                    <span v-if="isBetweenDate( task_start_field, task.start_date, task.due_date )">&ndash;</span>
                                    <span>{{ dateFormat( task.due_date ) }}</span>
                                </span>
                            </div>

                            <div class="cpm-col-4">
                                
                                <span class="cpm-comment-count">
                                    <a href="#">
                                        {{ task.comment_count }}
                                    </a>
                                </span>

                                <?php do_action( 'cpm_task_column' ); ?>
                            </div>


                            <div class="cpm-col-1 cpm-todo-action-right cpm-last-col">
                                <a href="#" @click.prevent="deleteTask( task.post_parent, task.ID )" class="cpm-todo-delete"><span class="dashicons dashicons-trash"></span></a>
                            </div>
                            <div class="clearfix"></div>
                        </div>

                        <div class="cpm-col-12">
                            <div class="cpm-todo-details">
                                
                            </div>
                            <?php do_action( 'cpm_task_single_after' ); ?>
                        </div>
                    </div>
                    <div class="cpm-todo-form" v-if="task.edit_mode">
                        <new-task-form :task="task" :task_index="task_index" :list="list" :list_index="index"></new-task-form>
                    </div>

                </div>
            </li>
            <li v-if="!getCompletedTask.length" class="nonsortable"><?php _e( 'No completed tasks.', 'cpm'); ?></li>
            <li v-if="complete_show_load_more_btn" class="nonsortable">
                <a @click.prevent="loadMoreCompleteTasks(list)" href="#"><?php _e( 'More Tasks', 'cpm' ); ?></a>
                <span v-show="more_completed_task_spinner" class="cpm-completed-task-spinner cpm-spinner"></span>
            </li>
        </ul>
    </div>
</div>



