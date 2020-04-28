<template>
    <div class="pm-task-create-fields">
        
        <div class="fields">
            
            <label v-if="selectedProjects"  class="label">{{__('Project', 'wedevs-project-manager')}}</label>
            <pm-project-drop-down 
                @afterGetProjects="afterGetProjects"
                @onChange="changeProject"
                :selectedProjects="selectedProjects"
                :class="selectedProjects ? 'display-block' : 'display-none'"
                :optionProjects="projects"
                :options="options"
                
            />
        
            <div v-if="selectedProjects == ''" class="loading-animation">
                <div class="loading-projects-title">{{ __( 'Loading projects', 'wedevs-project-manager') }}</div>
                <div class="load-spinner">
                    <div class="rect1"></div>
                    <div class="rect2"></div>
                    <div class="rect3"></div>
                    <div class="rect4"></div>
                </div>
            </div>
        </div>

        
        <div class="fields" v-if="projectId">
            <label v-if="selectedLists" class="label">{{__('In List', 'wedevs-project-manager')}}</label>
            <pm-list-drop-down 
                :projectId="parseInt(projectId)"
                @afterGetLists="afterGetLists"
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
        
        <div class="fields" v-if="listId">
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
            }
        },

        data () {
            return {
                task: {
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
                },
                projectId: false,
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

        methods: {
            afterGetProjects (projects) {
                if(projects.length) {
                    this.projectId = projects[0].project_id;
                    this.setTaskFormUsers(projects[0].assignees);
                    this.selectedProjects = Object.assign({},projects[0]);
                }
            },

            setTaskFormUsers (assignees) {
                let users = typeof assignees == 'undefined' ? 
                        [] : assignees.data;
                
                this.$store.commit( 'setProjectUsers', users );
            },

            changeProject (project) {
                this.setTaskFormUsers(project.assignees);
                this.projectId = parseInt( project.project_id )
            },

            afterGetLists (lists) {
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



