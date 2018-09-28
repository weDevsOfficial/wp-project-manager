<template>
    <div class="pm-header-wrap" v-if="project">
        <div class="header-content">
            <div class="project-title">
                <span class="title">{{ project.title }}</span>
                <span class="icon-pm-pencil"></span>

                <div class="settings">
                    <span class="icon-pm-settings"></span>
                    <div class="settings-activity">
                        <div class="pm-triangle-top">
                            <ul class="action-ul">
                                <li>
                                    <a @click.prevent="selfProjectMarkDone(project)" href="#">
                                        <span v-if="project.status === 'incomplete'" class="icon-pm-completed"></span>
                                        <span v-if="project.status === 'incomplete'">{{ __( 'Complete', 'wedevs-project-manager') }}</span>

                                        <span v-if="project.status === 'complete'" class="icon-pm-undo-arrow"></span>
                                        <span v-if="project.status === 'complete'">{{ __( 'Restore', 'wedevs-project-manager') }}</span>
                                    </a>
                                </li>
                            
                                <li>
                                    <a href="#" @click.prevent="deleteProject(project.id)" :title="__( 'Delete project', 'wedevs-project-manager')">

                                        <span class="icon-pm-delete"></span>
                                        <span class="">{{ __( 'Delete', 'wedevs-project-manager') }}</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

            </div>

            <div>
                <pm-do-action hook="pm_project_header" ></pm-do-action>
            </div>



            <div class="project-status">
                <div v-if="project.status === 'complete'" class="complete">{{ __( 'Completed', 'wedevs-project-manager')}}</div>
                <div v-if="project.status === 'incomplete'" class="incomplete">{{ __( 'Incomplete', 'wedevs-project-manager') }}</div>
            </div> 
        </div>

  <!--           <div class="">
                <div v-if="project.status === 'complete'" class="">{{ __( 'Completed', 'wedevs-project-manager')}}</div>
                <div v-if="project.status === 'incomplete'" class="">{{ __( 'Incomplete', 'wedevs-project-manager') }}</div>
            </div>

            <div class="pm-col-6 pm-project-detail">
                <h3>
                    <span class="pm-project-title">{{ project.title }}</span>
                     <a @click.prevent="showHideProjectForm('toggle')" href="#" v-if="is_manager()" class="pm-icon-edit pm-project-edit-link small-text">
                        <span class="dashicons dashicons-edit"></span> 
                        <span class="text">{{  __( 'Edit', 'wedevs-project-manager') }}</span>
                     </a>
                </h3>
                <div class="detail" v-if="project.description.content">
                    <div class="pm-project-description" v-html="project.description.html"></div>
                </div>
            </div>
            
            <div class="pm-col-6 pm-last-col pm-top-right-btn pm-text-right show_desktop_only" >
                <div class="pm-project-action" v-if="is_manager()">
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
                            
                        </li>
                    </ul>
                </div>
                
            </div> -->

        <!--     <div class="clearfix"></div>
             <transition name="slide" v-if="is_manager()">
                <div class="pm-edit-project" v-if="is_project_edit_mode">
                    <edit-project :project="project"></edit-project>
                </div>
            </transition>
        </div> -->

        <!-- <div class="pm-row pm-project-group">
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
        </div> -->

        <!-- <div class="clearfix"></div> -->
    </div>
</template>

<style lang="less">
    .pm-header-wrap {
        .header-content {
            display: flex;
            align-items: center;

            .project-status {
                .incomplete, .complete {
                    border: 1px solid #E5E4E4;
                    background: #fff;
                    padding: 4px 8px;
                    margin-left: 5px;
                    cursor: pointer;
                    border-radius: 3px;
                    color: #444;

                    &:hover {
                        border-color: #999;
                    }
                }
            }
            .project-title {
                flex: 1;
                display: flex;
                align-items: center;
                line-height: 0;

                .title {
                    font-size: 18px;
                    font-weight: bold;
                    color: #000;
                    margin-right: 20px;
                }
                .icon-pm-pencil {
                    border: 1px solid #E5E4E4;
                    background: #fff;
                    color: #95A5A6;
                    padding: 6px 10px;
                    border-radius: 3px;
                    cursor: pointer;
                    border-top-right-radius: 0px;
                    border-bottom-right-radius: 0px;

                    &:hover {
                        border: 1px solid #999;
                        color: #999;
                        border-radius: 3px;

                        &:before {
                            color: #999;
                        }
                    }
                }
            }

            .settings {
                position: relative;
                .icon-pm-settings {
                    border: 1px solid #E5E4E4;
                    background: #fff;
                    color: #95A5A6;
                    padding: 6px 10px;
                    border-radius: 3px;
                    cursor: pointer;
                    border-left: none;
                    border-top-left-radius: 0px;
                    border-bottom-left-radius: 0px;

                    &:hover {
                        border: 1px solid #999;
                        color: #999;
                        border-radius: 3px;
                        
                        &:before {
                            color: #999;
                        }
                    }
                }

                .settings-activity {
                    position: relative;
                    display: none;
                    .pm-triangle-top {
                        left: 0 !important;
                        right: 0 !important;
                        width: 127px !important;
                        padding: 0px !important;
                        top: 20px !important;

                        &:before {
                            right: auto !important;
                            left: 10px !important;
                        }

                        &:after {
                            right: auto !important;
                            left: 10px !important;
                        }

                        .action-ul {
                            margin: 0;
                            padding: 0;

                            li {
                                margin: 0;
                                padding: 0;
                                a {
                                    display: flex;
                                    align-items: center;
                                    padding: 10px;

                                    .icon-pm-completed {
                                        margin-right: 5px;
                                    }

                                    .icon-pm-delete {
                                        margin-right: 9px;
                                    }
                                }
                            }
                        }
                    }
                }

                &:hover {
                    .settings-activity {
                        display: block;
                    }
                }
            }
        }

    }
</style>

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
            hasProject () {
                return this.project.hasOwnProperty('id');
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

