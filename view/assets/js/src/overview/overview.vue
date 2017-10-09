<template>
	<div class="wrap cpm cpm-front-end">
		<pm-header></pm-header>

		<div class="project-overview">
			<div class="cpm-col-10 cpm-sm-col-12">
			    <div class="overview-menu">
			        <ul>
			         	<li class="message">
			         		<a href="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;tab=message&amp;action=index&amp;pid=60"> 
			         			<div class="icon"></div> 
			         			<div class="count">
			         				<span>0</span> 
			         				Discussions
			         			</div> 
			         		</a>
			         	</li>

			         	<li class="todo">
			         		<a href="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;tab=task&amp;action=index&amp;pid=60"> 
			         			<div class="icon"></div> 
			         			<div class="count">
			         				<span>1</span> 
			         				Task List
			         			</div> 
			         		</a>
			         	</li>

			         	<li class="todos">
			         		<a href="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;tab=task&amp;action=index&amp;pid=60"> 
				         		<div class="icon"></div> 
				         		<div class="count">
				         			<span>1</span> 
				         			Task
				         		</div> 
				         	</a>
				        </li>

				        <li class="comments">
				         	<a>
				         		<div class="icon"></div> 
				         		<div class="count">
					         		<span>0</span> 
					         		Comments
					         	</div> 
					         </a>
					    </li>
					    <li class="files">
					    	<a href="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;tab=files&amp;action=index&amp;pid=60"> 
						    	<div class="icon"></div> 
						    		<div class="count">
						    			<span>0</span> 
						    			Files
						    	</div> 
						    </a>
						</li>

						<li class="milestone">
							<a href="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;tab=milestone&amp;action=index&amp;pid=60"> 
								<div class="icon"></div> 
								<div class="count">
									<span>0</span> 
										Milestones
								</div> 
							</a>
						</li>	
						<div class="clearfix"></div>         	
			         </ul>
			    </div>

			    <div id="cpm-chart" class="cpm-chart">

			    	<h3>Last 30 days</h3>

			    	<div class="inside">
						<div class="cpm-chart-legend cpm-text-right">
							<span class="to-do">Task</span> 
							<span class="activity">Activity</span>
						</div>

						<div class="clearfix"></div>
				    	<canvas width="1638" height="656" style="width: 819px; height: 328px;"></canvas>
					</div><!-- .inside -->
			    </div>
			</div>

			<div class="cpm-col-2 cpm-sm-col-12 cpm-right-part cpm-last-col">
				<h3 class="cpm-border-bottom"> Users </h3>
				<ul class="user_list">
					<li><img alt="admin" src="//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=34&amp;r=g&amp;d=mm" srcset="//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=34&amp;r=g&amp;d=mm 2x" class="avatar avatar-34 photo" height="34" width="34"> <a href="http://localhost/test/wp-admin/admin.php?page=cpm_task&amp;user_id=1" title="admin">admin</a><span>Manager</span></li>
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
			console.log('asjkdfhaskjd');
			next(vm => {
				vm.getOverViews('with=overview_graph');
			});
		},
		components: {
			'pm-header': header
		}
	}

</script>



