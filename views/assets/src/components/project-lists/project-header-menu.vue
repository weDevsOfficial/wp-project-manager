<template>
    <ul v-if="isFetchProjects" class="list-inline  pm-col-8 pm-project-group-ul">
        
        <li class= "pm-sm-col-4">
            <router-link :to="{name: 'project_lists'}" class="pm-active-project">
                {{ __( 'Active', 'wedevs-project-manager') }}
                <span class="count">{{ activated }}</span>
            </router-link>
        </li>

        <li class="pm-sm-col-4">
            <router-link :to="{name: 'completed_projects'}" class="pm-archive-project">
                {{ __( 'Completed', 'wedevs-project-manager') }} 
                <span class="count">{{ completed }}</span> 
            </router-link> 
        </li>

        <li class=" pm-sm-col-4">
            <router-link :to="{name: 'all_projects'}" class="pm-all-project">
                {{ __( 'All', 'wedevs-project-manager') }}
                <span class="count">{{ allof }}</span>
            </router-link>
        </li>
        <li class="favourite-menu pm-sm-col-4">
            <router-link :to="{name: 'favourite_projects'}" >
                <span class="dashicons dashicons-star-filled"></span>
                {{ __( 'Favourite', 'wedevs-project-manager') }}
                <span class="count">{{ favourite }}</span>
            </router-link>
        </li>
        <div class="clearfix"></div>
    </ul>
</template>

<script>
    import Mixins from './mixin';

    export default {
        data () {
            return {
                
            }
        },
        mixins: [Mixins],
        computed: {
            activated () {
                return this.$store.state.projects_meta.total_incomplete;
            },
            completed () {
                return this.$store.state.projects_meta.total_complete;
            },
            allof () {
                var incomplete = this.$store.state.projects_meta.total_incomplete; 
                var complete   = this.$store.state.projects_meta.total_complete;

                return incomplete + complete;
            },
            favourite () {
                return this.$store.state.projects_meta.total_favourite;
            }
        }
    }
</script>

<style>
    .favourite-menu a{
        padding-left: 15px !important;
    }
</style>