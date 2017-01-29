 <div>
    <ul class="cpm-todos cpm-todolist-content">
        <li class="cpm-todo" v-for="(task, task_index) in tasks">
            
            <div class="cpm-todo-wrap clearfix">
                <div class="cpm-todo-content" >
                    <div>
                        <div class="cpm-col-7">
                            <!-- <span class="cpm-spinner"></span> -->
                            <input class="" type="checkbox"  value="" name="" >

                            <?php if ( true ) { ?>
                                <span class="cpm-todo-text">{{ task.post_title }}</span>
                                <span class="lskdfg"></span>
                                <?php
                            } else {
                                if ( true ) {
                                    ?>
                                    <a class="task-title" href="#">
                                        <span class="cpm-todo-text">sdflksdlfkg</span>
                                        <span class=""></span>
                                    </a>
                                <?php } else {
                                    ?>
                                    <span class="cpm-todo-text">ergkldkfsndkf</span>
                                    <span class="ergw"></span>
                                    <?php
                                }
                            }
                            ?>

                            
                                <span class="cpm-completed-by">
                                    sdsfh
                                </span>
                           
                                <span class="lkjlkjl">
                                 kjkjkjlkjl
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
                                content
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
            <new-task-form :task="task" :task_index="task_index" :list="list" :list_index="index"></new-task-form>
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


