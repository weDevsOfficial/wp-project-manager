<template>
    <div>
        <settings-header></settings-header>
        <div class="metabox-holder">
            <div id="pm_general" class="group" style="">
                <form @submit.prevent="saveSelfSettings()" method="post" action="options.php">
                    <h2>General Settings</h2>
                    <table class="form-table">
                        <tbody>
                            <tr>
                                <th scope="row">
                                    <label for="pm_general[upload_limit]">File Upload Limit</label>
                                </th>
                                <td>
                                    <input v-model="upload_limit" type="text" class="regular-text">
                                    <p class="description">File Size in Megabytes. e.g: 2</p>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">
                                    <label for="pm_general[pagination]">Projects Per Page</label>
                                </th>
                                <td>
                                    <input v-model="project_per_page" type="text" class="regular-text">
                                    <p class="description">-1 for unlimited</p>
                                </td>
                            </tr>
                            <!-- <tr>
                                <th scope="row">
                                    <label for="pm_general[todolist_show]">Task List Style</label>
                                </th>
                                <td>
                                    <fieldset>
                                        <label for="wpuf-pm_general[todolist_show][pagination]">
                                            <input type="radio" class="radio" checked="checked">
                                            Pagination
                                        </label>
                                        <br>
                                         <label for="wpuf-pm_general[todolist_show][load_more]">
                                            <input type="radio" class="radio" id="wpuf-pm_general[todolist_show][load_more]" name="pm_general[todolist_show]" value="load_more">
                                            Load More...
                                        </label>
                                        <br>
                                        <label for="wpuf-pm_general[todolist_show][lazy_load]">
                                            <input type="radio" class="radio" id="wpuf-pm_general[todolist_show][lazy_load]" name="pm_general[todolist_show]" value="lazy_load">Lazy Load
                                        </label>
                                        <br>
                                    </fieldset>
                                </td>
                            </tr> -->
                            <tr>
                                <th scope="row">
                                    <label for="pm_general[show_todo]">Task Lists Per Page</label>
                                </th>
                                <td>
                                    <input v-model="list_per_page" type="text" class="regular-text" id="pm_general[show_todo]" name="pm_general[show_todo]" value="">
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">
                                    <label for="pm_general[show_incomplete_tasks]">Incomplete Tasks Per Page</label>
                                </th>
                                <td>
                                    <input v-model="incomplete_tasks_per_page" type="text" class="regular-text" id="pm_general[show_incomplete_tasks]" name="pm_general[show_incomplete_tasks]" value="2">
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">
                                    <label for="pm_general[show_completed_tasks]">Completed Tasks Per Page</label>
                                </th>
                                <td>
                                    <input v-model="complete_tasks_per_page" type="text" class="regular-text" id="pm_general[show_completed_tasks]" name="pm_general[show_completed_tasks]" value="2">
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">
                                    <label for="pm_general[project_manage_role]">Project Managing Capability</label>
                                </th>
                                <td>

                                    <fieldset>
                                        <label v-for="(role_display_name, role) in roles">
                                            <input type="checkbox" class="checkbox" v-model="managing_capability" :value="role">
                                            {{ role_display_name }}
                                        </label>
                                        
                                        <p class="description">Select the user roles who can see and manage all projects.</p>
                                    </fieldset>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">
                                    <label for="pm_general[project_create_role]">Project Creation Capability</label>
                                </th>
                                <td>

                                    <fieldset>
                                        <label v-for="(role_display_name, role) in roles">
                                            <input type="checkbox" class="checkbox" v-model="project_create_capability" :value="role">
                                            {{ role_display_name }}
                                        </label>
                                        
                                        <p class="description">Select the user roles who can see and manage all projects.</p>
                                    </fieldset>
                                </td>
                            </tr>
                        </tbody>
                    </table>                            
                    <div style="padding-left: 10px">
                        <p class="submit">
                            <input type="submit" name="submit" id="submit" class="button button-primary" value="Save Changes">
                            <span v-show="show_spinner" class="pm-spinner"></span>
                        </p>                            
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
<script>
    import header from './header.vue';

    export default {
        data () {
            return {
                upload_limit: this.getSettings('upload_limit', 2),
                project_per_page: this.getSettings('project_per_page', 10),
                list_per_page: this.getSettings('list_per_page', 10),
                incomplete_tasks_per_page: this.getSettings('incomplete_tasks_per_page', 10),
                complete_tasks_per_page: this.getSettings('complete_tasks_per_page', 10),
                roles: PM_Vars.roles,
                managing_capability: this.getSettings('managing_capability', []),
                project_create_capability: this.getSettings('project_create_capability', []),
                show_spinner: false,
            }
        },

        components: {
            'settings-header': header
        },

        methods: {
            saveSelfSettings () {
                this.show_spinner = true;
                self = this;
                var data = {
                    upload_limit: this.upload_limit,
                    project_per_page: this.project_per_page,
                    list_per_page: this.list_per_page,
                    incomplete_tasks_per_page: this.incomplete_tasks_per_page,
                    complete_tasks_per_page: this.complete_tasks_per_page,
                    managing_capability: this.managing_capability,
                    project_create_capability: this.project_create_capability
                };


                this.saveSettings(data, function(res) {
                    self.show_spinner = false;
                });
            },
        }
    }
</script>