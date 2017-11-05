<template>
<div>

    <form action="" method="post" class="pm-project-form" @submit.prevent="projectFormAction();">

        <div class="pm-form-item project-name">
            <!-- v-model="project_name" -->
            <input type="text" v-model="project.title" name="project_name" id="project_name" :placeholder="text.name_of_the_project" value="" size="45" />
        </div>

        <div class="pm-form-item project-category">
            <!-- v-model="project_cat" -->
            <select v-model="project_category"  name='project_cat' id='project_cat' class='chosen-select' style="height: 35px;">
                <option value="0">{{text.project_category}}</option>
                <option v-for="category in categories" :value="category.id">{{ category.title }}</option>
            </select>
        </div>

        <div class="pm-form-item project-detail">
            <!-- v-model="project_description" -->
            <textarea v-model="project.description" name="project_description" class="pm-project-description" id="" cols="50" rows="3" :placeholder="text.project_dsc_input"></textarea>
        </div>

        <div class="pm-form-item pm-project-role">
            <table>
                <tr v-for="projectUser in selectedUsers" key="projectUser.id">
                    <td>{{ projectUser.display_name }}</td>
                    <td>
                        <select  v-model="projectUser.roles.data[0].id">
                            <option v-for="role in roles" :value="role.id">{{ role.title }}</option>
                        </select>
                    </td>
                  
                    <td>
                        <a @click.prevent="deleteUser(projectUser)" hraf="#" class="pm-del-proj-role pm-assign-del-user">
                            <span class="dashicons dashicons-trash"></span> 
                            <span class="title">{{text.delete}}</span>
                        </a>
                    </td>
                </tr>
            </table>
        </div>
        
        <div class="pm-form-item project-users">
            <input v-pm-users class="pm-project-coworker" type="text" name="user" :placeholder="text.project_user_input" size="45">
        </div>

        <div class="pm-form-item project-notify">
            <label>
                <input type="checkbox" v-model="project_notify" name="project_notify" id="project-notify" value="yes" />
                {{text.notify_co_workers}}            
            </label>
        </div>

        <div class="submit">
            <input v-if="is_update" type="submit" name="update_project" id="update_project" class="button-primary" :value="text.update_project">
            <input  v-if="!is_update" type="submit" name="add_project" id="add_project" class="button-primary" :value="text.create_a_project">
            <a @click.prevent="showHideProjectForm(false)" class="button project-cancel" href="#">{{text.cancel}}</a>
            <span v-show="show_spinner" class="pm-loading"></span>

        </div>

    </form>
    <div v-pm-user-create-popup-box id="pm-create-user-wrap" :title="text.create_a_new_user">
        <project-new-user-form></project-new-user-form>
    </div>
</div>
</template>

<script>
    import directive from './directive.js';
    import project_new_user_form from './project-new-user-form.vue';

    var new_project_form = {

        props: ['is_update'],

        data () {

            return {
                'project_name': '',
                'project_cat': 0,
                'project_description': '',
                'project_notify': false,
                'assignees': [],
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
                
                if ( index !== false ) {
                    return projects[index];
                } 
                return {};
            },

            selectedUsers () {
                return this.$root.$store.state.assignees;
            },

            // project_users () {
            //  var projects = this.$root.$store.state.projects;
   //              var index = this.getIndex(projects, this.project_id, 'id');
                
   //              if ( index !== false ) {
   //               return projects[index].assignees.data;
   //              } 
            //  return [];
            // },
                
    
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

        },

        methods: {

            deleteUser (del_user) {
                this.$root.$store.commit(
                    'afterDeleteUserFromProject', 
                    {
                        project_id: this.project_id,
                        user_id: del_user.id
                    }
                );
            },
            /**
             * Action after submit the form to save and update
             * @return {[void]} 
             */
            projectFormAction () {
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
                    args.callback = function ( res ){
                        self.show_spinner = false;
                    }
                    this.updateProject ( args );
                } else {
                    args.callback = function(res){
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
        } 
            }
        }
    }

    export default new_project_form;
</script>
