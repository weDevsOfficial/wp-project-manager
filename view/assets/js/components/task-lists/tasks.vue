<template>
	<div>
	<div v-if="is_single_list" id="cpm-single-todo-list-view">
	    <div class="cpm-incomplete-tasks">
	        <h3 class="cpm-task-list-title cpm-tag-gray"><a>Incomplete Tasks</a></h3>
	        <ul  class="cpm-incomplete-task-list cpm-todos cpm-todolist-content cpm-incomplete-task">

	           <!--  <li v-if="loading_incomplete_tasks" class="nonsortable">
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

	            <li class="cpm-todo" :data-id="task.ID" :data-order="task.menu_order" v-for="(task, task_index) in getIncompleteTasks" :key="task.ID" :class="'cpm-fade-out-'+task.ID">

	                <div class="cpm-todo-wrap clearfix">
	                    <div class="cpm-todo-content" >
	                        <div class="cpm-incomplete-todo">
	                            <div class="cpm-col-6">
	                                <input :disabled="!is_assigned(task)" v-model="task.completed" @click="taskDoneUndone( task, task.completed )" class="" type="checkbox"  value="" name="" >

	                                <span>
	                                	<router-link 
	                                    	:to="{ 
		                                    	name: 'single_task', 
		                                    	params: { 
			                                    	list_id: list.ID, 
			                                    	task_id: task.ID, 
			                                    	project_id: 1, 
			                                    	task: task 
			                                }}">

	                                    	{{ task.title }}
	                                	</router-link>
	                                    <!-- <router-link :to="{ name: 'list_task_single_under_todo', params: { list_id: list.ID, task_id: task.ID, task: task }}">{{ task.post_title }}</router-link> -->
	                                </span>
	                                
	                                <span :class="privateClass( task )"></span>
	                                
	                                <span class='cpm-assigned-user' 
	                                    v-for="user in getUsers( task.assigned_to )" 
	                                    v-html="user.user_url" :key="user.ID">

	                                </span>

	                                <span :class="taskDateWrap( task.start_at, task.due_date)">
	                                    <span v-if="task_start_field">{{ dateFormat( task.start_at ) }}</span>
	                                    <span v-if="isBetweenDate( task_start_field, task.start_at, task.due_date )">&ndash;</span>
	                                    <span>{{ dateFormat( task.due_date ) }}</span>
	                                </span>
	                            </div>

	                            <div class="cpm-col-5 cpm-todo-action-center">
	                                <div class="cpm-task-comment">
	                                        <router-link :to="{ name: 'list_task_single_under_todo', params: { list_id: list.ID, task_id: task.ID, task: task }}">
	                                            <span class="cpm-comment-count">
	                                                <!-- {{ task.comments.length }} -->
	                                            </span>
	                                        </router-link>
	                                    <!-- </a> -->
	                                </div>

	                            </div>

	                            <!-- v-if="task.can_del_edit" -->
	                            <div class="cpm-col-1 cpm-todo-action-right cpm-last-col">
	                                <a href="#" @click.prevent="deleteTask(task)" class="cpm-todo-delete"><span class="dashicons dashicons-trash"></span></a>
	                                    
	                                <a href="#" @click.prevent="showHideTaskFrom(list, task)" class="cpm-todo-edit"><span class="dashicons dashicons-edit"></span></a>
	                            </div>
	                            <div class="clearfix"></div>
	                        </div>
	                    </div>
	                    <div class="cpm-todo-form" v-if="task.edit_mode">
	                        <new-task-form :task="task" :task_index="task_index" :list="list" :list_index="index"></new-task-form>
	                    </div>
	                </div>
	            </li>

	            <li v-if="!getIncompleteTasks" class="nonsortable">No tasks found.</li>
	            <li v-if="incomplete_show_load_more_btn" class="nonsortable">
	                <a @click.prevent="loadMoreIncompleteTasks(list)" href="#">More Tasks</a>
	                <span v-show="more_incomplete_task_spinner" class="cpm-incomplete-task-spinner cpm-spinner"></span>
	            </li>
	        </ul>
	    </div>

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
	                                <input v-model="task.completed" @click="taskDoneUndone( task, task.completed, task_index )" class="" type="checkbox"  value="" name="" >

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
	                                <span class="task-title">
	                                    <span v-if="is_single_list"><router-link exact :to="{ name: 'list_task_single_under_todo', params: { list_id: list.ID, task_id: task.ID, task: task }}""><span class="cpm-todo-text">{{ task.post_title }}</span></router-link></span>
	                                    <span v-else><router-link exact :to="{ name: 'task_single_under_todo_lists', params: { list_id: list.ID, task_id: task.ID, task: task }}""><span class="cpm-todo-text">{{ task.post_title }}</span></router-link></span>
	                                    <span :class="privateClass( task )"></span>
	                                </span>

	                                <span class='cpm-assigned-user' 
	                                    v-for="user in getUsers( task.assigned_to )" 
	                                    v-html="user.user_url" :key="user.ID">

	                                </span>

	                                <span :class="completedTaskWrap( task.start_at, task.due_date )">
	                                    <span v-if="task_start_field">{{ dateFormat( task.start_at ) }}</span>
	                                    <span v-if="isBetweenDate( task_start_field, task.start_at, task.due_date )">&ndash;</span>
	                                    <span>{{ dateFormat( task.due_date ) }}</span>
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
	                        <new-task-form :task="task" :task_index="task_index" :list="list" :list_index="index"></new-task-form>
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

	    <div v-if="list.show_task_form" class="cpm-todo-form">
	        <new-task-form :task="{}" :task_index="task_index" :list="list" :list_index="index"></new-task-form>
	    </div>

	</div>

	<!-- original code without v-else -->
	<div v-else>
	    
	    <div class="cpm-incomplete-tasks">
	        <ul  class="cpm-todos cpm-todolist-content cpm-incomplete-task">

	         <!--    <li v-if="loading_incomplete_tasks" class="nonsortable">
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
	                                    <router-link 
	                                    	:to="{ 
		                                    	name: 'lists_single_task', 
		                                    	params: { 
			                                    	list_id: list.ID, 
			                                    	task_id: task.ID, 
			                                    	project_id: 1, 
			                                    	task: task 
			                                }}">

	                                    	{{ task.title }}
	                                	</router-link>
	                                
	                                </span>
	                                <span v-else>
	                                    <router-link exact 
	                                    	:to="{ 
		                                    	name: 'lists_single_task', 
		                                    	params: { 
		                                    		list_id: list.ID, 
		                                    		task_id: task.ID, 
		                                    		project_id: 1,
		                                    		task: task 
		                                    }}">

	                                    	{{ task.title }}
	                                    </router-link>
	                                </span>

	                                <span :class="privateClass( task )"></span>
	                                
	                                <span class='cpm-assigned-user' 
	                                    v-for="user in getUsers( task.assigned_to )" 
	                                    v-html="user.user_url" :key="user.ID">

	                                </span>
	                                
	                                <span :class="taskDateWrap( task.start_at, task.due_date)">
	                                    <span v-if="task_start_field">{{ dateFormat( task.start_at ) }}</span>
	                                    <span v-if="isBetweenDate( task_start_field, task.start_at, task.due_date )">&ndash;</span>
	                                    <span>{{ dateFormat( task.due_date ) }}</span>
	                                </span>
	                            </div>

	                            <div class="cpm-col-4 cpm-todo-action-center">
	                                <div class="cpm-task-comment">
	                                    <span v-if="is_single_list">
	                                        <router-link :to="{ name: 'list_task_single_under_todo', params: { list_id: list.ID, task_id: task.ID, task: task }}">
	                                            <span class="cpm-comment-count">
	                                                <!-- {{ task.comments.length }} -->
	                                            </span>
	                                        </router-link>
	                                    </span>
	                                    <span v-else>
	                                        <router-link exact :to="{ name: 'task_single_under_todo_lists', params: { list_id: list.ID, task_id: task.ID, task: task }}">
	                                            <span class="cpm-comment-count">
	                                                <!-- {{ task.comments.length }} -->
	                                            </span>
	                                        </router-link>
	                                    </span>
	                                </div>

	                            </div>

	                            <!-- v-if="task.can_del_edit" -->
	                            <div class="cpm-col-1 cpm-todo-action-right cpm-last-col">
	                                
	                                    <!-- <a class="move"><span class="dashicons dashicons-menu"></span></a> -->
	                                    <a href="#" @click.prevent="showHideTaskFrom(list, list, task)" class="cpm-todo-edit"><span class="dashicons dashicons-edit"></span></a>
	                                    <a href="#" @click.prevent="deleteTask(task)" class="cpm-todo-delete"><span class="dashicons dashicons-trash"></span></a>
	                                    

	                            </div>
	                            <div class="clearfix"></div>
	                        </div>
	                    </div>

	                    <div class="cpm-todo-form" v-if="task.edit_mode">
	                        <new-task-form :task="task" :task_index="task_index" :list="list" :list_index="index"></new-task-form>
	                    </div>
	                </div>
	            </li>

	            <li v-if="!getIncompleteTasks.length" class="nonsortable">No tasks found.</li>

	            <li v-if="list.show_task_form" class="cpm-todo-form nonsortable">
	                <new-task-form :task="{}" :task_index="task_index" :list="list" :list_index="index"></new-task-form>
	            </li>
	            <li v-if="incomplete_show_load_more_btn" class="nonsortable">
	                <a @click.prevent="loadMoreIncompleteTasks(list)" href="#">More Tasks</a>
	                <span v-show="more_incomplete_task_spinner"  class="cpm-incomplete-task-spinner cpm-spinner"></span>
	            </li>
	        </ul> 
	    </div>

	    <div class="cpm-completed-tasks">
	        <ul  v-if="is_single_list"   class="cpm-todos cpm-todolist-content cpm-todo-completed">
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
	                                    <span v-if="is_single_list"><router-link exact :to="{ name: 'list_task_single_under_todo', params: { list_id: list.ID, task_id: task.ID, task: task }}"><span class="cpm-todo-text">{{ task.post_title }}</span></router-link></span>
	                                    <span v-else><router-link exact :to="{ name: 'task_single_under_todo_lists', params: { list_id: list.ID, task_id: task.ID, task: task }}"><span class="cpm-todo-text">{{ task.post_title }}</span></router-link></span>
	                                    <span :class="privateClass( task )"></span>
	                                </span>

	                                <span class='cpm-assigned-user' 
	                                    v-for="user in getUsers( task.assigned_to )" 
	                                    v-html="user.user_url" :key="user.ID">

	                                </span>

	                                <span :class="completedTaskWrap( task.start_at, task.due_date )">
	                                    <span v-if="task_start_field">{{ dateFormat( task.start_at ) }}</span>
	                                    <span v-if="isBetweenDate( task_start_field, task.start_at, task.due_date )">&ndash;</span>
	                                    <span>{{ dateFormat( task.due_date ) }}</span>
	                                </span>
	                            </div>

	                            <div class="cpm-col-4">
	                                
	                                <span class="cpm-comment-count">
	                                    <a href="#">
	                                        {{ task.comment_count }}
	                                    </a>
	                                </span>
	                            </div>


	                            <div class="cpm-col-1 cpm-todo-action-right cpm-last-col">
	                                <a href="#" @click.prevent="deleteTask( task )" class="cpm-todo-delete"><span class="dashicons dashicons-trash"></span></a>
	                            </div>
	                            <div class="clearfix"></div>
	                        </div>

	                        <div class="cpm-col-12">
	                            <div class="cpm-todo-details">
	                                
	                            </div>
	                        </div>
	                    </div>
	                    <div class="cpm-todo-form" v-if="task.edit_mode">
	                        <new-task-form :task="task" :task_index="task_index" :list="list" :list_index="index"></new-task-form>
	                    </div>

	                </div>
	            </li>
	            <li v-if="!getCompletedTask.length" class="nonsortable">No completed tasks.</li>
	            <li v-if="complete_show_load_more_btn" class="nonsortable">
	                <a @click.prevent="loadMoreCompleteTasks(list)" href="#">More Tasks</a>
	                <span v-show="more_completed_task_spinner" class="cpm-completed-task-spinner cpm-spinner"></span>
	            </li>
	        </ul>
	    </div>
	</div>
</div>

</template>

<script>
	import new_task_form from './new-task-form.vue';

	export default {
		
	    // Get passing data for this component. Remember only array and objects are
	    props: ['list', 'index'],

	    /**
	     * Initial data for this component
	     * 
	     * @return obj
	     */
	    data: function() {
	        return {
	           showTaskForm: false,
	           task: {},
	           tasks: this.list.tasks,
	           task_index: 'undefined', // Using undefined for slideToggle class
	           task_loading_status: false,
	           incomplete_show_load_more_btn: false,
	           complete_show_load_more_btn: false,
	           currnet_user_id: this.$store.state.get_current_user_id,
	           more_incomplete_task_spinner: false,
	           more_completed_task_spinner: false,
	           loading_completed_tasks: true,
	           loading_incomplete_tasks: true
	        }
	    },

	    beforeCreate: function () {
	    	
		},

	    created: function() {

	        // var self = this;
	        // if ( this.$store.state.is_single_list ) {
	        //     //For sigle todo-list page
	        //     this.getTasks(this.list.ID, 0, 'cpm_get_tasks', function(res) {
	        //         var getIncompletedTasks = self.getIncompletedTasks(self.list);
	        //         var getCompleteTask     = self.getCompleteTask(self.list);

	        //         self.loading_completed_tasks = false;
	        //         self.loading_incomplete_tasks = false;

	        //         if ( res.found_incompleted_tasks > getIncompletedTasks.length ) {
	        //             self.incomplete_show_load_more_btn = true;
	        //         }

	        //         if ( res.found_completed_tasks > getCompleteTask.length ) {
	        //             self.complete_show_load_more_btn = true;
	        //         }
	        //     });
	        // } else {
	        //     self.list.tasks = [];
	        //     //For todo-lists page
	        //     this.getTasks(this.list.ID, 0, 'cpm_get_incompleted_tasks', function(res) {
	        //         self.loading_incomplete_tasks = false;
	                
	        //         if ( res.found_incompleted_tasks > self.list.tasks.length ) {
	        //             self.incomplete_show_load_more_btn = true;
	        //         }
	        //     }); 
	        // }
	    },



	    computed: {
	        /**
	         * Check, Has task from this props list
	         * 
	         * @return boolen
	         */
	        taskLength: function() {
	            return typeof this.list.tasks != 'undefined' && this.list.tasks.length ? true : false;
	        },

	        /**
	         * Get incomplete tasks
	         * 
	         * @param  array tasks 
	         * 
	         * @return array       
	         */
	        getIncompleteTasks: function() {
	        	if ( this.list.incomplete_tasks )
	        	return this.list.incomplete_tasks.data;
	        	
	            // if ( ! this.list.tasks ) {
	            //     return [];
	            // }

	            // return this.list.tasks.filter(function( task ) {
	            //     return ( task.completed == '0' || !task.completed );
	            // });
	        },

	        /**
	         * Get completed tasks
	         * 
	         * @param  array tasks 
	         * 
	         * @return array       
	         */
	        getCompletedTask: function() {
	        	if ( this.list.complete_tasks )
	            return this.list.complete_tasks.data; 
	        },
	    },

	    components: {
	    	'new-task-form': new_task_form,
	    },

	    methods: {
	        is_assigned: function(task) {
	            return true;
	            var get_current_user_id = this.$store.state.get_current_user_id,
	                in_task  = task.assigned_to.indexOf(get_current_user_id);
	            
	            if ( task.can_del_edit || ( in_task != '-1' ) ) {
	                return true;
	            }

	            return false;
	        },
	        /**
	         * Get incomplete tasks
	         * 
	         * @param  array tasks 
	         * 
	         * @return array       
	         */
	        getIncompletedTasks: function(lists) {
	            return lists.tasks.filter(function( task ) {
	                return ( task.completed == '0' || !task.completed );
	            });
	        },

	        /**
	         * Get completed tasks
	         * 
	         * @param  array tasks 
	         * 
	         * @return array       
	         */
	        getCompleteTask: function(lists) {
	            return lists.tasks.filter(function( task ) {
	                return ( task.completed == '1' || task.completed );
	            }); 
	        },
	       
	        /**
	         * Class for showing task private incon
	         * 
	         * @param  obje task 
	         * 
	         * @return string      
	         */
	        privateClass: function( task ) {
	            return ( task.task_privacy == 'yes' ) ? 'cpm-lock' : 'cpm-unlock';
	        },

	        /**
	         * Delete task
	         * 
	         * @return void
	         */
	        deleteTask: function( list_id, task_id ) {
	            if ( ! confirm( PM_Vars.message.confirm ) ) {
	                return;
	            }

	            var self       = this,
	                list_index = this.getIndex( this.$store.state.lists, list_id, 'ID' ),
	                task_index = this.getIndex( this.$store.state.lists[list_index].tasks, task_id, 'ID' ),
	                form_data  = {
	                    action: 'cpm_task_delete',
	                    task_id: task_id,
	                    _wpnonce: PM_Vars.nonce,
	                };

	            // Seding request for insert or update todo list
	            jQuery.post( PM_Vars.ajaxurl, form_data, function( res ) {
	                if ( res.success ) {
	                    // Display a success message, with a title
	                    //toastr.success(res.data.success);
	                    
	                    CPM_Component_jQuery.fadeOut( task_id, function() {
	                        self.$store.commit( 'after_delete_task', { 
	                            list_index: list_index,
	                            task_index: task_index,
	                        });
	                    });
	                } else {
	                    // Showing error
	                    res.data.error.map( function( value, index ) {
	                        toastr.error(value);
	                    });
	                }
	            });
	        },

	        loadMoreIncompleteTasks: function(list) {
	            if ( this.task_loading_status ) {
	                return;
	            }

	            this.task_loading_status = true;
	            this.more_incomplete_task_spinner = true;


	            var incompleted_tasks = this.getIncompletedTasks( this.list );

	            var page_number = incompleted_tasks.length,
	                self   = this;
	            
	            this.getTasks( list.ID, page_number, 'cpm_get_incompleted_tasks', function(res) {
	                self.task_loading_status = false;
	                self.more_incomplete_task_spinner = false;

	                var incompleted_tasks = self.getIncompletedTasks( self.list );
	                
	                if ( res.found_incompleted_tasks > incompleted_tasks.length ) {
	                    self.incomplete_show_load_more_btn = true;
	                } else {
	                    self.incomplete_show_load_more_btn = false;
	                }
	            });

	        },

	        loadMoreCompleteTasks: function(list) {
	            if ( this.task_loading_status ) {
	                return;
	            }

	            this.task_loading_status = true;
	            this.more_completed_task_spinner = true;

	            var completed_tasks = this.getCompleteTask( this.list );

	            var page_number = completed_tasks.length,
	                self   = this;
	            
	            this.getTasks( list.ID, page_number, 'cpm_get_completed_tasks', function(res) {
	                self.task_loading_status = false;
	                self.more_completed_task_spinner = false;

	                var completed_tasks = self.getCompleteTask( self.list );
	                
	                if ( res.found_completed_tasks > completed_tasks.length ) {
	                    self.complete_show_load_more_btn = true;
	                } else {
	                    self.complete_show_load_more_btn = false;
	                }
	            });

	        }
	    }
	}
</script>


