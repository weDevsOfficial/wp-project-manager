<?php
/**
 * This page displays all the messages attached with a project
 *
 */

$msg_obj = CPM_Message::getInstance();
$pro_obj = CPM_Project::getInstance();

    if ( cpm_user_can_access( $project_id, 'msg_view_private' ) ) {
        $messages = $msg_obj->get_all( $project_id, true );
    } else {
        $messages = $msg_obj->get_all( $project_id );
    }




cpm_get_header( __( 'Discussion', 'cpm' ), $project_id );
$can_create = cpm_user_can_access( $project_id, 'create_message' );
?>
<div class="cpm-row cpm-message-page" id="discussion_list">
    <div class="cpm-col-3 cpm-message-list">
        <?php if ( $can_create ) { ?>
        <div>
            <a class="cpm-btn cpm-plus-white cpm-add-message " href="#" v-on:click="toggelForm"> <?php _e( 'ADD NEW DISCUSSION', 'cpm' ); ?> </a>
        </div>


    <?php } ?>

        <ul id="" >
            <li v-for="msg in massage_list" v-on:click="loadSingleDiscussion(msg.discus_id)" >

                 <div class="cpm-col-2">
                        {{{msg.avatar}}}
                 </div>
                <div class="cpm-col-10">
                            <div>
                                {{{msg.post_title}}}
                                <span class="cpm-message-action" >
                                </span>
                            </div>
                            <div>
                                {{{msg.post_content}}}
                            </div>
                            <div>
                                 {{{msg.post_date}}}
                                <span class="comment-count"> {{{msg.comment_count}}}</span>
                            </div>
                        </div>

                <div class="clear"></div>
            </li>
        </ul>
    </div>

    <div class="cpm-col-9 cpm-message-body">
        <div class="cpm-message-content" id="single_discussion">
            <div v-show="showsigle">
            <h3>{{{message.post_title}}}</h3>
            <p>{{{message.post_content}}}</p>
            <div>
                <div>
                    <ul >
                        <li v-for="file in message.files" v-if="file.name != '' " >
                            <div v-if="file.type == 'image'" >
                                <a href="{{{file.url}}}" > {{{file.thumb}}} {{{file.name}}} </a>
                            </div>
                            <div v-else>
                                <a href="{{{file.url}}}" >  {{{file.name}}} </a>
                            </div>
                        </li>
                    </ul>
                </div>

            </div>
            <div>{{parseInt(message.comment_count)}} {{parseInt(message.comment_count) | pluralize 'Comment'}} </div>

            <div class="comment_show">
                <ul >
                    <li v-for="comment in message.comments_list" class="comment_{{comment.comment_ID}}">
                        <div>

                             <div class="cpm-col-1"  >
                                {{{comment.avatar}}}
                             </div>
                            <div class="cpm-col-11">
                                <div>
                                     {{comment.comment_author }} On {{comment.comment_date}}
                                    <span class="cpm-right" v-if="checkEDAccess(comment.user_id, comment.comment_type )">
                                            <a href="JavaScript:void(0)" class="edit" v-on:click="editcomment(message.ID, comment.comment_ID)"> </a>
                                            <a href="JavaScript:void(0)" class="del" v-on:click="delcomment(comment.comment_ID, message.ID)"> </a>
                                    </span>
                                </div>
                                <div>  {{{comment.comment_content}}} </div>
                            </div>
                            <div class="clear"></div>
                        </div>
                        <div >
                           <?php
                            $mid = "{{message.ID}}";

                           cpm_discussion_comment_form( $project_id, $mid, $comment ) ?>
                        </div>
                    </li>
                </ul>

                <div class="cpm-comment-form">
                    <h2> <b><?php _e('Leave a', 'cpm') ?></b> Reply  </h2>
                    <?php
                    $mid = "{{message.ID}}";
                    echo cpm_discussion_comment_form( $project_id, $mid  ) ;  ?>
                </div>
            </div>
            </div>
            <div v-show="showform">
                 <?php if ( $can_create ) { ?>

                <div class="cpm-new-message-form">
                    <h3><?php _e( 'Create a new message', 'cpm' ); ?></h3>
                    <?php echo cpm_message_form( $project_id ); ?>
                </div>
            <?php } ?>
            </div>




        </div>
    </div>
    <div class="clear"></div>
</div>










