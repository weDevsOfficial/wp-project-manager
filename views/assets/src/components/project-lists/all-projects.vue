<template>
    <div id="all-projects">
        <project-list-header></project-list-header>
        <div class="all-projects">

            <div v-if="loading" class="pm-row pm-data-load-before" >
                <div class="pm-col-4">
                    <project-loading ></project-loading>
                </div>
                <div class="pm-col-4">
                    <project-loading ></project-loading>
                </div>
                <div class="pm-col-4">
                    <project-loading ></project-loading>
                </div>
                <div class="pm-col-4">
                    <project-loading ></project-loading>
                </div>
                <div class="pm-col-4">
                    <project-loading ></project-loading>
                </div>
                <div class="pm-col-4">
                    <project-loading ></project-loading>
                </div>
            </div>
            <div v-else>
                <projects-panel></projects-panel>
            </div>
            
        </div>
    </div>
</template>

<script>
    
    import projects_panel from './projects-panel.vue';
    import project_filter_by_category from './project-filter-by-category.vue';
    import project_view from './project-view.vue';
    import project_header_menu from './project-header-menu.vue';
    import project_summary from './project-summary.vue';
    import pagination from './../common/pagination.vue';
    import after_project from './../common/do-action.vue';
    import project_loading from './project-loading.vue';
    import Header from './header.vue';
    import Mixins from './mixin';
    
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
            'do-action': after_project,
            'project-loading': project_loading,
            'project-list-header': Header,
            'project-header-menu': project_header_menu,
            'project-view': project_view,
            'project-filter-by-category': project_filter_by_category,
            'projects-panel': projects_panel
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

<style>
.pm-project-meta .message .fa-circle {
    color: #4975a8;
}   

.pm-project-meta .todo .fa-circle {
    color: #68af94;
}   

.pm-project-meta .files .fa-circle {
    color: #71c8cb;
}   

.pm-project-meta .milestone .fa-circle {
    color: #4975a8;
}   

</style>

