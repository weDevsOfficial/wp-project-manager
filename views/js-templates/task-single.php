<div>
    <!-- Spinner before load task -->
    <div v-if="loading" class="modal-mask half-modal cpm-task-modal modal-transition">
        <div class="modal-wrapper">
            <div class="modal-container" style="width: 700px; height: 20000px;">
                <span class="close-vue-modal">
                    <a class="" @click.prevent="closePopup()"><span class="dashicons dashicons-no"></span></a>
                </span>

                <div class="modal-body cpm-todolist">
                    
                    <!-- Spinner before load task -->
                    <div class="cpm-data-load-before" >
                        <div class="loadmoreanimation">
                            <div class="load-spinner">
                                <div class="rect1"></div>
                                <div class="rect2"></div>
                                <div class="rect3"></div>
                                <div class="rect4"></div>
                                <div class="rect5"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <div v-if="is_single_task">
        <div v-if="task" class="modal-mask half-modal cpm-task-modal modal-transition" style="">

            <div class="modal-wrapper">
                <div class="modal-container" style="width: 700px;">
                    <span class="close-vue-modal">
                        <a class="" @click.prevent="closePopup()"><span class="dashicons dashicons-no"></span></a>
                    </span>


                    <div class="modal-body cpm-todolist">
                        <div class="cpm-col-12 cpm-todo">
                        
                            <div class="cpm-modal-conetnt">
                                <div class="cmp-task-header">
                                    <h3 class="cpm-task-title"> 
                                        <input v-model="task.completed" @click="taskDoneUndone( task, task.completed )" class="" type="checkbox">
                                        <span :class="singleTaskTitle(task)">{{ task.post_title }}</span>

                                        <span v-if="task.task_privacy == 'yes'" class="cpm-lock" title="Private Task"></span>
                                    </h3>
                                    
                                    <div class="cpm-task-meta">
                                         <span class='cpm-assigned-user' 
                                            v-for="user in getUsers( task.assigned_to )" 
                                            v-html="user.user_url">

                                        </span>
                                        
                                        <span :class="taskDateWrap( task.start_date, task.due_date )">
                                            <span v-if="task_start_field">{{ dateFormat( task.start_date ) }}</span>
                                            <span v-if="isBetweenDate( task_start_field, task.start_date, task.due_date )">&ndash;</span>
                                            <span>{{ dateFormat( task.due_date ) }}</span>
                                        </span>

                                        <span class="cpm-task-comment-count">{{ task.comments.length }} <?php _e( 'Comments', 'cpm' ); ?></span>
                                    </div>
                                </div>


                                <div class="task-details ">
                                    <!--v-if-->
                                    <p v-html="task.post_content"></p>

                                    <!--<span>
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

                                    </span>--><!--v-if-->

                                    <div class="clearfix cpm-clear"></div>
                                </div>
                                
                                <?php do_action( 'after_task_details' ); ?>    

                                <div class="cpm-todo-wrap clearfix">
                                    <div class="cpm-task-comment">
                                        <div class="comment-content">
                                            <cpm-task-comments :comments="task.comments" :task="task"></cpm-task-comments>
                                        </div>
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
</div>


