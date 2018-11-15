<template>
    <div :class="'pm-task-form pm-slide-'+task.id">

        <div class="input-area">
            <div class="input-action-wrap">
                <div>
                    <span class="plus-text" v-if="!show_spinner">+</span>
                    <span class="pm-spinner" v-if="show_spinner"></span>
                </div>
                <input @keyup.enter="taskFormAction()" v-model="task.title"  class="input-field" :placeholder="__('Add new task', 'wedevs-project-manager')" type="text" ref="taskForm">

                <a @click.prevent="taskFormAction()"  class="update-button" href="#"><span class="icon-pm-check-circle"></span></a>
                <div class="action-icons">
                    <pm-do-action hook="pm_task_form" :actionData="task" ></pm-do-action>
                    <span @click.self.prevent="enableDisable('descriptionField')" class="icon-pm-align-left new-task-description-btn"></span>
                    <span  @click.self.prevent="enableDisable('isEnableMultiselect')" class="task-user-multiselect icon-pm-single-user pm-dark-hover">
                        <div v-if="isEnableMultiselect" class="pm-multiselect-top pm-multiselect-subtask-task">
                            <div class="pm-multiselect-content">
                                <div class="assign-to">{{ __('Assign to', 'wedevs-project-manager') }}</div>
                                <multiselect
                                    v-model="task.assignees.data"
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

                                   <template slot="option" slot-scope="props">
                                        <img class="option__image" :src="props.option.avatar_url">
                                        <div class="option__desc">
                                            <span class="option__title">{{ props.option.display_name }}</span>
                                        </div>
                                    </template>

                                </multiselect>
                            </div>
                        </div>

                    </span>
                    <!-- <span @click.prevent="showHideDescription()" class="icon-pm-pencil pm-dark-hover"></span> -->

                    <span @click.self.prevent="enableDisable('datePicker')" class="icon-pm-calendar new-task-calendar pm-dark-hover"></span>
                    
                </div>
                <div v-if="datePicker" class="subtask-date new-task-caledar-wrap">
                    <pm-content-datepicker  
                        v-if="task_start_field"
                        v-model="task.start_at.date"  
                        class="pm-date-picker-from pm-inline-date-picker-from"
                        :callback="callBackDatePickerForm">
                        
                    </pm-content-datepicker>
                    <pm-content-datepicker 
                        v-model="task.due_date.date"  
                        class="pm-date-picker-to pm-inline-date-picker-to"
                        :callback="callBackDatePickerTo">
                            
                    </pm-content-datepicker>

                </div>
                <div v-if="descriptionField" class="new-task-description">
                    <text-editor  :editor_id="'new-task-description-editor-' + list.id" :content="content"></text-editor>
                    
                </div>
                
            </div>
        </div>
    </div>
</template>

<style lang="less">
    .pm-task-form {
        span.pm-spinner {
            position: absolute;
            top: 8px;
            left: 7px;
        }
        .create-area {
            &:hover {
                .icon-plus {
                    color: #444;
                }
            }
            border: 1px solid #ECECEC;
            width: 100%;
            padding: 5px 10px;
            color: #B0BABC;
            .icon-plus {
                line-height: 0;
                margin-right: 10px;
                font-size: 25px;
                color: #D7DEE2;
            }
        }
        .input-area {
            .input-action-wrap {
                position: relative;
                .update-button {
                    position: absolute;
                    right: 0;
                    top: 0px;
                    background: #019dd6;
                    color: #fff;
                    font-size: 12px;
                    padding: 6px 8px;
                    
                    &:hover {
                        background: #008ec2;
                    }
                }
                .plus-text {
                    position: absolute;
                    top: 4px;
                    margin-left: 9px;
                    font-size: 25px;
                    color: #B5C0C3;
                    font-weight: 200;
                }

                .subtask-date {
                    position: absolute;
                    top: 33px;
                    right: 0px;
                    display: flex;
                    border: 1px solid #DDDDDD;
                    border-top: none;
                    box-shadow: 0px 6px 20px 0px rgba(214, 214, 214, 0.6);
                    flex-wrap: wrap;
                    z-index: 9;
                    font-size: 12px;

                    .pm-date-picker-from {
                        .ui-datepicker {
                            border: none;
                        }
                    }

                    .pm-date-picker-to {
                        .ui-datepicker {
                            border: none;
                        }
                    }
                }
            }
            .description-field {
                border: none;
                border-bottom: 1px solid #1A9ED4;
                height: 30px;
                padding: 10px;
                width: 100%;
                margin-bottom: 15px;
                box-shadow: none;
                line-height: 1.5;
            }
            .icon-pm-single-user {
                position: relative;
                .pm-multiselect-top {
                    top: 23px !important;
                    border-top: none !important;
                    border-top-right-radius: 0 !important;
                    border-top-left-radius: 0 !important;

                }
            }
            .input-field {
                width: 100%;
                height: 33px;
                padding-left: 28px;
                padding-right: 131px;
                box-shadow: none !important;
                &::placeholder {
                    color: #B5C0C3;
                    font-weight: 300;
                    font-size: 12px;
                }
            }
            .action-icons {
                position: absolute;
                right: 18px;
                top: 9px;
                margin-right: 11px;
                display: flex;
                align-items: center;

                .pm-action-wrap {
                    display: flex;
                    align-items: center;
                    line-height: 0;

                    .pm-task-recurrent {
                        margin-right: 10px;
                        .icon-pm-loop {
                            &:before {
                                vertical-align: middle;
                                color: #d4d6d6;
                                font-weight: 600;
                                cursor: pointer;
                            }

                            &:hover {
                                &:before {
                                    color: #000;
                                }
                            }
                        }
                    }
                }

                .new-task-description-btn {
                    cursor: pointer;

                    &:hover {
                        &:before {
                            color: #000;
                        }
                    }
                }

                .pm-make-privacy {
                    .icon-pm-unlock, .icon-pm-private {
                        margin-right: 0;
                        vertical-align: middle;
                        cursor: pointer;

                        &:before {
                            color: #d4d6d6;
                        }

                        &:hover {
                            &:before {
                                color: #444;
                            }
                        }
                    }
                }

                span {
                    margin-right: 10px;
                }
                .date-picker {
                    position: absolute;
                }
            }
        }
    }

</style>

<script>
import date_picker from './date-picker.vue';
import Mixins from './mixin';
import editor from '@components/common/text-editor.vue';

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
        },
        focus: {
            type: Boolean,
            default: false
        }
    },

    /**
     * Initial data for this component
     * 
     * @return obj
     */
    data: function() {
        return {
            isEnableMultiselect: false,
            datePicker: false,
            descriptionField: false,
            task_privacy: ( this.task.task_privacy == 'yes' ) ? true : false,
            submit_disabled: false,
            before_edit: jQuery.extend( true, {}, this.task ),
            task_description: this.task.description.content,
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
            estimation_placheholder: __('Estimated hour to complete the task', 'wedevs-project-manager'),
            content: {
                html: this.task.description.html
            },
        }
    },
    mixins: [Mixins],

    components: {
    	'multiselect': pm.Multiselect.Multiselect,
    	'pm-datepickter': date_picker,
        'text-editor': editor
    },

    beforeMount () {
        this.setDefaultValue();
        
    },
    mounted () {
        if (this.focus) {
            this.$nextTick(() => {
                if (typeof this.$refs.taskForm !== 'undefined'){
                    this.$refs.taskForm.focus();
                }
            })
            
        }
    },

    // Initial action for this component
    created: function() {
        this.$on( 'pm_date_picker', this.getDatePicker );
        window.addEventListener('click', this.windowActivity);
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
    		return this.$store.state.project_users;
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
        windowActivity (el) {
            var multiselect  = jQuery(el.target).closest('.task-user-multiselect'),
                calendarBtn = jQuery(el.target).hasClass('new-task-calendar'),
                calendarCont = jQuery(el.target).closest('.new-task-caledar-wrap'),
                hasCalendarArrowBtn = jQuery(el.target).hasClass('ui-icon'),
                description = jQuery(el.target).closest('.new-task-description'),
                descriptionBtn = jQuery(el.target).hasClass('new-task-description-btn');

            if( !descriptionBtn && !description.length ) {
                this.descriptionField = false;
            }
          
            if( !calendarBtn && !calendarCont.length && !hasCalendarArrowBtn) {
                this.datePicker = false;
            }

            if ( !multiselect.length ) {
                this.isEnableMultiselect = false;
            }
        },
        callBackDatePickerForm (date) {
            this.task.start_at.date = date;
        },
        callBackDatePickerTo (date) {
            
            this.task.due_date.date = date;
        },
        enableDisable (key, status) {
            status = status || '';

            if(status == '') {
                this[key] = this[key] ? false : true;
            } else {
                this[key] = status;
            }
        },
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
                    description: this.content.html ? this.content.html.trim() : '',
                    start_at: this.task.start_at.date,
                    due_date: this.task.due_date.date,
                    list_id: this.list.id,
                    order: this.task.order,
                    estimation: this.task.estimation
                },
                callback: function( res ) {
                    self.show_spinner = false;
                    self.submit_disabled = false;
                    self.task_description = res.data.description.content;

                    self.task.title = '';
                    self.content.html = '';
                    self.task.start_at.date = '';
                    self.task.due_date.date = '';
                    self.task.assignees.data = [];
                }
            }

            if (this.task.due_date.date) {
                var start = new Date(this.task.start_at.date);
                var end  = new Date(this.task.due_date.date);
                var compare = pm.Moment(end).isBefore(start);

                if(this.task_start_field && compare) {
                    pm.Toastr.error('Invalid date range!');
                    return;
                }
            }
            
            if ( typeof this.task.id !== 'undefined' ) {
                self.updateTask ( args );
            } else {
                self.addTask ( args, this.list );
            }
        },

        filterUserId (users) {
            let cuser = [];
            cuser = users.map(function (user) {
                return user.id;
            });

            if (!cuser.length) {
                cuser = [0];
            }

            return cuser;
        }
    }
}
</script>
