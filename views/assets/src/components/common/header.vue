<template>
    <div class="pm-top-bar pm-no-padding pm-project-header pm-project-head">
        <div class="pm-row pm-no-padding pm-border-bottom">

            <div class="pm-col-6 pm-project-detail">
                <h3>
                    <span class="pm-project-title">{{ project.title }}</span>
                     <a @click.prevent="showHideProjectForm('toggle')" href="#" v-if="is_manager()" class="pm-icon-edit pm-project-edit-link small-text">
                        <span class="dashicons dashicons-edit"></span> 
                        <span class="text">{{  __( 'Edit', 'wedevs-project-manager') }}</span>
                     </a>
                </h3>

                <div class="detail">{{project.description}}</div>
            </div>
            <div class="pm-completed-wrap">
                <div v-if="project.status === 'complete'" class="ribbon-green">{{ __( 'Completed', 'wedevs-project-manager')}}</div>
                <div v-if="project.status === 'incomplete'" class="ribbon-green incomplete">{{ __( 'Incomplete', 'wedevs-project-manager') }}</div>
            </div>
            <div class="pm-col-6 pm-last-col pm-top-right-btn pm-text-right show_desktop_only" v-if="is_manager()">
                <div class="pm-project-action">
                    <span @click.prevent="showProjectAction()" :title="project_action" class="dashicons dashicons-admin-generic pm-settings-bind"></span>
                    <ul v-if="settings_hide" class="pm-settings">
                        <li>
                            <span class="pm-spinner"></span>
                            <a href="#" @click.prevent="deleteProject(project.id)" :title="__( 'Delete project', 'wedevs-project-manager')">

                                <span class="dashicons dashicons-trash"></span>
                                <span>{{ __( 'Delete', 'wedevs-project-manager') }}</span>
                            </a>
                        </li>
                        <li>
                            <span class="pm-spinner"></span>
                            <a @click.prevent="selfProjectMarkDone(project)" href="#">
                                <span v-if="project.status === 'incomplete'" class="dashicons dashicons-yes"></span>
                                <span v-if="project.status === 'incomplete'">{{ __( 'Complete', 'wedevs-project-manager') }}</span>

                                <span v-if="project.status === 'complete'" class="dashicons dashicons-undo"></span>
                                <span v-if="project.status === 'complete'">{{ __( 'Restore', 'wedevs-project-manager') }}</span>
                            </a>
                        </li>
                    </ul>
                </div>
                <pm-do-action hook="pm_project_header" ></pm-do-action>
            </div>

            <div class="clearfix"></div>
             <transition name="slide" v-if="is_manager()">
                <div class="pm-edit-project" v-if="is_project_edit_mode">
                    <edit-project :is_update="true"></edit-project>
                </div>
            </transition>
        </div>

        <div class="pm-row pm-project-group">
            <ul v-if="menu.length">
                <li v-for="item in menu"> 
                    <router-link 
                        :class="item.class"
                        :to="item.route">
                        <span>{{ item.name }}</span>
                        <div>{{ item.count }}</div>
                    </router-link>
                </li>      
                <do-action :hook="'pm-header-menu'" :actionData="menu"></do-action>
            </ul>
        </div>

        <div class="clearfix"></div>
    </div>
</template>

<script>
    //import router from './../../router/router';
    import do_action from './do-action.vue';
    import edit_project from './../project-lists/project-create-form.vue';

    export default {
        data () {
            return {
                project_action: __('Project Actions', 'wedevs-project-manager'),
                settings_hide: false,
            }

        },

        computed: {
            is_project_edit_mode () {
                return this.$root.$store.state.is_project_form_active;
            },

            project () {
                return  this.$root.$store.state.project;
            },

            menu () {
                var project = this.$root.$store.state.project;
                
                if( typeof project.meta === 'undefined' ){
                    return [];
                }

                return [
                    {
                        route: {
                            name: 'pm_overview',
                            project_id: this.project_id,
                        },

                        name: this.__( 'Overview', 'wedevs-project-manager'),
                        count: '',
                        class: 'overview pm-sm-col-12'
                    },

                    {
                        route: {
                            name: 'activities',
                            project_id: this.project_id,
                        },

                        name: this.__( 'Activities', 'wedevs-project-manager'),
                        count: project.meta.data.total_activities,
                        class: 'activity pm-sm-col-12'
                    },

                    {
                        route: {
                            name: 'discussions',
                            project_id: this.project_id,
                        },

                        name: this.__( 'Discussions', 'wedevs-project-manager'),
                        count: project.meta.data.total_discussion_boards,
                        class: 'message pm-sm-col-12'
                    },

                    {
                        route: {
                            name: 'task_lists',
                            project_id: this.project_id,
                        },

                        name: this.__( 'Task Lists', 'wedevs-project-manager'),
                        count: project.meta.data.total_task_lists,
                        class: 'to-do-list pm-sm-col-12'
                    },

                    {
                        route: {
                            name: 'milestones',
                            project_id: this.project_id,
                        },

                        name: this.__( 'Milestones', 'wedevs-project-manager'),
                        count: project.meta.data.total_milestones,
                        class: 'milestone pm-sm-col-12'
                    },

                    {
                        route: {
                            name: 'pm_files',
                            project_id: this.project_id,
                        },

                        name: this.__( 'Files', 'wedevs-project-manager'),
                        count: project.meta.data.total_files,
                        class: 'files pm-sm-col-12'
                    }
                ];
            }
        },

        created () {
            this.getGloabalProject();
            this.getProjectCategories();
            this.getRoles(); 
        },

        components: {
            'do-action': do_action,
            'edit-project': edit_project
        },

        methods: {
            showProjectAction () {
                this.settings_hide = !this.settings_hide;
            },

            selfProjectMarkDone () {
                var args = {
                    data: {
                        id : this.project.id,
                        status: this.project.status === 'complete' ? 'incomplete' : 'complete',
                        title: this.project.title,
                    },
                    callback: function ( res ) {
                        this.$root.$store.commit(
                            'showHideProjectDropDownAction', 
                            {
                                status: false, 
                                project_id: this.project_id
                            }
                        );
                    }
                } 


                this.updateProject( args );
            }
        }
    }
</script>

