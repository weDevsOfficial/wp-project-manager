<template>
    <ul class="list-inline  pm-col-8 pm-project-group-ul">
        
        <li class= "pm-sm-col-4">
            <router-link :to="{name: 'project_lists'}">
                {{text.active}}
                <span class="count">{{ activated }}</span>
            </router-link>
        </li>

        <li class="pm-sm-col-4">
            <router-link :to="{name: 'completed_projects'}">
                {{text.completed}} 
                <span class="count">{{ completed }}</span> 
            </router-link> 
        </li>

        <li class=" pm-sm-col-4">
            <router-link :to="{name: 'all_projects'}">
                {{text.all}}
                <span class="count">{{ allof }}</span>
            </router-link>
        </li>
        <div class="clearfix"></div>
    </ul>
</template>

<script>
    export default {
        data () {
            return {
                
            }
        },
        computed: {
            activated () {
                return this.$root.$store.state.projects_meta.total_incomplete;
            },
            completed () {
                return this.$root.$store.state.projects_meta.total_complete;
            },
            allof () {
                var incomplete = this.$root.$store.state.projects_meta.total_incomplete; 
                var complete   = this.$root.$store.state.projects_meta.total_complete;

                return incomplete + complete;
            }
        }
    }
</script>