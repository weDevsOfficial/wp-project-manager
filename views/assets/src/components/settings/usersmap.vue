<template>
    <div>

        <div class="metabox-holder">
            <div id="pm_general" class="group" style="">
                <h2>{{ __( 'Users Map to Github & Bitbucket', 'wedevs-project-manager') }}</h2>
                <select  @change="getProjectUser()">
                    <option value="">Select</option>
                    <option v-for="project in projects" :value="JSON.stringify(project.assignees.data)">{{ project.title }}</option>
                </select>
                <form @submit.prevent="saveUsers()" method="post" id="saveUsers">
                    <table class="wp-list-table widefat fixed striped posts">
                        <thead>
                        <tr>
                            <th scope="col" class="manage-column column-author">Users</th>
                            <th scope="col"  class="manage-column column-categories">Github Username</th>
                            <th scope="col"  class="manage-column column-categories">Bitbucket Username</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="user in users">
                            <td>{{ user.username }}</td>
                            <td><input :name="github_name + user.id" :value="user.github"  type="text" class="regular-text"></td>
                            <td><input :name="bitbucket_name + user.id" :value="user.bitbucket" type="text" class="regular-text"></td>
                        </tr>
                        <tr v-if="!users.length">
                            <td colspan="3">No user found</td>
                        </tr>
                        </tbody>
                    </table>
                    <div style="padding-left: 10px">
                        <p class="submit">
                            <input type="submit" name="submit" id="submit" class="button button-primary" :value="save_changes">
                        </p>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
<script>
    import Mixins from './mixin';

    export default {
        data () {
            return {
                save_changes: __( 'Save Changes', 'wedevs-project-manager'),
                users : [],
                projects : [],
                github_name : 'github_',
                bitbucket_name : 'bitbucket_'
            }
        },
        mixins: [Mixins],
        mounted(){
            var self = this ;
            this.getProgects(function(projects){
                self.projects = projects.data;
            });
        },
        methods: {
            saveUsers(){
                let formData = jQuery('#'+event.target.id).serialize();
                let formDataObj = JSON.parse('{"' + decodeURI(formData).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
                console.log(formDataObj);
                this.save_map_users(formDataObj,function(data){
                    console.log(data);
                });
            },
            getProjectUser(){
                let userVal = event.target.value ;
                if(userVal.length > 0){
                    this.users = JSON.parse(userVal);
                }
            }
        }
    }
</script>
