<template>
    <div class="pm-header-title-content" v-if="isProjectLoaded">
        <div class="project-title">
            <span class="title">{{ project.title }}</span>
            <a href="#" v-if="is_manager()" @click.prevent="showHideProjectForm('toggle')" class="icon-pm-pencil project-update-btn"></a>

            <edit-project v-if="is_project_edit_mode && is_manager()" class="project-edit-form" :project="project"></edit-project>
            <div class="settings header-settings">

                <a href="#" v-if="is_manager()" @click.prevent="showHideSettings()" class="icon-pm-settings header-settings-btn"></a>

                <div v-if="settingStatus && is_manager()" class="settings-activity">
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
                            <!-- <do-action :hook="'pm-header-menu'" :actionData="menu"></do-action>  -->
                        </ul>

                    </div>
                </div>
            </div>

        </div>

        <div>
            <pm-do-action hook="pm_project_header" ></pm-do-action>
        </div>

       <!--  <div class="project-status">
            <div v-if="project.status === 'complete'" class="complete">{{ __( 'Completed', 'wedevs-project-manager')}}</div>
            <div v-if="project.status === 'incomplete'" class="incomplete">{{ __( 'Incomplete', 'wedevs-project-manager') }}</div>
        </div>  -->
    </div> 
    
</template>

<style lang="less">
    
    .pm-header-title-content {
        display: flex;
        flex-wrap: wrap;
        align-items: center;

        .project-status {
            .incomplete, .complete {
                border: 1px solid #E5E4E4;
                background: #fff;
                padding: 4px 8px;
                margin-left: 5px;
                cursor: pointer;
                border-radius: 3px;
                color: #788383;
                font-size: 12px;

                &:hover {
                    border: 1px solid #1A9ED4;
                    color: #1A9ED4;
                }
            }
        }
        .project-title {
            flex: 1;
            display: flex;
            align-items: center;
            line-height: 0;
            position: relative;

            .project-edit-form {
                position: absolute;
                padding: 5px 5px 15px 15px;
                top: 40px;
                z-index: 99;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
                border: 1px solid #DDDDDD;
                background: #fff;
                border-radius: 3px;
                box-shadow: 0px 2px 40px 0px rgba(214, 214, 214, 0.6);

                &:before {
                    border-color: transparent transparent #DDDDDD transparent;
                    position: absolute;
                    border-style: solid;
                    top: -9px;
                    left: 116px;
                    content: "";
                    z-index: 9999;
                    border-width: 0px 8px 8px 8px;
                }

                &:after {
                    border-color: transparent transparent #ffffff transparent;
                    position: absolute;
                    border-style: solid;
                    top: -7px;
                    left: 116px;
                    content: "";
                    z-index: 9999;
                    border-width: 0 8px 7px 8px;
                }
            }

            .title {
                font-size: 18px;
                font-weight: bold;
                color: #000;
                margin-right: 20px;
                white-space: nowrap;
            }
            .icon-pm-pencil {
                border: 1px solid #E5E4E4;
                background: #fff;
                color: #95A5A6;
                padding: 0px 10px;
                border-radius: 3px;
                cursor: pointer;
                border-top-right-radius: 0px;
                border-bottom-right-radius: 0px;
                height: 30px;
                display: flex;
                align-items: center;
                z-index: 9;

                &:hover {
                    border: 1px solid #1A9ED4;
                    color: #1A9ED4;
                    
                    &:before {
                        color: #1A9ED4;
                    }
                }
            }
        }

        .settings {
            position: relative;
            display: flex;
            align-items: center;
            border: 1px solid #E5E4E4;
            background: #fff;
            color: #95A5A6;
            border-radius: 3px;
            cursor: pointer;
            border-left-color: #fff;
            border-top-left-radius: 0px;
            border-bottom-left-radius: 0px;
            margin-left: -1px;
            &:hover {
                border: 1px solid #1A9ED4;
                color: #1A9ED4;
                z-index: 99;
                
                .icon-pm-settings {
                    &:before {
                        color: #1A9ED4;

                    }
                }
            }

            .header-settings-btn {
                height: 28px;
                padding: 0 10px;
                display: flex;
                align-items: center;
            }

            .settings-activity {
                position: relative;
                .pm-triangle-top {
                    left: -36px !important;
                    right: 0 !important;
                    width: 127px !important;
                    padding: 0px !important;
                    top: 26px !important;

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

                                .icon-pm-completed, .icon-pm-delete, .icon-pm-undo-arrow {
                                    width: 20px;
                                }
                                .icon-pm-undo-arrow {
                                    &:before {
                                        font-size: 11px;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

     @media screen and (max-width: 360px) {
        .project-title .pm-project-form .project-cancel {
            margin-bottom: 0px !important;
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
                settingStatus: false,
                isEnableUpdateForm: false
            }

        },
        watch: {
            '$route' (to, from) {
                this.project_id = typeof to.params.project_id !== 'undefined' ? to.params.project_id : 0;
                this.getGloabalProject(to.params.project_id);
                this.getProjectCategories();
                this.getRoles();
            }
        },

        computed: {
            isProjectLoaded () {
                let project = this.$store.state.project;
                
                return jQuery.isEmptyObject(project) ? false : true;
            },
            is_project_edit_mode () {
                return this.$store.state.is_project_form_active;
            },

            project () {
                return  this.$store.state.project;
            },
            hasProject () {

                return this.$store.state.project.hasOwnProperty('id');
            },
        },
        
        created () {
            this.getGloabalProject();
            this.getProjectCategories();
            this.getRoles(); 
            window.addEventListener('click', this.windowActivity);
        },

        components: {
            'do-action': do_action,
            'edit-project': edit_project
        },

        methods: {
            windowActivity (el) {
                var settingsWrap  = jQuery(el.target).closest('.header-settings'),
                    settingsBtn       = jQuery(el.target).hasClass('header-settings-btn'),
                    projectUpdatebtn  = jQuery(el.target).hasClass('project-update-btn'),
                    projectUdpateWrap = jQuery(el.target).closest('.project-edit-form'),
                    newUser           = jQuery(el.target).hasClass('pm-more-user-form-btn'),
                    newUserbtn        = jQuery(el.target).hasClass('pm-new-user-btn'),
                    userSelect        = jQuery(el.target).closest('.ui-autocomplete');

                if ( !settingsBtn && !settingsWrap.length ) {
                    this.settingStatus = false;
                }

                if ( 
                    !projectUpdatebtn 
                     && !projectUdpateWrap.length 
                     && !newUser 
                     && !userSelect.length 
                     && !newUserbtn 
                ) {
                    this.showHideProjectForm(false);
                }
            },

            enableDisableUpdateForm () {
                this.isEnableUpdateForm = this.isEnableUpdateForm ? false : true;
            },

            showHideSettings () {
                this.settingStatus = this.settingStatus ? false : true;
            },
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

