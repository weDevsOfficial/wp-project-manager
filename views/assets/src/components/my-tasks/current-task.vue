<template>
    <div class="mytask-current">

        <div v-if="!isloaded" class="pm-data-load-before" >
            <div class="loadmoreanimation">
                <div class="load-spinner">
                    <div class="rect1"></div>
                    <div class="rect2"></div>
                    <div class="rect3"></div>
                    <div class="rect4"></div>
                    <div class="rect5"></div>
                </div>
            </div>
        </div>

        <div v-else>
            <div id="pm-mytask-page-content">
                <ul class="pm-todolists">
                    <li class="pm-fade-out-15">
                        <article class="pm-todolist" v-for="project in projects"  :key="project.id">
                            <header class="pm-list-header">
                                <h3>
                                    <router-link :to="{name: 'pm_overview', params: {
                                        project_id: project.id
                                    }}" >
                                        {{project.title}}
                                    </router-link>
                                </h3>
                            </header>
                             <div class="pm-incomplete-tasks">
                                <ul class="pm-todos pm-todolist-content pm-incomplete-task ">
                                    <li class="pm-todo pm-fade-out-15" v-for="task in project.tasks.data" :key="task.id">
                                        <my-task :task="task"></my-task>
                                    </li>
                                </ul>
                            </div>
                        </article>
                    </li>
                </ul>
                <div class="no-task" v-if="!projects.length">
                    <p>{{ __("No Task Found", 'pm-pro') }}</p>
                </div>
            </div>
        </div>
        <router-view name="mytask-current-single-task"></router-view>
    </div>
</template>
<script>
    import myTask from "./task.vue";
    import Mixins from './mixin';

    export default {
        data () {
            return {
                hasCurrentTask: true,
            }
        },
        components: {
            'myTask' : myTask
        },
        watch:{
            '$route' (route) {
                if (route.params.user_id !== this.user_id) {
                    this.$store.commit('myTask/setLoadFalse');
                    this.getSelfCurrontaTask();
                    this.getUserMeta();
                    this.user_id = route.params.user_id;
                } else {
                    pm.NProgress.done();
                }
            }
        },
        created () {

            if (!this.canShowMyTask()) {
                this.$router.push({name:'project_lists'});
            }
           // if (!this.isloaded) {
                this.getSelfCurrontaTask();
           // }
        },
        mixins: [PmMixin.projectTaskLists, Mixins],
        computed: {
            projects () {
                return this.$store.state.myTask.currentTasks;
            },
            isloaded () {
                return this.$store.state.myTask.isFetchCurrentTasks;
            }
        },

        methods: {
            getSelfCurrontaTask () {
                var user_id = typeof this.$route.params.user_id !== 'undefined' ? this.$route.params.user_id : this.current_user.ID;
                var args = {
                    user_id: user_id,
                    data: {
                        task_type: 'current'
                    },
                    callback (res) {
                        this.$store.commit('myTask/setCurrentTasks', res.data.projects.data);
                        this.$store.state.myTask.isFetchCurrentTasks = true;

                        pm.NProgress.done();
                    }
                }
                this.getUserTaskByType(args);
            }
        }
    }
</script>
