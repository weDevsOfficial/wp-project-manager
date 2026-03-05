<template>

        <!-- header -->
        <div class="pm-header">
            <h1 style="display: none;"></h1>
            <div class="pm-container">
                <div class="pm-header-row">
                    <!-- header-left -->
                    <div class="pm-header-left">
                        <h2 class="pm-d-inline"> {{ __('Project Manager', 'wedevs-project-manager') }}</h2>
                        <project-new-project-btn v-if="userCanAccess( PM_Vars.manager_cap_slug )"></project-new-project-btn>
                        <project-ai-create-btn v-if="userCanAccess( PM_Vars.manager_cap_slug )"></project-ai-create-btn>

                    </div> <!-- end header-left -->

                    <!-- header-right -->
                    <div class="pm-header-right pm-text-right">
                        <!-- Headway Widget (What's New) -->
                        <span id="pm-headway-icon" class="pm-headway-badge" role="button" tabindex="0" :aria-label="__( 'What\'s New', 'wedevs-project-manager' )" :title="__( 'What\'s New', 'wedevs-project-manager' )">
                            <svg class="pm-headway-icon-svg" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#586069" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                            </svg>
                        </span>
                        
                        <!-- Share Your Idea Link -->
                        <a 
                            class="pm-share-idea-link"
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://pm.canny.io/ideas">
                            💡 {{ __( 'Share your idea', 'wedevs-project-manager' ) }}
                        </a>

                        <pm-do-action hook="pm_projects_header" ></pm-do-action>
                    </div>
                </div>
            </div>

            <!-- project popup dialog -->
            <div id="pm-project-dialog" v-pm-popup-box style="z-index:999;" :title="start_new_project" v-show="has_create_capability()">
                <project-create-form :project="{}"></project-create-form>
            </div>

            <!-- AI project popup dialog -->
            <div id="pm-ai-project-dialog" v-pm-popup-box style="z-index:999;" :title="create_with_ai" v-show="has_create_capability()">
                <project-ai-create-form></project-ai-create-form>
            </div> 
        </div>

        
</template>

<script>
    import project_new_project_btn from './project-new-project-btn.vue';
    import project_ai_create_btn from './project-ai-create-btn.vue';
    import project_filter_by_category from './project-filter-by-category.vue';
    import project_search_by_client from './project-search-by-client.vue';
    import project_search_all from './project-search-all.vue';
    import project_header_menu from './project-header-menu.vue';
    import project_view from './project-view.vue';
    import project_create_form from './project-create-form.vue';
    import project_ai_create_form from './project-ai-create-form.vue';
    // import project home page's styles
    import '@helpers/less/project/pm-project.less';



    export default {
        components: {
            'project-new-project-btn': project_new_project_btn,
            'project-ai-create-btn': project_ai_create_btn,
            'project-filter-by-category': project_filter_by_category,
            'project-search-by-client': project_search_by_client,
            'project-search-all': project_search_all,
            'project-header-menu': project_header_menu,
            'project-view': project_view,
            'project-create-form': project_create_form,
            'project-ai-create-form': project_ai_create_form,
        },
        data () {
            return {
                start_new_project: __( 'Start a new project', 'wedevs-project-manager'),
                create_with_ai: __( 'Create with AI', 'wedevs-project-manager'),
            }
        },

        created () {
            
        }

    }
</script>

<style lang="less">
    .pm-page-wrapper .pm-overview-panel .pm-panel-header {
        border-radius: 3px 3px 0 0 !important;
    }

    .pm-project-content {

    }
    

    .ui-dialog {
        left: 50% !important;
        transform: translate(-50%, 0);
        max-width: calc(100% - 50px);
    }

    /* Headway Badge Container - matches WPUF styling */
    .pm-headway-badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        position: relative;
        border: 1px solid #e5e7eb;
        border-radius: 50%;
        padding: 4px;
        margin-right: 16px;
        vertical-align: middle;
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        cursor: pointer;
        transition: background-color 0.2s ease;

        &:hover {
            background-color: #f1f5f9;
        }
    }

    .pm-headway-icon-svg {
        display: block;
        position: relative;
        z-index: 1;
    }

    /* Make Headway badge container fill the entire clickable area */
    #pm-headway-icon .HW_badge_cont {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        z-index: 2;
    }

    /* Share Your Idea Link Styles */
    .pm-share-idea-link {
        display: inline-block;
        border: 1px solid #c9a227;
        border-radius: 6px;
        padding: 8px 16px;
        font-size: 14px;
        font-weight: 500;
        color: #92700c;
        background-color: #fefce8;
        text-decoration: none;
        margin-right: 16px;
        vertical-align: middle;
        transition: all 0.2s ease;

        &:hover {
            background-color: #fef9c3;
            color: #713f12;
        }
    }

    .pm-header-right {
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }

</style>


