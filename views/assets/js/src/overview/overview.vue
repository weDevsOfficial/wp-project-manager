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

		<div class="project-overview">
			<div class="pm-col-10 pm-sm-col-12">
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
			         				{{text.discussions}}
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
			         				{{text.task_lists}}
			         			</div> 
			         		</router-link>
			         	</li>

			         	<li class="todos">
			         		<a href="javascript:void(0)">

			         		<div class="icon"></div> 
			         		<div class="count">
			         			<span>{{ meta.total_tasks }}</span> 
			         			{{text.tasks}}
			         		</div> 
			         		</a>
				         	
				        </li>

				        <li class="comments">
				         	<a>
				         		<div class="icon"></div> 
				         		<div class="count">
					         		<span>{{ meta.total_comments }}</span>  
					         		{{text.comments}}
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
						    			{{text.files}}
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
										{{text.milestones}}
								</div> 
							</router-link>
						</li>	
						<div class="clearfix"></div>         	
			         </ul>
			    </div>

			    <div id="pm-chart" class="pm-chart">

			    	<h3>{{text.this_month}}</h3>

			    	
				    <canvas v-pm-overview-chart width="1638" height="656" style="width: 819px; height: 328px;"></canvas>
				
			    </div>
			</div>

			<div class="pm-col-2 pm-sm-col-12 pm-right-part pm-last-col">
				<h3 class="pm-border-bottom"> {{text.users}} </h3>
				<ul class="user_list">
					<li v-for="user in users">
						<img alt="admin" :src="user.avatar_url" class="avatar avatar-34 photo" height="34" width="34"> 
						<a href="#">
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
		data(){
			return{
				loading: true,
			}
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



