<template>
    <div class="cpm-todo-wrap clearfix">
        <div class="cpm-todo-content" >
        	
            <div>
                <div class="cpm-col-7">
                   <input :disabled="!is_assigned(task)" v-model="task.status" @click="taskDoneUndone( task, task.status, list )" class="" type="checkbox"  value="" name="" >

                    <span v-if="is_single_list">
                        <router-link 
                        	:to="{ 
                            	name: 'lists_single_task', 
                            	params: { 
                                	list_id: list.id, 
                                	task_id: task.id, 
                                	project_id: project_id, 
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
                                	task_id: task.id, 
                                	project_id: project_id, 
                            }}">

                        	{{ task.title }}
                        </router-link>
                    </span>

                    <span :class="privateClass( task )"></span>

                    <span class='cpm-assigned-user' v-for="user in task.assignees.data" :key="user.ID">
                        <a href="#" :title="user.display_name">
                        	<img :src="user.avatar_url" :alt="user.display_name" height="48" width="48">
                        </a>
                    </span>
                    
                    <span :class="taskDateWrap(task.due_date.date)">
                        <span v-if="task_start_field">{{ dateFormat( task.start_at.date ) }}</span>
                        <span v-if="isBetweenDate( task_start_field, task.start_at.date, task.due_date.date )">&ndash;</span>
                        <span>{{ dateFormat(task.due_date.date) }}</span>
                    </span>
                </div>
                
                <div class="cpm-col-4 cpm-todo-action-center">
                    <div class="cpm-task-comment">
                        <span>
                            <router-link 
                            	:to="{ 
                            		name: 'lists_single_task', 
                            		params: { 
                            			list_id: list.id, 
                            			task_id: task.id
                            		}
                            	}">

                                <span class="cpm-comment-count">
                                    {{ task.meta.total_comment }}
                                </span>
                            </router-link>
                        </span>
                       
                    </div>

                </div>

                <!-- v-if="task.can_del_edit" -->
                <div class="cpm-col-1 cpm-todo-action-right cpm-last-col">
                    
                        <!-- <a class="move"><span class="dashicons dashicons-menu"></span></a> -->
                        <a href="#" @click.prevent="showHideTaskFrom('toggle', false, task)" class="cpm-todo-edit"><span class="dashicons dashicons-edit"></span></a>
                        <a href="#" @click.prevent="deleteTask(task)" class="cpm-todo-delete"><span class="dashicons dashicons-trash"></span></a>
                        

                </div>
                <div class="clearfix"></div>
            </div>
        </div>

        <div class="cpm-todo-form" v-if="task.edit_mode">
            <new-task-form :task="task" :list="list"></new-task-form>
        </div>
    </div>
</template>

<script>
	import new_task_form from './new-task-form.vue';
	export default {
		props: ['task', 'list'],
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
	    }
	}
</script>
