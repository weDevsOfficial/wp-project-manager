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
                                    <span class=""> 
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
                               



                               
                                <div class="comment-content">
                                    <cpm-task-comments :comments="task.comments" :task="task"></cpm-task-comments>

                                </div>

                                
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


