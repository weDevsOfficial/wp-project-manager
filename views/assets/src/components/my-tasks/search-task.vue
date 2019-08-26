<template>
	<div class="my-task-filter-wrap">
		<form class="form" action="" @submit.prevent="find()">
			<div>
				<input type="text" name="task_title" v-model="search.title">
			</div>
			<div>
                <multiselect
                    v-model="search.projects"
                    :options="projects"
                    :show-labels="false"
                    :multiple="false"
                    :searchable="true"
                    :loading="asyncProjectLoading"
                    :placeholder="__('All Projects', 'pm-pro')"
                    @search-change="asyncProjectFind($event)"
                    label="title"
                    track-by="id">
                    <span slot="noResult">{{ __( 'No project found.', 'wedevs-project-manager' ) }}</span>

                </multiselect>
            </div>
            <!-- <div>
                <multiselect
                    v-model="search.lists"
                    :options="lists"
                    :show-labels="false"
                    :searchable="true"
                    :loading="asyncListLoading"
                    :placeholder="__('All Lists', 'pm-pro')"
                    @search-change="asyncListFind($event)"
                    label="title"
                    track-by="id">
                    <span slot="noResult">{{ __( 'No project found.', 'wedevs-project-manager' ) }}</span>

                </multiselect>
            </div> -->

             <div>
                <select v-model="search.status">
                	<option value="current">{{ __( 'Current Task', 'wedevs-project-manager' ) }}</option>
                	<option value="outstanding">{{ __( 'Outstanding Task', 'wedevs-project-manager' ) }}</option>
                	<option value="completed">{{ __( 'Completed', 'wedevs-project-manager' ) }}</option>
                </select>
            </div>
            <div>
	            <pm-date-range-picker 
	            	:startDate="search.start_at"
	            	:endDate="search.due_date"
	            	:options="calendarOptions"
	            	@apply="calendarOnChange"
	            	@cancel="calendarCancel">
	            	
	            </pm-date-range-picker>
	        </div>
	        <div>
            	<input class="button button-primary" type="submit" :value="__('Filter', 'wedevs-project-manager')">
            </div>
		</form>
		
		<current-task v-if="search.status == 'current'" :tasks="tasks"></current-task>
		<outstanding-task v-if="search.status == 'outstanding'" :tasks="tasks"></outstanding-task>
		<completed-task v-if="search.status == 'completed'" :tasks="tasks"></completed-task>

		<pm-pagination 
            :total_pages="total_task_page" 
            :current_page_number="current_page_number" 
            component_name='my_task_pagination'>
            
        </pm-pagination> 
	</div>
</template>

<style lang="less">
	.my-task-filter-wrap {
		.form {
			display: flex;
		}
	}
</style>


<script>
	import CurrentTask from './current-task.vue'
	import Outstanding from './outstanding-task.vue'
	import Completed from './complete-task.vue'
	import Pagination from '@components/common/pagination.vue';

	export default {
		data () {
			return {
				total_task_page: 10,
				current_page_number: 1,
				search: {
					title: '',
					projects: [],
					start_at: '',
					due_date: '',
					status: 'current'
				},
				asyncProjectLoading: false,
				asyncListLoading: true,
				projects: [],
				tasks: [],
				lists: [],
				calendarOptions: {
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
				      cancelLabel: __( 'Clear', 'wedevs-project-manager' )
				    },
				    "showCustomRangeLabel": false,
				    "alwaysShowCalendars": true,
				    "showDropdowns": true,
				    'autoUpdateInput': true,
				    'placeholder': __('Start at - Due date', 'wedevs-project-manager')
				}
			}
		},
		components: {
			'multiselect': pm.Multiselect.Multiselect,
			'current-task': CurrentTask,
			'outstanding-task': Outstanding,
			'completed-task': Completed,
			'pm-pagination': Pagination
		},
		created () {
			this.getProjects();
			this.setQuery();
		},
		methods: {
			setQuery () {
				this.search = Object.assign({}, this.search, this.$route.query);
				this.search.projects = [];

				if(this.search.start_at == '' || this.search.due_date == '') {
					this.calendarOptions.autoUpdateInput = false;
				}

				this.sendRequest();
			},
			asyncProjectFind (val) {

			},

			asyncListFind (val) {

			},

			calendarOnChange (start, end, className) {
				this.search.start_at = start.format('YYYY-MM-DD');
				this.search.due_date = end.format('YYYY-MM-DD');
				
				jQuery('.'+className).val(this.search.start_at +'-'+this.search.due_date);
			},

			calendarCancel (className) {
				this.search.start_at = '';
				this.search.due_date = '';

				jQuery('.'+className).val('');
			},

			getProjects () {
				var self = this;
				var request_data = {
	                url: self.base_url + '/pm/v2/advanced/projects/?',
	                data: {
	                	select: ['id', 'title'],
	                },
	                type: 'GET',
	                success (res) {
	                    self.projects = res.data;
	                    self.setProjectsField();
	                },
	                error (res) {
	                    
	                },
	            }

	            self.httpRequest(request_data);
			},

			setProjectsField () {
				var projects = [];
				var self = this;
				
				if(typeof this.$route.query.projects == 'undefined') {
					return;
				}
				
				if(this.is_array(this.$route.query.projects)) {
					this.$route.query.projects.forEach(function(projectId) {
						let index = self.getIndex( self.projects, parseInt(projectId), 'id' );
						projects.push( self.projects[index] );
					});

				} else {
					let index = self.getIndex( self.projects, parseInt(this.$route.query.projects), 'id' );
					projects.push( self.projects[index] );
				}

				self.search.projects = projects;
				
			},

			find () {
				var request = {
					title: this.search.title,
					projects: this.setProjects(),
					start_at: this.search.start_at,
					due_date: this.search.due_date,
					login_user: this.setLoginUser(),
					status: this.search.status,
					assignees: this.setLoginUser(),
					per_page: 20,
					page: 1
				}

				this.$router.push({query: request});
				this.sendRequest();
			},

			sendRequest () {
				var self = this;
				var data = this.$route.query;

				if(data.status == 'current') {
					data.status = 0;
				} else if (data.status == 'completed') {
					data.status = 1;
				} else if (data.status == 'outstanding') {
					delete data.status;
					data.due_date = pm.Moment().format('YYYY-MM-DD');
				}

				if(typeof data.projects != 'undefined') {
					data.project_id = data.projects;
					delete data.projects;
				}

				data.with = 'task_list,project';
				data.select = 'id, title, created_at, start_at, due_date, completed_at';
				
				var request_data = {
	                url: self.base_url + '/pm/v2/advanced/tasks',
	                data: data,
	                type: 'GET',
	                success (res) {
	                    self.tasks = res.data
	                },
	                error (res) {
	                    
	                },
	            }

	            self.httpRequest(request_data);
			},

			setLoginUser () {
				if(typeof this.$route.query.login_user == 'undefined') {
					return PM_Vars.current_user.ID;
				}

				return this.$route.query.login_user;
			},

			setProjects () {
				var ids = [];

				if(this.is_array(this.search.projects)) {
					this.search.projects.forEach(function(project) {
						ids.push(project.id);
					});
				}

				if( this.is_object(this.search.projects) ) {
					ids.push(this.search.projects.id);
				}
				
				return ids;
			}
		}

	}
</script>
