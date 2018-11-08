<template>
    <div  id="pm-single-todo-list-view">
        
        <div class="pm-incomplete-tasks">
            <h3 class="pm-task-list-title pm-tag-gray" style="margin-top:10px;"><a>{{ __( 'Incomplete Tasks', 'wedevs-project-manager') }}</a></h3>
            <ul  class="pm-incomplete-task-list pm-todos pm-todolist-content pm-incomplete-task" v-pm-sortable>

                <li class="pm-todo" :data-id="task.id" :data-order="task.order" v-for="task in getIncompleteTasks" :key="task.id" :class="'pm-fade-out-'+task.ID">
                    <incompleted-tasks :task="task" :list="list"></incompleted-tasks>
                </li>

                <li v-if="!getIncompleteTasks.length" class="nonsortable">{{ __( 'No tasks found.', 'wedevs-project-manager') }}</li>
                <li v-if="isIncompleteLoadMoreActive(list)" class="nonsortable">
                    <a @click.prevent="loadMoreIncompleteTasks(list)" href="#">{{ __( 'More Tasks', 'wedevs-project-manager') }}</a>
                    <span v-show="more_incomplete_task_spinner" class="pm-incomplete-task-spinner pm-spinner"></span>
                </li>
            </ul>
        </div>

        <div class="pm-completed-tasks">
            <h3 class="pm-task-list-title pm-tag-gray"><a>{{ __( 'Completed Tasks', 'wedevs-project-manager') }}</a></h3>
            <ul  class="pm-completed-task-list pm-todos pm-todolist-content pm-todo-completed" v-pm-sortable>
                
                <li :data-id="task.id" :data-order="task.order" class="pm-todo" v-for="task in getCompletedTask" :key="task.id" :class="'pm-todo pm-fade-out-'+task.id">
                    
                    <completed-tasks :task="task" :list="list"></completed-tasks>
                </li>

                <li v-if="!getCompletedTask.length" class="nonsortable">{{ __( 'No tasks found.', 'wedevs-project-manager')  }}</li>

                <li v-if="isCompleteLoadMoreActive(list)" class="nonsortable">
                    <a @click.prevent="loadMoreCompleteTasks(list)" href="#">{{ __( 'More Tasks', 'wedevs-project-manager') }}</a>
                    <span v-show="more_completed_task_spinner" class="pm-completed-task-spinner pm-spinner"></span>
                </li>
            </ul>
        </div>
        <transition name="slide" v-if="can_create_list">
            <div v-if="list.show_task_form" class="pm-todo-form">
                <new-task-form  :list="list"></new-task-form>
            </div>
        </transition>
    </div>
</template>

<style lang="less">
.pm-todolist .list-form {
    background: #fff;
    border: 1px solid #e5e5e5;
    margin-top: 20px;
    padding: 10px;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.04);

    .item input[type="text"],
    .item select,
    .item textarea {
        width: 100%;
        height: 28px;
        padding: 3px 8px;
        font-size: 12px;
        line-height: 100%;
        box-shadow: none;
        border: 1px solid #ddd;
        background: #fff;
    }
    .item textarea {
        height: 84px;
    }
}
</style>

<script>
    import new_task_form from './new-task-form.vue';
    import incompleted_tasks from './incompleted-tasks.vue';
    import completed_tasks from './completed-tasks.vue';
    import Mixins from './mixin';

    export default {
        
        // Get passing data for this component. Remember only array and objects are
        props: ['list'],

        /**
         * Initial data for this component
         * 
         * @return obj
         */
        data: function() {
            return {
               showTaskForm: false,
               task: {},
               tasks: this.list.tasks,
               task_index: 'undefined', // Using undefined for slideToggle class
               task_loading_status: false,
               incomplete_show_load_more_btn: false,
               complete_show_load_more_btn: false,
               currnet_user_id: this.$store.state.projectTaskLists.get_current_user_id,
               more_incomplete_task_spinner: false,
               more_completed_task_spinner: false,
               loading_completed_tasks: true,
               loading_incomplete_tasks: true,
               completed_tasks_next_page_number:null,
               incompleted_tasks_next_page_number:null
            }
        },

        mixins: [Mixins],

        computed: {
            /**
             * Check, Has task from this props list
             * 
             * @return boolen
             */
            taskLength: function() {
                return typeof this.list.tasks != 'undefined' && this.list.tasks.length ? true : false;
            },

            /**
             * Get incomplete tasks
             * 
             * @param  array tasks 
             * 
             * @return array       
             */
            getIncompleteTasks: function() {
                if ( this.list.incomplete_tasks ) {
                    this.list.incomplete_tasks.data.forEach(function(task, index) {
                        if(task) {
                            task.status = false;
                        }
                    });

                    return this.list.incomplete_tasks.data;
                }
            },

            /**
             * Get completed tasks
             * 
             * @param  array tasks 
             * 
             * @return array       
             */
            getCompletedTask: function() {
                if ( this.list.complete_tasks ) {
                    this.list.complete_tasks.data.map(function(task, index) {
                        if(task) {
                            task.status = true;
                        }
                    });

                    return this.list.complete_tasks.data;
                }
            },
            incompletedLoadMoreButton: function(){

                if(typeof this.list.incomplete_tasks  == 'undefined'){
                    return false;
                }
                
                var pagination = this.list.incomplete_tasks.meta.pagination
                if(pagination.current_page < pagination.total_pages){
                    this.incompleted_tasks_next_page_number = pagination.current_page+1;
                    return true;
                }

                return false;
            },
            completedLoadMoreButton: function(){
                if(typeof this.list.complete_tasks  == 'undefined'){
                    return false;
                }
                var pagination = this.list.complete_tasks.meta.pagination
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
            is_assigned: function(task) {
                return true;
                var get_current_user_id = this.$store.state.projectTaskLists.get_current_user_id,
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
            getIncompletedTasks: function(lists) {
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
            getCompleteTask: function(lists) {
                return lists.tasks.filter(function( task ) {
                    return ( task.completed == '1' || task.completed );
                }); 
            }
        }
    }
</script>
