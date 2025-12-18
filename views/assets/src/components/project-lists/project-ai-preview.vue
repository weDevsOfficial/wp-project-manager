<template>
    <div class="pm-ai-preview">
        <div class="pm-ai-preview-header">
            <span>{{ __( 'Previewing your Project & Tasks', 'wedevs-project-manager') }}</span>
            <transition name="fade">
                <button
                    v-if="hasSelectedItems"
                    class="pm-button pm-primary pm-btn-ai-delete"
                    @click="deleteSelected">
                    {{ __('Delete Selected', 'wedevs-project-manager') }}
                </button>
            </transition>
        </div>

        <div class="pm-ai-preview-content">
            <!-- Project Name -->
            <div class="pm-preview-section">
                <h4 class="pm-preview-label">{{ __( 'Project Name', 'wedevs-project-manager') }}</h4>
                <div class="pm-preview-item pm-editable-item">
                    <input
                        type="text"
                        v-model="projectData.title"
                        class="pm-editable-input"
                        :class="{ 'pm-input-error': hasTitleError }"
                        :placeholder="__( 'Project Name', 'wedevs-project-manager')"
                        @input="clearTitleError"
                    />
                    <i class="pm-icon flaticon-edit pm-edit-icon" @click="focusInput" aria-hidden="true"></i>
                </div>
            </div>

            <!-- Initial Tasks (without group) -->
            <div class="pm-preview-section" v-if="initialTasks.length > 0">
                <transition-group name="fade-slide" tag="div">
                    <div
                        class="pm-preview-item pm-task-item"
                        v-for="(task, index) in initialTasks"
                        :key="'initial-' + index">
                        <input
                            type="checkbox"
                            class="pm-task-checkbox"
                            :value="'initial-' + index"
                            v-model="selectedItems"
                        />
                        <input
                            type="text"
                            v-model="task.title"
                            class="pm-editable-input pm-task-input"
                            :placeholder="__( 'Task Name', 'wedevs-project-manager')"
                        />
                        <i class="pm-icon flaticon-edit pm-edit-icon" @click="focusInput" aria-hidden="true"></i>
                    </div>
                </transition-group>
            </div>

            <!-- Task Groups -->
            <transition-group name="fade-slide" tag="div">
                <div class="pm-preview-section" v-for="(group, groupIndex) in taskGroups" :key="'group-' + groupIndex">
                    <h4 class="pm-preview-label pm-task-group-label">
                        <input
                            type="checkbox"
                            class="pm-task-group-checkbox"
                            :value="'group-' + groupIndex"
                            v-model="selectedItems"
                        />
                        <input
                            type="text"
                            v-model="group.title"
                            class="pm-editable-input pm-group-input"
                            :placeholder="__( 'Task Group Name', 'wedevs-project-manager')"
                        />
                        <i class="pm-icon flaticon-edit pm-edit-icon" @click="focusInput" aria-hidden="true"></i>
                    </h4>
                    <transition-group name="fade-slide" tag="div">
                        <div
                            class="pm-preview-item pm-task-item"
                            v-for="(task, taskIndex) in group.tasks"
                            :key="'task-' + groupIndex + '-' + taskIndex">
                            <input
                                type="checkbox"
                                class="pm-task-checkbox"
                                :value="'task-' + groupIndex + '-' + taskIndex"
                                v-model="selectedItems"
                            />
                            <input
                                type="text"
                                v-model="task.title"
                                class="pm-editable-input pm-task-input"
                                :placeholder="__( 'Task Name', 'wedevs-project-manager')"
                            />
                            <i class="pm-icon flaticon-edit pm-edit-icon" @click="focusInput" aria-hidden="true"></i>
                        </div>
                    </transition-group>
                </div>
            </transition-group>
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
                selectedItems: [],
                hasTitleError: false
            }
        },
        computed: {
            initialTasks () {
                return this.projectData.tasks || [];
            },
            taskGroups () {
                return this.projectData.task_groups || [];
            },
            hasSelectedItems () {
                return this.selectedItems.length > 0;
            }
        },
        methods: {
            focusInput (event) {
                // Find the parent container (pm-preview-item or pm-task-group-label)
                const parent = event.target.closest('.pm-preview-item, .pm-task-group-label');
                if (parent) {
                    // Find the input element within the parent
                    const input = parent.querySelector('.pm-editable-input');
                    if (input) {
                        input.focus();
                    }
                }
            },
            deleteSelected () {
                if (this.selectedItems.length === 0) {
                    return;
                }

                // Sort selected items in reverse order to avoid index shifting issues
                const sortedItems = [...this.selectedItems].sort().reverse();

                sortedItems.forEach(item => {
                    if (item.startsWith('initial-')) {
                        // Delete initial task
                        const index = parseInt(item.replace('initial-', ''));
                        this.projectData.tasks.splice(index, 1);
                    } else if (item.startsWith('group-')) {
                        // Delete task group
                        const index = parseInt(item.replace('group-', ''));
                        this.projectData.task_groups.splice(index, 1);
                    } else if (item.startsWith('task-')) {
                        // Delete task from group
                        const parts = item.replace('task-', '').split('-');
                        const groupIndex = parseInt(parts[0]);
                        const taskIndex = parseInt(parts[1]);
                        if (this.projectData.task_groups[groupIndex] && this.projectData.task_groups[groupIndex].tasks) {
                            this.projectData.task_groups[groupIndex].tasks.splice(taskIndex, 1);
                        }
                    }
                });

                // Clear selection
                this.selectedItems = [];
            },
            saveProject () {
                if (!this.projectData.title || !this.projectData.title.trim()) {
                    this.hasTitleError = true;
                    pm.Toastr.error(__( 'Project name is required', 'wedevs-project-manager'));
                    return;
                }

                this.saving = true;
                this.$emit('save-project', this.projectData);
            },
            setTitleError () {
                this.hasTitleError = true;
            },
            clearTitleError () {
                this.hasTitleError = false;
            }
        }
    }

    export default project_ai_preview;
</script>

<style lang="less">
    .ui-dialog-titlebar {
        span.ui-dialog-title {
            font-size: 1.2rem;
        }
    }

    .pm-ai-preview {
        max-height: 600px;
        overflow-y: auto;

        .pm-ai-preview-header {
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid #e0e0e0;
            display: flex;
            justify-content: space-between;

            span {
                font-size: 1rem;
                margin-left: 5px;
                font-weight: bold;
            }

            h3 {
                margin: 0;
                font-size: 18px;
                font-weight: 600;
                color: #333;
            }

            .pm-btn-ai-delete {
                background: #e74c3c !important;
                color: #fff !important;
                padding: 0 8px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                transition: background 0.2s ease;

                &:hover {
                    background: #c0392b !important;
                }
            }
        }

        // Fade transition for delete button
        .fade-enter-active,
        .fade-leave-active {
            transition: opacity 0.2s ease;
        }

        .fade-enter,
        .fade-leave-to {
            opacity: 0;
        }

        // Fade and slide transition for items
        .fade-slide-enter-active {
            transition: all 0.25s ease;
        }

        .fade-slide-leave-active {
            transition: all 0.2s ease;
        }

        .fade-slide-enter {
            opacity: 0;
            transform: translateX(-10px);
        }

        .fade-slide-leave-to {
            opacity: 0;
            transform: translateX(10px);
        }

        .fade-slide-move {
            transition: transform 0.2s ease;
        }

        .pm-ai-preview-content {
            margin: 20px;
        }

        .pm-preview-section {
            &:last-child {
                margin-bottom: 0;
            }
        }

        .pm-preview-label {
            margin: 0 0 5px 0;
            font-size: 14px;
            font-weight: 600;
            color: #666;
        }

        .pm-task-group-label {
            padding: 0 10px !important;
            display: flex;
            align-items: center;

            .pm-group-input {
                flex: 1;
                font-weight: 600;
                font-size: 14px;
            }

            &:hover .pm-edit-icon {
                opacity: 1;
            }
        }

        .pm-preview-item {
            display: flex;
            align-items: center;

            &.pm-editable-item {
                &:hover .pm-edit-icon {
                    opacity: 1;
                }
            }

            &.pm-task-item {
                padding: 0 10px;
                border: 1px solid transparent;
                border-radius: 5px;
                margin-left: 20px;

                &:hover  {
                    border-color: #eee;
                }

                &:hover .pm-edit-icon {
                    opacity: 1;
                }
            }
        }

        .pm-editable-input {
            flex: 1;
            border: none;
            border-bottom: 1px solid transparent;
            background: transparent;
            color: #333;
            transition: border-color 0.2s;

            &:focus {
                outline: none;
                border: none;
                box-shadow: none;
            }

            &.pm-task-input {
                margin: 0 !important;
                padding: 0 !important;
            }

            &.pm-input-error {
                border-bottom: 2px solid #e74c3c !important;
                background-color: #fff5f5;
            }
        }

        .pm-task-checkbox,
        .pm-task-group-checkbox {
            margin-right: 8px;
            cursor: pointer;
        }

        .pm-edit-icon {
            margin-left: 8px;
            color: #999;
            font-size: 14px;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.2s, color 0.2s;

            &:hover {
                color: #8b5cf6;
            }
        }

        .pm-ai-preview-footer {
            border-top: 1px solid #e0e0e0;
            text-align: right;

            .pm-btn-ai-save {
                background: #8b5cf6 !important;
                color: #fff !important;
                padding: 0 20px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                margin-top: 20px;

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

