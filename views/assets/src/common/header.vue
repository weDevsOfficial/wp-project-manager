<template>
    <div class="pm-top-bar pm-no-padding pm-project-header pm-project-head">
        <div class="pm-row pm-no-padding pm-border-bottom">

            <div class="pm-col-6 pm-project-detail">
                <h3>
                    <span class="pm-project-title">{{ project.title }}</span>
                     <a @click.prevent="showHideProjectForm('toggle')" href="#" class="pm-icon-edit pm-project-edit-link small-text">
                        <span class="dashicons dashicons-edit"></span> 
                        <span class="text">{{text.edit}}</span>
                     </a>
                </h3>

                <div class="detail">{{project.description}}</div>
            </div>
            <div class="pm-completed-wrap">
                <div v-if="project.status === 'complete'" class="ribbon-green">{{text.completed}}</div>
                <div v-if="project.status === 'incomplete'" class="ribbon-green incomplete">{{text.incomplete}}</div>
            </div>
            <div class="pm-col-6 pm-last-col pm-top-right-btn pm-text-right show_desktop_only">
                <div class="pm-project-action">
                    <span @click.prevent="showProjectAction()" :title="text.Project_Actions" class="dashicons dashicons-admin-generic pm-settings-bind"></span>
                    <ul v-if="project.settings_hide" class="pm-settings">
                        <li>
                            <span class="pm-spinner"></span>
                            <a href="#" @click.prevent="deleteProject(project.id)" :title="text.delete_project">

                                <span class="dashicons dashicons-trash"></span>
                                <span>{{text.delete}}</span>
                            </a>
                        </li>
                        <li>
                            <span class="pm-spinner"></span>
                            <a @click.prevent="selfProjectMarkDone(project)" href="#">
                                <span v-if="project.status === 'incomplete'" class="dashicons dashicons-yes"></span>
                                <span v-if="project.status === 'incomplete'">{{text.complete}}</span>

                                <span v-if="project.status === 'complete'" class="dashicons dashicons-undo"></span>
                                <span v-if="project.status === 'complete'">{{text.restore}}</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="clearfix"></div>
             <transition name="slide">
                <div class="pm-edit-project" v-if="is_project_edit_mode">
                    <edit-project :is_update="true"></edit-project>
                </div>
            </transition>
        </div>

        <div class="pm-row pm-project-group">
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
    import router from './router';
    import do_action from './do-action.vue';
    import edit_project from './../projects/project-create-form.vue';

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

                        name: this.text.overview,
                        count: '',
                        class: 'overview pm-sm-col-12'
                    },

                    {
                        route: {
                            name: 'activities',
                            project_id: this.project_id,
                        },

                        name: this.text.activities,
                        count: project.meta.total_activities,
                        class: 'activity pm-sm-col-12'
                    },

                    {
                        route: {
                            name: 'discussions',
                            project_id: this.project_id,
                        },

                        name: this.text.discussions,
                        count: project.meta.total_discussion_boards,
                        class: 'message pm-sm-col-12'
                    },

                    {
                        route: {
                            name: 'task_lists',
                            project_id: this.project_id,
                        },

                        name: this.text.task_lists,
                        count: project.meta.total_task_lists,
                        class: 'to-do-list pm-sm-col-12'
                    },

                    {
                        route: {
                            name: 'milestones',
                            project_id: this.project_id,
                        },

                        name: this.text.milestones,
                        count: project.meta.total_milestones,
                        class: 'milestone pm-sm-col-12'
                    },

                    {
                        route: {
                            name: 'pm_files',
                            project_id: this.project_id,
                        },

                        name: this.text.files,
                        count: project.meta.total_files,
                        class: 'files pm-sm-col-12'
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
    .pm-project-header .router-link-active {
        border-bottom: solid 2px #019dd6 !important;
        color: #000000 !important;
    }
</style>

