<template>
	<div>
		<form action="">
			<input type="text" name="task_title" v-model="search.title">
			<div>
                <multiselect
                    v-model="search.projects"
                    :options="projects"
                    :show-labels="false"
                    :searchable="true"
                    :loading="asyncProjectLoading"
                    :placeholder="__('All Projects', 'pm-pro')"
                    @search-change="asyncProjectFind($event)"
                    label="title"
                    track-by="id">
                    <span slot="noResult">{{ __( 'No project found.', 'wedevs-project-manager' ) }}</span>

                </multiselect>
            </div>
            <div>
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
            </div>
            <pm-date-range-picker 
            	:startDate="search.startDate"
            	:endDate="search.endDate"
            	:options="calendarOptions"
            	@onChange="calendarOnChange">
            	
            </pm-date-range-picker>
		</form>
	</div>
</template>


<script>
	export default {
		data () {
			return {
				search: {
					title: '',
					projects: [],
					lists: [],
					startDate: '',
					endDate: ''
				},
				asyncProjectLoading: true,
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
		},
		methods: {
			asyncProjectFind (val) {

			},

			asyncListFind (val) {

			},
			calendarOnChange (start, end, label) {
				console.log(start, end, label);
			},
			getProjects () {
				var self = this;
				var request_data = {
	                url: self.base_url + '/pm/v2/advanced/projects/?',
	                data: {
	                	with: 'task_lists,tasks,assignees,categories',
	                	lists_per_page: '10',
	                	tasks_per_page: '10',
	                	per_page: '10',
	                	select: ['id', 'title'],
	                	task_lists_select_items: 'id, title',
	                	task_select_items: 'id, title',
	                	task_lists_per_page: 1,
	                	//categories: [2, 4],
	                	//assignees: [1,2],
	                	id: [1,4,2],
	                	// title: 'Rocket',
	                	// status: '0',
	                	page: 1
	                },
	                type: 'GET',
	                success (res) {
	                    
	                },
	                error (res) {
	                    
	                },
	            }

	            self.httpRequest(request_data);
			}
		}

	}
</script>
