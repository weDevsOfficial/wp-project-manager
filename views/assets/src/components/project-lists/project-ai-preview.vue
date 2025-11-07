<template>
    <div class="pm-ai-preview">
        <div class="pm-ai-preview-header">
            <h3>{{ __( 'Previewing your Project & Tasks', 'wedevs-project-manager') }}</h3>
        </div>
        
        <div class="pm-ai-preview-content">
            <!-- Project Name -->
            <div class="pm-preview-section">
                <h4 class="pm-preview-label">{{ __( 'Project Name', 'wedevs-project-manager') }}</h4>
                <div class="pm-preview-item pm-editable-item">
                    <div class="pm-preview-icon">
                        <span class="pm-project-icon" :style="{ backgroundColor: projectColor }"></span>
                    </div>
                    <input 
                        type="text" 
                        v-model="projectData.title" 
                        class="pm-editable-input"
                        :placeholder="__( 'Project Name', 'wedevs-project-manager')"
                    />
                    <i class="pm-icon flaticon-edit pm-edit-icon" aria-hidden="true"></i>
                </div>
            </div>

            <!-- Initial Tasks (without group) -->
            <div class="pm-preview-section" v-if="initialTasks.length > 0">
                <div class="pm-preview-item pm-task-item" v-for="(task, index) in initialTasks" :key="'initial-' + index">
                    <input type="checkbox" class="pm-task-checkbox" disabled />
                    <input 
                        type="text" 
                        v-model="task.title" 
                        class="pm-editable-input pm-task-input"
                        :placeholder="__( 'Task Name', 'wedevs-project-manager')"
                    />
                    <i class="pm-icon flaticon-edit pm-edit-icon" aria-hidden="true"></i>
                </div>
            </div>

            <!-- Task Groups -->
            <div class="pm-preview-section" v-for="(group, groupIndex) in taskGroups" :key="'group-' + groupIndex">
                <h4 class="pm-preview-label pm-task-group-label">
                    <input 
                        type="text" 
                        v-model="group.title" 
                        class="pm-editable-input pm-group-input"
                        :placeholder="__( 'Task Group Name', 'wedevs-project-manager')"
                    />
                    <i class="pm-icon flaticon-edit pm-edit-icon" aria-hidden="true"></i>
                </h4>
                <div class="pm-preview-item pm-task-item" v-for="(task, taskIndex) in group.tasks" :key="'task-' + groupIndex + '-' + taskIndex">
                    <input type="checkbox" class="pm-task-checkbox" disabled />
                    <input 
                        type="text" 
                        v-model="task.title" 
                        class="pm-editable-input pm-task-input"
                        :placeholder="__( 'Task Name', 'wedevs-project-manager')"
                    />
                    <i class="pm-icon flaticon-edit pm-edit-icon" aria-hidden="true"></i>
                </div>
            </div>
        </div>

        <div class="pm-ai-preview-footer">
            <button 
                @click.prevent="saveProject" 
                class="pm-button pm-primary pm-btn-ai-save"
                :disabled="saving">
                {{ saving ? __( 'Saving...', 'wedevs-project-manager') : __( 'Save Project', 'wedevs-project-manager') }}
            </button>
        </div>
    </div>
</template>

<script>
    var project_ai_preview = {
        props: {
            projectData: {
                type: Object,
                required: true
            }
        },
        data () {
            return {
                saving: false,
                projectColor: this.generateProjectColor()
            }
        },
        computed: {
            initialTasks () {
                return this.projectData.tasks || [];
            },
            taskGroups () {
                return this.projectData.task_groups || [];
            }
        },
        methods: {
            generateProjectColor () {
                // Generate a random color for the project icon
                const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22'];
                return colors[Math.floor(Math.random() * colors.length)];
            },
            saveProject () {
                if (!this.projectData.title || !this.projectData.title.trim()) {
                    pm.Toastr.error(__( 'Project name is required', 'wedevs-project-manager'));
                    return;
                }

                this.saving = true;
                this.$emit('save-project', this.projectData);
            }
        }
    }

    export default project_ai_preview;
</script>

<style lang="less">
    .pm-ai-preview {
        max-height: 600px;
        overflow-y: auto;
        
        .pm-ai-preview-header {
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid #e0e0e0;
            
            h3 {
                margin: 0;
                font-size: 18px;
                font-weight: 600;
                color: #333;
            }
        }
        
        .pm-ai-preview-content {
            margin-bottom: 20px;
        }
        
        .pm-preview-section {
            margin-bottom: 25px;
            
            &:last-child {
                margin-bottom: 0;
            }
        }
        
        .pm-preview-label {
            margin: 0 0 10px 0;
            font-size: 14px;
            font-weight: 600;
            color: #666;
        }
        
        .pm-task-group-label {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
            
            .pm-group-input {
                flex: 1;
                font-weight: 600;
                font-size: 14px;
            }
        }
        
        .pm-preview-item {
            display: flex;
            align-items: center;
            padding: 8px 0;
            margin-bottom: 5px;
            
            &.pm-editable-item {
                margin-bottom: 15px;
            }
            
            &.pm-task-item {
                padding-left: 20px;
            }
        }
        
        .pm-preview-icon {
            margin-right: 10px;
            
            .pm-project-icon {
                display: inline-block;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background-color: #3498db;
            }
        }
        
        .pm-editable-input {
            flex: 1;
            border: none;
            border-bottom: 1px solid transparent;
            padding: 5px 0;
            font-size: 14px;
            background: transparent;
            color: #333;
            transition: border-color 0.2s;
            
            &:focus {
                outline: none;
                border-bottom-color: #8b5cf6;
            }
            
            &.pm-task-input {
                margin-left: 8px;
            }
        }
        
        .pm-task-checkbox {
            margin-right: 8px;
            cursor: not-allowed;
        }
        
        .pm-edit-icon {
            margin-left: 8px;
            color: #999;
            font-size: 14px;
            cursor: pointer;
            
            &:hover {
                color: #8b5cf6;
            }
        }
        
        .pm-ai-preview-footer {
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
            text-align: right;
            
            .pm-btn-ai-save {
                background: #8b5cf6 !important;
                color: #fff !important;
                padding: 10px 20px;
                border: none;
                border-radius: 4px;
                font-weight: 600;
                cursor: pointer;
                
                &:hover:not(:disabled) {
                    background: #7c3aed !important;
                }
                
                &:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
            }
        }
    }
</style>

