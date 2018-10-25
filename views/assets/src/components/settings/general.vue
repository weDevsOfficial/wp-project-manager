<template>
    <div>
        
        <div class="metabox-holder">
            <div id="pm_general" class="group" style="">
                <form @submit.prevent="saveSelfSettings()" method="post" action="options.php">
                    <h2>{{ __( 'General Settings', 'wedevs-project-manager') }}</h2>
                    <table class="form-table">
                        <tbody>
                            <tr>
                                <th scope="row">
                                    <label for="pm_general[upload_limit]">{{ __( 'File Upload Limit', 'wedevs-project-manager') }}</label>
                                </th>
                                <td>
                                    <input v-model="upload_limit" type="text" class="regular-text">
                                    <p class="description">{{ __( 'File Size in Megabytes. e.g: 2', 'wedevs-project-manager') }}</p>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">
                                    <label for="pm_general[pagination]">{{ __( 'Projects Per Page', 'wedevs-project-manager') }}</label>
                                </th>
                                <td>
                                    <input v-model="project_per_page" type="text" class="regular-text">
                                    <p class="description">{{ __( '-1 for unlimited', 'wedevs-project-manager') }}</p>
                                </td>
                            </tr>
                 
                            <tr>
                                <th scope="row">
                                    <label for="pm_general[show_todo]">{{ __( 'Task Lists Per Page', 'wedevs-project-manager') }}</label>
                                </th>
                                <td>
                                    <input v-model="list_per_page" type="text" class="regular-text" id="pm_general[show_todo]" name="pm_general[show_todo]" value="">
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">
                                    <label for="pm_general[show_incomplete_tasks]">{{ __( 'Incomplete Tasks Per Page', 'wedevs-project-manager') }}</label>
                                </th>
                                <td>
                                    <input v-model="incomplete_tasks_per_page" type="text" class="regular-text" id="pm_general[show_incomplete_tasks]" name="pm_general[show_incomplete_tasks]" value="2">
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">
                                    <label for="pm_general[show_completed_tasks]">{{ __( 'Completed Tasks Per Page', 'wedevs-project-manager') }}</label>
                                </th>
                                <td>
                                    <input v-model="complete_tasks_per_page" type="text" class="regular-text" id="pm_general[show_completed_tasks]" name="pm_general[show_completed_tasks]" value="2">
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">
                                    <label for="pm_general[project_manage_role]">{{__( 'Project Managing Capability', 'wedevs-project-manager')}}</label>
                                </th>
                                <td>

                                    <fieldset>
                                        <label v-for="(role_display_name, role) in roles" :key="role">
                                            <input type="checkbox" class="checkbox" v-model="managing_capability" :value="role">
                                            {{ role_display_name }}
                                        </label>
                                        
                                        <p class="description">{{ __( 'Select the user roles who can see and manage all projects.', 'wedevs-project-manager') }}</p>
                                    </fieldset>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">
                                    <label for="pm_general[project_create_role]">{{ __( 'Project Creation Capability', 'wedevs-project-manager') }}</label>
                                </th>
                                <td>

                                    <fieldset>
                                        <label v-for="(role_display_name, role) in roles" :key="role">
                                            <input type="checkbox" class="checkbox" v-model="project_create_capability" :value="role">
                                            {{ role_display_name }}
                                        </label>
                                        
                                        <p class="description">{{ __( 'Select the user roles who can create projects.', 'wedevs-project-manager') }}</p>
                                    </fieldset>
                                </td>
                            </tr>
                        </tbody>
                    </table> 

                    <pm-do-action hook="pm_after_settings"></pm-do-action>

                    <div style="padding-left: 10px">
                        <p class="submit">
                            <input type="submit" name="submit" id="submit" class="button button-primary" :value="save_changes">
                            <span v-show="show_spinner" class="pm-spinner"></span>
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
            upload_limit: this.getSettings('upload_limit', 2),
            project_per_page: this.getSettings('project_per_page', 10),
            list_per_page: this.getSettings('list_per_page', 10),
            incomplete_tasks_per_page: this.getSettings('incomplete_tasks_per_page', 10),
            complete_tasks_per_page: this.getSettings('complete_tasks_per_page', 10),
            roles: PM_Vars.roles,
            managing_capability: this.getSettings('managing_capability', []),
            project_create_capability: this.getSettings('project_create_capability', []),
            show_spinner: false,
            save_changes: __( 'Save Changes', 'wedevs-project-manager')
        }
    },
    mixins: [Mixins],
    mounted: function(){
        pm.NProgress.done();
    },
    methods: {
        saveSelfSettings () {

            this.show_spinner = true;
            var self = this;
            var data = {
                upload_limit: this.upload_limit,
                project_per_page: this.project_per_page,
                list_per_page: this.list_per_page,
                incomplete_tasks_per_page: this.incomplete_tasks_per_page,
  
                complete_tasks_per_page: this.complete_tasks_per_page,
                managing_capability: this.managing_capability,
                project_create_capability: this.project_create_capability
            };
            data = pm_apply_filters('setting_data', data);
            
            this.saveSettings(data, false, function(res) {
                res.forEach( function( item ) {
                    PM_Vars.settings[item.key] =  item.value;
                } );
                self.show_spinner = false;
            });
        },
    }
}
</script>
