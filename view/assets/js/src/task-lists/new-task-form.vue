<template>
	<div :class="'pm-task-edit-form pm-slide-'+task.id">
		<form action="" v-on:submit.prevent="newTask()" method="post" class="pm-task-form">
	      
	        <div class="item task-title">
	            <input v-model="task.title" type="text" name="task_title" class="task_title" placeholder="Add a new task" value="" required="required">
	        </div>

	        <div class="item content">
	            <textarea v-model="task.description" name="task_text" class="todo_content" cols="40" placeholder="Add extra details about this task (optional)" rows="2"></textarea>
	        </div>

	        <div class="item date">
	            
	            <div class="pm-task-start-field" v-if="task_start_field">
	                <label>Start Date</label>
	                <pm-datepickter v-model="task.start_at.date" class="pm-datepickter-from" dependency="pm-datepickter-to"></pm-datepickter>
	                
	            </div>
	            

	            <div class="pm-task-due-field">
	                <label>Due Date</label>
	                <pm-datepickter v-model="task.due_date.date" class="pm-datepickter-to" dependency="pm-datepickter-from"></pm-datepickter>
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
	                    label="display_name"
	                    track-by="id">
	                        
	                </multiselect>
	            </div>
	        </div>

	        <div class="item submit">
	            <span class="pm-new-task-spinner"></span>
	            <span v-if="task.edit_mode"><input :disabled="submit_disabled" type="submit" class="button-primary" name="submit_todo" value="Update Task"></span>
	            <span v-if="!task.edit_mode"><input :disabled="submit_disabled" type="submit" class="button-primary" name="submit_todo" value="New Task"></span>
	            <a @click.prevent="showHideTaskFrom(false, list, task )" class="button todo-cancel" href="#">Cancel</a>
	            <span v-show="show_spinner" class="pm-spinner"></span>
	        </div>
	    </form>

	</div>
</template>

<script>
	import Multiselect from './../../vue-multiselect/vue-multiselect.min';
	import date_picker from './date-picker.vue';
	
	export default {
	    // Get passing data for this component. Remember only array and objects are
	    props: ['list', 'task'],



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
	            show_spinner: false,
	            date_from: '',
	            date_to: '',
	            assigned_to: []
	        }
	    },

	    components: {
	    	'multiselect': Multiselect,
	    	'pm-datepickter': date_picker
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
	                // var filtered_users = [];

	                // if ( this.task.assigned_to && this.task.assigned_to.length ) {
	                //     var assigned_to = this.task.assigned_to.map(function (id) {
	                //         return parseInt(id);
	                //     });


	                //     filtered_users = this.project_users.filter(function (user) {
	                //         return (assigned_to.indexOf(parseInt(user.id)) >= 0);
	                //     });
	                // }
	                return typeof this.task.assignees === 'undefined' ? [] : this.task.assignees.data;
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
	    //     newTask: function() {
	    //         // Exit from this function, If submit button disabled 
	    //         if ( this.submit_disabled ) {
	    //             return;
	    //         }
	            
	    //         // Disable submit button for preventing multiple click
	    //         this.submit_disabled = true;
	            
	    //         var self      = this,
	    //             is_update = typeof this.task.id == 'undefined' ? false : true,
	                
	    //             form_data = {
	    //                 board_id: this.list.id,
	    //                 assignees: this.assigned_to,
	    //                 title: this.task.title,
	    //                 description: this.task.description,
	    //                 start_at: this.task.start_at.date,
	    //                 due_date: this.task.due_date.date,
	    //                 task_privacy: this.task.task_privacy,
	    //                 list_id: this.list.id,
	    //                 order: this.task.order
	    //             };
	            
	    //         // Showing loading option 
	    //         this.show_spinner = true;
	            
	    //         if (is_update) {
	    //         	var url = self.base_url + '/pm/v2/projects/'+self.project_id+'/tasks/'+this.task.id;
	    //         	var type = 'PUT'; 
	    //         } else {
	    //         	var url = self.base_url + '/pm/v2/projects/'+self.project_id+'/tasks';
	    //         	var type = 'POST';
	    //         }

	    //         var request_data = {
	    //         	url: url,
	    //         	type: type,
	    //         	data: form_data,
	    //         	success (res) {
	    //         		if (is_update) {
	    //         			self.$store.commit('afterUpdateTask', {
	    //         				list_id: self.list.id,
	    //         				task: res.data
	    //         			});
	    //         		} else {
	    //         			self.$store.commit('afterNewTask', {
	    //         				list_id: self.list.id,
	    //         				task: res.data
	    //         			});
	    //         		}
	            		
	    //         		self.show_spinner = false;

	    //                 // Display a success toast, with a title
	    //                 toastr.success(res.data.success);
                   
	    //                 self.submit_disabled = false;
	    //                 self.showHideTaskFrom(false, self.list, self.task);
	    //         	},

	    //         	error (res) {
	    //         		self.show_spinner = false;
	                    
	    //                 // Showing error
	    //                 res.data.error.map( function( value, index ) {
	    //                     toastr.error(value);
	    //                 });
	    //                 self.submit_disabled = false;
	    //         	}
	    //         }
	            
	    //         self.httpRequest(request_data);
	    //     }
	    }
	}
</script>
