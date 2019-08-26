<template>

    <div class="pm-top-bar pm-no-padding pm-project-header pm-project-head">
        <div class="pm-row pm-no-padding pm-border-bottom">
            <div class="pm-project-detail ">
                <img :alt="display_name" :src="user_avatar_url" :srcset="user_avatar_url" class="avatar avatar-64 photo" width="64" height="64">
                <div class="pm-my-task-header">
                    <h3>{{  __('My Tasks', 'wedevs-project-manager' ) }}</h3>
                    <p>{{display_name}}</p>
                    <p>{{email}}</p>
                </div>

            </div>
        </div>

        <div class="pm-row pm-project-group">
            <ul class="pm-col-9 pm-my-task-menu">

                <li class="">
                    <router-link :to="routeLink('tasks')" class="pm-my-taskoverview">
                        {{ __('Overview', 'wedevs-project-manager' )}}

                    </router-link>

                </li>
                <li class="">
                    <router-link :to="routeLink('activities')" class="pm-my-taskactivity">
                        {{ __('Activities', 'wedevs-project-manager' )}}

                    </router-link>

                </li>

                <li class="">
                     <router-link :to="routeLink('current')" class="pm-my-currenttask">
                        {{ __('Current Task', 'wedevs-project-manager' ) }} <span class="count">{{ total_current_tasks }}</span>

                    </router-link>

                </li>

                <li class="">
                    <router-link :to="routeLink('outstanding')" class="pm-my-outstandigntask">
                       {{ __('Outstanding Task', 'wedevs-project-manager' ) }}<span class="count">{{ total_outstanding_tasks }}</span>

                    </router-link>

                </li>
                <li>
                    <router-link :to="routeLink('complete')" class="pm-my-completetask">
                       {{ __('Completed Task', 'wedevs-project-manager' ) }} <span class="count">{{ total_completed_tasks }}</span>

                    </router-link>
                </li>
            </ul>
            <div class="pm-col-3 pm-sm-col-12 pm-user-select" v-if="has_manage_capability()">
                <div class="user-switch">
                    <multiselect
                        id="mytaskSelectUser"
                        :tabindex="2"
                        v-model="selected_user"
                        :options="users"
                        :multiple="false"
                        :show-labels="false"
                        select-label=""
                        :searchable="true"
                        :allow-empty="true"
                        :placeholder="select_user_text"
                        label="display_name"
                        track-by="id">
                        <template slot="option" slot-scope="props">
                            <div class="option__desc">
                                <img class="option__image" :src="props.option.avatar_url">
                                <span class="option__title">{{ props.option.display_name }}</span>
                            </div>
                        </template>
                    </multiselect>
                </div>
            </div>
        <div class="clearfix"></div>
        </div>
    </div>
</template>

<script>

    export default {
        data () {
            return {
                selected_user: null,
                select_user_text: __('Select an User', 'wedevs-project-manager' ),
            }

        },
        created () {
           
        },
        watch: {
            selected_user (newValue) {
                if(typeof newValue == 'undefined') {
                    return;
                }
                this.changeUser(newValue.id);
            }
        },
        computed: {
            user_avatar_url(){
                return this.$store.state.myTask.user.avatar_url;
            },

            display_name(){
                return this.$store.state.myTask.user.display_name;
            },
            email (){
                 return this.$store.state.myTask.user.email;
            },

            total_current_tasks () {
                if( typeof this.$store.state.myTask.user.meta !== 'undefined' )
                    return this.$store.state.myTask.user.meta.data.total_current_tasks;
            },
            total_outstanding_tasks (){
                if( typeof this.$store.state.myTask.user.meta !== 'undefined' )
                    return this.$store.state.myTask.user.meta.data.total_outstanding_tasks;
            },

            total_completed_tasks () {
                if( typeof this.$store.state.myTask.user.meta !== 'undefined' )
                    return this.$store.state.myTask.user.meta.data.total_complete_tasks;
            },

            users () {
                if( 
                    typeof this.$store.state.myTask.users != 'undefined' 
                        &&
                    this.$store.state.myTask.users.length
                 ) {
                    this.setUser();
                    return this.$store.state.myTask.users;
                }

                return [];
            }
        },
        components: {
            multiselect: pm.Multiselect.Multiselect,
        },
        methods: {
            setUser () {
                var users = this.$store.state.myTask.users;
                
                if(typeof this.$route.query.login_user != 'undefined') {
                    let index = this.getIndex(users, parseInt(this.$route.query.login_user), 'id');
                    this.selected_user = users[index];
                } else {
                    let index = this.getIndex(users, PM_Vars.current_user.ID, 'id');
                    this.selected_user = users[index];
                }
            },

            changeUser(usetId) {

                var query_params = Object.assign({}, this.$route.query, { login_user: usetId });

                this.$router.push({query: query_params});
            },

            routeLink( name ) {

                var route = { name : 'mytask-'+ name };

                if( typeof this.$route.params.user_id !== 'undefined' ){
                    route.params = { user_id : this.$route.params.user_id }
                }

                return route;
            }
        }
    }
</script>
<style lang="css">
    .pm .pm-project-header .user-switch {
        margin: 5px 0px;
    }
    .pm .pm-project-header ul li.multiselect__element {
        float: unset !important;
    }
    .pm .pm-project-header .multiselect__tags {
        min-height: 28px;
        padding: 4px 40px 0 4px;
        border-radius: 0px;
        border: 1px solid #e8e8e8;
    }
    .pm .pm-project-header .pm-my-task-menu {
        float: none;
    }
    .pm .pm-project-header  .pm-user-select {
        float: right;
    }
    .pm .pm-project-header .pm-user-select .option__desc {
        display: flex;
        align-items: center;
    }
    .pm .pm-project-header .pm-user-select img.option__image {
        height: 32px;
        width: 32px;
        border-radius: 50%;
        margin-right: 5px;
        border: 0.5px solid #c5c5c5;
    }
    .pm .pm-project-header .pm-user-select span.option__title {
        font-weight: 600;
    }
</style>
