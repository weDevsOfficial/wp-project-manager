<template>
	<div class="my-task-filter-wrap">
		<form class="form" action="" @submit.prevent="find()">
			<div class="field">
				<input type="text" :placeholder="__('Search by Task Title', 'wedevs-project-manager')" name="task_title" v-model="search.title">
			</div>
			<div class="field project-dropdown-wrap">
                <multiselect
                    v-model="search.projects"
                    :options="projects"
                    :show-labels="false"
                    :multiple="false"
                    :searchable="true"
                    :loading="asyncProjectLoading"
                    :placeholder="__('All Projects', 'pm-pro')"
                    @search-change="asyncProjectFind($event)"
                    @input="changeCountry($event)"
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

            <div class="field" v-if="parseInt(PM_Vars.is_pro)==1">
	            <pm-date-range-picker 
	            	:startDate="search.start_at"
	            	:endDate="search.due_date"
	            	:options="calendarOptions"
	            	@apply="calendarOnChange"
	            	@cancel="calendarCancel">
	            	
	            </pm-date-range-picker>
	        </div>

            <div class="field">
                <select v-model="search.status" @change="changeStatus()">
                	<option value="current">{{ __( 'Current Task', 'wedevs-project-manager' ) }}</option>
                	<option value="outstanding">{{ __( 'Outstanding Task', 'wedevs-project-manager' ) }}</option>
                	<option value="completed">{{ __( 'Completed', 'wedevs-project-manager' ) }}</option>
                </select>
            </div>

	        <div>
            	<input class="button button-primary submit-button" type="submit" :value="__('Filter', 'wedevs-project-manager')">
            </div>
		</form>

		<div :class="getContentClass()">
			<div class="loadmoreanimation-mytask">
	            <div class="load-spinner">
	                <div class="rect1"></div>
	                <div class="rect2"></div>
	                <div class="rect3"></div>
	                <div class="rect4"></div>
	                <div class="rect5"></div>
	            </div>
	        </div>
			<div class="tasks-wrap">
				<current-task 
					@columnSorting="sortQuery"
					v-if="component == 'current'" 
					:tasks="tasks">
						
				</current-task>
				<outstanding-task 
					@columnSorting="sortQuery"
					v-if="component == 'outstanding'" 
					:tasks="tasks">
						
				</outstanding-task>
				<completed-task 
					@columnSorting="sortQuery"
					v-if="component == 'completed'" 
					:tasks="tasks">
						
				</completed-task>
			</div>
		</div>

		<pm-pagination v-if="parseInt($route.params.user_id)"
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

			.pm-daterangepicker {
				width: 220px;
			}
			.project-dropdown-wrap {
				width: 220px;
	            min-height: auto;

	            .multiselect__single {
	                margin-bottom: 0;
	            }
	            .multiselect__select {
	                display: none;
	            }
	            .multiselect__input {
	                border: none;
	                box-shadow: none;
	                margin: 0;
	                font-size: 14px;
	                vertical-align: baseline;
	                height: 0;
	            }
	            .multiselect__element {
	                .multiselect__option {
	                    font-weight: normal;
	                    white-space: normal;
	                    padding: 6px 12px;
	                    line-height: 25px;
	                    font-size: 14px;
	                }

	            }
	            .multiselect__tags {
	                min-height: auto;
	                padding: 4px;
	                border-color: #ddd;
	                border-radius: 3px;
	                white-space: normal;

	                .multiselect__tag {
	                    margin-bottom: 0;
	                    overflow: visible;
	                    border-radius: 3px;
	                    margin-top: 2px;
	                }
	            }
			}

			.field {
				margin-right: 5px;
			}
		}
		.content-wrap {
			.loadmoreanimation-mytask {
				display: none;
			}
		}

		.task-loading {
			position: relative;
			background: #fff;
			.loadmoreanimation-mytask {
                position: absolute;
                left: 45%;
                top: 16%;
                display: block;
            }
            .tasks-wrap {
            	opacity: 0.1;
            }
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
				individualTaskId: 0,
				individualProjectId: 0,
				isLoading: false,
				current_page_number: typeof this.$route.params.current_page_number == 'undefined' ? 
					1 : this.$route.params.current_page_number,
				total_task_page: 0,
				search: {
					title: '',
					projects: [],
					start_at: '',
					due_date: '',
					status: 'current',
					orderby: 'id:asc'
				},
				component: 'current',
				asyncProjectLoading: false,
				asyncListLoading: true,
				projects: [],
				tasks: [],
				lists: [],
				calendarOptions: {
					//'singleDatePicker': this.hasTaskStartField() ? false : true,
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
				      cancelLabel: __( 'Clear', 'wedevs-project-manager' ),
				    },
				    "showCustomRangeLabel": false,
				    "alwaysShowCalendars": true,
				    "showDropdowns": true,
				    'autoUpdateInput': true,
				    "autoApply": true,
				    'placeholder': this.hasTaskStartField() ? __('Start at - Due date', 'wedevs-project-manager') : __('Due date', 'wedevs-project-manager')
				}
			}
		},
		components: {
			'multiselect': pm.Multiselect.Multiselect,
			'current-task': CurrentTask,
			'outstanding-task': Outstanding,
			'completed-task': Completed,
			'pm-pagination': Pagination,
		},
		watch: {
			'$route' (route, prvRoute) {
				this.current_page_number = route.params.current_page_number;

				if(route.params.current_page_number != prvRoute.params.current_page_number) {
					this.sendRequest();
				}
			}
		},
		created () {
			this.getProjects();
			this.setQuery();

			pmBus.$on('after_change_user', this.afterChangeUser);
			pmBus.$on('pm_generate_task_url', this.generateSinglTaskUrl);
			pmBus.$on('pm_after_create_task', this.relode);
		},

		methods: {
			changeStatus () {
				this.find();
			},
			changeCountry (project) {
				//if(!project) return;
				this.find();
			},
			sortQuery (odrPram) {
				this.search.orderby = odrPram.orderby+':'+odrPram.order;
				this.find();
			},
			relode () {
				this.search.orderby = 'id:desc';
				this.find();
			},
			generateSinglTaskUrl(task) {
				var url = this.$router.resolve({
                    name: 'single_task',
                    params: {
                        task_id: task.id,
                        project_id: task.project_id,
                        list_id: task.task_list_id
                    }
                }).href;
                var url = PM_Vars.project_page + url;
                //var url = PM_Vars.project_page + '#/projects/' + task.project_id + '/task-lists/tasks/' + task.id; 
                this.copy(url);
			},
			getContentClass () {
				return this.isLoading ? 'content-wrap task-loading' : 'content-wrap';
			},

			afterChangeUser () {
				this.find();
			},

			setQuery () {
				this.search = Object.assign({}, this.search, this.$route.query);
				this.search.projects = [];

				if(this.hasTaskStartField()) {
					if(this.search.start_at == '' || this.search.due_date == '') {
						this.calendarOptions.autoUpdateInput = false;
					}
				} else {
					if(this.search.due_date == '') {
						this.calendarOptions.autoUpdateInput = false;
					}
				}

				this.find();
			},
			asyncProjectFind (val) {

			},

			asyncListFind (val) {

			},

			calendarOnChange (start, end, className) {
				this.search.due_date = end.format('YYYY-MM-DD');
				//if(this.hasTaskStartField()) {
					this.search.start_at = start.format('YYYY-MM-DD');
				
					jQuery('.'+className).val(this.search.start_at +' - '+this.search.due_date); 
				// } else {
				// 	jQuery('.'+className).val(this.search.due_date);
				// }
				
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
	                    pm.NProgress.done();
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
					users: this.setLoginUser(),
					orderby: this.search.orderby
				}

				this.$router.push({
					params: {
						current_page_number: 1
					}
				});
				
				this.$router.push({query: request});

				if(!this.isValidDateRange()) {

					return;
				}

				this.sendRequest();
			},

			isValidDateRange() {
				var today = pm.Moment().format('YYYY-MM-DD');
				var isValidStart = true;
				var isValidEnd = true;
				
				if(this.search.status == 'current') {
					
					if(this.hasTaskStartField()) {
						let start = pm.Moment( new Date(this.search.start_at) ).format('YYYY-MM-DD');

						if(start != 'Invalid date') {
							isValidStart = moment(today).isSameOrBefore(start);
						}
					}
					
					let end   = pm.Moment( new Date(this.search.due_date) ).format('YYYY-MM-DD');

					if(end != 'Invalid date') {
						var isValidEnd = moment(today).isSameOrBefore(end);
					}

					if(!isValidStart && !isValidEnd) {
						pm.Toastr.error(__('Start date and due date should be greater than or equal today', 'wedevs-project-manager'));
						return false;
					}

					if(!isValidStart) {
						pm.Toastr.error(__('Start date should be greater than or equal today', 'wedevs-project-manager'));
						return false;
					}

					if(!isValidEnd) {
						pm.Toastr.error(__('Due date should be greater than today', 'wedevs-project-manager'));
						return false;
					}

					if(isValidStart && isValidEnd) {
						return true;
					}

					return false;

				} else if (this.search.status == 'outstanding') {

					if(this.hasTaskStartField()) {
						let start = pm.Moment( new Date(this.search.start_at) ).format('YYYY-MM-DD');

						if(start != 'Invalid date') {
							isValidStart = moment(today).isAfter(start);
						}
					}

					let end   = pm.Moment( new Date(this.search.due_date) ).format('YYYY-MM-DD');
					
					if(end != 'Invalid date') {
						var isValidEnd = moment(today).isAfter(end);
					}

					if(!isValidStart && !isValidEnd) {
						pm.Toastr.error(__('Start date and due date should be less than today', 'wedevs-project-manager'));
						return false;
					}

					if(!isValidStart) {
						pm.Toastr.error(__('Start date should be less than today', 'wedevs-project-manager'));
						return false;
					}

					if(!isValidEnd) {
						pm.Toastr.error(__('Due date should be less than today', 'wedevs-project-manager'));
						return false;
					}

					if(isValidStart && isValidEnd) {
						return true;
					}

					return false;
					
				}

				return true;
			},

			sendRequest () {
				if(this.isLoading === true) {
					return;
				}
				var self = this;
				var data = Object.assign({}, this.$route.query);

				if(data.status == 'current') {
					data.status = 0;
					
					if(data.due_date) {
						data.due_date_operator = ['less_than_equal'];
						data.due_date = pm.Moment(data.due_date).format('YYYY-MM-DD');
					} else {
						data.due_date_operator = ['less_than_equal', 'null'];
					}
					
					if(data.start_at && this.hasTaskStartField()) {
						data.start_at_operator = ['greater_than_equal'];
						data.start_at = pm.Moment(data.start_at).format('YYYY-MM-DD');
					} else {
						data.start_at_operator = ['greater_than_equal'];
						data.start_at = pm.Moment().format('YYYY-MM-DD');
					}

				} else if (data.status == 'completed') {
					data.status = 1;
					data.due_date_operator = ['less_than_equal', 'null'];
					data.start_at_operator = ['greater_than_equal'];
				
				} else if (data.status == 'outstanding') {
					data.status = 0;
					
					if(data.due_date) {
						data.due_date = pm.Moment(data.due_date).format('YYYY-MM-DD');
					} else {
						data.due_date = pm.Moment().format('YYYY-MM-DD');
					}
					
					data.due_date_operator = ['less_than'];
					data.start_at_operator = ['greater_than_equal'];
					
					if(data.start_at && this.hasTaskStartField()) {
						data.start_at = pm.Moment(data.start_at).format('YYYY-MM-DD');
					}
				}

				if(typeof data.projects != 'undefined') {
					data.project_id = data.projects;
					delete data.projects;
				}

				data.with = 'task_list,project';
				data.select = 'id, title, created_at, start_at, due_date, completed_at';
				data.per_page = 20;
				data.pages = typeof this.$route.params.current_page_number == 'undefined' ? 
						1 : this.$route.params.current_page_number;
				
				var request_data = {
	                url: self.base_url + '/pm/v2/tasks',
	                data: data,
	                type: 'GET',
	                success (res) {
	                    self.tasks = res.data;
	                    self.total_task_page = res.meta.total_page;
	                    self.component = self.search.status;
	                    self.isLoading = false;
	                    pm.NProgress.done();
	                },
	                error (res) {
	                    
	                },
	            }

	            self.isLoading = true;
	            self.httpRequest(request_data);
			},

			setLoginUser () {
				if(typeof this.$route.params.user_id == 'undefined') {
					return PM_Vars.current_user.ID;
				}

				if( parseInt(this.$route.params.user_id) <= 0) {
					return PM_Vars.current_user.ID;
				}

				return this.$route.params.user_id;
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
		},

		destroyed () {
			pmBus.$off('after_change_user', this.afterChangeUser);
		}
	}
</script>
