<div> 
    <router-link to="/"><?php _e( 'To-do Lists', 'cpm' ); ?></router-link>

    <todo-lists></todo-lists>






    










    <h3 class="cpm-comment-title"><?php _e( 'Discuss this to-do list', 'cpm' ); ?></h3>

    <ul class="cpm-comment-wrap">
    
    </ul>
    <div class="single-todo-comments">

        <div class="cpm-comment-form-wrap">

            
            <div class="cpm-avatar"><img :src="getCurrentUserAvatar" height="48" width="48"/></div>
            

            <form class="cpm-comment-form ">


                <div class="item message cpm-sm-col-12 ">
                    <div>
                        <cpm-text-editor :editor_id="editor_id" :content="content"></cpm-text-editor>
                        <!-- <textarea v-cpm-editor ></textarea> -->
                    </div>
                
                </div>

                <div class="cpm-attachment-area">
                    <div id="cpm-upload-container<?php echo $id; ?>">
                        <div class="cpm-upload-filelist">
                            <div class="cpm-uploaded-item">
                                <a href="#" class="cpm-delete-file button">Delete File</a>
                                <input type="hidden" name="cpm_attachment[]" value="4" />
                                <a href="file_url" target="_blank"><img src="thumb" alt="file_name" /></a>
                            </div>             
                        </div>
                        <?php printf( '%s, <a id="cpm-upload-pickfiles%s" href="#">%s</a> %s.', __( 'To attach', 'cpm' ), $id, __( 'select files', 'cpm' ), __( 'from your computer', 'cpm' ) ); ?>
                    </div>
                </div>

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
                    <input type="submit" class="button-primary" name="cpm_new_comment" value="select" id="" />

                    
                        <input type="hidden" name="comment_id" value="" />
                        <a href="#" class="cpm-comment-edit-cancel button" data-comment_id=""><?php _e( 'Cancel', 'wedevs' ); ?></a>
                    

                    
                </div>
                <div class="cpm-loading" ><?php _e( 'Saving...', 'cpm' ); ?></div>
            </form>
        </div>
    </div>
</div>

