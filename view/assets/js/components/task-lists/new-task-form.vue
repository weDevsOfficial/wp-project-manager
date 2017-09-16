<template>
	<div :class="'cpm-task-edit-form cpm-slide-'+task.id">
	      <form action="" v-on:submit.prevent="newTask()" method="post" class="cpm-task-form">
	      
	        <div class="item task-title">
	            <input v-model="task.title" type="text" name="task_title" class="task_title" placeholder="Add a new task" value="" required="required">
	        </div>

	        <div class="item content">
	            <textarea v-model="task.description" name="task_text" class="todo_content" cols="40" placeholder="Add extra details about this task (optional)" rows="2"></textarea>
	        </div>

	        <div class="item date">
	            
	            <div class="cpm-task-start-field" v-if="task_start_field">
	                <label>Start Date</label>
	                <cpm-datepickter v-model="task.start_date" class="cpm-datepickter-from" dependency="cpm-datepickter-to"></cpm-datepickter>
	                
	            </div>
	            

	            <div class="cpm-task-due-field">
	                <label>Due Date</label>
	                <cpm-datepickter v-model="task.due_date" class="cpm-datepickter-to" dependency="cpm-datepickter-from"></cpm-datepickter>
	            </div>
	        </div>

	        <div class="item user">
	            
	            <div>
	                <multiselect 
	                    v-model="task_assign" 
	                    :options="project_users" 
	                    :multiple="true" 
	                    :close-on-select="false"
	                    :clear-on-select="false"
	                    :hide-selected="true"
	                    :show-labels="false"
	                    placeholder="Select User"
	                    label="name"
	                    track-by="id">
	                        
	                </multiselect>
	            </div>
	        </div>

	        <div class="item submit">
	            <span class="cpm-new-task-spinner"></span>
	            <span v-if="task.edit_mode"><input :disabled="submit_disabled" type="submit" class="button-primary" name="submit_todo" value="Update Task"></span>
	            <span v-if="!task.edit_mode"><input :disabled="submit_disabled" type="submit" class="button-primary" name="submit_todo" value="New Task"></span>
	            <a @click.prevent="showHideTaskFrom(list)" class="button todo-cancel" href="#">Cancel</a>
	            <span v-show="show_spinner" class="cpm-spinner"></span>
	        </div>
	    </form>
	</div>
</template>

<script>
	import Multiselect from './../../vue-multiselect/vue-multiselect.min';
	import date_picker from './date-picker.vue';
	
	export default {
	    // Get passing data for this component. Remember only array and objects are
	    props: ['list', 'list_index', 'task', 'task_index'],



	    /**
	     * Initial data for this component
	     * 
	     * @return obj
	     */
	    data: function() {
	        return {
	            project_users: this.$store.state.project_users,
	            task_privacy: ( this.task.task_privacy == 'yes' ) ? true : false,
	            submit_disabled: false,
	            before_edit: jQuery.extend( true, {}, this.task ),
	            show_spinner: false,
	            date_from: '',
	            date_to: '',
	        }
	    },

	    components: {
	    	'multiselect': Multiselect,
	    	'cpm-datepickter': date_picker
	    },

	    // Initial action for this component
	    created: function() {
	        this.$on( 'cpm_date_picker', this.getDatePicker );
	    },

	    watch: {
	        date_from: function(new_date) {
	            this.task.start_date = new_date;
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
	        /**
	         * Check current user can view the todo or not
	         * 
	         * @return boolean
	         */
	        todo_view_private: function() {
	            if ( ! this.$store.state.init.hasOwnProperty('premissions')) {
	                return true;
	            }

	            if ( this.$store.state.init.premissions.hasOwnProperty('todo_view_private')) {
	                return this.$store.state.init.premissions.tdolist_view_private
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
	                var filtered_users = [];

	                if ( this.task.assigned_to && this.task.assigned_to.length ) {
	                    var assigned_to = this.task.assigned_to.map(function (id) {
	                        return parseInt(id);
	                    });


	                    filtered_users = this.project_users.filter(function (user) {
	                        return (assigned_to.indexOf(parseInt(user.id)) >= 0);
	                    });
	                }

	                return filtered_users;
	            }, 

	            /**
	             * Set selected users at task insert or edit time
	             * 
	             * @param array selected_users 
	             */
	            set: function ( selected_users ) {
	                this.task.assigned_to = selected_users.map(function (user) {
	                    return user.id;
	                });
	            }
	        },
	    },

	    methods: {
	        /**
	         * Set tast start and end date at task insert or edit time
	         * 
	         * @param  string data 
	         * 
	         * @return void   
	         */
	        getDatePicker: function( data ) {
	            
	            if ( data.field == 'datepicker_from' ) {
	                //this.task.start_date = data.date;
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
	                list_index = this.getIndex( this.$store.state.lists, this.list.ID, 'ID' );

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

	        /**
	         * Insert and edit task
	         * 
	         * @return void
	         */
	        newTask: function() {
	            // Exit from this function, If submit button disabled 
	            if ( this.submit_disabled ) {
	                return;
	            }
	            
	            // Disable submit button for preventing multiple click
	            this.submit_disabled = true;

	            var self      = this,
	                is_update = typeof this.task.id == 'undefined' ? false : true,
	                
	                form_data = {
	                	project_id: self.project_id,
	                    board_id: this.list.id,
	                    assign: this.task.assigned_to,
	                    title: this.task.title,
	                    description: this.task.description,
	                    start_at: this.task.start_date,
	                    due_date: this.task.due_date,
	                    task_privacy: this.task.task_privacy,
	                    list_id: this.list.id,
	                    task_id: typeof this.task.ID == 'undefined' ? false : this.task.ID,
	                };
	            
	            // Showing loading option 
	            this.show_spinner = true;

	            var request_data = {
	            	url: self.base_url + '/cpm/v2/projects/1/tasks',
	            	type: 'POST',
	            	data: form_data,
	            	success (res) {

	            		self.show_spinner = false;

	                    // Display a success toast, with a title
	                    toastr.success(res.data.success);

	                    if ( form_data.task_id ) {
	                        self.list.tasks.map(function( task, index ) {
	                            if ( task.ID == form_data.task_id ) {
	                                self.showHideTaskFrom( self.list );
	                            }
	                        }); 
	                        
	                    } else {
	                        // Hide the todo list update form
	                        self.showHideTaskFrom( self.list );  
	                        self.task_privacy = false;  
	                    }
	                    
	                    if ( ! form_data.task_id ) {
	                    	self.list.push(res.data);
	                        //var list_index = self.getIndex( self.$store.state.lists, self.list.ID, 'ID' );
	                        // Update vuex state lists after insert or update task 
	                       // self.$store.commit( 'update_task', { res: res, list_index: list_index, is_update: is_update } );    
	                    }
	                    self.submit_disabled = false;
	                    
	                    //self.$forceUpdate();
	            	},

	            	error (res) {
	            		self.show_spinner = false;
	                    
	                    // Showing error
	                    res.data.error.map( function( value, index ) {
	                        toastr.error(value);
	                    });
	                    self.submit_disabled = false;
	            	}
	            }

	            self.httpRequest(request_data);
	        }
	    }
	}
</script>
