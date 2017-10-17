<template>
    <ul class="list-inline  cpm-col-8 cpm-project-group-ul">
        
        <li :class="active+ ' cpm-sm-col-4'">
            <router-link :to="{name: 'project_lists'}">
                {{text.active}}
                <span class="count">{{ activated }}</span>
            </router-link>
        </li>

        <li :class="complete+' cpm-sm-col-4'">
            <router-link :to="{name: 'completed_projects'}">
                {{text.completed}} 
                <span class="count">{{ completed }}</span> 
            </router-link> 
        </li>

        <li :class="all + ' cpm-sm-col-4'">
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
                all: '',
                complete: '',
                active: ''
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
        },
        created () {
            var route_name = this.$route.name;
            
            if (route_name === 'all_projects') {
                this.all = 'active';
            } else if (route_name === 'completed_projects') {
                this.complete = 'active';
            } else {
                this.active = 'active';
            }
        }
    }
</script>