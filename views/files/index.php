<?php
cpm_get_header( __( 'Files', 'cpm' ), $project_id );

$args = array(
    'post_type' => 'attachment',
    'meta_key' => '_project',
    'meta_value' => $project_id,
    'numberposts' => -1,
);

$attachments = get_posts( $args );
$base_image_url = admin_url('admin-ajax.php?action=cpm_file_get');

if ( $attachments ) {

    echo '<ul class="cpm-files">';
    foreach ($attachments as $attachment) {

        $file = CPM_Comment::getInstance()->get_file( $attachment->ID );
        $topic_url = '#';

        if ( !$attachment->post_parent ) {
            $parent_id = get_post_meta( $attachment->ID, '_parent', true );
            $parent = get_post( $parent_id );
        } else {
            $parent = get_post( $attachment->post_parent );
        }

        $post_type_object = get_post_type_object( $parent->post_type );

        if ( $parent->post_type == 'task' ) {
            $task_list = get_post( $parent->post_parent );
            $topic_url = cpm_url_single_task( $project_id, $task_list->ID, $parent->ID );
        } else if ( $parent->post_type == 'task_list' ) {
            $topic_url = cpm_url_single_tasklist( $project_id, $parent->ID );
        } else if ( $parent->post_type == 'message' ) {
            $topic_url = cpm_url_single_message( $project_id, $parent->ID );
        }

        $file_url = sprintf( '%s&file_id=%d&project_id=%d', $base_image_url, $file['id'], $project_id );

        if ( $file['type'] == 'image' ) {
            $thumb_url = sprintf( '%s&file_id=%d&project_id=%d&type=thumb', $base_image_url, $file['id'], $project_id );
        } else {
            $thumb_url = $file['thumb'];
        }
        ?>
        <li>
            <div class="cpm-thumb">
                <a href="<?php echo $file_url; ?>"><img src="<?php echo $thumb_url; ?>" alt="<?php echo esc_attr( $file['name'] ); ?>" /></a>
            </div>
            <div class="cpm-thumb-detail">
                <h3 class="cpm-file-name"><?php echo $file['name']; ?></h3>

                <div class="cpm-file-meta">
                    <?php printf( __( 'Attached to <a href="%s">%s</a> by %s', 'cpm' ), $topic_url, strtolower( $post_type_object->labels->singular_name ), cpm_url_user( $attachment->post_author ) ) ?>
                </div>

                <div class="cpm-file-action">
                    <?php printf( __( '<a href="%s">Download</a> or go to the <a href="%s">discussion</a>.', 'cpm' ), $file_url, $topic_url ); ?>
                    <?php if ( $parent->comment_count ) { ?>
                        <span class="comment-number">
                            <?php printf( _n( '%d comment', '%d comments', get_comments_number( $parent->ID ), 'cpm' ), get_comments_number( $parent->ID ) ); ?>
                        </span>
                    <?php } ?>
                </div>
            </div>
        </li>

        <?php
    }
    echo '</ul>';
} else {
    cpm_show_message( __( 'No Files Found!', 'cpm' ) );
}