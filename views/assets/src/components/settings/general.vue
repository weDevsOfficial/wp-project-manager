<template>
    <div>
        
        <div class="metabox-holder">
            <div id="pm_general" class="group" style="">
                <form @submit.prevent="saveSelfSettings()" method="post" action="options.php">
                    <h2>{{text.general_settings}}</h2>
                    <table class="form-table">
                        <tbody>
                            <tr>
                                <th scope="row">
                                    <label for="pm_general[upload_limit]">{{text.file_upload_limit}}</label>
                                </th>
                                <td>
                                    <input v-model="upload_limit" type="text" class="regular-text">
                                    <p class="description">{{text.file_size_mb}}</p>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">
                                    <label for="pm_general[pagination]">{{text.project_pp}}</label>
                                </th>
                                <td>
                                    <input v-model="project_per_page" type="text" class="regular-text">
                                    <p class="description">{{text.for_uplimited}}</p>
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
                                    <label for="pm_general[show_todo]">{{text.task_lists_pp}}</label>
                                </th>
                                <td>
                                    <input v-model="list_per_page" type="text" class="regular-text" id="pm_general[show_todo]" name="pm_general[show_todo]" value="">
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">
                                    <label for="pm_general[show_incomplete_tasks]">{{text.incomplete_tasks_pp}}</label>
                                </th>
                                <td>
                                    <input v-model="incomplete_tasks_per_page" type="text" class="regular-text" id="pm_general[show_incomplete_tasks]" name="pm_general[show_incomplete_tasks]" value="2">
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">
                                    <label for="pm_general[show_completed_tasks]">{{text.completed_tasks_pp}}</label>
                                </th>
                                <td>
                                    <input v-model="complete_tasks_per_page" type="text" class="regular-text" id="pm_general[show_completed_tasks]" name="pm_general[show_completed_tasks]" value="2">
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">
                                    <label for="pm_general[project_manage_role]">{{text.pm_capability}}</label>
                                </th>
                                <td>

                                    <fieldset>
                                        <label v-for="(role_display_name, role) in roles">
                                            <input type="checkbox" class="checkbox" v-model="managing_capability" :value="role">
                                            {{ role_display_name }}
                                        </label>
                                        
                                        <p class="description">{{text.pm_capability_des}}</p>
                                    </fieldset>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">
                                    <label for="pm_general[project_create_role]">{{text.pm_cc}}</label>
                                </th>
                                <td>

                                    <fieldset>
                                        <label v-for="(role_display_name, role) in roles">
                                            <input type="checkbox" class="checkbox" v-model="project_create_capability" :value="role">
                                            {{ role_display_name }}
                                        </label>
                                        
                                        <p class="description">{{text.pm_cc_des}}</p>
                                    </fieldset>
                                </td>
                            </tr>
                        </tbody>
                    </table> 

                    <pm-do-action hook="pm_after_settings"></pm-do-action>

                    <div style="padding-left: 10px">
                        <p class="submit">
                            <input type="submit" name="submit" id="submit" class="button button-primary" :value="text.save_changes">
                            <span v-show="show_spinner" class="pm-spinner"></span>
                        </p>                            
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
<script>
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
    mixins: [PmMixin.settings],
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