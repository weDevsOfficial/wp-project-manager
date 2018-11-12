<template>
    <div>
        <form action="" method="post" class="pm-form pm-project-form" @submit.prevent="projectFormAction();">

            <div class="item project-name">
                <!-- v-model="project_name" -->
                <input type="text" v-model="project.title"  id="project_name" :placeholder="name_of_the_project" size="45" />
            </div>

            <div class="pm-form-item item project-category">
                <!-- v-model="project_cat" -->
                <select v-model="project_category"  id='project_cat' class='chosen-select'>
                    <option value="0">{{ __( '- Project Category -', 'wedevs-project-manager') }}</option>
                    <option v-for="category in categories" :value="category.id" :key="category.id" >{{ category.title }}</option>
                </select>
            </div>

            <div class="pm-form-item item project-detail">
                <!-- v-model="project_description" -->
                <textarea v-model="project_description"  class="pm-project-description" id="" rows="5" :placeholder="details_of_project"></textarea>
            </div>
            <div class="pm-project-form-users-wrap">
                <div class="pm-form-item pm-project-role" v-if="show_role_field">
                    <table>
                        <tr v-for="projectUser in selectedUsers" :key="projectUser.id">
                            <td>{{ projectUser.display_name }}</td>
                            <td>
                                <select  v-model="projectUser.roles.data[0].id" :disabled="!canUserEdit(projectUser.id)">
                                    <option v-for="role in roles" :value="role.id" :key="role.id" >{{ role.title }}</option>
                                </select>
                            </td>
                          
                            <td>
                                <a @click.prevent="deleteUser(projectUser)" v-if="canUserEdit(projectUser.id)" hraf="#" class="pm-del-proj-role pm-assign-del-user">
                                    <span class="dashicons dashicons-trash"></span> 
                                    <!-- <span class="title">{{ __( 'Delete', 'wedevs-project-manager') }}</span> -->
                                </a>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
            
            <div class="pm-form-item item project-users" v-if="show_role_field">
                <input v-pm-users class="pm-project-coworker" type="text" name="user" :placeholder="search_user" size="45">
            </div>

            <pm-do-action hook="pm_project_form" :actionData="project"></pm-do-action>

            <div class="pm-form-item item project-notify">
                <label>
                    <input type="checkbox" v-model="project_notify" name="project_notify" id="project-notify" value="yes" />
                    {{ __( 'Notify Co-Workers', 'wedevs-project-manager') }}            
                </label>
            </div>

            <div class="submit">
                <input v-if="project.id" type="submit" name="update_project" id="update_project" class="button-primary" :value="update_project">
                <input v-if="!project.id" type="submit" name="add_project" id="add_project" class="button-primary" :value="add_new_project">
                <a @click.prevent="closeForm()" class="button project-cancel" href="#">{{ __( 'Cancel', 'wedevs-project-manager') }}</a>
                <span v-show="show_spinner" class="pm-loading"></span>

            </div>

        </form>
        <div v-pm-user-create-popup-box id="pm-create-user-wrap" :title="create_new_user">
            <project-new-user-form></project-new-user-form>
        </div>
    </div>
</template>

<style lang="less">
    .pm-project-form {
        .project-department {
            label {
                line-height: 1;
                display: block;
                margin-bottom: 5px;
            }
            select {
                display: block;
            }
        }
        .pm-project-form-users-wrap {
            overflow: hidden;
            .pm-project-role {
                max-height: 150px;
                overflow: scroll;
            }
        }
    }

</style>

<script>
    import directive from './directive.js';
    import project_new_user_form from './project-new-user-form.vue';
    import Mixins from './mixin';

    var new_project_form = {

        props: {
            project: {
                type: Object,
                default () {
                    return {};
                }
            }
        },

        data () {
            return {
                project_name: '',
                project_cat: 0,
                project_description: typeof this.project.description == 'undefined' ? '' : this.project.description.content,
                project_notify: false,
                assignees: [],
                show_spinner: false,
                name_of_the_project: __('Name of the project', 'wedevs-project-manager'),
                details_of_project: __( 'Some details about the project (optional)', 'wedevs-project-manager'),
                search_user: __( 'Type 3 or more characters to search users...', 'wedevs-project-manager'),
                create_new_user: __( 'Create a new user', 'wedevs-project-manager'),
                add_new_project: __( 'Add New Project', 'wedevs-project-manager'),
                update_project: __( 'Update Project', 'wedevs-project-manager'),
            }
        },
        components: {
            'project-new-user-form': project_new_user_form,
        },
        created () {
            this.setProjectUser();
        },
        computed: {
            roles () {
                return this.$root.$store.state.roles;
            },

            categories () {
                return this.$root.$store.state.categories;
            },

            selectedUsers () {

                if(!this.project.hasOwnProperty('assignees')) {
                    return this.$store.state.assignees;
                } else {
                    var projects = this.$store.state.projects;
                    var index = this.getIndex(projects, this.project.id, 'id');
                    
                    return projects[index].assignees.data;
                }
            },

            project_category: {
                get () {
                    if ( this.project.hasOwnProperty('id') ) {
                        if ( 
                            typeof this.project.categories !== 'undefined' 
                                && 
                            this.project.categories.data.length 
                        ) {

                            this.project_cat = this.project.categories.data[0].id;
                            
                            return this.project.categories.data[0].id;
                        }
                    }

                    return this.project_cat;
                },

                set (cat) {
                    this.project_cat = cat;
                }
            },

            show_role_field () {
                return typeof PM_BP_Vars !== 'undefined' ? PM_BP_Vars.show_role_field : true;
            }

        },

        methods: {

            deleteUser (del_user) {
                if ( !this.canUserEdit(del_user.id) ) {
                    return;
                }
                
                this.$store.commit(
                    'afterDeleteUserFromProject', 
                    {
                        project_id: this.project_id,
                        user_id: del_user.id
                    }
                );
            },
            canUserEdit (user_id) {
                if (this.has_manage_capability()) {
                    return true;
                }
                
                if (this.current_user.data.ID == user_id) {
                    return false;
                }

                return true

            },
            /**
             * Action after submit the form to save and update
             * @return {[void]} 
             */
            projectFormAction () {
                if ( this.show_spinner ) {
                    return;
                }
                
                if ( !this.project.title ) {
                    pm.Toastr.error(__('Project title is required!', 'wedevs-project-manager'));
                    return;
                }

                this.show_spinner = true;

                var args = {
                    data: {
                        'title': this.project.title,
                        'categories': this.project_cat ? [this.project_cat]: null,
                        'description': this.project_description,
                        'notify_users': this.project_notify,
                        'assignees': this.formatUsers(this.selectedUsers),
                        'status': this.project.status,
                        'department_id': this.project.department_id
                    }   
                }

                var self = this;
                if (this.project.hasOwnProperty('id')) {
                    args.data.id = this.project.id;
                    args.callback = function ( res ) {
                        self.show_spinner = false;
                    }
                    this.updateProject ( args );
                } else {
                    args.callback = function(res) {
                        // console.log(res.status);
                        // if ( res.status !== 200 ) {
                        //     self.show_spinner = false;
                        //     return;
                        // }
                        self.project.title = '';
                        self.project_cat = 0;
                        self.project.description = ''
                        self.project_notify = [];
                        self.project.status = '';
                        self.show_spinner = false;
                        self.$router.push({
                            name: 'pm_overview', 
                            params: { 
                                project_id: res.data.id 
                            }
                        });
                    }

                    this.newProject(args);
                }
            },
            setProjectUser () {
                if ( this.project.hasOwnProperty('id') ) {
                    this.$root.$store.commit('setSeletedUser', this.project.assignees.data);
                } else {
                    this.$root.$store.commit('resetSelectedUsers');
                }
            },

            closeForm () {
                if(!this.project.hasOwnProperty('id')) {
                    this.project.title = '';
                    this.project_cat = 0;
                    this.project.description = ''
                    this.project_notify = [];
                    this.project.status = '';
                    this.$store.commit('setSeletedUser', []);
                    jQuery( "#pm-project-dialog" ).dialog('close'); 
                }
                this.showHideProjectForm(false);
            },
        }
    }

    export default new_project_form;
</script>



