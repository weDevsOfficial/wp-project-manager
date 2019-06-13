<template>
    <div>
        <div v-if="!isloaded" class="pm-data-load-before" >
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

        <div v-if="isloaded" id="pm-mytask-page-content">
            <div class="pm-mytask-overview-page">
                <div class="pm-col-3 pm-sm-col-12 pm-mytask-chart-overview">
                    <h3 class="pm-box-title">{{ __('At a glance', 'pm-pro' ) }}</h3>
                    <canvas v-pm-mytask-pichart id="cart-at-glance" width="404" height="202" style="width: 404px; height: 202px;"></canvas>
                    <ul>
                        <li>
                            <span class="color-plate" style="background-color: #61BD4F"></span>
                            {{ __('Current', 'pm-pro' ) }}
                            <span class="pm-right task-count">
                                {{total_current_tasks}} {{ __('Tasks', 'pm-pro' ) }}
                            </span>
                            <span class="clearfix"></span>
                        </li>
                        <li>
                            <span class="color-plate" style="background-color: #EB5A46"></span>
                                {{ __('Outstanding', 'pm-pro' ) }}
                                <span class="pm-right task-count">
                                    {{total_outstanding_tasks}} {{ __('Tasks', 'pm-pro' ) }}
                                </span>
                        <span class="clearfix"></span>
                        </li>
                        <li>
                            <span class="color-plate" style="background-color: #0090D9"></span>
                                {{__('Completed', 'pm-pro' )}}
                                <span class="pm-right task-count">
                                    {{total_completed_tasks}} {{ __('Tasks', 'pm-pro' ) }}
                                </span>
                            <span class="clearfix"></span>
                        </li>
                    </ul>
                </div>
                <div class="pm-mytask-chart-statistics pm-col-9 pm-sm-col-12 ">
                    <h3 class="pm-box-title">{{ __('Activities', 'pm-pro' ) }}</h3>

                    <div class="">
                        <div class="pm-right">

                        </div>
                    <div class="clearfix"></div>
                    </div>
                    <div id="mytask-line-graph">
                        <canvas v-pm-mytask-chart id="chart-details" height="430" width="1225"></canvas>
                    </div>

                </div>
                <div class="clearfix"></div>
            </div>
            <my-task-calender></my-task-calender>
        </div>

    </div>

</template>

<script>
    import directives from './directives';
    import Mixins from './mixin';
    import myTaskCalender from './calendar.vue';

    export default{
        data () {
            return {

            }
        },
        watch:{
            '$route' (route) {
                if (route.params.user_id !== this.user_id) {
                    this.$store.commit('myTask/setLoadFalse');
                    this.getUserMeta();
                    this.getSelfUser();
                    this.$emit('refetch-events');
                    this.user_id = route.params.user_id;
                } else {
                    pm.NProgress.done();
                }
            }
        },
        created () {
            if (!this.canShowMyTask()) {
                this.$router.push({name:'project_lists'});
            }

            if(!this.isloaded) {
                this.getSelfUser();
            }
        },
        mixins: [Mixins],
        components: {
            myTaskCalender
        },
        computed: {

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
            
            isloaded () {
                return this.$store.state.myTask.isFetchMyTaskOverview;
            }
        },
        methods: {
            getSelfUser () {
                var user_id = typeof this.$route.params.user_id !== 'undefined' ? this.$route.params.user_id : this.current_user.ID;
                var args = {
                    user_id: user_id,
                    conditions: {
                        with: 'graph'
                    },
                    callback (res){
                        this.$store.commit('myTask/setGraph', res.data.graph.data);
                        this.$store.state.myTask.isFetchMyTaskOverview = true;
                        pm.NProgress.inc();
                    }
                }
                this.getProUser(args);
            }
        }
    }

</script>
