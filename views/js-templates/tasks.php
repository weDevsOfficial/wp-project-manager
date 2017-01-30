 <div>
    <ul class="cpm-todos cpm-todolist-content">
        <li class="cpm-todo" v-for="(task, task_index) in tasks">
            <!-- <pre>{{ task_start_field }}</pre> -->
            <div class="cpm-todo-wrap clearfix">
                <div class="cpm-todo-content" >
                    <div>
                        <div class="cpm-col-7">
                            <!-- <span class="cpm-spinner"></span> -->
                            <input class="" type="checkbox"  value="" name="" >

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
                            <?php if ( true ) { ?>

                                <span class="cpm-comment-count">
                                    <a href="#">
                                        7
                                    </a>
                                </span>

                            <?php } ?>

                            <?php do_action( 'cpm_task_column' ); ?>
                        </div>


                        <div class="cpm-col-1 cpm-todo-action-right cpm-last-col">
                            <?php if ( true ) { ?>
                                <a class="move"><span class="dashicons dashicons-menu"></span></a>
                                <a href="#" class="cpm-todo-delete"><span class="dashicons dashicons-trash"></span></a>
                                <?php if ( true ) { ?>
                                    <a href="#" @click.prevent="taskEdit( task_index )" class="cpm-todo-edit"><span class="dashicons dashicons-edit"></span></a>
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

    <footer class="cpm-row cpm-list-footer">
        <div class="cpm-col-6">
            
                <new-task-button :task="task" :list="list" :list_index="index"></new-task-button>
            
            <div class="cpm-col-3 cpm-todo-complete">
                <a href="#">
                    <span>9 </span>
                    <?php _e( 'Completed', 'cpm' ) ?>
                </a>
            </div>
            <div class="cpm-col-3 cpm-todo-incomplete">
                <a href="#">
                    <span>9</span>
                    <?php _e( 'Incomplete', 'cpm' ) ?>
                </a>
            </div>
            <div class="cpm-col-3 cpm-todo-comment">
                <a href="#">
                    <?php if ( true ) { ?>
                        <?php printf( _n( __( '<span>1</span> Comment', 'cpm' ), __( '<span>%d</span> Comments', 'cpm' ), 4, 'cpm' ), 5 ); ?>
                        <?php
                    } else {
                        printf( "<span>0 %s</span>", __( 'Comment', 'cpm' ) );
                    }
                    ?>
                </a>
            </div>
        </div>

        <div class="cpm-col-4 cpm-todo-prgress-bar">
            
        </div>
        <div class=" cpm-col-1 no-percent"> 2%  </div>
        <div class="clearfix"></div>
    </footer>
</div>


