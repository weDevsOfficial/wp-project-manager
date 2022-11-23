<template>
    <div class="pm-pro-my-task-reports">
<!--        <div class="pm-data-load-before" >-->
<!--            <div class="loadmoreanimation">-->
<!--                <div class="load-spinner">-->
<!--                    <div class="rect1"></div>-->
<!--                    <div class="rect2"></div>-->
<!--                    <div class="rect3"></div>-->
<!--                    <div class="rect4"></div>-->
<!--                    <div class="rect5"></div>-->
<!--                </div>-->
<!--            </div>-->
<!--        </div>-->

        <div class="date-range">
            <label>{{ 'Date', 'wedevs-project-manager' }}</label>
            <pm-date-range-picker
                @apply="onChangeDate"
                @cancel="deleteDate()"

                :options="{
                    alwaysShowCalendars: true,
                    input: true,
                    autoOpen: false,
                    autoApply: true,
                    opens: 'center',
                    singleDatePicker: task_start_field ? false : true,
                    showDropdowns: true,
                    startDate: startDate,
                    endDate: endDate,
                    locale: {
                        cancelLabel: __( 'Clear', 'wedevs-project-manager' )
                    },
                    ranges: {
                        [__('Today', 'wedevs-project-manager')]: [moment(), moment()],
                        [__( 'Yesterday', 'wedevs-project-manager')]: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                        [__( 'Last 7 Days', 'wedevs-project-manager')]: [moment().subtract(6, 'days'), moment()],
                        [__( 'Last 30 Days', 'wedevs-project-manager')]: [moment().subtract(29, 'days'), moment()],
                        [__( 'This Month', 'wedevs-project-manager')]: [moment().startOf('month'), moment().endOf('month')],
                        [__( 'Last Month', 'wedevs-project-manager')]: [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                    }
                }"
            />
        </div>
        <div class="clearfix" />

        <user-reports-task-estimation :reports="reports" />
    </div>
</template>

<style lang="less">
    .pm-pro-my-task-reports {
        .date-range {
            float: right;

            input {
                width: 230px;
                padding: 18px 10px;
            }

            label {
                color: #23282d;
                font-weight: 600;
            }
        }

        .clearfix {
            &:after {
               content: "";
                clear: both;
                display: table;
            }
        }
    }
</style>

<script>
    import UserReportsTaskEstimation from './user-reports-task-estimation.vue'

    export default {
        watch: {
            '$route' (route) {
                this.getReports();
            }
        },

        data () {
            return {
                reports: {},
                isResolving: true,
                startDate: moment().startOf('month').format('MM/DD/YYYY'),
                endDate: moment().endOf('month').format('MM/DD/YYYY'),
                task_start_field: true
            }
        },

        components: {
            'user-reports-task-estimation': UserReportsTaskEstimation,
        },

        created() {
            this.setDate();
            this.getReports();
        },

        methods: {
            moment() {
                return pm.Moment();
            },

            getReports () {
                var self = this;
                let user_id = this.$route.params.user_id;

                var url = `${self.base_url}pm-pro/v2/report-summary?type=user&users=${user_id}&startDate=${this.startDate}&endDate=${this.endDate}`;

                 var request = {
                    type: 'GET',
                    url: url,
                    success (res) {
                        self.isResolving = false,
                        self.reports = res.data;
                        pm.NProgress.done();
                    }
                };

                self.isResolving = true,
                this.$router.push({
                    name: 'mytask-reports',
                    params: {
                        user_id: this.$route.params.user_id
                    },
                    query: {
                        start_date: moment(this.startDate).format('YYYY-MM-DD'),
                        end_date: moment(this.endDate).format('YYYY-MM-DD'),
                    }
                });
                self.httpRequest(request);
            },

            setDate () {
                if ( this.$route.query.start_date ) {
                    this.startDate = moment(this.$route.query.start_date).format('MM/DD/YYYY');
                }

                if ( this.$route.query.end_date ) {
                    this.endDate = moment(this.$route.query.end_date).format('MM/DD/YYYY');
                }
            },

            getStartDate () {
                return this.startDate ? new Date(this.startDate ) : pm.Moment()
            },

            getEndDate () {
                return this.endDate ? new Date(this.endDate) : pm.Moment()
            },

            onChangeDate (star, end) {

                this.startDate = pm.Moment(star).format('MM/DD/YYYY');
                this.endDate = pm.Moment(end).format('MM/DD/YYYY');

                this.getReports();
            },

            deleteDate () {


            },
        }
    }
</script>
