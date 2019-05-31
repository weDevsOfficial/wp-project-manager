<template>
    <div>
        <div class="pm-wrap pm my-tasks pm-my-tasks">
            <my-task-header></my-task-header>
            <router-view></router-view>
        </div>
    </div>
</template>


<script>
import myTaskHeader from './my-task-header.vue';
import Mixins from './mixin';

export default {
    beforeRouteEnter (to, from, next) {
        next(vm => {

        });
    },
    mixins: [Mixins],
    data() {
        return {

        }
    },
    created () {
        if (!this.canShowMyTask()) {
            this.$router.push({name:'project_lists'});
        }
        this.getUserMeta();
        this.getAllusers();
        pmBus.$on('pm_generate_task_url', this.generateTaskUrl);
        //pmBus.$on('pm_after_close_single_task_modal', this.afterCloseSingleTaskModal);
    },
    components: {
        'myTaskHeader': myTaskHeader
    },

    methods: {
        afterCloseSingleTaskModal () {
            var params = {}, route = null;
            if (typeof this.$route.params.user_id !== 'undefined') {
                params.user_id = parseInt(this.$route.params.user_id)
            }

            if(this.$route.name == 'mytask_current_single_task') {
                route = 'mytask-current';
            }

            if(this.$route.name == 'mytask_complete_single_task') {
                route = 'mytask-complete';
            }

            if(this.$route.name == 'mytask_outstanding_single_task') {
                route = 'outstanding-task';
            }

            this.taskId = false;
            this.projectId = false;
        },

        generateTaskUrl (task) {
            var params = {}, route = null;

            params.task_id = task.id;
            params.project_id = task.project_id;

            if (typeof this.$route.params.user_id !== 'undefined') {
                params.user_id = parseInt(this.$route.params.user_id)
            }

            if(this.$route.name == 'mytask-current') {
                route = 'mytask_current_single_task';
            }

            if(this.$route.name == 'mytask-complete' ) {
                route = 'mytask_complete_single_task';
            }

            if(this.$route.name == 'outstanding-task') {
                route = 'mytask_outstanding_single_task';
            }

            if (typeof this.$route.params.user_id !== 'undefined') {
                params.user_id = parseInt(this.$route.params.user_id)
            }

            var url = this.$router.resolve({
                name: route,
                params: params
            }).href;

            var url = PM_Vars.project_page + url;
            this.copy(url);
        }
    },
    destroyed () {
        this.$store.state.myTask.isFetchMyTaskOverview = false;
        this.$store.state.myTask.isFetchMyTaskActivities = false;
        this.$store.state.myTask.isFetchMyTaskProjects = false;

    }
}
</script>

<style>

</style>
