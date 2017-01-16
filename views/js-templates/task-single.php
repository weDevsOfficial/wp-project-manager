<div v-if="task_id">
<pre>{{task | json}}</pre>
    <div class="modal-mask half-modal cpm-task-modal"  transition="modal">
        <div class="modal-wrapper" @click.prevent="closeTaskModal" >
            <div class="modal-container"  :style="modalwide">
                <span class="close-vue-modal"><a class=""  @click=""><span class="dashicons dashicons-no"></span></a></span>

                <div class="modal-body cpm-todolists " @click.stop=""   >
                    <div class="cpm-col-12 cpm-todo " >
                        <div class="cpm-modal-conetnt  ">
                            <h3>
                                <input class="" type="checkbox" v-model="task.completed" checked="{{task.completed==1}}" @click.prevent="checktoggeltask(task, list)">
                                {{task.post_title}}
                            </h3>

                            <div class="task-details ">

                                <p>{{{ task.post_content }}}</p>

                                <span class="cpm-lock" v-show="task.task_privacy">{{text.privet_task}}</span>
                                <span> <?php do_action( 'cpm_task_extra_partial' ); ?> </span>

                                <span  v-if="task.completed==0">
                                    <user_show_list
                                        :users="task.assigned_to"
                                        ></user_show_list>
                                    <span class="{{task.date_css_class}}"> {{{task.date_show}}} </span>

                                </span>

                                <span class="">{{task.comment_count}} {{task.comment_count | pluralize  text.comment }} </span>


                                <div class="clearfix cpm-clear"></div>
                            </div>
                            <hr/>

                            <div class="cpm-todo-wrap clearfix">
                                <div class="cpm-todo-content" >

                                    <!-- <partial name="hook_cpm_task_single_after"></partial> -->
                                    <?php do_action( 'hook_cpm_task_single_after' ); ?>
                                </div>

                                <comment_warp_task :task="task""></comment_warp_task>
                            </div>
                            
                        </div>
                        <div class="clearfix"></div>
                    </div>
                </div>
                <div class="clearfix" ></div>
            </div>

        </div>
    </div> 
</div>


