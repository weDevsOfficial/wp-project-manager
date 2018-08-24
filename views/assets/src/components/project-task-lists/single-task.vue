<template>
    <div id="pm-single-task-wrap">
        <div class="nonsortable">

            <div v-if="loading" class="modal-mask half-modal pm-task-modal modal-transition">
                <div class="modal-wrapper">
                    <div class="modal-container" style="height: 20000px;">
                        <span class="close-vue-modal">

                            <a  @click.prevent="closePopup()"><span class="dashicons dashicons-no"></span></a>
                        </span>


                        <div class="modal-body pm-todolist">

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


            <div v-else class="popup-mask">   
                <span class="close-vue-modal">
                        <a  @click.prevent="closePopup()"><span class="dashicons dashicons-no"></span></a>
                    </span>             
                <div class="popup-container">
                    
                    <div class="pm-single-task-header">
                        <div class="task-complete-incomplete">
                            <div class="completed pm-flex" v-if="task.status">
                                <span class="icon-pm-completed pm-font-size-16"></span>
                                <span><a  href="#" @click.prevent="singleTaskDoneUndone()">{{ __( 'Completed', 'pm' ) }}</a></span>
                            </div>
                            <div class="incomplete pm-flex" v-if="!task.status">
                                <span class="icon-pm-incomplete pm-font-size-16"></span>
                                <span><a href="#" @click.prevent="singleTaskDoneUndone()">{{ __( 'Mark Complete', 'pm' ) }}</a></span>
                            </div>
                        </div>

                        <div class="pm-flex header-meta">
                            <div class="created-by">
                                
                                <span class="pm-light-color">{{ __('Created by', 'wedevs-project-manager') }}</span>
                                <span class="pm-dark-color">{{ ucfirst( task.creator.data.display_name ) }}</span>
                                <span class="pm-light-color">{{ __('on', 'wedevs-project-manager') }}</span>
                                <span class="pm-dark-color">{{ cratedDateFormat( task.created_at.date ) }}</span>
                                
                            </div>
                            <div id="pm-action-menu" class="task-action">
                                <span style="font-size: 17px;" @click.prevent="showMenu()" class="icon-pm-more-options pm-font-size-16"></span>
                                <div  v-if="isActiveMenu" class="action-menu">
                                    <ul class="action-menu-ul">
                                        <li>
                                            <span class="icon-pm-copy pm-font-size-13"></span>
                                            <a @click.prevent="copyUrl(task)" href="#">{{ __('Copy', 'wedevs-project-manager') }}</a>
                                        </li>
                                        <li>
                                            <span class="icon-pm-private pm-font-size-13"></span>
                                            <a v-if="task.meta.privacy=='1'" @click.prevent="singleTaskLockUnlock(task)" href="#">{{ __('Make Visible', 'wedevs-project-manager') }}</a>
                                            <a v-if="task.meta.privacy=='0'" @click.prevent="singleTaskLockUnlock(task)" href="#">{{ __('Make Private', 'wedevs-project-manager') }}</a>

                                        </li>
                                        <li>
                                            <span class="icon-pm-delete pm-font-size-13"></span>
                                            <a @click.prevent="selfDeleteTask({task: task, list: list})" href="#">{{ __('Delete', 'wedevs-project-manager') }}</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div :class="singleTaskTitle(task) + ' task-title-wrap'">
                        <div class="task-title-text">

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
                                {{ ucfirst(task.title) }}
                            </span>

                        </div>
                    </div>

                    <div class="pm-flex options-wrap">
                        <div class="assigne-users">
                            <div v-if="task.assignees.data.length" class='pm-assigned-user' v-for="user in task.assignees.data">

                                <a href="#" :title="user.display_name">
                                    <img :alt="user.display_name" :src="user.avatar_url" class="avatar avatar-48 photo" height="48" width="48">
                                </a>
                            </div>
                            <span id="pm-multiselect-single-task" @click.self.prevent="isEnableMultiSelect()" class="icon-pm-user">
                                <div  v-if="is_enable_multi_select"  class="pm-multiselect pm-multiselect-single-task">

                                        <multiselect
                                            v-model="task_assign"
                                            :options="project_users"
                                            :multiple="true"
                                            :close-on-select="false"
                                            :clear-on-select="true"
                                            :show-labels="true"
                                            :searchable="true"
                                            placeholder="Select User"
                                            select-label=""
                                            selected-label="selected"
                                            deselect-label=""
                                            label="display_name"
                                            track-by="id"
                                            :allow-empty="true">

                                        </multiselect>
                                    </div>
                            </span>
                        </div>
                        <div class="pm-flex option-icon-groups">
                            <span id="pm-calendar-wrap" @click.prevent="isTaskDateEditMode()" class="individual-group-icon calendar-group icon-pm-calendar pm-font-size-16">
                                <span v-if="(task.start_at.date || task.due_date.date )" :class="taskDateWrap(task.due_date.date) + ' pm-task-date-wrap pm-date-window'">
                                        
                                    <span v-if="task_start_field">
                                        
                                        {{ dateFormat( task.start_at.date ) }}
                                    </span>

                                    <span v-if="task_start_field && task.start_at.date && task.due_date.date">&ndash;</span>
                                    <span v-if="task.due_date">
                                        
                                        {{ dateFormat( task.due_date.date ) }}
                                    </span>

                                        
                                </span>

                                <span v-if="(!task.start_at.date && !task.due_date.date)" class="pm-task-date-wrap pm-date-window">
                                    <span
                                        @click.prevent="isTaskDateEditMode()"
                                        v-bind:class="task.status ? completedTaskWrap(task.start_at.date, task.due_date.date) : taskDateWrap( task.start_at.date, task.due_date.date)">
                                    </span>
                                </span>
                                <div v-if="is_task_date_edit_mode && can_edit_task(task)" class="task-date">
                                    <div v-if="task_start_field" v-pm-datepicker class="pm-date-picker-from pm-inline-date-picker-from"></div>
                                    <div v-pm-datepicker class="pm-date-picker-to pm-inline-date-picker-to"></div>
                                </div>
                            </span>
                            
                            <!-- <span class="icon-pm-watch pm-font-size-16"></span>
                            <span class="icon-pm-tag pm-font-size-16"></span>
                            <span class="icon-pm-sorting pm-font-size-16"></span>
                            <span class="icon-pm-clip pm-font-size-16"></span>
                            <span class="icon-pm-star pm-font-size-16"></span> -->
                            <do-action :hook="'single_task_inline'" :actionData="doActionData"></do-action>
                        </div>
                    </div>

                    <div id="description-wrap" class="description-wrap">
                        <div v-if="!task.description.content && !is_task_details_edit_mode" @click.prevent="isTaskDetailsEditMode()"  class="action-content pm-flex">
                            <span>
                                <span class="icon-pm-align-left"></span>
                                <span class="task-description">{{ __( 'Description', 'wedevs-project-manager' ) }}</span>
                            </span>
                            <span class="icon-pm-pencil"></span>
                        </div>

                        <div v-else class="task-details">

                            <div class="pm-des-area pm-desc-content" v-if="!is_task_details_edit_mode"  >
                                <div v-if="task.description.content != ''">
                                    <div class="pm-task-description" v-html="task.description.html"></div>
                                </div>
                                <a class="task-description-edit-icon" @click.prevent="isTaskDetailsEditMode()" :title="update_description">
                                    <i style="font-size: 16px;"  class="fa fa-pencil" aria-hidden="true"></i>
                                    
                                </a>
                            </div>
                            
                            <textarea
                                v-prevent-line-break
                                @blur="updateDescription(task, $event)"
                                @keyup.enter="updateDescription(task, $event)"
                                class="pm-des-area pm-desc-field"
                                v-if="is_task_details_edit_mode && can_edit_task(task)"
                                v-model="task_description">

                            </textarea>
                            <div v-if="is_task_details_edit_mode && can_edit_task(task)" class="pm-help-text">
                                <span>{{ __( 'Shift+Enter for line break', 'wedevs-project-manager') }}</span>
                            </div>

                            <div class="clearfix pm-clear"></div>
                            <do-action :hook="'aftre_single_task_details'" :actionData="doActionData"></do-action>
                        </div>
                    </div>

                    <do-action :hook="'aftre_single_task_content'" :actionData="doActionData"></do-action>

                    <div class="discuss-wrap">
                        <task-comments :task="task" :comments="task.comments.data"></task-comments>
                    </div>

                    <div class="task-activities">
                        <ul>
                            <li v-for="activity in task.activities.data">
                                <div class="activity-actor">
                                    <img :src="activity.actor.data.avatar_url">
                                </div>
                                <div class="activity-content">

                                    <activity-parser :activity="activity"></activity-parser>
                                </div>
                            </li>
                        </ul>
                    </div>

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
    import ActivityParser from '@components/common/activity-parser.vue';
    
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
        data() {
            return {
                loading: true,
                is_task_title_edit_mode: false,
                is_task_details_edit_mode: false,
                is_task_date_edit_mode: false,
                is_enable_multi_select: false,
                task_description: '',
                update_description: __( 'Update Description', 'wedevs-project-manager'),
                task_id: this.$route.params.task_id,
                list: {},
                task: {},
                assigned_to: [],
                isActiveMenu: false
            }
        },

        mixins: [Mixins],

        watch: {
            is_enable_multi_select (val) {

                if(val) {
                    pm.Vue.nextTick(function() {
                        jQuery('.multiselect__input').show().focus();
                    });
                }
            }
        },

        computed: {
            doActionData () {
                return {
                    task: this.task,
                    list: this.list,
                    is_single_task_open: true,
                }
            },

            project_users () {
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
                get () {
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
                set ( selected_users ) {
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
            'do-action': DoAction,
            'activity-parser': ActivityParser
        },

        created() {
            this.getSelfTask();
            this.getGloabalProject(this.projectId);
            window.addEventListener('click', this.windowActivity);
            this.$root.$on('pm_date_picker', this.fromDate);
        },

        methods: {
            showMenu (status) {
                
                if(typeof status != 'undefined') {
                    this.isActiveMenu = status;
                } else {
                   this.isActiveMenu = this.isActiveMenu ? false : true;  
                }
                
            },
            selfDeleteTask() {
                var self = this;
                this.deleteTask({
                    task: this.task, 
                    list: this.task.task_list.data,
                    callback (data) {
                        self.closePopup();
                    }
                });
            },
            copyUrl (task) {
                pmBus.$emit('pm_generate_task_url', task);
                pm.Toastr.success(this.__('Copied!', 'wedevs-project-manager'));
            },

            lineThrough (task) {
                if ( task.status ) {
                    return 'pm-line-through';
                }
            },
            singleTaskDoneUndone () {

                var self = this,
                    status = this.task.status ? 0 : 1;
                
                var args = {
                    data: {
                        task_id: this.task.id ? this.task.id : this.taskId,
                        status : status,
                        project_id: this.task.project_id,
                    },
                    callback (res) {
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
                        with: 'boards,comments,activities',
                    },
                    task_id : self.task_id ? self.task_id : this.taskId,
                    project_id: self.projectId ? self.projectId : self.project_id,
                    callback  (res) {
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

            isEnableMultiSelect () {
                if ( !this.can_edit_task(this.task)){
                    return false;
                }

                this.is_enable_multi_select = this.is_enable_multi_select ? false : true;

                pm.Vue.nextTick(function() {
                    jQuery('.multiselect__input').focus();
                });
            },

            fromDate (date) {
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
            updateTaskPrivacy (task, status) {
                task.task_privacy = status;
                this.updateTaskElement(task);
            },
            isTaskDetailsEditMode () {
                if ( !this.can_edit_task(this.task) ) {
                    this.is_task_details_edit_mode = false;
                }else {
                    this.task_description  = this.task.description.content;
                    this.is_task_details_edit_mode = true;
                }

                pm.Vue.nextTick(function() {
                    jQuery('.pm-desc-field').focus();
                });
            },

            updateDescription (task, event) {
                if ( event.keyCode == 13 && event.shiftKey ) {
                    return;
                }

                if ( this.task_description.trim() == task.description.content) {
                    return;
                }
                task.description.content = this.task_description.trim();
                this.is_task_details_edit_mode = false,
                this.updateTaskElement(task);
            },

            closePopup () {
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

            singleTaskTitle (task) {
                return task.completed ? 'pm-task-complete' : 'pm-task-incomplete';
            },

            updateTaskElement (task) {
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
                        'description': task.description.content,
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
                    url = this.base_url + '/pm/v2/projects/'+project_id+'/tasks/'+task.id+'/update';

                var request_data = {
                    url: url,
                    data: update_data,
                    type: 'POST',
                    success (res) {
                        pmBus.$emit('pm_after_update_single_task', res);
                        self.is_task_title_edit_mode = false;
                        self.is_task_details_edit_mode = false;
                        self.is_enable_multi_select = false;
                        self.task.description = res.data.description;
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

            isTaskTitleEditMode () {
                if ( !this.can_edit_task(this.task) ) {
                    return this.is_task_title_edit_mode = false;
                }
                return this.is_task_title_edit_mode = true;
            },

            isTaskDateEditMode () {
                if ( !this.can_edit_task(this.task) ) {
                    this.is_task_date_edit_mode = this.is_task_date_edit_mode ? false : true;

                    return this.is_task_date_edit_mode;
                }
                
                this.is_task_date_edit_mode = this.is_task_date_edit_mode ? false : true;
            },

            windowActivity (el) {
                var title_blur      = jQuery(el.target).hasClass('pm-task-title-activity'),
                    dscription_blur = jQuery(el.target).closest('#description-wrap'),
                    assign_user    =  jQuery(el.target).closest( '#pm-multiselect-single-task' ),
                    actionMenu     = jQuery(el.target).closest( '#pm-action-menu' ),
                    modal          = jQuery(el.target).closest( '.popup-container' ),
                    datePicker = jQuery(el.target).closest('#ui-datepicker-div'),
                    datePickerBtn = jQuery(el.target).closest('.ui-datepicker-buttonpane');
                    
                if(datePicker.length || datePickerBtn.length) {
                    return;
                }

                if( !modal.length && jQuery('.popup-container').length ) {
                    this.closePopup();
                }

                if(!actionMenu.length) {
                    this.showMenu(false);
                }
                if ( ! title_blur ) {
                    this.is_task_title_edit_mode = false;
                }
                
                if ( ! dscription_blur.length ) {
                    this.is_task_details_edit_mode = false;
                }
                if ( ! assign_user.length ) {
                    this.is_enable_multi_select = false;
                }

                this.datePickerDispaly(el);

            },

            datePickerDispaly (el) {
                var date_picker_blur = jQuery(el.target).closest('#pm-calendar-wrap');

                if ( ! date_picker_blur.length ) {
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
                        
                        if(data.is_private) {
                            pm.Toastr.success(self.__('Task mark as private', 'wedevs-project-manager'));
                        } else {
                            pm.Toastr.success(self.__('Task visible for co-worker', 'wedevs-project-manager'));
                        }
                    },

                    error (res) {
                        res.responseJSON.message.map( function( value, index ) {
                            pm.Toastr.error(value);
                        });
                    }
                }
                self.httpRequest(request_data);
            },

            cratedDateFormat (date) {
                if ( date == '' ) {
                    return;
                }      

                date = new Date(date);
                date = pm.Moment(date).format('YYYY-MM-DD');

                var format = 'MMM D, YYYY';

                return pm.Moment( date ).format( String( format ) );
            }
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
</style>



