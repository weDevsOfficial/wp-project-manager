<template>
    <div class="pm-wrap pm-front-end pm-overview">
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

        <div v-if="fetchOverview" class="project-overview pm-project-overview-container">
            <div class="pm-col-10 pm-sm-col-12 user-lists">
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
                <div class="users-header">
                    <h3> {{ __( 'Users', 'wedevs-project-manager') }} </h3>
                    <span v-if="is_manager() || has_manage_capability()">
                        <a @click="addUser()" class="add-user">
                            <i class="fa fa-plus"></i> Add
                        </a>
                    </span>
                </div>
                <search-user v-if="show_modal" v-pm-click-outside="hidePop" @close="hidePop" ></search-user>
                <ul class="user_list">
                    <li v-for="user in selectedUsers" :key="user.id">
                        <div class="list-left">
                            <img :alt="ucfirst(user.display_name)" :src="user.avatar_url" class="avatar avatar-34 photo" height="34" width="34">
                            <a :title="ucfirst(user.display_name)" :href="myTaskRedirect(user.id)">
                                {{ ucfirst(cutString(user.display_name, 8, true)) }}
                            </a>
                            <span v-for="role in user.roles.data" :key="role.id">{{ __( role.title, 'wedevs-project-manager') }}</span>
                        </div>
                        <div class="list-right"   v-if="(is_manager() || has_manage_capability()) && !is_current_user(user.id)">
                            <a href="#" v-if="canUserEdit(user.id)" class="pm-delte-user pm-delete-user" @click.prevent="deleteUser(user)"> <i class="icon-pm-delete"></i></a>

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
        .user-lists {
            margin-right: 0;
        }
        .pm-delte-user {
            overflow: visible !important;
        }
    }
    .pm .pm-col-10 {
        margin-bottom: 0;
    }

    .users-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #eee;
        padding: 10px;
        h3 {
            padding: 0 !important;
            margin: 0 !important;
        }
        .user-title {
            margin-bottom: 0;
        }
    }

    #pm-add-user-wrap {
        position: relative;
        .add-user-pop {
            top: 100% !important;
            right: 0 !important;
            padding: 10px  0 0 !important;
            &:after {
                right: 10px !important;;
            }
        }
    }

    .pm .project-overview .pm-right-part h3 {
        margin-bottom: 10px;
        padding: 0;
    }

    .pm .project-overview .pm-right-part h3 {
        /*margin: 5px !important;*/
        /*padding: 0 !important;*/
    }

    .user-btn { display: inline-block; float: left }
    .add-user { cursor: pointer; }
    .user_list{
        margin-top: 5px !important;
        li{
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin: 0 !important;
            padding: 5px 10px;
            &:not(:last-child){
                margin-bottom: 5px !important;
                border-bottom: 1px solid #eee;
            }
            a.pm-delete-user{
                display: none !important;
                overflow: visible !important;
                display: inline-block;
                height: auto;
                i.icon-pm-delete:before{
                    /*color: #c7cfd1 !important;*/
                }
            }

            &:hover{
                a.pm-delete-user{
                    display: block !important;
                    cursor: pointer;
                    font-size: 14px;
                    padding: 0;
                    margin: 10px;
                }
            }
            .list-left {
                flex-basis: 90%;
            }
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
        data(){
            return {
                show_modal: false
            }
        },
        mixins:[Mixins],
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
            },


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
                        this.setOverViews( res.data );
                        this.$root.$store.state.projectOverviewLoaded = true;
                        pm.NProgress.done();
                    }
                }

                this.getProject(args);
            },
            addUser(){
                this.show_modal = true;
            },
            hidePop(){
                this.show_modal = false;
                this.removeSelected();
            }

        },
        beforeDestroy () {
            this.$root.$store.state.projectOverviewLoaded = false;
        }


    }

</script>
