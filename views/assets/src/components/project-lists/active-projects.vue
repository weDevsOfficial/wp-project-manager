<template>
    <div>
        <project-list-header></project-list-header>
        <div class="active-projects">
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
            
    <!--         <div v-if="loading" class="pm-data-load-before" >
                <div class="loadmoreanimation">
                    <div class="load-spinner">
                        <div class="rect1"></div>
                        <div class="rect2"></div>
                        <div class="rect3"></div>
                        <div class="rect4"></div>
                        <div class="rect5"></div>
                    </div>
                </div>
            </div> -->
            <div v-else>
                <div class="pm-projects pm-row pm-no-padding pm-no-margin" :class="[projects_view_class()]">
                    <project-summary></project-summary>
                    <pm-pagination 
                        :total_pages="total_pages" 
                        :current_page_number="current_page_number" 
                        component_name='project_pagination'>
                        
                    </pm-pagination> 
                </div>
            </div>       
        </div>
    </div>
</template>

<script>
    import project_summary from './project-summary.vue';
    import pagination from './../common/pagination.vue';
    import after_project from './../common/do-action.vue';
    import project_loading from './project-loading.vue';
    import Header from './header.vue';
    import Mixins from './mixin';

    export default  {

        data () {
            return {
                current_page_number: 1,
                loading: true,
            }
        },

        mixins: [Mixins],

        created () {
            this.projectQuery();
            this.getRoles();
            this.getProjectCategories();
        },

        watch: {
            '$route' (route) {
                this.current_page_number = route.params.current_page_number;
                this.projectQuery();
            }
        },

        computed: {
            total_pages () {
                return this.$root.$store.state.pagination.total_pages;
            }
        },
        
        components: {
            'project-summary': project_summary,
            'pm-pagination': pagination,
            'do-action': after_project,
            'project-loading': project_loading,
            'project-list-header': Header
        },

        methods: {
            projectQuery () {
                var args = {
                    conditions: {
                       status: 'incomplete',
                    }
                }

                this.getProjects(args);
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

