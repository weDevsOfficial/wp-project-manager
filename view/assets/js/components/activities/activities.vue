<template>
	<div class="wrap cpm cpm-front-end">
<div class="cpm-top-bar cpm-no-padding cpm-project-header cpm-project-head">

    <div class="cpm-row cpm-no-padding cpm-border-bottom">

        <div class="cpm-col-6 cpm-project-detail">
            <h3><span class="cpm-project-title"> eirugkdj </span>
                                    <a href="#" class="cpm-icon-edit cpm-project-edit-link small-text"><span class="dashicons dashicons-edit"></span> <span class="text">Edit</span></a>
                            </h3>

            <div class="detail">
                                            </div>
        </div>

        <div class="cpm-col-6 cpm-last-col cpm-top-right-btn cpm-text-right show_desktop_only">
                    <div class="cpm-single-project-search-wrap">
            <input type="text" data-project_id="60" placeholder="Search..." id="cpm-single-project-search" class="ui-autocomplete-input" autocomplete="off">
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
                    <a class="cpm-duplicate-project" href="/test/wp-admin/admin.php?page=cpm_projects&amp;tab=project&amp;action=single&amp;pid=60" data-project_id="60">
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

        <input type="hidden" id="_wpnonce" name="_wpnonce" value="37df3017e8"><input type="hidden" name="_wp_http_referer" value="/test/wp-admin/admin.php?page=cpm_projects&amp;tab=project&amp;action=single&amp;pid=60">
        <div class="cpm-form-item project-name">
            <input type="text" name="project_name" id="project_name" placeholder="Name of the project" value="eirugkdj" size="45">
        </div>

        <div class="cpm-form-item project-category">
            <select name="project_cat" id="project_cat" class="chosen-select" style="display: none;">
	<option value="-1" selected="selected">– Project Category –</option>
</select><div class="chosen-container chosen-container-single" style="width: 300px;" title="" id="project_cat_chosen"><a class="chosen-single" tabindex="-1"><span>– Project Category –</span><div><b></b></div></a><div class="chosen-drop"><div class="chosen-search"><input type="text" autocomplete="off"></div><ul class="chosen-results"></ul></div></div>
        </div>

        <div class="cpm-form-item project-detail">
            <textarea name="project_description" class="cpm-project-description" id="" cols="50" rows="3" placeholder="Some details about the project (optional)"></textarea>
        </div>
        <div class="cpm-form-item cpm-project-role">
            <table></table>
        </div>
        <div class="cpm-form-item project-users">
            <input class="cpm-project-coworker ui-autocomplete-input" type="text" name="" placeholder="Type 3 or more characters to search users..." size="45" autocomplete="off">
        </div>

        <div class="cpm-form-item project-notify">
            <input type="hidden" name="project_notify" value="no">
            <label>
                <input type="checkbox" name="project_notify" id="project-notify" value="yes">
                Notify Co-Workers            </label>
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
        <ul class="clearfix">
            <li> <a href="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;tab=project&amp;action=overview&amp;pid=60" class="overview cpm-sm-col-12" title="Overview">Overview<div></div></a></li><li> <a href="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;tab=project&amp;action=single&amp;pid=60" class="activity cpm-sm-col-12 active" title="Activities">Activities <div>48</div></a></li><li> <a href="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;tab=message&amp;action=index&amp;pid=60" class="message cpm-sm-col-12" title="Discussions">Discussions<div>3</div></a></li><li> <a href="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;tab=task&amp;action=index&amp;pid=60" class="to-do-list cpm-sm-col-12" title="Task Lists">Task Lists<div>1</div></a></li><li> <a href="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;tab=milestone&amp;action=index&amp;pid=60" class="milestone cpm-sm-col-12" title="Milestones">Milestones<div>0</div></a></li><li> <a href="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;tab=files&amp;action=index&amp;pid=60" class="files cpm-sm-col-12" title="Files">Files<div>0</div></a></li><li> <a href="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;tab=settings&amp;action=index&amp;pid=60" class="settings cpm-sm-col-12" title="Settings">Settings<div></div></a></li><li> <a href="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;tab=invoice&amp;action=index&amp;pid=60" class="cpminvoice cpm-sm-col-12" title="Invoice">Invoice<div></div></a></li>        </ul>

    </div>

    <div class="clearfix"></div>
</div>



<ul class="cpm_activity_list">
    <ul class="cpm-activity-list"><li class="cpm-row"> <div class="cpm-activity-date cpm-col-1 cpm-sm-col-12"><span> 11 </span> <br> September   </div> <div class="cpm-activity-body cpm-col-11 cpm-sm-col-12 cpm-right cpm-last-col"> <ul><li><div class="cpm-col-8 cpm-sm-col-12"><a href="http://localhost/test/wp-admin/admin.php?page=cpm_task&amp;user_id=1" title="admin">admin</a> commented on a <a href="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;tab=message&amp;action=single&amp;pid=60&amp;mid=97#cpm-comment-315">discussion</a></div><div class="date cpm-col-4 cpm-sm-col-12"><time datetime="2017-09-11T13:34:52+00:00" title="2017-09-11T13:34:52+00:00">September 11, 2017 1:34 pm</time></div> <div class="clear"></div> </li><li><div class="cpm-col-8 cpm-sm-col-12"><a href="http://localhost/test/wp-admin/admin.php?page=cpm_task&amp;user_id=1" title="admin">admin</a> commented on a <a href="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;tab=message&amp;action=single&amp;pid=60&amp;mid=97#cpm-comment-313">discussion</a></div><div class="date cpm-col-4 cpm-sm-col-12"><time datetime="2017-09-11T13:34:47+00:00" title="2017-09-11T13:34:47+00:00">September 11, 2017 1:34 pm</time></div> <div class="clear"></div> </li><li><div class="cpm-col-8 cpm-sm-col-12"><a href="http://localhost/test/wp-admin/admin.php?page=cpm_task&amp;user_id=1" title="admin">admin</a> commented on a <a href="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;tab=message&amp;action=single&amp;pid=60&amp;mid=97#cpm-comment-311">discussion</a></div><div class="date cpm-col-4 cpm-sm-col-12"><time datetime="2017-09-11T13:34:41+00:00" title="2017-09-11T13:34:41+00:00">September 11, 2017 1:34 pm</time></div> <div class="clear"></div> </li><li><div class="cpm-col-8 cpm-sm-col-12"><a href="http://localhost/test/wp-admin/admin.php?page=cpm_task&amp;user_id=1" title="admin">admin</a> commented on a <a href="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;tab=message&amp;action=single&amp;pid=60&amp;mid=97#cpm-comment-309">discussion</a></div><div class="date cpm-col-4 cpm-sm-col-12"><time datetime="2017-09-11T13:34:37+00:00" title="2017-09-11T13:34:37+00:00">September 11, 2017 1:34 pm</time></div> <div class="clear"></div> </li><li><div class="cpm-col-8 cpm-sm-col-12">Message "<a href="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;tab=message&amp;action=single&amp;pid=60&amp;mid=97">srthsrth</a>" created by <a href="http://localhost/test/wp-admin/admin.php?page=cpm_task&amp;user_id=1" title="admin">admin</a></div><div class="date cpm-col-4 cpm-sm-col-12"><time datetime="2017-09-11T13:34:23+00:00" title="2017-09-11T13:34:23+00:00">September 11, 2017 1:34 pm</time></div> <div class="clear"></div> </li><li><div class="cpm-col-8 cpm-sm-col-12">Message "<a href="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;tab=message&amp;action=single&amp;pid=60&amp;mid=96">kafd</a>" created by <a href="http://localhost/test/wp-admin/admin.php?page=cpm_task&amp;user_id=1" title="admin">admin</a></div><div class="date cpm-col-4 cpm-sm-col-12"><time datetime="2017-09-11T13:34:01+00:00" title="2017-09-11T13:34:01+00:00">September 11, 2017 1:34 pm</time></div> <div class="clear"></div> </li><li><div class="cpm-col-8 cpm-sm-col-12">Message "<a href="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;tab=message&amp;action=single&amp;pid=60&amp;mid=95">message 1</a>" created by <a href="http://localhost/test/wp-admin/admin.php?page=cpm_task&amp;user_id=1" title="admin">admin</a></div><div class="date cpm-col-4 cpm-sm-col-12"><time datetime="2017-09-11T13:33:26+00:00" title="2017-09-11T13:33:26+00:00">September 11, 2017 1:33 pm</time></div> <div class="clear"></div> </li><li><div class="cpm-col-8 cpm-sm-col-12">Task "<a href="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;tab=task&amp;action=task_single&amp;pid=60#/task/94">task 1</a>" updated by <a href="http://localhost/test/wp-admin/admin.php?page=cpm_task&amp;user_id=1" title="admin">admin</a></div><div class="date cpm-col-4 cpm-sm-col-12"><time datetime="2017-09-11T10:09:50+00:00" title="2017-09-11T10:09:50+00:00">September 11, 2017 10:09 am</time></div> <div class="clear"></div> </li><li><div class="cpm-col-8 cpm-sm-col-12">Task "<a href="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;tab=task&amp;action=task_single&amp;pid=60#/task/94">task 1</a>" updated by <a href="http://localhost/test/wp-admin/admin.php?page=cpm_task&amp;user_id=1" title="admin">admin</a></div><div class="date cpm-col-4 cpm-sm-col-12"><time datetime="2017-09-11T10:09:49+00:00" title="2017-09-11T10:09:49+00:00">September 11, 2017 10:09 am</time></div> <div class="clear"></div> </li><li><div class="cpm-col-8 cpm-sm-col-12">Task "<a href="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;tab=task&amp;action=task_single&amp;pid=60#/task/94">task 1</a>" updated by <a href="http://localhost/test/wp-admin/admin.php?page=cpm_task&amp;user_id=1" title="admin">admin</a></div><div class="date cpm-col-4 cpm-sm-col-12"><time datetime="2017-09-11T10:09:48+00:00" title="2017-09-11T10:09:48+00:00">September 11, 2017 10:09 am</time></div> <div class="clear"></div> </li><li><div class="cpm-col-8 cpm-sm-col-12">Task "<a href="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;tab=task&amp;action=task_single&amp;pid=60#/task/94">task 1</a>" updated by <a href="http://localhost/test/wp-admin/admin.php?page=cpm_task&amp;user_id=1" title="admin">admin</a></div><div class="date cpm-col-4 cpm-sm-col-12"><time datetime="2017-09-11T08:44:05+00:00" title="2017-09-11T08:44:05+00:00">September 11, 2017 8:44 am</time></div> <div class="clear"></div> </li><li><div class="cpm-col-8 cpm-sm-col-12">Task "<a href="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;tab=task&amp;action=task_single&amp;pid=60#/task/94">task 1</a>" updated by <a href="http://localhost/test/wp-admin/admin.php?page=cpm_task&amp;user_id=1" title="admin">admin</a></div><div class="date cpm-col-4 cpm-sm-col-12"><time datetime="2017-09-11T08:43:32+00:00" title="2017-09-11T08:43:32+00:00">September 11, 2017 8:43 am</time></div> <div class="clear"></div> </li><li><div class="cpm-col-8 cpm-sm-col-12">Task "<a href="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;tab=task&amp;action=task_single&amp;pid=60#/task/94">task 1</a>" added to task list "<a href="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;tab=task&amp;action=single&amp;pid=60#/list/93">List 1</a>" by <a href="http://localhost/test/wp-admin/admin.php?page=cpm_task&amp;user_id=1" title="admin">admin</a></div><div class="date cpm-col-4 cpm-sm-col-12"><time datetime="2017-09-11T08:43:24+00:00" title="2017-09-11T08:43:24+00:00">September 11, 2017 8:43 am</time></div> <div class="clear"></div> </li><li><div class="cpm-col-8 cpm-sm-col-12">Task list "<a href="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;tab=task&amp;action=single&amp;pid=60#/list/93">List 1</a>" created by <a href="http://localhost/test/wp-admin/admin.php?page=cpm_task&amp;user_id=1" title="admin">admin</a></div><div class="date cpm-col-4 cpm-sm-col-12"><time datetime="2017-09-11T08:43:15+00:00" title="2017-09-11T08:43:15+00:00">September 11, 2017 8:43 am</time></div> <div class="clear"></div> </li><li><div class="cpm-col-8 cpm-sm-col-12">Task list "laskdf" deleted by <a href="http://localhost/test/wp-admin/admin.php?page=cpm_task&amp;user_id=1" title="admin">admin</a></div><div class="date cpm-col-4 cpm-sm-col-12"><time datetime="2017-09-11T08:42:32+00:00" title="2017-09-11T08:42:32+00:00">September 11, 2017 8:42 am</time></div> <div class="clear"></div> </li><li><div class="cpm-col-8 cpm-sm-col-12">Task list "skgfkd" deleted by <a href="http://localhost/test/wp-admin/admin.php?page=cpm_task&amp;user_id=1" title="admin">admin</a></div><div class="date cpm-col-4 cpm-sm-col-12"><time datetime="2017-09-11T08:42:27+00:00" title="2017-09-11T08:42:27+00:00">September 11, 2017 8:42 am</time></div> <div class="clear"></div> </li><li><div class="cpm-col-8 cpm-sm-col-12">Task list "list 1" deleted by <a href="http://localhost/test/wp-admin/admin.php?page=cpm_task&amp;user_id=1" title="admin">admin</a></div><div class="date cpm-col-4 cpm-sm-col-12"><time datetime="2017-09-11T08:42:21+00:00" title="2017-09-11T08:42:21+00:00">September 11, 2017 8:42 am</time></div> <div class="clear"></div> </li><li><div class="cpm-col-8 cpm-sm-col-12">Task list "<a href="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;tab=task&amp;action=single&amp;pid=60#/list/81">skgfkd</a>" created by <a href="http://localhost/test/wp-admin/admin.php?page=cpm_task&amp;user_id=1" title="admin">admin</a></div><div class="date cpm-col-4 cpm-sm-col-12"><time datetime="2017-09-11T06:21:11+00:00" title="2017-09-11T06:21:11+00:00">September 11, 2017 6:21 am</time></div> <div class="clear"></div> </li><li><div class="cpm-col-8 cpm-sm-col-12">Task list "<a href="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;tab=task&amp;action=single&amp;pid=60#/list/80">laskdf</a>" created by <a href="http://localhost/test/wp-admin/admin.php?page=cpm_task&amp;user_id=1" title="admin">admin</a></div><div class="date cpm-col-4 cpm-sm-col-12"><time datetime="2017-09-11T06:21:06+00:00" title="2017-09-11T06:21:06+00:00">September 11, 2017 6:21 am</time></div> <div class="clear"></div> </li><li><div class="cpm-col-8 cpm-sm-col-12">Task list "<a href="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;tab=task&amp;action=single&amp;pid=60#/list/79">list 1</a>" created by <a href="http://localhost/test/wp-admin/admin.php?page=cpm_task&amp;user_id=1" title="admin">admin</a></div><div class="date cpm-col-4 cpm-sm-col-12"><time datetime="2017-09-11T06:21:00+00:00" title="2017-09-11T06:21:00+00:00">September 11, 2017 6:21 am</time></div> <div class="clear"></div> </li></ul> </div></li> <div class="clearfix"></div> </ul></ul>

    <a href="#" data-project_id="60" data-start="21" data-total="48" class="button cpm-load-more">Load More...</a>
</div>
</template>