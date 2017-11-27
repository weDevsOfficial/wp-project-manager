<div class="cpm-comment-form">

	 <form class="cpm-comment-form-vue" @submit.prevent="updateComment()">

        <div class="item message cpm-sm-col-1">
            <cpm-text-editor :editor_id="editor_id" :content="content"></cpm-text-editor>
        </div>
        <cpm-file-uploader :files="files"></cpm-file-uploader>

        <div v-if="hasCoWorker" class="notify-users">
                        
                <h2 class="cpm-box-title"> 
                    <?php _e( 'Notify users', 'cpm' ); ?>            
                    <label class="cpm-small-title" for="select-all"> 
                        <input @change.prevent="notify_all_coo_worker()" type="checkbox" v-model="notify_all_user" id="select-all" class="cpm-toggle-checkbox"> 
                        <?php _e( 'Select all', 'cpm' ); ?>
                    </label>
                </h2>

                <ul class="cpm-user-list">
                    <li v-for="co_worker in co_workers" :key="co_worker.id">
                        <label :for="'cpm_notify_' + co_worker.id">
                            <input @change.prevent="notify_coo_workers( co_worker.id )" type="checkbox" v-model="notify_user" name="notify_user[]" :value="co_worker.id" :id="'cpm_notify_' + co_worker.id" > 
                            {{ co_worker.name }}
                        </label>
                    </li>

                    <div class="clearfix"></div>
                </ul>
        </div>

        <?php do_action( 'cpm_comment_form' ); ?>
        
        <div class="submit">
            <input v-if="!comment.edit_mode" :disabled="submit_disabled" type="submit" class="button-primary"  value="<?php _e( 'Add New Comment', 'cpm' ); ?>" id="" />
            <input v-if="comment.edit_mode" :disabled="submit_disabled" type="submit" class="button-primary"  value="<?php _e( 'Update Comment', 'cpm' ); ?>" id="" />
            <span v-show="show_spinner" class="cpm-spinner"></span>
        </div>
    </form>
</div>