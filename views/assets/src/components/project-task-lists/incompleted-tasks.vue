<template>
    <div class="pm-todo-wrap clearfix">
        
        <div v-if="!task.edit_mode" class="pm-todo-content">
            <div class="pm-todo-inside">
                <div class="pm-col-7">
                   <input :disabled="can_complete_task(task) || isArchivedTaskList(task)" v-model="task.status"  @change="doneUndone()" type="checkbox"  value="" name="" >

                    <span class="task-title">
                        <!-- <router-link 
                            :to="{ 
                                name: route_name, 
                                params: { 
                                    list_id: list.id, 
                                    task_id: task.id, 
                                    project_id: project_id, 
                            }}">

                            {{ task.title }}
                        </router-link> -->
                        <a href="#" @click.prevent="getSingleTask(task)">{{ task.title }}</a>
                    
                    </span>                 

                    <span class='pm-assigned-user' v-for="user in task.assignees.data" :key="user.id">
                        <a :href="myTaskRedirect(user.id)" :title="user.display_name">
                            <img :src="user.avatar_url" :alt="user.display_name" height="48" width="48">
                        </a>
                    </span>
                    
                    <span v-if="taskTimeWrap(task)" :class="taskDateWrap(task.due_date.date)">
                        <span v-if="task_start_field">{{ taskDateFormat( task.start_at.date ) }}</span>
                        <span v-if="isBetweenDate( task_start_field, task.start_at.date, task.due_date.date )">&ndash;</span>
                        <span>{{ taskDateFormat(task.due_date.date) }}</span>
                    </span>
                </div>
                
                <div class="pm-col-4 pm-todo-action-center">
                    
                    <span class="pm-task-comment pm-todo-action-child">

                            <router-link 
                                :to="{ 
                                    name: route_name, 
                                    params: { 
                                        list_id: list.id, 
                                        task_id: task.id, 
                                        project_id: project_id, 
                                }}">

                                <span class="pm-comment-count">
                                    {{ task.meta.total_comment }}
                                </span>
                            </router-link>
                    </span>
                    <span>
                        <a v-if="PM_Vars.is_pro && can_edit_task(task) && user_can('view_private_task')" href="#" @click.prevent="TaskLockUnlock(task)"><span :class="privateClass( task.meta.privacy )"></span></a>
                    </span>

                    <do-action :hook="'task_inline'" :actionData="doActionData"></do-action>
                    <div class="pm-clearfix"></div>

                </div>

                <div class="clearfix"></div>

                <div class="pm-list-action-wrap" v-if="!isArchivedTaskList(task)">
                    <div class="pm-list-action" v-if="can_edit_task(task)">

                        <a href="#" @click.prevent="showHideTaskFrom('toggle', false, task )" class="pm-todo-edit">
                            <span class="">{{ __('Edit', 'wedevs-project-manager') }} |</span>
                        </a>
                        <a href="#" @click.prevent="deleteTask({task: task, list: list})" class="pm-todo-delete">
                            <span class="">{{ __('Delete', 'wedevs-project-manager') }}</span>
                        </a>
                    </div>
                        
                </div>
            </div>
            
            <do-action v-if="!isSingleTask" :hook="'after_task_content'" :actionData="doActionData"></do-action>
        </div>
        <transition name="slide" v-if="can_edit_task(task)">
            <div class="pm-todo-form" v-if="task.edit_mode">
                <new-task-form :task="task" :list="list"></new-task-form>
            </div>
        </transition>

        <div v-if="parseInt(taskId) && parseInt(projectId)">
            <single-task :taskId="taskId" :projectId="projectId"></single-task>
        </div>
    </div>
</template>
<script>
    import new_task_form from './new-task-form.vue';
    import DoAction from './../common/do-action.vue';
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

        created () {
            pmBus.$on('pm_after_close_single_task_modal', this.afterCloseSingleTaskModal);
        },

        components: {
            'new-task-form': new_task_form,
            'do-action': DoAction,
            'single-task': pm.SingleTask
        },
        
        computed: {
            route_name (){
                if( this.$route.name === 'single_list' ){
                    return 'single_task'
                }

                return 'lists_single_task'
            },

            isSingleTask () {
                return this.$route.params.task_id ? true : false;
            },

            doActionData () {
                return {
                    task: this.task,
                    list: this.list
                }
            }
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
