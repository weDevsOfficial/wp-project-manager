 <div>
    <ul class="cpm-todos cpm-todolist-content cpm-incomplete-task">
        <li class="cpm-todo" v-for="(task, task_index) in getIncompleteTasks" :key="task.ID" :class="'cpm-fade-out-'+task.ID">

            <div class="cpm-todo-wrap clearfix">
                <div class="cpm-todo-content" >
                    <div>
                        <div class="cpm-col-7">
                            <!-- <span class="cpm-spinner"></span> -->
                            <input v-model="task.completed" @click="taskDoneUndone( task.ID, task.completed )" class="" type="checkbox"  value="" name="" >

                            <a class="task-title" href="#">
                                <span @click.prevent="singleTask( task )" class="cpm-todo-text">{{ task.post_title }} </span>
                                <span :class="privateClass( task )"></span>
                            </a>
                            
                            <span class='cpm-assigned-user' 
                                v-for="user in getUsers( task.assigned_to )" 
                                v-html="user.user_url">

                            </span>

                            <span :class="taskDateWrap( task.start_date, task.due_date )">
                                <span v-if="task_start_field">{{ dateFormat( task.start_date ) }}</span>
                                <span v-if="isBetweenDate( task_start_field, task.start_date, task.due_date )">&ndash;</span>
                                <span>{{ dateFormat( task.due_date ) }}</span>
                            </span>
                        </div>

                        <div class="cpm-col-4">
                            <a @click.prevent="singleTask( task )" href="#">
                            <span class="cpm-comment-count">
                                {{ task.comments.length }}
                            </span>
                            </a>
                            <!-- deprecated -->
                            <?php do_action( 'cpm_task_column' ); ?>

                            <?php do_action( 'cpm_after_task_title' ); ?>
                        </div>


                        <div class="cpm-col-1 cpm-todo-action-right cpm-last-col">
                            <?php if ( true ) { ?>
                                <!-- <a class="move"><span class="dashicons dashicons-menu"></span></a> -->
                                <a href="#" @click.prevent="deleteTask( task.post_parent, task.ID )" class="cpm-todo-delete"><span class="dashicons dashicons-trash"></span></a>
                                <?php if ( true ) { ?>
                                    <a href="#" @click.prevent="taskEdit( task.ID )" class="cpm-todo-edit"><span class="dashicons dashicons-edit"></span></a>
                                <?php } ?>
                            <?php } ?>
                        </div>
                        <div class="clearfix"></div>
                    </div>

                    <div class="cpm-col-12">

                        <?php if ( true ) { ?>
                            <div class="cpm-todo-details">
                                
                            </div>
                        <?php } ?>

                        <?php do_action( 'cpm_task_single_after' ); ?>
                    </div>
                </div>
                <div class="cpm-todo-form" v-if="task.edit_mode">
                    <new-task-form :task="task" :task_index="task_index" :list="list" :list_index="index"></new-task-form>
                </div>
            </div>
        </li>

        <li v-if="!taskLength"><?php _e( 'No task found!', 'cpm'); ?></li>

        <li v-if="list.show_task_form" class="cpm-todo-form">
            <new-task-form :task="{}" :task_index="task_index" :list="list" :list_index="index"></new-task-form>
        </li>
    </ul>

    <ul v-if="is_single_list" class="cpm-todos cpm-todolist-content cpm-todo-completed">
        <li class="cpm-todo" v-for="(task, task_index) in getCompletedTask">
            
            <div class="cpm-todo-wrap clearfix">
                <div class="cpm-todo-content" >
                    <div>
                        <div class="cpm-col-7">
                            <!-- <span class="cpm-spinner"></span> -->
                            <input v-model="task.completed" @click="taskDoneUndone( task.ID, task.completed, task_index )" class="" type="checkbox"  value="" name="" >

                            <a class="task-title" href="#">
                                <span class="cpm-todo-text">{{ task.post_title }}</span>
                                <span :class="privateClass( task )"></span>
                            </a>
                            
                            <span class='cpm-assigned-user' 
                                v-for="user in getUsers( task.assigned_to )" 
                                v-html="user.user_url">

                            </span>

                            <span :class="taskDateWrap( task.start_date, task.due_date )">
                                <span v-if="task_start_field">{{ dateFormat( task.start_date ) }}</span>
                                <span v-if="isBetweenDate( task_start_field, task.start_date, task.due_date )">&ndash;</span>
                                <span>{{ dateFormat( task.due_date ) }}</span>
                            </span>
                        </div>

                        <div class="cpm-col-4">
                            
                            <span class="cpm-comment-count">
                                <a href="#">
                                    {{ task.comment_count }}
                                </a>
                            </span>

                            <?php do_action( 'cpm_task_column' ); ?>
                        </div>


                        <div class="cpm-col-1 cpm-todo-action-right cpm-last-col">
                            <?php if ( true ) { ?>
                                <!-- <a class="move"><span class="dashicons dashicons-menu"></span></a> -->
                                <a href="#" class="cpm-todo-delete"><span class="dashicons dashicons-trash"></span></a>
                                <?php if ( true ) { ?>
                                    <a href="#" @click.prevent="taskEdit( task.ID )" class="cpm-todo-edit"><span class="dashicons dashicons-edit"></span></a>
                                <?php } ?>
                            <?php } ?>
                        </div>
                        <div class="clearfix"></div>
                    </div>

                    <div class="cpm-col-12">

                        <?php if ( true ) { ?>
                            <div class="cpm-todo-details">
                                
                            </div>
                        <?php } ?>

                        <?php do_action( 'cpm_task_single_after' ); ?>
                    </div>
                </div>
                <div class="cpm-todo-form" v-if="task.edit_mode">
                    <new-task-form :task="task" :task_index="task_index" :list="list" :list_index="index"></new-task-form>
                </div>
            </div>
        </li>
    </ul>
</div>





