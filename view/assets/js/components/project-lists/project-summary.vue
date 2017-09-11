<template>
    <div>

	<article class="cpm-project cpm-column-gap-left cpm-sm-col-12" v-for="project in projects">

	    <a title="eirugkdj" href="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;tab=project&amp;action=overview&amp;pid=60">
            <div class="project_head">
                <h5>{{ project.title }}</h5>

                <div class="cpm-project-detail"></div>
            </div>
        </a>

	    <div class="cpm-project-meta">
        	<ul>
        		<li class="message">
        			<a title="eirugkdj" href="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;tab=project&amp;action=overview&amp;pid=60"></a>
        			<a href="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;tab=message&amp;action=index&amp;pid=60">
        				<strong><i class="fa fa-circle" aria-hidden="true"></i>{{ parseInt(project.meta.total_discussion_threads) }}</strong> Discussions
        			</a>
        		</li>
        		<li class="todo">
        			<a href="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;tab=task&amp;action=index&amp;pid=60">
        				<strong><i class="fa fa-circle" aria-hidden="true"></i>{{ parseInt(project.meta.total_task_lists) }}</strong> Task Lists
        			</a>
        		</li>
        		<li class="files">
        			<a href="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;tab=files&amp;action=index&amp;pid=60">
        				<strong><i class="fa fa-circle" aria-hidden="true"></i>{{ parseInt(project.meta.total_tasks) }}</strong> Tasks
        			</a>
        		</li>
        		<li class="milestone">
        			<a href="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;tab=milestone&amp;action=index&amp;pid=60">
        				<strong><i class="fa fa-circle" aria-hidden="true"></i>{{ parseInt(project.meta.total_milestones) }}</strong> Milestones
        			</a>
        		</li>                        
        		<div class="clearfix"></div>
        	</ul>
        </div>

	     <div class="cpm-progress cpm-progress-info">
	        <div style="width:50%" class="bar completed"></div>
	    </div>

        <div class="cpm-progress-percentage"></div>

        <footer class="cpm-project-people">
            <div class="cpm-scroll">
                <img v-for="user in project.assignees.data" :alt="user.display_name" :src="user.avatar_url" class="avatar avatar-48 photo" height="48" width="48">  
            </div>
        </footer>
    
        <div class="cpm-project-action-icon">
	        <div class="cpm-project-action">
				<span class="dashicons dashicons-admin-generic cpm-settings-bind"></span>


				<ul class="cpm-settings" style="display: block;">
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
				            <a class="cpm-duplicate-project" href="/test/wp-admin/admin.php?page=cpm_projects" data-project_id="60">
				                <span class="dashicons dashicons-admin-page"></span>
				                <span>Duplicate</span>
				            </a>
				        </li>
				    </ul>
				</div>
			</div>
	</article>
    </div>
</template>


<script>
    export default {
        computed: {
            projects () {
                return this.$store.state.projects;
            }
        }
    }

</script>

<style>
    .fa-circle {
        margin-right: 6%;
    }
</style>



