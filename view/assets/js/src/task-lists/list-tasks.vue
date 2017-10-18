<template>

	<div class="pm-incomplete-tasks">
	    <ul  class="pm-todos pm-todolist-content pm-incomplete-task" v-pm-sortable>
	       <!--  <li v-if="loading_incomplete_tasks" class="nonsortable">
	            <div class="pm-data-load-before" >
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
	-->
	        <li :data-id="task.id" :data-order="task.order" class="pm-todo" v-for="(task, task_index) in getIncompleteTasks" :key="task.id" :class="'pm-fade-out-'+task.id">

	            <incompleted-tasks :task="task" :list="list"></incompleted-tasks>      	
	        </li>

	        <li v-if="!getIncompleteTasks.length" class="nonsortable">No tasks found.</li>

	       <!--  <li v-if="loadMoreButton" class="nonsortable">
	            <a @click.prevent="loadMoreIncompleteTasks()" href="#">More Tasks</a>
	            <span v-show="more_incomplete_task_spinner"  class="pm-incomplete-task-spinner pm-spinner"></span>
	        </li> -->
	        <li v-if="list.show_task_form" class="pm-todo-form nonsortable">
	            <new-task-form :task="{}"  :list="list"></new-task-form>
	        </li>
	    </ul> 
	</div>

</template>

<script>
	import new_task_form from './new-task-form.vue';
	import incompleted_tasks from './incompleted-tasks.vue';
	import completed_tasks from './completed-tasks.vue';

	export default {
		
	    // Get passing data for this component. Remember only array and objects are
	    props: ['list'],

	    /**
	     * Initial data for this component
	     * 
	     * @return obj
	     */
	    data () {
	        return {
	           showTaskForm: false,
	           task: {},
	           tasks: this.list.tasks,
	           task_index: 'undefined', // Using undefined for slideToggle class
	           task_loading_status: false,
	           complete_show_load_more_btn: false,
	           currnet_user_id: this.$store.state.get_current_user_id,
	           more_incomplete_task_spinner: false,
	           more_completed_task_spinner: false,
	           loading_completed_tasks: true,
	           loading_incomplete_tasks: true,
	           completed_tasks_next_page_number:null
	        }
	    },

	    computed: {
	        /**
	         * Check, Has task from this props list
	         * 
	         * @return boolen
	         */
	        taskLength () {
	            return typeof this.list.tasks != 'undefined' && this.list.tasks.length ? true : false;
	        },

	        /**
	         * Get incomplete tasks
	         * 
	         * @param  array tasks 
	         * 
	         * @return array       
	         */
	        getIncompleteTasks () {
	        	if ( this.list.incomplete_tasks ) {
	        		this.list.incomplete_tasks.data.map(function(task, index) {
	        			task.status = false;
	        		});

	        		return this.list.incomplete_tasks.data;
	        	}

	        	return [];
	        },

	        /**
	         * Get completed tasks
	         * 
	         * @param  array tasks 
	         * 
	         * @return array       
	         */
	        getCompletedTask () {
	        	if ( this.list.complete_tasks ) {
	        		this.list.complete_tasks.data.map(function(task, index) {
	        			task.status = true;
	        		});

	        		return this.list.complete_tasks.data;
	        	}
	        },

	        loadMoreButton (){
	        	if(typeof this.list.incomplete_tasks  == 'undefined'){
	        		return false;
	        	}
	        	var pagination = this.list.incomplete_tasks.meta.pagination
	        	if(pagination.current_page < pagination.total_pages){
	        		this.completed_tasks_next_page_number = pagination.current_page+1;
	        		return true;
	        	}

	        	return false;
	        }
	    },

	    components: {
	    	'new-task-form': new_task_form,
	    	'incompleted-tasks': incompleted_tasks,
	    	'completed-tasks': completed_tasks
	    },

	    methods: {
	        is_assigned (task) {
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
	        getIncompletedTasks (lists) {
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
	        getCompleteTask (lists) {
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
	        privateClass ( task ) {
	            return ( task.task_privacy == 'yes' ) ? 'pm-lock' : 'pm-unlock';
	        },

	        /**
	         * Delete task
	         * 
	         * @return void
	         */
	        deleteTask ( list_id, task_id ) {
	            if ( ! confirm( PM_Vars.message.confirm ) ) {
	                return;
	            }

	            var self       = this,
	                list_index = this.getIndex( this.$store.state.lists, list_id, 'ID' ),
	                task_index = this.getIndex( this.$store.state.lists[list_index].tasks, task_id, 'ID' ),
	                form_data  = {
	                    action: 'pm_task_delete',
	                    task_id: task_id,
	                    _wpnonce: PM_Vars.nonce,
	                };

	            // Seding request for insert or update todo list
	            jQuery.post( PM_Vars.ajaxurl, form_data, function( res ) {
	                if ( res.success ) {
	                    // Display a success message, with a title
	                    //toastr.success(res.data.success);
	                    
	                    PM_Component_jQuery.fadeOut( task_id, function() {
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
	    }
	}
</script>


