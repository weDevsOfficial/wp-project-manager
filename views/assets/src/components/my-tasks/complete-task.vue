<template>
    <div class="mytask-current">
        <table class="wp-list-table widefat fixed striped posts">
            <thead>
                <tr>
                    <td>{{ __('Tasks', 'wedevs-project-manager') }}</td>
                    <td>{{ __('Task List', 'wedevs-project-manager') }}</td>
                    <td>{{ __('Projects', 'wedevs-project-manager') }}</td>
                    <td>{{ __('Completed at', 'wedevs-project-manager') }}</td>
                </tr>
            </thead>
            <tbody>
                <tr v-for="task in tasks">
                    <td>{{ task.title }}</td>
                    <td>{{ task.task_list.title }}</td>
                    <td>{{ task.project.title }}</td>
                    <td>{{ shortDateFormat(task.completed_at) }}</td>
                </tr>
            </tbody>
        </table>
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

        created () {
            
        },

        methods: {

        }
    }
</script>
