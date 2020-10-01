<template>
    <div class="pm-task-create-fields">
        <div>
            <div class="fields">
                
                <label v-if="!projectRequestProcessing"  class="label">{{__('Project', 'wedevs-project-manager')}}</label>
                
                <pm-project-drop-down 
                    @afterGetProjects="afterGetProjects"
                    @onChange="changeProject"
                    :selectedProjects="selectedProjects"
                    :class="selectedProjects ? 'display-block' : 'display-none'"
                    :optionProjects="projects"
                    :options="options"
                    :defaultProjects="defaultProjects"
                />
            
                <div v-if="projectRequestProcessing" class="loading-animation">
                    <div class="loading-projects-title">{{ __( 'Loading projects', 'wedevs-project-manager') }}</div>
                    <div class="load-spinner">
                        <div class="rect1"></div>
                        <div class="rect2"></div>
                        <div class="rect3"></div>
                        <div class="rect4"></div>
                    </div>
                </div>
            </div>

            
            <div class="fields list-dropdown" v-if="projectId">
                <label v-if="selectedLists" class="label">{{__('In List', 'wedevs-project-manager')}}</label>
                <pm-list-drop-down 
                    :projectId="parseInt(projectId)"
                    @afterGetLists="afterGetLists"
                    @afterRefreshLists="afterRefreshLists"
                    :selectedLists="selectedLists"
                    @onChange="changeList"
                    :class="selectedLists ? 'display-block' : 'display-none'"
                />

                <div v-if="selectedLists == ''" class="loading-animation">
                    <div class="loading-projects-title">{{ __( 'Loading task lists', 'wedevs-project-manager') }}</div>
                    <div class="load-spinner">
                        <div class="rect1"></div>
                        <div class="rect2"></div>
                        <div class="rect3"></div>
                        <div class="rect4"></div>
                    </div>
                </div>
            </div>
            
            <div class="fields" v-if="listId && hasPermissionToCreateTask(selectedProjects)">
                <label class="label">{{__('Task', 'wedevs-project-manager')}}</label>
                <pm-new-task-form  
                    :task="task" 
                    :list="list"
                    :projectId="parseInt(projectId)"
                    :taskTypeField="taskTypeField"
                    :estimationField="estimationField"
                    @pm_after_create_task="afterCreateTask"
                />
                        
            </div>
            <div v-if="selectedProjects && !hasPermissionToCreateTask(selectedProjects)">
                {{ __( 'You have no permission to create task for this project', 'wedevs-project-manager' ) }}
            </div>  
        </div>

        <div v-if="!projectRequestProcessing && !hasProjects">
            <span>{{ 'No project found!', 'pm-pro' }}</span>
        </div>
        
    </div>
</template>



<script>
    
    export default {
        props: {
            projects: {
                type: [Array],
                default () {
                    return []
                }
            },
            
            defaultProjects: {
                type: [Boolean],
                default () {
                    return true
                }
            },

            findProjects: {
                type: [Boolean],
                default () {
                    return true
                }
            },

            taskTypeField: {
                type: [Boolean],
                default () {
                    return false
                }
            },

            estimationField: {
                type: [Boolean],
                default () {
                    return false
                }
            },

            setSelectedProjects: {
                type: [Object, String],
                default () {
                    return ''
                }
            },

            task: {
                type: [Object],
                default () {
                    return {
                        start_at: {
                            date: ''
                        },

                        due_date: {
                            date: ''
                        },

                        description: {
                            content: ''
                        },

                        assignees: {
                            data: []
                        }
                    }
                }
            }
        },

        data () {
            return {
                projectId: false,
                hasProjects: false,
                projectRequestProcessing: true,
                selectedProjects: '',
                selectedLists: '',
                listId: false,
                list: {},
                options: {
                    placeholder: __( 'Select a project', 'wedevs-project-manager' ),
                    searchProjects: this.findProjects
                }
            }
        },

        created () {
            
        },

        methods: {

            // hasProjects () {
            //     if ( this.defaultProjects ) {
            //         return true;
            //     }

            //     if ( this.projects.length ) {
            //         return true;
            //     }

            //     return false;
            // },

            hasPermissionToCreateTask ( project ) {
                // if( PM_Vars.is_pro != 1 ) {
                //     return true;
                // }

                if ( ! project ) {
                    return false;
                }

                if ( this.has_manage_capability() ) {
                    return true;
                }
                
                if ( this.is_manager( project ) ) {
                    return true;
                }

                let current_user_id = PM_Vars.current_user.ID;
                
                var index = this.getIndex( project.assignees.data, current_user_id, 'id' );

                if ( index === false ) {
                    return false;
                }

                var project_user = project.assignees.data[index],
                    role = project_user.roles.data[0].slug;
                
                if ( role == 'client' ) {
                    if ( 
                        typeof project.role_capabilities.client.create_task != 'undefined' 
                            &&
                        project.role_capabilities.client.create_task
                    ) {
                        return true;
                    }

                    return false;
                }
                
                if ( role == 'co_worker' ) {
                    if ( 
                        typeof project.role_capabilities.co_worker.create_task != 'undefined'
                            && 
                        project.role_capabilities.co_worker.create_task
                    ) {
                        return true;
                    }

                    return false;
                }

                return false;
            },

            afterGetProjects (projects) {

                this.projectRequestProcessing = false;
                
                if ( !this.projectId ) {
                
                    if(projects.length) {
                        this.hasProjects = true;
                    } else {
                        this.hasProjects = false;
                    }
                }

                if( this.isEmpty( this.setSelectedProjects ) ) {
                   if(projects.length) {
                        this.projectId = projects[0].id ? projects[0].id : projects[0].project_id;
                        this.setTaskFormUsers(projects[0].assignees);
                        this.selectedProjects = Object.assign({},projects[0]);
                    } 
                } else {
                    
                    this.projectId = this.setSelectedProjects.id ? this.setSelectedProjects.id : this.setSelectedProjects.project_id;
                    this.setTaskFormUsers(this.setSelectedProjects.assignees);
                    this.selectedProjects = Object.assign({},this.setSelectedProjects);
                    
                }
            },

            setTaskFormUsers (assignees) {
                let users = typeof assignees == 'undefined' ? 
                        [] : assignees.data;
                
                this.$store.commit( 'setProjectUsers', users );
            },

            changeProject (project) {
                this.setTaskFormUsers(project.assignees);
                this.projectId = parseInt( project.project_id );
                this.selectedProjects = project;
                this.selectedLists = '';
                this.listId = false;
            },

            afterGetLists (lists) {
                if(lists.length) {
                    this.listId = lists[0].id;
                    this.selectedLists = lists[0];
                    this.list = lists[0];
                }
            },

            afterRefreshLists (lists) {
                if(this.listId !== false) {
                    return;
                }

                if(lists.length) {
                    this.listId = lists[0].id;
                    this.selectedLists = lists[0];
                    this.list = lists[0];
                }
            },

            changeList (list) {
                this.listId = parseInt( list.id )
                this.list = Object.assign({}, list);
            },

            afterCreateTask (task) {
                this.$emit( 'afterCreateTask', task.data, task.activity );
            }
        }
    }
</script>

<style lang="less">

    .pm-task-create-fields {
        .list-dropdown {
            .multiselect {
                .multiselect__content {
                    z-index: 9999;
                }
            }
        }

        .fields {
            margin-bottom: 10px;
            .label {
                margin-bottom: 3px;
            }
        }

        .display-none {
            display: none;
        }

        .display-block {
            display: block;
        }
    }
</style>



