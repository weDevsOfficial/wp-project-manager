<template>
    <ul class="list-inline  cpm-col-8 cpm-project-group-ul">
        
        <li :class="active+ ' cpm-sm-col-4'">
            <router-link :to="{name: 'project_lists'}">
                Active 
                <span class="count">{{ active }}</span>
            </router-link>
        </li>

        <li :class="completed+' cpm-sm-col-4'">
            <router-link :to="{name: 'completed_projects'}">
                Completed 
                <span class="count">0</span> 
            </router-link> 
        </li>

        <li :class="all + ' cpm-sm-col-4'">
            <router-link :to="{name: 'all_projects'}">
                All
                <span class="count">10</span>
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
                active: '',
                completed: ''
            }
        },
        // computed: {
        //     active () {
        //         return this.$store.state.projects_meta.total_incomplete;
        //     }
        // },
        created () {
            var route_name = this.$route.name;
            
            if (route_name === 'all_projects') {
                this.all = 'active';
            } else if (route_name === 'completed_projects') {
                this.completed = 'active';
            } else {
                this.active = 'active';
            }
        }
    }
</script>