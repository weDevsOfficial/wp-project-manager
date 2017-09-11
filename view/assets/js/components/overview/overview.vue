<template>
	<div class="wrap cpm cpm-front-end">
		<div class="cpm-top-bar cpm-no-padding cpm-project-header cpm-project-head">

		    <div class="cpm-row cpm-no-padding cpm-border-bottom">

		        <div class="cpm-col-6 cpm-project-detail">
		            <h3>
		            	<span class="cpm-project-title"> eirugkdj </span>
		                 <a href="#" class="cpm-icon-edit cpm-project-edit-link small-text">
		                 	<span class="dashicons dashicons-edit"></span> 
		                 	<span class="text">Edit</span>
		                 </a>
		            </h3>

		            <div class="detail"></div>
		        </div>

		        <div class="cpm-col-6 cpm-last-col cpm-top-right-btn cpm-text-right show_desktop_only">
	                <div class="cpm-single-project-search-wrap">
			            <input type="text" data-project_id="60" placeholder="Search..." id="cpm-single-project-search">
			        </div>
				        
					<div class="cpm-project-action">
				        <span class="dashicons dashicons-admin-generic cpm-settings-bind"></span>

				        <ul class="cpm-settings">
				            <li>
				                <span class="cpm-spinner"></span>
				                <a href="http://localhost/test/wp-admin/admin.php?page=cpm_projects" class="cpm-project-delete-link" title="Delete project" data-confirm="Are you sure to delete this project?" data-project_id="60">
				                    <span class="dashicons dashicons-trash"></span>
				                    <span>Delete</span>
				                </a>
				            </li>
				            <li>
				                <span class="cpm-spinner"></span>
				                    <a class="cpm-archive" data-type="archive" data-project_id="60" href="#">
				                        <span class="dashicons dashicons-yes"></span>
				                        <span>Complete</span>
				                    </a>
				            </li>

				            <li>
			                    <span class="cpm-spinner"></span>
			                    <a class="cpm-duplicate-project" href="/test/wp-admin/admin.php?page=cpm_projects&amp;tab=project&amp;action=overview&amp;pid=60" data-project_id="60">
			                        <span class="dashicons dashicons-admin-page"></span>
			                        <span>Duplicate</span>
			                    </a>
				            </li>
				        </ul>
				    </div>
                </div>

		        <div class="clearfix"></div>

		        <div class="cpm-edit-project" style="display:none;">
		            <form action="" method="post" class="cpm-project-form">

				        <input type="hidden" id="_wpnonce" name="_wpnonce" value="9dd08c1e0f">
				        <input type="hidden" name="_wp_http_referer" value="/test/wp-admin/admin.php?page=cpm_projects&amp;tab=project&amp;action=overview&amp;pid=60">
				        
				        <div class="cpm-form-item project-name">
				            <input type="text" name="project_name" id="project_name" placeholder="Name of the project" value="eirugkdj" size="45">
				        </div>

				        <div class="cpm-form-item project-category">
				            <select name="project_cat" id="project_cat" class="chosen-select">
								<option value="-1" selected="selected">– Project Category –</option>
							</select>
				        </div>

				        <div class="cpm-form-item project-detail">
				            <textarea name="project_description" class="cpm-project-description" id="" cols="50" rows="3" placeholder="Some details about the project (optional)"></textarea>
				        </div>
				        <div class="cpm-form-item cpm-project-role">
				            <table></table>
				        </div>
				        <div class="cpm-form-item project-users">
				            <input class="cpm-project-coworker" type="text" name="" placeholder="Type 3 or more characters to search users..." size="45">
				        </div>

				        <div class="cpm-form-item project-notify">
				            <input type="hidden" name="project_notify" value="no">
				            <label>
				                <input type="checkbox" name="project_notify" id="project-notify" value="yes">
				                Notify Co-Workers            
				            </label>
				        </div>


				        
				        <div class="submit">
							<input type="hidden" name="project_id" value="60">
				            <input type="hidden" name="action" value="cpm_project_update">
				            <span class="cpm-pro-update-spinner"></span>
				            <input type="submit" name="add_project" id="add_project" class="button-primary" value="Update Project">
				            <a class="button project-cancel" href="#">Cancel</a>
				        </div>

				        <div class="cpm-loading" style="display: none;">Saving...</div>

				    </form>
		        </div>
	    	</div>

	    	<div class="cpm-row cpm-project-group">
	        	<ul>
	            	<li> 
	            		<a href="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;tab=project&amp;action=overview&amp;pid=60" class="overview cpm-sm-col-12 active" title="Overview">
	            			<span>Overview</span>
	            			<div></div>
	            		</a>
	            	</li>
	            	<li> 
	            		<a href="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;tab=project&amp;action=single&amp;pid=60" class="activity cpm-sm-col-12" title="Activities">
		            		Activities
		            		<div>41</div>
		            	</a>
		            </li>
		            <li> 
		            	<a href="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;tab=message&amp;action=index&amp;pid=60" class="message cpm-sm-col-12" title="Discussions">
		            		Discussions
		            		<div>0</div>
		            	</a>
		            </li>
		            <li> 
		            	<a href="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;tab=task&amp;action=index&amp;pid=60" class="to-do-list cpm-sm-col-12" title="Task Lists">
		            		Task Lists
		            		<div>1</div>
		            	</a>
		            </li>
		            <li> 
		            	<a href="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;tab=milestone&amp;action=index&amp;pid=60" class="milestone cpm-sm-col-12" title="Milestones">
		            		Milestones
		            		<div>0</div>
		            	</a>
		            </li>
		            <li> 
		            	<a href="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;tab=files&amp;action=index&amp;pid=60" class="files cpm-sm-col-12" title="Files">
		            		Files
		            		<div>0</div>
		            	</a>
		            </li>
		            <li> 
		            	<a href="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;tab=settings&amp;action=index&amp;pid=60" class="settings cpm-sm-col-12" title="Settings">
		            		Settings
		            		<div></div>
		            	</a>
		            </li>
		            <li> 
		            	<a href="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;tab=invoice&amp;action=index&amp;pid=60" class="cpminvoice cpm-sm-col-12" title="Invoice">
		            		Invoice
		            		<div></div>
		            	</a>
		            </li>        
		        </ul>
	    	</div>

	    	<div class="clearfix"></div>
		</div>

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



