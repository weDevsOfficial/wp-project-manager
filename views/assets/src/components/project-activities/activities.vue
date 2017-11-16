<template>
    <div class="wrap pm pm-front-end">

    <pm-header></pm-header>

    <div v-if="loading" class="pm-data-load-before" >
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
                                <a href="#">
                                    {{ activity.actor.data.display_name }}
                                </a> 
                                <span v-html="activity.message"></span>
                                {{compilineText ( activity.message ) }}
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
    import header from './../common/header.vue';

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
                show_spinner:false,
                loading: true,
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
                this.show_spinner = true;
                
                var condition = {
                    per_page: this.per_page,
                    page: this.page + 1
                },
                self = this;

                this.getActivities(condition, function(res) {
                    self.$store.commit( 'setLoadedActivities', res.data );
                    self.total_activity = res.meta.pagination.total;
                    self.show_spinner = false;
                });
            },

            activityQuery () {
                var condition = {
                    per_page: this.per_page,
                    page: this.page
                },
                self = this;

                this.getActivities(condition, function(res) {
                    self.$store.commit( 'setActivities', res.data );
                    self.total_activity = res.meta.pagination.total;
                    self.show_spinner = false;
                    self.loading = false;
                });
            },

            compilineText( text ){
                console.log(text);
            }
        }
    }

</script>