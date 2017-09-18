<template>
	<div class="wrap cpm cpm-front-end">
        <pm-header></pm-header>

        <div>
            <a @click.prevent="showHideDiscussForm('toggle')" class="cpm-btn cpm-plus-white cpm-new-message-btn cpm-btn-uppercase" href="" id="cpm-add-message"> 
                Add New Discussion 
            </a>
        </div>
        <div class="cpm-new-message-for">
            <h3>Create a new message</h3>

            <new-discuss-form v-if="is_discuss_form_active"></new-discuss-form>

        </div>

    
        <div class="cpm-row cpm-message-page">
            <div class="cpm-message-list cpm-col-12 cpm-sm-col-12">
                <div class="cpm-box-title">Discussion List</div>
                <ul class="dicussion-list">        
                    <li class="cpm-col-12">

                        <div class="cpm-col-9" itemref="http://localhost/test/wp-admin/admin.php?page=cpm_projects&amp;tab=message&amp;action=single&amp;pid=60&amp;mid=97">
                        	
                        	<router-link 
            					class="cpm-pagination-btn prev page-numbers" 
            					:to="{ name: 'individual_discussions',  params: { discussion_id: 3 }}">
            					<img alt="admin" src="//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&amp;r=g&amp;d=mm" srcset="//www.gravatar.com/avatar/873b98cc2b8493be36707ba58929dfec?s=48&amp;r=g&amp;d=mm 2x" class="avatar avatar-48 photo" height="48" width="48">
            					<div>
                                   srthsrth                    
                            	</div>
                            	
            				</router-link>
                           
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
                             4 Comments            
                        </div>

                        <div class="clear"></div>

                    </li>
             
                </ul>    
            </div>
            <div class="clear"></div>
        </div>
        
        <div class="cpm-blank-template discussion" style="display: none;">
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
                                Private                
                            </label>
                        </div>
                            
                        <div class="cpm-attachment-area">
                            <div id="cpm-upload-container-nd">
                                <div class="cpm-upload-filelist"></div>
                                To attach, 
                                <a id="cpm-upload-pickfiles-nd" href="#">select files</a> from your computer.    
                            </div>
                        </div>

                        <div class="notify-users">
                            
                            <h2 class="cpm-box-title"> 
                                Notify users            
                                <label class="cpm-small-title" for="select-all"> 
                                    <input type="checkbox" name="select-all" id="select-all" class="cpm-toggle-checkbox"> 
                                    Select all
                                </label>
                            </h2>

                            <ul class="cpm-user-list">
                                <li>
                                    <label for="cpm_notify_1">
                                        <input type="checkbox" name="notify_user[]" id="cpm_notify_1" value="1"> 
                                        Admin
                                    </label>
                                </li>
                                <div class="clearfix"></div>
                            </ul>
                        </div>

                        
                        <div class="submit">

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
    import header from './../header.vue';
    import new_discuss_form from './new-discuss-form.vue';

    export default {
        components: {
            'pm-header': header,
            'new-discuss-form': new_discuss_form
        },
        computed: {
            is_discuss_form_active () {
                return this.$store.state.is_discuss_form_active;
            }
        }
    }

</script>
