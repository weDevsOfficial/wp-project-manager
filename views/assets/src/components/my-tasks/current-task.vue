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
                <tr v-for="task in tasks">
                    <td>{{ task.title }}</td>
                    <td>{{ task.task_list.title }}</td>
                    <td>{{ task.project.title }}</td>
                    <td>{{ getCreatedAtValue(task) }}</td>
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
            getCreatedAtValue (task) {
                if(this.$route.query.start_at == '' || this.$route.query.due_date == '') {
                    return this.shortDateFormat(task.created_at);
                }

                if(this.$route.query.start_at != '' && this.$route.query.due_date != '') {
                    return this.shortDateFormat(task.start_at) +'-'+ this.shortDateFormat(task.due_date);
                }
            },
            getCreatedAtLabel () {

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
