<div>
    <div class="modal-mask half-modal cpm-task-modal modal-transition" style="">

        <div class="modal-wrapper">
            <div class="modal-container" style="width: 700px;">
                <span class="close-vue-modal">
                    <a class="" @click.prevent="closePopup()"><span class="dashicons dashicons-no"></span></a>
                </span>


                <div class="modal-body cpm-todolists">
                    <div class="cpm-col-12 cpm-todo">

                        <div class="cpm-modal-conetnt">
                            <h3>
                                <input class="" type="checkbox">
                                {{ task.post_title }}
                                <span v-if="task.task_privacy == 'no'" class="cpm-lock" title="Private Task"></span>
                            </h3>


                            <div class="task-details ">
                                <!--v-if-->
                                <p><p>{{ task.post_content }}</p></p>
                                <span>
                                    <span class='cpm-assigned-user' 
                                        v-for="user in getUsers( task.assigned_to )" 
                                        v-html="user.user_url">

                                    </span>
                                    <span class="cpm-due-date"> 
                                        <span :class="taskDateWrap( task.start_date, task.due_date )">
                                            <span v-if="task_start_field">{{ dateFormat( task.start_date ) }}</span>
                                            <span v-if="isBetweenDate( task_start_field, task.start_date, task.due_date )">&ndash;</span>
                                            <span>{{ dateFormat( task.due_date ) }}</span>
                                        </span>
                                    </span>

                                </span><!--v-if-->

                                <span class="">{{ task.comments.length }} <?php _e( 'Comments', 'cpm' ); ?></span>


                                <div class="clearfix cpm-clear"></div>
                            </div>
                                        

                            <div class="cpm-todo-wrap clearfix">
                               



                                <h3><?php _e( 'Comments', 'cpm'); ?></h3>
                                <div class="comment-content">
                                    <ul class="cpm-comment-wrap">
                                        <li class="cpm-comment">
                                            <div class="cpm-right">
                                                <a href="#" class="cpm-btn cpm-btn-xs"><span class="dashicons dashicons-trash"></span></a>
                                            </div>
                                            <div class="cpm-avatar "><img alt="" src="http://0.gravatar.com/avatar/c87a74ffe6e96d07200fb4b7d7a6b37d?s=96&amp;d=mm&amp;r=g" srcset="http://0.gravatar.com/avatar/c87a74ffe6e96d07200fb4b7d7a6b37d?s=192&amp;d=mm&amp;r=g 2x" class="avatar avatar-96 photo" height="96" width="96"><!--v-html--></div>
                                            <div class="cpm-comment-container">
                                                <div class="cpm-comment-meta">
                                                    <span class="cpm-author">Ashraf Hossain</span>
                                                    On
                                                    <span class="cpm-date">2016-10-07 11:02:03</span>

                                                </div>
                                                <div class="cpm-comment-content">
                                                    Re-opened to-do<!--v-html-->
                                                </div>

                                                <!--v-if-->

                                            </div>

                                        </li><!--v-for-end-->
                                    </ul>

                                </div>
                                <pre>{{ task }}</pre>

                                <div class="cpm-new-doc-comment-form">
                                    <cpm-task-comment-form :comment="{}" :task="task"></cpm-task-comment-form>
                                </div><!--v-end--><!--v-component-->
                            </div>          
                        </div>
                        <div class="clearfix"></div>
                    </div>
                </div>
                <div class="clearfix"></div>
            </div>
        </div>
    </div>
</div>


