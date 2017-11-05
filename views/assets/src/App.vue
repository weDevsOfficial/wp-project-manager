<template>
    <div class="wedevs-pm-wrap pm wrap">
        <pm-projects></pm-projects>
        <pm-overview></pm-overview>
        <pm-discussions></pm-discussions>
        <pm-activities></pm-activities>
        <pm-milestones></pm-milestones>
        <pm-categories></pm-categories>
        <pm-task-lists></pm-task-lists>
        <pm-files></pm-files>
        <pm-settings></pm-settings>
        <pm-my-tasks></pm-my-tasks>
        <router-view name="add-ons"></router-view>
        <router-view name="calendar"></router-view>
        <router-view name="reports"></router-view>
        <router-view name="progress"></router-view>


        <do-action hook="addons-component"></do-action>
    </div>
</template>

<script>
    import discussions from './components/project-discussions/index.vue';
    import projects from './components/project-lists/index.vue';
    import overview from './components/project-overview/index.vue';
    import activities from './components/project-activities/index.vue';
    import milestones from './components/project-milestones/index.vue';
    import categories from './components/categories/index.vue';
    import task_lists from './components/project-task-lists/index.vue';
    import files from './components/project-files/index.vue';
    import do_action from './components/common/do-action.vue';
    import settings from './components/settings/index.vue';
    import my_tasks from './components/my-tasks/index.vue';

    export default {
        components: {
            'pm-discussions': discussions,
            'pm-projects': projects,
            'pm-overview': overview,
            'pm-activities': activities,
            'pm-milestones': milestones,
            'pm-categories': categories,
            'pm-task-lists': task_lists,
            'pm-files': files,
            'do-action': do_action,
            'pm-settings': settings,
            'pm-my-tasks': my_tasks
        }
        
    }
</script>

<!-- Global style -->
<style>
    #nprogress .bar {
        z-index: 99999;
    }

</style> 

