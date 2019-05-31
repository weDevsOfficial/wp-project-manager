<template>
    <div class="mytask-activity">

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
    <div v-else>
        <ul class="pm-activity-list">
            <li v-for="group in activities" :key="group.id" class="pm-row">
                <div class="pm-activity-date pm-col-1 pm-sm-col-12">
                    <span>{{ actiivtyGroupDate(group.date, 'DD') }}</span>
                    <br>
                    {{ actiivtyGroupDate(group.date, 'MMMM') }}

                </div>
                <div class="pm-activity-body pm-col-11 pm-sm-col-12 pm-right pm-last-col">
                    <ul>
                        <li v-for="(activity, key) in group.activities" :key="key">
                            <div class="pm-col-8 pm-sm-col-12">
                                <activity-parser :activity="activity"></activity-parser>
                            </div>
                            <div class="date pm-col-4 pm-sm-col-12">
                                <time :datetime="pmDateISO8601Format(activity.committed_at.date, activity.committed_at.time)" :title="pmDateISO8601Format(activity.committed_at.date, activity.committed_at.time)">
                                    <i>{{ taskDateFormat(activity.committed_at.date) }}, {{ dateTimeFormat(activity.committed_at.datetime) }}</i>
                                </time>
                            </div>
                            <div class="clear"></div>
                        </li>
                    </ul>
                </div>
            </li>

        </ul>

        <a v-if="total_activity>loaded_activities" href="#" @click.prevent="getSelfUserActivities()" class="button pm-load-more">{{__("Load More", 'pm-pro')}}</a>
        <span v-show="show_spinner" class="pm-spinner"></span>
    </div>
</div>
</template>

<script>
    import Mixins from './mixin';

    export default {
        data () {
            return {
                page: 1,
                show_spinner:false,
                loading: false,
            }
        },
        watch:{
            '$route' (route) {
                if (route.params.user_id !== this.user_id) {
                    this.$store.commit('myTask/setLoadFalse');
                    this.getSelfUserActivities();
                    this.getUserMeta();
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
            // load Activities if not loaded
          //  if (!this.isloaded) {
                this.getSelfUserActivities();
           // }
        },
        computed: {
            activities () {
                if( typeof this.$store.state.myTask.activities !== 'undefined') {
                var records = this.$store.state.myTask.activities,
                    self = this;
                var activities = _.chain(records)
                    .groupBy(self.occurrenceDay)
                    .map(self.groupToDay)
                    .sortBy('day')
                    .value();
                return activities;
            }
            },

            loaded_activities () {
                if( typeof this.$store.state.myTask.activities !== 'undefined' ) {
                    return this.$store.state.myTask.activities.length;
                }
            },

            total_activity () {
                if( typeof this.$store.state.myTask.activitiesMeta.pagination !== 'undefined' ) {
                    return this.$store.state.myTask.activitiesMeta.pagination.total;
                }
            },

            current_page () {
                if( typeof this.$store.state.myTask.activitiesMeta.pagination !== 'undefined' ) {
                    return  parseInt( this.$store.state.myTask.activitiesMeta.pagination.current_page, 10);
                }
                return 0;
            },
            isloaded () {
                return this.$store.state.myTask.isFetchMyTaskActivities;
            }
        },
        mixins: [Mixins],
        methods: {
            occurrenceDay (occurrence){
                var date = new Date(occurrence.committed_at.date);
                var date = pm.Moment(date).format('YYYY-MM-DD');

                return pm.Moment(date).startOf('day').format('YYYY-MM-DD');
            },

            groupToDay(group, day){
                return {
                    date: day,
                    activities: group
                }
            },

            /**
             * WP settings date format convert to moment date format with time zone
             *
             * @param  string date
             *
             * @return string
             */
            actiivtyGroupDate: function( date, format ) {
                if ( !date ) {
                    return;
                }
                date = new Date(date);
                return pm.Moment(date).format(format);
            },
            getSelfUserActivities () {
                var user_id = typeof this.$route.params.user_id !== 'undefined' ? this.$route.params.user_id : this.current_user.ID;
                var args = {
                    user_id: user_id,
                    conditions: {
                        with: 'activities'
                    },
                    data:{
                        // mytask_activities_per_page: this.per_page, // you can set it
                        mytask_activities_page: this.current_page  + 1
                    },
                    callback (res) {
                        if (this.current_page) {
                            this.$store.commit("myTask/setMoreActivities", res.data);
                        } else {
                            this.$store.commit('myTask/setActivities', res.data);
                        }

                        this.$store.commit('myTask/setActivitiesMeta', res.meta);

                        this.$store.state.myTask.isFetchMyTaskActivities = true;
                        this.loading = false;
                        pm.NProgress.done();
                    }
                }
                this.getUserActivites(args);
            }
        }
    }

</script>
