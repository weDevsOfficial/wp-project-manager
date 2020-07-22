<template>
    <div :class="'pm-task-form pm-slide-'+task.id">
       
        <div class="input-area">
            <div class="input-action-wrap">
                <pm-click-wrap
                    @clickOutSide="clickOutSide"
                    @clickInSide="clickInSide"
                >
                    <form 
                        ref="taskForm" 
                        :class="classnames( {
                            ['task-create-form']: true,
                            ['focus']: focusField
                        })" 
                        @submit.prevent="taskFormAction()" 
                        action=""
                    >
                        <div class="fields">
                            
                            <input 
                                v-model="task.title"  
                                :maxlength="lengthtitle" 
                                :placeholder="__('Add New Task (Character limit 200)', 'wedevs-project-manager')" 
                                type="text" 
                                ref="taskInput"
                                @keyup="warningTitleCharacterLimit()"
                                class="input-field" 
                                data-lpignore="true"
                                @keyup.self.enter="taskFormAction()"
                            >

                            <div class="action-icons process-fields" v-if="focusField">
                                <div class="process-content-1">
                                    <div class="task-users process-field">
                                        <pm-popper trigger="click" :options="popperOptions()">
                                            <div class="pm-popper popper">
                                                <div class="pm-multiselect-top pm-multiselect-subtask-task">
                                                    <div class="pm-multiselect-content">
                                                        <multiselect
                                                            v-model="task.assignees.data"
                                                            :options="project_users"
                                                            :multiple="true"
                                                            :close-on-select="false"
                                                            :clear-on-select="true"
                                                            :show-labels="true"
                                                            :searchable="true"
                                                            :placeholder="__( 'Type User Name', 'wedevs-project-manager' )"
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
                                            
                                            <!-- popper trigger element -->
                                            
                                            <div 
                                                ref="userBtn"
                                                slot="reference" 
                                                v-pm-tooltip 
                                                :title="__('Assign user', 'wedevs-project-manager')"  
                                                class="pm-popper-ref popper-ref task-user-multiselect icon-pm-single-user pm-dark-hover"
                                                @click.prevent="focusAssignUserInput()"
                                            >

                                                <div 
                                                    class="user-images" 
                                                    v-if="task.assignees.data.length"
                                                >
                                                    <div 
                                                        v-pm-tooltip 
                                                        :title="user.display_name" 
                                                        class="image" 
                                                        v-for="user in task.assignees.data"
                                                    >
                                                        <img 
                                                            :title="user.display_name"
                                                            :src="user.avatar_url"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </pm-popper>
                                    </div>

                                    <div class="task-date process-field task-date-field-wrap">
                                        <!-- <pm-date-range-picker 
                                            @apply="onChangeDate"
                                            @cancel="dateRangePickerClose"
                                            :contentClass="isActiveDate()"
                                            :options="{
                                                input: false,
                                                autoOpen: false,
                                                autoApply: false,
                                                opens: 'right',
                                                singleDatePicker: task_start_field ? false : true,
                                                showDropdowns: true,
                                                startDate: getStartDate(),
                                                endDate: getEndDate(),
                                                locale: {
                                                    cancelLabel: __( 'Clear', 'wedevs-project-manager' )
                                                }
                                            }">
                                            
                                        </pm-date-range-picker> -->

                                        <pm-vue2-daterange-picker
                                            :opens="'right'"
                                            :singleDatePicker="task_start_field ? false : true"
                                            :startDate="getStartDate()"
                                            :endDate="getEndDate()"
                                            :showDropdowns="true"
                                            :autoApply="true"
                                            @update="onChangeDate"
                                        />
                                           
                                      
             
                                        <!-- <div class="date-field">
                                            <span v-if="task_start_field && task.due_date.date">{{ taskDateFormat(task.start_at.date) }}</span>
                                            <span v-if="isBetweenDate( task_start_field, task.start_at.date, task.due_date.date )">&ndash;</span>
                                            <span>{{ taskDateFormat(task.due_date.date) }}</span>
                                        </div> -->
                                    </div>

<div v-if="taskTypeField" class="task-type-wrap process-field">
    <pm-popper trigger="click" :options="popperOptions()">
        <div class="pm-popper popper">
            <div class="pm-multiselect-top">
                <div class="pm-multiselect-content">
                    <div v-if="taskTypeLoading">
                        <span>{{ __( 'Loading', 'wedevs-project-manager' ) }}...</span>
                    </div>

                    <div v-if="!taskTypeLoading && !hasTaskType">
                        <span>{{ __( 'Task type not found!', 'wedevs-project-manager' ) }}</span>
                    </div>

                    <pm-task-type-dropdown 
                        @onChange="onChangeTaskType"
                        :selectedTaskTypes="task.type"
                        :allowEmpty="true"
                        @afterGetTaskTypes="afterGetTaskTypes"
                    />
                </div>
            </div>
        </div>

        <div 
            slot="reference" 
            v-pm-tooltip 
            :title="__('Task Type', 'wedevs-project-manager')"  
            class="pm-popper-ref popper-ref task-type-btn pm-dark-hover"
        >
            <i>
                <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="330.34px" height="330.34px" viewBox="0 0 330.34 330.34" style="enable-background:new 0 0 330.34 330.34;" xml:space="preserve"> <g> <g> <path d="M306.756,165.93c-1.54-4.211-6.201-6.371-10.389-4.826L220.482,188.9l61.341-61.293c1.519-1.511,2.367-3.576,2.367-5.729 c0-2.144-0.849-4.206-2.367-5.73l-47.45-47.477c-3.164-3.164-8.29-3.164-11.454,0l-60.162,60.12l33.742-80.04 c0.833-1.98,0.844-4.211,0.042-6.199c-0.812-1.988-2.378-3.575-4.361-4.406l-61.844-26.077c-4.127-1.759-8.878,0.201-10.613,4.316 L86.4,95.434V11.27c0-4.472-3.628-8.1-8.1-8.1H8.1c-4.472,0-8.1,3.628-8.1,8.1V319.07c0,4.472,3.628,8.1,8.1,8.1h70.2 c0.989,0,1.928-0.206,2.803-0.527c0.876,0.316,1.788,0.527,2.737,0.527c0.931,0,1.869-0.158,2.787-0.496l238.396-87.338 c4.197-1.54,6.359-6.191,4.819-10.389L306.756,165.93z M47.883,310.97H16.2v-13.362v-8.786v-6.012v-20.846V19.37h54v114.491 v20.849v20.854v45.727v11.443v11.222v0.232v50.182v8.427v2.579v0.453v5.142h-1.464h-4.854H47.883z M178.427,49.924 l-46.045,109.224l-8.343,19.786l-8.345,19.786l-14.244,33.786l-8.604,20.403L86.4,268.218v-12.946v-17.249v-10.024v-11.454 v-11.443v-67.962l45.106-106.99L178.427,49.924z M113.643,245.289l8.604-20.402l23.828-56.526l82.561-82.506l36.002,36.018 l-80.335,80.286l-27.253,27.231L93.63,292.766L113.643,245.289z M107.552,301.757l85.672-85.614l101.108-37.04l17.513,47.809 L107.552,301.757z"/> <path d="M43.2,277.668c-0.356,0-0.691,0.079-1.036,0.101c-3.035,0.274-5.719,1.672-7.642,3.817 c-1.268,1.414-2.204,3.133-2.668,5.042c-0.211,0.886-0.356,1.793-0.356,2.742c0,2.573,0.854,4.925,2.257,6.855 c2.127,2.921,5.55,4.841,9.445,4.841c0.566,0,1.107-0.084,1.653-0.169c2.336-0.332,4.442-1.345,6.117-2.848 c0.809-0.728,1.523-1.55,2.106-2.479c0.96-1.519,1.545-3.28,1.711-5.168c0.032-0.348,0.103-0.686,0.103-1.039 C54.902,282.904,49.663,277.668,43.2,277.668z"/> </g> </g> </svg>
            </i>    
            <div 
                class="type-title" 
                v-if="taskType.title"
            >
                <span>{{ taskType.title }}</span>
            </div>
        </div>
    </pm-popper>
</div>

                                    <pm-do-slot v-if="estimationField" hook="estimation_task_tools" :actionData="taskTools"></pm-do-slot>
                                    <pm-do-slot hook="task_tools" :actionData="taskTools"></pm-do-slot>
                                </div>
                                

                                <div class="task-submit-wrap process-content-2">
                                    <a href="#" class="pm-button pm-secondary cancel-button" @click.prevent="closeForm()">
                                        <i><svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 241.171 241.171" style="enable-background:new 0 0 241.171 241.171;" xml:space="preserve"><path id="Close" d="M138.138,120.754l99.118-98.576c4.752-4.704,4.752-12.319,0-17.011c-4.74-4.704-12.439-4.704-17.179,0 l-99.033,98.492L21.095,3.699c-4.74-4.752-12.439-4.752-17.179,0c-4.74,4.764-4.74,12.475,0,17.227l99.876,99.888L3.555,220.497 c-4.74,4.704-4.74,12.319,0,17.011c4.74,4.704,12.439,4.704,17.179,0l100.152-99.599l99.551,99.563 c4.74,4.752,12.439,4.752,17.179,0c4.74-4.764,4.74-12.475,0-17.227L138.138,120.754z"/></svg></i>
                                    </a>
                                    <!-- <input  
                                        :style="show_spinner ? 'color: #1A9ED4' : ''" 
                                        :class="focusField ? 'pm-button submit pm-primary' : 'pm-button submit pm-secondary'" 
                                        :value="__( 'Add New', 'wedevs-project-manager' )"
                                        type="submit" 
                                    > -->
                                    <pm-button
                                        :label="isEmpty(task.id) 
                                            ? __( 'Add New', 'wedevs-project-manager') 
                                            : __( 'Update', 'wedevs-project-manager')"
                                        isPrimary
                                        :spinner="show_spinner"
                                        type="submit"
                                        @onClick="submitTask()"
                                    />
                                    <!-- <span v-if="show_spinner" class="pm-spinner"></span> -->
                                </div>
                            </div>
                        </div>
                        

                      

                       <!--  <div v-if="datePicker" class="subtask-date new-task-caledar-wrap">
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

                        </div> -->

                        <!-- <div v-if="descriptionField" class="new-task-description">
                            <text-editor  :editor_id="'new-task-description-editor-' + list.id" :content="content"></text-editor>
                        </div> -->
                        
                    </form>

                </pm-click-wrap>
            </div>
            <!-- <div>
                <div v-if="task.title"> {{ lengthtitle - task.title.length }} {{ __( 'characters remaining', 'wedevs-project-manager' ) }}</div>
                <div>{{ task.assignees.data }}</div>
                
                <div>
                    <span class="icon-pm-calendar"></span>
                    <span>{{ task.start_at.date }}</span>
                    <span>&ndash;</span>
                    <span>{{ task.due_date.date }}</span>
                </div>
                
            </div> -->
        </div>
    </div>


</template>

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
                    due_date: {
                        date: ''
                    },
                    start_at: {
                        date: ''
                    },
                    assignees: {
                        data: []
                    },

                    type: {
                        id: false,
                        title: '',
                        description: ''
                    }
                }
            }
        },

        options: {
            type: [Object],
            default () {
                return {
                    focus: false
                }
            }
        },

        projectId: {
            type: [Number],
            default: 0
        },

        estimationField: {
            type: [Boolean],
            default: false
        },

        taskTypeField: {
            type: [Boolean],
            default () {
                return false
            }
        },
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
            estimation_placheholder: __('Estimated hour to complete the task', 'wedevs-project-manager'),
            content: {
                html: this.task.description.html
            },
            lengthtitle: 200,
            focusField: false,
            taskTools: {
                task: this.task,
                projectId: this.projectId,
            },
            typeId: false,
            taskTypeLoading: true,
            hasTaskType: false,
            taskType: {
                title: ''
            }
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
        // if (this.focusField) {
        //     if (typeof this.$refs.taskForm !== 'undefined'){
        //         this.$refs.taskForm.focus();
        //     }
        // }
    },

    // Initial action for this component
    created: function() {
        this.$on( 'pm_date_picker', this.getDatePicker );

        this.setTaskType();
        this.formatTaskUsers();

        if(jQuery.isEmptyObject(this.list)) {
            this.task.listId = this.getInboxId();
        } else {
            this.task.listId = this.list.id;
        }

        this.focusField = this.options.focus ? true : false;

        this.focustInputForEdit();
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
            return this.$store.state.project_users.map( user => {
                user.id = parseInt( user.id );

                return user;
            } );
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
        formatTaskUsers () {
            return this.task.assignees.data.map( user => {
                user.id = parseInt( user.id );

                return user;
            } )
        },

        setTaskType () {
            this.typeId =  this.task.type ? this.task.type.id : false;
            this.taskType.title = this.task.type ? this.task.type.title : '';
        },

        afterGetTaskTypes ( taskTypes ) {
            this.taskTypeLoading = false;
            
            if( taskTypes.length ) {
                this.hasTaskType = true;
            }
        },

        popperOptions () {
            return {
                placement: 'bottom-end',
                modifiers: { offset: { offset: '0, 3px' } },
            }
        },

        onChangeTaskType (value) {

            if ( value ) {
                this.typeId = value.id;
                this.taskType = value;
            } else {
                this.typeId = false;
                this.taskType = {
                    title: ''
                }
            }
        },

        focustInputForEdit () {
            var self = this;
            setTimeout(() => {
                if( self.task.id || self.focusField ) {
                    jQuery(this.$refs.taskInput)
                        .focus()
                        .trigger('click');
                }
                
            }, 200)
        },

        focusAssignUserInput () {
            setTimeout(() => {
                jQuery(this.$refs.userBtn)
                    .closest('.task-users')
                    .find('.multiselect__input')
                    .focus();
            }, 300)
        },

        submitTask () {
            this.taskFormAction();
        },

        closeForm () {
            var self = this;

            setTimeout(() => {
                jQuery('body').trigger('click');
                self.$emit('closeTaskForm');
            }, 100)
        },

        deleteUser (user) {
            let index = this.getIndex( this.task.assignees.data, user.id, 'id' );

            if( index !== false ) {
                this.task.assignees.data.splice( index, 1 );
            }
        },

        dateRangePickerClose () {
            this.task.start_at.date = '';
            this.task.due_date.date = '';
        },

        warningTitleCharacterLimit () {
            if(this.task.title.length >= 200) {
                pm.Toastr.warning(__('Maxmim character limit 200', 'wedevs-project-manager'));
            }
        },

        clickInSide () {
            this.focusField = true;
        },

        clickOutSide () {
            var self = this;

            if(this.focusField) {

                window.addEventListener('click', (el) => {
                    var datePicker = jQuery(el.target).closest('.table-condensed');
                    var taskForm   = jQuery(el.target).closest('.pm-task-form');
                    var clenderBtn = jQuery(el.target).closest('.drp-buttons');
                    
                    if(
                        !datePicker.length 
                            && 
                        !taskForm.length 
                            && 
                        !clenderBtn.length
                    ) {
                        self.focusField = false;
                    }
                });
            }

            if(!self.focusField) {
                self.$emit('closeTaskForm');
            }
        },

        isActiveDate () {
            if(this.task.start_at.date || this.task.due_date.date) {
                return 'icon-pm-calendar active-date new-task-calendar pm-dark-hover';    
            }
            
            return 'icon-pm-calendar new-task-calendar pm-dark-hover';
        },

        getStartDate () {
            return this.task.start_at.date ? new Date(this.task.start_at.date ) : '';//pm.Moment()
        },
        
        getEndDate () {
            return this.task.due_date.date ? new Date(this.task.due_date.date) : ''//pm.Moment()
        },
        
        windowActivity (el) {
            var self = this;
            
            var multiselect  = jQuery(el.target).closest('.task-user-multiselect'),
                calendarBtn = jQuery(el.target).hasClass('new-task-calendar'),
                calendarCont = jQuery(el.target).closest('.new-task-caledar-wrap'),
                hasCalendarArrowBtn = jQuery(el.target).hasClass('ui-icon'),
                description = jQuery(el.target).closest('.new-task-description'),
                descriptionBtn = jQuery(el.target).hasClass('new-task-description-btn');
           
            if( !descriptionBtn && !description.length ) {
                pm.Vue.nextTick(function() {
                    self.descriptionField = false;
                });
            }
          
            if( !calendarBtn && !calendarCont.length && !hasCalendarArrowBtn) {
                this.datePicker = false;
            }

            if ( !multiselect.length ) {
                this.isEnableMultiselect = false;
            }
        },
        // onChangeDate (start, end, className) {
        //     if(this.task_start_field) {
        //         this.task.start_at.date = start.format('YYYY-MM-DD');
        //         this.task.due_date.date = end.format('YYYY-MM-DD');
        //     } else {
        //         this.task.due_date.date = end.format('YYYY-MM-DD');
        //     }
        // },
        onChangeDate (date) {
            if(this.task_start_field) {
                this.task.start_at.date = pm.Moment(date.startDate).format('YYYY-MM-DD');
                this.task.due_date.date = pm.Moment(date.endDate).format('YYYY-MM-DD');
            } else {
                this.task.due_date.date = pm.Moment(date.endDate).format('YYYY-MM-DD');
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
                    estimation: this.task.estimation,
                    //estimated_hours: this.task.estimation,
                    type_id: this.typeId,
                    order: this.task.order,
                    recurrent: this.task.recurrent,
                    project_id: typeof this.list.project_id != 'undefined' ? this.list.project_id : this.projectId
                },

                callback: function( self, res ) { 
                    self.clearFormData();
                    self.task_description = typeof res.data.description === 'undefined' ? '' : res.data.description.content;

                    self.$emit('afterTaskUpdated', res, args);
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

        clearFormData () {
            var self = this;

            self.show_spinner = false;
            self.submit_disabled = false;
            self.task.title = '';
            self.content.html = '';
            self.task.start_at.date = '';
            self.task.due_date.date = '';
            self.task.assignees.data = [];

            Vue.nextTick(function() {
               self.focusField = false; 
            })
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


<style lang="less">
    .daterangepicker {
        z-index: 99999;

        .monthselect, .yearselect {
            text-align-last: center;
        }
    }
    span.pm-estimate-icon {
        cursor: pointer;
        &::before {
            font-size: 14px !important;
            color: #d9dbdb;
        }
        &:hover:before {
            color: #000;
        }
    }
    .pm-task-form {
        .task-submit-wrap {
            position: relative;
            span.pm-spinner {
                position: absolute;
                top: 8px;
                left: 28px;
            }
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

                .task-create-form.focus {
                    .fields {
                        border-radius: 3px;
                        border: 1px solid #e5e4e4;

                        .input-field {
                            border: none;
                            border-radius: none;
                        }
                    }
                }
                
                .task-create-form {
                    display: flex;

                    .fields {
                        flex: 1;
                        position: relative;
                        border: 1px solid transparent;
                        
                        .input-field {
                            width: 100%;
                            height: 36px;
                            padding: 0 10px;
                            box-shadow: none !important;
                            border: 1px solid #e5e4e4;
                            border-radius: 3px;
                            outline: none;
                            
                            &::placeholder {
                                color: #B5C0C3;
                                font-weight: 300;
                                font-size: 12px;
                            }

                            border-radius: 3px;
                        }

                        .process-fields {
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            line-height: 0;
                            z-index: 9;
                            padding: 6px 12px;
                            transition: all 1s ease-out;
                            background: #fafafa;

                            .pm-vue2-daterange-picker {
                                .btn {
                                    padding: 0 5px 0 10px;
                                }

                                .reportrange-text {
                                    padding: 0 !important;
                                    margin: 0 !important;

                                    .date-text {
                                        margin-left: 6px;
                                    }

                                    .glyphicon {
                                        margin: 0;
                                        padding: 0;

                                        &:before {
                                            font-size: 14px;
                                        }
                                    }
                                }
                            }

                            .process-content-1 {
                                display: flex;
                                align-items: center;
                                justify-content: flex-start;

                                .task-date-field-wrap {
                                    .reportrange-text {
                                        padding-right: 1px;
                                    }
                                }
                            }

                            .task-type-wrap {
                                margin-left: -5px;

                                .pm-common-multiselect {
                                    .multiselect__input {
                                        border: 1px solid #ECECEC !important;
                                    }
                                }

                                .task-type-btn {
                                    display: flex;
                                    align-items: center;

                                    .type-title {
                                        margin-left: 6px;
                                    }

                                    svg {
                                        height: 14px;
                                        width: 14px;
                                        fill: #505050;
                                    }
                                }
                            }

                            .process-field {
                                margin-right: 16px;
                                font-size: 13px;
                            }

                            .active-date {
                                &:before {
                                    color: #444;
                                }
                            }

                            .task-date {
                                display: flex;
                                align-items: center;
                                justify-content: center;

                                .reportrange-text {
                                    background: none !important;
                                    border: 0;
                                }

                                .icon-pm-calendar {
                                    &:before {
                                        font-size: 15px;
                                        color: #c5c5c5;
                                    }
                                }

                                .date-field {
                                    font-size: 12px;
                                    margin-left: 5px;
                                    color: #4a90e2;
                                }
                            }
                            
                            .task-users {
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                flex-wrap: wrap;

                                .icon-pm-single-user {
                                    display: flex;
                                    align-items: center;

                                    &:before {
                                        font-size: 16px;
                                        color: #c5c5c5;
                                    }

                                    .pm-multiselect-top {
                                        top: 23px !important;
                                        border-top: none !important;
                                        border-top-right-radius: 0 !important;
                                        border-top-left-radius: 0 !important;

                                    }
                                }

                                .user-images {
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    flex-wrap: wrap;

                                    .image {
                                        position: relative;
                                        height: 20px;
                                        width: 20px;
                                        margin-left: 5px;
                                        cursor: pointer;

                                        &:last-child {
                                            //margin-right: 15px;
                                        }

                                        &:hover {
                                           > .cross {
                                                display: flex;
                                                align-items: center;
                                                justify-content: center;
                                            } 
                                        }
                                        
                                        .cross {
                                            display: none;
                                            position: absolute;
                                            top: 0;
                                            left: 0;
                                            height: 100%;
                                            width: 100%;
                                            background-color: #e46c6c;
                                            border-radius: 50%;

                                            svg {
                                                height: 8px;
                                                width: 8px;
                                                fill: #fff;
                                            }
                                        }

                                        img {
                                            height: 100%;
                                            width: 100%;
                                            border-radius: 50%;
                                        }
                                    }
                                }
                            }

                            .task-submit-wrap {
                                .submit {
                                    padding: 7px 14px;
                                    height: auto;
                                }

                                .cancel-button {
                                    background: transparent;
                                    border: none;
                                    outline: none;
                                    box-shadow: none;
                                    margin-right: 5px;

                                    svg {
                                        height: 12px;
                                        width: 12px;
                                    }
                                }
                            }
                            
                            span:last-child {
                                margin-right: 0;
                            }

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

                            .task-estimation-arae {
                                margin-right: 10px;
                            }

                            & > span {
                                margin-right: 10px;
                            }
                            .date-picker {
                                position: absolute;
                            }
                        }
                    }
                }

                .update-button {
                    position: absolute;
                    right: 0;
                    top: 0px;
                    background: #fafafa;
                    color: #fff;
                    font-size: 12px;
                    padding: 0 8px;
                    height: 100%;
                    border: 1px solid #ddd;
                    line-height: 0;
                    display: flex;
                    align-items: center;
                    
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
                    //border: 1px solid #DDDDDD;
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
            
        }
    }

</style>
