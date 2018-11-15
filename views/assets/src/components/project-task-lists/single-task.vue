<template>
    <div id="pm-single-task-wrap">
        <div class="nonsortable">

            <div v-if="loading" class="modal-mask half-modal pm-task-modal modal-transition">
              
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


            <div v-else class="popup-mask"> 

                <div class="popup-container">
                    <span class="close-modal">
                        <a  @click.prevent="closePopup()"><span class="dashicons dashicons-no"></span></a>
                    </span>
                    <div v-activity-load-more class="popup-body">
                        <div class="pm-single-task-header">

                            <div class="task-complete-incomplete" :class="{ 'disable': can_complete_task(task) }">
                                <a class="completed" v-if="task.status" href="#" @click.prevent="singleTaskDoneUndone()">
                                    <span class="icon-pm-completed pm-font-size-16" v-if="!show_spinner_status"></span>
                                    <span class="pm-spinner" v-if="show_spinner_status"></span>
                                    {{ __( 'Completed', 'pm' ) }}
                                </a>
                            
                            
                                <a  class="incomplete" v-if="!task.status" href="#" @click.prevent="singleTaskDoneUndone()">
                                    <span class="icon-pm-incomplete pm-font-size-16" v-if="!show_spinner_status"></span>
                                    <span class="pm-spinner" v-if="show_spinner_status"></span>
                                    {{ __( 'Mark Complete', 'pm' ) }}
                                </a>
                                
                            </div>

                            
                            <div class="created-by">
                                
                                <span class="pm-light-color">{{ __('Created by', 'wedevs-project-manager') }}</span>
                                <span class="pm-dark-color">{{ ucfirst( task.creator.data.display_name ) }}</span>
                                <span class="pm-light-color">{{ __('on', 'wedevs-project-manager') }}</span>
                                <span class="pm-dark-color" :title="getFullDate(task.created_at.timestamp)">{{ cratedDateFormat( task.created_at.date ) }}</span>
                            </div>

                            <div id="pm-action-menu" class="task-action">
                                <span style="font-size: 17px;" @click.prevent="showMenu()" class="icon-pm-more-options pm-font-size-16"></span>
                                <div  v-if="isActiveMenu" class="action-menu">
                                    <ul class="action-menu-ul">
                                        <li class="pm-dark-hover">
                                            <a class="pm-dark-hover title-anchor-menu-a icon-pm-copy pm-font-size-13" @click.prevent="copyUrl(task)" href="#">
                                                <span class="title-anchor-menu">{{ __('Copy Link', 'wedevs-project-manager') }}</span>
                                            </a>
                                        </li>
                                        <li class="pm-dark-hover" v-if="PM_Vars.is_pro && can_edit_task(task) && user_can('view_private_task')">
                                            
                                            <a class="pm-dark-hover title-anchor-menu-a icon-pm-private pm-font-size-13" v-if="task.meta.privacy=='1'" @click.prevent="singleTaskLockUnlock(task)" href="#">
                                                <span class="action-menu-span title-anchor-menu">{{ __('Make Visible', 'wedevs-project-manager') }}</span>
                                            </a>
                                            <a class="pm-dark-hover title-anchor-menu-a icon-pm-unlock pm-font-size-13" v-if="task.meta.privacy=='0'" @click.prevent="singleTaskLockUnlock(task)" href="#">
                                                <span class="action-menu-span title-anchor-menu">{{ __('Make Private', 'wedevs-project-manager') }}</span>
                                            </a>

                                        </li>
                                        <li  v-if="can_edit_task(task) || isArchivedTaskList(task)">
                                            
                                            <a class="pm-dark-hover title-anchor-menu-a icon-pm-delete pm-font-size-13" @click.prevent="selfDeleteTask({task: task, list: list})" href="#">
                                                <span class="action-menu-span title-anchor-menu">{{ __('Delete', 'wedevs-project-manager') }}</span>
                                            </a>
                                        </li>
                                    </ul>
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
                                        <span class="pm-spinner" v-if="show_spinner"></span>
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
                            <div class="pm-flex assigne-users">
                                <div v-if="task.assignees.data.length" class='pm-assigned-user' v-for="user in task.assignees.data" :key="user.id">

                                    <a :href="userTaskProfileUrl(user.id)" :title="user.display_name">
                                        <img :alt="user.display_name" :src="user.avatar_url" class="avatar avatar-48 photo" height="48" width="48">
                                    </a>
                                </div>
                                <div id="pm-multiselect-single-task" >
                                    <span @click.prevent="isEnableMultiSelect()" class="icon-pm-user"></span>
                                    <div v-show="is_enable_multi_select"  class="pm-multiselect pm-multiselect-single-task">
                                        <div class="pm-multiselect-content">
                                            <div class="assign-to">{{ __('Assign to', 'wedevs-project-manager') }}</div>
                                            <multiselect
                                                ref="assingTask"
                                                id="assingTask"
                                                v-model="task_assign"
                                                :options="project_users"
                                                :multiple="true"
                                                :close-on-select="false"
                                                :clear-on-select="true"
                                                :show-labels="true"
                                                :searchable="true"
                                                :placeholder="__('Search User', 'wedevs-project-manager')"
                                                select-label=""
                                                selected-label="selected"
                                                deselect-label=""
                                                label="display_name"
                                                track-by="id"
                                                :allow-empty="true">

                                               
                                                <template slot="option" slot-scope="props">
                                                    <img class="option__image" :src="props.option.avatar_url">
                                                    <div class="option__desc">
                                                        <span class="option__title">{{ props.option.display_name }}</span>
                                                    </div>
                                                </template>
   

                                            </multiselect>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            

                            <div class="pm-flex option-icon-groups">
                                <do-action :hook="'single_task_action'" :actionData="doActionData"></do-action>
                                <span @click.prevent="singleTaskLockUnlock(task)" v-if="isTaskLock" :title="__('Task is visible for co-worker', 'wedevs-project-manager')" class="icon-pm-unlock pm-dark-hover pm-font-size-16"></span>
                                <span @click.prevent="singleTaskLockUnlock(task)" v-if="isTaskUnlock" class="icon-pm-private pm-dark-hover pm-font-size-16"></span>
                                
                                <span id="pm-calendar-wrap" @click.self.prevent="isTaskDateEditMode()" class="individual-group-icon calendar-group icon-pm-calendar pm-font-size-16">
                                    <span v-if="(task.start_at.date || task.due_date.date )" :class="taskDateWrap(task.due_date.date) + ' pm-task-date-wrap pm-date-window'">
                                            
                                        <span :title="getFullDate(task.start_at.timestamp)" v-if="task_start_field">
                                            {{ dateFormat( task.start_at.date ) }}
                                        </span>

                                        <span v-if="task_start_field && task.start_at.date && task.due_date.date">&ndash;</span>
                                        <span :title="getFullDate(task.due_date.timestamp)" v-if="task.due_date">
                                            
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
                                        <pm-content-datepicker 
                                            v-if="task_start_field" 
                                            v-model="task.start_at.date"
                                            :callback="callBackDatePickerForm" 
                                            dependency="pm-datepickter-to" 
                                            class="pm-datepicker-from pm-inline-date-picker-from">
                                                
                                        </pm-content-datepicker>
                                        <pm-content-datepicker 
                                            v-model="task.due_date.date" 
                                            dependency="pm-datepickter-from" 
                                            :callback="callBackDatePickerTo"
                                            class="pm-datepicker-to pm-inline-date-picker-to">
                                                
                                        </pm-content-datepicker>
                                      <!--   <div v-if="task_start_field" v-pm-datepicker="'singleTask'" class="pm-date-picker-from pm-inline-date-picker-from"></div>
                                        <div v-pm-datepicker="'singleTask'" class="pm-date-picker-to pm-inline-date-picker-to"></div> -->
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
                            <div v-if="showdescriptionfield" @click.prevent="isTaskDetailsEditMode()"  class="action-content pm-flex">
                                <span>
                                    <span class="icon-pm-align-left"></span>
                                    <span class="task-description">{{ __( 'Description', 'wedevs-project-manager' ) }}</span>
                                </span>
                                <span class="icon-pm-pencil"></span>
                            </div>

                            <div v-else class="task-details">

                                <div class="pm-des-area pm-desc-content" v-if="!is_task_details_edit_mode"  >
                                    
                                    <div v-if="task.description.content != ''" class="pm-task-description" v-html="task.description.html"></div>
                                    
                                    <a class="task-description-edit-icon" @click.prevent="isTaskDetailsEditMode()" :title="update_description" v-if="can_edit_task(task) && !isArchivedTaskList(task)">
                                        <i style="font-size: 16px;"  class="fa fa-pencil" aria-hidden="true"></i>
                                        
                                    </a>
                                </div>
                                
                                <!-- <textarea
                                    v-prevent-line-break
                                    @blur="updateDescription(task, $event)"
                                    @keyup.enter="updateDescription(task, $event)"
                                    class="pm-des-area pm-desc-field"
                                    v-if="is_task_details_edit_mode && can_edit_task(task)"
                                    v-model="task_description">

                                </textarea>
                                <div v-if="is_task_details_edit_mode && can_edit_task(task)" class="pm-help-text">
                                    <span>{{ __( 'Shift+Enter for line break', 'wedevs-project-manager') }}</span>
                                </div> -->
                                
                                <div v-if="is_task_details_edit_mode && can_edit_task(task) && !isArchivedTaskList(task)" class="item detail">
                                    <text-editor v-if="is_task_details_edit_mode" :editor_id="'task-description-editor'" :content="content"></text-editor>
                                    <div class="task-description-action">
                                        <a @click.prevent="submitDescription(task)" href="#" class="pm-button pm-primary">{{ __( 'Update', 'wedevs-project-manager' ) }}</a>
                                        <a @click.prevent="closeDescriptionEditor(task)" href="#" class="pm-button pm-secondary">{{ __( 'Cancel', 'wedevs-project-manager' ) }}</a>
                                        <span v-if="description_show_spinner" class="pm-spinner"></span>
                                    </div>
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
                            <span class="activity-title pm-h2">{{ __('Activity', 'wedevs-project-manager') }}</span>
                            <ul class="single-task-activity-ul">
                                <li v-for="activity in task.activities.data" :key="activity.id">
                                    <div class="activity-li-content">
                                        <div class="activity-actor">
                                            <img class="activity-author-image" :src="activity.actor.data.avatar_url">
                                        </div>
                                        <div class="activity-content">

                                            <activity-parser :activity="activity"></activity-parser>
                                            <span class="activity-watch-wrap">
                                                <span class="activity-watch-icon icon-pm-watch"></span>
                                                <span :title="getFullDate( activity.committed_at.timestamp )" class="activity-form-now">{{ relativeDate(activity.committed_at.timestamp) }}</span>
                                            </span>
                                        </div>
                                    </div>
                                </li>
                            </ul>

                            <div v-if="activityLoading" class="pm-data-load-before" >
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
        </div>
    </div>

</template>

<style lang="less">

  
</style>

<script>
    import comments from './task-comments.vue';
    import DoAction from './../common/do-action.vue';
    import Mixins from './mixin';
    import Multiselect from 'vue-multiselect';
    import ActivityParser from '@components/common/activity-parser.vue';
    import editor from '@components/common/text-editor.vue';


    Vue.directive('activity-load-more', {
        bind: function(el, binding, vnode) {
            var self = this;

            jQuery(el).bind('scroll', function() {
                
                if( jQuery(this).scrollTop() + jQuery(this).innerHeight()>=jQuery(this)[0].scrollHeight ) {
                    
                    vnode.context.loadMoreActivity(vnode.context);
                }
            })
        }
     
    });
    
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
                isActiveMenu: false,
                activityPage: 2,
                activityLoading: false,
                allActivityLoaded: false,
                content: {
                    html: ''
                },
                description_show_spinner: false,
                show_spinner_status: false,
                show_spinner: false,
            }
        },

        mixins: [Mixins],
        computed: {
            doActionData () {
                return {
                    task: this.task,
                    list: this.list,
                    is_single_task_open: true,
                }
            },

            project_users () {
                this.$root.$store.state.project_users.forEach(function(user) {
                    pm.Vue.set(user, 'img');
                });
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
            isTaskLock () {
                return PM_Vars.is_pro && this.can_edit_task(this.task) && this.user_can('view_private_task') && this.task.meta.privacy=='0';
            },
            isTaskUnlock () {
                return PM_Vars.is_pro && this.can_edit_task(this.task) && this.user_can('view_private_task') && this.task.meta.privacy=='1';
            },
            showdescriptionfield () {
                if (this.isArchivedTaskList(this.task)) {
                    return false;
                }
                return !this.task.description.content && !this.is_task_details_edit_mode;
            }
        },

        components: {
            'task-comments': comments,
            'multiselect': Multiselect,
            'do-action': DoAction,
            'activity-parser': ActivityParser,
            'text-editor': editor,
        },

        created() {
            var self = this;
            this.getSelfTask();
            this.getGloabalProject(this.projectId);
            window.addEventListener('click', this.windowActivity);
            //this.$root.$on('pm_date_picker', this.fromDate);

            pm.Vue.nextTick(function() {
                jQuery('body').addClass('pm-block-content');
            });

            jQuery(document).keyup(function(e) {
                if (e.keyCode === 27) {
                    var subtaskInput = jQuery(e.target).closest('.new-subtask-form').find('.input-area');
                    var mainBody = jQuery(e.target).closest('#pm-single-task-wrap');
                    
                    if(!subtaskInput.length && mainBody.length) {
                        
                       self.closePopup();
                    } 
                }
            });
        },
        destroyed () {
            this.task = {};
            this.list = {};
        },

        methods: {
            callBackDatePickerForm (date) {
                
                let dateFrom = {
                    id: 'singleTask',
                    field: 'datepicker_from',
                    date: date
                }

                this.fromDate(dateFrom);
            },
            callBackDatePickerTo (date) {
                
                let dateTo = {
                    id: 'singleTask',
                    field: 'datepicker_to',
                    date: date
                }

                this.fromDate(dateTo);
            },
            submitDescription (task) {
                task.description.content = this.content.html.trim();
                this.description_show_spinner = true;
                this.updateTaskElement(task);
            },

            closeDescriptionEditor () {
                this.description_show_spinner = false;
                this.is_task_details_edit_mode = false;
                tinymce.execCommand( 'mceRemoveEditor', false, 'task-description-editor' );
            },

            loadMoreActivity (self) {

                if(this.allActivityLoaded) {
                    return;
                }

                if( this.activityLoading ) {
                    return;
                }
                
                var request_data = {
                    url: self.base_url + '/pm/v2/projects/'+self.project_id+'/tasks/'+self.task.id+ '/activity',
                    type: 'POST',
                    data: {
                        activityPage: this.activityPage
                    },
                    success (res) {
                        self.activityLoading = false;
                        self.activityPage = self.activityPage + 1;
                        
                        if(typeof self.task.activities == 'undefined') {
                            pm.Vue.set(self.task, 'activities', {});
                            pm.Vue.set(self.task.activities, 'data', res.data);
                        } else {
                            self.task.activities.data = self.task.activities.data.concat(res.data);
                        }

                        if(!res.data.length) {
                            self.allActivityLoaded = true;
                        }
                    },

                    error (res) {
                      
                    }
                }

                this.activityLoading = true;
                self.httpRequest(request_data);
            },
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
                         if ( typeof self.task.activities !== 'undefined' ) {
                            self.task.activities.data.unshift(data.activity.data);
                        } else {
                            self.task.activities = { data: [data.activity.data] };
                        }

                    }
                });
            },
            copyUrl (task) {
                pmBus.$emit('pm_generate_task_url', task);
                pm.Toastr.success(this.__('Copied!', 'wedevs-project-manager'));
                this.isActiveMenu = false;
            },

            lineThrough (task) {
                if ( task.status ) {
                    return 'pm-line-through';
                }
            },
            singleTaskDoneUndone () {
                if (this.isArchivedTaskList(this.task)) {
                    return;
                }
                if (this.can_complete_task(this.task)) {
                    return;
                }

                var self = this,
                    status = this.task.status ? 0 : 1;

                    this.show_spinner_status = true;
                
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
                        
                        if ( typeof self.task.activities !== 'undefined' ) {
                            self.task.activities.data.unshift(res.activity.data);
                        } else {
                            self.task.activities = { data: [res.activity.data] };
                        }
                        self.show_spinner_status = false
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
                        } else {
                            self.content.html = res.data.description.html;
                            self.addMeta(res.data);
                            self.task = res.data;

                            self.loading = false;
                        }
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
                if (this.isArchivedTaskList(this.task)) {
                    return false;
                }
                if ( !this.can_edit_task(this.task)){
                    return false;
                }

                this.is_enable_multi_select = ! this.is_enable_multi_select;
                pm.Vue.nextTick(() => {
                    this.$refs.assingTask.$el.focus();
                   
                });
            },

            fromDate (date) {
                if ( date.id == 'singleTask' && date.field == 'datepicker_from' ) {

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

                if ( date.id == 'singleTask' && date.field == 'datepicker_to' ) {

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
                if (this.isArchivedTaskList(this.task)) {
                     this.is_task_details_edit_mode = false;
                }

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
                if (this.isArchivedTaskList(this.task)) {
                    return;
                }
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
                    pm.Toastr.error(__('Invalid date range!', 'wedevs-project-manager'));
                    return;
                }
                this.show_spinner = true;

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
                        self.closeDescriptionEditor();
                        self.task.description = res.data.description;
                        self.$store.commit('updateProjectMeta', 'total_activities');
                        if ( typeof self.task.activities !== 'undefined' ) {
                            self.task.activities.data.unshift(res.activity.data);
                        } else {
                            self.task.activities = { data: [res.activity.data] };
                        }
                        self.show_spinner = false;

                        
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
                if (this.isArchivedTaskList(this.task)) {
                    return this.is_task_title_edit_mode = false;
                }

                if ( !this.can_edit_task(this.task) ) {
                    return this.is_task_title_edit_mode = false;
                }
                return this.is_task_title_edit_mode = true;
            },

            isTaskDateEditMode () {
                if (this.isArchivedTaskList(this.task)) {
                    this.is_task_date_edit_mode = false;
                }

                if ( !this.can_edit_task(this.task) ) {
                    this.is_task_date_edit_mode = this.is_task_date_edit_mode ? false : true;
                }
                
                this.is_task_date_edit_mode = this.is_task_date_edit_mode ? false : true;
            },

            windowActivity (el) {
                var title_blur      = jQuery(el.target).hasClass('pm-task-title-activity'),
                    dscription_blur = jQuery(el.target).closest('#description-wrap'),
                    assign_user     = jQuery(el.target).closest( '#pm-multiselect-single-task' ),
                    actionMenu      = jQuery(el.target).closest( '#pm-action-menu' ),
                    modal           = jQuery(el.target).closest( '.popup-container' ),
                    datePicker      = jQuery(el.target).closest('#ui-datepicker-div'),
                    datePickerBtn   = jQuery(el.target).closest('.ui-datepicker-buttonpane'),
                    hasCalendarArrowBtn = jQuery(el.target).hasClass('ui-icon'),
                    mainBody        = jQuery(el.target).closest('#pm-single-task-wrap');
                    
                if(datePicker.length || datePickerBtn.length || hasCalendarArrowBtn) {
                    return;
                }

                if( !modal.length && jQuery('.popup-container').length && mainBody.length ) {
                    this.closePopup();
                }

                if(!actionMenu.length) {
                    this.showMenu(false);
                }
                if ( ! title_blur ) {
                    this.is_task_title_edit_mode = false;
                }
                
                if ( ! dscription_blur.length ) {
                    this.closeDescriptionEditor();
                    //this.is_task_details_edit_mode = false;
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
                if (this.isArchivedTaskList(task)) {
                    return;
                }
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
                            pm.Toastr.success(self.__('Task marked as private', 'wedevs-project-manager'));
                        } else {
                            pm.Toastr.success(self.__('Task visible for co-worker', 'wedevs-project-manager'));
                        }

                        self.isActiveMenu = false;
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
            jQuery('body').removeClass('pm-block-content');
        }
    }
</script>

<style>
    .pm-line-through {
        text-decoration: line-through;
    }
    .pm-block-content {
        overflow: hidden;
    }
</style>



