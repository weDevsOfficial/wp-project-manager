<template>
    <div>
        <div class="pm-wrap pm my-tasks pm-my-tasks">
            <h1 class="wp-heading-inline">
                {{ __( 'Tasks', 'wedevs-project-manger') }}
            </h1>
            <a href="#" @click.prevent="selfNewTask()" class="page-title-action">{{ __( 'Add New', 'wedevs-project-manger') }}</a>
            <my-task-header></my-task-header>
            <router-view></router-view>
            <new-task-form></new-task-form>
        </div>
    </div>
</template>


<script>
import myTaskHeader from './my-task-header.vue';
import Mixins from './mixin';
import NewTaskForm from './new-task.vue';

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
        // if (!this.canShowMyTask()) {
        //     this.$router.push({name:'project_lists'});
        // }
        this.getUserMeta();
        this.getAllusers();
        // pmBus.$on('pm_generate_task_url', this.generateTaskUrl);
        
    },
    components: {
        'myTaskHeader': myTaskHeader,
        'new-task-form': NewTaskForm
    },

    methods: {
        selfNewTask () {

        }
    },
}
</script>

<style>

</style>
