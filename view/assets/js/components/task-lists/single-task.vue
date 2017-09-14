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
    
    	<div v-if="is_single_task">
        <div v-if="task" class="modal-mask half-modal cpm-task-modal modal-transition" style="">

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
                                                        v-model="task.post_title"
                                                        @blur="updateTaskElement(task)" 
                                                        @keyup.enter="updateTaskElement(task)"
                                                        :value="task.post_title" 
                                                        class="cpm-task-title-activity cpm-task-title-field"
                                                        type="text">
                                                </span>
                                                
                                                <span class="cpm-task-title-activity cpm-task-title-span" v-if="!is_task_title_edit_mode" @click.prevent="isTaskTitleEditMode()">{{ task.post_title }}</span>
                                            </div>
                                            <div class="cpm-task-title-meta">
                                                <span v-if="task.task_privacy == 'yes'" @click.prevent="updateTaskPrivacy(task, 'no')" v-cpm-tiptip class="dashicons dashicons-lock cpm-tiptip" title="<?php _e( 'Make public', 'cpm' ); ?>"></span>
                                                <span v-if="task.task_privacy != 'yes'" @click.prevent="updateTaskPrivacy(task, 'yes')" v-cpm-tiptip class="dashicons dashicons-unlock cpm-tiptip" title="<?php _e( 'Make private', 'cpm' ); ?>"></span>
                                                <!-- <a v-if="!is_task_title_edit_mode" href="#" class="cpm-todo-edit" @click.prevent="isTaskTitleEditMode()"><span class="dashicons dashicons-edit cpm-task-title-activity" title="<?php _e( 'Edit Task Title', 'cpm' ); ?>"></span></a> -->
                                            </div>
                                            <div class="clearfix cpm-clear"></div>
                                        </span>

                                        <div class="clearfix cpm-clear"></div>
                                    </h3>
                                    
                                    <div  class="cpm-task-meta">
                                        <span  class="cpm-assigned-user-wrap">
                                            <span v-if="task_assign.length" class='cpm-assigned-user' 
                                                @click.prevent="isEnableMultiSelect()"
                                                v-for="user in getUsers( task.assigned_to )" 
                                                v-html="user.user_url">

                                            </span>
                                            <span v-if="!task_assign.length" class='cpm-assigned-user' 
                                                @click.prevent="isEnableMultiSelect()"
                                                >
                                                <i style="font-size: 20px;" class="fa fa-user" aria-hidden="true"></i>
                                            </span>
    
	    <div v-if="task_assign.length && is_enable_multi_select" @click.prevent="afterSelect" class="cpm-multiselect cpm-multiselect-single-task">

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

	                                        <span class="cpm-task-comment-count">{{ task.comments.length }} <?php _e( 'Comments', 'cpm' ); ?></span>
	                                    </div>
	                                </div>


	                                <div  class="task-details">
	                                                
	                                    <!--v-if-->
	                                    
	                                    <p class="cpm-des-area cpm-desc-content" v-if="!is_task_details_edit_mode" @click.prevent="isTaskDetailsEditMode()">
	                                        <span v-if="!task.post_content == ''" v-html="task.post_content"></span>
	                                        <span style="margin-left: -3px;" v-if="task.post_content == ''"><i style="font-size: 16px;"  class="fa fa-pencil" aria-hidden="true"></i>&nbsp;&nbsp<?php _e( 'Update Description', 'cpm' ); ?></span>

	                                    </p>
	                                                                        <!-- @keyup.enter="updateTaskElement(task)" -->
	                                    <textarea 
	                                        v-prevent-line-break
	                                        @blur="updateDescription(task, $event)" 
	                                        @keyup.enter="updateDescription(task, $event)"
	                                        class="cpm-des-area cpm-desc-field" 
	                                        v-if="is_task_details_edit_mode"
	                                        v-model="task.post_content">
	                                            
	                                        </textarea>
	                                    <div v-if="is_task_details_edit_mode" class="cpm-help-text"><span><?php _e('Shift+Enter for line break', 'cpm'); ?></span></div>

	                                    <div class="clearfix cpm-clear"></div>
	                                </div>
	                                
	                                <?php do_action( 'after_task_details' ); ?>    

	                                <div class="cpm-todo-wrap clearfix">
	                                    <div class="cpm-task-comment">
	                                        <div class="comment-content">
	                                            <cpm-task-comments :comments="task.comments" :task="task"></cpm-task-comments>
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
	</div>

</template>

<script>
	export default {
	    data: function() {
	        return {
	            task: typeof this.$route.params.task == 'undefined' ? false : this.$route.params.task,
	            loading: true,
	            is_task_title_edit_mode: false,
	            is_task_details_edit_mode: false,
	            is_task_date_edit_mode: false,
	            is_enable_multi_select: false
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

	    created: function() {
	        this.getTask();
	        window.addEventListener('click', this.windowActivity);
	        
	        this.$root.$on('cpm_date_picker', this.fromDate);
	    },


	    methods: {

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

	            Vue.nextTick(function() {
	                jQuery('.cpm-desc-field').focus();
	            });
	        },

	        updateDescription: function(task, event) {
	            if ( event.keyCode == 13 && event.shiftKey ) {
	                return;
	            }

	            is_task_details_edit_mode = false,
	            this.updateTaskElement(task);
	        },

	        closePopup: function() {
	            this.$store.commit( 'close_single_task_popup' );
	            
	            if ( this.$route.name == 'list_task_single_under_todo'  ) {
	                var list_id = this.task.post_parent,
	                    push_url = '/list/'+list_id;
	                this.$router.push(push_url);
	            } else {
	                this.$router.push('/');
	            }
	        },

	        singleTaskTitle: function(task) {
	            return task.completed ? 'cpm-task-complete' : 'cpm-task-incomplete';
	        },

	        getTask: function() {
	            if ( ! this.$route.params.task_id ) {
	                this.loading = false;
	                return;
	            }
	        
	            var request_data  = {
	                task_id: this.$route.params.task_id,
	                project_id: PM_Vars.project_id,
	                _wpnonce: PM_Vars.nonce,
	            },
	            self = this;

	            wp.ajax.send('cpm_get_task', {
	                data: request_data,
	                success: function(res) {
	                    self.task = res.task;
	                    self.$store.commit('single_task_popup');
	                    self.loading = false;
	                }
	            });
	        },

	        updateTaskElement: function(task) {
	            
	            var request_data  = {
	                    task_id: task.ID,
	                    list_id: task.post_parent,
	                    project_id: PM_Vars.project_id,
	                    task_assign: task.assigned_to,
	                    task_title: task.post_title,
	                    task_text: task.post_content,
	                    task_start: task.start_date,
	                    task_due: task.due_date,
	                    task_privacy: task.task_privacy,
	                    single: true,
	                    _wpnonce: PM_Vars.nonce,
	                },
	                self = this;

	            wp.ajax.send('cpm_task_update', {
	                data: request_data,
	                success: function(res) {
	                    var list_index = self.getIndex( self.$store.state.lists, task.post_parent, 'ID' ),
	                        task_index = self.getIndex( self.$store.state.lists[0].tasks, task.ID, 'ID' );

	                    self.$store.commit('afterUpdateTaskElement', {
	                        list_index: list_index,
	                        task_index: task_index,
	                        task: task
	                    });
	                    self.is_task_title_edit_mode = false;
	                    self.is_task_details_edit_mode = false;
	                    self.is_enable_multi_select = false;
	                }
	            });
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