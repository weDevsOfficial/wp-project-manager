<template>
    <div class="wrap pm pm-front-end">
        
        <project-header></project-header>

        <div v-if="loading" class="pm-data-load-before" >
            <div class="loadmoreanimation">
                <div class="load-spinner">
                    <div class="rect1"></div>
                    <div class="rect2"></div>
                    <div class="rect3"></div>
                    <div class="rect4"></div>
                    <div class="rect5"></div>
                </div>
            </div>
        </div>

        <div v-if="!loading" class="pm-projects pm-row pm-no-padding pm-no-margin" v-bind:class="[projects_view_class()]">
            <project-summary></project-summary>
            <pm-pagination 
                :total_pages="total_pages" 
                :current_page_number="current_page_number" 
                component_name='completed_project_pagination'>
                
            </pm-pagination> 
        </div>

        <div id="pm-project-dialog" v-pm-popup-box style="z-index:999;" :title="text.start_a_new_project">
            <project-create-form :project="{}"></project-create-form>
            <!-- <do-action :hook="'pm-after-project-list'"></do-action> -->
        </div>
        
    </div>
</template>

<script>
    import directive from './../../directive';
    

    import project_summary from './project-summary.vue';
    import pagination from './../pagination.vue';
    import project_create_form from './project-create-form.vue';
    import store from './store';
    import after_project from './../do-action.vue';
    import header from './header.vue';

    
    
    export default  {
        store,
        
        beforeRouteEnter (to, from, next) {
            next(vm => {
                vm.projectQuery();
                vm.getRoles();
                vm.getProjectCategories();
            });
        },  

        data () {
            return {
                current_page_number: 1,
                loading: true,
            }
        },

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
            },
        },
        
        components: {
            'project-header': header,
            'project-summary': project_summary,
            'pm-pagination': pagination,
            'project-create-form': project_create_form,
            'do-action': after_project
        },

        methods: {
            projectQuery () {
                
                var add_query = {
                    status: 'complete'
                }
                var query_params = this.getQueryParams(add_query);
                this.getProjects(query_params);
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

