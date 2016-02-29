<?php
/**
 * Project dashboard page
 */
cpm_get_header( __( 'Activities', 'cpm' ), $project_id );
?>

<ul class="cpm_activity_list">
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
