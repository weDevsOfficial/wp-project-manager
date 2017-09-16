<template>
    <div class="cpm-top-bar cpm-no-padding cpm-project-header cpm-project-head">

        <div class="cpm-row cpm-no-padding cpm-border-bottom">

            <div class="cpm-col-6 cpm-project-detail">
                <h3>
                    <span class="cpm-project-title"> eirugkdj </span>
                     <a href="#" class="cpm-icon-edit cpm-project-edit-link small-text">
                        <span class="dashicons dashicons-edit"></span> 
                        <span class="text">Edit</span>
                     </a>
                </h3>

                <div class="detail"></div>
            </div>

            <div class="cpm-col-6 cpm-last-col cpm-top-right-btn cpm-text-right show_desktop_only">
                <div class="cpm-single-project-search-wrap">
                    <input type="text" data-project_id="60" placeholder="Search..." id="cpm-single-project-search">
                </div>
                    
                <div class="cpm-project-action">
                    <span class="dashicons dashicons-admin-generic cpm-settings-bind"></span>

                    <ul class="cpm-settings">
                        <li>
                            <span class="cpm-spinner"></span>
                            <a href="http://localhost/test/wp-admin/admin.php?page=cpm_projects" class="cpm-project-delete-link" title="Delete project" data-confirm="Are you sure to delete this project?" data-project_id="60">
                                <span class="dashicons dashicons-trash"></span>
                                <span>Delete</span>
                            </a>
                        </li>
                        <li>
                            <span class="cpm-spinner"></span>
                                <a class="cpm-archive" data-type="archive" data-project_id="60" href="#">
                                    <span class="dashicons dashicons-yes"></span>
                                    <span>Complete</span>
                                </a>
                        </li>

                        <li>
                            <span class="cpm-spinner"></span>
                            <a class="cpm-duplicate-project" href="/test/wp-admin/admin.php?page=cpm_projects&amp;tab=project&amp;action=overview&amp;pid=60" data-project_id="60">
                                <span class="dashicons dashicons-admin-page"></span>
                                <span>Duplicate</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="clearfix"></div>

            <div class="cpm-edit-project" style="display:none;">
                <form action="" method="post" class="cpm-project-form">

                    <input type="hidden" id="_wpnonce" name="_wpnonce" value="9dd08c1e0f">
                    <input type="hidden" name="_wp_http_referer" value="/test/wp-admin/admin.php?page=cpm_projects&amp;tab=project&amp;action=overview&amp;pid=60">
                    
                    <div class="cpm-form-item project-name">
                        <input type="text" name="project_name" id="project_name" placeholder="Name of the project" value="eirugkdj" size="45">
                    </div>

                    <div class="cpm-form-item project-category">
                        <select name="project_cat" id="project_cat" class="chosen-select">
                            <option value="-1" selected="selected">– Project Category –</option>
                        </select>
                    </div>

                    <div class="cpm-form-item project-detail">
                        <textarea name="project_description" class="cpm-project-description" id="" cols="50" rows="3" placeholder="Some details about the project (optional)"></textarea>
                    </div>
                    <div class="cpm-form-item cpm-project-role">
                        <table></table>
                    </div>
                    <div class="cpm-form-item project-users">
                        <input class="cpm-project-coworker" type="text" name="" placeholder="Type 3 or more characters to search users..." size="45">
                    </div>

                    <div class="cpm-form-item project-notify">
                        <input type="hidden" name="project_notify" value="no">
                        <label>
                            <input type="checkbox" name="project_notify" id="project-notify" value="yes">
                            Notify Co-Workers            
                        </label>
                    </div>


                    
                    <div class="submit">
                        <input type="hidden" name="project_id" value="60">
                        <input type="hidden" name="action" value="cpm_project_update">
                        <span class="cpm-pro-update-spinner"></span>
                        <input type="submit" name="add_project" id="add_project" class="button-primary" value="Update Project">
                        <a class="button project-cancel" href="#">Cancel</a>
                    </div>

                    <div class="cpm-loading" style="display: none;">Saving...</div>

                </form>
            </div>
        </div>

        <div class="cpm-row cpm-project-group">
            <ul>
                <li v-for="item in menu"> 
                    <router-link 
                        :class="item.class"
                        :to="item.route">
                        <span>{{ item.name }}</span>
                        <div>{{ item.count }}</div>
                    </router-link>
                </li>      
            </ul>
        </div>

        <div class="clearfix"></div>
    </div>
</template>

<script>
    import router from './../router';

    export default {
        data () {
            return {
                menu: [
                    {
                        route: {
                            name: 'pm_overview',
                            project_id: this.project_id,
                        },

                        name: 'Overview',
                        count: 0,
                        class: 'overview cpm-sm-col-12'
                    },

                    {
                        route: {
                            name: 'activities',
                            project_id: this.project_id,
                        },

                        name: 'Activities',
                        count: 10,
                        class: 'activity cpm-sm-col-12'
                    },

                    {
                        route: {
                            name: 'discussions',
                            project_id: this.project_id,
                        },

                        name: 'Discussions',
                        count: 40,
                        class: 'message cpm-sm-col-12'
                    },

                    {
                        route: {
                            name: 'task_lists',
                            project_id: this.project_id,
                        },

                        name: 'Task Lists',
                        count: 30,
                        class: 'to-do-list cpm-sm-col-12 active'
                    },

                    {
                        route: {
                            name: 'milestones',
                            project_id: this.project_id,
                        },

                        name: 'Milestones',
                        count: 25,
                        class: 'milestone cpm-sm-col-12'
                    },

                    {
                        route: {
                            name: 'pm_files',
                            project_id: this.project_id,
                        },

                        name: 'Files',
                        count: 50,
                        class: 'files cpm-sm-col-12'
                    }
                ]
            }
        }
    }
</script>

