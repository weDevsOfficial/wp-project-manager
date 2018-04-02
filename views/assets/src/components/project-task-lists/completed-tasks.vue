<template>
    <div class="pm-todo-wrap clearfix">
        <div class="pm-todo-content" >
            <div>
                <div class="pm-col-6">
                    <input :disabled="!is_assigned(task)" v-model="task.status" @click="doneUndone( )" class="" type="checkbox"  value="" name="" >

                    <span class="task-title">
                        
                            <router-link 
                            :to="{ 
                                name: route_name, 
                                params: { 
                                    list_id: list.id, 
                                    task_id: task.id, 
                                    project_id: project_id, 
                                    task: task 
                            }}">

                            <span class="pm-todo-text">{{ task.title }}</span>
                        </router-link>
                  
                     
                    </span> 
                  

                    <span class='pm-assigned-user' 
                        v-for="user in getUsers( task.assigned_to )" 
                        v-html="user.user_url" :key="user.ID">

                    </span>

                    <span :class="completedTaskWrap(task.due_date.date)">
                        <span v-if="task_start_field">{{ dateFormat( task.start_at.date ) }}</span>
                        <span v-if="isBetweenDate( task_start_field, task.start_at.date, task.due_date.date )">&ndash;</span>
                        <span>{{ dateFormat( task.due_date.date ) }}</span>
                    </span>
                </div>

                <div class="pm-col-5">
                    
                    <span class="pm-comment-count">
                        <a href="#">
                            {{ task.comment_count }}
                        </a>
                    </span>
                </div>


                <div class="pm-col-1 pm-todo-action-right pm-last-col" v-if="can_create_task">
                    <a href="#" @click.prevent="deleteTask({task: task, list: list})" class="pm-todo-delete"><span class="dashicons dashicons-trash"></span></a>
                </div>
                <div class="clearfix"></div>
            </div>
        </div>
         <transition name="slide" v-if="can_create_task">
            <div class="pm-todo-form" v-if="task.edit_mode">
                <new-task-form :task="task" :list="list"></new-task-form>
            </div>
        </transition>
    </div>
</template>


<script>
    import new_task_form from './new-task-form.vue';
    import Mixins from './mixin';
    
    export default {
        props: ['task', 'list'],
        mixins: [Mixins],
        components: {
            'new-task-form': new_task_form,
        },
        computed: {
            route_name (){
                if( this.$route.name === 'single_list' ){
                    return 'single_task'
                }

                return 'lists_single_task'
            }
        },
        methods: {
            is_assigned: function(task) {
                return true;
                var get_current_user_id = this.$store.state.projectTaskLists.get_current_user_id,
                    in_task  = task.assigned_to.indexOf(get_current_user_id);
                
                if ( task.can_del_edit || ( in_task != '-1' ) ) {
                    return true;
                }

                return false;
            },

            doneUndone (){
                var self = this,
                 status = !this.task.status ? 1: 0;
                var args = {
                    data: {
                        task_id: this.task.id,
                        status : status,
                    },
                    callback: function(res){
                        self.$store.commit( 'projectTaskLists/afterTaskDoneUndone', {
                            status: status,
                            task: res.data,
                            list_id: self.list.id,
                            task_id: self.task.id
                        });
                    }
                }

                                    
                this.taskDoneUndone( args );
            }
        }
    }
</script>

