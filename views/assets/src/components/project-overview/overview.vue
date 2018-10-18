<template>
    <div class="pm-wrap pm-front-end">
        <pm-header></pm-header>
        <pm-heder-menu></pm-heder-menu>

        <div v-if="!fetchOverview" class="pm-data-load-before" >
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

        <div v-if="fetchOverview" class="project-overview">
            <div class="pm-col-10 pm-sm-col-12">
                <div class="overview-menu">
                    <ul>
                        <li class="message">
                            <router-link :to="{
                                name: 'discussions',
                                params: {
                                    'project_id': project_id
                                }
                            }"> 
                                <div class="icon"></div> 
                                <div class="count">
                                    <span>{{ meta.total_discussion_boards }}</span> 
                                    {{ __( 'Discussions', 'wedevs-project-manager') }}
                                </div> 
                            </router-link>
                        </li>

                        <li class="todo">
                            <router-link :to="{
                                name: 'task_lists',
                                params: {
                                    'project_id': project_id
                                }
                            }"> 
                                <div class="icon"></div> 
                                <div class="count">
                                    <span>{{ meta.total_task_lists }}</span> 
                                    {{ __( 'Task Lists', 'wedevs-project-manager') }}
                                </div> 
                            </router-link>
                        </li>

                        <li class="todos">
                            <a>

                                <div class="icon"></div> 
                                <div class="count">
                                    <span>{{ meta.total_tasks }}</span> 
                                    {{ __( 'Tasks', 'wedevs-project-manager') }}
                                </div> 
                            </a>
                            
                        </li>

                        <li class="comments">
                            <a>
                                <div class="icon"></div> 
                                <div class="count">
                                    <span>{{ meta.total_comments }}</span>  
                                    {{ __( 'Comments', 'wedevs-project-manager') }}
                                </div> 
                             </a>
                        </li>
                        <li class="files">
                            <router-link :to="{
                                name: 'pm_files',
                                params: {
                                    'project_id': project_id
                                }
                            }"> 
                                <div class="icon"></div> 
                                    <div class="count">
                                        <span>{{ meta.total_files }}</span>  
                                        {{ __( 'Files', 'wedevs-project-manager') }}
                                </div> 
                            </router-link>
                        </li>

                        <li class="milestone">
                            <router-link :to="{
                                name: 'milestones',
                                params: {
                                    'project_id': project_id
                                }
                            }"> 
                                <div class="icon"></div> 
                                <div class="count">
                                    <span>{{ meta.total_milestones }}</span> 
                                        {{  __( 'Milestones', 'wedevs-project-manager') }}
                                </div> 
                            </router-link>
                        </li>   
                        <div class="clearfix"></div>            
                     </ul>
                </div>

                <div id="pm-chart" class="pm-chart">

                    <h3>{{ __( 'Last 30 days', 'wedevs-project-manager') }}</h3>

                    
                    <canvas v-pm-overview-chart width="1638" height="656" style="width: 819px; height: 328px;"></canvas>
                
                </div>
            </div>

            <div class="pm-col-2 pm-sm-col-12 pm-right-part pm-last-col">
                <h3 class="pm-border-bottom"> {{ __( 'Users', 'wedevs-project-manager') }} </h3>
                <ul class="user_list">
                    <li v-for="user in users" :key="user.id">
                        <img alt="admin" :src="user.avatar_url" class="avatar avatar-34 photo" height="34" width="34"> 
                        <a  :href="myTaskRedirect(user.id)">
                            {{ user.display_name }}
                        </a>
                        <span v-for="role in user.roles.data" :key="role.id">{{ role.title }}</span>
                    </li>
                </ul>
            </div>

            <div class="clearfix"></div>
        </div>
    </div>

</template>

<style lang="less">
    .project-overview {
        margin-top: 10px;
    }
</style>

<script>
    import header from './../common/header.vue';
    import directive from './directive';
    import Mixins from './mixin';

    export default {
        beforeRouteEnter (to, from, next) {
            next(vm => {
                vm.getOverViews();
            });
        },
        computed: {
            ...pm.Vuex.mapState('projectOverview', 
                {
                    'meta': state => state.meta,
                    'users': state => state.assignees,
                    'graph': state => state.graph
                }
            ),
            fetchOverview () {
                return this.$root.$store.state.projectOverviewLoaded;
            }

            // meta () {
            //     return this.$store.state.meta;
            // },

            // users () {
            //     return this.$store.state.assignees;
            // },

            // graph () {
            //     return this.$store.state.graph;
            // }
        },
        components: {
            'pm-header': header
        },
        watch: {
            '$route' (to, from) {
                this.getOverViews();
                this.$forceUpdate();
            }
        },

        methods : {
            ...pm.Vuex.mapMutations('projectOverview', 
                [
                    'setOverViews'
                ]
            ),
            getOverViews () {
                var args = {
                    conditions :{
                        with : 'overview_graph'
                    },
                    project_id: this.$route.params.project_id,
                    callback  (res){
                        this.$root.$store.state.projectOverviewLoaded = true;
                        this.setOverViews( res.data );
                        pm.NProgress.done();
                    }
                }

                this.getProject(args);
            }
        }
    }

</script>



