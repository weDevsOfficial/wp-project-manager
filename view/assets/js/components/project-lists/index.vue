<template>

    <div class="wrap cpm cpm-front-end"><div class="cpm-top-bar cpm-no-padding">
        <div class="cpm-row cpm-no-padding">
            <div class="cpm-col-6">
                <h3>Project Manager</h3>
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
                <div class="cpm-col-7 cpm-sm-col-12 cpm-project-search">
                    <project-search-by-client></project-search-by-client>
                    <project-search-all></project-search-all>
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


        <div class="cpm-projects cpm-row cpm-project-grid cpm-no-padding cpm-no-margin">
            <project-summary></project-summary>
            <project-pagination></project-pagination>
        </div>

    </div>


</template>

<script>
    // import project_new_project_btn from './project-new-project-btn.vue';
    // import project_filter_by_category from './project-filter-by-category.vue';
    // import project_search_by_client from './project-search-by-client.vue';
    // import project_search_all from './project-search-all.vue';
    // import project_header_menu from './project-header-menu.vue';
    // import project_view from './project-view.vue';
    // import project_summary from './project-summary.vue';
    // import project_pagination from './project-pagination.vue';

    const project_new_project_btn = resolve => {
        require.ensure(['./project-new-project-btn.vue'], () => {
            resolve(require('./project-new-project-btn.vue'));
        });
    }

    const project_filter_by_category = resolve => {
        require.ensure(['./project-filter-by-category.vue'], () => {
            resolve(require('./project-filter-by-category.vue'));
        });
    }
    const project_search_by_client = resolve => {
        require.ensure(['./project-search-by-client.vue'], () => {
            resolve(require('./project-search-by-client.vue'));
        });
    }
    const project_search_all = resolve => {
        require.ensure(['./project-search-all.vue'], () => {
            resolve(require('./project-search-all.vue'));
        });
    }
    const project_header_menu = resolve => {
        require.ensure(['./project-header-menu.vue'], () => {
            resolve(require('./project-header-menu.vue'));
        });
    }
    const project_view = resolve => {
        require.ensure(['./project-view.vue'], () => {
            resolve(require('./project-view.vue'));
        });
    }

    const project_summary = resolve => {
        require.ensure(['./project-summary.vue'], () => {
            resolve(require('./project-summary.vue'));
        });
    }

    const project_pagination = resolve => {
        require.ensure(['./project-pagination.vue'], () => {
            resolve(require('./project-pagination.vue'));
        });
    }

    
    
    export default {
        // beforeRouteEnter (router, redirect, next) {
        //  next();
        // },
        
        components: {
            'project-new-project-btn': project_new_project_btn,
            'project-filter-by-category': project_filter_by_category,
            'project-search-by-client': project_search_by_client,
            'project-search-all': project_search_all,
            'project-header-menu': project_header_menu,
            'project-view': project_view,
            'project-summary': project_summary,
            'project-pagination': project_pagination,
        }
    }
</script>

<style>
.cpm-project-meta .message .fa-circle {
    color: #4975a8;
}   

.cpm-project-meta .todo .fa-circle {
    color: #68af94;
}   

.cpm-project-meta .files .fa-circle {
    color: #71c8cb;
}   

.cpm-project-meta .milestone .fa-circle {
    color: #4975a8;
}   

</style>

