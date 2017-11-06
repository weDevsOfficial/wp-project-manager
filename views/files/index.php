<?php cpm_get_header( __( 'Files', 'cpm' ), $project_id ); ?>


<?php
// do_action( 'cpm_show_file_before', $project_id );
$args = array(
    'post_type'   => 'attachment',
    'meta_key'    => '_project',
    'meta_value'  => $project_id,
    'numberposts' => -1,
);

$attachments    = get_posts( $args );
$base_image_url = admin_url( 'admin-ajax.php?action=cpm_file_get' );

if ( $attachments ) {
    echo '<div class="cpm-files-page">';
    echo '<ul class="cpm-files">';

    foreach ( $attachments as $attachment ) {
        $file      = CPM_Comment::getInstance()->get_file( $attachment->ID );
        $topic_url = '#';

        if ( ! $attachment->post_parent ) {
            $parent_id = get_post_meta( $attachment->ID, '_parent', true );
            $parent    = get_post( $parent_id );
        } else {
            $parent = get_post( $attachment->post_parent );
        }

        $post_type_object = get_post_type_object( $parent->post_type );

        if ( 'cpm_task' == $parent->post_type ) {
            $is_private = get_post_meta( $attachment->post_parent, '_task_privacy', true );

            if ( ! cpm_user_can_access_file( $project_id, 'todo_view_private', $is_private ) ) {
                continue;
            }

            $task_list = get_post( $parent->post_parent );
            $topic_url = cpm_url_single_task( $project_id, $task_list->ID, $parent->ID );
        } else if ( 'cpm_task_list' == $parent->post_type ) {
            $is_private = get_post_meta( $attachment->post_parent, '_tasklist_privacy', true );

            if ( ! cpm_user_can_access_file( $project_id, 'todolist_view_private', $is_private ) ) {
                continue;
            }

            $topic_url = cpm_url_single_tasklist( $project_id, $parent->ID );
        } else if ( $parent->post_type == 'cpm_message' ) {
            $is_private = get_post_meta( $attachment->post_parent, '_message_privacy', true );

            if ( ! cpm_user_can_access_file( $project_id, 'msg_view_private', $is_private ) ) {
                continue;
            }

            $topic_url = cpm_url_single_message( $project_id, $parent->ID );
        }

        $file_url = sprintf( '%s&file_id=%d&project_id=%d', $base_image_url, $file['id'], $project_id );

        if ( $file['type'] == 'image' ) {
            $thumb_url = sprintf( '%s&file_id=%d&project_id=%d&type=thumb', $base_image_url, $file['id'], $project_id );
            $class     = 'cpm-colorbox-img';
        } else {
            $thumb_url = $file['thumb'];
            $class     = '';
        }
        $thumb_url = apply_filters( 'cpm_attachment_url_thum', $thumb_url, $project_id, $file['id'] );
        $file_url  = apply_filters( 'cpm_attachment_url', $file_url, $project_id, $file['id'] );
        ?>
        <li>
            <div class="cpm-thumb">
                <a class="<?php echo $class; ?>" title="<?php echo esc_attr( $file['name'] ); ?>" href="<?php echo $file_url; ?>"><img src="<?php echo $thumb_url; ?>" alt="<?php echo esc_attr( $file['name'] ); ?>" /></a>
            </div>
            <div class="">
                <h3 class="cpm-file-name"><?php echo $file['name']; ?></h3>

                <div class="cpm-file-meta">
                    <?php printf( __( 'Attached to <a href="%s">%s</a> by %s', 'cpm' ), $topic_url, strtolower( $post_type_object->labels->singular_name ), cpm_url_user( $attachment->post_author ) ) ?>
                </div>

                <div class="cpm-file-action">
                    <ul>
                        <li class="cpm-go-discussion"> <a href="<?php echo esc_url( $topic_url ) ?>"></a> </li>
                        <li class="cpm-download-file"> <a href="<?php echo $file_url ?>" download> </a> </li>
                        <li class="cpm-comments-count"> <span >  </span> <div class="cpm-btn cpm-btn-blue cpm-comment-count"> <?php echo get_comments_number( $parent->ID ) ?></div></li>
                    </ul>
                </div>
            </div>
        </li>

        <?php
    }
    echo '</ul> </div>';
}

if ( empty( $attachments ) ) {
    cpm_blank_template( 'files', $project_id );
}
?>

