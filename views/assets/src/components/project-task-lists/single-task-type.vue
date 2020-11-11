<template>

    <div class="single-task-type context">
        <h3 class="label">
            <span>{{ __( 'Type', 'wedevs-project-manager' ) }}</span>
             <i
                v-tooltip:top-center="__('Add a type to make your task</br>more specific on this project.', 'wedevs-project-manager')"
                class="info-icon"
            >
                <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 111.577 111.577" style="enable-background:new 0 0 111.577 111.577;" xml:space="preserve"> <g> <path d="M78.962,99.536l-1.559,6.373c-4.677,1.846-8.413,3.251-11.195,4.217c-2.785,0.969-6.021,1.451-9.708,1.451 c-5.662,0-10.066-1.387-13.207-4.142c-3.141-2.766-4.712-6.271-4.712-10.523c0-1.646,0.114-3.339,0.351-5.064 c0.239-1.727,0.619-3.672,1.139-5.846l5.845-20.688c0.52-1.981,0.962-3.858,1.316-5.633c0.359-1.764,0.532-3.387,0.532-4.848 c0-2.642-0.547-4.49-1.636-5.529c-1.089-1.036-3.167-1.562-6.252-1.562c-1.511,0-3.064,0.242-4.647,0.71 c-1.59,0.47-2.949,0.924-4.09,1.346l1.563-6.378c3.829-1.559,7.489-2.894,10.99-4.002c3.501-1.111,6.809-1.667,9.938-1.667 c5.623,0,9.962,1.359,13.009,4.077c3.047,2.72,4.57,6.246,4.57,10.591c0,0.899-0.1,2.483-0.315,4.747 c-0.21,2.269-0.601,4.348-1.171,6.239l-5.82,20.605c-0.477,1.655-0.906,3.547-1.279,5.676c-0.385,2.115-0.569,3.731-0.569,4.815 c0,2.736,0.61,4.604,1.833,5.597c1.232,0.993,3.354,1.487,6.368,1.487c1.415,0,3.025-0.251,4.814-0.744 C76.854,100.348,78.155,99.915,78.962,99.536z M80.438,13.03c0,3.59-1.353,6.656-4.072,9.177c-2.712,2.53-5.98,3.796-9.803,3.796 c-3.835,0-7.111-1.266-9.854-3.796c-2.738-2.522-4.11-5.587-4.11-9.177c0-3.583,1.372-6.654,4.11-9.207 C59.447,1.274,62.729,0,66.563,0c3.822,0,7.091,1.277,9.803,3.823C79.087,6.376,80.438,9.448,80.438,13.03z"/> </g></svg>
            </i>
        </h3>

        <div
            :class="classnames({
                ['process-1']: hasTaskType ? false : true,
                ['data-active']: hasTaskType ? true : false
            })"
        >
            <div class="process-text-wrap">
                <pm-popper
                    trigger="click"
                    :options="popperOptions()"
                    v-if="has_task_permission()"
                >

                    <div class="pm-popper popper">
                        <div class="pm-multiselect-top">
                            <div class="pm-multiselect-content">
                                <div v-if="taskTypeLoading">
                                    <span>{{ __( 'Loading', 'wedevs-project-manager' ) }}...</span>
                                </div>

                                <div v-if="!taskTypeLoading && !hasSettingsTaskType">
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

                    <!-- popper trigger element -->
                    <div class="slot-wrap" slot="reference">
                        <a
                            class="display-flex process-btn"
                            href="#"
                            @click.prevent=""
                        >
                            <i
                                :title="__('Add new task type', 'wedevs-project-manager')"
                            >
                                <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="330.34px" height="330.34px" viewBox="0 0 330.34 330.34" xml:space="preserve"><g><g><path d="M306.756,165.93c-1.54-4.211-6.201-6.371-10.389-4.826L220.482,188.9l61.341-61.293c1.519-1.511,2.367-3.576,2.367-5.729 c0-2.144-0.849-4.206-2.367-5.73l-47.45-47.477c-3.164-3.164-8.29-3.164-11.454,0l-60.162,60.12l33.742-80.04 c0.833-1.98,0.844-4.211,0.042-6.199c-0.812-1.988-2.378-3.575-4.361-4.406l-61.844-26.077c-4.127-1.759-8.878,0.201-10.613,4.316 L86.4,95.434V11.27c0-4.472-3.628-8.1-8.1-8.1H8.1c-4.472,0-8.1,3.628-8.1,8.1V319.07c0,4.472,3.628,8.1,8.1,8.1h70.2 c0.989,0,1.928-0.206,2.803-0.527c0.876,0.316,1.788,0.527,2.737,0.527c0.931,0,1.869-0.158,2.787-0.496l238.396-87.338 c4.197-1.54,6.359-6.191,4.819-10.389L306.756,165.93z M47.883,310.97H16.2v-13.362v-8.786v-6.012v-20.846V19.37h54v114.491 v20.849v20.854v45.727v11.443v11.222v0.232v50.182v8.427v2.579v0.453v5.142h-1.464h-4.854H47.883z M178.427,49.924 l-46.045,109.224l-8.343,19.786l-8.345,19.786l-14.244,33.786l-8.604,20.403L86.4,268.218v-12.946v-17.249v-10.024v-11.454 v-11.443v-67.962l45.106-106.99L178.427,49.924z M113.643,245.289l8.604-20.402l23.828-56.526l82.561-82.506l36.002,36.018 l-80.335,80.286l-27.253,27.231L93.63,292.766L113.643,245.289z M107.552,301.757l85.672-85.614l101.108-37.04l17.513,47.809 L107.552,301.757z"></path> <path d="M43.2,277.668c-0.356,0-0.691,0.079-1.036,0.101c-3.035,0.274-5.719,1.672-7.642,3.817 c-1.268,1.414-2.204,3.133-2.668,5.042c-0.211,0.886-0.356,1.793-0.356,2.742c0,2.573,0.854,4.925,2.257,6.855 c2.127,2.921,5.55,4.841,9.445,4.841c0.566,0,1.107-0.084,1.653-0.169c2.336-0.332,4.442-1.345,6.117-2.848 c0.809-0.728,1.523-1.55,2.106-2.479c0.96-1.519,1.545-3.28,1.711-5.168c0.032-0.348,0.103-0.686,0.103-1.039 C54.902,282.904,49.663,277.668,43.2,277.668z"></path></g></g></svg>
                            </i>

                        </a>

                        <div
                            class="process-results task-type"
                            v-if="hasTaskType"
                        >
                            <span>{{ task.type.title }}</span>

                        </div>

                        <div v-if="!hasTaskType" class="helper-text">{{ __( 'Add Task Type', 'pm-pro' ) }}</div>
                    </div>
                </pm-popper>

                <div v-if="!has_task_permission()">
                    <div
                        class="process-results task-type"
                        v-if="hasTaskType"
                    >
                        <span>{{ task.type.title }}</span>

                    </div>
                    <div 
                        class="process-results user-images" 
                        v-if="!hasTaskType"
                    >
                        <span>{{ __( 'No type found!', 'pm-pro' ) }}</span>
                    </div>
                </div>

            </div>
        </div>

        <div class="spinner-wrap" v-if="typeRequestProcessing">
            <div class="task-tool-spinner">
                <div class="bounce1"></div>
                <div class="bounce2"></div>
                <div class="bounce3"></div>
            </div>
        </div>
    </div>
</template>

<style lang="less">
    .popover-inner {
        padding: 5px 8px 4px !important;
        background: #f1f1f1 !important;
    }
    .popover-arrow {
        border-color: #f1f1f1 !important;
    }
    .single-task-type {

        .process-text-wrap {
            .slot-wrap {
                display: flex;
                align-items: center;
            }
        }

        .process-results.task-type {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-wrap: wrap;
            margin-left: 5px;
            cursor: pointer;
            line-height: 1;

            span {
                background: #f5f6f8;
                padding: 4px 8px;
                color: #858587;
                font-size: 13px;
                border-radius: 2px;
                font-weight: 400;
            }

            .type-block {
                position: relative;

                &:hover {
                    >.cross {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                }

                .cross {
                    display: none;
                    position: absolute;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    top: 0;
                    background: #cf513d;
                    border-radius: 2px;
                    cursor: pointer;

                    svg {
                        fill: #fff;
                        height: 10px;
                        width: 10px;
                    }
                }
            }
        }

        .pm-popper {
            .pm-pro-type-elements {
                min-width: 140px;
                padding: 5px 8px 4px !important;
                background: #f1f1f1 !important;
            }

            .popper__arrow {
                z-index: -1;
            }
        }

        .pm-popper[x-placement^="top"] {
            .popper__arrow {
                z-index: -1;
                border-color: transparent transparent transparent transparent !important;
                &:after {
                    border-color: #f1f1f1 transparent transparent transparent;
                }
            }
        }

        .pm-popper[x-placement^="bottom"] {
            .popper__arrow {
                z-index: -1;
                border-color: transparent transparent transparent transparent !important;
                &:after {
                    border-color: transparent transparent #f1f1f1 transparent
                }
            }
        }


        .icon-pm-tag {
            cursor: pointer;
        }

        .type-color {
            border-radius: 2px;
            box-shadow: inset 0 -1px 0 rgba(27, 31, 35, 0.12);
            font-size: 12px;
            font-weight: 400;
            /* height: 20px; */
            line-height: 10px;
            padding: .3em 4px;
            color: #fff;
            white-space: nowrap;
        }

        .type-block {
            margin-right: 5px;

            &:last-child {
                margin-right: 0;
            }
        }
    }
</style>


<script>

    export default {
        props: {
            task: {
                type: [Object],
                default () {
                    return {}
                }
            }
        },

        data () {
            return {
                taskTypeLoading: true,
                hasSettingsTaskType: false,
                typeRequestProcessing: false,
                hasTaskType: false,
                typeId: false
            }
        },

        created () {
            this.setTypeId();
        },

        components: {
            
        },

        computed: {
           
        },

        methods: {
            has_task_permission() {
               var permission =  this.can_edit_task(this.task);

               return permission ;
            },

            setTypeId () {
                if ( !this.isEmpty(this.task.type) ) {
                    this.typeId = parseInt( this.task.type.id );
                    this.hasTaskType = true;
                }
            },

            onChangeTaskType (type) {

                this.updateTaskType(this.task, type);
            },

            popperOptions () {
                return {
                    placement: 'bottom-end',
                    modifiers: { offset: { offset: '0, 3px' } },
                }
            },

            afterGetTaskTypes ( taskTypes ) {
                this.taskTypeLoading = false;
                
                if( taskTypes.length ) {
                    this.hasSettingsTaskType = true;
                }
            },

            updateTaskType (task, taskType) {
                if(this.typeRequestProcessing) {
                    return;
                }

                var self = this;
                var project_id = task.project_id;

                var update_data  = {
                        'title': task.title,
                        'type_id': this.isEmpty( taskType ) ? false : taskType.id,
                    },
                    self = this,
                    url = this.base_url + 'pm/v2/projects/'+project_id+'/tasks/'+task.id+'/update';

                var request_data = {
                    url: url,
                    data: update_data,
                    type: 'POST',
                    
                    success (res) {
                        if(self.isEmpty(res.data.type) ) {
                            self.hasTaskType = false;
                        } else {
                            self.hasTaskType = true;
                        }
                        
                        self.task.type = Object.assign( {}, res.data.type );

                        self.typeRequestProcessing = false;
                    },

                    error (res) {
                       
                    }
                }

                this.typeRequestProcessing = true;
                this.httpRequest(request_data);
            },
        }
    }
</script>
