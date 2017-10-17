<template>
	<div class="cpm-top-bar cpm-no-padding">
        <div class="cpm-row cpm-no-padding">
            <div class="cpm-col-6">
                <h3>{{text.project_manager}}</h3>
            </div>

            <div class="cpm-col-6 cpm-top-right-btn cpm-text-right cpm-last-col show_desktop_only">

            </div>
            <div class="clearfix"></div>
        </div>

        <div class="cpm-row cpm-no-padding cpm-priject-search-bar">
            <div class="cpm-col-3 cpm-sm-col-12 cpm-no-padding cpm-no-margin">
                <project-new-project-btn></project-new-project-btn>
            </div>

            <div class="cpm-col-9 cpm-no-padding cpm-no-margin cpm-sm-col-12  ">
                <div class="cpm-col-5 cpm-sm-col-12">
                    <project-filter-by-category></project-filter-by-category>
                </div>
            </div>
            <div class="clearfix"> </div>
        </div>

        <div class="cpm-row cpm-project-group">
            <project-header-menu></project-header-menu>

            <div class="cpm-col-4 cpm-last-col cpm-text-right show_desktop_only">
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


