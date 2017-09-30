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

            <div class="cpm-edit-project">
                <edit-project :is_update="true"></edit-project>
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
                <do-action hook="pm-header"></do-action>
            </ul>
        </div>

        <div class="clearfix"></div>
    </div>
</template>

<script>
    import router from './../router';
    import do_action from './do-action.vue';
    import edit_project from './project-lists/project-create-form.vue';

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
                ],
            }
        },

        created () {
            this.getProject();
            this.getProjectCategories();
            this.getRoles(); 
        },

        components: {
            'do-action': do_action,
            'edit-project': edit_project
        },
    }
</script>

