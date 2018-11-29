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
                                <a @click.prevent="taskFormActivity('toggle', false, task, $event)" class="li-a" href="#">
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

</template>

<style lang="less">

</style>
<script>
    import new_task_form from './new-task-form.vue';
    import DoAction from './../common/do-action.vue';
    import Mixins from './mixin';
    
    export default {
        props: {
            task: {
                type: [Object],
                default () {
                    return {}
                }
            },
            list: {
                type: [Object],
                default () {
                    return {};
                } 
            }
        },
        
        mixins: [Mixins],

        data () {
            return {
                taskId: false,
                projectId: false,
                show_spinner: false
            }
        },

        created () {
            var self = this;
            window.addEventListener('click', this.windowActivity);
            pmBus.$on('pm_after_close_single_task_modal', this.afterCloseSingleTaskModal);
            jQuery('body').keyup(function(e) {
                if (e.keyCode === 27) {
                    self.task.edit_mode = false;
                }
            });
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
            taskFormActivity (toggle, status, task, el) {
                var li = jQuery(el.target).closest('.incomplete-task-li');
                
                this.showHideTaskFrom(toggle, status, task);

                pm.Vue.nextTick(function() {
                    li.find('.task-input-field').focus();
                });

            },
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
