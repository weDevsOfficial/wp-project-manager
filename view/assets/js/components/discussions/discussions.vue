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
                    <a class="cpm-duplicate-project" href="/test/wp-admin/admin.php?page=cpm_projects&amp;tab=message&amp;action=index&amp;pid=60" data-project_id="60">
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

        <input type="hidden" id="_wpnonce" name="_wpnonce" value="e670638933"><input type="hidden" name="_wp_http_referer" value="/test/wp-admin/admin.php?page=cpm_projects&amp;tab=message&amp;action=index&amp;pid=60">
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

          <div>
            <a class="cpm-btn cpm-plus-white cpm-new-message-btn cpm-btn-uppercase" href="" id="cpm-add-message"> Add New Discussion </a>
        </div>
        <div class="cpm-new-message-form">
            <h3>Create a new message</h3>

                <form class="cpm-message-form">

        <input type="hidden" id="_wpnonce" name="_wpnonce" value="da9995404a"><input type="hidden" name="_wp_http_referer" value="/test/wp-admin/admin.php?page=cpm_projects&amp;tab=message&amp;action=index&amp;pid=60">
        <div class="item title">
            <input name="message_title" required="required" type="text" id="message_title" value="" placeholder="Enter message title">
        </div>

        <div class="item detail">
            <input id="message_detail" type="hidden" name="message_detail" value="">

        </div>

        <div class="item milestone">
            <select name="milestone" id="milestone">
                <option value="0">- Milestone -</option>
                            </select>
        </div>

                    <div class="cpm-make-privacy">
                <label>
                                        <input type="checkbox" value="yes" name="message_privacy">
                    Private                </label>
            </div>
            
        <div class="cpm-attachment-area">
                <div id="cpm-upload-container-nd" style="position: relative;">
        <div class="cpm-upload-filelist">
                    </div>
        To attach, <a id="cpm-upload-pickfiles-nd" href="#" style="position: relative; z-index: 1;">select files</a> from your computer.    <div id="html5_1bpoid5a01j4s5vi1olihdq11kd3_container" class="moxie-shim moxie-shim-html5" style="position: absolute; top: 0px; left: 0px; width: 0px; height: 0px; overflow: hidden; z-index: 0;"><input id="html5_1bpoid5a01j4s5vi1olihdq11kd3" type="file" style="font-size: 999px; opacity: 0; position: absolute; top: 0px; left: 0px; width: 100%; height: 100%;" multiple="" accept=""></div></div>
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
            <input type="hidden" name="action" value="cpm_message_new">
            <input type="hidden" name="project_id" value="60">

                            <input type="hidden" name="message_id" value="nd">
                        <input type="submit" name="create_message" id="create_message" class="button-primary" value="Add Message">
            <a href="" class="message-cancel button-secondary">Cancel</a>
        </div>
        <div class="cpm-loading" style="display: none;">Saving...</div>
    </form>

            </div>

    
<div class="cpm-row cpm-message-page">
    <div class="cpm-message-list cpm-col-12 cpm-sm-col-12">
        <div class="cpm-box-title">Discussion List</div>
        <ul class="dicussion-list">        <li class="cpm-col-12">

            <div class="cpm-col-9" itemref="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;tab=message&amp;action=single&amp;pid=60&amp;mid=97">
            	
            	<router-link 
					class="cpm-pagination-btn prev page-numbers" 
					:to="{ name: 'individual_discussions',  params: { discussion_id: 3 }}">
					<img alt="admin" src="//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&amp;r=g&amp;d=mm" srcset="//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&amp;r=g&amp;d=mm 2x" class="avatar avatar-48 photo" height="48" width="48">
					<div>
                       srthsrth                    
                	</div>
                	
				</router-link>


                <!-- <a href="http://localhost/test/wp-admin/admin.php?page=cpm_task&amp;user_id=1" title="admin">
                	<img alt="admin" src="//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&amp;r=g&amp;d=mm" srcset="//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&amp;r=g&amp;d=mm 2x" class="avatar avatar-48 photo" height="48" width="48">
                	<div>
                       srthsrth                    
                	</div>
                </a> -->
               
                <div class="dicussion-meta">
                    By 
                    <a href="http://localhost/test/wp-admin/admin.php?page=cpm_task&amp;user_id=1" title="admin">
                    	admin
                    </a> 
                    on September 11, 2017 01:34 pm                    
                </div>

            </div>

            <div class="cpm-col-1">
                <span class="cpm-message-action cpm-right">
                                            <a href="" class="delete-message" title="Delete this message" data-msg_id="97" data-project_id="60" data-confirm="Are you sure to delete this message?">
                            <span class="dashicons dashicons-trash"></span>
                        </a>

                        <span class="cpm-unlock"></span>
                                    </span>
            </div>

            <div class="cpm-col-2 cpm-last-col cpm-right comment-count" itemref="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;tab=message&amp;action=single&amp;pid=60&amp;mid=97">
                 4 Comments            </div>

                <div class="clear"></div>

            </li>
                <li class="cpm-col-12">

            <div class="cpm-col-9" itemref="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;tab=message&amp;action=single&amp;pid=60&amp;mid=96">
                <a href="http://localhost/test/wp-admin/admin.php?page=cpm_task&amp;user_id=1" title="admin"><img alt="admin" src="//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&amp;r=g&amp;d=mm" srcset="//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&amp;r=g&amp;d=mm 2x" class="avatar avatar-48 photo" height="48" width="48"></a>
                    <div>
                       kafd                    </div>
                    <div class="dicussion-meta">
                        By <a href="http://localhost/test/wp-admin/admin.php?page=cpm_task&amp;user_id=1" title="admin">admin</a> on September 11, 2017 01:34 pm                    </div>

            </div>

            <div class="cpm-col-1">
                <span class="cpm-message-action cpm-right">
                                            <a href="" class="delete-message" title="Delete this message" data-msg_id="96" data-project_id="60" data-confirm="Are you sure to delete this message?">
                            <span class="dashicons dashicons-trash"></span>
                        </a>

                        <span class="cpm-unlock"></span>
                                    </span>
            </div>

            <div class="cpm-col-2 cpm-last-col cpm-right comment-count" itemref="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;tab=message&amp;action=single&amp;pid=60&amp;mid=96">
                 0 Comments            </div>

                <div class="clear"></div>

            </li>
                <li class="cpm-col-12">

            <div class="cpm-col-9" itemref="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;tab=message&amp;action=single&amp;pid=60&amp;mid=95">
                <a href="http://localhost/test/wp-admin/admin.php?page=cpm_task&amp;user_id=1" title="admin"><img alt="admin" src="//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&amp;r=g&amp;d=mm" srcset="//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&amp;r=g&amp;d=mm 2x" class="avatar avatar-48 photo" height="48" width="48"></a>
                    <div>
                       message 1                    </div>
                    <div class="dicussion-meta">
                        By <a href="http://localhost/test/wp-admin/admin.php?page=cpm_task&amp;user_id=1" title="admin">admin</a> on September 11, 2017 01:33 pm                    </div>

            </div>

            <div class="cpm-col-1">
                <span class="cpm-message-action cpm-right">
                                            <a href="" class="delete-message" title="Delete this message" data-msg_id="95" data-project_id="60" data-confirm="Are you sure to delete this message?">
                            <span class="dashicons dashicons-trash"></span>
                        </a>

                        <span class="cpm-unlock"></span>
                                    </span>
            </div>

            <div class="cpm-col-2 cpm-last-col cpm-right comment-count" itemref="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;tab=message&amp;action=single&amp;pid=60&amp;mid=95">
                 0 Comments            </div>

                <div class="clear"></div>

            </li>
        </ul>    </div>

    <div class="clear"></div>
</div>
<div class="cpm-blank-template discussion" style="display: none">
    <div class="cpm-content">
        <h2 class="cpm-page-title">  Discussion </h2>

        <p>
            Use our built in discussion panel to create an open discussion, a group discussion or a private conversation. Note that the Admin can always moderate these discussions.        </p>


                    <div>
                <a class="cpm-btn cpm-plus-white cpm-new-message-btn cpm-btn-uppercase" href="" id="cpm-add-message-new"> Add New Discussion </a>
            </div>
            <div class="cpm-new-message-form" id="cpm-new-message-form-content">
                <h3>Create a new message</h3>

        <form class="cpm-message-form">

        <input type="hidden" id="_wpnonce" name="_wpnonce" value="da9995404a"><input type="hidden" name="_wp_http_referer" value="/test/wp-admin/admin.php?page=cpm_projects&amp;tab=message&amp;action=index&amp;pid=60">
        <div class="item title">
            <input name="message_title" required="required" type="text" id="message_title" value="" placeholder="Enter message title">
        </div>

        <div class="item detail">
            <input id="message_detail" type="hidden" name="message_detail" value="">

        </div>

        <div class="item milestone">
            <select name="milestone" id="milestone">
                <option value="0">- Milestone -</option>
                            </select>
        </div>

                    <div class="cpm-make-privacy">
                <label>
                                        <input type="checkbox" value="yes" name="message_privacy">
                    Private                </label>
            </div>
            
        <div class="cpm-attachment-area">
                <div id="cpm-upload-container-nd">
        <div class="cpm-upload-filelist">
                    </div>
        To attach, <a id="cpm-upload-pickfiles-nd" href="#">select files</a> from your computer.    </div>
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
            <input type="hidden" name="action" value="cpm_message_new">
            <input type="hidden" name="project_id" value="60">

                            <input type="hidden" name="message_id" value="nd">
                        <input type="submit" name="create_message" id="create_message" class="button-primary" value="Add Message">
            <a href="" class="message-cancel button-secondary">Cancel</a>
        </div>
        <div class="cpm-loading" style="display: none;">Saving...</div>
    </form>

                </div>

        <div class="cpm-list-content">
            <h2 class="cpm-why-for cpm-page-title"> When to use Discussions? </h2>

            <ul class="cpm-list">
                <li> To discuss a work matter privately. </li>
                <li> To exchange files privately.  </li>
                <li> To discuss in a group.  </li>
                <li> To create an open discussion visible to all.  </li>

            </ul>
        </div>
    </div>
</div>

</div>

</template>


<script>

	export default {

	}
</script>