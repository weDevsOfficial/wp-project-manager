<template>
    <div class="mytask-current">
        <table class="wp-list-table widefat fixed striped posts">
            <thead>
                <tr>
                    <td>{{ __('Tasks', 'wedevs-project-manager') }}</td>
                    <td>{{ __('Task List', 'wedevs-project-manager') }}</td>
                    <td>{{ __('Projects', 'wedevs-project-manager') }}</td>
                    <td>{{ getCreatedAtLabel() }}</td>
                </tr>
            </thead>
            <tbody>
                <tr v-if="tasks.length" v-for="task in tasks">
                    <td><a href="#" @click.prevent="popuSilgleTask(task)">{{ task.title }}</a></td>
                    <td>
                        <router-link
                          :to="{
                            name: 'single_list',
                            params: {
                                project_id: task.project_id,
                                list_id: task.task_list_id
                            }
                        }">
                            {{ task.task_list.title }}
                        </router-link>

                    </td>
                    <td>
                        <router-link
                          :to="{
                            name: 'task_lists',
                            params: {
                                project_id: task.project_id,
                            }
                        }">
                            {{ task.project.title }}
                        </router-link>
                    </td>
                    <td>{{ getCreatedAtValue(task) }}</td>
                </tr>
                <tr v-if="!tasks.length">
                    <td colspan="4">{{ __('No task found!', 'wedevs-project-manager') }}</td>
                </tr>
            </tbody>
        </table>

        <div v-if="parseInt(individualTaskId) && parseInt(individualProjectId)">
            <single-task :taskId="parseInt(individualTaskId)" :projectId="parseInt(individualProjectId)"></single-task>
        </div>
        <router-view name="singleTask"></router-view>
    </div>
</template>
<script>
    export default {
        props: {
            tasks: {
                type: [Array],
                default () {
                    return [];
                }
            }
        },

        data () {
            return {
                individualTaskId: 0,
                individualProjectId: 0
            }
        },

        components: {
            'single-task': pm.SingleTask,
        },

        created () {
            pmBus.$on('pm_after_close_single_task_modal', this.afterCloseSingleTaskModal);
            pmBus.$on('pm_generate_task_url', this.generateTaskUrl);
        },

        methods: {
            goToSigleList (task) {
                this.$router.push({
                    name: 'single_list',
                    params: { 
                        project_id: task.project_id,
                        list_id: task.task_list_id
                    }
                });
            },
            goToProject(task) {
                this.$router.push({
                    name: 'task_lists',
                    params: { 
                        project_id: task.project_id,
                    }
                });
            },
            afterCloseSingleTaskModal () {
                this.individualTaskId = false;
                this.individualProjectId = false;
            },
            popuSilgleTask (task) {
                this.individualTaskId = task.id;
                this.individualProjectId = task.project_id;
            },
            getCreatedAtValue (task) {
                if(typeof this.$route.query.start_at == 'undefined' || typeof this.$route.query.due_date == 'undefined') {
                    return this.shortDateFormat(task.created_at);
                }

                if(this.$route.query.start_at == '' || this.$route.query.due_date == '') {
                    return this.shortDateFormat(task.created_at);
                }

                if(this.$route.query.start_at != '' && this.$route.query.due_date != '') {
                    return this.shortDateFormat(task.start_at) +'-'+ this.shortDateFormat(task.due_date);
                }
            },
            getCreatedAtLabel () {

                if(typeof this.$route.query.start_at == 'undefined' || typeof this.$route.query.due_date == 'undefined') {
                    return __('Created at', 'wedevs-project-manager');
                }

                if(this.$route.query.start_at == '' || this.$route.query.due_date == '') {
                    return __('Created at', 'wedevs-project-manager');
                }

                if(this.$route.query.start_at != '' && this.$route.query.due_date != '') {
                    return __('Date Between', 'wedevs-project-manager');
                }
            }
        }
    }
</script>
