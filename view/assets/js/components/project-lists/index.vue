<template>
    <div class="wrap cpm cpm-front-end">
        <div class="cpm-top-bar cpm-no-padding">
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

        <div id="cpm-project-dialog" v-pm-popup-box style="z-index:999;" title="Start a new project">
            <project-create-form></project-create-form>
            <!-- <do-action :hook="'cpm-after-project-list'"></do-action> -->
        </div>

        <div v-cpm-user-create-popup-box id="cpm-create-user-wrap" title="Create a new user">
            <project-new-user-form></project-new-user-form>
        </div>
        
    </div>
</template>

<script>
    import directive from './../../directive';
    
    import project_new_project_btn from './project-new-project-btn.vue';
    import project_filter_by_category from './project-filter-by-category.vue';
    import project_search_by_client from './project-search-by-client.vue';
    import project_search_all from './project-search-all.vue';
    import project_header_menu from './project-header-menu.vue';
    import project_view from './project-view.vue';
    import project_summary from './project-summary.vue';
    import project_pagination from './project-pagination.vue';
    import project_create_form from './project-create-form.vue';
    import after_project from './../do-action.vue';
    import project_new_user_form from './project-new-user-form.vue';
    import store from './store';
    
    
    export default  {
        store,
        
        beforeRouteEnter (to, from, next) {
            next(vm => {
                vm.getProjects(vm);
            });
        },

        computed: {
            is_popup_active () {
                return this.$store.state.is_popup_active;
            }
        },
        
        components: {
            'project-new-project-btn': project_new_project_btn,
            'project-filter-by-category': project_filter_by_category,
            'project-search-by-client': project_search_by_client,
            'project-search-all': project_search_all,
            'project-header-menu': project_header_menu,
            'project-view': project_view,
            'project-summary': project_summary,
            'project-pagination': project_pagination,
            'project-create-form': project_create_form,
            'project-new-user-form': project_new_user_form,
            'do-action': after_project
        },

        methods: {
            getProjects (self) {

                self.httpRequest({
                    url: self.base_url + '/cpm/v2/projects/',
                    
                    success: function(res) {
                        self.$store.commit('setProjects', {'projects': res.data});
                    }
                });
            }
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

