<template>
	<div class="pm-mycalender">
	    <div class="pm-col-12 ">
	        <h3 class="pm-box-title">{{ __('My Calendar', 'wedevs-project-manager' ) }}</h3>
	        <div class="pm-calender-content">
	            <div class="icon32" id="icon-themes"><br>

	            </div>

				    <pm-calendar
						:locale="locale"
			            @events="selfGetEvents"
			            @event-render="eventRender"
			            @event-resize="eventResize"
			            @event-drop="eventDrop"
						@event-selected="clickEvent">
					
		            </pm-calendar>

	        </div>
	    </div>
		<div v-if="parseInt(taskId) && parseInt(projectId)">
            <single-task :taskId="taskId" :projectId="projectId"></single-task>
        </div>
	</div>
</template>

<script>
	import Mixin from './mixin';
	import CalendarMixin from './calendar-mixin';
	import pmCalendar from '@components/common/pm-calendar.vue';
	export default {
		data () {
			return {
				taskId: false,
            	locale: PM_Vars.locale,
				projectId: false
			}
		},
		mixins: [Mixin, CalendarMixin],
		components: {
			pmCalendar: pmCalendar,
			singleTask: pm.SingleTask
		},
		watch: {
			'$route' (route) {
				if ('mytask_calendar_single_task' == route.name) {
					this.taskId = route.params.task_id;
					this.projectId = route.params.project_id;
				}
			}
		},
		created () {
			if ('mytask_calendar_single_task' == this.$route.name) {
				this.taskId = this.$route.params.task_id;
				this.projectId = this.$route.params.project_id;
			}
            pmBus.$on('pm_after_close_single_task_modal', this.afterCloseSingleTaskModal);
        },
	    methods: {
			clickEvent (...args) { //individualProjectId individualTaskId
				var args = {...args}
				args[1].preventDefault();
				this.projectId = parseInt(args[0].project_id);
				this.taskId = parseInt(args[0].id);
			},
			afterCloseSingleTaskModal () {
				if ('mytask-tasks' !== this.$route.name) {
					return;
				}
                this.taskId = false;
				this.projectId = false;
				this.$router.push({
					name: 'mytask-tasks'
				})
            },
		    selfGetEvents ( start, end, timezone, callback ) {
	            var self = this;
	            var user_id = typeof this.$route.params.user_id !== 'undefined' ? this.$route.params.user_id : this.current_user.ID;
	            var args = {
	                data: {
	                	start : start.format('YYYY-MM-DD'),
		                end : end.format('YYYY-MM-DD'),
	                },
	                user_id: user_id,
	            };
	            var request = {
	                type: 'GET',
	                data: args.data,
	                url: self.base_url + 'pm/v2/users/'+ args.user_id +'/tasks/calender',
	                success (res) {
	                	var events=[];
	                    res.data.map((event) => {
	                        events.push(self.eventFromateData(event));
	                    });

	                    callback(events);
	                    pm.NProgress.done();
	                }
	            };

	            if(args.user_id){
	                self.httpRequest(request);
	            }
	        },

	    }
	}
</script>
