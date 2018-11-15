<template> 
    <div class="pm-clearfix">

        <h3 v-if="!projects.length">{{ __( 'No projects found.', 'wedevs-project-manager') }}</h3>

        <article class="pm-project pm-column-gap-left pm-sm-col-12" v-for="project in projects" :key="project.id">
            <router-link 
                :title="project.title"
                :to="{ name: 'pm_overview',  params: { project_id: project.id }}">
                
                <div class="project_head">
                    <h5>{{ project.title }}</h5>

                    <div class="pm-project-detail"></div>
                </div>
                
            </router-link>

            <div class="pm-project-meta">
                <ul>
                    <li class="message">
                        <router-link :to="{
                            name: 'discussions',
                            params: {
                                project_id: project.id
                            }}">

                            <strong>
                                <i class="fa fa-circle" aria-hidden="true"></i>
                                {{ parseInt(project.meta.data.total_discussion_boards) }}
                            </strong> 
                                {{ __( 'Discussions', 'wedevs-project-manager') }}

                        </router-link>
                    </li>

                    <li class="todo">
                        <router-link :to="{
                            name: 'task_lists',
                            params: {
                                project_id: project.id
                            }}">

                            <strong>
                                <i class="fa fa-circle" aria-hidden="true"></i>
                                {{ parseInt(project.meta.data.total_task_lists) }}
                            </strong> 
                                {{ __( 'Task Lists', 'wedevs-project-manager') }}
                        </router-link>
                    </li>

                    <li class="files">
                        <router-link :to="{
                            name: 'task_lists',
                            params: {
                                project_id: project.id
                            }}">

                            <strong>
                                <i class="fa fa-circle" aria-hidden="true"></i>
                                {{ parseInt(project.meta.data.total_tasks) }}
                            </strong> 
                                {{ __( 'Tasks', 'wedevs-project-manager') }}
                        </router-link>
                    </li>

                    <li class="milestone">
                        <router-link :to="{
                            name: 'milestones',
                            params: {
                                project_id: project.id
                            }}">

                            <strong>
                                <i class="fa fa-circle" aria-hidden="true"></i>
                                {{ parseInt(project.meta.data.total_milestones) }}
                            </strong> 
                                {{ __( 'Milestones', 'wedevs-project-manager') }}
                        </router-link>
                    </li>   

                    <li class="files">
                        <router-link :to="{
                            name: 'task_lists',
                            params: {
                                project_id: project.id
                            }}">

                            <strong>
                                <i class="fa fa-circle" aria-hidden="true"></i>
                                {{ parseInt(project.meta.data.total_files) }}
                            </strong> 
                                {{ __( 'Files', 'wedevs-project-manager') }}
                        </router-link>
                    </li>

                    <li class="milestone">
                        <a href="#">

                            <strong>
                                <i class="fa fa-circle" aria-hidden="true"></i>
                                {{ parseInt(project.meta.data.total_comments) }}
                            </strong> 
                                {{ __( 'Comments', 'wedevs-project-manager') }}
                        </a>
                    </li>

                    <div class="clearfix"></div>
                </ul>
            </div>

             <div class="pm-progress pm-progress-info">
                <div :style="projectCompleteStatus(project)" class="bar completed"></div>
            </div>

            <div class="pm-progress-percentage"></div>

            <footer class="pm-project-people">
                <div class="pm-scroll">
                    <img v-for="user in project.assignees.data" :alt="user.display_name" :src="user.avatar_url" class="avatar avatar-48 photo" height="48" width="48" :key="user.id">  
                </div>
            </footer>

            <div class="pm-project-action-icon">
                <div class="pm-project-action">
                    <favourite :project="project"></favourite>
                    <span  v-if="is_manager(project)" @click.prevent="settingsShowHide(project)" :title="project_action" class="dashicons dashicons-admin-generic pm-settings-bind"></span>


                    <ul v-if="project.settings_hide && is_manager(project)" class="pm-settings">
                        <li>
                            <span class="pm-spinner"></span>
                            <a @click.prevent="deleteProject(project.id, project)" class="pm-project-delete-link" :title="__( 'Delete project', 'wedevs-project-manager')">
                                <span class="dashicons dashicons-trash"></span>
                                <span>{{ __( 'Delete', 'wedevs-project-manager') }}</span>
                            </a>
                        </li>
                        <li>
                            <span class="pm-spinner"></span>
                            <a @click.prevent="projectMarkAsDoneUndone(project)" class="pm-archive" >
                                <span v-if="project.status == 'incomplete'" class="dashicons dashicons-yes"></span>
                                <span v-if="project.status == 'incomplete'">{{ __( 'Complete', 'wedevs-project-manager') }}</span>

                                <span v-if="project.status == 'complete'" class="dashicons dashicons-undo"></span>
                                <span v-if="project.status == 'complete'">{{ __( 'Restore', 'wedevs-project-manager') }}</span>
                                
                            </a>
                        </li>
                        <pm-do-action :hook="'project_action_menu'" :actionData="project" ></pm-do-action>
                    </ul>
                </div>
            </div>
        </article>
    </div>
</template>


<script>

    import Favourite from './favourite.vue';

    export default {
        data () {
            return {
                is_active_settings: false,
                is_update: false,
                project: {},
                project_action: __( 'Project Actions', 'wedevs-project-manager')
            }
        },
        computed: {
            projects () {
                return this.$root.$store.state.projects;
            },
            meta () {
                return this.$root.$store.state.projects_meta;
            }
        },
        components: {
            Favourite
        },

        methods: {

            settingsShowHide (project) {
                project.settings_hide = project.settings_hide ? false : true;
            },

            projectCompleteStatus (project) {
                var progress = 0;
                if (typeof project.meta !== 'undefined') {
                    var total_task = parseInt(project.meta.data.total_tasks, 10) || 0;
                    var completed = parseInt(project.meta.data.total_complete_tasks, 10) || 0;
                    progress = ((100 * completed) /  total_task);
                }
                return {
                    width: progress + '%' 
                };
            },
            projectMarkAsDoneUndone (project) {
                var self = this;
                project.status = project.status === 'complete' ? 'incomplete' : 'complete';
                
                var args ={
                    data:{
                        'id': project.id,
                        'title': project.title,
                        'status': project.status,
                    },
                    callback: function(project) {

                        switch (project.data.status) {
                            
                            case 'complete':
                                self.getProjects({
                                    conditions:{status: 'incomplete'},
                                    callback () {
                                        if(!self.$store.state.projects.length) {
                                            self.$router.push({
                                                name: 'project_lists'
                                            })
                                        }
                                    }
                                });
                                break;

                            case 'incomplete':
                                
                                self.getProjects({
                                    conditions:{status: 'complete'},
                                    callback () {
                                        if(!self.$store.state.projects.length) {
                                            self.$router.push({
                                                name: 'completed_projects'
                                            })
                                        }
                                    }
                                });
                                break;

                            default:
                                self.getProjects();
                                break;
                        }
                    }
                }

                this.updateProject(args);
            }
        }
    }

</script>

<style>
    .fa-circle {
        margin-right: 6%;
    }
</style>



