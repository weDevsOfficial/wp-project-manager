<template>
    <div class="wrap cpm cpm-front-end">
        
        <project-header></project-header>
        <div class="cpm-projects cpm-row cpm-project-grid cpm-no-padding cpm-no-margin">
            <project-summary></project-summary>
            <pm-pagination 
                :total_pages="total_pages" 
                :current_page_number="current_page_number" 
                component_name='all_project_pagination'>
                
            </pm-pagination> 
        </div>

        <div id="cpm-project-dialog" v-pm-popup-box style="z-index:999;" title="Start a new project">
            <project-create-form :project="{}"></project-create-form>
            <!-- <do-action :hook="'cpm-after-project-list'"></do-action> -->
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
                vm.getProjects(vm);
                vm.getRoles();
                vm.getProjectCategories();
            });
        },  

        data () {
            return {
                current_page_number: 1
            }
        },

        watch: {
            '$route' (route) {
                this.current_page_number = route.params.current_page_number;
                this.getProjects(this);
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

