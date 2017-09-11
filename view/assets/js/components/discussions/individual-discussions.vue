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
                    <a class="cpm-duplicate-project" href="/test/wp-admin/admin.php?page=cpm_projects&amp;tab=message&amp;action=single&amp;pid=60&amp;mid=97" data-project_id="60">
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

        <input type="hidden" id="_wpnonce" name="_wpnonce" value="e670638933"><input type="hidden" name="_wp_http_referer" value="/test/wp-admin/admin.php?page=cpm_projects&amp;tab=message&amp;action=single&amp;pid=60&amp;mid=97">
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
            <li> <a href="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;tab=project&amp;action=overview&amp;pid=60" class="overview cpm-sm-col-12" title="Overview">Overview<div></div></a></li><li> <a href="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;tab=project&amp;action=single&amp;pid=60" class="activity cpm-sm-col-12" title="Activities">Activities<div>48</div></a></li><li> <a href="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;tab=message&amp;action=index&amp;pid=60" class="message cpm-sm-col-12 active" title="Discussions">Discussions <div>3</div></a></li><li> <a href="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;tab=task&amp;action=index&amp;pid=60" class="to-do-list cpm-sm-col-12" title="Task Lists">Task Lists<div>1</div></a></li><li> <a href="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;tab=milestone&amp;action=index&amp;pid=60" class="milestone cpm-sm-col-12" title="Milestones">Milestones<div>0</div></a></li><li> <a href="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;tab=files&amp;action=index&amp;pid=60" class="files cpm-sm-col-12" title="Files">Files<div>0</div></a></li><li> <a href="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;tab=settings&amp;action=index&amp;pid=60" class="settings cpm-sm-col-12" title="Settings">Settings<div></div></a></li><li> <a href="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;tab=invoice&amp;action=index&amp;pid=60" class="cpminvoice cpm-sm-col-12" title="Invoice">Invoice<div></div></a></li>        </ul>

    </div>

    <div class="clearfix"></div>
</div>


<div id="cpm-signle-message"> 
    <div class="cpm-single">

        <h3 class="cpm-box-title">srthsrth            <span class="cpm-right cpm-edit-link">
                                    <a href="#" data-msg_id="97" data-project_id="60" class="cpm-msg-edit dashicons dashicons-edit"></a>
                                <span class="cpm-not-private"></span>
            </span>
            <div class="cpm-small-title">
                By <a href="http://localhost/test/wp-admin/admin.php?page=cpm_task&amp;user_id=1" title="admin">admin</a> on September 11, 2017  at  01:34 pm            </div>
        </h3>



        <div class="cpm-entry-detail">
            <div>drth aer gsrthsrth srth srt</div>

                    </div>

        <span class="cpm-msg-edit-form"></span>

    </div>


    </div><div class="cpm-comment-area cpm-box-shadow">

    <h3>4 Comments</h3>

    <ul class="cpm-comment-wrap">

            <li class="cpm-comment clearfix even" id="cpm-comment-309">
        <div class="cpm-avatar "><a href="http://localhost/test/wp-admin/admin.php?page=cpm_task&amp;user_id=1" title="admin"><img alt="admin" src="//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&amp;r=g&amp;d=mm" srcset="//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&amp;r=g&amp;d=mm 2x" class="avatar avatar-48 photo" height="48" width="48"></a></div>
        <div class="cpm-comment-container">
            <div class="cpm-comment-meta">
                <span class="cpm-author"><a href="http://localhost/test/wp-admin/admin.php?page=cpm_task&amp;user_id=1" title="admin">admin</a></span>
                On                <span class="cpm-date"><time datetime="2017-09-11T13:34:37+00:00" title="2017-09-11T13:34:37+00:00">September 11, 2017 1:34 pm</time></span>

                                    <div class="cpm-comment-action">
                        <span class="cpm-edit-link">
                            <a href="#" class="cpm-edit-comment-link dashicons dashicons-edit " data-comment_id="309" data-project_id="60" data-object_id="97"></a>
                        </span>

                        <span class="cpm-delete-link">
                            <a href="#" class="cpm-delete-comment-link dashicons dashicons-trash" data-project_id="60" data-id="309" data-confirm="Are you sure to delete this comment?"></a>
                        </span>
                    </div>
                            </div>
            <div class="cpm-comment-content">
                <div>awgraraet</div>
                            </div>

            <div class="cpm-comment-edit-form"></div>
        </div>

    </li>
        <li class="cpm-comment clearfix odd" id="cpm-comment-311">
        <div class="cpm-avatar "><a href="http://localhost/test/wp-admin/admin.php?page=cpm_task&amp;user_id=1" title="admin"><img alt="admin" src="//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&amp;r=g&amp;d=mm" srcset="//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&amp;r=g&amp;d=mm 2x" class="avatar avatar-48 photo" height="48" width="48"></a></div>
        <div class="cpm-comment-container">
            <div class="cpm-comment-meta">
                <span class="cpm-author"><a href="http://localhost/test/wp-admin/admin.php?page=cpm_task&amp;user_id=1" title="admin">admin</a></span>
                On                <span class="cpm-date"><time datetime="2017-09-11T13:34:41+00:00" title="2017-09-11T13:34:41+00:00">September 11, 2017 1:34 pm</time></span>

                                    <div class="cpm-comment-action">
                        <span class="cpm-edit-link">
                            <a href="#" class="cpm-edit-comment-link dashicons dashicons-edit " data-comment_id="311" data-project_id="60" data-object_id="97"></a>
                        </span>

                        <span class="cpm-delete-link">
                            <a href="#" class="cpm-delete-comment-link dashicons dashicons-trash" data-project_id="60" data-id="311" data-confirm="Are you sure to delete this comment?"></a>
                        </span>
                    </div>
                            </div>
            <div class="cpm-comment-content">
                <div>ssehse</div>
                            </div>

            <div class="cpm-comment-edit-form"></div>
        </div>

    </li>
        <li class="cpm-comment clearfix even" id="cpm-comment-313">
        <div class="cpm-avatar "><a href="http://localhost/test/wp-admin/admin.php?page=cpm_task&amp;user_id=1" title="admin"><img alt="admin" src="//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&amp;r=g&amp;d=mm" srcset="//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&amp;r=g&amp;d=mm 2x" class="avatar avatar-48 photo" height="48" width="48"></a></div>
        <div class="cpm-comment-container">
            <div class="cpm-comment-meta">
                <span class="cpm-author"><a href="http://localhost/test/wp-admin/admin.php?page=cpm_task&amp;user_id=1" title="admin">admin</a></span>
                On                <span class="cpm-date"><time datetime="2017-09-11T13:34:47+00:00" title="2017-09-11T13:34:47+00:00">September 11, 2017 1:34 pm</time></span>

                                    <div class="cpm-comment-action">
                        <span class="cpm-edit-link">
                            <a href="#" class="cpm-edit-comment-link dashicons dashicons-edit " data-comment_id="313" data-project_id="60" data-object_id="97"></a>
                        </span>

                        <span class="cpm-delete-link">
                            <a href="#" class="cpm-delete-comment-link dashicons dashicons-trash" data-project_id="60" data-id="313" data-confirm="Are you sure to delete this comment?"></a>
                        </span>
                    </div>
                            </div>
            <div class="cpm-comment-content">
                <div>szefbsrmyydtj th sr tjdryj dy</div>
                            </div>

            <div class="cpm-comment-edit-form"></div>
        </div>

    </li>
        <li class="cpm-comment clearfix odd" id="cpm-comment-315">
        <div class="cpm-avatar "><a href="http://localhost/test/wp-admin/admin.php?page=cpm_task&amp;user_id=1" title="admin"><img alt="admin" src="//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&amp;r=g&amp;d=mm" srcset="//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&amp;r=g&amp;d=mm 2x" class="avatar avatar-48 photo" height="48" width="48"></a></div>
        <div class="cpm-comment-container">
            <div class="cpm-comment-meta">
                <span class="cpm-author"><a href="http://localhost/test/wp-admin/admin.php?page=cpm_task&amp;user_id=1" title="admin">admin</a></span>
                On                <span class="cpm-date"><time datetime="2017-09-11T13:34:52+00:00" title="2017-09-11T13:34:52+00:00">September 11, 2017 1:34 pm</time></span>

                                    <div class="cpm-comment-action">
                        <span class="cpm-edit-link">
                            <a href="#" class="cpm-edit-comment-link dashicons dashicons-edit " data-comment_id="315" data-project_id="60" data-object_id="97"></a>
                        </span>

                        <span class="cpm-delete-link">
                            <a href="#" class="cpm-delete-comment-link dashicons dashicons-trash" data-project_id="60" data-id="315" data-confirm="Are you sure to delete this comment?"></a>
                        </span>
                    </div>
                            </div>
            <div class="cpm-comment-content">
                <div>drgsrt hsrt jrj dyj</div>
                            </div>

            <div class="cpm-comment-edit-form"></div>
        </div>

    </li>
    
    </ul>
    
    <div class="cpm-comment-form-wrap">

                    <div class="cpm-avatar"><a href="http://localhost/test/wp-admin/admin.php?page=cpm_task&amp;user_id=1" title="admin"><img alt="admin" src="//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&amp;r=g&amp;d=mm" srcset="//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&amp;r=g&amp;d=mm 2x" class="avatar avatar-48 photo" height="48" width="48"></a></div>
        
        <form class="cpm-comment-form ">

            <div class="item message cpm-sm-col-12 ">
                <input id="cpm-comment-editor-cm" type="hidden" name="cpm_message" value="">

            </div>

            <div class="cpm-attachment-area">
                    <div id="cpm-upload-container-cm" style="position: relative;">
        <div class="cpm-upload-filelist">
                    </div>
        To attach, <a id="cpm-upload-pickfiles-cm" href="#" style="position: relative; z-index: 1;">select files</a> from your computer.    <div id="html5_1bpoq08n61p7o669iciir2tmm3_container" class="moxie-shim moxie-shim-html5" style="position: absolute; top: 0px; left: 66px; width: 66px; height: 16px; overflow: hidden; z-index: 0;"><input id="html5_1bpoq08n61p7o669iciir2tmm3" type="file" style="font-size: 999px; opacity: 0; position: absolute; top: 0px; left: 0px; width: 100%; height: 100%;" multiple="" accept=""></div></div>
                </div>

            <div class="notify-users">
                
        <h2 class="cpm-box-title"> Notify users            <label class="cpm-small-title" for="select-all"> <input type="checkbox" name="select-all" id="select-all" class="cpm-toggle-checkbox"> Select all</label>
        </h2>

        <ul class="cpm-user-list">
            <li><label for="cpm_notify_1"><input type="checkbox" name="notify_user[]" id="cpm_notify_1" value="1"> Admin</label></li>
            <div class="clearfix"></div>
        </ul>
                    </div>

            
            <div class="submit">
                <input type="submit" class="button-primary" name="cpm_new_comment" value="Add this comment" id="">

                
                <input type="hidden" name="parent_id" value="97">
                <input type="hidden" name="project_id" value="60">
                <input type="hidden" name="action" value="cpm_comment_new_old">
            </div>
            <div class="cpm-loading" style="display: none;">Saving...</div>
        </form>
    </div>
    </div></div>
</template>

<script>
	export default {

	}	
</script>

