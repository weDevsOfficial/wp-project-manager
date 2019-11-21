<template>
    <div class="pm-overview-wrap">
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
                <div class="field date-range-picker" v-if="parseInt(PM_Vars.is_pro)==1">
                    <pm-date-range-picker 
                        :startDate="search.start_at"
                        :endDate="search.due_date"
                        :options="calendarOptions"
                        @apply="calendarOnChange"
                        @cancel="calendarCancel">
                        
                    </pm-date-range-picker>
                </div>

                <div :style="loadingProUser ? 'position: relative; background: #fff' : ''">
                    <div 
                        v-if="loadingProUser"
                        style="display: block; left: 42%; position: absolute;"
                        class="loadmoreanimation">
                        <div class="load-spinner">
                            <div class="rect1"></div>
                            <div class="rect2"></div>
                            <div class="rect3"></div>
                            <div class="rect4"></div>
                            <div class="rect5"></div>
                        </div>
                    </div>
                    <div :class="loadingProUser ? 'graph-meta-wrap loading-pro-user' : 'graph-meta-wrap'">
                        <div class="pm-mytask-chart-overview">
                            <h3 class="pm-box-title">{{ __('At a glance', 'wedevs-project-manager' ) }}</h3>
                            <canvas v-pm-mytask-pichart id="cart-at-glance" width="404" height="202" style="width: 404px; height: 202px;"></canvas>
                            <ul>
                                <li>
                                    <span class="color-plate" style="background-color: #61BD4F"></span>
                                    {{ __('Current', 'wedevs-project-manager' ) }}
                                    <span class="pm-right task-count">
                                        {{total_current_tasks}} {{ __('Tasks', 'wedevs-project-manager' ) }}
                                    </span>
                                    <span class="clearfix"></span>
                                </li>
                                <li>
                                    <span class="color-plate" style="background-color: #EB5A46"></span>
                                        {{ __('Outstanding', 'wedevs-project-manager' ) }}
                                        <span class="pm-right task-count">
                                            {{total_outstanding_tasks}} {{ __('Tasks', 'wedevs-project-manager' ) }}
                                        </span>
                                <span class="clearfix"></span>
                                </li>
                                <li>
                                    <span class="color-plate" style="background-color: #0090D9"></span>
                                        {{__('Completed', 'wedevs-project-manager' )}}
                                        <span class="pm-right task-count">
                                            {{total_completed_tasks}} {{ __('Tasks', 'wedevs-project-manager' ) }}
                                        </span>
                                    <span class="clearfix"></span>
                                </li>
                            </ul>
                        </div>
                        <div class="pm-mytask-chart-statistics">
                            <h3 class="pm-box-title">{{ __('Activities', 'wedevs-project-manager' ) }}</h3>

                            <div class="">
                                <div class="pm-right">

                                </div>
                            <div class="clearfix"></div>
                            </div>
                            <div id="mytask-line-graph">
                                <canvas v-pm-mytask-chart id="chart-details" height="430" width="1225"></canvas>
                            </div>

                        </div>
                    </div>
                    
                </div>
            </div>
            <my-task-calender></my-task-calender>
        </div>

    </div>

</template>

<style lang="less">
    .pm-overview-wrap {
        .loading-pro-user {
            background-color: #fff;
            opacity: 0.1;
        }
        .pm-mytask-overview-page {
            margin-bottom: 20px;
            .graph-meta-wrap {
                display: flex;
                .pm-mytask-chart-overview {
                    width: 30%;
                    margin-right: 21px;
                }
                .pm-mytask-chart-statistics {
                    width: 68%;
                }
            }
            .date-range-picker {
                width: 230px;
                margin-bottom: 20px;
                input {
                    width: 100%;
                }
            }
        }
    }

    @media screen and (max-width: 768px) {
        .pm-overview-wrap {
            .pm-mytask-overview-page {
                margin-bottom: 20px;
                .graph-meta-wrap {
                    display: block;
                    .pm-mytask-chart-overview {
                        width: 100%;
                        margin-right: 0;
                        margin-bottom: 20px;
                    }
                    .pm-mytask-chart-statistics {
                        width: 100%;
                    }
                }
                .date-range-picker {
                    width: 230px;
                    margin-bottom: 20px;
                    input {
                        width: 100%;
                    }
                }
            }
        }
    }

</style>

<script>
    import directives from './directives';
    import Mixins from './mixin';
    import myTaskCalender from './calendar.vue';

    export default{
        data () {
            return {
                loadingProUser: false,
                search: {
                    start_at: '',
                    due_date: ''
                },
                calendarOptions: {
                    //'singleDatePicker': this.hasTaskStartField() ? false : true,
                    ranges: {
                        'Today': [moment(), moment()],
                        'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                        'This Month': [moment().startOf('month'), moment().endOf('month')],
                        'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
                    },
                    locale: {
                      format: 'YYYY-MM-DD',
                      cancelLabel: __( 'Clear', 'wedevs-project-manager' ),
                    },
                    "showCustomRangeLabel": false,
                    "alwaysShowCalendars": true,
                    "showDropdowns": true,
                    'autoUpdateInput': true,
                    "autoApply": true,
                    'placeholder': this.hasTaskStartField() ? __('Start at - Due date', 'wedevs-project-manager') : __('Due date', 'wedevs-project-manager')
                }
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
            if(!this.canShowMyTask()) {
                this.$router.push({name:'project_lists'});
            }

            if(!this.isloaded) {
                this.getSelfUser();
            }

            this.setOverviewDate();
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
            setOverviewDate () {
                var start = this.$route.query.start_at ? this.$route.query.start_at : pm.Moment(new Date()).format('YYYY-MM-01');
                var end = this.$route.query.due_date ? this.$route.query.due_date : pm.Moment(new Date()).format('YYYY-MM-DD');

                this.search.start_at = start;
                this.search.due_date = end;
            },
            calendarOnChange (start, end, className) {
                
                this.search.due_date = end.format('YYYY-MM-DD');
                this.search.start_at = start.format('YYYY-MM-DD');
                
                jQuery('.'+className).val(this.search.start_at +' - '+this.search.due_date); 

                this.$router.push(
                    {
                        query: {
                            start_at: this.search.start_at,
                            due_date: this.search.due_date,
                            login_user: this.setLoginUser(),
                        }
                    }
                );

                this.getUserMeta();
                this.getSelfUser();
            },

            setLoginUser () {
                if(typeof this.$route.params.user_id == 'undefined') {
                    return PM_Vars.current_user.ID;
                }

                if( parseInt(this.$route.params.user_id) <= 0) {
                    return PM_Vars.current_user.ID;
                }

                return this.$route.params.user_id;
            },
            calendarCancel (className) {
                this.search.start_at = '';
                this.search.due_date = '';

                jQuery('.'+className).val('');
            },
            getSelfUser () {
                var self = this;
                var user_id = typeof this.$route.params.user_id !== 'undefined' ? this.$route.params.user_id : this.current_user.ID;
                var args = {
                    user_id: user_id,
                    conditions: {
                        with: 'graph',
                        start_at: this.$route.query.start_at ? this.$route.query.start_at : pm.Moment(new Date()).format('YYYY-MM-01'),
                        due_date: this.$route.query.due_date ? this.$route.query.due_date : pm.Moment(new Date()).format('YYYY-MM-DD')
                    },
                    callback (res){
                        this.$store.commit('myTask/setGraph', res.data.graph.data);
                        this.$store.state.myTask.isFetchMyTaskOverview = true;
                        self.loadingProUser = false;
                        console.log(self.loadingProUser);
                        pm.NProgress.inc();
                    }
                }
                this.loadingProUser = true;
                this.getProUser(args);
            }
        }
    }

</script>
