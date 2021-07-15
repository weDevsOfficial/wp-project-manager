<template>
    <div class="pm-todo-wrap clearfix">
        <div class="pm-todo-content" >
            <div class="pm-todo-inside">
                <div class="pm-col-7">
                   <input :disabled="can_complete_task(task)" v-model="task_status" @click="doneUndone()" type="checkbox"  value="" name="" >

                    <span class="task-title">

                        <a href="#" @click.prevent="getSingleTask(task)">{{ task.title }}</a>
                    </span>


                    <span class='pm-assigned-user' v-for="user in task.assignees.data" :key="user.ID">
                        <a href="#" :title="user.display_name">
                            <img :src="user.avatar_url" :alt="user.display_name" height="48" width="48">
                        </a>
                    </span>

                    <span v-if="taskTimeWrap(task)" :class="taskDateWrap(task.due_date.date)">
                        <span v-if="task_start_field">{{ taskDateFormat( task.start_at.date ) }}</span>
                        <span v-if="isBetweenDate( task_start_field, task.start_at.date, task.due_date.date )">&ndash;</span>
                        <span>{{ taskDateFormat(task.due_date.date) }}</span>
                    </span>

                    <span class="task-label task-activity">
                        <span class="label-block" v-for="(label, labelIndex) in getLabels(task)" :key="labelIndex">
                            <span class="label-color" :style="'background-color:'+ label.color ">{{ label.title }}</span>
                        </span>
                    </span>
                </div>
                <div class="pm-col-4 pm-todo-action-center">

                    <span class="pm-task-comment pm-todo-action-child">
                        <router-link
                            :to="{
                                name: 'single_task',
                                params: {
                                    task_id: task.id,
                                    list_id: task.task_list_id,
                                    project_id: task.project_id,
                            }}">

                            <span class="pm-comment-count">
                                {{ task.meta.total_comment }}
                            </span>
                        </router-link>
                    </span>

                    <span :class="privateClass( task.meta.privacy )"></span>
                    <div class="pm-clearfix"></div>

                </div>
                <div class="clearfix"></div>
            </div>
        </div>
        <div v-if="parseInt(taskId) && parseInt(projectId)">
            <single-task :taskId="taskId" :projectId="projectId"></single-task>
        </div>
    </div>
</template>

<script>

    export default{
        props: ['task'],
        
        mixins: [PmMixin.projectTaskLists],
        
        data () {
            return{
                task_status : this.task.status == 'complete' ? 1 : 0,
                taskId: false,
                projectId: false
            }
        },
        
        components: {
        	'single-task': pm.SingleTask
        },
        
        created () {
            pmBus.$on('pm_after_close_single_task_modal', this.afterCloseSingleTaskModal);
        },

        methods: {
            getLabels (task) {
                return typeof task.labels == 'undefined' ? [] : task.labels.data;
            },

            afterCloseSingleTaskModal () {
                this.taskId = false;
                this.projectId = false;
            },
            
            doneUndone (){
                var self = this,
                task_status = this.task.status === 'complete' ? 0 : 1;
                var args = {
                    data: {
                        title: this.task.title,
                        task_id: this.task.id,
                        status : task_status,
                        project_id: parseInt(this.task.project_id),
                    },
                    callback (res) {
                        self.$store.commit("myTask/afterDoneUndoneTask", {task: res.data, route: self.$route.name});
                    }
                }


                this.taskDoneUndone( args );
            },

            getSingleTask (task) {
                this.taskId = task.id;
                this.projectId = task.project_id;
            },
            
            afterCloseSingleTaskModal () {
                var params = {}, route = null;
                if (typeof this.$route.params.user_id !== 'undefined') {
                    params.user_id = parseInt(this.$route.params.user_id)
                }

                if(this.$route.name == 'mytask_current_single_task') {
                    route = 'mytask-current';
                }

                if(this.$route.name == 'mytask_complete_single_task') {
                    route = 'mytask-complete';
                }

                if(this.$route.name == 'mytask_outstanding_single_task') {
                    route = 'outstanding-task';
                }
                if(route) {
                    this.$router.push({
                            name: route,
                            params: params
                        });
                }
                this.taskId = false;
                this.projectId = false;
            },
        }
    }
</script>

<style scoped>
    .label-color {
        color: white;
        padding: 1px 3px;
        margin-left: 5px;
        border-radius: 2px;
    }
</style>
