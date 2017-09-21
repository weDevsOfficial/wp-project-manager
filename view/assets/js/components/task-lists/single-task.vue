<template>
	<div>

	    <!-- Spinner before load task -->
	    <div v-if="loading" class="modal-mask half-modal cpm-task-modal modal-transition">
	        <div class="modal-wrapper">
	            <div class="modal-container" style="width: 700px; height: 20000px;">
	                <span class="close-vue-modal">
	                    <a class="" @click.prevent="closePopup()"><span class="dashicons dashicons-no"></span></a>
	                </span>

	                <div class="modal-body cpm-todolist">
	                    
	                    <!-- Spinner before load task -->
	                    <div class="cpm-data-load-before" >
	                        <div class="loadmoreanimation">
	                            <div class="load-spinner">
	                                <div class="rect1"></div>
	                                <div class="rect2"></div>
	                                <div class="rect3"></div>
	                                <div class="rect4"></div>
	                                <div class="rect5"></div>
	                            </div>
	                        </div>
	                    </div>
	                </div>
	            </div>
	        </div>
	    </div>
    
    	
        <div class="modal-mask half-modal cpm-task-modal modal-transition" style="">

            <div class="modal-wrapper">
                <div class="modal-container" style="width: 700px;">
                    <span class="close-vue-modal">
                        <a class="" @click.prevent="closePopup()"><span class="dashicons dashicons-no"></span></a>
                    </span>

                    <div class="modal-body cpm-todolist">
                        <div class="cpm-col-12 cpm-todo">
                            <div class="cpm-modal-conetnt">
                                <div class="cmp-task-header">
                                    <h3 class="cpm-task-title"> 
                                        <span class="cpm-mark-done-checkbox"><input v-model="task.completed" @click="taskDoneUndone( task, task.completed )" class="" type="checkbox"></span>
                                        <span :class="singleTaskTitle(task) + ' cpm-task-title-wrap'">
                                            <div class="cpm-task-title-text">
                                                
                                                <span  v-if="is_task_title_edit_mode">
                                                    <input 
                                                        v-model="task.title"
                                                        @blur="updateTaskElement(task)" 
                                                        @keyup.enter="updateTaskElement(task)"
                                                        :value="task.title" 
                                                        class="cpm-task-title-activity cpm-task-title-field"
                                                        type="text">
                                                </span>
                                                
                                                <span 
                                                	class="cpm-task-title-activity cpm-task-title-span" 
                                                	v-if="!is_task_title_edit_mode" 
                                                	@click.prevent="isTaskTitleEditMode()">
                                                	{{ task.title }}
                                                </span>
                                            </div>
                                           <!--  <div class="cpm-task-title-meta">
                                                <span v-if="task.task_privacy == 'yes'" @click.prevent="updateTaskPrivacy(task, 'no')" v-cpm-tiptip class="dashicons dashicons-lock cpm-tiptip" title="<?php _e( 'Make public', 'cpm' ); ?>"></span>
                                                <span v-if="task.task_privacy != 'yes'" @click.prevent="updateTaskPrivacy(task, 'yes')" v-cpm-tiptip class="dashicons dashicons-unlock cpm-tiptip" title="<?php _e( 'Make private', 'cpm' ); ?>"></span>
                                                
                                            </div> -->
                                            <div class="clearfix cpm-clear"></div>
                                        </span>

                                        <div class="clearfix cpm-clear"></div>
                                    </h3>
                                    
                                    <div  class="cpm-task-meta">
                                        <span  class="cpm-assigned-user-wrap">
                                            <span v-if="task_users" class='cpm-assigned-user' 
                                                @click.prevent="isEnableMultiSelect()"
                                                v-for="user in task_users" 
                                                v-html="user.user_url">

                                            </span>

                                            <span v-if="!task_users.length" class='cpm-assigned-user' 
                                                @click.prevent="isEnableMultiSelect()"
                                                >
                                                <i style="font-size: 20px;" class="fa fa-user" aria-hidden="true"></i>
                                            </span>
										    
											    <div v-if="task_users.length && is_enable_multi_select" @click.prevent="afterSelect" class="cpm-multiselect cpm-multiselect-single-task">

											        <multiselect 
											            v-model="task_assign" 
											            :options="project_users" 
											            :multiple="true" 
											            :close-on-select="false"
											            :clear-on-select="true"
											            :hide-selected="false"
											            :show-labels="true"
											            placeholder="<?php _e( 'Select User', 'cpm' ); ?>"
											            select-label=""
											            selected-label="selected"
											            deselect-label=""
											            :taggable="true"
											            label="name"
											            track-by="id"
											            :allow-empty="true">

											            <template  slot="option" scope="props">
											                <div>
											                    <img height="16" width="16" class="option__image" :src="props.option.img" alt="<?php _e( 'No Man’s Sky', 'cpm' ); ?>">
											                    <div class="option__desc">
											                        <span class="option__title">{{ props.option.title }}</span>
											                        <!-- <span class="option__small">{{ props.option.desc }}</span> -->
											                    </div>
											                </div>
											            </template>
											                
											        </multiselect>               
											    </div>

	                                        </span>


	                                        <span v-if="(task.start_date != '' || task.due_date != '')" class="cpm-task-date-wrap cpm-date-window">
	                                            <span 
	                                                @click.prevent="isTaskDateEditMode()"
	                                                v-bind:class="task.completed ? completedTaskWrap(task.start_date, task.due_date) : taskDateWrap( task.start_date, task.due_date)">
	                                                <span v-if="task_start_field">
	                                                    <!-- <span class="dashicons cpm-date-edit-btn dashicons-edit" title="<?php _e( 'Edit Task Description', 'cpm' ); ?>"></span> -->
	                                                    {{ dateFormat( task.start_date ) }}
	                                                </span>

	                                                <span v-if="isBetweenDate( task_start_field, task.start_date, task.due_date )">&ndash;</span>
	                                                <span>
	                                                    <!-- <span class="dashicons cpm-date-edit-btn dashicons-edit" title="<?php _e( 'Edit Task Description', 'cpm' ); ?>"></span> -->
	                                                    {{ dateFormat( task.due_date ) }}
	                                                </span>

	                                            </span>

	                                            <div class="cpm-date-update-wrap" v-if="is_task_date_edit_mode">
	                                                <div v-if="task_start_field" v-cpm-datepicker class="cpm-date-picker-from cpm-inline-date-picker-from"></div>
	                                                <div v-cpm-datepicker class="cpm-date-picker-to cpm-inline-date-picker-to"></div>
	                                                <div class="clearfix cpm-clear"></div>
	                                            </div>

	                                            
	                                        </span>

	                                        <span v-if="(task.start_date == '' && task.due_date == '')" class="cpm-task-date-wrap cpm-date-window">
	                                            <span 
	                                                @click.prevent="isTaskDateEditMode()"
	                                                v-bind:class="task.completed ? completedTaskWrap(task.start_date, task.due_date) : taskDateWrap( task.start_date, task.due_date)">
	                                                <span>
	                                                    <!-- <span class="dashicons cpm-date-edit-btn dashicons-edit" title="<?php _e( 'Edit Task Description', 'cpm' ); ?>"></span> -->
	                                                    <i style="font-size: 20px;" class="fa fa-calendar" aria-hidden="true"></i>
	                                                </span>

	            

	                                            </span>

	                                            <div class="cpm-date-update-wrap" v-if="is_task_date_edit_mode">
	                                                <div v-if="task_start_field" v-cpm-datepicker class="cpm-date-picker-from cpm-inline-date-picker-from"></div>
	                                                <div v-cpm-datepicker class="cpm-date-picker-to cpm-inline-date-picker-to"></div>
	                                                <div class="clearfix cpm-clear"></div>
	                                            </div>

	                                            
	                                        </span>

	                                        <span class="cpm-task-comment-count">{{ comments.length }} Comments</span>
	                                </div>
	                            </div>


                                <div  class="task-details">
                                                
                                    <!--v-if-->
                                    
                                    <p class="cpm-des-area cpm-desc-content" v-if="!is_task_details_edit_mode" @click.prevent="isTaskDetailsEditMode()">
                                        <span v-if="task.description !== ''" v-html="task.description"></span>
                                        <span style="margin-left: -3px;" v-if="!task.description">
                                        	<i style="font-size: 16px;"  class="fa fa-pencil" aria-hidden="true"></i>
                                        	&nbsp;Update Description
                                        </span>

                                    </p>
                                                                        <!-- @keyup.enter="updateTaskElement(task)" -->
                                    <textarea 
                                        v-prevent-line-break
                                        @blur="updateDescription(task, $event)" 
                                        @keyup.enter="updateDescription(task, $event)"
                                        class="cpm-des-area cpm-desc-field" 
                                        v-if="is_task_details_edit_mode"
                                        v-model="task.description">
                                            
                                    </textarea>
                                    <div v-if="is_task_details_edit_mode" class="cpm-help-text">
                                    	<span>Shift+Enter for line break</span>
                                    </div>
                                    
                                    <div class="clearfix cpm-clear"></div>
                                </div>
	                                
                                <div class="cpm-todo-wrap clearfix">
                                    <div class="cpm-task-comment">
                                        <div class="comment-content">
                                            <task-comments :comments="comments" :task="task"></task-comments>
                                        </div>
                                    </div>
                                </div>          
	                        </div>
	                        <div class="clearfix"></div>
	                    </div>
	                </div>
	                <div class="clearfix"></div>
	            </div>
	        </div>
	    </div>
	    
	</div>

</template>

<script>
	import comments from './task-comments.vue';

	export default {
		beforeRouteEnter (to, from, next) {
            next(vm => {
                vm.getTask(vm);
            });
        },
	    data: function() {
	        return {
	            task: typeof this.$route.params.task == 'undefined' ? false : this.$route.params.task,
	            loading: true,
	            is_task_title_edit_mode: false,
	            is_task_details_edit_mode: false,
	            is_task_date_edit_mode: false,
	            is_enable_multi_select: false,
	            task_id: this.$route.params.task_id,
	            task: {}
	        }
	    },

	    computed: {
	        project_users: function() {
	            var self = this;
	            this.$store.state.project_users.map(function(user) {
	                user.title = user.name;
	                user.img  = user.avatar_url;
	            });
	            
	            return this.$store.state.project_users;
	        },
	        task_users () {
	        	if (jQuery.isEmptyObject(this.task.data)) {
	        		return [];
	        	}
	        	return this.task.data.assignees.data;
	        },

	        comments () {
	        	if (jQuery.isEmptyObject(this.task.data)) {
	        		return [];
	        	}
	        	return this.task.data.comments.data;
	        },

	        task_assign: {
	            get: function() {
	                var self = this;
	                var filtered_user = this.$store.state.project_users.filter(function(user) {
	                    var has_user = self.task.assigned_to.indexOf(String(user.id) );
	                    if ( has_user != '-1' ) {
	                        return true;
	                    }
	                });

	                return filtered_user;
	            },

	            set: function(user) {
	                var task = this.task,
	                    assign = [];
	                
	                user.map(function( set_user, key ) {
	                    assign.push(String(set_user.id));
	                });
	                
	                task.assigned_to = assign;

	                this.updateTaskElement(task);
	            }
	        },
	    },

	    components: {
	    	'task-comments': comments
	    },

	    created: function() {
	        window.addEventListener('click', this.windowActivity);
	        
	        this.$root.$on('cpm_date_picker', this.fromDate);
	    },


	    methods: {
	    	getTask: function(self) {
	            var request = {
	           		url: self.base_url + '/cpm/v2/projects/'+self.project_id+'/tasks/'+self.task_id+'?with=boards,comments',
	           		success (res) {

	           			self.task = res.data;	           		
	           		}
	            }

	            self.httpRequest(request);
	        },


	        afterSelect: function(selectedOption, id, event) {
	            //jQuery('.cpm-multiselect').find('.multiselect__tags').find('.multiselect__tag').remove(); 
	        },
	        isEnableMultiSelect: function() {
	            this.is_enable_multi_select = true;

	            Vue.nextTick(function() {
	                jQuery('.multiselect__input').focus();
	            });
	        }, 

	        fromDate: function(date) {
	            if ( date.field == 'datepicker_from' ) {
	                var task = this.task;

	                task.start_date = date.date;
	                this.updateTaskElement(task);
	            }

	            if ( date.field == 'datepicker_to' ) {
	                var task = this.task;
	 
	                var start = new Date( task.start_date ),
	                    due = new Date( date.date );

	                if ( !this.$store.state.permissions.task_start_field ) {
	                    task.due_date = date.date;
	                    this.updateTaskElement(task);
	                } else if ( start <= due ) {
	                    task.due_date = date.date;
	                    this.updateTaskElement(task);
	                }
	            }
	        },
	        updateTaskPrivacy: function(task, status) {
	            task.task_privacy = status;
	            this.updateTaskElement(task);
	        },
	        isTaskDetailsEditMode: function() {
	            this.is_task_details_edit_mode = true;

	            //Vue.nextTick(function() {
	                jQuery('.cpm-desc-field').focus();
	            //});
	        },

	        updateDescription: function(task, event) {
	            if ( event.keyCode == 13 && event.shiftKey ) {
	                return;
	            }

	            is_task_details_edit_mode = false,
	            this.updateTaskElement(task);
	        },

	        closePopup: function() {
	        	var self = this;
	            // named route
				self.$router.push({ 
					name: 'task_lists', 
					params: { 
						project_id: self.project_id 
					}
				});
	        },

	        singleTaskTitle: function(task) {
	            return task.completed ? 'cpm-task-complete' : 'cpm-task-incomplete';
	        },

	        updateTaskElement: function(task) {
	            
	            var update_data  = {
	                    title: task.title,
						description: task.description,
						estimation: task.estimation,
						start_at: task.start_at ? task.start_at.date : '',
						due_date: task.due_date ? task.due_date.date : '',
						complexity: task.complexity,
						priority: task.priority,
						order: task.order,
						payable: task.payable,
						recurrent: task.recurrent,
						status: task.status,
						category_id: task.category_id
	                },
	                self = this,
	                url = this.base_url + '/cpm/v2/projects/'+this.project_id+'/tasks/'+task.id;

	            var request_data = {
	            	url: url,
	            	data: update_data,
	            	type: 'PUT',
	            	success (res) {
	                    self.is_task_title_edit_mode = false;
	                    self.is_task_details_edit_mode = false;
	                    self.is_enable_multi_select = false;
	            	}
	            }
	            
	            this.httpRequest(request_data);
	        },

	        isTaskTitleEditMode: function() {
	            this.is_task_title_edit_mode = true;
	        },

	        isTaskDateEditMode: function() {
	            this.is_task_date_edit_mode = true;
	        },

	        windowActivity: function(el) {
	            var title_blur      = jQuery(el.target).hasClass('cpm-task-title-activity'),
	                dscription_blur = jQuery(el.target).hasClass('cpm-des-area'),
	                assign_user    =  jQuery(el.target).closest( '.cpm-assigned-user-wrap' );
	                
	            if ( ! title_blur ) {
	                this.is_task_title_edit_mode = false;
	            }
	            
	            if ( ! dscription_blur ) {
	                this.is_task_details_edit_mode = false;
	            }

	            if ( ! assign_user.length ) {
	                this.is_enable_multi_select = false;
	            }

	            this.datePickerDispaly(el);
	            
	        },

	        datePickerDispaly: function(el) {
	            var date_picker_blur       = jQuery(el.target).closest('.cpm-task-date-wrap').hasClass('cpm-date-window');
	            
	            if ( ! date_picker_blur ) {
	                this.is_task_date_edit_mode = false;
	            }
	        }
	    }
	}
</script>