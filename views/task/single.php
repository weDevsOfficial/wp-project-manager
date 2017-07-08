<div>
    <ul class="cpm-todolists">
        <pre>{{ list }}</pre>
            <li id="cpm-list">
                <?php //echo cpm_task_list_html( $list, $project_id, true ); ?>
            </li>
        
    </ul>

    <h3 class="cpm-comment-title"><?php _e( 'Discuss this task list', 'cpm' ); ?></h3>

    <ul class="cpm-comment-wrap">
        <?php

        // $comments = $task_obj->get_comments( $tasklist_id );
        // if ( $comments ) {

        //     $count = 0;
        //     foreach ($comments as $comment) {
        //        $class = ( $count % 2 == 0 ) ? 'even' : 'odd';
        //         echo cpm_show_comment( $comment, $project_id, $class );

        //         $count++;
        //     }
        // }
        ?>
    </ul>
    <div class="single-todo-comments">
    <?php //echo cpm_comment_form( $project_id, $tasklist_id ); ?>
    </div>
</div>

 