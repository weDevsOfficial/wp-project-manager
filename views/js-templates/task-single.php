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
                                        <span class="cpm-mark-done-checkbox"><input v-model="task.completed" @click="taskDoneUndone( task, task.completed )" class="" type="checkbox"></span>
                                        <span :class="singleTaskTitle(task) + ' cpm-task-title-wrap'">
                                            <div class="cpm-task-title-text">
                                                
                                                <span v-if="is_task_title_edit_mode">
                                                    <input 
                                                        v-model="task.post_title"
                                                        @blur="updateTaskElement(task)" 
                                                        @keyup.enter="updateTaskElement(task)"
                                                        :value="task.post_title" 
                                                        class="cpm-task-title-activity"
                                                        type="text">
                                                </span>
                                                
                                                <span class="cpm-task-title-activity" v-if="!is_task_title_edit_mode" @click.prevent="isTaskTitleEditMode()">{{ task.post_title }}</span>
                                            </div>
                                            <div class="cpm-task-title-meta">
                                                <span v-if="task.task_privacy == 'yes'" class="dashicons dashicons-lock" title="Private Task"></span>
                                                <a v-if="!is_task_title_edit_mode" href="#" class="cpm-todo-edit" @click.prevent="isTaskTitleEditMode()"><span class="dashicons dashicons-edit cpm-task-title-activity" title="Edit Task Title"></span></a>
                                            </div>
                                            <div class="clearfix cpm-clear"></div>
                                        </span>

                                        <div class="clearfix cpm-clear"></div>
                                    </h3>
                                    
                                    <div class="cpm-task-meta">
                                         <span class='cpm-assigned-user' 
                                            v-for="user in getUsers( task.assigned_to )" 
                                            v-html="user.user_url">

                                        </span>
                                        
                                        <span v-bind:class="task.completed ? completedTaskWrap(task.start_date, task.due_date) : taskDateWrap( task.start_date, task.due_date)">
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
                                            <span v-bind:class="task.completed ? completedTaskWrap(task.start_date, task.due_date) : taskDateWrap( task.start_date, task.due_date)">
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


