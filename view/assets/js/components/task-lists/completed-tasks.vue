<template>
	<div class="cpm-completed-tasks">
        <h3 class="cpm-task-list-title cpm-tag-gray"><a>Completed Tasks</a></h3>
        <ul  class="cpm-completed-task-list cpm-todos cpm-todolist-content cpm-todo-completed">

          <!--   <li v-if="loading_completed_tasks" class="nonsortable">
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
            </li> -->

            <li :data-id="task.ID" :data-order="task.menu_order" class="cpm-todo" v-for="(task, task_index) in getCompletedTask" :key="task.ID" :class="'cpm-todo cpm-fade-out-'+task.ID">
                
                <div class="cpm-todo-wrap clearfix">
                    <div class="cpm-todo-content" >
                        <div>
                            <div class="cpm-col-6">
                                <!-- <span class="cpm-spinner"></span> -->
                                <input v-model="task.status" @click="taskDoneUndone( task, task.status )" class="" type="checkbox"  value="" name="" >

                                <span class="task-title">
                                    
                                    	<router-link 
                                    	:to="{ 
	                                    	name: 'single_task', 
	                                    	params: { 
		                                    	list_id: list.id, 
		                                    	task_id: task.id, 
		                                    	project_id: 1, 
		                                    	task: task 
		                                }}">

                                    	<span class="cpm-todo-text">{{ task.title }}</span>
                                	</router-link>
                              
                                 <span :class="privateClass( task )"></span>
                                </span> 
                              

                                <span class='cpm-assigned-user' 
                                    v-for="user in getUsers( task.assigned_to )" 
                                    v-html="user.user_url" :key="user.ID">

                                </span>

                                <span :class="completedTaskWrap( task.start_at, task.due_date )">
                                    <span v-if="task_start_field">{{ ( task.start_at.date ) }}</span>
                                    <span v-if="isBetweenDate( task_start_field, task.start_at.date, task.due_date.date )">&ndash;</span>
                                    <span>{{ ( task.due_date.date ) }}</span>
                                </span>
                            </div>

                            <div class="cpm-col-5">
                                
                                <span class="cpm-comment-count">
                                    <a href="#">
                                        {{ task.comment_count }}
                                    </a>
                                </span>
                            </div>


                            <div class="cpm-col-1 cpm-todo-action-right cpm-last-col">
                                <a href="#" @click.prevent="deleteTask( task.post_parent, task.ID )" class="cpm-todo-delete"><span class="dashicons dashicons-trash"></span></a>
                            </div>
                            <div class="clearfix"></div>
                        </div>
                    </div>
                    <div class="cpm-todo-form" v-if="task.edit_mode">
                        <new-task-form :task="task" :list="list"></new-task-form>
                    </div>

                </div>
            </li>

            <li v-if="!getCompletedTask" class="nonsortable">No completed tasks.</li>

            <li v-if="complete_show_load_more_btn" class="nonsortable">
                <a @click.prevent="loadMoreCompleteTasks(list)" href="#">More Tasks</a>
                <span v-show="more_completed_task_spinner" class="cpm-completed-task-spinner cpm-spinner"></span>
            </li>
        </ul>
	</div>
</template>