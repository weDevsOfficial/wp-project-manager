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
                                                
                                                <span  v-if="is_task_title_edit_mode">
                                                    <input 
                                                        v-model="task.post_title"
                                                        @blur="updateTaskElement(task)" 
                                                        @keyup.enter="updateTaskElement(task)"
                                                        :value="task.post_title" 
                                                        class="cpm-task-title-activity cpm-task-title-field"
                                                        type="text">
                                                </span>
                                                
                                                <span class="cpm-task-title-activity cpm-task-title-span" v-if="!is_task_title_edit_mode" @click.prevent="isTaskTitleEditMode()">{{ task.post_title }}</span>
                                            </div>
                                            <div class="cpm-task-title-meta">
                                                <span v-if="task.task_privacy == 'yes'" @click.prevent="updateTaskPrivacy(task, 'no')" v-cpm-tiptip class="dashicons dashicons-lock cpm-tiptip" title="<?php _e( 'Make public', 'cpm' ); ?>"></span>
                                                <span v-if="task.task_privacy != 'yes'" @click.prevent="updateTaskPrivacy(task, 'yes')" v-cpm-tiptip class="dashicons dashicons-unlock cpm-tiptip" title="<?php _e( 'Make private', 'cpm' ); ?>"></span>
                                                <!-- <a v-if="!is_task_title_edit_mode" href="#" class="cpm-todo-edit" @click.prevent="isTaskTitleEditMode()"><span class="dashicons dashicons-edit cpm-task-title-activity" title="<?php _e( 'Edit Task Title', 'cpm' ); ?>"></span></a> -->
                                            </div>
                                            <div class="clearfix cpm-clear"></div>
                                        </span>

                                        <div class="clearfix cpm-clear"></div>
                                    </h3>
                                    
                                    <div  class="cpm-task-meta">
                                        <span  class="cpm-assigned-user-wrap">
                                            <span v-if="task_assign.length" class='cpm-assigned-user' 
                                                @click.prevent="isEnableMultiSelect()"
                                                v-for="user in getUsers( task.assigned_to )" 
                                                v-html="user.user_url">

                                            </span>
                                            <span v-if="!task_assign.length" class='cpm-assigned-user' 
                                                @click.prevent="isEnableMultiSelect()"
                                                >
                                                <i style="font-size: 20px;" class="fa fa-user" aria-hidden="true"></i>
                                            </span>
    
    <div v-if="task_assign.length && is_enable_multi_select" @click.prevent="afterSelect" class="cpm-multiselect cpm-multiselect-single-task">

        <multiselect 
            v-model="task_assign" 
            :options="project_users" 
            :multiple="true" 
            :close-on-select="false"
            :clear-on-select="true"
            :hide-selected="false"
            :show-labels="true"
            placeholder="<?php _e( 'Select User', 'cpm' ); ?>"
            select-label=""
            selected-label="selected"
            deselect-label=""
            :taggable="true"
            label="name"
            track-by="id"
            :allow-empty="true">

            <template  slot="option" scope="props">
                <div>
                    <img height="16" width="16" class="option__image" :src="props.option.img" alt="<?php _e( 'No Man’s Sky', 'cpm' ); ?>">
                    <div class="option__desc">
                        <span class="option__title">{{ props.option.title }}</span>
                        <!-- <span class="option__small">{{ props.option.desc }}</span> -->
                    </div>
                </div>
            </template>
                
        </multiselect>               
    </div>

                                        </span>


                                        <span v-if="(task.start_date != '' || task.due_date != '')" class="cpm-task-date-wrap cpm-date-window">
                                            <span 
                                                @click.prevent="isTaskDateEditMode()"
                                                v-bind:class="task.completed ? completedTaskWrap(task.start_date, task.due_date) : taskDateWrap( task.start_date, task.due_date)">
                                                <span v-if="task_start_field">
                                                    <!-- <span class="dashicons cpm-date-edit-btn dashicons-edit" title="<?php _e( 'Edit Task Description', 'cpm' ); ?>"></span> -->
                                                    {{ dateFormat( task.start_date ) }}
                                                </span>

                                                <span v-if="isBetweenDate( task_start_field, task.start_date, task.due_date )">&ndash;</span>
                                                <span>
                                                    <!-- <span class="dashicons cpm-date-edit-btn dashicons-edit" title="<?php _e( 'Edit Task Description', 'cpm' ); ?>"></span> -->
                                                    {{ dateFormat( task.due_date ) }}
                                                </span>

                                            </span>

                                            <div class="cpm-date-update-wrap" v-if="is_task_date_edit_mode">
                                                <div v-if="task_start_field" v-cpm-datepicker class="cpm-date-picker-from cpm-inline-date-picker-from"></div>
                                                <div v-cpm-datepicker class="cpm-date-picker-to cpm-inline-date-picker-to"></div>
                                                <div class="clearfix cpm-clear"></div>
                                            </div>

                                            
                                        </span>

                                        <span v-if="(task.start_date == '' && task.due_date == '')" class="cpm-task-date-wrap cpm-date-window">
                                            <span 
                                                @click.prevent="isTaskDateEditMode()"
                                                v-bind:class="task.completed ? completedTaskWrap(task.start_date, task.due_date) : taskDateWrap( task.start_date, task.due_date)">
                                                <span>
                                                    <!-- <span class="dashicons cpm-date-edit-btn dashicons-edit" title="<?php _e( 'Edit Task Description', 'cpm' ); ?>"></span> -->
                                                    <i style="font-size: 20px;" class="fa fa-calendar" aria-hidden="true"></i>
                                                </span>

            

                                            </span>

                                            <div class="cpm-date-update-wrap" v-if="is_task_date_edit_mode">
                                                <div v-if="task_start_field" v-cpm-datepicker class="cpm-date-picker-from cpm-inline-date-picker-from"></div>
                                                <div v-cpm-datepicker class="cpm-date-picker-to cpm-inline-date-picker-to"></div>
                                                <div class="clearfix cpm-clear"></div>
                                            </div>

                                            
                                        </span>

                                        <span class="cpm-task-comment-count">{{ task.comments.length }} <?php _e( 'Comments', 'cpm' ); ?></span>
                                    </div>
                                </div>


                                <div  class="task-details">
                                                
                                    <!--v-if-->
                                    
                                    <p class="cpm-des-area cpm-desc-content" v-if="!is_task_details_edit_mode" @click.prevent="isTaskDetailsEditMode()">
                                        <span v-if="!task.post_content == ''" v-html="task.post_content"></span>
                                        <span style="margin-left: -3px;" v-if="task.post_content == ''"><i style="font-size: 16px;"  class="fa fa-pencil" aria-hidden="true"></i>&nbsp;&nbsp<?php _e( 'Update Description', 'cpm' ); ?></span>

                                    </p>
                                                                        <!-- @keyup.enter="updateTaskElement(task)" -->
                                    <textarea 
                                        v-prevent-line-break
                                        @blur="updateDescription(task, $event)" 
                                        @keyup.enter="updateDescription(task, $event)"
                                        class="cpm-des-area cpm-desc-field" 
                                        v-if="is_task_details_edit_mode"
                                        v-model="task.post_content">
                                            
                                        </textarea>
                                    <div v-if="is_task_details_edit_mode" class="cpm-help-text"><span><?php _e('Shift+Enter for line break', 'cpm'); ?></span></div>

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


