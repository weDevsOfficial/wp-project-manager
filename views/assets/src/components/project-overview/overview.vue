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
            <search-user></search-user>
            <div class="pm-col-2 pm-sm-col-12 pm-right-part pm-last-col">
                <h3 class="pm-border-bottom user-title"> {{ __( 'Users', 'wedevs-project-manager') }} </h3> <h3 class="user-btn"><a class="add-user"><i class="icon-pm-plus"></i></a></h3>
                <ul class="user_list">
                    <li v-for="user in users" :key="user.id">
                        <div class="list-left">
                            <img alt="admin" :src="user.avatar_url" class="avatar avatar-34 photo" height="34" width="34">
                            <a  :href="myTaskRedirect(user.id)">
                                {{ cutString(user.display_name, 3, true) }}
                            </a>
                            <span v-for="role in user.roles.data" :key="role.id">{{ role.title }}</span>
                        </div>
                        <div class="list-right">
                            <a class="delete-user" @click="removeUser(user.id)"> <i class="icon-pm-delete"></i></a>
                        </div>
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
    .user-title{ width: 73%; }
    .user-btn{ width: 23%; border-bottom: solid 1px #eee;}
    .user-btn, .user-title{ display: inline-block; float: left }
    .add-user { cursor: pointer; }
    .user_list{
        li{
            a.delete-user{
                display: none;
                i.icon-pm-delete:before{
                    color: #c7cfd1 !important;
                }
            }

            &:hover{
                a.delete-user{
                    display: inline-block;
                    cursor: pointer;
                    font-size: 14px;
                    padding: 0;
                    margin: 10px;
                }
            }

            .list-left, .list-right{
                /*border: 1px solid red; */
                float: left;
            }
            .list-left{ width: 82%; }
            .list-right{ width: 12%;}
        }
    }
</style>

<script>
    import header from './../common/header.vue';
    import directive from './directive';
    import Mixins from './mixin';
    import searchUser from './searchUser.vue';

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
            'pm-header': header,
            'search-user': searchUser
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
            },
            cutString(string, length, dot){
               var output = "";
                output = string.substring(0, parseInt(length));
                if(dot && string.length > length){
                    output += "...";
                }
               return output;
            },
            removeUser(user){
                console.log(user);
            }
        }
    }

</script>



