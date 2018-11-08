<template>
    <div class="pm-todo-wrap">                    
        <div v-if="!task.edit_mode" class="pm-todo-item">
            
            <div class="todo-content">
                <div class="task-left">
                    <div class="move pm-task-drag-handle">
                        <span class="icon-pm-drag-drop"></span>
                    </div> 
                    <div class="checkbox">
                        <input v-if="!show_spinner" :disabled="can_complete_task(task)" v-model="task.status"  @change="doneUndone()" type="checkbox"  value="" name="" >
                        <span class="pm-spinner" v-if="show_spinner"></span>
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

                    <div v-if="taskTimeWrap(task)" :title="getTaskFullDate(task)" :class="'task-activity task-time '+taskDateWrap(task.due_date.date)">
                        <span class="icon-pm-calendar"></span>
                        <span v-if="task_start_field">{{ taskDateFormat( task.start_at.date ) }}</span>
                        <span v-if="isBetweenDate( task_start_field, task.start_at.date, task.due_date.date )">&ndash;</span>
                        <span>{{ taskDateFormat(task.due_date.date) }}</span>
                    </div>

                    <div class="task-activity" v-if="isPrivateTask(task.meta.privacy)">
                        <span class="icon-pm-private"></span>
                    </div>

                    <!-- v-if="parseInt(task.meta.total_comment) > 0" -->
                    <a href="#" @click.prevent="getSingleTask(task)" v-if="parseInt(task.meta.total_comment) > 0" class="task-activity comment">
                        <span class="icon-pm-comment"></span>
                        <span>{{ task.meta.total_comment }}</span>
                    </a> 
                    <div class="task-activity">
                        <do-action :hook="'task_inline'" :actionData="doActionData"></do-action>

                    </div>
                     
                </div>  

                <div v-if="can_edit_task(task) && !isArchivedTaskList(task)" @click.prevent="showHideTaskMoreMenu(task, list)" class="nonsortable more-menu task-more-menu">
                    <span class="icon-pm-more-options"></span>
                    <div v-if="task.moreMenu" class="more-menu-ul-wrap">
                        <ul>
                            <li v-if="PM_Vars.is_pro && user_can('view_private_task') && !isPrivateTask(task.meta.privacy)"  class="first-li">
                                <a @click.prevent="TaskLockUnlock(task)" class="li-a" href="#">
                                    <span class="icon-pm-private"></span>
                                    <span>{{ __('Make Private', 'wedevs-project-manager') }}</span>
                                </a>
                            </li>
                            <li v-if="PM_Vars.is_pro && user_can('view_private_task') && isPrivateTask(task.meta.privacy)"  class="first-li">
                                <a @click.prevent="TaskLockUnlock(task)" class="li-a" href="#">
                                    <span class="icon-pm-unlock"></span>
                                    <span>{{ __('Make Public', 'wedevs-project-manager') }}</span>
                                </a>
                            </li>
                            <li class="edit-task-btn">
                                <a @click.prevent="showHideTaskFrom('toggle', false, task )" class="li-a" href="#">
                                    <span class="icon-pm-pencil"></span>
                                    <span>{{ __('Edit', 'wedevs-project-manager') }}</span>
                                </a>
                            </li>
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
        
        <div v-if="task.edit_mode && can_create_task" class="task-update-wrap nonsortable">
            <new-task-form  :task="task" :list="list"></new-task-form>
        </div>
        
        <div v-if="parseInt(taskId) && parseInt(projectId)">
            <single-task :taskId="taskId" :projectId="projectId"></single-task>
        </div>
    </div>

    <!-- <div class="pm-todo-wrap clearfix">
        
        <div v-if="!task.edit_mode" class="pm-todo-content">
            <div class="pm-todo-inside">
                <div class="pm-col-7">
                   <input :disabled="can_complete_task(task) || isArchivedTaskList(task)" v-model="task.status"  @change="doneUndone()" type="checkbox"  value="" name="" >

                    <span class="task-title">
                        
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
    </div> -->
</template>

<style lang="less">

</style>
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
                projectId: false,
                show_spinner: false
            }
        },

        created () {
            window.addEventListener('click', this.windowActivity);
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
            getTaskFullDate (task) {
                var date = '';
                
                if(this.task_start_field && task.start_at.date) {
                    date = this.getFullDate(task.start_at.date, task.start_at.time);
                }

                if(this.task_start_field && task.start_at.date && task.due_date.date) {
                    date = date + '-';
                }

                if(task.due_date.date) {
                    date = date + this.getFullDate(task.due_date.date, task.due_date.time);
                }
                
                return date;
            },
            isPrivateTask (isPrivate) {
                return isPrivate == '1' ? true : false;
            },

            windowActivity (el) {
                var updateField  = jQuery(el.target).closest('.task-update-wrap'),
                    updateBtn = jQuery(el.target).closest('.edit-task-btn'),
                    taskActionWrap = jQuery(el.target).closest('.task-more-menu');
                
                if(!taskActionWrap.length) {
                    this.task.moreMenu = false;
                }
                
                if ( !updateBtn.length && !updateField.length ) {

                    this.task.edit_mode = false;
                }
            },
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
                    this.show_spinner = true;
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
                        self.show_spinner = false
                    }
                }

                                    
                this.taskDoneUndone( args );
            }
        }
    }
</script>
