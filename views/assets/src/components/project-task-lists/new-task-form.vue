<template>
    <div :class="'pm-task-form pm-slide-'+task.id">

        <form action="" v-on:submit.prevent="taskFormAction()" method="post" class="pm-form">
          
            <div class="item task-title">
                <input v-model="task.title" type="text" name="task_title" class="task_title" :placeholder="add_new_task"  required="required">
            </div>

            <div class="item content">
                <textarea v-model="task_description" name="task_text" class="todo_content" cols="40" :placeholder="task_description_placeholder" rows="2"></textarea>
            </div>

            <div class="item date">
                
                <div class="pm-task-start-field" v-if="task_start_field">
                    <pm-datepickter v-model="task.start_at.date" class="pm-datepickter-from" dependency="pm-datepickter-to" :placeholder="task_start_date"></pm-datepickter>
                    
                </div>

                <div class="pm-task-due-field">
                    <pm-datepickter v-model="task.due_date.date" class="pm-datepickter-to" dependency="pm-datepickter-from" :placeholder="task_due_date"></pm-datepickter>
                </div>
            </div>

            <pm-task-recurrent :recurrant-info="task_recurrent_status"> </pm-task-recurrent>
    
            <div class="item user">
                <div>
                    <multiselect 
                        v-model="task.assignees.data" 
                        :options="project_users" 
                        :multiple="true" 
                        :close-on-select="false"
                        :clear-on-select="false"
                        :hide-selected="true"
                        :show-labels="false"
                        :placeholder="select_user_text"
                        label="display_name"
                        track-by="id">
                            
                    </multiselect>
                </div>
            </div>


            <!-- <div class="item task-title">
                <input v-model="task.estimation" type="number" min="1" class="pm-task-estimation" :placeholder="estimation_placheholder">
            </div> -->
            <pm-do-action hook="pm_task_form" :actionData="task" ></pm-do-action>
            <div class="item submit">
                <span class="pm-new-task-spinner"></span>
                <span v-if="task.id"><input :disabled="submit_disabled" type="submit" class="button-primary" name="submit_todo" :value="update_task"></span>
                <span v-if="!task.id"><input :disabled="submit_disabled" type="submit" class="button-primary" name="submit_todo" :value="add_task"></span>
                <a @click.prevent="showHideTaskFrom(false, list, task )" class="button todo-cancel" href="#">{{ __( 'Cancel', 'wedevs-project-manager') }}</a>
                <span v-show="show_spinner" class="pm-spinner"></span>
            </div>
        </form>

    </div>
</template>

<style>
    .pm-task-estimation {
        width: 100%;
    }
</style>

<script>
import date_picker from './date-picker.vue';
import recurrent from './task-recurrent.vue';
import Mixins from './mixin';

export default {
    // Get passing data for this component. Remember only array and objects are
    props: {
        list: {
            type: Object,
            default: function () {
                return {}
            }
        },

        task: {
            type: Object,
            default: function () {
                return {
                    description: {},
                    due_date: {},
                    assignees: {
                        data: []
                    },
                    estimation: ''
                }
            }
        }
    },

    /**
     * Initial data for this component
     * 
     * @return obj
     */
    data: function() {
        return {
            task_privacy: ( this.task.task_privacy == 'yes' ) ? true : false,
            submit_disabled: false,
            before_edit: jQuery.extend( true, {}, this.task ),
            task_description: this.task.description.content,
            task_recurrent_status: {'recurrent': this.recurrentStatus(this.task.id), }, //recurrentStatus(this.task.id),
            show_spinner: false,
            date_from: '',
            date_to: '',
            assigned_to: [],
            add_new_task: __( 'Add a new task', 'wedevs-project-manager'),
            task_description_placeholder: __( 'Add extra details about this task (optional)', 'wedevs-project-manager'),
            task_start_date: __( 'Start Date', 'wedevs-project-manager'),
            task_due_date: __( 'Due Date', 'wedevs-project-manager'),
            select_user_text: __( 'Select User', 'wedevs-project-manager'),
            update_task: __( 'Update Task', 'wedevs-project-manager'),
            add_task: __( 'Add Task', 'wedevs-project-manager'),
            estimation_placheholder: __('Estimated hour to complete the task', 'wedevs-project-manager')
        }
    },
    mixins: [Mixins],

    components: {
    	'multiselect': pm.Multiselect.Multiselect,
    	'pm-datepickter': date_picker,
        'pm-task-recurrent': recurrent

    },

    beforeMount () {
    	this.setDefaultValue();
    },

    // Initial action for this component
    created: function() {
        this.$on( 'pm_date_picker', this.getDatePicker );
    },

    watch: {
        date_from: function(new_date) {
            this.task.start_at = new_date;
        },

        date_to: function(new_date) {
            this.task.due_date = new_date;
        },
        /**
         * Live check is the task private or not
         * 
         * @param  boolean val 
         * 
         * @return void     
         */
        task_privacy: function( val ) {
            if ( val ) {
                this.task.task_privacy = 'yes';
            } else {
                this.task.task_privacy = 'no';
            }
        }
    },

    computed: {
    	project_users () {
    		return this.$root.$store.state.project_users;
    	},
        /**
         * Check current user can view the todo or not
         * 
         * @return boolean
         */
        todo_view_private: function() {
            if ( ! this.$store.state.projectTaskLists.init.hasOwnProperty('premissions')) {
                return true;
            }

            if ( this.$store.state.projectTaskLists.init.premissions.hasOwnProperty('todo_view_private')) {
                return this.$store.state.projectTaskLists.init.premissions.tdolist_view_private
            }

            return true;
        },

        /**
         * Get and Set task users
         */
        task_assign: {
            /**
             * Filter only current task assgin user from vuex state project_users
             *
             * @return array
             */
            get: function () {
                // var filtered_users = [];

                // if ( this.task.assigned_to && this.task.assigned_to.length ) {
                //     var assigned_to = this.task.assigned_to.map(function (id) {
                //         return parseInt(id);
                //     });


                //     filtered_users = this.project_users.filter(function (user) {
                //         return (assigned_to.indexOf(parseInt(user.id)) >= 0);
                //     });
                // }
                
                return typeof this.task.assignees == 'undefined' ? [] : this.task.assignees.data;
            }, 

            /**
             * Set selected users at task insert or edit time
             * 
             * @param array selected_users 
             */
            set: function ( selected_users ) {
                this.assigned_to = selected_users.map(function (user) {
                    return user.id;
                });
            }
        },
    },

    methods: {
    	setDefaultValue () {
    		if (typeof this.task.assignees !== 'undefined') {
    			var self = this;
	    		this.task.assignees.data.map(function(user) {
	    			self.assigned_to.push(user.id);
	    		});
    		}
    		

    		if (typeof this.task.start_at === 'undefined') {
    			this.task.start_at = {
    				date: ''
    			};
    		}

    		if (typeof this.task.due_date === 'undefined') {
    			this.task.due_date = {
    				date: ''
    			};
    		}
    	},
        /**
         * Set tast start and end date at task insert or edit time
         * 
         * @param  string data 
         * 
         * @return void   
         */
        getDatePicker: function( data ) {
            
            if ( data.field == 'datepicker_from' ) {
                //this.task.start_at = data.date;
            }

            if ( data.field == 'datepicker_to' ) {
                //this.task.due_date = data.date;
            }
        },

        /**
         * Show or hieding task insert and edit form
         *  
         * @param  int list_index 
         * @param  int task_id    
         * 
         * @return void           
         */
        hideNewTaskForm: function(list_index, task_id) {
            var self = this,
                task_index = this.getIndex(this.list.tasks, task_id, 'ID'),
                list_index = this.getIndex( this.$store.state.projectTaskLists.lists, this.list.ID, 'ID' );

            if ( typeof task_id == 'undefined'   ) {
                self.showHideTaskFrom( self.list );
                return;
            }

            this.list.tasks.map(function( task, index ) {
                if ( task.ID == task_id ) {
                    self.showHideTaskFrom( self.list );
                    self.task = jQuery.extend( self.task, self.before_edit );
                }
            }); 
        },

        taskFormAction () {

            // Exit from this function, If submit button disabled 
            if ( this.submit_disabled ) {
                return;
            }

            if(!this.task.title) {
                pm.Toastr.error('Task title required!');
                return false;
            }

            var start = new Date(this.task.start_at.date);

            if(this.task.due_date.date) {
                var end  = new Date(this.task.due_date.date);
                var compare = pm.Moment(end).isBefore(start);

                if(this.task_start_field && compare) {
                    pm.Toastr.error('Invalid date range!');
                    return;
                }
            }
            
            var self = this;
            this.submit_disabled = true;
            // Showing loading option 
            this.show_spinner = true;
            var args = {
                data: {
                    task_id: this.task.id,
                    board_id: this.list.id,
                    assignees: this.filterUserId(this.task.assignees.data),//this.assigned_to,
                    title: this.task.title,
                    description: this.task_description,
                    start_at: this.task.start_at.date,
                    due_date: this.task.due_date.date,
                    list_id: this.list.id,
                    order: this.task.order,
                    estimation: this.task.estimation,
                    recurrent: this.task.recurrent
                },
                callback: function( res ) {
                    self.show_spinner = false;
                    self.submit_disabled = false;
                    self.task_description = res.data.description.content;
                }
            }
            
            if ( typeof this.task.id !== 'undefined' ) {
                self.updateTask ( args );
            } else {
                self.addTask ( args, this.list );
            }
        },

        filterUserId (users) {
            return users.map(function (user) {
                return user.id;
            });
        },

        recurrentStatus (taskId) {
            if(!taskId){
                return "0";
            } else {
                return this.task.recurrent;
            }

        }
    }
}
</script>
