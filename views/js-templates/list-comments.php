<div>

 
        <h3 class="cpm-comment-title"><?php _e( 'Discuss this to-do list', 'cpm' ); ?></h3>

        <ul class="cpm-comment-wrap">
            <li class="cpm-comment clearfix even" v-for="comment in comments">
                
                <div class="cpm-avatar" v-html="comment.avatar"></div>

                <div class="cpm-comment-container">
                    <div class="cpm-comment-meta">
                        <span class="cpm-author" v-html="comment.comment_user"></span>
                        <span><?php _e( 'On', 'cpm' ); ?></span>
                        <span class="cpm-date">
                            <time :datetime="dateISO8601Format( comment.comment_date )" :title="dateISO8601Format( comment.comment_date )">{{ dateTimeFormat( comment.comment_date ) }}</time>
                        </span>

                        <div class="cpm-comment-action">
                            <span class="cpm-edit-link">
                                <a href="#" class="cpm-edit-comment-link dashicons dashicons-edit " data-comment_id="82" data-project_id="111" data-object_id="112"></a>
                            </span>

                            <span class="cpm-delete-link">
                                <a href="#" class="cpm-delete-comment-link dashicons dashicons-trash" data-project_id="111" data-id="82" data-confirm="Are you sure to delete this comment?"></a>
                            </span>
                        </div>
                    </div>
                    <div class="cpm-comment-content">
                        <div v-html="comment.comment_content"></div>
                        <ul class="cpm-attachments">
                            <li v-for="file in comment.files">
                                <a class="cpm-colorbox-img" :href="file.url" title="file.name" target="_blank">
                                    <img :src="file.thumb">
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div class="cpm-comment-edit-form"></div>
                </div>
            </li>
        </ul>
        <div class="single-todo-comments">
            <div class="cpm-comment-form-wrap">

                <div class="cpm-avatar"><img :src="getCurrentUserAvatar" height="48" width="48"/></div>
                
                <form class="cpm-comment-form" @submit="updateComment()">

                    <div class="item message cpm-sm-col-12 ">
                        <cpm-text-editor :editor_id="editor_id" :content="content"></cpm-text-editor>
                    </div>

                    <cpm-file-uploader :files="files"></cpm-file-uploader>

                    <div class="notify-users">
                        <h2 class="cpm-box-title"> <?php _e( 'Notify users', 'cpm' ); ?>
                            <label class="cpm-small-title" for="select-all"> <input type="checkbox" name="select-all" id="select-all" class="cpm-toggle-checkbox" /> <?php _e( 'Select all', 'cpm' ); ?></label>
                        </h2>

                            <ul class='cpm-user-list' >
                                
                                    <input type="checkbox" name="notify_user[]" id="cpm_notify_%1$s" value="%1$s" />
                                    <li><label for="cpm_notify_%d">jj hjh</label></li>
                                

                                <div class='clearfix'></div>
                            </ul>
                        
                    </div>

                    <?php do_action( 'cpm_comment_form' ); ?>

                    <div class="submit">
                        <input type="submit" class="button-primary" name="cpm_new_comment" value="<?php _e( 'Add New Commment', 'cpm' ); ?>" id="" />
                    </div>
                    <!-- <div class="cpm-loading" ><?php _e( 'Saving...', 'cpm' ); ?></div> -->
                </form>
            </div>
        </div>
    

</div>