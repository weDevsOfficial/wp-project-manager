<template>
    <div class="pm-wrap pm-front-end">

    <pm-header></pm-header>

    <div v-if="!isActivityFetched" class="pm-data-load-before" >
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

    <div v-if="isActivityFetched">
        <ul v-if="activities.length" class="pm-activity-list">
            <li v-for="group in activities" :key="group.id" class="pm-row"> 
                <div class="pm-activity-date pm-col-1 pm-sm-col-12">
                    <span>{{ actiivtyGroupDate(group.date, 'DD') }}</span> 
                    <br>
                    {{ actiivtyGroupDate(group.date, 'MMMM') }}
                     
                </div> 
                <div class="pm-activity-body pm-col-11 pm-sm-col-12 pm-right pm-last-col"> 
                    <ul>
                        <li v-for="activity in group.activities" >
                            <div class="pm-col-8 pm-sm-col-12">
                                <activity-parser :activity="activity"></activity-parser>
                            </div>
                            <div class="date pm-col-4 pm-sm-col-12">
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

        <a v-if="total_activity>loaded_activities" href="#" @click.prevent="loadMore()" class="button pm-load-more">{{text.load_more}}</a>
        <span v-show="show_spinner" class="pm-spinner"></span>
    </div>
</div>
</template>

<script>
    import header from '@components/common/header.vue';

    export default {
        beforeRouteEnter(to, from, next) {
            next (vm => {
                //vm.$store.state.projectActivities.activities =[];
                
            }); 
        },
        mixins: [PmMixin.projectActivities],
        data () {
            return {
                total_activity: 0,
                per_page: 2,
                show_spinner:false
            }
        },
        created () {
            this.activityQuery();
        },
        watch: {
            '$route' (route) { 
                if(typeof route.params.current_page_number !== 'undefined') {
                    this.activityQuery();
                }else {
                    this.$store.state.projectActivities.activities = [];
                    this.activityQuery(); 
                }
            }
        },
        computed: {
            activities () {
                var records = this.$store.state.projectActivities.activities,
                    self = this;

                var activities = _.chain(records)
                    .groupBy(self.occurrenceDay)
                    .map(self.groupToDay)
                    .sortBy('day')
                    .value();

                return activities;
            },

            loaded_activities () {
                return this.$store.state.projectActivities.activities.length;
            },
            current_page () {
                if(typeof this.$route.params.current_page_number !== 'undefined') {
                    return  parseInt(this.$route.params.current_page_number, 10)
                }
                else{
                    return 1;
                }
            },
            isActivityFetched () {
                return this.$store.state.projectActivities.isActivityFetched;
            }
        },
        components: {
            'pm-header': header
        },

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

            loadMore () {
                this.show_spinner= true;
                this.$router.push({
                    name: 'activities_pagination',
                    params: {
                        current_page_number : this.current_page +1
                    }
                });
            },

            activityQuery () {
                var condition = {
                    per_page: 20,
                    page:this.current_page,
                },
                self = this;

                this.getActivities(condition, function(res) {
                    self.$store.commit( 'projectActivities/setActivities', res.data );
                    self.total_activity = res.meta.pagination.total;
                    self.show_spinner = false;
                });
            }
        }
    }

</script>