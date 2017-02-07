<div>

	 <form class="cpm-comment-form" @submit.prevent="updateComment()">

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
            <input type="submit" class="button-primary"  value="<?php _e( 'Add New Commment', 'cpm' ); ?>" id="" />
        </div>
        <!-- <div class="cpm-loading" ><?php _e( 'Saving...', 'cpm' ); ?></div> -->
    </form>
</div>