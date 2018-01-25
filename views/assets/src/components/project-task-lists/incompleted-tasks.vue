<template>
    <div class="pm-todo-wrap clearfix">
        <div v-if="!task.edit_mode" class="pm-todo-content">
            <div class="pm-todo-inside">
                <div class="pm-col-7">
                   <input :disabled="!is_assigned(task)" v-model="task.status" @click="doneUndone()" type="checkbox"  value="" name="" >

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

                            {{ task.title }}
                        </router-link>
                    
                    </span>                 


                    <span class='pm-assigned-user' v-for="user in task.assignees.data" :key="user.ID">
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
                
                <div class="pm-col-4 pm-todo-action-center">
                    <span :class="privateClass( task.meta.privacy )"></span>
                    <div class="pm-task-comment pm-todo-action-child">
                        <span>
                            <router-link 
                                :to="{ 
                                    name: route_name, 
                                    params: { 
                                        list_id: list.id, 
                                        task_id: task.id, 
                                        project_id: project_id, 
                                        task: task 
                                }}">

                                <span class="pm-comment-count">
                                    {{ task.meta.total_comment }}
                                </span>
                            </router-link>
                        </span>
                    </div>

                    <do-action :hook="'task_inline'" :actionData="doActionData"></do-action>
                    <div class="pm-clearfix"></div>

                </div>

                <!-- v-if="task.can_del_edit" -->
               <!--  <div class="pm-col-1 pm-todo-action-right pm-last-col">
                    
                    <a href="#" @click.prevent="showHideTaskFrom('toggle', false, task )" class="pm-todo-edit">
                        <span class="dashicons dashicons-edit"></span>
                    </a>
                    <a href="#" @click.prevent="deleteTask({task: task, list: list})" class="pm-todo-delete">
                        <span class="dashicons dashicons-trash"></span>
                    </a>
                        
                </div> -->
                <div class="clearfix"></div>

                <div class="pm-list-action-wrap">
                    <div class="pm-list-action">

                        <a href="#" @click.prevent="showHideTaskFrom('toggle', false, task )" class="pm-todo-edit">
                            <span class="">Edit |</span>
                        </a>
                        <a href="#" @click.prevent="deleteTask({task: task, list: list})" class="pm-todo-delete">
                            <span class="">Delete</span>
                        </a>
                    </div>
                        
                </div>
            </div>
            <do-action :hook="'after_task_content'" :actionData="doActionData"></do-action>
        </div>
        <transition name="slide">
            <div class="pm-todo-form" v-if="task.edit_mode">
                <new-task-form :task="task" :list="list"></new-task-form>
            </div>
        </transition>
    </div>
</template>

<style>
    .pm-todo-action-child {
        float: left;
    }
    .pm-list-action {
        margin-left: 24px;
        font-size: 12px;
        display: none;
    }
    .pm-todo-inside:hover .pm-list-action {
        display: block;
    }
    .pm-list-action-wrap {
        display: block;
        height: 16px;
    }
</style>

<script>
    import new_task_form from './new-task-form.vue';
    import DoAction from './../common/do-action.vue';
    
    export default {
        props: ['task', 'list'],
        
        mixins: [PmMixin.projectTaskLists],

        data () {
            return {
                doActionData: {
                    task: this.task,
                    list: this.list
                }
            }
        },
        
        components: {
            'new-task-form': new_task_form,
            'do-action': DoAction
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
