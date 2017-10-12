<template>
	<div class="wrap cpm cpm-front-end">
		<pm-header></pm-header>

		<div class="project-overview">
			<div class="cpm-col-10 cpm-sm-col-12">
			    <div class="overview-menu">
			        <ul>
			         	<li class="message">
			         		<router-link :to="{
			         			name: 'discussions',
			         			params: {
			         				'project_id': project_id
			         			}
			         		}"> 
			         			<div class="icon"></div> 
			         			<div class="count">
			         				<span>{{ meta.total_discussion_boards }}</span> 
			         				Discussions
			         			</div> 
			         		</router-link>
			         	</li>

			         	<li class="todo">
			         		<router-link :to="{
			         			name: 'task_lists',
			         			params: {
			         				'project_id': project_id
			         			}
			         		}"> 
			         			<div class="icon"></div> 
			         			<div class="count">
			         				<span>{{ meta.total_task_lists }}</span> 
			         				Task List
			         			</div> 
			         		</router-link>
			         	</li>

			         	<li class="todos">
			         		<div class="icon"></div> 
			         		<div class="count">
			         			<span>{{ meta.total_tasks }}</span> 
			         			Task
			         		</div> 
				         	
				        </li>

				        <li class="comments">
				         	<a>
				         		<div class="icon"></div> 
				         		<div class="count">
					         		<span>{{ meta.total_comments }}</span>  
					         		Comments
					         	</div> 
					         </a>
					    </li>
					    <li class="files">
					    	<router-link :to="{
					    		name: 'pm_files',
					    		params: {
			         				'project_id': project_id
			         			}
					    	}"> 
						    	<div class="icon"></div> 
						    		<div class="count">
						    			<span>{{ meta.total_files }}</span>  
						    			Files
						    	</div> 
						    </router-link>
						</li>

						<li class="milestone">
							<router-link :to="{
								name: 'milestones',
								params: {
			         				'project_id': project_id
			         			}
							}"> 
								<div class="icon"></div> 
								<div class="count">
									<span>{{ meta.total_milestones }}</span> 
										Milestones
								</div> 
							</router-link>
						</li>	
						<div class="clearfix"></div>         	
			         </ul>
			    </div>

			    <div id="cpm-chart" class="cpm-chart">

			    	<h3>This Month</h3>

			    	
				    <canvas v-pm-overview-chart width="1638" height="656" style="width: 819px; height: 328px;"></canvas>
				
			    </div>
			</div>

			<div class="cpm-col-2 cpm-sm-col-12 cpm-right-part cpm-last-col">
				<h3 class="cpm-border-bottom"> Users </h3>
				<ul class="user_list">
					<li v-for="user in users">
						<img alt="admin" :src="user.avatar_url" class="avatar avatar-34 photo" height="34" width="34"> 
						<a href="#" title="admin">
							{{ user.display_name }}
						</a>
						<span v-for="role in user.roles.data">{{ role.title }}</span>
					</li>
				</ul>
			</div>

			<div class="clearfix"></div>
		</div>
	</div>

</template>

<script>
	import header from './../header.vue';

	export default {
		beforeRouteEnter (to, from, next) {
			next(vm => {
				vm.getOverViews('with=overview_graph');
			});
		},
		computed: {
			meta () {
				return this.$store.state.meta;
			},

			users () {
				return this.$store.state.assignees;
			},

			graph () {
				return this.$store.state.graph;
			}
		},
		components: {
			'pm-header': header
		}
	}

</script>



