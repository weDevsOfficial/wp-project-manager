<template>
    <!-- pm-overview-panel -->
    <div class="pm-overview-container">
        <div class="pm-panel pm-overview-panel">
            <!-- pm panel header -->
            <div class="pm-panel-header">
                <div class="pm-grid-row">
                    <!-- project page header menu -->
                    <project-header-menu></project-header-menu>

                    <!-- pm header right column -->
                    <div class="pm-col-6-sm">
                        <!-- pm view stayle container -->
                        <div class="pm-view-style-container pm-text-right">
                            <!-- project view component -->
                            <project-view></project-view>
                            <!-- filter by category component -->
                            <project-filter-by-category></project-filter-by-category>
                        </div>
                    </div> <!-- end col -->
                </div>
            </div>

            <!-- start panel body -->
            <div class="pm-panel-body">
                <div class="pm-grid-row">
                    <project-summary></project-summary>
                    <pm-pagination 
                        :total_pages="total_pages" 
                        :current_page_number="current_page_number" 
                        component_name='all_project_pagination'>
                    </pm-pagination> 
                </div>
            </div>

        </div>
    </div>
</template>

<script>

    import project_header_menu from './project-header-menu.vue';
    import project_view from './project-view.vue';
    import project_filter_by_category from './project-filter-by-category.vue';
    import project_summary from './project-summary.vue';
    import project_loading from './project-loading.vue';
    import Mixins from './mixin';
    import pagination from './../common/pagination.vue';
    // import after_project from './../common/do-action.vue';
    // import Header from './header.vue';
    
    export default  {
        
        beforeRouteEnter (to, from, next) {
            next(vm => {
                
            });
        },  

        created () {
            this.projectQuery();
            this.getRoles();
            this.getProjectCategories();
        },

        data () {
            return {
                current_page_number: 1,
                loading: true,
            }
        },
        mixins: [Mixins],
        watch: {
            '$route' (route) {
                this.current_page_number = route.params.current_page_number;
                this.projectQuery();
            }
        },

        computed: {
            is_popup_active () {
                return this.$store.state.is_popup_active;
            },

            total_pages () {
                return this.$root.$store.state.pagination.total_pages;
            }    
        },
        
        components: {
            'project-summary': project_summary,
            'pm-pagination': pagination,
            // 'do-action': after_project,
            'project-loading': project_loading,
            // 'project-list-header': Header,
            'project-header-menu': project_header_menu,
            'project-view': project_view,
            'project-filter-by-category': project_filter_by_category
        },

        methods: {
            projectQuery () {
                var self = this;
                this.loading = true;
                this.getProjects({
                    callback (res) {
                        self.projectFetchStatus(true);
                        self.loading = false;

                    }
                });
            }
        }
    }
</script>
