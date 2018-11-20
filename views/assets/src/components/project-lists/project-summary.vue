<template> 
    <!-- project-list-view toggle this class for list view -->
    <div class="pm-projects-row">
        <h3 v-if="!projects.length" class="no-projects">{{ __( 'No projects found.', 'wedevs-project-manager') }}</h3>
        <div class="pm-project-column" v-for="project in projects" :key="project.id">

            <article class="pm-project-item clearfix">
                <!-- project item header -->
                <div class="pm-project-item-header">
                    <h3 class="pm-project-title pm-d-inline pm-pull-left">
                        <router-link 
                            :title="project.title"
                            :to="{ name: 'pm_overview',  params: { project_id: project.id }}">
                            {{ project.title }}
                        </router-link>
                    </h3>
                    <ul class="pm-pull-right pm-list-inline pm-project-settings">
                        <li>
                            <favourite :project="project"></favourite>
                        </li>

                        <li class="pm-has-dropdown">
                            <a href="javscript: void(0)" class="pm-dropdown-trigger" @click.prevent="dropdownTrigger()"><i class="pm-icon flaticon-more"></i></a>
                            <!-- prev condition v-if="project.settings_hide && is_manager(project)" -->
                            <ul :class="dropdownToggleClass">
                                <li>
                                    <a href="javascript: void(0);" @click.prevent="deleteProject(project.id, project)" class="pm-project-delete-link" :title="__( 'Delete project', 'wedevs-project-manager')">
                                        <span class="dashicons dashicons-trash"></span>
                                        <span>{{ __( 'Delete', 'wedevs-project-manager') }}</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="javascript: void(0);" @click.prevent="projectMarkAsDoneUndone(project)" class="pm-archive" >
                                        <span v-if="project.status == 'incomplete'" class="dashicons dashicons-yes"></span>
                                        <span v-if="project.status == 'incomplete'">{{ __( 'Complete', 'wedevs-project-manager') }}</span>

                                        <span v-if="project.status == 'complete'" class="dashicons dashicons-undo"></span>
                                        <span v-if="project.status == 'complete'">{{ __( 'Restore', 'wedevs-project-manager') }}</span>
                                        
                                    </a>
                                </li>
                                <pm-do-action :hook="'project_action_menu'" :actionData="project" ></pm-do-action>
                            </ul>
                        </li>
                    </ul>
                </div><!-- /.item header -->
                
                <!-- project item's body -->
                <div class="pm-project-item-body">
                    <!-- <ul class="pm-project-tags pm-list-inline">
                        <li>
                            <a href="#" class="tag-design">Design</a>
                        </li>
                    </ul> -->
                    <div class="pm-project-info">
                        <div class="pm-project-description">
                            <p v-text="project.description.content"></p>
                        </div>
                        <ul class="pm-project-meta-counters pm-list-inline">
                            <li class="pm-meta-overview pm-has-tooltip">
                                <router-link :to="{
                                    name: 'task_lists',
                                    params: {
                                        project_id: project.id
                                    }}">
                                    <i class="pm-icon flaticon-pm-overview" aria-hidden="true"></i>
                                    <span class="pm-tooltip-label">{{ parseInt(project.meta.data.total_tasks) + __( ' Tasks', 'wedevs-project-manager') }}</span>
                                </router-link>
                            </li>
                            <li class="pm-meta-discussion pm-has-tooltip">
                                <router-link :to="{
                                    name: 'discussions',
                                    params: {
                                        project_id: project.id
                                    }}">
                                    <i class="pm-icon flaticon-pm-discussions"></i>
                                    <span class="pm-tooltip-label">{{ parseInt(project.meta.data.total_discussion_boards) + __( ' Discussions', 'wedevs-project-manager') }}</span>
                                </router-link>
                            </li>
                            <li class="pm-meta-list pm-has-tooltip">
                                <router-link :to="{
                                    name: 'task_lists',
                                    params: {
                                        project_id: project.id
                                    }}">
                                    <i class="pm-icon flaticon-list"></i>
                                    <span class="pm-tooltip-label">{{ parseInt(project.meta.data.total_task_lists) + __( ' Task Lists', 'wedevs-project-manager') }}</span>
                                </router-link>
                            </li>
                            <li class="pm-meta-files pm-has-tooltip">
                                <router-link :to="{
                                    name: 'task_lists',
                                    params: {
                                        project_id: project.id
                                    }}">
                                    <i class="pm-icon flaticon-document"></i>
                                    <span class="pm-tooltip-label">{{ parseInt(project.meta.data.total_files) + __( ' Files', 'wedevs-project-manager') }}</span>
                                </router-link>
                            </li>
                            <li class="pm-meta-flag pm-has-tooltip">
                                <router-link :to="{
                                    name: 'milestones',
                                    params: {
                                        project_id: project.id
                                    }}">
                                    <i class="pm-icon flaticon-flag"></i>
                                    <span class="pm-tooltip-label">{{ parseInt(project.meta.data.total_milestones) + __( ' Milestones', 'wedevs-project-manager') }}</span>
                                </router-link>
                            </li>
                            <li class="pm-meta-comment pm-has-tooltip">
                                <a href="#">
                                    <i class="pm-icon flaticon-comment-black-oval-bubble-shape"></i>
                                    <span class="pm-tooltip-label">{{ parseInt(project.meta.data.total_comments) + __( ' Comments', 'wedevs-project-manager')}}</span>
                                </a>
                            </li>
                        </ul>

                        <!-- progress -->
                        <div class="pm-project-progress">
                            <!-- <div :style="projectCompleteStatus(project)" class="bar completed"></div> -->
                            <span :style="projectCompleteStatus(project)" class="pm-project-status"></span>
                        </div>

                        <!-- project users -->
                        <div class="pm-project-users">
                            <ul class="pm-list-inline">
                                <!-- prev code -->
                                <!-- <li v-for="(user, key) in project.assignees.data">
                                    <img class="pm-img-circle" :src="user.avatar_url" :alt="user.display_name">
                                </li> -->

                                <li class="pm-has-tooltip">
                                    <img src="http://2.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=96&d=mm&r=g" alt="">
                                    <span class="pm-tooltip-label">User Name</span>
                                </li>
                                <li class="pm-has-tooltip">
                                    <img src="http://2.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=96&d=mm&r=g" alt="">
                                    <span class="pm-tooltip-label">User Name</span>
                                </li>
                                <li class="pm-has-tooltip">
                                    <img src="http://2.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=96&d=mm&r=g" alt="">
                                    <span class="pm-tooltip-label">User Name</span>
                                </li>
                                <li class="pm-has-tooltip">
                                    <img src="http://2.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=96&d=mm&r=g" alt="">
                                    <span class="pm-tooltip-label">User Name</span>
                                </li>
                                <li class="pm-has-tooltip">
                                    <img src="http://2.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=96&d=mm&r=g" alt="">
                                    <span class="pm-tooltip-label">User Name</span>
                                </li>
                                <li class="pm-has-tooltip">
                                    <img src="http://2.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=96&d=mm&r=g" alt="">
                                    <span class="pm-tooltip-label">User Name</span>
                                </li>
                                <!-- more user button and their markup -->
                               <li class="pm-more-users pm-has-dropdown">
                                    <a href="#" class="pm-dropdown-trigger">3+</a>
                                    <ul class="pm-dropdown-menu">
                                        <li class="pm-has-tooltip">
                                            <img src="http://2.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=96&d=mm&r=g" alt="">
                                            <span class="pm-tooltip-label">User Name</span>
                                        </li>
                                        <li class="pm-has-tooltip">
                                            <img src="http://2.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=96&d=mm&r=g" alt="">
                                            <span class="pm-tooltip-label">User Name</span>
                                        </li>
                                        <li class="pm-has-tooltip">
                                            <img src="http://2.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=96&d=mm&r=g" alt="">
                                            <span class="pm-tooltip-label">User Name</span>
                                        </li>
                                        <li class="pm-has-tooltip">
                                            <img src="http://2.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=96&d=mm&r=g" alt="">
                                            <span class="pm-tooltip-label">User Name</span>
                                        </li>
                                    </ul>
                                </li>

                            </ul>
                        </div>

                    </div>
                </div>
                
            </article>
        </div>
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
                project_action: __( 'Project Actions', 'wedevs-project-manager'),
                dropdownToggleStatus: false,
            }
        },
        computed: {
            projects () {
                return this.$root.$store.state.projects;
            },
            meta () {
                return this.$root.$store.state.projects_meta;
            },
            // dropdown class toggler
            dropdownToggleClass () {
                if(this.dropdownToggleStatus){
                    return "pm-settings pm-dropdown-menu pm-dropdown-open";
                }else {
                    return "pm-settings pm-dropdown-menu";
                }
            }

        },
        components: {
            Favourite
        },

        methods: {

            // dropdown trigger
            dropdownTrigger () {
                this.dropdownToggleStatus = !this.dropdownToggleStatus;
            },

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
    .no-projects {
        margin: 0 15px 20px;
    }
</style>



