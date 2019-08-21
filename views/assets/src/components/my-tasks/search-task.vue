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
                	<option value="overdue">{{ __( 'Overdue Task', 'wedevs-project-manager' ) }}</option>
                </select>
            </div>
            <div>
	            <pm-date-range-picker 
	            	:startDate="search.startDate"
	            	:endDate="search.endDate"
	            	:options="calendarOptions"
	            	@onChange="calendarOnChange">
	            	
	            </pm-date-range-picker>
	        </div>
	        <div>
            	<input class="button button-primary" type="submit" :value="__('Filter', 'wedevs-project-manager')">
            </div>
		</form>
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
	export default {
		data () {
			return {
				search: {
					title: '',
					projects: [],
					startDate: pm.Moment().format('YYYY-MM-01'),
					endDate: pm.Moment().format('YYYY-MM-DD'),
					status: 'current'
				},
				asyncProjectLoading: false,
				asyncListLoading: true,
				projects: [],

				lists: [],
				calendarOptions: {
					ranges: {
				        'Today': [moment(), moment()],
				        'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
				        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
				        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
				        'This Month': [moment().startOf('month'), moment().endOf('month')],
				        'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
				    },
				    locale: {
				      format: 'YYYY-MM-DD'
				    },
				    "showCustomRangeLabel": false,
				    "alwaysShowCalendars": true,
				    "showDropdowns": true,
				}
			}
		},
		components: {
			'multiselect': pm.Multiselect.Multiselect,
		},
		created () {
			this.getProjects();
			this.setQuery();
		},
		methods: {
			setQuery () {
				this.search = Object.assign({}, this.search, this.$route.query);
				this.search.projects = [];
			},
			asyncProjectFind (val) {

			},

			asyncListFind (val) {

			},

			calendarOnChange (start, end, label) {
				this.search.startDate = start.format('YYYY-MM-DD');
				this.search.endDate = end.format('YYYY-MM-DD');
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
					startDate: this.search.startDate,
					endDate: this.search.endDate,
					assignees: this.setAssignees(),
					status: this.search.status
				}

				this.$router.push({query: request});
			},

			setAssignees () {
				if(typeof this.$route.query.assignees == 'undefined') {
					return PM_Vars.current_user.ID;
				}

				return this.$route.query.assignees;
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
