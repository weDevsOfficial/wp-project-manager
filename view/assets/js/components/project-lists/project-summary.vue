<template>
    <div>
        <pre>{{ projects }}</pre>
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
        				<strong><i class="fa fa-circle" aria-hidden="true"></i> 0</strong> Discussions
        			</a>
        		</li>
        		<li class="todo">
        			<a href="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;tab=task&amp;action=index&amp;pid=60">
        				<strong><i class="fa fa-circle" aria-hidden="true"></i> 0</strong> Task Lists
        			</a>
        		</li>
        		<li class="files">
        			<a href="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;tab=files&amp;action=index&amp;pid=60">
        				<strong><i class="fa fa-circle" aria-hidden="true"></i> 0</strong> Tasks
        			</a>
        		</li>
        		<li class="milestone">
        			<a href="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;tab=milestone&amp;action=index&amp;pid=60">
        				<strong><i class="fa fa-circle" aria-hidden="true"></i> 0</strong> Milestones
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
                <img alt="admin" src="//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&amp;r=g&amp;d=mm" srcset="//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&amp;r=g&amp;d=mm 2x" class="avatar avatar-48 photo" height="48" width="48">  
                <img alt="admin" src="//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&amp;r=g&amp;d=mm" srcset="//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&amp;r=g&amp;d=mm 2x" class="avatar avatar-48 photo" height="48" width="48">  
                <img alt="admin" src="//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&amp;r=g&amp;d=mm" srcset="//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&amp;r=g&amp;d=mm 2x" class="avatar avatar-48 photo" height="48" width="48">  
                <img alt="admin" src="//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&amp;r=g&amp;d=mm" srcset="//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&amp;r=g&amp;d=mm 2x" class="avatar avatar-48 photo" height="48" width="48">  
                <img alt="admin" src="//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&amp;r=g&amp;d=mm" srcset="//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&amp;r=g&amp;d=mm 2x" class="avatar avatar-48 photo" height="48" width="48">  
                <img alt="admin" src="//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&amp;r=g&amp;d=mm" srcset="//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&amp;r=g&amp;d=mm 2x" class="avatar avatar-48 photo" height="48" width="48">  
                <img alt="admin" src="//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&amp;r=g&amp;d=mm" srcset="//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&amp;r=g&amp;d=mm 2x" class="avatar avatar-48 photo" height="48" width="48">  
                <img alt="admin" src="//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&amp;r=g&amp;d=mm" srcset="//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&amp;r=g&amp;d=mm 2x" class="avatar avatar-48 photo" height="48" width="48">  
                <img alt="admin" src="//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&amp;r=g&amp;d=mm" srcset="//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&amp;r=g&amp;d=mm 2x" class="avatar avatar-48 photo" height="48" width="48">  
                <img alt="admin" src="//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&amp;r=g&amp;d=mm" srcset="//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&amp;r=g&amp;d=mm 2x" class="avatar avatar-48 photo" height="48" width="48">  
                <img alt="admin" src="//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&amp;r=g&amp;d=mm" srcset="//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&amp;r=g&amp;d=mm 2x" class="avatar avatar-48 photo" height="48" width="48">  
                <img alt="admin" src="//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&amp;r=g&amp;d=mm" srcset="//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&amp;r=g&amp;d=mm 2x" class="avatar avatar-48 photo" height="48" width="48">  
                <img alt="admin" src="//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&amp;r=g&amp;d=mm" srcset="//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&amp;r=g&amp;d=mm 2x" class="avatar avatar-48 photo" height="48" width="48">  
                <img alt="admin" src="//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&amp;r=g&amp;d=mm" srcset="//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&amp;r=g&amp;d=mm 2x" class="avatar avatar-48 photo" height="48" width="48">  
                <img alt="admin" src="//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&amp;r=g&amp;d=mm" srcset="//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&amp;r=g&amp;d=mm 2x" class="avatar avatar-48 photo" height="48" width="48">  
                <img alt="admin" src="//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&amp;r=g&amp;d=mm" srcset="//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&amp;r=g&amp;d=mm 2x" class="avatar avatar-48 photo" height="48" width="48">  
                <img alt="admin" src="//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&amp;r=g&amp;d=mm" srcset="//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&amp;r=g&amp;d=mm 2x" class="avatar avatar-48 photo" height="48" width="48">  
                <img alt="admin" src="//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&amp;r=g&amp;d=mm" srcset="//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&amp;r=g&amp;d=mm 2x" class="avatar avatar-48 photo" height="48" width="48">  
                <img alt="admin" src="//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&amp;r=g&amp;d=mm" srcset="//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&amp;r=g&amp;d=mm 2x" class="avatar avatar-48 photo" height="48" width="48">  

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



