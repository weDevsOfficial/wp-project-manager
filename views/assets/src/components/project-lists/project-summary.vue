<template> 
    <!-- project-list-view toggle this class for list view -->
    <div class="pm-projects-row" :class="{'project-list-view': !activeClass('grid_view') }">
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

                        <li class="pm-has-dropdown" v-if="is_manager(project)">
                            <a @click.prevent="dropdownTrigger(project)" :data-project_id="project.id" href="#" class="pm-dropdown-trigger">
                                <i class="pm-icon flaticon-more"></i>
                            </a>
                            <!-- prev condition v-if="project.settings_hide && is_manager(project)" -->
                            <ul :class="dropdownToggleClass(project)">
                                <li>
                                    <a href="#" @click.prevent="projectMarkAsDoneUndone(project)" class="pm-archive" >
                                        <span v-if="project.status == 'incomplete' ||  project.status == '0'" class="dashicons dashicons-yes"></span>
                                        <span v-if="project.status == 'incomplete' ||  project.status == '0'">{{ __( 'Complete', 'wedevs-project-manager') }}</span>

                                        <span v-if="project.status == 'complete' ||  project.status == '1'" class="dashicons dashicons-undo"></span>
                                        <span v-if="project.status == 'complete' ||  project.status == '1'">{{ __( 'Restore', 'wedevs-project-manager') }}</span>
                                        
                                    </a>
                                </li>
                                <li>
                                    <pm-do-action :hook="'project_action_menu'" :actionData="project" ></pm-do-action>
                                </li>

                                <li>
                                    <a href="#" @click.prevent="deleteProject(project.id, project)" class="pm-project-delete-link" :title="__( 'Delete project', 'wedevs-project-manager')">
                                        <span class="dashicons dashicons-trash"></span>
                                        <span>{{ __( 'Delete', 'wedevs-project-manager') }}</span>
                                    </a>
                                </li>
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
                        <div :title="project.description.content" class="pm-project-description">
                            <p v-text="project.description.content"></p>
                        </div>
                        <ul class="pm-project-meta-counters pm-list-inline">
                            <li class="pm-meta-overview pm-has-tooltip">
                                <router-link :to="{
                                    name: 'task_lists',
                                    params: {
                                        project_id: project.id
                                    }}">
                                    <i class="pm-icon logo icon-pm-task-list" aria-hidden="true"></i>
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
                                    name: 'pm_files',
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

                                <li v-for="(user, key) in project.assignees.data" v-if="key <= 5" :key="key" class="pm-has-tooltip">
                                    <img class="pm-img-circle" :src="user.avatar_url" :alt="user.display_name">
                                    <span class="pm-tooltip-label">{{ user.display_name }}</span>
                                </li>
                                
                                <!-- more user button and their markup -->
                                <li v-if="project.assignees.data.length > 6" class="pm-more-users pm-has-dropdown">
                                    <a :data-project_id="project.id" @click.prevent="showMoreUser(project)" href="#" class="pm-dropdown-trigger">{{ project.assignees.data.length - 6 }}+</a>
                                    <ul :class="'pm-dropdown-menu '+ pmDropDownOpen(project)">
                                        <li v-for="(user, key) in project.assignees.data" v-if="key > 5" :key="key" class="pm-has-tooltip">
                                            <img class="pm-img-circle" :src="user.avatar_url" :alt="user.display_name">
                                            <span class="pm-tooltip-label">{{ user.display_name }}</span>
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
    import Mixins from './mixin';

    export default {
        mixins: [Mixins],
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
                this.$root.$store.state.projects.forEach(function(project) {
                    pm.Vue.set(project, 'showMoreUser', false );
                    pm.Vue.set(project, 'showDropDownMenu', false );
                });
                return this.$root.$store.state.projects;
            },
            meta () {
                return this.$root.$store.state.projects_meta;
            },
        },

        components: {
            Favourite
        },

        created () {
            window.addEventListener('click', this.windowActivity);
        },

        methods: {
            windowActivity (el) {
                var element = jQuery(el.target),
                    moreUser = element.closest('.pm-more-users'),
                    projectId = element.data('project_id'),
                    moreMenu = element.closest('.pm-has-dropdown'),
                    menuProjectId = element.data('project_id');

                if(!moreUser.length) {
                    this.projects.forEach(function(project) {
                        project.showMoreUser = false;
                    });
                } else {
                    this.projects.forEach(function(project) {
                        if(project.id != projectId) {
                            project.showMoreUser = false;
                        }
                    });
                }

                if(!moreMenu.length) {
                    this.projects.forEach(function(project) {
                        project.showDropDownMenu = false;
                    });
                } else {
                    this.projects.forEach(function(project) {
                        if(project.id != menuProjectId) {
                            project.showDropDownMenu = false;
                        }
                    });
                }
                
            },
            showMoreUser (project) {
                project.showMoreUser = project.showMoreUser ? false : true;
            },

            pmDropDownOpen (project) {
                if(project.showMoreUser) {
                    return 'pm-dropdown-open';
                }

                return '';
            },

            // dropdown trigger
            dropdownTrigger (project) {
                project.showDropDownMenu = project.showDropDownMenu ? false : true;
            },

            // dropdown class toggler
            dropdownToggleClass(project) {
                if(project.showDropDownMenu){
                    return "pm-settings pm-dropdown-menu pm-dropdown-open";
                } else {
                    return "pm-settings pm-dropdown-menu";
                }
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
                                    conditions:{
                                        status: 'incomplete',
                                        with: 'assignees',
                                        project_meta: 'all',
                                        orderby: 'id:desc'
                                        
                                    },
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
                                    conditions:{
                                        status: 'complete',
                                        with: 'assignees',
                                        project_meta: 'all',
                                        orderby: 'id:desc'
                                            
                                        },
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
                                self.getProjects({

                                   with: 'assignees',
                                   project_meta: 'all',
                                   orderby: 'id:desc'
                                    
                                });
                                break;
                        }
                    }
                }

                this.updateProject(args);
            }
        }
    }

</script>

<style lang="less">
    .pm-project-item {
        .dashicons-trash {
            &:before {
                font-size: 16px;
                color: #eb5c70;
            }
        }
    }

    .fa-circle {
        margin-right: 6%;
    }
    .no-projects {
        margin: 0 15px 20px;
    }
    .pm-project-meta-counters li a[href="#"] {
        cursor: default;
    }
    .pm-meta-overview i {
        vertical-align: baseline !important;
    }
    .pm-meta-overview a:hover i:before {
        color: #fff;
    }
</style>



