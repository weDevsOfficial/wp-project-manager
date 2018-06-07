<template>
    <div class="nonsortable">
        <!-- Spinner before load task -->
        <div v-if="loading" class="modal-mask half-modal pm-task-modal modal-transition">
            <div class="modal-wrapper">
                <div class="modal-container" style="width: 700px; height: 20000px;">
                    <span class="close-vue-modal">

                        <a  @click.prevent="closePopup()"><span class="dashicons dashicons-no"></span></a>
                    </span>


                    <div class="modal-body pm-todolist">

                        <!-- Spinner before load task -->
                        <div class="pm-data-load-before" >
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


        <div v-else class="modal-mask half-modal pm-task-modal modal-transition" style="">

            <div class="modal-wrapper">
                <div class="modal-container" style="width: 700px;">
                    <span class="close-vue-modal">
                        <a  @click.prevent="closePopup()"><span class="dashicons dashicons-no"></span></a>
                    </span>

                    <div class="modal-body pm-todolist">
                        <div class="pm-col-12 pm-todo">
                            <div class="pm-modal-conetnt">
                                <div class="cmp-task-header">
                                    <h3 class="pm-task-title">
                                        <span class="pm-mark-done-checkbox">
                                            <input :disabled="can_complete_task(task)" v-model="task.status" @click="singleTaskDoneUndone()" class="" type="checkbox">
                                        </span>
                                        <span :class="singleTaskTitle(task) + ' pm-task-title-wrap'">
                                            <div class="pm-task-title-text">

                                                <span v-if="is_task_title_edit_mode && can_edit_task(task)">
                                                    <input
                                                        v-model="task.title"
                                                        @blur="updateTaskElement(task)"
                                                        @keyup.enter="updateTaskElement(task)"

                                                        class="pm-task-title-activity pm-task-title-field"
                                                        type="text">
                                                </span>

                                                <span
                                                    :class="lineThrough(task) + ' pm-task-title-activity pm-task-title-span'"
                                                    v-if="!is_task_title_edit_mode"
                                                    @click.prevent="isTaskTitleEditMode()">
                                                    {{ task.title }}
                                                </span>

                                            </div>

                                            <div class="clearfix pm-clear"></div>
                                        </span>
                                        
                                        <a v-if="PM_Vars.is_pro && task.status=='0' && can_edit_task(task) && user_can('view_private_task')" href="#" @click.prevent="singleTaskLockUnlock(task)">
                                            <span :class="privateClass( task.meta.privacy )"></span>
                                        </a>
                                        <a href="#" @click.prevent="copyUrl(task)">{{ __('Copy URL', 'pm') }}</a>
                                        <div class="clearfix pm-clear"></div>

                                    </h3>
                                    <do-action :hook="'single_task_inline'" :actionData="doActionData"></do-action>
                                    
                                    <div class="pm-task-meta">

                                        <span  class="pm-assigned-user-wrap">
                                            <span v-if="task.assignees.data.length" class='pm-assigned-user'
                                                @click.prevent="isEnableMultiSelect()"
                                                v-for="user in task.assignees.data">

                                                <a href="#" :title="user.display_name">
                                                    <img :alt="user.display_name" :src="user.avatar_url" class="avatar avatar-48 photo" height="48" width="48">
                                                </a>
                                            </span>

                                            <span v-if="!task.assignees.data.length" class='pm-assigned-user'
                                                @click.prevent="isEnableMultiSelect()">
                                                <i style="font-size: 20px;" class="fa fa-user" aria-hidden="true"></i>
                                            </span>

                                            <div v-if="is_enable_multi_select"  class="pm-multiselect pm-multiselect-single-task">

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

                                                    <template  slot="tag" slot-scope="props">
                                                        <div>
                                                            <img height="16" width="16" class="option__image" :src="props.option.avatar_url" alt="No Man’s Sky"/>
                                                            <div class="option__desc">
                                                                <span class="option__title">{{ props.option.display_name }}</span>
                                                            </div>
                                                        </div>
                                                    </template>

                                                </multiselect>
                                            </div>

                                            </span>

                                            <span v-if="(task.start_at.date || task.due_date.date )" :class="taskDateWrap(task.due_date.date) + ' pm-task-date-wrap pm-date-window'">
                                                <span
                                                    @click.prevent="isTaskDateEditMode()">
                                                    <span v-if="task_start_field">
                                                        <!-- <span class="dashicons pm-date-edit-btn dashicons-edit" title="<?php _e( 'Edit Task Description', 'pm' ); ?>"></span> -->
                                                        {{ dateFormat( task.start_at.date ) }}
                                                    </span>

                                                    <span v-if="task_start_field && task.start_at.date && task.due_date.date">&ndash;</span>
                                                    <span v-if="task.due_date">
                                                        <!-- <span class="dashicons pm-date-edit-btn dashicons-edit" title="<?php _e( 'Edit Task Description', 'pm' ); ?>"></span> -->
                                                        {{ dateFormat( task.due_date.date ) }}
                                                    </span>

                                                </span>

                                                <div class="pm-date-update-wrap" v-if="is_task_date_edit_mode && can_edit_task(task)">
                                                    <div v-if="task_start_field" v-pm-datepicker class="pm-date-picker-from pm-inline-date-picker-from"></div>
                                                    <div v-pm-datepicker class="pm-date-picker-to pm-inline-date-picker-to"></div>
                                                    <div class="clearfix pm-clear"></div>
                                                </div>


                                            </span>

                                            <span v-if="(!task.start_at.date && !task.due_date.date)" class="pm-task-date-wrap pm-date-window">
                                                <span
                                                    @click.prevent="isTaskDateEditMode()"
                                                    v-bind:class="task.status ? completedTaskWrap(task.start_at.date, task.due_date.date) : taskDateWrap( task.start_at.date, task.due_date.date)">
                                                    <span>
                                                        <!-- <span class="dashicons pm-date-edit-btn dashicons-edit" title="<?php _e( 'Edit Task Description', 'pm' ); ?>"></span> -->
                                                        <i style="font-size: 20px;" class="fa fa-calendar" aria-hidden="true"></i>
                                                    </span>
                                                </span>

                                                <div class="pm-date-update-wrap" v-if="is_task_date_edit_mode && can_edit_task(task)">
                                                    <div v-if="task_start_field" v-pm-datepicker class="pm-date-picker-from pm-inline-date-picker-from"></div>
                                                    <div v-pm-datepicker class="pm-date-picker-to pm-inline-date-picker-to"></div>
                                                    <div class="clearfix pm-clear"></div>
                                                </div>


                                            </span>

                                            <span class="pm-task-comment-count">{{ task.comments.data.length }} {{ __( 'Comments', 'pm' ) }}</span>
                                    </div>
                                </div>


                                <div  class="task-details">

                                    <!--v-if-->

                                    <p class="pm-des-area pm-desc-content" v-if="!is_task_details_edit_mode " @click.prevent="isTaskDetailsEditMode()">
                                        <span v-if="task.description !== ''" v-html="task.description"></span>
                                        <span style="margin-left: -3px;" v-if="!task.description">
                                            <i style="font-size: 16px;"  class="fa fa-pencil" aria-hidden="true"></i>
                                            &nbsp;{{ __( 'Update Description', 'pm' ) }}
                                        </span>

                                    </p>
                                    <!-- @keyup.enter="updateTaskElement(task)" -->
                                    <textarea
                                        v-prevent-line-break
                                        @blur="updateDescription(task, $event)"
                                        @keyup.enter="updateDescription(task, $event)"
                                        class="pm-des-area pm-desc-field"
                                        v-if="is_task_details_edit_mode && can_edit_task(task)"
                                        v-model="task.description">

                                    </textarea>
                                    <div v-if="is_task_details_edit_mode && can_edit_task(task)" class="pm-help-text">
                                        <span>{{ __( 'Shift+Enter for line break', 'pm' ) }}</span>
                                    </div>

                                    <div class="clearfix pm-clear"></div>
                                    <do-action :hook="'aftre_single_task_details'" :actionData="doActionData"></do-action>
                                </div>

                                <do-action :hook="'aftre_single_task_content'" :actionData="doActionData"></do-action>
                                <div class="pm-todo-wrap clearfix">
                                    <div class="pm-task-comment">
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
    import comments from './task-comments.vue';
    import DoAction from './../common/do-action.vue';
    import Mixins from './mixin';
    import Multiselect from 'vue-multiselect';
    
    export default {
        props: {
            taskId: {
                type: [Number, Boolean, String],
                default () {
                    return false
                }
            },
            projectId: {
                type: [Number, Boolean, String],
                default () {
                    return false
                }
            }
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
                assigned_to: [],
            }
        },

        mixins: [Mixins],

        computed: {
            doActionData () {
                return {
                    task: this.task,
                    list: this.list
                }
            },

            project_users: function() {
                return this.$root.$store.state.project_users;
            },
            task_users () {
                if (jQuery.isEmptyObject(this.$store.state.projectTaskLists.task)) {
                    return [];
                }
                return this.$store.state.projectTaskLists.task.assignees.data;
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
            'multiselect': Multiselect,
            'do-action': DoAction
        },

        created: function() {
            this.getSelfTask();
            window.addEventListener('click', this.windowActivity);
            this.$root.$on('pm_date_picker', this.fromDate);
        },


        methods: {
            copyUrl (task) {
                pmBus.$emit('pm_generate_task_url', task);
                // var url  = PM_Vars.project_page + '#' + this.$route.path + '/tasks/' + task.id; 
                // this.copy(url);
            },

            lineThrough (task) {
                if ( task.status ) {
                    return 'pm-line-through';
                }
            },
            singleTaskDoneUndone: function() {

                var self = this,
                    status = !this.task.status ? 1: 0;
                var args = {
                    data: {
                        title: this.task.title,
                        task_id: this.task.id ? this.task.id : this.taskId,
                        status : status,
                    },
                    callback: function(resSelf, res) {
                        if( status == '1' ) {
                            self.task.status = true;
                        } else {
                            self.task.status = false;
                        }
                        
                        pmBus.$emit('pm_after_task_doneUndone', res);
                    }
                }
                this.taskDoneUndone( args );

            },
            getSelfTask (){
                var self = this;
                var args = {
                    condition : {
                        with: 'boards,comments',
                    },
                    task_id : self.task_id ? self.task_id : this.taskId,
                    project_id: self.projectId ? self.projectId : self.project_id,
                    callback : function (res) {
                        if (typeof res.data === 'undefined' ) {
                            pm.Toastr.error(res.message);
                            self.$router.go(-1);
                            return;
                        }
                        self.addMeta(res.data);
                        //self.list = res.data.boards.data[0];
                        //self.$store.commit('projectTaskLists/setSingleTask', res.data);
                        self.task = res.data;
                        self.loading = false;
                    }
                }
                
                this.getTask(args);

            },

            addMeta (task) {
                task.edit_mode = false;

                if (task.status === 'complete') {
                    task.status = true;
                } else {
                    task.status = false;
                }

                task.comments.data.map(function(comment) {
                    comment.edit_mode = false;
                });
            },

            isEnableMultiSelect: function() {
                if ( !this.can_edit_task(this.task)){
                    return false;
                }
                this.is_enable_multi_select = true;

                pm.Vue.nextTick(function() {
                    jQuery('.multiselect__input').focus();
                });
            },

            fromDate: function(date) {
                if ( date.field == 'datepicker_from' ) {

                    if (this.task.due_date.date) {
                        var start = new Date(date.date);
                        var end  = new Date(this.task.due_date.date);
                        var compare = pm.Moment(end).isBefore(start);

                        if(this.task_start_field && compare) {
                            pm.Toastr.error('Invalid date range!');
                            return;
                        }
                    }

                    this.task.start_at.date = date.date;

                    this.updateTaskElement(this.task);
                }

                if ( date.field == 'datepicker_to' ) {

                    if(this.task.start_at.date) {
                        var start = new Date(this.task.start_at.date);
                        var end  = new Date(date.date);
                        var compare = pm.Moment(end).isBefore(start);

                        if(this.task_start_field && compare) {
                            pm.Toastr.error('Invalid date range!');
                            return;
                        }
                    }

                    var task = this.task;

                    var start = new Date( task.start_at ),
                        due = new Date( date.date );

                    if ( !this.$store.state.projectTaskLists.permissions.task_start_field ) {
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
                if ( this.can_edit_task(this.task) ) {
                    this.is_task_details_edit_mode = false;
                }
                this.is_task_details_edit_mode = true;

                pm.Vue.nextTick(function() {
                    jQuery('.pm-desc-field').focus();
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
                pmBus.$emit('pm_after_close_single_task_modal');
                return;
                this.$router.go(-1);
                return;
                const history = this.$store.state.history;

                if (! history.from.name) {
                    this.$router.push({
                        name: 'task_lists',
                        params: {
                            project_id: this.$route.params.project_id
                        }
                    });
                } else {
                    this.$router.push(history.from);
                }
            },

            singleTaskTitle: function(task) {
                return task.completed ? 'pm-task-complete' : 'pm-task-incomplete';
            },

            updateTaskElement: function(task) {
                var start = new Date(task.start_at.date);
                var end  = new Date(task.due_date.date);
                var compare = pm.Moment(end).isBefore(start);
                var project_id = this.project_id ? this.project_id : task.project_id;

                if(
                    task.start_at.date
                        &&
                    task.due_date.date
                        &&
                    this.task_start_field
                        &&
                    compare
                ) {
                    pm.Toastr.error('Invalid date range!');
                    return;
                }

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
                        'status': task.status ? 1 : 0,
                        'category_id': task.category_id,
                        'assignees': this.assigned_to
                    },
                    self = this,
                    url = this.base_url + '/pm/v2/projects/'+project_id+'/tasks/'+task.id;

                var request_data = {
                    url: url,
                    data: update_data,
                    type: 'PUT',
                    success (res) {
                        pmBus.$emit('pm_after_update_single_task', res);
                        self.is_task_title_edit_mode = false;
                        self.is_task_details_edit_mode = false;
                        self.is_enable_multi_select = false;
                        self.$store.commit('updateProjectMeta', 'total_activities');
                    },
                    error (res) {
                        res.responseJSON.message.map( function( value, index ) {
                            pm.Toastr.error(value);
                        });
                    }
                }
                
                this.httpRequest(request_data);
            },

            isTaskTitleEditMode: function() {
                this.is_task_title_edit_mode = true;
            },

            isTaskDateEditMode: function() {
                if ( this.can_edit_task(this.task) ) {
                    this.is_task_date_edit_mode = false;
                }
                this.is_task_date_edit_mode = true;
            },

            windowActivity: function(el) {
                var title_blur      = jQuery(el.target).hasClass('pm-task-title-activity'),
                    dscription_blur = jQuery(el.target).hasClass('pm-des-area'),
                    assign_user    =  jQuery(el.target).closest( '.pm-assigned-user-wrap' );

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
                var date_picker_blur       = jQuery(el.target).closest('.pm-task-date-wrap').hasClass('pm-date-window');

                if ( ! date_picker_blur ) {
                    this.is_task_date_edit_mode = false;
                }
            },

            singleTaskLockUnlock (task) {
                var self = this;
                var data = {
                    is_private: task.meta.privacy == '0' ? 1 : 0
                }
                var request_data = {
                    url: self.base_url + '/pm/v2/projects/'+task.project_id+'/tasks/privacy/'+task.id,
                    type: 'POST',
                    data: data,
                    success (res) {
                        task.meta.privacy = data.is_private;
                    },

                    error (res) {
                        res.responseJSON.message.map( function( value, index ) {
                            pm.Toastr.error(value);
                        });
                    }
                }
                self.httpRequest(request_data);
            },
        },

        destroyed () {
            this.$store.commit('isSigleTask', false);
            pmBus.$emit('pm_before_destroy_single_task', this.task);
        }
    }
</script>

<style>
    .pm-line-through {
        text-decoration: line-through;
    }
    .pm-multiselect-single-task {
        position: absolute;
    }
</style>



