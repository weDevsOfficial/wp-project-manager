<template>
    <div class="cpm-top-bar cpm-no-padding cpm-project-header cpm-project-head">
        <div class="cpm-row cpm-no-padding cpm-border-bottom">

            <div class="cpm-col-6 cpm-project-detail">
                <h3>
                    <span class="cpm-project-title">{{ project.title }}</span>
                     <a @click.prevent="showHideProjectForm('toggle')" href="#" class="cpm-icon-edit cpm-project-edit-link small-text">
                        <span class="dashicons dashicons-edit"></span> 
                        <span class="text">{{text.Edit}}</span>
                     </a>
                </h3>

                <div class="detail"></div>
            </div>
            <div class="cpm-completed-wrap">
                <div v-if="project.status === 'complete'" class="ribbon-green">{{text.Completed}}</div>
                <div v-if="project.status === 'incomplete'" class="ribbon-green incomplete">{{text.Incomplete}}</div>
            </div>
            <div class="cpm-col-6 cpm-last-col cpm-top-right-btn cpm-text-right show_desktop_only">
                    
                <div class="cpm-project-action">
                    <span @click.prevent="showProjectAction()" class="dashicons dashicons-admin-generic cpm-settings-bind"></span>

                    <ul v-if="project.settings_hide" class="cpm-settings">
                        <li>
                            <span class="cpm-spinner"></span>
                            <a href="#" @click.prevent="deleteProject(project.id)">
                                <span class="dashicons dashicons-trash"></span>
                                <span>Delete</span>
                            </a>
                        </li>
                        <li>
                            <span class="cpm-spinner"></span>
                            <a @click.prevent="selfProjectMarkDone(project)" href="#">
                                <span v-if="project.status === 'incomplete'" class="dashicons dashicons-yes"></span>
                                <span v-if="project.status === 'incomplete'">Complete</span>

                                <span v-if="project.status === 'complete'" class="dashicons dashicons-undo"></span>
                                <span v-if="project.status === 'complete'">Restore</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="clearfix"></div>

            <div class="cpm-edit-project" v-if="is_project_edit_mode">
                <edit-project :is_update="true"></edit-project>
            </div>
        </div>

        <div class="cpm-row cpm-project-group">
            <ul>
                <li v-for="item in menu"> 
                    <router-link 
                        :class="item.class"
                        :to="item.route">
                        <span>{{ item.name }}</span>
                        <div>{{ item.count }}</div>
                    </router-link>
                </li>      
                <do-action hook="pm-header"></do-action>
            </ul>
        </div>

        <div class="clearfix"></div>
    </div>
</template>

<script>
    import router from './../router';
    import do_action from './do-action.vue';
    import edit_project from './project-lists/project-create-form.vue';

    export default {
        data () {
            return {}
        },

        computed: {
            is_project_edit_mode () {
                return this.$root.$store.state.is_project_form_active;
            },

            project () {
                var projects = this.$root.$store.state.projects;

                var index = this.getIndex(projects, this.project_id, 'id');
                
                if ( index !== false ) {
                    return projects[index];
                }

                return {};
            },

            menu () {
                var projects = this.$root.$store.state.projects;
                var index = this.getIndex(projects, this.project_id, 'id');
                var project = {};
                
                if ( index !== false ) {
                    project = projects[index];
                } else {
                    return [];
                }

                return [
                    {
                        route: {
                            name: 'pm_overview',
                            project_id: this.project_id,
                        },

                        name: 'Overview',
                        count: '',
                        class: 'overview cpm-sm-col-12'
                    },

                    {
                        route: {
                            name: 'activities',
                            project_id: this.project_id,
                        },

                        name: 'Activities',
                        count: project.meta.total_activities,
                        class: 'activity cpm-sm-col-12'
                    },

                    {
                        route: {
                            name: 'discussions',
                            project_id: this.project_id,
                        },

                        name: 'Discussions',
                        count: project.meta.total_discussion_boards,
                        class: 'message cpm-sm-col-12'
                    },

                    {
                        route: {
                            name: 'task_lists',
                            project_id: this.project_id,
                        },

                        name: 'Task Lists',
                        count: project.meta.total_task_lists,
                        class: 'to-do-list cpm-sm-col-12'
                    },

                    {
                        route: {
                            name: 'milestones',
                            project_id: this.project_id,
                        },

                        name: 'Milestones',
                        count: project.meta.total_milestones,
                        class: 'milestone cpm-sm-col-12'
                    },

                    {
                        route: {
                            name: 'pm_files',
                            project_id: this.project_id,
                        },

                        name: 'Files',
                        count: project.meta.total_files,
                        class: 'files cpm-sm-col-12'
                    }
                ];
            }
        },

        created () {
            this.getProject();
            this.getProjectCategories();
            this.getRoles(); 
        },

        components: {
            'do-action': do_action,
            'edit-project': edit_project
        },

        methods: {
            showProjectAction () {
                this.$root.$store.commit(
                    'showHideProjectDropDownAction', 
                    {
                        status: 'toggle', 
                        project_id: this.project_id
                    }
                );
            },

            selfProjectMarkDone (project) {
                var project = {
                        id: project.id,
                        status: project.status === 'complete' ? 'incomplete' : 'complete'
                    },
                    self = this;

                this.updateProject(project, function(project) {
                    self.$root.$store.commit(
                        'showHideProjectDropDownAction', 
                        {
                            status: false, 
                            project_id: self.project_id
                        }
                    );
                });
            }
        }
    }
</script>

<style>
    .cpm-project-header .router-link-active {
        border-bottom: solid 2px #019dd6 !important;
        color: #000000 !important;
    }
</style>

