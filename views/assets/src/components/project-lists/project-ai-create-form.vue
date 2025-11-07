<template>
    <div>
        <form v-if="!showPreview" action="" method="post" class="pm-form pm-project-ai-form" @submit.prevent="generateProject();">
            <div class="pm-form-item item project-ai-prompt">
                <textarea 
                    v-model="ai_prompt" 
                    class="pm-project-ai-description" 
                    id="ai_prompt" 
                    rows="8" 
                    :placeholder="prompt_placeholder">
                </textarea>
            </div>

            <div class="submit">
                <input 
                    type="submit" 
                    name="generate_project" 
                    id="generate_project" 
                    class="pm-button pm-primary" 
                    :value="generate_button_text"
                    :disabled="generating">
                <a @click.prevent="closeForm()" class="pm-button pm-secondary project-cancel" href="#">
                    {{ __( 'Close', 'wedevs-project-manager') }}
                </a>
                <span v-show="generating" class="pm-loading"></span>
            </div>
        </form>

        <project-ai-preview 
            v-if="showPreview" 
            :projectData="generatedProject"
            @save-project="saveProject">
        </project-ai-preview>
    </div>
</template>

<script>
    import project_ai_preview from './project-ai-preview.vue';
    import Mixins from '@helpers/mixin/mixin';

    var project_ai_form = {
        mixins: [Mixins],
        components: {
            'project-ai-preview': project_ai_preview
        },
        data () {
            return {
                ai_prompt: '',
                generating: false,
                showPreview: false,
                generatedProject: {
                    title: '',
                    description: '',
                    tasks: [],
                    task_groups: []
                },
                prompt_placeholder: __( 'Write about your project here, so that AI can create the project and tasks', 'wedevs-project-manager'),
                generate_button_text: __( 'Generate', 'wedevs-project-manager'),
                base_url: PM_Vars.api_base_url
            }
        },
        methods: {
            generateProject () {
                if (!this.ai_prompt.trim()) {
                    pm.Toastr.error(__( 'Please enter a project description', 'wedevs-project-manager'));
                    return;
                }

                this.generating = true;
                
                // Call AI API to generate project structure
                var self = this;
                var requestData = {
                    prompt: this.ai_prompt,
                    is_admin: PM_Vars.is_admin
                };
                
                jQuery.ajax({
                    type: 'POST',
                    url: this.base_url + 'pm/v2/projects/ai/generate',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader("Authorization_name", btoa('mslweiew'));
                        xhr.setRequestHeader("Authorization_password", btoa('1$%#$8sgf&*FBI'));
                        xhr.setRequestHeader("X-WP-Nonce", PM_Vars.permission);
                    },
                    data: requestData,
                    success: function(res) {
                        self.generating = false;
                        
                        // Check if response has an error message
                        if (res.message && (typeof res.message === 'string' || Array.isArray(res.message))) {
                            var errorMsg = Array.isArray(res.message) ? res.message.join(', ') : res.message;
                            pm.Toastr.error(errorMsg);
                            return;
                        }
                        
                        // Check if response has error in data
                        if (res.data && res.data.message && !res.data.title) {
                            pm.Toastr.error(res.data.message);
                            return;
                        }
                        
                        if (res.data && (res.data.title || res.data.tasks || res.data.task_groups)) {
                            self.generatedProject = res.data;
                            self.showPreview = true;
                        } else {
                            var errorMsg = res.message || (res.data && res.data.message) || __( 'Failed to generate project structure', 'wedevs-project-manager');
                            pm.Toastr.error(errorMsg);
                        }
                    },
                    error: function(xhr, status, error) {
                        self.generating = false;
                        var errorMsg = __( 'Failed to generate project. Please try again.', 'wedevs-project-manager');
                        
                        // Try to extract error message from response
                        if (xhr.responseJSON) {
                            // Handle array of messages (WordPress REST API format)
                            if (Array.isArray(xhr.responseJSON.message)) {
                                errorMsg = xhr.responseJSON.message.join(', ');
                            }
                            // Handle single message string
                            else if (typeof xhr.responseJSON.message === 'string') {
                                errorMsg = xhr.responseJSON.message;
                            }
                            // Handle error object with message
                            else if (xhr.responseJSON.error && xhr.responseJSON.error.message) {
                                errorMsg = xhr.responseJSON.error.message;
                            }
                            // Handle data.message format
                            else if (xhr.responseJSON.data && xhr.responseJSON.data.message) {
                                errorMsg = xhr.responseJSON.data.message;
                            }
                        }
                        // Fallback to status text if available
                        else if (xhr.statusText) {
                            errorMsg = sprintf(__( 'Request failed: %s', 'wedevs-project-manager'), xhr.statusText);
                        }
                        // Fallback to status code
                        else if (xhr.status) {
                            errorMsg = sprintf(__( 'Request failed with status code: %d', 'wedevs-project-manager'), xhr.status);
                        }
                        
                        pm.Toastr.error(errorMsg);
                    }
                });
            },
            saveProject (projectData) {
                var self = this;
                this.generating = true;

                // First create the project
                var projectArgs = {
                    data: {
                        title: projectData.title,
                        description: projectData.description || this.ai_prompt,
                        status: 'incomplete'
                    },
                    callback: function(res) {
                        if (res.data && res.data.id) {
                            var projectId = res.data.id;
                            
                            // Create task lists and tasks
                            self.createTaskListsAndTasks(projectId, projectData, function() {
                                self.generating = false;
                                pm.Toastr.success(__( 'Project created successfully!', 'wedevs-project-manager'));
                                self.closeForm();
                                
                                // Navigate to the project
                                self.$router.push({
                                    name: 'pm_overview',
                                    params: {
                                        project_id: projectId
                                    }
                                });
                            });
                        } else {
                            self.generating = false;
                            pm.Toastr.error(__( 'Failed to create project', 'wedevs-project-manager'));
                        }
                    }
                };

                this.newProject(projectArgs);
            },
            createTaskListsAndTasks (projectId, projectData, callback) {
                var self = this;
                var tasksToCreate = [];
                var taskListsToCreate = [];

                // Create initial tasks (without group) in inbox
                if (projectData.tasks && projectData.tasks.length > 0) {
                    tasksToCreate = tasksToCreate.concat(
                        projectData.tasks.map(function(task) {
                            return {
                                title: task.title,
                                project_id: projectId,
                                board_id: null // Will use inbox
                            };
                        })
                    );
                }

                // Create task groups and their tasks
                if (projectData.task_groups && projectData.task_groups.length > 0) {
                    var groupIndex = 0;
                    projectData.task_groups.forEach(function(group) {
                        // Create task list for the group
                        taskListsToCreate.push({
                            title: group.title,
                            project_id: projectId,
                            callback: function(taskListRes) {
                                if (taskListRes.data && taskListRes.data.id && group.tasks) {
                                    // Create tasks for this task list
                                    group.tasks.forEach(function(task) {
                                        tasksToCreate.push({
                                            title: task.title,
                                            project_id: projectId,
                                            board_id: taskListRes.data.id
                                        });
                                    });
                                }
                                
                                groupIndex++;
                                if (groupIndex === projectData.task_groups.length) {
                                    // All task lists created, now create tasks
                                    self.createTasksSequentially(tasksToCreate, callback);
                                }
                            }
                        });
                    });
                } else {
                    // No task groups, just create initial tasks
                    if (tasksToCreate.length > 0) {
                        this.createTasksSequentially(tasksToCreate, callback);
                    } else {
                        callback();
                    }
                }

                // Create task lists sequentially
                if (taskListsToCreate.length > 0) {
                    this.createTaskListsSequentially(taskListsToCreate);
                } else if (tasksToCreate.length === 0) {
                    callback();
                }
            },
            createTaskListsSequentially (taskLists) {
                if (taskLists.length === 0) return;
                
                var self = this;
                var taskList = taskLists.shift();
                
                jQuery.ajax({
                    type: 'POST',
                    url: this.base_url + 'pm/v2/projects/' + taskList.project_id + '/task-lists',
                    data: {
                        title: taskList.title
                    },
                    success: function(res) {
                        if (typeof taskList.callback === 'function') {
                            taskList.callback(res);
                        }
                        if (taskLists.length > 0) {
                            self.createTaskListsSequentially(taskLists);
                        }
                    },
                    error: function() {
                        // Continue even if one fails
                        if (taskLists.length > 0) {
                            self.createTaskListsSequentially(taskLists);
                        }
                    }
                });
            },
            createTasksSequentially (tasks, callback) {
                if (tasks.length === 0) {
                    callback();
                    return;
                }
                
                var self = this;
                var task = tasks.shift();
                
                // Get inbox if board_id is null
                if (!task.board_id) {
                    // Use inbox - we'll need to get it from project meta
                    // For now, create without board_id and it will use inbox
                    task.board_id = null;
                }
                
                jQuery.ajax({
                    type: 'POST',
                    url: this.base_url + 'pm/v2/projects/' + task.project_id + '/tasks',
                    data: {
                        title: task.title,
                        board_id: task.board_id,
                        project_id: task.project_id
                    },
                    success: function() {
                        if (tasks.length > 0) {
                            self.createTasksSequentially(tasks, callback);
                        } else {
                            callback();
                        }
                    },
                    error: function() {
                        // Continue even if one fails
                        if (tasks.length > 0) {
                            self.createTasksSequentially(tasks, callback);
                        } else {
                            callback();
                        }
                    }
                });
            },
            closeForm () {
                jQuery('#pm-ai-project-dialog').dialog( "close" );
                this.ai_prompt = '';
                this.showPreview = false;
                this.generatedProject = {
                    title: '',
                    description: '',
                    tasks: [],
                    task_groups: []
                };
            }
        }
    }

    export default project_ai_form;
</script>

<style lang="less">
    .pm-project-ai-form {
        .pm-project-ai-description {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
            line-height: 1.5;
            resize: vertical;
            min-height: 150px;
        }
        
        .submit {
            margin-top: 15px;
            text-align: right;
            
            .pm-button {
                margin-left: 10px;
            }
        }
    }
</style>

