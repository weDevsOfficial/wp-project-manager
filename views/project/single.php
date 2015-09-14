<?php
/**
 * Project dashboard page
 */
cpm_get_header( __( 'Activity', 'cpm' ), $project_id );
?>
<h3 class="cpm-nav-title">
    <?php
    _e( 'Project Activity', 'cpm' );

    if ( cpm_user_can_access( $project_id ) ) {
        cpm_project_actions( $project_id );
    }
    ?>
</h3>

<ul class="cpm-activity dash">
    <?php
    $count = get_comment_count( $project_id );
    $activities = CPM_project::getInstance()->get_activity( $project_id, array() );

    if ( $activities ) {
        echo cpm_activity_html( $activities );
    }
    ?>
</ul>

<?php if ( $count['approved'] > count( $activities ) ) { ?>
    <a href="#" <?php cpm_data_attr( array('project_id' => $project_id, 'start' => count( $activities ) + 1, 'total' => $count['approved']) ); ?> class="button cpm-load-more"><?php _e( 'Load More...', 'cpm' ); ?></a>
<?php } ?>