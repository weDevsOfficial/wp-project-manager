<template>
    <div class="pm-wrap pm-front-end">

    <pm-header></pm-header>
    <pm-heder-menu></pm-heder-menu>

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

    <div class="pm-activities" v-if="isActivityFetched">
        <ul v-if="activities.length" class="pm-activity-list">
            <li v-for="group in activities" :key="group.id" class="pm-row"> 
                <div class="pm-activity-date pm-col-1 pm-sm-col-12">
                    <span>{{ actiivtyGroupDate(group.date, 'DD') }}</span> 
                    <br>
                    {{ actiivtyGroupDate(group.date, 'MMMM') }}
                     
                </div> 
                <div class="pm-activity-body pm-col-11 pm-sm-col-12 pm-right pm-last-col"> 
                    <ul>
                        <li v-for="activity in group.activities" :key="activity.id" >
                            <div class="pm-col-8 pm-sm-col-12">
                                <activity-parser :activity="activity" :page="'project'"></activity-parser>
                            </div>
                            <div class="date pm-col-4 pm-sm-col-12">
                                <time :datetime="pmDateISO8601Format(activity.committed_at.date, activity.committed_at.time)" :title="pmDateISO8601Format(activity.committed_at.date, activity.committed_at.time)">
                                    <i>{{ taskDateFormat(activity.committed_at.date) }}, {{ dateTimeFormat(activity.committed_at.timestamp) }}</i>
                                </time>
                            </div> 
                            <div class="clear"></div> 
                        </li>
                    </ul>
                </div>
            </li>

        </ul>

        <a v-if="total_activity>loaded_activities" href="#" @click.prevent="loadMore()" class="button pm-load-more">{{ __( 'Load More ...', 'wedevs-project-manager') }}</a>
        <span v-show="show_spinner" class="pm-spinner"></span>
        <div v-if="!activities.length" class="no-activity" > {{ __( 'No activity found.', 'wedevs-project-manager') }} </div>
    </div>

    <router-view name="singleTask"></router-view>
</div>
</template>

<style lang="less">
    .pm-activities {
        margin-top: 10px;
    }
</style>

<script>
    import header from '@components/common/header.vue';
    import Mixins from './mixin';

    export default {
        beforeRouteEnter(to, from, next) {
            next (vm => {
                //vm.$store.state.projectActivities.activities =[];
                
            }); 
        },
        mixins: [Mixins],
        data () {
            return {
                isActivityFetched: false,
                total_activity: 0,
                per_page: 2,
                show_spinner:false,
                loadMoreStatus: false
            }
        },
        created () {
            this.activityQuery();
            pmBus.$on('pm_after_close_single_task_modal', this.afterCloseSingleTaskModal);
            pmBus.$on('pm_generate_task_url', this.generateTaskUrl);
        },
        watch: {
            '$route' (to, from) {
                if ( 'activity_single_task' == to.name || 'activity_single_task' == from.name ) {
                    return;
                }
                if(typeof to.params.current_page_number !== 'undefined') {
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

                let index =  this.getIndex(records, this.project_id, 'project_id');

                if ( index === false ) {
                    return [];
                }

                records = records[index].activities;

                var activities = _.chain(records)
                    .groupBy(self.occurrenceDay)
                    .map(self.groupToDay)
                    .sortBy('day')
                    .value();

                return activities;
            },

            loaded_activities () {

                var records = this.$store.state.projectActivities.activities,
                    self = this;

                let index =  this.getIndex(records, this.project_id, 'project_id');

                if ( index === false ) {
                    return 0;
                }

                return records[index].activities.length;
            },
            current_page () {
                if(typeof this.$route.params.current_page_number !== 'undefined') {
                    return  parseInt(this.$route.params.current_page_number, 10)
                }
                else{
                    return 1;
                }
            },
            // isActivityFetched () {
            //     return this.$root.$store.state.projectActivityLoaded;
            // }
        },
        components: {
            'pm-header': header,
            'single-task': pm.SingleTask,
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
                var records = this.$store.state.projectActivities.activities;
                let index =  this.getIndex(records, this.project_id, 'project_id');

                if ( index === false ) {
                    return;
                }

                var page = parseInt(records[index].page) + 1;

                this.loadMoreStatus = true;
                this.activityQuery(page);
            },

            activityQuery (page) {
                page = page || 1;
                var condition = {
                    per_page: 20,
                    page: page
                },
                self = this;
                this.getActivities(condition, function(res) {
                    self.$store.commit( 'projectActivities/setActivities', {
                        data: res.data,
                        loadStatus: self.loadMoreStatus,
                        project_id: self.project_id
                    });
                    self.$root.$store.state.projectActivityLoaded = true;
                    self.total_activity = res.meta.pagination.total;
                    self.show_spinner = false;
                    self.isActivityFetched = true;
                });
            },
            generateTaskUrl (task) {
                var url = this.$router.resolve({
                    name: 'lists_single_task',
                    params: {
                        task_id: task.id,
                        project_id: task.project_id,
                    }
                }).href;
                var url = PM_Vars.project_page + url;

                //var url = PM_Vars.project_page + '#/projects/' + task.project_id + '/task-lists/' +task.task_list.data.id+ '/tasks/' + task.id;
                this.copy(url);
            },

            afterCloseSingleTaskModal () {
                var current_page_number = this.$route.params.current_page_number;

                if (! current_page_number) {
                    this.$router.push({
                        name:'activities',
                        params: {
                            project_id : this.project_id
                        }
                    });
                } else {
                    this.$router.push({
                        name:'activities_pagination',
                        params: {
                            project_id : this.project_id,
                            current_page_number: current_page_number
                        }
                    });
                }
                
                
                
            }
        }
    }

</script>
