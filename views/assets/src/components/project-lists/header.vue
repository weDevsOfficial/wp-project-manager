<template>

        <!-- header -->
        <div class="pm-header pm-clearfix">
            <div class="pm-container">
                <div class="pm-header-row">
                    <!-- header-left -->
                    <div class="pm-header-left">
                        <h2 class="pm-d-inline"> {{ __('Project Manager', 'wedevs-project-manager') }}</h2>
                        <project-new-project-btn v-if="has_create_capability()"></project-new-project-btn>
                    </div> <!-- end header-left -->

                    <!-- header-right -->
                    <div class="pm-header-right pm-text-right">
                        <!-- <form action="#" class="pm-search-form" method="get">
                            <div class="pm-form-has-addon">
                                <input type="text" placeholder="Search" class="pm-form-control">
                                <button type="submit" class="pm-submit-btn"><i class="pm-icon flaticon-magnifying-glass-browser"></i></button>
                            </div>
                        </form> -->
                        <pm-do-action hook="pm_projects_header" ></pm-do-action>
                    </div>
                </div>
            </div>

            <!-- project popup dialog -->
            <div id="pm-project-dialog" v-pm-popup-box style="z-index:999;" :title="start_new_project" v-show="has_create_capability()">
                <project-create-form :project="{}"></project-create-form>
            </div> 
        </div>

        
</template>

<script>
    import project_new_project_btn from './project-new-project-btn.vue';
    import project_filter_by_category from './project-filter-by-category.vue';
    import project_search_by_client from './project-search-by-client.vue';
    import project_search_all from './project-search-all.vue';
    import project_header_menu from './project-header-menu.vue';
    import project_view from './project-view.vue';
    import project_create_form from './project-create-form.vue';
    // import project home page's styles
    import '@helpers/less/project/pm-project.less';



    export default {
        components: {
            'project-new-project-btn': project_new_project_btn,
            'project-filter-by-category': project_filter_by_category,
            'project-search-by-client': project_search_by_client,
            'project-search-all': project_search_all,
            'project-header-menu': project_header_menu,
            'project-view': project_view,
            'project-create-form': project_create_form,
        },
        data () {
            return {
                start_new_project: __( 'Start a new project', 'wedevs-project-manager'),
            }
        }

    }
</script>

<style lang="less">
    .pm-page-wrapper .pm-overview-panel .pm-panel-header {
        border-radius: 3px 3px 0 0 !important;
    }

    .pm-project-content {

    }
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


