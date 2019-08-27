<template>
    <div class="mytask-outstanding">
        <table class="wp-list-table widefat fixed striped posts">
            <thead>
                <tr>
                    <td>{{ __('Tasks', 'wedevs-project-manager') }}</td>
                    <td>{{ __('Task List', 'wedevs-project-manager') }}</td>
                    <td>{{ __('Projects', 'wedevs-project-manager') }}</td>
                    <td>{{ __('Overdue', 'wedevs-project-manager') }}</td>
                </tr>
            </thead>
            <tbody>
                <tr v-if="tasks.length" v-for="task in tasks">
                    <td>{{ task.title }}</td>
                    <td>{{ task.task_list.title }}</td>
                    <td>{{ task.project.title }}</td>
                    <td>{{ getOverdueValue(task) }}</td>
                </tr>
                 <tr v-if="!tasks.length">
                    <td colspan="4">{{ __('No task found!', 'wedevs-project-manager') }}</td>
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
            getOverdueValue (task) {
                var dueDate = pm.Moment(task.due_date).add(1, "days").format('YYYY-MM-DD');
                
                return this.relativeDate(dueDate);
    
            },
            getCreatedAtValue (task) {
                if(this.$route.query.start_at == '' || this.$route.query.due_date == '') {
                    return task.created_at;
                }

                if(this.$route.query.start_at != '' && this.$route.query.due_date != '') {
                    return task.start_at +'-'+ task.due_date;
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
