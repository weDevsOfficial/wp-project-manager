<div class="cpm-task-comment-wrap">

        <h3 class="cpm-comment-title"><?php _e( 'Discuss this task', 'cpm' ); ?></h3>

        <ul class="cpm-comment-wrap">
            <li  v-for="comment in comments" :key="comment.comment_ID" :class="'cpm-comment clearfix even cpm-fade-out-'+comment.comment_ID">

                <div class="cpm-avatar" v-html="comment.avatar"></div>

                <div class="cpm-comment-container">
                    <div class="cpm-comment-meta">
                        <span class="cpm-author" v-html="comment.comment_user"></span>
                        <span><?php _e( 'On', 'cpm' ); ?></span>
                        <span class="cpm-date">
                            <time :datetime="dateISO8601Format( comment.comment_date )" :title="dateISO8601Format( comment.comment_date )">{{ dateTimeFormat( comment.comment_date ) }}</time>
                        </span>
                        
                        <div v-if="current_user_can_edit_delete(comment, task)" class="cpm-comment-action">
                            <span class="cpm-edit-link">
                                <a href="#" @click.prevent="showHideTaskCommentEditForm( task, comment.comment_ID )" class="dashicons dashicons-edit"></a>
                            </span>

                            <span class="cpm-delete-link">
                                <a href="#" @click.prevent="deleteTaskComment( comment.comment_ID, task )" class="dashicons dashicons-trash" data-project_id="111" data-id="82" data-confirm="Are you sure to delete this comment?"></a>
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

                    <div class="cpm-comment-edit-form" v-if="comment.edit_mode">
                        <div :class="'cpm-slide-'+comment.comment_ID" style="display: none;">
                            <cpm-task-comment-form :comment="comment" :task="task"></cpm-task-comment-form>
                        </div>
                    </div>
                </div>
            </li>
        </ul>
        <div class="single-todo-comments">
            <div class="cpm-comment-form-wrap">

                <div class="cpm-avatar"><img :src="getCurrentUserAvatar" height="48" width="48"/></div>
                <div class="cpm-new-doc-comment-form">
                    <cpm-task-comment-form :comment="{}" :task="task"></cpm-task-comment-form>
                </div><!--v-end--><!--v-component-->
            </div>
        </div>
</div>