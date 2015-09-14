<?php
$task_obj = CPM_Task::getInstance();
$list = $task_obj->get_task_list( $tasklist_id );

if( $list->private == 'yes' && ! cpm_user_can_access( $project_id, 'tdolist_view_private' ) ) {
    echo '<h2>' . __( 'You do no have permission to access this page', 'cpm' ) . '</h2>';
    return;
}

cpm_get_header( __( 'To-do List', 'cpm' ), $project_id );


?>
<h3 class="cpm-nav-title">
    <a href="<?php echo cpm_url_tasklist_index( $project_id ); ?>"><?php _e( '&larr; back', 'cpm' ); ?></a>
    <span class="sep">|</span>
    <?php _e( 'To-do List', 'cpm' ) ?> : <?php echo get_the_title( $list->ID ); ?>
</h3>

<ul class="cpm-todolists">
    <?php if ( $list ) { ?>
        <li id="cpm-list-<?php echo $list->ID; ?>"><?php echo cpm_task_list_html( $list, $project_id ); ?></li>
    <?php } ?>
</ul>

<h3 class="cpm-comment-title"><?php _e( 'Discuss this to-do list', 'cpm' ); ?></h3>

<ul class="cpm-comment-wrap">
    <?php
    
    $comments = $task_obj->get_comments( $tasklist_id );
    if ( $comments ) {

        $count = 0;
        foreach ($comments as $comment) {
            $class = ( $count % 2 == 0 ) ? 'even' : 'odd';
            echo cpm_show_comment( $comment, $project_id, $class );

            $count++;
        }
    }
    ?>
</ul>
<?php echo cpm_comment_form( $project_id, $tasklist_id ); ?>