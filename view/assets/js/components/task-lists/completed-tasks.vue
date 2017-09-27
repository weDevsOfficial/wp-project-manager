<template>
    <div class="cpm-todo-wrap clearfix">
        <div class="cpm-todo-content" >
            <div>
                <div class="cpm-col-6">
                    <input v-model="task.status" @click="taskDoneUndone( task, task.status, list )" class="" type="checkbox"  value="" name="" >

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

                    <span :class="completedTaskWrap(task.due_date.date)">
                        <span v-if="task_start_field">{{ dateFormat( task.start_at.date ) }}</span>
                        <span v-if="isBetweenDate( task_start_field, task.start_at.date, task.due_date.date )">&ndash;</span>
                        <span>{{ dateFormat( task.due_date.date ) }}</span>
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

