<template>
    <div class="pm-top-bar pm-no-padding">
        <div class="pm-row pm-no-padding">
            <div class="pm-col-6">
                <h3>{{text.project_manager}}</h3>
            </div>

            <div class="pm-col-6 pm-top-right-btn pm-text-right pm-last-col show_desktop_only">

            </div>
            <div class="clearfix"></div>
        </div>

        <div class="pm-row pm-no-padding pm-priject-search-bar">
            <div class="pm-col-3 pm-sm-col-12 pm-no-padding pm-no-margin">
                <project-new-project-btn></project-new-project-btn>
            </div>

            <div class="pm-col-9 pm-no-padding pm-no-margin pm-sm-col-12  ">
                <div class="pm-col-5 pm-sm-col-12">
                    <project-filter-by-category></project-filter-by-category>
                </div>
            </div>
            <div class="clearfix"> </div>
        </div>

        <div class="pm-row pm-project-group">
            <project-header-menu></project-header-menu>

            <div class="pm-col-4 pm-last-col pm-text-right show_desktop_only">
                <project-view></project-view>
            </div>
        </div>

        <div class="clearfix"> </div>
    </div>
</template>

<script>
    import project_new_project_btn from './project-new-project-btn.vue';
    import project_filter_by_category from './project-filter-by-category.vue';
    import project_search_by_client from './project-search-by-client.vue';
    import project_search_all from './project-search-all.vue';
    import project_header_menu from './project-header-menu.vue';
    import project_view from './project-view.vue';

    export default {
        components: {
            'project-new-project-btn': project_new_project_btn,
            'project-filter-by-category': project_filter_by_category,
            'project-search-by-client': project_search_by_client,
            'project-search-all': project_search_all,
            'project-header-menu': project_header_menu,
            'project-view': project_view,
        }
    }
</script>


