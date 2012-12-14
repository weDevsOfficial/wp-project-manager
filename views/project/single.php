<?php
/**
 * Project dashboard page
 */
cpm_get_header( __( 'Activity', 'cpm' ), $project_id );
?>
<h3 class="cpm-nav-title">
    <?php _e( 'Project Activity', 'wedevs' ); ?>

    <?php if ( current_user_can( 'delete_others_posts' ) ) { //editor ?>
        <span class="cpm-right">
            <a href="#" class="cpm-icon-delete cpm-project-delete-link" title="<?php esc_attr_e( 'Delete project', 'cpm' ); ?>" <?php cpm_data_attr( array('confirm' => 'Are you sure to delete this project', 'project_id' => $project_id) ) ?>>
                <span><?php _e( 'Delete', 'cpm' ); ?></span>
            </a>
        </span>
    <?php } ?>
</h3>

<ul class="cpm-activity dash">
    <?php
    $activities = CPM_Comment::getInstance()->get_comments( $project_id, 'DESC' );

    if ( $activities ) {
        foreach ($activities as $activity) {
            ?>
            <li>
                <?php echo do_shortcode( $activity->comment_content ); ?> <span class="date">- <?php echo cpm_get_date( $activity->comment_date, true ); ?></span>
            </li>
            <?php
        }
    }
    ?>
</ul>