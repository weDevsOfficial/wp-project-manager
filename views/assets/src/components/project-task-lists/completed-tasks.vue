<template>
<div class="pm-todo-wrap">                    
        <div v-if="!task.edit_mode" class="pm-todo-item">
            
            <div class="todo-content">
                <div class="task-left">
                    <div class="checkbox">
                        <input :disabled="can_complete_task(task)" v-model="task.status"  @change="doneUndone()" type="checkbox"  value="" name="" >
                    </div>
                </div>
                <div class="title-wrap">

                    <div class="task-title">
                        <a class="title" href="#" @click.prevent="getSingleTask(task)">{{ task.title }}</a>
                    </div>  
                </div> 

                <div class="task-right task-action-wrap">

                    <div v-if="task.assignees.data.length" class="task-activity assigned-users-content">
                        <a class="image-anchor" v-for="user in task.assignees.data" :key="user.id" :href="myTaskRedirect(user.id)" :title="user.display_name">
                            <img class="image" :src="user.avatar_url" :alt="user.display_name" height="48" width="48">
                        </a>
                    </div> 

                    <div v-if="taskTimeWrap(task)" :class="'task-activity '+taskDateWrap(task.due_date.date)">
                        <span class="icon-pm-calendar"></span>
                        <span v-if="task_start_field">{{ taskDateFormat( task.start_at.date ) }}</span>
                        <span v-if="isBetweenDate( task_start_field, task.start_at.date, task.due_date.date )">&ndash;</span>
                        <span>{{ taskDateFormat(task.due_date.date) }}</span>
                    </div>
                    <!-- v-if="parseInt(task.meta.total_comment) > 0" -->
                    <div class="task-activity comment">
                        <span class="icon-pm-comment"></span>
                        <span>{{ task.meta.total_comment }}</span>
                    </div>  
                </div>   
                <div @click.prevent="showHideTaskMoreMenu(task)" class="more-menu">
                    <span class="icon-pm-more-options"></span>
                    <div v-if="task.moreMenu" class="more-menu-ul-wrap">
                        <ul>
                            <li>
                                <a @click.prevent="deleteTask({task: task, list: list})" class="li-a" href="#">
                                    <span class="icon-pm-delete"></span>
                                    <span>{{ __('Delete', 'wedevs-project-manager') }}</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>               
            </div>
        </div>
        
        
        <div v-if="parseInt(taskId) && parseInt(projectId)">
            <single-task :taskId="taskId" :projectId="projectId"></single-task>
        </div>
    </div>
    <!-- <div class="pm-todo-wrap clearfix">
        <div class="pm-todo-content" >
            <div>
                <div class="pm-col-6">
                    <input :disabled="can_complete_task(task)" v-model="task.status"  @change="doneUndone()" class="" type="checkbox"  value="" name="" >

                    <span class="task-title">
                        
                        <a href="#" @click.prevent="getSingleTask(task)">
                            <span class="pm-todo-text">{{ task.title }}</span>
                        </a>
                     
                    </span> 
                  

                    <span class='pm-assigned-user' v-for="user in task.assignees.data" :key="user.id">
                        <a :href="myTaskRedirect(user.id)" :title="user.display_name">
                            <img :src="user.avatar_url" :alt="user.display_name" height="48" width="48">
                        </a>

                    </span>

                    <span v-if="taskTimeWrap(task)" :class="completedTaskWrap(task.due_date.date)">
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


                <div class="pm-col-1 pm-todo-action-right pm-last-col" v-if="can_edit_task(task)">
                    <a href="#" @click.prevent="deleteTask({task: task, list: list})" class="pm-todo-delete"><span class="dashicons dashicons-trash"></span></a>
                </div>
                <div class="clearfix"></div>
            </div>
        </div>
         <transition name="slide" v-if="can_edit_task(task)">
            <div class="pm-todo-form" v-if="task.edit_mode">
                <new-task-form :task="task" :list="list"></new-task-form>
            </div>
        </transition>

        <div v-if="parseInt(taskId) && parseInt(projectId)">
            <single-task :taskId="taskId" :projectId="projectId"></single-task>
        </div>
    </div> -->
</template>


<script>
    import new_task_form from './new-task-form.vue';
    import Mixins from './mixin';
    
    export default {
        props: ['task', 'list'],
        mixins: [Mixins],
        data () {
            return {
                taskId: false,
                projectId: false
            }
        },
        components: {
            'new-task-form': new_task_form,
            'single-task': pm.SingleTask
        },
        computed: {
            route_name (){
                if( this.$route.name === 'single_list' ){
                    return 'single_task'
                }

                return 'lists_single_task'
            }
        },
        created () {
            pmBus.$on('pm_after_close_single_task_modal', this.afterCloseSingleTaskModal);
        },
        methods: {
            afterCloseSingleTaskModal () {
                
                if(this.$route.name == 'lists_single_task') {
                    this.$router.push({
                        name: 'task_lists'
                    });
                } else if(this.$route.name == 'single_task') {
                    this.$router.push({
                        name: 'single_list'
                    });
                } else {
                    this.taskId = false;
                    this.projectId = false;
                }
            },
            getSingleTask (task) {
                this.$store.commit('projectTaskLists/updateSingleTaskActiveMode', true);
                this.taskId = task.id;
                this.projectId = task.project_id;
            },
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
                 status = this.task.status ? 1: 0;
                var args = {
                    data: {
                        title: this.task.title,
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

