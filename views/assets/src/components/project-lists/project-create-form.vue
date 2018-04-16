<template>
    <div>
        <form action="" method="post" class="pm-form pm-project-form" @submit.prevent="projectFormAction();">

            <div class="item project-name">
                <!-- v-model="project_name" -->
                <input type="text" v-model="project.title"  id="project_name" :placeholder="__('Name of the project', 'pm')" value="" size="45" />
            </div>

            <div class="pm-form-item item project-category">
                <!-- v-model="project_cat" -->
                <select v-model="project_category"  id='project_cat' class='chosen-select' style="height: 35px;">
                    <option value="0">{{ __( '- Project Category -', 'pm' ) }}</option>
                    <option v-for="category in categories" :value="category.id">{{ category.title }}</option>
                </select>
            </div>

            <div class="pm-form-item item project-detail">
                <!-- v-model="project_description" -->
                <textarea v-model="project.description"  class="pm-project-description" id="" rows="5" :placeholder="__( 'Some details about the project (optional)', 'pm' )"></textarea>
            </div>

            <div class="pm-form-item pm-project-role" v-if="show_role_field">
                <table>
                    <tr v-for="projectUser in selectedUsers" :key="projectUser.id">
                        <td>{{ projectUser.display_name }}</td>
                        <td>
                            <select  v-model="projectUser.roles.data[0].id" :disabled="is_project_creator(projectUser.id)">
                                <option v-for="role in roles" :value="role.id">{{ role.title }}</option>
                            </select>
                        </td>
                      
                        <td>
                            <a @click.prevent="deleteUser(projectUser)" v-if="!is_project_creator(projectUser.id)" hraf="#" class="pm-del-proj-role pm-assign-del-user">
                                <span class="dashicons dashicons-trash"></span> 
                                <span class="title">{{ __( 'Delete', 'pm' ) }}</span>
                            </a>
                        </td>
                    </tr>
                </table>
            </div>
            
            <div class="pm-form-item item project-users" v-if="show_role_field">
                <input v-pm-users class="pm-project-coworker" type="text" name="user" :placeholder="__( 'Type 3 or more characters to search users...', 'pm' )" size="45">
            </div>

            <div class="pm-form-item item project-notify">
                <label>
                    <input type="checkbox" v-model="project_notify" name="project_notify" id="project-notify" value="yes" />
                    {{ __( 'Notify Co-Workers', 'pm' ) }}            
                </label>
            </div>

            <div class="submit">
                <input v-if="is_update" type="submit" name="update_project" id="update_project" class="button-primary" :value="__( 'Update Project', 'pm' )">
                <input v-if="!is_update" type="submit" name="add_project" id="add_project" class="button-primary" :value="__( 'Add New Project', 'pm' )">
                <a @click.prevent="closeForm()" class="button project-cancel" href="#">{{ __( 'Cancel', 'pm' ) }}</a>
                <span v-show="show_spinner" class="pm-loading"></span>

            </div>

        </form>
        <div v-pm-user-create-popup-box id="pm-create-user-wrap" :title="__( 'Create a new user', 'pm' )">
            <project-new-user-form></project-new-user-form>
        </div>
    </div>
</template>

<script>
    import directive from './directive.js';
    import project_new_user_form from './project-new-user-form.vue';
    import Mixins from './mixin';

    var new_project_form = {

        props: ['is_update'],

        data () {

            return {
                project_name: '',
                project_cat: 0,
                project_description: '',
                project_notify: false,
                assignees: [],
                show_spinner: false
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

            project () {
                
                var projects = this.$root.$store.state.projects;
                var index = this.getIndex(projects, this.project_id, 'id');
                var project = {};
                
                if ( index !== false ) {
                    project = projects[index];
                } 
                
                return project;
            },
            selectedUsers () {
                return this.$root.$store.state.assignees;
            },

            project_category: {
                get () {
                    if (this.is_update) {
                        var projects = this.$root.$store.state.projects;
                        var index = this.getIndex(projects, this.project_id, 'id');
                        var project = projects[index];
                    
                        if ( 
                            typeof project.categories !== 'undefined' 
                                && 
                            project.categories.data.length 
                        ) {

                            this.project_cat = project.categories.data[0].id;
                            
                            return project.categories.data[0].id;
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
                if ( this.is_project_creator(del_user.id) ) {
                    return;
                }

                this.$root.$store.commit(
                    'afterDeleteUserFromProject', 
                    {
                        project_id: this.project_id,
                        user_id: del_user.id
                    }
                );
            },
            is_project_creator (user_id) {
                if ( !this.project.hasOwnProperty('creator') ){
                    return false;
                }

                if ( this.project.creator.data.id  == user_id ) {
                    return true;
                }

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
                    pm.Toastr.error('Project title is required!');
                    return;
                }

                this.show_spinner = true;

                var args = {
                    data: {
                        'title': this.project.title,
                        'categories': [this.project_cat],
                        'description': this.project.description,
                        'notify_users': this.project_notify,
                        'assignees': this.formatUsers(this.selectedUsers),
                        'status': this.project.status,
                    }   
                }

                var self = this;
                if (this.is_update) {
                    args.data.id = this.project.id;
                    args.callback = function ( res ) {
                        self.show_spinner = false;
                    }
                    this.updateProject ( args );
                } else {
                    args.callback = function(res) {
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
                var projects = this.$root.$store.state.projects;
                var index = this.getIndex(projects, this.project_id, 'id');
                
                if ( index !== false && this.is_update ) {
                    this.$root.$store.commit('setSeletedUser', projects[index].assignees.data);
                } else {
                    this.$root.$store.commit('resetSelectedUsers');
                }
            },

            closeForm () {
                jQuery( "#pm-project-dialog" ).dialog('close'); 
                this.showHideProjectForm(false)
            }
        }
    }

    export default new_project_form;
</script>



