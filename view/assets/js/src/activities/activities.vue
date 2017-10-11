<template>
	<div class="wrap cpm cpm-front-end">

    <pm-header></pm-header>

    <ul v-if="activities.length" class="cpm-activity-list">
        <li v-for="group in activities" :key="group.id" class="cpm-row"> 
            <div class="cpm-activity-date cpm-col-1 cpm-sm-col-12">
                <span>{{ actiivtyGroupDate(group.date, 'DD') }}</span> 
                <br>
                {{ actiivtyGroupDate(group.date, 'MMMM') }}
                 
            </div> 
            <div class="cpm-activity-body cpm-col-11 cpm-sm-col-12 cpm-right cpm-last-col"> 
                <ul>
                    <li v-for="activity in group.activities" >
                        <div class="cpm-col-8 cpm-sm-col-12">
                            <a href="#">
                                {{ activity.actor.data.display_name }}
                            </a> 
                            <span v-html="activity.message"></span>
                        </div>
                        <div class="date cpm-col-4 cpm-sm-col-12">
                            <time :datetime="pmDateISO8601Format(activity.committed_at.date, activity.committed_at.time)" :title="pmDateISO8601Format(activity.committed_at.date, activity.committed_at.time)">
                                {{ activity.committed_at.date }} {{ activity.committed_at.time }}
                            </time>
                        </div> 
                        <div class="clear"></div> 
                    </li>
                </ul>
            </div>
        </li>

    </ul>

    <a v-if="total_activity>loaded_activities" href="#" @click.prevent="loadMore()" class="button cpm-load-more">Load More...</a>
    <span v-show="show_spinner" class="cpm-spinner"></span>
</div>
</template>

<script>
    import header from './../header.vue';

    export default {
        beforeRouteEnter(to, from, next) {
            next (vm => {
                vm.activityQuery();
            }); 
        },
        data () {
            return {
                page: 1,
                total_activity: 0,
                per_page: 2,
                show_spinner:false
            }
        },
        computed: {
            activities () {
                var records = this.$store.state.activities,
                    self = this;

                var activities = _.chain(records)
                    .groupBy(self.occurrenceDay)
                    .map(self.groupToDay)
                    .sortBy('day')
                    .value();

                return activities;
            },

            loaded_activities () {
                return this.$store.state.activities.length;
            }
        },
        components: {
            'pm-header': header
        },

        methods: {
            occurrenceDay (occurrence){
                var date = new Date(occurrence.committed_at.date);
                var date = moment(date).format('YYYY-MM-DD');

                return moment(date).startOf('day').format('YYYY-MM-DD');
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

                moment.tz.add(PM_Vars.time_zones);
                moment.tz.link(PM_Vars.time_links);

                date = new Date(date);
                date = moment(date).format('YYYY-MM-DD');

                return moment.tz( date, PM_Vars.wp_time_zone ).format(format);
            },

            loadMore () {
                this.show_spinner = true;
                this.page = this.page + 1;
                this.activityQuery();
            },

            activityQuery () {
                var condition = {
                    per_page: this.per_page,
                    page: this.page
                },
                self = this;

                this.getActivities(condition, function(res) {
                    self.total_activity = res.meta.pagination.total;
                    self.show_spinner = false;
                });
            }
        }
    }

</script>