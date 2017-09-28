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
    
    	
        <div v-if="!loading" class="modal-mask half-modal cpm-task-modal modal-transition" style="">

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
                                        <span class="cpm-mark-done-checkbox">
                                        	<input v-model="task.status" @click="singleTaskDoneUndone()" class="" type="checkbox">
                                        </span>
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
                                                	:class="lineThrough(task) + ' cpm-task-title-activity cpm-task-title-span'" 
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
                                            <span v-if="task.assignees.data.length" class='cpm-assigned-user' 
                                                @click.prevent="isEnableMultiSelect()"
                                                v-for="user in task.assignees.data">
                                                
                                                <a href="#" :title="user.display_name">
                                                	<img :alt="user.display_name" :src="user.avatar_url" class="avatar avatar-48 photo" height="48" width="48">
                                                </a>
                                            </span>

                                            <span v-if="!task.assignees.data.length" class='cpm-assigned-user' 
                                                @click.prevent="isEnableMultiSelect()">
                                                <i style="font-size: 20px;" class="fa fa-user" aria-hidden="true"></i>
                                            </span>
										    
										    <div v-if="is_enable_multi_select" @click.prevent="afterSelect" class="cpm-multiselect cpm-multiselect-single-task">

										        <multiselect 
										            v-model="task_assign" 
										            :options="project_users" 
										            :multiple="true" 
										            :close-on-select="false"
										            :clear-on-select="true"
										            :hide-selected="false"
										            :show-labels="true"
										            placeholder="Select User"
										            select-label=""
										            selected-label="selected"
										            deselect-label=""
										            :taggable="true"
										            label="display_name"
										            track-by="id"
										            :allow-empty="true">

										            <template  slot="option" scope="props">
										                <div>
										                    <img height="16" width="16" class="option__image" :src="props.option.avatar_url" alt="No Man’s Sky">
										                    <div class="option__desc">
										                        <span class="option__title">{{ props.option.display_name }}</span>
										                        <!-- <span class="option__small">{{ props.option.desc }}</span> -->
										                    </div>
										                </div>
										            </template>
										                
										        </multiselect>               
										    </div>

	                                        </span>

	                                        <span v-if="(task.start_at.date || task.due_date.date )" :class="taskDateWrap(task.due_date.date) + ' cpm-task-date-wrap cpm-date-window'">
	                                            <span 
	                                                @click.prevent="isTaskDateEditMode()"
	                                                v-bind:class="task.status ? completedTaskWrap(task.start_at.date, task.due_date.date) : taskDateWrap( task.start_at.date, task.due_date.date)">
	                                                <span v-if="task_start_field">
	                                                    <!-- <span class="dashicons cpm-date-edit-btn dashicons-edit" title="<?php _e( 'Edit Task Description', 'cpm' ); ?>"></span> -->
	                                                    {{ dateFormat( task.start_at.date ) }}
	                                                </span>

	                                                <span v-if="isBetweenDate( task_start_field, task.start_at.date, task.due_date.date )">&ndash;</span>
	                                                <span v-if="task.due_date">
	                                                    <!-- <span class="dashicons cpm-date-edit-btn dashicons-edit" title="<?php _e( 'Edit Task Description', 'cpm' ); ?>"></span> -->
	                                                    {{ dateFormat( task.due_date.date ) }}
	                                                </span>

	                                            </span>

	                                            <div class="cpm-date-update-wrap" v-if="is_task_date_edit_mode">
	                                                <div v-if="task_start_field" v-cpm-datepicker class="cpm-date-picker-from cpm-inline-date-picker-from"></div>
	                                                <div v-cpm-datepicker class="cpm-date-picker-to cpm-inline-date-picker-to"></div>
	                                                <div class="clearfix cpm-clear"></div>
	                                            </div>

	                                            
	                                        </span>

	                                        <span v-if="(!task.start_at.date && !task.due_date.date)" class="cpm-task-date-wrap cpm-date-window">
	                                            <span 
	                                                @click.prevent="isTaskDateEditMode()"
	                                                v-bind:class="task.status ? completedTaskWrap(task.start_at.date, task.due_date.date) : taskDateWrap( task.start_at.date, task.due_date.date)">
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

	                                        <span class="cpm-task-comment-count">{{ task.comments.data.length }} Comments</span>
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
                                            <task-comments :comments="task.comments.data"></task-comments>
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
	import Vue from './../../vue/vue';
	import comments from './task-comments.vue';
	import Multiselect from './../../vue-multiselect/vue-multiselect.min';

	export default {
		beforeRouteEnter (to, from, next) {
            next(vm => {
                vm.getTask(vm);
            });
        },
	    data: function() {
	        return {
	            loading: true,
	            is_task_title_edit_mode: false,
	            is_task_details_edit_mode: false,
	            is_task_date_edit_mode: false,
	            is_enable_multi_select: false,
	            task_id: this.$route.params.task_id,
	            list: {},
	            task: {},
	            assigned_to: []
	        }
	    },

	    computed: {
	    	// task () {
	    	// 	return this.$store.state.task;
	    	// },
	        project_users: function() {
	            return this.$root.$store.state.project_users;
	        },
	        task_users () {
	        	if (jQuery.isEmptyObject(this.$store.state.task)) {
	        		return [];
	        	}
	        	return this.$store.state.task.assignees.data;
	        },

	        // comments () {
	        // 	if (jQuery.isEmptyObject(this.$store.state.task)) {
	        // 		return [];
	        // 	}
	     
	        // 	return this.$store.state.task.comments.data;
	        // },

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
	                this.assigned_to = this.task.assignees.data.map(function (user) {
	                    return user.id;
	                });
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

	                this.task.assignees.data = selected_users;

	                this.updateTaskElement(this.task);
	            }
	        },
	    },

	    components: {
	    	'task-comments': comments,
	    	'multiselect': Multiselect
	    },

	    created: function() {
	        window.addEventListener('click', this.windowActivity);
	        
	        this.$root.$on('cpm_date_picker', this.fromDate);
	    },


	    methods: {
	    	lineThrough (task) {
	    		if ( task.status ) {
	    			return 'pm-line-through';
	    		}
	    	},
	    	singleTaskDoneUndone: function() {

	            var self = this;
	            var url  = self.base_url + '/cpm/v2/projects/'+self.project_id+'/tasks/'+self.task.id;
	            var type = 'PUT'; 

	            var form_data = {
	                'status': self.task.status ? 1 : 0
	            }
	            
	            var request_data = {
	                url: url,
	                type: type,
	                data: form_data,
	                success (res) {
	                    
	                },
	            }
	            
	            self.httpRequest(request_data);
	               
	        },
	    	getTask: function(self) {
	    		
	            var request = {
	           		url: self.base_url + '/cpm/v2/projects/'+self.project_id+'/tasks/'+self.task_id+'?with=boards,comments',
	           		success (res) {
	           			self.addMeta(res.data);
	           			self.list = res.data.boards.data[0];
	           			//self.$store.commit('setSingleTask', res.data);
	           			self.task = res.data;
	           			self.loading = false;

	           			console.log(res.data);
	           		}
	            }

	            self.httpRequest(request);
	        },

	        addMeta (task) {
	        	if (task.status === 'complete') {
	        		task.status = true;
	        	} else {
	        		task.status = false;
	        	}

	        	task.comments.data.map(function(comment) {
	        		comment.edit_mode = false;
	        	});
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

	                task.start_at = date.date;
	                this.updateTaskElement(task);
	            }

	            if ( date.field == 'datepicker_to' ) {
	                var task = this.task;
	 
	                var start = new Date( task.start_at ),
	                    due = new Date( date.date );

	                if ( !this.$store.state.permissions.task_start_field ) {
	                    task.due_date.date = date.date;
	                    this.updateTaskElement(task);
	                } else if ( start <= due ) {
	                    task.due_date.date = date.date;
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

	            Vue.nextTick(function() {
	                jQuery('.cpm-desc-field').focus();
	            });
	        },

	        updateDescription: function(task, event) {
	            if ( event.keyCode == 13 && event.shiftKey ) {
	                return;
	            }

	            this.is_task_details_edit_mode = false,
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
	                    'title': task.title,
						'description': task.description,
						'estimation': task.estimation,
						'start_at': task.start_at ? task.start_at.date : '',
						'due_date': task.due_date ? task.due_date.date : '',
						'complexity': task.complexity,
						'priority': task.priority,
						'order': task.order,
						'payable': task.payable,
						'recurrent': task.recurrent,
						'status': task.status,
						'category_id': task.category_id,
						'assignees': this.assigned_to
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

<style>
	.pm-line-through {
		text-decoration: line-through;
	}
	.cpm-multiselect-single-task {
		position: absolute;
	}
</style>



